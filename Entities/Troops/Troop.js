class Troop extends Entity {
    constructor(x, y, baseHealth, pathToFollow, timeToWait, currencyPoints) {
        super(baseHealth * (1+selectedDifficulty*2), false, currencyPoints);

        this.startTime = millis();
        this.timeToWait = timeToWait;
        this.position = createVector(x,y);
        this.velocity = createVector();
        this.pathToFollow = pathToFollow;
        this.currentTargetPoint = 0;
        this.hasEnteredPath = false;
        this.isStartingUp = true;
    }

    update() {
        // If the troop is still waiting, don't move
        if(millis() - this.startTime < this.timeToWait) return;
        this.isStartingUp = false;

        let nextPoint = this.pathToFollow[this.currentTargetPoint];
        let direction = p5.Vector.sub(nextPoint, this.position);
        direction.setMag(this.speed);
        this.velocity.lerp(direction, 0.6);
        this.position.add(this.velocity);

        if(distSqVector(this.position,nextPoint) < 5*5) {
            this.currentTargetPoint = (this.currentTargetPoint + 1) % this.pathToFollow.length;
            this.hasEnteredPath = true;
        }

        if(this.hasEnteredPath) this.shoot();
    }
    
    display() {
        // If the troop is still waiting, don't move
        if(this.isStartingUp) return;

        this.drawTroop();

        let offset = 0;
        if (this.hitbox.type == 'circle') offset = this.hitbox.r*2;
        else if (this.hitbox.type == 'rect') offset = this.hitbox.h;
        
        if (this.health != 0 && this.health != this.baseHealth)
            this.displayHealthBar(this.position.x, this.position.y-offset, this.baseHealth*5, 5, CENTER);
    }

    drawTroop() {}
    shoot() {}

    applyEffect(effect) {
        if(effect.type == 'freeze') {
            this.startTime = millis();
            this.timeToWait = effect.duration;
        }
    }
}