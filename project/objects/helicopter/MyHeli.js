import { MyObject } from '../MyObject.js';
import { MySphere } from '../solids/MySphere.js';
import { MyHeliLandingGear } from './MyHeliLandingGear.js';
import { MyHeliRotor } from './MyHeliRotor.js';
import { MyHeliTail } from './MyHeliTail.js';
import { MyHeliCockpit } from './MyHeliCockpit.js';
import { MyHeliBucket } from './MyHeliBucket.js';

/**
 * A helicopter.
 */
export class MyHeli extends MyObject {
    constructor({ scene, color, position, yaw, velocity, textures }) {
        super(scene);

        const material = {
            ambient: color,
            diffuse: color,
            specular: [1, 1, 1, 1],
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

        /** The helicopter's tail */
        this.tail = new MyHeliTail({
            scene,
            width: 4,
            radius: 1,
            material,
            textures,
        });

        /** The helicopter's landing gear */
        this.landingGear = new MyHeliLandingGear({
            scene,
            width: 5,
            height: 2.3,
            depth: 5,
            angle: Math.PI / 6,
            textures,
        });

        this.rotor = new MyHeliRotor({
            scene,
            gearHeight: 0.4,
            gearRadius: 0.5,
            bladeLength: 2,
            numBlades: 4,
            textures,
        });

        this.cockpit = new MyHeliCockpit({
            scene: this.scene,
            height: 2.5,
            width: 1.8,
            glassColor: [0.8, 0.85, 0.9, 0.4],
            material,
            textures,
        });

        this.bucket = new MyHeliBucket({
            scene: this.scene,
            radius: 0.5,
            height: 2,
            material: {
                ambient: [0.2, 0.2, 0.2, 1],
                diffuse: [0.2, 0.2, 0.2, 1],
                specular: [0.5, 0.5, 0.5, 1],
                shininess: 50,
            },
            textures,
        });
    }

    accelerate(value, vertical = false) {
        // update the velocity
        this.velocity[0] += value * Math.cos(this.yaw) * !vertical;
        this.velocity[1] += value * vertical;
        this.velocity[2] += value * Math.sin(-this.yaw) * !vertical;
    }

    /**
     * Turns the helicopter, updating its yaw and velocity.
     * @param {number} delta_yaw - the angle by which to update the yaw
     */
    turn(delta_yaw) {
        this.yaw += delta_yaw;

        // update the velocity
        const horizontalSpeed = Math.hypot(this.velocity[0], this.velocity[2]);
        this.velocity[0] = horizontalSpeed * Math.cos(this.yaw);
        this.velocity[2] = horizontalSpeed * Math.sin(-this.yaw);
    }

    /**
     * Updates the helicopter.
     */
    update() {
        // update the position
        vec3.add(this.position, this.position, this.velocity);
    }

    /**
     * Displays the helicopter's geometry.
     */
    render() {
        /*const headHeight = 1.6 * this.head.radius;

        this.head
            .scale(2, 0.8, 1.5)
            .translate(0, headHeight / 2, 0)
            .display();*/

        this.landingGear.display();
        this.rotor.translate(0, this.tail.height * 1.95, 0).display();
        this.tail.translate(-2.7, this.tail.height, 0).display();

        this.cockpit
            .translate(-2.3, this.tail.height, 0)
            .rotate(Math.PI, 0, 1, 0)
            .display();

        this.bucket
            .translate(-4.9, this.tail.height * -2.5, 0)
            .rotate(Math.PI / 2, 0, 1, 0)
            .display();

        // rotate and position the helicopter
        this.rotate(this.yaw, 0, 1, 0).translate(...this.position);
    }
}
