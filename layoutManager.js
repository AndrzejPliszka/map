function hideOrShowPanel(panelName){
    panel = document.getElementById(panelName);
    button = document.getElementById(panelName + "-button");
    switch(panelName){
        case "historic-info":
            panelButtons = document.getElementById("buttons");
            if(panel.style.right == 0 || panel.style.right == "0px"){
                panel.style.right = "-10000px";
                panelButtons.style.right = "-10000px";
                button.style.right = 0;
                button.value = "<="
                document.getElementById("settings").style.width = "100%";
            }
            else{
                panel.style.right = 0;
                panelButtons.style.right = 0;
                button.style.right = "35%";
                button.value = "=>";
                document.getElementById("settings").style.width = "calc(65% - 6px)";
            }
            break;
        case "timeline-div":
            if(panel.style.bottom == 0 || panel.style.bottom == "0px"){
                panel.style.bottom = "-10000px";
                button.style.bottom = 0;
                button.value = "↑"
            }
            else{
                panel.style.bottom = 0;
                button.style.bottom = "40px";
                button.value = "↓";
            }
            break;
        case "header":
            if(panel.style.top == 0 || panel.style.top == "0px"){
                panel.style.top = "-10000px";
                button.style.top = 0;
                button.value = "↓";
                document.getElementById("historic-info").style.top = "0";
                document.getElementById("historic-info").style.height = "calc(100vh - 50px)";
            }
            else{
                panel.style.top = 0;
                button.style.top = "100px";
                button.value = "↑";
                document.getElementById("historic-info").style.top = "100px";
                document.getElementById("historic-info").style.height = "calc(100vh - 50px)";
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
