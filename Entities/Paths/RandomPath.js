class RandomPath extends PathGenerator {
    constructor() {
        super();
    }

    generatePath() {
        for(let i=0; i<8; i++) {
            this.points.push(createVector(random(50,width-50),random(20,300)));
        }
        return this.points;
    }
}