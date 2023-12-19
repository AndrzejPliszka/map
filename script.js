document.addEventListener("DOMContentLoaded", function() {
    const svgContainer = document.getElementById("svg-container");
    const objectElement = document.createElement("object");

    const url = 'maps/file.txt';

    fetch(url)
    .then(response => response.text())
    .then(data => {
        console.log('Zawartość pliku:', data);
        // Tutaj możesz dalej przetwarzać lub wyświetlać zawartość pliku
    })
    .catch(error => console.error('Błąd pobierania pliku:', error));


    // Set the type and data attributes for the SVG file
    objectElement.type = "image/svg+xml";
    objectElement.data = "mapa2.svg";

    // Append the object element to the container
    svgContainer.appendChild(objectElement);
});
