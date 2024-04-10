let zoomLevel = 1;

function initializeMapManager(){
  var container = document.getElementById('svg-container');
  const draggableElements = Array.prototype.slice.call(document.querySelectorAll('svg'));
  const imageLayers = Array.prototype.slice.call(container.querySelectorAll('img'));
  draggableElements.push(...imageLayers);
  console.log(draggableElements);
  let isDragging = false;
  let offsetsX = [], offsetsY = [];
  for(let i = 0; i <  document.querySelectorAll('svg').length; i++){
      offsetsX.push("");
      offsetsY.push("");
};

container.addEventListener('pointerdown', (event) => {
    isDragging = true;
    for(let i = 0; i < draggableElements.length; i++){
      const containerRect = container.getBoundingClientRect();
      offsetsX[i] = event.clientX - (draggableElements[i].getBoundingClientRect().left - containerRect.left - 2);
      offsetsY[i] = event.clientY - (draggableElements[i].getBoundingClientRect().top - containerRect.top - 2);
      }
    }
);

document.addEventListener('pointermove', (event) => {
  if (isDragging) {
    for(let i = 0; i < draggableElements.length; i++){
      const x = event.clientX - offsetsX[i];
      const y = event.clientY - offsetsY[i];
      draggableElements[i].style.left = `${x}px`;
      draggableElements[i].style.top = `${y}px`;
    }
  }
});

document.addEventListener('pointerup', () => {
  isDragging = false;
});

container.addEventListener('wheel', (e) => {
  if(!isDragging){
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
  }
});
}
