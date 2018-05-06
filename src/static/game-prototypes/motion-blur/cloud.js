function Cloud() {
    this.points = []
}

Cloud.prototype.add = function(x, y, z, size, red, green, blue, exponent) {
    this.points.push(arguments)
}

Cloud.prototype.draw = function(program, oldTransform, newTransform, red, green, blue) {    
    if(!this.built) {
        var vertices = []
        var indices = []
        
        for(var i = 0; i < this.points.length; i++) {
            var point = this.points[i]
            vertices.push(point[0])
            vertices.push(point[1])
            vertices.push(point[2])
            vertices.push(-point[3])
            vertices.push(-point[3])
            vertices.push(point[4])
            vertices.push(point[5])
            vertices.push(point[6])
            vertices.push(point[7])
            
            vertices.push(point[0])
            vertices.push(point[1])
            vertices.push(point[2])
            vertices.push(-point[3])
            vertices.push(point[3])
            vertices.push(point[4])
            vertices.push(point[5])
            vertices.push(point[6])
            vertices.push(point[7])
            
            vertices.push(point[0])
            vertices.push(point[1])
            vertices.push(point[2])
            vertices.push(point[3])
            vertices.push(point[3])
            vertices.push(point[4])
            vertices.push(point[5])
            vertices.push(point[6])
            vertices.push(point[7])
            
            vertices.push(point[0])
            vertices.push(point[1])
            vertices.push(point[2])
            vertices.push(point[3])
            vertices.push(-point[3])
            vertices.push(point[4])
            vertices.push(point[5])
            vertices.push(point[6])
            vertices.push(point[7])
            
            indices.push(i * 4)
            indices.push(i * 4 + 1)
            indices.push(i * 4 + 2)
            indices.push(i * 4 + 2)
            indices.push(i * 4 + 3)
            indices.push(i * 4)
        }
        
        this.vertexBuffer = GL.createBuffer()
        GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.STATIC_DRAW)
        
        this.indexBuffer = GL.createBuffer()
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), GL.STATIC_DRAW)
        
        this.built = true
    } else {
        GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexBuffer)
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
    }
    
    GL.useProgram(program)
    
    var locationAttrib = GL.getAttribLocation(program, "location")
    GL.enableVertexAttribArray(locationAttrib)
    GL.vertexAttribPointer(locationAttrib, 3, GL.FLOAT, false, 4 * (3 + 2 + 3 + 1), 0)
    
    var uvAttrib = GL.getAttribLocation(program, "uv")
    GL.enableVertexAttribArray(uvAttrib)
    GL.vertexAttribPointer(uvAttrib, 2, GL.FLOAT, false, 4 * (3 + 2 + 3 + 1), 4 * 3)
    
    var colorAttrib = GL.getAttribLocation(program, "color")
    GL.enableVertexAttribArray(colorAttrib)
    GL.vertexAttribPointer(colorAttrib, 3, GL.FLOAT, false, 4 * (3 + 2 + 3 + 1), 4 * (3 + 2))    
    
    var exponentAttrib = GL.getAttribLocation(program, "exponent")
    GL.enableVertexAttribArray(exponentAttrib)
    GL.vertexAttribPointer(exponentAttrib, 1, GL.FLOAT, false, 4 * (3 + 2 + 3 + 1), 4 * (3 + 2 + 3))   
    
    GL.uniformMatrix4fv(GL.getUniformLocation(program, "oldTransform"), false, oldTransform)
    GL.uniformMatrix4fv(GL.getUniformLocation(program, "newTransform"), false, newTransform)
    GL.uniform2f(GL.getUniformLocation(program, "aspect"), window.innerWidth > window.innerHeight ? window.innerHeight / window.innerWidth : 1, window.innerHeight > window.innerWidth ? window.innerWidth / window.innerHeight : 1)
    
    GL.uniform1f(GL.getUniformLocation(program, "bank"), BankSlider.value)
    GL.uniform1f(GL.getUniformLocation(program, "pitch"), PitchSlider.value)
    GL.uniform1f(GL.getUniformLocation(program, "yaw"), YawSlider.value)
    GL.uniform1f(GL.getUniformLocation(program, "roll"), RollSlider.value)
    
    GL.drawElements(GL.TRIANGLES, 6 * this.points.length, GL.UNSIGNED_SHORT, 0)
    
    GL.disableVertexAttribArray(locationAttrib)
    GL.disableVertexAttribArray(uvAttrib)
    GL.disableVertexAttribArray(colorAttrib)
    GL.disableVertexAttribArray(exponentAttrib)
    
    GL.bindBuffer(GL.ARRAY_BUFFER, null)
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null)
}