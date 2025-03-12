import { MyObject } from './MyObject.js';

/**
 * MyParallelogram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyParallelogram extends MyObject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            0, 0, 0, // 0
            2, 0, 0, // 1
            3, 1, 0, // 2
            1, 1, 0, // 3
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            // front
            0, 1, 3,
            1, 2, 3,

            // back
            3, 1, 0,
            3, 2, 1,
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
