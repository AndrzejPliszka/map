function hideOrShowPanel(panelName){
    let panel = document.getElementById(panelName);
    let button = document.getElementById(panelName + "-button");
    let historicInfoWidth = window.getComputedStyle(panel).getPropertyValue("--historic-info-width");
    let headerHeight = window.getComputedStyle(panel).getPropertyValue("--header-height");
    let settingsWidth = window.getComputedStyle(panel).getPropertyValue("--settings-width");
    let timelineHeight = window.getComputedStyle(panel).getPropertyValue("--timeline-height");
    switch(panelName){
        case "historic-info":
            panelButtons = document.getElementById("buttons");
            if(panel.style.right == 0 || panel.style.right == "0px"){
                panel.style.right = "-10000px";
                panelButtons.style.right = "-10000px";
                button.style.right = 0;
                button.value = "<=";
            }
            else{
                panel.style.right = 0;
                panelButtons.style.right = 0;
                button.style.right = historicInfoWidth;
                button.value = "=>";
            }
            break;
        case "timeline-div":
            let currentHeaderHeight = document.getElementById("header").style.top == 0 || document.getElementById("header").style.top == '0px' ? headerHeight : 0;
            console.log(currentHeaderHeight);
            
            if(panel.style.bottom == 0 || panel.style.bottom == "0px"){
                panel.style.bottom = "-10000px";
                button.style.bottom = 0;
                button.value = "↑"
                document.getElementById("historic-info").style.height = `calc(100vh - (${currentHeaderHeight} + 50px))`;
                document.getElementById("settings").style.height = `calc(100vh - (${currentHeaderHeight}))`;
                document.getElementById("buttons").style.bottom = `0`;
            }
            else{
                panel.style.bottom = 0;
                button.style.bottom = "40px";
                button.value = "↓";
                document.getElementById("historic-info").style.height = `calc(100vh - (${currentHeaderHeight} + ${timelineHeight} + 50px))`;
                document.getElementById("settings").style.height = `calc(100vh - (${currentHeaderHeight} + ${timelineHeight}))`;
                document.getElementById("buttons").style.bottom = timelineHeight;
            }
            break;
        case "header":
            let currentTimelineHeight = document.getElementById("timeline-div").style.bottom == 0 || document.getElementById("timeline-div").style.bottom == '0px' ? timelineHeight : 0;
            console.log(currentTimelineHeight);
            if(panel.style.top == 0 || panel.style.top == "0px"){
                console.log(${currentTimelineHeight} + ${headerHeight})
                panel.style.top = "-10000px";
                button.style.top = 0;
                button.value = "↓";
                document.getElementById("historic-info").style.height = `calc(100vh - (${currentTimelineHeight} + 50px))`;
                document.getElementById("historic-info").style.top = 0;
                document.getElementById("settings").style.height = `calc(100vh - (${currentTimelineHeight}))`;
                document.getElementById("settings").style.top = 0;
            }
            else{
                console.log(${currentTimelineHeight} + ${headerHeight})
                panel.style.top = 0;
                button.style.top = "100px";
                button.value = "↑";
                document.getElementById("historic-info").style.height = `calc(100vh - (${currentTimelineHeight} + ${headerHeight} + 50px))`;
                document.getElementById("historic-info").style.top = headerHeight;
                document.getElementById("settings").style.height = `calc(100vh - (${currentTimelineHeight} + ${headerHeight} ))`;
                document.getElementById("settings").style.top = headerHeight;
            }
            break;
        case "settings":
            if(panel.style.left == 0 || panel.style.left == "0px"){
                panel.style.left = "-10000px";
                button.style.left = 0;
                button.value = "->";
            }
            else{
                panel.style.left = 0;
                button.style.left = settingsWidth;
                button.value = "<-";
            }
            break;
    }
    
}
