import os
import openai
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Set your default OpenAI API key here or via an environment variable.
openai.api_key = os.getenv("OPENAI_API_KEY", "YOUR_DEFAULT_API_KEY")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/tutor', methods=['POST'])
def tutor():
    data = request.get_json()
    prompt = data.get("prompt", "")
    custom_key = data.get("api_key", None)

    # Override the API key if one is provided from the front end.
    if custom_key:
        openai.api_key = custom_key

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a friendly Python tutor for kids. Explain concepts in a simple, playful way."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=150
        )
        answer = response["choices"][0]["message"]["content"].strip()
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
