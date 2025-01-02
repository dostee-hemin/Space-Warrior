class AchievementManager {
    static KILLED_FIRST_ENEMY = 0;
    static COMPLETED_FIRST_LEVEL = 1;
    static DODGED = 2;

    constructor() {
        this.unlockedIDs = [];

        this.notificationsToDisplay = [];
        this.notificationAnimation = 0;
    }

    unlock(id) {
        if(this.isUnlocked(id)) return;

        this.unlockedIDs.push(id);
        this.notificationsToDisplay.push(id);
    }

    isUnlocked(id) {
        return this.unlockedIDs.includes(id);
    }

    displayNotification() {
        if(this.notificationsToDisplay.length == 0) return;

        if(this.notificationAnimation == 0) {
            p5.tween.manager.addTween(this)
                .addMotion("notificationAnimation", 1, 1000, 'easeOutQuad')
                .addMotion("notificationAnimation", 1, 1000)
                .addMotion("notificationAnimation", 0, 1000, 'easeInQuad')
                .onEnd(() => {this.notificationsToDisplay.shift();})
                .startTween();
        }

        fill(100, 255 * this.notificationAnimation);
        stroke(50, 255 * this.notificationAnimation);
        strokeWeight(4);
        rectMode(CENTER);
        rect(width-100, height-50 * this.notificationAnimation, 180, 80, 10);
        fill(0, 255 * this.notificationAnimation);
        noStroke();
        textSize(30);
        textAlign(CENTER, CENTER);
        text("Achievement\n" + this.notificationsToDisplay[0], width-100, height-50 * this.notificationAnimation);
    }
}