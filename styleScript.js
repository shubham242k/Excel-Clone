let allAlignments = document.querySelectorAll(".text-alignment-section span");
let body = document.querySelector("body");
console.log(allAlignments);
let leftAlign = allAlignments[0];
let centerAlign = allAlignments[1];
let rightAlign = allAlignments[2];

leftAlign.addEventListener("click",function(e){
    if(!lastSelectedCell)return;
    let address = lastSelectedCell.getAttribute("cell-address");

    lastSelectedCell.style.textAlign = "left";

    dataObj[address].align = "left";
});

centerAlign.addEventListener("click",function(e){
    if(!lastSelectedCell)return;
    let address = lastSelectedCell.getAttribute("cell-address");

    lastSelectedCell.style.textAlign = "center";

    dataObj[address].align = "center";
});

rightAlign.addEventListener("click",function(e){
    if(!lastSelectedCell)return;
    let address = lastSelectedCell.getAttribute("cell-address");

    lastSelectedCell.style.textAlign = "right";

    dataObj[address].align = "right";
});

let ColorOptions = document.querySelectorAll(".color-section span");
let bgColorPicker = ColorOptions[0];
let fontColotPicker = ColorOptions[1];


bgColorPicker.addEventListener("click",function(e){
    

    let colorPickerInput = document.createElement("input");
    colorPickerInput.type = "color";
    body.append(colorPickerInput);

    colorPickerInput.click();

    colorPickerInput.addEventListener("input",function(e){
        if(!lastSelectedCell)return;
        lastSelectedCell.style.backgroundColor = e.currentTarget.value;
        let address = lastSelectedCell.getAttribute("cell-address");
        dataObj[address].backgroundColor =  e.currentTarget.value;
    
    })

})

fontColotPicker.addEventListener("click",function(e){
    

    let colorPickerInput = document.createElement("input");
    colorPickerInput.type = "color";
    body.append(colorPickerInput);

    colorPickerInput.click();

    colorPickerInput.addEventListener("input",function(e){
        if(!lastSelectedCell)return;
        lastSelectedCell.style.color = e.currentTarget.value;
        let address = lastSelectedCell.getAttribute("cell-address");
        dataObj[address].color =  e.currentTarget.value;

    })

})

let menuOptions = document.querySelectorAll(".menu-bar div");

let fileOption = menuOptions[0];
let helpOption = menuOptions[1];

fileOption.addEventListener("click",function(e){
    let isOpen = fileOption.getAttribute("open-status");
    if(isOpen == "true"){
        fileOption.setAttribute("open-status","false");
        document.querySelector(".file-option-dropdown").remove();
    }else{
        fileOption.setAttribute("open-status","true");
        let dropDown = document.createElement("div");
        dropDown.innerHTML = "<p>Save</p><p>Clear</p>"
        dropDown.classList.add("file-option-dropdown");

        let allOptions = dropDown.querySelectorAll("p");

        allOptions[0].addEventListener("click",function(e){
            localStorage.setItem("sheet",JSON.stringify(dataObj));
        })
        allOptions[1].addEventListener("click",function(e){
            localStorage.setItem("sheet","");
        })
        fileOption.append(dropDown);
    }
})