import { MyObject } from '../MyObject.js';
import { MyEllipsoid } from '../solids/MyEllipsoid.js';

export class MyHeliCockpit extends MyObject {
    constructor({
        scene,
        height = 2,
        width = 1.5,
        material,
        textures,
        glassColor = [0.7, 0.8, 0.9, 0.5],
    }) {
        super(scene);

        /** The glass dome */
        this.glassDome = new MyEllipsoid({
            scene,
            radiusX: width / 2,
            radiusY: height / 2,
            radiusZ: 0.9 * width,
            slices: 32,
            stacks: 16,
            material: {
                ambient: glassColor,
                diffuse: glassColor,
                specular: [0.9, 0.9, 0.9, 1],
                shininess: 100,
            },
            texture: textures.glass,
        });

        /** The cockpit dome */
        this.cockpitDome = new MyEllipsoid({
            scene,
            radiusX: 1.8 * width,
            radiusY: 0.9 * height,
            radiusZ: 1.2 * width,
            slices: 32,
            stacks: 16,
            material,
            texture: textures.cockpit,
        });

        // Store dimensions for positioning
        this.height = height;
        this.width = width;

        /** The child objects */
        this.children = [this.glassDome, this.cockpitDome];
    }

    /**
     * Displays the geometry of the cockpit.
     */
    render() {
        // display the glass dome
        this.glassDome
            .translate(0, this.height * 0.3, 0)
            .rotate(Math.PI / 16, 0, 0, 0)
            .display();

        // display the cockpit dome
        this.cockpitDome
            .translate(2.4, this.height * 0.3, 0)
            .rotate(Math.PI / 16, 0, 0, 0)
            .display();
    }
}
