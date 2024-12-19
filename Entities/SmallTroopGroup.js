class SmallTroopGroup extends TroopGroup {
    constructor(numberOfTroops) {
        super(numberOfTroops, SmallTroop, 100);
    }

    generatePath() {
        this.pathToFollow.push(createVector(50,50));
        this.pathToFollow.push(createVector(width-50,150));
        this.pathToFollow.push(createVector(width-50,50));
        this.pathToFollow.push(createVector(50,150));
    }
}