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
            inverted: !config.inverted,
        });

        // configure the sphere material
        this.sphere.material.setAmbient(0, 0, 0, 0);
        this.sphere.material.setDiffuse(0, 0, 0, 0);
        this.sphere.material.setSpecular(0, 0, 0, 0);
        this.sphere.material.setEmission(1, 1, 1, 1);

        /** The coordinates of the center of the panorama */
        this.position = config?.position ?? [0, 0, 0];
        /** The scale that will be applied to the box */
        this.scaleFactor = config?.scaleFactor ?? 1;
    }

    render() {
        this.sphere
            .scale(this.scaleFactor, this.scaleFactor, this.scaleFactor)
            .translate(...this.position)
            .display();
    }
}
