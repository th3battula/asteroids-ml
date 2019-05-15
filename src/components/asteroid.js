import Component from './component';
import { range } from '../utils/random-utils';
import asteroidSvg from '../assets/asteroid.svg';

const AsteroidSize = Object.freeze({
    BIG: 1,
    MEDIUM: 2,
    SMALL: 3,
});

const defaultProps = {
    imageSrc: asteroidSvg,
};

export default class Asteroid extends Component {
    constructor(properties) {
        const { asteroidSize = AsteroidSize.BIG, ...rest } = properties;
        super({ ...defaultProps, ...rest });

        this.angle = range(0, 360);
        this.asteroidSize = asteroidSize;
        this.speed = asteroidSize / 2;
        this.type = 'asteroid';
        this.velocity = {
            x: this.speed * Math.sin(this.angle),
            y: this.speed * -Math.cos(this.angle),
        };

        this.startUpdate();
    }
}
