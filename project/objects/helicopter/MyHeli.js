import { MyObject } from '../MyObject.js';
import { MyHeliLandingGear } from './MyHeliLandingGear.js';
import { MyHeliRotor } from './MyHeliRotor.js';
import { MyHeliTail } from './MyHeliTail.js';
import { MyHeliCockpit } from './MyHeliCockpit.js';
import { MyHeliBucket } from './MyHeliBucket.js';
import { MyHeliRope } from './MyHeliRope.js';
import { MyHeliAnimations } from '../../animations/MyHeliAnimations.js';
import { MyCylinder } from '../solids/MyCylinder.js';

/**
 * A helicopter.
 */
export class MyHeli extends MyObject {
    static MAX_SPEED = 4;
    static MAX_BLADE_SPEED = Math.PI / 5;
    static DEFAULT_ACCELERATION = 0.05;
    static DEFAULT_TURN_SPEED = Math.PI / 70;

    constructor({
        scene,
        position = [0, 0, 0],
        velocity = [0, 0, 0],
        yaw = 0,
        colors,
        textures,
    }) {
        super(scene);
        this.initComponents(colors, textures);

        /** The helicopter's position */
        this.position = position;
        /** The helicopter's velocity (vector) */
        this.velocity = velocity;
        /** The helicopter's acceleration */
        this.acceleration = MyHeli.DEFAULT_ACCELERATION;
        /** The helicopter's turn speed */
        this.turnSpeed = MyHeli.DEFAULT_TURN_SPEED;

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

        /** The helicopter's initial parameters */
        this.initialParams = {
            position: [...position],
            velocity: [...velocity],
            yaw,
        };

        /** The scale with which the bucket is displayed */
        this.bucketScale = 0;

        /** The scale with which the water gush is displayed */
        this.gushScale = 0;
        /** The Y-coordinate of the water gush */
        this.gushY = 0;

        /** The action the helicopter is performing */
        this.animation = 'stationary';
    }

    /**
     * Initializes the helicopter's components.
     * @param { Object } colors - the colors of the helicopter
     * @param { textures } textures - the textures to be applied to the helicopter
     */
    initComponents(colors, textures) {
        const coatMaterial = {
            ambient: colors.coat,
            diffuse: colors.coat,
            specular: [0.7, 0.7, 0.7, 1],
        };

        const metalMaterial = {
            ambient: colors.metal,
            diffuse: colors.metal,
            specular: [0.8, 0.8, 0.8, 1],
        };

        /** The helicopter's tail */
        this.tail = new MyHeliTail({
            scene: this.scene,
            width: 4,
            radius: 1,
            materials: {
                coat: coatMaterial,
                metal: metalMaterial,
            },
            textures,
        });

        /** The helicopter's landing gear */
        this.landingGear = new MyHeliLandingGear({
            scene: this.scene,
            width: 5,
            height: 2.3,
            depth: 5,
            angle: Math.PI / 6,
            material: metalMaterial,
            textures,
        });

        /** The helicopter's main rotor */
        this.rotor = new MyHeliRotor({
            scene: this.scene,
            gearHeight: 0.4,
            gearRadius: 0.5,
            bladeLength: 4,
            numBlades: 4,
            material: metalMaterial,
            textures,
        });

        /** The helicopter's cockpit */
        this.cockpit = new MyHeliCockpit({
            scene: this.scene,
            height: 2.5,
            width: 1.8,
            glassColor: [0.8, 0.85, 0.9, 0.4],
            material: coatMaterial,
            textures,
        });

        /** The helicopter's bucket */
        this.bucket = new MyHeliBucket({
            scene: this.scene,
            radius: 3,
            height: 5,
            color: colors.bucket,
            textures,
        });

        /** The rope that connects the bucket to the helicopter */
        this.rope = new MyHeliRope({
            scene: this.scene,
            radius: 0.07,
            length: 20,
            color: colors.rope,
        });

        /** The water gush that will be dropped from the bucket */
        this.waterGush = new MyCylinder({
            scene: this.scene,
            radius: this.bucket.bottomRadius,
            material: {
                ambient: [1, 1, 1, 1],
                diffuse: [1, 1, 1, 1],
                specular: [1, 1, 1, 1],
            },
            texture: textures.gush,
        });

        /** The rotors of the helicopter */
        this.rotors = [this.rotor, this.tail.rotor];

        /** The child objects */
        this.children = [
            this.tail,
            this.landingGear,
            this.rotor,
            this.cockpit,
            this.bucket,
            this.rope,
            this.waterGush,
        ];
    }

    /**
     * Returns an approximation of the helicopter's current speed factor.
     */
    get speedFactor() {
        return this.acceleration / MyHeli.DEFAULT_ACCELERATION;
    }

    /**
     * Updates the helicopter's speed factor, which in turn changes its acceleration and turn speed.
     */
    set speedFactor(speedFactor) {
        this.acceleration = MyHeli.DEFAULT_ACCELERATION * speedFactor;
        this.turnSpeed = MyHeli.DEFAULT_TURN_SPEED * speedFactor;
    }

    /**
     * Changes the helicopter's velocity, updating its yaw as well.
     * @param {number} value - the value by which the velocity will be altered
     */
    accelerate(value) {
        this.angles.pitch = (-Math.PI / 18) * Math.sign(value);

        // update the velocity
        this.velocity[0] += value * Math.cos(this.angles.yaw);
        this.velocity[2] += value * Math.sin(-this.angles.yaw);
    }

    /**
     * Changes the helicopter's vertical velocity.
     * @param {number} value - the value by which the velocity will be altered
     */
    rise(value) {
        this.velocity[1] += value;
    }

    /**
     * Turns the helicopter, updating its yaw and velocity.
     * @param {number} angle - the angle by which to update the yaw
     */
    turn(angle) {
        this.angles.yaw += angle;

        // update the velocity
        const horizontalSpeed = Math.hypot(this.velocity[0], this.velocity[2]);
        this.velocity[0] = horizontalSpeed * Math.cos(this.angles.yaw);
        this.velocity[2] = horizontalSpeed * Math.sin(-this.angles.yaw);
    }

    /**
     * Stops the helicopter by settings its velocity to zero.
     */
    stop() {
        vec3.set(this.velocity, 0, 0, 0);
        this.angles.pitch = 0;
    }

    /**
     * Resets the helicopter, settings its values to its initial parameters.
     */
    reset() {
        this.animation = 'stationary';

        // fetch the initial parameters
        const { position, velocity, yaw } = this.initialParams;

        // reset the vectors
        vec3.copy(this.position, position);
        vec3.copy(this.velocity, velocity);

        // reset the aerodynamic angles
        this.angles.yaw = yaw;
        this.angles.pitch = 0;

        // reset the blade speed
        this.blades.speed = 0;

        // reset the bucket
        this.bucketScale = 0;

        // reset the water gush
        this.gushScale = this.gushY = 0;
    }

    /**
     * Updates the helicopter.
     */
    update(elapsedTime) {
        // reset the helicopter
        if (this.scene.pressedKeys.has('KeyR')) {
            this.reset();
            return;
        }

        // execute the current action
        MyHeliAnimations[this.animation].call(this, elapsedTime);

        // update the position
        vec3.add(this.position, this.position, this.velocity);

        // update the blade velocity
        this.blades.angle += this.blades.speed;

        // update the bucket
        this.bucket.update();
    }

    /**
     * Determines if the helicopter has water and is above any burning trees.
     * @returns 'true' if the helicopter has water and is above any burning trees, 'false' otherwise
     */
    canPutOutFires() {
        // ensure the helicopter has water
        if (!this.bucket.hasWater()) {
            return false;
        }

        // determine the burning trees below the helicopter
        const burningTrees = this.scene.forests.flatMap((forest) =>
            [...forest.burningTrees].filter((tree) => tree.isBelow(this)),
        );

        if (burningTrees.length === 0) {
            return false;
        }

        this.burningTrees = burningTrees;
        return true;
    }

    /**
     * Displays the helicopter's geometry.
     */
    render() {
        // rotate the rotors
        this.rotors.forEach((rotor) =>
            rotor.rotate(this.blades.angle, 0, 1, 0),
        );

        // display the landing gear
        this.landingGear.rotate(this.angles.pitch, 0, 0, 1).display();

        // display the main rotor
        this.rotor
            .translate(0, this.tail.height * 1.95, 0)
            .rotate(this.angles.pitch, 0, 0, 1)
            .display();

        // display the tail
        this.tail
            .translate(-2.7, this.tail.height, 0)
            .rotate(this.angles.pitch, 0, 0, 1)
            .display();

        // display the cockpit
        this.cockpit
            .translate(-2.3, this.tail.height, 0)
            .rotate(Math.PI, 0, 1, 0)
            .rotate(this.angles.pitch, 0, 0, 1)
            .display();

        const ropeLenght = this.rope.length * this.bucketScale;
        const bucketY = -ropeLenght + this.landingGear.height;

        if (this.bucketScale > 0) {
            // display the bucket
            this.bucket
                .scale(this.bucketScale, this.bucketScale, this.bucketScale)
                .translate(0, bucketY, 0)
                .display();

            // display the rope
            this.rope
                .scale(this.bucketScale, this.bucketScale, this.bucketScale)
                .translate(0, bucketY, 0)
                .display();
        }

        if (this.gushScale > 0) {
            // display the water gush
            this.waterGush
                .scale(1, this.gushScale, 1)
                .translate(0, bucketY - this.gushScale - this.gushY, 0)
                .display();
        }
    }

    /**
     * Displays the helicopter.
     */
    display() {
        // rotate and position the helicopter
        this.rotate(this.angles.yaw, 0, 1, 0).translate(...this.position);

        super.display();
    }
}
