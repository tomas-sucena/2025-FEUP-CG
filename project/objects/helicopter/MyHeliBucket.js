import { MyCylinder } from '../solids/MyCylinder.js';
import { MyCircle } from '../shapes/MyCircle.js';
import { MyObject } from '../MyObject.js';

export class MyHeliBucket extends MyObject {
    constructor({ scene, radius, height, color, textures }) {
        super(scene);

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

        /** Indicates if the bucket has water */
        this.hasWater = false;

        /** The bottom of the bucket */
        this.bottom = new MyCircle({
            scene,
            radius: this.body.bottomRadius,
            slices: 32,
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
            radius: 0.8 * radius,
            slices: 32,
            material: {
                ambient: [0, 0, 1, 1],
                diffuse: [0, 0, 1, 1],
                specular: [0.5, 0.5, 0.5, 1],
            },
            texture: textures.water,
        });
    }

    /**
     * Returns the bucket's biggest radius, which is its top radius.
     */
    get radius() {
        return this.body.topRadius;
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
            .display()
            .rotate(-Math.PI / 2, 1, 0, 0)
            .display();

        // display the water
        if (this.hasWater) {
            this.water
                .translate(0, 0, -3)
                .rotate(Math.PI / 2, 1, 0, 0)
                .display();
        }
    }
}
