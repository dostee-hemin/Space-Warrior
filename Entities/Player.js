class Player {
    constructor() {
        this.baseHealth = 100;
        this.health = this.baseHealth;

        this.position = new p5.Vector(width/2, height-height/5);
        this.velocity = new p5.Vector();
        this.targetVelocity = new p5.Vector();
        this.maxSpeed = 4;
        
        this.hitbox  = {'type': 'rect', 'w': 10, 'h': 20};
    }

    display() {
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
        rect(0,0,this.hitbox.w, this.hitbox.h);
        pop();
    }

    update() {
        this.velocity.lerp(this.targetVelocity, 0.15);
        this.position.add(this.velocity);

        // Remain within canvas borders
        this.position.x = constrain(this.position.x, this.hitbox.w/2, width-this.hitbox.w/2);
        this.position.y = constrain(this.position.y, this.hitbox.h/2, height-this.hitbox.h/2);
    }

    keyPressed() {
        // Based on which arrow key is pressed, set the desired velocity to the right direction
        // The if-statements are used to scale the dimension perpendicular to a given arrow to align with integer coordinates
        switch (keyCode) {
            case UP_ARROW:
                if(this.targetVelocity.x != 0) this.targetVelocity.x *= 1 / Math.abs(this.targetVelocity.x);
                this.targetVelocity.y = -1
                break;
            case DOWN_ARROW:
                if(this.targetVelocity.x != 0) this.targetVelocity.x *= 1 / Math.abs(this.targetVelocity.x);
                this.targetVelocity.y = 1
                break;
                    
            case LEFT_ARROW:
                if(this.targetVelocity.y != 0) this.targetVelocity.y *= 1 / Math.abs(this.targetVelocity.y);
                this.targetVelocity.x = -1
                break;
            case RIGHT_ARROW:
                if(this.targetVelocity.y != 0) this.targetVelocity.y *= 1 / Math.abs(this.targetVelocity.y);
                this.targetVelocity.x = 1
                break;
        }
        // Make sure to scale the velocity to match the max speed
        this.targetVelocity.setMag(this.maxSpeed);
    }

    keyReleased() {
        // Based on which arrow key was previously pressed, reset the x or y direction of the desired velocity
        switch (keyCode) {
            case UP_ARROW:
                if (this.targetVelocity.y < 0) this.targetVelocity.y = 0
                break;
            case DOWN_ARROW:
                if (this.targetVelocity.y > 0) this.targetVelocity.y = 0
                break;

            case LEFT_ARROW:
                if (this.targetVelocity.x < 0) this.targetVelocity.x = 0
                break;
            case RIGHT_ARROW:
                if (this.targetVelocity.x > 0) this.targetVelocity.x = 0
                break;
        }
        // Make sure to scale the velocity to match the max speed
        this.targetVelocity.setMag(this.maxSpeed);
    }
}