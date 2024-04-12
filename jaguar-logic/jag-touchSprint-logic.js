export function attachSprintHandler2(jaguar, updatePosition, manageInterval) {
    let isSprinting = false;
    let sprintFrameIndex = 2;
    let lastTapTime = 0;
    let tapCount = 0;

    const sprintRightImageUrls = [];
    const sprintLeftImageUrls = [];
    for (let i = 2; i <= 19; i++) {
        sprintRightImageUrls.push(`resources/jag-walk-cycle/right/jagwalk${i}.webp`);
        sprintLeftImageUrls.push(`resources/jag-walk-cycle/left/jagwalk${i}L.webp`);
    }

    // Preload sprint images
    [...sprintRightImageUrls, ...sprintLeftImageUrls].forEach(src => {
        const img = new Image();
        img.src = src;
    });

    function updateJaguarImage(direction) {
        const imageUrls = direction === 'right' ? sprintRightImageUrls : sprintLeftImageUrls;
        jaguar.src = imageUrls[sprintFrameIndex - 2];
        sprintFrameIndex = sprintFrameIndex > 18 ? 2 : sprintFrameIndex + 1;
    }

    function startSprint(direction) {
        if (isSprinting) return;
        isSprinting = true;
        const newIntervalID = setInterval(() => {
            updatePosition(direction, 24); // Use a larger step size for sprinting
            updateJaguarImage(direction);
        }, 30); // Faster update interval for sprinting
        manageInterval(newIntervalID); // Pass the new interval ID back to main.js to manage it
    }

    function stopSprint() {
        isSprinting = false;
        manageInterval(); // Clear the sprint interval by invoking manageInterval without a new ID
    }

    // Touch event handlers
    document.addEventListener('touchstart', e => {
        const touchX = e.touches[0].clientX;
        const screenWidth = window.innerWidth;
        const direction = touchX < screenWidth / 2 ? 'left' : 'right';

        const currentTime = new Date().getTime();
        if (currentTime - lastTapTime < 300) { // Assuming 300ms is the threshold for a double tap
            tapCount++;
            if (tapCount === 2) {
                // Double tap detected, start sprinting
                startSprint(direction);
                tapCount = 0; // Reset tap count
            }
        } else {
            tapCount = 1; // Reset tap count if it's not a double tap
        }
        lastTapTime = currentTime;
    });

    document.addEventListener('touchend', e => {
        // Ensure the touchend event is not immediately after a double tap
        const currentTime = new Date().getTime();
        if (currentTime - lastTapTime > 300) {
            stopSprint();
        }
    });
}
