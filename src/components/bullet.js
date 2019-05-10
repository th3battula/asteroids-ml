import Component from './component';
import bulletSvg from '../assets/bullet.svg';
import game from './game';

export default class Bullet extends Component {
    constructor(properties) {
        const {
            angle = 0,
            color = 'white',
            lifetime = 2000,
            scale = 1,
            speed = 1,
            size = 1,
            ...rest
        } = properties;
        super(rest);

        this.bulletImage = new Image();
        this.bulletImage.src = bulletSvg;
        this.color = color;
        this.lifetime = lifetime;
        this.scale = scale;
        this.velocity = {
            x: speed * Math.sin(angle),
            y: speed * -Math.cos(angle),
        };

        this.size = size;
        this.startUpdate();
    }

    drawBullet = () => {
        this.context.setTransform(this.scale, 0, 0, this.scale, this.x, this.y); // sets scale and origin
        this.context.rotate(this.angle);
        this.context.drawImage(this.bulletImage, -this.bulletImage.width / 2, -this.bulletImage.height / 2);
    }

    update = () => {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        const { height, width } = game.getDimensions();
        if (this.x < 0) {
            this.x = width;
        } else if (this.x > width) {
            this.x = 0;
        }
        if (this.y < 0) {
            this.y = height;
        } else if (this.y > height) {
            this.y = 0;
        }
        this.drawBullet();

        if ((this.startTime + this.lifetime) > Date.now()) {
            this.destroy();
        }
    }
}
