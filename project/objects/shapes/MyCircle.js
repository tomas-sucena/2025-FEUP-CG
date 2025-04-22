import { MyObject } from '../MyObject.js';

/**
 * A circle.
 */
export class MyCircle extends MyObject {
    /**
     * Initializes the circle.
     * @param { MyScene } scene a reference to the MyScene object
     * @param { Object } config the object configuration
     */
    constructor(scene, config) {
        super(scene);
        const { radius, slices, layers } = config ?? {};

        /** The radius of the circle */
        this.radius = radius ?? 1;
        /** The number of divisions of the circle around the Z-axis */
        this.slices = slices ?? 32;
        /** The number of divisions along the X and Y-axis */
        this.layers = layers ?? 1;

        this.initGeometry(config);
    }

    initBuffers() {
        this.vertices = [0, 0, 0];
        this.indices = [];
        this.normals = [0, 0, 1];
        this.texCoords = [0.5, 0.5];

        const deltaAng = (2 * Math.PI) / this.slices;
        const deltaRadius = this.radius / this.layers;

        // define the layers
        for (let layer = 1; layer <= this.layers; ++layer) {
            const radius = layer * deltaRadius;

            // define the slices
            for (let slice = 0; slice <= this.slices; ++slice) {
                const ang = slice * deltaAng;
                const ca = Math.cos(ang);
                const sa = Math.sin(ang);

                // TODO: fix indices
                this.indices.push(0, slice + 1, slice + 2);
                this.vertices.push(ca * radius, sa * radius, 0);
                this.normals.push(0, 0, 1);
                this.texCoords.push(
                    0.5 * (ca * (radius / this.radius) + 1),
                    0.5 * (sa * (radius / this.radius) + 1),
                );
            }
        }
    }
}
