addEventListener("load", function(){
    var loading = document.getElementById("loading-description")
    var canvas = document.getElementsByTagName("CANVAS")[0]
    var canvasContainer = document.getElementById("canvas-container")
    
    function SetMessage(message) {
        loading.textContent = message
    }
    
    SetMessage("Opening WebGL context...")
   
    function Asynchronize(callback) {
        setTimeout(function(){
            try {
                callback()
            } catch(e) {
                SetMessage("An unhandled exception was thrown while loading this shader:\n" + e)
            }
        }, 100)
    }
    
    Asynchronize(OpenContext)
    
    var context
    function OpenContext() {
        var settings = {
            alpha: false,
            depth: false,
            stencil: false,
            antialias: false,
            premultipliedAlpha: false
        }
        context = canvas.getContext("webgl", settings) || canvas.getContext("experimental-webgl", settings)
        if (!context)
            SetMessage("Failed to get a WebGL context.  Please ensure that your device and browser are up to date.")
        else
            Asynchronize(CompileVertexShader)
    }
    
    function CompileShader(type, source, then) {
        var shader = context.createShader(type)
        context.shaderSource(shader, source)
        context.compileShader(shader)
        if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
            SetMessage("Failed to compile a WebGL shader.\nPlease ensure that your browser and device are up to date.\nThe error message returned by the browser follows:\n" + context.getShaderInfoLog(shader))
        } else {
            then(shader)
        }
    }
    
    var vertexShader
    function CompileVertexShader() {
        SetMessage("Compiling vertex shader...")
        CompileShader(context.VERTEX_SHADER, [
            "#ifdef GL_ES",
            "precision mediump float;",
            "#endif",
            "attribute vec2 location;",
            "void main() {",
            "gl_Position = vec4(location, 0.0, 1.0);",
            "}"
        ].join("\n"), function(shader){
            vertexShader = shader
            Asynchronize(CompileFragmentShader)
        })
    }
    
    var fragmentShader
    function CompileFragmentShader() {
        SetMessage("Compiling fragment shader...")
        CompileShader(context.FRAGMENT_SHADER, document.getElementById("code").textContent, function(shader){
            fragmentShader = shader
            Asynchronize(LinkProgram)
        })
    }
    
    var program
    function LinkProgram() {
        SetMessage("Linking program...")
        program = context.createProgram()
        context.attachShader(program, vertexShader)
        context.attachShader(program, fragmentShader)
        context.linkProgram(program)
        if (!context.getProgramParameter(program, context.LINK_STATUS)) {
            loading.textContent = "Failed to link a WebGL program.\nPlease ensure that your browser and device are up to date.\nThe error message returned by the browser follows:\n" + context.getProgramInfoLog(shader)
        } else Asynchronize(GenerateBuffers)
    }
    
    function GenerateBuffer(type, data) {
        var buffer = context.createBuffer(type)
        context.bindBuffer(type, buffer)
        context.bufferData(type, data, context.STATIC_DRAW)
        return buffer
    }
    
    var vertexBuffer, indexBuffer
    function GenerateBuffers() {
        SetMessage("Generating buffers...")
        vertexBuffer = GenerateBuffer(context.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]))
        fragmentBuffer = GenerateBuffer(context.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 2, 3, 0]))
        Asynchronize(StartRenderLoop)
    }
    
    var secondsUniform, resolutionUniform
    var run = false
    function StartRenderLoop() {
        SetMessage("Starting render loop...")
        context.useProgram(program)
        var locationAttribute = context.getAttribLocation(program, "location")
        context.enableVertexAttribArray(locationAttribute)
        context.vertexAttribPointer(locationAttribute, 2, context.FLOAT, context.FALSE, 0, 0)
        secondsUniform = context.getUniformLocation(program, "seconds")
        resolutionUniform = context.getUniformLocation(program, "resolution")
        var mouseUniform = context.getUniformLocation(program, "mouse")
        
        canvas.addEventListener("mousemove", function(e) {
            context.uniform2f(mouseUniform, e.clientX - canvasContainer.offsetLeft, canvasContainer.offsetHeight - (e.clientY - canvasContainer.offsetTop))
            if (!run) requestAnimationFrame(Render)
        })
        
        canvas.addEventListener("touchmove", function(e) {
            context.uniform2f(mouseUniform, e.touches[0].clientX - canvasContainer.offsetLeft, canvasContainer.offsetHeight - (e.touches[0].clientY - canvasContainer.offsetTop))
            if (!run) requestAnimationFrame(Render)
            e.preventDefault()
        })
        
        document.getElementById("play").addEventListener("change", function(e) {
            if (e.target.checked) {
                run = true
                requestAnimationFrame(Render)
            } else
                run = false
        })
        
        document.getElementById("show-code").addEventListener("change", function(e) {
            if (e.target.checked) {
                document.body.setAttribute("showing-code", "true")
            } else
                document.body.removeAttribute("showing-code", "true")
            CenterMouse()
        })
        
        document.body.removeChild(document.getElementById("loading"))
        
        function CenterMouse() {
            context.uniform2f(mouseUniform, canvasContainer.offsetWidth / 2, canvasContainer.offsetHeight / 2)
            if (!run) requestAnimationFrame(Render)
        }
        addEventListener("resize", CenterMouse)
        CenterMouse()
        run = true;
    }
    
    var elapsed = 0, lastTime = null
    function Render(time) {
        if (lastTime === null) {
            lastTime = time
        } else {
            elapsed += time - lastTime
            lastTime = time
        }
        canvas.width = canvasContainer.offsetWidth
        canvas.height = canvasContainer.offsetHeight
        context.viewport(0, 0, canvasContainer.offsetWidth, canvasContainer.offsetHeight)
        context.uniform1f(secondsUniform, elapsed / 1000)
        context.uniform2f(resolutionUniform, canvasContainer.offsetWidth, canvasContainer.offsetHeight)
        context.drawElements(context.TRIANGLES, 6, context.UNSIGNED_SHORT, 0)
        if (run) 
            requestAnimationFrame(Render)
        else
            lastTime = null
    }
})