class Bullet extends Attack {
    constructor(x, y, launchAngle, speed, isFriendly) {
        super(isFriendly);

        this.speed = speed;
        this.position = createVector(x,y);
        this.velocity = p5.Vector.fromAngle(launchAngle).mult(this.speed);
    }

    update() {
        this.position.add(this.velocity);
    }

    isFinished() {
        // Once the bullet leaves the canvas bounds, it's ready to be removed
        return super.isFinished() || this.position.x < 0 || this.position.x > width ||
               this.position.y < 0 || this.position.y > height;
    }

    collidesWith(entity) {
        if(entity.hitbox.type == 'circle') {
            return distSq(this.position.x, this.position.y, entity.position.x, entity.position.y) < entity.hitbox.r**2;
        }
    }

    display() {
        // Change the color based on whether it's an enemy bullet or player bullet
        if(this.isFriendly) stroke(0,40,150);
        else stroke(0,150,40);
        strokeWeight(8);
        point(this.position.x, this.position.y);

        strokeWeight(2);
        line(this.position.x, this.position.y, this.position.x - this.velocity.x, this.position.y - this.velocity.y);
    }
}