// Sang June Rhee

import {Drawing} from "common"

// Matrix Command Tests

let which_drawing = 1;  // which drawing test to call

// create the canvas region for drawing
function init_tests(drawing: Drawing) {
    document.addEventListener("keydown", function(event){
        keyPressed(event.key)
    });
}

// draw one of the test cases
function draw_tests(dr: Drawing) {  
    switch (which_drawing) {
        case 1:
          ortho_test(dr);
          break;
        case 2:
          ortho_test_scale(dr);
          break;
        case 3:
          ortho_test_rotate(dr);
          break;
        case 4:
          face_test(dr);
          break;
        case 5:
          faces(dr);
          break;
        case 6:
          ortho_cube(dr);
          break;
        case 7:
          ortho_cube2(dr);
          break;
        case 8:
          perspective_cube(dr);
          break;
        case 9:
          perspective_multi_cube(dr);
          break;
        case 0:
          persp_initials(dr);
          break;
        default:
          break;
    }
}

// handle key presses of digits
function keyPressed(key: string) {
    
  if (key == '1') {
    which_drawing = 1;
  }
  if (key == '2') {
    which_drawing = 2;
  }
  if (key == '3') {
    which_drawing = 3;
  }
  if (key == '4') {
    which_drawing = 4;
  }
  if (key == '5') {
    which_drawing = 5;
  }
  if (key == '6') {
    which_drawing = 6;
  }
  if (key == '7') {
    which_drawing = 7;
  }
  if (key == '8') {
    which_drawing = 8;
  }
  if (key == '9') {
    which_drawing = 9;
  }
  if (key == '0') {
    which_drawing = 0;
  }
}

// Test square drawing.
function ortho_test(dr: Drawing)
{
  let near = -1.0;
  let far = -40.0;
  
  dr.initMatrix();
  dr.ortho (-100.0, 100.0, 100.0, -100.0, near, far);
  Square(dr);
}

// Test square drawing with non-uniform scaling.
function ortho_test_scale(dr: Drawing)
{
  let nnear = -1.0;
  let ffar = -40.0;

  dr.initMatrix();
  dr.ortho (-100.0, 100.0, 100.0, -100.0, nnear, ffar);
  dr.scale (1.0, 0.5, 1.0);
  Square(dr);
}

// Test square drawing with rotation.
function ortho_test_rotate(dr: Drawing)
{
  let nnear = -1.0;
  let ffar = -40.0;

  dr.initMatrix();
  dr.ortho (-100.0, 100.0, 100.0, -100.0, nnear, ffar);
  dr.rotateZ (20);
  Square(dr);
}

// draw a square
function Square(dr: Drawing)
{
  dr.beginShape();
  
  dr.vertex (-50.0, -50.0, 10.0);
  dr.vertex (-50.0,  50.0, 10.0);

  dr.vertex (-50.0, 50.0, 10.0);
  dr.vertex ( 50.0, 50.0, 10.0);

  dr.vertex (50.0, 50.0, 10.0);
  dr.vertex (50.0, -50.0, 10.0);

  dr.vertex (50.0, -50.0, 10.0);
  dr.vertex (-50.0, -50.0, 10.0);
  
  dr.endShape();
}

// Draw a cube.
function Cube(dr: Drawing)
{
  dr.beginShape();

  /* top square */

  dr.vertex (-1.0, -1.0,  1.0);
  dr.vertex (-1.0,  1.0,  1.0);

  dr.vertex (-1.0,  1.0,  1.0);
  dr.vertex ( 1.0,  1.0,  1.0);

  dr.vertex ( 1.0,  1.0,  1.0);
  dr.vertex ( 1.0, -1.0,  1.0);

  dr.vertex ( 1.0, -1.0,  1.0);
  dr.vertex (-1.0, -1.0,  1.0);

  /* bottom square */

  dr.vertex (-1.0, -1.0, -1.0);
  dr.vertex (-1.0,  1.0, -1.0);

  dr.vertex (-1.0,  1.0, -1.0);
  dr.vertex ( 1.0,  1.0, -1.0);

  dr.vertex ( 1.0,  1.0, -1.0);
  dr.vertex ( 1.0, -1.0, -1.0);

  dr.vertex ( 1.0, -1.0, -1.0);
  dr.vertex (-1.0, -1.0, -1.0);

  /* connect top to bottom */

  dr.vertex (-1.0, -1.0, -1.0);
  dr.vertex (-1.0, -1.0,  1.0);

  dr.vertex (-1.0,  1.0, -1.0);
  dr.vertex (-1.0,  1.0,  1.0);

  dr.vertex ( 1.0,  1.0, -1.0);
  dr.vertex ( 1.0,  1.0,  1.0);

  dr.vertex ( 1.0, -1.0, -1.0);
  dr.vertex ( 1.0, -1.0,  1.0);

  dr.endShape();
}

// orthographic cube.
function ortho_cube(dr: Drawing)
{ 
  dr.initMatrix();
  dr.ortho (-2.0, 2.0, 2.0, -2.0, 0.0, -10000.0);

  dr.translate (0.0, 0.0, -4.0);
  dr.rotateY(17.0);
  Cube(dr);
}

// orthographic cube rotated.

function ortho_cube2(dr: Drawing)
{    
  dr.initMatrix();
  dr.ortho (-2.0, 2.0, 2.0, -2.0, 0.0, -10000.0);

  dr.translate (0.0, 0.0, -4.0);
  dr.rotateZ(5.0);
  dr.rotateX(25.0);
  dr.rotateY(20.0);
  Cube(dr);
}

// Perspective cube.
function perspective_cube(dr: Drawing)
{
  dr.initMatrix();
  dr.perspective (60.0, -1.0, -100.0);

  dr.translate (0.0, 0.0, -4.0);
  Cube(dr);
}

// Draw multiple cubes in perspective.
function perspective_multi_cube(dr: Drawing)
{
  dr.perspective (60.0, -1.0, -100.0);

  // draw several cubes in three lines along the axes
  for (let delta = -12; delta <= 12; delta += 3) {
    
    dr.initMatrix();
    
    dr.translate (0.0, 0.0, -20.0);
    dr.rotateZ(5);
    dr.rotateX(25);
    dr.rotateY(20);
    
    dr.translate(delta, 0, 0);
    Cube(dr);
    dr.translate(-delta, 0, 0);
    
    dr.translate(0, delta, 0);
    Cube(dr);
    dr.translate(0, -delta, 0);
    
    dr.translate(0, 0, delta);
    Cube(dr);
    dr.translate(0, 0, -delta);
  }
}

// Test the matrix stack by drawing a face.
function face_test(dr: Drawing)
{
  let nnear = 10.0;
  let ffar = -100000.0;

  dr.ortho (0.0, 1.0, 1.0, 0.0, nnear, ffar);

  face (dr, 1, 0, 0, 0);
}

// Draw four faces.
function faces(dr: Drawing)
{
  let nnear = 10.0;
  let ffar = -10000.0;

  dr.initMatrix ();

  dr.ortho (0.0, 1.0, 1.0, 0.0, nnear, ffar);

  dr.initMatrix();
  face (dr, 0.5, 0, 0.25, -0.25);

  dr.initMatrix();
  face (dr, 0.5, 0, -0.25, -0.25);

  dr.initMatrix();
  face (dr, 0.5, 0, 0.25, 0.25);

  dr.initMatrix();
  face (dr, 0.5, 30, -0.25, 0.25);
}

// Draw a face.
function face(dr: Drawing, sc: number, theta: number, dx: number, dy: number)
{
  /* head */

  dr.initMatrix();
  
  dr.translate (dx, dy, 1.0);
  dr.translate (0.5, 0.5, 0.0);
  dr.rotateZ (theta);
  dr.scale (sc, sc, 1.0);
  dr.translate (-0.5, -0.5, 0.0);
  
  dr.translate (0.5, 0.5, 0.0);
  dr.scale (0.4, 0.4, 1.0);
  Circle(dr);

  /* right eye */

  dr.initMatrix();
  
  dr.translate (dx, dy, 1.0);
  dr.translate (0.5, 0.5, 0.0);
  dr.rotateZ (theta);
  dr.scale (sc, sc, 1.0);
  dr.translate (-0.5, -0.5, 0.0);
  
  dr.translate (0.7, 0.7, 0.0);
  dr.scale (0.1, 0.1, 1.0);
  Circle(dr);

  /* left eye */

  dr.initMatrix();
  
  dr.translate (dx, dy, 1.0);
  dr.translate (0.5, 0.5, 0.0);
  dr.rotateZ (theta);
  dr.scale (sc, sc, 1.0);
  dr.translate (-0.5, -0.5, 0.0);
  
  dr.translate (0.3, 0.7, 0.0);
  dr.scale (0.1, 0.1, 1.0);
  Circle(dr);

  /* nose */

  dr.initMatrix();
  
  dr.translate (dx, dy, 1.0);
  dr.translate (0.5, 0.5, 0.0);
  dr.rotateZ (theta);
  dr.scale (sc, sc, 1.0);
  dr.translate (-0.5, -0.5, 0.0);
  
  dr.translate (0.5, 0.5, 0.0);
  dr.scale (0.07, 0.07, 1.0);
  Circle(dr);

  /* mouth */

  dr.initMatrix();
  
  dr.translate (dx, dy, 1.0);
  dr.translate (0.5, 0.5, 0.0);
  dr.rotateZ (theta);
  dr.scale (sc, sc, 1.0);
  dr.translate (-0.5, -0.5, 0.0);
  
  dr.translate (0.5, 0.25, 0.0);
  dr.scale (0.2, 0.1, 1.0);
  Circle(dr);
}

// Draw a circle of unit radius.
function Circle(dr: Drawing)
{
  let steps = 50;

  dr.beginShape();

  let x0 = 1.0;
  let y0 = 0.0;
  for (let i = 0; i <= steps; i++) {
    let theta = 2 * 3.1415926535 * i / steps;
    let x1 = Math.cos (theta);
    let y1 = Math.sin (theta);
    dr.vertex (x0, y0, 0.0);
    dr.vertex (x1, y1, 0.0);
    x0 = x1;
    y0 = y1;
  }

  dr.endShape();
}

// you should write this
function persp_initials(dr: Drawing) {
  dr.initMatrix();
  dr.perspective (60.0, -1.0, -100.0);
  dr.translate (0.0, 0.0, -4.0);
  dr.rotateZ(5);
  dr.rotateX(-20);
  dr.rotateY(5);
  drawS(dr);
  drawR(dr);
}

function drawS(dr: Drawing) {
  dr.beginShape()

  dr.vertex(-1, -1, 1);
  dr.vertex(-0.1, -0.75, 1);

  dr.vertex(-0.1, -0.75, 1);
  dr.vertex(-0.1, 0, 1);

  dr.vertex(-0.1, 0, 1);
  dr.vertex(-1, 0.25, 1);
  
  dr.vertex(-1, 0.25, 1);
  dr.vertex(-1, 1, 1);

  dr.vertex(-1, 1, 1);
  dr.vertex(-0.1, 1.25, 1);

  dr.endShape()
}

function drawR(dr: Drawing) {
  dr.beginShape()

  dr.vertex(0, -1, 1);
  dr.vertex(0, 1, 1);

  dr.vertex(0, 1, 1);
  dr.vertex(0.7, 1, 1);

  dr.vertex(0.7, 1, 1);
  dr.vertex(1, 0.5, 1);

  dr.vertex(1, 0.5, 1);
  dr.vertex(0.7, 0, 1);

  dr.vertex(0.7, 0, 1);
  dr.vertex(0, 0, 1);

  dr.vertex(0.4, 0, 1);
  dr.vertex(1, -1, 1);

  dr.endShape()
}



export {init_tests, draw_tests}