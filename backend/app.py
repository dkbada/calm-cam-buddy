from flask import Flask, Response, send_from_directory
from pathlib import Path
from camera import Camera  # your updated Camera class

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")

# Only use the Camera class
camera = Camera()

def gen_frames():
    while True:
        frame, stress = camera.get_frame()  # get_frame returns overlay + smoothed stress
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

