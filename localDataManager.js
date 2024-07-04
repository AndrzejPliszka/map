const request = window.indexedDB.open("MapDatabase", 1);
request.onerror = (event) => {console.log(event.target.errorCode)};
request.onsuccess = () => {checkIfDataIsUpToDate()};
request.onupgradeneeded = (event) => {
    //store date from which map was taken
    currentDate = new Date();
    localStorage.setItem("lastUpdateDate", currentDate);
    //database creating
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
        fetch(apiUrl)
        .then(response => response.json())
        .then((data) => {
            localStorage.setItem("mapTagData", JSON.stringify(data))
        })
    }
}

async function saveBattles(){
    if(!localStorage.getItem("battleData")){
        params = new URLSearchParams({dataToDownload: "CurrentBattles"}).toString();
        const apiUrl = `https://quilled-nervous-leopon.glitch.me/get-data-from-database?${params}`;
        fetch(apiUrl)
        .then(response => response.json())
        .then((data) => {
            localStorage.setItem("battleData", JSON.stringify(data))
        })
    }
}

async function saveSvgIcons(){
    if(!localStorage.getItem("BattleIcon")){
        const apiUrl = "https://quilled-nervous-leopon.glitch.me/get-svg-icons";
        fetch(apiUrl)
        .then(response => response.json())
        .then((data) => {
            for(let i = 0; i < Object.keys(data).length; i++){
                localStorage.setItem(`${data[i].icon_name}Icon`, data[i].svg_code);
            }
        })
    }
}

async function saveMapToIndexedDB(data){
    let req = window.indexedDB.open("MapDatabase", 1);
    req.onsuccess = function(event) {
        db = event.target.result
        for(let i = 0; i < data.tag.length; i++){
            console.log(data.start_date[i]);
            db.transaction(["Maps"], "readwrite").objectStore("Maps").add({map_tag:data.tag[i], date:data.start_date[i], svg_code:data.svg_code[i]});
        }
    }
}

function getDataFromLocalStorage(date) {
    // Fetch and parse tag data from localStorage
    const tagData = JSON.parse(localStorage.getItem("mapTagData"));
    if (!tagData) {
        console.error("No tag data found in localStorage");
        return;
    }

    const tag = [];
    const width = [];
    const xPos = [];
    const yPos = [];
    const svg = [];

    const usedTags = Object.values(tagData).filter(tag => tag.start_date <= date && tag.end_date >= date).sort((a, b) => a.z_index - b.z_index);
    if (usedTags.length === 0) {
        displayMap({ tag: [], width: [] });
        return;
    }

    usedTags.forEach(tagData => {
        tag.push(tagData.tag_name);
        width.push(tagData.width);
        xPos.push(tagData.x_pos);
        yPos.push(tagData.y_pos);
    });

    const req = window.indexedDB.open("MapDatabase", 1);
    req.onerror = function(event) {
        console.error("Error opening IndexedDB:", event.target.errorCode);
    };

    req.onsuccess = function(event) {
        const db = event.target.result;

        const transactions = tag.map(tagName => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(["Maps"], "readonly");
                const objectStore = transaction.objectStore("Maps");
                const index = objectStore.index("map_tag");
                const request = index.getAll(tagName);

                request.onerror = function(event) {
                    reject(event.target.errorCode);
                };

                request.onsuccess = function(event) {
                    const cursor = event.target.result;
                    let maxDateElement = null;

                    cursor.forEach(element => {
                        if (element.date <= date) {
                            if (!maxDateElement || element.date > maxDateElement.date) {
                                maxDateElement = element;
                            }
                        }
                    });

                    resolve(maxDateElement ? maxDateElement.svg_code : null);
                };
            });
        });
        Promise.all(transactions).then(results => {
            results.forEach(result => {
                if (result) {
                    svg.push(result);
                }
            });

            if (svg.length > 0) {
                const data = {
                    svg_code: svg,
                    tag: tag,
                    width: width,
                    x_pos: xPos,
                    y_pos: yPos
                };
                displayMap(data);
            } else {
                displayMap({ tag: [], width: [] });
            }
        }).catch(error => {
            console.error("Error fetching map data:", error);
        });
    };
}

function deleteSavedData(){
    localStorage.removeItem("savedDates");
    localStorage.removeItem("mapTagData");
    window.indexedDB.deleteDatabase("MapDatabase");
    location.reload();
}

function checkIfDataIsUpToDate(){
    const apiUrl = "https://quilled-nervous-leopon.glitch.me/get-last-update-date";
        fetch(apiUrl)
        .then(response => response.json())
        .then((data) => {
            localUpdateDate = new Date(localStorage.getItem("lastUpdateDate"));
            serverUpdateDate = new Date(data.date);
            if(serverUpdateDate > localUpdateDate){
                deleteSavedData();
            }
        })
}