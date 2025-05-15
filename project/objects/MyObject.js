import { CGFappearance, CGFobject, CGFscene } from '../../lib/CGF.js';

export class MyObject extends CGFobject {
    /** The material to be applied to the object */
    #material;
    /** The geometric transformation matrix */
    #transformations;
    /** The child objects that constitute the object */
    #children;

    /**
     * Initializes the object.
     * @param { CGFscene } scene - to the scene the object will be a part of
     */
    constructor(scene) {
        super(scene);

        this.#transformations = this.#children = null;
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
            } else if (Array.isArray(value)) {
                value.forEach((el) => findChildren(children, el));
            } else if (typeof value === 'object') {
                Object.values(value).forEach((el) =>
                    findChildren(children, el),
                );
            }

            return children;
        };

        const { scene, ...others } = this; // ignore the scene, as it causes circular references
        this.#children = Object.values(others).reduce(findChildren, []);

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
     * Adds a pair of triangles to the index buffer to connect two adjacent segments.
     * @param {number} step - The number of vertices to skip to reach the corresponding vertex on the next segment
     */
    addPairOfIndices(step) {
        const index = this.vertices.length / 3;
        const indexNextSegment = index + step + 1;

        // prettier-ignore
        this.indices.push(
            index, indexNextSegment, index + 1,
            index + 1, indexNextSegment, indexNextSegment + 1,
        );
    }

    /**
     * Initializes the buffers and material of the object.
     * @param { Object } config - the object configuration
     * @param { boolean } config.inverted - indicates if the object should be inverted
     * @param { Object } config.material - the material configuration
     * @param { string | Object } config.texture - the texture configuration
     */
    initGeometry({ inverted, material, texture }) {
        this.initBuffers();

        // invert the normals and indices if needed
        if (inverted) {
            this.#invert();
        }

        // initialize the WebGL buffers
        this.primitiveType ??= this.scene.gl.TRIANGLES;
        this.initGLBuffers();

        // initialize the material
        this.#material = new CGFappearance(this.scene);
        this.setMaterial(material);

        // initialize the texture
        this.setTexture(texture);
    }

    /**
     * Displays the geometry of the object.
     */
    render() {
        super.display();
    }

    /**
     * Sets the WebGL primitive to triangles.
     */
    setFillMode() {
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.#getChildren().forEach((child) => child.setFillMode());
    }

    /**
     * Sets the WebGL primitive to line strips so the object's wireframe is displayed.
     */
    setLineMode() {
        this.primitiveType = this.scene.gl.LINE_STRIP;
        this.#getChildren().forEach((child) => child.setLineMode());
    }

    /**
     * Displays the object's normals.
     */
    enableNormalViz() {
        if (this.normals) {
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
     * @param { Object } config - the material configuration
     * @param { boolean } recursive - indicates if the material should be recursively applied to the child objects
     */
    setMaterial(config, recursive) {
        // verify if the material exists
        if (this.#material) {
            const { ambient, diffuse, specular, emission, shininess } =
                config ?? {};

            // set the ambient component
            if (ambient) {
                this.#material.setAmbient(...ambient);
            }

            // set the diffuse component
            if (diffuse) {
                this.#material.setDiffuse(...diffuse);
            }

            // set the specular component
            if (specular) {
                this.#material.setSpecular(...specular);
            }

            // set the emissivity
            if (emission) {
                this.#material.setEmission(...emission);
            }

            // set the shininess
            if (shininess) {
                this.#material.setShininess(shininess);
            }
        }

        // set the material of the child objects
        if (recursive) {
            this.#getChildren().forEach((child) => child.setMaterial(config));
        }
    }

    /**
     * Applies a texture to the object's material.
     * @param { string | Object } config the texture configuration
     * @param { string } texture.url - the URL specifying the texture
     * @param { string } texture.wrapS - the wrapping to be applied to the S-axis
     * @param { string } texture.wrapT - the wrapping to be applied to the T-axis
     * @param { boolean } recursive - indicates if the material should be recursively applied to the child objects
     */
    setTexture(config, recursive = false) {
        // verify if the material exists
        if (config && this.#material) {
            const { url, wrapS, wrapT } = config;

            // bind the texture to the material
            this.#material.loadTexture(url ?? config);

            // set the texture wrapping mode
            this.#material.setTextureWrap(wrapS ?? 'REPEAT', wrapT ?? 'REPEAT');
        }

        // set the texture of the child objects
        if (recursive) {
            this.#getChildren().forEach((child) => child.setTexture(config));
        }
    }

    /**
     * Displays the object.
     * @param { boolean } clearTransformations - indicates if the transformation matrix should be cleared
     * @returns a reference to the object
     */
    display(clearTransformations = true) {
        this.scene.pushMatrix();

        // apply the geometric transformations, if any
        if (this.#transformations) {
            this.scene.multMatrix(this.#transformations);

            if (clearTransformations) {
                this.#transformations = null; // clear the transformation matrix
            }
        }

        // apply the material
        if (this.#material) {
            this.#material.apply();
        }

        // display the geometry of the object
        this.render();

        this.scene.popMatrix();
        return this;
    }
}
