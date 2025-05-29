import { MyObject } from '../MyObject.js';
import { MyCylinder } from '../solids/MyCylinder.js';
import { MyCircle } from '../shapes/MyCircle.js';
import { MyHeliRope } from './MyHeliRope.js';

export class MyHeliBucket extends MyObject {
    constructor({
        scene,
        height = 2,
        width = 1.5,
        color = [0.3, 0.2, 0.1, 1],
        textures,
    }) {
        super(scene);

        this.bucketBody = new MyCylinder({
            scene,
            bottomRadius: width * 0.8,
            topRadius: width,
            height,
            material: {
                ambient: color,
                diffuse: color,
                specular: [0.5, 0.5, 0.5, 1],
            },
            texture: textures?.bucket,
        });

        this.bucketBottom = new MyCircle({
            scene,
            radius: this.bucketBody.bottomRadius,
            slices: 32,
            material: {
                ambient: color,
                diffuse: color,
                specular: [0.5, 0.5, 0.5, 1],
            },
            texture: textures?.bucketBottom,
        });

        this.water = new MyCircle({
            scene,
            radius: width * 0.7,
            slices: 32,
            material: {
                ambient: [0, 0, 1, 1],
                diffuse: [0, 0, 1, 1],
                specular: [0.5, 0.5, 0.5, 1],
            },
            inverted: true,
        });

        this.rope = new MyHeliRope({
            scene: this.scene,
            radius: 0.07,
            length: 20,
            segments: 40,
            colors: {
                rope: [0.35, 0.3, 0.25, 1],
                knot: [0.6, 0.5, 0.4, 1],
            },
        });
    }

    /**
     * Returns the width of the bucket.
     */
    get width() {
        return this.bucketBody.topRadius;
    }

    /**
     * Returns the height of the rope.
     */
    get height() {
        return this.rope.length;
    }

    /**
     * Displays the bucket's geometry.
     */
    render() {
        // display the bucket body
        this.bucketBody.display().scale(1, 1, -1).display();

        // display the bucket bottom
        this.bucketBottom
            .rotate(Math.PI / 2, 1, 0, 0)
            .display()
            .rotate(-Math.PI / 2, 1, 0, 0)
            .display();

        // display the rope
        this.rope.display();

        /*this.water
            .translate(0, 0, -3)
            .rotate(Math.PI / 2, 1, 0, 0)
            .display();*/
    }
}
