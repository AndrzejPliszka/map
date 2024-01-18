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
      let test = resultElement.insertAdjacentHTML('beforeend', svg_maps[i].svg_code);
      console.log(test)
    }
    
    initializeMapManager()
}
