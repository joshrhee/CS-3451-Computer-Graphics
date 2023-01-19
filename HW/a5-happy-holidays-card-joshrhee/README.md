@@ -0,0 +1,92 @@
# Assignment 5: Happy Holidays

## Due: Tuesday Dec 7th, 11:59pm

You will notice there is no sample code for this assignment. You can structure the assignment as you wish.  The only requirements are discussed at the bottom of this document, and are meant to simplify the job of the TAs (e.g., you should name the top-level page index.html, and follow a few simple instructions, so the TAs know how to run it).  You can use WebGL, three.js, or use another library on top of WebGL, such as http://www.babylonjs.com, etc.  (Most of you will use three.js, since that's what we've been using, but some may want to try something else, so we are leaving that open.)

## Assignment Details

For this project, you will make an interactive holiday "mobile" for the holiday of your choice, and a message specified in the URL. (By basing your code on one of the previous assignments, you will also be able to build a version you can put on your personal website, using `npm run build`. This will allow you to send people holiday greetings by configuring the URL you send them with the message you want to send them.)

The letters of the message should be hanging from "strings" of different lengths from the top of the screen. The letters should be evenly spaced across the screen, and at random heights between 1/4 and 3/4 the height of the screen (i.e., the middle half of the screen). Each letter should be "connected" to the top of the screen with a line (it's "string"). At a minimum, each letter should be represented by a single quad, but you can make the letters more elaborate if you want. Each letter should be tilted slightly to the right or left (randomly) as seen by the viewer, so that the pattern is visually interesting.  The letters could be "just the letter" (e.g., a transparent texture) or could be a solid square with the letter in it, the square could use a texture to make it look like the letter is on a piece of wood or some other material, and so on. The choice is yours.

You are free to render letters in any way you want. For ideas and guidance on how to render text, such as using textures, shapes, or fonts, start with the examples in threejs.org. You are free to use a library or sample code to generate the text characters (such as code in the threejs.org examples), or simply create the textures you want by hand (for example, using photoshop). The advantage of the latter is that you can create a rectangular texture for each letter that looks exactly like you want, with any additional decorations or styling you care to add, but it may require more up-front work.

The key part of this assignment, however, is that the mobile must be interactive:

* the message should be taken from a query parameter in the URL. Query parameters are the part of the URL after "?" (see below). You should support messages up to a maximum number of characters are (if any). You should accept (at least) letters and spaces, but can also accept other characters if you want. The message should be displayed in the middle of the screen.

* the user should be able to click on the letters.  When they do, the letters should spin, with the speed and (thus) the amount they spin based on how far from the horizontal center they click (click near the left or right edge to spin multiple times, click near the middle to spin just once). The letter should always end up facing forward again, and should decelerate smoothly from it's initial speed. (hint: you should look at the distance from the center, decide how many times to spin, and start the spin at the right speed such that it will end up facing forward.)  You can use an easing function of the sort we discussed in the animation lectures to ease the speed from fast to slow.  You can use either approach to selection we discussed in class (ray casting or the render buffer technique).

* you can allow the user to click again on a spinning letter, or not allow a letter to be clicked on again until it stops. Your choice.

* you must allow all the letters to be spinning at the same time. So make sure you associated the spinning state with each letter, do not just have one set of global state such that only one letter can be spinning.

* when the user types a letter, a sound should play.  When they click on a letter with the mouse, a different sound should play.  (you might consider using a wrapper library like [howler.js](https://howlerjs.com/) which has a TSD wrapper already built, instead of using the web audio APIs directly).

(A note about TSC types: types for thousands of Javascript libraries are in https://github.com/DefinitelyTyped/DefinitelyTyped and can be installed using npm. In this case, `npm install --save-dev @types/howler` will install the howler.js typings.  The `tsc` compiler should see any typings installed this way.)

The basic assignment does not have to adjust the size of the letters based on how much the user types, but can use a fixed size.  However, the letters should be sized and spaced such that the message "Happy Holidays" (or anything of similar or less size) can be displayed. 

For rendering lines, use the Line object in three.js.

## Grading

This assignment will be graded as follows (out of 10):
* 2 points for rendering text characters (including input and sound)
* 1 point for proper horizontal spacing (that adjusts if the window is resized horizontally)
* 1 point for proper random vertical positioning (we suggest you have your window be fixed sized vertically as in the A4 example code, but if you resize the letters should adjust accordingly)
* 1 point for drawing lines for the "strings"
* 1 point for getting the correct input from the query parameter
* 2 points for selecting a letter and spinning the letter in response (including sound)
* 1 point for properly adjusting the speed and amount of spin based on where on the letter the user clicks.
* 1 point for overall program and output appearance: reasonable title and instructions, and having the 3D window respond appropriately to window resize, clearly identifying what you did.

## URL Query Parameters

A URL with a query parameter is one that looks like this: `https://localhost:3003/?message=hi%20there`.  The `message=hi%20there` sets the parameter `message` to the value `hi%20there`.  The `%20` is a URL encoding for a space. For any string, you can get the URL encoding using the `encodeURIComponent(value)` function; for example, you could add a command like `console.log(encodeURIComponent("happy holiday mom"))` to one of your existing programs, and then you would see `happy%20holiday%20mom` in the console.  You can then use that text string as your query parameter.

To retrieve the query parameters, you look in the `search` property of the `window.location` object. Given a query string, you can extract values using the `URLSearchParams()` function.  So:
```
        const queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        let message = urlParams.get('message');
        console.log(message);
```
will store the value of the message parameter in `message` and print it out to the console.

## Leveraging code from the internet

If you copy any code from the internet (including from sites we have been using, such as the three.js examples or threejsfundamentals.org), please document it. Any code that helps you with accomplishing general 3D rendering (e.g., setting up state, etc) is fine. Code that specifically implements parts of the assignment are not fine. If in doubt, ask.  (I suspect, for example, that any code on threejsfundamentals.org is fine -- it is probably ok to start with one of their examples.  Again, just document it).

## Bonus

Unlike previous assignments, you may do additional work for bonus points.  Each of the bonus options can earn up to 3 points (2 points for meeting the requirements, up to 1 more points for particularly aesthetically interesting/pleasing results), and you may do at most 3 of them.

Possible bonus options include:

* Swinging letters. Each of the letters should be swinging very slightly (so they don't look static).  They should not be synchronized or the same speed.  You can make them swing by using the top point of the string as a rotation point and computing the bottom point of the string (where the letter is) by rotating a point the length of the string around this top point.  As with other animations, easing functions based on time should let you swing the letters in a natural way.  When the letters are clicked with the mouse, in addition to rotating as described above, the letters should continue to swing left and right.

* Snowflakes or leaves or any falling things appropriate to the holiday you have chosen.  You should have a large number of holiday-oriented things falling in the background behind the mobile, moving in a convincingly random way as they fall (i.e., by leveraging randomization techniques like Perlin noise), with flakes of different sizes as they recede in the distance.  There are many examples of creating snow in OpenGL, WebGL and three.js on the net that you can learn from, if you want.  Do NOT just copy one into your code without modifying it in some meaningful way.

* Background.  Put a complementary image in the background of the scene, and have it move as the mouse moves over to create a slight motion effect. One way to do this would be to have the image be larger than the screen, and when the mouse is to the left/below the center, move the image proportionally right/up a small amount (and vice-versa).

* Animated entrance/exit for the letters.  In the basic assignment, the letters can appear immediately in their correct location.  In this extra credit, the letters would animate into the scene (e.g., perhaps they drop in from the top into their desired position, one at a time).  Care must be taken with this extra credit is dealing with overlapping animations (e.g., if you click a letter while it or others are still coming it, it should still spin, so the letters are falling and moving; if you do the swinging letters extra credit, perhaps the letters don't start swinging till the drop in).

* Pagination.  Allow a much larger number of characters in the message by having the use additional rows if the message is longer than some reasonable maximum.  You do not have to support an infinite amount of text: pick a maximum number of lines (even two lines is sufficient). 

## Submission

You should submit your entire code directory (WITHOUT the ```node_modules``` directory generated by npm) via github, as before.  Please use a reasonable `.gitignore` (look at the ones in your previous assignments) that at least ignores the ```node_modules``.  

Make sure you submit any assets, such as image files you load in as textures.  Do not refer to resources elsewhere on the web; copy them into your project directory.

Your web page should be titled ```index.html``` and your main .ts file should be ```app.ts```, so the TAs know where to look.    

You should set up your project to build as the previous assignments, and should let the TAs cd into the directory and type:

1. cd into the directory and run ```npm install``` to install any dependencies.

2. then ```npm run dev``` to start the dev server

3. open and view the web page ```localhost:3000?message=Happy%20Holidays``` (using whatever port the server ends up using)