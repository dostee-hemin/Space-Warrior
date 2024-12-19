class TroopGroup {
  constructor(numberOfTroops, troopClassType, delayBetweenTroops) {    
    // Pick a hidden point above the canvas to be where the troops spawn from 
    this.spawnPoint = createVector(random(width), -50);
    this.pathToFollow = [];

    this.generatePath();

    // Loop through 
    for (let i=0; i<numberOfTroops; i++) {
      let troop = new troopClassType(this.spawnPoint.x, this.spawnPoint.y, this.pathToFollow, i*delayBetweenTroops);
      entities.push(troop);
    }
  }

  generatePath() {}
}