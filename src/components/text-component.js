import Component from './component';

export default class TextComponent extends Component {
    constructor(properties) {
        const { color, fontFamily, size, text, ...rest } = properties;
        super(rest);

        this.fontFamily = fontFamily;
        this.text = text;
    }

    setText = (text) => {
        this.text = text;
    }

    update = () => {
        this.context.fillStyle = this.color;
        this.context.font = `${this.size} ${this.fontFamily}`;
        this.context.fillText(this.text, this.x, this.y);
    }
}
