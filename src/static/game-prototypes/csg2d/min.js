!function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={exports:{},id:d,loaded:!1};return a[d].call(e.exports,e,e.exports,b),e.loaded=!0,e.exports}var c={};return b.m=a,b.c=c,b.p="",b(0)}([function(a,b,c){var d,e,f,g;d=c(1),g=c(54),e=c(56),f=c(58),window.onload=function(){return window.scrollTo((document.body.scrollWidth-window.innerWidth)/2,(document.body.scrollHeight-window.innerHeight)/2),document.onmousedown=function(a){return d.tap(a.target),d.start(a.target)},document.onmousemove=function(a){return d.move(a.pageX,a.pageY)},document.onmouseup=function(a){return d.end()},document.ontouchstart=function(a){return d.start(a.target)},document.ontouchmove=function(a){return d.move(a.touches[0].pageX,a.touches[0].pageY)},document.ontouchend=function(a){return d.end()},document.onkeydown=e,document.onkeyup=f,g()}},function(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z;m=c(2),g=c(3),d=c(8),j=c(9),s=c(10),t=c(11),q=c(12),z=c(13),o=c(14),p=c(16),y=c(17),i=c(18),n=c(19),v=c(20),u=c(21),h=c(22),f=c(23),e=c(28),r=c(29),x=c(52),l=c(30),w=c(53),k=null,a.exports={tap:function(a){if(a&&!a.getAttribute("disabled"))switch(a.tagName){case"DIV":switch(a.className){case"handle":switch(a.getAttribute("kind")){case"delete":return d(a.parentNode);case"clone":return j(a.parentNode);case"operator":return q(a.parentNode);case"turn":return z(a.parentNode);case"pullForward":return s(a.parentNode);case"pushBack":return t(a.parentNode)}}break;case"BUTTON":switch(a.id){case"play":return r();case"stop":return x();case"undo":return m.undo();case"redo":return m.redo();case"save":return w("map.json",l());case"addPlayer":return f();case"addGravity":return e();default:switch(a.className){case"add":return g(a.getAttribute("shape"),a.getAttribute("operator"))}}}},start:function(a){if(a&&!a.getAttribute("disabled"))switch(a.tagName){case"DIV":switch(a.className){case"handle":switch(a.getAttribute("kind")){case"move":case"moveMiddle":case"left":case"right":case"top":case"bottom":case"radiusLeft":case"radiusRight":case"radiusTop":case"radiusBottom":case"angle":return k=function(){switch(a.getAttribute("kind")){case"move":return o(a.parentNode);case"moveMiddle":return p(a.parentNode);case"left":return n(a.parentNode);case"right":return v(a.parentNode);case"top":return y(a.parentNode);case"bottom":return i(a.parentNode);case"angle":return h(a);case"radiusLeft":case"radiusRight":case"radiusTop":case"radiusBottom":return u(a.parentNode)}}()}}}},move:function(a,b){return k?k.move(a,b):void 0},end:function(){return k?(k.end(),k=null):void 0}}},function(a,b){var c,d,e,f;f=[],c=[],d=function(a,b){return a.length?document.getElementById(b).removeAttribute("disabled"):document.getElementById(b).setAttribute("disabled","disabled")},e=function(){return d(f,"redo"),d(c,"undo")},a.exports={undo:function(){return c[0].undo(),f.unshift(c[0]),c.shift(),e()},redo:function(){return f[0].redo(),c.unshift(f[0]),f.shift(),e()},addStep:function(a,b,d){var g,h,i;if(f.length){if(!window.confirm("You have undone changes which will be lost if you make this change.  Are you sure you wish to continue, losing your undone changes?"))return a(),void d();for(g=0,h=f.length;h>g;g++)i=f[g],i.discard();f=[]}return c.unshift({undo:a,redo:b,discard:d}),e()}}},function(a,b,c){var d,e,f;d=c(4),f=c(5),e=c(7),a.exports=function(a,b){return d(f({operator:b,shape:function(){switch(a){case"circle":return{origin:{x:Math.round((window.pageXOffset+window.innerWidth/2)/e),y:Math.round((window.pageYOffset+window.innerHeight/2)/e)},radius:Math.max(1,Math.round(Math.min(window.innerWidth,window.innerHeight)/4/e))};case"rectangle":return{left:Math.round((window.pageXOffset+window.innerWidth/4)/e),top:Math.round((window.pageYOffset+window.innerHeight/4)/e),width:Math.max(1,Math.round(window.innerWidth/2/e)),height:Math.max(1,Math.round(window.innerHeight/2/e))};case"ramp":return{left:Math.round((window.pageXOffset+window.innerWidth/4)/e),top:Math.round((window.pageYOffset+window.innerHeight/4)/e),width:Math.max(1,Math.round(window.innerWidth/2/e)),height:Math.max(1,Math.round(window.innerHeight/2/e)),ramp:"bottomLeft"}}}()}),"shapes")}},function(a,b,c){var d;d=c(2),a.exports=function(a,b){var c;return c=document.getElementById(b),c.appendChild(a),d.addStep(function(){return c.removeChild(a)},function(){return c.appendChild(a)},function(){})}},function(a,b,c){var d;d=c(6),a.exports=function(a){var b;return b=document.createElement("div"),b.setAttribute("operator",a.operator),b.className="shape",b.tabIndex=0,d(b,"move"),d(b,"delete"),d(b,"operator"),d(b,"clone"),d(b,"pullForward"),d(b,"pushBack"),a.shape.radius?(b.setAttribute("shape","circle"),b.style.left=a.shape.origin.x-a.shape.radius+"rem",b.style.top=a.shape.origin.y-a.shape.radius+"rem",b.style.width=b.style.height=2*a.shape.radius+"rem",d(b,"radiusTop"),d(b,"radiusBottom"),d(b,"radiusLeft"),d(b,"radiusRight")):(b.setAttribute("shape",a.shape.ramp?"ramp":"rectangle"),a.shape.ramp&&b.setAttribute("position",a.shape.ramp),b.style.left=a.shape.left+"rem",b.style.top=a.shape.top+"rem",b.style.width=a.shape.width+"rem",b.style.height=a.shape.height+"rem",d(b,"left"),d(b,"top"),d(b,"bottom"),d(b,"right"),a.shape.ramp&&d(b,"turn")),b}},function(a,b){a.exports=function(a,b){var c;return c=document.createElement("div"),c.className="handle",c.setAttribute("kind",b),a.appendChild(c),c}},function(a,b){a.exports=14},function(a,b,c){var d;d=c(2),a.exports=function(a){var b,c,e,f;return c=a.parentNode,b=a.nextElementSibling,f=function(){return b?c.insertBefore(a,b):c.appendChild(a)},e=function(){return c.removeChild(a)},e(),d.addStep(f,e,function(){})}},function(a,b,c){var d;d=c(4),a.exports=function(a){var b;return b=a.cloneNode(!0),b.style.left=parseInt(b.style.left)+1+"rem",b.style.top=parseInt(b.style.top)+1+"rem",d(b,"shapes")}},function(a,b,c){var d;d=c(2),a.exports=function(a){var b,c,e,f;return b=a.nextElementSibling,b?(c=b.nextElementSibling,f=function(){return a.parentNode.insertBefore(a,b)},e=function(){return c?a.parentNode.insertBefore(a,c):a.parentNode.appendChild(a)},e(),d.addStep(f,e,function(){})):void 0}},function(a,b,c){var d;d=c(2),a.exports=function(a){var b,c,e,f;return b=a.previousElementSibling,b?(c=a.nextElementSibling,f=function(){return c?a.parentNode.insertBefore(a,c):a.parentNode.appendChild(a)},e=function(){return a.parentNode.insertBefore(a,b)},e(),d.addStep(f,e,function(){})):void 0}},function(a,b,c){var d;d=c(2),a.exports=function(a){var b;return b=function(){return a.setAttribute("operator",function(){switch(a.getAttribute("operator")){case"add":return"subtract";default:return"add"}}())},b(),d.addStep(b,b,function(){})}},function(a,b,c){var d;d=c(2),a.exports=function(a){var b,c;return b=a.getAttribute("position"),c=function(){switch(b){case"bottomLeft":return"topLeft";case"topLeft":return"topRight";case"topRight":return"bottomRight";case"bottomRight":return"bottomLeft"}}(),a.setAttribute("position",c),d.addStep(function(){return a.setAttribute("position",b)},function(){return a.setAttribute("position",c)},function(){})}},function(a,b,c){var d,e;d=c(15),e=c(7),a.exports=function(a){return{move:function(b,c){return a.style.left=Math.round((b-parseInt(a.style.width)*e/2)/e)+"rem",a.style.top=Math.round((c-parseInt(a.style.height)*e/2)/e)+"rem"},end:d(a)}}},function(a,b,c){var d;d=c(2),a.exports=function(a){var b;return b={left:a.style.left,top:a.style.top,width:a.style.width,height:a.style.height,transform:a.style.transform},function(){var c,e,f;return c={left:a.style.left,top:a.style.top,width:a.style.width,height:a.style.height,transform:a.style.transform},f=function(){return a.style.left=b.left,a.style.top=b.top,a.style.width=b.width,a.style.height=b.height,a.style.transform=b.transform},e=function(){return a.style.left=c.left,a.style.top=c.top,a.style.width=c.width,a.style.height=c.height,a.style.transform=c.transform},d.addStep(f,e,function(){})}}},function(a,b,c){var d,e;d=c(15),e=c(7),a.exports=function(a){return{move:function(b,c){return a.style.left=Math.round(b/e)+"rem",a.style.top=Math.round(c/e)+"rem"},end:d(a)}}},function(a,b,c){var d,e;d=c(15),e=c(7),a.exports=function(a){return{move:function(b,c){var d;return d=Math.round(c/e),d-=parseInt(a.style.top),d=Math.min(d,parseInt(a.style.height)-1),a.style.top=parseInt(a.style.top)+d+"rem",a.style.height=parseInt(a.style.height)-d+"rem"},end:d(a)}}},function(a,b,c){var d,e;d=c(15),e=c(7),a.exports=function(a){return{move:function(b,c){return a.style.height=Math.max(1,Math.round(c/e)-parseInt(a.style.top))+"rem"},end:d(a)}}},function(a,b,c){var d,e;d=c(15),e=c(7),a.exports=function(a){return{move:function(b,c){var d;return d=Math.round(b/e),d-=parseInt(a.style.left),d=Math.min(d,parseInt(a.style.width)-1),a.style.left=parseInt(a.style.left)+d+"rem",a.style.width=parseInt(a.style.width)-d+"rem"},end:d(a)}}},function(a,b,c){var d,e;d=c(15),e=c(7),a.exports=function(a){return{move:function(b,c){return a.style.width=Math.max(1,Math.round(b/e)-parseInt(a.style.left))+"rem"},end:d(a)}}},function(a,b,c){var d,e;d=c(15),e=c(7),a.exports=function(a){return{move:function(b,c){var d,f;return b/=e,c/=e,b-=parseInt(a.style.left)+parseInt(a.style.width)/2,c-=parseInt(a.style.top)+parseInt(a.style.height)/2,f=Math.max(1,Math.round(Math.sqrt(b*b+c*c))),d=2*f-parseInt(a.style.width),d/=2,a.style.width=a.style.height=2*f+"rem",a.style.left=parseInt(a.style.left)-d+"rem",a.style.top=parseInt(a.style.top)-d+"rem"},end:d(a)}}},function(a,b,c){var d,e;d=c(15),e=c(7),a.exports=function(a){return{move:function(b,c){return a.style.transform="rotate("+(Math.atan2(parseInt(a.parentNode.style.top)*e-c,parseInt(a.parentNode.style.left)*e-b)+Math.PI)+"rad)"},end:d(a)}}},function(a,b,c){var d,e,f,g;d=c(4),e=c(24),g=c(7),f=c(26),a.exports=function(){return d(e("player",f("player"),{origin:{x:Math.round((window.pageXOffset+window.innerWidth/2)/g),y:Math.round((window.pageYOffset+window.innerHeight/2)/g)},facing:"right"}),"entities")}},function(a,b,c){var d,e;d=c(6),e=c(25),a.exports=function(a,b,c){var f,g;switch(f=document.createElement("div"),d(f,"delete"),d(f,"clone"),f.className="entity",f.setAttribute("type",a),f.setAttribute("name",b),f.tabIndex=0,a){case"player":f.style.left=c.origin.x+"rem",f.style.top=c.origin.y+"rem",f.setAttribute("facing",c.facing),d(f,"moveMiddle");break;case"gravity":e(c.falloff,f),g=document.createElement("input"),g.type="range",g.min=-1,g.max=1,g.step="any",g.value=c.intensity,f.appendChild(g)}return f}},function(a,b,c){var d;d=c(6),a.exports=function(a,b){var c;return b.setAttribute("falloff","ambient"),b.style.left=a.origin.x+"rem",b.style.top=a.origin.y+"rem",c=d(b,"angle"),c.style.transform="rotate("+a.angle+"rad)",d(b,"moveMiddle")}},function(a,b,c){var d;d=c(27),a.exports=function(a){var b,c,e;for(c=b=1,e=1/0;e>=1?e>b:b>e;c=e>=1?++b:--b)if(d(a,c.toString()))return c.toString()}},function(a,b){a.exports=function(a,b){var c,d,e,f;for(f=document.getElementsByName(b),d=0,e=f.length;e>d;d++)if(c=f[d],"entity"===c.className&&c.getAttribute("type")===a)return!1;return!0}},function(a,b,c){var d,e,f,g;d=c(4),e=c(24),g=c(7),f=c(26),a.exports=function(){return d(e("gravity",f("gravity"),{falloff:{origin:{x:Math.round((window.pageXOffset+window.innerWidth/2)/g),y:Math.round((window.pageYOffset+window.innerHeight/2)/g)},angle:Math.PI/2},intensity:.25}),"entities")}},function(a,b,c){var d,e,f,g,h,i,j,k,l,m,n;f=c(30),n=c(34),j=c(36),m=c(39),i=c(40),k=c(45),h=c(46),e=c(48),d=c(49),g=c(50),l=c(51),a.exports=function(){var b,c,o,p,q,r,s,t,u,v,w;if(r=f(),r.entities.player){w=n(r.entities.player),document.body.setAttribute("mode","play"),p=m(),a.exports.stop=p.stop,c=j(r),o=h(r),b=i(c,o,k,w.origin,p,g),u=b.links;for(s in u)q=u[s],d(p,q);v=b.points;for(s in v)t=v[s],e(p,t);return l(b,g,p)}return alert("Please add a player spawn point.")}},function(a,b,c){var d,e;e=c(31),d=c(32),a.exports=function(){var a,b,c,f,g,h,i;for(g={shapes:function(){var b,c,d,f;for(d=document.getElementById("shapes").children,f=[],b=0,c=d.length;c>b;b++)a=d[b],f.push(e(a));return f}(),entities:{}},h=document.getElementById("entities").children,c=0,f=h.length;f>c;c++)a=h[c],b=d(a),i=g.entities[b.type]=g.entities[b.type]||{},i[b.name]=b.value;return g}},function(a,b){a.exports=function(a){var b;return b={operator:a.getAttribute("operator")},b.shape=function(){switch(a.getAttribute("shape")){case"circle":return{radius:parseInt(a.style.width)/2,origin:{x:parseInt(a.style.left)+parseInt(a.style.width)/2,y:parseInt(a.style.top)+parseInt(a.style.width)/2}};default:return{left:parseInt(a.style.left),top:parseInt(a.style.top),width:parseInt(a.style.width),height:parseInt(a.style.height),ramp:"ramp"===a.getAttribute("shape")?a.getAttribute("position"):void 0}}}(),b}},function(a,b,c){var d;d=c(33),a.exports=function(a){var b,c;return{type:a.getAttribute("type"),name:a.getAttribute("name"),value:function(){var e,f,g;switch(a.getAttribute("type")){case"player":return{origin:{x:parseInt(a.style.left),y:parseInt(a.style.top)},facing:a.getAttribute("facing")};case"gravity":for(c={falloff:d(a)},g=a.children,e=0,f=g.length;f>e;e++)b=g[e],"INPUT"===b.tagName&&(c.intensity=parseFloat(b.value));return c}}()}}},function(a,b){a.exports=function(a){var b,c,d,e,f;for(e={origin:{x:parseInt(a.style.left),y:parseInt(a.style.top)}},f=a.children,c=0,d=f.length;d>c;c++)b=f[c],"angle"===b.getAttribute("kind")&&(e.angle=parseFloat(b.style.transform.substring(7)));return e}},function(a,b,c){var d;d=c(35),a.exports=function(a){var b,c,e;c=0;for(b in a)c++;c=d(0,c);for(b in a)if(e=a[b],!c--)return e}},function(a,b){var c;c=Math.random,a.exports=function(a,b){return a===b?a:Math.round(a+c()*(b-a-1))}},function(a,b,c){a.exports=function(b){var c,d,e,f,g,h;for(g=null,f=b.shapes,d=0,e=f.length;e>d;d++)h=f[d],c=a.exports.shapeToDistanceField(h.shape),g=a.exports.combineDistanceFields(h.operator,g,c);return g},a.exports.shapeToDistanceField=c(37),a.exports.combineDistanceFields=c(38)},function(a,b){var c;c=function(a,b,c,d){return Math.sqrt((a-c)*(a-c)+(b-d)*(b-d))},a.exports=function(a){var b,d,e,f,g,h,i,j,k,l,m,n,o;if(a.radius)return function(b,d){return c(a.origin.x,a.origin.y,b,d)-a.radius};for(o=function(){switch(a.ramp){case"topLeft":return[[a.left,a.top],[a.left,a.top+a.height],[a.left+a.width,a.top]];case"topRight":return[[a.left,a.top],[a.left+a.width,a.top+a.height],[a.left+a.width,a.top]];case"bottomLeft":return[[a.left,a.top],[a.left,a.top+a.height],[a.left+a.width,a.top+a.height]];case"bottomRight":return[[a.left,a.top+a.height],[a.left+a.width,a.top+a.height],[a.left+a.width,a.top]];default:return[[a.left,a.top],[a.left,a.top+a.height],[a.left+a.width,a.top+a.height],[a.left+a.width,a.top]]}}(),m=function(){var a,b,c;for(c=[],d=a=0,b=o.length;b>a;d=++a)n=o[d],c.push({from:n,to:o[(d+1)%o.length]});return c}(),b=0,h=m.length;h>b;b++)l=m[b],l.difference=[l.to[0]-l.from[0],l.to[1]-l.from[1]];for(e=0,i=m.length;i>e;e++)l=m[e],l.length=Math.sqrt(l.difference[0]*l.difference[0]+l.difference[1]*l.difference[1]);for(f=0,j=m.length;j>f;f++)l=m[f],l.normal=[-l.difference[1]/l.length,l.difference[0]/l.length];for(g=0,k=m.length;k>g;g++)l=m[g],l.alongNormal=[l.difference[0]/l.length,l.difference[1]/l.length];return function(a,b){var d,e,f,g,h;for(e=void 0,h=0,g=m.length;g>h;h++){if(l=m[h],f=l.normal[0]*(a-l.from[0])+l.normal[1]*(b-l.from[1]),f>=0)switch(d=l.alongNormal[0]*(a-l.from[0])+l.alongNormal[1]*(b-l.from[1]),!1){case!(0>d):return c(a,b,l.from[0],l.from[1]);case!(d>l.length):return c(a,b,l.to[0],l.to[1]);default:return f}(void 0===e||f>e)&&(e=f)}return e}}},function(a,b){a.exports=function(a,b,c){if(b)switch(a){case"add":return function(a,d){return Math.min(b(a,d),c(a,d))};case"subtract":return function(a,d){return Math.max(b(a,d),.05-c(a,d))}}else switch(a){case"add":return c;case"subtract":return function(a,b){return-c(a,b)-.05}}}},function(a,b){a.exports=function(){var a,b,c;return b=function(){},a=setInterval(function(){return"play"===document.body.getAttribute("mode")?b():void 0},1e3/60),c={append:function(a){var c;return c=b,b=function(){return c(),a()}},stop:function(){return clearInterval(a)}}}},function(a,b,c){var d,e;e=c(41),d=c(44),a.exports=function(a,b,c,f,g,h){var i,j,k,l,m,n,o;window&&(window.rig=c),k={points:{},links:{}},l=c.points;for(i in l)o=l[i],j={location:{x:f.x+o.location.x,y:f.y+o.location.y},velocity:{x:0,y:0},material:c.pointMaterials[o.material]},o.sprite&&(j.sprite=o.sprite),k.points[i]=j,g.append(e(a,b,j));m=c.links;for(i in m)n=m[i],g.append(d(k.points[n.from],k.points[n.to],c.linkMaterials[n.material],h,n.controls)),k.links[i]={from:k.points[n.from],to:k.points[n.to],sprite:n.sprite};return k}},function(a,b,c){var d,e;e=c(42),d=c(43),a.exports=function(a,b,c){return function(){var f,g,h,i,j,k,l;return h=b(c.location),c.velocity.x+=h.x*c.material.mass*c.material.density,c.velocity.y+=h.y*c.material.mass*c.material.density,i=c.location.x+c.velocity.x/c.material.mass,j=c.location.y+c.velocity.y/c.material.mass,l=e(a,c.location.x,c.location.y,i,j),l?(c.location.x=l.x,c.location.y=l.y,k=d(a,l.x,l.y),g=c.velocity.x*k.x+c.velocity.y*k.y,g/=c.material.restitution,f=c.velocity.x*k.y-c.velocity.y*k.x,f/=c.material.friction,c.velocity.x=k.x*-Math.abs(g)+k.y*f,c.velocity.y=k.y*-Math.abs(g)-k.x*f,c.colliding=!0):(c.location.x=i,c.location.y=j,c.velocity.x/=c.material.airResistance,c.velocity.y/=c.material.airResistance,c.colliding=!1)}}},function(a,b,c){var d;d=c(43),a.exports=function(a,b,c,e,f){var g,h,i,j,k,l,m,n,o,p,q,r,s,t;for(l=k=0;5>k;l=++k)for(h=e-b,i=f-c,n=Math.sqrt(h*h+i*i),p=h/n,q=i/n,r=0,t=m=0;50>m;t=++m){if(j=a(b,c),r+=j,r>n)return l?s={x:e,y:f}:null;if(.01>j){o=d(a,b,c),b-=.05*o.x,c-=.05*o.y,g=(e-b)*o.x+(f-c)*o.y,e-=o.x*g,f-=o.y*g;break}b+=p*j,c+=q*j}return s={x:e,y:f}}},function(a,b){a.exports=function(a,b,c){var d,e,f,g,h;return d=a(b,c),e=a(b-.01,c)-d,f=a(b,c-.01)-d,g=Math.sqrt(e*e+f*f),h={x:e/g,y:f/g}}},function(a,b){a.exports=function(a,b,c,d,e){var f,g,h;return f=a.location.x-b.location.x,g=a.location.y-b.location.y,h=Math.sqrt(f*f+g*g),function(){var i,j,k,l;if(f=a.location.x-b.location.x,g=a.location.y-b.location.y,j=Math.sqrt(f*f+g*g),f/=j,g/=j,k=h,d&&e)for(i in e)l=e[i],d[i]&&(k/=l);return j-=k,j*=c.linearityScale,j=j>=0?Math.pow(j+1,c.linearityShape)-1:-(Math.pow(-j+1,c.linearityShape)-1),j*=c.strength,f*=j,g*=j,a.velocity.x-=f,a.velocity.y-=g,b.velocity.x+=f,b.velocity.y+=g}}},function(a,b){a.exports={pointMaterials:{limb:{density:.0125,friction:1,airResistance:1.015,mass:.02,restitution:1.5},joint:{density:.0125,friction:1,airResistance:1.05,mass:.001,restitution:1.5},wheel:{density:.025,friction:1,airResistance:1,mass:2,restitution:40}},points:{collarbone:{location:{x:0,y:-5},material:"limb",sprite:"head"},hips:{location:{x:0,y:-1.5},material:"joint"},leftElbow:{location:{x:-2,y:-3.5},material:"joint"},leftHand:{location:{x:-3,y:-1.5},material:"limb"},rightElbow:{location:{x:2,y:-3.5},material:"joint"},rightHand:{location:{x:3,y:-1.5},material:"limb"},leftKnee:{location:{x:-2,y:-.5},material:"joint"},rightKnee:{location:{x:2,y:-.5},material:"joint"},leftWheel:{location:{x:-2.5,y:2},material:"wheel",sprite:"foot"},rightWheel:{location:{x:2.5,y:2},material:"wheel",sprite:"foot"}},linkMaterials:{axle:{linearityScale:.8,linearityShape:2,strength:.7},upright:{linearityScale:.5,linearityShape:2,strength:.001},loose:{linearityScale:1,linearityShape:1,strength:.001},looser:{linearityScale:1,linearityShape:1,strength:5e-5}},links:{board:{from:"leftWheel",to:"rightWheel",material:"axle",sprite:"board"},rightBodyUpright:{from:"collarbone",to:"rightWheel",material:"upright"},leftBodyUpright:{from:"collarbone",to:"leftWheel",material:"upright"},leftArm:{from:"collarbone",to:"leftHand",material:"loose"},rightArm:{from:"collarbone",to:"rightHand",material:"loose"},leftArmLower:{from:"leftHand",to:"leftElbow",material:"looser",sprite:"armLower"},leftArmUpper:{from:"collarbone",to:"leftElbow",material:"looser",sprite:"armUpper"},rightArmLower:{from:"rightHand",to:"rightElbow",material:"looser",sprite:"armLower"},rightArmUpper:{from:"collarbone",to:"rightElbow",material:"looser",sprite:"armUpper"},rightLegUpper:{from:"hips",to:"rightKnee",material:"looser",sprite:"legUpper"},rightLegLower:{from:"rightWheel",to:"rightKnee",material:"looser",sprite:"legLower"},leftLegUpper:{from:"hips",to:"leftKnee",material:"looser",sprite:"legUpper"},leftLegLower:{from:"leftWheel",to:"leftKnee",material:"looser",sprite:"legLower"},spine:{from:"collarbone",to:"hips",material:"loose",sprite:"torso"},armSpan:{from:"leftHand",to:"rightHand",material:"looser"},elbowSpan:{from:"leftElbow",to:"rightElbow",material:"looser"},kneeSep:{from:"leftKnee",to:"rightKnee",material:"looser"}}}},function(a,b,c){var d;d=c(47),a.exports=function(a){var b,c,e,f,g;e=function(a){return{x:0,y:0}},f=a.entities.gravity,b=function(a){var b,c;return b=d(a.falloff),c=e,e=function(d){var e,f,g;return e=c(d),f=b(d),g={x:e.x+f.x*a.intensity,y:e.y+f.y*a.intensity}}};for(c in f)g=f[c],b(g);return e}},function(a,b){a.exports=function(a){var b,c;return b=Math.cos(a.angle),c=Math.sin(a.angle),function(a){return{x:b,y:c}}}},function(a,b){a.exports=function(a,b){var c;return b.sprite?(c=document.createElement("div"),c.className="point",c.style.transform="translate("+b.location.x+"rem, "+b.location.y+"rem)",c.setAttribute("sprite",b.sprite),document.getElementById("preview").appendChild(c),a.append(function(){return c.style.transform="translate("+b.location.x+"rem, "+b.location.y+"rem)"})):void 0}},function(a,b){a.exports=function(a,b){var c,d;return b.sprite?(c=document.createElement("div"),c.className="link",c.setAttribute("sprite",b.sprite),d=function(){var a,d,e,f;return d=b.to.location.x-b.from.location.x,e=b.to.location.y-b.from.location.y,f=Math.sqrt(d*d+e*e),a=Math.atan2(e,d),c.style.width=f+"rem",c.style.transform="translate("+b.from.location.x+"rem, "+b.from.location.y+"rem) rotate("+a+"rad)"},d(),document.getElementById("preview").appendChild(c),a.append(d)):void 0}},function(a,b){a.exports={}},function(a,b){a.exports=function(a,b,c){return c.append(function(){return a.points.leftWheel.colliding&&(b.leanLeft&&(a.points.rightWheel.velocity.y-=.1),b.leanRight&&(a.points.rightWheel.velocity.y+=.1)),a.points.rightWheel.colliding&&(b.leanLeft&&(a.points.leftWheel.velocity.y+=.1),b.leanRight)?a.points.leftWheel.velocity.y-=.1:void 0})}},function(a,b,c){var d;d=c(29),a.exports=function(){var a;for(document.body.setAttribute("mode","edit"),a=document.getElementById("preview");a.firstChild;)a.removeChild(a.firstChild);return d.stop()}},function(a,b){a.exports=function(a,b){var c,d,e;return e=JSON.stringify(b),window.navigator.msSaveBlob?(c=new Blob([e],{type:"application/json;charset=utf-8;"}),window.navigator.msSaveBlob(c,a)):(d=document.createElement("a"),d.setAttribute("href","data:application/json;charset=utf-8,"+encodeURIComponent(e)),d.setAttribute("download",a),document.body.appendChild(d),d.click(),document.body.removeChild(d))}},function(a,b,c){var d;d=c(55),a.exports=function(){var a;return a=document.getElementById("openFile"),a.onchange=function(b){var c,e,f,g,h,i;for(h=a.files,i=[],f=0,g=h.length;g>f;f++)c=h[f],e=new FileReader,e.onload=function(){try{return d(JSON.parse(e.result))}catch(a){return b=a,alert("This file could not be read.")}},e.onabort=function(){return alert("Reading this file was aborted.")},e.onerror=function(){return alert("This file could not be read.")},i.push(e.readAsText(c));return i}}},function(a,b,c){var d,e;e=c(5),d=c(24),a.exports=function(a){var b,c,f,g,h,i,j,k,l,m,n,o;for(m=document.getElementById("shapes");m.firstChild;)m.removeChild(m.firstChild);for(i=a.shapes,c=0,f=i.length;f>c;c++)l=i[c],m.appendChild(e(l));for(b=document.getElementById("entities");b.firstChild;)b.removeChild(b.firstChild);j=a.entities,k=[];for(n in j)h=j[n],k.push(function(){var a;a=[];for(g in h)o=h[g],a.push(b.appendChild(d(n,g,o)));return a}());return k}},function(a,b,c){var d,e;d=c(50),e=c(57),a.exports=function(a){var b;return(b=e[a.keyCode])?d[b]=!0:void 0}},function(a,b){a.exports={88:"leanRight",90:"leanLeft"}},function(a,b,c){var d,e;d=c(50),e=c(57),a.exports=function(a){var b;return(b=e[a.keyCode])?d[b]=!1:void 0}}]);