import { MyObject } from '../MyObject.js';

/**
 * MyPrism
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of divisions around the Z axis
 * @param stacks - number of divisions along the Z axis
*/
export class MyCylinder extends MyObject {
    constructor(scene, slices, stacks) {
        super(scene);

        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        // define the stacks
        const angOffset = 2 * Math.PI / this.slices;
        const zOffset = 1 / this.stacks;

        for (let z = 0; z < 1; z += zOffset) {
            // define the slices
            for (let ang = 0; ang < 2 * Math.PI; ang += angOffset) {
                const sa = Math.sin(ang);
                const ca = Math.cos(ang);
                const saa = Math.sin(ang + angOffset);
                const caa = Math.cos(ang + angOffset);
                const index = this.vertices.length / 3;

                // define the vertices
                this.vertices.push(
                    ca, sa, z,
                    caa, saa, z,
                    ca, sa, z + zOffset,
                    caa, saa, z + zOffset,
                );

                // define the indices
                this.indices.push(
                    index, index + 1, index + 2,
                    index + 3, index + 2, index + 1,
                );

                // define the normals
                this.normals.push(
                    ca, sa, 0,
                    caa, saa, 0,
                    ca, sa, 0,
                    caa, saa, 0,
                );
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * Called when user interacts with GUI to change object's complexity.
     * @param {integer} complexity - changes number of slices
     */
    updateBuffers(complexity) {
        this.slices = Math.max(3, Math.round(16 * complexity));
        
        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}
