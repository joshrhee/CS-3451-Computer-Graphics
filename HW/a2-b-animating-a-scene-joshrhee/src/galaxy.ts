import * as THREE from 'three';

/**
 * Galaxy
 */
 const parameters = {
     count: 5000000,
     size: 0.01,
     radius: 40,
     branches: 3,
     spin: 1,
     randomness: 0.2,
     randomnessPower: 3,
     insideColor: 0xff6030,
     outsideColor: 0x1b3984
 }
//  parameters.count = 5000000;
//  parameters.size = 0.01;
//  parameters.radius = 40;
//  parameters.branches = 3;
//  parameters.spin = 1;
//  parameters.randomness = 0.2;
//  parameters.randomnessPower = 3;
//  parameters.insideColor = 0xff6030;
//  parameters.outsideColor = 0x1b3984;
 
 let galaxyGeometry = null;
 let galaxyMaterial = null;
 let galaxyPoints = null;

/**
* Generating Galaxy
*/
export const generateGalaxy = () => {
    // /**
    //  * Destory previous galaxy
    //  */
    // if (galaxyPoints !== null) {
    //   // free the memory of galaxyGeometry, galaxyMaterial, and remove galaxyPoints from scene
    //   galaxyGeometry.dispose();
    //   galaxyMaterial.dispose();
    //   scene.remove(galaxyPoints);
    // }
  
    /**
    * Geometry
    */
    galaxyGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
  
    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);
    
    
    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;
  
        // positions
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
  
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness;
  
        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX; //x-axis
        positions[i3 + 1] = 0 + randomY; //y-axis
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ; //z-axis
  
  
        // colors
        // Mixing inside and outside colors
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);
  
        colors[i3 + 0] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }
  
    galaxyGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    )
  
    galaxyGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
  )
  
    /**
    * Material
    */
    galaxyMaterial = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
  
    /**
    * Points
    */
    galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
    galaxyPoints.position.setZ(25);
    galaxyPoints.rotateX(Math.PI / 5);

    return galaxyPoints;
    
    // scene.add(galaxyPoints);
  }
//   generateGalaxy();