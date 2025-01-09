class LargeTroop extends Troop {
    constructor(x, y, pathToFollow, orderInGroup) {
        super(x, y, 20, pathToFollow, orderInGroup*typeToTime['large'], 60);

        this.speed = 1;
        this.hitbox = {'type': 'rect', 'w': 25, 'h': 25};

        this.laserSpawnTime = 0;
        this.timeBetweenLasers = 180; // In Frames
    }

    drawTroop() {
        // Triangle body
        fill(255);
        stroke(0);
        strokeWeight(2);
        triangle(this.position.x-30, this.position.y-15, this.position.x+30, this.position.y-15, this.position.x, this.position.y+30);
        
        // Hitbox
        stroke(255,0,0,150);
        strokeWeight(1);
        fill(255,0,0,50);
        rectMode(CENTER);
        rect(this.position.x, this.position.y, this.hitbox.w, this.hitbox.h);

        // Laser buildup
        noFill();
        stroke(150,0,0);
        strokeWeight(1);
        circle(this.position.x, this.position.y + this.hitbox.h, 20);
        fill(150,0,0,100);
        noStroke();
        circle(this.position.x, this.position.y + this.hitbox.h, map(this.laserSpawnTime, 0, this.timeBetweenLasers, 0, 20));
    }

    update() {
        super.update();

        if(this.hasEnteredPath && millis() - this.startTime > this.timeToWait) this.laserSpawnTime++;
    }

    shoot() {
        if(random(1) < 0.01) {
            new SmartBullet(this.position.x, this.position.y, player, false);
        }

        if(this.laserSpawnTime >= this.timeBetweenLasers) {
            this.laserSpawnTime = 0;
            new Laser(this, 1, 1000);
        }
    }
}