let zoomLevel = 1;
let widthRatio = 1;
function initializeMapManager(){
  var container = document.getElementById('svg-container');
  const draggableElements = Array.prototype.slice.call(document.querySelectorAll('svg'));
  const imageLayers = Array.prototype.slice.call(container.querySelectorAll('img'));
  draggableElements.push(...imageLayers);
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
  widthRatio = draggableElements[0].getBoundingClientRect().width/startingWidth;
  if(!isDragging){
    const delta = e.deltaY;
    const mouseX = e.clientX - container.getBoundingClientRect().left;
    const mouseY = e.clientY - container.getBoundingClientRect().top;
    if(delta > 0){
      if(widthRatio < 0.1){
        zoomLevel = 1;
      }
      else{
        zoomLevel = 1 - zoomLevel*0.1;
      }
    } else{
      if(widthRatio > 10){
        zoomLevel = 1;
      }
      else{
        zoomLevel = 1 + zoomLevel*0.1;
      }
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


function moveMapByOffset(offset, isCentered, sizeRatio){
  const containerRect = document.getElementById('svg-container').getBoundingClientRect();
  let currentObjectX = document.querySelectorAll('svg')[0].getBoundingClientRect().left - containerRect.left - 2;
  let currentObjectY = document.querySelectorAll('svg')[0].getBoundingClientRect().top - containerRect.top - 2;
  const currentMapOffset = [currentObjectX-firstObjectStartingPosition[0], currentObjectY-firstObjectStartingPosition[1]]
  let movementVector;
  let sizeMultiplier;
  if(sizeRatio){
    sizeMultiplier = sizeRatio/widthRatio;
    movementVector = [offset[0]*sizeRatio - currentMapOffset[0], offset[1]*sizeRatio - currentMapOffset[1]];
  }else{
    movementVector = [offset[0]*widthRatio - currentMapOffset[0], offset[1]*widthRatio - currentMapOffset[1]];
  }
  

  const draggableElements = Array.prototype.slice.call(document.querySelectorAll('svg'));
  const imageLayers = Array.prototype.slice.call(document.getElementById('svg-container').querySelectorAll('img'));
  draggableElements.push(...imageLayers);

  for(let i = 0; i < draggableElements.length; i++){
    if(isCentered){
      draggableElements[i].style.left = draggableElements[i].getBoundingClientRect().left + movementVector[0] + window.innerWidth/2 -2;
      draggableElements[i].style.top = draggableElements[i].getBoundingClientRect().top + movementVector[1] + window.innerHeight/2 -2;
    }else{
    draggableElements[i].style.left = draggableElements[i].getBoundingClientRect().left + movementVector[0] -2;
    draggableElements[i].style.top = draggableElements[i].getBoundingClientRect().top + movementVector[1] -2;}

    if(sizeRatio){
      let xDifference = draggableElements[i].getBoundingClientRect().left -2;
      let yDifference = draggableElements[i].getBoundingClientRect().top -2;
      let xOffsetedPos = sizeMultiplier * xDifference;
      let yOffsetedPos = sizeMultiplier * yDifference;
      draggableElements[i].style.left = xOffsetedPos;
      draggableElements[i].style.top = yOffsetedPos;
      draggableElements[i].style.setProperty('width', `${draggableElements[i].getBoundingClientRect().width * sizeMultiplier}px`);
      widthRatio = draggableElements[0].getBoundingClientRect().width/startingWidth;
    }
  }
  if(sizeRatio){
    moveMapByOffset(offset, isCentered)
  } 
}

function displaySvgInCords(coordinates, svgCode, offset, width, widthOffset, className, id){
  console.log("Sigma znaleziona");
  const resultElement = document.getElementById('svg-container');
  resultElement.insertAdjacentHTML('beforeend', `${svgCode.slice(0, 4)} class='${className}' id='${id}' ${svgCode.slice(4)}`);
  console.log(resultElement);
  let svgElement = resultElement.lastChild;
  svgElement.style.left = `${coordinates[0]*widthOffset - width*widthOffset/2 + offset[0]}px`;
  svgElement.style.top = `${coordinates[1]*widthOffset - width*widthOffset/2 + offset[1]}px`;
  svgElement.style.width = `${width*widthOffset}px`;
}

function displayBattles(offset, widthOffset){
  let battleData = JSON.parse(localStorage.getItem("battleData"));
  console.log(battleData);
  console.log(document.getElementById("date_input").value)
  let data = battleData.filter((element)=>element.x_pos && element.start_date >= document.getElementById("date_input").value && element.end_date <= document.getElementById("date_input").value);
  console.log(data);
  for(let i = 0; i < Object.keys(data).length; i++){
      displaySvgInCords([data[i].x_pos, data[i].y_pos], localStorage.getItem("BattleIcon"), offset, 50, widthOffset, "Battle",data[i].battle_name)
  }
}