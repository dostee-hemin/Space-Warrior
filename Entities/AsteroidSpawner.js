class AsteroidSpawner extends ObstacleSpawner{
    constructor(){
        super();
        this.spawnChance = 0.01;
        this.timeBetweenSpawns = 1000; // In milliseconds
        this.lastSpawnTime = 0;
    }

    update() {
        if(millis() - this.lastSpawnTime < this.timeBetweenSpawns) return;

        if(random(1) < this.spawnChance) {
            new Asteroid(random(width), -100, random(PI/3, 2*PI/3));
            this.lastSpawnTime = millis();
        }
    }
}