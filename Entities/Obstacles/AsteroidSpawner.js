class AsteroidSpawner extends ObstacleSpawner{
    constructor(){
        super(0.01, 1000);
    }

    spawnObstacles() {
        new Asteroid(random(width), -100, random(PI/3, 2*PI/3));
    }
}