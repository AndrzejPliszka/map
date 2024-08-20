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
      console.log(data)
      updateServerStatus();
      for(let i = 0; i < data.countriesWithInfo.length; i++){
        if(document.getElementsByClassName(data.countriesWithInfo[i])){
          let elements = document.getElementsByClassName(data.countriesWithInfo[i]);
          for (j = 0; j < elements.length; j++){
            let clickedElement = document.getElementsByClassName(data.countriesWithInfo[i])[j];
            clickedElement.addEventListener("click", () => {infoboxManager(clickedElement, true)});
            clickedElement.addEventListener("mouseover", () => {Array.from(document.getElementsByClassName(clickedElement.className.baseVal)).forEach(element => element.setAttribute("filter", "brightness(80%)"))});
            clickedElement.addEventListener("mouseout", () => {Array.from(document.getElementsByClassName(clickedElement.className.baseVal)).forEach(element => element.setAttribute("filter", "none"))});
          }
        }
      }
      for(let i = 0; i < data.countriesWithoutInfo.length; i++){
        if(document.getElementsByClassName(data.countriesWithoutInfo[i])){
          let elements = document.getElementsByClassName(data.countriesWithoutInfo[i]);
          for (j = 0; j < elements.length; j++){
            let clickedElement = document.getElementsByClassName(data.countriesWithoutInfo[i])[j];
            clickedElement.addEventListener("click", () => {infoboxManager(clickedElement, false)});
            console.log(clickedElement.className);
            clickedElement.addEventListener("mouseover", () => {Array.from(document.getElementsByClassName(clickedElement.className.baseVal)).forEach(element => element.setAttribute("filter", "brightness(90%)"))});
            clickedElement.addEventListener("mouseout", () => {Array.from(document.getElementsByClassName(clickedElement.className.baseVal)).forEach(element => element.setAttribute("filter", "none"))});
          }
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

function downloadMapRange(){
  let dateParam = new URLSearchParams({"startDate": "1914-07-28", "endDate": "1918-11-11"}).toString();
  const apiUrl = `https://quilled-nervous-leopon.glitch.me/download-map-range?${dateParam}`;
  fetch(apiUrl)
    .then(res => {return res.json()})
    .then(data => console.log(data))
    .catch(err => console.log(err));
}
