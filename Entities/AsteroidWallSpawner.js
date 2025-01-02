class AsteroidWallSpawner extends ObstacleSpawner {
    constructor() {
        super(0.001, 2000);
    }

    spawnObstacles() {
        let randomDirection = random(PI/3, 2*PI/3);
        let verticaIncrement = random(1)-0.5;
        for(let i=0; i<30; i++) {
            let x = -width*0.7 + i*50;
            let y = -300 + verticaIncrement*i*20 + random(-5,5);
            new Asteroid(x, y, randomDirection);
        }
    }
}