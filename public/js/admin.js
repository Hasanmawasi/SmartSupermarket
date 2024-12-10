
let links = document.querySelectorAll(".sidebar-list li a");
    links.forEach((link)=>{
      link.addEventListener('click',()=>{
        links.forEach(ln=>{ln.classList.remove("active")})
        link.classList.add("active");
      })
    })

    async function searchProducts() {
      const query = document.getElementById('searchInput').value;

      if (!query) {
        document.getElementById('results').innerHTML = '';
        return;
      }

      try {
        const response = await fetch(`/search?query=${query}`);
        const data = await response.json();

        displayResults(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    function displayResults(products) {
      const resultsContainer = document.getElementById('results');
      resultsContainer.innerHTML = ''; // Clear previous results

      if (products.length === 0) {
        resultsContainer.innerHTML = '<p>No products found</p>';
        return;
      }

      products.forEach((product) => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
          <strong>${product.product_name}</strong><br />
          ${product.description}<br />
          Price: $${product.base_price}
        `;
        resultsContainer.appendChild(div);
      });
    }



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
const ctx = document.getElementById("myChart");
new Chart(ctx, config);
const ctx1 = document.getElementById("myChart1");
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

function editProfile() {
  // Toggle display for text and input elements
  document.querySelectorAll('.info-text').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.profile-info input').forEach(el => el.style.display = 'block');

  // Show photo input and Save button, hide Edit button
  document.getElementById('photoInput').style.display = 'block';
  document.getElementById('updateBtn').style.display = 'block';
  document.querySelector('.edit-button').style.display = 'none';
  document.querySelector('.save-button').style.display = 'block';
}

function saveProfile() {
  // Get values from inputs
  const firstName = document.getElementById('firstNameInput').value;
  const lastName = document.getElementById('lastNameInput').value;
  const phone = document.getElementById('phoneInput').value;
  const email = document.getElementById('emailInput').value;

  // Set text content to new values
  document.getElementById('firstNameText').textContent = firstName;
  document.getElementById('lastNameText').textContent = lastName;
  document.getElementById('phoneText').textContent = phone;
  document.getElementById('emailText').textContent = email;

  // Hide inputs and show text elements
  document.querySelectorAll('.info-text').forEach(el => el.style.display = 'block');
  document.querySelectorAll('.profile-info input').forEach(el => el.style.display = 'none');

  // Hide photo input and Save button, show Edit button
  document.getElementById('photoInput').style.display = 'none';
  document.getElementById('updateBtn').style.display = 'none';
  document.querySelector('.edit-button').style.display = 'block';
  document.querySelector('.save-button').style.display = 'none';
}

// Function to load the new profile photo
function loadPhoto(event) {
  const photo = document.getElementById('profilePhoto');
  photo.src = URL.createObjectURL(event.target.files[0]);
}
// const ctx2= document.getElementById("donatchart");
// new Chart(ctx2,config2);

