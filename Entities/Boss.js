class Boss extends Entity {
    constructor() {
        super(10, false, 2000);

        this.FLY_IN_STAGE = 0;
        this.SHIELD_STAGE = 1;
        this.NORMAL_ATTACK_STAGE = 2;
        this.HEAVY_ATTACK_STAGE = 3;
        this.END_STAGE = 4;

        this.stage = this.FLY_IN_STAGE;
        this.stageTransitionTime = 0;
        this.stageTransitionDuration = 2000;

        this.battleshipPositionX = -width;
        this.battleshipPositionY = -100;
        this.battleshipRotation = -HALF_PI;
        this.battleshipScale = 1;
        this.position = createVector(this.battleshipPositionX, this.battleshipPositionY);
        this.velocity = createVector(1,0);
        this.hitbox = {'type': 'rect', 'w':width, 'h':300};

        this.healthBarAnimation = 0;
        this.forceField = new ForceField();
        this.attackSpawners = [];

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
            .addMotion('healthBarAnimation', 1, 1000, 'easeInOutQuad')
            .addMotion('healthBarAnimation', 1, 1000)
            .onEnd(()=>{this.changeToNextStage();})
            .startTween()
            

    }

    update() {
        this.position.set(this.battleshipPositionX, this.battleshipPositionY);
        this.forceField.position.set(this.battleshipPositionX, this.battleshipPositionY-200);

        if(millis() - this.stageTransitionTime < this.stageTransitionDuration) return;

        if(this.stage >= this.SHIELD_STAGE) {
            this.battleshipPositionX += this.velocity.x*0.3;
            if(Math.abs(this.battleshipPositionX - width/2) > 20) this.velocity.x *= -1;
        }

        switch(this.stage) {
            case this.NORMAL_ATTACK_STAGE:
               if(this.health <= this.baseHealth/2) this.changeToNextStage(); 
               break;
            case this.HEAVY_ATTACK_STAGE:
                if(this.health <= 0) this.changeToNextStage();
                break;
        }

        for(let attack of this.attackSpawners) attack.update();
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
        super.getDamaged(damageAmount);
    }

    isFinished() {
        return this.stage > this.END_STAGE;
    }

    changeToNextStage() {
        this.attackSpawners = [];

        // End of current stage
        switch(this.stage) {
            case this.SHIELD_STAGE:
                this.forceField.close();
                break;
            case this.NORMAL_ATTACK_STAGE:
                p5.tween.manager.addTween(this)
                    .addMotion('battleshipPositionX', width/2, 500, 'easeInOutQuad')
                    .addMotion('battleshipPositionX', width/2, 500)
                    .addMotion('battleshipPositionX', width/2+5, 20)
                    .addMotion('battleshipPositionX', width/2-5, 20)
                    .addMotion('battleshipPositionX', width/2+5, 20)
                    .addMotion('battleshipPositionX', width/2-5, 20)
                    .addMotion('battleshipPositionX', width/2+5, 20)
                    .addMotion('battleshipPositionX', width/2-5, 20)
                    .addMotion('battleshipPositionX', width/2+5, 20)
                    .addMotion('battleshipPositionX', width/2-5, 20)
                    .addMotion('battleshipPositionX', width/2+5, 20)
                    .addMotion('battleshipPositionX', width/2-5, 20)
                    .addMotion('battleshipPositionX', width/2+5, 20)
                    .addMotion('battleshipPositionX', width/2-5, 20)
                    .addMotion('battleshipPositionX', width/2, 20)
                    .startTween()
                break;
        }

        this.stageTransitionTime = millis();
        this.stage++;
        // Start of next stage
        switch(this.stage) {
            case this.SHIELD_STAGE:
                this.attackSpawners.push(new RocketLauncher());
                break;
            case this.NORMAL_ATTACK_STAGE:
                this.attackSpawners.push(new SpiralAttack(0));
                break;
            case this.HEAVY_ATTACK_STAGE:
                this.attackSpawners.push(new SpiralAttack(1));

                let sniperPathLeft = new HorizontalLinePath().generatePath(true);
                new LargeTroop(this.position.x + width*random(-0.3,0.3), this.position.y-100,sniperPathLeft, 10)
                let sniperPathRight = new HorizontalLinePath().generatePath(false);
                new LargeTroop(this.position.x + width*random(-0.3,0.3), this.position.y-100,sniperPathRight, 11)

                let barricadePath = new BarricadePath().generatePath();
                for(let i=0; i<36; i++) {
                    new SmallTroop(this.position.x + width*random(-0.3,0.3), this.position.y-100,barricadePath, 15+i)
                }
                break;
            case this.END_STAGE:
                p5.tween.manager.addTween(this)
                    .addMotions([
                        {key:'battleshipPositionX', target: width*1.8},
                        {key:'battleshipPositionY', target: height/2},
                        {key:'battleshipRotation', target: -PI/3}
                    ], 10000, 'easeInOutSin')
                    .onEnd(()=>{this.changeToNextStage()})
                    .startTween();
                break;
        }
    }
}