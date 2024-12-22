class SmartBullet extends Bullet {
    constructor(x, y, targetEntity) {
        super(x, y, random(HALF_PI-PI/6,HALF_PI+PI/6), 6, false);

        this.damage = 5;
        this.targetEntity = targetEntity;
        this.timeWithFuel = 1500;
        this.startTime = millis();
    }

    update() {
        // Calculate the vector to the target entity and set it as the acceleration that adds to the velocity
        if(millis() - this.startTime < this.timeWithFuel) {
            let vectorToTarget = p5.Vector.sub(this.targetEntity.position, this.position);
            vectorToTarget.mult(0.006);
            this.velocity.add(vectorToTarget);
            this.velocity.setMag(this.speed);
        }

        super.update();
    }

    display() {
        push();
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading());
        fill(200,0,0);
        stroke(200,0,0);
        strokeWeight(2);
        beginShape();
        vertex(-8,-5);
        vertex(-8, 5);
        vertex(10,0);
        endShape(CLOSE);
        pop();
    }
}