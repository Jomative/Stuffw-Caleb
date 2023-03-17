const can = document.getElementById("can");
const ctx = can.getContext("2d");

const nob = new NobsinCtx(ctx);
let count = 0;
let delay = 180;//4 seconds

function updateStart(){
    nob.pixelCount = 0;
    nob.buf = new Uint8ClampedArray(nob.size);
}
function updateEnd(){
    ctx.putImageData(new ImageData(nob.buf,nob.width,nob.height),0,0);
}

class Particle{
    x;
    y;
    vx;
    vy;
    constructor(x, y, vx, vy){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }

    draw(){
        nob.setPixel(this.x, this.y, [110, 110, 110, 255]);
    }
    update(){
        this.x+= this.vx;
        this.y+= this.vy;
        this.draw();
        
    }

}

let particles = [];

function genParticles(){
    for(let i = 0; i < 100000; i++){
        let p = new Particle(Math.random()*nob.width, Math.random()*nob.height, (Math.random()-0.5)*5, (Math.random()-0.5)*5);
        particles.push(p);
    }
}


function update(){
    requestAnimationFrame(update);
    updateStart();
    for(let i = 0; i < particles.length; i++){
        particles[i].update();
    }
    count++;
    if(count >= delay){
        particles = [];
        genParticles();
        count = 0;
    }
    updateEnd();
}

update();