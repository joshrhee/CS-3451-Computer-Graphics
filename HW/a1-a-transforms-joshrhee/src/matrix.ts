// Matrix Commands (for you to write!)

// You should modify the routines listed below to complete the assignment.
// Feel free to define any classes, global variables and helper routines that
// you need.

var ctm: number[][]

// set the current matrix to the identity
function init()
{
    ctm = [[1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]];
}

// multiply the current matrix by the translation
function translate(x: number, y: number, z: number)
{
    const t = [[1, 0, 0, x],
                [0, 1, 0, y],
                [0, 0, 1, z],
                [0, 0, 0, 1]];

    ctm = matrixmultiplication(ctm, t);
}

// multiply the current matrix by the scale
function scale(x: number, y: number, z: number)
{
    const s = [[x, 0, 0, 0],
                [0, y, 0, 0],
                [0, 0, z, 0],
                [0, 0, 0, 1]];

    ctm = matrixmultiplication(ctm, s);
}

// multiply the current matrix by the rotation
function rotateX(angle: number)
{
    const radianAngle = angle * Math.PI / 180;
    const r = [[1, 0, 0, 0],
                [0, Math.cos(radianAngle), -Math.sin(radianAngle), 0],
                [0, Math.sin(radianAngle), Math.cos(radianAngle), 0],
                [0, 0, 0, 1]];

    ctm = matrixmultiplication(ctm, r);
}

// multiply the current matrix by the rotation
function rotateY(angle: number)
{
    const radianAngle = angle * Math.PI / 180;
    const r = [[Math.cos(radianAngle), 0, Math.sin(radianAngle), 0],
                [0, 1, 0, 0],
                [-Math.sin(radianAngle), 0, Math.cos(radianAngle), 0],
                [0, 0, 0, 1]];

    ctm = matrixmultiplication(ctm, r);
}

// multiply the current matrix by the rotation
function rotateZ(angle: number)
{
    const radianAngle = angle * Math.PI / 180;
    const r = [[Math.cos(radianAngle), -Math.sin(radianAngle), 0, 0],
                [Math.sin(radianAngle), Math.cos(radianAngle), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]];
    
    ctm = matrixmultiplication(ctm, r);
}

// print the current matrix
function print()
{
    // add code here!
    // use `console.log("something")` to print something to the browser console.
    var matrixString = ""
    for (var row = 0; row < ctm.length; row++) {
        for (var col = 0; col < ctm[row].length; col++) {
            matrixString += ctm[row][col]
            if (col != ctm[row].length - 1) {
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

// return the current matrix as an array of 16 numbers
// in row major order (i.e., elements 0..3 are row 1, 4..7 are row2,
// 8..11 are row3, and 12..15 are row4)
function currentMatrix() : number[]
{
    var oneRowArray: number[];
    oneRowArray = [];
    ctm.map((row) => {
        row.map((value) => {
            oneRowArray.push(value);
        })
    })
    return oneRowArray;
}

function matrixmultiplication(left: number[][], right: number[][]) : number[][]
{
    var leftRowLength = left.length, leftColLength = left[0].length,
      rightRowLength = right.length, rightColLength = right[0].length,
      multipliedMatrix = new Array(leftRowLength);
        for (var row = 0; row < leftRowLength; row++) {
            multipliedMatrix[row] = new Array(rightColLength);
            for (var col = 0; col < rightColLength; col++) {
                multipliedMatrix[row][col] = 0;
                for (var i = 0; i < leftColLength; i++) {
                    multipliedMatrix[row][col] += left[row][i] * right[i][col];
                }
            }
        }
  return multipliedMatrix;
}

export {init, translate, scale, rotateX, rotateY, rotateZ, print, currentMatrix, matrixmultiplication}
