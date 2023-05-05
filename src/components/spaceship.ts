import Component from './component';
import { ComponentTypes } from '../constants/game-constants';
import { range } from '../utils/random-utils';
import game from './game';

export enum SpaceshipSize {
    BIG = 1,
    SMALL = 2,
}

export const SpaceshipScores = Object.freeze({
    [SpaceshipSize.BIG]: 200,
    [SpaceshipSize.SMALL]: 1000,
});

const SpaceshipSpeeds = Object.freeze({
    [SpaceshipSize.BIG]: 2,
    [SpaceshipSize.SMALL]: 8,
});

const defaultProps = {
    collisionTypeMask: [ComponentTypes.PLAYER, ComponentTypes.BULLET],
    type: ComponentTypes.SPACESHIP,
};

export default class Spaceship extends Component {
    angle: number;
    shipSize: SpaceshipSize;
    speed: number;
    velocity: { x: number, y: number };

    constructor({ shipSize = SpaceshipSize.BIG, ...rest }) {
        super({ ...defaultProps, ...rest });

        this.angle = range(0, 360);
        this.shipSize = shipSize;
        this.speed = SpaceshipSpeeds[shipSize];
        this.velocity = {
            x: this.speed * Math.sin(this.angle),
            y: this.speed * -Math.cos(this.angle),
        };

        this.startUpdate();
    }

    onCollision = (otherObj) => {
        if (!this.isDead) {
            if (otherObj.type === ComponentTypes.BULLET) {
                game.addToScore(SpaceshipScores[this.shipSize]);
                game.addToDestroyQueue(this);
            }
        }
    }
}
