import { MyHeli } from '../objects/helicopter/MyHeli.js';

/**
 * The animations the helicopter can perform.
 */
export const MyHeliAnimations = {
    /**
     * Remains stationary on top of the firefighter's building.
     */
    stationary: function () {
        if (this.scene.pressedKeys.has('KeyP')) {
            this.animation = 'startEngine';
        }
    },
    /**
     * Starts the engine, increasing the blade rotation speed.
     */
    startEngine: function () {
        this.blades.speed = Math.min(
            this.blades.speed + 0.02,
            MyHeli.MAX_BLADE_SPEED,
        );

        if (this.blades.speed == MyHeli.MAX_BLADE_SPEED) {
            this.animation = 'ascend';
        }
    },
    /**
     * Ascends from the heliport until it reaches the cruise height.
     */
    ascend: function () {
        // verify if the helicopter has reached the cruise height
        const cruiseHeight = this.scene.building.height + this.rope.length;
        const y = this.position[1];

        if (y < cruiseHeight) {
            this.accelerate(0.05, true);
        } else {
            this.velocity[1] = 0;
            this.showBucket = true;
            this.animation = 'dropBucket';
        }
    },
    /**
     * Drops the bucket.
     */
    dropBucket: function () {
        if (this.bucketScale < 1) {
            this.bucketScale += 0.1;
        } else {
            this.bucketScale = 1;
            this.animation = 'fly';
        }
    },
    /**
     * Flies horizontally controlled by user input.
     */
    fly: function () {
        const pressedKeys = this.scene.pressedKeys;
        this.angles.pitch = 0;

        if (pressedKeys.has('KeyL')) {
            this.stop();

            // fill bucket
            if (this.scene.terrain.isAboveLake(this)) {
                this.animation = 'dive';
                return;
            }
            // move to heliport
            else if (!this.bucket.hasWater()) {
                this.animation = 'rotateToHeliport';
                return;
            }
        }

        // open the bucket
        if (pressedKeys.has('KeyO') && this.bucket.hasWater()) {
            this.animation = 'dropWater';
            this.bucket.animation = 'openBottom';
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
    },
    /**
     * Descends the helicopter until the bucket is entirely submerged in the lake.
     */
    dive: function () {
        const y = this.position[1] - this.rope.length / 2;

        if (y > 0) {
            this.accelerate(-0.05, true);
        } else {
            this.bucket.waterAmount = 1;
            this.animation = 'fillBucket';
            this.velocity[1] = 0;
        }
    },
    /**
     * Fills the helicopter's bucket with water.
     */
    fillBucket: function () {
        if (this.scene.pressedKeys.has('KeyP')) {
            this.animation = 'ascend';
        }
    },
    /**
     * Rotates until the helicopter is facing the heliport.
     */
    rotateToHeliport: function () {
        // compute the direction to the building
        const targetDir = [
            this.initialParams.position[0] - this.position[0],
            this.initialParams.position[2] - this.position[2],
        ];
        vec2.normalize(targetDir, targetDir);

        // compute the helicopter direction
        const currDir = [Math.cos(this.angles.yaw), Math.sin(-this.angles.yaw)];

        // compute the angle the helicopter needs to rotate to face the building
        const dot = vec2.dot(targetDir, currDir);
        const cross = targetDir[0] * currDir[1] - targetDir[1] * currDir[0];
        const angle = Math.atan2(cross, dot);

        // rotate the helicopter to face the building
        if (Math.abs(angle) < Math.PI / 80) {
            this.turn(angle);
            this.animation = 'flyToHeliport';
        } else {
            this.turn(Math.sign(angle) * (Math.PI / 80));
        }
    },
    /**
     * Flies the helicopter to the heliport.
     */
    flyToHeliport: function () {
        const targetPosition = [...this.initialParams.position];
        const position = [...this.position];
        targetPosition[1] = position[1]; // ignore the Y-axis

        // compute the distance between the helicopter and the building
        const distance = vec3.sqrDist(targetPosition, position);

        if (distance < 1) {
            this.stop();
            this.animation = 'fly';
        } else {
            this.accelerate(0.05);
        }
    },
    /**
     * Drops water on top of a fire.
     */
    dropWater: function () {
        // wait for the bucket to finish its animation
        if (this.bucket.animation === 'idle') {
            this.animation = 'fly';
        }
    },
};
