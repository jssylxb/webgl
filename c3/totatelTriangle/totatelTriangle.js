var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform float u_CosB, u_SinB;
    void main(){
        gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
        gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
        gl_Position.z = a_Position.z;
        gl_Position.w = 1.0;
    }
`;
var FSHADER_SOURCE = `
    void main(){
        gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
`;
var ANGLE = 0.0;
function main(){
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE);
    var n = initVertexBuffers(gl);
    var radian = Math.PI * ANGLE / 180.0;
    var sinB = Math.sin(radian);
    var cosB = Math.cos(radian);
    var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');
    var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
    gl.uniform1f(u_SinB, sinB);
    gl.uniform1f(u_CosB, cosB);
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n);
}

function initVertexBuffers(gl){
    var vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    var n = 3;
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    return n;
}