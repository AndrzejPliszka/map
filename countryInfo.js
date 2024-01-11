const svgElements = document.getElementsByTagName("svg");
for(let i = 0; i < draggableElements.length; i++){
  svgElements[i].addEventListener('click', () => getCountryInfoFromServ(svgElements[i]));
}


function getCountryInfoFromServ(clickedElement) {
  const apiUrl = "https://quilled-nervous-leopon.glitch.me/";
  console.log(clickedElement.className);
  fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'},
      body: JSON.stringify({
        tag: `${clickedElement.className}`
      })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      const resultElement = document.getElementById('historic-info');
      resultElement.innerHTML = `<p>${JSON.stringify(data.message)}</p>`;
    })
    .catch(error => {
      console.error('Fetch error:', error.message);
    });
}
