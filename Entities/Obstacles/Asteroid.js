class Asteroid extends Obstacle {
    constructor(x, y, direction) {
        super(x, y, direction, 1);

        this.hitbox = {"type": "circle", "r": random(12,18)};
    }

    display() {
        fill(150, 75, 0);
        stroke(100,50,0);
        strokeWeight(3);
        circle(this.position.x, this.position.y, this.hitbox.r*2);
    }

    isFinished() {
        return super.isFinished() || this.hasBeenBumped;
    }
}