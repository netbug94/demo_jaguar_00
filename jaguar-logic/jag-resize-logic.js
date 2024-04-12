// This will use Height
export function adjustJaguarSize() {
    console.log("Adjusting Jaguar Size");
    const jaguar = document.getElementById('jaguar');
    const screenHeight = window.innerHeight;
    const newHeight = screenHeight * 0.18;  // Adjusted based on your requirement
    jaguar.style.height = `${newHeight}px`;
    jaguar.style.width = 'auto';
}

// This will use Width
/*
export function adjustJaguarSize() {
    console.log("Adjusting Jaguar Size");
    const jaguar = document.getElementById('jaguar');
    const screenWidth = window.innerWidth;
    const newWidth = screenWidth * 0.19;  // Adjusted based on your requirement
    jaguar.style.height = 'auto';
    jaguar.style.width = `${newWidth}px`;
}
*/

// This will use Both
/*
export function adjustJaguarSize() {
    console.log("Adjusting Jaguar Size");
    const jaguar = document.getElementById('jaguar');
    const screenWidth = window.innerWidth;
    const newWidth = screenWidth * 0.20;  // Adjusted based on your requirement
    jaguar.style.height = 'auto';
    jaguar.style.width = `${newWidth}px`;
    

    const screenHeight = window.innerHeight;
    const newHeight = screenHeight * 0.20;  // Adjusted based on your requirement
    jaguar.style.height = `${newHeight}px`;
    jaguar.style.width = 'auto';

}
*/