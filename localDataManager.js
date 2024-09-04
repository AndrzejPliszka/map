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

async function saveClickableElements(){
    if(!localStorage.getItem("ClickableCountries")){
        const apiUrl = "https://quilled-nervous-leopon.glitch.me/get-clickable-countries";
        fetch(apiUrl)
        .then(response => response.json())
        .then((data) => {
            localStorage.setItem("ClickableCountries", JSON.stringify(data));
        })
    }
}

function initDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('CountryShapeDatabase', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('CountryShapes')) {
                db.createObjectStore('CountryShapes', { keyPath: 'auto_id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.errorCode);
        };
    });
}

function objectExists(store, obj) {
    return new Promise((resolve, reject) => {
        const request = store.openCursor();
        let exists = false;

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const existingObj = cursor.value;
                // Sprawdzamy czy obiekt bez id jest taki sam jak istniejący
                const { auto_id: existingId, ...existingData } = existingObj;
                if (JSON.stringify(existingData) === JSON.stringify(obj)) {
                    exists = true;
                    resolve(true);
                } else {
                    cursor.continue();
                }
            } else {
                resolve(exists);
            }
        };

        request.onerror = (event) => {
            reject(event.target.errorCode);
        };
    });
}

async function saveCountryShapesToIndexedDB(objects) {
    const db = await initDatabase();
    const transaction = db.transaction('CountryShapes', 'readwrite');
    const store = transaction.objectStore('CountryShapes');

    for (const obj of objects) {
        const { _id, ...rest } = obj;
        const exists = await objectExists(store, rest);
        if (!exists) {
            store.add(rest);
        }
    }

    return transaction.complete;
}

async function getCountryShapes(date) {
    const db = await initDatabase();
    const transaction = db.transaction('CountryShapes', 'readonly');
    const store = transaction.objectStore('CountryShapes');

    const objects = [];
    const dateValue = date;

    return new Promise((resolve, reject) => {
        store.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const record = cursor.value;
                const startDate = record.start_date;
                const endDate = record.end_date;

                if (startDate <= dateValue && dateValue <= endDate) {
                    objects.push(record);
                }
                cursor.continue();
            } else {
                // Sortowanie wyników według z_index rosnąco
                objects.sort((a, b) => a.z_index - b.z_index);
                resolve(objects);
            }
        };

        store.openCursor().onerror = (event) => {
            reject(event.target.errorCode);
        };
    });
}
function deleteSavedData(){
    localStorage.removeItem("savedDates");
    localStorage.removeItem("mapTagData");
    localStorage.removeItem("clickableCountries");
    window.indexedDB.deleteDatabase("MapDatabase");
    window.indexedDB.deleteDatabase("CountryShapeDatabase");
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

function isUnsavedDayBetween(startDate, endDate){
    let start = new Date(startDate);
    let end = new Date(endDate);
    const savedDates = JSON.parse(localStorage.getItem("savedDates"))
    while (start <= end) {
        date = new Date(start).toISOString().split('T')[0]
        if(!savedDates.includes(date)){
            return true;
        }
        start.setDate(start.getDate() + 1);
    }
    return false;
}

function saveAllDatesBetween(startDate, endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);
    let dates = [];
    const savedDates = JSON.parse(localStorage.getItem("savedDates"))
    while (start <= end) {
        date = new Date(start).toISOString().split('T')[0]
        if(savedDates.includes(date)){
            start.setDate(start.getDate() + 1);
            continue;
        }
        dates.push(date);
        start.setDate(start.getDate() + 1);
    }

    let currentDateArr = savedDates
    currentDateArr.push(...dates)
    localStorage.setItem("savedDates", JSON.stringify(currentDateArr))
}