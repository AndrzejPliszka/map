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
        document.getElementById(data.countries[i].tag).addEventListener("click", () => {infoboxManager(document.getElementById(data.countries[i].tag))});
      }
    })
    .catch(error => {
      console.error('Fetch error:', error.message);
      window.location.reload();
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
      console.log(data.x_pos[i], widthOffset, offsetX)
      svgElement.style.left = `${Number(data.x_pos[i])*widthOffset + offsetX}px`;
      svgElement.style.top = `${Number(data.y_pos[i])*widthOffset + offsetY}px`;
      svgElement.style.width = `${data.width[i] * widthOffset}px`;
    }
    
    firstObjectStartingPosition.push(Number(data.x_pos[0]));
    firstObjectStartingPosition.push(Number(data.y_pos[0]));
    startingWidth = data.width[0];
    //displaySvgInCords([0, 0], `<svg id="sw-js-blob-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sw-gradient" x1="0" x2="1" y1="1" y2="0"><stop id="stop1" stop-color="rgba(248, 117, 55, 1)" offset="0%"></stop>                            <stop id="stop2" stop-color="rgba(251, 168, 31, 1)" offset="100%"></stop>                        </linearGradient>                    </defs>                <path fill="url(#sw-gradient)" d="M34.5,-9.6C39.1,3,33.5,20.6,21.2,29.6C9,38.6,-9.8,39,-20.4,30.7C-31,22.4,-33.3,5.4,-28.6,-7.5C-23.8,-20.3,-11.9,-29.1,1.5,-29.6C14.9,-30.1,29.9,-22.3,34.5,-9.6Z" width="100%" height="100%" transform="translate(50 50)" stroke-width="0" style="transition: all 0.3s ease 0s;"></path></svg>`, [offsetX, offsetY], 1000, widthOffset, 'Battle')
    initializeMapManager();
    infoboxManager();
    changeTimeline();
    setupMapDisplaySettings();
    makeElementsClickable();
}

