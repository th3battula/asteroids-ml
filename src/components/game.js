import { stepInterval } from '../constants/game-constants';
import TextComponent from './text-component';
import PlayerComponent from './player';

class Game {
    constructor(height = 600, width = 800) {
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('style', 'background-color:black');
        this.canvas.height = height;
        this.canvas.width = width;
        this.renderableComponents = {};
        this.context = this.canvas.getContext('2d');
        this.frameNo = 0;
        this.interval = setInterval(this.updateGameArea, stepInterval);

        this.root = document.getElementById('asteroids-root');
        this.root.append(this.canvas);

        this.lives = 3;
        this.player = null;
        this.obstacles = [];
        this.score = 0;
        this.scoreText = null;
    }

    clearScreen = () => {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    start = () => {
        this.player = new PlayerComponent({
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
        });
        this.player.startUpdate();

        this.scoreText = new TextComponent({
            size: '30px',
            fontFamily: 'sans-serif',
            color: 'white',
            x: 280,
            y: 40,
        });
        this.scoreText.startUpdate();
    }

    endGame = () => {
        clearInterval(this.interval);
    }

    step = n => (this.frameNo / n) % 1 === 0;

    updateGameArea = () => {
        this.clearScreen();
        this.frameNo += 1;

        Object.values(this.renderableComponents).forEach(component => component.render());
    }

    getCanvas = () => this.canvas;

    getContext = () => this.context;

    getDimensions = () => ({
        height: this.canvas.height,
        width: this.canvas.width,
    });

    setScore = (score) => {
        this.score = score;
        this.scoreText.setText(this.score);
    }

    registerComponent = (component) => {
        this.renderableComponents[component.id] = component;
    }

    unregisterComponent = (component) => {
        delete this.renderableComponents[component.id];
    }
}

const game = new Game();
export default game;
