/**@type {HTMLCanvasElement} */
const can = document.getElementById("can");
can.width = 300;
can.height = 100;
const ctx = can.getContext("2d");

let socket = io();

let playerName = prompt("Enter your name");

let players = [];
let me;
function createPlayer(name,sid,x,y,col){
    let d = {
        name,
        sid,
        x,
        y,
        vx:0,
        vy:0,
        maxSpeed:2,
        drag:0.95,
        col
    };
    players.push(d);
    if(name == playerName) me = d;
    return d;
}
//me = createPlayer(0,20,20,"red");
socket.emit("initJoin",playerName,
    Math.floor(Math.random()*can.width),
    Math.floor(Math.random()*can.height),
    colors[Math.floor(Math.random()*colors.length)]
);

let colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple"
];
socket.on("join",(name,id,players1)=>{
    for(let i = 0; i < players1.length; i++){
        let p = players1[i];
        createPlayer(
            p.name,
            p.id,
            p.x,
            p.y, 
            p.col 
        );
    }
});

//Math.floor(Math.random()*can.height) //random pos
//colors[Math.floor(Math.random()*colors.length)] //random color

//kick players whove left
socket.on("leave",(id)=>{
    for(let i = 0; i < players.length; i++){
        let p = players[i];
        if(p.sid == id){
            players.splice(i,1);
            break;
        }
    }
});

let keys = {};
function update(){
    requestAnimationFrame(update);
    ctx.clearRect(0,0,can.width,can.height);

    if(!me) return;

    let speed = 0.1;
    if(keys.arrowright) me.vx += speed;
    if(keys.arrowleft) me.vx -= speed;
    if(keys.arrowdown) me.vy += speed;
    if(keys.arrowup) me.vy -= speed;

    for(let i = 0; i < players.length; i++){
        let obj = players[i];
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

        ctx.fillStyle = obj.col;
        ctx.fillRect(Math.floor(obj.x),Math.floor(obj.y),10,10);
    }
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

