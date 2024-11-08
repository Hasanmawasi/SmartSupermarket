
let links = document.querySelectorAll(".sidebar-list li a");
    links.forEach((link)=>{
      link.addEventListener('click',()=>{
        links.forEach(ln=>{ln.classList.remove("active")})
        link.classList.add("active");
      })
    })


// profet label
const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
];
const data = {
  labels: labels,
  datasets: [
    {
      label: "My First Dataset",
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgba(255, 205, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(201, 203, 207, 0.2)",
      ],
      borderColor: [
        "rgb(255, 99, 132)",
        "rgb(255, 159, 64)",
        "rgb(255, 205, 86)",
        "rgb(75, 192, 192)",
        "rgb(54, 162, 235)",
        "rgb(153, 102, 255)",
        "rgb(201, 203, 207)",
      ],
      borderWidth: 1,
    },
  ],
};

const config = {
  type: "bar",
  data: data,
  options: {
     scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
  
};

// Get the context and render the chart
const ctx = document.getElementById("myChart").getContext("2d");
new Chart(ctx, config);
const ctx1 = document.getElementById("myChart1").getContext("2d");
new Chart(ctx1, config);


// the performance donat chart
const data1 = {
  labels: [
    'Red',
    'Blue',
    'Yellow'
  ],
  options: {
    scales: {
     y: {
       beginAtZero: true,
     },
   },
 },
  datasets: [{
    label: 'My First Dataset',
    data: [300, 50, 100,0],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)'
    ],
  }]
};
const config2 = {
  type: 'line',
  data: data1,
};


const ctx2= document.getElementById("donatchart").getContext("2d");
new Chart(ctx2,config2);