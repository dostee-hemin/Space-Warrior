// Enum of all wave stages
const WaveStage = {
    WAIT: 0,
    SHIP_ENTRANCE: 1,
    RELEASE_TROOPS: 2,
    SHIP_EXIT: 3
};
class Wave {
    constructor() {
        this.stage = WaveStage.WAIT;
        this.waitDuration = 2000;    // In milliseconds
        this.shipEntranceDuration = 2000;    // In milliseconds
        this.shipExitDuration = 2000;    // In milliseconds
        this.startTime = millis();
        
        this.battleshipPositionX = -width;
        p5.tween.manager.addTween(this)
            .addMotion('battleshipPositionX', -width, this.waitDuration)
            .addMotion('battleshipPositionX', width/2, this.shipEntranceDuration, 'easeOutQuad')
            .addMotion('battleshipPositionX', width/2, 3000)
            .addMotion('battleshipPositionX', width*2, this.shipExitDuration, 'easeInQuad')
            .startTween()

        
        this.waveStructure = {
            troops: [
                {type: 'small', amount: 5, path: 'XP'},
                {type: 'large', amount: 1, path: 'HLP'},
            ]
        }

        this.hasSpawnedTroops = false;
        
    }

    draw() {
        push();
        translate(this.battleshipPositionX, 0);
        rotate(map(this.battleshipPositionX,-width,width*2,-HALF_PI,HALF_PI));
        fill(255);
        stroke(0);
        strokeWeight(5);
        rectMode(CENTER);
        rect(0, 0, width*1.4, 100);
        fill(0);
        noStroke();
        rect(0,0,width*0.8,100);
        pop();


        if(!this.hasSpawnedTroops && this.battleshipPositionX > width/2-10) {
            for(let troop of this.waveStructure.troops) {
                let number = troop.amount;
                let type = null;
                switch(troop.type) {
                    case 'small':
                        type = SmallTroop;
                        break;
                    case 'large':
                        type = LargeTroop;
                        break;
                }
                let path = null;
                switch(troop.path) {
                    case 'XP':
                        path = XPath;
                        break;
                    case 'HLP':
                        path = HorizontalLinePath;
                        break;
                }
                new TroopGroup(number, type, path);
            }
            this.hasSpawnedTroops = true;
        }
    }
}