document.addEventListener("DOMContentLoaded", function() {

    //get data from setup.txt
    const url = 'maps/file.txt';
    let textData;
    fetch(url)
    .then(response => response.text())
    .then(data => textData = data)
    .catch(error => console.error('error:', error));
    console.log(data)
    //extract file names from setup.txt
    let textFiles = textData.match(/[^;]*/g);
    console.log(textFiles);
    //display svg with extracted names
    const svgContainer = document.getElementById("svg-container");
    for(let i = 0; i < textFiles.length; i++){
        const objectElement = document.createElement("object");
        objectElement.type = "image/svg+xml";
        objectElement.data = `maps/${textFiles[i]}.svg`;
        svgContainer.appendChild(objectElement);
    }    
});
