import { MyCylinder } from './MyCylinder.js';

/**
 * A cone.
 */
export class MyCone extends MyCylinder {
    /**
     * Initializes the cone.
     * @param { Object } config the cone configuration
     * @param { CGFscene } config.scene the scene the object will be displayed in
     * @param { number } config.radius the radius of the base of the cone
     * @param { number } config.height the height of the cone
     * @param { number } config.slices the number of divisions of the cone around the Y-axis
     * @param { number } config.stacks the number of divisions of the cone along the Y-axis
     * @param { boolean } config.inverted indicates if the object should be inverted
     * @param { Object } config.material the material to be applied to the cone
     * @param { string | Object } config.texture the texture to be applied to the cone
     */
    constructor({
        scene,
        radius,
        height,
        slices,
        stacks,
        inverted,
        material,
        texture,
    }) {
        super({
            scene,
            topRadius: 0,
            bottomRadius: radius,
            height,
            slices,
            stacks,
            inverted,
            material,
            texture,
        });
    }
}
