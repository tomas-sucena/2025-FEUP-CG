import { MyObject } from '../MyObject.js';
import { MyHeliLandingGear } from './MyHeliLandingGear.js';
import { MyHeliRotor } from './MyHeliRotor.js';
import { MyHeliTail } from './MyHeliTail.js';
import { MyHeliCockpit } from './MyHeliCockpit.js';
import { MyHeliBucket } from './MyHeliBucket.js';

/**
 * A helicopter.
 */
export class MyHeli extends MyObject {
    static MAX_BLADE_SPEED = Math.PI / 5;

    constructor({
        scene,
        color,
        position = [0, 0, 0],
        velocity = [0, 0, 0],
        yaw = 0,
        textures,
    }) {
        super(scene);
        this.initComponents(color, textures);

        /** The helicopter's position */
        this.position = position;

        /** The helicopter's velocity */
        this.velocity = velocity;

        /** The helicopter's aerodynamic angles */
        this.angles = {
            yaw, // around the Y-axis
            pitch: 0, // around the Z-axis
        };

        /** The helicopter's blades */
        this.blades = {
            angle: 0,
            speed: 0,
        };

        /** The action the helicopter is performing */
        this.action = 'stationary';

        /** The helicopter's initial parameters */
        this.initialParams = {
            position: [...position],
            velocity: [...velocity],
            yaw,
        };
    }

    /**
     * Initializes the helicopter's components.
     */
    initComponents(color, textures) {
        const material = {
            ambient: color,
            diffuse: color,
            specular: [1, 1, 1, 1],
        };

        /** The helicopter's tail */
        this.tail = new MyHeliTail({
            scene: this.scene,
            width: 4,
            radius: 1,
            material,
            textures,
        });

        /** The helicopter's landing gear */
        this.landingGear = new MyHeliLandingGear({
            scene: this.scene,
            width: 5,
            height: 2.3,
            depth: 5,
            angle: Math.PI / 6,
            textures,
        });

        this.rotor = new MyHeliRotor({
            scene: this.scene,
            gearHeight: 0.4,
            gearRadius: 0.5,
            bladeLength: 4,
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

        /** The helicopter's bucket */
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

    /**
     * Changes the helicopter's velocity, updating its yaw as well.
     * @param {number} value - the value by which the velocity will be altered
     * @param {boolean} vertical - indicates if the velocity will change in the Y-axis
     */
    accelerate(value, vertical = false) {
        if (!vertical) {
            this.angles.pitch = (-Math.PI / 18) * Math.sign(value);
        }
        
        // update the velocity
        this.velocity[0] += value * Math.cos(this.angles.yaw) * !vertical;
        this.velocity[1] += value * vertical;
        this.velocity[2] += value * Math.sin(-this.angles.yaw) * !vertical;
    }

    /**
     * Turns the helicopter, updating its yaw and velocity.
     * @param {number} delta_yaw - the angle by which to update the yaw
     */
    turn(delta_yaw) {
        this.angles.yaw += delta_yaw;

        // update the velocity
        const horizontalSpeed = Math.hypot(this.velocity[0], this.velocity[2]);
        this.velocity[0] = horizontalSpeed * Math.cos(this.angles.yaw);
        this.velocity[2] = horizontalSpeed * Math.sin(-this.angles.yaw);
    }

    /**
     * Resets the helicopter, settings its values to its initial parameters.
     */
    reset() {
        this.action = 'stationary';

        // fetch the initial parameters
        const { position, velocity, yaw } = this.initialParams;

        // update the values
        vec3.copy(this.position, position);
        vec3.copy(this.velocity, velocity);
        this.angles.yaw = yaw;

        // reset the blade speed
        this.blades.speed = 0;
    }

    /**
     * Remains stationary on top of the firefighter's building.
     */
    stationary() {
        if (this.scene.pressedKeys.has('KeyP')) {
            this.action = 'startEngine';
        }
    }

    /**
     * Starts the engine, increasing the blade rotation speed.
     */
    startEngine() {
        this.blades.speed = Math.min(
            this.blades.speed + 0.02,
            MyHeli.MAX_BLADE_SPEED,
        );

        if (this.blades.speed == MyHeli.MAX_BLADE_SPEED) {
            this.action = 'rise';
        }
    }

    rise() {
        // verify if the helicopter has reached the cruise height
        const cruiseHeight = this.scene.building.height + this.bucket.height;
        const y = this.position[1];

        console.log('cruise')

        if (y < cruiseHeight) {
            this.accelerate(0.05, true);
        }
        else {
            this.velocity[1] = 0;
            this.action = 'fly';
        }
    }

    /**
     * Flies horizontally controlled by user input.
     */
    fly() {
        const { pressedKeys } = this.scene;
        this.angles.pitch = 0;

        // reset the helicopter
        if (pressedKeys.has('KeyR')) {
            this.reset();
            return;
        }

        // fly forward
        if (pressedKeys.has('KeyW') || pressedKeys.has('ArrowUp')) {
            this.accelerate(0.05);
        }

        // fly backward
        if (pressedKeys.has('KeyS') || pressedKeys.has('ArrowDown')) {
            this.accelerate(-0.05);
        }

        // rotate left
        if (pressedKeys.has('KeyA') || pressedKeys.has('ArrowLeft')) {
            this.turn(Math.PI / 80);
        }

        // rotate right
        if (pressedKeys.has('KeyD') || pressedKeys.has('ArrowRight')) {
            this.turn(-Math.PI / 80);
        }
    }

    /**
     * Updates the helicopter.
     */
    update(elapsedTime) {
        // execute the current action
        this[this.action](elapsedTime);

        // update the position
        vec3.add(this.position, this.position, this.velocity);

        // update the blade velocity
        this.blades.angle += this.blades.speed;
    }

    /**
     * Displays the helicopter's geometry.
     */
    render() {
        this.landingGear.display();
        this.rotor
            .rotate(this.blades.angle, 0, 1, 0)
            .translate(0, this.tail.height * 1.95, 0)
            .display();
        this.tail.translate(-2.7, this.tail.height, 0).display();

        this.cockpit
            .translate(-2.3, this.tail.height, 0)
            .rotate(Math.PI, 0, 1, 0)
            .display();

        this.bucket
            .translate(0, -this.bucket.height + this.landingGear.height, 0)
            .display();
    }

    /**
     * Displays the helicopter.
     */
    display() {
        // rotate and position the helicopter
        this.rotate(this.angles.pitch, 0, 0, 1)
            .rotate(this.angles.yaw, 0, 1, 0)
            .translate(...this.position);

        super.display();
    }
}
