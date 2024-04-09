let posX = 0; // Declare posX as a global variable
let isKeyDown = false; // Flag to track whether the right arrow key is currently pressed
const stepSize = 12; // Customize the step size

document.addEventListener('DOMContentLoaded', () => {
    const jaguar = document.getElementById('jaguar');
    let frameIndex = 2; // Start from the first image
    let animating = false;
    let prevAnimating = false;

    jaguar.style.left = '0px'; // Set initial position of the jaguar

    // Array to store image URLs
    const imageUrls = ['resources/jagwalk1.webp'];
    for (let i = 2; i <= 19; i++) {
        imageUrls.push(`resources/jag-walk-cycle/right/jagwalk${i}.webp`);
    }

    // Function to preload images
    function preloadImages(urls) {
        urls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    // Preload images
    preloadImages(imageUrls);


    function moveJaguar() {
        if (animating) {
            frameIndex++; // Increment frameIndex
            if (frameIndex > 19) {
                frameIndex = 2; // If frameIndex exceeds 19, reset to 2
            }
            jaguar.src = `resources/jag-walk-cycle/right/jagwalk${frameIndex}.webp`;
        } else {
            jaguar.src = 'resources/jagwalk1.webp'; // Display the standby image when not moving
            if (prevAnimating) {
                frameIndex = 2; // Reset frameIndex when jaguar stops moving
            }
        }
        jaguar.style.left = `${posX}px`;
        prevAnimating = animating;
    }

    function updatePosition() {
        posX = Math.min(posX + stepSize, window.innerWidth - jaguar.offsetWidth); // Prevent moving off the right edge
        moveJaguar();
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            if (!isKeyDown) {
                isKeyDown = true;
                animating = true;
                updatePosition();
                // Call updatePosition() repeatedly while the right arrow key is held down
                intervalID = setInterval(updatePosition, 50);
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowRight') {
            isKeyDown = false;
            animating = false; // Stop animation
            clearInterval(intervalID); // Stop updating position
            moveJaguar();
        }
    });
});