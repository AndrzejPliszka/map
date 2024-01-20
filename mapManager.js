let offsetsX = [], offsetsY = [];
let zoomLevel = 1;
for(let i = 0; i <  document.querySelectorAll('svg').length; i++){
    offsetsX.push("");
    offsetsY.push("");
  
function initializeMapManager(){
  const draggableElements = document.querySelectorAll('svg');
  var container = document.getElementById('svg-container');
  let isDragging = false;
  let offsetsX = [], offsetsY = [];
  let zoomLevel = 1;
  for(let i = 0; i <  document.querySelectorAll('svg').length; i++){
      offsetsX.push("");
      offsetsY.push("");
};

container.addEventListener('mousedown', (event) => {
    isDragging = true;
    for(let i = 0; i < draggableElements.length; i++){
      const containerRect = container.getBoundingClientRect();
      offsetsX[i] = event.clientX - (draggableElements[i].getBoundingClientRect().left - containerRect.left);
      offsetsY[i] = event.clientY - (draggableElements[i].getBoundingClientRect().top - containerRect.top);
      }
    }
);

document.addEventListener('mousemove', (event) => {
  if (isDragging) {
    for(let i = 0; i < draggableElements.length; i++){
      const x = event.clientX - offsetsX[i];
      const y = event.clientY - offsetsY[i];
      draggableElements[i].style.left = `${x}px`;
      draggableElements[i].style.top = `${y}px`;
    }
  }
    console.log(offsetsX, offsetsY);
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  for(let i = 0; i < draggableElements.length; i++){
  }
});

container.addEventListener('wheel', (e) => {
  const delta = e.deltaY;
  const mouseX = e.clientX - container.getBoundingClientRect().left;
  const mouseY = e.clientY - container.getBoundingClientRect().top;
  if(delta > 0){
    zoomLevel = 1 - zoomLevel*0.1;
  } else{
    zoomLevel = 1 + zoomLevel*0.1;
  }
  for(let i = 0; i < draggableElements.length; i++){
    const width = draggableElements[i].getBoundingClientRect().width;
    let topDist, leftDist;

    if(draggableElements[i].style.top !== ''){
      topDist = parseFloat(draggableElements[i].style.top);
      leftDist = parseFloat(draggableElements[i].style.left);
    } else{
      const computedStyle = getComputedStyle(draggableElements[i]);
      topDist = parseFloat(computedStyle.getPropertyValue('top'));
      leftDist = parseFloat(computedStyle.getPropertyValue('left'));
    }
    const offsetX = mouseX - leftDist;
    const offsetY = mouseY - topDist;

    draggableElements[i].style.width = `${width * zoomLevel}px`;
    const newLeft = mouseX - offsetX * zoomLevel;
    const newTop = mouseY - offsetY * zoomLevel;

    draggableElements[i].style.left = `${newLeft}px`;
    draggableElements[i].style.top = `${newTop}px`;
  }
  
});
}
