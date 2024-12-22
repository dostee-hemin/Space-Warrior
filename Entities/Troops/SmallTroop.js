class SmallTroop extends Troop {
    constructor(x, y, pathToFollow, orderInGroup) {
        super(x, y, 1, pathToFollow, orderInGroup*300);

        this.speed = 3;
        this.hitbox = {'type': 'circle', 'r': 10};
    }

    display() {
        // Draw a small circle for the troop
        fill(255);
        stroke(0);
        strokeWeight(2);
        circle(this.position.x, this.position.y, this.hitbox.r*3);
        
        stroke(255,0,0,150);
        strokeWeight(1);
        fill(255,0,0,50);
        circle(this.position.x, this.position.y, this.hitbox.r*2);

        super.display();
    }

    update() {
        super.update();

        if(random(1) < 0.01) {
            this.shoot();
        }
    }

    shoot() {
        new Bullet(this.position.x, this.position.y, HALF_PI, 4, false);
    }
}