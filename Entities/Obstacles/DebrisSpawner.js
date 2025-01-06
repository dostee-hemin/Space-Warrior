class DebrisSpawner extends Spawner {
    constructor() {
        super(0.003, 2000);
    }

    spawn() {
        new Debris();
    }
}