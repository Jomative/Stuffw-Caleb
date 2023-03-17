/**@type {HTMLCanvasElement} */
const can = document.getElementById("can");
const ctx = can.getContext("2d");
let target = {x: 300, y: 300};
let chain = [{x: 100, y: 100}];
let numJoints = 3;
let jointLength = 50;
let gx = 0;
let gy = 0;

class Point{
    x;
    y;
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    
    draw(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, 5, 5);
    }

    onclick(){
        if(gx > this.x - 5 /*&& gx < this.x + 10 && gy > this.y + 5 && gy < this.y - 5*/){
            this.x = gx;
            this.y = gy;
            console.log("follow me");
        }
    }
}

let p1 = new Point(50, 50);
let p2 = new Point(100, 100);

function dist(x1, y1, x2, y2){
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}

function angle(x1, y1, x2, y2){
    return Math.atan2(y2 - y1, x2 - x1);
}

function update(){
    requestAnimationFrame(update);
    ctx.clearRect(0, 0, can.width, can.height);
    p1.draw();
    p2.draw();
}
update();

document.addEventListener("mousemove", function(e){
    gx = e.clientX/can.offsetWidth*can.width;
    gy = e.clientY/can.offsetHeight*can.height;
});

document.addEventListener("mousedown", function(e){
    console.log(gx, gy);
    p1.onclick();
    p2.onclick();
});



