import { MyObject } from '../MyObject.js';
import { MyCylinder } from '../solids/MyCylinder.js';
import { MySphere } from '../solids/MySphere.js';

export class MyHeli extends MyObject {
    constructor({ scene, color, position, direction, velocity }) {
        super(scene);

        const material = {
            ambient: color,
            diffuse: color,
            specular: [0.5, 0.5, 0.5, 1],
        };

        /** The helicopter's position */
        this.position = position;

        /** The helicopter's velocity */
        this.velocity = velocity ?? [0, 0, 0];

        /** The angle of the helicopter around the Y-axis */
        this.direction = direction ?? 0;

        this.head = new MySphere({
            scene,
            slices: 16,
            stacks: 8,
            material,
        });

        this.tail = new MyCylinder({
            scene,
            topRadius: 0.1,
            bottomRadius: 0.3,
            height: 3,
            material,
        });
    }

    accelerate(value) {
        this.position[0] += value;
    }

    turn(value) {
        this.direction += value;

        // update the velocity
        // TODO
    }

    render() {
        const headHeight = 1.6 * this.head.radius;

        this.head
            .scale(1.5, 0.8, 1)
            .translate(0, headHeight / 2, 0)
            .display();

        this.tail
            .rotate(-Math.PI / 2, 0, 0, 1)
            .translate(0.5 * this.head.radius, 0.7 * headHeight, 0)
            .display();

        this.rotate(this.direction, 0, 1, 0).translate(...this.position);
    }
}
