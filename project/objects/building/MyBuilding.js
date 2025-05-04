import { MyObject } from '../MyObject.js';
import { MyModule } from './MyModule.js';

export class MyBuilding extends MyObject {
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
        this.mainModule = new MyModule({
            scene,
            width: 0.4 * width,
            height,
            depth,
            floors: floors + 1,
            windows,
            isMainModule: true,
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
    }

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
