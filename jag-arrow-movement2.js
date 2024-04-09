document.addEventListener('DOMContentLoaded', () => {
    const jaguar = document.getElementById('jaguar');
    let posX = 0; // Global position variable
    let isKeyDown = false; // Flag to track key press state
    const stepSize = 12; // Movement step size
    let direction = 'right'; // Current movement direction
    let intervalID; // Interval ID for clearing
    let frameIndex = 2; // Image frame index
    let animating = false; // Animation state flag

    jaguar.style.left = '0px'; // Initial jaguar position

    // Separate image URL lists for right and left movements
    const rightImageUrls = [];
    const leftImageUrls = [];
    for (let i = 2; i <= 19; i++) {
        rightImageUrls.push(`resources/jag-walk-cycle/right/jagwalk${i}.webp`);
        leftImageUrls.push(`resources/jag-walk-cycle/left/jagwalk${i}L.webp`);
    }

    // Preloading not shown for brevity, apply similar logic as before if needed

    function moveJaguar() {
        if (animating) {
            frameIndex = frameIndex > 18 ? 2 : frameIndex + 1;
            const imageUrl = direction === 'right' ? rightImageUrls[frameIndex - 2] : leftImageUrls[frameIndex - 2];
            jaguar.src = imageUrl;
        } else {
            // Standby images for each direction
            jaguar.src = direction === 'right' ? 'resources/jagwalk1.webp' : 'resources/jagwalk1L.webp';
            frameIndex = 2;
        }
        jaguar.style.left = `${posX}px`;
    }

    function updatePosition() {
        posX += direction === 'right' ? stepSize : -stepSize;
        // This limits movement of jaguar to screen limits
        posX = Math.max(0, Math.min(posX, window.innerWidth - jaguar.offsetWidth));
        moveJaguar();
    }

    // Sprint handler
    function manageInterval(newID) {
        if (newID === undefined) {
            return intervalID;
        }
        clearInterval(intervalID);
        intervalID = newID;
    }

    // Import the sprint handling logic and attach it
    import('./jag-sprint-logic.js').then(sprintModule => {
        sprintModule.attachSprintHandler(jaguar, updatePosition, manageInterval);
    });

    document.addEventListener('keydown', (e) => {
        if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !isKeyDown) {
            isKeyDown = true;
            animating = true;
            direction = e.key === 'ArrowRight' ? 'right' : 'left';
            clearInterval(intervalID); // Clear existing interval to prevent overlaps
            intervalID = setInterval(updatePosition, 60); // Update position at a 50ms interval
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            isKeyDown = false;
            animating = false;
            clearInterval(intervalID); // Stop the movement interval
            moveJaguar(); // Update the jaguar's appearance based on the current state
        }
    });
});
