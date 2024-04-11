import { adjustJaguarSize } from './jag-resize-logic.js';  // Import the function

document.addEventListener('DOMContentLoaded', () => {
    const jaguar = document.getElementById('jaguar');
    adjustJaguarSize();  // Adjust the size on initial load
    window.addEventListener('resize', adjustJaguarSize);  // Adjust the size on window resize

    let posX = 0;
    let isKeyDown = false;
    const stepSize = 12;
    let direction = 'right';
    let intervalID;
    let frameIndex = 2;
    let animating = false;

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

    import('./jag-sprint-logic.js').then(sprintModule => {
        sprintModule.attachSprintHandler(jaguar, updatePosition, manageInterval);
    });

    document.addEventListener('keydown', (e) => {
        if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !isKeyDown) {
            isKeyDown = true;
            animating = true;
            direction = e.key === 'ArrowRight' ? 'right' : 'left';
            clearInterval(intervalID);
            intervalID = setInterval(updatePosition, 60);
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
