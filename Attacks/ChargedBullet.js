class ChargedBullet extends Bullet {
    constructor(x, y, strength) {
        super(x, y, -HALF_PI, 6, true);

        this.damage = 5;
        this.hitsLeft = strength;
    }

    display() {
        fill(0,0,200,50);
        stroke(0,0,200,150);
        strokeWeight(5+this.hitsLeft)
        circle(this.position.x,this.position.y, 30+this.hitsLeft*5);
    }

    update() {
        this.position.y -= this.speed;
    }

    isFinished() {
        return super.isFinished() || this.hitsLeft == 0;
    }
}