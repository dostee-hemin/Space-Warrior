class DamageWave extends Attack {
    constructor(x, y) {
        super(true);

        this.originPoint = createVector(x, y);
        this.radius = 0;
        this.growSpeed = 16;
        this.damage = 4;
    }

    display() {
        // Draw an arc facing upwards originated at the origin point with the given radius
        noFill();
        stroke(200,50,0,150);
        strokeWeight(10);
        arc(this.originPoint.x, this.originPoint.y, this.radius*2, this.radius*2, PI, TWO_PI);
    }

    // Return true if the vector points between 180 and 360 degrees and has a magnitude less than the radius
    collidesWith(entity) {
        let direction = p5.Vector.sub(entity.position, this.originPoint);
        let up = createVector(0,-1);
        let angle = direction.angleBetween(up);
        return angle < PI/2 && distSq(this.originPoint.x, this.originPoint.y, entity.position.x, entity.position.y) < this.radius**2;
    }   

    update() {
        this.radius += this.growSpeed;
    }

    isFinished() {
        return this.radius > height;
    }
}