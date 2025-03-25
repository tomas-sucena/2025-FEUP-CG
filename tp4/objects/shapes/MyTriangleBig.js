import { MyObject } from '../MyObject.js';

/**
 * MyTriangleBig
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangleBig extends MyObject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        // prettier-ignore
        this.vertices = [
            -2, 0, 0,
            2, 0, 0,
            0, 2, 0,
        ];

        //Counter-clockwise reference of vertices
        // prettier-ignore
        this.indices = [
            // front
            0, 1, 2,

            // back
            0, 2, 1,
        ];

        this.normals = Array(this.vertices.length).fill([0, 0, 1]).flat();

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}
