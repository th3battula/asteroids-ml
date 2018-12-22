import Component from './component';

export default class TextComponent extends Component {
    constructor(properties) {
        const { fontFamily, ...rest } = properties;
        super(rest);

        this.fontFamily = fontFamily;
    }

    update = () => {
        this.context.fillStyle = this.color;
        this.context.font = `${this.width} ${this.height}`;
        this.context.fillText(this.text, this.x, this.y);
    }
}
