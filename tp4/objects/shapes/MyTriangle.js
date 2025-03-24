import { MyObject } from '../MyObject.js';

/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangle extends MyObject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            -1, -1, 0,
            1, -1, 0,
            -1, 1, 0,
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            // front
            0, 1, 2,

            // back
            2, 1, 0,
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
