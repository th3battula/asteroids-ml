import game from './game';

export default class Component {
    constructor({ width, height, x, y, type }) {
        this.height = height;
        this.type = type;
        this.width = width;
        this.x = x;
        this.y = y;

        this.context = game.getContext();
        this.context.fillRect(this.x, this.y, this.width, this.height);
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
        let crash = true;
        if (
            (componentBottom < otherTop) ||
            (componentTop > otherBottom) ||
            (componentRight < otherLeft) ||
            (componentLeft > otherRight)
        ) {
            crash = false;
        }
        return crash;
    }
}
