class Troop extends Entity {
    constructor(x, y, pathToFollow, timeToWait) {
        super();

        this.startTime = millis();
        this.timeToWait = timeToWait;
        this.position = createVector(x,y);
        this.velocity = createVector();
        this.pathToFollow = pathToFollow;
        this.currentTargetPoint = 0;
    }

    update() {
        // If the troop is still waiting, don't move
        if(millis() - this.startTime < this.timeToWait) return;

        let nextPoint = this.pathToFollow[this.currentTargetPoint];
        let direction = p5.Vector.sub(nextPoint, this.position);
        direction.setMag(this.speed);
        this.velocity.lerp(direction, 0.6);
        this.position.add(this.velocity);

        if(distSqVector(this.position,nextPoint) < 5*5) {
            this.currentTargetPoint = (this.currentTargetPoint + 1) % this.pathToFollow.length;
        }
    }

    applyEffect(effect) {
        if(effect.type == 'freeze') {
            this.startTime = millis();
            this.timeToWait = effect.duration;
        }
    }
}