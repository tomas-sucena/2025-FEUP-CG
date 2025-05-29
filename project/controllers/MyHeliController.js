export class MyHeliController {
    /**
     * A helicopter controller.
     * @param { Object } params - the controller parameters
     * @param { CGFscene } params.scene - the scene controller will be used in
     */
    constructor({ scene, helicopter }) {
        /** A hash set containing the keys that are being pressed */
        this.scene = scene;
        /** The helicopter to be controlled */
        this.helicopter = helicopter;
        /** The helicopter's cruise height */
        this.cruiseHeight = scene.building.height + helicopter.bucket.height;
        /** The initial helicopter parameters */
        this.initialParams = {
            yaw: helicopter.yaw,
            position: [...helicopter.position],
            velocity: [...helicopter.velocity],
        };
        /** The current action the helicopter is performing */
        this.state = 'STATIONARY';
        this.target = null;
    }

    /**
     * Resets the helicopter to its initial configuration.
     */
    reset() {
        this.helicopter.yaw = this.initialParams.yaw;
        vec3.copy(this.helicopter.position, this.initialParams.position);
        vec3.copy(this.helicopter.velocity, this.initialParams.velocity);
        this.state = 'STATIONARY';
    }

    stationary() {
        if (this.scene.pressedKeys.has('KeyP')) {
            this.target = [
                this.initialParams.position[0],
                this.cruiseHeight,
                this.initialParams.position[2],
            ];
            this.state = 'FOLLOWING';
        }
    }

    follow() {
        vec3.copy(this.helicopter.position, this.target);
        this.state = 'FLY';
    }

    fly() {
        const { pressedKeys } = this.scene;

        // reset the helicopter
        if (pressedKeys.has('KeyA') || pressedKeys.has('ArrowLeft')) {
            this.helicopter.turn(Math.PI / 80);
        }

        if (pressedKeys.has('KeyD') || pressedKeys.has('ArrowRight')) {
            this.helicopter.turn(-Math.PI / 80);
        }

        if (pressedKeys.has('KeyW') || pressedKeys.has('ArrowUp')) {
            this.helicopter.accelerate(0.01);
        }

        if (pressedKeys.has('KeyS') || pressedKeys.has('ArrowDown')) {
            this.helicopter.accelerate(-0.01);
        }
    }

    control() {
        if (this.scene.pressedKeys.has('KeyR')) {
            this.reset();
            return;
        }

        switch (this.state) {
            case 'STATIONARY':
                this.stationary();
                break;

            case 'FOLLOWING':
                this.follow();
                break;

            case 'FLY':
                this.fly();
                break;
        }
    }
}
