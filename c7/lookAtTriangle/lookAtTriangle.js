var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_ViewMatrix;
    varying vec4 v_Color;
    void main(){
        gl_Position = u_ViewMatrix * a_Position;
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

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    var n = initVertexBuffers(gl);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var u_viewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    var viewMatrix = new Matrix4();
    viewMatrix.setLookAt(0, 0, -0.6, 0, 0, 1, 0, 1, 0);
    gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
        // Vertex coordinates and color(RGBA)
        0.0,  0.8,  -0.5,  0.4,  1.0,  0.4, // The back green one
        -0.8, -0.8,  -0.5,  0.4,  1.0,  0.4,
        0.8, -0.8,  -0.5,  0.4,  1.0,  0.4, 
    
        0.5,  0.4,  0.0,  1.0,  1.0,  0.4, // The middle yellow one
        -0.5,  0.4,  0.0,  1.0,  1.0,  0.4,
        0.0, -0.6,  0.0,  1.0,  1.0,  0.4, 

        0.0,  0.5,   0.5,  0.4,  0.4,  1.0,  // The front blue one 
        -0.5, -0.5,   0.5,  0.4,  0.4,  1.0,
        0.5, -0.5,   0.5,  0.4,  0.4,  1.0, 
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

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return n;
}
