from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load trained model
model = joblib.load("model.pkl")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():

    try:
        # Receive JSON data from script.js
        data = request.get_json()

        input_data = np.array([[
            float(data["age"]),
            float(data["sex"]),
            float(data["cp"]),
            float(data["trestbps"]),
            float(data["chol"]),
            float(data["fbs"]),
            float(data["restecg"]),
            float(data["thalach"]),
            float(data["exang"]),
            float(data["oldpeak"]),
            float(data["slope"]),
            float(data["ca"]),
            float(data["thal"])
        ]])

        # Predict
        prediction = int(model.predict(input_data)[0])

        # Probability of class 1
        probability = float(model.predict_proba(input_data)[0][1])

        # Debug (optional)
        print("Received Data:", data)
        print("Prediction:", prediction)
        print("Probability:", probability)

        return jsonify({
            "prediction": prediction,
            "probability": round(probability * 100, 2)
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({
            "error": str(e)
        }), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)