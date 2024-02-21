function changeTime(time_amount, should_increase){
  const dateObject = document.getElementById("date_input");
  let date = new Date(dateObject.value);
  switch(time_amount){
      case "day":
        should_increase ? date.setDate(date.getDate() + 1) : date.setDate(date.getDate() - 1);
        break;
  }
  dateObject.value = date.toISOString().slice(0, 10);
  downloadMap();
  
  console.log(time_amount, should_increase);
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
  document.getElementById("timeline").value = daysDifference;
}

document.addEventListener("DOMContentLoaded", setupTimeline());

let mapDisplaySettings = {};
function setupMapDisplaySettings(mapTags){
  let mapDisplaySettings = document.getElementById("map-display-settings");
  mapDisplaySettings.innerHTML = "";
  for(let i = 0; i < mapTags.length; i++){
    if(!mapDisplaySettings.hasOwnProperty(mapTags[i])) {mapDisplaySettings[mapTags[i]] = "checked"}
    mapDisplaySettings.insertAdjacentHTML('beforeend', `<p><input type="checkbox" value="${mapTags[i]}" ${mapDisplaySettings[mapTags[i]]}> ${mapTags[i]}</p>`);
    console.log(mapDisplaySettings.lastElementChild)
    if(mapDisplaySettings.lastElementChild.checked == false) {document.getElementById(mapTags[i]).style.visibility = "hidden";}
    mapDisplaySettings.lastElementChild.addEventListener("change", (e) => {
      if(e.target.checked){
        document.getElementById(e.target.value).style.visibility = "visible";
        mapDisplaySettings[e.target.value] = "checked";
      } else{
        document.getElementById(e.target.value).style.visibility = "hidden";
        mapDisplaySettings[e.target.value] = "";
      }
    })
  }
}
