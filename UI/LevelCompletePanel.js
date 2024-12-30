class LevelCompletePanel extends Panel {
    constructor() {
        super('Level Complete', width/2, height/2, width*0.8, height*0.6);

        this.baseScore = currency;
        this.newScoreAmount = 0;
        this.startTime = millis();
    }

    display(targetScore) {
        super.display();

        if(!super.isOpen()) return;

        if(millis() - this.startTime >= 1500)
            this.newScoreAmount = min(this.newScoreAmount+2, targetScore);

        fill(0);
        noStroke();
        textSize(20);
        textAlign(CENTER,CENTER);
        text("Total Currency", this.x, this.y-this.h*0.3);
        textSize(60);
        text(this.baseScore + this.newScoreAmount, this.x, this.y-this.h*0.3+50);
    }
}