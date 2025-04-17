import { MyObject } from '../MyObject.js';

/**
 * A plane.
 */
export class MyPlane extends MyObject {
    /**
     * Initializes the plane.
     * @param { MyScene } scene a reference to the MyScene object
     * @param { Object } config the object configuration
     */
    constructor(scene, config) {
        super(scene, config);
        const { nrDivs, minS, maxS, minT, maxT } = config ?? {};

        /** number of divisions in both directions of the surface */
        this.nrDivs = nrDivs ?? 1;
        /** minimum texture coordinate in S */
        this.minS = minS || 0;
        /** maximum texture coordinate in S */
        this.maxS = maxS || 1;
        /** minimum texture coordinate in T */
        this.minT = minT || 0;
        /** maximum texture coordinate in T */
        this.maxT = maxT || 1;

        this.initGeometry(config);
    }

    initBuffers() {
        // Generate vertices, normals, and texCoords
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];

        const patchLength = 1.0 / this.nrDivs;
        const q = (this.maxS - this.minS) / this.nrDivs;
        const w = (this.maxT - this.minT) / this.nrDivs;

        var y = 0.5;
        for (var j = 0; j <= this.nrDivs; j++) {
            var x = -0.5;
            for (var i = 0; i <= this.nrDivs; i++) {
                this.vertices.push(x, y, 0);
                this.normals.push(0, 0, 1);
                this.texCoords.push(this.minS + i * q, this.minT + j * w);
                x += patchLength;
            }
            y -= patchLength;
        }

        // Generating indices
        this.indices = [];

        var ind = 0;
        for (var j = 0; j < this.nrDivs; j++) {
            for (var i = 0; i <= this.nrDivs; i++) {
                this.indices.push(ind);
                this.indices.push(ind + this.nrDivs + 1);
                ind++;
            }
            if (j + 1 < this.nrDivs) {
                this.indices.push(ind + this.nrDivs);
                this.indices.push(ind);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
        super.initBuffers();
    }
}
