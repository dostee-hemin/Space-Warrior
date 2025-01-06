class MediumTroop extends Troop {
    constructor(x, y, pathToFollow, orderInGroup) {
        super(x, y, 5, pathToFollow, orderInGroup*typeToTime['medium'], 25);

        this.speed = 2;
        this.hitbox = {'type': 'rect', 'w': 25, 'h': 25};
    }

    drawTroop() {
        fill(255);
        stroke(0);
        strokeWeight(2);
        rectMode(CENTER);
        rect(this.position.x, this.position.y, this.hitbox.w*1.5, this.hitbox.h*1.5);
        
        stroke(255,0,0,150);
        strokeWeight(1);
        fill(255,0,0,50);
        rect(this.position.x, this.position.y, this.hitbox.w, this.hitbox.h);
    }

    shoot() {
        if(random(1) < 0.01) {
            new Bullet(this.position.x, this.position.y, HALF_PI, 4, false);
            new Bullet(this.position.x, this.position.y, HALF_PI+PI/6, 4, false);
            new Bullet(this.position.x, this.position.y, HALF_PI-PI/6, 4, false);
        }
    }
}