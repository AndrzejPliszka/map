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
      let offsetX, offsetY, widthOffset;
    console.log(resultElement.firstElementChild);
    if(resultElement.firstElementChild){
      offsetX = (resultElement.firstElementChild.getBoundingClientRect().left - resultElement.getBoundingClientRect().left - 2);
      offsetY = (resultElement.firstElementChild.getBoundingClientRect().top - resultElement.getBoundingClientRect().top - 2);
      widthOffset = resultElement.firstElementChild.getBoundingClientRect().width / Number(data.width[0]);
      console.log(widthOffset)
    }
    else{
      offsetX = 0;
      offsetY = 0;
      widthOffset = 1;
    }
    console.log(offsetX, offsetY);
    resultElement.innerHTML = "";
    for(let i = 0; i < data.tag.length; i++){
      resultElement.insertAdjacentHTML('beforeend', data.svg_code[i]);
      let svgElement = resultElement.lastChild;
      svgElement.style.left = `${Number(data.x_pos[i])*widthOffset + offsetX}px`;
      console.log(data.x_pos[i] + offsetX, data.x_pos[i], offsetX);
      svgElement.style.top = `${Number(data.y_pos[i])*widthOffset + offsetY}px`;
      svgElement.style.width = `${data.width[i] * widthOffset}px`;
      console.log(`${data.width[i] * widthOffset}px`);
    }

    initializeMapManager();
    infoboxManager();
    changeTimeline();
    setupMapDisplaySettings(data.tag);
}
