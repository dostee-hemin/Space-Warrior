class FreezeWave extends Attack {
    constructor(x, y) {
        super(true);

        this.originPoint = createVector(x, y);
        this.radius = 0;
        this.growSpeed = 10;
    }

    display() {
        // Draw an arc facing upwards originated at the origin point with the given radius
        noFill();
        stroke(0,200,200,150);
        strokeWeight(10);
        arc(this.originPoint.x, this.originPoint.y, this.radius*2, this.radius*2, PI, TWO_PI);
    }

    update() {
        this.radius += this.growSpeed;
    }

    isFinished() {
        return this.radius > height;
    }
}