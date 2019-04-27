import Component from './component';
import game from './game';

export default class Asteroid extends Component {
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

        this.asteroidImage = new Image();
        this.asteroidImage.src = '';
        this.color = color;
        this.lifetime = lifetime;
        this.scale = scale;
        this.startTime = Date.now();
        this.velocity = {
            x: speed * Math.sin(angle),
            y: speed * -Math.cos(angle),
        };

        this.size = size;
    }

    drawBullet = () => {
        this.context.setTransform(this.scale, 0, 0, this.scale, this.x, this.y); // sets scale and origin
        this.context.rotate(this.angle);
        this.context.drawImage(this.asteroidImage, -this.asteroidImage.width / 2, -this.asteroidImage.height / 2);
    }

    update = () => {
        if (Date.now() < (this.startTime + this.lifetime)) {
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
        } else {
            this.destroy();
        }
    }
}
