function downloadMap(date) {
  console.log("downloadingMap has begun")
  const apiUrl = "https://quilled-nervous-leopon.glitch.me/download-map";
  fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'},
      body: JSON.stringify({
        date: `${date}`
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
    const svgMaps = data.svg_maps;
    console.log(svgMaps);
    resultElement.innerHTML = "";
    for(let i = 0; i < svgMaps.length; i++){
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "span");
    svgElement.innerHTML = svgMaps[i].svg_code;
    resultElement.appendChild(svgElement);
      
    }
    
    initializeMapManager()
}
