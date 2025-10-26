import cv2

class Camera:
    def __init__(self):
        self.cap = cv2.VideoCapture(0)  # Pi webcam

    def get_frame(self):
        ret, frame = self.cap.read()
        if not ret:
            return None
        _, jpeg = cv2.imencode('.jpg', frame)
        return jpeg.tobytes()
