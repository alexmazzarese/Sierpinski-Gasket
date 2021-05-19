"use strict";

var gl;
var points;
var color = [0.0, 0.0, 0.0, 1.0];
var NumPoints;
var red;
var green;
var blue;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    NumPoints = 5000;
    var vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];

    draw(vertices, program);

    document.getElementById("mySlider").onchange = function(event) {
        NumPoints = event.target.value;
        draw(vertices, program, color);
        render();
    };

    document.getElementById("clear").onclick = function(event) {
        clear(program);  
    };

    document.getElementById("draw").onclick = function(event) {
        changeColors(program);
        draw(vertices, program, color);
        render();
    };

    document.getElementById("animate").onclick = function(event) {
        animate(program, vertices);
    }
    
    document.getElementById("red").onchange = function(event) {
        changeColors(program);
        draw(vertices, program, color);
        render();
    }

    document.getElementById("green").onchange = function(event) {
        changeColors(program);
        draw(vertices, program, color);
        render();
    }

    document.getElementById("blue").onchange = function(event) {
        changeColors(program);
        draw(vertices, program, color);
        render();
    }
};

const clear = (program) => {
    var reset = vec3(0, 0, 0);
    points = 0;
    buffer(points, program, reset);
    render();
}

const animate = async (program, vertices) => {
    var tmp;
    for(var index = 0; index < 10; index++) {
        tmp = changeSize(vertices[0], vertices[1], vertices[2]);
        vertices[0] = tmp[0];
        vertices[1] = tmp[1];
        vertices[2] = tmp[2];
        draw(vertices, program);
        render();
        await new Promise(r => setTimeout(r, 400));
    }
    await new Promise(r2 => setTimeout(r2, 400));
    for(var index2 = 0; index2 < 10; index2++) {
        tmp = changeSizeBack(vertices[0], vertices[1], vertices[2]);
        vertices[0] = tmp[0];
        vertices[1] = tmp[1];
        vertices[2] = tmp[2];
        draw(vertices, program);
        render();
        await new Promise(r3 => setTimeout(r3, 400));
    }
}

const changeColors = (program) => {
    red = document.getElementById("red").value;
    green = document.getElementById("green").value;
    blue = document.getElementById("blue").value;
    color = [red, green, blue, 1.0];
    var colorFile = gl.getUniformLocation(program, "vColor");
    gl.uniform4fv(colorFile, color);
}

const render = () => {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, points.length );
}

const changeSize = (vert1, vert2, vert3) => {
    vert1 = scale(0.75, vert1);
    vert2 = scale(0.75, vert2);
    vert3 = scale(0.75, vert3);
    return [vert1, vert2, vert3];
}

const changeSizeBack = (vert1, vert2, vert3) => {
    vert1 = scale(1.33, vert1);
    vert2 = scale(1.33, vert2);
    vert3 = scale(1.33, vert3);
    return [vert1, vert2, vert3];
}

const buffer = (points, program, color) => {
    var colorId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(color), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}

const draw = (vertices, program, color) => {
    var colors = [];
    var coeffs = vec3(Math.random(), Math.random(), Math.random());
    coeffs = normalize(coeffs);
    var u = scale(coeffs[0], vertices[0]);
    var v = scale(coeffs[1], vertices[1]);
    var w = scale(coeffs[2], vertices[2]);
    var p = add(u, add(v, w));
    points = [ p ];

    for ( var i = 0; points.length < NumPoints; ++i ) {
        var j = Math.floor(Math.random() * 3);
        p = add( points[i], vertices[j] );
        p = scale( 0.5, p );
        colors.push(color);
        points.push(p);
    }
    buffer(points, program, colors);
}