import Component from './component';

class Game {
    constructor() {
        this.canvas = document.createElement('canvas');
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyDown);
        this.canvas.height = 600;
        this.canvas.width = 800;
        this.context = this.canvas.getContext('2d');
        this.frameNo = 0;
        this.interval = setInterval(this.updateGameArea, 20);

        this.root = document.getElementById('asteroids-root');
        this.root.append(this.canvas);

        this.player = null;
        this.obstacles = [];
        this.score = null;
    }

    handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            console.log('handleKeyDown');
        }
    };

    handleKeyUp = (e) => {
        console.log('handleKeyUp');
    };

    clear = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    start = () => {
        this.player = new Component(30, 30, 'red', 10, 120);
        this.score = new Component('30px', 'Consolas', 'black', 280, 40, 'text');
    }

    clearStep = () => {
        clearInterval(this.interval);
    }

    step = n => (this.frameNo / n) % 1 === 0;

    updateGameArea = () => {
        let x;
        let height;
        let gap;
        let minHeight;
        let maxHeight;
        let minGap;
        let maxGap;

        for (let i = 0; i < this.obstacles.length; i += 1) {
            if (this.player.crashWith(this.obstacles[i])) {
                this.clearStep();
                return;
            }
        }
        this.clear();
        this.frameNo += 1;
        if (this.frameNo === 1 || this.step(150)) {
            x = this.canvas.width;
            minHeight = 20;
            maxHeight = 200;
            height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
            minGap = 50;
            maxGap = 200;
            gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
            this.obstacles.push(new Component(10, height, 'green', x, 0));
            this.obstacles.push(new Component(10, x - height - gap, 'green', x, height + gap));
        }
        for (let i = 0; i < this.obstacles.length; i += 1) {
            this.obstacles[i].x += -1;
            this.obstacles[i].update();
        }
        this.score.text = `SCORE: ${this.frameNo}`;
        this.score.update();
        this.player.newPos();
        this.player.update();
    }

    getCanvas = () => this.canvas;

    getContext = () => this.context;
}

const game = new Game();
export default game;
