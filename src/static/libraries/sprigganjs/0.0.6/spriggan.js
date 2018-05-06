window.onerror = function() {
    alert.apply(window, arguments)
    var element = document.getElementById("loading")
    if (element) document.body.removeChild(element)
    while (SprigganAllContentManagers.length) SprigganAllContentManagers[0].dispose()
}

function SprigganRemoveByValue(array, value) {
    for (var i = 0; i < array.length; i++) if (array[i] == value) {
        array.splice(i, 1)
        return
    }
}

function SprigganSetLoadingText(text) {
    var element = document.getElementById("loading")
    if (!element) return
    element.innerText = text
}

SprigganSetLoadingText("Now loading scripts...")

window.onload = function() {
    SprigganSetLoadingText("Now loading content...")
    document.body.style.transition = "background 0.5s linear, color 0.5s linear"
    document.body.style.color = "white"
    document.body.style.background = "black"
    var callback
    var contentManager = new SprigganContentManager({
        progress: function(loaded, total) {
            SprigganSetLoadingText("Now loading content... (" + loaded + "/" + total + ")")
        },
        loaded: function() {
            document.body.removeChild(document.getElementById("loading"))
            callback.call(contentManager, contentManager)
        }
    })
    callback = SprigganBoot.call(contentManager, contentManager)
}

function SprigganTimer(seconds, configuration) {   
    this.seconds = seconds
    this.milliseconds = seconds * 1000
    
    this.configuration = configuration
    this.started = null
    this.elapsed = 0
    this.done = false
    this.timeout = null
    this.interval = null
}

SprigganTimer.prototype.pause = function() {
    if (this.timeout) {
        this.elapsed += new Date().getTime() - this.started
        this.started = null
        clearTimeout(this.timeout)
        this.timeout = null
        if (this.interval) {
            clearInterval(this.interval)
            this.interval = null
        }
        if (this.configuration.paused) this.configuration.paused.call(this, this)
    }
}

SprigganTimer.prototype.resume = function() {
    if (!this.timeout && !this.done) {
        var timer = this
        this.timeout = setTimeout(function(){
            timer.done = true
            timer.timeout = null
            if (timer.interval) {
                clearInterval(timer.interval)
                timer.interval = null
            }
            if (timer.configuration.completed) timer.configuration.completed.call(timer, timer)
        }, this.milliseconds - this.elapsedMilliseconds())
        if (this.configuration.progress) {
            this.interval = setInterval(function(){
                timer.configuration.progress.call(timer, timer)
            }, 1000 / 20)
        }
        this.started = new Date().getTime()
        if (this.configuration.resumed) this.configuration.resumed.call(this, this)
    }
}

SprigganTimer.prototype.elapsedMilliseconds = function() {
    if (this.done) return this.milliseconds
    return Math.min(this.milliseconds, this.elapsed + (this.timeout ? (new Date().getTime() - this.started) : 0))
}

SprigganTimer.prototype.elapsedSeconds = function() {
    return this.elapsedMilliseconds() / 1000
}

SprigganTimer.prototype.progress = function() {
    return this.seconds ? this.elapsedSeconds() / this.seconds : 1
}

var SprigganAllContentManagers = []

function SprigganContentManager(configuration) {
    this.completed = 0
    this.total = 0
    this.content = []
    this.configuration = configuration
    SprigganAllContentManagers.push(this)
}

SprigganMakeDisposable(SprigganContentManager, function(){
    SprigganRemoveByValue(SprigganAllContentManagers, this)
    while(this.content.length) {
        var content = this.content.pop()
        if (content.loaded) content.dispose()
    }
})

SprigganContentManager.prototype.find = function(url) {
    if (this.disposed) throw new Error("This SprigganContentManager has been disposed of")
    for (var i = 0; i < this.content.length; i++) {
        var content = this.content[i]
        if (content.url == url) return content
    }
    return null
}

SprigganContentManager.prototype.get = function(type, url) {
    var content = this.find(url)
    if (this.completed != this.total) throw new Error("This ContentManager has not finished loading")
    if (!content) throw new Error("No content named \"" + url + "\" was loaded into this SprigganContentManager")
    if (content.type != type) throw new Error("Content \"" + url + "\" was loaded as a \"" + content.type.name + "\", but was accessed as a \"" + type.name + "\"")
    return content.value
}

SprigganContentManager.prototype.add = function(type, url) {
    var existing = this.find(url)
    if (this.completed) throw new Error("Cannot add content to a SprigganContentManager once content has loaded")
    if (existing) {
        if (existing.type != type) throw new Error("Content \"" + url + "\" was first loaded as a \"" + existing.type.name + "\", but was loaded again as a \"" + type.name + "\"")
    } else {
        this.total++
        var contentManager = this
        var content = {
            url: url,
            type: type,
            dispose: type(url, function(value) { 
                contentManager.completed++
                content.loaded = true
                if (contentManager.disposed) {
                    content.dispose()
                } else {
                    content.value = value
                    if (contentManager.configuration.progress) 
                        contentManager.configuration.progress.call(contentManager, contentManager.completed, contentManager.total, contentManager)
                    if (contentManager.completed == contentManager.total && contentManager.configuration.loaded) 
                        contentManager.configuration.loaded.call(contentManager, contentManager)
                }
            })
        }
        this.content.push(content)
    }
}

function SprigganText(url, onSuccess) {
    var request = new XMLHttpRequest()
    request.onreadystatechange = function() {
        if (request.readyState != 4) return
        if (request.status >= 200 && request.status <= 299)
            onSuccess(request.responseText)
        else throw new Error("Failed to download \"" + url + "\" as text; HTTP status code " + request.status + " was returned")
    }
    request.open("GET", url, true)
    request.send()
    return function() {}
}

function SprigganJson(url, onSuccess) {
    return SprigganText(url, function(text){
        var value
        try {
            if (window.JSON)
                value = JSON.parse(text) // Chrome, Firefox, Edge.
            else
                value = eval("(" + text + ")") // IE.
        } catch(e) {
            throw new Error("Failed to parse \"" + url + "\" as JSON")
        }
        onSuccess(value)
    })
}

function SprigganImage(url, onSuccess) {
    var image = new Image()
    image.onload = function() {
        onSuccess(image)
    }
    image.onerror = function() {
        throw new Error("Failed to load \"" + url + "\" as a PNG image")
    }
    image.src = url
    return function() {}
}

function SprigganSpriteSheet(url, onSuccess) {
    var json, image
    
    var disposeJson = new SprigganJson(url + ".json", function(value){
        json = value
        CheckFullyLoaded()
    })
    
    var disposeImage = new SprigganImage(url + ".png", function(value){
        image = value
        CheckFullyLoaded()
    })
    
    var sprites = []
    
    function CheckFullyLoaded() {
        if (!json) return
        if (!image) return
        
        var value = {
            image: image.cloneNode(true),
            sprites: sprites
        }
        
        value.image.style.touchAction = "manipulation" // Improves responsiveness on IE/Edge on touchscreens.
        
        if ("imageRendering" in value.image.style) {
            value.image.style.imageRendering = "pixelated" // Chrome.
            value.image.style.imageRendering = "-moz-crisp-edges" // Firefox.
        } else if ("msInterpolationMode" in value.image.style) {
            value.image.style.msInterpolationMode = "nearest-neighbor" // IE.
        } else {
            // Workaround for Edge as it always uses linear interpolation; scale up 4x in a canvas to ensure that the pixels stay mostly square.
            var canvas = document.createElement("CANVAS")
            canvas.width = image.width * 4
            canvas.height = image.height * 4
            var context = canvas.getContext("2d")
            context.msImageSmoothingEnabled = false
            context.drawImage(image, 0, 0, image.width * 4, image.height * 4)
            value.image.src = canvas.toDataURL("image/png")
        }
        
        value.image.style.position = "absolute"
        value.image.style.width = image.width + "em"
        value.image.style.height = image.height + "em"
        
        var animations = {}
        
        for (var key in json.animations) {
            var animation = json.animations[key]
            var converted = []
            for (var i = 0; i < animation.length; i++) {
                var frame = json.frames[animation[i]]
                converted.push({
                    imageLeft: -frame[0] + "em",
                    imageTop: -frame[1] + "em",
                    wrapperWidth: (1 + frame[2] - frame[0]) + "em",
                    wrapperHeight: (1 + frame[3] - frame[1]) + "em",
                    wrapperMarginLeft: (frame[0] - frame[4]) + "em",
                    wrapperMarginTop: (frame[1] - frame[5]) + "em",
                    duration: frame[6]
                })
            }
            animations[key] = converted
        }
        
        value.getAnimationByName = function(name) {
            for (var key in animations) if (key == name) return animations[key]
            throw new Error("Animation \"" + name + "\" does not exist in this SprigganSpriteSheet")
        }
        
        onSuccess(value)
    }
    
    return function() {
        disposeJson()
        disposeImage()
        while (sprites.length) sprites[0].dispose()
    }
}

function SprigganSound(url, onSuccess) {
    var disposed = false
    if (!SprigganEventWasTriggeredByUserInteraction) throw new Error("Some platforms only support loading audio from a click/touch event")
    var audio
    if (!window.Audio) {
        // Older versions of IE have no support for HTML audio.
        // This effectively dummies out HTML audio.
        setTimeout(function(){
            onSuccess(function() { if (disposed) throw new Error("This SprigganSound has been disposed of") })
        }, 0)
    } else {
        audio = new Audio()
        
        audio.onloadeddata = function() {
            audio.onloadeddata = null
            audio.onerror = null
            onSuccess(function(){
                if (disposed) throw new Error("This SprigganSound has been disposed of")
                audio.currentTime = 0
                audio.play()
            })
        }
        
        audio.onerror = function() {
            audio.onloadeddata = null
            audio.onerror = null
            throw new Error("Failed to download \"" + url + "\" as a sound")
        }
        
        audio.src = url
        audio.load()
    }
    
    return function() { 
        disposed = true
        if (audio) audio.pause()
    }
}

function SprigganMusic(url, onSuccess) {
    var disposed = false
    if (!SprigganEventWasTriggeredByUserInteraction) throw new Error("Some platforms only support loading audio from a click/touch event")
    var audio
    if (!window.Audio) {
        // Older versions of IE have no support for HTML audio.
        // This effectively dummies out HTML audio.
        setTimeout(function(){
            onSuccess({
                play: function() { if (disposed) throw new Error("This SprigganMusic has been disposed of") },
                resume: function() { if (disposed) throw new Error("This SprigganMusic has been disposed of") },
                pause: function() { if (disposed) throw new Error("This SprigganMusic has been disposed of") },
                stop: function() { if (disposed) throw new Error("This SprigganMusic has been disposed of") }
            })
        }, 0)
    } else {
        audio = new Audio()
        
        audio.onloadeddata = function() {
            audio.onloadeddata = null
            audio.onerror = null
            onSuccess({
                play: function() {
                    if (disposed) throw new Error("This SprigganMusic has been disposed of")
                    audio.currentTime = 0
                    audio.play()
                }, 
                resume: function() {
                    if (disposed) throw new Error("This SprigganMusic has been disposed of")
                    audio.play()
                }, 
                pause: function() {
                    if (disposed) throw new Error("This SprigganMusic has been disposed of")
                    audio.pause()
                }, 
                stop: function() {
                    if (disposed) throw new Error("This SprigganMusic has been disposed of")
                    audio.pause()
                    audio.currentTime = 0
                }
            })
        }
        
        audio.onerror = function() {
            audio.onloadeddata = null
            audio.onerror = null
            throw new Error("Failed to download \"" + url + "\" as a sound")
        }
        
        audio.src = url
        audio.loop = true
        audio.load()
    }
    
    return function() { 
        disposed = true
        if (audio) audio.pause()
    }
}

function SprigganMakeConstructable(type, onConstruction) {
    type.prototype.construct = function() {
        for (var i = 0; i < this.onConstruction.length; i++) this.onConstruction[i].call(this, this)
    }
    type.prototype.onConstruction = []
    if (onConstruction) type.onConstruction.push(onConstruction)
}

function SprigganMakeDisposable(type, onDisposal) {
    type.prototype.disposed = false
    
    type.prototype.onDisposal = []
    if (onDisposal) type.prototype.onDisposal.push(onDisposal)
    
    type.prototype.dispose = function() {
        if (this.disposed) return
        this.disposed = true
        for (var i = 0; i < this.onDisposal.length; i++) this.onDisposal[i].call(this, this)
    }
}

function SprigganMakeElementWrapper(type) {
    type.prototype.onConstruction.push(function(){
        this.element = document.createElement("DIV")
    })
    type.prototype.onDisposal.push(function(){
        this.element.parentNode.removeChild(this.element)
    })
}

function SprigganMakeChild(type) {
    type.prototype.onConstruction.push(function(){
        this.parent.children.push(this)
        this.parent.element.appendChild(this.element)
    })
    type.prototype.onDisposal.push(function(){
        SprigganRemoveByValue(this.parent.children, this)
    })
}

function SprigganMakeParent(type) {
    type.prototype.onConstruction.push(function(){
        this.children = []
    })
    type.prototype.onPausing.push(function(){
        for (var i = 0; i < this.children.length; i++) this.children[i].pause()
    })
    type.prototype.onResuming.push(function(){
        for (var i = 0; i < this.children.length; i++) this.children[i].resume()
    })
    type.prototype.onDisposal.push(function(){
        while (this.children.length) this.children[0].dispose()
    })
}

function SprigganMakePausable(type, onPausing, onResuming) {
    type.prototype.onPausing = []
    type.prototype.onResuming = []
    
    if (onPausing) type.prototype.onPausing.push(onPausing)
    if (onResuming) type.prototype.onResuming.push(onResuming)
    
    type.prototype.onConstruction.push(function(){
        if (this.parent) 
            this.paused = this.parent.paused
        else
            this.paused = false
    })
    type.prototype.onDisposing = function() {
        this.pause()
    }
    
    type.prototype.pause = function() {
        // We don't check if this is paused here as this would break the following scenario:
        // - Sprite inside group inside viewport.
        // - Pause group.
        // - Resume sprite.
        // - Sprite is now animating even though group is paused.
        // - Pause viewport.
        // - It is expected that this pauses everything inside the viewport, but as the group is paused it does not recurse down to the sprite.
        this.paused = true
        for (var i = 0; i < this.onPausing.length; i++) this.onPausing[i].call(this, this)
    }
    
    type.prototype.resume = function() {
        // We don't check if this is paused here for the same reason as outlined in pause().
        this.paused = false
        for (var i = 0; i < this.onResuming.length; i++) this.onResuming[i].call(this, this)
    }
}

var SprigganEventWasTriggeredByUserInteraction = false

function SprigganMakeClickable(type) {
    type.prototype.onConstruction.push(function(){
        var instance = this
        if (!instance.clicked) return
        instance.element.onclick = function() {
            try {
                SprigganEventWasTriggeredByUserInteraction = true
                instance.clicked()
            } finally {
                SprigganEventWasTriggeredByUserInteraction = false
            }
        }
    })
}

function SprigganMakeMovable(type) {
    type.prototype.onConstruction.push(function(){
        this.move(0, 0)
    })
    
    type.prototype.onPausing.push(function(){
        if (this.movement) this.movement.pause()
    })
    
    type.prototype.onResuming.push(function(){
        if (this.movement) this.movement.resume()
    })
    
    type.prototype.move = function(x, y) {
        if (this.movement) {
            this.movement.pause()
            this.movement = null
        }
        if ("transform" in this.element.style) {
            // IE10+, Edge, Firefox, Chrome.
            this.element.style.transition = "initial"
            this.element.style.transform = "translate(" + x + "em, " + y + "em)"
        } else {
            // IE9-.
            this.element.style.left = x  + "em"
            this.element.style.top = y  + "em"
        }
        this.x = function() { return x }
        this.y = function() { return y }
    }
    
    type.prototype.moveOverSeconds = function(x, y, seconds, then) {
        var instance = this
        if (instance.movement) instance.movement.pause()
        var fromX = instance.x()
        var fromY = instance.y()
        var timer
        var currentX = instance.x = function() { return fromX + (x - fromX) * timer.progress() }
        var currentY = instance.y = function() { return fromY + (y - fromY) * timer.progress() }
        if ("transform" in this.element.style) {
             // IE10+, Edge, Firefox, Chrome.
            instance.element.offsetHeight // Forces a reflow; required for transitions to work.
            timer = instance.movement = new SprigganTimer(seconds, {
                completed: then,
                paused: function() {
                    instance.element.style.transition = "initial"
                    instance.element.style.transform = "translate(" + currentX() + "em, " + currentY() + "em)"
                }, 
                resumed: function() {
                    instance.element.style.transition = "transform " + (seconds - timer.elapsedSeconds()) + "s linear"
                    instance.element.style.transform = "translate(" + x + "em, " + y + "em)"
                }
            })
        } else {
            // IE9-.
            function UpdatePosition() {
                instance.element.style.left = currentX() + "em"
                instance.element.style.top = currentY() + "em"
            }
            timer = instance.movement = new SprigganTimer(seconds, {
                completed: function() {
                    instance.element.style.left = x + "em"
                    instance.element.style.top = y + "em"
                    if (then) then()
                },
                paused: UpdatePosition,
                progress: UpdatePosition
            })
        }
        if (!instance.paused) timer.resume()
    }
    
    type.prototype.moveAtPixelsPerSecond = function(x, y, pixelsPerSecond, then) {
        if (this.movement) this.movement.pause()
        var fromX = this.x()
        var fromY = this.y()
        var distance = Math.sqrt((x - fromX) * (x - fromX) + (y - fromY) * (y - fromY))
        this.moveOverSeconds(x, y, distance / pixelsPerSecond, then)
    }
}

var SprigganAllViewports = []

window.onresize = function() {
    for (var i = 0; i < SprigganAllViewports.length; i++) SprigganAllViewports[i].resize()
}

function SprigganViewport(width, height, clicked) {
    this.width = width
    this.height = height
    this.clicked = clicked
    this.construct()
    this.element.style.position = "fixed"
    this.element.style.width = width + "em"
    this.element.style.height = height + "em"
    this.element.style.overflow = "hidden"
    document.body.appendChild(this.element)
    
    this.resize()
    SprigganAllViewports.push(this)
}

SprigganViewport.prototype.resize = function() {
    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    
    this.element.style.fontSize = Math.min(windowWidth / this.width, windowHeight / this.height) + "px"
        
    this.element.style.left = ((windowWidth - this.element.clientWidth) / 2) + "px"
    this.element.style.top = ((windowHeight - this.element.clientHeight) / 2) + "px"
}

SprigganMakeConstructable(SprigganViewport)
SprigganMakeDisposable(SprigganViewport, function() {
    SprigganRemoveByValue(SprigganAllViewports, this)
})
SprigganMakePausable(SprigganViewport)
SprigganMakeParent(SprigganViewport)
SprigganMakeElementWrapper(SprigganViewport)
SprigganMakeClickable(SprigganViewport)

function SprigganGroup(parent, clicked) {
    this.parent = parent
    this.clicked = clicked
    this.construct()
    this.element.style.position = "absolute"
}

SprigganMakeConstructable(SprigganGroup)
SprigganMakeDisposable(SprigganGroup)
SprigganMakePausable(SprigganGroup)
SprigganMakeElementWrapper(SprigganGroup)
SprigganMakeParent(SprigganGroup)
SprigganMakeChild(SprigganGroup)
SprigganMakeClickable(SprigganGroup)
SprigganMakeMovable(SprigganGroup)

function SprigganSprite(parent, contentManager, spriteSheetUrl, clicked) {
    this.parent = parent
    this.clicked = clicked
    this.construct()
    this.element.style.position = "absolute"
    this.element.style.overflow = "hidden"
    this.spriteSheet = contentManager.get(SprigganSpriteSheet, spriteSheetUrl)
    this.spriteSheet.sprites.push(this)
    this.imageElement = this.spriteSheet.image.cloneNode(true)
    this.element.appendChild(this.imageElement)
}

SprigganMakeConstructable(SprigganSprite)
SprigganMakeDisposable(SprigganSprite, function(){
    SprigganRemoveByValue(this.spriteSheet.sprites, this)
})
SprigganMakePausable(SprigganSprite, function(){
    if (this.animation) this.animation.pause()
}, function(){
    if (this.animation) this.animation.resume()
})
SprigganMakeElementWrapper(SprigganSprite)
SprigganMakeChild(SprigganSprite)
SprigganMakeClickable(SprigganSprite)
SprigganMakeMovable(SprigganSprite)

SprigganSprite.prototype.setFrame = function(frame) {
    this.imageElement.style.left = frame.imageLeft
    this.imageElement.style.top = frame.imageTop
    this.element.style.width = frame.wrapperWidth
    this.element.style.height = frame.wrapperHeight
    this.element.style.marginLeft = frame.wrapperMarginLeft
    this.element.style.marginTop = frame.wrapperMarginTop
}

SprigganSprite.prototype.play = function(animationName, then) {
    var sprite = this
    if (sprite.animation) sprite.animation.pause()
    var frames = sprite.spriteSheet.getAnimationByName(animationName)
    var frame = 0
    function NextFrame() {
        if (frame == frames.length) {
            if (then) then()
            return
        }
        var currentFrame = frames[frame++]
        sprite.setFrame(currentFrame)
        sprite.animation = new SprigganTimer(currentFrame.duration, {
            completed: NextFrame
        })
        if (!sprite.paused) sprite.animation.resume()
    }
    NextFrame()
}

SprigganSprite.prototype.loop = function(animationName) {
    var sprite = this
    if (sprite.animation) sprite.animation.pause()
    var frames = sprite.spriteSheet.getAnimationByName(animationName)
    if (frames.length == 1) {
        sprite.setFrame(frames[0])
    } else {
        function PlayAgain() {
            sprite.play(animationName, PlayAgain)
        }
        PlayAgain()
    }
}