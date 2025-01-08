class Panel extends UI {
    constructor(title, x, y, w, h) {
        super(x, y, w, h);

        this.title = title
        this.startAnimation = 0;
        this.UIChildren = [];
    }

    addUI(children) {
        this.UIChildren = this.UIChildren.concat(children);
        for(let child of children) child.visible = false; 
    }

    getUI() {
        return this.UIChildren;
    }

    display() {
        if(this.startAnimation == 0) return;

        fill(255);
        stroke(0);
        strokeWeight(2);
        rectMode(CENTER);
        rect(this.x, this.y, this.w * this.startAnimation, this.h * this.startAnimation);

        fill(0);
        noStroke();
        textSize(20*this.startAnimation);
        textAlign(CENTER, CENTER);
        text(this.title, this.x, this.y - this.h/2*this.startAnimation + 20);
    }

    isActive() {
        return this.startAnimation != 0;
    }

    isOpen() {
        return this.startAnimation == 1;
    }

    open() {
        p5.tween.manager.addTween(this)
            .addMotion('startAnimation', 1, 200, 'easeOutQuad')
            .onEnd(() => {
                if (this.UIChildren) {
                    this.UIChildren.forEach(child => child.visible = true);
                }
            })
            .startTween();
    }

    close() {
        if (this.UIChildren) {
            this.UIChildren.forEach(child => child.visible = false);
        }

        p5.tween.manager.addTween(this)
            .addMotion('startAnimation', 0, 200, 'easeInQuad')
            .startTween();
    }
}