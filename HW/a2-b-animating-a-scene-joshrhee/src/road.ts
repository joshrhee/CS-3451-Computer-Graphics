import * as THREE from 'three';

const roadRadius = 225;
const roadkWidth = 45;
const innerRadius = roadRadius - roadkWidth;
const outerRadius = roadRadius + roadkWidth;

// arcLeftAngle
const arcAngle1 = Math.PI * (1 / 3);
const arcAngle1sY = Math.sin(arcAngle1) * innerRadius;

// arcRightAngle
const arcAngle2 = Math.asin(arcAngle1sY / outerRadius);

// roadCenter x
const arcCenterX = (Math.cos(arcAngle1) * innerRadius + Math.cos(arcAngle2) * outerRadius) / 2;


const arcAngle3 = Math.acos(arcCenterX / innerRadius);

const arcAngle4 = Math.acos(arcCenterX / outerRadius);


// return [planeMesh, landMesh]
export const renderMap = (mapWidth: number, mapHeight: number) => {
    //Line markings for road track
    // const lineMarkCanvTexture = getLineMarkings(mapWidth, mapHeight);

    const planeGeometry = new THREE.PlaneBufferGeometry(mapWidth, mapHeight);
    // const planeMaterial = new THREE.MeshLambertMaterial({map: lineMarkCanvTexture});
    // const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    // planeMesh.scale.set(0.02, 0.02, 0.02);
    // planeMesh.rotateX(degreeToRadian(20));


    //land Mesh
    const leftLand = getLeftLand();
    const rightLand = getRightLand();
    const middleLand = getMiddleLand()
    const outerField = getOuterField(mapWidth, mapHeight);

    const landGeomoetry = new THREE.ExtrudeGeometry(
        [leftLand, middleLand, rightLand, outerField],
        {depth: 0, bevelEnabled: false} // what is depth and bevelEnabled?
    );

    const landMesh = new THREE.Mesh(landGeomoetry, [
        new THREE.MeshLambertMaterial({ color: 0x3b2ce8}) 
    ])
    landMesh.scale.set(0.02, 0.02, 0.02);
    // landMesh.rotateX(degreeToRadian(20));

    return landMesh
}

const getLeftLand = () => {
    const leftLand = new THREE.Shape();

    leftLand.absarc(
        -arcCenterX,
        0,
        innerRadius,
        arcAngle1,
        -arcAngle1,
        false
    );

    leftLand.absarc(
        arcCenterX,
        0,
        outerRadius,
        Math.PI + arcAngle2,
        Math.PI - arcAngle2,
        true
    );

    return leftLand;
}

const getMiddleLand = () => {
    const middleLand = new THREE.Shape();

    middleLand.absarc(
        -arcCenterX,
        0,
        innerRadius,
        arcAngle3,
        -arcAngle3,
        true
    );
    middleLand.absarc(
        arcCenterX,
        0,
        innerRadius,
        Math.PI + arcAngle3,
        Math.PI - arcAngle3,
        true
    );

    return middleLand;
}

const getRightLand = () => {
    const rightLand = new THREE.Shape();

    rightLand.absarc(
        arcCenterX,
        0,
        innerRadius,
        Math.PI - arcAngle1,
        Math.PI + arcAngle1,
        true
    );

    rightLand.absarc(
        -arcCenterX,
        0,
        outerRadius,
        -arcAngle2,
        arcAngle2,
        false
    );

    return rightLand;
}

const getOuterField = (mapWidth: number, mapHeight: number) => {
    const outerField = new THREE.Shape();

    outerField.moveTo(-mapWidth / 2, -mapHeight / 2);
    outerField.lineTo(0, -mapHeight / 2);

    outerField.absarc(
        -arcCenterX,
        0,
        outerRadius,
        -arcAngle4,
        arcAngle4,
        true
    );

    outerField.absarc(
        arcCenterX,
        0,
        outerRadius,
        Math.PI - arcAngle4,
        Math.PI + arcAngle4,
        true
    );

    outerField.lineTo(0, -mapHeight / 2);
    outerField.lineTo(mapWidth / 2, -mapHeight / 2);
    outerField.lineTo(mapWidth / 2, mapHeight / 2);
    outerField.lineTo(-mapWidth / 2, mapHeight / 2);


    return outerField;
}

const getLineMarkings = (mapWidth: number, mapHeight: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    const context = canvas.getContext("2d");

    if (context == null) {
        return
    }
    context.fillStyle = "#00ffae";
    context.fillRect(0, 0, mapWidth, mapHeight);

    context.lineWidth = 2;
    context.strokeStyle = "#E0FFFF";
    context.setLineDash([10, 14]);

    //Left Circle
    context.beginPath();
    context.arc(
        mapWidth / 2 - arcCenterX,
        mapHeight / 2,
        roadRadius,
        0,
        Math.PI * 2
    );
    context.stroke();

    //Right Circle
    context.beginPath();
    context.arc(
        mapWidth / 2 + arcCenterX,
        mapHeight / 2,
        roadRadius,
        0,
        Math.PI * 2
    );
    context.stroke();

   

   

    return new THREE.CanvasTexture(canvas);
}


// animation
// let playerAngleMoved: number;
const playerAngleInitial = Math.PI;
const speed = 0.0017;
let accelerate: Boolean;
let decelerate: Boolean;


export const movePlayerCar = (timeDelta: number, car: THREE.Mesh, playerAngleMoved: number) => {
    const playerSpeed = getPlayerSpeed();
    playerAngleMoved -= playerSpeed * timeDelta;

    const totalPlayerAngle = playerAngleInitial + playerAngleMoved;

    const positionX = Math.cos(totalPlayerAngle) * roadRadius - arcCenterX;
    const positionY = Math.sin(totalPlayerAngle) * roadRadius;

    car.position.x = positionX;
    car.position.y = positionY;

    car.rotation.z = totalPlayerAngle - Math.PI / 2;
}

const getPlayerSpeed = () => {
    if (accelerate) {
        return speed * 2;
    }
    if (decelerate) {
        return speed * 0.05;
    }
    return speed;
}



function degreeToRadian(degree: number) {
    return degree * Math.PI / 180;
}