const can = document.getElementById("can");
const ctx = can.getContext("2d");
const nob = new NobsinCtx(ctx);

let rot = [0,0,0];

let points = [
    //bottom
    [-1,-1,-1],
    [1,-1,-1],
    [1,1,-1],
    [-1,1,-1],
    //top
    [-1,-1,1],
    [1,-1,1],
    [1,1,1],
    [-1,1,1]
];
for(let i = 0; i < points.length; i++){
    let p = points[i];
    let scale = 20;
    p[0] *= scale;
    p[1] *= scale;
    p[2] *= scale;
}

function connect(i,j){
    let p = points[i];
    let p2 = points[j];
    let z = 0;
    // z = Math.sin(performance.now()/300)*16;
    let pos = rot3D(p[0],p[1],p[2]+z,0,0,0,rot[0],rot[1],rot[2]);
    let pos2 = rot3D(p2[0],p2[1],p2[2]+z,0,0,0,rot[0],rot[1],rot[2]);
    nob.drawLine_smart(nob.centerX+pos[0],nob.centerY+pos[1]-pos[2],nob.centerX+pos2[0],nob.centerY+pos2[1]-pos2[2],c_red,1);
}

let count = 70;
nob.updateStart();
function update(){
    count--;
    requestAnimationFrame(update);
    
    if(count > 0){
        rot[2] = Math.pow(performance.now(),2)/2000000;

    } 
    // rot[1] -= 0.8;
    // rot[0] += 0.005;

    if(false) for(let i = 0; i < points.length; i++){
        let p = points[i];
        let x = p[0];
        let y = p[1];
        let z = p[2];

        let pos = rot3D(x,y,z,0,0,0,rot[0],rot[1],rot[2]);

        let screenx = pos[0];
        let screeny = pos[1]-pos[2];
        nob.setPixel(nob.centerX+screenx,nob.centerY+screeny,c_black);
    }

    // for(let i = 0; i < points.length-1; i++){
    //     connect(i,i+1);
    // }
    // connect(0,points.length-1);
    connect(0,1);
    connect(1,2);
    connect(2,3);
    connect(0,3);

    connect(4,5);
    connect(5,6);
    connect(6,7);
    connect(4,7);

    connect(0,4);
    connect(1,5);
    connect(2,6);
    connect(3,7);

    nob.drawText("HELLO THERE JORY!",50,20,c_white,c_black);
    
    nob.updateEnd();
}
update();