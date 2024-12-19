class Entity {
    constructor() {
        this.baseHealth;
        this.health;
        this.position;
        this.hitboxParameters;
    }

    display() {}                // Called to draw the entity on the canvas
    update() {}                 // Called to move and change the values of the entity
    getDamaged(damageAmount) {} // Called when an attack has hit the entity
    applyEffect() {}            // Called when a special affect is applied to the entity
    isFinished() {}             // Returns true if the entity is meant to be removed from the game
}