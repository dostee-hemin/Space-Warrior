class LevelCompletePanel extends Panel {
    constructor() {
        super('Level Complete', W/2, H/2, W*0.8, H*0.6);

        this.baseScore = currency;
        this.newScoreAmount = -1;
        this.startTime = millis();
    }

    open(targetScore) {
        super.open();
        if(targetScore != 0) {
            this.newScoreAmount = 0;
            p5.tween.manager.addTween(this)
                .addMotion("newScoreAmount", 0, 1000)
                .addMotion("newScoreAmount", targetScore, 3000, "easeOutQuad")
                .startTween();
        }
    }

    display(numArmorCollected=0, numArmorCollectables=0) {
        super.display();

        if(!super.isOpen()) return;

        if(this.newScoreAmount >= 0) {
            fill(0);
            noStroke();
            textSize(20);
            textAlign(CENTER,CENTER);
            text("Total Currency", this.x, this.y-this.h*0.3);
            textSize(60);
            text(int(this.baseScore + this.newScoreAmount), this.x, this.y-this.h*0.3+50);
        }

        for(let i=0; i<numArmorCollectables; i++) {
            let x = this.x - (numArmorCollectables-1)*30 + i*60;
            let y = this.y - this.h*0.1;
            fill(i < numArmorCollected ? 255 : 100, 0, 0);
            stroke(30,0,0);
            strokeWeight(4);
            circle(x, y, 40);
        }
    }
}