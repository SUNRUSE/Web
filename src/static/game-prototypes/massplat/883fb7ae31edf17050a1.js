!function(e){function r(n){if(t[n])return t[n].exports;var o=t[n]={exports:{},id:n,loaded:!1};return e[n].call(o.exports,o,o.exports,r),o.loaded=!0,o.exports}var t={};return r.m=e,r.c=t,r.p="",r(0)}([function(e,r,t){t(12),addEventListener("load",function(){var e;e=t(4),e.load(function(){var r,t,n;r=void 0,n=0,t=function(o){for(void 0!==r&&(n+=20*(o-r)/1e3),r=o,n=Math.min(5,n);n>=1;)e.tick(),n--;e.draw(n),requestAnimationFrame(t)},requestAnimationFrame(t)})})},function(e,r,t){var n,o;n=t(2),o=t(3),e.exports={canvas:null,context:null,width:null,height:null,load:function(){var r;e.exports.canvas=document.getElementsByTagName("canvas")[0],e.exports.context=e.exports.canvas.getContext("experimental-webgl",{antialias:!1}),e.exports.context||n("Failed to open a WebGL context"),r=function(){e.exports.width=window.innerWidth,e.exports.height=window.innerHeight,e.exports.canvas&&(e.exports.canvas.width=e.exports.width,e.exports.canvas.height=e.exports.height)},addEventListener("resize",r),r()},postScale:[1,1],transforms:[[],[]],begin:function(r,t,n,i,a,c,f,s,l,u){var d;d=e.exports.context,d.viewport(r,t,n,i),d.enable(d.SCISSOR_TEST),d.scissor(r,t,n,i),d.clearColor(s,l,u,1),d.clear(d.COLOR_BUFFER_BIT|d.DEPTH_BUFFER_BIT),d.disable(d.SCISSOR_TEST),o.copy(c,e.exports.transforms[0]),o.copy(f,e.exports.transforms[1]),n>i?(e.exports.postScale[0]=a*i/n,e.exports.postScale[1]=a):(e.exports.postScale[0]=a,e.exports.postScale[1]=a*n/i)}}},function(e,r){e.exports=function(e){throw console.error(e),alert(e),new Error(e)}},function(e,r){var t,n,o,i;n=[],o=[],i=[],t=function(r,t,n,o){return function(a,c){var f,s;s=Math.sin(a),f=Math.cos(a),i[r]=f,i[t]=-s,i[n]=s,i[o]=f,e.exports.multiply(c,i,c)}},e.exports={identity:function(e){var r,t,n,o;for(o=t=0;4>t;o=++t)for(r=n=0;4>n;r=++n)e[4*o+r]=o===r?1:0},copy:function(e,r){var t,n,o,i;for(n=t=0,o=e.length;o>t;n=++t)i=e[n],r[n]=i},multiply:function(r,t,i){var a,c,f,s,l,u,d;for(e.exports.copy(r,n),e.exports.copy(t,o),u=f=0;4>f;u=++f)for(a=s=0;4>s;a=++s){for(d=0,c=l=0;4>l;c=++l)d+=n[4*c+a]*o[4*u+c];i[4*u+a]=d}},rotateX:t(5,6,9,10),rotateY:t(0,2,8,10),rotateZ:t(0,1,4,5),scale:function(e,r,t,n){var o,i,a,c;for(i=o=0;4>o;i=++o)n[i]*=e;for(i=a=4;8>a;i=++a)n[i]*=r;for(i=c=8;12>c;i=++c)n[i]*=t},translate:function(e,r,t,n){n[3]+=e,n[7]+=r,n[11]+=t},apply:function(e,r,t,n,o){return void 0===r&&(r=0),void 0===t&&(t=0),void 0===n&&(n=0),void 0===o&&(o=1),[r*e[0]+t*e[1]+n*e[2]+o*e[3],r*e[4]+t*e[5]+n*e[6]+o*e[7],r*e[8]+t*e[9]+n*e[10]+o*e[11],r*e[12]+t*e[13]+n*e[14]+o*e[15]]}},e.exports.identity(n),e.exports.identity(o),e.exports.identity(i)},function(e,r,t){var n,o,i,a,c,f,s,l,u,d,v;o=t(1),n=t(6),c=t(3),f=t(5),a=t(11),i=[],c.identity(i),c.translate(-150,-20,-150,i),l=[],s=[],v=u=0,d=void 0,e.exports={load:function(e){o.load(),n.load(function(){a(t(14),function(r){d=r,e()})})},tick:function(){u=v,v+=.05},draw:function(e){c.copy(s,l),c.identity(s),c.rotateY(f.interpolate(u,v,e),s),c.translate(50,0,0,s),o.begin(0,0,o.width,o.height,1,l,s,.1,.5,.9),n.draw(d,i,i)}}},function(e,r){e.exports={interpolate:function(e,r,t){return e+(r-e)*t}}},function(e,r,t){var n,o,i,a,c,f,s,l,u,d,v,p,x,m,E,g,T,h;i=t(1),a=t(8),s=t(10),u=t(3),c=void 0,f=0,d=Math.floor(65536/6),n=24,T=void 0,g=p=m=void 0,E=l=o=void 0,x=[],v=[],h=void 0,e.exports={load:function(e){var r,n,f,u,v;for(r=i.context,c=r.createBuffer(),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,c),f=[],n=u=0,v=d;v>=0?v>u:u>v;n=v>=0?++u:--u)f[6*n]=4*n,f[6*n+1]=4*n+1,f[6*n+2]=4*n+2,f[6*n+3]=4*n+2,f[6*n+4]=4*n+3,f[6*n+5]=4*n;r.bufferData(r.ELEMENT_ARRAY_BUFFER,new Uint16Array(f),r.STATIC_DRAW),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,null),T=a(t(16),t(15)),r.useProgram(T),E=r.getAttribLocation(T,"origin"),l=r.getAttribLocation(T,"local"),o=r.getAttribLocation(T,"color"),g=r.getUniformLocation(T,"postScale"),p=r.getUniformLocation(T,"newTransform"),m=r.getUniformLocation(T,"oldTransform"),r.useProgram(null),s(t(13),function(r){h=r,e()})},draw:function(e,r,t){var a,f,s,y,b,_,A;for(f=i.context,f.bindBuffer(f.ARRAY_BUFFER,e.buffer),f.bindBuffer(f.ELEMENT_ARRAY_BUFFER,c),f.enable(f.DEPTH_TEST),f.bindTexture(f.TEXTURE_2D,h),f.useProgram(T),f.enableVertexAttribArray(E),f.enableVertexAttribArray(l),f.enableVertexAttribArray(o),r?(u.multiply(r,i.transforms[0],x),u.multiply(t,i.transforms[1],v),f.uniformMatrix4fv(m,!1,x),f.uniformMatrix4fv(p,!1,v)):(f.uniformMatrix4fv(m,!1,i.transforms[0]),f.uniformMatrix4fv(p,!1,i.transforms[1])),f.uniform2f(g,i.postScale[0],i.postScale[1]),y=e.bytes/(4*n),A=s=0,b=y,_=d;_>0?b>s:s>b;A=s+=_)a=Math.min(A+d,y),f.vertexAttribPointer(E,3,f.FLOAT,!1,n,4*A*n),f.vertexAttribPointer(o,3,f.UNSIGNED_BYTE,!0,n,4*A*n+12),f.vertexAttribPointer(l,2,f.FLOAT,!1,n,4*A*n+12+3+1),f.drawElements(f.TRIANGLES,6*(a-A),f.UNSIGNED_SHORT,0);f.bindTexture(f.TEXTURE_2D,null),f.disableVertexAttribArray(E),f.disableVertexAttribArray(l),f.disableVertexAttribArray(o),f.useProgram(null),f.disable(f.DEPTH_TEST)}}},function(e,r,t){var n,o;o=t(2),n=t(1),e.exports=function(e,r){var t,i,a,c;a=n.context,c=void 0;try{return c=a.createProgram(),a.attachShader(c,e),a.attachShader(c,r),a.linkProgram(c),a.getProgramParameter(c,a.LINK_STATUS)||o("Failed to link a shader program; "+a.getProgramInfoLog(c)),c}catch(i){throw t=i,c&&(a.detachShader(c,e),a.detachShader(c,r),a.deleteProgram(c)),t}}},function(e,r,t){var n,o,i;o=t(1),i=t(9),n=t(7),e.exports=function(e,r){var t,a,c;a=o.context,c=void 0;try{c=i(a.VERTEX_SHADER,e),t=void 0;try{return t=i(a.FRAGMENT_SHADER,r),n(c,t)}finally{t&&a.deleteShader(t)}}finally{c&&a.deleteShader(c)}}},function(e,r,t){var n,o;n=t(1),o=t(2),e.exports=function(e,r){var t,i,a,c;a=n.context,c=void 0;try{return c=a.createShader(e),a.shaderSource(c,r),a.compileShader(c),a.getShaderParameter(c,a.COMPILE_STATUS)||o("Failed to compile a shader; "+a.getShaderInfoLog(c)),c}catch(i){throw t=i,c&&a.deleteShader(c),t}}},function(e,r,t){var n,o;o=t(2),n=t(1),e.exports=function(e,r){var t,i;t=n.context,i=new Image,i.onload=function(){var e;e=t.createTexture(),t.bindTexture(t.TEXTURE_2D,e),t.texImage2D(t.TEXTURE_2D,0,t.LUMINANCE,t.LUMINANCE,t.UNSIGNED_BYTE,i),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.bindTexture(t.TEXTURE_2D,null),r(e)},i.onerror=function(){o("Failed to load image "+e)},i.src=e}},function(e,r,t){var n,o;n=t(1),o=t(2),e.exports=function(e,r){var t;t=new XMLHttpRequest,t.open("GET",e,!0),t.responseType="arraybuffer",t.onreadystatechange=function(){var i,a;4===t.readyState&&(200===t.status?(a=n.context,i=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,i),a.bufferData(a.ARRAY_BUFFER,t.response,a.STATIC_DRAW),a.bindBuffer(a.ARRAY_BUFFER,null),r({buffer:i,bytes:t.response.byteLength})):o("Failed to load binary file "+e))},t.send(null)}},function(e,r){},function(e,r,t){e.exports=t.p+"3190d475b5119d81c8d5f17bdf185178.png"},function(e,r,t){e.exports=t.p+"8f644169247fdb4de8008c623e080128.msc"},function(e,r){e.exports="#ifdef GL_ES\nprecision mediump float;\n#endif\n\nvarying vec2 var_uv;\nvarying vec3 var_color;\nuniform sampler2D brushstrokes;\n\nvoid main() {\n    if(pow(texture2D(brushstrokes, var_uv).r, 0.5) < length(var_uv)) discard;\n	gl_FragColor = vec4(var_color, 1.0);\n}"},function(e,r){e.exports="#ifdef GL_ES\nprecision mediump float;\n#endif\n\nattribute vec3 origin;\nattribute vec2 local;\nattribute vec3 color;\nuniform mat4 newTransform;\nuniform mat4 oldTransform;\nuniform vec2 postScale;\nvarying vec2 var_uv;\nvarying vec3 var_color;\n\nvec3 applyTransform(mat4 transform) {\n	return (vec4(origin, 1.0) * transform).xyz;\n}\n\nvoid main() {\n	var_color = color;\n\n	vec3 oldOrigin = applyTransform(oldTransform);\n	vec3 newOrigin = applyTransform(newTransform);\n	vec2 originDifference = (newOrigin.xy / newOrigin.z) - (oldOrigin.xy / oldOrigin.z);\n	// If the computed start/end of the splat are in the exact same location, the normal between them is undefined.\n	// This happens reasonably frequently.\n	var_uv = sign(local);\n	if(originDifference == vec2(0.0)) {\n		gl_Position = vec4((newOrigin + vec3(local, 0.0)) * vec3(postScale, 1.0), newOrigin.z);\n	} else {\n		originDifference = normalize(originDifference);\n        vec2 uv = var_uv * 0.5 + 0.5;\n		gl_Position = vec4((mix(newOrigin.xy, oldOrigin.xy, uv.y) - local.y * originDifference + local.x * originDifference.yx * vec2(1.0, -1.0)) * postScale, -1.0, mix(newOrigin.z, oldOrigin.z, uv.y));\n	}\n}"}]);