var gl = null;
var vertShader = null;
var fragShader = null;
var program = null;
var buff = null;
var vertex_data = null;


var vertShader_2 = null;
var fragShader_2 = null;
var program_2 = null;
var buff_1 = null;
var buff_2 = null;
var vertex_data_1 = null;
var vertext_color_1 = null;

var program_1_used = true;

/* 程序入口函数, 由html页面 onload 调用 */
function main(){
	/* 获取canvas元素以及GL Context, 添加监听鼠标点击事件 */
    var canvas = document.getElementById("gl_canvas");
    canvas.onmousedown = onMouseDown;

    gl = canvas.getContext("webgl");


    /* 获取shader程序片段内容, fs_src_2是另外一个片段着色器的内容 */
    var vs_src = $("#vstext").text();
    var fs_src = $("#fstext").text();
    var vs_src_2 = $("#vstext_2").text();
    var fs_src_2 = $("#fstext_2").text();

    /* 加载shader */
    loadShader(vs_src, fs_src, vs_src_2, fs_src_2);
    
    /* 创建program着色器程序 */
    createProgram();
    /* 使用着色器程序 */
    gl.useProgram(program);

    /* 初始化GL需要的顶点数据 */
	init();

    setInterval(render, 30);
}

function loadShader(vs_src, fs_src, vs_src_2, fs_src_2){
 	/* 创建shader对象 */
	vertShader = gl.createShader(gl.VERTEX_SHADER);
    fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    vertShader_2 = gl.createShader(gl.VERTEX_SHADER);
    fragShader_2 = gl.createShader(gl.FRAGMENT_SHADER);


    /* 读取shader程序片段 */
    gl.shaderSource(vertShader, vs_src);
    gl.shaderSource(fragShader, fs_src);
    
    gl.shaderSource(vertShader_2, vs_src_2);
    gl.shaderSource(fragShader_2, fs_src_2);
    

    /* 编译shader */
    gl.compileShader(vertShader);
    gl.compileShader(fragShader);

    gl.compileShader(vertShader_2);
    gl.compileShader(fragShader_2);

    if(!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)){
    	alert("vertext shader 1 error");
    	return;
    }
    if(!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)){
    	alert("fragment shader 1 error");
    	return;
    }

    if(!gl.getShaderParameter(vertShader_2, gl.COMPILE_STATUS)){
        alert("vertext shader 2 error");
        return;
    }
    if(!gl.getShaderParameter(fragShader_2, gl.COMPILE_STATUS)){
        alert("fragment shader 2 error");
        return;
    }
}


/* 创建program对象, 并关联shader对象 */
function createProgram(){
	/* 创建program */
    program = gl.createProgram();

    /* 关联顶点shader对象和片段shader对象 */
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);

    /* 链接program */
    gl.linkProgram(program);
    
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
    	alert("error:program");
        return;
    }

    /* 创建program_2, 并关联相关shader对象 */
    program_2 = gl.createProgram();
    gl.attachShader(program_2, vertShader_2);
    gl.attachShader(program_2, fragShader_2);
    gl.linkProgram(program_2);
    if(!gl.getProgramParameter(program_2, gl.LINK_STATUS)){
        alert("error:program 2");
        return;
    }
}


function init(){
    /* program 1会用到 */
    /* 四边形顶点数据, xyzw */
    var k = 0.5;
    var vertex_data = [
    -1.0 * k, -1.0 * k, -1.0, 1.0,
    -1.0 * k, 1.0 * k, -1.0, 1.0,
    1.0 * k, -1.0 * k, -1.0, 1.0,

    1.0 * k, -1.0 * k, -1.0, 1.0,
    -1.0 * k, 1.0 * k, -1.0, 1.0,
    1.0 * k, 1.0 * k, -1.0, 1.0
    ];


    /* 为四边形创建缓存对象, 并填充顶点数据 */
	buff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_data), gl.STATIC_DRAW);

    
    //下面都是program_2需要用到的数据
    /* 三角形顶点数据, xyzw */
    vertex_data_1 = [
    0.0, 1.0, 0.0, 1.0,
    -1.0, -1.0, 0.0, 1.0,
    1.0, -1.0, 0.0, 1.0];

    /* 三角形顶点颜色数据, rgba */
    var vertext_color_1 = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0];


    /* 为三角形创建缓存对象, 并填充顶点数据 */
    buff_1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buff_1);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_data_1), gl.STATIC_DRAW);

    /* 为三角形创建缓存对象, 并填充颜色数据 */
    buff_2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buff_2);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertext_color_1), gl.STATIC_DRAW);
}

function render(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    /* 清除颜色缓存 */
	gl.clear(gl.COLOR_BUFFER_BIT);
    

    if (program_1_used){
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buff);
        gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        /* 绘制三角形 */
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }else {
        gl.useProgram(program_2);

        gl.bindBuffer(gl.ARRAY_BUFFER, buff_1);
        gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        gl.bindBuffer(gl.ARRAY_BUFFER, buff_2);
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    
}

function onMouseDown(event){
    program_1_used = !program_1_used;
}