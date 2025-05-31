import { MyObject } from '../MyObject.js';
import { MyBox } from '../solids/MyBox.js';
import { MyCylinder } from '../solids/MyCylinder.js';
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

        // Main glass dome (ellipsoid)
        this.glassDome = new MyEllipsoid({
            scene,
            radiusX: width * 0.5,
            radiusY: height * 0.5,
            radiusZ: width * 0.9,
            slices: 32,
            stacks: 16,
            material: {
                ambient: glassColor,
                diffuse: glassColor,
                specular: [0.9, 0.9, 0.9, 1],
                shininess: 100,
            },
            texture: textures?.frosted_glass,
        });

        // Main cockpit dome (ellipsoid)
        this.cockpit = new MyEllipsoid({
            scene,
            radiusX: width * 1.8,
            radiusY: height * 0.9,
            radiusZ: width * 1.2,
            slices: 32,
            stacks: 16,
            material,
            texture: textures?.cockpit,
        });

        // Store dimensions for positioning
        this.height = height;
        this.width = width;
    }

    render() {
        // Glass dome positioning
        this.glassDome
            .translate(0, this.height * 0.3, 0)
            .rotate(Math.PI / 16, 0, 0, 0)
            .display();

        // Cockpit positioning
        this.cockpit
            .translate(2.4, this.height * 0.3, 0)
            .rotate(Math.PI / 16, 0, 0, 0)
            .display();
    }
}
