class ObstacleSpawner {
    constructor(spawnChance, timeBetweenSpawns) {
        this.spawnChance = spawnChance;
        this.timeBetweenSpawns = timeBetweenSpawns; // In milliseconds
        this.lastSpawnTime = 0;
    }

    update() {
        if(millis() - this.lastSpawnTime < this.timeBetweenSpawns) return;

        if(random(1) < this.spawnChance) {
            this.spawnObstacles();
            this.lastSpawnTime = millis();
        }
    }

    spawnObstacles() {}
}