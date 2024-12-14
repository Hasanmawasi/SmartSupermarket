// Function to display stars based on the rating
function displayRating(starContainer, average) {
  const stars = starContainer.querySelectorAll('.star-container');
  const fullStars = Math.floor(average); // Number of fully filled stars
  const decimalPart = average % 1; // Decimal part to fill partially

  stars.forEach((star, index) => {
    if (index < fullStars) {
      star.classList.add('full-star'); // Full star
      star.querySelector('.partial-fill').style.width = '100%'; // Fully fill
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

// Display the overall rating
const overallRatingContainer = document.getElementById('overall-rating');
const overallRating = parseFloat(overallRatingContainer.getAttribute('data-rating'));
displayRating(overallRatingContainer, overallRating);

// Display each customer's individual rating
const customerRatingContainers = document.querySelectorAll('.customer-rating');

customerRatingContainers.forEach((container) => {
  const customerRating = parseFloat(container.getAttribute('data-rating'));
  displayRating(container, customerRating);
});
