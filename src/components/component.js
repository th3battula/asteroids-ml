import uuid from 'uuid/v1';
import { stepInterval } from '../constants/game-constants';
import game from './game';

export default class Component {
    constructor({ width, height, x, y }) {
        this.height = height;
        this.id = uuid();
        this.startTime = Date.now();
        this.width = width;
        this.x = x;
        this.y = y;

        this.context = game.getContext();
        this.context.fillRect(this.x, this.y, this.width, this.height);
        game.registerComponent(this);
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

    render = () => {};

    startUpdate = () => {
        this.interval = setInterval(this.update, stepInterval);
    };

    update = () => {};
}
