import { v4 as uuid } from 'uuid';
import { stepInterval, ComponentTypes } from '../constants/game-constants';
import game from './game';

export default class Component {
    constructor({
        angle = 0,
        collisionTypeMask = [],
        imageSrc = '',
        injuryInvulnerabilityTime = 0,
        lifetime,
        speed = 1,
        x,
        y,
    }) {
        this.angle = angle;
        this.canCollide = true;
        this.collisionTypeMask = collisionTypeMask;
        this.id = uuid();
        this.image = new Image();
        this.image.src = imageSrc;
        this.injuryInvulnerabilityTime = injuryInvulnerabilityTime;
        this.isDead = false;
        this.lifetime = lifetime;
        this.speed = speed;
        this.startTime = Date.now();
        this.height = this.image.height;
        this.width = this.image.width;
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

        if (this.collisionTypeMask.length) {
            this.collisionInterval = setInterval(this.checkCollisions);
        }
    }

    destroy = () => {
        if (this.updateInterval && this.collisionInterval) {
            game.unregisterComponent(this.id);
            clearInterval(this.updateInterval);
            clearInterval(this.collisionInterval);
        }
    }

    checkCollisions = () => {
        this.collisionTypeMask.forEach((type) => {
            const typeComponents = game.getComponentsOfType(type);
            typeComponents.forEach((component) => {
                if (component.canCollide && this.isCollidingWith(component)) {
                    this.onCollision(component);
                }
            });
        });
    }

    isCollidingWith = (otherObj) => {
        let isColliding = false;
        if (this.collisionTypeMask.includes(otherObj.type)) {
            const componentRadius = Math.min(this.image.width, this.image.height) / 2.0;
            const componentCenterX = this.x;
            const componentCenterY = this.y;

            const otherRadius = Math.min(otherObj.image.width, otherObj.image.height) / 2.0;
            const otherCenterX = otherObj.x;
            const otherCenterY = otherObj.y;

            const a2 = (otherCenterX - componentCenterX) ** 2;
            const b2 = (otherCenterY - componentCenterY) ** 2;
            const distance = Math.sqrt(a2 + b2);
            const sumRadii = componentRadius + otherRadius;

            isColliding = distance <= sumRadii;
        }
        return isColliding;
    };

    onCollision = () => {}

    render = () => {
        this.context.setTransform(1, 0, 0, 1, this.x, this.y); // sets scale and origin
        this.context.rotate(this.angle);
        this.context.drawImage(this.image, -this.image.width / 2.0, -this.image.height / 2.0);
    }

    kill = () => { this.isDead = true; }

    startUpdate = () => {
        this.updateInterval = setInterval(this.update, stepInterval);
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
