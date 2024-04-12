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

    let posX = 0;
    let isKeyDown = false;
    const stepSize = 12;
    let direction = 'right';
    let intervalID;
    let frameIndex = 2;
    let animating = false;

    const screenContainer = document.querySelector('.screen-container');
    const screens = document.querySelectorAll('.screen');
    let currentScreenIndex = 0; // Index of the current screen
    let screenWidth = window.innerWidth; // Width of the screen

    // Detect touch screen device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

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
        // Calculate stepSize based on window width
        const baseStepSize = 12; // Base step size for larger screens
        const windowWidth = window.innerWidth;
        const stepSize = windowWidth < 600 ? baseStepSize : baseStepSize / 2 ; // Adjust step size for smaller screens

        posX += direction === 'right' ? stepSize : -stepSize;
        posX = Math.max(0, Math.min(posX, window.innerWidth - jaguar.offsetWidth));
        moveJaguar();
    }

    function manageInterval(newID) {
        if (newID !== undefined) {
            clearInterval(intervalID);
            intervalID = newID;
        }
    }

    // Import sprint logic dynamically
    import('./jag-sprint-logic.js').then(sprintModule => {
        sprintModule.attachSprintHandler(jaguar, updatePosition, manageInterval);
    });

    // Attach touch event listeners if it's a touch device
    // Attach touch event listeners if it's a touch device
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
    