// Reference: 
//  - https://threejs.org/docs/
//  - https://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z


import { DrawingCommon } from './common';
import * as THREE from 'three';
import { Howl } from 'howler';

// Todo:
// 1. Spinning is so buggy... only spinning if the screen is not full screen....
// Extra credit:
//      5. Multiple lines of messages

// Quesion:
//  1. How do you think of spinning?
//  2. Clicking is a little bit buggy... and centering is also not perfect. They might have some common problem.


// Initial x is -4.5
const ANIMX = 4.9
const ANIMY = 4.3
// 3 meter per second
const ANIMSPEED = 2


interface Letter {
    textMesh: THREE.Mesh,
    startTime: number | null,
    endTime: number,
    finalAngle: number,
    isSpin: boolean,
    spinningCount: number,
    spinningSpeed: number,
    yPopingStartPostion: number,
    yPopingEndPosition: number,
    isSpingRight: boolean,
}

function getRandomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

class SnowFlake {
    snowFlakeMesh: THREE.Mesh;
    velocity: THREE.Vector2;

    constructor(snowFlakeImage: THREE.Texture) {
        const geometry = new THREE.CircleGeometry(getRandomNumber(0, 2))

        // let material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: snowFlakeImage });
        let material = new THREE.MeshBasicMaterial({ color: 0xffffff});

        this.velocity = new THREE.Vector2(getRandomNumber(-1, 1), getRandomNumber(-1, 1));
        
        this.snowFlakeMesh = new THREE.Mesh(geometry, material);
        this.snowFlakeMesh.position.x = getRandomNumber(-window.innerWidth * 2, window.innerWidth * 2);
        this.snowFlakeMesh.position.y = getRandomNumber(-window.innerHeight * 2, window.innerHeight * 2);
        this.snowFlakeMesh.position.z = getRandomNumber(-100, -50);
    }
}


// A class for our application state and functionality
class Drawing extends DrawingCommon {

    constructor (canv: HTMLElement) {
        super (canv)

        this.letterMeshes = [];
        this.snows = [];
    }

    letterMeshes: Letter[];
    snows: SnowFlake[];

    christmasBackground: THREE.Mesh | undefined;

    snowFlakeVelocity = new THREE.Vector2(getRandomNumber(0.1, 1), getRandomNumber(0.1, 1));

    // Sound
    sound = new Howl({
        src: ['./assets/bell.mp3'],
    });


    // Animattions
    animLengthTime = 1000 * Math.abs(2*ANIMX) / ANIMSPEED   // time for the animation

    // t1
    spinningStartTime = 0       // start and end time of this transition, based on speed and distance
    // t2
    spinningEndTime = 0
    

    
    /*
	Set up the scene during class construction
	*/
    
    canvas = this.renderer.domElement;

    sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    
	initializeScene(){
        window.addEventListener('resize', () =>
        {
            // Update sizes
            this.sizes.width = window.innerWidth
            this.sizes.height = window.innerHeight

            // Update camera
            this.camera.aspect = this.sizes.width / this.sizes.height
            this.camera.updateProjectionMatrix()

            // Update renderer
            this.renderer.setSize(this.sizes.width, this.sizes.height)
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })

        // cameras
        this.camera.translateZ(18);
        this.addLights();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.addChristmasBackground();

        let message = this.getMessageFromUrl();
        this.addLettersToScene(message);

        
        this.addSnowFlakes();
        
        const mouse = new THREE.Vector2();

        // window.addEventListener('mousemove', (event) => {
        //     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        //     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        // })


        const raycaster = new THREE.Raycaster();
        window.addEventListener('click', (event) => {

            const threejsClickMousePosition = this.conver2DPositionTO3DPosition(event.clientX - 15, event.clientY);

            // Textmesh will be intersected if the textmesh is clicked
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.letterMeshes.map(mesh => mesh.textMesh));

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Checking any mesh is in mouse click position and spin if it is
            for (let i = 0; i < this.letterMeshes.length; i++) {
                const currLetterMesh = this.letterMeshes[i].textMesh;
                

                // // raycasting version, but so buggy...
                
                // // No intersection, so no clicked Textmeshs
                // if (intersects.length <= 0) {
                //     continue;
                // }    

                // // Not do spinning if the Textmesh is not intersected
                // if (intersects[0].object !== currLetterMesh) {
                //     continue;
                // }

                // // Prevent clicking while the letter is spinning
                // if (this.letterMeshes[i].isSpin) {
                //     continue;
                // }

                // // console.log("Clicked on letter: ", this.letterMeshes[i].textMesh.name);

                // this.letterMeshes[i].finalAngle = Math.PI * 2 * 3;
                // this.letterMeshes[i].isSpin = true;
                // this.letterMeshes[i].startTime = null;
                
                // // May be there is a better way to do this!!!!!!!!!
                // this.letterMeshes[i].spinningCount = this.clickedPositionRatio(threejsClickMousePosition.x, currLetterMesh);
                // this.letterMeshes[i].spinningSpeed = this.clickedPositionRatio(threejsClickMousePosition.x, currLetterMesh);

                // this.sound.play();

                if (currLetterMesh.geometry.boundingSphere == undefined) {
                    console.log("boundingSphere is undefined");
                    return
                }

                if (currLetterMesh.position.x + 0.3 < threejsClickMousePosition.x && currLetterMesh.position.x + 1 > threejsClickMousePosition.x - 0.3) {
                    if (currLetterMesh.position.y < threejsClickMousePosition.y && currLetterMesh.position.y > threejsClickMousePosition.y - 0.5) {
                        // console.log("clicked mesh: ", currLetterMesh.name);

                        // Prevent clicking while the letter is spinning
                        if (this.letterMeshes[i].isSpin) {
                            continue;
                        }

                        this.letterMeshes[i].finalAngle = Math.PI * 2 * 3;
                        this.letterMeshes[i].isSpin = true;
                        this.letterMeshes[i].startTime = null;
                        
                        this.letterMeshes[i].spinningCount = this.clickedPositionRatio(threejsClickMousePosition.x, currLetterMesh, this.letterMeshes[i]);
                        this.letterMeshes[i].spinningSpeed = this.clickedPositionRatio(threejsClickMousePosition.x, currLetterMesh, this.letterMeshes[i]) * 1.5;

                        
                        this.sound.play();
                    }
                }



            }
        });
        
        console.log("scene: ", this.scene);
    }

    // round(abs(textMesh.x - clickPositionX)) => spin speed and cound
    clickedPositionRatio(clickX: number, textMesh: THREE.Mesh, meshInterface: Letter) {
        
        let someVector = new THREE.Vector3();
        textMesh.getWorldPosition(someVector);

        let spaceRatio = Math.abs(someVector.x - clickX);
        // console.log("Before isSpinningright updated: ", meshInterface.isSpingRight)
        meshInterface.isSpingRight = spaceRatio - 0.8 > 0;
        // console.log("After isSpinningright updated: ", meshInterface.isSpingRight)
        spaceRatio = Math.abs(spaceRatio - 0.8);
        
        
        // console.log("space ratio: ", spaceRatio);

        let spinningCount = 0;
        if (spaceRatio < 0.1) {
            spinningCount = 1;
        } else if (0.1 < spaceRatio && spaceRatio < 0.2) {
            spinningCount = 2;
        } else {
            spinningCount = 3;
        }

        return spinningCount;
        
        // const spaceRatio = Math.abs(textMesh.position.x / - clickX) / 3

        // let spinningCount = 0;
        // const currDistance = Math.abs(textMesh.position.x - clickX);

        // if (currDistance < spaceRatio) {
        //     spinningCount = 1;
        // } else if (spaceRatio <= currDistance && currDistance < spaceRatio * 2){
        //     spinningCount = 2;
        // } else {
        //     spinningCount = 3;
        // }

        // return spinningCount;


        // let ratio = Math.floor(Math.abs(textMesh.position.x / - clickX) * 10);
        
        // Need to think about better calculations...

        // console.log("clickX: ", clickX);
        // console.log("textMesh.position.x: ", textMesh.position.x);
        // console.log("subtract: ", Math.abs(textMesh.position.x - clickX));
        // console.log("ratio: ", ratio);

        // return ratio;
    }

    conver2DPositionTO3DPosition(x: number, y: number) {
        // Converting 2d mouseclick position to 3d position
        let clickMouseVector = new THREE.Vector3();
        let clickMousePosition = new THREE.Vector3();

        clickMouseVector.set(
            (x / this.canvas.clientWidth) * 2 - 1, 
            -(y / this.canvas.clientHeight) * 2 + 1, 
            0.5);

        clickMouseVector.unproject(this.camera);
        clickMouseVector.sub(this.camera.position).normalize();
        let distance = -this.camera.position.z / clickMouseVector.z;
        clickMousePosition.copy(this.camera.position).add(clickMouseVector.multiplyScalar(distance));

        return clickMousePosition;
    }

    // snowFlakeLooping(snowFlakeImage: THREE.Texture, snowFlakeLength: number) {
    //     for (let i = 0; i < snowFlakeLength; i++) {
    //         const currSnowFlake = new SnowFlake(snowFlakeImage);
    //         this.snows.push(currSnowFlake);
    //         this.scene.add(currSnowFlake.snowFlakeMesh);
    //     }
    // }
    
    addSnowFlakes() {
        const loader = new THREE.TextureLoader();
        loader.load('./assets/snowFlake.jpg', (snowFlakeImage) => {

            let snowFlakeLength = 3000;
            for (let i = 0; i < snowFlakeLength; i++) {
                const currSnowFlake = new SnowFlake(snowFlakeImage);
                this.snows.push(currSnowFlake);
                this.scene.add(currSnowFlake.snowFlakeMesh);
            }

        })
    }

    addLettersToScene(message: String | null) {
        if (message == null || message == "") {
            message = "Please type message!";
        }

        // not perfert center...
        const xStartingPosition = this.camera.position.x - message.length * 0.6;

        let letterXPosition = xStartingPosition;
        const letterYposition = -8.5;
        for (let i = 0; i < message.length; i++) {
            
            let letterYPopingEndPosition = THREE.MathUtils.randFloat(-0.5, 0.5);
            
            const currChar = message.charAt(i);

            // Not working!!!!!!
            // reset x position if line moves to level 2
            if (i == 20) {
                letterXPosition = xStartingPosition;
            }
            // move y position level 1 to level 2
            if (i >= 20) {
                letterYPopingEndPosition = THREE.MathUtils.randFloat(-2.5, -1.5);
            }
            
            if (currChar == " ") {
                continue;
            }
            
            let myPosition = letterXPosition
            const loader = new THREE.FontLoader();
            loader.load('./assets/helvetiker_bold.typeface.json',  (font) => {
                const textGeometry = new THREE.TextGeometry(currChar, {
                    font: font,
                    size: 1,  
                    height: 0.1,
                    bevelEnabled: false,
                    bevelThickness: 0,
                    bevelSize: 0,
                    bevelOffset: 0,
                    bevelSegments: 0
                });
                textGeometry.computeBoundingBox();
                

                const textMaterial = new THREE.MeshPhongMaterial({ color: "blue" });
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                textMesh.name = currChar;
                textMesh.position.x = myPosition;
                textMesh.position.y = letterYposition;


                this.addHanger(textMesh);

                // letterXPosition += 1.3;

                // currChar2DPosition.x = Math.round((textMesh.position.x + 1) * window.innerWidth / 2);
                // currChar2DPosition.y = Math.round((textMesh.position.y + 1) * window.innerHeight / 2);
                
                this.scene.add(textMesh);
                this.letterMeshes.push({
                    textMesh: textMesh,
                    startTime: this.spinningStartTime,
                    endTime: this.spinningEndTime,
                    finalAngle: 0,
                    isSpin: false,
                    spinningCount: 1,
                    spinningSpeed: 1,
                    yPopingStartPostion: -3,
                    yPopingEndPosition: letterYPopingEndPosition,
                    isSpingRight: true
                });
            })
            letterXPosition += 1.3;
        }
    }

    getMessageFromUrl() {
        const queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        let message: String | null = urlParams.get('message');
        return message;
    }

    addHanger(textMesh: THREE.Mesh) {
        let height = textMesh.position.y - 100;
        
        

        const geometry = new THREE.BoxGeometry(0.02, height, 0.02);
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const hangerMesh = new THREE.Mesh(geometry, material);

        hangerMesh.translateY(-height/2)

        // Try to show smooth attach hanger with textMesh
        let radius = 0.5;
        if (textMesh.geometry.boundingSphere != null) {
            radius = textMesh.geometry.boundingSphere.radius;
        }

        hangerMesh.translateX(radius)
        hangerMesh.translateY(radius / 0.9)
        hangerMesh.translateZ(radius / 10)
        hangerMesh.name = textMesh.name + "'s Hanger";

        textMesh.add(hangerMesh);
    }

    addChristmasBackground() {
        const christmasTextrue = THREE.ImageUtils.loadTexture( './assets/background.jpg' );
        
        this.scene.background = christmasTextrue
    }

    addLights() {
        // need to make 2 lights
        const lightcolor = 0xffff80; // light yellow, lemon
        const intensity1 = 1;
        const light1 = new THREE.AmbientLight(lightcolor, intensity1);
        this.scene.add(light1);

        const ligh2SkyColor = 0x65f79f; //light green, skyblue
        const light2GroundColor = 0xff7b00 // orange
        const intensity2 = 1;
        const light2 = new THREE.HemisphereLight(ligh2SkyColor, light2GroundColor, intensity2);
        light2.translateX(-100)
        light2.translateY(100)
        light2.translateZ(100)
        this.scene.add(light2)
    }


	
	// Update the scene during requestAnimationFrame callback before rendering
    letterPotingTime = 0;
	updateScene(time: DOMHighResTimeStamp){
        


        // Falling snowflakes
        for (let i = 0; i < this.snows.length; i++) {
            const currSnowFlake = this.snows[i];
            
            currSnowFlake.snowFlakeMesh.position.x += this.snowFlakeVelocity.x;
            currSnowFlake.snowFlakeMesh.position.y -= this.snowFlakeVelocity.y;

            // console.log("snowflake: ", currSnowFlake.snowFlakeMesh.position.x, currSnowFlake.snowFlakeMesh.position.y);
            if (currSnowFlake.snowFlakeMesh.position.y < -100) {
                currSnowFlake.snowFlakeMesh.position.y += 200;
            }
            if (currSnowFlake.snowFlakeMesh.position.x > 600) {
                currSnowFlake.snowFlakeMesh.position.x -= 1200;
            } else if (currSnowFlake.snowFlakeMesh.position.x < -600) {
                currSnowFlake.snowFlakeMesh.position.x += 1200;
            }
        }

        // Spinning letter
        for (let i = 0; i < this.letterMeshes.length; i++) {
            const currLetterMesh = this.letterMeshes[i];
            const currLetterMeshYDowningRatio = 0.1;
            
            if (currLetterMesh.textMesh.position.y < currLetterMesh.yPopingEndPosition) {
                currLetterMesh.textMesh.position.y += currLetterMeshYDowningRatio;
            }

            let isSpinning = currLetterMesh.isSpin;
            if (!isSpinning) {
                continue;
            }

            let spinningStartTime = currLetterMesh.startTime;
            if (spinningStartTime == null) {
                currLetterMesh.startTime = time 
                spinningStartTime = currLetterMesh.startTime;           
            }

            if (spinningStartTime == null) {
                currLetterMesh.startTime = time  
            }
            let spinningEndTime = spinningStartTime + this.animLengthTime;

            var spinningSpeed = currLetterMesh.spinningSpeed;
            var spinningCount = currLetterMesh.spinningCount;

            // t goes from 0..1 over the time interval
            var t = (time - spinningStartTime) / this.animLengthTime * spinningSpeed;
            if (t < 0) {
                t = 0;
            }
            if (t > spinningCount) {
                currLetterMesh.isSpin = false;
            }

            let pi = Math.PI;
            console.log("currLetterMesh.isSpiningRight: ", currLetterMesh.isSpingRight);
            if (currLetterMesh.isSpingRight) {
                pi = -Math.PI;
            }
            var playerAngleMoved = t * 2 * pi;
            

            currLetterMesh.textMesh.rotation.y = playerAngleMoved;

        }
        
        

        
    }
    
}

function degreeToRadian(degree: number) {
    return degree * Math.PI / 180;
}


// a global variable for our state.  We implement the drawing as a class, and 
// will have one instance
var myDrawing: Drawing;

// main function that we call below.
// This is done to keep things together and keep the variables created self contained.
// It is a common pattern on the web, since otherwise the variables below woudl be in 
// the global name space.  Not a huge deal here, of course.

function exec() {
    // find our container
    var div = document.getElementById("drawing");

    if (!div) {
        console.warn("Your HTML page needs a DIV with id='drawing'")
        return;
    }

    // create a Drawing object
    myDrawing = new Drawing(div);


}

exec()