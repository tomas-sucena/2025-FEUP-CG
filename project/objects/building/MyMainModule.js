import { MyCircle } from '../shapes/MyCircle.js';
import { MyRectangle } from '../shapes/MyRectangle.js';
import { MyModule } from './MyModule.js';

/**
 * The main module of a building.
 * @extends MyModule
 */
export class MyMainModule extends MyModule {
    /**
     * Initializes the main module.
     * @param { Object } config - the main module configuration
     * @param { CGFscene } config.scene - the scene the main module will be displayed in
     * @param { number } config.width - the width of the main module
     * @param { number } config.height - the height of the main module
     * @param { number } config.depth - the depth of the main module
     * @param { number } config.floors - the number of floors of the main module
     * @param { number } config.windows - the number of windows per floor of the main module
     * @param { Object } config.material - the material to be applied to the main module
     * @param { Object } config.textures - the textures to be applied to the main module
     */
    constructor({
        scene,
        width,
        height,
        depth,
        floors,
        windows,
        material,
        textures,
    }) {
        super({
            scene,
            width,
            height,
            depth,
            floors,
            windows,
            material,
            textures,
        });

        /** Indicates that this is a main module */
        this.isMainModule = true;

        /** The module's door */
        this.door = new MyRectangle({
            scene,
            width: 0.8 * (this.width / this.windows),
            height: 0.85 * (this.height / this.floors),
            rows: 3,
            columns: 3,
            texture: textures.door,
            material: {
                diffuse: [1, 1, 1, 1],
            },
        });

        /** The module's helipad */
        this.helipad = new MyCircle({
            scene,
            radius: 0.4 * this.depth,
            texture: textures.helipad,
            material: {
                ambient: [1, 1, 1, 1],
                diffuse: [1, 1, 1, 1],
                specular: [0.5, 0.5, 0.5, 1],
            },
        });

        /** The module's sign */
        this.sign = new MyRectangle({
            scene,
            width: this.door.width,
            height: 0.3 * this.door.height,
            rows: 2,
            columns: 2,
            texture: textures.sign,
            material: {
                ambient: [1, 1, 1, 1],
                diffuse: [1, 1, 1, 1],
            },
        });

        this.children.push(this.door, this.helipad, this.sign);
    }

    /**
     * Displays the main module's geometry.
     */
    render() {
        super.render();

        // display the door
        const halfDepth = this.depth / 2 + 0.05; // NOTE: the small offset avoids overlapping
        this.door.translate(0, this.door.height / 2, halfDepth).display();

        // display the sign
        this.sign
            .translate(
                0,
                this.door.height + this.sign.height / 2 + 0.05,
                halfDepth,
            )
            .display();

        // display the helipad
        this.helipad
            .rotate(-Math.PI / 2, 1, 0, 0)
            .translate(0, this.height + 0.05, 0)
            .display();
    }
}
