const can = document.getElementById("can");
const ctx = can.getContext("2d");
const nob = new NobsinCtx(ctx);

const myCOLORS = {
    gray:[110, 110, 110, 255],
    red:convert('firebrick'),

};

//each particle is affected by other particles
//chunck system
//combining chunk system with efficiency checks is best collision method
/* collision checks between particles
for(let i = 0; i < arr.length; i++){
    for(let j = i+1; j < arr.length; j++){
        calc i & j
    }
}
*/

let particles = [];

class Particle{
    x;
    y;
    vx;
    vy;
    w = 10;
    h = 10;
    constructor(x, y, vx, vy){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }
    draw(){
        nob.drawRect(this.x, this.y, this.w, this.h, [110, 110, 110, 255]);
    }
    update(){
        //collision
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
        this.x += this.vx*deltaScale;
        this.y += this.vy*deltaScale;
        this.draw();
    }
}

function genParticles(num){
    // return;
    for(let i = 0; i < num; i++){
        let p = new Particle(Math.random()*nob.width, Math.random()*nob.height, (Math.random()-0.5), (Math.random()-0.5)); 
        particles.push(p);
    }
}

genParticles(30);
//1 frame is 16.67ms (1000/60)
//so if it takes 8.33ms to do a frame, current fps is 120

//1000ms is 1s
//fps slow down / speed up
//performance.now() = current time(ms) since page load

let deltaScale = 1;
let lastTime = 0;

let gameSpeed = 1;

let startFlash = true;

let flashI = 0;
let flashT = 60;

let useStress = true;

function update(){
    
    requestAnimationFrame(update);
    nob.updateStart();
    for(let i = 0; i < particles.length; i++){
        particles[i].update();
        let p1 = particles[i];
        let p2 = particles[i+1];
        if(p2) nob.drawLine_smart(p1.x+p1.w/2, p1.y+p1.h/2, p2.x+p2.w/2, p2.y+p2.h/2, myCOLORS.red, 5);
    }

    //stress test
    let tempVal = 0;
    let len = 5000000;
    len += 4000000*Math.sin(performance.now()/300);
    // console.log(len);
    if(useStress) for(let i = 0; i < len; i++){
        tempVal += i%300;
        tempVal += i%300;
        tempVal += i%300;
        tempVal += i%300;
        tempVal += i%300;
        tempVal += i%300;
    }
    
    //!! 
    flashI += deltaScale;
    if(flashI >= flashT){
        flashI = 0;
    }
    if(flashI/flashT < 0.5){
        nob.drawRect(20,20,60,60,myCOLORS.gray);
    }

    // if(false) if(startFlash){
    //     startFlash = false;
    //     subAnim(Math.floor(60/deltaScale),function(i,t,e,isDone){
    //         if(i/t < 0.5){
    //             nob.drawRect(20,20,60,60,myCOLORS.gray);
    //         }
    //         if(i >= t-1) startFlash = true;
    //     });
    // }
    
    updateEvts();
    nob.updateEnd();

    
    let deltaTime = performance.now()-lastTime;
    lastTime = performance.now();
    let fps = 16.66667/deltaTime*60;
    deltaScale = 60/fps*gameSpeed;
    console.log(16.66667/deltaTime*60);//16/16 * 60 = 60fps; if it took 33ms, 16/33 * 60, 30fps; so this formula calc theoretical frame rate
    //theoretical frame rate is what your fps would be if there was no JS 60fps cap
}

update();