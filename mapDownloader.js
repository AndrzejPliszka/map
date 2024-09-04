const firstObjectStartingPosition = [];
let startingWidth = null;

async function getMap(){
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
      let sigmus = await getCountryShapes(date); //this also displays data 
      displayMap(sigmus);
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
  saveClickableElements();
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
      addDateToStorage(date);
      saveCountryShapesToIndexedDB(data);
      displayMap(data)
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}
function downloadClickableElements() {
  console.log("anty sigma");
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
      saveClickableElements()
      makeElementsClickable();
    })
    .catch(error => {
      console.error('Fetch error:', error.message);
    });
}

function makeElementsClickable(){
  data = JSON.parse(localStorage.getItem("ClickableCountries"));
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
        clickedElement.addEventListener("mouseover", () => {Array.from(document.getElementsByClassName(clickedElement.className.baseVal)).forEach(element => element.setAttribute("filter", "brightness(90%)"))});
        clickedElement.addEventListener("mouseout", () => {Array.from(document.getElementsByClassName(clickedElement.className.baseVal)).forEach(element => element.setAttribute("filter", "none"))});
      }
    }
  }
}
const leftMapOffset = -18000;
const topMapOffset = -9000;
const mapWidth = 36000;
const mapHeight = 18000;


function displayMap(data){
    const resultElement = document.getElementById('svg-container');
    let offsetX, offsetY, widthOffset;
    if(resultElement.firstElementChild){
      widthOffset = resultElement.firstElementChild.getBoundingClientRect().width / mapWidth;
      offsetX = (resultElement.firstElementChild.getBoundingClientRect().left - resultElement.getBoundingClientRect().left - 2) - leftMapOffset*widthOffset;
      offsetY = (resultElement.firstElementChild.getBoundingClientRect().top - resultElement.getBoundingClientRect().top - 2) - topMapOffset*widthOffset;
    }
    else{
      offsetX = 0;
      offsetY = 0;
      widthOffset = 1;
    }
    resultElement.innerHTML = "";
    let svgElementCode = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 1000' preserveAspectRatio='none'>";
    for(let i = 0; i < data.length; i++){
      for(let j = 0; j < data[i].svg_code.length; j++){
        svgElementCode += `<polygon class="${data[i].name}" points="${data[i].svg_code[j]}"> </polygon>`;
      }
    }
    svgElementCode += "</svg>";
    resultElement.insertAdjacentHTML('beforeend', svgElementCode);
    let svgElement = resultElement.lastChild;
    svgElement.style.left = `${leftMapOffset*widthOffset + offsetX}px`;
    svgElement.style.top = `${topMapOffset*widthOffset + offsetY}px`;
    svgElement.style.width = `${mapWidth * widthOffset}px`;
    firstObjectStartingPosition.push(leftMapOffset);
    firstObjectStartingPosition.push(topMapOffset);
    startingWidth = mapWidth;
    displayBattles([offsetX, offsetY], widthOffset);
    initializeMapManager();
    infoboxManager();
    changeTimeline();
    makeElementsClickable();
}

async function downloadMapRange(startDate, endDate){
  if(!isUnsavedDayBetween(startDate, endDate)){
    return;
  }
  let dateParam = new URLSearchParams({"startDate": startDate, "endDate": endDate}).toString();
  const apiUrl = `https://quilled-nervous-leopon.glitch.me/download-map-range?${dateParam}`;
  fetch(apiUrl)
    .then(res => {return res.json()})
    .then(data => {
      console.log("SIMGA SIE WYKONUJE !!!")
      saveCountryShapesToIndexedDB(data)
      saveAllDatesBetween(startDate, endDate)
    })
    .catch(err => console.log(err));
}
