class RocketLauncher extends Spawner {
    constructor() {
        super(0.06, 1000);
    }

    spawn() {
        let rocketSpawnPosition = random(1) < 0.5 ? 200 : width-200;
        new SmartBullet(rocketSpawnPosition,300,player,false);
    }
}