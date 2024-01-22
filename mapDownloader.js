function downloadMap() {
  console.log("downloadingMap has begun")
  const apiUrl = "https://quilled-nervous-leopon.glitch.me/download-map";
  const date = document.getElementById("date_input").value;
  fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'},
      body: JSON.stringify({
        date: date
      })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      displayMap(data)
    })
    .catch(error => {
      console.error('Fetch error:', error.message);
    });
}

function displayMap(data){
    const resultElement = document.getElementById('svg-container');
      let offsetX, offsetY;
    console.log(resultElement.firstChild);
    if(resultElement.firstChild){
      offsetX = resultElement.firstChild.offsetLeft;
      offsetY = resultElement.firstChild.offsetTop;
    }
    else{
      offsetX = 0;
      offsetY = 0;
    }
    console.log(offsetX, offsetY);
    resultElement.innerHTML = "";
    for(let i = 0; i < data.tag.length; i++){
      resultElement.insertAdjacentHTML('beforeend', data.svg_code[i]);
      let svgElement = resultElement.lastChild;
      svgElement.style.left = `${Number(data.x_pos[i]) + offsetY}px`;
      console.log(data.x_pos[i] + offsetY, data.x_pos[i], offsetY);
      svgElement.style.top = `${Number(data.y_pos[i]) + offsetX}px`;
      console.log(data.width[i] * zoomLevel, zoomLevel);
      svgElement.style.width = data.width[i];
    }
    
    initializeMapManager()
}
