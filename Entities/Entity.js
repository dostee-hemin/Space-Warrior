class Entity {
    constructor(isFriendly) {
        this.baseHealth;
        this.health;
        this.position;
        this.hitbox;
        this.isFriendly = isFriendly;
        
        entities.push(this);
    }

    display() {}                // Called to draw the entity on the canvas
    update() {}                 // Called to move and change the values of the entity

    // Called when an attack has hit the entity
    getDamaged(damageAmount) {
        this.health -= damageAmount;
    }

    applyEffect() {}            // Called when a special affect is applied to the entity

     // Returns whether or not the entity can be hit by an attack
    canCollideWithAttacks() {
        return true;
    }

    
    // Returns true if the entity is meant to be removed from the game
    isFinished() {
        return this.health <= 0;
    }
}