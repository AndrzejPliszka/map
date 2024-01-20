function changeTime(time_amount, should_increase){
  const dateObject = document.getElementById("date_input");
  let date = Date.parse(dateObject.value);
  switch(time_amount){
      case "day":
        date = should_increase ? date.setDate(date.getDate + 1) : date.setDate(date.getDate - 1);
  }
  dateObject.value = dateObject.toISOString.slice(0, 10);
  downloadMap();
  
  console.log(time_amount, should_increase);
}
