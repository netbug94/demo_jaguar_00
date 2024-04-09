document.addEventListener('DOMContentLoaded', () => {
    const jaguar = document.getElementById('jaguar');
    let frameIndex = 2; // Start from the first image
    let animating = false;
    let prevAnimating = false;

    jaguar.style.left = '0px'; // Set initial position of the jaguar

    // Array to store image URLs
    const imageUrls = ['resources/jagwalk1L.webp'];
    for (let i = 2; i <= 19; i++) {
        imageUrls.push(`resources/jag-walk-cycle/left/jagwalk${i}L.webp`);
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
                frameIndex = 2; // If frameIndex exceeds 18, reset to 2
            }
            jaguar.src = `resources/jag-walk-cycle/left/jagwalk${frameIndex}L.webp`;
        } else {
            jaguar.src = 'resources/jagwalk1L.webp'; // Display the standby image when not moving
            if (prevAnimating) {
                frameIndex = 2; // Reset frameIndex when jaguar stops moving
            }
        }
        jaguar.style.left = `${posX}px`;
        prevAnimating = animating;
    }

    function updatePosition() {
        posX = Math.max(posX - stepSize, 0); // Prevent moving off the left edge
        moveJaguar();
    }    

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            if (!isKeyDown) {
                isKeyDown = true;
                animating = true;
                updatePosition();
                // Call updatePosition() repeatedly while the left arrow key is held down
                intervalID = setInterval(updatePosition, 50);
            }
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') {
            isKeyDown = false;
            animating = false; // Stop animation
            clearInterval(intervalID); // Stop updating position
            moveJaguar();
        }
    });
});
