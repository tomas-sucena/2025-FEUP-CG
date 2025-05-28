import { MyBox } from '../solids/MyBox.js';
import { MyCircle } from '../shapes/MyCircle.js';
import { MyRectangle } from '../shapes/MyRectangle.js';

/**
 * A building module.
 * @extends MyObject
 */
export class MyModule extends MyBox {
    /**
     * Initializes the module.
     * @param { Object } config - the module configuration
     */
    constructor({
        scene,
        width,
        height,
        depth,
        floors,
        windows,
        isMainModule,
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

        /** Indicates if the module is the main module */
        this.isMainModule = isMainModule ?? false;

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

        if (this.isMainModule) {
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
                    ambient: [0, 0, 0, 1],
                    diffuse: [1, 1, 1, 1],
                }
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
        }
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

        for (let floor = this.isMainModule; floor < this.floors; ++floor) {
            const y = (floor + 0.5) * yOffset;

            for (let window = 0; window < this.windows; ++window) {
                const x = -halfWidth + (window + 0.5) * xOffset;

                this.window
                    .translate(x, y, halfDepth)
                    .display()
                    .translate(x, y, halfDepth)
                    .scale(-1, 1, -1)
                    .display();
            }
        }

        // display the door
        this.door?.translate(0, this.door.height / 2, halfDepth).display();

        // display the sign
        this.sign
            ?.translate(
                0,
                this.door.height + this.sign.height / 2 + 0.05,
                halfDepth,
            )
            .display();

        // display the helipad
        this.helipad
            ?.rotate(-Math.PI / 2, 1, 0, 0)
            .translate(0, this.height + 0.05, 0)
            .display();
    }
}
