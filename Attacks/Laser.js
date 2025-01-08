class Laser extends Attack {
    constructor(parentEntity, direction, lifetime) {
        super(direction == -1);

        this.parentEntity = parentEntity;
        this.position = createVector(this.parentEntity.position.x, this.parentEntity.position.y);
        this.lifetime = lifetime; //In milliseconds
        this.laserWidth = 20;
        this.direction = direction;
        this.startTime = millis();
        this.damage = 5;
    }

    display() {
        for(let i=0; i<4; i++) {
            if(this.direction == -1) stroke(0,0,150+i*20, this.lifetime - (millis()-this.startTime));
            else stroke(150+i*20, 0, 0, this.lifetime - (millis()-this.startTime));
            let endY = this.direction == 1 ? H : 0;
            strokeWeight(this.laserWidth-i*2);
            line(this.position.x, this.position.y, this.position.x, endY);
        }
    }

    update() {
        this.position = this.parentEntity.position.copy();
    }

    isFinished() {
        return millis() - this.startTime > this.lifetime;
    }

    // Depending on whether the laser is upwards or downwards, check for collision
    collidesWith(entity) {        
        return ((this.direction == 1) ? 
                this.position.y < entity.position.y :
                this.position.y > entity.position.y ) && 
                Math.abs(this.position.x - entity.position.x) <= this.laserWidth;
    }
}