let currentlyClickedCountry = undefined;

function getCountryInfoFromServ(clickedElement) {
  console.log(currentlyClickedCountry);
  typeof clickedElement == "undefined" ? clickedElement = currentlyClickedCountry : null;
  currentlyClickedCountry = clickedElement;
  console.log(currentlyClickedCountry);
  const apiUrl = "https://quilled-nervous-leopon.glitch.me/download-country-info";
  fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'},
      body: JSON.stringify({
        tag: `${clickedElement.className.baseVal}`,
        date: `${document.getElementById("date_input").value}`
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
            <h1>${info.name}</h1>
            <h2>${info.native_name}</h2>
        </div>
        <hr>
        <div id="national-symbols">
            <div id="flag">
                <img src="${graphicsUrl}/${info.tag}_Flag.png">
                <p>Flag</p>
            </div>
            <div id="coat">
                <img src="${graphicsUrl}/${info.tag}_CoA.png">
                <p>Coat of Arms</p>
            </div>
        </div>
        <hr>
        <div id="anthem">
            <audio controls>
              <source type="audio/ogg" src="https://upload.wikimedia.org/wikipedia/commons/f/f5/United_States_Navy_Band_-_Het_Wilhelmus_%28tempo_corrected%29.ogg">
            </audio>
            <p>Anthem "${info.anthem}"  (does not come from serv)</p>
        </div>
        <hr>
        <h3>${info.goverment_type}</h3>
        <div id="political-system">
            <div id="leader">
                <img src="${graphicsUrl}/${info.tag}_Leader.png"><br>
                <p>${info.leader_position}<br>${info.leader_name}</p>
                
            </div>
            <div id="secondary-leader">
                <img src="${graphicsUrl}/${info.tag}_SecondLeader.png"><br>
                <p>${info.second_leader_position}<br>${info.second_leader_name}</p>
                
            </div>
            <div id="parliament">
                <img src="${graphicsUrl}/${info.tag}_Parliament.png"><br>
                <p>${info.parlament}</p>
            </div>
        </div>
        <hr>
        <div id="other-info">
            <p>Official Language: ${info.official_language}</p>
            <p>Currency: ${info.currency}</p>
            <p>Capital City: ${info.capital}</p>
        </div>
        
    </div>`;
}


function getCountryDescription(){
  console.log(currentlyClickedCountry);
  const apiUrl = "https://quilled-nervous-leopon.glitch.me/download-country-description";
  fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'},
      body: JSON.stringify({
        tag: `${currentlyClickedCountry.className.baseVal}`,
        date: `${document.getElementById("date_input").value}`
      })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      document.getElementById('historic-info').innerHTML = data.message.description;
    })
    .catch(error => {
      console.error('Fetch error:', error.message);
    });
}

function getWorldEvents(){
  const apiUrl = "https://quilled-nervous-leopon.glitch.me/download-current-events";
  fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'},
      body: JSON.stringify({
        date: `${document.getElementById("date_input").value}`
      })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data.events)
      console.log(data.battles)
      console.log(data.wars)
      document.getElementById('historic-info').innerHTML = `
        <h2>Current Events:</h2>
        <li><ul>${data.events != [] ? data.events.join("</ul><ul>") : "Nothing interesting happened on this day"}</ul></li>
        <hr>
        <h2>Current Battles</h2><br>
        <li><ul>${data.battles != [] ? data.battles.join("</ul><ul>") : "There was no battles on this day"}</ul></li>
        <hr>
        <h2>Current Wars</h2><br>
        <li><ul>${data.wars != [] ? data.wars.join("</ul><ul>") : "There was no wars on this day"}</ul></li>
        <hr>`
    })
    .catch(error => {
      console.error('Fetch error:', error.message);
    });
}

