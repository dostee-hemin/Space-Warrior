class AsteroidSpawner extends Spawner {
    constructor(){
        super(0.01, 1000);
    }

    spawn() {
        new Asteroid(random(width), -100, random(PI/3, 2*PI/3));
    }
}