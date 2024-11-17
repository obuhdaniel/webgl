// scroll-handler.js

class CanvasScrollHandler {
    constructor(canvas, container, workspace) {
        this.canvas = canvas;
        this.container = container;
        this.workspace = workspace;
        
        // State
        this.scale = 1;
        this.panning = false;
        this.pointX = 0;
        this.pointY = 0;
        this.start = { x: 0, y: 0 };

        // Zoom constraints
        this.minZoom = 0.1;
        this.maxZoom = 5;
        
        // Bind methods to maintain context
        this.setTransform = this.setTransform.bind(this);
        this.zoom = this.zoom.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.resetView = this.resetView.bind(this);
        
        // Initialize
        this.init();
    }

    init() {
        // Add event listeners
        this.workspace.addEventListener('wheel', this.handleWheel);
        this.workspace.addEventListener('mousedown', this.handleMouseDown);
        this.workspace.addEventListener('mousemove', this.handleMouseMove);
        this.workspace.addEventListener('mouseup', this.handleMouseUp);
        
        // Set initial transform
        this.setTransform();
    }

    setTransform() {
        this.container.style.transform = `translate(${this.pointX}px, ${this.pointY}px) scale(${this.scale})`;
        // Dispatch custom event for zoom level update
        const event = new CustomEvent('zoomchange', { detail: { scale: this.scale } });
        this.workspace.dispatchEvent(event);
    }

    zoom(direction, event) {
        const factor = direction === 'in' ? 1.1 : 0.9;
        const newScale = this.scale * factor;
        
        if (newScale >= this.minZoom && newScale <= this.maxZoom) {
            // Get current mouse position relative to container
            const rect = this.container.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            // Calculate new point position
            this.pointX = mouseX - (mouseX - this.pointX) * factor;
            this.pointY = mouseY - (mouseY - this.pointY) * factor;
            
            this.scale = newScale;
            this.setTransform();
        }
    }

    handleWheel(e) {
        e.preventDefault();
        const direction = e.deltaY < 0 ? 'in' : 'out';
        this.zoom(direction, e);
    }

    handleMouseDown(e) {
        if (e.target === this.workspace || e.target === this.container) {
            e.preventDefault();
            this.panning = true;
            this.container.classList.add('grabbing');
            this.start = { 
                x: e.clientX - this.pointX, 
                y: e.clientY - this.pointY 
            };
        }
    }

    handleMouseMove(e) {
        if (!this.panning) return;
        
        e.preventDefault();
        this.pointX = (e.clientX - this.start.x);
        this.pointY = (e.clientY - this.start.y);
        this.setTransform();
    }

    handleMouseUp() {
        this.panning = false;
        this.container.classList.remove('grabbing');
    }

    resetView() {
        this.scale = 1;
        this.pointX = 0;
        this.pointY = 0;
        this.setTransform();
    }

    // Utility method to convert screen coordinates to canvas coordinates
    getCanvasPoint(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (clientX - rect.left) / this.scale,
            y: (clientY - rect.top) / this.scale
        };
    }

    // Getter for current scale
    getCurrentScale() {
        return this.scale;
    }

    // Clean up method
    destroy() {
        this.workspace.removeEventListener('wheel', this.handleWheel);
        this.workspace.removeEventListener('mousedown', this.handleMouseDown);
        this.workspace.removeEventListener('mousemove', this.handleMouseMove);
        this.workspace.removeEventListener('mouseup', this.handleMouseUp);
    }
}

export default CanvasScrollHandler;