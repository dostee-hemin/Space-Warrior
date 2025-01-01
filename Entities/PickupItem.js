class PickupItem extends Entity {
    constructor(x, y) {
        super(0,true,0);

        this.position = createVector(x, y);
        this.fallSpeed = 3;
        this.hitbox = {type: 'circle', r: 20};
    }

    display() {
        fill(255, 255, 0,100);
        stroke(255, 255, 0,200);
        strokeWeight(3);
        circle(this.position.x, this.position.y, this.hitbox.r * 2);
    }

    update() {
        super.update();

        this.position.y += this.fallSpeed;
    }

    canCollideWithAttacks() {return false;}

    isFinished() {
        return this.position.y > height + this.hitbox.r;
    }
}