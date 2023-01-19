interface Point {
    x: number,
    y: number,
    z: number
}

interface Vector {
    x: number,
    y: number,
    z: number,
    w: number
}

// A class for our application state and functionality
class Drawing {
    // the constructor paramater "canv" is automatically created 
    // as a property because the parameter is marked "public" in the 
    // constructor parameter
    // canv: HTMLCanvasElement
    //
    // rendering context for the canvas, also public
    // ctx: CanvasRenderingContext2D

    // initial color we'll use for the canvas
    canvasColor = "lightgrey"
    lineColor = "black"

    canv: HTMLCanvasElement
    ctx: CanvasRenderingContext2D 

    constructor (div: HTMLElement) {
        // let's create a canvas and to draw in
        this.canv = document.createElement("canvas");
        this.ctx = this.canv.getContext("2d")!;
        if (!this.ctx) {
            console.warn("our drawing element does not have a 2d drawing context")
            return
        }
        
        div.appendChild(this.canv);

        this.canv.id = "main";
        this.canv.style.width = "100%";
        this.canv.style.height = "100%";
        this.canv.width  = this.canv.offsetWidth;
        this.canv.height = this.canv.offsetHeight;

        this.ctx.lineWidth = 2
        this.ctx.lineJoin = "bevel"
        this.ctx.strokeStyle = this.lineColor;

        window.addEventListener('resize', (event) => {
            this.canv.width  = this.canv.offsetWidth;
            this.canv.height = this.canv.offsetHeight;
        });
    }

    // overriden by child class, this gets called each frame in render() below
    drawScene() {
    }
    
    // called from requestAnimationFrame
    render() {
        // Store the current drawing transformation matrix (and other state)
        this.ctx.save();
        
        // Use the identity matrix while clearing the canvas (just in case you change it someday!)
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.fillStyle = this.canvasColor;
        this.ctx.fillRect(0, 0, this.canv.width, this.canv.height);
        
        // Restore the transform
        this.ctx.restore();                

        this.drawScene();
        
        // do it again!  and again!  AND AGAIN!  AND ...       
        requestAnimationFrame(() => this.render());
    }
    
    // draw a 2D line in standard 3D window coordinates, with (0,0) at the lower left
    line(p1: Point, p2: Point) {
        this.ctx.beginPath();       // Start a new path

        // our 3D coordinates are 0 at the bottom, height at the top, but the
        // 2D canvas is the opposite, so flip y
        this.ctx.moveTo(p1.x, this.canv.height - p1.y);
        this.ctx.lineTo(p2.x, this.canv.height - p2.y);
        this.ctx.stroke();
    }

    // all of the commands to be overridden and implemented in the subclass. 
    beginShape() {
    }

    endShape() {
    }

    vertex(x: number, y: number, z: number) {
    }

    perspective(field_of_view: number, near: number, far: number) {
    }

    ortho (left: number, right: number, top: number, bottom: number, near: number, far: number) {
    }

    initMatrix() // was init()
    {
    }

    translate(x: number, y: number, z: number)
    {
    }

    scale(x: number, y: number, z: number)
    {
    }

    rotateX(angle: number)
    {
    }

    rotateY(angle: number)
    {
    }

    rotateZ(angle: number)
    {
    }

    printMatrix() // was print
    {
    }

}

export {Drawing, Vector, Point}