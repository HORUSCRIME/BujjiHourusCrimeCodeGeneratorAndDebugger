from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)  

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@app.route('/api/generate', methods=['POST'])
def generate_code():
    data = request.get_json()
    prompt = data.get('prompt', '')

    if not prompt.strip():
        return jsonify({'error': 'Prompt is required'}), 400

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

    payload = {
        "contents": [{
            "role": "user",
            "parts": [{"text": prompt}]
        }]
    }

    try:
        res = requests.post(url, json=payload)
        res.raise_for_status()
        result = res.json()
        response_text = result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        return jsonify({"response": response_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)




