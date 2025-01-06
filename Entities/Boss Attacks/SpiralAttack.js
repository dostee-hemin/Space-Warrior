class SpiralAttack extends Spawner {
    constructor(attackType) {
        super(1, 10000);

        this.fireRate = 5;
        this.fireDuration = 7000;
        this.angleDifference = PI/6
        this.startingAngle = -this.angleDifference;

        p5.tween.manager.addTween(this)
            .addMotion('startingAngle',this.angleDifference,attackType==0?1000:400, 'easeInOutSin')
            .addMotion('startingAngle',-this.angleDifference,attackType==0?1000:400, 'easeInOutSin')
            .startLoop();
    }

    update() {
        if(millis() - this.lastSpawnTime > this.timeBetweenSpawns) this.lastSpawnTime = millis(); 

        if(millis() - this.lastSpawnTime > this.fireDuration) return
        if(frameCount % this.fireRate == 0) {
            for(let i=0; i<16; i++) {
                let angle = this.startingAngle + i*this.angleDifference;
                let x = width/2;
                let y = 150;
                new Bullet(x,y,angle,4,false);
            }
        }
    }
}