[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-f059dc9a6f8d3a56e377f745f24479a46679e63a5d9fe6f495e02850cd0d8118.svg)](https://classroom.github.com/online_ide?assignment_repo_id=5518008&assignment_repo_type=AssignmentRepo)
# Assignment 1a:  Transformation Matrices

This project is designed to familiarize you with the basics of creating 3D transformation matrices. You will also use this project as the basis for the second part of Project 1.

## Due: Saturday September 11st, 11:59pm

## Rubric

Graded out of 10.

1. (3 points) 1 point each for implementing `init()`, `print()`, and `currentMatrix()` correctly
2. (5 points) 1 point each for creating the correct transformation matrix in each of `translate(x,y,z)`, `scale(x,y,z)`, `rotateX(angle)`, `rotateY(angle)`, and `rotateX(angle)`.
3. (1 point) implement matrix multiplication correctly.
4. (1 point) correctly multiply the transformation matrices in each of `translate(x,y,z)`, `scale(x,y,z)`, `rotateX(angle)`, `rotateY(angle)`, and `rotateX(angle)` with the `ctm`, updating the `ctm`.

## Overview and Learning Goals

In order to familiarize you with matrix transformations and operations, you will be completing the empty methods that are modeled loosely on the similar commands from traditional graphics libraries like OpenGL. Such libraries had the notion of a "current transformation matrix" (`ctm`) that you would operate on with a series of commands.

You will write code to do the following in `matrix.ts`:

1. Write the code for `init()` that initializes the `ctm` to the 4x4 identity matrix.

2. Write code in `print()` to print the `ctm` to the browser console using [console.log](https://developer.mozilla.org/en-US/docs/Web/API/Console/log).  Make sure your matrix prints on four separate rows.  Also, to make your output easier to read, have this command print an empty line after the last row.  Example output from print():
```
1, 0, 0, 0
0, 1, 0, 0
0, 0, 1, 0
0, 0, 0, 1

```

3. Write code for `currentMatrix()` to return the `ctm` as an array of 16 numbers in row major order (i.e., elements 0..3 are row 1 of `ctm`, 4..7 are row2 of `ctm`, 8..11 are row3 of `ctm`, and 12..15 are row4 of `ctm`).

3. Create an internal routine (i.e., one that is not exported from `matrix.ts`) that does 4x4 matrix multiplication, to be used in the next step.

4. Create 4x4 scale, translate, and simple rotation matrices, and multiply `ctm` with this newly-created matrix.  For rotations, the angles that are passed into these routines will be in degrees. The names of the commands that you will implement are `scale(x,y,z)`, `translate(x,y,z)`, `rotateX(angle)`, `rotateY(angle)`, and `rotateZ(angle)`. For instance, `scale` will cause the following change to the current transformation matrix: `new_ctm = old_ctm * scale_matrix`.  Note that multiplication of the new transformation on the right of `ctm` matches OpenGL's policy of having the last transformation that you specify affect an object's vertices first.

# Carrying Out the Assignment

The provided source code gives you empty methods for each of the operations listed above in `matrix.ts`. The provided code also tests these matrix commands, calling various commands and then printing the current transformation matrix to show the result. These tests are in the routine `mat_test()` in `matrix_test.ts`.  You will need to open the console in browser window to view the printed results.  See below for output from this test.

You should modify the source code in any way you see fit to satisfy the requirements.  Feel free to define classes, create helper routines, and use variables within the module. Resist the temptation to over-engineer the solution, however; your code does not need to generalize to other use cases or matrix sizes. You should also comment your code and include your name in the header. The source code is written in Typescript. 

You should create your own 4x4 matrix data type and your own 4x4 matrix multiplication routine.  To make sure that all students are limited to using the same resources, you may NOT use external JavaScript libraries, including libraries that define and/or manipulate matrices, vectors, lists, or that do formatted printing. When in doubt about what routines you may use, ask the instructor.

# Authorship Rules

The code that you turn in is entirely your own. You are allowed to talk to other members of the class and to the instructor and the TA’s about general implementation of the assignment. It is also fine to seek the help of others for general Typescript programming questions. You may not, however, use code that anyone other than yourself has written. The only exception is that you should start with the source code that we provide for this project. Code that is explicitly not allowed includes code taken from the Web, GitHub, from books, from other assignments or from any source other than yourself. You should not show your code to other students. Feel free to seek the help of the instructor and the TAs for suggestions about debugging your code.

# Submission

You will check out the project from GitHub Classroom, and submit it there.  All of your code should be in the file `matrix.ts`. Do not add extra files.

**Do Not Change the names** of the existing files (e.g., index.html, app.ts, etc).  The TAs need to be able to test your program as follows:

1. cd into the directory and run ```npm install```
2. run with ```npm run dev```
3. visit ```http://localhost:3000/index.html```

Please test that your submission meets these requirements.  For example, after you check in your final version of the assignment to github, check it out again to a new directory and make sure everything builds and runs correctly.
 
## Development Environment

The development environment is the same as used in A0 and in the Ex1 sample.

## Results from `mat_test()`

Below are the results that your code should produce when the test routine is run.  Keep in mind that your values and these might differ very sightly due to numerical precision issues, and this is fine.  In particular, some of the rotation results may produce numbers that are very small but not quite zero.

```
init()
1, 0, 0, 0
0, 1, 0, 0
0, 0, 1, 0
0, 0, 0, 1

translate (3, 2, 1.5)
1, 0, 0, 3
0, 1, 0, 2
0, 0, 1, 1.5
0, 0, 0, 1

scale (2, 3, 4)
2, 0, 0, 0
0, 3, 0, 0
0, 0, 4, 0
0, 0, 0, 1

rotateX (90)
1, 0, 0, 0
0, 6.123233995736766e-17, -1, 0
0, 1, 6.123233995736766e-17, 0
0, 0, 0, 1

rotateY (-15)
0.9659258262890683, 0, -0.25881904510252074, 0
0, 1, 0, 0
0.25881904510252074, 0, 0.9659258262890683, 0
0, 0, 0, 1

rotateZ (45) and init()
0.7071067811865476, -0.7071067811865475, 0, 0
0.7071067811865475, 0.7071067811865476, 0, 0
0, 0, 1, 0
0, 0, 0, 1

1, 0, 0, 0
0, 1, 0, 0
0, 0, 1, 0
0, 0, 0, 1

translate (1.5, 2.5, 3.5) and scale (2, 2, 2)
2, 0, 0, 1.5
0, 2, 0, 2.5
0, 0, 2, 3.5
0, 0, 0, 1

currentMatrix() = 2,0,0,1.5,0,2,0,2.5,0,0,2,3.5,0,0,0,1

scale (4, 2, 0.5) and translate (2, -2, 10)
4, 0, 0, 8
0, 2, 0, -4
0, 0, 0.5, 5
0, 0, 0, 1

scale (2, 2, 2), print, init(), and translate (3.14159, 2.71828, 1.61803)
2, 0, 0, 0
0, 2, 0, 0
0, 0, 2, 0
0, 0, 0, 1

1, 0, 0, 3.14159
0, 1, 0, 2.71828
0, 0, 1, 1.61803
0, 0, 0, 1

currentMatrix() = 1,0,0,3.142,0,1,0,2.718,0,0,1,1.618,0,0,0,1

Multiple mat.scales and mat.translates
1, 0, 0, 0
0, 1, 0, 0
0, 0, 1, 0
0, 0, 0, 1

1, 0, 0, 0
0, 1, 0, 0
0, 0, 1, 0
0, 0, 0, 1
```
