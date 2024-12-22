class Attack {
    constructor(isFriendly) {
        this.isFriendly = isFriendly;
        this.removeAttack = false;
        this.damage = 0;
        this.effect = {};

        this.entitesHit = [];
        
        attacks.push(this);
    }

    display() {}         // Called to draw the attack on the canvas
    update() {}          // Called to move and change the values of the attack

    // Called to check if the attack has hit a given entity for the first time
    hits(entity) {
        if(this.entitesHit.includes(entity)) return false;
        if(this.isFriendly == entity.isFriendly) return false;
        if(!entity.canCollideWithAttacks()) return false;
        
        if(this.collidesWith(entity)) {
            this.entitesHit.push(entity);
            return true;
        }
        
        return false;
    }

    // Returns whether or not an attack overlaps with the hitbox of an entity to register a hit
    collidesWith(entity) {}

    // Implements the logic of what happens when the attack hits a given entity
    interact(entity) {
        entity.getDamaged(this.damage);
        entity.applyEffect(this.effect);
    } 

    // Called when the attack has been terminated
    destroy() {
        this.removeAttack = true;
    }         

    // Returns true if the attack is meant to be removed from the game
    isFinished() {
        return this.removeAttack;
    }
}