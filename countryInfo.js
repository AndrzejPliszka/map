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
    const resultElement = document.getElementById('historic-info');
    const info = data.message;
    const graphicsUrl = "https://cdn.glitch.global/ba2d6357-bf92-45f0-aa0b-d4c301cb3d49";
    resultElement.innerHTML = `<div id="country-name">
            <h1>${info[0].name}</h1>
            <h2>${info[0].native_name}</h2>
        </div>
        <hr>
        <div id="national-symbols">
            <div id="flag">
                <img src="${graphicsUrl}/${info[0].tag}_Flag.png">
                <p>Flag</p>
            </div>
            <div id="coat">
                <img src="${graphicsUrl}/${info[0].tag}_CoA.png">
                <p>Coat of Arms</p>
            </div>
        </div>
        <hr>
        <div id="anthem">
            <audio controls>
              <source type="audio/ogg" src="https://upload.wikimedia.org/wikipedia/commons/f/f5/United_States_Navy_Band_-_Het_Wilhelmus_%28tempo_corrected%29.ogg">
            </audio>
            <p>Anthem "${info[0].anthem}"  (does not come from serv)</p>
        </div>
        <hr>
        <h3>${info[0].goverment_type}</h3>
        <div id="political-system">
            <div id="leader">
                <img src="${graphicsUrl}/${info[0].tag}_Leader.png"><br>
                <p>${info[0].leader_position}<br>${info[0].leader_name}</p>
                
            </div>
            <div id="secondary-leader">
                <img src="${graphicsUrl}/${info[0].tag}_SecondLeader.png"><br>
                <p>${info[0].second_leader_position}<br>${info[0].second_leader_name}</p>
                
            </div>
            <div id="parliament">
                <img src="${graphicsUrl}/${info[0].tag}_Parliament.png"><br>
                <p>${info[0].parlament}</p>
            </div>
        </div>
        <hr>
        <div id="other-info">
            <p>Official Language: ${info[0].official_language}</p>
            <p>Currency: ${info[0].currency}</p>
            <p>Capital City: ${info[0].capital}</p>
        </div>
        
    </div>`;
}
