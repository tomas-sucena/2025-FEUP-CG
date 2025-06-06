import { MyObject } from '../MyObject.js';

/**
 * A circle.
 * @extends MyObject
 */
export class MyCircle extends MyObject {
    /**
     * Initializes the circle.
     * @param { Object } config - the circle configuration
     * @param { CGFscene } config.scene - the scene the circle will be displayed in
     * @param { number } config.radius - the radius of the circle
     * @param { number } config.slices - the number of divisions around the Z-axis
     * @param { number } config.layers - the number of divisions along the X and Y-axis
     * @param { boolean } config.inverted - indicates if the circle should be inverted
     * @param { Object } config.material - the material to be applied to the circle
     * @param { string } config.texture - the texture to be applied to the circle
     */
    constructor({
        scene,
        radius = 1,
        slices = 32,
        layers,
        inverted,
        material,
        texture,
    }) {
        super(scene);

        /** The radius of the circle */
        this.radius = radius;
        /** The number of divisions of the circle around the Z-axis */
        this.slices = slices;
        /** The number of divisions along the X and Y-axis */
        this.layers = layers ?? Math.ceil(radius);

        this.initGeometry({ inverted, material, texture });
    }

    /**
     * Initializes the vertices, indices, normals, and texture coordinates.
     */
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
        const centerIndex = this.layers * (this.slices + 1);
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5, 0.5);

        // generate the indices that connect to the center
        for (let slice = 0; slice < this.slices; ++slice) {
            this.indices.push(centerIndex, slice, (slice + 1) % this.slices);
        }
    }
}
