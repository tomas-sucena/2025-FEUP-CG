import { CGFobject, CGFscene } from '../../lib/CGF.js';

export class MyObject extends CGFobject {
    #transformationMatrix; /** the transformation matrix */
    #identityMatrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    /**
     * Initializes the object.
     * @param { CGFscene } scene reference to the scene the object will be a part of
     */
    constructor(scene) {
        super(scene);
        this.#transformationMatrix = [...this.#identityMatrix];
    }

    /**
     * Updates the transformation matrix by concatenating a new geometric transformation.
     * @param { Array } matrix a geometric transformation matrix
     */
    #applyTransformation(matrix) {
        const result = new Array(16).fill(0);

        // multiply the matrices (line by line)
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                for (let k = 0; k < 4; ++k) {
                    result[i * 4 + k] +=
                        this.#transformationMatrix[i * 4 + j] *
                        matrix[j * 4 + k];
                }
            }
        }

        this.#transformationMatrix = result;
    }

    /**
     * Translates the object by updating its transformation matrix.
     * @param { number } Tx the offset in the x-axis
     * @param { number } Ty the offset in the y-axis
     * @param { number } Tz the offset in the z-axis
     * @returns a reference to the object
     */
    translate(Tx, Ty, Tz) {
        // the (transposed) translation matrix
        const translationMatrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            Tx, Ty, Tz, 1,
        ];

        this.#applyTransformation(translationMatrix);
        return this;
    }

    /**
     * Scales the object by updating its transformation matrix.
     * @param { number } Sx the scaling factor in the x-axis
     * @param { number } Sy the scaling factor in the y-axis
     * @param { number } Sz the scaling factor in the z-axis
     * @returns a reference to the object
     */
    scale(Sx, Sy, Sz) {
        // the (transposed) scaling matrix
        const scalingMatrix = [
            Sx, 0, 0, 0,
            0, Sy, 0, 0,
            0, 0, Sz, 0,
            0, 0, 0, 1,
        ];

        this.#applyTransformation(scalingMatrix);
        return this;
    }

    /**
     * Displays the object.
     * @returns a reference to the object
     */
    display() {
        // apply the geometric transformations
        this.scene.pushMatrix();
        this.scene.multMatrix(this.#transformationMatrix);
        super.display();
        this.scene.popMatrix();

        // clear the transformation matrix
        this.#transformationMatrix = [...this.#identityMatrix];
        return this;
    }
}
