from flask import Flask, Response, render_template, send_from_directory
import cv2
import os
from pathlib import Path

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")

camera = cv2.VideoCapture(0)

def gen_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = Path(app.static_folder)
    target_path = static_folder_path / path
    if path != "" and target_path.exists():
        return send_from_directory(static_folder_path, path)
    else:
        return send_from_directory(static_folder_path, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
from flask import Flask, Response, render_template, send_from_directory
from pathlib import Path
from camera import Camera  # import your updated Camera class with stress detection

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")

# Use your Camera class instead of raw cv2.VideoCapture
camera = Camera()

def gen_frames():
    while True:
        frame, stress = camera.get_frame()  # get_frame now returns overlay + stress
        if frame is None:
            continue
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = Path(app.static_folder)
    target_path = static_folder_path / path
    if path != "" and target_path.exists():
        return send_from_directory(static_folder_path, path)
    else:
        return send_from_directory(static_folder_path, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
