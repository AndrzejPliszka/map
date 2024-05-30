let layout = new Proxy({
    contentExplorer: "shown",
    header: "shown",
    timeline: "shown",
    historicInfo: "shown",
}, { set: (target, property, value)=>
    {
        target[property] = value;
        console.log(layout);
        if(!document.getElementById('contentExplorerButton')){
            return 0;
        }
        document.getElementById("contentExplorerButton").value = layout.contentExplorer === "shown" ? "Hide Content Explorer" : "Show Content Explorer";
        document.getElementById("headerButton").value = layout.header === "shown" ? "Hide Header" : "Show Header";
        document.getElementById("timelineButton").value = layout.timeline === "shown" ? "Hide Timeline" : "Show Timeline";
        document.getElementById("infoButton").value = layout.historicInfo === "shown" ? "Hide Info" : "Show Info";
    }
})
function showInformationWindow(typeOfWindow){
    sessionStorage.setItem('startingInformationShown', 'true');
    const infoWindow = document.createElement("div");
    const greyedOutScreen = document.createElement('div');
    greyedOutScreen.setAttribute("id", "greyedOutScreen");
    greyedOutScreen.addEventListener("click", ()=>{
        greyedOutScreen.remove();
        infoWindow.remove();
    })
    document.body.appendChild(greyedOutScreen);
    switch(typeOfWindow){
        case "settings":
            let visibilityButtons = "";
            visibilityButtons += layout.contentExplorer === "shown" ? `<input id="contentExplorerButton" type=button value="Hide Content Explorer" onclick="hideOrShowPanel('settings')">` : `<input id="contentExplorerButton" type=button value="Show Content Explorer" onclick="hideOrShowPanel('settings')">`
            visibilityButtons += layout.header === "shown" ? `<input id="headerButton" type=button value="Hide Header" onclick="hideOrShowPanel('header')">` : `<input id="headerButton" type=button value="Show Header" onclick="hideOrShowPanel('header')">`
            visibilityButtons += layout.timeline === "shown" ? `<input id="timelineButton" type=button value="Hide Timeline" onclick="hideOrShowPanel('timeline-div')">` : `<input id="timelineButton" type=button value="Show Timeline" onclick="hideOrShowPanel('timeline-div')">`
            visibilityButtons += layout.historicInfo === "shown" ? `<input id="infoButton" type=button value="Hide Info" onclick="hideOrShowPanel('historic-info')">` : `<input id="infoButton" type=button value="Show Info" onclick="hideOrShowPanel('historic-info')">`
            infoWindow.setAttribute("id", "informationWindow")
            infoWindow.innerHTML = `
            <h2>Settings</h2>
            <h3>Window Visibility</h3>
            ${visibilityButtons}
            <h3>Other Settings</h3>
            <input type="button" value="Delete Cache" onclick="deleteSavedData()">
            <p>Click this button to see up to date maps</p>
            
            <p id=informationWindowSmallText>Click outside this box to close it</p>`;
            document.body.appendChild(infoWindow)
            break;
        case "information":
            infoWindow.setAttribute("id", "informationWindow")
            infoWindow.innerHTML = `
            <h2>Information</h2>
            <p>Hi! Welcome to my website! This is still work in progress, so feel free to report bugs, historical errors and propose new features!
             This website uses free server, so you may need to wait up to 30 seconds for it to turn on.
             I know that this website is not very visually appealing, but hey at least I tried! Thanks for reading and happy discovering history!
             </p>
             <p id=serverStatus>Server is starting</p>
                        <p id=informationWindowSmallText>Click outside this box to close it</p>`;
            document.body.appendChild(infoWindow)
            break;
        case "phone":
            infoWindow.setAttribute("id", "informationWindow")
            infoWindow.innerHTML = `
            <h2>Information</h2>
            <p>Hi! It seems that you are trying to use phone to enter my website. Unfortunatly due to my inexperience and lack of time, I did not make this website mobile friendly (yet). 
            You can try to use it, but it is very probable that layout will be broken, and panning and zooming will be unusable. For now you have to use a computer or wait till I make this mobile friendly 
            (or ultimatly you can try to implement it yourself, code is open source after all).
             </p>
                        <p id=informationWindowSmallText>Click outside this box to close it</p>`;
            document.body.appendChild(infoWindow)
            break;
    }
}

function updateServerStatus(){
    if(document.getElementById('serverStatus')){
        document.getElementById('serverStatus').innerHTML = "Server is up and running";
    }
}


function hideOrShowPanel(panelName){
    let panel = document.getElementById(panelName);
    let headerHeight = window.getComputedStyle(panel).getPropertyValue("--header-height");
    let timelineHeight = window.getComputedStyle(panel).getPropertyValue("--timeline-height");
    switch(panelName){
        case "historic-info":
            panelButtons = document.getElementById("buttons");
            if(panel.style.right == 0 || panel.style.right == "0px"){
                panel.style.right = "-10000px";
                panelButtons.style.right = "-10000px";
                console.log("amogus");
                layout.historicInfo = "hidden";
            }
            else{
                panel.style.right = 0;
                panelButtons.style.right = 0;
                layout.historicInfo = "shown";
            }
            break;
        case "timeline-div":
            let currentHeaderHeight = document.getElementById("header").style.top == 0 || document.getElementById("header").style.top == '0px' ? headerHeight : '0px';
            
            if(panel.style.bottom == 0 || panel.style.bottom == "0px"){
                panel.style.bottom = "-10000px";
                document.getElementById("historic-info").style.height = `calc(100vh - (${currentHeaderHeight} + 50px))`;
                document.getElementById("settings").style.height = `calc(100vh - (${currentHeaderHeight}))`;
                document.getElementById("buttons").style.bottom = `0`;
                layout.timeline = "hidden";
            }
            else{
                panel.style.bottom = 0;
                document.getElementById("historic-info").style.height = `calc(100vh - (${currentHeaderHeight} + ${timelineHeight} + 50px))`;
                document.getElementById("settings").style.height = `calc(100vh - (${currentHeaderHeight} + ${timelineHeight}))`;
                document.getElementById("buttons").style.bottom = timelineHeight;
                layout.timeline = "shown";
            }
            break;
        case "header":
            let currentTimelineHeight = document.getElementById("timeline-div").style.bottom == 0 || document.getElementById("timeline-div").style.bottom == '0px' ? timelineHeight : '0px';
            if(panel.style.top == 0 || panel.style.top == "0px"){
                panel.style.top = "-10000px";
                document.getElementById("historic-info").style.height = `calc(100vh - (${currentTimelineHeight} + 50px))`;
                document.getElementById("historic-info").style.top = 0;
                document.getElementById("settings").style.height = `calc(100vh - (${currentTimelineHeight}))`;
                document.getElementById("settings").style.top = 0;
                layout.header = "hidden";
            }
            else{
                panel.style.top = 0;
                document.getElementById("historic-info").style.height = `calc(100vh - (${currentTimelineHeight} + ${headerHeight} + 50px))`;
                document.getElementById("historic-info").style.top = headerHeight;
                document.getElementById("settings").style.height = `calc(100vh - (${currentTimelineHeight} + ${headerHeight} ))`;
                document.getElementById("settings").style.top = headerHeight;
                layout.header = "shown";
            }
            break;
        case "settings":
            if(panel.style.left == 0 || panel.style.left == "0px"){
                panel.style.left = "-10000px";
                layout.contentExplorer = "hidden";
            }
            else{
                panel.style.left = 0;
                layout.contentExplorer = "shown";
            }
            break;
    }
    
}

function checkIfOnPhone() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };