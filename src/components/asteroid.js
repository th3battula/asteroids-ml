import Component from './component';

const defaultProps = {
    imageSrc: '',
    lifetime: 2000,
};

export default class Asteroid extends Component {
    constructor(properties) {
        super({ ...defaultProps, ...properties });
        this.type = 'asteroid';
        this.velocity = {
            x: this.speed * Math.sin(this.angle),
            y: this.speed * -Math.cos(this.angle),
        };

        this.startUpdate();
    }
}
