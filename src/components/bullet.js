import Component from './component';
import bulletSvg from '../assets/bullet.svg';

const defaultProps = {
    imageSrc: bulletSvg,
    lifetime: 2000,
};

export default class Bullet extends Component {
    constructor(properties) {
        super({ ...defaultProps, ...properties });
        this.type = 'bullet';
        this.velocity = {
            x: this.speed * Math.sin(this.angle),
            y: this.speed * -Math.cos(this.angle),
        };

        this.startUpdate();
    }
}
