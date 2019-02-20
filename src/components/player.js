import Component from './component';
import shipSvg from '../assets/ship.svg';
import game from './game';

export default class PlayerComponent extends Component {
    constructor(properties) {
        const {
            acceleration = 0.2,
            angularSpeed = 10,
            coefficientOfFriction = 0.01,
            scale = 1,
            speed = 1,
            ...rest
        } = properties;
        super(rest);

        this.acceleration = acceleration;
        this.angularSpeed = angularSpeed;
        this.angle = 0;
        this.coefficientOfFriction = coefficientOfFriction;
        this.inputState = {};
        this.scale = scale;
        this.shipImage = new Image();
        this.shipImage.src = shipSvg;
        this.maxSpeed = speed;
        this.velocity = {
            x: 0,
            y: 0,
        };

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    drawImage = () => {
        this.context.setTransform(this.scale, 0, 0, this.scale, this.x, this.y); // sets scale and origin
        this.context.rotate(this.angle);
        this.context.drawImage(this.shipImage, -this.shipImage.width / 2, -this.shipImage.height / 2);
    }

    handleKeyDown = (e) => {
        this.inputState[e.key] = true;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Space') {
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
    }

    update = () => {
        if (this.inputState.ArrowLeft) {
            this.angle -= (this.angularSpeed * (Math.PI / 180));
        }

        if (this.inputState.ArrowRight) {
            this.angle += (this.angularSpeed * (Math.PI / 180));
        }

        const accelerationToAdd = this.inputState.ArrowUp ? this.acceleration : 0;
        const xVelToAdd = this.inputState.ArrowUp ?
            ((accelerationToAdd) * Math.sin(this.angle)) :
            0;
        const yVelToAdd = this.inputState.ArrowUp ?
            ((accelerationToAdd) * -Math.cos(this.angle)) :
            0;

        const newVelocity = {
            x: this.velocity.x + xVelToAdd,
            y: this.velocity.y + yVelToAdd,
        };

        this.velocity = this.clampVelocity(newVelocity);
        if (!this.inputState.ArrowUp) {
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
        this.drawImage();
    }
}
