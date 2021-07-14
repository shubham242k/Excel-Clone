let cellSection = document.querySelector(".cell-section");
let rowsContainer = document.querySelector(".row-number-section");
let columnsContainer = document.querySelector(".column-number-section");
let cellAddressShower = document.querySelector(".selected-cell-div");
let formulaInput = document.querySelector(".formula-input-box");
let dataObj ={};
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
            value:undefined,
            formula:undefined,
            upstream:[],
            downstream:[],
        };
        let cellDiv = document.createElement("div");
        cellDiv.contentEditable = true;
        cellDiv.classList.add("cell");
        cellDiv.setAttribute("cell-address",cellAddress);

        cellDiv.addEventListener("click",function(e){
            cellAddressShower.innerText = cellDiv.getAttribute("cell-address");
            if(lastSelectedCell){
                lastSelectedCell.classList.remove("selected-cell");
            }
            e.currentTarget.classList.add("selected-cell");
            lastSelectedCell = e.currentTarget;
        })

        cellDiv.addEventListener("input",inputHandle);
        perRowDiv.append(cellDiv);
    }
    cellSection.append(perRowDiv);
    
}

dataObj["A1"].value = 20;
dataObj["A1"].downstream = ["B1"];
dataObj["B1"].value = 40;
dataObj["B1"].formula = "2 * A1";
dataObj["B1"].upstream = ["A1"];


// console.log(dataObj);
cellSection.addEventListener("scroll",function(e){
    console.log(e.currentTarget.scrollLeft);
    columnsContainer.style.transform = `translateX(-${e.currentTarget.scrollLeft}px)`;
    rowsContainer.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`;
})

formulaInput.addEventListener("keydown",function(e){
    if(e.key != "Enter" || !lastSelectedCell)return;

    let selectedCellAddress = lastSelectedCell.getAttribute("cell-address");

    let cellObj = dataObj[selectedCellAddress];
    cellObj.formula = e.currentTarget.innerText;
    let cellUpStream = cellObj.upstream;
    for(let i = 0;i<cellUpStream.length;i++){
        removeFromParentDownStream(cellUpStream[i],selectedCellAddress);
    }

    cellObj.upstream = [];
    dataObj[selectedCellAddress] = cellObj;
    console.log(dataObj);

})

function inputHandle(e){
    let address = e.currentTarget.getAttribute("cell-address");

    let cellObj = dataObj[address];
    cellObj.value = e.currentTarget.innerText;
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