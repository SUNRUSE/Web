var GL, canvas, program, track

function OnLoad() {
    canvas = document.getElementsByTagName("canvas")[0]
    
    GL = canvas.getContext("experimental-webgl")
    
    if(!GL) {
        alert("Failed to open a WebGL context.  Please ensure that your browser is up to date and that WebGL is enabled.")
        throw new Error("Failed to get WebGL context")
    }
    
    program = CreateProgram(CreateShader(GL.VERTEX_SHADER, Shaders.vertex), CreateShader(GL.FRAGMENT_SHADER, Shaders.fragment))
    
    GL.clearColor(0, 0, 0, 1)
    GL.blendFunc(GL.ONE, GL.ONE)
    GL.enable(GL.BLEND)
    
    track = new Cloud()
    for(var i = 0; i < 128; i++) {
        track.add(0, -2, i * 8, 0.6, 2, 1.2, 0.2, 3)
        track.add(6, -2, i * 8, 0.6, 2, 1.2, 0.2, 3)
        track.add(-6, -2, i * 8, 0.6, 2, 1.2, 0.2, 3)
        track.add(12, -2, i * 8, 0.6, 2, 1.2, 0.2, 3)
        track.add(-12, -2, i * 8, 0.6, 2, 1.2, 0.2, 3)
        
        track.add(0, -2, i * 8 + 2, 0.2, 2, 0.5, 0.2, 3)
        track.add(6, -2, i * 8 + 2, 0.2, 2, 0.5, 0.2, 3)
        track.add(-6, -2, i * 8 + 2, 0.2, 2, 0.5, 0.2, 3)
        track.add(12, -2, i * 8 + 2, 0.2, 2, 0.5, 0.2, 3)
        track.add(-12, -2, i * 8 + 2, 0.2, 2, 0.5, 0.2, 3)
        
        track.add(-14, Math.abs(Math.sin(i * Math.PI / 8)) * -20 + 20, i * 8, 3, 0.2, 1, 1.5, 5)
        track.add(14, Math.abs(Math.sin(i * Math.PI / 8)) * -20 + 20, i * 8, 3, 0.2, 1, 1.5, 5)
    }
    
    for(var i = 0; i < 16; i++) {
        track.add(-3, 20, i * 64, 1, 0, 1, 0, 3)
        track.add(-8, 20, i * 64, 1, 0, 1, 0, 3)
        track.add(3, 20, i * 64, 1, 0, 1, 0, 3)
        track.add(8, 20, i * 64, 1, 0, 1, 0, 3)
        track.add(-14, 12, i * 64, 1, 0, 1, 0, 3)
        track.add(14, 12, i * 64, 1, 0, 1, 0, 3)
        track.add(-14, 6, i * 64, 1, 0, 1, 0, 3)
        track.add(14, 6, i * 64, 1, 0, 1, 0, 3)
        track.add(-14, 0, i * 64, 1, 0, 1, 0, 3)
        track.add(14, 0, i * 64, 1, 0, 1, 0, 3)
    }
    
    window.requestAnimationFrame(Update)
}

var lastTimestamp = null
var newLocation = 0
var oldLocation = 0

function Update(timestamp) {
    var delta = 0
    if(lastTimestamp !== null) delta = (timestamp - lastTimestamp) / 1000
    oldLocation = newLocation
    newLocation -= delta * SpeedSlider.value
    
    Draw()
    
    lastTimestamp = timestamp
    window.requestAnimationFrame(Update)
}

var newTransform = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
]

var oldTransform = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
]

function Draw() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    GL.viewport(0, 0, window.innerWidth, window.innerHeight)
    
    GL.clear(GL.COLOR_BUFFER_BIT)
    oldTransform[11] = oldLocation
    newTransform[11] = newLocation
    track.draw(program, oldTransform, newTransform, 1, 1, 1)
}

function ResetCamera() {
    newLocation = 0
    
    // Prevent page refresh.
    event.preventDefault()
}