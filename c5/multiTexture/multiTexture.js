var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;
    void main(){
        gl_Position = a_Position;
        v_TexCoord = a_TexCoord;
    }
`;
var FSHADER_SOURCE = `
    precision mediump float;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    varying vec2 v_TexCoord;
    void main(){
        vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
        vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
        gl_FragColor = color0 * color1;
    }
`;
function main(){
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    var n = initVertexBuffers(gl);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    initTextures(gl,n);
}
function initVertexBuffers(gl){
    var verticesTexCoords = new Float32Array([
        -0.5,  0.5,   0.0, 1.0,
        -0.5, -0.5,   0.0, 0.0,
        0.5,  0.5,   1.0, 1.0,
        0.5, -0.5,   1.0, 0.0,
    ]);
    var n = 4;
    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    var vertexTexCoordBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}

function initTextures(gl, n){
    var texture0 = gl.createTexture();
    var texture1 = gl.createTexture();
    
    var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    
    var image0 = new Image();
    var image1 = new Image();
    image0.onload = function(){
        loadTexture(gl, n, texture0, u_Sampler0, image0, 0);
    }
    image1.onload = function(){
        loadTexture(gl, n, texture1, u_Sampler1, image1, 1);
    }
    image0.src = '../../resources/sky.JPG';
    image1.src = '../../resources/circle.gif';

    return true;
}

var g_texUnit0 = false;
var g_texUnit1 = false;

function loadTexture(gl, n, texture, u_Sampler, image, texUnit){

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    if(texUnit == 0){
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit0 = true;
    }else{
        gl.activeTexture(gl.TEXTURE1)
        g_texUnit1 = true;
    }


    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, texUnit);

    gl.clear(gl.COLOR_BUFFER_BIT);

    if(g_texUnit0 && g_texUnit1){
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
}