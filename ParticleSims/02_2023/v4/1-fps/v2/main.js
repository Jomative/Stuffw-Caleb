const can = document.getElementById("can");
const ctx = can.getContext("2d");
const nob = new NobsinCtx(ctx);
const btn = document.getElementById("speedBtn");
const bbtn = document.getElementById("badBtn");
const sld = document.getElementById("speedSlider");

let fps = 0;
let deltaScale = 0;
let gameSpeed = 1;

class Particle{
    x;
    y;
    vx;
    vy;
    w = 10;
    h = 10;
    c;
    
    constructor(x, y, vx, vy, c){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.c = c;
    }
    
    draw(){
        nob.drawRect(this.x, this.y, this.w, this.h, this.c);
        
    }
    update(){
        if(this.x+this.w > nob.width){
            this.vx = (Math.random()-0.5)*5;
            this.x = nob.width-this.w;
        }
        if(this.x < 0){
            this.vx = (Math.random()-0.5)*5;
            this.x = 0;
        }
        if(this.y+this.h > nob.height){
            this.vy = (Math.random()-0.5)*5;
            this.y = nob.height-this.h;
        }
        if(this.y < 0){
            this.vy = (Math.random()-0.5)*5;
            this.y = 0;
        }

        this.y += this.vy*deltaScale;
        this.x += this.vx*deltaScale;
        this.draw();
    }
}

let particles = [];

function genParticles(num){
    for(let i = 0; i < num; i++){
        let p = new Particle(Math.random()*nob.width, Math.random()*nob.height, (Math.random()-0.5), (Math.random()-0.5), [255,0,0,255]);
        particles.push(p);
    }
}
genParticles(30);
let lastTime = 0;
function update(){
    requestAnimationFrame(update);
    nob.updateStart();
    for(let i = 0; i < particles.length; i++){
        particles[i].update();
    }
    
    nob.updateEnd();
    let deltaTime = performance.now() - lastTime;//time between end of prevFrame and curFrame
    lastTime = performance.now();
    fps = (16.667/deltaTime)*60;
    deltaScale = 60/fps*gameSpeed;
}
update();


btn.onclick = function(){
    if(gameSpeed >= 4){
        gameSpeed = 0;
    }
    gameSpeed++;
    btn.textContent = `Game Speed x${gameSpeed}`;
    sld.value = gameSpeed;
};
bbtn.onclick = function(){
    gameSpeed = 100;
}

sld.oninput = function(){
    gameSpeed = parseFloat(this.value);
};