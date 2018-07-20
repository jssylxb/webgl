var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_ProjMatrix;
    varying vec4 v_Color;
    void main(){
        gl_Position = u_ProjMatrix * a_Position;
        v_Color = a_Color;
    }
`;

var FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main(){
        gl_FragColor = v_Color;
    } 
`;

function main(){
    var canvas = document.getElementById('webgl');
    var nf = document.getElementById('nearFar');

    var gl = getWebGLContext(canvas);
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

    var n = initVertexBuffers(gl);

    gl.clearColor(0, 0, 0, 1);

    var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    var projMatrix = new Matrix4();

    document.onkeydown = function(e){
        keydown(e, gl, n, u_ProjMatrix, projMatrix, nf);
    }
    
    draw(gl, n, u_ProjMatrix, projMatrix, nf);
}

function initVertexBuffers(gl){
    var verticesColors = new Float32Array([
    // Vertex coordinates and color
     0.0,  0.6,  -0.4,  0.4,  1.0,  0.4, // The back green one
    -0.5, -0.4,  -0.4,  0.4,  1.0,  0.4,
     0.5, -0.4,  -0.4,  1.0,  0.4,  0.4, 
   
     0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // The middle yellow one
    -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
     0.0, -0.6,  -0.2,  1.0,  1.0,  0.4, 

     0.0,  0.5,   0.0,  0.4,  0.4,  1.0, // The front blue one 
    -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
     0.5, -0.5,   0.0,  1.0,  0.4,  0.4, 
  ]);
  var n = 9;
  var FSIZE = verticesColors.BYTES_PER_ELEMENT;

  var vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  return n;
}

var g_near = 0.0, g_far = 0.5;
function keydown(e, gl, n, u_ProjMatrix, projMatrix, nf){
    switch(e.keyCode){
        case 39: g_near += 0.01; break;
        case 37: g_near -= 0.01; break; 
        case 38: g_far += 0.01;  break;  
        case 40: g_far -= 0.01;  break; 
        default: return;
    }
    draw(gl, n, u_ProjMatrix, projMatrix, nf);
}

function draw(gl, n, u_ProjMatrix, projMatrix, nf){
    projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, g_near, g_far);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    nf.innerHTML = 'near: ' + Math.round(g_near * 100)/100  + ', far: ' + Math.round(g_far * 100)/100;
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

