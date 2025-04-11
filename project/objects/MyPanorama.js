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

        /** The sphere that constitutes the panorama */
        this.sphere = new MySphere(scene, {
            slices: 50,
            stacks: 25,
            texture: config.texture,
            invert: !config.invert,
        });
        /** The coordinates where the panorama will be drawn */
        this.position = config.position;
        /** The scale that will be applied to the box */
        this.scaleFactor = config.scaleFactor;
    }

    render() {
        this.sphere
            .scale(this.scaleFactor, this.scaleFactor, this.scaleFactor)
            .translate(...this.position)
            .display();
    }
}
