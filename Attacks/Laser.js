class Laser extends Attack {
    constructor(x, y) {
        super(true);

        this.position = createVector(x, y);
        this.lifetime = 200; //In milliseconds
        this.laserWidth = 20;
        this.startTime = millis();
        this.damage = 5;
    }

    display() {
        for(let i=0; i<4; i++) {
            stroke(0,0,150+i*20, this.lifetime - (millis()-this.startTime));
            strokeWeight(this.laserWidth-i*2);
            line(this.position.x, this.position.y, this.position.x, 0);
        }
    }

    isFinished() {
        return millis() - this.startTime > this.lifetime;
    }

    collidesWith(entity) {
        return this.position.y > entity.position.y && Math.abs(this.position.x - entity.position.x) <= this.laserWidth;
    }
}