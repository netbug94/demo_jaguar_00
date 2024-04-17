// Dynamic import for adaptive jaguar sizing
import('./jag-resize-logic.js').then(module => {
    const { adjustJaguarSize } = module;
    adjustJaguarSize();  // Adjust the size on initial load
    window.addEventListener('resize', adjustJaguarSize);  // Adjust the size on window resize
}).catch(error => {
    console.error('Failed to load the adjustJaguarSize module', error);
});

document.addEventListener('DOMContentLoaded', () => {
    const jaguar = document.getElementById('jaguar');
    let posX = 0;
    let isKeyDown = false;
    let isSprinting = false;
    let intervalID;
    let frameIndex = 0;
    let animating = false;
    let direction = 'right';
    let stepSize = 13;
    let stepSizeReset = 13;
    let touchStartTime = 0;
    let lastTapTime = 0;
    let tapCount = 0;
    const sprintThreshold = 0;
    const doubleTapThreshold = 300;

    const rightImageUrls = Array.from({ length: 19 }, (_, i) => `resources/jaguar-walking/right-side/jagwalk${i + 1}.webp`);
    const leftImageUrls = Array.from({ length: 19 }, (_, i) => `resources/jaguar-walking/left-side/jagwalk${i + 1}L.webp`);
    const sprintRightImageUrls = Array.from({ length: 16 }, (_, i) => `resources/jaguar-running/right-side/jagrun${i + 1}.webp`);
    const sprintLeftImageUrls = Array.from({ length: 16 }, (_, i) => `resources/jaguar-running/left-side/jagrun${i + 1}L.webp`);
    const rightStandbyImage = rightImageUrls[0];
    const leftStandbyImage = leftImageUrls[0];

    function updateImage() {
        let currentImageUrls;
        if (animating) {
            // Determine the image URLs based on the sprinting state and direction
            currentImageUrls = isSprinting ? (direction === 'right' ? sprintRightImageUrls : sprintLeftImageUrls)
                : (direction === 'right' ? rightImageUrls : leftImageUrls);
            frameIndex = (frameIndex + 1) % currentImageUrls.length; // Cycle through images
        } else {
            // Set to the standby image based on the direction
            currentImageUrls = direction === 'right' ? [rightStandbyImage] : [leftStandbyImage];
            frameIndex = 0; // Always show the first image in the array (which is the standby image)
        }
        jaguar.src = currentImageUrls[frameIndex]; // Set the jaguar image source
    }

    function updatePosition() {
        const windowWidth = window.innerWidth;

        if (isSprinting) {
            // Dynamic step size for sprinting based on screen width
            if (windowWidth < 500) {
                stepSize = 30 / 3; // Smaller sprint step for very small screens
            } else if (windowWidth >= 500 && windowWidth < 1000) {
                stepSize = 30 / 2; // Medium sprint step for small to medium screens
            } else {
                stepSize = 30; // Normal sprint step for larger screens
            }
        } else {
            // Dynamic step size for walking based on screen width
            if (windowWidth < 500) {
                stepSize = 13 / 3; // Slower speed for very small screens
            } else if (windowWidth >= 500 && windowWidth < 1000) {
                stepSize = 13 / 2; // Medium speed for small to medium screens
            } else {
                stepSize = 13; // Normal speed for larger screens
            }
        }

        posX += direction === 'right' ? stepSize : -stepSize;
        // Ensure the jaguar doesn't move out of view
        posX = Math.max(0, Math.min(posX, window.innerWidth - jaguar.offsetWidth));
        jaguar.style.left = `${posX}px`;
        updateImage();
    }

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowLeft':
                if (!isKeyDown) {
                    isKeyDown = true;
                    animating = true;
                    direction = e.key === 'ArrowRight' ? 'right' : 'left';
                    clearInterval(intervalID);
                    intervalID = setInterval(updatePosition, isSprinting ? 25 : 50); // Adjust interval based on sprinting
                }
                break;
            case 'Shift':
                // Check if an arrow key is down before enabling sprinting
                if (isKeyDown && (direction === 'right' || direction === 'left')) {
                    isSprinting = true;
                    clearInterval(intervalID);
                    intervalID = setInterval(updatePosition, 25); // Reduced interval for sprinting
                }
                break;
        }
        e.preventDefault();
    });

    document.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowLeft':
                isKeyDown = false;
                animating = false;
                break;
            case 'Shift':
                isSprinting = false; // Reset sprint state only if shift is released
                stepSize = stepSizeReset; // Reset to default step size
                break;
        }
        clearInterval(intervalID);
        updateImage();
        e.preventDefault();
    });

    // Touch Controls
    document.addEventListener('touchstart', (e) => {
        const touchX = e.touches[0].clientX;
        const screenWidth = window.innerWidth;
        const isRightSide = touchX > screenWidth / 2;
        const currentTime = Date.now();

        if (currentTime - lastTapTime < doubleTapThreshold) {
            tapCount++;
        } else {
            tapCount = 1;
        }
        lastTapTime = currentTime;

        touchStartTime = currentTime;
        direction = isRightSide ? 'right' : 'left';

        if (tapCount === 2) {
            setTimeout(() => {
                if (isKeyDown && (Date.now() - touchStartTime) >= sprintThreshold) {
                    isSprinting = true;
                    clearInterval(intervalID);
                    intervalID = setInterval(updatePosition, 25);
                }
            }, sprintThreshold);
        }

        if (!isKeyDown) {
            isKeyDown = true;
            animating = true;
            clearInterval(intervalID);
            intervalID = setInterval(updatePosition, isSprinting ? 25 : 50);
        }
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        isKeyDown = false;
        animating = false;
        isSprinting = false;
        clearInterval(intervalID);
        updateImage();
        e.preventDefault();
    });
});