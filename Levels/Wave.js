const typeToTime = {
    'small': 300,
    'medium': 500,
    'large': 1000
}

const typeToClass = {
    'small': SmallTroop,
    'medium': MediumTroop,
    'large': LargeTroop
}

const pathToClass = {
    'XP': XPath,
    'HBP': HorizontalBarsPath,
    'HLP': HorizontalLinePath,
    'VBP': VerticalBarsPath,
    'RP': RandomPath
}

class Wave {
    constructor(waveStructure) {
        this.waitDuration = 2000;    // In milliseconds
        this.shipEntranceDuration = 2000;    // In milliseconds
        this.shipExitDuration = 2000;    // In milliseconds
        this.startTime = millis();
        
        this.battleshipPositionX = -W;       
        this.waveStructure = waveStructure;
        this.hasSpawnedTroops = false;

        // Used to calculate how long it takes to release all troops
        let maxTroopTime = 0;
        for(let troop of waveStructure.troops) {
            if(troop.type == "boss") {
                new Boss();
                this.hasSpawnedTroops = true;
                return;
            }
            let troopTime = troop.amount * typeToTime[troop.type] + 300;
            maxTroopTime = Math.max(maxTroopTime, troopTime);
        }

        this.tween = p5.tween.manager.addTween(this)
            .addMotion('battleshipPositionX', -W, waveStructure.waitDuration)
            .addMotion('battleshipPositionX', W/2, 2000, 'easeOutQuad')
            .addMotion('battleshipPositionX', W/2, maxTroopTime)
            .addMotion('battleshipPositionX', W*2, 2000, 'easeInQuad')
            .startTween()
    }

    pause() {
        this.tween.pause();
    }

    resume() {
        this.tween.resume();
    }

    hasReleasedTroops() {
        return this.battleshipPositionX > W || this.hasSpawnedTroops;
    }

    draw() {
        push();
        translate(this.battleshipPositionX, 0);
        rotate(map(this.battleshipPositionX,-W,W*2,-HALF_PI,HALF_PI));
        fill(255);
        stroke(0);
        strokeWeight(5);
        rectMode(CENTER);
        rect(0, 0, W*1.4, 100);
        fill(0);
        noStroke();
        rect(0,0,W*0.8,100);
        pop();


        if(!this.hasSpawnedTroops && this.battleshipPositionX > W/2-10) {
            for(let troop of this.waveStructure.troops) {
                if(troop.type == "boss") continue;
                let number = troop.amount;
                let type = typeToClass[troop.type];
                let path = pathToClass[troop.path];
                new TroopGroup(number, type, path);
            }
            this.hasSpawnedTroops = true;
        }
    }
}