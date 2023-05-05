import { stepInterval, ComponentTypes } from '../constants/game-constants';
import { generateRandomCoordWithinCanvas } from '../utils/random-utils';
import TextComponent from './text-component';
import PlayerComponent from './player';
import Asteroid, { AsteroidSize } from './asteroid';
import LivesCounter from './lives-counter';
import Spaceship, { SpaceshipSize } from './spaceship';
import Component from './component';

function calculateNumberOfAsteroidsToSpawn(stageIndex) {
    return 2 + stageIndex * 2;
}

class Game {
    canvas: HTMLCanvasElement;
    componentsToDestroy: Component[] = [];
    context: CanvasRenderingContext2D;
    gameOverText: TextComponent | undefined;
    interval = 0;
    isGameOver: boolean;
    lives = 0;
    livesCounter: LivesCounter | undefined;
    obstacles: Component[] = [];
    player: PlayerComponent | undefined;
    renderableComponents: { [key: string]: Component} = {};
    root: HTMLElement;
    saucerCounts: { [key in SpaceshipSize]?: number; };
    score = 0;
    scoreText: TextComponent | undefined;
    stage = 0;

    constructor(height = 600, width = 800) {
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('style', 'background-color:black');
        this.canvas.height = height;
        this.canvas.width = width;
        this.context = this.canvas.getContext('2d')!;

        this.root = document.getElementById('asteroids-root')!;
        this.root.append(this.canvas);

        this.saucerCounts = {
            [SpaceshipSize.BIG]: 0,
            [SpaceshipSize.SMALL]: 0,
        };

        this.isGameOver = false;
    }

    start = () => {
        this.componentsToDestroy = [];
        this.interval = setInterval(this.updateGameArea, stepInterval);
        this.isGameOver = false;
        this.lives = 3;
        this.obstacles = [];
        this.renderableComponents = {};
        this.saucerCounts = {
            [SpaceshipSize.BIG]: 0,
            [SpaceshipSize.SMALL]: 0,
        };
        this.score = 0;
        this.stage = 0;

        this.player = new PlayerComponent({
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
        });

        this.scoreText = new TextComponent({
            color: 'white',
            fontFamily: 'sans-serif',
            fontSize: '64px',
            text: 0,
            x: this.canvas.width / 4.0,
            y: 32,
        });

        this.gameOverText = new TextComponent({
            color: 'transparent',
            fontFamily: 'sans-serif',
            fontSize: '64px',
            text: 'Game Over',
            x: this.canvas.width / 4.0,
            y: this.canvas.height / 4.0,
        });

        this.livesCounter = new LivesCounter({
            x: this.canvas.width / 4.0,
            y: 32,
        });

        this.startStage();
    }

    startStage = () => {
        this.stage++;

        const numberOfLargeAsteroids = calculateNumberOfAsteroidsToSpawn(this.stage);
        this.spawnAsteroids(numberOfLargeAsteroids, AsteroidSize.BIG);
    }

    spawnAsteroids = (count: number, asteroidSize: AsteroidSize, position?) => {
        for (let i = 0; i < count; i++) {
            let actualPosition = position;
            if (!actualPosition) {
                actualPosition = generateRandomCoordWithinCanvas(
                    this.canvas.height,
                    this.canvas.width,
                    150,
                    150,
                );
            }

            const asteroid = new Asteroid({
                asteroidSize,
                x: actualPosition.x,
                y: actualPosition.y,
            });

            this.obstacles.push(asteroid);
        }
    }

    spawnSaucer = () => {
        console.log('spawn saucer');
    }

    endGame = () => {
        this.isGameOver = true;
        this.player!.bullets.forEach(bullet => bullet.destroy());
        this.gameOverText!.color = 'white';
        this.unregisterComponent(this.player!.id);
        clearInterval(this.interval);
        this.updateGameArea();
    }

    clearScreen = () => {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateGameArea = () => {
        this.clearScreen();

        this.componentsToDestroy.forEach((component) => component.destroy());
        this.componentsToDestroy = [];
        Object.values(this.renderableComponents).forEach((component) => component.render());
    }

    getCanvas = () => this.canvas;

    getContext = () => this.context;

    getDimensions = () => ({
        height: this.canvas.height,
        width: this.canvas.width,
    });

    getLives = () => this.lives;

    getPlayer = () => this.player;

    loseLife = () => {
        this.lives--;

        if (this.lives <= 0) {
            this.endGame();
        }
    }

    addToScore = (score) => {
        this.score += score;
        this.scoreText!.setText(this.score);

        // TAB TODO: add logic to give a new life per 10,000 points
    }

    getComponentsOfType = (type) => Object.values(this.renderableComponents)
        .filter((component: Component) => component.type === type);

    registerComponent = (component: Component) => {
        this.renderableComponents[component.id] = component;
    }

    unregisterComponent = (id) => {
        const component = this.renderableComponents[id] || {};
        if (component.type === ComponentTypes.ASTEROID) {
            const indexToRemove = this.obstacles.findIndex(obstacle => obstacle.id === id);
            if (indexToRemove >= 0) {
                this.obstacles.splice(indexToRemove, 1);
            }

            const startingAsteroidsCount = calculateNumberOfAsteroidsToSpawn(this.stage);
            if (this.obstacles.length < (startingAsteroidsCount * 0.8)) {
                this.spawnSaucer();
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
