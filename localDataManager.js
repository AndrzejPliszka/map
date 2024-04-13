const request = window.indexedDB.open("MapDatabase", 1);
request.onerror = (event) => {console.log(event.target.errorCode)};

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    const objectStore = db.createObjectStore("Maps", { keyPath: "id", autoIncrement: true});
    objectStore.createIndex("map_tag", "map_tag", { unique: false });
    objectStore.createIndex("date", "date", { unique: false });
    objectStore.createIndex("svg_code", "svg_code", { unique: true });
    objectStore.createIndex('map_tag&date', ['map_tag', 'date']);
  };
function addDateToStorage(date){
    if(!localStorage.getItem("savedDates")){
        localStorage.setItem("savedDates", JSON.stringify([date]));
    }
    else{
        if(!localStorage.getItem("savedDates").includes(date)){
            let currentDateArr = JSON.parse(localStorage.getItem("savedDates"))
            currentDateArr.push(date)
            localStorage.setItem("savedDates", JSON.stringify(currentDateArr))
        }
    }
}

async function saveMapTagInfo(){
    if(!localStorage.getItem("mapTagData")){
        const apiUrl = "https://quilled-nervous-leopon.glitch.me/get-map-tags";
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'}
        })
        .then(response => response.json())
        .then((data) => {
            localStorage.setItem("mapTagData", JSON.stringify(data.info))
        })
    }
}

async function saveMapToIndexedDB(data){
    let req = window.indexedDB.open("MapDatabase", 1);
    req.onsuccess = function(event) {
        db = event.target.result
        for(let i = 0; i < data.tag.length; i++){
            db.transaction(["Maps"], "readwrite").objectStore("Maps").add({map_tag:data.tag[i], date:data.start_date[i], svg_code:data.svg_code[i]});
        }
    }
}

function getDataFromLocalStorage(date){
    const tag_data = JSON.parse(localStorage.getItem("mapTagData"));
    tag = []
    width = []
    x_pos = []
    y_pos = []
    svg = []
    let usedTags = tag_data.filter(tag => tag.start_date <= date && tag.end_date >= date).sort((a, b) => a.z_index - b.z_index)
    for(let i = 0; i < usedTags.length; i++){
        tag.push(usedTags[i].tag_name)
        width.push(usedTags[i].width)
        x_pos.push(usedTags[i].x_pos)
        y_pos.push(usedTags[i].y_pos)
    }
    let req = window.indexedDB.open("MapDatabase", 1);
    maxDateElement = null;
    req.onsuccess = function(event) {
        var db = event.target.result;
        for(let i = 0; i < tag.length; i++){
            db.transaction(["Maps"], "readonly").objectStore("Maps").index("map_tag").getAll(tag[i]).onsuccess = (e) => {
                maxDateElement = null;
                cursor = e.target.result;
                cursor.forEach(element => {
                    if(element.date <= date){
                        if (!maxDateElement || element.date > maxDateElement.date) {
                            maxDateElement = element;
                        }
                    }
                });
                if (maxDateElement) {
                    svg.push(maxDateElement.svg_code);
                }
                if (svg.length === tag.length) {
                    data = {
                        svg_code: svg,
                        tag: tag,
                        width: width,
                        x_pos: x_pos,
                        y_pos: y_pos}
                    displayMap(data);
                }
            };
        }
    }
}

function deleteSavedData(){
    localStorage.removeItem("savedDates");
    localStorage.removeItem("mapTagData");
    window.indexedDB.deleteDatabase("MapDatabase");
    location.reload();
}