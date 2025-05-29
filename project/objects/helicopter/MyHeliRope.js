import { MyObject } from '../MyObject.js';
import { MyEllipsoid } from '../solids/MyEllipsoid.js';

export class MyHeliRope extends MyObject {
    constructor({
        scene,
        radius = 0.1,
        length = 8,
        segments = 15,
        colors,
    }) {
        super(scene);

        this.radius = radius;
        this.length = length;
        this.segmentSpacing = length / (segments*2);

        this.segments = Array.from({length: segments}, (_, i) => 
            new MyEllipsoid({
                scene,
                radiusX: radius,
                radiusY: radius*3,
                radiusZ: radius,
                slices: 16,
                stacks: 8,
                material: {
                    ambient: colors?.rope || [0.3, 0.25, 0.2, 1],
                    diffuse: colors?.rope || [0.3, 0.25, 0.2, 1],
                }
            })
        );

    }

    render() {
        let currentY = this.length / 2;

        this.segments.forEach(segment => {
            segment.translate(0, currentY, 0).display();
            currentY -= this.segmentSpacing;
        });

    }
}