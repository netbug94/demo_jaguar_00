document.addEventListener('DOMContentLoaded', () => {
    const jaguar = document.getElementById('jaguar');

    // Dynamic import for adaptive jaguar sizing
    import('./jag-resize-logic.js').then(module => {
        const { adjustJaguarSize } = module;
        adjustJaguarSize();  // Adjust the size on initial load
        window.addEventListener('resize', adjustJaguarSize);  // Adjust the size on window resize
    }).catch(error => {
        console.error('Failed to load the adjustJaguarSize module', error);
    });

    // Import sprint logic dynamically
    import('./jag-keySprint-logic.js').then(sprintModule => {
        sprintModule.attachSprintHandler(jaguar, updatePosition, manageInterval);
    });
    // Import sprint logic dynamically
    import('./jag-touchSprint-logic.js').then(sprintModule => {
        sprintModule.attachSprintHandler2(jaguar, updatePosition, manageInterval);
    });

    let posX = 0;
    let isKeyDown = false;
    let intervalID;
    let frameIndex = 2;
    let animating = false;
    let direction = 'right';
    const debounceDelay = 100; // Debounce delay in milliseconds
    let lastKeyEventTime = 0;

    const screenContainer = document.querySelector('.screen-container');
    const screens = document.querySelectorAll('.screen');
    let currentScreenIndex = 0; // Index of the current screen
    let screenWidth = window.innerWidth; // Width of the screen
    // Detect touch screen device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    
    jaguar.style.left = '0px';

    const rightImageUrls = [];
    const leftImageUrls = [];
    for (let i = 1; i <= 19; i++) {
        rightImageUrls.push(`resources/jag-walk-cycle/right/jagwalk${i}.webp`);
        leftImageUrls.push(`resources/jag-walk-cycle/left/jagwalk${i}L.webp`);
    }
    const standbyImages = ['resources/jagwalk1.webp', 'resources/jagwalk1L.webp'];
    const allImagesToPreload = [...rightImageUrls, ...leftImageUrls, ...standbyImages];
    allImagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    function moveJaguar() {
        if (animating) {
            frameIndex = frameIndex > 19 ? 2 : frameIndex + 1;
            const imageUrl = direction === 'right' ? rightImageUrls[frameIndex - 2] : leftImageUrls[frameIndex - 2];
            jaguar.src = imageUrl;
        } else {
            jaguar.src = direction === 'right' ? 'resources/jagwalk1.webp' : 'resources/jagwalk1L.webp';
            frameIndex = 2;
        }
        jaguar.style.left = `${posX}px`;
    }

    // Function to handle touch start
    function handleTouchStart(e) {
        // Determine the direction based on the touch position
        const touchX = e.touches[0].clientX;
        const screenWidth = window.innerWidth;
        direction = touchX < screenWidth / 2 ? 'left' : 'right';

        isKeyDown = true;
        animating = true;
        clearInterval(intervalID);
        intervalID = setInterval(updatePosition, 60);
    }

    // Function to handle touch end
    function handleTouchEnd(e) {
        isKeyDown = false;
        animating = false;
        clearInterval(intervalID);
        moveJaguar(); // Move the character to its final position
    }

    function updatePosition() {
        // Update position based on direction
        posX += direction === 'right' ? stepSize : -stepSize;

        // Check if the jaguar reaches the end of the current screen
        if (posX >= screenWidth && direction === 'right') {
            changeScreen(1); // Change to the next screen
            posX = 0; // Reset position for the next screen
        } else if (posX <= 0 && direction === 'left' && currentScreenIndex > 0) {
            changeScreen(-1); // Change to the previous screen
            posX = screenWidth - jaguar.offsetWidth; // Reset position for the previous screen
        }

        // Move the jaguar
        moveJaguar();
    }

    function updatePosition() {
        const baseStepSize = 12; // Base step size
        const windowWidth = window.innerWidth;
        let stepSize;
    
        // Determine step size based on window width
        if (windowWidth < 500) {
            stepSize = baseStepSize / 3; // Slower speed for very small screens
        } else if (windowWidth >= 500 && windowWidth < 1000) {
            stepSize = baseStepSize / 2; // Medium speed for small to medium screens
        } else {
            stepSize = baseStepSize; // Normal speed for larger screens
        }
    
        // Update jaguar position based on direction
        posX += direction === 'right' ? stepSize : -stepSize;
        // Ensure the jaguar doesn't move out of view
        posX = Math.max(0, Math.min(posX, window.innerWidth - jaguar.offsetWidth));
    
        // Move the jaguar to new position
        moveJaguar();
    }
    

    function manageInterval(newID) {
        if (newID !== undefined) {
            clearInterval(intervalID);
            intervalID = newID;
        }
    }

    // Touch event listeners if it's a touch device
    if (isTouchDevice) {
        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchend', handleTouchEnd);
    } else {
        // Existing arrow key event listeners
        document.addEventListener('keydown', (e) => {
            if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !isKeyDown) {
                isKeyDown = true;
                animating = true;
                direction = e.key === 'ArrowRight' ? 'right' : 'left';
                clearInterval(intervalID);
                intervalID = setInterval(updatePosition, 60);
                e.preventDefault(); // Prevent the default behavior of arrow keys
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                isKeyDown = false;
                animating = false;
                clearInterval(intervalID);
                moveJaguar();
                e.preventDefault(); // Prevent the default behavior of arrow keys
            }
        });
    }
});
    