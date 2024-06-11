let lastDateOnTimeline = document.getElementById("end_date").value;
let playingDelay = 1000;
let mapDisplaySettings = {};
function changeTime(time_amount, should_increase){
  const dateObject = document.getElementById("date_input");
  let date = new Date(dateObject.value);
  switch(time_amount){
      case "day":
        should_increase ? date.setDate(date.getDate() + 1) : date.setDate(date.getDate() - 1);
        break;
  }
  dateObject.value = date.toISOString().slice(0, 10);
  if(dateObject.value >= lastDateOnTimeline){
    stopVideoPlaying();
  }
  getMap();
  
}

let intervalId;

document.getElementById('playVideo').addEventListener('click', () => {
    document.getElementById("playVideo").style.display = "none";
    document.getElementById("stopVideo").style.display = "initial";
    if (!intervalId) {
        intervalId = setInterval(changeTime, playingDelay, "day", true);
    }
});

document.getElementById('stopVideo').addEventListener('click', stopVideoPlaying);

function stopVideoPlaying(){
  document.getElementById("playVideo").style.display = "initial";
  document.getElementById("stopVideo").style.display = "none";
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
}
}

document.addEventListener("keydown", (event) => {
  if(event.keyCode === 39){
    changeTime("day", true);
  }
  if(event.keyCode === 37){
    changeTime("day", false);
  }
});

function setupTimeline() {
  let timelineStartDate = document.getElementById("start_date").value;
  let timelineEndDate = document.getElementById("end_date").value;
  lastDateOnTimeline = timelineEndDate;
  const timelineInput = document.getElementById("timeline");
  var startDate = new Date(timelineStartDate);
  var endDate = new Date(timelineEndDate);
  var daysDifference = Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  timelineInput.min = 0;
  timelineInput.max = daysDifference;
  changeTimeline();
  timelineInput.addEventListener("input", (e) => {
      var currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + parseInt(timelineInput.value));
      document.getElementById("date_input").value = currentDate.toISOString().slice(0, 10);
      downloadMap();
  });
}

function changeTimeline(){
  currentDate = new Date(document.getElementById("date_input").value);
  startDate = new Date(document.getElementById("start_date").value);
  let daysDifference = Math.ceil(Math.abs(currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  if(currentDate.getTime() - startDate.getTime() < 0){daysDifference *= -1};
  document.getElementById("timeline").value = daysDifference;
}

document.addEventListener("DOMContentLoaded", setupTimeline());

function setupMapDisplaySettings(){
  if(localStorage.getItem("mapTagData")){
    let mapTags = JSON.parse(localStorage.getItem("mapTagData"));
    tagsOnThisDay = [];
    for(i in mapTags){
      if(mapTags[i].start_date <= document.getElementById("date_input").value && mapTags[i].end_date >= document.getElementById("date_input").value){
        tagsOnThisDay.push(mapTags[i]);
      }
    }
    mapTags = tagsOnThisDay;
    if(document.getElementsByClassName("Battle")){
      mapTags.push({category: "Other", tag_name: "Battle"});
    }
    let mapDisplaySettingsDiv = document.getElementById("map-display-settings");
    let lastCategory;
    mapDisplaySettingsDiv.innerHTML = "";
    for(let i = 0; i < Object.keys(mapTags).length; i++){
      if(mapTags[i].category !== undefined){
        if(mapTags[i].category !== lastCategory){
          mapDisplaySettingsDiv.insertAdjacentHTML('beforeend', `<h3>${mapTags[i].category}</h3>`);
          lastCategory = mapTags[i].category;
        }
      }
      if(!mapDisplaySettings.hasOwnProperty(mapTags[i].tag_name)) {mapDisplaySettings[mapTags[i].tag_name] = "checked";}
      mapDisplaySettingsDiv.insertAdjacentHTML('beforeend', `<p><input type="checkbox" value="${mapTags[i].tag_name}" ${mapDisplaySettings[mapTags[i].tag_name]}> ${mapTags[i].tag_name}</p>`);
      if(mapDisplaySettings[mapTags[i].tag_name] == false) {
        if(document.getElementById(mapTags[i].tag_name)){
          document.getElementById(mapTags[i].tag_name).style.visibility = "hidden";
        }
        else{
          for(let element of document.getElementsByClassName(mapTags[i].tag_name)){
            element.style.visibility = "hidden";
          }
        }
      }
      mapDisplaySettingsDiv.lastElementChild.addEventListener("change", (e) => {
        if(e.target.checked){
          if(document.getElementById(e.target.value)){
            document.getElementById(e.target.value).style.visibility = "visible";
          }
          else{
            for(let element of document.getElementsByClassName(e.target.value)){
              element.style.visibility = "visible";
            }
          }
          mapDisplaySettings[e.target.value] = "checked";
        } else{
          if(document.getElementById(e.target.value)){
            document.getElementById(e.target.value).style.visibility = "hidden";
          }
          else{
            for(element of document.getElementsByClassName(e.target.value)){
              element.style.visibility = "hidden";
            }
          }
          mapDisplaySettings[e.target.value] = "";
        }
        console.log(mapDisplaySettings);
      })
    }
  }
  else{setupMapDisplaySettings(); console.log("FAIL (problem)");}
}


function changeDelay(delay){
  playingDelay = delay;
} 