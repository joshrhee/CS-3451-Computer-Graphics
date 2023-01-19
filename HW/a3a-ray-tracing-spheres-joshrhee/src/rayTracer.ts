// Sang June Rhee

// classes you may find useful.  Feel free to change them if you don't like the way
// they are set up.

// Need to do
//      Test 2 Ri is the problem?


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

class Sphere {
    position: Vector
    radius: number
    dr: number
    dg: number
    db: number
    k_ambient: number
    k_specular: number
    specular_power: number

    constructor(
        position: Vector,
        radius: number,
        dr: number,
        dg: number,
        db: number,
        k_ambient: number,
        k_specular: number,
        specular_power: number) {

            this.position = position
            this.radius = radius
            this.dr = dr
            this.dg = dg
            this.db = db
            this.k_ambient = k_ambient
            this.k_specular = k_specular
            this.specular_power = specular_power

    }

    getIntersection(ray: Ray, currObject: Sphere) {
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

    backgroundColor: Color | undefined
    shapes: Sphere[] | undefined
    camera: Camera | undefined
    fov: number | undefined
    lights: Light[] | undefined
    ambientLight: Color | undefined

    // div is the HTMLElement we'll add our canvas to
    // width, height are the size of the canvas
    // screenWidth, screenHeight are the number of pixels you want to ray trace
    //  (recommend that width and height are multiples of screenWidth and screenHeight)
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
        

        this.backgroundColor = new Color(0, 0, 0);
 
        div.appendChild(this.canv);

        this.canv.id = "main";
        this.canv.style.width = this.width.toString() + "px";
        this.canv.style.height = this.height.toString() + "px";
        this.canv.width  = this.width;
        this.canv.height = this.height;
    }

    // API Functions you should implement

    // clear out all scene contents
    reset_scene() {
        this.shapes = [];
        this.lights = [];
        this.ambientLight = new Color(0, 0, 0);
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
        this.ambientLight = 
            new Color(r, g, b)
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

    // set the virtual camera's position and orientation
    // x1,y1,z1 are the camera position
    // x2,y2,z2 are the lookat position
    // x3,y3,z3 are the up vector
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

    // create a new sphere
    // Add into the scene
    new_sphere (x: number, y: number, z: number, radius: number, 
                dr: number, dg: number, db: number, 
                k_ambient: number, k_specular: number, specular_pow: number) {
        if (this.shapes == undefined) {
            return
        }

        this.shapes.push(
            new Sphere(
                new Vector(x, y, z),
                radius,
                dr,
                dg,
                db,
                k_ambient,
                k_specular,
                specular_pow
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
        // Not sure my calculation is right!!

        const uPrime = (2 * (i + 0.5) / this.screenWidth) - 1;
        const vPrime = (2 * (j + 0.5) / this.screenHeight) - 1;
        
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

    // What is the color the ray look at the plane

    // if interesction shade based of the depth
    
    // if not background

    // pdf 13, pg 9
    private traceRay(ray: Ray, depth: number = 0): Color {
        if (this.shapes == undefined) {
            console.log("traceRay's this.shapes is undefined")
            return new Color(0, 0, 0);
        }

        var L = this.backgroundColor
        if (L == undefined) {
            console.log("traceRay's currObjectColor is undefined");
            return new Color(0, 0, 0);
        }

        var t = 100000000000;
        var minObject = undefined
        for (var shapeIdx = 0; shapeIdx < this.shapes.length; shapeIdx++) {
            const currObject = this.shapes[shapeIdx];
            const currT = currObject.getIntersection(ray, currObject)
            if (currT == 0) {
                continue
            }
            if (currT < t) {
                t = currT;
                minObject = currObject;
            }
        }

        // if there is an intersection
        if (t > 0.0 && t != 100000000000) {

            if (this.lights == undefined) {
                console.log("traceRay's this.lights is undefined")
                return new Color(0, 0, 0);
            }

            if (minObject == undefined) {
                console.log("traceRay's minObject is undefined")
                return new Color(0, 0, 0);
            }
            
            const hitOrigin = Vector.plus(ray.start, Vector.times(t, ray.dir));
            const N = Vector.norm(Vector.minus(hitOrigin, minObject.position));

            const kd = new Color(minObject.dr, minObject.dg, minObject.db)
            const ks = new Color(minObject.k_specular, minObject.k_specular, minObject.k_specular);
            const Pi = minObject.specular_power;
            
            L = new Color(0, 0, 0);
            
            for (var l = 0; l < this.lights.length; l++) {
                const currLight = this.lights[l];


                // kd(N dot Li)
                var Li = Vector.norm(Vector.minus(currLight.position, hitOrigin));
                var NLi = Math.max(0, Vector.dot(N, Li)); //prevent NLi is negative

                var currColorR = NLi * kd.r * currLight.color.r;
                var currColorG = NLi * kd.g * currLight.color.g;
                var currColorB = NLi * kd.b * currLight.color.b;
                const kdNLi = new Color(currColorR, currColorG, currColorB);
                
                L = Color.plus(L, kdNLi);


                // ks(Ri dot V)^Pi
                const V = ray.dir
                // refelcted vector: R = -2(V dot N)N - V
                const vDotN = Vector.dot(V, N);
                const minus2VDotN = -2 * vDotN;
                const minus2VDotNTimesN = Vector.times(minus2VDotN, N);
                const Ri = Vector.plus(minus2VDotNTimesN, V);

                var RiV = Vector.dot(Ri, Li);
                if (RiV < 0) {
                    RiV = 0
                }
                var RiVPowerPi = Math.pow(RiV, Pi)
            
                var currColorR = RiVPowerPi * ks.r * currLight.color.r;
                var currColorG = RiVPowerPi * ks.g * currLight.color.g;
                var currColorB = RiVPowerPi * ks.b * currLight.color.b;
                const ksRiVPowerPi = new Color(currColorR, currColorG, currColorB);

                // kd(N dot Li) + ks(Ri dot V)^Pi
                L = Color.plus(L, ksRiVPowerPi);
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
        }

        return L;

      
    }

    // draw_scene is provided to create the image from the ray traced colors. 
    // 1. it renders 1 line at a time, and uses requestAnimationFrame(render) to schedule 
    //    the next line.  This causes the lines to be displayed as they are rendered.
    // 2. it uses the additional constructor parameters to allow it to render a  
    //    smaller # of pixels than the size of the canvas
    draw_scene() {

        // rather than doing a for loop for y, we're going to draw each line in
        // an animationRequestFrame callback, so we see them update 1 by 1
        var pixelWidth = this.width / this.screenWidth;
        var pixelHeight = this.height / this.screenHeight;
        var y = 0;
        
        this.clear_screen();

        var renderRow = () => {
            for (var x = 0; x < this.screenWidth; x++) {

                var ray = this.eyeRay(x, y);
                var c = this.traceRay(ray);

                var color = Color.toDrawingColor(c)
                this.ctx.fillStyle = "rgb(" + String(color.r) + ", " + String(color.g) + ", " + String(color.b) + ")";
                // this.ctx.fillStyle = "rgb(" + String(color[0]) + ", " + String(color[1]) + ", " + String(color[2]) + ")";
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