[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-f059dc9a6f8d3a56e377f745f24479a46679e63a5d9fe6f495e02850cd0d8118.svg)](https://classroom.github.com/online_ide?assignment_repo_id=5815465&assignment_repo_type=AssignmentRepo)
# Assignment A2b: Animation

This repository implements the starting point of a three.js program in TypeScript.

## Due: Friday October 15th, 8:00am

## Rubric

Graded out of 10.

1. Incorporate object from A2a  (2)
2. Camera motion (2)
3. Using time-based animation (no frame counting) (1)
4. Reasonable scene for the animation (1)
5. Object animation (2)
6. Parallel animation (1)
7. Creativity / effort (1 + up to 1 bonus)

## Overview and Learning Goals

The goal of this project is to learn how to use transformations and camera position to create an animated scene. This project is an extension of Project A2a, and you will incorporate your object from Project A2a into this assignment. Like Project A2a, creativity and effort is a part of this project.

Now that you have created an object for Project A2a, you should have some ideas of how you wish to incorporate it into a fully animated scene. The most interesting animated scenes, no matter how short, seek to tell a story. Introduce your character, have your character carry out an action, and then resolve the scene.

You will most likely want to create more objects to populate your scene, but these new objects can be more simple than Project A2a's object. As with A2a, you should create the objects you will need in `initializeScene()`. Your main goal for this assignment will be to make one or more of the objects in the scene move, and to also move the virtual camera through the scene. You will want to use the “time” variable passed into `updateScene(time)` to help control motion of your objects (this value measures time in milliseconds, from some arbitrary starting point).  (Note: in common.js, we get the time of the first render callback, and set `this.startTime` to it, so that you can use `time - this.startTime` in `updateScene(time)` as the time since the program started.)

Below is a checklist of elements that you must include in your scene:

### Camera Motion

We have removed the camera `OrbitControl` from the sample code. You should move the camera smoothly through the scene, rather than keeping it in one place. The scene is set up with a PerspectiveCamera stored in `this.camera`. Change the camera's position by varying position and rotation of the PerspectiveCamera object.  Just rotating or moving the entire scene while leaving the camera stationary does not count as moving the camera.

Please note that having the user press keys or move the mouse to control the camera does not count towards automatic motion of the camera. If you want to include user controls, have an automatic motion of the camera in the first part of the scene, before handing over controls to the user.

### Include Project 2A Object

You must incorporate Project 2A’s object somewhere in your scene.

### Object Animation

Include at least two object motions in the scene (distinct from the camera motion). One of these motions should include translation, and another, different motion should include rotation. If you wish, these two different motions can be for two different parts of the same object, or they can be motions of different objects. Make sure it is clear that these objects are moving, and not just changing their apparent positions due to camera motion.

### Parallel Animation

Some of your animations, including the camera and object animation, should happen in parallel for at least 2 seconds of the animation.  This means at least to things (the camera and one other object, or two objects) should be moving at the same time.

### Lighting and Shading

We have removed the lights from A2a from `common.ts`.  You must include at least two light source in your scene such that the objects in the scene are illuminated by some light source. Do not use only ambient light.  Do not add more than 8 lights total.

### Duration

Your animation should create more than 10 seconds of animation. Please create an animation that finishes in a reasonable amount of time.

If you find that your program runs slowly, it is most likely that this is due to use of many polygons in the scene. By far, the most common reason for having many polygons in this assignment is the use of lots subdivisions of objects like spheres and cones and cylinders. If you want to use many subdivisions and you have a lot of these objects, consider passing the low valued parameters for subdivision parameters to the constructor for that geometry.  The subdivisions specify how many polygons a object uses.

We will be looking for each of the above required items in your animation. Omitting any of the above elements will cause a deduction in your grade for this assignment.

## Resources (from A2a)

In this assignment, and others later in the semester, you will use the [three.js](https://threejs.org) graphics library, a very popular open-source graphics library for the web.  It is actively being developed and widely used.  

In addition to the resources on the website (including documentation and many examples), the website [threejsfundamentals.org](https://threejsfundamentals.org/) is a great resource for learning the library. I'd recommend you start there, and only refer to the threejs.org site for reference, or for specific three.js features. For this assignment, I highly recommend working through some of the Basics sections ([Fundamentals](https://threejsfundamentals.org/threejs/lessons/threejs-fundamentals.html) is a great introduction, and the other sections can be skimmed but aren't necessary for these projects), as well as the [Primitives](https://threejsfundamentals.org/threejs/lessons/threejs-primitives.html), [Scenegraph](https://threejsfundamentals.org/threejs/lessons/threejs-scenegraph.html), and some of the [Materials](https://threejsfundamentals.org/threejs/lessons/threejs-materials.html) sections in "Fundamentals".

Beyond these resources, there are many open source projects based on three.js.  While you should not be using code from the web in this and future assignments, together these resources give you a vast set of learning resources.

Of course, feel free to reach out to the instructor, TA, and your classmates for help and pointers.

## Effort is Part of the Grade

This assignment will be graded partially based on our assessment of the amount of care, effort, and creativity that you put into the scene and animations. If you choose a simple scene and throw it together, you will not get a high score on the “effort” component of this project.  1 point of the project will be based on our assessment of reasonable effort, and up to 1 addition point will be awarded for exceptional creativity.

## Optional Elements

If you wish to, you may add any three.js Materials to your scene, which includes textures and a variety of other effects. It is not necessary to add more complex Materials in order to have a successful animated scene.

Unlike part A2a, you are allowed to load external models as part of your scene. These might be objects that you have created using modeling programs such as Blender or Maya.  Note, however, that in this project we are looking for how you animate your scene, and not for your skill in modeling in these other systems. We will not count the creation of these models towards our evaluation of your effort.  Your emphasis should be on scene creation and animation with three.js.

## Authorship Rules

The code that you turn in entirely your own. You are allowed to talk to other members of the class and to the instructor and the TA’s about general implementation of the assignment. It is also fine to seek the help of others for general three.js/Typescript programming questions. You may not, however, use code that anyone other than yourself has written. The only exception is that you should use the example source code that we provide for this project. Code that is explicitly not allowed includes code taken from the Web, github, from books, from the [three.js](https://threejs.org) web site, from other assignments, from other students or from any source other than yourself. You should not show your code to other students. Feel free to seek the help of the instructor and the TA's for suggestions about debugging your code.

# Submission

You will check out the project from GitHub Classroom, and submit it there.  All of your code should be in the file `app.ts`. You may extra files if you wish to use them to structure your code.

**Do Not Change the names** of the existing files (e.g., index.html, app.ts, etc).  The TAs need to be able to test your program as follows:

1. cd into the directory and run ```npm install```
2. run with ```npm run dev```
3. visit ```http://localhost:3000/index.html```

Please test that your submission meets these requirements. For example, after you check in your final version of the assignment to github, check it out again to a new directory and make sure everything builds and runs correctly.
 
## Development Environment

The development environment is the same as used in previous assignments.

## License

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Computer Graphics CS3451 Fall 2021</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="https://github.blairmacintyre.me" property="cc:attributionName" rel="cc:attributionURL">Blair MacIntyre</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

The intent of choosing (CC BY-NC-SA 4.0) is to allow individuals and instructors at non-profit entities to use this content.  This includes not-for-profit schools (K-12 and post-secondary). For-profit entities (or people creating courses for those sites) may not use this content without permission (this includes, but is not limited to, for-profit schools and universities and commercial education sites such as Corsera, Udacity, LinkedIn Learning, and other similar sites).
