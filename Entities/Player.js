class Player extends Entity {
    constructor() {
        super(20 + upgradeInfo[upgradeInfo.length-2].currentLevel*5, true, 0);

        this.position = createVector(width/2, height+1000);
        this.velocity = createVector();
        this.targetVelocity = createVector();
        this.maxSpeed = 2+upgradeInfo[upgradeInfo.length-1].currentLevel;  // In pixels per frame
        
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

        this.specialAbilityCooldown = 0;
        this.cooldownTime = 20000;
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

        // If the player has held the space bar, fire the continuous shots
        if(spaceKeyHeldDuration > keyHoldTime) this.continuousShoot();

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

    getDamaged(damageAmount) {
        super.getDamaged(damageAmount * (1+selectedDifficulty*4));
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
            this.dashDirection.mult(8);

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
                    if(this.specialAbilityCooldown == 0) {
                        this.specialAbility();
                        this.specialAbilityCooldown = 1;
                        p5.tween.manager.addTween(this)
                            .addMotion("specialAbilityCooldown", 0, this.cooldownTime)
                            .startTween();
                    }
                }
                // If the space bar is simply clicked once, shoot a bullet
                else this.singleShoot();
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

    specialAbility() {
        let x = this.position.x;
        let y = this.position.y;

        for(let i=0; i<upgradeInfo.length; i++) {
            let upgrade = upgradeInfo[i];

            if(!upgrade.isEquipable) continue;
            if(!upgrade.equipped || upgrade.type != "ability") continue;

            switch(upgrade.name) {
                case "Freeze Wave":
                    new FreezeWave(x, y);
                    break;
                case "Damage Wave":
                    new DamageWave(x, y);
                    break;
                case "Regain Health":
                    this.health = min(this.health+10, this.baseHealth);
                    break;
            }
        }
    }

    singleShoot() {
        let x = this.position.x;
        let y = this.position.y;

        for(let i=0; i<upgradeInfo.length; i++) {
            let upgrade = upgradeInfo[i];
            
            if(!upgrade.isEquipable) continue;
            if(!upgrade.equipped || upgrade.type != "weaponSingle") continue;

            switch(upgrade.name) {
                case "Basic":
                    switch(upgrade.currentLevel) {
                        case 0:
                            new Bullet(x, y, -HALF_PI, 8, true);
                            break;
                        case 1:
                            new Bullet(x-4, y, -HALF_PI, 8, true);
                            new Bullet(x+4, y, -HALF_PI, 8, true);
                            break;
                        case 2:
                            new StrongBullet(x, y, -HALF_PI, 8, true);
                            break;
                        case 3:
                            new Bullet(x-4,y, -HALF_PI-PI/9, 8, true);
                            new Bullet(x-3, y, -HALF_PI, 8, true);
                            new Bullet(x+3, y, -HALF_PI, 8, true);
                            new Bullet(x+4,y, -HALF_PI+PI/9, 8, true);
                            break;
                        case 4:
                            new Bullet(x-8,y, -HALF_PI-PI/9, 8, true);
                            new StrongBullet(x, y-2, -HALF_PI, 8, true);
                            new Bullet(x+8,y, -HALF_PI+PI/9, 8, true);
                            break;
                        case 5:
                            new StrongBullet(x-8, y, -HALF_PI, 8, true);
                            new StrongBullet(x+8, y, -HALF_PI, 8, true);
                            break;
                        case 6:
                            new Bullet(x-16,y, -HALF_PI-PI/9, 8, true);
                            new Bullet(x-16, y, -HALF_PI, 8, true);
                            new StrongBullet(x, y-2, -HALF_PI, 8, true);
                            new Bullet(x+16, y, -HALF_PI, 8, true);
                            new Bullet(x+16,y, -HALF_PI+PI/9, 8, true);
                            break;
                        case 7:
                            new Bullet(x-20, y, -HALF_PI, 8, true);
                            new StrongBullet(x-8, y-2, -HALF_PI, 8, true);
                            new StrongBullet(x+8, y-2, -HALF_PI, 8, true);
                            new Bullet(x+20, y, -HALF_PI, 8, true);
                            break;
                        case 8:
                            new StrongBullet(x-12,y, -HALF_PI-PI/9, 8, true);
                            new StrongBullet(x-8, y, -HALF_PI, 8, true);
                            new StrongBullet(x+8, y, -HALF_PI, 8, true);
                            new StrongBullet(x+12,y, -HALF_PI+PI/9, 8, true);
                            break;
                    }
                    break;
                case "Missiles":
                    let targetEntities = [];
                    for(let j=0; j<entities.length; j++) {
                        if(!entities[j].isFriendly) targetEntities.push(entities[j]);
                    }
                    
                    for(let j=0; j<min(upgrade.currentLevel+1, targetEntities.length); j++) {
                        new SmartBullet(x, y, this.popRandomElement(targetEntities), true);
                    }
                    break;
            }
        }
    }

    continuousShoot() {
        let x = this.position.x;
        let y = this.position.y;

        for(let i=0; i<upgradeInfo.length; i++) {
            let upgrade = upgradeInfo[i];
            
            if(!upgrade.isEquipable) continue;
            if(!upgrade.equipped || upgrade.type != "weaponHold") continue;

            switch(upgrade.name) {
                case "Charged":
                    this.chargedStrength = min(int(getHeldDownDuration(32) / this.chargeTime), upgrade.currentLevel+1);
                    break;
                case "Rapid Fire":
                    let fireRate = 14 - upgrade.currentLevel * 3;
                    if(frameCount % fireRate == 0) new WeakBullet(x,y,-HALF_PI,true);
                    break;
            }
        }
    }

    popRandomElement(arr) {
        let chosenIndex = Math.floor(Math.random() * arr.length);
        let chosenElement = arr[chosenIndex];
        arr.splice(chosenIndex,1);
        return chosenElement;
    }
}