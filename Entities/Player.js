class Player {
    constructor() {
        this.baseHealth = 100;
        this.health = this.baseHealth;
        this.position = new p5.Vector(width/2, height-height/5);
        this.hitboxParameters  = [10, 40];
    }

    draw() {
        // Move to the player's position
        push();
        translate(this.position.x, this.position.y);

        // Draw the ship as a triangle
        fill(255);
        stroke(0);
        strokeWeight(2);
        triangle(-20,20,0,-20,20,20);

        // Draw the hitbox of the ship for debug purposes
        stroke(255,0,0,150);
        strokeWeight(1);
        fill(255,0,0,50);
        rectMode(CENTER);
        rect(0,0,this.hitboxParameters[0], this.hitboxParameters[1]);
        pop();
    }
}