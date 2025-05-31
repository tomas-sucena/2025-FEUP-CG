import { MyCylinder } from '../solids/MyCylinder.js';
import { MyCircle } from '../shapes/MyCircle.js';
import { MyObject } from '../MyObject.js';
import { MyHeliBucketAnimations } from '../../animations/MyHeliBucketAnimations.js';

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
                specular: [0.3, 0.3, 0.3, 1],
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
            radius,
            material: {
                ambient: [0, 0, 1, 1],
                diffuse: [0, 0, 1, 1],
                specular: [0.5, 0.5, 0.5, 1],
            },
            texture: textures?.water,
        });

        /** The gush of water that will be dropped from the bucket */
        this.waterGush = new MyCylinder({
            scene,
            topRadius: this.body.bottomRadius,
            bottomRadius: 1.2 * this.body.bottomRadius,
        });
    }

    /**
     * Returns the bucket's biggest radius, which is its top radius.
     */
    get radius() {
        return this.body.topRadius;
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
            .rotate(-this.bottomAngle, 0, 0, 1)
            .display();

        // display the water
        if (this.hasWater()) {
            this.water
                .rotate(-Math.PI / 2, 1, 0, 0)
                .translate(0, this.height * this.waterAmount, 0)
                .display();
        }

        if (this.dropWater) {
            this.waterGush.translate(0, -this.waterGush.height, 0).display();
        }
    }
}
