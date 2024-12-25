class Entity {
    constructor(baseHealth, isFriendly) {
        this.baseHealth = baseHealth;
        this.health = this.baseHealth;
        this.position;
        this.hitbox;
        this.isFriendly = isFriendly;
        
        entities.push(this);

        this.timeOfLastHit = 0;
        this.timeToShowDamage = 500;    // In milliseconds
        this.healthBeforeHit = 0;
    }

    display() {}                // Called to draw the entity on the canvas
    update() {}                 // Called to move and change the values of the entity

    // Called when an attack has hit the entity
    getDamaged(damageAmount) {
        if(millis() - this.timeOfLastHit > this.timeToShowDamage) {
            this.healthBeforeHit = this.health;
        }
        this.timeOfLastHit = millis();
        this.health -= damageAmount;
    }

    applyEffect() {}            // Called when a special affect is applied to the entity

     // Returns whether or not the entity can be hit by an attack
    canCollideWithAttacks() {
        return true;
    }

    // Called to draw the health bar of the entity
    displayHealthBar(x, y, barWidth, barHeight, barAlignment) {
        fill(255,0,0); 
        noStroke();
        rectMode(barAlignment);
        if (barAlignment == CORNER) {
            x -= barWidth/2;
            y -= barHeight/2;
        }
        rect(x, y, barWidth, barHeight);
        if(millis() - this.timeOfLastHit < this.timeToShowDamage) {
            fill(255,255,0);
            rect(x, y, max(0, map(this.healthBeforeHit, 0, this.baseHealth, 0, barWidth)), barHeight);
        }
        fill(0,255,0);
        rect(x, y, max(0, map(this.health, 0, this.baseHealth, 0, barWidth)), barHeight);
    }

    
    // Returns true if the entity is meant to be removed from the game
    isFinished() {
        return this.health <= 0;
    }
}