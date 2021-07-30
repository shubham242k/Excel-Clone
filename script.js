let cellSection = document.querySelector(".cell-section");
let rowsContainer = document.querySelector(".row-number-section");
let columnsContainer = document.querySelector(".column-number-section");
let cellAddressShower = document.querySelector(".selected-cell-div");
let formulaInput = document.querySelector(".formula-input-box");
let allAlignments = document.querySelectorAll(".text-alignment-section span");
let ColorOptions = document.querySelectorAll(".color-section span");
let fontSelections = document.querySelectorAll(".font-section select");
let styleSelector = document.querySelectorAll(".text-style-section span");
let menuOptions = document.querySelectorAll(".menu-bar div");
let body = document.querySelector("body");

let leftAlign = allAlignments[0];
let centerAlign = allAlignments[1];
let rightAlign = allAlignments[2];
let bgColorPicker = ColorOptions[0];
let fontColotPicker = ColorOptions[1];
let fontSizeSelector = fontSelections[1];
let bold = styleSelector[0];
let italic = styleSelector[1];
let underline = styleSelector[2];
let fileOption = menuOptions[0];
let helpOption = menuOptions[1];

let isCycle = false;

let dataObj = {};
let lastSelectedCell;
for(let i = 1;i<=100;i++){
    let div = document.createElement("div");
    div.classList.add("row-column-container");
    div.classList.add("row-number");
    div.innerText = i;
    rowsContainer.append(div);
}


for(let i = 0;i<26;i++){
    let div = document.createElement("div");
    div.classList.add("row-column-container");
    div.classList.add("column-number");
    div.innerText = String.fromCharCode(65+i);
    columnsContainer.append(div);
}


for(let i = 1;i<=100;i++){

    let perRowDiv = document.createElement("div");
    perRowDiv.classList.add("row");
    for(let j = 0;j<26;j++){
        let alpha = String.fromCharCode(j + 65);
        let cellAddress = alpha + i;
        dataObj[cellAddress] = {
            value:"",
            formula:undefined,
            upstream:[],
            downstream:[],
            align:"left",
            color:"rgba(54, 54, 54, 0.829)",
            backgroundColor:"white",
            style:{
                bold : false,
                italic : false,
                underline : false,
            },
            fontSize : "14px",
            
        };
        let cellDiv = document.createElement("div");
        cellDiv.contentEditable = true;
        cellDiv.classList.add("cell");
        cellDiv.setAttribute("cell-address",cellAddress);

        cellDiv.addEventListener("click",function(e){
            let address = cellDiv.getAttribute("cell-address");
            cellAddressShower.innerText = address;
            if(lastSelectedCell){
                lastSelectedCell.classList.remove("selected-cell");
            }
            e.currentTarget.classList.add("selected-cell");
            lastSelectedCell = e.currentTarget;

            selectAlltheAttributes(address);

        })

        cellDiv.addEventListener("input",inputHandle);
        perRowDiv.append(cellDiv);
    }
    cellSection.append(perRowDiv);
    
}
console.log(dataObj);
if(localStorage.getItem("sheet")){
    dataObj = JSON.parse(localStorage.getItem("sheet"));
    console.log(dataObj);
    for(let x in dataObj){
        let cell = document.querySelector(`[cell-address='${x}']`);

        if(dataObj[x].value){
            cell.innerText = dataObj[x].value;
            cell.style.color = dataObj[x].color;
            cell.style.backgroundColor  = dataObj[x].backgroundColor;
            cell.style.textAlign = dataObj[x].align;
            cell.style.fontSize = dataObj[x].fontSize;
            cell.style.fontStyle = dataObj[x].style.italic == true?"italic":"";
            cell.style.fontWeight = dataObj[x].style.bold == true?"bold":"";
            cell.style.textDecoration = dataObj[x].style.underline == true?"underline":"";
        }
    }
}
// console.log(dataObj);
cellSection.addEventListener("scroll",function(e){
    console.log(e.currentTarget.scrollLeft);
    columnsContainer.style.transform = `translateX(-${e.currentTarget.scrollLeft}px)`;
    rowsContainer.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`;
})

formulaInput.addEventListener("click",function(e){
    console.log(isCycle + "CLICKING");
    if(isCycle){
        formulaInput.value = "";
        formulaInput.classList.remove("cycle-detection");
        isCycle = false;
    }
})
formulaInput.addEventListener("keydown",function(e){
    if(e.key != "Enter" || !lastSelectedCell)return;

    
    
    let selectedCellAddress = lastSelectedCell.getAttribute("cell-address");
    let newFormula = e.currentTarget.value;
    console.log(dataObj[selectedCellAddress]);
    isCycle = checkCycle(selectedCellAddress,newFormula);
    console.log(isCycle);
    if(isCycle){
        // formulaInput.style.color = "red";
        formulaInput.value = "CYCLE DETECTION";
        formulaInput.classList.add("cycle-detection");

        return;
    } 
    formulaInput.value = "";
    let cellObj = dataObj[selectedCellAddress];
    cellObj.formula = newFormula;
    let cellUpStream = cellObj.upstream;
    for(let i = 0;i<cellUpStream.length;i++){
        removeFromParentDownStream(cellUpStream[i],selectedCellAddress);
    }

    cellUpStream = [];
    let formulaSection = newFormula.split(" ");
    //adding new formula's variable to upstream;
    for(let i = 0;i < formulaSection.length;i++){
        if(formulaSection[i] == "+" || formulaSection[i] =="*" || 
        formulaSection[i] == "/" || formulaSection[i] == "-" || Number(formulaSection[i])){
            continue;
        }
        cellUpStream.push(formulaSection[i]);
    }
    //adding my cell to downstream of parent
    for(let i = 0;i<cellUpStream.length;i++){
        addToParentDownStream(cellUpStream[i],selectedCellAddress);
    }

    cellObj.upstream = cellUpStream;

    //updating my and childrens value;
    updateChildCell(selectedCellAddress);
    dataObj[selectedCellAddress] = cellObj;
    console.log(dataObj);

})

function inputHandle(e){
    let address = e.currentTarget.getAttribute("cell-address");

    let cellObj = dataObj[address];
    cellObj.value = e.currentTarget.innerText;
    cellObj.formula  = undefined;
    let cellUpStream = cellObj.upstream;
    for(let i = 0;i<cellUpStream.length;i++){
        removeFromParentDownStream(cellUpStream[i],address);
    }
        
    cellObj.upstream = [];

    let cellDownStream = cellObj.downstream;

    for(let i = 0;i<cellDownStream.length;i++){
        updateChildCell(cellDownStream[i]);
    }
    dataObj[address] = cellObj;
    // console.log(dataObj);
}


function removeFromParentDownStream(parentCellAdress,cellAdress){
    let parentDownStream = dataObj[cellAdress].downstream;
    let updatedParentDownStream = [];
    for(let i =0;i< parentDownStream.length;i++){
        if(parentDownStream[i] != cellAdress){
            updatedParentDownStream[i] = parentDownStream[i];
        }
    }
    dataObj[parentCellAdress].downstream = updatedParentDownStream;
}

function updateChildCell(childAdress){
    let cellDiv = document.querySelector(`[cell-address=${childAdress}]`)
    let childObj= dataObj[childAdress];

    let childUpStream = childObj.upstream;
    let childFormula = childObj.formula;

    let valueObj = {};
    for(let i = 0;i<childUpStream.length;i++){
        valueObj[childUpStream[i]] = dataObj[childUpStream[i]].value;
    }

    for(let key in valueObj){
        childFormula = childFormula.replace(key,valueObj[key]);
    }

    childObj.value = eval(childFormula);
    cellDiv.innerText = childObj.value;
    let childDownStream = childObj.downstream;

    for(let i = 0;i<childDownStream.length;i++){
        updateChildCell(childDownStream[i]);
    }

}


function addToParentDownStream(parentCellAdress,cellAdress){
    dataObj[parentCellAdress].downstream.push(cellAdress);
}


function selectAlltheAttributes(address){

    leftAlign.classList.remove("selected-menu-option");
    centerAlign.classList.remove("selected-menu-option");
    rightAlign.classList.remove("selected-menu-option");
    bold.classList.remove("selected-menu-option");
    italic.classList.remove("selected-menu-option");
    underline.classList.remove("selected-menu-option");

    let obj = dataObj[address];
    
    if(obj.align == "left"){
        leftAlign.classList.add("selected-menu-option");
    }else if(obj.align == "center"){
        centerAlign.classList.add("selected-menu-option");
    }else{
        rightAlign.classList.add("selected-menu-option");
    }

    if(dataObj[address].style.bold == true){
        bold.classList.add("selected-menu-option");
    }

    if(dataObj[address].style.italic == true){
        italic.classList.add("selected-menu-option");
    }

    if(dataObj[address].style.underline == true){
        underline.classList.add("selected-menu-option");
    }
}

function checkCycle(selectedAddress,formula){
    let visCells = {};

    let upStream = [];
    let formulaSection = formula.split(" ");
    //adding new formula's variable to upstream;
    for(let i = 0;i < formulaSection.length;i++){
        if(formulaSection[i] == "+" || formulaSection[i] =="*" || 
        formulaSection[i] == "/" || formulaSection[i] == "-" || Number(formulaSection[i])){
            continue;
        }
        upStream.push(formulaSection[i]);
    }

    return cycleDf(selectedAddress,visCells,selectedAddress,upStream);
}

function cycleDf(selectedAddress,visCells,src,upstream){
    visCells[selectedAddress] = 1;

    let curupstream = [];
    if(selectedAddress == src){
        curupstream = upstream;
    }else{
        curupstream = dataObj[selectedAddress].upstream;
    }
    for(let i = 0;i<curupstream.length;i++){
        if(visCells[curupstream[i]] == undefined){
           let res = cycleDf(curupstream[i],visCells,src,upstream);
           if(res == true) return true;
        }else if(visCells[curupstream[i]] == 1){
            return true;
        }
    }
    visCells[selectedAddress] = 2;

    return false;
}