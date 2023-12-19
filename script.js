document.addEventListener("DOMContentLoaded", function() {

    //get data from setup.txt
    const url = 'setup.txt';
    let textData;
    fetch(url)
    .then(response => response.text())
    .then((data) => {
        //extract file names from setup.txt
        let objectData = data.split(/;\s*/);
        console.log(objectData);
        //display svg with extracted names 
        const svgContainer = document.getElementById("svg-container");
        for(let i = 0; i < objectData.length; i++){
            let objectProperty = objectData[i].split(/\s+/);
            let name = objectProperty[0];
            let xPos = objectProperty[1];
            let yPos = objectProperty[2];
            let width = objectProperty[3];
            const svgElement = document.createElement("object");
            svgElement.type = "image/svg+xml";
            svgElement.data = `maps/${name}`;
            svgElement.style = {
                left: xPos;
                top: yPos;
                width: width;
            }
            svgContainer.appendChild(svgElement);
        }    
    })
    .catch(error => console.error('error:', error));
});
