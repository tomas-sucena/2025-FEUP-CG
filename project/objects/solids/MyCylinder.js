import { MyObject } from '../MyObject.js';

/**
 * A cylinder of different sized bases.
 */
export class MyCylinder extends MyObject {
    /**
     * Initializes the cylinder.
     * @param { Object } config - the cylinder configuration
     * @param { CGFscene } config.scene - the scene the object will be displayed in
     * @param { number } config.radius - the radius of the bases of the cylinder
     * @param { number } config.topRadius - the radius of the top base of the cylinder
     * @param { number } config.bottomRadius - the radius of the bottom base of the cylinder
     * @param { number } config.height - the height of the cylinder
     * @param { number } config.slices - the number of divisions around the Y-axis
     * @param { number } config.stacks - the number of divisions along the Y-axis
     * @param { boolean } config.inverted - indicates if the cylinder should be inverted
     * @param { Object } config.material - the material to be applied to the cylinder
     * @param { string } config.texture - the texture to be applied to the cylinder
     */
    constructor({
        scene,
        radius = 1,
        topRadius,
        bottomRadius,
        height = 1,
        slices = 32,
        stacks,
        inverted,
        material,
        texture,
    }) {
        super(scene);

        /** The radius of the top cylinder */
        this.topRadius = topRadius ?? radius;
        /** The radius of the bottom cylinder */
        this.bottomRadius = bottomRadius ?? this.topRadius;
        /** The height of the cylinder */
        this.height = height;
        /** The number of divisions around the Y-axis */
        this.slices = slices;
        /** The number of divisions along the Y-axis*/
        this.stacks = stacks ?? Math.floor(height);

        this.initGeometry({ inverted, material, texture });
    }

    /**
     * Returns the radius of the biggest face of the cylinder.
     */
    get radius() {
        return Math.max(this.topRadius, this.bottomRadius);
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const deltaAng = (2 * Math.PI) / this.slices;
        const deltaY = this.height / this.stacks;
        const slope = (this.bottomRadius - this.topRadius) / this.stacks;

        // define the stacks
        for (let stack = 0; stack <= this.stacks; ++stack) {
            const y = this.height - stack * deltaY;
            const radius = this.topRadius + stack * slope;

            // define the slices
            for (let slice = 0; slice <= this.slices; ++slice) {
                const ang = slice * deltaAng;
                const ca = Math.cos(ang);
                const sa = Math.sin(ang);

                // define the indices
                if (stack < this.stacks && slice < this.slices) {
                    this.addPairOfIndices(this.slices);
                }

                // define the vertex
                this.vertices.push(sa * radius, y, ca * radius);

                // define the normal
                const normal = vec3.fromValues(sa, slope, ca);
                vec3.normalize(normal, normal);

                this.normals.push(...normal);

                // define the texture coordinates
                this.texCoords.push(slice / this.slices, stack / this.stacks);
            }
        }
    }
}
