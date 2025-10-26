from flask import Flask, Response, send_from_directory, jsonify
from pathlib import Path
from camera import Camera

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")

camera = Camera()
latest_stress = 0.0  # store the latest stress value

def gen_frames():
    global latest_stress
    while True:
        frame, stress = camera.get_frame()
        latest_stress = stress
        if frame is None:
            continue
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# ✅ Correctly defined /stress endpoint at top level
@app.route('/stress')
def stress():
    global latest_stress
    return jsonify({"stress": int(latest_stress * 100)})

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

current_mode = "idle"
study_seconds = 0
break_seconds = 0
is_monitoring = False

@app.route('/session')
def session_status():
    return jsonify({
        "mode": current_mode,
        "is_monitoring": is_monitoring,
        "study_seconds": study_seconds,
        "break_seconds": break_seconds
    })
