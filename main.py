from flask import Flask, render_template

app = Flask(__name__)

@app.route('/playlist')
def index():
    return render_template('playlist.html')

if __name__ == '__main__':
    app.run(debug=True)
