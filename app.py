from flask import Flask, render_template, request, send_from_directory, jsonify
from tensorflow.keras.models import load_model
from keras.preprocessing.image import load_img, img_to_array
import numpy as np
import os
import json
import uuid
import traceback
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Load the trained model
model = load_model('models/model.h5')

# Load class mapping if it exists, otherwise use default
try:
    with open('class_mapping.json', 'r') as f:
        class_mapping = json.load(f)
    # Convert string keys to integers if needed
    class_mapping = {int(k) if k.isdigit() else k: v for k, v in class_mapping.items()}
except (FileNotFoundError, json.JSONDecodeError):
    # Default class mapping
    class_mapping = {0: 'glioma', 1: 'meningioma', 2: 'notumor', 3: 'pituitary'}

# Class labels
class_labels = ['glioma', 'meningioma', 'notumor', 'pituitary']

# Define the uploads folder
UPLOAD_FOLDER = './uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size

# Helper function to predict tumor type
def predict_tumor(image_path):
    IMAGE_SIZE = 128
    try:
        img = load_img(image_path, target_size=(IMAGE_SIZE, IMAGE_SIZE))
        img_array = img_to_array(img) / 255.0  # Normalize pixel values
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

        predictions = model.predict(img_array)
        predicted_class_index = np.argmax(predictions, axis=1)[0]
        confidence_score = np.max(predictions, axis=1)[0]
        
        # Get all class probabilities for the chart
        class_probabilities = predictions[0].tolist()
        
        result = {
            "class": class_labels[predicted_class_index],
            "confidence": float(confidence_score),
            "probabilities": {class_labels[i]: float(predictions[0][i]) for i in range(len(class_labels))}
        }
        
        return result
    except Exception as e:
        logger.error(f"Error in predict_tumor: {str(e)}")
        logger.error(traceback.format_exc())
        # Return a default result in case of error
        return {
            "class": "error",
            "confidence": 0.0,
            "probabilities": {label: 0.0 for label in class_labels},
            "error": str(e)
        }

# Route for the main page
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

# Route for about page
@app.route('/about')
def about():
    return render_template('about.html')

# Route for the dashboard
@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

# API endpoint for prediction
@app.route('/api/predict', methods=['POST'])
def api_predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        # Generate a unique filename to prevent overwriting
        filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
        file_location = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_location)
        
        logger.info(f"File saved to {file_location}")
        
        # Predict the tumor
        result = predict_tumor(file_location)
        
        # Add the file path to the result
        result["image_path"] = f'/uploads/{filename}'
        
        logger.info(f"Prediction result: {result}")
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error in api_predict: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 500

# Route to serve uploaded files
@app.route('/uploads/<filename>')
def get_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Route for static files
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True, port=5001)