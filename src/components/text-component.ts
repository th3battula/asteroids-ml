import Component from './component';
import { ComponentTypes } from '../constants/game-constants';

export default class TextComponent extends Component {
    constructor(properties) {
        const {
            color,
            fontFamily,
            fontSize,
            text,
            textAlign = 'center',
            ...rest
        } = properties;
        super(rest);

        this.color = color;
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.text = text;
        this.textAlign = textAlign;
        this.type = ComponentTypes.TEXT;
        this.startUpdate();
    }

    render = () => {
        this.context.setTransform(1, 0, 0, 1, this.x, this.y);
        this.context.textAlign = this.textAlign;
        this.context.fillStyle = this.color;
        this.context.font = `${this.fontSize} ${this.fontFamily}`;
        this.context.fillText(this.text, this.x, this.y);
    };

    setText = (text) => {
        this.text = text;
    }
}
