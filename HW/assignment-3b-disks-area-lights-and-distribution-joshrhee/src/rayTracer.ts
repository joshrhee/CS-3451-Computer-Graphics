// Need to do or fix:
//      jittering looks weird
//      Shadow looks weird when distirbuted



//      How can I start reflective and bluring



function lessEpsilon(num: number){ 
    return Math.abs(num) < 1e-10; 
} 
function greaterEpsilon(num: number){ 
    return Math.abs(num) > 1e-10; 
} 
  
// classes from the Typescript RayTracer sample
export class Vector {
    constructor(public x: number,
                public y: number,
                public z: number) {
    }
    static times(k: number, v: Vector) { return new Vector(k * v.x, k * v.y, k * v.z); }
    static minus(v1: Vector, v2: Vector) { return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z); }
    static plus(v1: Vector, v2: Vector) { return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z); }
    static dot(v1: Vector, v2: Vector) { return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z; }
    static mag(v: Vector) { return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z); }
    static norm(v: Vector) {
        var mag = Vector.mag(v);
        var div = (mag === 0) ? Infinity : 1.0 / mag;
        return Vector.times(div, v);
    }
    static cross(v1: Vector, v2: Vector) {
        return new Vector(v1.y * v2.z - v1.z * v2.y,
                          v1.z * v2.x - v1.x * v2.z,
                          v1.x * v2.y - v1.y * v2.x);
    }
}

export class Color {
    constructor(public r: number,
                public g: number,
                public b: number) {
    }
    static scale(k: number, v: Color) { return new Color(k * v.r, k * v.g, k * v.b); }
    static plus(v1: Color, v2: Color) { return new Color(v1.r + v2.r, v1.g + v2.g, v1.b + v2.b); }
    static times(v1: Color, v2: Color) { return new Color(v1.r * v2.r, v1.g * v2.g, v1.b * v2.b); }
    static white = new Color(1.0, 1.0, 1.0);
    static grey = new Color(0.5, 0.5, 0.5);
    static black = new Color(0.0, 0.0, 0.0);
    static lightness(c: Color) { return Math.sqrt(c.r * c.r + c.g * c.g + c.b * c.b); }
    static toDrawingColor(c: Color) {
        var legalize = (d: number) => d > 1 ? 1 : d;
        return {
            r: Math.floor(legalize(c.r) * 255),
            g: Math.floor(legalize(c.g) * 255),
            b: Math.floor(legalize(c.b) * 255)
        }
    }
}

interface Ray {
    start: Vector;
    dir: Vector;
}

// a suggested interface for jitter samples
interface Sample {
    s: number,
    t: number
}

interface Camera {
    position: Vector,
    u: Vector,
    v: Vector,
    w: Vector
}

interface Light {
    position: Vector,
    color: Color
    // r: number,
    // g: number,
    // b: number
}

interface AmbientLight {
    color: Color
}

interface AreaLight {
    color: Color,
    position: Vector,
    u: Vector,
    v: Vector
}

class Sphere {
    position: Vector
    originalPosition: Vector
    bluredPosition: Vector
    radius: number
    dr: number
    dg: number
    db: number
    k_ambient: number
    k_specular: number
    specular_power: number
    vx: number
    vy: number
    vz: number

    constructor(
        position: Vector,
        originalPosition: Vector,
        bluredPosition: Vector,
        radius: number,
        dr: number,
        dg: number,
        db: number,
        k_ambient: number,
        k_specular: number,
        specular_power: number,
        vx: number,
        vy: number,
        vz: number,) {

            this.position = position
            this.originalPosition = originalPosition
            this.bluredPosition = bluredPosition
            this.radius = radius
            this.dr = dr
            this.dg = dg
            this.db = db
            this.k_ambient = k_ambient
            this.k_specular = k_specular
            this.specular_power = specular_power
            this.vx = vx
            this.vy = vy
            this.vz = vz

    }

    bluringPosition() {
        const randomValue = Math.random()
        const bluredX = this.originalPosition.x + (2 * randomValue - 1) * this.vx
        const bluredY = this.originalPosition.y + (2 * randomValue - 1) * this.vy
        const bluredZ = this.originalPosition.z + (2 * randomValue - 1) * this.vz
        this.position = new Vector(bluredX, bluredY, bluredZ)
    }

    getIntersection(ray: Ray, currObject: Sphere | Disk) {
        const dx = ray.dir.x;
        const dy = ray.dir.y;
        const dz = ray.dir.z;

        const xe = ray.start.x - currObject.position.x;
        const ye = ray.start.y - currObject.position.y;
        const ze = ray.start.z - currObject.position.z;

        const a = (dx*dx) + (dy*dy) + (dz*dz);
        const b = (2*xe*dx) + (2*ye*dy) + (2*ze*dz);
        const c = (xe*xe) + (ye*ye) + (ze*ze) - currObject.radius*currObject.radius;

        const d = (b*b) - (4*a*c);

        if (d >= 0.0) {
            const minusBPluseOthers = (-b + Math.sqrt(d))/(2*a)
            const minusBMinusOhters = (-b - Math.sqrt(d))/(2*a)

            var t = 0;
            if (minusBPluseOthers < 0 && minusBMinusOhters < 0) {
                return t
            } else if (minusBPluseOthers < 0 && minusBMinusOhters > 0) {
                t = minusBMinusOhters
            } else if (minusBPluseOthers > 0 && minusBMinusOhters < 0) {
                t = minusBPluseOthers
            } else {
                t = Math.min(minusBPluseOthers, minusBMinusOhters);
            }
            // console.log("ray dir: ", ray.dir.x, ray.dir.y, ray.dir.z)
            // console.log("t: ", t)
            
            return t;
            
        } else {
            return 0.0;
        }
        
    }

    
}

class Disk {
    position: Vector
    originalPosition: Vector
    bluredPosition: Vector
    radius: number
    nx: number
    ny: number
    nz: number
    dr: number
    dg: number
    db: number
    k_ambient: number
    k_specular: number
    specular_power: number
    vx: number
    vy: number
    vz: number

    constructor(
        position: Vector,
        originalPosition: Vector,
        bluredPosition: Vector,
        radius: number,
        nx: number,
        ny: number,
        nz: number,
        dr: number,
        dg: number,
        db: number,
        k_ambient: number,
        k_specular: number,
        specular_power: number,
        vx: number,
        vy: number,
        vz: number,
    ) {
        this.position = position
        this.originalPosition = originalPosition
        this.bluredPosition = bluredPosition
        this.radius = radius
        this.nx = nx
        this.ny = ny
        this.nz = nz
        this.dr = dr
        this.dg = dg
        this.db = db
        this.k_ambient = k_ambient
        this.k_specular = k_specular
        this.specular_power = specular_power
        this.vx = vx
        this.vy = vy
        this.vz = vz
    }

    bluringPosition() {
        const randomValue = Math.random()
        const bluredX = this.originalPosition.x + (2 * randomValue - 1) * this.vx
        const bluredY = this.originalPosition.y + (2 * randomValue - 1) * this.vy
        const bluredZ = this.originalPosition.z + (2 * randomValue - 1) * this.vz
        this.position = new Vector(bluredX, bluredY, bluredZ)
    }


    // calculate t and check that t is in radius

    // plane intersection: t = -(P0 dot N + d) / (V dot N)
    // How can I get N and d???????
    // check distance < r (x-point.x)
    getIntersection(ray: Ray, currObject: Sphere | Disk) {

        // Plane intersection
        const P0 = ray.start;
        const N = new Vector(this.nx, this.ny, this.nz);
        const d = -1 * Vector.dot(N, currObject.position);
        const V = ray.dir;

        const minusEyeDotNPlusD = -(Vector.dot(P0, N) + d);
        const vDotN = Vector.dot(V, N); // Maybe denominator is 0??????
        const t = minusEyeDotNPlusD / vDotN;

        const hitOrigin = Vector.plus(ray.start, Vector.times(t, ray.dir));
        const diskDistance = Math.sqrt(
            (currObject.position.x - hitOrigin.x)*(currObject.position.x - hitOrigin.x)
            + (currObject.position.y - hitOrigin.y)*(currObject.position.y - hitOrigin.y)
            + (currObject.position.z - hitOrigin.z)*(currObject.position.z - hitOrigin.z)
        )

        if (diskDistance > currObject.radius) {
            return 0;
        }

        if (t > 0.0) {
            return t;
        }
        return 0.0;
    }

}


// A class for our application state and functionality
class RayTracer {
    // the constructor paramater "canv" is automatically created 
    // as a property because the parameter is marked "public" in the 
    // constructor parameter
    // canv: HTMLCanvasElement
    //
    // rendering context for the canvas, also public
    // ctx: CanvasRenderingContext2D

    // initial color we'll use for the canvas
    canvasColor = "lightyellow"

    canv: HTMLCanvasElement
    ctx: CanvasRenderingContext2D 

    // some things that will get specified by user method calls
    enableShadows = true
    jitter = false
    samples = 1

    // user method calls set these, for the optional parts of the assignment
    enableBlur = false
    enableReflections = false
    enableDepth = false

    // if you are doing reflection, set some max depth here
    maxDepth = 5;

    backgroundColor: Color | undefined
    shapes: Array<Disk | Sphere> | undefined
    camera: Camera | undefined
    fov: number | undefined
    lights: Light[] | undefined
    ambientLight: Color | undefined
    areaLight: AreaLight[] | undefined

    distributions = 1

    constructor (div: HTMLElement,
        public width: number, public height: number, 
        public screenWidth: number, public screenHeight: number) {

        // let's create a canvas and to draw in
        this.canv = document.createElement("canvas");
        this.ctx = this.canv.getContext("2d")!;
        if (!this.ctx) {
            console.warn("our drawing element does not have a 2d drawing context")
            return
        }
        
        div.appendChild(this.canv);

        this.canv.id = "main";
        this.canv.style.width = this.width.toString() + "px";
        this.canv.style.height = this.height.toString() + "px";
        this.canv.width  = this.width;
        this.canv.height = this.height;


        this.shapes = [];
        this.camera = {
            position: new Vector(0, 0, 0),
            u: new Vector(0, 0, 0),
            v: new Vector(0, 0, 0),
            w: new Vector(0, 0, 0)
        }
        this.fov = 0;
        this.lights = [];
        this.ambientLight = new Color(0, 0, 0)
        this.areaLight = [];
        

        this.backgroundColor = new Color(0, 0, 0);
    }

    getLightIntersection(ray: Ray, currLight: Light) {
        const dx = ray.dir.x;
        const dy = ray.dir.y;
        const dz = ray.dir.z;

        const xe = ray.start.x - currLight.position.x;
        const ye = ray.start.y - currLight.position.y;
        const ze = ray.start.z - currLight.position.z;

        const a = (dx*dx) + (dy*dy) + (dz*dz);
        const b = (2*xe*dx) + (2*ye*dy) + (2*ze*dz);
        const c = (xe*xe) + (ye*ye) + (ze*ze) - 1

        const d = (b*b) - (4*a*c);

        if (d >= 0.0) {
            const minusBPluseOthers = (-b + Math.sqrt(d))/(2*a)
            const minusBMinusOhters = (-b - Math.sqrt(d))/(2*a)

            var t = 0;
            if (minusBPluseOthers < 0 && minusBMinusOhters < 0) {
                return t
            } else if (minusBPluseOthers < 0 && minusBMinusOhters > 0) {
                t = minusBMinusOhters
            } else if (minusBPluseOthers > 0 && minusBMinusOhters < 0) {
                t = minusBPluseOthers
            } else {
                t = Math.min(minusBPluseOthers, minusBMinusOhters);
            }
            
            return t;
            
        } else {
            return 0.0;
        }
    }

    // HINT: SUGGESTED INTERNAL METHOD
    // create an array of samples (size this.samples ^ 2) in the range 0..1, which can
    // be used to create a distriubtion of rays around a single eye ray or light ray.
    // The distribution would use the jitter parameters to create either a regularly spaced or 
    // randomized set of samples.
    private createDistribution(): Sample[] {
        var sampelsArray = [];
        for (var i = 0; i < this.samples; i++) {
            for (var j = 0; j < this.samples; j++) {

                // var sampleIncrementAmount = 0;
                // if (this.jitter) {
                //     sampleIncrementAmount = Math.random() - 0.5
                // } else {
                //     sampleIncrementAmount = 0.5
                // }

                // const s = 2 * ((i + sampleIncrementAmount) / this.samples) - 1;
                // const t = 2 * ((j + sampleIncrementAmount) / this.samples) - 1;

                // sampelsArray.push({s: s, t: t})

                if (this.jitter) {
                    let sample = {
                        s: ((i + Math.random()) / this.samples) * 2 - 1,
                        t: ((j + Math.random()) / this.samples) * 2 - 1
                    }
                    sampelsArray.push(sample)
                } else {
                    let sample = {
                        s: ((i + 0.5) / this.samples) * 2 - 1,
                        t: ((j + 0.5) / this.samples) * 2 - 1
                    }
                    sampelsArray.push(sample)
                }
                
                
            }
        }
        // console.log("vecs: ", sampelsArray)
        return sampelsArray;
    }

    // HINT: SUGGESTED BUT NOT REQUIRED, INTERNAL METHOD
    // like traceRay, but returns on first hit. More efficient than traceRay for detecting if "in shadow"
    private testRay(ray: Ray) {
    }

    // NEW COMMANDS FOR PART B

    // create a new disk 
    // 
    // NOTE:  the final vx, vy, vz are only needed for optional motion blur part, 
    // and are the velocity of the object. The object is moving from x,y,z - vx,vy,vz to x,y,z + vx,vy,vz 
    // during the time interval being rendered.

    // Plane intersection: t = -((eye dot N) + d) / (ray.dir dot N)
    // d might be hitOrigin - eye.position???
    new_disk (x: number, y: number, z: number, radius: number, 
              nx: number, ny: number, nz: number, dr: number, dg: number, db: number, 
              k_ambient: number, k_specular: number, specular_pow: number,
              vx?: number, vy?: number, vz?: number) {
        if (this.shapes == undefined) {
            console.log("this.shapes is undefined");
            return
        }
        if (vx == undefined) { 
            vx = 0;
        }
        if (vy == undefined) {
            vy = 0;
        }
        if (vz == undefined) {
            vz = 0;
        }
        this.shapes.push(
            new Disk(
                new Vector(x, y, z),
                new Vector(x, y, z),
                new Vector(x, y, z),
                radius,
                nx,
                ny,
                nz,
                dr,
                dg,
                db,
                k_ambient,
                k_specular,
                specular_pow,
                vx,
                vy,
                vz
            )
        )
    }

    // create a new area light source
    area_light (r: number, g: number, b: number, x: number, y: number, z: number, 
                ux: number, uy: number, uz: number, vx: number, vy: number, vz: number) {
        if (this.areaLight == undefined) {
            return
        }
        this.areaLight.push({
            position: new Vector(x, y, z),
            color: new Color(r, g, b),
            u: new Vector(ux, uy, uz),
            v: new Vector(vx, vy, vz)
        })
    }

    set_sample_level (num: number) {
        this.samples = num
        this.distributions = num*num
    }

    jitter_on() {
        this.jitter = true
    }

    jitter_off() {
        this.jitter = false
    }

    // turn reflection on or off for extra credit reflection part
    reflection_on() {
        this.enableReflections = true
    }

    reflection_off() {
        this.enableReflections = false
    }

    // turn motion blur on or off for extra credit motion blur part
    blur_on() {
        this.enableBlur = true
    }

    blur_off() {
        this.enableBlur = false
    }

    // turn depth of field on or off for extra credit depth of field part
    depth_on() {
        this.enableDepth = true
    }

    depth_off() {
        this.enableDepth = false
    }

    // COMMANDS FROM PART A

    // clear out all scene contents
    reset_scene() {
        this.shapes = [];
        this.lights = [];
        this.ambientLight = new Color(0, 0, 0);
        this.areaLight = [];
    }

    // create a new point light source
    new_light (r: number, g: number, b: number, x: number, y: number, z: number) {
        if (this.lights == undefined) {
            return
        }

        this.lights.push({
            position: new Vector(x, y, z),
            color: new Color(r, g, b)
        })
    }

    // set value of ambient light source
    ambient_light (r: number, g: number, b: number) {
        this.ambientLight = new Color(r, g, b)
    }

    // set the background color for the scene
    set_background (r: number, g: number, b: number) {
        this.backgroundColor = new Color(r, g, b);
    }

    // set the field of view
    DEG2RAD = (Math.PI/180)

    set_fov (theta: number) {
        this.fov = theta*this.DEG2RAD;
    }

    // // set the position of the virtual camera/eye
    // set_eye_position (x: number, y: number, z: number) {
    //     this.scene.camera.pos = new Vector(x,y,z)
    // }

    // set the virtual camera's viewing direction
    set_eye(x1: number, y1: number, z1: number, 
            x2: number, y2: number, z2: number, 
            x3: number, y3: number, z3: number) {
        if (this.camera == undefined) {
            return
        }

        var position = new Vector(x1, y1, z1)

        // u: v cross w
        // v: upVector
        // w: -(lookAt - cameraPosition).norm()
        var w = new Vector(x2-x1, y2-y1, z2-z1)
        
        w = Vector.norm(w)
        w = Vector.times(-1, w)
        var v = new Vector(x3, y3, z3)
        v = Vector.norm(v)
        var u = Vector.cross(v, w) 
        u = Vector.norm(u)

        this.camera = {
            position: position,
            u: u,
            v: v,
            w: w
        }
    }

    // create a new sphere.
    //
    // NOTE:  the final vx, vy, vz are only needed for optional motion blur part, 
    // and are the velocity of the object. The object is moving from x,y,z - vx,vy,vz to x,y,z + vx,vy,vz 
    // during the time interval being rendered.

    new_sphere (x: number, y: number, z: number, radius: number, 
                dr: number, dg: number, db: number, 
                k_ambient: number, k_specular: number, specular_pow: number, 
                vx?: number, vy?: number, vz?: number) {
        if (this.shapes == undefined) {
            return
        }

        if (vx == undefined) {
            vx = 0
        }
        if (vy == undefined) {
            vy = 0
        }
        if (vz == undefined) {
            vz = 0
        }

        this.shapes.push(
            new Sphere(
                new Vector(x, y, z),
                new Vector(x, y, z),
                new Vector(x, y, z),
                radius,
                dr,
                dg,
                db,
                k_ambient,
                k_specular,
                specular_pow,
                vx,
                vy,
                vz
            )
        )
    }

    // INTERNAL METHODS YOU MUST IMPLEMENT

    // create an eye ray based on the current pixel's position
    private eyeRay(i: number, j: number): Ray {
        if (this.fov == undefined || this.camera == undefined) {
            return {
                start: new Vector(0, 0, 0),
                dir: new Vector(0, 0, 0)
            }
        }
        j = (this.screenHeight - j) - 1

        const uPrime = ((2 * (i + 0.5) / this.screenWidth) - 1) * (this.screenWidth/this.screenHeight);
        const vPrime = ((2 * (j + 0.5) / this.screenHeight) - 1);
        
        const d = 1 / Math.tan(this.fov / 2);

        const u = this.camera.u;
        const v = this.camera.v;
        const w = this.camera.w;

        const negativeWTimesD = Vector.times(d, Vector.times(-1, w))
        const uPrimeTimesU = Vector.times(uPrime, u) 
        const vPrimeTimesV = Vector.times(vPrime, v) 

        const L =  Vector.plus(Vector.plus(negativeWTimesD, uPrimeTimesU), vPrimeTimesV);

        return {
            start: this.camera.position,
            dir: Vector.norm(L)
        }

    }


    private traceRay(ray: Ray, depth: number = 0): Color {
        if (this.shapes == undefined || this.fov == undefined) {
            console.log("traceRay's this.shapes is undefined" + " or " + "traceRay's this.fov is undefined")
            return new Color(0, 0, 0);
        }

        var L = this.backgroundColor
        if (L == undefined) {
            console.log("traceRay's currObjectColor is undefined");
            return new Color(0, 0, 0);
        }

        
        var t = 100000000000;
        var minObject = undefined;
        
        
        for (var shapeIdx = 0; shapeIdx < this.shapes.length; shapeIdx++) {
            const currObject = this.shapes[shapeIdx];
            const currT = currObject.getIntersection(ray, currObject)
            if (currT <= 0) {
                continue
            }
            if (currT < t) {
                t = currT;
                minObject = currObject;
                
            }
        }
       
        if (minObject == undefined) {
            return L;
        }
        

        // if there is an intersection
        if (t > 0.0 && t != 100000000000) {


            if (this.lights == undefined || minObject == undefined || this.areaLight == undefined) {
                console.log("traceRay's this.lights is undefined" + " or " + "traceRay's minObject is undefined" + " or " + "traceRay's this.areaLight is undefined");
                return new Color(0, 0, 0);
            }


            // // Motion Bluring!!!
            // var minObjectPosition = minObject.position;
            // if (this.enableBlur) {
            //     minObject.bluringPosition();
            //     minObjectPosition = minObject.bluredPosition;
            // } else if (!this.enableBlur) {
            //     minObjectPosition = minObject.position
            // }

            // const hitOrigin = Vector.plus(ray.start, Vector.times(t, ray.dir));
            // var N = Vector.norm(Vector.minus(hitOrigin, minObjectPosition));






            // if (this.enableBlur) {
            //     minObject.bluringPosition();
            //     minObject.position = minObject.bluredPosition;
            // }

            const hitOrigin = Vector.plus(ray.start, Vector.times(t, ray.dir));
            var N = Vector.norm(Vector.minus(hitOrigin, minObject.position));









            if (minObject instanceof Disk) {
                N = new Vector(minObject.nx, minObject.ny, minObject.nz);
            }
            

            const kd = new Color(minObject.dr, minObject.dg, minObject.db)
            const ks = new Color(minObject.k_specular, minObject.k_specular, minObject.k_specular);
            const Pi = minObject.specular_power;
            
            L = new Color(0, 0, 0);


            const shadowRayOffset = Vector.times(0.001, N)

            // Loop original light
            if (this.lights.length > 0 ) {
                for (var l = 0; l < this.lights.length; l++) {

                    const currLight = this.lights[l];
                    var currShadow = 1;

                    
                    var Li = Vector.norm(Vector.minus(currLight.position, hitOrigin));  // lline 731

                    const shadowStart = Vector.plus(hitOrigin, shadowRayOffset);
                    const shadowRay = {
                        start: shadowStart,
                        dir: Li
                    }

                    // Shadow part
                    for (var shapeIdx = 0; shapeIdx < this.shapes.length; shapeIdx++) {
                        const potentialBlockObject = this.shapes[shapeIdx];
                        const potentialBlockObjectT = potentialBlockObject.getIntersection(shadowRay, potentialBlockObject)

                        if (potentialBlockObjectT <= 0) {
                            continue
                        }
                        // If any object is blocking the light, shadow = 0
                        if (potentialBlockObjectT > 0) {
                            currShadow = 0;
                            break
                        }
                    }


                    // kd(N dot Li)
                    var NLi = Math.max(0, Vector.dot(N, Li)); //prevent NLi is negative
    
                    var currColorR = NLi * kd.r * currLight.color.r * currShadow;
                    var currColorG = NLi * kd.g * currLight.color.g * currShadow;
                    var currColorB = NLi * kd.b * currLight.color.b * currShadow;
                    const kdNLi = new Color(currColorR, currColorG, currColorB);
                    
                    L = Color.plus(L, kdNLi);
    
    
                    // ks(Ri dot V)^Pi
                    const V = ray.dir
                    // refelcted vector: R = -2(V dot N)N + V
                    const minus2VDotNTimesN = Vector.times(-2 * Vector.dot(V, N), N);
                    const Ri = Vector.plus(minus2VDotNTimesN, V);
    
                    var RiV = Vector.dot(Ri, Li);
                    if (RiV < 0) {
                        RiV = 0
                    }
                    var RiVPowerPi = Math.pow(RiV, Pi)
    
                    var currColorR = RiVPowerPi * ks.r * currLight.color.r * currShadow;
                    var currColorG = RiVPowerPi * ks.g * currLight.color.g * currShadow;
                    var currColorB = RiVPowerPi * ks.b * currLight.color.b * currShadow;
                    const ksRiVPowerPi = new Color(currColorR, currColorG, currColorB);
    
                    // kd(N dot Li) + ks(Ri dot V)^Pi
                    L = Color.plus(L, ksRiVPowerPi);
                }
            }

            




            
            // Loop Area light
            if (this.areaLight.length > 0) {

                var kdNLiPlusKsRiVPi = new Color(0, 0, 0);

                for (var areaLightIdx = 0; areaLightIdx < this.areaLight.length; areaLightIdx++) {

                    const currAreaLight = this.areaLight[areaLightIdx];
                    var currShadow = 1;

                    
                    var kdNLi = new Color(0, 0, 0);             
                    var ksRiVPowerPi = new Color(0, 0, 0);

                    const sampleArray = this.createDistribution();

                    var maxSpecular = 0
                    for (var sampleArrayIdx = 0; sampleArrayIdx < sampleArray.length; sampleArrayIdx++) {
                        const c = currAreaLight.position;
                        const su = Vector.times(sampleArray[sampleArrayIdx].s, currAreaLight.u);
                        const tv = Vector.times(sampleArray[sampleArrayIdx].t, currAreaLight.v);
                        const p = Vector.plus(c, Vector.plus(su, tv));


                        
                        var Li = Vector.norm(Vector.minus(p, hitOrigin));
                        
                        const shadowRayStart = Vector.plus(hitOrigin, shadowRayOffset);
                        const shadowRay = {
                            start: shadowRayStart,
                            dir: Li
                        }

                        // Shadow part
                        for (var shapeIdx = 0; shapeIdx < this.shapes.length; shapeIdx++) {
                            const potentialBlockObject = this.shapes[shapeIdx];
                            const potentialBlockObjectT = potentialBlockObject.getIntersection(shadowRay, potentialBlockObject)

                            if (potentialBlockObjectT <= 0 || potentialBlockObjectT > 1) {
                                continue
                            }
                            // If any object is blocking the light, shadow = 0
                            if (potentialBlockObjectT > 0 && potentialBlockObjectT < 1) {
                                currShadow = 0;
                                break
                            }
                        }


                        // kd(N dot Li)
                        var NLi = Math.max(0, Vector.dot(N, Li)); //prevent NLi is negative

                        kdNLi.r += NLi * kd.r * currAreaLight.color.r * currShadow;
                        kdNLi.g += NLi * kd.g * currAreaLight.color.g * currShadow;
                        kdNLi.b += NLi * kd.b * currAreaLight.color.b * currShadow;



                        // ks(Ri dot V)^Pi
                        const V = ray.dir
                        // refelcted vector: R = -2(V dot N)N - V
                        const minus2VDotNTimesN = Vector.times(-2 * Vector.dot(V, N), N);
                        const Ri = Vector.plus(minus2VDotNTimesN, V);

                        var RiV = Vector.dot(Ri, Li);
                        if (RiV < 0) {
                            RiV = 0
                        }
                        var RiVPowerPi = Math.pow(RiV, Pi)
                        var ksRiV = minObject.k_specular * RiVPowerPi
                        
                        maxSpecular = Math.max(maxSpecular, ksRiV);

                        

                        var currColorR = ksRiV * ks.r * currShadow;
                        var currColorG = ksRiV * ks.g * currShadow;
                        var currColorB = ksRiV * ks.b * currShadow;
                        var ksRiVPowerPi = new Color(currColorR, currColorG, currColorB);
                    }
                    kdNLi = Color.scale(1 / sampleArray.length, kdNLi);
                    ksRiVPowerPi = new Color(maxSpecular, maxSpecular, maxSpecular)

                    

                    // kd(N dot Li) + ks(Ri dot V)^Pi
                    kdNLiPlusKsRiVPi = Color.plus(kdNLi, ksRiVPowerPi);
                    L = Color.plus(L, kdNLiPlusKsRiVPi);

                }

            }


            // kaIa
            // minObject.k_ambient * this.ambientlight
            if (this.ambientLight == undefined) {
                console.log("traceRay's this.ambientLight is undefined")
                return new Color(0, 0, 0);
            }
            const kaIaR = minObject.k_ambient * this.ambientLight.r * minObject.dr;
            const kaIaG = minObject.k_ambient * this.ambientLight.g * minObject.dg;
            const kaIaB = minObject.k_ambient * this.ambientLight.b * minObject.db;
            var kaIa = new Color(kaIaR, kaIaG, kaIaB);

            
            // kaIa + li[kd(N dot Li) + ks(Ri dot V)^Pi]
            L = Color.plus(L, kaIa);



            // ksLr (Reflection)
            var ksLr = new Color(0, 0, 0);
            if (this.enableReflections) {
                if (depth < 5 && minObject.k_specular > 0) {
                    const V = ray.dir
                    // refelcted vector: R = -2(V dot N)N - V
                    const minus2VDotNTimesN = Vector.times(-2 * Vector.dot(V, N), N);
                    const Ri = Vector.plus(minus2VDotNTimesN, V);
    
                    const reflectedRay = {
                        start: Vector.plus(hitOrigin, shadowRayOffset),
                        dir: Ri
                    }
                    ksLr = Color.times(ks, this.traceRay(reflectedRay, depth + 1))
                }
            }
            


            // ksLr + kaIa + li[kd(N dot Li) + ks(Ri dot V)^Pi]
            L = Color.plus(L, ksLr);
        }

        return L;
    }



    // draw_scene is provided to create the image from the ray traced colors. 
    // 1. it renders 1 line at a time, and uses requestAnimationFrame(render) to schedule 
    //    the next line.  This causes the lines to be displayed as they are rendered.
    // 2. it uses the additional constructor parameters to allow it to render a  
    //    smaller # of pixels than the size of the canvas
    //
    // YOU WILL NEED TO MODIFY draw_scene TO IMPLEMENT DISTRIBUTION RAY TRACING!
    //
    // NOTE: this method now has three optional parameters that are used for the depth of
    // field extra credit part. You will use these to modify this routine to adjust the
    // eyeRays to create the depth of field effect.
    draw_scene(lensSize?: number, depth1?: number, depth2?: number) {

        // rather than doing a for loop for y, we're going to draw each line in
        // an animationRequestFrame callback, so we see them update 1 by 1
        var pixelWidth = this.width / this.screenWidth;
        var pixelHeight = this.height / this.screenHeight;
        var y = 0;
        
        this.clear_screen();

        var renderRow = () => {
            for (var x = 0; x < this.screenWidth; x++) {
                // HINT: if you implemented "createDistribution()" above, you can use it here
                // range(-1 to 1)
                let vecs = this.createDistribution()

                // HINT: you will need to loop through all the rays, if distribution is turned
                // on, and compute an average color for each pixel.
                var c = new Color(0, 0, 0)

                for (var i = 0; i < vecs.length; i++) {

                    var pixelX = x + vecs[i].s
                    var pixelY = y + vecs[i].t                    

                    var ray = this.eyeRay(pixelX, pixelY);      
                    
                    // Motion bluring might be here!!!!
                    if (this.shapes == undefined) {
                        return 
                    }

                    if (this.enableBlur) {
                        for (var j = 0; j < this.shapes.length; j++) {
                            this.shapes[j].bluringPosition();
                        }
                        
                    }
                    
                    c = Color.plus(c, this.traceRay(ray));
                }
                
                c.r /= vecs.length;
                c.g /= vecs.length;
                c.b /= vecs.length;


                var color = Color.toDrawingColor(c)
                this.ctx.fillStyle = "rgb(" + String(color.r) + ", " + String(color.g) + ", " + String(color.b) + ")";
                this.ctx.fillRect(x * pixelWidth, y * pixelHeight, pixelWidth+1, pixelHeight+1);
            }
            
            // finished the row, so increment row # and see if we are done
            y++;
            if (y < this.screenHeight) {
                // finished a line, do another
                requestAnimationFrame(renderRow);            
            } else {
                console.log("Finished rendering scene")
            }
        }

        renderRow();
    }

    clear_screen() {
        this.ctx.fillStyle = this.canvasColor;
        this.ctx.fillRect(0, 0, this.canv.width, this.canv.height);

    }
}
export {RayTracer}