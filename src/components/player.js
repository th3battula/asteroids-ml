import throttle from 'lodash.throttle';
import Component from './component';
import shipSvg from '../assets/ship.svg';
import game from './game';
import Bullet from './bullet';

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

export default class PlayerComponent extends Component {
    constructor(properties) {
        const {
            acceleration = 0.2,
            angularSpeed = 10,
            coefficientOfFriction = 0.01,
            scale = 0.1,
            shootInterval = 300,
            speed = 5,
            ...rest
        } = properties;
        super(rest);

        this.acceleration = acceleration;
        this.angularSpeed = angularSpeed;
        this.angle = 0;
        this.bullets = [];
        this.coefficientOfFriction = coefficientOfFriction;
        this.inputState = {};
        this.scale = scale;
        this.shipImage = new Image();
        this.shipImage.src = shipSvg;
        this.shootInterval = shootInterval;
        this.throttledShoot = throttle(this.shoot, this.shootInterval, { leading: true });
        this.type = 'player';
        this.maxSpeed = speed;
        this.velocity = {
            x: 0,
            y: 0,
        };

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    render = () => {
        this.context.setTransform(this.scale, 0, 0, this.scale, this.x, this.y); // sets scale and origin
        this.context.rotate(this.angle);
        this.context.drawImage(this.shipImage, -this.shipImage.width / 2, -this.shipImage.height / 2);
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

    shoot = () => {
        const bulletX = this.x + ((this.shipImage.width * this.scale / 2) + Math.sin(this.angle));
        const bulletY = this.y + ((this.shipImage.height * this.scale / 2) - Math.cos(this.angle));
        const bullet = new Bullet({
            angle: this.angle,
            scale: 0.1,
            speed: 10,
            type: 'bullet',
            x: bulletX,
            y: bulletY,
        });

        this.bullets.push(bullet);
        if (this.bullets.length > 4) { // hardcoded limit due to rules of original game
            const bulletToDestroy = this.bullets.shift();
            bulletToDestroy.destroy();
        }

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

        if (this.inputState[keys.SPACE]) { // spacebar is pressed
            this.throttledShoot();
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

        game.setScore(`Velocity: [${this.velocity.x}, ${this.velocity.y}]`);

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
