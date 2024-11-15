

// Function to display stars based on the average rating
function displayRating(average) {
  const stars = document.querySelectorAll('.star-container');
  const fullStars = Math.floor(average); // Number of fully filled stars
  const decimalPart = average % 1; // Decimal part to fill partially

  stars.forEach((star, index) => {
    if (index < fullStars) {
      star.classList.add('full-star'); // Full star
      star.querySelector('.partial-fill').style.width = '100%'; // Ensure full fill for clarity
    } else if (index === fullStars) {
      // Set partial fill based on the decimal part
      star.querySelector('.partial-fill').style.width = `${decimalPart * 100}%`;
    } else {
      // No fill for empty stars
      star.classList.remove('full-star');
      star.querySelector('.partial-fill').style.width = '0%';
    }
  });
}

// Call the function with the average rating
displayRating(4.7);