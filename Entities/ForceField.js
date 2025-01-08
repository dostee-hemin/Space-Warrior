class ForceField extends Entity {
    constructor() {
        super(10000, false, 0);

        this.position = createVector(W/2,0);
        this.hitbox = {'type': 'circle', 'r':W};
        
        this.barrierAnimation = 0;
        this.closeAnimation = -1;
    }

    display() {
        if(this.closeAnimation == -1) {
            stroke(0,100,200, this.barrierAnimation*200);
            noFill();
            strokeWeight(this.barrierAnimation*4);
            arc(this.position.x,this.position.y,this.hitbox.r*2,this.hitbox.r*2,this.barrierAnimation*HALF_PI, PI-this.barrierAnimation*HALF_PI);
        } else {
            stroke(0,100,200, 200);
            noFill();
            strokeWeight(4);
            arc(this.position.x,this.position.y,this.hitbox.r*2,this.hitbox.r*2,HALF_PI*(1+this.closeAnimation), HALF_PI*(5-this.closeAnimation));
        }
    }

    getDamaged(damageAmount) {
        this.barrierAnimation = 1;
        p5.tween.manager.addTween(this)
            .addMotion('barrierAnimation',0,400,'easeInQuad')
            .startTween()
    }

    close() {
        this.closeAnimation = 0;
        p5.tween.manager.addTween(this)
            .addMotion('closeAnimation',0,500,'easeInQuad')
            .addMotion('closeAnimation',1,1000,'easeInQuad')
            .onEnd(()=>{entities.splice(entities.indexOf(this),1);})
            .startTween()
    }
}