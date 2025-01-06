
    const fetchDashboardData = async () => {
      try {
        const currentYear = document.getElementById('currentYear').value;
        const branch = document.getElementById("branch").value;
          const response = await fetch(`/manager/dashboardData/${branch}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentYear: currentYear }), 
          });
    
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const data = await response.json(); // Parse JSON response
          console.log("Profit Data:", data );
          return data.profits 
      } catch (error) {
          console.error("Error fetching profit data:", error);
      }
    };
    
    // fetchDashboardData();    
  let months = [];
  const getMonths = async () => {
    try {
        const profitData = await fetchDashboardData(); // Fetch data
        if (profitData) {
            months = profitData.map(item => new Date(item.month).toLocaleString('default', { month: 'long' }));
                         }
    } catch (error) {
        console.error("Error getting months:", error);
    }
   };
   let Profit =[];
const getProfit= async () => {
  try {
      const profitData = await fetchDashboardData(); // Fetch data
      if (profitData) {
         
          Profit = profitData.map(item => item.profit);
      }
  } catch (error) {
      console.error("Error getting months:", error);
  }
};
let Expenses = [];
const getExpenses= async () => {
  try {
      const profitData = await fetchDashboardData(); // Fetch data
      if (profitData) {
         
        Expenses = profitData.map(item => item.expenses);
      }
  } catch (error) {
      console.error("Error getting months:", error);
  }
};

      (async () => {
        await getMonths(); // Wait for the months to be populated
        await getProfit();
        await getExpenses();
        updateChart(months,Profit,Expenses);
      })();

    document.getElementById('currentYear').addEventListener('change', async (event) => { 
      const currentYear = event.target.value;
        await fetchDashboardData();
        await getMonths(); 
        // await getRevenue(); 
        await getProfit();
        await getExpenses();
        updateChart(months,Profit,Expenses);
        // updateProfitsTable(months, Revenue, Expenses, Profit);
    });




let dashboardDataGraph = null;
// ====================================
const updateChart = (months, Profit, Expenses) => {
  const ctx = document.getElementById('myChart').getContext('2d');
  if (dashboardDataGraph) {
    dashboardDataGraph.destroy();
    dashboardDataGraph = null;
  }

  const backgroundColors = [
    "rgba(245, 38, 38, 0.6)",  // Red
    "rgba(54, 162, 235, 0.6)",  // Blue
    "rgba(75, 192, 192, 0.6)",  // Green
    "rgba(255, 159, 64, 0.6)",  // Orange
    "rgba(153, 102, 255, 0.6)", // Purple
    "rgba(255, 205, 86, 0.6)",  // Yellow
    "rgba(247, 64, 134, 0.6)",  // Pink
    "rgba(77, 209, 255, 0.6)",  // Cyan
    "rgba(0, 128, 0, 0.6)",     // Dark Green
    "rgba(169, 169, 169, 0.6)"  // Gray
  ];
  const borderColor= [
    "rgba(255, 99, 132)",  // Red
    "rgba(54, 162, 235)",  // Blue
    "rgba(75, 192, 192)",  // Green
    "rgba(255, 159, 64)",  // Orange
    "rgba(153, 102, 255)", // Purple
    "rgba(255, 205, 86)",  // Yellow
    "rgba(255, 99, 159)",  // Pink
    "rgba(77, 209, 255)",  // Cyan
    "rgba(0, 128, 0)",     // Dark Green
    "rgba(169, 169, 169)"  // Gray
  ];
let delayed;
let delayBetweenPoints=300;
let previousY=0; // Variable to store the previous Y value
  dashboardDataGraph =new Chart(ctx, {
    type: 'bar', // Base chart type
    data: {
      labels: months, // X-axis labels
      datasets: [
        {
          label: 'Profit', // Bar chart for profit
          data: Profit,
          backgroundColor: backgroundColors,
          borderColor: borderColor,
          borderWidth: 1,
          animation: {
            // loop: true, // Loop animation for the bar chart
            duration: 2000,
            easing: 'easeInOutQuad', // Easing for the loop
          },
        },
        {
          label: 'Expenses', // Line chart for expenses
          data: Expenses,
          type: 'line', // Override to line chart
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(252, 59, 59)',
          borderWidth: 2,
          tension: 0.4, // Curve smoothing for the line
          fill: false,
          animation: {
            x: {
              type: 'number',
              easing: 'easeInOutQuad',
              duration: delayBetweenPoints,
              from: NaN, // The point is initially skipped
              delay(ctx) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                  return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
              },
            },
            y: {
              type: 'number',
              easing: 'easeInOutQuad',
              duration: delayBetweenPoints,
              from: previousY,
              delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                  return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
              },
            },
          },
        
      // No background fill for the line chart
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true, // Ensure y-axis starts at zero
        },
      },
      responsive: true, // Make the chart responsive
      plugins: {
        legend: {
          position: 'top', // Position the legend at the top
        },
      },
    },
  });
  
};
// ===============================
let productChart = null;
const fetchTopData = async () => {
  try {
    const currentYear = document.getElementById('currentYear').value;
    const branch = document.getElementById("branch").value;
      const response = await fetch(`/manager/dashboardData/${branch}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentYear: currentYear }), 
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Parse JSON response
      // console.log("Profit Data:", data );
      return data.branchStorage 
  } catch (error) {
      console.error("Error fetching profit data:", error);
  }
};
let ProductName = [];
const getProductName= async () => {
  try {
      const profitData = await fetchTopData(); // Fetch data
      if (profitData) {             
        ProductName = profitData.map(item => item.product_name);
      }
      console.log(ProductName)

  } catch (error) {
      console.error("Error getting months:", error);
  }
};
let quantity = [];
const getQuantity= async () => {
  try {
      const profitData = await fetchTopData(); // Fetch data
      if (profitData) {             
        quantity = profitData.map(item => item.total_quantity_sold);
      }
      console.log(quantity)
  } catch (error) {
      console.error("Error getting months:", error);
  }
};
const updateTopProductChart = (ProductName, quantity) => {
  const ctx = document.getElementById('topProduct').getContext('2d');
  // const ctx1 = document.getElementById('profitChartBranch').getContext('2d');
 
  if (productChart) {
    productChart.destroy();
    productChart = null;
  }

  
  productChart = new Chart(ctx, {
    type: 'bar',
            data: {
                labels: ProductName, // Y-axis labels (Product names)
                datasets: [{
                    label: 'Products Sold',
                    data: quantity, // X-axis values (Quantities sold)
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y', // Make it horizontal
                scales: {
                    x: {
                        beginAtZero: true, // Start the X-axis from 0
                        title: {
                            display: true,
                            text: 'Quantity Sold'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Products'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
})
};
let review ;
let reviewChart=null;
// ============================first function call when load
// the performance donat chart
const fetchCustomerReviews = async () => {
  try {
      const response = await fetch('/manager/customersReviews', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Parse JSON response
      console.log("Costomer Data:", data );
      return data 
  } catch (error) {
      console.error("Error fetching profit data:", error);
  }
};
(async () => {
  await getMonths(); // Wait for the months to be populated
  await getProfit();
  await getExpenses();
  await getProductName();
  await getQuantity();
 review = await fetchCustomerReviews();
  updateChart(months,Profit,Expenses);
  updateTopProductChart(ProductName,quantity);
  updateReviewsChart(review)
})();

const updateReviewsChart = (review) => {
 // Average review data
 if(reviewChart){
  reviewChart.destroy();
  reviewChart=null;
 }
 const averageReview = review; // Replace with your actual average review score (0 to 5)
 const maxScore = 5; // Maximum possible review score
 const percentage = (averageReview / maxScore) * 100; // Calculate percentage

 // Chart data
 const data = {
     labels: ["Average Score", "Remaining"],
     datasets: [{
         data: [percentage, 100 - percentage], // Show average score percentage and remaining
         backgroundColor: ['rgba(28, 172, 255, 0.8)', 'rgba(230, 230, 230, 0.8)'], // Colors
         borderWidth: 0 // No border for a cleaner look
     }]
 };

 // Chart options
 const options = {
     responsive: true,
     plugins: {
         legend: {
             display: true // Hide legend for simplicity
         },
         tooltip: {
             enabled: true // Disable tooltips for a cleaner chart
         },
         datalabels: {
             display: true // Optional: Hide default labels
         }
     },
     cutout: '80%' // Makes the donut thin
 };

 // Add the central percentage text
 const plugins = [{
     id: 'centerText',
     beforeDraw: function(chart) {
         const { width } = chart;
         const { ctx } = chart;
         const fontSize = (width / 10).toFixed(2); // Dynamically adjust font size
         ctx.save();
         ctx.font = `${fontSize}px Popins`;
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';
         ctx.fillStyle = 'black'; // Text color
         const text = `${percentage.toFixed(1)}%`;
         const textX = chart.getDatasetMeta(0).data[0].x;
         const textY = chart.getDatasetMeta(0).data[0].y;
         ctx.fillText(text, textX, textY);
         ctx.restore();
     }
 }];

 // Create the chart
 const ctx2= document.getElementById("donatchart").getContext("2d");
 reviewChart= new Chart(ctx2, {
     type: 'doughnut',
     data: data,
     options: options,
     plugins: plugins
 });

};


