import { CGFobject, CGFscene } from '../../lib/CGF.js';

export class MyObject extends CGFobject {
    #transformationMatrix; /** the transformation matrix */

    /**
     * Initializes the object.
     * @param { CGFscene } scene reference to the scene the object will be a part of
     */
    constructor(scene) {
        super(scene);
        this.#transformationMatrix = null;
    }

    /**
     * Updates the transformation matrix by concatenating a new geometric transformation.
     * @param { Array } matrix a geometric transformation matrix
     */
    #addTransformation(matrix) {
        // verify if the transformation matrix has not been defined
        if (this.#transformationMatrix === null) {
            this.#transformationMatrix = matrix;
            return;
        }

        // multiply the matrices (line by line)
        const result = new Array(16).fill(0);

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

        this.#addTransformation(translationMatrix);
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

        this.#addTransformation(scalingMatrix);
        return this;
    }

    /**
     * Rotates the object by updating its transformation matrix.
     * @param { number } ang the angle by which the object will be rotated
     * @param { number } Rx the x-coordinate of the rotation axis
     * @param { number } Ry the y-coordinate of the rotation axis
     * @param { number } Rz the z-coordinate of the rotation axis
     * @returns a reference to the object
     */
    rotate(ang, Rx, Ry, Rz) {
        // variables to speed up computations
        const sin = Math.sin(ang),
            cos = Math.cos(ang),
            cos_ = 1 - cos;
        const xy = Rx * Ry,
            xz = Rx * Rz,
            yz = Ry * Rz;

        // the (transposed) rotation matrix
        const rotationMatrix = [
            Rx * Rx * cos_ + cos, xy * cos_ + Rz * sin, xz * cos_ - Ry * sin, 0,
            xy * cos_ - Rz * sin, Ry * Ry * cos_ + cos, yz * cos_ + Rx * sin, 0,
            xz * cos_ + Ry * sin, yz * cos_ - Rx * sin, Rz * Rz * cos_ + cos, 0,
            0, 0, 0, 1,
        ];

        this.#addTransformation(rotationMatrix);
        return this;
    }

    /**
     * Displays the geometry of the object.
     */
    render() {
        super.display();
    }

    /**
     * Displays the object.
     * @returns a reference to the object
     */
    display() {
        this.scene.pushMatrix();

        // apply the geometric transformations, if any
        if (this.#transformationMatrix) {
            this.scene.multMatrix(this.#transformationMatrix);
            this.#transformationMatrix = null; // clear the transformation matrix
        }

        // display the geometry of the object
        this.render();

        this.scene.popMatrix();
        return this;
    }
}
