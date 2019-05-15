import uuid from 'uuid/v1';
import { stepInterval } from '../constants/game-constants';
import game from './game';

export default class Component {
    constructor({
        angle = 0,
        height,
        imageSrc = '',
        lifetime,
        scale = 1,
        speed = 1,
        width,
        x,
        y,
    }) {
        this.angle = angle;
        this.height = height;
        this.id = uuid();
        this.image = new Image();
        this.image.src = imageSrc;
        this.lifetime = lifetime;
        this.scale = scale;
        this.speed = speed;
        this.startTime = Date.now();
        this.width = width;
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.x = x;
        this.y = y;

        this.context = game.getContext();
        this.context.fillRect(this.x, this.y, this.width, this.height);
        game.registerComponent(this);

        if (lifetime) {
            setTimeout(this.destroy, this.lifetime);
        }
    }

    destroy = () => {
        if (this.interval) {
            game.unregisterComponent(this);
            clearInterval(this.interval);
        }
    }

    isCollidingWith = (otherObj) => {
        const componentLeft = this.x;
        const componentRight = this.x + (this.width);
        const componentTop = this.y;
        const componentBottom = this.y + (this.height);
        const otherLeft = otherObj.x;
        const otherRight = otherObj.x + (otherObj.width);
        const otherTop = otherObj.y;
        const otherBottom = otherObj.y + (otherObj.height);

        return !(
            (componentBottom < otherTop) ||
            (componentTop > otherBottom) ||
            (componentRight < otherLeft) ||
            (componentLeft > otherRight)
        );
    };

    render = () => {
        this.context.setTransform(this.scale, 0, 0, this.scale, this.x, this.y); // sets scale and origin
        this.context.rotate(this.angle);
        this.context.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
    }

    startUpdate = () => {
        this.interval = setInterval(this.update, stepInterval);
    };

    update = () => {
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
