class StoryScene extends Scene {
    constructor(levelNumber) {
        super();

        this.levelNumber = levelNumber;
        this.currentPageNumber = -1;
        this.currentPage;
        this.pageAnimation = 1;
        this.currentImages = [];
        this.nextImages = [];

        this.skipTextAlpha = 0;
        this.isSkipping = false;
    }

    preload() {
        return Promise.all([loadStoryInfo()]);
    }

    start() {
        new Promise(() => {
            this.loadNextImages();
            this.switchToNextPage(); 
        });
    }

    loadNextImages() {
        this.nextImages = [];
        let nextPage = storyInfo[this.levelNumber].pages[this.currentPageNumber+1];
        for(let i=0; i<nextPage.layers.length; i++) {
            this.nextImages.push(loadImage("./Assets/Images/"+nextPage.layers[i]));
        }
    }

    switchToNextPage() {
        if(this.isSkipping) return;
        if(this.pageAnimation != 1) this.isSkipping = true;

        let isLastPage = this.currentPageNumber == storyInfo[this.levelNumber].pages.length-1;
        if(this.isSkipping || isLastPage) {
            nextScene = new LevelScene(this.levelNumber);
            transition = new FadeTransition();
            return;
        }
        
        this.currentPageNumber++;
        this.currentPage = storyInfo[this.levelNumber].pages[this.currentPageNumber];
        this.pageAnimation = -1;

        p5.tween.manager.addTween(this)
            .addMotion("pageAnimation", 0, this.currentPage.duration/2 * 1000, 'easeOutQuad')
            .addMotion("pageAnimation", 1, this.currentPage.duration/2 * 1000, 'easeInQuad')
            .onEnd(()=>{this.switchToNextPage()})
            .startTween();

        this.currentImages = this.nextImages;

        if(this.currentPageNumber == storyInfo[this.levelNumber].pages.length-1) return;

        new Promise(() => {this.loadNextImages();});
    }

    draw() {
        background(0);
        if(!this.currentPage) return;

        // Page images
        push();
        translate(width/2,height/2);
        rotate(0.06*this.pageAnimation*(this.currentPageNumber%2==0?1:-1));
        scale(1.3+0.05*this.pageAnimation);
        translate(-width/2,-height/2);
        let offset = p5.Vector.fromAngle(2.36*this.currentPageNumber).mult(this.currentPage.duration);
        for(let i=0; i<this.currentImages.length; i++) {
            let y = i*min(this.currentPage.duration*5,20)*this.pageAnimation;
            image(this.currentImages[i],offset.x,offset.y-y, width, height);
        }
        pop();
        
        // Page text
        fill(255,map(Math.abs(this.pageAnimation),0,0.8,255,0));
        stroke(0,map(Math.abs(this.pageAnimation),0,0.8,255,0));
        strokeWeight(5);
        textWrap(WORD);
        textAlign(CENTER,CENTER);
        textSize(30);
        text(this.currentPage.text, width*0.1, height*0.7, width*0.8);

        // Skip text
        this.skipTextAlpha = max(this.skipTextAlpha-5, 0);
        fill(255, this.skipTextAlpha);
        stroke(0, this.skipTextAlpha);
        strokeWeight(5);
        textSize(15);
        text("Hold 's'\nto skip", width-50,height-50);
        noFill();
        stroke(0,min(this.skipTextAlpha,100));
        strokeWeight(8);
        circle(width-50,height-50,80);
        let duration = getHeldDownDuration(83);
        if(!this.isSkipping) {
            if(duration >= 2000) this.switchToNextPage();
            else {
                noFill();
                stroke(255);
                strokeWeight(4);
                arc(width-50,height-50,80,80,0,duration/1000*PI);
            }
        }

        // Fade in and out
        if(this.currentPageNumber == storyInfo[this.levelNumber].pages.length-1) fill(0,map(this.pageAnimation,0.5,1,0,255));
        else if(this.currentPageNumber == 0) fill(0,-this.pageAnimation*255);
        else noFill();
        noStroke();
        rectMode(CORNER);
        rect(0,0,width,height);
    }

    keyPressed() {
        this.skipTextAlpha = 1500;
    }
}