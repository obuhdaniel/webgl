import CanvasScrollHandler from "./scroll-handler.js";

(async function () {
  const canvas = document.querySelector("#gl-canvas");
  const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

  if (!gl) {
    console.error("WebGL is not supported in this browser.");
    return;
  }

  const container = document.createElement('div');
  container.className = 'canvas-container';
  canvas.parentNode.insertBefore(container, canvas);
  container.appendChild(canvas);

  const workspace = document.createElement('div');
  workspace.className = 'workspace';
  container.parentNode.insertBefore(workspace, container);
  workspace.appendChild(container);


      // Initialize scroll handler
      const scrollHandler = new CanvasScrollHandler(canvas, container, workspace);

      // Set up zoom controls
      const zoomControls = document.createElement('div');
      zoomControls.className = 'zoom-controls';
      document.body.appendChild(zoomControls);
  
      const zoomInBtn = document.createElement('button');
      const zoomOutBtn = document.createElement('button');
      const resetZoomBtn = document.createElement('button');
      const zoomLevelDisplay = document.createElement('div');
  
      zoomInBtn.className = 'zoom-btn';
      zoomOutBtn.className = 'zoom-btn';
      resetZoomBtn.className = 'zoom-btn';
      zoomLevelDisplay.className = 'zoom-level';
  
      zoomInBtn.textContent = '+';
      zoomOutBtn.textContent = '-';
      resetZoomBtn.textContent = '⟲';
      zoomLevelDisplay.textContent = '100%';
  
      zoomControls.appendChild(zoomInBtn);
      zoomControls.appendChild(zoomLevelDisplay);
      zoomControls.appendChild(zoomOutBtn);
      zoomControls.appendChild(resetZoomBtn);
  
      // Add zoom control event listeners
      zoomInBtn.addEventListener('click', (e) => scrollHandler.zoom('in', e));
      zoomOutBtn.addEventListener('click', (e) => scrollHandler.zoom('out', e));
      resetZoomBtn.addEventListener('click', () => scrollHandler.resetView());
  
      // Update zoom level display
      workspace.addEventListener('zoomchange', (e) => {
          zoomLevelDisplay.textContent = `${Math.round(e.detail.scale * 100)}%`;
      });
  
  

  // Load shaders from external files
  const vertexShaderSource = await fetch("./shaders/vertexShader.glsl").then(res => res.text());
  const fragmentShaderSource = await fetch("./shaders/fragmentShader.glsl").then(res => res.text());

  // Compile shaders and create a program
  const program = compile(gl, vertexShaderSource, fragmentShaderSource);

  // Set up attributes and uniforms
  const position = gl.getAttribLocation(program, "position");
  gl.vertexAttrib4f(position, 0, 0, 0, 1);

  const size = gl.getAttribLocation(program, "size");
  gl.vertexAttrib1f(size, 10.0);

  const color = gl.getUniformLocation(program, "color");
  gl.uniform4f(color, 1, 0, 0, 1);

  // Clear the canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

 
  setInterval(() => {
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
  
    gl.vertexAttrib3f(position, x, y, 0);
    gl.vertexAttrib1f(size, 10);
    gl.uniform4f(color, r, g, b, 1);
    gl.drawArrays(gl.POINTS, 0, 1);
  }, 50);
})();
