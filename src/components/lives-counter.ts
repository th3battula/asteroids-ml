import Component from './component';
import { ComponentTypes } from '../constants/game-constants';
import shipSvg from '../assets/ship.svg';
import game from './game';

const defaultProps = {
    collisionTypeMask: [],
    imageSrc: shipSvg,
    type: ComponentTypes.LIVES_COUNTER,
};

export default class LivesCounter extends Component {
    text: string | number;

    constructor(properties) {
        super({ ...defaultProps, ...properties });

        this.text = '';
        this.startUpdate();
    }

    render = () => {
        this.context.setTransform(1, 0, 0, 1, this.x, this.y); // sets scale and origin

        const lives = game.getLives();
        for (let i = 0; i < lives; i++) {
            this.context.drawImage(
                this.image,
                (this.image.width * i) - this.image.width / 2.0,
                -this.image.height / 2.0,
            );
        }
    };

    setText = (text) => {
        this.text = text;
    }
}
