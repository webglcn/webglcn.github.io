var gl = null;
var vertShader = null;
var fragShader = null;
var program = null;

/* 地图顶点数据 */
var vertex_data = null;
var vertext_color = null;

var vertex_data_buff = null;
var vertext_color_buff = null;

var canvas_width = 640.0;
var canvas_height = 320.0;

var max_row = canvas_height / 32.0;
var max_col = canvas_width / 32.0;

var color_picker = 0;

/* 程序入口函数 */
function main(){
    color_picker = document.getElementById("colorInputer");
    var canvas = document.getElementById("gl_canvas");
    canvas.onmousedown = onDown;

    gl = canvas.getContext("webgl");

    /* 获取shader程序片段内容 */
    var vs_src = document.getElementById("vs_src").value;
    var fs_src = document.getElementById("fs_src").value;

    /* 加载shader */
    loadShader(vs_src, fs_src);
    
    /* 创建program着色器程序 */
    createProgram();
    /* 使用着色器程序 */
    gl.useProgram(program);

    /* 初始化GL需要的顶点数据 */
    init();

    setInterval(render, 100);
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
        alert("error:program");
        return;
    }
}

function init(){
    vertex_data = new Array(24 * max_row * max_col);
    vertext_color = new Array(24 * max_row * max_col);
    fillVertData();


    vertex_data_buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_data_buff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_data), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);


    vertext_color_buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertext_color_buff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertext_color), gl.STATIC_DRAW);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);
}

function render(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertext_color_buff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertext_color), gl.STATIC_DRAW);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);

    gl.drawArrays(gl.TRIANGLES, 0, 6 * max_row * max_col);
}


function fillVertData(){
    /* 我们只需要xy */
    var start_data = [
        0, 0,
        0, 1.0,
        1.0, 0,

        1.0, 0,
        0, 1.0,
        1.0, 1.0
        ];

    for (var row = 0; row < max_row; row++){
        for (var col = 0; col < max_col; col++){
            /* 当前正方形第一个三角形的第一个顶�?*/
            var start = (max_col * row + col) * 24;

            /* 遍历6个顶�?*/
            for (var t = 0; t < 6; t++){
                var i = start + t * 4;
                /* 计算顶点的x坐标, first_x + col * width */
                vertex_data[i + 0] = start_data[t * 2 + 0] + col * 1.0;
                /* 计算顶点的y坐标, first_y + row * height */
                vertex_data[i + 1] = start_data[t * 2 + 1] + row * 1.0;
                 /* 顶点坐标的z */
                vertex_data[i + 2] = 0;

                 /* 顶点坐标的w */
                vertex_data[i + 3] = 1;

                /* 先将x坐标归一化到0~1之间, 然后再缩放到-1~1之间 */
                vertex_data[i + 0] = vertex_data[i + 0] / max_col * 2.0 - 1.0;
                /* y坐标处理方式跟x坐标一�?除了y坐标需要翻�? 因为我们的像素y轴朝�?与GL正好相反 */
                vertex_data[i + 1] = -(vertex_data[i + 1] / max_row * 2.0 - 1.0);
            }

            /* 所有的颜色都初始化为白�?*/
            for (var t = 0; t < 24; t++){
                vertext_color[start + t] = 1.0;
            }
        }
    }

    //alert(vertex_data);
}

function onDown(event){
    /* �?xFFFFF转换为RGB格式. */
    var color = color_picker.value.slice(1);

    /* 分别获取16位进制的rgb */
    var r = color.slice(0, 2);
    var g = color.slice(2, 4);
    var b = color.slice(4, 6);

    /* 转换�?0进制,并且归一�?*/
    r = parseInt(r, 16) / 255.0;
    g = parseInt(g, 16) / 255.0;
    b = parseInt(b, 16) / 255.0;

    /* 鼠标点击的坐�? 并换算为像素正方形的索引 */
    var x = Math.floor(event.clientX / 32.0);
    var y = Math.floor(event.clientY / 32.0);

    /* 更新点击的正方形像素的颜�?*/
    var start = (y * max_col + x) * 24;
    for (var t = 0; t < 6; t++){
        vertext_color[start + t * 4 + 0] = r;
        vertext_color[start + t * 4 + 1] = g;
        vertext_color[start + t * 4 + 2] = b;
    }
}

