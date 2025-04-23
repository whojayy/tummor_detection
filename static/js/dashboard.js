// Replace the content of static/js/dashboard.js with this:
document.addEventListener("DOMContentLoaded", () => {
    // Create accuracy chart
    const accuracyCtx = document.getElementById("accuracy-chart").getContext("2d");
    const accuracyChart = new Chart(accuracyCtx, {
      type: "line",
      data: {
        labels: ["Epoch 1", "Epoch 2", "Epoch 3", "Epoch 4", "Epoch 5"],
        datasets: [
          {
            label: "Training Accuracy",
            data: [72.65, 87.95, 91.78, 93.12, 95.24],
            backgroundColor: "rgba(52, 152, 219, 0.2)",
            borderColor: "rgba(52, 152, 219, 1)",
            borderWidth: 2,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            min: 70,
            max: 100,
            title: {
              display: true,
              text: "Accuracy (%)",
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
      },
    });
  
    // Create distribution chart
    const distributionCtx = document.getElementById("distribution-chart").getContext("2d");
    const distributionChart = new Chart(distributionCtx, {
      type: "doughnut",
      data: {
        labels: ["Glioma", "Meningioma", "No Tumor", "Pituitary"],
        datasets: [
          {
            data: [300, 306, 405, 300],
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
        plugins: {
          legend: {
            position: "right",
          },
          title: {
            display: true,
            text: "Test Dataset Distribution",
          },
        },
      },
    });
  });