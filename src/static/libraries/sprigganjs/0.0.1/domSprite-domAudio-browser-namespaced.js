function SprigganContentManager(onProgressUpdate, onSuccess, onFailure) {
    var disposed = false
    var completed = 0, total = 0
    var content = {}
    function Failure(message) {
        Dispose()
        onFailure(message)
    }
    function Dispose() {
        if (disposed) throw new Error("This ContentManager has already been disposed")
        disposed = true
        while (content.length) {
            content.pop().dispose()
        }            
    }
    var output = {
        load: function(constructorFunction, url) {
            if (disposed) throw new Error("Cannot add to a ContentManager once disposed")
            if (completed) throw new Error("Cannot add to a ContentManager once loading has started")
            for (var contentUrl in content) {
                if (url != contentUrl) continue
                if (content[url].constructorFunction == constructorFunction) return output
                throw new Error("The same url cannot be used with two distinct content constructor functions")
            }
            total++
            content[url] = {
                dispose: constructorFunction(url, function(value) {
                    content[url].value = value
                    completed++
                    if (completed == total) onSuccess()
                }, Failure),
                constructorFunction: constructorFunction
            }
            return output
        },
        get: function(constructorFunction, url) {
            if (disposed) throw new Error("Cannot get from a ContentManager once disposed")
            if (completed < total) throw new Error("Cannot get from a ContentManager while loading")
            for (var contentUrl in content) {
                if (url != contentUrl) continue
                if (content[url].constructorFunction != constructorFunction) throw new Error("An incorrect constructor function was given when getting content")
                return content[contentUrl].value
            }
            throw new Error("No matching content was loaded")
        },
        dispose: Dispose
    }
    return output
}
function SprigganEventOnce() {
    var callbacks = []
    var raised = null
    
    return {
        raise: function() {
            if (raised !== null) return
            raised = arguments
            while (callbacks.length) callbacks.pop().apply(null, raised)
        }, 
        listen: function(callback){
            if (raised !== null)
                callback.apply(null, raised)
            else
                callbacks.push(callback)
        }
    }
}
function SprigganEventRecurring() {
    var callbacks = []
    var oneTimeCallbacks = []
    
    return {
        raise: function() {
            var copy = arguments
            var oneTimeCallbacksCopy = oneTimeCallbacks
            oneTimeCallbacks = []
            for (var i = 0; i < callbacks.length; i++) callbacks[i].apply(null, copy)
            for (var i = 0; i < oneTimeCallbacksCopy.length; i++) oneTimeCallbacksCopy[i].apply(null, copy)
        }, 
        listen: function(callback) {
            callbacks.push(callback)
        },
        listenOnce: function(callback) {
            oneTimeCallbacks.push(callback)
        }
    }
}
function SprigganLinearInterpolate(start, end, seconds, onProgress, onComplete) {
    var interval
    var timer = SprigganTimer(seconds, function() {
        if (interval) clearInterval(interval)
        onProgress(end)
        if (onComplete) onComplete()
    })
    
    return {
        pause: function() {
            if (interval) {
                clearInterval(interval)
                interval = null
                timer.pause()
            }
        },
        resume: function() {
            if (!interval) {
                interval = setInterval(function(){
                    onProgress(start + (end - start) * timer.progress())
                }, 1000 / 20)
                timer.resume()
            }
        },
        elapsed: timer.elapsed,
        progress: timer.progress
    }
}
function SprigganPrint(container, content, spriteSheet, letterSpacing, lineSpacing, text) {
    var x = 0
    var y = 0
    for (var i = 0; i < text.length; i++) {
        var ch = text.charAt(i)
        switch (ch) {
            case "\n":
                x = 0
                y += lineSpacing
                break
            default:
                var sprite = SprigganSprite(container, content, spriteSheet)
                SprigganMove(sprite, x, y)
                SprigganLoop(sprite, ch)
            case " ":
                x += letterSpacing
                break
            case "\t":
                x += letterSpacing * 4
                break
        }
    }
}
function SprigganTimer(seconds, onComplete, onPause, onResume) {   
    var milliseconds = seconds * 1000
    var started = null
    var elapsed = 0
    var done = false
    var timeout = null
    function Elapsed() {
        if (done) return milliseconds
        return Math.min(milliseconds, elapsed + (timeout ? (new Date().getTime() - started) : 0))
    }
    return {
        pause: function() {
            if (timeout) {
                elapsed += new Date().getTime() - started
                started = null
                clearTimeout(timeout)
                timeout = null
                if (onPause) onPause()
            }
        },
        resume: function() {
            if (!timeout && !done) {
                timeout = setTimeout(function(){
                    done = true
                    timeout = null
                    if (onComplete) onComplete()
                }, milliseconds - Elapsed())
                started = new Date().getTime()
                if (onResume) onResume()
            }
        },
        elapsed: function() {
            return Elapsed() / 1000
        },
        progress: function() {
            return seconds ? Elapsed() / milliseconds : 1
        }
    }
}
function SprigganContentImage(url, onSuccess, onFailure) {
    var image = new Image()
    image.onload = function() {
        image.onload = null
        image.onerror = null
        onSuccess(image)
    }
    image.onerror = function() {
        onFailure("Failed to download \"" + url + "\" as an image")
    }
    image.src = url
    function Dispose() {
        if (image) {
            image.onload = null
            image.onerror = null
            image.src = ""
            image = null
        }
    }
    return Dispose
}
function SprigganContentSpriteSheet(url, onSuccess, onFailure) {
    var value = {}
    var json = SprigganContentJson(url + ".json", function(jsonValue) {
        value.animations = {}
        for (var key in jsonValue.animations) {
            var animation = jsonValue.animations[key]
            var converted = []
            for (var i = 0; i < animation.length; i++) {
                var frame = jsonValue.frames[animation[i]]
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
            value.animations[key] = converted
        }
        Success()
    }, onFailure)
    var image = SprigganContentImage(url + ".png", function(imageValue) {
        value.image = imageValue.cloneNode(true)
        value.image.style.touchAction = "manipulation" // Improves responsiveness on IE/Edge on touchscreens.
        if ("imageRendering" in value.image.style) {
            value.image.style.imageRendering = "pixelated"              // Chrome.
            value.image.style.imageRendering = "-moz-crisp-edges"       // Firefox.
        } else if ("msInterpolationMode" in value.image.style) 
            value.image.style.msInterpolationMode = "nearest-neighbor"  // IE.
        else {
            // Workaround for Edge as it always uses linear interpolation; scale up 4x in a canvas to ensure that the pixels stay mostly square.
            var canvas = document.createElement("CANVAS")
            canvas.width = imageValue.width * 4
            canvas.height = imageValue.height * 4
            var context = canvas.getContext("2d")
            context.msImageSmoothingEnabled = false
            context.drawImage(imageValue, 0, 0, imageValue.width * 4, imageValue.height * 4)
            value.image.src = canvas.toDataURL("image/png")
        }
        value.image.style.position = "absolute"
        value.image.style.width = imageValue.width + "em"
        value.image.style.height = imageValue.height + "em"
        Success()
    }, onFailure)
    function Success() {
        if (!value.animations) return
        if (!value.image) return
        onSuccess(value)
        Dispose()
    }
    function Dispose() {
        if (json) json()
        if (image) image()
        json = image = value = null
    }
    return Dispose
}
function SprigganGroup(parent, onClick) {
    var element = document.createElement("DIV")
    element.style.position = "absolute"
    element.style.touchAction = "manipulation" // Improves responsiveness on IE/Edge on touchscreens.
    if (onClick) element.onclick = function() {
        SprigganEventWasTriggeredByUserInteraction = true
        onClick()
        SprigganEventWasTriggeredByUserInteraction = false
    }
    parent.element.appendChild(element)
    var output = {
        element: element,
        paused: false,
        movement: null,
        x: function() { return 0 },
        y: function() { return 0 },
        children: [],
        parent: parent
    }
    parent.children.push(output)
    return output
}

function SprigganMove(container, x, y) {
    if (container.movement) {
        container.movement.pause()
        container.movement = null
    }
    if ("transform" in container.element.style) // IE10+, Edge, Firefox, Chrome.
        container.element.style.transform = "translate(" + x  + "em, " + y  + "em)" 
    else {
        // IE9-.
        container.element.style.left = x  + "em"
        container.element.style.top = y  + "em"
    }
    container.x = function() { return x }
    container.y = function() { return y }
}

function SprigganPause(container) {
    if (container.movement) container.movement.pause()
    if (container.animation) container.animation.pause()
    container.paused = true
    if (container.children) for (var i = 0; i < container.children.length; i++) SprigganPause(container.children[i])
}

function SprigganResume(container) {
    if (container.movement) container.movement.resume()
    if (container.animation) container.animation.resume()
    container.paused = false
    if (container.children) for (var i = 0; i < container.children.length; i++) SprigganResume(container.children[i])
}

function SprigganMoveOverSeconds(container, toX, toY, seconds, then) {
    if (container.movement) container.movement.pause()
    var fromX = container.x()
    var fromY = container.y()
    var timer
    var currentX = container.x = function() {
        return fromX + (toX - fromX) * timer.progress()
    }
    var currentY = container.y = function() {
        return fromY + (toY - fromY) * timer.progress()
    }
    if ("transform" in container.element.style) {
        container.element.offsetHeight // Forces a reflow of the element; neccessary for the transition to work.
        // IE10+, Edge, Chrome, Firefox.
        timer = container.movement = SprigganTimer(seconds, then, function(elapsed) {
            container.element.style.transition = "initial"
            container.element.style.transform = "translate(" + currentX() + "em, " + currentY() + "em)" 
        }, function(elapsed){
            container.element.style.transition = "transform " + (seconds - timer.elapsed()) + "s linear"
            container.element.style.transform = "translate(" + toX + "em, " + toY + "em)"
        })
    } else {
        // IE9-.
        timer = container.movement = SprigganLinearInterpolate(0, 1, seconds, function(progress) {
            container.element.style.left = currentX() + "em"
            container.element.style.top = currentY() + "em"
        }, then)
    }
    if (!container.paused) timer.resume()
}

function SprigganMoveAtPixelsPerSecond(container, toX, toY, pixelsPerSecond, then) {
    if (container.movement) container.movement.pause()
    var fromX = container.x()
    var fromY = container.y()
    var distance = Math.sqrt((toX - fromX) * (toX - fromX) + (toY - fromY) * (toY - fromY))
    SprigganMoveOverSeconds(container, toX, toY, distance / pixelsPerSecond, then)
}

function SprigganRemove(container) {
    SprigganPause(container)
    container.element.parentNode.removeChild(container.element)
    if (container.parent) container.parent.children.splice(container.parent.children.indexOf(container), 1)
    if (!container.parent) SprigganAllViewports.splice(SprigganAllViewports.indexOf(container), 1)
}

function SprigganOrder(container, order) {
    container.element.style.zIndex = order
}

function SprigganAcceptClicks(container) {
    container.element.style.pointerEvents = "auto"
}

function SprigganIgnoreClicks(container) {
    container.element.style.pointerEvents = "none"
}
var SprigganEventWasTriggeredByUserInteraction = false

function SprigganSprite(container, contentManager, spriteSheetUrl, onClick) {
    var wrapperElement = document.createElement("DIV")
    wrapperElement.style.position = "absolute"
    wrapperElement.style.overflow = "hidden"
    wrapperElement.style.touchAction = "manipulation" // Improves responsiveness on IE/Edge on touchscreens.
    if (onClick) wrapperElement.onclick = function() {
        SprigganEventWasTriggeredByUserInteraction = true
        onClick()
        SprigganEventWasTriggeredByUserInteraction = false
    }
    var content = contentManager.get(SprigganContentSpriteSheet, spriteSheetUrl)
    var imageElement = content.image.cloneNode(true)

    wrapperElement.appendChild(imageElement)
    container.element.appendChild(wrapperElement)
    var output = {
        element: wrapperElement,
        imageElement: imageElement,
        animations: content.animations,
        movement: null,
        animation: null,
        x: function() { return 0 },
        y: function() { return 0 },
        paused: false,
        container: container
    }
    container.children.push(output)
    return output
}

function SprigganPlay(sprite, animationName, then) {
    if (sprite.animation != null) sprite.animation.pause()
    var animation = sprite.animations[animationName]
    var frame = 0
    function Next() {
        if (frame == animation.length) {
            sprite.animation = null
            if (then) then()
        } else {
            var frameData = animation[frame++]
            sprite.imageElement.style.left = frameData.imageLeft
            sprite.imageElement.style.top = frameData.imageTop
            sprite.element.style.width = frameData.wrapperWidth
            sprite.element.style.height = frameData.wrapperHeight
            sprite.element.style.marginLeft = frameData.wrapperMarginLeft
            sprite.element.style.marginTop = frameData.wrapperMarginTop
            sprite.animation = SprigganTimer(frameData.duration, Next)
            if (!sprite.paused) sprite.animation.resume()
        }
    }
    Next()
}

function SprigganLoop(sprite, animationName) {
    if (sprite.animations[animationName].length > 1) {
        function Again() {
            Play(sprite, animationName, Again)
        }
        Again()
    } else {
        Play(sprite, animationName)
    }
}
var SprigganAllViewports = []
window.onresize = function() {
    for (var i = 0; i < SprigganAllViewports.length; i++) {
        SprigganAllViewports[i].resize()
    }
}
    
function SprigganViewport(width, height, horizontalAlignment, verticalAlignment) {
    var element = document.createElement("DIV")
    element.style.position = "fixed"
    element.style.width = width + "em"
    element.style.height = height + "em"
    element.style.overflow = "hidden"
    switch (horizontalAlignment) {
        case "left": 
            element.style.left = 0
            break
        case "right": 
            element.style.right = 0
            break
        default: 
            element.style.left = "50%"
            element.style.marginLeft = (width / -2) + "em"
            break
    }
    switch (verticalAlignment) {
        case "top": 
            element.style.top = 0
            break
        case "bottom": 
            element.style.bottom = 0
            break
        default: 
            element.style.top = "50%"
            element.style.marginTop = (height / -2) + "em"
            break
    }
    document.body.appendChild(element)
    function Resize() {
        element.style.fontSize = Math.min(
            (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) / width, 
            (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) / height) + "px"
    }
    Resize()
    var output = {
        element: element,
        children: [],
        resize: Resize
    }
    SprigganAllViewports.push(output)
    return output
}
function SprigganContentMusic(url, onSuccess, onFailure) {
    if (!SprigganEventWasTriggeredByUserInteraction) throw new Error("Some platforms only support loading audio from a click/touch event")
    if (!window.Audio) {
        // Older versions of IE have no support for HTML audio.
        // This effectively dummies out HTML audio.
        setTimeout(function(){
            onSuccess({
                play: function() {},
                pause: function() {}
            })
        }, 0)
        return function() {}
    } else {
        var audio = new Audio()
        
        audio.onloadeddata = function() {
            audio.onloadeddata = null
            audio.onerror = null
            onSuccess({
                play: function() {
                    audio.play()
                },
                pause: function() {
                    audio.pause()
                }
            })
        }
        
        audio.onerror = function() {
            onFailure("Failed to download \"" + url + "\" as music")
        }
        
        audio.loop = true
        audio.src = url
        audio.load()
        
        function Dispose() {
            audio.onloadeddata = null
            audio.onerror = null
            audio.src = ""
            audio = null
        }
        return Dispose
    }
}
function SprigganContentSound(url, onSuccess, onFailure) {
    if (!SprigganEventWasTriggeredByUserInteraction) throw new Error("Some platforms only support loading audio from a click/touch event")
    if (!window.Audio) {
        // Older versions of IE have no support for HTML audio.
        // This effectively dummies out HTML audio.
        setTimeout(function(){
            onSuccess(function(){})
        }, 0)
        return function() {}
    } else {
        var audio = new Audio()
        
        audio.onloadeddata = function() {
            audio.onloadeddata = null
            audio.onerror = null
            onSuccess(function(){
                audio.play()
            })
        }
        
        audio.onerror = function() {
            onFailure("Failed to download \"" + url + "\" as a sound")
        }
        
        audio.src = url
        audio.load()
        
        function Dispose() {
            audio.onloadeddata = null
            audio.onerror = null
            audio.src = ""
            audio = null
        }
        return Dispose
    }
}
(function(){
    function SetLoadingText(text) {
        var element = document.getElementById("loading")
        if (!element) return
        element.textContent = text
        element.innerText = text
    }
    SetLoadingText("Downloading scripts...")
    document.body.style.transition = "background 1s"
    document.body.style.backgroundColor = "black"
    document.getElementById("loading").style.transition = "color 1s"
    document.getElementById("loading").style.color = "white"
    window.onload = function() {
        document.body.removeChild(document.getElementById("loading"))
        SprigganJSBoot()
    }
})()
function SprigganContentJson(url, onSuccess, onFailure) {
    return SprigganContentText(url, function(text){
        var json, succeeded = false
        try {
            if (window.JSON)
                json = JSON.parse(text)         // Chrome, Firefox, Edge.
            else
                json = eval("(" + text + ")")   // IE.
            succeeded = true
        } catch(e) {
            onFailure("Failed to parse \"" + url + "\" as JSON")
        }
        if (succeeded) onSuccess(json)
    }, onFailure)
}
function SprigganContentText(url, onSuccess, onFailure) {
    var request = new XMLHttpRequest()
    request.onreadystatechange = function() {
        if (request.readyState != 4) return
        if (request.status >= 200 && request.status <= 299)
            onSuccess(request.responseText)
        else
            onFailure("Failed to download \"" + url + "\" as text; HTTP status code " + request.status + " was returned")
    }
    request.open("GET", url, true)
    request.send()
    function Dispose() {
        if (!request) return
        request.onreadystatechange = null
        request = null
    }
    return Dispose
}
window.onerror = function() {
    alert.apply(window, arguments)
    while (SprigganAllViewports.length) SprigganRemove(SprigganAllViewports[0])
}