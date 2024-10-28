

const links = document.querySelectorAll('li a');

        // Loop through each link and add a click event listener
        links.forEach(link => {
            link.addEventListener('click', () => {
                // Remove the 'active' class from any currently active link
                document.querySelector('.active')?.classList.remove('active');

                // Add the 'active' class to the clicked link
                link.classList.add('active');
            });
        });