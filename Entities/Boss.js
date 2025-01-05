class Boss extends Entity {
    constructor() {
        super(300, false, 2000);

        this.FLY_IN_STAGE = 0;
        this.SHIELD_STAGE = 1;
        this.NORMAL_ATTACK_STAGE = 2;
        this.HEAVY_ATTACK_STAGE = 3;
        this.END_STAGE = 4;

        this.stage = this.FLY_IN_STAGE;
        this.battleshipPositionX = -width;
        this.battleshipPositionY = -100;
        this.battleshipRotation = -HALF_PI;
        this.battleshipScale = 1;
        this.healthBarAnimation = 0;
        this.velocity = createVector(1,0);
        this.position = createVector(this.battleshipPositionX, this.battleshipPositionY);
        this.hitbox = {'type': 'rect', 'w':width, 'h':300};

        this.forceField = new ForceField();

        p5.tween.manager.addTween(this)
            .addMotion('battleshipPositionX', -width, 3000)
            .addMotions([
                {key: 'battleshipPositionX', target: width/2},
                {key: 'battleshipRotation', target: 0},
            ], 2000, 'easeOutQuad')
            .addMotion('battleshipPositionX', width/2, 1000)
            .addMotions([
                {key:'battleshipRotation', target: -PI},
                {key:'battleshipPositionY', target: 175}
            ], 3000, 'easeInOutSin')
            .addMotion('battleshipPositionX', width/2, 400)
            .addMotion('battleshipScale', 1.04, 30)
            .addMotion('battleshipScale', 1, 30)
            .addMotion('battleshipScale', 1.04, 30)
            .addMotion('battleshipScale', 1, 30)
            .addMotion('battleshipScale', 1.04, 30)
            .addMotion('battleshipScale', 1, 30)
            .addMotion('healthBarAnimation', 1, 1000, 'easeInOutQuad')
            .addMotion('healthBarAnimation', 1, 1000)
            .onEnd(()=>{this.changeToNextStage();})
            .startTween()
            

    }

    update() {
        this.position.set(this.battleshipPositionX, this.battleshipPositionY);
        this.forceField.position.set(this.battleshipPositionX, this.battleshipPositionY-200);

        switch(this.stage) {
            case this.SHIELD_STAGE:
                this.battleshipPositionX += this.velocity.x*0.3;
                if(Math.abs(this.battleshipPositionX - width/2) > 20) this.velocity.x *= -1;

                if(random(1) < 0.004) {
                    let rocketSpawnPosition = random(1) < 0.5 ? 200 : width-200;
                    new SmartBullet(rocketSpawnPosition,300,player,false);
                }
                break;
        }
    }

    display() { 
        push();
        translate(this.battleshipPositionX, this.battleshipPositionY);
        rotate(this.battleshipRotation);
        scale(this.battleshipScale);
        fill(255);
        stroke(0);
        strokeWeight(5);
        rectMode(CENTER);
        rect(0, 0, width*1.4, 300);
        fill(0);
        noStroke();
        rect(0,100,width*0.8,100);
        pop();

        this.displayHealthBar(width/2, 80, width*0.9*this.healthBarAnimation, 20, CORNER);
        rectMode(CORNER);
        stroke(0);
        strokeWeight(this.healthBarAnimation*3);
        noFill();
        rect(width/2-(width*0.45)*this.healthBarAnimation, 70, width*0.9*this.healthBarAnimation, 20);

    }

    getDamaged(damageAmount) {
        if(this.stage < this.NORMAL_ATTACK_STAGE) return;
        console.log(this.stage, this.NORMAL_ATTACK_STAGE)
        super.getDamaged(damageAmount);
    }

    changeToNextStage() {
        switch(this.stage) {
            case this.SHIELD_STAGE:
                this.forceField.close();
                break;
        }

        this.stage++;
    }
}