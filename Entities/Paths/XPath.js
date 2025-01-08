class XPath extends PathGenerator {
    constructor() {
        super();
    }

    generatePath() {
        this.points.push(createVector(50,50));
        this.points.push(createVector(W-50,150));
        this.points.push(createVector(W-50,50));
        this.points.push(createVector(50,150));
        return this.points;
    }
}