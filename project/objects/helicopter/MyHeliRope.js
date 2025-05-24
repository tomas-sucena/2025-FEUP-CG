import { MyObject } from '../MyObject.js';
import { MyEllipsoid } from '../solids/MyEllipsoid.js';

export class MyHeliRope extends MyObject {
    constructor({
        scene,
        radius = 0.1,
        length = 5,
        knotCount = 3,
        knotSize = 0.3,
        colors,
        textures,
    }) {
        super(scene);


        /** The knots along the rope */
        this.knots = Array.from({length: knotCount}, (_, i) => 
            new MyEllipsoid({
                scene,
                radiusX: radius * 3,
                radiusY: knotSize,
                radiusZ: radius * 3,
                slices: 16,
                stacks: 8,
                material: {
                    ambient: colors?.knot || [0.4, 0.3, 0.2, 1],
                    diffuse: colors?.knot || [0.4, 0.3, 0.2, 1],
                    specular: [0.1, 0.1, 0.1, 1],
                },
                texture: textures?.knot,
            })
        );

        // Store dimensions
        this.radius = radius;
        this.length = length;
        this.knotSize = knotSize;
        this.knotCount = knotCount;
    }

    render() {
        // Calculate knot spacing
        const knotInterval = this.length / (this.knotCount + 1);
        
        // Display knots along the cable
        this.knots.forEach((knot, index) => {
            const position = (index + 1) * knotInterval - this.length/2;
            knot.translate(position, 0, 0)
                .rotate(Math.PI/2, 1, 0, 0)
                .display();
        });

    }
}