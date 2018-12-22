import TextComponent from './text-component';
import PlayerComponent from './player';

class Game {
    constructor(height = 600, width = 800) {
        this.canvas = document.createElement('canvas');
        this.canvas.height = height;
        this.canvas.width = width;
        this.context = this.canvas.getContext('2d');
        this.frameNo = 0;
        this.interval = setInterval(this.updateGameArea, 20);

        this.root = document.getElementById('asteroids-root');
        this.root.append(this.canvas);

        this.lives = 3;
        this.player = null;
        this.obstacles = [];
        this.score = null;
    }

    clearScreen = () => {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    start = () => {
        this.player = new PlayerComponent({
            height: '5',
            speed: 5,
            width: '30',
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
        });

        this.score = new TextComponent({
            size: '30px',
            fontFamily: 'Consolas',
            color: 'black',
            x: 280,
            y: 40,
        });
    }

    endGame = () => {
        clearInterval(this.interval);
    }

    step = n => (this.frameNo / n) % 1 === 0;

    updateGameArea = () => {
        this.clearScreen();
        this.frameNo += 1;

        for (let i = 0; i < this.obstacles.length; i += 1) {
            this.obstacles[i].x += -1;
            this.obstacles[i].update();
        }

        this.player.update();
        this.score.update();
    }

    getCanvas = () => this.canvas;

    getContext = () => this.context;
}

const game = new Game();
export default game;
