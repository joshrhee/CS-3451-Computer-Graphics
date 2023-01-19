import * as THREE from 'three';

// Hierarchy:
//                                                  Scene(root)
//                                                       |                        
//                                                  mainBox(mesh)
//                 /                                     |                                             \                    .... nose, back exhaust
//          cabin(mesh)                            wheelAttachers(Object3D)                            eyes(Object3D)
//             |                                    /                \                                    /       \
//   4 textures(canvas Texture)      frontAttacher(mesh)           backAttacher(mesh)              leftEeye(mesh)    rightEye(mesh)
//                                   /           \                   /          \
//                        leftWheel(mesh)    rightWheel(mesh)  leftWheel(mesh)   rightWheel(mesh)



// left is + right is -
// above is + down is -
// far is + near is -
export const createCar = () => {

    // mainBox
    // part 1
    const mainBox: THREE.Mesh = createMainBox(0xf3f709) //60 15 30


    // Front wheel part
    // part 2
    const frontWheelAttacher: THREE.Mesh = createWheelAttacher(0x333333); // 12 12 33
    frontWheelAttacher.translateX(18);
    frontWheelAttacher.translateY(-3)
    
    // part 3
    const frontLeftwheel: THREE.Mesh = createWheel(0xFFC0CB);
    frontWheelAttacher.add(frontLeftwheel)
    frontLeftwheel.translateY(-3);
    frontLeftwheel.translateZ(-17.5);
    
    // part 4
    const frontRightwheel: THREE.Mesh = createWheel(0xFFC0CB);
    frontWheelAttacher.add(frontRightwheel)
    frontRightwheel.translateY(-3);
    frontRightwheel.translateZ(17.5);

    
    // Back wheel part
    // part 5
    const backWheelAttacher: THREE.Mesh = createWheelAttacher(0x333333);
    backWheelAttacher.translateX(-18);
    backWheelAttacher.translateY(-3);

    // part 6
    const backLeftwheel: THREE.Mesh = createWheel(0xFFC0CB);
    backWheelAttacher.add(backLeftwheel);
    backLeftwheel.translateY(-3);
    backLeftwheel.translateZ(-17.5);

    // part 7
    const backRightwheel: THREE.Mesh = createWheel(0xFFC0CB);
    backWheelAttacher.add(backRightwheel);
    backRightwheel.translateY(-3);
    backRightwheel.translateZ(17.5);
    

    const allWheelAttachers: THREE.Object3D = new THREE.Object3D();
    allWheelAttachers.add(frontWheelAttacher, backWheelAttacher);
    mainBox.add(allWheelAttachers);


    // part 8
    const carFrontTexture: THREE.CanvasTexture = getCarFrontBackTexture(mainBox);

    // part 9
    const carBackTexture: THREE.CanvasTexture = getCarFrontBackTexture(mainBox);

    // part 10
    const carLeftSideTexture: THREE.CanvasTexture = getCarSideTexture(mainBox);

    // part 11
    const carRightSideTexture: THREE.CanvasTexture = getCarSideTexture(mainBox);

    // Putting all textures into cabin
    const cabin: THREE.Mesh = createCabin(carFrontTexture, carBackTexture, carLeftSideTexture, carRightSideTexture);
    mainBox.add(cabin);
    cabin.translateX(-6);
    cabin.translateY(13.5);


    // Eye part
    // part 12
    const leftHeadEye = headEye(0x000000);
    leftHeadEye.translateX(30);
    leftHeadEye.translateY(3);
    leftHeadEye.translateZ(-10);
    leftHeadEye.rotateY(degreeToRadian(90));

    // part 13
    const rightHeadEye = headEye(0x000000);
    rightHeadEye.translateX(30);
    rightHeadEye.translateY(3);
    rightHeadEye.translateZ(10);
    rightHeadEye.rotateY(degreeToRadian(90));
    
    const eyes = new THREE.Object3D();
    eyes.add(leftHeadEye, rightHeadEye);
    mainBox.add(eyes);

    
    // Nose
    // part 14
    const nose = createNose(0xf70707);
    nose.translateX(30);
    nose.rotateZ(degreeToRadian(-90));
    mainBox.add(nose);


    // Back exhaust part
    // part 15
    const leftExhaust = createExhaust(0x968b8b);
    leftExhaust.translateX(-32);
    leftExhaust.translateY(-5);
    leftExhaust.translateZ(-3);
    leftExhaust.rotateZ(degreeToRadian(90));

    // part 16
    const rightExhaust = createExhaust(0x968b8b);
    rightExhaust.translateX(-32);
    rightExhaust.translateY(-5);
    rightExhaust.translateZ(3);
    rightExhaust.rotateZ(degreeToRadian(90));

    // Putting all exhaust into exhaust group
    const exhausts = new THREE.Object3D();
    exhausts.add(leftExhaust, rightExhaust);
    mainBox.add(exhausts);

    return mainBox
}

function createExhaust(color: number) {
    const geometry = new THREE.CylinderGeometry( 1.3, 1.3, 4, 32 );
    const material = new THREE.MeshBasicMaterial( {color: color} );
    const cylinder = new THREE.Mesh( geometry, material );
    return cylinder
}

function createNose(color: number) {
    const geometry = new THREE.ConeGeometry( 5, 10, 32 );
    const material = new THREE.MeshBasicMaterial( {color: color} );
    const cone = new THREE.Mesh( geometry, material );
    return cone;
}

function headEye(color: number) {
    var geometry = new THREE.RingGeometry(1, 3.5, 32);
    var material = new THREE.MeshPhongMaterial({color: 0x000000});
    const blackEye = new THREE.Mesh(geometry, material);

    geometry = new THREE.RingGeometry(0, 1, 32);
    material = new THREE.MeshPhongMaterial({color: 0xffffff});
    const whiteEye = new THREE.Mesh(geometry, material);

    blackEye.add(whiteEye)

    return blackEye;
}

function getCarSideTexture(mainBox: THREE.Mesh) {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    if (context != null) {
        context.fillStyle = "#ffffff";
        context.fillRect(mainBox.position.x, mainBox.position.y, 128, 32);

        context.fillStyle = "#666666";
        context.fillRect(mainBox.position.x + 10, mainBox.position.y + 5, 38, 24);
        context.fillRect(mainBox.position.x + 58, mainBox.position.y + 5, 60, 24);
    }
    return new THREE.CanvasTexture(canvas);
}

function getCarFrontBackTexture(mainBox: THREE.Mesh) {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    if (context != null) {
        context.fillStyle = "#ffffff";
        context.fillRect(mainBox.position.x, mainBox.position.y, 64, 32);

        context.fillStyle = "#666666";
        context.fillRect(mainBox.position.x + 8, mainBox.position.y + 5, 48, 24);
    }
    return new THREE.CanvasTexture(canvas);
}

function createCabin(carFrontTexture:THREE.CanvasTexture, 
    carBackTexture:THREE.CanvasTexture, 
    carRightSideTexture:THREE.CanvasTexture, 
    carLeftSideTexture:THREE.CanvasTexture) {
    const cabin: THREE.Mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(33, 12, 24), [
        new THREE.MeshLambertMaterial({map: carFrontTexture}),
        new THREE.MeshLambertMaterial({map: carBackTexture}),
        new THREE.MeshLambertMaterial({ color: 0xffffff }), // top
        new THREE.MeshLambertMaterial({ color: 0xffffff }), // bottom
        new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
        new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
    ]);
    return cabin
}

function createMainBox(color: number) {
    const main: THREE.Mesh = new THREE.Mesh(
        new THREE.BoxBufferGeometry(60, 15, 30),
        new THREE.MeshPhongMaterial({ color: color, flatShading: true})
    );
    return main
}

function createWheel(color: number) {
    // const geometry: THREE.CircleGeometry = new THREE.CircleGeometry(2, 32);
    const geometry: THREE.TorusGeometry = new THREE.TorusGeometry( 5, 3, 20, 50 );
    const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: 0xFFC0CB});
    const wheel = new THREE.Mesh(geometry, material);
    return wheel;
}

function createWheelAttacher(color: number) {
    const geometry: THREE.BoxBufferGeometry = new THREE.BoxBufferGeometry(12, 12, 33);
    const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: color});
    const wheelAttacher = new THREE.Mesh(geometry, material);
    return wheelAttacher;
}

function degreeToRadian(degree: number) {
    return degree * Math.PI / 180;
}