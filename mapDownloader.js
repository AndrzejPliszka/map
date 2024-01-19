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
    const mapTags = data.tag_info;
    console.log(svgMaps);
    resultElement.innerHTML = "";
    for(let i = 0; i < svgMaps.length; i++){
      let countryTag = svgMaps[i].map_tag;
      resultElement.insertAdjacentHTML('beforeend', svgMaps[i].svg_code);
      resultElement.lastChild.style.left = mapTags[1-i].x_pos;
      resultElement.lastChild.style.top = mapTags[1-i].y_pos;
      resultElement.lastChild.style.width = mapTags[1-i].width;
    }
    
    initializeMapManager()
}
