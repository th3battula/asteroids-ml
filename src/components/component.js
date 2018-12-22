import game from './game';

export default class Component {
    constructor(width, height, color, x, y, type) {
        this.color = color;
        this.gravity = 0;
        this.gravitySpeed = 0;
        this.height = height;
        this.score = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.type = type;
        this.width = width;
        this.x = x;
        this.y = y;
    }

    update = () => {
        const context = game.getContext();
        if (this.type === 'text') {
            context.font = `${this.width} ${this.height}`;
            context.fillStyle = this.color;
            context.fillText(this.text, this.x, this.y);
        } else {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    newPos = () => {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }

    hitBottom = () => {
        const rockbottom = game.getCanvas().height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }

    crashWith = (otherObj) => {
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
