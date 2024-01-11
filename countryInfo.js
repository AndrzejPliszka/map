function getCountryInfoFromServ(clickedElement) {
  console.log(clickedElement);
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
      displayCountryInfo()
    })
    .catch(error => {
      console.error('Fetch error:', error.message);
    });
}

function displayCountryInfo(){
    const resultElement = document.getElementById('historic-info');
    const info = data.message;
    resultElement.innerHTML = `<h1>${JSON.stringify(info[name])}</h1>`;
}
