class SimpleBullet extends Bullet {
    constructor(x, y, launchAngle) {
        super(x, y, launchAngle, 8, true);

        this.damage = 1;
    }
}