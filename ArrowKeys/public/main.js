/**@type {HTMLCanvasElement} */
const can = document.getElementById("can");
can.width = 300;
can.height = 200;
const ctx = can.getContext("2d");

//Simply a list of colors
let colors = [
    "red",
    "orange",
    "gold", //made this color darker so you can see it better against the while background
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
/**@type {Player[]} */
let players = [];
/**@type {Particle[]} */
let particles = [];
//This holds a reference to your obj within [players]
/**@type {Player} */
let me;
class Obj{
    constructor(x,y,w){
        let t = this;
        t.x = x;
        t.y = y;
        t.w = w;
    }
    x = 0;
    y = 0;
    w = 0;
    vx = 0;
    vy = 0;
}
class Particle extends Obj{
    constructor(x,y,vx,vy,lifetime=120){
        super(x,y,4);
        this.vx = vx;
        this.vy = vy;
        this.lifetime = lifetime;
    }
    lifetime = -1;
    run(){
        if(translateObj(this,this.vx,this.vy)){
            return false;
        }
        ctx.fillStyle = "black";
        ctx.fillRect(this.x-1,this.y-1,2,2);
        if(this.lifetime != -1){
            if(this.lifetime) this.lifetime--;
            else return false; //we return false, indicating that we want to delete the particle from the scene
        }
        return true; //we return true, indicating the run was successful
    }
}
class Player extends Obj{
    constructor(name,sid,x,y,col){
        super(x,y,10);
        let t = this;
        t.name = name;
        t.sid = sid;
        t.col = col;
    }
    name;
    sid;
    lx = 0;
    ly = 0;
    maxSpeed = 2;
    drag = 0.95;
    col;
    gunAng = 0;
    run(){
        let obj = this;
        ctx.fillStyle = obj.col;
        ctx.fillRect(Math.floor(obj.x),Math.floor(obj.y),10,10);
        ctx.fillText(obj.name,Math.floor(obj.x),Math.floor(obj.y-5));

        if(mouseDown[2]){ //holding RIGHT click for rapid fire
            me.createBullet();
        }
    }
    createBullet(speed=1){
        let gap = 8;
        let gunLen = 10;
        let playerX = me.x+5; //we add 5 to get the center
        let playerY = me.y+5;
        let tx = Math.cos(me.gunAng);
        let ty = Math.sin(me.gunAng);
        particles.push(new Particle(playerX+tx*(gap+gunLen),playerY+ty*(gap+gunLen),tx*speed,ty*speed,120));
    }
}
/**
 * @param {Obj} t
 * @param {Number} x 
 * @param {Number} y 
 */
function translateObj(t,xx,yy){
    while(xx || yy){
        let absx = xx/Math.abs(xx);
        let absy = yy/Math.abs(yy);
        let x = xx?(Math.abs(absx)<Math.abs(xx)?absx:xx):0;
        let y = yy?(Math.abs(absy)<Math.abs(yy)?absy:yy):0;
        if(Math.abs(xx) < 1) xx = 0;
        if(Math.abs(yy) < 1) yy = 0;
        if(xx >= 1) xx--;
        else if(xx <= -1) xx++;
        else xx = 0;
        if(yy >= 1) yy--;
        else if(yy <= -1) yy++;
        else yy = 0;

        t.x += x;
        t.y += y;
        let w = t.w;
        let h = t.w;
        for(const p of players){
            if(p == t) continue; //so you don't collide with yourself, otherwise you could never move
            if(t.x+w <= p.x) continue;
            if(t.x >= p.x+w) continue;
            if(t.y+h <= p.y) continue;
            if(t.y >= p.y+h) continue;
            if(true){
                let dx = p.x-t.x;
                let dy = p.y-t.y;
                if(Math.abs(dx) > Math.abs(dy)){
                    if(t.x < p.x) t.x = p.x-w;
                    else t.x = p.x+w;
                    t.vx = 0;
                }
                else{
                    if(t.y < p.y) t.y = p.y-h;
                    else t.y = p.y+h;
                    t.vy = 0;
                }
                t.x = Math.round(t.x);
                t.y = Math.round(t.y);
            }
            else{
                t.x = Math.floor(t.lx);
                t.y = Math.floor(t.ly);
            }
            return true;
        }
        return false;
    }
}
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
    let d = new Player(name,sid,x,y,col);
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
socket.on("pos",(sid,x,y,gunAng)=>{
    if(sid == socket.id) return;
    for(let i = 0; i < players.length; i++){
        let p = players[i];
        if(p.sid == sid){
            p.x = x;
            p.y = y;
            p.gunAng = gunAng;
        }
    }
});

function drawCrosshair(x,y){
    x = Math.floor(x);
    y = Math.floor(y);
    ctx.fillStyle = "black";
    let r = 5;
    ctx.fillRect(x-r,y,r+r,1);
    ctx.fillRect(x,y-r,1,r+r);
}
/**
 * 
 * @param {Player} player 
 */
function drawGun(player){
    let ang = player.gunAng;
    let gap = 8; //if gap is 5, the start of the gun will be touching the player, greater than 5 would be slightly away from the player
    let gunLen = 10;
    let playerCenX = player.x+5; //player center x, each square is 10x10 px so half is the center
    let playerCenY = player.y+5;
    //we create x,y,tx,ty for starting x,y and target (end) x and y
    let x = playerCenX+Math.cos(ang)*gap;
    let y = playerCenY+Math.sin(ang)*gap;
    let tx = playerCenX+Math.cos(ang)*(gap+gunLen);
    let ty = playerCenY+Math.sin(ang)*(gap+gunLen);
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineWidth = 2;
    ctx.lineTo(tx,ty);
    ctx.stroke();
}

//These are the mouse coords in "canvas coordinates" not "screen space coordinates"
let mouseX = 0;
let mouseY = 0;
let keys = {};
let mouseDown = [false,false,false];
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
        translateObj(obj,obj.vx,obj.vy);
        if(Math.abs(obj.vx) < 0.05) obj.vx = 0;
        if(Math.abs(obj.vy) < 0.05) obj.vy = 0;
        if(me == obj) if(obj.vx || obj.vy) me.needsUpdate = true;

        //Apply drag to obj's velocity
        obj.vx *= obj.drag;
        obj.vy *= obj.drag;

        //Prevent the obj from moving out of bounds
        if(obj.x < 0) obj.x = 0;
        if(obj.x > can.width-10) obj.x = can.width-10;
        if(obj.y < 0) obj.y = 0;
        if(obj.y > can.height-10) obj.y = can.height-10;

        //Render the obj
        obj.run();

        drawGun(obj);
    }
    for(let i = 0; i < particles.length; i++){
        let p = particles[i];
        if(!p.run()){ //delete the obj
            particles.splice(i,1);
            i--;
            continue;
        }
    }

    //Run events that only YOU have access to
    if(me){
        //Apply velocity when you press arrow keys
        if(keys.d) me.vx += speed;
        if(keys.a) me.vx -= speed;
        if(keys.s) me.vy += speed;
        if(keys.w) me.vy -= speed;
        // if(keys.d || keys.a || keys.s || keys.w) me.needsUpdate = true;

        //Emit the message 'pos' to the server to send your player's position to everyone else
        if(me.needsUpdate){
            socket.emit("pos",me.x,me.y,me.gunAng); // - also send gunAng to the server so other people know where you are aiming
            me.needsUpdate = false;
        }

        //Draw crosshair
        drawCrosshair(mouseX,mouseY);
    }
}
update();

//Keyboard events
document.addEventListener("keydown",e=>{
    let key = e.key.toLowerCase();
    keys[key] = true;
});
document.addEventListener("keyup",e=>{
    let key = e.key.toLowerCase();
    keys[key] = false;
});
document.addEventListener("mousemove",e=>{
    let mx = e.clientX; //gets the mouse x coord in "screen space coordinates" which means it cooresponds with the resolution of your monitor
    let my = e.clientY; //gets the mouse y coord in "screen space"

    //then we convert them to "canvas coordinates" which means that the positions apply to the canvas and line up properly
    // - to do this we use a simple proportion
    //      part / whole = part / whole
    //      screenMouseX / canvasWidthInScreenPx = canvasMouseX / canvasWidth
    // so
    //      canvasMouseX = screenMouseX / canvasWidthInScreenPx * canvasWidth
    let canRect = can.getBoundingClientRect();
    mouseX = mx / canRect.width * can.width;
    mouseY = my / canRect.height * can.height;

    //Compute gunAng so that the gun points towards the cursor
    if(me){ // - make sure the player has loaded successfully
        let dx = mouseX-me.x-5; //x distance from player x to mouseX, then subtract 5 to account for center of player
        let dy = mouseY-me.y-5;
        me.gunAng = Math.atan2(dy,dx); //this is how you find the angle between two points
        me.needsUpdate = true;
    }
});
document.addEventListener("mousedown",e=>{
    mouseDown[e.button] = true;
    if(!me) return; //need to check
    if(e.button == 0){ //left click
        me.createBullet();
    }
});
document.addEventListener("mouseup",e=>{
    mouseDown[e.button] = false;
});