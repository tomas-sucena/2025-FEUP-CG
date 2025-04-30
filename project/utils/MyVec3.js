/**
 * A 3D vector.
 */
export class MyVec3 {
    constructor(x, y, z) {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.z = z ?? 0;
    }

    /**
     * Computes the vector's norm, that is, the distance from (0, 0, 0) to (x, y, z).
     * @returns { number } the vector's norm
     */
    get norm() {
        return Math.hypot(this.x, this.y, this.z);
    }

    /**
     * Normalizes the vector, ensuring its norm is 1.
     * @returns { MyVec3 } the vector
     */
    normalize() {
        // compute the norm
        const norm = this.norm;

        // divide all elements by the norm
        this.x /= norm;
        this.y /= norm;
        this.z /= norm;

        return this;
    }
}
