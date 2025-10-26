import cv2
import numpy as np

# Sage green color (BGR)
SAGE_GREEN = (143, 188, 143)

class Camera:
    def __init__(self):
        self.cap = cv2.VideoCapture(0)
        # Load Haar cascades
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
        self.mouth_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')

    def get_frame(self):
        ret, frame = self.cap.read()
        if not ret:
            return None, 0.0

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=4)

        stress_level = 0.0

        # Only process the first detected face to improve speed
        if len(faces) > 0:
            x, y, w, h = faces[0]
            face_gray = gray[y:y+h, x:x+w]

            # Detect eyes and mouth
            eyes = self.eye_cascade.detectMultiScale(face_gray, scaleFactor=1.1, minNeighbors=4)
            mouths = self.mouth_cascade.detectMultiScale(face_gray, scaleFactor=1.5, minNeighbors=15)

            # Stress heuristic
            eye_factor = max(0, 2 - len(eyes)) / 2.0  # 0 if 2 eyes, 1 if 0 eyes
            mouth_factor = 1.0 if len(mouths) == 0 else 0.0
            stress_level = np.clip((eye_factor + mouth_factor) / 2.0, 0, 1)

            # Draw rectangle in sage green
            cv2.rectangle(frame, (x, y), (x+w, y+h), SAGE_GREEN, 2)

            # Display stress in percentage
            cv2.putText(frame, f"Stress: {int(stress_level*100)}%", (x, y-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, SAGE_GREEN, 2)

        # Encode frame
        _, jpeg = cv2.imencode('.jpg', frame)
        return jpeg.tobytes(), stress_level

    def __del__(self):
        self.cap.release()

