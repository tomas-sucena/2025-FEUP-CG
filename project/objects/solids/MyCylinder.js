import { MyObject } from '../MyObject.js';

/**
 * A unit cylinder.
 */
export class MyCylinder extends MyObject {
    /**
     * Initializes the cylinder.
     * @param { MyScene } scene a reference to the MyScene object
     * @param { Object } config the object configuration
     */
    constructor(scene, config) {
        super(scene, config);

        /** The number of divisions around the Y-axis */
        this.slices = config.slices;
        /** The number of divisions along the Y-axis*/
        this.stacks = config.stacks;

        this.initGeometry(config);
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const angOffset = (-2 * Math.PI) / this.slices;
        const yOffset = 1 / this.stacks;

        // define the slices
        for (let slice = 0; slice <= this.slices; ++slice) {
            const ang = slice * angOffset;
            const sa = Math.sin(ang);
            const ca = Math.cos(ang);

            // define the stacks
            for (let stack = 0; stack <= this.stacks; ++stack) {
                // define the indices (except for the last vertex of each stack)
                if (stack < this.stacks) {
                    const index = this.vertices.length / 3;
                    const indexNextSlice =
                        slice + 1 < this.slices
                            ? index + this.stacks + 1
                            : stack;

                    // prettier-ignore
                    this.indices.push(
                        index, indexNextSlice, index + 1,
                        indexNextSlice, indexNextSlice + 1, index + 1,
                    );
                }

                // define the vertices
                this.vertices.push(ca, stack * yOffset, sa);

                // define the normals
                this.normals.push(ca, 0, sa);

                // define the texture coordinates
                this.texCoords.push(slice / this.slices, stack / this.stacks);
            }
        }

        super.initBuffers();
    }
}
