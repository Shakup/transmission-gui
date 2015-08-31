/*
 * lea.js - version 1.0.2 - 2015-08-29
 * A tiny JavaScript framework for modern browsers (and developers)
 * Author: Sébastien Decamme <sebastien.decamme@gmail.com>
 * Homepage: https://github.com/Shakup/lea.js
 */
!function(a){"use strict";var b=function(c,d){return void 0==d&&(d=a.document),void 0==this||this===a?new b(c,d):null==c?(this.elements=[],this):("array"!==b.type(c)&&(c=[c]),this.elements=[],c.forEach(function(c){b.isNode(c)||c===a||c===document?this.elements.push(c):"string"===b.type(c)&&(this.elements=this.elements.concat(b.toArray(d.querySelectorAll(c))))}.bind(this)),this)};return b.about={version:"1.0.2",homepage:"https://github.com/Shakup/lea.js"},b.addMethod=function(a,b){this.prototype[a]=b},b.ready=function(a){"loading"!=document.readyState?a():document.addEventListener("DOMContentLoaded",a)},b.extend=function(a){for(var a=a||{},b=1;b<arguments.length;b++)if(arguments[b])for(var c in arguments[b])arguments[b].hasOwnProperty(c)&&(a[c]=arguments[b][c]);return a},b.toArray=function(a){return Array.prototype.slice.call(a,0)},b.type=function(a){return Object.prototype.toString.call(a).replace(/^\[object (.+)\]$/,"$1").toLowerCase()},b.isNode=function(a){return a instanceof HTMLElement},b.camelize=function(a){return"-"==a.charAt(0)&&(a=a.slice(1)),a.replace(/-\D/g,function(a){return a.charAt(1).toUpperCase()})},b.dashize=function(a){return a.replace(/[A-Z]/g,function(a){return"-"+a.charAt(0).toLowerCase()})},b.forEach=function(a,b,c){for(var d in a)a.hasOwnProperty(d)&&b.call(c||a,d,a[d])},b.str2Node=function(a){if(b.isNode(a))return a;var c=document.createElement("div");return c.innerHTML=a,Array.prototype.slice.call(c.childNodes,0)},b.create=function(a,c){var d=document.createElement(a);return void 0!=c&&b.forEach(c||{},function(a,c){switch(a.toLowerCase()){case"style":d=$(d).css(c).get(0);break;case"html":d.innerHTML=c;break;case"class":d.classList.add(c);break;case"event":b.forEach(c,function(a,b){d.addEventListener(a,b,!1)});break;case"data":b.forEach(c,function(a,b){d.dataset[a]=b});break;default:d.setAttribute(a,c)}}),d},b.device=function(a){var b=navigator.userAgent.toLowerCase(),c=function(){return/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(b)?"tablet":/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/.test(b)?"phone":"desktop"}();return void 0!=a?c===a:c},b.isMobile=function(){return!b.device("desktop")},b.getUrlParameters=function(b){var c,d=/([^&=]+)=?([^&]*)/g,e={},f=a.location.search||a.location.hash;for(f=f.substring(f.indexOf("?")+1,f.length);c=d.exec(f);)e[decodeURIComponent(c[1])]=decodeURIComponent(c[2]);return void 0!=b?e[b]||null:e},b.ajax=function(a,c){return this.httpRequest=function(){var d=function(){}.bind(this),e=this;this.options=b.extend({method:"GET",complete:d,success:d,error:d,send:!0,async:!0,data:{},withCredentials:!1,contentType:"application/x-www-form-urlencoded"},c||{}),this.transport=new XMLHttpRequest,this.options.method=this.options.method.toUpperCase(),this.parameters="",this.transport.onreadystatechange=function(){if(4==this.readyState)if(e.options.complete.call(e,this),200==this.status||0===this.status){var a,b=this.getResponseHeader("Content-Type");a=b&&b.indexOf("application/json")>-1?JSON.parse(this.responseText):this.responseText,e.options.success.call(e,a,this)}else e.options.error.call(e,a,this)},this.transport.withCredentials=this.options.withCredentials,this.transport.open(this.options.method,a,this.options.async),"POST"==this.options.method&&(this.transport.setRequestHeader("Content-Type",this.options.contentType),b.forEach(this.options.data,function(a,b){e.parameters.length&&(e.parameters+="&"),e.parameters+=encodeURIComponent(a)+"="+encodeURIComponent(b)})),this.options.send&&this.send()},this.httpRequest.prototype={complete:function(a){return this.options.complete=a.bind(this),this},success:function(a){return this.options.success=a.bind(this),this},error:function(a){return this.options.error=a.bind(this),this},send:function(){return this.transport.send(this.parameters.length?this.parameters:null),this},abort:function(){return this.transport.abort(),this}},new this.httpRequest},b.get=function(a,c){return b.ajax(a,b.extend(c||{},{method:"GET"}))},b.post=function(a,c,d){return b.ajax(a,b.extend(d||{},{method:"POST",data:c||{}}))},b.debounce=function(a,b){var c;return function(){var d=arguments,e=this;clearTimeout(c),c=setTimeout(function(){a.apply(e,d)},b)}},b.throttle=function(a,b){var c,d;return function(){var e=this,f=+new Date,g=arguments;c&&c+b>f?(clearTimeout(d),d=setTimeout(function(){c=f,a.apply(e,g)},b)):(c=f,a.apply(e,g))}},b.prototype={hasElements:function(){return this.elements.length>0},each:function(a){var b,c=new Error("Break");try{this.elements.forEach(function(d,e){if(b=a.call(d,d,e),b===!1)throw c})}catch(d){if(d!=c)throw d}return this},get:function(a){return void 0!=a?this.elements[a]||null:this.elements},first:function(){return $(this.hasElements()?this.get(0):[])},last:function(){return $(this.hasElements()?this.get(this.elements.length-1):[])},css:function(c,d){return void 0!=d?(this.each(function(){this.style[b.camelize(c)]=d}),this):"string"===b.type(c)?a.getComputedStyle(this.get(0),null)[b.dashize(c)]:"object"===b.type(c)?(this.each(function(){var a=this;b.forEach(c,function(c,d){a.style[b.camelize(c)]=d})}),this):void 0},height:function(){var b=this.elements[0];return b==a?a.innerHeight:b==document?document.body.clientHeight:b.offsetHeight},width:function(){var b=this.elements[0];return b==a?a.innerWidth:b==document?document.body.clientWidth:b.offsetWidth},scroll:function(){var b=this.elements[0];return b==a?{top:b.scrollY,left:b.scrollX,width:document.body.scrollWidth,height:document.body.scrollHeight}:{top:b.scrollTop,left:b.scrollLeft,width:b.scrollWidth,height:b.scrollHeight}},val:function(a){return void 0!=a?(this.each(function(){this.value=a}),this):this.elements[0].value||""},addClass:function(a){return this.each(function(){this.classList.add(a)}),this},removeClass:function(a){return this.each(function(){this.classList.remove(a)}),this},hasClass:function(a){var b=!0;return this.elements.forEach(function(c){return c.classList.contains(a)?void 0:void(b=!1)}),b},toggleClass:function(a){return this.each(function(){var b=$(this);b.hasClass(a)?b.removeClass(a):b.addClass(a)}),this},show:function(a){if(void 0==a)var a="block";return this.each(function(){this.style.display=a}),this},hide:function(){return this.each(function(){this.style.display="none"}),this},toggle:function(a){if(void 0==a)var a="block";return this.each(function(){this.style.display="none"==b(this).css("display")?a:"none"}),this},html:function(a){return void 0==a?this.get(0).innerHTML:(this.each(function(){this.innerHTML=a}),this)},on:function(a,b){return this.each(function(){this.addEventListener(a,b,!1)},!1),this},off:function(a,b){return this.each(function(){this.removeEventListener(a,b,!1)}),this},delegate:function(a,c,d){return this.each(function(){this.addEventListener(c,function(e){b(e.target).is(a)&&d.call(e.target,c)},!1)}),this},trigger:function(a){var b=document.createEvent("HTMLEvents");return b.initEvent(a,!0,!0),this.each(function(){this.dispatchEvent(b)}),this},click:function(a){return this.on("click",a)},attr:function(a,b){return void 0!=b?(this.each(function(){this.setAttribute(a,b)}),this):this.elements[0].getAttribute(a)},removeAttr:function(a){return this.each(function(){this.removeAttribute(a)}),this},data:function(a,b){return void 0!=b?(this.each(function(){this.dataset[a]=b}),this):this.get(0).dataset[a]},removeData:function(a){return this.each(function(){delete this.dataset[a]}),this},clone:function(){return this.elements[0].cloneNode(!0)},append:function(a){return this.each(function(c){if(b.isNode(a))c.appendChild(a);else{var d=b.str2Node(a);d.forEach(function(a){c.appendChild(a)})}}),this},prepend:function(a){return this.each(function(c){if(b.isNode(a))c.insertBefore(a,c.firstChild);else{var d=b.str2Node(a);d.forEach(function(a){c.insertBefore(a,c.firstChild)})}}),this},before:function(a){return this.each(function(){this.insertAdjacentHTML("beforebegin",a)}),this},after:function(a){return this.each(function(){this.insertAdjacentHTML("afterend",a)}),this},remove:function(){return this.each(function(){this.parentNode.removeChild(this)}),this},parent:function(){var a=[];return this.each(function(){var b=this.parentNode;b&&a.push(b)}),new b(a)},find:function(a){var c=[];return this.elements.forEach(function(d){c=c.concat(b.toArray(d.querySelectorAll(a)))}),this.elements=c,this},prev:function(){var a=[];return this.each(function(){var b=this.previousElementSibling;b&&a.push(b)}),this.elements=a,this},next:function(){var a=[];return this.each(function(){var b=this.nextElementSibling;b&&a.push(b)}),this.elements=a,this},clear:function(){return this.each(function(){this.innerHTML=""}),this},text:function(a){return void 0!=a?(this.each(function(){this.textContent=a}),this):this.hasElements?this.elements[0].innerText:""},is:function(a){var b=!0,c=function(b){return(b.matches||b.matchesSelector||b.msMatchesSelector||b.webkitMatchesSelector).call(b,a)};return this.each(function(){return b=c(this)}),b},offset:function(){if(!this.hasElements())return{top:0,left:0};var a=this.elements[0],b=a.getBoundingClientRect();return{top:b.top+document.body.scrollTop,left:b.left+document.body.scrollLeft}},position:function(){if(!this.hasElements())return{top:0,left:0};var a=this.elements[0].getBoundingClientRect();return{top:a.top,left:a.left}},replaceWith:function(a){return this.each(function(){this.outerHTML=a}),this},serialize:function(){var a,c,d=this.elements[0],e={};return"form"!==d.nodeName.toLowerCase()?e:(b.toArray(d.elements).forEach(function(b){if(b.name&&!b.disabled&&-1==["file","button","reset","submit"].indexOf(b.type))if("select-multiple"==b.type)for(a=d.elements[i].options.length,c=0;a>c;c++)b.options[c].selected&&(e[b.name]=b.options[c].value);else("checkbox"!=b.type&&"radio"!=b.type||b.checked)&&(e[b.name]=b.value)}),e)},submit:function(a){var c=this.elements[0];return"form"!==c.nodeName.toLowerCase()?!1:(a=b.extend({method:c.method||"GET",data:this.serialize()},a||{}),b.ajax(c.action||"#",a))}},a.Lea=a.$=b,"function"==typeof define&&define.amd&&define("lea",[],function(){return b}),console.info("Powered by Lea.js\nVersion: "+b.about.version+"\nHomepage:"+b.about.homepage),b}(window);
//# sourceMappingURL=lea.js.map