var gl = null;
var vertShader = null;
var fragShader = null;
var program = null;

/* 程序入口函数, 由html页面 onload 调用 */
function main(){
	/* 获取canvas元素以及GL Context */
    var canvas = document.getElementById("gl_canvas");
    gl = canvas.getContext("webgl");

    /* 获取shader程序片段内容 */
    var vs_src = $("#vstext").text();
    var fs_src = $("#fstext").text();
    
    /* 加载shader */
    loadShader(vs_src, fs_src);
    
    /* 创建program着色器程序 */
    createProgram();
    /* 使用着色器程序 */
    gl.useProgram(program);

    /* 初始化GL需要的顶点数据 */
	init();

	/* 绘制三角形 */
	render();
}

function loadShader(vs_src, fs_src){
	/* 创建shader对象 */
	vertShader = gl.createShader(gl.VERTEX_SHADER);
    fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    /* 读取shader程序片段 */
    gl.shaderSource(vertShader, vs_src);
    gl.shaderSource(fragShader, fs_src);

    /* 编译shader */
    gl.compileShader(vertShader);
    gl.compileShader(fragShader);

    if(!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)){
    	alert("vertext shader error");
    	return;
    }
    if(!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)){
    	alert("fragment shader error");
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
    	alert("error:program");return;
    }
}

function init(){
    /* 三角形顶点数据, xyzw */
    var vertex_data = [
    0.0, 1.0, 0.0, 1.0,
    -1.0, -1.0, 0.0, 1.0,
    1.0, -1.0, 0.0, 1.0];

    /* 创建缓存对象(buff object)名称 */
	var buff = gl.createBuffer();

	/* 绑定buff, 需要指定buff类型, 上面提供的vertex_data是顶点数组, 所以这里我们使用了ARRAY_BUFFER类型
	 * 在这里, bindBuffer函数创建<缓存对象(buff object)>并与buff(缓存对象名称)关联
	 */
	gl.bindBuffer(gl.ARRAY_BUFFER, buff);

	/* 给<缓存对象(buff object)>分配内存, 填充顶点数据vertex_data */
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_data), gl.STATIC_DRAW);

	/* 关联vert shader中的变量(用索引来表示, 这里我们用0, 因为在vert shader中就一个变量)
	 * 和我们提供的vertex_data数据的对应关系
	 */
	gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);

	/* 启用顶点属性数组中的第一个属性, GL把shader所有的属性都映射到了一个数组中,
	 * 称为顶点属性数组<VertexAttribArray>, 所有的属性都可以用索引来获取
	 */
	gl.enableVertexAttribArray(0);
}

function render(){
	/* 设置颜色缓冲区被清除时使用的颜色, 用来设置背景色, 4个参数表示rgba, 在0~1.0之间 */
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    /* 清除颜色缓存 */
	gl.clear(gl.COLOR_BUFFER_BIT);
     
    /* 绘制三角形 */
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
