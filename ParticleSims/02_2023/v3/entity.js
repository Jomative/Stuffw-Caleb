class Entity{
    x;
    y;
    vx = 0;
    vy = 0;
    w = 10;
    h = 10;
    hp;
    isInteracting = false;
    isIdle = true;
    speed = 1.5;

    constructor(x, y, vx, vy){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }

    draw(){
        // nob.setPixel(this.x, this.y, [110, 110, 110, 255]);
        nob.drawRect(this.x, this.y, this.w, this.h, [110, 110, 110, 255]);
    }

    move(){
        this.x+=this.vx;
        this.y+=this.vy;
        //boundary keep in code
        if(this.x+this.w > nob.width){
            this.x = nob.width-this.w;
            this.vx = -this.vx;
        }
        if(this.x < 0){
            this.x = 0;
            this.vx = -this.vx;
        }
        if(this.y+this.h > nob.height){
            this.y = nob.height-this.h;
            this.vy = -this.vy;
        }
        if(this.y < 0){
            this.y = 0;
            this.vy = -this.vy;
        }
    }

    update(){
        //detecting other entities code
        this.move();
        this.draw();
    }


}