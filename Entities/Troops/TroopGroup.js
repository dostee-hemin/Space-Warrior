class TroopGroup {
  constructor(numberOfTroops, troopClassType, pathClassType) {    
    // Pick a hidden point above the canvas to be where the troops spawn from 
    this.spawnPoint = createVector(random(50,W-50), -50);
    this.pathToFollow = new pathClassType().generatePath(Math.random()<0.5);

    // Loop through 
    for (let i=0; i<numberOfTroops; i++) {
      new troopClassType(this.spawnPoint.x, this.spawnPoint.y, this.pathToFollow, i);
    }
  }
}