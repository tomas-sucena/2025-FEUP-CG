import { MyEllipsoid } from './MyEllipsoid.js';

/**
 * A sphere.
 */
export class MySphere extends MyEllipsoid {
    /**
     * Initializes the sphere.
     * @param { Object } config - the sphere configuration
     * @param { CGFscene } scene - the scene the sphere will be displayed in
     * @param { number } radius - the radius of the sphere
     * @param { number } config.slices - the number of divisions around the Y-axis
     * @param { number } config.stacks - the number of divisions along the Y-axis
     * @param { boolean } config.inverted - indicates if the sphere should be inverted
     * @param { Object } config.material - the material to be applied to the sphere
     * @param { string } config.texture - the texture to be applied to the sphere
     */
    constructor({
        scene,
        radius = 1,
        slices,
        stacks,
        inverted,
        material,
        texture,
    }) {
        super({
            scene,
            width: 2 * radius,
            height: 2 * radius,
            depth: 2 * radius,
            slices,
            stacks,
            inverted,
            material,
            texture,
        });
    }
}
