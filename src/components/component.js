import { stepInterval } from '../constants/game-constants';
import game from './game';

export default class Component {
    constructor({ width, height, x, y, type }) {
        this.height = height;
        this.startTime = Date.now();
        this.type = type;
        this.width = width;
        this.x = x;
        this.y = y;

        this.context = game.getContext();
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }

    startUpdate = () => {
        this.interval = setInterval(this.update, stepInterval);
        //TAB
        console.log('#TAB stepInterval', stepInterval);
        console.log('#TAB this.interval', this.interval);
    };

    destroy = () => {
        if (this.interval) {
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

    update = () => {};
}
