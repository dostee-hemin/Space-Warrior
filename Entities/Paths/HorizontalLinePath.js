class HorizontalLinePath extends PathGenerator {
    constructor() {
        super();
    }

    generatePath() {
        this.points.push(createVector(50,40));
        this.points.push(createVector(width-50,40));
        return this.points;
    }
}