const can = document.getElementById("can");
const ctx = can.getContext("2d");
const nob = new NobsinCtx(ctx);

let entities = [];

let jack = new Entity(nob.centerX-50, nob.centerY, (Math.random()-0.5)*3, (Math.random()-0.5)*3);
let jill = new Entity(nob.centerX+50, nob.centerY, (Math.random()-0.5)*3, (Math.random()-0.5)*3);
entities.push(jack);
entities.push(jill);

function simulateEntities(){
    for(let i = 0; i < entities.length; i++){
        entities[i].update();
    }
}

function update(){
    requestAnimationFrame(update);
    nob.updateStart();
    simulateEntities();

    nob.updateEnd();
}

update();

