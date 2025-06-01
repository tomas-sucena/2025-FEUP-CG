import { MyObject } from './MyObject.js';
import { MySphere } from './solids/MySphere.js';

/**
 * A 360° scenic view.
 */
export class MyPanorama extends MyObject {
    /**
     * Initializes the panorama.
     * @param { MyScene } scene the scene the object will be displayed in
     * @param { Object } config the object configuration
     */
    constructor({ scene, scaleFactor, position, texture }) {
        super(scene);

        /** The sphere that constitutes the panorama */
        this.sphere = new MySphere({
            scene,
            radius: scaleFactor,
            slices: 50,
            stacks: 25,
            inverted: true,
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
    }

    /**
     * Displays the object's geometry.
     */
    render() {
        this.sphere.translate(...this.position).display();
    }
}
