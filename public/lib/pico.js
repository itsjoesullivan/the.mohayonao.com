!function(){"use strict";function a(){this.impl=null,this.isPlaying=!1,this.samplerate=44100,this.channels=2,this.cellsize=128,this.streammsec=20,this.streamsize=0,this.generator=null}var b=null,c=function(){return"undefined"!=typeof window?window.webkitAudioContext||window.AudioContext:void 0}();b="undefined"!=typeof c?function(a){var b,d,e=new c;this.maxSamplerate=e.sampleRate,this.defaultSamplerate=e.sampleRate,this.env="webkit";var f=navigator.userAgent;f.match(/linux/i)?a.streammsec*=8:f.match(/win(dows)?\s*(nt 5\.1|xp)/i)&&(a.streammsec*=4),this.play=function(){var c,f,g,h=a.getAdjustSamples(e.sampleRate),i=a.streamsize;a.samplerate===e.sampleRate?c=function(b){var c=b.outputBuffer;a.process(),c.getChannelData(0).set(a.strmL),c.getChannelData(1).set(a.strmR)}:2*a.samplerate===e.sampleRate?c=function(b){var c,d,e=a.strmL,f=a.strmR,g=b.outputBuffer,h=g.getChannelData(0),i=g.getChannelData(1),j=g.length;for(a.process(),c=d=0;j>c;c+=2,++d)h[c]=h[c+1]=e[d],i[c]=i[c+1]=f[d]}:(f=i,g=a.samplerate/e.sampleRate,c=function(b){var c,d=a.strmL,e=a.strmR,h=b.outputBuffer,j=h.getChannelData(0),k=h.getChannelData(1),l=h.length;for(c=0;l>c;++c)f>=i&&(a.process(),f-=i),j[c]=d[0|f],k[c]=e[0|f],f+=g}),b=e.createBufferSource(),d=e.createScriptProcessor?e.createScriptProcessor(h,2,a.channels):e.createJavaScriptNode(h,2,a.channels),d.onaudioprocess=c,b.noteOn&&(b.noteOn(0),b.connect(d)),d.connect(e.destination)},this.pause=function(){b.disconnect(),d.disconnect()}}:"function"==typeof Audio&&"function"==typeof(new Audio).mozSetup?function(a){var b=function(){var a="var t=0;onmessage=function(e){if(t)t=clearInterval(t),0;if(typeof e.data=='number'&&e.data>0)t=setInterval(function(){postMessage(0);},e.data);};",b=new Blob([a],{type:"text/javascript"}),c=window.URL.createObjectURL(b);return new Worker(c)}();this.maxSamplerate=48e3,this.defaultSamplerate=44100,this.env="moz",this.play=function(){var c=new Audio,d=new Float32Array(a.streamsize*a.channels),e=a.streammsec,f=0,g=a.streamsize/a.samplerate*1e3,h=Date.now(),i=function(){if(!(f>Date.now()-h)){var b=a.strmL,e=a.strmR,i=d.length,j=b.length;for(a.process();j--;)d[--i]=e[j],d[--i]=b[j];c.mozWriteAudio(d),f+=g}};c.mozSetup(a.channels,a.samplerate),b.onmessage=i,b.postMessage(e)},this.pause=function(){b.postMessage(0)}}:function(){this.maxSamplerate=48e3,this.defaultSamplerate=44100,this.env="nop",this.play=function(){},this.pause=function(){}};var d=[8e3,11025,12e3,16e3,22050,24e3,32e3,44100,48e3],e=[32,64,128,256];a.prototype.bind=function(a,b){if("function"==typeof a){var c=new a(this,b);"function"==typeof c.play&&"function"==typeof c.pause&&(this.impl=c,this.impl.defaultSamplerate&&(this.samplerate=this.impl.defaultSamplerate))}return this},a.prototype.setup=function(a){if("object"==typeof a)-1!==d.indexOf(a.samplerate)&&(this.samplerate=a.samplerate<=this.impl.maxSamplerate?a.samplerate:this.impl.maxSamplerate),-1!==e.indexOf(a.cellsize)&&(this.cellsize=a.cellsize);else if("string"==typeof a)switch(a){case"mobile":this.samplerate=22050,this.cellsize=128;break;case"high-res":this.cellsize=32;break;case"low-res":this.cellsize=256}return this},a.prototype.getAdjustSamples=function(a){var b,c;return a=a||this.samplerate,b=this.streammsec/1e3*a,c=Math.ceil(Math.log(b)*Math.LOG2E),c=8>c?8:c>14?14:c,1<<c},a.prototype.play=function(a){return this.isPlaying||"object"!=typeof a?this:(this.isPlaying=!0,this.generator=a,this.streamsize=this.getAdjustSamples(),this.strmL=new Float32Array(this.streamsize),this.strmR=new Float32Array(this.streamsize),this.cellL=new Float32Array(this.cellsize),this.cellR=new Float32Array(this.cellsize),this.impl.play(),this)},a.prototype.pause=function(){return this.isPlaying&&(this.isPlaying=!1,this.impl.pause()),this},a.prototype.process=function(){for(var a,b,c=this.cellL,d=this.cellR,e=this.strmL,f=this.strmR,g=this.generator,h=c.length,i=0,j=this.streamsize/this.cellsize;j--;)for(g.process(c,d),a=0;h>a;++a,++i)b=c[a],e[i]=-1>b?-1:b>1?1:b,b=d[a],f[i]=-1>b?-1:b>1?1:b};var f=(new a).bind(b),g={setup:function(a){return f.setup(a),this},bind:function(a,b){return f.bind(a,b),this},play:function(a){return f.play(a),this},pause:function(){return f.pause(),this}};Object.defineProperties(g,{env:{get:function(){return f.impl.env}},samplerate:{get:function(){return f.samplerate}},channels:{get:function(){return f.channels}},cellsize:{get:function(){return f.cellsize}},isPlaying:{get:function(){return f.isPlaying}}}),"undefined"!=typeof module&&module.exports?module.exports=global.pico=g:"undefined"!=typeof window&&("undefined"==typeof window.Float32Array&&(window.Float32Array=function(a){var b;if(Array.isArray(a))b=a.slice();else if("number"==typeof a){b=new Array(a);for(var c=0;a>c;++c)b[c]=0}else b=[];return b.set=function(a,b){"undefined"==typeof b&&(b=0);var c,d=Math.min(this.length-b,a.length);for(c=0;d>c;++c)this[b+c]=a[c]},b.subarray=function(a,b){return"undefined"==typeof b&&(b=this.length),this.slice(a,b)},b}),g.noConflict=function(){var a=window.pico;return function(){return window.pico===g&&(window.pico=a),g}}(),window.pico=g),function(){function a(a){try{return b.plugins&&b.mimeTypes&&b.mimeTypes.length?b.plugins["Shockwave Flash"].description.match(/([0-9]+)/)[a]:new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version").match(/([0-9]+)/)[a]}catch(c){return-1}}if("undefined"!=typeof window&&"nop"===window.pico.env){var b=navigator;if(!(a(0)<10)){var c,d="PicoFlashPlayerDiv",e=function(){var a=document.getElementsByTagName("script");if(a&&a.length)for(var b,c=0,d=a.length;d>c;++c)if(b=/^(.*\/)pico(?:\.dev)?\.js$/i.exec(a[c].src))return b[1]+"pico.swf"}();window.picojs_flashfallback_init=function(){function a(a){var b=0;this.maxSamplerate=44100,this.defaultSamplerate=44100,this.env="flash",this.play=function(){var d,f=new Array(a.streamsize*a.channels),g=a.streammsec,h=0,i=a.streamsize/a.samplerate*1e3,j=Date.now();d=function(){if(!(h>Date.now()-j)){var b=a.strmL,d=a.strmR,e=f.length,g=b.length;for(a.process();g--;)f[--e]=32768*d[g]|0,f[--e]=32768*b[g]|0;c.writeAudio(f.join(" ")),h+=i}},c.setup?(c.setup(a.channels,a.samplerate),b=setInterval(d,g)):console.warn("Cannot find "+e)},this.pause=function(){0!==b&&(c.cancel(),clearInterval(b),b=0)}}f.bind(a),delete window.picojs_flashfallback_init};var g,h,i=e,j=i+"?"+ +new Date,k="PicoFlashPlayer",l=document.createElement("div");l.id=d,l.style.display="inline",l.width=l.height=1,b.plugins&&b.mimeTypes&&b.mimeTypes.length?(g=document.createElement("object"),g.id=k,g.classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",g.width=g.height=1,g.setAttribute("data",j),g.setAttribute("type","application/x-shockwave-flash"),h=document.createElement("param"),h.setAttribute("name","allowScriptAccess"),h.setAttribute("value","always"),g.appendChild(h),l.appendChild(g)):l.innerHTML='<object id="'+k+'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="1" height="1"><param name="movie" value="'+j+'" /><param name="bgcolor" value="#FFFFFF" /><param name="quality" value="high" /><param name="allowScriptAccess" value="always" /></object>',window.addEventListener("load",function(){document.body.appendChild(l),c=document[k]})}}}()}();
//# sourceMappingURL=pico.js.map