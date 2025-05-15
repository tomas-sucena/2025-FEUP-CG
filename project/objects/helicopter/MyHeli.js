import { MyObject } from '../MyObject.js';
import { MyCylinder } from '../solids/MyCylinder.js';
import { MySphere } from '../solids/MySphere.js';
import { MyLandingGear } from './MyLandingGear.js';
import { MyRotor } from './MyRotor.js';

export class MyHeli extends MyObject {
    constructor({ scene, color, position, yaw, velocity }) {
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

        /** The helicopter's yaw angle (rotation around the Y-axis) */
        this.yaw = yaw ?? 0;

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

        /** The helicopter's landing gear */
        this.landingGear = new MyLandingGear({
            scene,
            width: 5,
            height: 2,
            depth: 5,
            angle: Math.PI / 6,
        });

        this.rotor = new MyRotor({
            scene,
            height: 0.4,
            radius: 0.5,
            blades: 4,
        });
    }

    accelerate(value, vertical = false) {
        // update the velocity
        this.velocity[0] += value * Math.cos(this.yaw) * !vertical;
        this.velocity[1] += value * vertical;
        this.velocity[2] += value * Math.sin(-this.yaw) * !vertical;
    }

    turn(value) {
        this.yaw += value;

        // update the velocity
        this.velocity[0] *= Math.cos(this.yaw);
        this.velocity[2] *= Math.sin(this.yaw);
    }

    render() {
        /*const headHeight = 1.6 * this.head.radius;

        this.head
            .scale(1.5, 0.8, 1)
            .translate(0, headHeight / 2, 0)
            .display();

        this.tail
            .rotate(Math.PI / 2, 0, 0, 1)
            .translate(0.5 * this.head.radius, 0.7 * headHeight, 0)
            .display();*/

        //this.landingGear.display();
        this.rotor.display();

        // update the position
        vec3.add(this.position, this.position, this.velocity);

        // rotate and position the helicopter
        this.rotate(this.yaw, 0, 1, 0).translate(...this.position);
    }
}
