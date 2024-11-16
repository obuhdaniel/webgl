(async function () {
  const canvas = document.querySelector("#gl-canvas");
  const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

  if (!gl) {
    console.error("WebGL is not supported in this browser.");
    return;
  }

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
