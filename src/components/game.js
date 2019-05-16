import { stepInterval, ComponentTypes } from '../constants/game-constants';
import { generateRandomCoordWithinCanvas } from '../utils/random-utils';
import TextComponent from './text-component';
import PlayerComponent from './player';
import Asteroid, { AsteroidSize } from './asteroid';

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

        this.componentsToDestroy = [];
        this.lives = 3;
        this.player = null;
        this.obstacles = [];
        this.score = 0;
        this.scoreText = null;
        this.stage = 0;
    }

    start = () => {
        this.player = new PlayerComponent({
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
        });

        this.scoreText = new TextComponent({
            size: '30px',
            fontFamily: 'sans-serif',
            color: 'white',
            x: 280,
            y: 40,
        });

        this.startStage();
    }

    startStage = () => {
        this.stage++;

        const numberOfLargeAsteroids = 2 + this.stage * 2;
        this.spawnAsteroids(numberOfLargeAsteroids, AsteroidSize.BIG);
    }

    spawnAsteroids = (count, asteroidSize, position) => {
        for (let i = 0; i < count; i++) {
            let actualPosition = position;
            if (!actualPosition) {
                actualPosition = generateRandomCoordWithinCanvas(this.canvas.height, this.canvas.width);
            }

            const asteroid = new Asteroid({
                asteroidSize,
                x: actualPosition.x,
                y: actualPosition.y,
            });

            this.obstacles.push(asteroid);
        }
    }

    endGame = () => {
        clearInterval(this.interval);
    }

    clearScreen = () => {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateGameArea = () => {
        this.clearScreen();

        this.componentsToDestroy.forEach(component => component.destroy());
        this.componentsToDestroy = [];
        Object.values(this.renderableComponents).forEach(component => component.render());
    }

    getCanvas = () => this.canvas;

    getContext = () => this.context;

    getDimensions = () => ({
        height: this.canvas.height,
        width: this.canvas.width,
    });

    getPlayer = () => this.player;

    loseLife = () => {
        this.lives--;
    }

    setScore = (score) => {
        this.score = score;
        this.scoreText.setText(this.score);
    }

    getComponentsOfType = type => Object.values(this.renderableComponents)
        .filter(component => component.type === type);

    registerComponent = (component) => {
        this.renderableComponents[component.id] = component;
    }

    unregisterComponent = (id) => {
        const component = this.renderableComponents[id] || {};
        if (component.type === ComponentTypes.ASTEROID) {
            const indexToRemove = this.obstacles.findIndex(obstacle => obstacle.id === id);
            if (indexToRemove >= 0) {
                this.obstacles.splice(indexToRemove, 1);
            }

            if (!this.obstacles.length) {
                this.startStage();
            }
        }
        delete this.renderableComponents[id];
    }

    addToDestroyQueue = (component) => {
        component.kill();
        this.componentsToDestroy.push(component);
    }
}

const game = new Game();
export default game;
