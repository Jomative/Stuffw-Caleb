// let dragDiv = document.getElementById("dragDiv");
let mX = null;
let mY = null;
let sX = null;
let sY = null;

let divRef = null;

// dragDiv.onmousedown = function(e){
//     this.style.left = e.clientX + "px";
//     this.style.top = e.clientY + "px";
// }

class Particle{
    x;
    y;
    w;
    h;
    constructor(x, y, w, h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

let p1 = new Particle(50, 50, 5, 5);
function update(){
    requestAnimationFrame(update);
    p1.draw();
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