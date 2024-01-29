let timelineStartDate = "1914-06-28";
let timelineEndDate = "1914-06-30";


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

//set up timeline
document.addEventListener("DOMContentLoaded", (event) => {
  const timelineInput = document.getElementById("timeline");
  var startDate = new Date(timelineStartDate);
  var endDate = new Date(timelineEndDate);
  var daysDifference = Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  timelineInput.min = 0;
  timelineInput.max = daysDifference;
  timelineInput.addEventListener("input", (e) => {
      var currentDate = startDate;
      currentDate.setDate(currentDate.getDate() + timelineInput.value);
      console.log(currentDate);
      document.getElementById("date_input").value = currentDate.toISOString().slice(0, 10);
  })
});

