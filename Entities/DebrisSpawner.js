class DebrisSpawner extends ObstacleSpawner {
    constructor() {
        super(0.003, 2000);
    }

    spawnObstacles() {
        new Debris();
    }
}