class XPath extends PathGenerator {
    constructor() {
        super();
    }

    generatePath(startsAtLeft=true) {
        let firstX = startsAtLeft ? 50 : W-50;
        let secondX = startsAtLeft ? W-50 : 50;
        this.points.push(createVector(firstX,50));
        this.points.push(createVector(secondX,150));
        this.points.push(createVector(secondX,50));
        this.points.push(createVector(firstX,150));
        return this.points;
    }
}