class Entity {
    constructor() {
        this.baseHealth;
        this.health;
        this.position;
        this.hitboxParameters;
    }

    draw() {}                   // Called to update and display the entity
    getDamaged(damageAmount) {} // Called when an attack has hit the entity
    applyEffect() {}            // Called when a special affect is applied to the entity
}