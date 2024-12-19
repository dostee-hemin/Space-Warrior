class Attack {
    constructor(isFriendly) {
        this.isFriendly = isFriendly;
    }

    display() {}         // Called to draw the attack on the canvas
    update() {}          // Called to move and change the values of the attack
    hits(entity) {}      // Returns whether or not the attack hit a given entity
    interact(entity) {}  // Implements the logic of what happens when the attack hits a given entity
    destroy() {}         // Called when the attack has been terminated
    isFinished() {}      // Returns true if the attack is meant to be removed from the game
}