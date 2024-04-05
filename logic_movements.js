// Initialize variables
let currentImageIndex = 1;
const maxImages = 19;
const imageElement = document.getElementById('jaguar-walking-image');
let jaguarPosition = 0; // Starting position
let moveAmount = 20; // Base amount to move the jaguar with each key press
let isMoving = false; // Flag to track if the jaguar is currently moving

// Function to update the image source
function updateImage() {
    imageElement.src = `resources/walk-cycle-jaguar/jaguar${currentImageIndex}.png`;
}

// Function to update the jaguar's position
function updatePosition() {
    imageElement.style.left = `${jaguarPosition}px`;
}

// Function to handle movement
function handleMovement(direction) {
    if (!isMoving) {
        isMoving = true;
        const moveInterval = setInterval(() => {
            if (direction === 'left') {
                currentImageIndex = currentImageIndex > 1 ? currentImageIndex - 1 : maxImages;
                // Increase the moveAmount for a longer distance
                moveAmount = currentImageIndex % 2 === 0 ? 20 : 5; // Example: vary between 10 and 5
                jaguarPosition -= moveAmount; // Move left
            } else if (direction === 'right') {
                currentImageIndex = currentImageIndex < maxImages ? currentImageIndex + 1 : 1;
                // Increase the moveAmount for a longer distance
                moveAmount = currentImageIndex % 2 === 0 ? 20 : 5; // Example: vary between 10 and 5
                jaguarPosition += moveAmount; // Move right
            }
            updateImage();
            updatePosition();
        }, 50); // Adjust the interval to make the jaguar move faster

        // Clear the interval when the key is released
        document.addEventListener('keyup', function keyupHandler(event) {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                clearInterval(moveInterval);
                isMoving = false;
                document.removeEventListener('keyup', keyupHandler);
            }
        }, { once: true }); // Use { once: true } to ensure the event listener is removed after the first invocation
    }
}


// Event listener for keydown
document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'ArrowLeft': // Left arrow
            handleMovement('left');
            break;
        case 'ArrowRight': // Right arrow
            handleMovement('right');
            break;
    }
});

// Initial image load and position
updateImage();
updatePosition();
