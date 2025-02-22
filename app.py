from flask import Flask, request, jsonify, render_template
from google import genai
from google.genai import types
from dotenv import load_dotenv

import os

load_dotenv()

GOOGLE_CLOUD_PROJECT = os.environ.get("GOOGLE_CLOUD_PROJECT")
GOOGLE_CLOUD_LOCATION = os.environ.get("GOOGLE_CLOUD_LOCATION")

app = Flask(__name__, template_folder="templates", static_folder="static")

# Initialize Vertex AI Client
client = genai.Client(
    vertexai=True, project=GOOGLE_CLOUD_PROJECT, location=GOOGLE_CLOUD_LOCATION
)


# Route for rendering the main page
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/analyzer", methods=["GET", "POST"])
def analyzer_page():
    return render_template("analyzer.html")


# Summarize Endpoint
@app.route("/summarize", methods=["POST"])
def summarize_text():
    text = request.json.get("text", "")
    response = client.models.generate_content(
        model="gemini-2.0-flash-001",
        contents=text,
        config=types.GenerateContentConfig(
            system_instruction="Summarize the provided text.", max_output_tokens=100
        ),
    )
    return jsonify({"summary": response.text})


# # Extract Key Points Endpoint
@app.route("/extract-key-points", methods=["POST"])
def extract_key_points():
    text = request.json.get("text", "")
    response = client.models.generate_content(
        model="gemini-2.0-flash-001",
        contents=text,
        config=types.GenerateContentConfig(
            system_instruction="Extract key points from the provided text.",
            max_output_tokens=150,
        ),
    )
    return jsonify({"key_points": response.text})


# # Analyze Endpoint
@app.route("/analyze", methods=["POST"])
def analyze_text():
    text = request.json.get("text", "")
    response = client.models.generate_content(
        model="gemini-2.0-flash-001",
        contents=text,
        config=types.GenerateContentConfig(
            system_instruction="Provide an in-depth analysis of the provided text.",
            max_output_tokens=200,
        ),
    )
    return jsonify({"analysis": response.text})


if __name__ == "__main__":
    app.run(debug=True, port=8080, host="0.0.0.0")
