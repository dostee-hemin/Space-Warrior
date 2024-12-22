class Player extends Entity {
    constructor() {
        super(20, true);

        this.position = createVector(width/2, height-height/5);
        this.velocity = createVector();
        this.targetVelocity = createVector();
        this.maxSpeed = 4;  // In pixels per frame
        
        this.hitbox  = {'type': 'rect', 'w': 10, 'h': 20};

        this.dashDirection = createVector();
        this.dashDuration = 150;        // In milliseconds
        this.dashStartTime;             // In milliseconds

        this.chargeTime = 1000;         // In milliseconds
        this.maxChargeStrength = 4;
        this.chargedStrength = 0;

        // Angles to rotate the ship according to the velocity direction
        this.rotationMatrix = [
            [-30, 0, 30],
            [-60, 0, 60],
            [20, 0, -20]
        ]
        this.rotation = 0;

        this.hasUsedSpecialAbility = false;
        this.specialAbilityClass = FreezeWave;
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

        if(this.chargedStrength != 0) {
            stroke(0,0,200);
            strokeWeight(10+this.chargedStrength*5);
            point(0,-this.hitbox.h);
        }

        pop();

        // Draw the hitbox of the ship for debug purposes (only if not dashing)
        if(!this.isDashing()) {
            stroke(255,0,0,150);
            strokeWeight(1);
            fill(255,0,0,50);
            rectMode(CENTER);
            rect(this.position.x,this.position.y,this.hitbox.w, this.hitbox.h);
        }

        // Draw a health bar for the player in the bottom left corner
        this.displayHealthBar(120, height-25, 200, 20, CORNER);
        stroke(0);
        strokeWeight(3);
        noFill();
        rect(20, height-35, 200, 20);
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

        // Find out how long the player has been holding the space bar (if at all)
        let spaceKeyHeldDuration = getHeldDownDuration(32); // 32 is the keyCode for the space bar
        // If the player has held the space bar, set the charge strength of the next attack based on how long they've held it
        if(spaceKeyHeldDuration) {
            this.chargedStrength = min(int(spaceKeyHeldDuration / this.chargeTime), 4);
        } 
        // Once the player lets go of the space bar and a charge has been made, launch either a charged attack or laser based on the strength
        else if (this.chargedStrength != 0) {
            let x = this.position.x;
            let y = this.position.y;
            if (this.chargedStrength == this.maxChargeStrength) new Laser(this, -1, 100); 
            else new ChargedBullet(x, y, this.chargedStrength);
            
            // Reset the charged strength for the next attack
            this.chargedStrength = 0;
        }
    }

    // Returns true if the player has activated a dash
    isDashing() {
        return this.dashDirection.x != 0 || this.dashDirection.y != 0;
    }

    canCollideWithAttacks() {
        return !this.isDashing();
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
                    if(!this.hasUsedSpecialAbility) {
                        new this.specialAbilityClass(this.position.x, this.position.y);
                        this.hasUsedSpecialAbility = true;
                    }
                }
                // If the space bar is simply clicked once, shoot a bullet
                else {
                    let x = this.position.x;
                    let y = this.position.y;
                    let angle = -HALF_PI;
                    new Bullet(x, y, angle, 8, true);
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