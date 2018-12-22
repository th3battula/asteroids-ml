import Component from './component';
import shipSvg from '../assets/ship.svg';
import game from './game';

export default class PlayerComponent extends Component {
    constructor(properties) {
        const { speed = 1, ...rest } = properties;
        super(rest);

        this.angle = 0;
        this.gameContext = game.getContext();
        this.inputState = {};
        this.shipImage = new Image();
        this.shipImage.src = shipSvg;
        this.speed = speed;
        this.velocity = {
            x: 0,
            y: 0,
        };

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    drawImage = () => {
        this.gameContext.setTransform(0.1, 0, 0, 0.1, this.x, this.y); // sets scale and origin
        this.gameContext.rotate(this.angle);
        this.gameContext.drawImage(this.shipImage, -this.shipImage.width / 2, -this.shipImage.height / 2);
    }

    handleKeyDown = (e) => {
        this.inputState[e.key] = true;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
        }
    };

    handleKeyUp = (e) => {
        this.inputState[e.key] = false;
    };

    update = () => {
        if (this.inputState.ArrowLeft) {
            this.angle -= 10 * (Math.PI / 180);
        }

        if (this.inputState.ArrowRight) {
            this.angle += 10 * (Math.PI / 180);
        }

        if (this.inputState.ArrowUp) {
            const xVel = this.speed * Math.sin(this.angle);
            const yVel = this.speed * -Math.cos(this.angle); // must be negative because +y faces down in the context of the html canvas
            this.velocity = {
                x: xVel,
                y: yVel,
            };
        } else {
            this.velocity = { x: 0, y: 0 };
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.drawImage();
    }
}
