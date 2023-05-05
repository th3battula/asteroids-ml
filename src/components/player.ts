import Component from './component';
import shipSvg from '../assets/ship.svg';
import game from './game';
import Bullet from './bullet';
import { ComponentTypes } from '../constants/game-constants';

const keys = Object.freeze({
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
    W: 'w',
    A: 'a',
    S: 's',
    D: 'd',
    SPACE: ' ',
});

const defaultProps = {
    collisionTypeMask: [ComponentTypes.ASTEROID],
    imageSrc: shipSvg,
    injuryInvulnerabilityTime: 2500,
    speed: 5,
    type: ComponentTypes.PLAYER,
};

export default class PlayerComponent extends Component {
    acceleration: number;
    angularSpeed: number;
    bullets: Bullet[];
    canShoot: boolean;
    coefficientOfFriction: number;
    inputState: { [key: string]: boolean };
    shootInterval: number;
    maxSpeed: number;

    constructor({
        acceleration = 0.2,
        angularSpeed = 10,
        coefficientOfFriction = 0.01,
        shootInterval = 150,
        ...rest
    }) {
        super({ ...defaultProps, ...rest });

        this.acceleration = acceleration;
        this.angularSpeed = angularSpeed;
        this.angle = 0;
        this.bullets = [];
        this.canShoot = true;
        this.coefficientOfFriction = coefficientOfFriction;
        this.inputState = {};
        this.shootInterval = shootInterval;
        this.maxSpeed = this.speed;
        this.velocity = {
            x: 0,
            y: 0,
        };

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);

        this.startUpdate(); // included because this class overrides the update method
    }

    handleKeyDown = (e) => {
        this.inputState[e.key] = true;
        if (Object.values(keys).includes(e.key)) {
            e.preventDefault();
        }
    };

    handleKeyUp = (e) => {
        this.inputState[e.key] = false;
    };

    clampVelocity = (velocity) => {
        const magnitude = Math.sqrt((velocity.x ** 2) + (velocity.y ** 2));
        const clampedMagnitude = Math.min(magnitude, this.maxSpeed);
        const magnitudeRatio = magnitude ? clampedMagnitude / magnitude : 1;

        return {
            x: velocity.x * magnitudeRatio,
            y: velocity.y * magnitudeRatio,
        };
    };

    onCollision = () => {
        if (this.canCollide) {
            this.canCollide = false;
            setTimeout(() => {
                this.canCollide = true;
            }, this.injuryInvulnerabilityTime);
            game.loseLife();
        }
    };

    shoot = () => {
        this.canShoot = false;
        const bulletX = this.x + ((this.width) * Math.sin(this.angle));
        const bulletY = this.y - ((this.height) * Math.cos(this.angle));
        const bullet = new Bullet({
            angle: this.angle,
            type: 'bullet',
            x: bulletX,
            y: bulletY,
        });

        this.bullets.push(bullet);
        if (this.bullets.length > 4) { // hardcoded limit due to rules of original game
            const bulletToDestroy = this.bullets.shift();
            bulletToDestroy!.destroy();
        }

        setTimeout(() => { this.canShoot = true; }, this.shootInterval);
        return bullet;
    };

    update = () => {
        const isUpPressed = this.inputState[keys.UP] || this.inputState[keys.W];
        if (this.inputState[keys.LEFT] || this.inputState[keys.A]) {
            this.angle -= (this.angularSpeed * (Math.PI / 180));
        }

        if (this.inputState[keys.RIGHT] || this.inputState[keys.D]) {
            this.angle += (this.angularSpeed * (Math.PI / 180));
        }

        if (this.inputState[keys.SPACE] && this.canShoot) { // spacebar is pressed
            this.shoot();
        }

        const accelerationToAdd = isUpPressed ? this.acceleration : 0;
        const xVelToAdd = isUpPressed ? (accelerationToAdd * Math.sin(this.angle)) : 0;
        const yVelToAdd = isUpPressed ? (accelerationToAdd * -Math.cos(this.angle)) : 0;

        const newVelocity = {
            x: this.velocity.x + xVelToAdd,
            y: this.velocity.y + yVelToAdd,
        };

        this.velocity = this.clampVelocity(newVelocity);
        if (!isUpPressed) {
            const coefficientOfFriction = (1 - this.coefficientOfFriction);
            this.velocity = {
                x: this.velocity.x * coefficientOfFriction,
                y: this.velocity.y * coefficientOfFriction,
            };
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        const { height, width } = game.getDimensions();
        if (this.x < 0) {
            this.x = width;
        } else if (this.x > width) {
            this.x = 0;
        }
        if (this.y < 0) {
            this.y = height;
        } else if (this.y > height) {
            this.y = 0;
        }
    }
}
