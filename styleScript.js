

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



bgColorPicker.addEventListener("click",function(e){
    

    let colorPickerInput = document.createElement("input");
    colorPickerInput.type = "color";
    // colorPickerInput.style.cursor = "move"
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

    colorPickerInput.click();

    colorPickerInput.addEventListener("input",function(e){
        if(!lastSelectedCell)return;
        lastSelectedCell.style.color = e.currentTarget.value;
        let address = lastSelectedCell.getAttribute("cell-address");
        dataObj[address].color =  e.currentTarget.value;

    })

    

})


fontSizeSelector.addEventListener("click",function(e){
    if(!lastSelectedCell) return;
    
    let sizeOption = e.currentTarget.value;
    lastSelectedCell.style.fontSize = `${sizeOption}px`;

    let address = lastSelectedCell.getAttribute("cell-address");
    dataObj[address].fontSize = `${sizeOption}px`;
    console.log(sizeOption);


});


bold.addEventListener("click",function(e){
    if(!lastSelectedCell) return;
    
    let address = lastSelectedCell.getAttribute("cell-address");
    let isBold = dataObj[address].style.bold;
    if(isBold){
        e.currentTarget.classList.remove("selected-menu-option");
        lastSelectedCell.style.fontWeight = "";
        dataObj[address].style.bold = false;
    }else{
        e.currentTarget.classList.add("selected-menu-option");
        lastSelectedCell.style.fontWeight = "bold";
        dataObj[address].style.bold = true;
    }
   
    
})

italic.addEventListener("click",function(e){
    if(!lastSelectedCell) return;
    
    let address = lastSelectedCell.getAttribute("cell-address");
    let isItalic = dataObj[address].style.italic;
    if(isItalic){
        e.currentTarget.classList.remove("selected-menu-option");
        lastSelectedCell.style.fontStyle = "";
        dataObj[address].style.italic = false;
    }else{
        e.currentTarget.classList.add("selected-menu-option");
        lastSelectedCell.style.fontStyle = "italic";
        dataObj[address].style.italic = true;
    }
    
    
})

underline.addEventListener("click",function(e){
    if(!lastSelectedCell) return;
    
    let address = lastSelectedCell.getAttribute("cell-address");
    let isUnderline = dataObj[address].style.underline;
    if(isUnderline){
        e.currentTarget.classList.remove("selected-menu-option");
        lastSelectedCell.style.textDecoration = "";
        dataObj[address].style.underline = false;
    }else{
        e.currentTarget.classList.add("selected-menu-option");
        lastSelectedCell.style.textDecoration = "underline";
        dataObj[address].style.underline = true;
    }
    
    
})




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

