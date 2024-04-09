let posX = 0; // Declare posX as a global variable
let direction = 'right'; // Current movement direction
let isKeyDown = false; // Flag to track whether an arrow key is currently pressed
const stepSize = 12; // Customize the step size
let intervalID; // Store interval ID for clearing

document.addEventListener('DOMContentLoaded', () => {
    const jaguar = document.getElementById('jaguar');
    let frameIndex = 0; // Start from the first image for each direction
    let animating = false;

    jaguar.style.left = '0px'; // Set initial position of the jaguar

    // Preload images for both directions
    const rightImageUrls = ['resources/jagwalk1.webp'];
    for (let i = 2; i <= 19; i++) {
        rightImageUrls.push(`resources/jag-walk-cycle/right/jagwalk${i}.webp`);
    }
    const leftImageUrls = ['resources/jagwalk1L.webp']; // Assuming left images have a similar naming scheme
    for (let i = 2; i <= 19; i++) {
        leftImageUrls.push(`resources/jag-walk-cycle/left/jagwalk${i}L.webp`);
    }

    // Create image elements for both directions
    const rightImages = rightImageUrls.map(url => {
        const img = new Image();
        img.src = url;
        return img;
    });
    const leftImages = leftImageUrls.map(url => {
        const img = new Image();
        img.src = url;
        return img;
    });

    function moveJaguar() {
        if (animating) {
            frameIndex = frameIndex >= 18 ? 2 : frameIndex + 1;
            jaguar.src = (direction === 'right' ? rightImages : leftImages)[frameIndex].src;
        } else {
            jaguar.src = (direction === 'right' ? rightImages : leftImages)[0].src; // Display the standby image when not moving
            frameIndex = 2; // Reset frameIndex when jaguar stops moving
        }
        jaguar.style.left = `${posX}px`;
    }

    function updatePosition() {
        posX += direction === 'right' ? stepSize : -stepSize;
        posX = Math.max(0, Math.min(posX, window.innerWidth - jaguar.offsetWidth)); // Prevent moving off the screen edges
        moveJaguar();
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            if (!isKeyDown || direction !== (e.key === 'ArrowRight' ? 'right' : 'left')) {
                isKeyDown = true;
                direction = e.key === 'ArrowRight' ? 'right' : 'left';
                animating = true;
                clearInterval(intervalID);
                intervalID = setInterval(updatePosition, 50);
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            isKeyDown = false;
            animating = false;
            clearInterval(intervalID);
            moveJaguar();
        }
    });
});
