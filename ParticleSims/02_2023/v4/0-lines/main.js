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
        this.x += this.vx;
        this.y += this.vy;
        this.draw();
    }
}

function genParticles(num){
    for(let i = 0; i < num; i++){
        let p = new Particle(Math.random()*nob.width, Math.random()*nob.height, (Math.random()-0.5), (Math.random()-0.5)); 
        particles.push(p);
    }
}

genParticles(30);
//fps slow down / speed up
function update(){
    requestAnimationFrame(update);
    nob.updateStart();
    for(let i = 0; i < particles.length; i++){
        particles[i].update();
        let p1 = particles[i];
        let p2 = particles[i+1];
        if(p2) nob.drawLine_smart(p1.x+p1.w/2, p1.y+p1.h/2, p2.x+p2.w/2, p2.y+p2.h/2, myCOLORS.red, 5);
    }

    nob.updateEnd();
}

update();