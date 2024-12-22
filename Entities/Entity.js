class Entity {
    constructor() {
        this.baseHealth;
        this.health;
        this.position;
        this.hitbox;
    }

    display() {}                // Called to draw the entity on the canvas
    update() {}                 // Called to move and change the values of the entity

    // Called when an attack has hit the entity
    getDamaged(damageAmount) {
        this.health -= damageAmount;
    }

    applyEffect() {}            // Called when a special affect is applied to the entity

    // Returns true if the entity is meant to be removed from the game
    isFinished() {
        return this.health <= 0;
    }
}