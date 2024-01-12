function getCountryInfoFromServ(clickedElement) {
  const apiUrl = "https://quilled-nervous-leopon.glitch.me/";
  console.log(clickedElement.className);
  fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'},
      body: JSON.stringify({
        tag: `${clickedElement.className.baseVal}`
      })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      displayCountryInfo(data)
    })
    .catch(error => {
      console.error('Fetch error:', error.message);
    });
}

function displayCountryInfo(data){
    console.log(data.message);
    const resultElement = document.getElementById('historic-info');
    const info = JSON.parse(data.message);
    console.log(info);
    resultElement.innerHTML = `<h1>${JSON.stringify(info[0].name)}</h1>`;
}
