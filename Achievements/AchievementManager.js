class AchievementManager {
    static KILLED_FIRST_ENEMY = 0;
    static COMPLETED_FIRST_LEVEL = 1;
    static DODGED = 2;

    constructor() {
        this.notificationsToDisplay = [];
        this.notificationAnimation = 0;
    }

    unlock(id) {
        if(this.isUnlocked(id)) return;

        achievementInfo[id].unlocked = true;
        this.notificationsToDisplay.push(id);
    }

    isUnlocked(id) {
        return achievementInfo[id].unlocked;
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
        textSize(16);
        textAlign(CENTER, TOP);
        text("Achievement Unlocked", width-100, height-50 * this.notificationAnimation - 30);
        rectMode(CENTER);
        textAlign(CENTER, CENTER);
        textSize(20);
        text(achievementInfo[this.notificationsToDisplay[0]].name, width-100, height-50 * this.notificationAnimation+10, 180);
    }
}