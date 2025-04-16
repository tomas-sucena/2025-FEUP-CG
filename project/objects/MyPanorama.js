import { MyObject } from './MyObject.js';
import { MySphere } from './solids/MySphere.js';

/**
 * A 360° scenic view.
 */
export class MyPanorama extends MyObject {
    /**
     * Initializes the panorama.
     * @param { MyScene } scene a reference to the MyScene object
     * @param { Object } config the object configuration
     */
    constructor(scene, config) {
        super(scene, config);
        const { inverted, position, scaleFactor, texture } = config ?? {};

        /** The sphere that constitutes the panorama */
        this.sphere = new MySphere(scene, {
            slices: 50,
            stacks: 25,
            inverted: !inverted,
            material: {
                ambient: [0, 0, 0, 1],
                diffuse: [0, 0, 0, 1],
                specular: [0, 0, 0, 1],
                emission: [1, 1, 1, 1],
            },
            texture: texture,
        });

        /** The coordinates of the center of the panorama */
        this.position = position ?? [0, 0, 0];
        /** The scale that will be applied to the box */
        this.scaleFactor = typeof scaleFactor === 'number' ? scaleFactor : 1;
    }

    render() {
        this.sphere
            .scale(this.scaleFactor, this.scaleFactor, this.scaleFactor)
            .translate(...this.position)
            .display();
    }
}
