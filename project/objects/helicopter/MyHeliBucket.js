import { MyObject } from '../MyObject.js';
import { MyCylinder } from '../solids/MyCylinder.js';
import { MyCircle } from '../shapes/MyCircle.js';  
import { MyHeliRope } from './MyHeliRope.js';

export class MyHeliBucket extends MyObject {
    constructor({
        scene,
        height = 2,
        width = 1.5,
        color = [0.3, 0.2, 0.1, 1],
    }) {
        super(scene);

        this.bucketBody = new MyCylinder({
            scene,
            bottomRadius: width * 0.6,
            topRadius: width * 0.8,
            height: height,
            material: {
                ambient: color,
                diffuse: color,
                specular: [0.5, 0.5, 0.5, 1],
            },

        });

        this.bucketInside = new MyCylinder({
            scene,
            bottomRadius: width * 0.6,
            topRadius: width * 0.8,
            height: height,
            material: {
                ambient: color,
                diffuse: color,
                specular: [0.5, 0.5, 0.5, 1],
            },
            inverted: true,
        });

        this.bottom = new MyCircle({
            scene,
            radius: width * 0.6,
            slices: 32,
            material: {
                ambient: color,
                diffuse: color,
                specular: [0.5, 0.5, 0.5, 1]
            }
        });

        this.bottomInside = new MyCircle({
            scene,
            radius: width * 0.6,
            slices: 32,
            material: {
                ambient: color,
                diffuse: color,
                specular: [0.5, 0.5, 0.5, 1]
            },
            inverted: true,
        });


        this.water = new MyCircle({
            scene,
            radius: width * 0.7,
            slices: 32,
            material: {
                ambient: [0, 0, 1, 1],
                diffuse: [0, 0, 1, 1],
                specular: [0.5, 0.5, 0.5, 1]
            },
            inverted: true,
        });

        this.rope = new MyHeliRope({
            scene: this.scene,
            radius: 0.07,
            length: 20,
            segments: 40,
            colors: {
                rope: [0.35, 0.3, 0.25, 1],
                knot: [0.6, 0.5, 0.4, 1]
            }
        });


        this.height = height;
        this.width = width;
    }

    render() {

        this.bucketBody
            .translate(5, this.height/2, 0)
            .display();


        this.bucketInside
            .translate(5, this.height/2, 0)
            .display();

        this.bottom
            .translate(5, 0, -1)
            .rotate(Math.PI/2, 1, 0, 0) 
            .display();

        this.bottomInside
            .translate(5, 0, -1)
            .rotate(Math.PI/2, 1, 0, 0) 
            .display();

        this.water 
            .translate(5, 0, -3)
            .rotate(Math.PI/2, 1, 0, 0) 
            .display();

        this.rope
            .translate(5, this.height, 0)
            .display();
    }
}