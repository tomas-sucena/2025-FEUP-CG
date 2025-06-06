import { CGFappearance, CGFobject, CGFscene } from '../../lib/CGF.js';

export class MyObject extends CGFobject {
    /**
     * Initializes the object.
     * @param { CGFscene } scene - to the scene the object will be a part of
     */
    constructor(scene) {
        super(scene);

        /** The geometric transformations matrix */
        this.transformations = mat4.create();
    }

    /**
     * Inverts the object by reversing its normals and updating its indices.
     */
    invert() {
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
     * @param { Object } config.shader - the shaders to be applied to the object
     * @param { string } config.shader.vert - the vertex shader
     * @param { string } config.shader.frag - the fragment shader
     */
    initGeometry({ inverted, material, texture, shader }) {
        this.initBuffers();

        // invert the normals and indices if needed
        if (inverted) {
            this.invert();
        }

        // initialize the WebGL buffers
        this.primitiveType ??= this.scene.gl.TRIANGLES;
        this.initGLBuffers();

        // initialize the material
        if (material) {
            this.material = new CGFappearance(this.scene);
            this.setMaterial(material);
        }

        // initialize the texture
        this.setTexture(texture);

        // initialize the shader
        this.setShader(shader);
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
        this.children?.forEach((child) => child.setFillMode());
    }

    /**
     * Sets the WebGL primitive to line strips so the object's wireframe is displayed.
     */
    setLineMode() {
        this.primitiveType = this.scene.gl.LINE_STRIP;
        this.children?.forEach((child) => child.setLineMode());
    }

    /**
     * Displays the object's normals.
     */
    enableNormalViz() {
        if (this.normals) {
            super.enableNormalViz();
        }

        this.children?.forEach((child) => child.enableNormalViz());
    }

    /**
     * Hides the object's normals.
     */
    disableNormalViz() {
        if (Array.isArray(this.normals)) {
            super.disableNormalViz();
        }

        this.children?.forEach((child) => child.disableNormalViz());
    }

    /**
     * Translates the object by updating its transformation matrix.
     * @param { number } Tx the offset in the x-axis
     * @param { number } Ty the offset in the y-axis
     * @param { number } Tz the offset in the z-axis
     * @returns a reference to the object
     */
    translate(Tx, Ty, Tz) {
        // compute the translation matrix
        const translationMatrix = mat4.create();
        mat4.translate(translationMatrix, translationMatrix, [Tx, Ty, Tz]);

        // concatenate the geometric transformation
        mat4.mul(this.transformations, translationMatrix, this.transformations);
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
        // compute the scaling matrix
        const scalingMatrix = mat4.create();
        mat4.scale(scalingMatrix, scalingMatrix, [Sx, Sy, Sz]);

        // concatenate the geometric transformation
        mat4.mul(this.transformations, scalingMatrix, this.transformations);
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
        // compute the translation matrix
        const rotationMatrix = mat4.create();
        mat4.rotate(rotationMatrix, rotationMatrix, ang, [Rx, Ry, Rz]);

        // concatenate the geometric transformation
        mat4.mul(this.transformations, rotationMatrix, this.transformations);
        return this;
    }

    /**
     * Applies a material to the object.
     * @param { Object } config - the material configuration
     * @param { boolean } recursive - indicates if the material should be recursively applied to the child objects
     */
    setMaterial(config, recursive = false) {
        // ensure the material exists
        if (this.material) {
            // configure the material
            const { ambient, diffuse, specular, emission, shininess } =
                config ?? {};

            // set the ambient component
            if (ambient) {
                this.material.setAmbient(...ambient);
            }

            // set the diffuse component
            if (diffuse) {
                this.material.setDiffuse(...diffuse);
            }

            // set the specular component
            if (specular) {
                this.material.setSpecular(...specular);
            }

            // set the emissivity
            if (emission) {
                this.material.setEmission(...emission);
            }

            // set the shininess
            if (shininess) {
                this.material.setShininess(shininess);
            }

            // set the texture wrapping mode
            this.material.setTextureWrap('REPEAT', 'REPEAT');
        }

        // set the material of the child objects
        if (recursive) {
            this.children?.forEach((child) => child.setMaterial(config, true));
        }
    }

    /**
     * Applies a texture to the object's material.
     * @param { string } textureURL - the URL that identifies the texture
     * @param { boolean } recursive - indicates if the material should be recursively applied to the child objects
     */
    setTexture(textureURL, recursive = false) {
        // verify if the material exists
        if (textureURL) {
            // bind the texture to the material
            this.material.setTexture(this.scene.getTexture(textureURL));
        }

        // set the texture of the child objects
        if (recursive) {
            this.children?.forEach((child) => child.setTexture(config, true));
        }
    }

    /**
     * Sets the object's vertex and fragment shaders
     * @param { string } shaderID - the name that uniquely identifies the vertex and fragment shaders
     * @param { boolean } recursive - indicates if the child objects should inherit the shaders
     */
    setShader(shaderID, recursive = false) {
        if (shaderID) {
            this.shader = this.scene.getShader(shaderID);
        }

        // set the shader of the child objects
        if (recursive) {
            this.children?.forEach((child) => child.setShader(shaderID, true));
        }
    }

    /**
     * Displays the object.
     * @returns a reference to the object
     */
    display() {
        this.scene.pushMatrix();

        // apply the geometric transformations
        this.scene.multMatrix(this.transformations);
        mat4.identity(this.transformations); // reset the transformations matrix

        // apply the material
        if (this.material) {
            this.material.apply();
        }

        // apply the shaders
        if (this.shader) {
            this.scene.setActiveShaderSimple(this.shader);
        }

        // display the geometry of the object
        this.render();

        // reset the shaders
        if (this.shader) {
            this.scene.setActiveShaderSimple(this.scene.defaultShader);
        }

        this.scene.popMatrix();
        return this;
    }
}
