// Sang June Rhee 

import {Drawing, Vector, Point} from "./common"
import {init_tests, draw_tests} from "./projection_test"

// A class for our application state and functionality
class MyDrawing extends Drawing {

    // Current transformation matrix
    ctm: number[][]
    // Current projection matrix
    cpm: number[][]
    // view port matrix
    vpm = [
        [this.canv.width / 2, 0, 0, (this.canv.width - 1) / 2],
        [0, this.canv.height / 2, 0, (this.canv.height - 1) / 2],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ] 
    // Vertices list to store all vertices            
    vertices: Array <Point>

    constructor (div: HTMLElement) {
        super(div)
        this.ctm = []
        this.cpm = [] 
        this.vertices = []
        init_tests(this)
    }

    drawScene() {
        draw_tests(this)
    }

    // Matrix and Drawing Library implemented as part of this object

    // Begin by using the matrix transformation routines from part A of this project.
    // Make your current transformation matrix a property of this object.
    // You should modify the new routines listed below to complete the assignment.
    // Feel free to define any additional classes, class variables and helper methods
    // that you need.
    
    // Storing all vertices
    beginShape() {
        this.vertices = [];
    }

    // Draw lines
    endShape() {
        while (this.vertices.length > 0) {
            myDrawing.line(this.vertices[0], this.vertices[1]);
            this.vertices.shift();
            this.vertices.shift();
        }
    }

    // create a vertex, multiplied with cpm, ctm, and save into vertices list
    vertex(x: number, y: number, z: number) {
        // multiply cpm * ctm * new vector divided by w
        const ctmV = this.matrixmultiplication(this.ctm, [[x], [y], [z], [1]])
        const newVectorMatrix = this.matrixmultiplication(this.cpm, ctmV)

        const w = newVectorMatrix[3][0]
        newVectorMatrix[0][0] /= w
        newVectorMatrix[1][0] /= w
        newVectorMatrix[2][0] /= w
        const newPoint = {x: newVectorMatrix[0][0], y:newVectorMatrix[1][0], z: newVectorMatrix[2][0]}
        
        // save into vertices list
        this.vertices.push(newPoint)
    }

    // multiply the current projection matrix by perspective
    perspective(fov: number, near: number, far: number) {
        const radianFov = (fov * Math.PI) / 180;

        const top = -near * Math.tan(radianFov / 2);
        const bottom = -top;
        const right = (this.canv.offsetWidth / this.canv.offsetHeight) * top;
        const left = -right;

        const p = [
            [(2 * near) / (right - left), 0, (right + left) / (left - right), 0],
            [0, (2 * near) / (top - bottom), (top + bottom) / (bottom - top), 0],
            [0, 0, (far + near) / (near - far), 2 * far * near / (far - near)],
            [0, 0, 1, 0]
        ]
        
        this.cpm = this.matrixmultiplication(this.vpm, p);
    }

    // multiply the current projection matrix by ortho
    ortho(left: number, right: number, top: number, bottom: number, 
        near: number, far: number ) {

        const o = [
            [2 / (right - left), 0, 0, -(right + left) / (right - left)],
            [0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom)],
            [0, 0, 2 / (near - far), -(near + far) / (near - far)],
            [0, 0, 0, 1]
        ];

        this.cpm = this.matrixmultiplication(this.vpm, o);
	}

    // Initialize current transformation matrix
    initMatrix() // was init()
    {
        this.ctm = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }
    
    // mutiply the current matrix by the translation
    translate(x: number, y: number, z: number)
    {
        const t = [
            [1, 0, 0, x],
            [0, 1, 0, y],
            [0, 0, 1, z],
            [0, 0, 0, 1]
        ];

        this.ctm = this.matrixmultiplication(this.ctm, t);
    }
    
    // mutiply the current matrix by the scale
    scale(x: number, y: number, z: number)
    {
        const s = [
            [x, 0, 0, 0],
            [0, y, 0, 0],
            [0, 0, z, 0],
            [0, 0, 0, 1]
        ];

        this.ctm = this.matrixmultiplication(this.ctm, s);
    }
    
    // mutiply the current matrix by the rotation
    rotateX(angle: number)
    {
        const radianAngle = angle * Math.PI / 180;
        const r = [
            [1, 0, 0, 0],
            [0, Math.cos(radianAngle), -Math.sin(radianAngle), 0],
            [0, Math.sin(radianAngle), Math.cos(radianAngle), 0],
            [0, 0, 0, 1]
        ];

        this.ctm = this.matrixmultiplication(this.ctm, r);
    }
    
    // mutiply the current matrix by the rotation
    rotateY(angle: number)
    {
        const radianAngle = angle * Math.PI / 180;
        const r = [
            [Math.cos(radianAngle), 0, Math.sin(radianAngle), 0],
            [0, 1, 0, 0],
            [-Math.sin(radianAngle), 0, Math.cos(radianAngle), 0],
            [0, 0, 0, 1]
        ];

        this.ctm = this.matrixmultiplication(this.ctm, r);
    }
    
    // mutiply the current matrix by the rotation
    rotateZ(angle: number)
    {
        const radianAngle = angle * Math.PI / 180;
        const r = [
            [Math.cos(radianAngle), -Math.sin(radianAngle), 0, 0],
            [Math.sin(radianAngle), Math.cos(radianAngle), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        
        this.ctm = this.matrixmultiplication(this.ctm, r);
    }

    printMatrix() // was print
    {
        var matrixString = ""
        for (var row = 0; row < this.ctm.length; row++) {
            for (var col = 0; col < this.ctm[row].length; col++) {
                matrixString += this.ctm[row][col]
                if (col != this.ctm[row].length - 1) {
                    matrixString += ", ";
                }
            }
            matrixString += "\n";
        }
        matrixString += "\n";
        console.log(matrixString);

        // end with a blank line!
        console.log("")
    }

    // multiply two matrices
    matrixmultiplication(left: number[][], right: number[][]) : number[][]
    {
        var result: number[][]
        result = [];
        for (var row = 0; row < left.length; row++) {
            result[row] = [];
            for (var col = 0; col < right[0].length; col++) {
                var sum = 0;
                for (var k = 0; k < left[0].length; k++) {
                    sum += left[row][k] * right[k][col];
                }
                result[row][col] = sum;
            }
        }
        return result;
    }
}

// a global variable for our state
var myDrawing: MyDrawing

// main function, to keep things together and keep the variables created self contained
function exec() {
    // find our container
    var div = document.getElementById("drawing");

    if (!div) {
        console.warn("Your HTML page needs a DIV with id='drawing'")
        return;
    }

    // create a Drawing object
    myDrawing = new MyDrawing(div);
    myDrawing.render()
}

exec()