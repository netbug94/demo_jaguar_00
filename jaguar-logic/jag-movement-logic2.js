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
    let isSprinting = false; // New variable to track sprinting state
    let intervalID;
    let frameIndex = 0;
    let animating = false;
    let direction = 'right';
    let stepSize = 13; // Default step size

    // Preloaded image arrays for left and right movement
    const rightImageUrls = Array.from({ length: 19 }, (_, i) => `resources/jaguar-walking/right-side/webp/jagwalk${i + 1}.webp`);
    const leftImageUrls = Array.from({ length: 19 }, (_, i) => `resources/jaguar-walking/left-side/webp/jagwalk${i + 1}L.webp`);

    // Preloaded image arrays for sprinting
    const sprintRightImageUrls = Array.from({ length: 16 }, (_, i) => `resources/jaguar-running/right-side/webp/jagrun${i + 1}.webp`);
    const sprintLeftImageUrls = Array.from({ length: 16 }, (_, i) => `resources/jaguar-running/left-side/webp/jagrun${i + 1}L.webp`);

    // Standby images are the first in each sequence
    const rightStandbyImage = rightImageUrls[0];
    const leftStandbyImage = leftImageUrls[0];

    function updateImage() {
        if (animating) {
            const currentImageUrls = isSprinting ? (direction === 'right' ? sprintRightImageUrls : sprintLeftImageUrls) : (direction === 'right' ? rightImageUrls : leftImageUrls);
            frameIndex = (frameIndex + 1) % currentImageUrls.length; // Cycle through images
            jaguar.src = currentImageUrls[frameIndex];
        } else {
            const standbyImage = direction === 'right' ? rightStandbyImage : leftStandbyImage;
            jaguar.src = standbyImage;
        }
    }

    function updatePosition() {
        posX += direction === 'right' ? stepSize : -stepSize;
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
                    intervalID = setInterval(updatePosition, isSprinting ? 25 : 50); // Adjust interval for sprinting
                }
                break;
            case 'Shift':
                if (!isSprinting) {
                    isSprinting = true;
                    stepSize = 24; // Increase step size for sprinting
                    clearInterval(intervalID);
                    intervalID = setInterval(updatePosition, 25); // Faster interval for sprinting
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
                clearInterval(intervalID);
                updateImage(); // Update to standby image immediately on key up
                break;
            case 'Shift':
                isSprinting = false;
                stepSize = 12; // Reset step size to normal
                clearInterval(intervalID);
                if (isKeyDown) { // If still moving, continue the normal walk
                    intervalID = setInterval(updatePosition, 50);
                }
                break;
        }
        e.preventDefault();
    });
});
