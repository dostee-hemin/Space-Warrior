class StrongBullet extends Bullet {
    constructor(x, y, launchAngle, speed, isFriendly) {
        super(x, y, launchAngle, speed, isFriendly);

        this.damage = 3;
        this.hitsLeft = 1;
    }

    display() {
        // Change the color based on whether it's an enemy bullet or player bullet
        if(this.isFriendly) stroke(0,40,150);
        else stroke(0,150,40);
        strokeWeight(16);
        point(this.position.x, this.position.y);

        strokeWeight(4);
        line(this.position.x, this.position.y, this.position.x - this.velocity.x, this.position.y - this.velocity.y*3);
    }
}