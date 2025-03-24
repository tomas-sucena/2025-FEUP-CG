import { MyObject } from '../MyObject.js';

/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyDiamond extends MyObject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            -1, 0, 0, // 0
            0, -1, 0, // 1
            0, 1, 0,  // 2
            1, 0, 0,  // 3
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            // front
            0, 1, 2,
            1, 3, 2,

            // back
            2, 1, 0,
            2, 3, 1,
        ];

        this.normals = Array(this.vertices.length)
            .fill([0, 0, 1])
            .flat();

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}
