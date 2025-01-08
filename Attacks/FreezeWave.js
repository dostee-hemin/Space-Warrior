class FreezeWave extends Attack {
    constructor(x, y) {
        super(true);

        this.originPoint = createVector(x, y);
        this.radius = 0;
        this.growSpeed = 10;
        this.effect = {'type': 'freeze', 'duration': 2000};
    }

    display() {
        // Draw an arc facing upwards originated at the origin point with the given radius
        noFill();
        stroke(0,200,200,150);
        strokeWeight(10);
        circle(this.originPoint.x, this.originPoint.y, this.radius*2);
    }

    // Return true if the vector points between 180 and 360 degrees and has a magnitude less than the radius
    collidesWith(entity) {
        return distSq(this.originPoint.x, this.originPoint.y, entity.position.x, entity.position.y) < this.radius**2;
    }   

    update() {
        this.radius += this.growSpeed;
    }

    isFinished() {
        return this.radius > H;
    }
}