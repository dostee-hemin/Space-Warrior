class Obstacle extends Entity {
    constructor(x, y, direction, health) {
        super(health, false, 0);

        this.position = createVector(x, y);
        this.velocity = p5.Vector.fromAngle(direction).mult(2);
    }

    update() {
        super.update();

        this.position.add(this.velocity);
    }

    isFinished() {
        return super.isFinished() || this.position.y > H+200;
    }
}