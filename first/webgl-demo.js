import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";
import { startKeyboardListening } from "./keyboard-movement.js";
import getRadomColors from "./generate-random-color.js";
export const positionArray = [-0.0, 0.0, -4.0];

const displaySpan = document.getElementById("position");
let randomColor = [0.0, 0.0, 0.0, 1.0];

export function updatePositionArray(x, y) {
    positionArray[0] = x;
    positionArray[1] = y;

    console.log(`Updated positionArray: [${positionArray}]`);

    randomColor = getRadomColors(); // Correct variable update

    if (displaySpan) {
        displaySpan.textContent = `Current position: (${positionArray[0]}, ${positionArray[1]})`;
    }

    drawSceneWithRandomColor(); // Updated function for redrawing
}



function drawSceneWithRandomColor() {

  
  const canvas = document.querySelector("#gl-canvas");
  const gl = canvas.getContext("webgl");
  
  const vsSource = `
        attribute vec4 aVertexPosition;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
     `;
     const fsSource = `
     void main() {
       gl_FragColor = vec4(${randomColor});
     }
   `;
 
   const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),

    },
    uniformLocations:{
      projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),

    },
  };

  if (gl == null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const buffers = initBuffers(gl);


  drawScene(gl, programInfo, buffers, positionArray, randomColor);
}



function main() {

  const canvas = document.querySelector("#gl-canvas");
  const gl = canvas.getContext("webgl");
  
  
  





  if (gl == null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

drawSceneWithRandomColor(); 
startKeyboardListening();
  
}

main();


function initShaderProgram(gl, vsSource, fsSource){
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
        alert(
            `unable to initializw the shader program: ${gl.getProgramInfoLog(
                shaderProgram,
            )}`,
        );
        return null;
    }
    return shaderProgram;

}

function loadShader(gl, type, source){
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        alert(
            `An error occured compiling the shaders:
            
            ${gl.getShaderInfoLog(shader)}`,
        );
    gl.deleteShader(shader);
    
    return null;
    }
    return shader;
}

