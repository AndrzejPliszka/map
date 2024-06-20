const firstObjectStartingPosition = [];
let startingWidth = null;

function getMap(){
  if(checkIfOnPhone()){
    showInformationWindow("phone")
  }
  else{
    if(!sessionStorage.getItem('startingInformationShown')){
      showInformationWindow("information");
    }
    
  }
  const date = document.getElementById("date_input").value;
  if(localStorage.getItem("savedDates") !== null){
    if (JSON.parse(localStorage.getItem("savedDates")).includes(date)){
      getDataFromLocalStorage(date); //this also displays data      
    }
    else{
      downloadMap()
    }
  }
  else{
    downloadMap()
  }
}
function downloadMap() {
  console.log("downloading has begun")
  const date = document.getElementById("date_input").value;
  let dateParam = new URLSearchParams({"date": date}).toString();
  const apiUrl = `https://quilled-nervous-leopon.glitch.me/download-map?${dateParam}`;
  saveMapTagInfo();
  saveBattles();
  saveSvgIcons();
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      for(let i = 0; i < data.svg_code.length; i++){
        data.svg_code[i] = data.svg_code[i].replace("<svg", `<svg preserveAspectRatio='none'`)
      }
      addDateToStorage(date);
      saveMapToIndexedDB(data)
      displayMap(data)
    })
    .catch(error => {
      console.error('Fetch error:', error.message);
      window.location.reload();
    });
}
function makeElementsClickable() {
  const date = document.getElementById("date_input").value;
  let dateParam = new URLSearchParams({"date": date}).toString();
  const apiUrl = `https://quilled-nervous-leopon.glitch.me/get-clickable-countries?${dateParam}`;
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      updateServerStatus();
      for(let i = 0; i < data.countries.length; i++){
        if(document.getElementById(data.countries[i].tag)){
          document.getElementById(data.countries[i].tag).addEventListener("click", () => {infoboxManager(document.getElementById(data.countries[i].tag))});
        }
      }
    })
    .catch(error => {
      console.error('Fetch error:', error.message);
    });
}

function displayMap(data){
    const resultElement = document.getElementById('svg-container');
    let offsetX, offsetY, widthOffset;
    if(resultElement.firstElementChild){
      offsetX = (resultElement.firstElementChild.getBoundingClientRect().left - resultElement.getBoundingClientRect().left - 2);
      offsetY = (resultElement.firstElementChild.getBoundingClientRect().top - resultElement.getBoundingClientRect().top - 2);
      widthOffset = resultElement.firstElementChild.getBoundingClientRect().width / Number(data.width[0]);
    }
    else{
      offsetX = 0;
      offsetY = 0;
      widthOffset = 1;
    }
    resultElement.innerHTML = "";
    for(let i = 0; i < data.tag.length; i++){
      resultElement.insertAdjacentHTML('beforeend', data.svg_code[i]);
      let svgElement = resultElement.lastChild;
      svgElement.style.left = `${Number(data.x_pos[i])*widthOffset + offsetX}px`;
      svgElement.style.top = `${Number(data.y_pos[i])*widthOffset + offsetY}px`;
      svgElement.style.width = `${data.width[i] * widthOffset}px`;
    }
    
    firstObjectStartingPosition.push(Number(data.x_pos[0]));
    firstObjectStartingPosition.push(Number(data.y_pos[0]));
    startingWidth = data.width[0];
    displayBattles([offsetX, offsetY], widthOffset);
    initializeMapManager();
    infoboxManager();
    changeTimeline();
    setupMapDisplaySettings();
    makeElementsClickable();
}

