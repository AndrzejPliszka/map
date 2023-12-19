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
            console.log(objectProperty);
            const objectElement = document.createElement("object");
            objectElement.type = "image/svg+xml";
            console.log(objectData[i]);
            objectElement.data = `maps/${objectData[i]}`;
            svgContainer.appendChild(objectElement);
        }    
    })
    .catch(error => console.error('error:', error));
});
