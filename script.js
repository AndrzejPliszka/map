document.addEventListener("DOMContentLoaded", function() {

    //get data from setup.txt
    const url = 'setup.txt';
    let textData;
    fetch(url)
    .then(response => response.text())
    .then((data) => {
        textData = data;
        //extract file names from setup.txt
    let textFiles = textData.match(/[^;]*/g);
    console.log(textFiles);
    //display svg with extracted names 
    const svgContainer = document.getElementById("svg-container");
    for(let i = 0; i < textFiles.length; i++){
        const objectElement = document.createElement("object");
        objectElement.type = "image/svg+xml";
        console.log(textFiles[i]);
        objectElement.data = `maps/${textFiles[i]}`;
        svgContainer.appendChild(objectElement);
    }    
    })
    .catch(error => console.error('error:', error));
});
