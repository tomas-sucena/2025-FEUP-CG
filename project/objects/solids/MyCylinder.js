import { MyObject } from '../MyObject.js';

/**
 * A cylinder.
 */
export class MyCylinder extends MyObject {
    /**
     * Initializes the cylinder.
     * @param { MyScene } scene the scene the object will be displayed in
     * @param { Object } config the object configuration
     */
    constructor({
        scene,
        radius,
        topRadius,
        bottomRadius,
        height,
        slices,
        stacks,
        inverted,
        material,
        texture,
    }) {
        super(scene);
        radius ??= 1;

        /** The radius of the top cylinder */
        this.topRadius = topRadius ?? radius;
        /** The radius of the bottom cylinder */
        this.bottomRadius = bottomRadius ?? this.topRadius;
        /** The height of the cylinder */
        this.height = height ?? 1;
        /** The number of divisions around the Y-axis */
        this.slices = slices ?? 16;
        /** The number of divisions along the Y-axis*/
        this.stacks = stacks ?? 1;

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
