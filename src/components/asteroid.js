import Component from './component';
import { range } from '../utils/random-utils';
import asteroidBigSvg from '../assets/asteroid-big.svg';
import asteroidMediumSvg from '../assets/asteroid-medium.svg';
import asteroidSmallSvg from '../assets/asteroid-small.svg';
import { ComponentTypes } from '../constants/game-constants';
import game from './game';

export const AsteroidSize = Object.freeze({
    BIG: 1,
    MEDIUM: 2,
    SMALL: 4,
});

export const AsteroidSvg = Object.freeze({
    [AsteroidSize.BIG]: asteroidBigSvg,
    [AsteroidSize.MEDIUM]: asteroidMediumSvg,
    [AsteroidSize.SMALL]: asteroidSmallSvg,
});

export const AsteroidScores = Object.freeze({
    [AsteroidSize.BIG]: 20,
    [AsteroidSize.MEDIUM]: 50,
    [AsteroidSize.SMALL]: 50,
});

const defaultProps = {
    collisionTypeMask: [ComponentTypes.PLAYER, ComponentTypes.BULLET],
};

export default class Asteroid extends Component {
    constructor(properties) {
        const { asteroidSize = AsteroidSize.BIG, ...rest } = properties;
        super({ ...defaultProps, imageSrc: AsteroidSvg[asteroidSize], ...rest });

        this.angle = range(0, 360);
        this.asteroidSize = asteroidSize;
        this.speed = asteroidSize / 2;
        this.type = ComponentTypes.ASTEROID;
        this.velocity = {
            x: this.speed * Math.sin(this.angle),
            y: this.speed * -Math.cos(this.angle),
        };

        this.startUpdate();
    }

    onCollision = (otherObj) => {
        if (!this.isDead) {
            if (otherObj.type === ComponentTypes.BULLET) {
                game.addToScore(AsteroidScores[this.asteroidSize]);
                let size;
                if (this.asteroidSize === AsteroidSize.BIG) {
                    size = AsteroidSize.MEDIUM;
                } else if (this.asteroidSize === AsteroidSize.MEDIUM) {
                    size = AsteroidSize.SMALL;
                }

                game.addToDestroyQueue(this);
                if (size) {
                    game.spawnAsteroids(2, size, {
                        x: this.x,
                        y: this.y,
                    });
                }
            }
        }
    }
}
