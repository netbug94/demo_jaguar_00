export function adjustJaguarSize() {
    console.log("Adjusting Jaguar Size");
    const jaguar = document.getElementById('jaguar');
    const screenHeight = window.innerHeight;
    const newHeight = screenHeight * 0.19;  // Adjusted based on your requirement
    jaguar.style.height = `${newHeight}px`;
    jaguar.style.width = 'auto';
}
