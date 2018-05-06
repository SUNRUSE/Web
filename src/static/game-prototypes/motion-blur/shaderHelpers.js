function CreateShader(type, source) {
    var shader = GL.createShader(type)
    GL.shaderSource(shader, source)
    GL.compileShader(shader)
    if(!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
        alert("Failed to compile a WebGL shader.  Please ensure that your browser is up to date.  The error message returned by the browser follows:\n\n" + GL.getShaderInfoLog(shader))
        throw new Error("Failed to link program; " + GL.getShaderInfoLog(shader))
    }
    return shader
}

function CreateProgram(vertex, fragment) {
    var program = GL.createProgram()
    GL.attachShader(program, vertex)
    GL.attachShader(program, fragment)
    GL.linkProgram(program)
    if(!GL.getProgramParameter(program, GL.LINK_STATUS)) {
        alert("Failed to link a WebGL shader program.  Please ensure that your browser is up to date.  The error message returned by the browser follows:\n\n" + GL.getProgramInfoLog(program))
        throw new Error("Failed to link program; " + GL.getProgramInfoLog(program))
    }
    GL.detachShader(program, vertex)
    GL.detachShader(program, fragment)
    return program
}