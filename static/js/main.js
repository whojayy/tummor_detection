// Replace the content of static/js/main.js with this:
document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("file-input");
    const analyzeBtn = document.getElementById("analyze-btn");
    const uploadForm = document.getElementById("upload-form");
    const resultsSection = document.getElementById("results");
    const loadingOverlay = document.getElementById("loading-overlay");
    const resultImage = document.getElementById("result-image");
    const diagnosisText = document.getElementById("diagnosis-text");
    const confidenceBar = document.getElementById("confidence-bar");
    const confidenceText = document.getElementById("confidence-text");
    const fileLabel = document.querySelector(".file-text");
    let probabilityChart = null;
  
    // Hide loading overlay if it's visible when the page loads
    if (loadingOverlay) {
      loadingOverlay.classList.add("hidden");
    }
  
    // Enable/disable analyze button based on file selection
    if (fileInput) {
      fileInput.addEventListener("change", function () {
        if (this.files && this.files[0]) {
          const fileName = this.files[0].name;
          fileLabel.textContent = fileName.length > 20 ? fileName.substring(0, 17) + "..." : fileName;
          analyzeBtn.disabled = false;
        } else {
          fileLabel.textContent = "Choose MRI Scan";
          analyzeBtn.disabled = true;
        }
      });
    }
  
    // Handle form submission
    if (uploadForm) {
      uploadForm.addEventListener("submit", (e) => {
        e.preventDefault();
  
        if (!fileInput.files || !fileInput.files[0]) {
          return;
        }
  
        // Show loading overlay
        if (loadingOverlay) {
          loadingOverlay.classList.remove("hidden");
        }
  
        // Create form data
        const formData = new FormData();
        formData.append("file", fileInput.files[0]);
  
        // Send request to API
        fetch("/api/predict", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            // Hide loading overlay
            if (loadingOverlay) {
              loadingOverlay.classList.add("hidden");
            }
  
            // Display results
            displayResults(data);
          })
          .catch((error) => {
            console.error("Error:", error);
            if (loadingOverlay) {
              loadingOverlay.classList.add("hidden");
            }
            alert("An error occurred while analyzing the image. Please try again.");
          });
      });
    }
  
    // Function to display results
    function displayResults(data) {
      // Set image
      if (resultImage) {
        resultImage.src = data.image_path;
      }
  
      // Set diagnosis text
      if (diagnosisText) {
        if (data.class === "notumor") {
          diagnosisText.textContent = "No Tumor Detected";
          diagnosisText.style.color = "#2ecc71";
        } else {
          diagnosisText.textContent = `${data.class.charAt(0).toUpperCase() + data.class.slice(1)} Tumor Detected`;
          diagnosisText.style.color = "#e74c3c";
        }
      }
  
      // Set confidence
      if (confidenceBar && confidenceText) {
        const confidencePercent = (data.confidence * 100).toFixed(2);
        confidenceBar.style.width = `${confidencePercent}%`;
        confidenceText.textContent = `${confidencePercent}%`;
  
        // Set confidence bar color based on confidence level
        if (data.confidence > 0.8) {
          confidenceBar.style.backgroundColor = "#2ecc71";
        } else if (data.confidence > 0.6) {
          confidenceBar.style.backgroundColor = "#f39c12";
        } else {
          confidenceBar.style.backgroundColor = "#e74c3c";
        }
      }
  
      // Create or update probability chart
      if (data.probabilities) {
        createProbabilityChart(data.probabilities);
      }
  
      // Show results section
      if (resultsSection) {
        resultsSection.classList.remove("hidden");
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  
    // Function to create probability chart
    function createProbabilityChart(probabilities) {
      const chartElement = document.getElementById("probability-chart");
      if (!chartElement) return;
      
      const ctx = chartElement.getContext("2d");
      if (!ctx) return;
  
      // Destroy previous chart if it exists
      if (probabilityChart) {
        probabilityChart.destroy();
      }
  
      // Prepare data
      const labels = Object.keys(probabilities).map((label) =>
        label === "notumor" ? "No Tumor" : label.charAt(0).toUpperCase() + label.slice(1)
      );
      const data = Object.values(probabilities).map((value) => (value * 100).toFixed(2));
  
      // Create chart
      try {
        probabilityChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Probability (%)",
                data: data,
                backgroundColor: [
                  "rgba(231, 76, 60, 0.7)",
                  "rgba(52, 152, 219, 0.7)",
                  "rgba(46, 204, 113, 0.7)",
                  "rgba(155, 89, 182, 0.7)",
                ],
                borderColor: [
                  "rgba(231, 76, 60, 1)",
                  "rgba(52, 152, 219, 1)",
                  "rgba(46, 204, 113, 1)",
                  "rgba(155, 89, 182, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: "Probability (%)",
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: "Class Probabilities",
              },
            },
          },
        });
      } catch (error) {
        console.error("Error creating chart:", error);
      }
    }
    
    // Add a manual way to close the loading overlay (for debugging)
    document.addEventListener('keydown', function(event) {
      // Press Escape key to force-close the loading overlay
      if (event.key === "Escape" && loadingOverlay) {
        loadingOverlay.classList.add("hidden");
        console.log("Loading overlay force-closed with Escape key");
      }
    });
  });