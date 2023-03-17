let dragDiv = document.getElementById("dragDiv");
let mX = null;
let mY = null;
let sX = null;
let sY = null;

let divRef = null;

// dragDiv.onmousedown = function(e){
//     this.style.left = e.clientX + "px";
//     this.style.top = e.clientY + "px";
// }

function update(){
    requestAnimationFrame(update);
    if(divRef){
        let x = parseInt(divRef.style.left.replace("px","")) || 0;
        let y = parseInt(divRef.style.top.replace("px","")) || 0;
        divRef.style.left = (x + (mX - sX)) + "px";
        divRef.style.top = (y + (mY - sY)) + "px";
        sX = mX;
        sY = mY;
    }
}
update();

dragDiv.onmousedown = function(e){
    divRef = this;
    sX = e.clientX;
    sY = e.clientY;
    divRef.style.pointerEvents = "none";
}

document.onmouseup = function(e){
    divRef.style.pointerEvents = "revert";
    divRef = null;
}

document.onmousemove = function(e){
    mX = e.clientX;
    mY = e.clientY;
}