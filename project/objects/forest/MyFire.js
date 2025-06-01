import { MyPyramid } from '../solids/MyPyramid.js';
import { MyFireAnimations } from '../../animations/MyFireAnimations.js';

export class MyFire extends MyPyramid {
    constructor({ scene, radius, height }) {
        super({ scene, radius, height, slices: 4, shader: 'fire' });

        /** The scale with which the flame will be displayed */
        this.flameScale = 1;
        /** The animation the fire is performing */
        this.animation = 'idle';

        this.shader.setUniformsValues({ height });
    }

    /**
     * Indicates if the fire is active
     * @returns 'true' if the fire is active, 'false' if it been put out
     */
    isActive() {
        return this.flameScale > 0;
    }

    /**
     * Updates the fire.
     * @param {number} time - the elapsed time
     */
    update(time) {
        MyFireAnimations[this.animation].call(this, time);
    }

    /**
     * Displays the fire.
     */
    display() {
        if (this.flameScale > 0) {
            this.scale(this.flameScale, this.flameScale, this.flameScale);
            super.display();
        }
    }
}
