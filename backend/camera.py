import cv2
import numpy as np
from collections import deque

class Camera:
    def __init__(self, smooth_window=5):
        self.cap = cv2.VideoCapture(0)
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
        self.mouth_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
        
        # Deque to store last N stress levels for smoothing
        self.smooth_window = smooth_window
        self.stress_history = deque(maxlen=smooth_window)

    def get_frame(self):
        ret, frame = self.cap.read()
        if not ret:
            return None, 0.0

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)

        stress_level = 0.0

        for (x, y, w, h) in faces:
            face_gray = gray[y:y+h, x:x+w]

            # Detect eyes and mouth
            eyes = self.eye_cascade.detectMultiScale(face_gray, scaleFactor=1.1, minNeighbors=5)
            mouths = self.mouth_cascade.detectMultiScale(face_gray, scaleFactor=1.7, minNeighbors=20)

            # Compute stress level heuristically
            eye_factor = max(0, 2 - len(eyes)) / 2.0  # 0 if 2 eyes, 1 if 0 eyes
            mouth_factor = 1.0 if len(mouths) == 0 else 0.0
            stress_level = np.clip((eye_factor + mouth_factor) / 2.0, 0, 1)

            # Draw rectangle and raw stress
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
            cv2.putText(frame, f"Stress: {stress_level:.2f}", (x, y-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)

        # Smooth stress level over last N frames
        self.stress_history.append(stress_level)
        smoothed_stress = np.mean(self.stress_history)

        # Overlay smoothed stress
        cv2.putText(frame, f"Smoothed Stress: {smoothed_stress:.2f}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

        _, jpeg = cv2.imencode('.jpg', frame)
        return jpeg.tobytes(), smoothed_stress

    def __del__(self):
        self.cap.release()
