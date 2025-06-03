import { MyObject } from '../MyObject.js';
import { MyMainModule } from './MyMainModule.js';
import { MyModule } from './MyModule.js';

/**
 * A building.
 * @extends MyObject
 */
export class MyBuilding extends MyObject {
    /**
     * Initializes the building.
     * @param { Object } config - the building configuration
     * @param { CGFscene } config.scene - the scene the building will be displayed in
     * @param { number } config.width - the dimension of the building along the X-axis
     * @param { number } config.height - the dimension of the building along the Y-axis
     * @param { number } config.depth - the dimension of the building along the Z-axis
     * @param { number } config.floors - the number of floors of the side modules
     * @param { number } config.windows - the number of windows per floor
     * @param { number[4] } config.color - the color of the building
     * @param { Object } config.textures - the textures to be applied to the building
     */
    constructor({
        scene,
        width,
        height,
        depth,
        floors,
        windows,
        color,
        textures,
    }) {
        super(scene);
        height ??= floors + 1;

        const material = {
            ambient: color,
            diffuse: color,
            specular: [0.1, 0.1, 0.1, 1],
        };

        /** The main module of the building **/
        this.mainModule = new MyMainModule({
            scene,
            width: 0.4 * width,
            height,
            depth,
            floors: floors + 1,
            windows,
            material,
            textures,
        });

        /** The side module of the building */
        this.sideModule = new MyModule({
            scene,
            width: 0.3 * width,
            height: (height * floors) / (floors + 1),
            floors,
            windows,
            material,
            textures,
        });

        /** The child objects */
        this.children = [this.mainModule, this.sideModule];
    }

    /**
     * Returns the height of the building.
     */
    get height() {
        return this.mainModule.height;
    }

    /*
     * Returns the depth of the building.
     */
    get depth() {
        return this.mainModule.depth;
    }

    /**
     * Displays the modules of the building.
     */
    render() {
        const mainModuleWidth = this.mainModule.width;
        const sideModuleWidth = this.sideModule.width;

        // display the main module
        this.mainModule.display();

        // display the right module
        this.sideModule
            .translate(mainModuleWidth / 2 + sideModuleWidth / 2, 0, 0)
            .display();

        // display the left module
        this.sideModule
            .translate(mainModuleWidth / 2 + sideModuleWidth / 2, 0, 0)
            .scale(-1, 1, -1)
            .display();
    }
}
