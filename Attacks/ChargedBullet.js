class ChargedBullet extends Bullet {
    constructor(x, y, strength) {
        super(x, y, -HALF_PI, 6, true);

        this.damage = 5;
        this.hitsLeft = strength;
        this.hitbox = {"type": "circle", "r": 10};
    }

    display() {
        fill(0,0,200,50);
        stroke(0,0,200,150);
        strokeWeight(5+this.hitsLeft)
        circle(this.position.x,this.position.y, 20+this.hitsLeft*8);
    }

    update() {
        this.position.y -= this.speed;
    }
}