from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os

app = Flask(__name__)
CORS(app)

# --- LOAD ARTIFACTS ---
try:
    print("Loading model artifacts...")
    model = joblib.load('attrition_model.pkl')
    scaler = joblib.load('scaler.pkl')
    top_features = joblib.load('top_features.pkl')
    feature_means = joblib.load('feature_means.pkl')
    top_features = list(top_features)  # Ensure list format
    print("Artifacts loaded successfully.")
except Exception as e:
    print(f"Error loading artifacts: {e}")
    print("Make sure you have trained the model first!")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Prepare input with defaults
        input_data = {
            'Age': float(data.get('Age', 30)),
            'Gender': data.get('Gender', 'Male'),
            'Department': data.get('Department', 'Sales'),
            'JobRole': data.get('JobRole', 'Sales Executive'),
            'MonthlyIncome': float(data.get('MonthlyIncome', 5000)),
            'MaritalStatus': data.get('MaritalStatus', 'Single'),
            'OverTime': data.get('OverTime', 'No'),
            'JobSatisfaction': float(data.get('JobSatisfaction', 3)),
            'WorkLifeBalance': float(data.get('WorkLifeBalance', 3)),
            'YearsAtCompany': float(data.get('YearsAtCompany', 5))
        }

        raw_df = pd.DataFrame([input_data])

        # One-hot encode user input
        encoded_df = pd.get_dummies(raw_df)

        # Initialize full feature row with means
        final_input = pd.DataFrame([feature_means])

        # Update matched categorical encodings
        for col in encoded_df.columns:
            if col in final_input.columns:
                final_input.at[0, col] = encoded_df.at[0, col]

        # Update numeric fields directly
        for col, val in input_data.items():
            if col in final_input.columns:
                final_input.at[0, col] = val

        # Ensure correct column ordering and missing columns auto-filled
        for col in top_features:
            if col not in final_input.columns:
                final_input[col] = 0
        
        final_input = final_input[top_features]

        # Scale input
        final_scaled = scaler.transform(final_input)

        # Predict
        prediction = model.predict(final_scaled)[0]
        probability = model.predict_proba(final_scaled)[0][1]

        return jsonify({
            "attrition_prediction": "Yes" if int(prediction) == 1 else "No",
            "risk_score": float(round(probability * 100, 2)),
            "status": "success"
        })

    except Exception as e:
        print("Prediction Error:", str(e))
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
