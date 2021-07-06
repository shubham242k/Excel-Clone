let rowsContainer = document.querySelector(".row-number-section");
for(let i = 1;i<=100;i++){
    let div = document.createElement("div");
    div.classList.add("row-number");
    div.innerText = i;
    rowsContainer.append(div);
}

let columnsContainer = document.querySelector(".column-number-section");
for(let i = 0;i<26;i++){
    let div = document.createElement("div");
    div.classList.add("column-number");
    div.innerText = String.fromCharCode(65+i);
    columnsContainer.append(div);
}