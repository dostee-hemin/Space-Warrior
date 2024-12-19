class SmallTroop extends Troop {
    constructor(x, y, pathToFollow, timeToWait) {
        super(x, y, pathToFollow, timeToWait);

        this.baseHealth = 1;
        this.speed = 5;
        this.health = this.baseHealth;

        this.hitbox = {'type': 'circle', 'r': 10};
    }

    display() {
        // Draw a small circle for the troop
        fill(255);
        stroke(0);
        strokeWeight(2);
        circle(this.position.x, this.position.y, this.hitbox.r*2);
        
        stroke(255,0,0,150);
        strokeWeight(1);
        fill(255,0,0,50);
        circle(this.position.x, this.position.y, this.hitbox.r);
    }
}