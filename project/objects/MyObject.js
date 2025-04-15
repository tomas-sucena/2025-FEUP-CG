import {
    CGFappearance,
    CGFobject,
    CGFscene,
    CGFtexture,
} from '../../lib/CGF.js';

export class MyObject extends CGFobject {
    /** The geometric transformation matrix */
    #transformations;
    /** Indicates if the object should be inverted */
    #inverted;
    /** The child objects that constitute the object */
    #children;

    /**
     * Initializes the object.
     * @param { CGFscene } scene reference to the scene the object will be a part of
     * @param { Object } config the optional object configuration
     */
    constructor(scene, config) {
        super(scene);

        this.#transformations = this.#children = null;
        this.#inverted = config?.inverted ?? false;

        this.setMaterial(config?.material);
        this.setTexture(config?.texture);
    }

    /**
     * Returns all objects that constitute the object.
     * @returns an array containing the objects that constitute the object
     */
    #getChildren() {
        // verify if the children have already been computed
        if (this.#children) {
            return this.#children;
        }

        // a function for recursively finding child objects
        const findChildren = (children, value) => {
            if (value instanceof MyObject) {
                children.push(value);
            }
            else if (Array.isArray(value)) {
                value.forEach((el) => findChildren(children, el));
            }
            else if (typeof value === 'Object') {
                Object.values(value).forEach((el) =>
                    findChildren(children, el),
                );
            }

            return children;
        };

        this.#children = Object.values(this).reduce(findChildren, []);
        return this.#children;
    }

    /**
     * Inverts the object by reversing its normals and updating its indices.
     */
    #invert() {
        // reverse the normals
        for (let i = 0; i < this.normals.length; ++i) {
            this.normals[i] *= -1;
        }

        // update the indices
        for (let i = 0; i < this.indices.length; i += 3) {
            // swap a pair of indices to reverse the rotation direction
            [this.indices[i], this.indices[i + 1]] = [
                this.indices[i + 1],
                this.indices[i],
            ];
        }
    }

    /**
     * Updates the transformation matrix by concatenating a new geometric transformation.
     * @param { Array } matrix a geometric transformation matrix
     */
    #addTransformation(matrix) {
        // verify if the transformation matrix has not been defined
        if (this.#transformations === null) {
            this.#transformations = matrix;
            return;
        }

        // multiply the matrices (line by line)
        const result = new Array(16).fill(0);

        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                for (let k = 0; k < 4; ++k) {
                    result[i * 4 + k] +=
                        this.#transformations[i * 4 + j] * matrix[j * 4 + k];
                }
            }
        }

        this.#transformations = result;
    }

    /**
     * Initializes the WebGL buffers.
     */
    initBuffers() {
        if (this.#inverted) {
            this.#invert();
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * Displays the object's normals.
     */
    enableNormalViz() {
        if (Array.isArray(this.normals)) {
            super.enableNormalViz();
        }

        this.#getChildren().forEach((child) => child.enableNormalViz());
    }

    /**
     * Hides the object's normals.
     */
    disableNormalViz() {
        if (Array.isArray(this.normals)) {
            super.disableNormalViz();
        }

        this.#getChildren().forEach((child) => child.disableNormalViz());
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
        // prettier-ignore
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
        // prettier-ignore
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
        // prettier-ignore
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
     * Applies a material to the object.
     * @param { Number[] } ambient the material's ambient component
     * @param { Number[] } diffuse the material's diffuse component
     * @param { Number[] } specular the material's specular component
     * @param { Number[] } emission the material's emissivity
     * @param { Number } shininess the material's shininess
     */
    setMaterial({ ambient, diffuse, specular, emission, shininess } = {}) {
        this.material = new CGFappearance(this.scene);

        // set the ambient component
        this.material.setAmbient(
            ...(typeof ambient === 'Array' ? ambient : [0.6, 0.6, 0.6, 1]),
        );

        // set the diffuse component
        this.material.setDiffuse(
            ...(typeof diffuse === 'Array' ? diffuse : [0.6, 0.6, 0.6, 1]),
        );

        // set the specular component
        this.material.setSpecular(
            ...(typeof specular === 'Array' ? specular : [0.6, 0.6, 0.6, 1]),
        );

        // set the emissivity
        this.material.setEmission(
            ...(typeof emission === 'Array' ? emission : [0, 0, 0, 1]),
        );

        // set the shininess
        this.material.setShininess(
            typeof shininess === 'Number' ? shininess : 10,
        );
    }

    /**
     * Applies a texture to the object's material.
     * @param { string } texture path to the texture file
     * @param { number[] } texCoords the texture coordinates
     */
    setTexture(texture, texCoords) {
        texture instanceof CGFtexture
            ? this.material.setTexture(texture)
            : this.material.loadTexture(texture);

        if (texCoords && texCoords.length / 2 === this.vertices.length / 3) {
            this.texCoords = [...texCoords];
            super.updateTexCoordsGLBuffers();
        }
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
        if (this.transformations) {
            this.scene.multMatrix(this.transformations);
            this.transformations = null; // clear the transformation matrix
        }

        // apply the material
        this.material.apply();

        // display the geometry of the object
        this.render();

        this.scene.popMatrix();
        return this;
    }
}
