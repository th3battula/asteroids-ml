import Component from './component';

export default class TextComponent extends Component {
    constructor(properties) {
        const {
            color,
            fontFamily,
            fontSize,
            text,
            ...rest
        } = properties;
        super(rest);

        this.fontFamily = fontFamily;
        this.text = text;
        this.type = 'text';
        this.startUpdate();
    }

    render = () => {
        this.context.font = `${this.fontSize} ${this.fontFamily}`;
        this.context.fillText(this.text, this.x, this.y);
    };

    setText = (text) => {
        this.text = text;
    }
}
