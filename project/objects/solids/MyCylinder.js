import { MyObject } from '../MyObject.js';

/**
 * A cylinder.
 */
export class MyCylinder extends MyObject {
    /**
     * Initializes the cylinder.
     * @param { MyScene } scene the scene the object will be displayed in
     * @param { Object } config the object configuration
     */
    constructor({
        scene,
        radius,
        height,
        slices,
        stacks,
        inverted,
        material,
        texture,
    }) {
        super(scene);

        /** The width of the cylinder */
        this.radius = radius ?? 1;
        /** The height of the cylinder */
        this.height = height ?? 1;
        /** The number of divisions around the Y-axis */
        this.slices = slices ?? 16;
        /** The number of divisions along the Y-axis*/
        this.stacks = stacks ?? 1;

        this.initGeometry({ inverted, material, texture });
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const deltaAng = (-2 * Math.PI) / this.slices;
        const deltaY = this.height / this.stacks;

        // define the slices
        for (let slice = 0; slice <= this.slices; ++slice) {
            const ang = slice * deltaAng;
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
                this.vertices.push(
                    this.radius * ca,
                    stack * deltaY,
                    this.radius * sa,
                );

                // define the normals
                this.normals.push(ca, 0, sa);

                // define the texture coordinates
                this.texCoords.push(slice / this.slices, stack / this.stacks);
            }
        }
    }
}
