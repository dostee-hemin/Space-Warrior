class ForceField extends Entity {
    constructor() {
        super(10000, false, 0);

        this.position = createVector(width/2,0);
        this.hitbox = {'type': 'circle', 'r':width};
        
        this.barrierAnimation = 0;
    }

    display() {
        stroke(0,100,200, this.barrierAnimation*200);
        noFill();
        strokeWeight(this.barrierAnimation*4);
        arc(this.position.x,this.position.y,this.hitbox.r*2,this.hitbox.r*2,this.barrierAnimation*HALF_PI, PI-this.barrierAnimation*HALF_PI);
    }

    getDamaged(damageAmount) {
        this.barrierAnimation = 1;
        p5.tween.manager.addTween(this)
            .addMotion('barrierAnimation',0,400,'easeInQuad')
            .startTween()
    }
}