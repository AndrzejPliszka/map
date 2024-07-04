let currentlyClickedCountry = undefined;
let currentInfoboxInfo = "events";

function infoboxManager(clickedElement) {
  if(clickedElement !== undefined){currentlyClickedCountry = clickedElement}
  switch(currentInfoboxInfo){
    case "events":
      
      clickedElement == undefined ? getWorldEvents() : getCountryInfo();
      break;
    case "description":
      
      getCountryDescription();
      break;
    case "country-info":
      
      getCountryInfo();
      break;
  }
}

function getCountryInfo() {
  currentInfoboxInfo = "country-info";
  if(currentlyClickedCountry == undefined) {
    getWorldEvents(); 
    document.getElementById("currentEventsButton").className = "active";
    document.getElementById("countryInfoButton").className = "locked";
    document.getElementById("descriptionButton").className = "locked";
    return 0;
  }
  params = {
    tag: `${currentlyClickedCountry.className.baseVal}`,
    date: `${document.getElementById("date_input").value}`
  }
  params = new URLSearchParams(params).toString();
  const apiUrl = `https://quilled-nervous-leopon.glitch.me/get-country-info?${params}`;
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if(data.name !== undefined){
        displayCountryInfo(data);} 
      else{getCountryDescription();
        document.getElementById("currentEventsButton").className = "available";
        document.getElementById("countryInfoButton").className = "locked";
        document.getElementById("descriptionButton").className = "active";
      }
      
    })
    .catch(error => {
      console.error('Fetch error:', error.message);
    });
}

function displayCountryInfo(data){
    document.getElementById("currentEventsButton").className = "available";
    document.getElementById("countryInfoButton").className = "active";
    document.getElementById("descriptionButton").className = "available";
    const resultElement = document.getElementById('historic-info');
    resultElement.innerHTML = `<div id="country-name">
            <h1>${data.name}</h1>
            <h2>${data.native_name}</h2>
        </div>
        <hr>
        <div id="national-symbols">
            <div id="flag">
                <img src="${data.flag_file_id}">
                <p>Flag</p>
            </div>
            <div id="coat">
                <img src="${data.coa_file_id}">
                <p>Coat of Arms</p>
            </div>
        </div>
        <hr>
        <div id="anthem">
            <audio controls>
              <source type="audio/ogg" src="${data.anthem_file_id}">
            </audio>
            <p>Anthem "${data.anthem_name}"</p>
        </div>
        <hr>
        <h3>${data.goverment_type}</h3>
        <div id="political-system">
            <div id="leader">
                <img src="${data.leader_file_id}"><br>
                <p>${data.leader_position}<br>${data.leader_name}</p>
            </div>
            <div id="secondary-leader">
                <img src="${data.secondary_leader_file_id}"><br>
                <p>${data.secondary_leader_position}<br>${data.secondary_leader_name}</p>
            </div>
            <div id="parliament">
                <img src="${data.parliament_file_id}"><br>
                <p>${data.parliament_name}</p>
            </div>
        </div>
        <hr>
        <div id="other-info">
            <p>Currency: ${data.currency}</p>
            <p>Capital City: ${data.capital}</p>
        </div>
        <hr/>
    </div>`;
}


function getCountryDescription(){
  document.getElementById("currentEventsButton").className = "available";
  document.getElementById("countryInfoButton").className = "available";
  document.getElementById("descriptionButton").className = "active";
  currentInfoboxInfo = "description";
  if(currentlyClickedCountry == undefined) {
    document.getElementById("currentEventsButton").className = "active";
    document.getElementById("countryInfoButton").className = "locked";
    document.getElementById("descriptionButton").className = "locked";
    getWorldEvents(); 
    return 0;
  }
  params = {
    tag: `${currentlyClickedCountry.className.baseVal}`,
    date: `${document.getElementById("date_input").value}`
  }
  params = new URLSearchParams(params).toString();
  const apiUrl = `https://quilled-nervous-leopon.glitch.me/get-country-description?${params}`;
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if(data !== undefined){ 
        document.getElementById('historic-info').innerHTML = `<span><h1>${data.name}</h1></span>
        <div id="description">${data.description}</div>`}
      else{getWorldEvents()
        document.getElementById("currentEventsButton").className = "active";
        document.getElementById("countryInfoButton").className = "locked";
        document.getElementById("descriptionButton").className = "locked";
      };
    })
    .catch(error => {
      console.error('Fetch error:', error.message);
    });
}

function getWorldEvents(){
  document.getElementById("currentEventsButton").className = "active";
  if(document.getElementById("countryInfoButton").className === "active") document.getElementById("countryInfoButton").className = "available";
  if(document.getElementById("descriptionButton").className === "active") document.getElementById("descriptionButton").className = "available";
  currentInfoboxInfo = "events";
  const date = document.getElementById("date_input").value;
  let dateParam = new URLSearchParams({"date": date}).toString();
  const apiUrl = `https://quilled-nervous-leopon.glitch.me/get-current-events?${dateParam}`;
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      let warFormat = "";
      for(let i = 0; i < data.wars.length; i++){
        warFormat += `<ul><p>${data.wars[i]}</p><span>${data.warCountries[i][0].map((object) => `<p>${object}</p>`).join('')}</span>vs<span>${data.warCountries[i][1].map((object) => `<p>${object}</p>`).join('')}</ul></span>`
      }

      document.getElementById('historic-info').innerHTML = `
        <h2>Current Events:</h2>
        <li><ul>${data.events.length !== 0 ? data.events.join("</ul><ul>") : "Nothing interesting happened on this day"}</ul></li>
        <hr>
        <h2>Current Battles</h2>
        <li><ul>${data.battles.length !== 0 ? data.battles.join("</ul><ul>") : "There were no battles on this day"}</ul></li>
        <hr>
        <h2>Current Wars</h2>
        <li>${warFormat === '' ? "There were no wars during this day" : warFormat}</li>
        <hr>`
    })
    .catch(error => {
      console.error('Fetch error:', error.message);
    });
}

