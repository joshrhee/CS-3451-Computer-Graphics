import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class DrawingCommon {
    private _boundHandleFrame: (t: DOMHighResTimeStamp) => any;

    // convenience
    startTime = -1

    // DOM items
    glCanvas = document.createElement('canvas')
	glContext: WebGLRenderingContext;

    // Three.js items
    scene = new THREE.Scene() 
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    renderer: THREE.WebGLRenderer;

    constructor(public el: HTMLElement){
        // make it a method that's bound to this object
		this._boundHandleFrame = this._handleFrame.bind(this) 

        // let's create a canvas and to draw in
        el.appendChild(this.glCanvas);

        this.glCanvas.id = "threecanvas";

        // define scene view
        this.scene.background = new THREE.Color( 0xcccccc );

        this.camera.position.set(0,1,-5)
		this.scene.add(this.camera)

		// Create a canvas and context for the session layer
		let ctx = this.glCanvas.getContext('webgl')
        if (!ctx) {
            throw new Error("Cannot create WebGL render context in common.ts")
        }
        this.glContext = ctx

		// Set up the THREE renderer with the session's layer's glContext
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.glCanvas,
			context: this.glContext,
			antialias: true,
			alpha: true
		})
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        // update the camera
        this.camera.aspect = this.glCanvas.offsetWidth / this.glCanvas.offsetHeight;
        this.camera.updateProjectionMatrix();

        // just ambient light
		const ambientLight = new THREE.AmbientLight( 0x222222 );
		this.scene.add( ambientLight );

		// Give extending classes the opportunity to initially populate the scene
		this.initializeScene()

        window.addEventListener('resize', (event) => {
            this.camera.aspect = this.el.offsetWidth / this.el.offsetHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( this.el.offsetWidth, this.el.offsetHeight );
        });

        window.requestAnimationFrame(this._boundHandleFrame)
	}

    // a simple wrapper to reliably get the offset within an DOM element
    // We need this because the mouse position in the mouse event is
    // relative to the Window, but we want to specify draw coordinates
    // relative to the canvas DOM element  
    // see: http://www.jacklmoore.com/notes/mouse-position/
    static offset(e: MouseEvent): ps.MousePosition {
        e = e || <MouseEvent> window.event;

        var target = <Element> (e.target || e.srcElement),
            rect = target.getBoundingClientRect(),
            offsetX = e.clientX - rect.left,
            offsetY = e.clientY - rect.top;

        return {x: offsetX, y: offsetY};
    }

	/*
	Extending classes should override this to set up the scene during class construction
	*/
	initializeScene(){}

	/*
	Extending classes that need to update the layer during each frame should override this method
	*/
	updateScene(time: DOMHighResTimeStamp){}

	_handleFrame(t: DOMHighResTimeStamp){
		const nextFrameRequest = window.requestAnimationFrame(this._boundHandleFrame)

        if (this.startTime == -1) { 
            this.startTime = t
        }
        // Let the extending class update the scene before each render
		this.updateScene(t)

	    this.doRender()
    }

	doRender() {
		this.renderer.render(this.scene, this.camera)
	}
}
