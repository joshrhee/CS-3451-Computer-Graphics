// abstract library
import { DrawingCommon } from './common';
import { createCar } from './car';
import { renderMap, movePlayerCar } from './road';
import { generateGalaxy } from './galaxy';
import * as THREE from 'three';

// camera motion !!!!!! Need to think about time with camera??? 
// At least 2 lights!!

// plan:
// 1. draw roads. Thinking two circles with 2 intersections (done)
// 2. run two runningCars (done)
// 3. facing direction while running (done)
// 4. show galaxy 



// Initial x is -4.5
const ANIMX = 4.9
const ANIMY = 4.3
// 3 meter per second
const ANIMSPEED = 1


// A class for our application state and functionality
class Drawing extends DrawingCommon {

    constructor (canv: HTMLElement) {
        super (canv)

        // @ts-ignore
        this.leftRunningCarAnimatedMesh = this.scene.leftRunningCarAnimatedMesh
        // @ts-ignore
        this.rightRunningCarAnimatedMesh = this.scene.rightRunningCarAnimatedMesh
        // @ts-ignore
        this.spinningCarAnimatedMesh = this.scene.spinningCarAnimatedMesh
        
    }

    //@ts-ignore
    leftRunningCarAnimatedMesh: THREE.Mesh;
    //@ts-ignore
    rightRunningCarAnimatedMesh: THREE.Mesh;
    //@ts-ignore
    spinningCarAnimatedMesh: THREE.Mesh;
    
    /*
	Set up the scene during class construction
	*/

    //Questions: 
    // How can I change camera's facing angle
    // Do I need to set different lights' position?
    // Do I need to make mouse drag?


    // Try to change groups except root node to object 3d
	initializeScene(){
        
        this.scene.background = new THREE.Color( 0x06ff60 )

        // cameras
        this.camera.lookAt(new THREE.Vector3(0, 5, 0))
        this.camera.translateZ(8)
        this.camera.translateY(-5)

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


        // 2 running cars
        const car1 = createCar();
        car1.scale.set(0.01, 0.01, 0.01);
        car1.rotateY(degreeToRadian(180));
        car1.rotateX(degreeToRadian(60));
        // car1.translateX(-8)
        

        const car2 = createCar();
        car2.scale.set(0.01, 0.01, 0.01);
        car2.translateX(10)
        car2.rotateY(degreeToRadian(180));
        car2.rotateX(degreeToRadian(60));
        // car2.translateX(18)

        // @ts-ignore
        this.scene.leftRunningCarAnimatedMesh = car1;
        this.scene.add(car1);
        // @ts-ignore
        this.scene.rightRunningCarAnimatedMesh = car2;
        this.scene.add(car2);


        // Spinning car
        const car3 = createCar();
        car3.scale.set(0.01, 0.01, 0.01);
        car3.translateZ(-0.5)        
        car3.rotateY(degreeToRadian(180));
        car3.rotateX(degreeToRadian(60));

        // @ts-ignore
        this.scene.spinningCarAnimatedMesh = car3;
        this.scene.add(car3);


        // Roads
        const mapMesh = renderMap(window.innerWidth, window.innerHeight - 100);
        // const rodeMesh = mapMesh[0];
        const landMesh = mapMesh;
        
        // this.scene.add(rodeMesh)
        this.scene.add(landMesh)

        const galaxy = generateGalaxy();
        
        // this.scene.add(galaxy)




        
        // // stars
        // Array(200).fill(THREE.Mesh).forEach(this.addStar);
        
    }

    // /**
    //  * Stars
    //  */
    // addStar = () => {
    //     const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    //     const material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    //     const star = new THREE.Mesh(geometry, material);

    //     const [x, y, z] = Array(3).fill(THREE.Mesh).map(() => THREE.MathUtils.randFloatSpread(100));
    //     star.position.set(x, y, z);
    //     this.scene.add(star);
    // }

    

    animating = false   // first time in, we grab the time as a start time
    spinning = false

    animSpeed = ANIMSPEED   // meters per second
    animDist = -2 * ANIMX     // distance of our transition

    animLengthTime = 1000 * Math.abs(2*ANIMX) / ANIMSPEED   // time for the animation

    // t1
    animStart = 0       // start and end time of this transition, based on speed and distance
    // t2
    animEnd = 0

    // x1
    animStartX = ANIMX  // start and end x position
    // x2
    animEndX = -ANIMX

    animStartY = ANIMY
    animEndY = -ANIMY
    

    // end2 = start1    
    quatStart1End2 = new THREE.Quaternion();
    quatEnd1 = new THREE.Quaternion();
    quatStart2 = new THREE.Quaternion();

    quatStart = new THREE.Quaternion();
    quatEnd = new THREE.Quaternion();

    y = new THREE.Vector3(0,1,0)

    spinCount = 0
    


	/*
	Update the scene during requestAnimationFrame callback before rendering
	*/
	updateScene(time: DOMHighResTimeStamp){
        // animating at the starting position
        if (!this.animating) {
            this.animating = true
            this.animStart = time;
            this.animEnd = this.animStart + this.animLengthTime
        }

        // if we've exceeded the motion time, flip the direction, and
        // and set the motion time to be the next interval 
        // not time == animEnd !!!!
        if (time > this.animEnd) {
            this.animStart = this.animEnd;
            this.animEnd = this.animStart + this.animLengthTime
            this.animStartX *= 1
            this.animEndX *= 1
            this.animDist *= 1

            this.animStartY *= 1
            this.animEndY *= 1
        }

        // t goes from 0..1 over the time interval
        var t = (time - this.animStart) / this.animLengthTime  

        var playerAngleMoved = t * 2 * Math.PI;
        
        const positionX = Math.cos(playerAngleMoved)
        const positionY = Math.sin(playerAngleMoved)

        this.leftRunningCarAnimatedMesh.position.x = this.animStartX * positionX + 3.2;
        this.leftRunningCarAnimatedMesh.position.y = this.animStartY * positionY + 0.5;
        this.leftRunningCarAnimatedMesh.rotation.y = playerAngleMoved //////// hmmm

        this.rightRunningCarAnimatedMesh.position.x = this.animStartX * positionX - 3;
        this.rightRunningCarAnimatedMesh.position.y = this.animStartY * positionY + 0.5
        this.rightRunningCarAnimatedMesh.rotation.y = playerAngleMoved   //////// hmmm

        this.spinningCarAnimatedMesh.rotation.y = this.animStartY * Math.tan(playerAngleMoved);
        

        // this.runningCarsAnimatedMesh.position.y = Math.cos(this.animStartY) + t * this.animDist
        // console.log(this.camera.position)
        this.camera.position.z = -11 + 2 * Math.cos(playerAngleMoved);

        
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