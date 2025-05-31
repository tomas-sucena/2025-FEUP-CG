import { MyObject } from '../MyObject.js';

/**
 * A circle.
 */
export class MyCircle extends MyObject {
    /**
     * Initializes the circle.
     * @param { MyScene } scene the scene the object will be displayed in
     * @param { Object } config the object configuration
     */
    constructor({
        scene,
        radius,
        slices,
        layers,
        inverted,
        material,
        texture,
    }) {
        super(scene);

        /** The radius of the circle */
        this.radius = radius ?? 1;
        /** The number of divisions of the circle around the Z-axis */
        this.slices = slices ?? 32;
        /** The number of divisions along the X and Y-axis */
        this.layers = layers ?? 1;

        this.initGeometry({ inverted, material, texture });
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

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

                if (layer < this.layers) {
                    this.addPairOfIndices(this.slices - 1);
                }

                this.vertices.push(ca * radius, sa * radius, 0);
                this.normals.push(0, 0, 1);
                this.texCoords.push(
                    0.5 * (ca * (radius / this.radius) + 1),
                    0.5 * (sa * (radius / this.radius) + 1),
                );
            }
        }

        // define the center
        const centerIndex = this.layers * this.slices;
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5, 0.5);

        // generate the indices that connect to the center
        for (let slice = 0; slice < this.slices; ++slice) {
            this.indices.push(centerIndex, slice, (slice + 1) % this.slices);
        }
    }
}
