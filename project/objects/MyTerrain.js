import { MyRectangle } from './shapes/MyRectangle.js';

export class MyTerrain extends MyRectangle {
    constructor({ scene, size, textures }) {
        super({
            scene,
            width: size,
            height: size,
            rows: size / 2,
            columns: size / 2,
            shader: 'terrain',
        });

        /** The textures to be applied to the terrain */
        this.textures = textures.map((textureURL) =>
            this.scene.getTexture(textureURL),
        );

        this.shader.setUniformsValues({
            uMaskSampler: 0,
            uGrassSampler: 1,
            uLakeSampler: 2,
            size,
        });
    }

    /**
     * Returns the dimensions of the lake.
     */
    get lake() {
        return {
            width: 0.31 * this.width,
            depth: 0.18 * this.height,
        };
    }

    /**
     * Determines if the helicopter is above the lake.
     * @param {MyHeli} helicopter - the helicopter
     * @returns 'true' if the helicopter is above the lake, 'false' otherwise
     */
    isLakeBelow(helicopter) {
        const halfLakeWidth = this.lake.width / 2;
        const halfLakeDepth = this.lake.depth / 2;

        const [x, _, z] = helicopter.position;
        const bucketRadius = helicopter.bucket.topRadius;

        return (
            x - bucketRadius > -halfLakeWidth &&
            x + bucketRadius < halfLakeWidth && // X in bounds
            z - bucketRadius > -halfLakeDepth &&
            z + bucketRadius < halfLakeDepth // Z in bounds
        );
    }

    /**
     * Updates the lake undulation.
     * @param {number} time - the time elapsed
     */
    update(time) {
        this.shader.setUniformsValues({ uTime: time });
    }

    /**
     * Displays the terrain.
     */
    display() {
        // bind each texture to the shader
        this.textures.forEach((texture, index) => {
            // ensure the texture has been loaded
            if (texture.bind(index)) {
                // set the wrapping mode to REPEAT
                const gl = texture.gl;
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            }
        });

        super.display();
    }
}
