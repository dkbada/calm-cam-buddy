# app.py (add below your video_feed route)
from flask import jsonify

latest_stress = 0.0

def gen_frames():
    global latest_stress
    while True:
        frame, stress = camera.get_frame()
        latest_stress = stress  # update latest stress
        if frame is None:
            continue
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/stress')
def stress():
    global latest_stress
    return jsonify({"stress": int(latest_stress * 100)})
