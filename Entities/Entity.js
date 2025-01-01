class Entity {
    constructor(baseHealth, isFriendly, currencyPoints) {
        this.baseHealth = baseHealth;
        this.health = this.baseHealth;
        this.position;
        this.hitbox;
        this.isFriendly = isFriendly;
        
        entities.push(this);

        this.timeOfLastHit = 0;
        this.timeToShowDamage = 500;    // In milliseconds
        this.healthBeforeHit = 0;
        this.currencyPoints = currencyPoints;
        this.hasBeenBumped = false;
    }

    display() {}                // Called to draw the entity on the canvas

    // Called to move and change the values of the entity
    update() {
        if(!this.hasBeenBumped) {
            for(let i=0; i<entities.length; i++) {
                let entity = entities[i];

                if(entity == this) continue;
                if(this.overlapsWith(entity)) {
                    this.bump(entity);
                    entity.bump(this);
                    this.hasBeenBumped = true;
                    entity.hasBeenBumped = true;
                }
            }
        } else {
            this.hasBeenBumped = false;
            for(let i=0; i<entities.length; i++) {
                if(entities[i] == this) continue;
                if(this.overlapsWith(entities[i])) {
                    this.hasBeenBumped = true;
                }
            }
        }
    }                 

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

    overlapsWith(otherEntity) {
        let thisRadius = (this.hitbox.type == 'circle') ? this.hitbox.r : Math.max(this.hitbox.w, this.hitbox.h);
        let otherRadius = (otherEntity.hitbox.type == 'circle') ? otherEntity.hitbox.r : Math.max(otherEntity.hitbox.w, otherEntity.hitbox.h);
        return distSq(this.position.x, this.position.y, otherEntity.position.x, otherEntity.position.y) < (thisRadius + otherRadius)**2;   
    }

    bump(otherEntity) {}

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