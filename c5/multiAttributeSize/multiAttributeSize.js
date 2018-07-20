var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main(){
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
    }
`;
var FSHADER_SOURCE = `
    void main(){
        gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
`;

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    var n = initVertexBuffers(gl);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, n);
}

//创建2个缓存区,然后依次绑定数据
// function initVertexBuffers(gl) {
//     var vertices = new Float32Array([
//         0.0, 0.5, -0.5, -0.5, 0.5, -0.5
//     ]);
//     var n = 3;
//     var sizes = new Float32Array([
//         10.0, 20.0, 30.0
//     ]);
//     var vertexBuffer = gl.createBuffer();
//     var sizeBuffer = gl.createBuffer();

//     gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
//     var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//     gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(a_Position);

//     gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
//     var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
//     gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(a_PointSize);
//     return n;
// }

//只创建一个缓存区,分别从这一个区里面取得需要的数据

function initVertexBuffers(gl) {
    var verticesSizes = new Float32Array([
        0.0, 0.5, 10.0, -0.5, -0.5, 20.0,
        0.5, -0.5, 30.0
    ]);
    var n = 3;

    var FSIZE = verticesSizes.BYTES_PER_ELEMENT;

    var vertexSizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
    gl.enableVertexAttribArray(a_PointSize);
    return n;
}