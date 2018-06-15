var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main(){
        gl_Position = a_Position;
        gl_PointSize = 100.0;
    }
`;
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main(){
        gl_FragColor = u_FragColor;
    }
`;
// function main(){
//     var canvas = document.getElementById('webgl');
//     var gl = getWebGLContext(canvas);
//     initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE);
//     var a_Position = gl.getAttribLocation(gl.program,'a_Position');
//     gl.clearColor(0.0,0.0,0.0,1.0);
//     gl.clear(gl.COLOR_BUFFER_BIT);
//     canvas.onmousedown = function(e){
//         click(e,gl,canvas,a_Position);
//     };
//     var g_points = [];
//     function click(e,gl,canvas,a_Position){
//         var x = e.clientX;
//         var y = e.clientY;
//         var rect = e.target.getBoundingClientRect();
//         x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
//         y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
//         g_points.push(x,y);
//         gl.clearColor(0.0,0.0,0.0,1.0);
//         gl.clear(gl.COLOR_BUFFER_BIT);
//         for(var i = 0; i < g_points.length; i+=2){
//             gl.vertexAttrib3f(a_Position,g_points[i],g_points[i+1],0.0);
//             gl.drawArrays(gl.POINTS,0,1);
//         }
//     }
// }

function main(){
    var canvas = document.getElementById('webgl');
    canvas.width = screen.width;
    canvas.height = screen.height;
    var gl = getWebGLContext(canvas);
    initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE);
    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    var u_FragColor = gl.getUniformLocation(gl.program,'u_FragColor');
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    canvas.onmousedown = function(e){
        click(e,gl,canvas,a_Position,u_FragColor);
        canvas.onmousemove = function(e){
            click(e,gl,canvas,a_Position,u_FragColor);
        }
        canvas.onmouseup = function(){
            this.onmousemove = null;
        };
    };
    var g_points = [];
    var g_colors = [];
    function click(e,gl,canvas,a_Position,u_FragColor){
        var x = e.clientX;
        var y = e.clientY;
        var rect = e.target.getBoundingClientRect();
        x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
        y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
        g_points.push([x,y]);
        // 不同象限不同颜色
        // if( x >= 0.0 && y >= 0.0){
        //     g_colors.push([1.0,0.0,0.0,1.0]);
        // } else if( x < 0.0 && y < 0.0){
        //     g_colors.push([0.0,1.0,0.0,1.0]);
        // } else if( x < 0.0 && y > 0.0){
        //     g_colors.push([0.0,0.0,1.0,1.0]);
        // } else{
        //     g_colors.push([1.0,1.0,1.0,1.0]);
        // }
        // 随机颜色
        var randomNum1 = Math.random();
        var randomNum2 = Math.random();
        var randomNum3 = Math.random();
        g_colors.push([randomNum1,randomNum2,randomNum3,1.0])
        gl.clear(gl.COLOR_BUFFER_BIT);
        for(var i = 0; i < g_points.length; i++){
            var xy = g_points[i];
            var rgba = g_colors[i];
            gl.vertexAttrib3f(a_Position,g_points[i][0],g_points[i][1],0.0);
            //gl.uniform4f(u_FragColor,rgba[0],rgba[1],rgba[2],rgba[3]);
            // 抖动
            gl.uniform4f(u_FragColor,Math.random().toFixed(1),Math.random().toFixed(1),Math.random().toFixed(1),1.0);
            gl.drawArrays(gl.POINTS,0,1);
        }
    }
}