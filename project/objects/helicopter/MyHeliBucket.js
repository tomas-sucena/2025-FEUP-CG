import { MyCylinder } from '../solids/MyCylinder.js';
import { MyCircle } from '../shapes/MyCircle.js';
import { MyObject } from '../MyObject.js';
import { MyHeliBucketAnimations } from '../../animations/MyHeliBucketAnimations.js';

/**
 * Linearly interpolates between two values.
 * @param {number} x - the start value
 * @param {number} y - the end value
 * @param {number} a - the interpolation factor (between 0 and 1)
 * @returns {number} the interpolated value
 */
const lerp = (x, y, a) => x * (1 - a) + y * a;

/**
 * The helicopter's bucket.
 */
export class MyHeliBucket extends MyObject {
    constructor({ scene, radius, height, color, textures }) {
        super(scene);

        /** Indicates the amount (from 0 to 1) of water the bucket has */
        this.waterAmount = 0;

        /** The angle of the bottom of the bucket around the Z-axis */
        this.bottomAngle = 0;

        /** The animation the bucket is performing */
        this.animation = 'idle';

        /** The bucket's body */
        this.body = new MyCylinder({
            scene,
            topRadius: radius,
            bottomRadius: 0.8 * radius,
            height,
            material: {
                ambient: color,
                diffuse: color,
                specular: [1, 1, 1, 1],
            },
            texture: textures.bucket,
        });

        /** The bottom of the bucket */
        this.bottom = new MyCircle({
            scene,
            radius: this.body.bottomRadius,
            material: {
                ambient: color,
                diffuse: color,
                specular: [0.5, 0.5, 0.5, 1],
            },
            texture: textures.bucket,
        });

        /** The water carried by the bucket */
        this.water = new MyCircle({
            scene,
            material: {
                ambient: [1, 1, 1, 1],
                diffuse: [1, 1, 1, 1],
                specular: [1, 1, 1, 1],
            },
            texture: textures.water,
        });
    }

    /**
     * Returns the bucket's top radius.
     */
    get topRadius() {
        return this.body.topRadius;
    }

    /**
     * Returns the bucket's bottom radius.
     */
    get bottomRadius() {
        return this.body.bottomRadius;
    }

    /**
     * Returns the bucket's height.
     */
    get height() {
        return this.body.height;
    }

    /**
     * Indicates if the bucket has water.
     * @returns 'true' if the bucket has water, 'false' otherwise
     */
    hasWater() {
        return this.waterAmount > 0;
    }

    update() {
        MyHeliBucketAnimations[this.animation].call(this);
    }

    /**
     * Fills the bucket with water.
     */
    fill() {
        this.waterAmount = 0.8;
    }

    /**
     * Displays the bucket's geometry.
     */
    render() {
        // display the bucket body
        this.body.display().scale(-1, 1, 1).display();

        // display the bucket bottom
        this.bottom
            .rotate(Math.PI / 2, 1, 0, 0)
            .rotate(this.bottomAngle, 0, 0, 1)
            .display()
            .rotate(-Math.PI / 2, 1, 0, 0)
            .rotate(this.bottomAngle, 0, 0, 1)
            .display();

        // display the water
        if (this.hasWater()) {
            const waterY = this.height * this.waterAmount;
            const waterRadius = lerp(
                this.bottomRadius,
                this.topRadius,
                this.waterAmount,
            );

            this.water
                .rotate(-Math.PI / 2, 1, 0, 0)
                .scale(waterRadius, 1, waterRadius)
                .translate(0, waterY, 0)
                .display();
        }
    }
}
