import { MyBox } from '../solids/MyBox.js';
import { MyRectangle } from '../shapes/MyRectangle.js';

/**
 * A building module.
 * @extends MyBox
 */
export class MyModule extends MyBox {
    /**
     * Initializes the module.
     * @param { Object } config - the module configuration
     * @param { CGFscene } config.scene - the scene the module will be displayed in
     * @param { number } config.width - the width of the module
     * @param { number } config.height - the height of the module
     * @param { number } config.depth - the depth of the module
     * @param { number } config.floors - the number of floors of the module
     * @param { number } config.windows - the number of windows per floor of the module
     * @param { Object } config.material - the material to be applied to the module
     * @param { Object } config.textures - the textures to be applied to the module
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
            height: height ?? floors,
            depth: depth ?? 0.8 * width,
            xDivisions: windows,
            yDivisions: floors,
            zDivisions: windows,
            material,
            texture: textures?.wall,
        });

        /** The number of floors of the module */
        this.floors = floors;

        /** The number of windows on each floor of the module */
        this.windows = windows;

        /** The module's window */
        this.window = new MyRectangle({
            scene,
            width: 0.5 * (this.width / this.windows),
            height: 0.5 * (this.height / this.floors),
            rows: 4,
            columns: 4,
            texture: textures.window,
            material: {
                diffuse: [1, 1, 1, 1],
                specular: [0.6, 0.6, 0.6, 1],
            },
        });

        /** The child objects */
        this.children = [this.window];
    }

    /**
     * Displays the module's geometry.
     */
    render() {
        // display the box
        super.render();

        // display the windows
        const xOffset = this.width / this.windows;
        const yOffset = this.height / this.floors;

        const halfWidth = this.width / 2;
        const halfDepth = this.depth / 2 + 0.05; // NOTE: the small offset avoids overlapping

        for (let floor = 0; floor < this.floors; ++floor) {
            const y = (floor + 0.5) * yOffset;

            for (let window = 0; window < this.windows; ++window) {
                const x = -halfWidth + (window + 0.5) * xOffset;

                if (floor > 0 || !this.isMainModule) {
                    this.window.translate(x, y, halfDepth).display();
                }

                this.window
                    .translate(x, y, halfDepth)
                    .scale(-1, 1, -1)
                    .display();
            }
        }
    }
}
