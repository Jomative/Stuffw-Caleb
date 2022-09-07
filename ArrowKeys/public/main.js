/**@type {HTMLCanvasElement} */
const can = document.getElementById("can");
can.width = 300;
can.height = 100;
const ctx = can.getContext("2d");

//Simply a list of colors
let colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple"
];

//socket allows us to emit messages to the server (socket.emit) or receive messages (socket.on)
let socket = io();

//Uncomment the prompt if you want to enter a name for your player. I'll add a think where it renders a players name as a label beside them later
let playerName = prompt("Enter your name");

/**
 * This function searches through an array and returns true if any element in that array with a certain [prop] equals a value [val]
 * @param {*[]} ar 
 * @param {String} prop 
 * @param {*} val 
 */
function propInArrayEquals(ar,prop,val){
    for(let i = 0; i < ar.length; i++){
        if(ar[i][prop] == val) return true;
    }
    return false;
}

//Local list of the player objects we use to render the scene
let players = [];
//This holds a reference to your obj within [players]
let me;
/**
 * This function simply creates the player obj to be stored locally in [players]
 * @param {String} name 
 * @param {String} sid 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number[]} col 
 */
function createPlayer(name,sid,x,y,col){
    if(propInArrayEquals(players,"sid",sid)) return;
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
    if(sid == socket.id) me = d;
    return d;
}

//We send a message to the server indicating we want to add a new player to the scene
socket.emit("initJoin",playerName,
    Math.floor(Math.random()*can.width), //random x pos
    Math.floor(Math.random()*can.height), //random y pos
    colors[Math.floor(Math.random()*colors.length)] //random color
);
//We listen for the server to emit to us the 'join' event which contains all the player data stored on the server
//  - next we loop through the server player data and generate it for the local side to interpret
socket.on("join",(name,id,players1)=>{
    let ok = Object.keys(players1);
    for(let i = 0; i < ok.length; i++){
        let id = ok[i];
        let p = players1[id];
        createPlayer(
            p.name,
            p.sid,
            p.x,
            p.y, 
            p.col 
        );
    }
});

//When someone disconnects from the server (closes the tab/window or refreshes) then
//  it will emit a leave event to everyone so we can remove them from the client side
//  and stop rendering them
socket.on("leave",(sid)=>{
    for(let i = 0; i < players.length; i++){
        let p = players[i];
        if(p.sid == sid){
            players.splice(i,1);
            break;
        }
    }
});
//We receive the 'pos' message from the server along with who moved and what their position is
socket.on("pos",(sid,x,y)=>{
    if(sid == socket.id) return;
    for(let i = 0; i < players.length; i++){
        let p = players[i];
        if(p.sid == sid){
            p.x = x;
            p.y = y;
        }
    }
});

let keys = {};
function update(){
    requestAnimationFrame(update);
    ctx.clearRect(0,0,can.width,can.height);
    
    let speed = 0.1;

    for(let i = 0; i < players.length; i++){
        let obj = players[i];

        //Handle maxSpeed
        if(obj.vx > obj.maxSpeed) obj.vx = obj.maxSpeed;
        else if(obj.vx < -obj.maxSpeed) obj.vx = -obj.maxSpeed;
        if(obj.vy > obj.maxSpeed) obj.vy = obj.maxSpeed;
        else if(obj.vy < -obj.maxSpeed) obj.vy = -obj.maxSpeed;

        //Apply velocity to obj's position
        obj.x += obj.vx;
        obj.y += obj.vy;

        //Apply drag to obj's velocity
        obj.vx *= obj.drag;
        obj.vy *= obj.drag;

        //Prevent the obj from moving out of bounds
        if(obj.x < 0) obj.x = 0;
        if(obj.x > can.width-10) obj.x = can.width-10;
        if(obj.y < 0) obj.y = 0;
        if(obj.y > can.height-10) obj.y = can.height-10;

        //Render the obj
        ctx.fillStyle = obj.col;
        ctx.fillRect(Math.floor(obj.x),Math.floor(obj.y),10,10);
        ctx.fillText(obj.name, obj.x, (obj.y-5));
    }

    //Run events that only YOU have access to
    if(me){
        //Apply velocity when you press arrow keys
        if(keys.arrowright) me.vx += speed;
        if(keys.arrowleft) me.vx -= speed;
        if(keys.arrowdown) me.vy += speed;
        if(keys.arrowup) me.vy -= speed;

        //Emit the message 'pos' to the server to send your player's position to everyone else
        socket.emit("pos",me.x,me.y);
    }
}
update();

//Keyboard events
document.addEventListener("keydown",e=>{
    let key = e.key.toLowerCase();
    keys[key] = true;
    e.preventDefault();
});
document.addEventListener("keyup",e=>{
    let key = e.key.toLowerCase();
    keys[key] = false;
});

