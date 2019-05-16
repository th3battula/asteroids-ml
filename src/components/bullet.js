import Component from './component';
import bulletSvg from '../assets/bullet.svg';
import { ComponentTypes } from '../constants/game-constants';
import game from './game';

const defaultProps = {
    collisionTypeMask: [ComponentTypes.ASTEROID],
    imageSrc: bulletSvg,
    lifetime: 2000,
    speed: 25,
};

export default class Bullet extends Component {
    constructor(properties) {
        super({ ...defaultProps, ...properties });
        this.type = ComponentTypes.BULLET;
        this.velocity = {
            x: this.speed * Math.sin(this.angle),
            y: this.speed * -Math.cos(this.angle),
        };

        this.startUpdate();
    }

    onCollision = () => {
        if (!this.isDead) { // TAB TODO: Work out a better way to stop actions from being dispatched from dead components re: componentsToDestroy queue
            game.addToDestroyQueue(this);
        }
    }
}
