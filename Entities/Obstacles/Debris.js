class Debris extends Obstacle {
    constructor() {
        super(random(width), -100, random(PI/3, 2*PI/3), 1);

        let size = random(1) < 0.8 ? 1 : 3;
        this.hitbox = {"type": "rect", "w": size*100, "h": size*20};
    }

    display() {
        fill('#240947');
        noStroke();
        rectMode(CENTER);
        rect(this.position.x, this.position.y, this.hitbox.w, this.hitbox.h);
    }

    getDamaged(damageAmount) {}
}