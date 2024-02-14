function hideOrShowPanel(panelName){
    panel = document.getElementById(panelName);
    button = document.getElementById(panelName + "-button");
    historic-info-width = panel.style.getPropertyValue("--historic-info-width");
    header-height = panel.style.getPropertyValue("--header-height");
    settings-width = panel.style.getPropertyValue("--settings-width");
    timeline-height = panel.style.getPropertyValue("--timeline-height");
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
                button.style.right = historic-info-width;
                button.value = "=>";
            }
            break;
        case "timeline-div":
            if(panel.style.bottom == 0 || panel.style.bottom == "0px"){
                panel.style.bottom = "-10000px";
                button.style.bottom = 0;
                button.value = "↑"
                document.getElementById("historic-info").style.height = `calc(100vh - (${header-height} + 50px))`;
                document.getElementById("settings").style.height = `calc(100vh - (${header-height}))`;
            }
            else{
                panel.style.bottom = 0;
                button.style.bottom = "40px";
                button.value = "↓";
                document.getElementById("historic-info").style.height = `calc(100vh - (${header-height} + ${timeline-height} + 50px))`;
                document.getElementById("settings").style.height = `calc(100vh - (${header-height} + ${timeline-height}))`;
            }
            break;
        case "header":
            if(panel.style.top == 0 || panel.style.top == "0px"){
                panel.style.top = "-10000px";
                button.style.top = 0;
                button.value = "↓";
                document.getElementById("historic-info").style.height = `calc(100vh + (${timeline-height} + 50px))`;
                document.getElementById("historic-info").style.top = 0;
                document.getElementById("settings").style.height = `calc(100vh + (${timeline-height}))`;
                document.getElementById("settings").style.top = 0;
            }
            else{
                panel.style.top = 0;
                button.style.top = "100px";
                button.value = "↑";
                document.getElementById("historic-info").style.height = `calc(100vh - (${timeline-height} + ${header-height} + 50px))`;
                document.getElementById("historic-info").style.top = header-height;
                document.getElementById("settings").style.height = `calc(100vh - (${timeline-height} + ${header-height} ))`;
                document.getElementById("settings").style.top = header-height;
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
                button.style.left = "100px";
                button.value = "<-";
            }
            break;
    }
    
    
}
