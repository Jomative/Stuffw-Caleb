/**@type {HTMLCanvasElement} */
const can = document.getElementById("can");
can.width = 300;
can.height = 100;
const ctx = can.getContext("2d");

let obj = {
    x:20,
    y:20,
    vx:0,
    vy:0,
    maxSpeed:2,
    drag:0.95
};

let keys = {};
function update(){
    requestAnimationFrame(update);
    ctx.clearRect(0,0,can.width,can.height);

    let speed = 0.1;
    if(keys.arrowright) obj.vx += speed;
    if(keys.arrowleft) obj.vx -= speed;
    if(keys.arrowdown) obj.vy += speed;
    if(keys.arrowup) obj.vy -= speed;

    if(obj.vx > obj.maxSpeed) obj.vx = obj.maxSpeed;
    else if(obj.vx < -obj.maxSpeed) obj.vx = -obj.maxSpeed;
    if(obj.vy > obj.maxSpeed) obj.vy = obj.maxSpeed;
    else if(obj.vy < -obj.maxSpeed) obj.vy = -obj.maxSpeed;

    obj.x += obj.vx;
    obj.y += obj.vy;

    obj.vx *= obj.drag;
    obj.vy *= obj.drag;

    if(obj.x < 0) obj.x = 0;
    if(obj.x > can.width-10) obj.x = can.width-10;
    if(obj.y < 0) obj.y = 0;
    if(obj.y > can.height-10) obj.y = can.height-10;

    ctx.fillStyle = "red";
    ctx.fillRect(Math.floor(obj.x),Math.floor(obj.y),10,10);
}
update();

document.addEventListener("keydown",e=>{
    let key = e.key.toLowerCase();
    keys[key] = true;
    e.preventDefault();
});
document.addEventListener("keyup",e=>{
    let key = e.key.toLowerCase();
    keys[key] = false;
});

