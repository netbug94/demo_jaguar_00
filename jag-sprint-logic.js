export function attachSprintHandler(jaguar, updatePosition, manageInterval) {
    let isSprinting = false;
    let sprintFrameIndex = 2;

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
            updatePosition(direction, 24);  // Use a larger step size for sprinting
            updateJaguarImage(direction);
        }, 30);  // Faster update interval for sprinting
        manageInterval(newIntervalID);  // Pass the new interval ID back to main.js to manage it
    }

    function stopSprint() {
        isSprinting = false;
        manageInterval();  // Clear the sprint interval by invoking manageInterval without a new ID
    }

    document.addEventListener('keydown', e => {
        if (e.shiftKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !isSprinting) {
            startSprint(e.key === 'ArrowRight' ? 'right' : 'left');
        }
    });

    document.addEventListener('keyup', e => {
        if (e.key === 'Shift') {
            stopSprint();
        }
    });
}
