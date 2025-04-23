Brain Tumor Detection Web Application
A Flask-based web application for detecting and classifying brain tumors from MRI scans using a deep learning model.

Overview
This application uses a convolutional neural network based on the VGG16 architecture to analyze brain MRI scans and classify them into four categories:

Glioma tumor
Meningioma tumor
Pituitary tumor
No tumor (normal brain scan)
The system provides confidence scores and probability distributions to help medical professionals make informed decisions.

Features
Upload and Analyze: Upload MRI scans and get instant analysis
Multi-Class Detection: Detects multiple types of brain tumors
Confidence Scores: Provides confidence level for each prediction
Probability Distribution: Shows probability for each possible class
Responsive Design: Works on desktop and mobile devices
Performance Dashboard: View model performance metrics
Technology Stack
Backend: Python, Flask
Frontend: HTML, CSS, JavaScript
Data Visualization: Chart.js
Machine Learning: TensorFlow, Keras
Model Architecture: VGG16 (transfer learning)
Project Structure
TUMOR_DETECTION/
├── data/                      # Training and testing datasets (not included in repo)
│   ├── test/
│   │   ├── glioma/
│   │   ├── meningioma/
│   │   ├── notumor/
│   │   └── pituitary/
│   └── train/
│       ├── glioma/
│       ├── meningioma/
│       ├── notumor/
│       └── pituitary/
├── models/                    # Model directory
│   └── .gitkeep               # Placeholder to maintain directory structure
├── static/                    # Static files
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   ├── js/
│   │   ├── main.js            # JavaScript for main page
│   │   └── dashboard.js       # JavaScript for dashboard
│   └── images/
│       └── brain-scan.jpg     # Sample brain scan image
├── templates/                 # HTML templates
│   ├── index.html             # Home page
│   ├── about.html             # About page
│   └── dashboard.html         # Dashboard page
├── uploads/                   # Directory for uploaded scans
│   └── .gitkeep               # Placeholder to maintain directory structure
├── app.py                     # Main Flask application
├── class_mapping.json         # Class mapping configuration
├── .gitignore                 # Git ignore file
└── README.md                  # Project documentation
Installation
Prerequisites
Python 3.7+
pip
Virtual environment (recommended)
Setup
Clone the repository:

git clone https://github.com/yourusername/brain-tumor-detection.git
cd brain-tumor-detection
Create and activate a virtual environment:

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies:

pip install flask tensorflow keras pillow numpy
Set up the model:

The model file (models/model.h5) is not included in this repository due to its large size
You need to place your trained model in the models directory
You can train the model using the Jupyter notebook in the repository or contact the repository owner for access to the pre-trained model
Run the application:

python app.py
Open your browser and navigate to:

http://127.0.0.1:5001/
Usage
Analyzing an MRI Scan
Navigate to the home page
Click "Choose MRI Scan" to upload an image
Click "Analyze Scan"
View the results, including:

Diagnosis (tumor type or no tumor)
Confidence score
Probability distribution for all classes
Viewing Model Performance
Navigate to the Dashboard page
View various metrics including:

Overall accuracy
Class distribution
Confusion matrix
Performance metrics by class
Model Information
Architecture
The model is based on the VGG16 architecture with transfer learning:

Pre-trained VGG16 base (trained on ImageNet)
Custom classification head
Input size: 128x128x3
Output: 4 classes (glioma, meningioma, notumor, pituitary)
Performance
Overall Accuracy: 93.2%
Class-specific metrics:

Glioma: Precision 0.85, Recall 0.97, F1-Score 0.90
Meningioma: Precision 0.95, Recall 0.77, F1-Score 0.85
No Tumor: Precision 0.98, Recall 0.97, F1-Score 0.98
Pituitary: Precision 0.91, Recall 0.99, F1-Score 0.95
API Endpoints
/api/predict (POST)
Analyzes an uploaded MRI scan.

Request:

Form data with a file field named "file"
Response:

{
  "class": "glioma",
  "confidence": 0.92,
  "probabilities": {
    "glioma": 0.92,
    "meningioma": 0.05,
    "notumor": 0.01,
    "pituitary": 0.02
  },
  "image_path": "/uploads/filename.jpg"
}
Deployment
Local Deployment
Run the application locally:

python app.py
Production Deployment
For production deployment, consider:

Using a production WSGI server like Gunicorn
Setting up a reverse proxy with Nginx
Deploying to a cloud platform like Heroku, AWS, or Google Cloud
Example Gunicorn deployment:

pip install gunicorn
gunicorn app:app
Disclaimer
This tool is intended for research and educational purposes only. It should not be used as the sole basis for medical diagnosis. Always consult with qualified healthcare professionals for proper medical advice and diagnosis.

Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
Dataset: Brain Tumor MRI Dataset
VGG16 Architecture: Very Deep Convolutional Networks for Large-Scale Image Recognition
Flask Framework: Flask Documentation
To add this README.md file to your project:

# Create the README.md file
touch README.md

# Open it in your preferred text editor and paste the content
# For example, using nano:
nano README.md

# After saving the file, add it to git
git add README.md
git commit -m "Add comprehensive README.md"
git push
