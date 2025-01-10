class AchievementManager {
    static COMPLETE_ALL_LEVELS = 0
    static TAKE_NO_DAMAGE = 1
    static UNLOCK_ALL_ARMOR = 2
    static MAX_OUT_ALL_WEAPONS = 3
    static COMPLETE_LEVEL_UNDER_TIME_LIMIT = 4
    static GET_10_KILLS_WITH_NO_DAMAGE = 5
    static COMPLETE_ALL_LEVELS_ON_HARD = 6

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
        rect(W-100, H-50 * this.notificationAnimation, 180, 80, 10);
        fill(0, 255 * this.notificationAnimation);
        noStroke();
        textSize(16);
        textAlign(CENTER, TOP);
        text("Achievement Unlocked", W-100, H-50 * this.notificationAnimation - 30);
        rectMode(CENTER);
        textAlign(CENTER, CENTER);
        textSize(20);
        text(achievementInfo[this.notificationsToDisplay[0]].name, W-100, H-50 * this.notificationAnimation+10, 180);
    }
}