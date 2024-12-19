class PlayerBullet extends Bullet {
    constructor(x, y, launchAngle) {
        super(x, y, launchAngle, true);

        this.speed = 10;
        this.damage = 1;
    }
}