var container = document.getElementById("container");
var cells = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var board = document.getElementsByClassName("cell");
var isDragging = false;
var dragColor = 0;
var size = 3;
var isRunning = false;
var runInterval;

function reload(){
    container.innerHTML = "";
    for(var i = 0; i < size * size; i++){
       var newcell = document.createElement("div");
       newcell.classList.add("cell");
       newcell.id = "c" + i;
       newcell.style.width = 600 / size + 'px';
       newcell.style.height = 600 / size + 'px';
       container.appendChild(newcell);
    }
    board = document.getElementsByClassName("cell");
    cells = [];
    for(var j = 0; j < size * size; j++){
        cells.push(0);
    }
    for(var i = 0; i < board.length; i++){
        board[i].addEventListener("mousedown", fill);
        board[i].addEventListener("mouseenter", drag);
    }
}

function fill(event){
    var num = event.target.id.split("c")[1] * 1;
    isDragging = true;
    if(cells[num] == 0){
        cells[num] = 1;
        dragColor = 1;
        event.target.classList.add("live");
    }else{
        cells[num] = 0;
        dragColor = 0;
        event.target.classList.remove("live");
    }
    
}
function drag(event){
    if(isDragging){
    var num = event.target.id.split("c")[1] * 1;
        if(cells[num] == 0 && dragColor == 1){
            cells[num] = 1;
            event.target.classList.add("live");
        }else if(cells[num] == 1 && dragColor == 0){
            cells[num] = 0;
            event.target.classList.remove("live");
        }
    }

    
}

function stopdrag(){
    isDragging = false;
}

function sizeChange(event){
    if(event.keyCode == 187){
        size++;
    }else if(event.keyCode == 189){
        size--;
    }else{
        return;
    }
    reload();
}

function oneday(){
    var nextcells = [];
    for(var i = 0; i < size * size; i++){
        nextcells.push(0);
    }
    for(var a = 0; a < size; a++){
        for(var b = 0; b < size; b++){
            var index = size * b + a;
            var neighbor = getneighbor(a, b);
            if(getcell(a, b) == 1){
                if(neighbor == 2 || neighbor == 3){
                    nextcells[index] = 1;
                }
            }else{
                if(neighbor == 3){
                    nextcells[index] = 1;
                }
            }
        }
    }
    cells = nextcells;
    loadcells();
}

function loadcells(){
    for(var i = 0; i<size*size; i++){
        if(cells[i] == 1){
            if(!board[i].classList.contains("live")){
                board[i].classList.add("live");
            }
        }else{
            if(board[i].classList.contains("live")){
                board[i].classList.remove("live");
            }
        }
    }
}
function getcell(x, y){
    if(x < 0 || y < 0 || x >= size || y >= size){
        return 0;
    }
    return cells[x + y * size];
}

function getneighbor(x, y){
    var neighbors = 0;
    for(var i =- 1; i<=1; i++){
        for(var j =- 1; j<=1; j++){
            if(i != 0 || j!= 0){
                neighbors += getcell(x+i, y+j);
            }
        }
    }
    return neighbors;
}

function start(){
    runInterval = setInterval(oneday, 500);
    isRunning = true;
}
function end(){
    clearInterval(runInterval);
    isRunning = false;
}
function space(event){
    if(event.keyCode == 32){
        if(isRunning == true){
            end();
        }else{
            start();
        }
    }
}

window.addEventListener("mouseup", stopdrag);
window.addEventListener("keydown", sizeChange);

window.addEventListener("keydown", space);
reload();