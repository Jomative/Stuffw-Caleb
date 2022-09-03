/**@type {HTMLCanvasElement} */
const can = document.getElementById("can");
can.width = 800;
can.height = 325;
const ctx = can.getContext("2d");
const nob = new NobsinCtx(ctx); //Nobsin Engine is Caleb's graphics framework

const black = [0,0,0,255];

function connect(){
    for(let i = 0; i < objs.length; i++){
        let o = objs[i];
        for(let j = i+1; j < objs.length; j++){
            let o1 = objs[j];
            let dx = o[0]-o1[0];
            let dy = o[1]-o1[1];
            let dist = Math.sqrt(dx**2+dy**2);
            if(dist < 30) nob.drawLine_smart(o[0],o[1],o1[0],o1[1],black,1);
        }
    }
}

let objs = [];
function gen(){
    for(let i = 0; i < 1000; i++){
        objs.push([
            Math.random()*nob.width,
            Math.random()*nob.height,
            Math.random()-0.5,
            Math.random()-0.5
        ]);
    }
}
gen();

let maxV = 1;

function update(){
    requestAnimationFrame(update);
    nob.pixelCount = 0;
    nob.buf = new Uint8ClampedArray(nob.size);

    for(let i = 0; i < objs.length; i++){
        let o = objs[i];

        let dx = o[0]-nob.centerX;
        let dy = o[1]-nob.centerY;
        if(false){
            let dist = Math.sqrt(dx**2,dy**2);
            let way = 1;
            if(dist > 60) way = 1;
            o[2] -= dx/dist/15*way;
            o[3] -= dy/dist/15*way;
        }

        let ang = Math.atan2(dy,dx);
        ang += Math.PI/2;
        let aspeed = 0.01;
        o[2] += Math.cos(ang)*aspeed;
        o[3] += Math.sin(ang)*aspeed;


        if(true){
            if(o[0] < 0){
                o[0] = 0;
                o[2] = -o[2];
            }
            else if(o[0] >= nob.width){
                o[0] = nob.width-1;
                o[2] = -o[2];
            }
            if(o[1] < 0){
                o[1] = 0;
                o[3] = -o[3];
            }
            else if(o[1] >= nob.height){
                o[1] = nob.height-1;
                o[3] = -o[3];
            }
        }

        if(o[2] > maxV) o[2] = maxV;
        else if(o[2] < -maxV) o[2] = -maxV;
        if(o[3] > maxV) o[3] = maxV;
        else if(o[3] < -maxV) o[3] = -maxV;

        o[0] += o[2];
        o[1] += o[3];
        nob.setPixel(o[0],o[1],black);
    }
    connect();

    ctx.putImageData(new ImageData(nob.buf,nob.width,nob.height),0,0);
}
update();