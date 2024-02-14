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
            if(panel.style.bottom == 0 || panel.style.bottom == "0px"){
                panel.style.bottom = "-10000px";
                button.style.bottom = 0;
                button.value = "↑"
                document.getElementById("historic-info").style.height = `calc(100vh - (${headerHeight} + 50px))`;
                document.getElementById("settings").style.height = `calc(100vh - (${headerHeight}))`;
            }
            else{
                panel.style.bottom = 0;
                button.style.bottom = "40px";
                button.value = "↓";
                document.getElementById("historic-info").style.height = `calc(100vh - (${headerHeight} + ${timelineHeight} + 50px))`;
                document.getElementById("settings").style.height = `calc(100vh - (${headerHeight} + ${timelineHeight}))`;
            }
            break;
        case "header":
            if(panel.style.top == 0 || panel.style.top == "0px"){
                panel.style.top = "-10000px";
                button.style.top = 0;
                button.value = "↓";
                document.getElementById("historic-info").style.height = `calc(100vh + (${timelineHeight} + 50px))`;
                document.getElementById("historic-info").style.top = 0;
                document.getElementById("settings").style.height = `calc(100vh + (${timelineHeight}))`;
                document.getElementById("settings").style.top = 0;
            }
            else{
                panel.style.top = 0;
                button.style.top = "100px";
                button.value = "↑";
                document.getElementById("historic-info").style.height = `calc(100vh - (${timelineHeight} + ${headerHeight} + 50px))`;
                document.getElementById("historic-info").style.top = headerHeight;
                document.getElementById("settings").style.height = `calc(100vh - (${timelineHeight} + ${headerHeight} ))`;
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
                button.style.left = var(--settingsWidth);
                button.value = "<-";
            }
            break;
    }
    
