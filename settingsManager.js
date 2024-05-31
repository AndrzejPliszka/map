let lastDateOnTimeline = document.getElementById("end_date").value;

function changeTime(time_amount, should_increase){
  const dateObject = document.getElementById("date_input");
  let date = new Date(dateObject.value);
  switch(time_amount){
      case "day":
        should_increase ? date.setDate(date.getDate() + 1) : date.setDate(date.getDate() - 1);
        break;
  }
  dateObject.value = date.toISOString().slice(0, 10);
  console.log(dateObject.value >= lastDateOnTimeline, dateObject.value, lastDateOnTimeline);
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
        intervalId = setInterval(changeTime, 1000, "day", true);
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
function setupMapDisplaySettings(mapTags){
  let mapDisplaySettingsDiv = document.getElementById("map-display-settings");
  mapDisplaySettingsDiv.innerHTML = "";
  for(let i = 0; i < mapTags.length; i++){
    if(!mapDisplaySettingsDiv.hasOwnProperty(mapTags[i])) {mapDisplaySettingsDiv[mapTags[i]] = "checked"}
    mapDisplaySettingsDiv.insertAdjacentHTML('beforeend', `<p><input type="checkbox" value="${mapTags[i]}" ${mapDisplaySettingsDiv[mapTags[i]]}> ${mapTags[i]}</p>`);
    if(mapDisplaySettingsDiv.lastElementChild.lastElementChild.checked == false) {document.getElementById(mapTags[i]).style.visibility = "hidden";}
    mapDisplaySettingsDiv.lastElementChild.addEventListener("change", (e) => {
      if(e.target.checked){
        document.getElementById(e.target.value).style.visibility = "visible";
        mapDisplaySettingsDiv[e.target.value] = "checked";
      } else{
        document.getElementById(e.target.value).style.visibility = "hidden";
        mapDisplaySettingsDiv[e.target.value] = "";
      }
    })
  }
}
