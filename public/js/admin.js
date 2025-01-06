
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


