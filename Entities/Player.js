class Player {
    constructor() {
        this.baseHealth = 100;
        this.health = this.baseHealth;

        this.position = createVector(width/2, height-height/5);
        this.velocity = createVector();
        this.targetVelocity = createVector();
        this.maxSpeed = 4;  // In pixels per frame
        
        this.hitbox  = {'type': 'rect', 'w': 10, 'h': 20};

        this.dashDirection = createVector();
        this.dashDuration = 150;        // In milliseconds
        this.dashStartTime;             // In milliseconds

        // Angles to rotate the ship according to the velocity direction
        this.rotationMatrix = [
            [-30, 0, 30],
            [-60, 0, 60],
            [20, 0, -20]
        ]
        this.rotation = 0;
    }

    display() {
        // Move to the player's position
        push();
        translate(this.position.x, this.position.y);
        scale(this.isDashing() ? 0.8 : 1);
        let i=1, j=1;
        if(this.targetVelocity.x < 0) i = 0;
        else if (this.targetVelocity.x > 0) i = 2;
        if(this.targetVelocity.y < 0) j = 0;
        else if (this.targetVelocity.y > 0) j = 2;
        this.rotation = lerp(this.rotation, radians(this.rotationMatrix[j][i]), 0.3);
        rotate(this.rotation);

        // Draw the ship as a triangle
        fill(255);
        stroke(0);
        strokeWeight(2);
        triangle(-20,20,0,-20,20,20);

        // Draw the hitbox of the ship for debug purposes (only if not dashing)
        if(!this.isDashing()) {
            stroke(255,0,0,150);
            strokeWeight(1);
            fill(255,0,0,50);
            rectMode(CENTER);
            rect(0,0,this.hitbox.w, this.hitbox.h);
        }
        pop();
    }

    update() {
        // If the player has activated a dash move, set the velocity to the dash direction
        if (this.isDashing() && millis() - this.dashStartTime < this.dashDuration) {
            this.velocity.set(this.dashDirection.x, this.dashDirection.y);
        } 
        // If the player is not dashing, gradually move the velocity to the target velocity
        else {
            this.dashDirection.mult(0);
            this.velocity.lerp(this.targetVelocity, 0.15);
        }
        this.position.add(this.velocity);

        // Remain within canvas borders
        this.position.x = constrain(this.position.x, this.hitbox.w/2, width-this.hitbox.w/2);
        this.position.y = constrain(this.position.y, this.hitbox.h/2, height-this.hitbox.h/2);
    }

    // Returns true if the player has activated a dash
    isDashing() {
        return this.dashDirection.x != 0 || this.dashDirection.y != 0;
    }

    // Function to utilize the arrow keys to activate dashes and set the target velocity
    setTargetVelocity(direction, amount) {
        // If the player double clicked one of the arrow keys, they have activated a dash
        if (isDoubleClick()) {
            // Set the x or y direction of the dash
            if (direction == 'x') this.dashDirection.x = amount;
            else this.dashDirection.y = amount;
            this.dashDirection.mult(this.maxSpeed*2);

            this.dashStartTime = millis();
            return;
        }

        // If the player has not dashed, set the desired velocity to the right direction
        // The if-statements are used to scale the dimension perpendicular to a given arrow to align with integer coordinates
        if (direction == 'x') {
            if(this.targetVelocity.y != 0) this.targetVelocity.y *= 1 / Math.abs(this.targetVelocity.y);
            this.targetVelocity.x = amount;
        } else {
            if(this.targetVelocity.x != 0) this.targetVelocity.x *= 1 / Math.abs(this.targetVelocity.x);
            this.targetVelocity.y = amount;
        }
        // Make sure to scale the velocity to match the max speed
        this.targetVelocity.setMag(this.maxSpeed);
    }

    keyPressed() {
        switch (keyCode) {
            case UP_ARROW:
                this.setTargetVelocity('y', -1);
                break;
            case DOWN_ARROW:
                this.setTargetVelocity('y', 1);
                break;
                    
            case LEFT_ARROW:
                this.setTargetVelocity('x', -1);
                break;
            case RIGHT_ARROW:
                this.setTargetVelocity('x', 1);
                break;
        }

        switch(key) {
            case ' ':
                // If the space bar is double clicked, perform the special ability
                if (isDoubleClick()) {
                    // Special ability goes here
                }
                // If the space bar is simply clicked once, shoot a bullet
                else {
                    let x = this.position.x;
                    let y = this.position.y;
                    let angle = -HALF_PI;
                    attacks.push(new PlayerBullet(x, y, angle));
                }
                break;
        }
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