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
        /** The initial helicopter parameters */
        this.initialParams = {
            yaw: helicopter.yaw,
            position: [...helicopter.position],
            velocity: [...helicopter.velocity],
        };
    }

    /**
     * Resets the helicopter to its initial configuration.
     */
    reset() {
        this.helicopter.yaw = this.initialParams.yaw;
        vec3.copy(this.helicopter.position, this.initialParams.position);
        vec3.copy(this.helicopter.velocity, this.initialParams.velocity);
    }

    control() {
        const { pressedKeys } = this.scene;

        // reset the helicopter
        if (pressedKeys.has('KeyR')) {
            this.reset();
            return;
        }

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
}
