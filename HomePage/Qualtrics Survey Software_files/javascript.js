
String.prototype.parseColor=function(){var color='#';if(this.slice(0,4)=='rgb('){var cols=this.slice(4,this.length-1).split(',');var i=0;do{color+=parseInt(cols[i]).toColorPart()}while(++i<3);}else{if(this.slice(0,1)=='#'){if(this.length==4)for(var i=1;i<4;i++)color+=(this.charAt(i)+this.charAt(i)).toLowerCase();if(this.length==7)color=this.toLowerCase();}}
return(color.length==7?color:(arguments[0]||this));};Element.collectTextNodes=function(element){return $A($(element).childNodes).collect(function(node){return(node.nodeType==3?node.nodeValue:(node.hasChildNodes()?Element.collectTextNodes(node):''));}).flatten().join('');};Element.collectTextNodesIgnoreClass=function(element,className){return $A($(element).childNodes).collect(function(node){return(node.nodeType==3?node.nodeValue:((node.hasChildNodes()&&!Element.hasClassName(node,className))?Element.collectTextNodesIgnoreClass(node,className):''));}).flatten().join('');};Element.setContentZoom=function(element,percent){element=$(element);element.setStyle({fontSize:(percent/100)+'em'});if(Prototype.Browser.WebKit)window.scrollBy(0,0);return element;};Element.getInlineOpacity=function(element){return $(element).style.opacity||'';};Element.forceRerendering=function(element){try{element=$(element);var n=document.createTextNode(' ');element.appendChild(n);element.removeChild(n);}catch(e){}};var Effect={_elementDoesNotExistError:{name:'ElementDoesNotExistError',message:'The specified DOM element does not exist, but is required for this effect to operate'},Transitions:{linear:Prototype.K,sinoidal:function(pos){return(-Math.cos(pos*Math.PI)/2)+.5;},reverse:function(pos){return 1-pos;},flicker:function(pos){var pos=((-Math.cos(pos*Math.PI)/4)+.75)+Math.random()/4;return pos>1?1:pos;},wobble:function(pos){return(-Math.cos(pos*Math.PI*(9*pos))/2)+.5;},pulse:function(pos,pulses){return(-Math.cos((pos*((pulses||5)-.5)*2)*Math.PI)/2)+.5;},spring:function(pos){return 1-(Math.cos(pos*4.5*Math.PI)*Math.exp(-pos*6));},none:function(pos){return 0;},full:function(pos){return 1;}},DefaultOptions:{duration:1.0,fps:100,sync:false,from:0.0,to:1.0,delay:0.0,queue:'parallel'},tagifyText:function(element){var tagifyStyle='position:relative';if(Prototype.Browser.IE)tagifyStyle+=';zoom:1';element=$(element);$A(element.childNodes).each(function(child){if(child.nodeType==3){child.nodeValue.toArray().each(function(character){element.insertBefore(new Element('span',{style:tagifyStyle}).update(character==' '?String.fromCharCode(160):character),child);});Element.remove(child);}});},multiple:function(element,effect){var elements;if(((typeof element=='object')||Object.isFunction(element))&&(element.length))
elements=element;else
elements=$(element).childNodes;var options=Object.extend({speed:0.1,delay:0.0},arguments[2]||{});var masterDelay=options.delay;$A(elements).each(function(element,index){new effect(element,Object.extend(options,{delay:index*options.speed+masterDelay}));});},PAIRS:{'slide':['SlideDown','SlideUp'],'blind':['BlindDown','BlindUp'],'appear':['Appear','Fade']},toggle:function(element,effect,options){element=$(element);effect=(effect||'appear').toLowerCase();return Effect[Effect.PAIRS[effect][element.visible()?1:0]](element,Object.extend({queue:{position:'end',scope:(element.id||'global'),limit:1}},options||{}));}};Effect.DefaultOptions.transition=Effect.Transitions.sinoidal;Effect.ScopedQueue=Class.create(Enumerable,{initialize:function(){this.effects=[];this.interval=null;},_each:function(iterator){this.effects._each(iterator);},add:function(effect){var timestamp=new Date().getTime();var position=Object.isString(effect.options.queue)?effect.options.queue:effect.options.queue.position;switch(position){case'front':this.effects.findAll(function(e){return e.state=='idle'}).each(function(e){e.startOn+=effect.finishOn;e.finishOn+=effect.finishOn;});break;case'with-last':timestamp=this.effects.pluck('startOn').max()||timestamp;break;case'end':timestamp=this.effects.pluck('finishOn').max()||timestamp;break;}
effect.startOn+=timestamp;effect.finishOn+=timestamp;if(!effect.options.queue.limit||(this.effects.length<effect.options.queue.limit))
this.effects.push(effect);if(!this.interval)
this.interval=setInterval(this.loop.bind(this),15);},remove:function(effect){this.effects=this.effects.reject(function(e){return e==effect});if(this.effects.length==0){clearInterval(this.interval);this.interval=null;}},loop:function(){var timePos=new Date().getTime();for(var i=0,len=this.effects.length;i<len;i++)
this.effects[i]&&this.effects[i].loop(timePos);}});Effect.Queues={instances:$H(),get:function(queueName){if(!Object.isString(queueName))return queueName;return this.instances.get(queueName)||this.instances.set(queueName,new Effect.ScopedQueue());}};Effect.Queue=Effect.Queues.get('global');Effect.Base=Class.create({position:null,start:function(options){if(options&&options.transition===false)options.transition=Effect.Transitions.linear;this.options=Object.extend(Object.extend({},Effect.DefaultOptions),options||{});this.currentFrame=0;this.state='idle';this.startOn=this.options.delay*1000;this.finishOn=this.startOn+(this.options.duration*1000);this.fromToDelta=this.options.to-this.options.from;this.totalTime=this.finishOn-this.startOn;this.totalFrames=this.options.fps*this.options.duration;this.render=(function(){function dispatch(effect,eventName){if(effect.options[eventName+'Internal'])
effect.options[eventName+'Internal'](effect);if(effect.options[eventName])
effect.options[eventName](effect);}
return function(pos){if(this.state==="idle"){this.state="running";dispatch(this,'beforeSetup');if(this.setup)this.setup();dispatch(this,'afterSetup');}
if(this.state==="running"){pos=(this.options.transition(pos)*this.fromToDelta)+this.options.from;this.position=pos;dispatch(this,'beforeUpdate');if(this.update)this.update(pos);dispatch(this,'afterUpdate');}};})();this.event('beforeStart');if(!this.options.sync)
Effect.Queues.get(Object.isString(this.options.queue)?'global':this.options.queue.scope).add(this);},loop:function(timePos){if(timePos>=this.startOn){if(timePos>=this.finishOn){this.render(1.0);this.cancel();this.event('beforeFinish');if(this.finish)this.finish();this.event('afterFinish');return;}
var pos=(timePos-this.startOn)/this.totalTime,frame=(pos*this.totalFrames).round();if(frame>this.currentFrame){this.render(pos);this.currentFrame=frame;}}},cancel:function(){if(!this.options.sync)
Effect.Queues.get(Object.isString(this.options.queue)?'global':this.options.queue.scope).remove(this);this.state='finished';},event:function(eventName){if(this.options[eventName+'Internal'])this.options[eventName+'Internal'](this);if(this.options[eventName])this.options[eventName](this);},inspect:function(){var data=$H();for(property in this)
if(!Object.isFunction(this[property]))data.set(property,this[property]);return'#<Effect:'+data.inspect()+',options:'+$H(this.options).inspect()+'>';}});Effect.Parallel=Class.create(Effect.Base,{initialize:function(effects){this.effects=effects||[];this.start(arguments[1]);},update:function(position){this.effects.invoke('render',position);},finish:function(position){this.effects.each(function(effect){effect.render(1.0);effect.cancel();effect.event('beforeFinish');if(effect.finish)effect.finish(position);effect.event('afterFinish');});}});Effect.Tween=Class.create(Effect.Base,{initialize:function(object,from,to){object=Object.isString(object)?$(object):object;var args=$A(arguments),method=args.last(),options=args.length==5?args[3]:null;this.method=Object.isFunction(method)?method.bind(object):Object.isFunction(object[method])?object[method].bind(object):function(value){object[method]=value};this.start(Object.extend({from:from,to:to},options||{}));},update:function(position){this.method(position);}});Effect.Event=Class.create(Effect.Base,{initialize:function(){this.start(Object.extend({duration:0},arguments[0]||{}));},update:Prototype.emptyFunction});Effect.Opacity=Class.create(Effect.Base,{initialize:function(element){this.element=$(element);if(!this.element)throw(Effect._elementDoesNotExistError);if(Prototype.Browser.IE&&(!this.element.currentStyle.hasLayout))
this.element.setStyle({zoom:1});var options=Object.extend({from:this.element.getOpacity()||0.0,to:1.0},arguments[1]||{});this.start(options);},update:function(position){this.element.setOpacity(position);}});Effect.Move=Class.create(Effect.Base,{initialize:function(element){this.element=$(element);if(!this.element)throw(Effect._elementDoesNotExistError);var options=Object.extend({x:0,y:0,mode:'relative'},arguments[1]||{});this.start(options);},setup:function(){this.element.makePositioned();this.originalLeft=parseFloat(this.element.getStyle('left')||'0');this.originalTop=parseFloat(this.element.getStyle('top')||'0');if(this.options.mode=='absolute'){this.options.x=this.options.x-this.originalLeft;this.options.y=this.options.y-this.originalTop;}},update:function(position){this.element.setStyle({left:(this.options.x*position+this.originalLeft).round()+'px',top:(this.options.y*position+this.originalTop).round()+'px'});}});Effect.MoveBy=function(element,toTop,toLeft){return new Effect.Move(element,Object.extend({x:toLeft,y:toTop},arguments[3]||{}));};Effect.Scale=Class.create(Effect.Base,{initialize:function(element,percent){this.element=$(element);if(!this.element)throw(Effect._elementDoesNotExistError);var options=Object.extend({scaleX:true,scaleY:true,scaleContent:true,scaleFromCenter:false,scaleMode:'box',scaleFrom:100.0,scaleTo:percent},arguments[2]||{});this.start(options);},setup:function(){this.restoreAfterFinish=this.options.restoreAfterFinish||false;this.elementPositioning=this.element.getStyle('position');this.originalStyle={};['top','left','width','height','fontSize'].each(function(k){this.originalStyle[k]=this.element.style[k];}.bind(this));this.originalTop=this.element.offsetTop;this.originalLeft=this.element.offsetLeft;var fontSize=this.element.getStyle('font-size')||'100%';['em','px','%','pt'].each(function(fontSizeType){if(fontSize.indexOf(fontSizeType)>0){this.fontSize=parseFloat(fontSize);this.fontSizeType=fontSizeType;}}.bind(this));this.factor=(this.options.scaleTo-this.options.scaleFrom)/100;this.dims=null;if(this.options.scaleMode=='box')
this.dims=[this.element.offsetHeight,this.element.offsetWidth];if(/^content/.test(this.options.scaleMode))
this.dims=[this.element.scrollHeight,this.element.scrollWidth];if(!this.dims)
this.dims=[this.options.scaleMode.originalHeight,this.options.scaleMode.originalWidth];},update:function(position){var currentScale=(this.options.scaleFrom/100.0)+(this.factor*position);if(this.options.scaleContent&&this.fontSize)
this.element.setStyle({fontSize:this.fontSize*currentScale+this.fontSizeType});this.setDimensions(this.dims[0]*currentScale,this.dims[1]*currentScale);},finish:function(position){if(this.restoreAfterFinish)this.element.setStyle(this.originalStyle);},setDimensions:function(height,width){var d={};if(this.options.scaleX)d.width=width.round()+'px';if(this.options.scaleY)d.height=height.round()+'px';if(this.options.scaleFromCenter){var topd=(height-this.dims[0])/2;var leftd=(width-this.dims[1])/2;if(this.elementPositioning=='absolute'){if(this.options.scaleY)d.top=this.originalTop-topd+'px';if(this.options.scaleX)d.left=this.originalLeft-leftd+'px';}else{if(this.options.scaleY)d.top=-topd+'px';if(this.options.scaleX)d.left=-leftd+'px';}}
this.element.setStyle(d);}});Effect.Highlight=Class.create(Effect.Base,{initialize:function(element){this.element=$(element);if(!this.element)throw(Effect._elementDoesNotExistError);var options=Object.extend({startcolor:'#ffff99'},arguments[1]||{});this.start(options);},setup:function(){if(this.element.getStyle('display')=='none'){this.cancel();return;}
this.oldStyle={};if(!this.options.keepBackgroundImage){this.oldStyle.backgroundImage=this.element.getStyle('background-image');this.element.setStyle({backgroundImage:'none'});}
if(!this.options.endcolor)
this.options.endcolor=this.element.getStyle('background-color').parseColor('#ffffff');if(!this.options.restorecolor)
this.options.restorecolor=this.element.getStyle('background-color');this._base=$R(0,2).map(function(i){return parseInt(this.options.startcolor.slice(i*2+1,i*2+3),16)}.bind(this));this._delta=$R(0,2).map(function(i){return parseInt(this.options.endcolor.slice(i*2+1,i*2+3),16)-this._base[i]}.bind(this));},update:function(position){this.element.setStyle({backgroundColor:[0,1,2].inject('#',function(m,v,i){return m+((this._base[i]+(this._delta[i]*position)).round().toColorPart());}.bind(this))});},finish:function(){this.element.setStyle(Object.extend(this.oldStyle,{backgroundColor:this.options.restorecolor}));}});Effect.ScrollTo=function(element){var options=arguments[1]||{},scrollOffsets=document.viewport.getScrollOffsets(),elementOffsets=$(element).cumulativeOffset();if(options.offset)elementOffsets[1]+=options.offset;return new Effect.Tween(null,scrollOffsets.top,elementOffsets[1],options,function(p){scrollTo(scrollOffsets.left,p.round());});};Effect.Fade=function(element){element=$(element);var oldOpacity=element.getInlineOpacity();var options=Object.extend({from:element.getOpacity()||1.0,to:0.0,afterFinishInternal:function(effect){if(effect.options.to!=0)return;effect.element.hide().setStyle({opacity:oldOpacity});}},arguments[1]||{});return new Effect.Opacity(element,options);};Effect.Appear=function(element){element=$(element);var options=Object.extend({from:(element.getStyle('display')=='none'?0.0:element.getOpacity()||0.0),to:1.0,afterFinishInternal:function(effect){effect.element.forceRerendering();},beforeSetup:function(effect){effect.element.setOpacity(effect.options.from).show();}},arguments[1]||{});return new Effect.Opacity(element,options);};Effect.Puff=function(element){element=$(element);var oldStyle={opacity:element.getInlineOpacity(),position:element.getStyle('position'),top:element.style.top,left:element.style.left,width:element.style.width,height:element.style.height};return new Effect.Parallel([new Effect.Scale(element,200,{sync:true,scaleFromCenter:true,scaleContent:true,restoreAfterFinish:true}),new Effect.Opacity(element,{sync:true,to:0.0})],Object.extend({duration:1.0,beforeSetupInternal:function(effect){Position.absolutize(effect.effects[0].element);},afterFinishInternal:function(effect){effect.effects[0].element.hide().setStyle(oldStyle);}},arguments[1]||{}));};Effect.BlindUp=function(element){element=$(element);element.makeClipping();return new Effect.Scale(element,0,Object.extend({scaleContent:false,scaleX:false,restoreAfterFinish:true,afterFinishInternal:function(effect){effect.element.hide().undoClipping();}},arguments[1]||{}));};Effect.BlindDown=function(element){element=$(element);var elementDimensions=element.getDimensions();return new Effect.Scale(element,100,Object.extend({scaleContent:false,scaleX:false,scaleFrom:0,scaleMode:{originalHeight:elementDimensions.height,originalWidth:elementDimensions.width},restoreAfterFinish:true,afterSetup:function(effect){effect.element.makeClipping().setStyle({height:'0px'}).show();},afterFinishInternal:function(effect){effect.element.undoClipping();}},arguments[1]||{}));};Effect.SwitchOff=function(element){element=$(element);var oldOpacity=element.getInlineOpacity();return new Effect.Appear(element,Object.extend({duration:0.4,from:0,transition:Effect.Transitions.flicker,afterFinishInternal:function(effect){new Effect.Scale(effect.element,1,{duration:0.3,scaleFromCenter:true,scaleX:false,scaleContent:false,restoreAfterFinish:true,beforeSetup:function(effect){effect.element.makePositioned().makeClipping();},afterFinishInternal:function(effect){effect.element.hide().undoClipping().undoPositioned().setStyle({opacity:oldOpacity});}});}},arguments[1]||{}));};Effect.DropOut=function(element){element=$(element);var oldStyle={top:element.getStyle('top'),left:element.getStyle('left'),opacity:element.getInlineOpacity()};return new Effect.Parallel([new Effect.Move(element,{x:0,y:100,sync:true}),new Effect.Opacity(element,{sync:true,to:0.0})],Object.extend({duration:0.5,beforeSetup:function(effect){effect.effects[0].element.makePositioned();},afterFinishInternal:function(effect){effect.effects[0].element.hide().undoPositioned().setStyle(oldStyle);}},arguments[1]||{}));};Effect.Shake=function(element){element=$(element);var options=Object.extend({distance:20,duration:0.5},arguments[1]||{});var distance=parseFloat(options.distance);var split=parseFloat(options.duration)/10.0;var oldStyle={top:element.getStyle('top'),left:element.getStyle('left')};return new Effect.Move(element,{x:distance,y:0,duration:split,afterFinishInternal:function(effect){new Effect.Move(effect.element,{x:-distance*2,y:0,duration:split*2,afterFinishInternal:function(effect){new Effect.Move(effect.element,{x:distance*2,y:0,duration:split*2,afterFinishInternal:function(effect){new Effect.Move(effect.element,{x:-distance*2,y:0,duration:split*2,afterFinishInternal:function(effect){new Effect.Move(effect.element,{x:distance*2,y:0,duration:split*2,afterFinishInternal:function(effect){new Effect.Move(effect.element,{x:-distance,y:0,duration:split,afterFinishInternal:function(effect){effect.element.undoPositioned().setStyle(oldStyle);}});}});}});}});}});}});};Effect.SlideDown=function(element){element=$(element).cleanWhitespace();var oldInnerBottom=element.down().getStyle('bottom');var elementDimensions=element.getDimensions();return new Effect.Scale(element,100,Object.extend({scaleContent:false,scaleX:false,scaleFrom:window.opera?0:1,scaleMode:{originalHeight:elementDimensions.height,originalWidth:elementDimensions.width},restoreAfterFinish:true,afterSetup:function(effect){effect.element.makePositioned();effect.element.down().makePositioned();if(window.opera)effect.element.setStyle({top:''});effect.element.makeClipping().setStyle({height:'0px'}).show();},afterUpdateInternal:function(effect){effect.element.down().setStyle({bottom:(effect.dims[0]-effect.element.clientHeight)+'px'});},afterFinishInternal:function(effect){effect.element.undoClipping().undoPositioned();effect.element.down().undoPositioned().setStyle({bottom:oldInnerBottom});}},arguments[1]||{}));};Effect.SlideUp=function(element){element=$(element).cleanWhitespace();var oldInnerBottom=element.down().getStyle('bottom');var elementDimensions=element.getDimensions();return new Effect.Scale(element,window.opera?0:1,Object.extend({scaleContent:false,scaleX:false,scaleMode:'box',scaleFrom:100,scaleMode:{originalHeight:elementDimensions.height,originalWidth:elementDimensions.width},restoreAfterFinish:true,afterSetup:function(effect){effect.element.makePositioned();effect.element.down().makePositioned();if(window.opera)effect.element.setStyle({top:''});effect.element.makeClipping().show();},afterUpdateInternal:function(effect){effect.element.down().setStyle({bottom:(effect.dims[0]-effect.element.clientHeight)+'px'});},afterFinishInternal:function(effect){effect.element.hide().undoClipping().undoPositioned();effect.element.down().undoPositioned().setStyle({bottom:oldInnerBottom});}},arguments[1]||{}));};Effect.Squish=function(element){return new Effect.Scale(element,window.opera?1:0,{restoreAfterFinish:true,beforeSetup:function(effect){effect.element.makeClipping();},afterFinishInternal:function(effect){effect.element.hide().undoClipping();}});};Effect.Grow=function(element){element=$(element);var options=Object.extend({direction:'center',moveTransition:Effect.Transitions.sinoidal,scaleTransition:Effect.Transitions.sinoidal,opacityTransition:Effect.Transitions.full},arguments[1]||{});var oldStyle={top:element.style.top,left:element.style.left,height:element.style.height,width:element.style.width,opacity:element.getInlineOpacity()};var dims=element.getDimensions();var initialMoveX,initialMoveY;var moveX,moveY;switch(options.direction){case'top-left':initialMoveX=initialMoveY=moveX=moveY=0;break;case'top-right':initialMoveX=dims.width;initialMoveY=moveY=0;moveX=-dims.width;break;case'bottom-left':initialMoveX=moveX=0;initialMoveY=dims.height;moveY=-dims.height;break;case'bottom-right':initialMoveX=dims.width;initialMoveY=dims.height;moveX=-dims.width;moveY=-dims.height;break;case'center':initialMoveX=dims.width/2;initialMoveY=dims.height/2;moveX=-dims.width/2;moveY=-dims.height/2;break;}
return new Effect.Move(element,{x:initialMoveX,y:initialMoveY,duration:0.01,beforeSetup:function(effect){effect.element.hide().makeClipping().makePositioned();},afterFinishInternal:function(effect){new Effect.Parallel([new Effect.Opacity(effect.element,{sync:true,to:1.0,from:0.0,transition:options.opacityTransition}),new Effect.Move(effect.element,{x:moveX,y:moveY,sync:true,transition:options.moveTransition}),new Effect.Scale(effect.element,100,{scaleMode:{originalHeight:dims.height,originalWidth:dims.width},sync:true,scaleFrom:window.opera?1:0,transition:options.scaleTransition,restoreAfterFinish:true})],Object.extend({beforeSetup:function(effect){effect.effects[0].element.setStyle({height:'0px'}).show();},afterFinishInternal:function(effect){effect.effects[0].element.undoClipping().undoPositioned().setStyle(oldStyle);}},options));}});};Effect.Shrink=function(element){element=$(element);var options=Object.extend({direction:'center',moveTransition:Effect.Transitions.sinoidal,scaleTransition:Effect.Transitions.sinoidal,opacityTransition:Effect.Transitions.none},arguments[1]||{});var oldStyle={top:element.style.top,left:element.style.left,height:element.style.height,width:element.style.width,opacity:element.getInlineOpacity()};var dims=element.getDimensions();var moveX,moveY;switch(options.direction){case'top-left':moveX=moveY=0;break;case'top-right':moveX=dims.width;moveY=0;break;case'bottom-left':moveX=0;moveY=dims.height;break;case'bottom-right':moveX=dims.width;moveY=dims.height;break;case'center':moveX=dims.width/2;moveY=dims.height/2;break;}
return new Effect.Parallel([new Effect.Opacity(element,{sync:true,to:0.0,from:1.0,transition:options.opacityTransition}),new Effect.Scale(element,window.opera?1:0,{sync:true,transition:options.scaleTransition,restoreAfterFinish:true}),new Effect.Move(element,{x:moveX,y:moveY,sync:true,transition:options.moveTransition})],Object.extend({beforeStartInternal:function(effect){effect.effects[0].element.makePositioned().makeClipping();},afterFinishInternal:function(effect){effect.effects[0].element.hide().undoClipping().undoPositioned().setStyle(oldStyle);}},options));};Effect.Pulsate=function(element){element=$(element);var options=arguments[1]||{},oldOpacity=element.getInlineOpacity(),transition=options.transition||Effect.Transitions.linear,reverser=function(pos){return 1-transition((-Math.cos((pos*(options.pulses||5)*2)*Math.PI)/2)+.5);};return new Effect.Opacity(element,Object.extend(Object.extend({duration:2.0,from:0,afterFinishInternal:function(effect){effect.element.setStyle({opacity:oldOpacity});}},options),{transition:reverser}));};Effect.Fold=function(element){element=$(element);var oldStyle={top:element.style.top,left:element.style.left,width:element.style.width,height:element.style.height};element.makeClipping();return new Effect.Scale(element,5,Object.extend({scaleContent:false,scaleX:false,afterFinishInternal:function(effect){new Effect.Scale(element,1,{scaleContent:false,scaleY:false,afterFinishInternal:function(effect){effect.element.hide().undoClipping().setStyle(oldStyle);}});}},arguments[1]||{}));};Effect.Morph=Class.create(Effect.Base,{initialize:function(element){this.element=$(element);if(!this.element)throw(Effect._elementDoesNotExistError);var options=Object.extend({style:{}},arguments[1]||{});if(!Object.isString(options.style))this.style=$H(options.style);else{if(options.style.include(':'))
this.style=options.style.parseStyle();else{this.element.addClassName(options.style);this.style=$H(this.element.getStyles());this.element.removeClassName(options.style);var css=this.element.getStyles();this.style=this.style.reject(function(style){return style.value==css[style.key];});options.afterFinishInternal=function(effect){effect.element.addClassName(effect.options.style);effect.transforms.each(function(transform){effect.element.style[transform.style]='';});};}}
this.start(options);},setup:function(){function parseColor(color){if(!color||['rgba(0, 0, 0, 0)','transparent'].include(color))color='#ffffff';color=color.parseColor();return $R(0,2).map(function(i){return parseInt(color.slice(i*2+1,i*2+3),16);});}
this.transforms=this.style.map(function(pair){var property=pair[0],value=pair[1],unit=null;if(value.parseColor('#zzzzzz')!='#zzzzzz'){value=value.parseColor();unit='color';}else if(property=='opacity'){value=parseFloat(value);if(Prototype.Browser.IE&&(!this.element.currentStyle.hasLayout))
this.element.setStyle({zoom:1});}else if(Element.CSS_LENGTH.test(value)){var components=value.match(/^([\+\-]?[0-9\.]+)(.*)$/);value=parseFloat(components[1]);unit=(components.length==3)?components[2]:null;}
var originalValue=this.element.getStyle(property);return{style:property.camelize(),originalValue:unit=='color'?parseColor(originalValue):parseFloat(originalValue||0),targetValue:unit=='color'?parseColor(value):value,unit:unit};}.bind(this)).reject(function(transform){return((transform.originalValue==transform.targetValue)||(transform.unit!='color'&&(isNaN(transform.originalValue)||isNaN(transform.targetValue))));});},update:function(position){var style={},transform,i=this.transforms.length;while(i--)
style[(transform=this.transforms[i]).style]=transform.unit=='color'?'#'+
(Math.round(transform.originalValue[0]+
(transform.targetValue[0]-transform.originalValue[0])*position)).toColorPart()+
(Math.round(transform.originalValue[1]+
(transform.targetValue[1]-transform.originalValue[1])*position)).toColorPart()+
(Math.round(transform.originalValue[2]+
(transform.targetValue[2]-transform.originalValue[2])*position)).toColorPart():(transform.originalValue+
(transform.targetValue-transform.originalValue)*position).toFixed(3)+
(transform.unit===null?'':transform.unit);this.element.setStyle(style,true);}});Effect.Transform=Class.create({initialize:function(tracks){this.tracks=[];this.options=arguments[1]||{};this.addTracks(tracks);},addTracks:function(tracks){tracks.each(function(track){track=$H(track);var data=track.values().first();this.tracks.push($H({ids:track.keys().first(),effect:Effect.Morph,options:{style:data}}));}.bind(this));return this;},play:function(){return new Effect.Parallel(this.tracks.map(function(track){var ids=track.get('ids'),effect=track.get('effect'),options=track.get('options');var elements=[$(ids)||$$(ids)].flatten();return elements.map(function(e){return new effect(e,Object.extend({sync:true},options))});}).flatten(),this.options);}});Element.CSS_PROPERTIES=$w('backgroundColor backgroundPosition borderBottomColor borderBottomStyle '+'borderBottomWidth borderLeftColor borderLeftStyle borderLeftWidth '+'borderRightColor borderRightStyle borderRightWidth borderSpacing '+'borderTopColor borderTopStyle borderTopWidth bottom clip color '+'fontSize fontWeight height left letterSpacing lineHeight '+'marginBottom marginLeft marginRight marginTop markerOffset maxHeight '+'maxWidth minHeight minWidth opacity outlineColor outlineOffset '+'outlineWidth paddingBottom paddingLeft paddingRight paddingTop '+'right textIndent top width wordSpacing zIndex');Element.CSS_LENGTH=/^(([\+\-]?[0-9\.]+)(em|ex|px|in|cm|mm|pt|pc|\%))|0$/;String.__parseStyleElement=document.createElement('div');String.prototype.parseStyle=function(){var style,styleRules=$H();if(Prototype.Browser.WebKit)
style=new Element('div',{style:this}).style;else{String.__parseStyleElement.innerHTML='<div style="'+this+'"></div>';style=String.__parseStyleElement.childNodes[0].style;}
Element.CSS_PROPERTIES.each(function(property){if(style[property])styleRules.set(property,style[property]);});if(Prototype.Browser.IE&&this.include('opacity'))
styleRules.set('opacity',this.match(/opacity:\s*((?:0|1)?(?:\.\d*)?)/)[1]);return styleRules;};if(document.defaultView&&document.defaultView.getComputedStyle){Element.getStyles=function(element){var css=document.defaultView.getComputedStyle($(element),null);return Element.CSS_PROPERTIES.inject({},function(styles,property){styles[property]=css[property];return styles;});};}else{Element.getStyles=function(element){element=$(element);var css=element.currentStyle,styles;styles=Element.CSS_PROPERTIES.inject({},function(results,property){results[property]=css[property];return results;});if(!styles.opacity)styles.opacity=element.getOpacity();return styles;};}
Effect.Methods={morph:function(element,style){element=$(element);new Effect.Morph(element,Object.extend({style:style},arguments[2]||{}));return element;},visualEffect:function(element,effect,options){element=$(element);var s=effect.dasherize().camelize(),klass=s.charAt(0).toUpperCase()+s.substring(1);new Effect[klass](element,options);return element;},highlight:function(element,options){element=$(element);new Effect.Highlight(element,options);return element;}};$w('fade appear grow shrink fold blindUp blindDown slideUp slideDown '+'pulsate shake puff squish switchOff dropOut').each(function(effect){Effect.Methods[effect]=function(element,options){element=$(element);Effect[effect.charAt(0).toUpperCase()+effect.substring(1)](element,options);return element;};});$w('getInlineOpacity forceRerendering setContentZoom collectTextNodes collectTextNodesIgnoreClass getStyles').each(function(f){Effect.Methods[f]=Element[f];});Element.addMethods(Effect.Methods);

var Builder={NODEMAP:{AREA:'map',CAPTION:'table',COL:'table',COLGROUP:'table',LEGEND:'fieldset',OPTGROUP:'select',OPTION:'select',PARAM:'object',TBODY:'table',TD:'table',TFOOT:'table',TH:'table',THEAD:'table',TR:'table'},node:function(elementName){elementName=elementName.toUpperCase();var parentTag=this.NODEMAP[elementName]||'div';var parentElement=document.createElement(parentTag);try{parentElement.innerHTML="<"+elementName+"></"+elementName+">";}catch(e){}
var element=parentElement.firstChild||null;if(element&&(element.tagName.toUpperCase()!=elementName))
element=element.getElementsByTagName(elementName)[0];if(!element)element=document.createElement(elementName);if(!element)return;if(arguments[1])
if(this._isStringOrNumber(arguments[1])||(arguments[1]instanceof Array)||arguments[1].tagName){this._children(element,arguments[1]);}else{var attrs=this._attributes(arguments[1]);if(attrs.length){try{parentElement.innerHTML="<"+elementName+" "+
attrs+"></"+elementName+">";}catch(e){}
element=parentElement.firstChild||null;if(!element){element=document.createElement(elementName);for(attr in arguments[1])
element[attr=='class'?'className':attr]=arguments[1][attr];}
if(element.tagName.toUpperCase()!=elementName)
element=parentElement.getElementsByTagName(elementName)[0];}}
if(arguments[2])
this._children(element,arguments[2]);return $(element);},_text:function(text){return document.createTextNode(text);},ATTR_MAP:{'className':'class','htmlFor':'for'},_attributes:function(attributes){var attrs=[];for(attribute in attributes)
attrs.push((attribute in this.ATTR_MAP?this.ATTR_MAP[attribute]:attribute)+'="'+attributes[attribute].toString().escapeHTML().gsub(/"/,'&quot;')+'"');return attrs.join(" ");},_children:function(element,children){if(children.tagName){element.appendChild(children);return;}
if(typeof children=='object'){children.flatten().each(function(e){if(typeof e=='object')
element.appendChild(e);else
if(Builder._isStringOrNumber(e))
element.appendChild(Builder._text(e));});}else
if(Builder._isStringOrNumber(children))
element.appendChild(Builder._text(children));},_isStringOrNumber:function(param){return(typeof param=='string'||typeof param=='number');},build:function(html){var element=this.node('div');$(element).update(html.strip());return element.down();},dump:function(scope){if(typeof scope!='object'&&typeof scope!='function')scope=window;var tags=("A ABBR ACRONYM ADDRESS APPLET AREA B BASE BASEFONT BDO BIG BLOCKQUOTE BODY "+"BR BUTTON CAPTION CENTER CITE CODE COL COLGROUP DD DEL DFN DIR DIV DL DT EM FIELDSET "+"FONT FORM FRAME FRAMESET H1 H2 H3 H4 H5 H6 HEAD HR HTML I IFRAME IMG INPUT INS ISINDEX "+"KBD LABEL LEGEND LI LINK MAP MENU META NOFRAMES NOSCRIPT OBJECT OL OPTGROUP OPTION P "+"PARAM PRE Q S SAMP SCRIPT SELECT SMALL SPAN STRIKE STRONG STYLE SUB SUP TABLE TBODY TD "+"TEXTAREA TFOOT TH THEAD TITLE TR TT U UL VAR").split(/\s+/);tags.each(function(tag){scope[tag]=function(){return Builder.node.apply(Builder,[tag].concat($A(arguments)));};});}};

if(Object.isUndefined(Effect))
throw("dragdrop.js requires including script.aculo.us' effects.js library");var Droppables={drops:[],remove:function(element){this.drops=this.drops.reject(function(d){return d.element==$(element)});},add:function(element){element=$(element);var options=Object.extend({greedy:true,hoverclass:null,tree:false},arguments[1]||{});if(options.containment){options._containers=[];var containment=options.containment;if(Object.isArray(containment)){containment.each(function(c){options._containers.push($(c))});}else{options._containers.push($(containment));}}
if(options.accept)options.accept=[options.accept].flatten();Element.makePositioned(element);options.element=element;this.drops.push(options);},findDeepestChild:function(drops){deepest=drops[0];for(i=1;i<drops.length;++i)
if(Element.isParent(drops[i].element,deepest.element))
deepest=drops[i];return deepest;},isContained:function(element,drop){var containmentNode;if(drop.tree){containmentNode=element.treeNode;}else{containmentNode=element.parentNode;}
return drop._containers.detect(function(c){return containmentNode==c});},isAffected:function(point,element,drop){return((drop.element!=element)&&((!drop._containers)||this.isContained(element,drop))&&((!drop.accept)||(Element.classNames(element).detect(function(v){return drop.accept.include(v)})))&&Position.within(drop.element,point[0],point[1]));},deactivate:function(drop){if(drop.hoverclass)
Element.removeClassName(drop.element,drop.hoverclass);this.last_active=null;},activate:function(drop){if(drop.hoverclass)
Element.addClassName(drop.element,drop.hoverclass);this.last_active=drop;},show:function(point,element){if(!this.drops.length)return;var drop,affected=[];this.drops.each(function(drop){if(Droppables.isAffected(point,element,drop))
affected.push(drop);});if(affected.length>0)
drop=Droppables.findDeepestChild(affected);if(this.last_active&&this.last_active!=drop)this.deactivate(this.last_active);if(drop){Position.within(drop.element,point[0],point[1]);if(drop.onHover)
drop.onHover(element,drop.element,Position.overlap(drop.overlap,drop.element));if(drop!=this.last_active)Droppables.activate(drop);}},fire:function(event,element){if(!this.last_active)return;Position.prepare();if(this.isAffected([Event.pointerX(event),Event.pointerY(event)],element,this.last_active))
if(this.last_active.onDrop){this.last_active.onDrop(element,this.last_active.element,event);return true;}},reset:function(){if(this.last_active)
this.deactivate(this.last_active);}};var Draggables={drags:[],observers:[],register:function(draggable){if(this.drags.length==0){this.eventMouseUp=this.endDrag.bindAsEventListener(this);this.eventMouseMove=this.updateDrag.bindAsEventListener(this);this.eventKeypress=this.keyPress.bindAsEventListener(this);Event.observe(document,"mouseup",this.eventMouseUp);Event.observe(document,"mousemove",this.eventMouseMove);Event.observe(document,"keypress",this.eventKeypress);}
this.drags.push(draggable);},unregister:function(draggable){this.drags=this.drags.reject(function(d){return d==draggable});if(this.drags.length==0){Event.stopObserving(document,"mouseup",this.eventMouseUp);Event.stopObserving(document,"mousemove",this.eventMouseMove);Event.stopObserving(document,"keypress",this.eventKeypress);}},activate:function(draggable){if(draggable.options.delay){this._timeout=setTimeout(function(){Draggables._timeout=null;window.focus();Draggables.activeDraggable=draggable;}.bind(this),draggable.options.delay);}else{window.focus();this.activeDraggable=draggable;}},deactivate:function(){this.activeDraggable=null;},updateDrag:function(event){if(!this.activeDraggable)return;var pointer=[Event.pointerX(event),Event.pointerY(event)];if(this._lastPointer&&(this._lastPointer.inspect()==pointer.inspect()))return;this._lastPointer=pointer;this.activeDraggable.updateDrag(event,pointer);},endDrag:function(event){if(this._timeout){clearTimeout(this._timeout);this._timeout=null;}
if(!this.activeDraggable)return;this._lastPointer=null;this.activeDraggable.endDrag(event);this.activeDraggable=null;},keyPress:function(event){if(this.activeDraggable)
this.activeDraggable.keyPress(event);},addObserver:function(observer){this.observers.push(observer);this._cacheObserverCallbacks();},removeObserver:function(element){this.observers=this.observers.reject(function(o){return o.element==element});this._cacheObserverCallbacks();},notify:function(eventName,draggable,event){if(this[eventName+'Count']>0)
this.observers.each(function(o){if(o[eventName])o[eventName](eventName,draggable,event);});if(draggable.options[eventName])draggable.options[eventName](draggable,event);},_cacheObserverCallbacks:function(){['onStart','onEnd','onDrag'].each(function(eventName){Draggables[eventName+'Count']=Draggables.observers.select(function(o){return o[eventName];}).length;});}};var Draggable=Class.create({initialize:function(element){var defaults={handle:false,reverteffect:function(element,top_offset,left_offset){var dur=Math.sqrt(Math.abs(top_offset^2)+Math.abs(left_offset^2))*0.02;new Effect.Move(element,{x:-left_offset,y:-top_offset,duration:dur,queue:{scope:'_draggable',position:'end'}});},endeffect:function(element){var toOpacity=Object.isNumber(element._opacity)?element._opacity:1.0;new Effect.Opacity(element,{duration:0.2,from:0.7,to:toOpacity,queue:{scope:'_draggable',position:'end'},afterFinish:function(){Draggable._dragging[element]=false;}});},zindex:1000,revert:false,quiet:false,scroll:false,scrollSensitivity:20,scrollSpeed:15,snap:false,delay:0};if(!arguments[1]||Object.isUndefined(arguments[1].endeffect))
Object.extend(defaults,{starteffect:function(element){element._opacity=Element.getOpacity(element);Draggable._dragging[element]=true;new Effect.Opacity(element,{duration:0.2,from:element._opacity,to:0.7});}});var options=Object.extend(defaults,arguments[1]||{});this.element=$(element);if(options.handle&&Object.isString(options.handle))
this.handle=this.element.down('.'+options.handle,0);if(!this.handle)this.handle=$(options.handle);if(!this.handle)this.handle=this.element;if(options.scroll&&!options.scroll.scrollTo&&!options.scroll.outerHTML){options.scroll=$(options.scroll);}
if(options.scroll)
{this._isScrollChild=Element.childOf(this.element,options.scroll);}
Element.makePositioned(this.element);this.options=options;this.dragging=false;this.eventMouseDown=this.initDrag.bindAsEventListener(this);Event.observe(this.handle,"mousedown",this.eventMouseDown);Draggables.register(this);},destroy:function(){Event.stopObserving(this.handle,"mousedown",this.eventMouseDown);Draggables.unregister(this);},currentDelta:function(){return([parseInt(Element.getStyle(this.element,'left')||'0'),parseInt(Element.getStyle(this.element,'top')||'0')]);},initDrag:function(event){if(!Object.isUndefined(Draggable._dragging[this.element])&&Draggable._dragging[this.element])return;if(Event.isLeftClick(event)){var src=Event.element(event);if((tag_name=src.tagName.toUpperCase())&&(tag_name=='INPUT'||tag_name=='SELECT'||tag_name=='OPTION'||tag_name=='BUTTON'||tag_name=='TEXTAREA'))return;var pointer=[Event.pointerX(event),Event.pointerY(event)];var pos=this.element.cumulativeOffset();this.offset=[0,1].map(function(i){return(pointer[i]-pos[i])});Draggables.activate(this);Event.stop(event);}},startDrag:function(event){this.dragging=true;if(!this.delta)
this.delta=this.currentDelta();if(this.options.zindex){this.originalZ=parseInt(Element.getStyle(this.element,'z-index')||0);this.element.style.zIndex=this.options.zindex;}
if(this.options.ghosting){this._clone=this.element.cloneNode(true);this._originallyAbsolute=(this.element.getStyle('position')=='absolute');if(!this._originallyAbsolute)
Position.absolutize(this.element);this.element.parentNode.insertBefore(this._clone,this.element);}
if(this.options.scroll){if(this.options.scroll==window){var where=this._getWindowScroll(this.options.scroll);this.originalScrollLeft=where.left;this.originalScrollTop=where.top;}else{this.originalScrollLeft=this.options.scroll.scrollLeft;this.originalScrollTop=this.options.scroll.scrollTop;}}
Draggables.notify('onStart',this,event);if(this.options.starteffect)this.options.starteffect(this.element);},updateDrag:function(event,pointer){if(!this.dragging)this.startDrag(event);if(!this.options.quiet){Position.prepare();Droppables.show(pointer,this.element);}
Draggables.notify('onDrag',this,event);this.draw(pointer);if(this.options.change)this.options.change(this);if(this.options.scroll){this.stopScrolling();var p;if(this.options.scroll==window){with(this._getWindowScroll(this.options.scroll)){p=[left,top,left+width,top+height];}}else{p=Position.page(this.options.scroll).toArray();p[0]+=this.options.scroll.scrollLeft+Position.deltaX;p[1]+=this.options.scroll.scrollTop+Position.deltaY;p.push(p[0]+this.options.scroll.offsetWidth);p.push(p[1]+this.options.scroll.offsetHeight);}
var speed=[0,0];if(pointer[0]<(p[0]+this.options.scrollSensitivity))speed[0]=pointer[0]-(p[0]+this.options.scrollSensitivity);if(pointer[1]<(p[1]+this.options.scrollSensitivity))speed[1]=pointer[1]-(p[1]+this.options.scrollSensitivity);if(pointer[0]>(p[2]-this.options.scrollSensitivity))speed[0]=pointer[0]-(p[2]-this.options.scrollSensitivity);if(pointer[1]>(p[3]-this.options.scrollSensitivity))speed[1]=pointer[1]-(p[3]-this.options.scrollSensitivity);this.startScrolling(speed);}
if(Prototype.Browser.WebKit)window.scrollBy(0,0);Event.stop(event);},finishDrag:function(event,success){this.dragging=false;if(this.options.quiet){Position.prepare();var pointer=[Event.pointerX(event),Event.pointerY(event)];Droppables.show(pointer,this.element);}
if(this.options.ghosting){if(!this._originallyAbsolute)
Position.relativize(this.element);delete this._originallyAbsolute;Element.remove(this._clone);this._clone=null;}
var dropped=false;if(success){dropped=Droppables.fire(event,this.element);if(!dropped)dropped=false;}
if(dropped&&this.options.onDropped)this.options.onDropped(this.element);Draggables.notify('onEnd',this,event);var revert=this.options.revert;if(revert&&Object.isFunction(revert))revert=revert(this.element);var d=this.currentDelta();if(revert&&this.options.reverteffect){if(dropped==0||revert!='failure')
this.options.reverteffect(this.element,d[1]-this.delta[1],d[0]-this.delta[0]);}else{this.delta=d;}
if(this.options.zindex)
this.element.style.zIndex=this.originalZ;if(this.options.endeffect)
this.options.endeffect(this.element);Draggables.deactivate(this);Droppables.reset();},keyPress:function(event){if(event.keyCode!=Event.KEY_ESC)return;this.finishDrag(event,false);Event.stop(event);},endDrag:function(event){if(!this.dragging)return;this.stopScrolling();this.finishDrag(event,true);Event.stop(event);},draw:function(point){var pos=this.element.cumulativeOffset();if(this.options.ghosting){var r=Position.realOffset(this.element);pos[0]+=r[0]-Position.deltaX;pos[1]+=r[1]-Position.deltaY;}
var d=this.currentDelta();pos[0]-=d[0];pos[1]-=d[1];if(this.options.scroll&&(this.options.scroll!=window&&this._isScrollChild)){pos[0]-=this.options.scroll.scrollLeft-this.originalScrollLeft;pos[1]-=this.options.scroll.scrollTop-this.originalScrollTop;}
var p=[0,1].map(function(i){return(point[i]-pos[i]-this.offset[i]);}.bind(this));if(this.options.snap){if(Object.isFunction(this.options.snap)){p=this.options.snap(p[0],p[1],this);}else{if(Object.isArray(this.options.snap)){p=p.map(function(v,i){return(v/this.options.snap[i]).round()*this.options.snap[i]}.bind(this));}else{p=p.map(function(v){return(v/this.options.snap).round()*this.options.snap}.bind(this));}}}
var style=this.element.style;if((!this.options.constraint)||(this.options.constraint=='horizontal'))
style.left=p[0]+"px";if((!this.options.constraint)||(this.options.constraint=='vertical'))
style.top=p[1]+"px";if(style.visibility=="hidden")style.visibility="";},stopScrolling:function(){if(this.scrollInterval){clearInterval(this.scrollInterval);this.scrollInterval=null;Draggables._lastScrollPointer=null;}},startScrolling:function(speed){if(!(speed[0]||speed[1]))return;this.scrollSpeed=[speed[0]*this.options.scrollSpeed,speed[1]*this.options.scrollSpeed];this.lastScrolled=new Date();this.scrollInterval=setInterval(this.scroll.bind(this),10);},scroll:function(){var current=new Date();var delta=current-this.lastScrolled;this.lastScrolled=current;if(this.options.scroll==window){with(this._getWindowScroll(this.options.scroll)){if(this.scrollSpeed[0]||this.scrollSpeed[1]){var d=delta/1000;this.options.scroll.scrollTo(left+d*this.scrollSpeed[0],top+d*this.scrollSpeed[1]);}}}else{this.options.scroll.scrollLeft+=this.scrollSpeed[0]*delta/1000;this.options.scroll.scrollTop+=this.scrollSpeed[1]*delta/1000;}
Position.prepare();Droppables.show(Draggables._lastPointer,this.element);Draggables.notify('onDrag',this);if(this._isScrollChild){Draggables._lastScrollPointer=Draggables._lastScrollPointer||$A(Draggables._lastPointer);Draggables._lastScrollPointer[0]+=this.scrollSpeed[0]*delta/1000;Draggables._lastScrollPointer[1]+=this.scrollSpeed[1]*delta/1000;if(Draggables._lastScrollPointer[0]<0)
Draggables._lastScrollPointer[0]=0;if(Draggables._lastScrollPointer[1]<0)
Draggables._lastScrollPointer[1]=0;this.draw(Draggables._lastScrollPointer);}
if(this.options.change)this.options.change(this);},_getWindowScroll:function(w){var T,L,W,H;with(w.document){if(w.document.documentElement&&documentElement.scrollTop){T=documentElement.scrollTop;L=documentElement.scrollLeft;}else if(w.document.body){T=body.scrollTop;L=body.scrollLeft;}
if(w.innerWidth){W=w.innerWidth;H=w.innerHeight;}else if(w.document.documentElement&&documentElement.clientWidth){W=documentElement.clientWidth;H=documentElement.clientHeight;}else{W=body.offsetWidth;H=body.offsetHeight;}}
return{top:T,left:L,width:W,height:H};}});Draggable._dragging={};var SortableObserver=Class.create({initialize:function(element,observer){this.element=$(element);this.observer=observer;this.lastValue=Sortable.serialize(this.element);},onStart:function(){this.lastValue=Sortable.serialize(this.element);},onEnd:function(){Sortable.unmark();if(this.lastValue!=Sortable.serialize(this.element))
this.observer(this.element);}});var Sortable={SERIALIZE_RULE:/^[^_\-](?:[A-Za-z0-9\-\_]*)[_](.*)$/,sortables:{},_findRootElement:function(element){while(element.tagName.toUpperCase()!="BODY"){if(element.id&&Sortable.sortables[element.id])return element;element=element.parentNode;}},options:function(element){element=Sortable._findRootElement($(element));if(!element)return;return Sortable.sortables[element.id];},destroy:function(element){element=$(element);var s=Sortable.sortables[element.id];if(s){Draggables.removeObserver(s.element);s.droppables.each(function(d){Droppables.remove(d)});s.draggables.invoke('destroy');delete Sortable.sortables[s.element.id];}},create:function(element){element=$(element);var options=Object.extend({element:element,tag:'li',dropOnEmpty:false,tree:false,treeTag:'ul',overlap:'vertical',constraint:'vertical',containment:element,handle:false,only:false,delay:0,hoverclass:null,ghosting:false,quiet:false,scroll:false,scrollSensitivity:20,scrollSpeed:15,format:this.SERIALIZE_RULE,elements:false,handles:false,onChange:Prototype.emptyFunction,onUpdate:Prototype.emptyFunction},arguments[1]||{});this.destroy(element);var options_for_draggable={revert:true,quiet:options.quiet,scroll:options.scroll,scrollSpeed:options.scrollSpeed,scrollSensitivity:options.scrollSensitivity,delay:options.delay,ghosting:options.ghosting,constraint:options.constraint,handle:options.handle};if(options.starteffect)
options_for_draggable.starteffect=options.starteffect;if(options.reverteffect)
options_for_draggable.reverteffect=options.reverteffect;else
if(options.ghosting)options_for_draggable.reverteffect=function(element){element.style.top=0;element.style.left=0;};if(options.endeffect)
options_for_draggable.endeffect=options.endeffect;if(options.zindex)
options_for_draggable.zindex=options.zindex;var options_for_droppable={overlap:options.overlap,containment:options.containment,tree:options.tree,hoverclass:options.hoverclass,onHover:Sortable.onHover};var options_for_tree={onHover:Sortable.onEmptyHover,overlap:options.overlap,containment:options.containment,hoverclass:options.hoverclass};Element.cleanWhitespace(element);options.draggables=[];options.droppables=[];if(options.dropOnEmpty||options.tree){Droppables.add(element,options_for_tree);options.droppables.push(element);}
(options.elements||this.findElements(element,options)||[]).each(function(e,i){var handle=options.handles?$(options.handles[i]):(options.handle?$(e).select('.'+options.handle)[0]:e);options.draggables.push(new Draggable(e,Object.extend(options_for_draggable,{handle:handle})));Droppables.add(e,options_for_droppable);if(options.tree)e.treeNode=element;options.droppables.push(e);});if(options.tree){(Sortable.findTreeElements(element,options)||[]).each(function(e){Droppables.add(e,options_for_tree);e.treeNode=element;options.droppables.push(e);});}
this.sortables[element.identify()]=options;Draggables.addObserver(new SortableObserver(element,options.onUpdate));},findElements:function(element,options){return Element.findChildren(element,options.only,options.tree?true:false,options.tag);},findTreeElements:function(element,options){return Element.findChildren(element,options.only,options.tree?true:false,options.treeTag);},onHover:function(element,dropon,overlap){if(Element.isParent(dropon,element))return;if(overlap>.33&&overlap<.66&&Sortable.options(dropon).tree){return;}else if(overlap>0.5){Sortable.mark(dropon,'before');if(dropon.previousSibling!=element){var oldParentNode=element.parentNode;element.style.visibility="hidden";dropon.parentNode.insertBefore(element,dropon);if(dropon.parentNode!=oldParentNode)
Sortable.options(oldParentNode).onChange(element);Sortable.options(dropon.parentNode).onChange(element);}}else{Sortable.mark(dropon,'after');var nextElement=dropon.nextSibling||null;if(nextElement!=element){var oldParentNode=element.parentNode;element.style.visibility="hidden";dropon.parentNode.insertBefore(element,nextElement);if(dropon.parentNode!=oldParentNode)
Sortable.options(oldParentNode).onChange(element);Sortable.options(dropon.parentNode).onChange(element);}}},onEmptyHover:function(element,dropon,overlap){var oldParentNode=element.parentNode;var droponOptions=Sortable.options(dropon);if(!Element.isParent(dropon,element)){var index;var children=Sortable.findElements(dropon,{tag:droponOptions.tag,only:droponOptions.only});var child=null;if(children){var offset=Element.offsetSize(dropon,droponOptions.overlap)*(1.0-overlap);for(index=0;index<children.length;index+=1){if(offset-Element.offsetSize(children[index],droponOptions.overlap)>=0){offset-=Element.offsetSize(children[index],droponOptions.overlap);}else if(offset-(Element.offsetSize(children[index],droponOptions.overlap)/2)>=0){child=index+1<children.length?children[index+1]:null;break;}else{child=children[index];break;}}}
if(element!==child)
{dropon.insertBefore(element,child);}
Sortable.options(oldParentNode).onChange(element);droponOptions.onChange(element);}},unmark:function(){if(Sortable._marker)Sortable._marker.hide();},mark:function(dropon,position){var sortable=Sortable.options(dropon.parentNode);if(sortable&&!sortable.ghosting)return;if(!Sortable._marker){Sortable._marker=($('dropmarker')||Element.extend(document.createElement('DIV'))).hide().addClassName('dropmarker').setStyle({position:'absolute'});document.getElementsByTagName("body").item(0).appendChild(Sortable._marker);}
var offsets=dropon.cumulativeOffset();Sortable._marker.setStyle({left:offsets[0]+'px',top:offsets[1]+'px'});if(position=='after')
if(sortable.overlap=='horizontal')
Sortable._marker.setStyle({left:(offsets[0]+dropon.clientWidth)+'px'});else
Sortable._marker.setStyle({top:(offsets[1]+dropon.clientHeight)+'px'});Sortable._marker.show();},_tree:function(element,options,parent){var children=Sortable.findElements(element,options)||[];for(var i=0;i<children.length;++i){var match=children[i].id.match(options.format);if(!match)continue;var child={id:encodeURIComponent(match?match[1]:null),element:element,parent:parent,children:[],position:parent.children.length,container:$(children[i]).down(options.treeTag)};if(child.container)
this._tree(child.container,options,child);parent.children.push(child);}
return parent;},tree:function(element){element=$(element);var sortableOptions=this.options(element);var options=Object.extend({tag:sortableOptions.tag,treeTag:sortableOptions.treeTag,only:sortableOptions.only,name:element.id,format:sortableOptions.format},arguments[1]||{});var root={id:null,parent:null,children:[],container:element,position:0};return Sortable._tree(element,options,root);},_constructIndex:function(node){var index='';do{if(node.id)index='['+node.position+']'+index;}while((node=node.parent)!=null);return index;},sequence:function(element){element=$(element);var options=Object.extend(this.options(element),arguments[1]||{});return $(this.findElements(element,options)||[]).map(function(item){return item.id.match(options.format)?item.id.match(options.format)[1]:'';});},setSequence:function(element,new_sequence){element=$(element);var options=Object.extend(this.options(element),arguments[2]||{});var nodeMap={};this.findElements(element,options).each(function(n){if(n.id.match(options.format))
nodeMap[n.id.match(options.format)[1]]=[n,n.parentNode];n.parentNode.removeChild(n);});new_sequence.each(function(ident){var n=nodeMap[ident];if(n){n[1].appendChild(n[0]);delete nodeMap[ident];}});},serialize:function(element){element=$(element);var options=Object.extend(Sortable.options(element),arguments[1]||{});var name=encodeURIComponent((arguments[1]&&arguments[1].name)?arguments[1].name:element.id);if(options.tree){return Sortable.tree(element,arguments[1]).children.map(function(item){return[name+Sortable._constructIndex(item)+"[id]="+
encodeURIComponent(item.id)].concat(item.children.map(arguments.callee));}).flatten().join('&');}else{return Sortable.sequence(element,arguments[1]).map(function(item){return name+"[]="+encodeURIComponent(item);}).join('&');}}};Element.isParent=function(child,element){if(!child.parentNode||child==element)return false;if(child.parentNode==element)return true;return Element.isParent(child.parentNode,element);};Element.findChildren=function(element,only,recursive,tagName){if(!element.hasChildNodes())return null;tagName=tagName.toUpperCase();if(only)only=[only].flatten();var elements=[];$A(element.childNodes).each(function(e){if(e.tagName&&e.tagName.toUpperCase()==tagName&&(!only||(Element.classNames(e).detect(function(v){return only.include(v)}))))
elements.push(e);if(recursive){var grandchildren=Element.findChildren(e,only,recursive,tagName);if(grandchildren)elements.push(grandchildren);}});return(elements.length>0?elements.flatten():[]);};Element.offsetSize=function(element,type){return element['offset'+((type=='vertical'||type=='height')?'Height':'Width')];};

if(typeof Effect=='undefined')
throw("controls.js requires including script.aculo.us' effects.js library");var Autocompleter={};Autocompleter.Base=Class.create({baseInitialize:function(element,update,options){element=$(element);this.element=element;this.update=$(update);this.hasFocus=false;this.changed=false;this.active=false;this.index=0;this.entryCount=0;this.oldElementValue=this.element.value;if(this.setOptions)
this.setOptions(options);else
this.options=options||{};this.options.paramName=this.options.paramName||this.element.name;this.options.tokens=this.options.tokens||[];this.options.frequency=this.options.frequency||0.4;this.options.minChars=this.options.minChars||1;this.options.onShow=this.options.onShow||function(element,update){if(!update.style.position||update.style.position=='absolute'){update.style.position='absolute';Position.clone(element,update,{setHeight:false,offsetTop:element.offsetHeight});}
Effect.Appear(update,{duration:0.15});};this.options.onHide=this.options.onHide||function(element,update){new Effect.Fade(update,{duration:0.15})};if(typeof(this.options.tokens)=='string')
this.options.tokens=new Array(this.options.tokens);if(!this.options.tokens.include('\n'))
this.options.tokens.push('\n');this.observer=null;this.element.setAttribute('autocomplete','off');Element.hide(this.update);Event.observe(this.element,'blur',this.onBlur.bindAsEventListener(this));Event.observe(this.element,'keydown',this.onKeyPress.bindAsEventListener(this));},show:function(){if(Element.getStyle(this.update,'display')=='none')this.options.onShow(this.element,this.update);if(!this.iefix&&(Prototype.Browser.IE)&&(Element.getStyle(this.update,'position')=='absolute')){new Insertion.After(this.update,'<iframe id="'+this.update.id+'_iefix" '+'style="display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" '+'src="javascript:false;" frameborder="0" scrolling="no"></iframe>');this.iefix=$(this.update.id+'_iefix');}
if(this.iefix)setTimeout(this.fixIEOverlapping.bind(this),50);},fixIEOverlapping:function(){Position.clone(this.update,this.iefix,{setTop:(!this.update.style.height)});this.iefix.style.zIndex=1;this.update.style.zIndex=2;Element.show(this.iefix);},hide:function(){this.stopIndicator();if(Element.getStyle(this.update,'display')!='none')this.options.onHide(this.element,this.update);if(this.iefix)Element.hide(this.iefix);},startIndicator:function(){if(this.options.indicator)Element.show(this.options.indicator);},stopIndicator:function(){if(this.options.indicator)Element.hide(this.options.indicator);},onKeyPress:function(event){if(this.active)
switch(event.keyCode){case Event.KEY_TAB:case Event.KEY_RETURN:this.selectEntry();Event.stop(event);case Event.KEY_ESC:this.hide();this.active=false;Event.stop(event);return;case Event.KEY_LEFT:case Event.KEY_RIGHT:return;case Event.KEY_UP:this.markPrevious();this.render();Event.stop(event);return;case Event.KEY_DOWN:this.markNext();this.render();Event.stop(event);return;}
else
if(event.keyCode==Event.KEY_TAB||event.keyCode==Event.KEY_RETURN||(Prototype.Browser.WebKit>0&&event.keyCode==0))return;this.changed=true;this.hasFocus=true;if(this.observer)clearTimeout(this.observer);this.observer=setTimeout(this.onObserverEvent.bind(this),this.options.frequency*1000);},activate:function(){this.changed=false;this.hasFocus=true;this.getUpdatedChoices();},onHover:function(event){var element=Event.findElement(event,'LI');if(this.index!=element.autocompleteIndex)
{this.index=element.autocompleteIndex;this.render();}
Event.stop(event);},onClick:function(event){var element=Event.findElement(event,'LI');this.index=element.autocompleteIndex;this.selectEntry();this.hide();},onBlur:function(event){setTimeout(this.hide.bind(this),250);this.hasFocus=false;this.active=false;},render:function(){if(this.entryCount>0){for(var i=0;i<this.entryCount;i++)
this.index==i?Element.addClassName(this.getEntry(i),"selected"):Element.removeClassName(this.getEntry(i),"selected");if(this.hasFocus){this.show();this.active=true;}}else{this.active=false;this.hide();}},markPrevious:function(){if(this.index>0)this.index--;else this.index=this.entryCount-1;this.getEntry(this.index).scrollIntoView(true);},markNext:function(){if(this.index<this.entryCount-1)this.index++;else this.index=0;this.getEntry(this.index).scrollIntoView(false);},getEntry:function(index){return this.update.firstChild.childNodes[index];},getCurrentEntry:function(){return this.getEntry(this.index);},selectEntry:function(){this.active=false;this.updateElement(this.getCurrentEntry());},updateElement:function(selectedElement){if(this.options.updateElement){this.options.updateElement(selectedElement);return;}
var value='';if(this.options.select){var nodes=$(selectedElement).select('.'+this.options.select)||[];if(nodes.length>0)value=Element.collectTextNodes(nodes[0],this.options.select);}else
value=Element.collectTextNodesIgnoreClass(selectedElement,'informal');var bounds=this.getTokenBounds();if(bounds[0]!=-1){var newValue=this.element.value.substr(0,bounds[0]);var whitespace=this.element.value.substr(bounds[0]).match(/^\s+/);if(whitespace)
newValue+=whitespace[0];this.element.value=newValue+value+this.element.value.substr(bounds[1]);}else{this.element.value=value;}
this.oldElementValue=this.element.value;this.element.focus();if(this.options.afterUpdateElement)
this.options.afterUpdateElement(this.element,selectedElement);},updateChoices:function(choices){if(!this.changed&&this.hasFocus){this.update.innerHTML=choices;Element.cleanWhitespace(this.update);Element.cleanWhitespace(this.update.down());if(this.update.firstChild&&this.update.down().childNodes){this.entryCount=this.update.down().childNodes.length;for(var i=0;i<this.entryCount;i++){var entry=this.getEntry(i);entry.autocompleteIndex=i;this.addObservers(entry);}}else{this.entryCount=0;}
this.stopIndicator();this.index=0;if(this.entryCount==1&&this.options.autoSelect){this.selectEntry();this.hide();}else{this.render();}}},addObservers:function(element){Event.observe(element,"mouseover",this.onHover.bindAsEventListener(this));Event.observe(element,"click",this.onClick.bindAsEventListener(this));},onObserverEvent:function(){this.changed=false;this.tokenBounds=null;if(this.getToken().length>=this.options.minChars){this.getUpdatedChoices();}else{this.active=false;this.hide();}
this.oldElementValue=this.element.value;},getToken:function(){var bounds=this.getTokenBounds();return this.element.value.substring(bounds[0],bounds[1]).strip();},getTokenBounds:function(){if(null!=this.tokenBounds)return this.tokenBounds;var value=this.element.value;if(value.strip().empty())return[-1,0];var diff=arguments.callee.getFirstDifferencePos(value,this.oldElementValue);var offset=(diff==this.oldElementValue.length?1:0);var prevTokenPos=-1,nextTokenPos=value.length;var tp;for(var index=0,l=this.options.tokens.length;index<l;++index){tp=value.lastIndexOf(this.options.tokens[index],diff+offset-1);if(tp>prevTokenPos)prevTokenPos=tp;tp=value.indexOf(this.options.tokens[index],diff+offset);if(-1!=tp&&tp<nextTokenPos)nextTokenPos=tp;}
return(this.tokenBounds=[prevTokenPos+1,nextTokenPos]);}});Autocompleter.Base.prototype.getTokenBounds.getFirstDifferencePos=function(newS,oldS){var boundary=Math.min(newS.length,oldS.length);for(var index=0;index<boundary;++index)
if(newS[index]!=oldS[index])
return index;return boundary;};Ajax.Autocompleter=Class.create(Autocompleter.Base,{initialize:function(element,update,url,options){this.baseInitialize(element,update,options);this.options.asynchronous=true;this.options.onComplete=this.onComplete.bind(this);this.options.defaultParams=this.options.parameters||null;this.url=url;},getUpdatedChoices:function(){this.startIndicator();var entry=encodeURIComponent(this.options.paramName)+'='+
encodeURIComponent(this.getToken());this.options.parameters=this.options.callback?this.options.callback(this.element,entry):entry;if(this.options.defaultParams)
this.options.parameters+='&'+this.options.defaultParams;new Ajax.Request(this.url,this.options);},onComplete:function(request){this.updateChoices(request.responseText);}});Autocompleter.Local=Class.create(Autocompleter.Base,{initialize:function(element,update,array,options){this.baseInitialize(element,update,options);this.options.array=array;},getUpdatedChoices:function(){this.updateChoices(this.options.selector(this));},setOptions:function(options){this.options=Object.extend({choices:10,partialSearch:true,partialChars:2,ignoreCase:true,fullSearch:false,selector:function(instance){var ret=[];var partial=[];var entry=instance.getToken();var count=0;for(var i=0;i<instance.options.array.length&&ret.length<instance.options.choices;i++){var elem=instance.options.array[i];var foundPos=instance.options.ignoreCase?elem.toLowerCase().indexOf(entry.toLowerCase()):elem.indexOf(entry);while(foundPos!=-1){if(foundPos==0&&elem.length!=entry.length){ret.push("<li><strong>"+elem.substr(0,entry.length)+"</strong>"+
elem.substr(entry.length)+"</li>");break;}else if(entry.length>=instance.options.partialChars&&instance.options.partialSearch&&foundPos!=-1){if(instance.options.fullSearch||/\s/.test(elem.substr(foundPos-1,1))){partial.push("<li>"+elem.substr(0,foundPos)+"<strong>"+
elem.substr(foundPos,entry.length)+"</strong>"+elem.substr(foundPos+entry.length)+"</li>");break;}}
foundPos=instance.options.ignoreCase?elem.toLowerCase().indexOf(entry.toLowerCase(),foundPos+1):elem.indexOf(entry,foundPos+1);}}
if(partial.length)
ret=ret.concat(partial.slice(0,instance.options.choices-ret.length));return"<ul>"+ret.join('')+"</ul>";}},options||{});}});Field.scrollFreeActivate=function(field){setTimeout(function(){Field.activate(field);},1);};Ajax.InPlaceEditor=Class.create({initialize:function(element,url,options){this.url=url;this.element=element=$(element);this.prepareOptions();this._controls={};arguments.callee.dealWithDeprecatedOptions(options);Object.extend(this.options,options||{});if(!this.options.formId&&this.element.id){this.options.formId=this.element.id+'-inplaceeditor';if($(this.options.formId))
this.options.formId='';}
if(this.options.externalControl)
this.options.externalControl=$(this.options.externalControl);if(!this.options.externalControl)
this.options.externalControlOnly=false;this._originalBackground=this.element.getStyle('background-color')||'transparent';this.element.title=this.options.clickToEditText;this._boundCancelHandler=this.handleFormCancellation.bind(this);this._boundComplete=(this.options.onComplete||Prototype.emptyFunction).bind(this);this._boundFailureHandler=this.handleAJAXFailure.bind(this);this._boundSubmitHandler=this.handleFormSubmission.bind(this);this._boundWrapperHandler=this.wrapUp.bind(this);this.registerListeners();},checkForEscapeOrReturn:function(e){if(!this._editing||e.ctrlKey||e.altKey||e.shiftKey)return;if(Event.KEY_ESC==e.keyCode)
this.handleFormCancellation(e);else if(Event.KEY_RETURN==e.keyCode)
this.handleFormSubmission(e);},createControl:function(mode,handler,extraClasses){var control=this.options[mode+'Control'];var text=this.options[mode+'Text'];if('button'==control){var btn=document.createElement('input');btn.type='submit';btn.value=text;btn.className='editor_'+mode+'_button';if('cancel'==mode)
btn.onclick=this._boundCancelHandler;this._form.appendChild(btn);this._controls[mode]=btn;}else if('link'==control){var link=document.createElement('a');link.href='#';link.appendChild(document.createTextNode(text));link.onclick='cancel'==mode?this._boundCancelHandler:this._boundSubmitHandler;link.className='editor_'+mode+'_link';if(extraClasses)
link.className+=' '+extraClasses;this._form.appendChild(link);this._controls[mode]=link;}},createEditField:function(){var text=(this.options.loadTextURL?this.options.loadingText:this.getText());var fld;if(1>=this.options.rows&&!/\r|\n/.test(this.getText())){fld=document.createElement('input');fld.type='text';var size=this.options.size||this.options.cols||0;if(0<size)fld.size=size;}else{fld=document.createElement('textarea');fld.rows=(1>=this.options.rows?this.options.autoRows:this.options.rows);fld.cols=this.options.cols||40;}
fld.name=this.options.paramName;fld.value=text;fld.className='editor_field';if(this.options.submitOnBlur)
fld.onblur=this._boundSubmitHandler;this._controls.editor=fld;if(this.options.loadTextURL)
this.loadExternalText();this._form.appendChild(this._controls.editor);},createForm:function(){var ipe=this;function addText(mode,condition){var text=ipe.options['text'+mode+'Controls'];if(!text||condition===false)return;ipe._form.appendChild(document.createTextNode(text));};this._form=$(document.createElement('form'));this._form.id=this.options.formId;this._form.addClassName(this.options.formClassName);this._form.onsubmit=this._boundSubmitHandler;this.createEditField();if('textarea'==this._controls.editor.tagName.toLowerCase())
this._form.appendChild(document.createElement('br'));if(this.options.onFormCustomization)
this.options.onFormCustomization(this,this._form);addText('Before',this.options.okControl||this.options.cancelControl);this.createControl('ok',this._boundSubmitHandler);addText('Between',this.options.okControl&&this.options.cancelControl);this.createControl('cancel',this._boundCancelHandler,'editor_cancel');addText('After',this.options.okControl||this.options.cancelControl);},destroy:function(){if(this._oldInnerHTML)
this.element.innerHTML=this._oldInnerHTML;this.leaveEditMode();this.unregisterListeners();},enterEditMode:function(e){if(this._saving||this._editing)return;this._editing=true;this.triggerCallback('onEnterEditMode');if(this.options.externalControl)
this.options.externalControl.hide();this.element.hide();this.createForm();this.element.parentNode.insertBefore(this._form,this.element);if(!this.options.loadTextURL)
this.postProcessEditField();if(e)Event.stop(e);},enterHover:function(e){if(this.options.hoverClassName)
this.element.addClassName(this.options.hoverClassName);if(this._saving)return;this.triggerCallback('onEnterHover');},getText:function(){return this.element.innerHTML.unescapeHTML();},handleAJAXFailure:function(transport){this.triggerCallback('onFailure',transport);if(this._oldInnerHTML){this.element.innerHTML=this._oldInnerHTML;this._oldInnerHTML=null;}},handleFormCancellation:function(e){this.wrapUp();if(e)Event.stop(e);},handleFormSubmission:function(e){var form=this._form;var value=$F(this._controls.editor);this.prepareSubmission();var params=this.options.callback(form,value)||'';if(Object.isString(params))
params=params.toQueryParams();params.editorId=this.element.id;if(this.options.htmlResponse){var options=Object.extend({evalScripts:true},this.options.ajaxOptions);Object.extend(options,{parameters:params,onComplete:this._boundWrapperHandler,onFailure:this._boundFailureHandler});new Ajax.Updater({success:this.element},this.url,options);}else{var options=Object.extend({method:'get'},this.options.ajaxOptions);Object.extend(options,{parameters:params,onComplete:this._boundWrapperHandler,onFailure:this._boundFailureHandler});new Ajax.Request(this.url,options);}
if(e)Event.stop(e);},leaveEditMode:function(){this.element.removeClassName(this.options.savingClassName);this.removeForm();this.leaveHover();this.element.style.backgroundColor=this._originalBackground;this.element.show();if(this.options.externalControl)
this.options.externalControl.show();this._saving=false;this._editing=false;this._oldInnerHTML=null;this.triggerCallback('onLeaveEditMode');},leaveHover:function(e){if(this.options.hoverClassName)
this.element.removeClassName(this.options.hoverClassName);if(this._saving)return;this.triggerCallback('onLeaveHover');},loadExternalText:function(){this._form.addClassName(this.options.loadingClassName);this._controls.editor.disabled=true;var options=Object.extend({method:'get'},this.options.ajaxOptions);Object.extend(options,{parameters:'editorId='+encodeURIComponent(this.element.id),onComplete:Prototype.emptyFunction,onSuccess:function(transport){this._form.removeClassName(this.options.loadingClassName);var text=transport.responseText;if(this.options.stripLoadedTextTags)
text=text.stripTags();this._controls.editor.value=text;this._controls.editor.disabled=false;this.postProcessEditField();}.bind(this),onFailure:this._boundFailureHandler});new Ajax.Request(this.options.loadTextURL,options);},postProcessEditField:function(){var fpc=this.options.fieldPostCreation;if(fpc)
$(this._controls.editor)['focus'==fpc?'focus':'activate']();},prepareOptions:function(){this.options=Object.clone(Ajax.InPlaceEditor.DefaultOptions);Object.extend(this.options,Ajax.InPlaceEditor.DefaultCallbacks);[this._extraDefaultOptions].flatten().compact().each(function(defs){Object.extend(this.options,defs);}.bind(this));},prepareSubmission:function(){this._saving=true;this.removeForm();this.leaveHover();this.showSaving();},registerListeners:function(){this._listeners={};var listener;$H(Ajax.InPlaceEditor.Listeners).each(function(pair){listener=this[pair.value].bind(this);this._listeners[pair.key]=listener;if(!this.options.externalControlOnly)
this.element.observe(pair.key,listener);if(this.options.externalControl)
this.options.externalControl.observe(pair.key,listener);}.bind(this));},removeForm:function(){if(!this._form)return;this._form.remove();this._form=null;this._controls={};},showSaving:function(){this._oldInnerHTML=this.element.innerHTML;this.element.innerHTML=this.options.savingText;this.element.addClassName(this.options.savingClassName);this.element.style.backgroundColor=this._originalBackground;this.element.show();},triggerCallback:function(cbName,arg){if('function'==typeof this.options[cbName]){this.options[cbName](this,arg);}},unregisterListeners:function(){$H(this._listeners).each(function(pair){if(!this.options.externalControlOnly)
this.element.stopObserving(pair.key,pair.value);if(this.options.externalControl)
this.options.externalControl.stopObserving(pair.key,pair.value);}.bind(this));},wrapUp:function(transport){this.leaveEditMode();this._boundComplete(transport,this.element);}});Object.extend(Ajax.InPlaceEditor.prototype,{dispose:Ajax.InPlaceEditor.prototype.destroy});Ajax.InPlaceCollectionEditor=Class.create(Ajax.InPlaceEditor,{initialize:function($super,element,url,options){this._extraDefaultOptions=Ajax.InPlaceCollectionEditor.DefaultOptions;$super(element,url,options);},createEditField:function(){var list=document.createElement('select');list.name=this.options.paramName;list.size=1;this._controls.editor=list;this._collection=this.options.collection||[];if(this.options.loadCollectionURL)
this.loadCollection();else
this.checkForExternalText();this._form.appendChild(this._controls.editor);},loadCollection:function(){this._form.addClassName(this.options.loadingClassName);this.showLoadingText(this.options.loadingCollectionText);var options=Object.extend({method:'get'},this.options.ajaxOptions);Object.extend(options,{parameters:'editorId='+encodeURIComponent(this.element.id),onComplete:Prototype.emptyFunction,onSuccess:function(transport){var js=transport.responseText.strip();if(!/^\[.*\]$/.test(js))
throw('Server returned an invalid collection representation.');this._collection=eval(js);this.checkForExternalText();}.bind(this),onFailure:this.onFailure});new Ajax.Request(this.options.loadCollectionURL,options);},showLoadingText:function(text){this._controls.editor.disabled=true;var tempOption=this._controls.editor.firstChild;if(!tempOption){tempOption=document.createElement('option');tempOption.value='';this._controls.editor.appendChild(tempOption);tempOption.selected=true;}
tempOption.update((text||'').stripScripts().stripTags());},checkForExternalText:function(){this._text=this.getText();if(this.options.loadTextURL)
this.loadExternalText();else
this.buildOptionList();},loadExternalText:function(){this.showLoadingText(this.options.loadingText);var options=Object.extend({method:'get'},this.options.ajaxOptions);Object.extend(options,{parameters:'editorId='+encodeURIComponent(this.element.id),onComplete:Prototype.emptyFunction,onSuccess:function(transport){this._text=transport.responseText.strip();this.buildOptionList();}.bind(this),onFailure:this.onFailure});new Ajax.Request(this.options.loadTextURL,options);},buildOptionList:function(){this._form.removeClassName(this.options.loadingClassName);this._collection=this._collection.map(function(entry){return 2===entry.length?entry:[entry,entry].flatten();});var marker=('value'in this.options)?this.options.value:this._text;var textFound=this._collection.any(function(entry){return entry[0]==marker;}.bind(this));this._controls.editor.update('');var option;this._collection.each(function(entry,index){option=document.createElement('option');option.value=entry[0];option.selected=textFound?entry[0]==marker:0==index;option.appendChild(document.createTextNode(entry[1]));this._controls.editor.appendChild(option);}.bind(this));this._controls.editor.disabled=false;Field.scrollFreeActivate(this._controls.editor);}});Ajax.InPlaceEditor.prototype.initialize.dealWithDeprecatedOptions=function(options){if(!options)return;function fallback(name,expr){if(name in options||expr===undefined)return;options[name]=expr;};fallback('cancelControl',(options.cancelLink?'link':(options.cancelButton?'button':options.cancelLink==options.cancelButton==false?false:undefined)));fallback('okControl',(options.okLink?'link':(options.okButton?'button':options.okLink==options.okButton==false?false:undefined)));fallback('highlightColor',options.highlightcolor);fallback('highlightEndColor',options.highlightendcolor);};Object.extend(Ajax.InPlaceEditor,{DefaultOptions:{ajaxOptions:{},autoRows:3,cancelControl:'link',cancelText:'cancel',clickToEditText:'Click to edit',externalControl:null,externalControlOnly:false,fieldPostCreation:'activate',formClassName:'inplaceeditor-form',formId:null,highlightColor:'#ffff99',highlightEndColor:'#ffffff',hoverClassName:'',htmlResponse:true,loadingClassName:'inplaceeditor-loading',loadingText:'Loading...',okControl:'button',okText:'ok',paramName:'value',rows:1,savingClassName:'inplaceeditor-saving',savingText:'Saving...',size:0,stripLoadedTextTags:false,submitOnBlur:false,textAfterControls:'',textBeforeControls:'',textBetweenControls:''},DefaultCallbacks:{callback:function(form){return Form.serialize(form);},onComplete:function(transport,element){new Effect.Highlight(element,{startcolor:this.options.highlightColor,keepBackgroundImage:true});},onEnterEditMode:null,onEnterHover:function(ipe){ipe.element.style.backgroundColor=ipe.options.highlightColor;if(ipe._effect)
ipe._effect.cancel();},onFailure:function(transport,ipe){alert('Error communication with the server: '+transport.responseText.stripTags());},onFormCustomization:null,onLeaveEditMode:null,onLeaveHover:function(ipe){ipe._effect=new Effect.Highlight(ipe.element,{startcolor:ipe.options.highlightColor,endcolor:ipe.options.highlightEndColor,restorecolor:ipe._originalBackground,keepBackgroundImage:true});}},Listeners:{click:'enterEditMode',keydown:'checkForEscapeOrReturn',mouseover:'enterHover',mouseout:'leaveHover'}});Ajax.InPlaceCollectionEditor.DefaultOptions={loadingCollectionText:'Loading options...'};Form.Element.DelayedObserver=Class.create({initialize:function(element,delay,callback){this.delay=delay||0.5;this.element=$(element);this.callback=callback;this.timer=null;this.lastValue=$F(this.element);Event.observe(this.element,'keyup',this.delayedListener.bindAsEventListener(this));},delayedListener:function(event){if(this.lastValue==$F(this.element))return;if(this.timer)clearTimeout(this.timer);this.timer=setTimeout(this.onTimerEvent.bind(this),this.delay*1000);this.lastValue=$F(this.element);},onTimerEvent:function(){this.timer=null;this.callback(this.element,$F(this.element));}});

if(!Control)var Control={};Control.Slider=Class.create({initialize:function(handle,track,options){var slider=this;if(Object.isArray(handle)){this.handles=handle.collect(function(e){return $(e)});}else{this.handles=[$(handle)];}
this.track=$(track);this.options=options||{};this.axis=this.options.axis||'horizontal';this.increment=this.options.increment||1;this.step=parseInt(this.options.step||'1');this.range=this.options.range||$R(0,1);this.value=0;this.values=this.handles.map(function(){return 0});this.spans=this.options.spans?this.options.spans.map(function(s){return $(s)}):false;this.options.startSpan=$(this.options.startSpan||null);this.options.endSpan=$(this.options.endSpan||null);this.restricted=this.options.restricted||false;this.maximum=this.options.maximum||this.range.end;this.minimum=this.options.minimum||this.range.start;this.alignX=parseInt(this.options.alignX||'0');this.alignY=parseInt(this.options.alignY||'0');this.trackLength=this.maximumOffset()-this.minimumOffset();this.handleLength=this.isVertical()?(this.handles[0].offsetHeight!=0?this.handles[0].offsetHeight:this.handles[0].style.height.replace(/px$/,"")):(this.handles[0].offsetWidth!=0?this.handles[0].offsetWidth:this.handles[0].style.width.replace(/px$/,""));this.active=false;this.dragging=false;this.disabled=false;if(this.options.disabled)this.setDisabled();this.allowedValues=this.options.values?this.options.values.sortBy(Prototype.K):false;if(this.allowedValues){this.minimum=this.allowedValues.min();this.maximum=this.allowedValues.max();}
this.eventMouseDown=this.startDrag.bindAsEventListener(this);this.eventMouseUp=this.endDrag.bindAsEventListener(this);this.eventMouseMove=this.update.bindAsEventListener(this);this.handles.each(function(h,i){i=slider.handles.length-1-i;slider.setValue(parseFloat((Object.isArray(slider.options.sliderValue)?slider.options.sliderValue[i]:slider.options.sliderValue)||slider.range.start),i);h.makePositioned().observe("mousedown",slider.eventMouseDown);});this.track.observe("mousedown",this.eventMouseDown);document.observe("mouseup",this.eventMouseUp);document.observe("mousemove",this.eventMouseMove);this.initialized=true;},dispose:function(){var slider=this;Event.stopObserving(this.track,"mousedown",this.eventMouseDown);Event.stopObserving(document,"mouseup",this.eventMouseUp);Event.stopObserving(document,"mousemove",this.eventMouseMove);this.handles.each(function(h){Event.stopObserving(h,"mousedown",slider.eventMouseDown);});},setDisabled:function(){this.disabled=true;},setEnabled:function(){this.disabled=false;},getNearestValue:function(value){if(this.allowedValues){if(value>=this.allowedValues.max())return(this.allowedValues.max());if(value<=this.allowedValues.min())return(this.allowedValues.min());var offset=Math.abs(this.allowedValues[0]-value);var newValue=this.allowedValues[0];this.allowedValues.each(function(v){var currentOffset=Math.abs(v-value);if(currentOffset<=offset){newValue=v;offset=currentOffset;}});return newValue;}
if(value>this.range.end)return this.range.end;if(value<this.range.start)return this.range.start;return value;},setValue:function(sliderValue,handleIdx){if(!this.active){this.activeHandleIdx=handleIdx||0;this.activeHandle=this.handles[this.activeHandleIdx];this.updateStyles();}
handleIdx=handleIdx||this.activeHandleIdx||0;if(this.initialized&&this.restricted){if((handleIdx>0)&&(sliderValue<this.values[handleIdx-1]))
sliderValue=this.values[handleIdx-1];if((handleIdx<(this.handles.length-1))&&(sliderValue>this.values[handleIdx+1]))
sliderValue=this.values[handleIdx+1];}
sliderValue=this.getNearestValue(sliderValue);this.values[handleIdx]=sliderValue;this.value=this.values[0];this.handles[handleIdx].style[this.isVertical()?'top':'left']=this.translateToPx(sliderValue);this.drawSpans();if(!this.dragging||!this.event)this.updateFinished();},setValueBy:function(delta,handleIdx){this.setValue(this.values[handleIdx||this.activeHandleIdx||0]+delta,handleIdx||this.activeHandleIdx||0);},translateToPx:function(value){return Math.round(((this.trackLength-this.handleLength)/(this.range.end-this.range.start))*(value-this.range.start))+"px";},translateToValue:function(offset){return((offset/(this.trackLength-this.handleLength)*(this.range.end-this.range.start))+this.range.start);},getRange:function(range){var v=this.values.sortBy(Prototype.K);range=range||0;return $R(v[range],v[range+1]);},minimumOffset:function(){return(this.isVertical()?this.alignY:this.alignX);},maximumOffset:function(){return(this.isVertical()?(this.track.offsetHeight!=0?this.track.offsetHeight:this.track.style.height.replace(/px$/,""))-this.alignY:(this.track.offsetWidth!=0?this.track.offsetWidth:this.track.style.width.replace(/px$/,""))-this.alignX);},isVertical:function(){return(this.axis=='vertical');},drawSpans:function(){var slider=this;if(this.spans)
$R(0,this.spans.length-1).each(function(r){slider.setSpan(slider.spans[r],slider.getRange(r))});if(this.options.startSpan)
this.setSpan(this.options.startSpan,$R(0,this.values.length>1?this.getRange(0).min():this.value));if(this.options.endSpan)
this.setSpan(this.options.endSpan,$R(this.values.length>1?this.getRange(this.spans.length-1).max():this.value,this.maximum));},setSpan:function(span,range){if(this.isVertical()){span.style.top=this.translateToPx(range.start);span.style.height=this.translateToPx(range.end-range.start+this.range.start);}else{span.style.left=this.translateToPx(range.start);span.style.width=this.translateToPx(range.end-range.start+this.range.start);}},updateStyles:function(){this.handles.each(function(h){Element.removeClassName(h,'selected')});Element.addClassName(this.activeHandle,'selected');},startDrag:function(event){if(Event.isLeftClick(event)){if(!this.disabled){this.active=true;var handle=Event.element(event);var pointer=[Event.pointerX(event),Event.pointerY(event)];var track=handle;if(track==this.track){var offsets=this.track.cumulativeOffset();this.event=event;this.setValue(this.translateToValue((this.isVertical()?pointer[1]-offsets[1]:pointer[0]-offsets[0])-(this.handleLength/2)));var offsets=this.activeHandle.cumulativeOffset();this.offsetX=(pointer[0]-offsets[0]);this.offsetY=(pointer[1]-offsets[1]);}else{while((this.handles.indexOf(handle)==-1)&&handle.parentNode)
handle=handle.parentNode;if(this.handles.indexOf(handle)!=-1){this.activeHandle=handle;this.activeHandleIdx=this.handles.indexOf(this.activeHandle);this.updateStyles();var offsets=this.activeHandle.cumulativeOffset();this.offsetX=(pointer[0]-offsets[0]);this.offsetY=(pointer[1]-offsets[1]);}}}
Event.stop(event);}},update:function(event){if(this.active){if(!this.dragging)this.dragging=true;this.draw(event);if(Prototype.Browser.WebKit)window.scrollBy(0,0);Event.stop(event);}},draw:function(event){var pointer=[Event.pointerX(event),Event.pointerY(event)];var offsets=this.track.cumulativeOffset();pointer[0]-=this.offsetX+offsets[0];pointer[1]-=this.offsetY+offsets[1];this.event=event;this.setValue(this.translateToValue(this.isVertical()?pointer[1]:pointer[0]));if(this.initialized&&this.options.onSlide)
this.options.onSlide(this.values.length>1?this.values:this.value,this);},endDrag:function(event){if(this.active&&this.dragging){this.finishDrag(event,true);Event.stop(event);}
this.active=false;this.dragging=false;},finishDrag:function(event,success){this.active=false;this.dragging=false;this.updateFinished();},updateFinished:function(){if(this.initialized&&this.options.onChange)
this.options.onChange(this.values.length>1?this.values:this.value,this);this.event=null;}});

function QBuilder(nodeName,options,children,ext)
{if(Qualtrics.Browser.IE&&Qualtrics.Browser.Version<9&&(nodeName=='input'||nodeName=='textarea')||nodeName=='select')
{var el=QInputBuilder(nodeName,options,children);}
else
{var doc=document;if(options&&options.document)
{doc=options.document;}
el=doc.createElement(nodeName);if(!children&&typeof options!='object')
{children=options;}
else
{for(var nom in options)
{if(nom=='className')
{el.className=options.className;}
else if(nom=='id')
{el.id=options.id;}
else if(nom=='name')
{el.name=options.name;}
else if(nom.substring(0,2)=='on')
{el[nom]=Function(options[nom]);}
else if(nom=='checked')
{if(options[nom])
{el.defaultChecked=true;el.setAttribute('checked','checked');}}
else if(nom=='disabled')
{if(options[nom])
{el.setAttribute('disabled','disabled');}}
else if(nom=='htmlFor')
{el.htmlFor=options[nom];el.setAttribute('for',options[nom]);}
else if(nom=='style')
{$(el).setStyle(options[nom]);}
else if(typeof options[nom]!='undefined'&&nom!='document')
{el.setAttribute(nom,options[nom]);}}}
if(children)
{if(typeof children==='object')
{if(children.length)
{for(var i=0,len=children.length;i<len;++i)
{var ch=children[i];if(ch===undefined)
{ch='undefined';}
if((typeof ch=='string'||typeof ch=='number')&&ch!='')
{el.appendChild(doc.createTextNode(ch));}
else if(ch)
{if(ch.nodeType)
{el.appendChild(ch);}
else
{el.appendChild(doc.createTextNode(String(ch)));}}
else
{}}}}
else
{var node;if(typeof children=='string'||typeof children=='number')
{node=doc.createTextNode(children);}
else
{node=children;}
el.appendChild(node);}}}
if(ext&&el)
Object.extend(el,ext);return el;}
function QInputBuilder(nodeName,options,children)
{var attr='';var doc=document;if(options&&options.document)
{doc=options.document;}
for(var nom in options)
{var val=options[nom];var key='';switch(nom)
{case'className':key='class';break;case'id':key='id';break;case'checked':if(options[nom])
{key='checked';}
break;case'htmlFor':key='for';break;default:key=nom;}
if(val!=undefined)
{attr+=key+'="'+val+'" ';}}
var parent=QBuilder('div');parent.innerHTML='<'+nodeName+' '+attr+' />';var el=parent.firstChild.cloneNode(true);removeElement(parent);if(children)
{var type=typeof children;if(type==='object')
{for(var i=0,len=children.length;i<len;++i)
{var ch=children[i];var node;if(typeof ch=='string'||typeof ch=='number')
{node=doc.createTextNode(ch);}
else
{node=ch;}
if(node)
{el.appendChild(node);}}}
else if(type=='string'||type=='number')
{el.appendChild(doc.createTextNode(children));}}
return el;}
function QEntity(str,mode){str=(str)?str:"";mode=(mode)?mode:"string";var e=document.createElement("div");e.innerHTML=str;if(mode=="numeric"){return"&#"+e.innerHTML.charCodeAt(0)+";";}
else if(mode=="utf16"){var un=e.innerHTML.charCodeAt(0).toString(16);while(un.length<4)un="0"+un;return"\\u"+un;}
else return e.innerHTML;}

var inlineEditor=Class.create({parentObj:null,element:null,optionsElement:null,menuButtonElement:null,documentClickObserver:null,skipAnEvent:0,positionShiftTriggers:null,editorType:null,updateInner:true,height:null,seriesIndex:null,lastTextLength:0,lastChoiceHeight:0,align:'left',repeatCount:0,blockKeyUp:false,initTime:null,eventType:null,padding:[2,3,2,3],borderWidth:[2,1,1,2],initialize:function(parentObj,options)
{if(window.BaseForm&&BaseForm.getInstance()&&!BaseForm.getInstance().getPermission('editQuestions'))
{return;}
if(this.removeInlineEditor(options)===false)
{return;}
if(parentObj.updateInner===false)
{this.updateInner=false;}
if(!options)options={};this.options=options;this.lang=options.lang||'EN';if(parentObj.beforeEdit)
{parentObj.beforeEdit(this);}
this.padding=this.options.padding||this.padding;this.borderWidth=this.options.borderWidth||this.borderWidth;inlineEditor_lastParentObj=parentObj;this.initTime=new Date();Event.KEY_SPACE=32;Event.KEY_SHIFT=16;Event.KEY_CTRL=17;Event.KEY_ALT=18;Event.CAPS=20;this.parentObj=parentObj;if(options.seriesIndex!=undefined)
{this.seriesIndex=options.seriesIndex;options.select=true;}
var thisObj=this;parentObj.editing=1;if(parentObj&&$(parentObj.id))
{$(parentObj.id).addClassName('Editing');}
this.positionShiftTriggers=new Array();this.cachedInner=this.parentObj.getInner(this.seriesIndex,this.lang,options.useLanguage);if(options.evt)
{var evt=options.evt;this.eventType=evt.type;if(this.eventType=='mousedown')
{this.skipAnEvent=true;setTimeout(this.cancelSkipEvent.bind(this),1);}}
this.createEditor(evt,options);if(this.editorType=='iframe')
{if(parentObj&&parentObj.styleSheetPath!=undefined)
{var inlineEditorObj=this;new Ajax.Request(parentObj.styleSheetPath,{onSuccess:function(transport)
{inlineEditorObj.externalStyles=transport.responseText;inlineEditorObj.insertExternalStyles();},onFailure:function(transport)
{QError('Cannot load styleSheetPath:  '+parentObj.styleSheetPath);}});}}
this.parentObj.originalText=this.parentObj.getText(this.seriesIndex,this.lang);this.sanitizeText();if(this.parentObj.options)
{this.optionsElement=this.createOptions();}
if(this.parentObj.hasMenu||this.parentObj.buildMenu&&this.parentObj.hasMenu!==false)
{this.menuButtonElement=QBuilder('div',{className:'inlineEditorOptions',editordowncallback:'showMenu($el, $evt)'},[QBuilder('b',{bubbleup:true},[QBuilder('b',{bubbleup:true})])]);}
if(this.parentObj.buildInlineEditorMenuButton)
{this.menuButtonElement=this.parentObj.buildInlineEditorMenuButton(this.seriesIndex);}
$(this.element).setStyle({padding:this.padding[0]+'px'+' '+this.padding[1]+'px'+' '+this.padding[2]+'px'+' '+this.padding[3]+'px'});$(this.element).setStyle({borderWidth:this.borderWidth[0]+'px'+' '+this.borderWidth[1]+'px'+' '+this.borderWidth[2]+'px'+' '+this.borderWidth[3]+'px'});if(this.editorType!='iframe')
{if(options&&options.evt&&options.evt.type=='mousedown')
{var oneTimeSelectFunction=function()
{Event.stopObserving(document,'mouseup',oneTimeSelectFunction);Event.stopObserving(document,'touchend',oneTimeSelectFunction);if(thisObj.updateInner)
{thisObj.updateDom(thisObj.parentObj.getText(thisObj.seriesIndex,thisObj.lang));}
if(options&&options.select)
{thisObj.selectAll();}
else if(parentObj.getEdited)
{thisObj.autoFocus();}};Event.observe(document,'mouseup',oneTimeSelectFunction);Event.observe(document,'touchend',oneTimeSelectFunction);}}
thisObj.setDocumentClickObserver();var htmlStorage=this.element.innerHTML;this.element.innerHTML='';if($('pageDiv'))
$('pageDiv').appendChild(this.element);else if($('mainContentDiv'))
$('mainContentDiv').appendChild(this.element);this.element.innerHTML=htmlStorage;htmlStorage=null;this.updateEditorPosition();if(this.editorType=='fck')
{if(this.options.overlay!==false)
{this.overlayObj=QualtricsCPTools.Overlay.ShowOverlay({parentId:'pageDiv',zindex:11500});}
var ckWidth=this.options.ckWidth||$(this.element).offsetWidth;var ckHeight=this.options.ckHeight||$(this.element).offsetHeight;if(this.options.ckMinHeight&&ckHeight<this.options.ckMinHeight)
{ckHeight=this.options.ckMinHeight;}
var contentsLangDirection=(this.lang=='AR'||this.lang=='HE')?'rtl':'ltr';var fckStorageTextArea=QBuilder('textarea',{id:'fckStorageTextArea'},[$('inlineEditor_FCKInput').innerText||$('inlineEditor_FCKInput').textContent]);var fckStorageUnit=QBuilder('div',{id:'fckStorageUnit'},[fckStorageTextArea]);$('pageDiv').appendChild(fckStorageUnit);var ckLang=this.lang;if(Qualtrics.User.language)
ckLang=Qualtrics.User.language;var ckOptions={width:ckWidth,height:ckHeight,language:ckLang,contentsLangDirection:contentsLangDirection,on:{instanceReady:function(e)
{e.editor.focus();}}};if(this.options.toolbar)
ckOptions.toolbar=this.options.toolbar;this.fck=CKEDITOR.replace(fckStorageTextArea,ckOptions);$('fckStorageUnit').setStyle({position:'absolute',top:this.top+'px',left:this.left+'px',zIndex:'12000',display:'block'});CKEDITOR.on('instanceReady',this.updateFCKPosition.bind(this));}
if(this.fck&&this.editorType=='fck')
{if($('fckStorageUnit'))
{if(this.fck)
{this.updateFckText();}}}
if(options.zIndex||this.parentObj.zIndex)
{$(this.element).setStyle({zIndex:options.zIndex||this.parentObj.zIndex});}
if(this.optionsElement)
{$('pageDiv').appendChild(this.optionsElement);this.setupOptions();}
if(this.menuButtonElement)
{$('pageDiv').appendChild(this.menuButtonElement);this.setupMenuButton();}
if(this.updateInner)
{this.updateDom(parentObj.getText(this.seriesIndex,this.lang));}
else
{this.updateEditorWidth();}
if(!oneTimeSelectFunction)
{if(options&&options.select)
{this.selectAll();}
else{this.deferredAutoFocus();}}
if(this.parentObj.onEdit)
{this.parentObj.onEdit();}
inlineEditor.instance=this;},getSelfFunction:function()
{return Qualtrics.Event.getSelfFunction('inlineEditor',null,arguments);},getInner:function(update)
{if(!this.cachedInner||update)
{this.cachedInner=this.parentObj.getInner(this.seriesIndex,this.lang);}
return this.cachedInner;},restart:function()
{this.parentObj.edit(null,null,{select:true,seriesIndex:this.seriesIndex,lang:this.lang});},cancelSkipEvent:function()
{this.skipAnEvent=false;},updateFckText:function()
{var editor=inlineEditor.getInstance();if(editor)
{var data=editor.parentObj.getText(this.seriesIndex,this.lang);this.setFckText(data);}},setFckText:function(data)
{if(this.fck.setData)
{this.fck.setData(data);this.fck.updating=false;this.fck.focus();}
else
{var that=this;CKEDITOR.on('loaded',function()
{that.fck.setData(data);that.fck.updating=false;if(that.fck.focus)
that.fck.focus();});}},setSeriesIndex:function(seriesIndex,opt_evt)
{var lang=this.lang;this.removeInlineEditor({transitional:true});this.parentObj.edit(opt_evt,{seriesIndex:seriesIndex,lang:lang});},deferredAutoFocus:function()
{var thisObj=this;setTimeout(function(){thisObj.autoFocus();},1);},autoFocus:function()
{if(this.parentObj.getEdited)
{if(this.parentObj.getEdited(this.lang))
{this.focus();}
else
{this.selectAll();}}
else
{this.focus();}},focus:function(opt_position)
{var caretPosition=opt_position;var anchorNode=null;if(typeof opt_position=='object')
{caretPosition=opt_position.offset;anchorNode=opt_position.node;}
if(anchorNode&&anchorNode.descendantOf&&!$(anchorNode.descendantOf(this.getTextElement())))
{anchorNode=null;caretPosition=null;}
if(!this.element)
{return;}
var textObj=this.getTextElement();if(this.editorType=='textarea')
{if(caretPosition===undefined)
{var val=this.getValue();if(val)caretPosition=val.length;}
if(this.element.createTextRange)
{var end=caretPosition;var range=this.element.createTextRange();if(range){range.collapse(true);range.moveStart('character',end);range.moveEnd('character',end);try{range.select();}catch(e){if($(this.element).focus)
$(this.element).focus();}}}
else
{if($(this.element).focus)
{$(this.element).focus();if(this.element.setSelectionRange)
{var end=caretPosition;try{this.element.setSelectionRange(end,end);}catch(e)
{}}}}}
else if(this.editorType=='div')
{if(document.body.createTextRange)
{textObj.focus();var textrange=document.selection.createRange();textrange.moveToElementText(textObj);textrange.collapse(false);textrange.select();}
else
{if(textObj)
{textObj.focus();if(!anchorNode)
{anchorNode=textObj.childNodes[textObj.childNodes.length-1];caretPosition=undefined;}
if(caretPosition===undefined&&anchorNode)
{caretPosition=anchorNode.length||anchorNode.textContent&&anchorNode.textContent.length;}
if(caretPosition!==undefined)
{var sel=window.getSelection();if(sel.setPosition)
{sel.setPosition(anchorNode,caretPosition);}
else
{try
{sel.selectAllChildren(anchorNode);sel.collapseToStart();sel.extend(anchorNode,caretPosition);sel.collapseToEnd();}
catch(e){}}}}}}
else if(this.editorType=='iframe')
{var that=this;if(this.element&&this.element.contentWindow&&this.iFrameLoaded)
{if(!anchorNode)
{anchorNode=textObj.childNodes[textObj.childNodes.length-1];caretPosition=undefined;}
if(anchorNode.firstChild&&anchorNode.firstChild.nodeType===3)
{anchorNode=anchorNode.firstChild;}
if(caretPosition===undefined&&anchorNode.length)
{caretPosition=anchorNode.length;}
try{var win=that.element.contentWindow;that.element.contentDocument.execCommand('SelectAll',false,"");selObj=win.getSelection();selObj.collapseToEnd();win.focus();if(caretPosition!==undefined)
{var range=win.getSelection().getRangeAt(0);range.setStart(anchorNode,caretPosition);range.setEnd(anchorNode,caretPosition);}
win.focus();}
catch(e)
{console.log('anchorNode',anchorNode);console.log('caretPosition',caretPosition);console.error(e);}}}},selectAll:function(debug)
{if(this.editorType=='textarea')
{if(this.element)
{var that=this;(function(){if(that.element)
{that.element.focus();that.element.select();}}).defer();}}
else if(this.editorType=='div')
{if(document.body.createTextRange)
{var textrange=document.body.createTextRange();try{textrange.moveToElementText(this.getTextElement());textrange.execCommand('SelectAll',false,"");}catch(e)
{}}
else if(window.getSelection()&&window.getSelection().setBaseAndExtent){if(this.getTextElement())
window.getSelection().setBaseAndExtent(this.getTextElement(),0,this.getTextElement(),this.getTextElement().childNodes.length);}
else
{if(this.getTextElement()){this.getTextElement().focus();document.execCommand('selectAll',false,null);}}}
else if(this.editorType=='iframe')
{var that=this;setTimeout(function(){if(that.element&&that.element.contentWindow)
{that.element.contentWindow.focus();that.element.contentDocument.execCommand('bold',false,"");that.element.contentDocument.execCommand('bold',false,"");that.element.contentDocument.execCommand('selectAll',false,null);}},100);}},getSelectRange:function()
{return this.getCaret();},getCaret:function()
{var el=this.getTextElement();var start=0,end=0,normalizedValue,range,textInputRange,len,endRange;if(typeof el.selectionStart=="number"&&typeof el.selectionEnd=="number"){start=el.selectionStart;end=el.selectionEnd;}
else if(window.getSelection&&window.getSelection())
{var win=this.element.contentWindow||window;var range=win.getSelection().getRangeAt(0);start=range.startOffset;end=range.endOffset;el=range.parentElement&&range.parentElement()||range.commonAncestorContainer||el;}
else if(el.createTextRange)
{range=document.selection.createRange();if(range&&range.parentElement()==el)
{len=this.getValue().length;normalizedValue=this.getValue().replace(/\r\n/g,"\n");textInputRange=el.createTextRange();textInputRange.moveToBookmark(range.getBookmark());endRange=el.createTextRange();endRange.collapse(false);if(textInputRange.compareEndPoints("StartToEnd",endRange)>-1)
{start=end=len;}
else
{start=-textInputRange.moveStart("character",-len);start+=normalizedValue.slice(0,start).split("\n").length-1;if(textInputRange.compareEndPoints("EndToEnd",endRange)>-1)
{end=len;}
else
{end=-textInputRange.moveEnd("character",-len);end+=normalizedValue.slice(0,end).split("\n").length-1;}}}}
return{node:el,offset:start,start:start,end:end};},insertExternalStyles:function()
{if(this.externalStyles&&this.editorType=='iframe')
{if(this.iFrameLoaded)
{var doc=this.element.contentDocument;if(doc)
{var head=doc.getElementsByTagName('head')[0];if(head)
{var styleResets=QBuilder('style',{type:'text/css',title:'StyleResets',rel:'stylesheet',media:'screen'},this.externalStyles);head.appendChild(styleResets);}}
return;}}},createEditor:function(evt,options)
{if(!evt)
{evt=window.event;}
var forceTextArea=(evt&&evt.ctrlKey)||(evt&&evt.metaKey);var content=this.parentObj.getText(this.seriesIndex,this.lang);var safeDisplay=QualtricsTools.filterForDisplay(content);if(options&&options.richText!=undefined)
{forceTextArea=!options.richText;}
if(options&&options.fck)
{this.editorType='fck';this.interimInput=QBuilder('textarea',{id:'inlineEditor_FCKInput',style:'visibility:hidden;'},[content]);this.element=QBuilder('div',{id:'InlineEditorElement',className:'inlineEditor',style:'background:white'},[this.interimInput]);this.updateEditorWidth();}
else
{if(this.parentObj.html&&!forceTextArea)
{if(QBuilder('div').contentEditable===undefined)
{this.editorType='iframe';var that=this;var inlineEditor=Builder.node('iframe',{id:'InlineEditorElement',className:'inlineEditor',scrolling:'no',style:'line-height:0px; vertical-align:bottom',name:'inlineEditor',frameBorder:0},content);$(inlineEditor).setStyle({opacity:0});Event.observe(inlineEditor,'load',function(){var doc=null;if(inlineEditor.contentDocument)
{doc=inlineEditor.contentDocument;win=inlineEditor.contentWindow;that.loaded=true;that.iFrameLoaded=true;if(doc)
{var bod=doc.getElementsByTagName('body')[0];bod.innerHTML=that.parentObj.getText(that.seriesIndex,that.lang);doc.designMode="on";bod.contentEditable='true';bod.style.margin='0px';that.element=inlineEditor;that.setupEditor();that.updateEditorWidth();$(inlineEditor).setStyle({opacity:''});that.autoFocus();bod=null;inlineEditor=null;if(that.parentObj.styleSheetPath)
{that.insertExternalStyles();}}}});that.element=inlineEditor;inlineEditor.activate=function(){};}
else
{this.editorType='div';var inlineEditor=QBuilder('div',{className:'inlineEditor'},[QBuilder('div',{id:'InlineEditorElement',scrolling:'no',contentEditable:true,frameborder:"no",style:'outline:none'})]);this.element=inlineEditor;inlineEditor=null;this.getTextElement().innerHTML=safeDisplay;this.setupEditor();}}
else
{if(content)content=content.strip();this.editorType='textarea';var inlineEditor=QBuilder('textarea',{id:'InlineEditorElement',className:'inlineEditor',type:'text',autocomplete:'off',name:'inlineEditor'});inlineEditor.value=content;this.element=inlineEditor;inlineEditor=null;this.setupEditor();}}},sanitizeText:function()
{var text=this.parentObj.getText(this.seriesIndex,this.lang);if(this.editorType=='textarea')
{var newText=String(text).replace(/\t/g," ");if(newText!=text)
{text=newText;this.updateText(text);this.setValue(text);}}},hasRichText:function(opt_text,var_args)
{if(opt_text===undefined)
{opt_text=this.getValue();}
var stripped=this.getStrippedFormatting(opt_text);if(opt_text!==stripped)
{return true;}
return false;},getStrippedFormatting:function(text)
{return QualtricsCPTools.stripFormatting(text);},removeFormatting:function()
{var text=this.getValue();var stripped=String(this.getStrippedFormatting(text));this.updateText(stripped);this.setValue(stripped);},updateRemoveFormattingButton:function(opt_text,var_args)
{var toolbar=$('RichTextToolBar');if(opt_text===undefined)
{opt_text=this.getValue();}
if(toolbar)
{if(this.hasRichText(opt_text))
{$(toolbar).addClassName('HasRichText');}
else
{$(toolbar).removeClassName('HasRichText');}}},createOptions:function()
{if(this.parentObj.html)
{var viewModeClass="Normal";if(this.editorType=='textarea')
{viewModeClass="Code";}
var modeOptions=QBuilder('div',{className:'Section inlineEditorHTMLButtons '+viewModeClass},[QBuilder('div',{className:'LeftCap'}),QBuilder('div',{className:'MidSection'},[QBuilder('span',{className:'NormalButton',editorupcallback:'switchToRichText',p1:'$evt'},getMessage('EditSection','NormalView')),QBuilder('span',{className:'CodeButton',editorupcallback:'switchToTextArea',p1:'$evt'},getMessage('EditSection','HTMLView'))]),QBuilder('div',{className:'RightCap'})]);var removeFormatting=QBuilder('div',{className:'Section LargeSection RemoveFormatting'},[QBuilder('div',{className:'LeftCap'}),QBuilder('div',{className:'MidSection'},[QBuilder('span',{className:'Button',editorupcallback:'removeFormatting'},getMessage('EditSection','RemoveFormatting'))]),QBuilder('div',{className:'RightCap'})]);var fck=QBuilder('div',{className:'Section LargeSection RichTextSection'},[QBuilder('div',{className:'LeftCap'},[QBuilder('span',{className:'Icon'})]),QBuilder('div',{className:'MidSection'},[QBuilder('span',{className:'Button',editorupcallback:'switchToFCK'},getMessage('ResultsSection','RichTextEditor')+'...')]),QBuilder('div',{className:'RightCap'})]);var pipedText='';pipedText=QBuilder('div',{className:'Section LargeSection PipedTextSection'},[QBuilder('div',{className:'LeftCap'},[QBuilder('span',{className:'Icon'})]),QBuilder('div',{className:'MidSection'},[QBuilder('span',{className:'Button',editordowncallback:'openPipedText($el)'},getMessage('Piping','PipedText')+'...')]),QBuilder('div',{className:'RightCap'})]);var options=QBuilder('div',{id:'RichTextToolBar',className:'RichTextToolBar'},[fck,pipedText,removeFormatting,modeOptions]);}
else if(this.editorType=='textarea')
{if(this.parentObj.multiline)
{options=QBuilder('div',{className:'inlineEditorHTMLButtons Code'},[QBuilder('div',{className:'LeftCap'}),QBuilder('div',{className:'MidSection'},[QBuilder('span',{className:'NormalButton',editorupcallback:'switchToRichText'},'Normal View'),QBuilder('span',{className:'CodeButton'},'Code View')]),QBuilder('div',{className:'RightCap'})]);}}
return options;},showMenu:function(clickedEl,evt)
{if(!clickedEl)clickedEl=this.menuButtonElement;QMenu.showMenu(this.parentObj.buildMenu,clickedEl,{scope:this.parentObj,p1:this.seriesIndex,p2:this.lang},evt);return;},stopHideOptionsSequence:function()
{if(this.timer)
{this.timer.stop();}
$(this.optionsElement).setStyle({opacity:1});},startHideOptionsSequence:function()
{if($(this.optionsElement)&&$(this.optionsElement).hasClassName('Expanded'))
{if(this.showTimer)
{this.showTimer.stop();}
$(this.optionsElement).setStyle({opacity:0.5});var that=this;this.timer=new PeriodicalExecuter(function(pe){pe.stop();pe=null;that.hideOptions();},1.7);}},hideOptions:function()
{if($(this.optionsElement))
{$(this.optionsElement).setStyle({opacity:1});$(this.optionsElement).setStyle({width:''});$(this.optionsElement).removeClassName('Expanded');}},optionsClick:function(evt)
{if(Event.isLeftClick(evt))
{Qualtrics.Event.baseDistributerReader(evt,Event.element(evt),'editorclickcallback',this);Event.stop(evt);}},optionsDown:function(evt)
{if(Event.isLeftClick(evt))
{Qualtrics.Event.baseDistributerReader(evt,Event.element(evt),'editordowncallback',this);Event.stop(evt);}},optionsUp:function(evt)
{if(Event.isLeftClick(evt))
{Qualtrics.Event.baseDistributerReader(evt,Event.element(evt),'editorupcallback',this);Event.stop(evt);}},toggleTextEntry:function()
{this.parentObj.toggleTextEntry();this.parentObj.parentObj.refreshCanvas();this.cachedInner=null;this.checkPositionShift();},switchToTextArea:function(evt)
{var minHeight=150;var height=$(this.getInner()).getHeight();if(height<minHeight)
{height=minHeight;}
var parentObj=this.parentObj;var editor=parentObj.edit(evt,null,{richText:false,lang:this.lang,transitional:true});$(editor.getTextElement()).setStyle({fontFamily:'Courier, monospace',fontWeight:'normal',height:height+'px',overflow:'auto'});editor.codeViewMode=true;},switchToRichText:function(evt)
{var parentObj=this.parentObj;parentObj.edit(evt,null,{richText:true,lang:this.lang,transitional:true});},switchToFCK:function(evt)
{var parentObj=this.parentObj;new inlineEditor(parentObj,this.getFCKEditorOptions(evt));},getFCKEditorOptions:function(evt)
{var defaultOptions=this.getDefaultFCKEditorOptions(evt);return defaultOptions;},getDefaultFCKEditorOptions:function(evt)
{var lang=this.lang;return{evt:evt,fck:true,lang:lang,transitional:true,ckWidth:this.options.ckWidth,ckHeight:this.options.ckHeight,ckMinHeight:this.options.ckMinHeight};},openPipedText:function(clickedEl)
{QModules.loadModule('pipedtext.js');if(Qualtrics.PipedText)
{this.keepOpen=true;var pipedText=new Qualtrics.PipedText(clickedEl,'inlineEditor.insert',{position:this.getCaret()});pipedText.menu.onClose=this.allowClose.bind(this);}},keepEditorOpen:function()
{this.keepOpen=true;},allowClose:function()
{this.keepOpen=false;},removeChoice:function()
{this.removeInlineEditor();this.parentObj.removeSelectionAndRefresh();},setupOptions:function()
{var that=this;that.optionsElement.onclick=function(evt){if(!evt)evt=window.event;that.optionsClick(evt);};that.optionsElement.onmousedown=function(evt){if(!evt)evt=window.event;that.optionsDown(evt);};that.optionsElement.onmouseup=function(evt){if(!evt)evt=window.event;that.optionsUp(evt);};},setupMenuButton:function()
{var that=this;if(this.menuButtonElement)
{that.menuButtonElement.onclick=function(evt){if(!evt)evt=window.event;that.optionsClick(evt);};that.menuButtonElement.onmousedown=function(evt){if(!evt)evt=window.event;that.optionsDown(evt);};that.menuButtonElement.onmouseup=function(evt){if(!evt)evt=window.event;that.optionsUp(evt);};}},setupEditor:function()
{var inner=this.getInner();if(!inner)
{inner=this.getInner(true);}
var parentFontSize=($(inner).getStyle('font-size'));var parentFontFamily=($(inner).getStyle('font-family'));var parentFontWeight=($(inner).getStyle('font-weight'));var parentAlign=($(inner).getStyle('text-align'));if(inner.parentNode)
{var vAlign=($(inner.parentNode).getStyle('vertical-align'));}
if(parentFontSize)
{this.getTextElement().style.fontSize=parentFontSize;}
if(!this.parentObj.html)
{var parentLineHeight=($(this.getInner()).getStyle('line-height'));if(parentLineHeight)
{this.getTextElement().style.lineHeight=parentLineHeight;}}
if(parentFontFamily)
{this.getTextElement().style.fontFamily=parentFontFamily;}
if(parentFontWeight)
{this.getTextElement().style.fontWeight=parentFontWeight;}
if(parentAlign&&parentAlign=='right')
{this.getTextElement().style.textAlign=parentAlign;this.align=parentAlign;}
if(this.lang=='AR'||this.lang=='HE'){this.getTextElement().style.direction='rtl';}
if(vAlign)
{this.vAlign=vAlign;}
var that=this;var eventElement=that.getEventElement();if(eventElement.attachEvent)
{eventElement.attachEvent('onkeydown',that.doKeyDown,false);eventElement.attachEvent('onkeyup',that.doKeyUp,false);eventElement.attachEvent('onkeypress',that.doKeyPress,false);eventElement.attachEvent('onpaste',that.realPaste,false);eventElement.attachEvent('input',that.doInput,false);if(this.parentObj.validChars)
{eventElement.attachEvent('input',that.doChange,false);}}
else
{eventElement.addEventListener('keydown',that.doKeyDown,false);eventElement.addEventListener('keyup',that.doKeyUp,false);eventElement.addEventListener('keypress',that.doKeyPress,false);eventElement.addEventListener('input',that.doInput,false);if(this.parentObj.validChars)
{eventElement.addEventListener('input',that.doChange,false);}
if(that.editorType=='iframe')
{eventElement.addEventListener('dragdrop',that.doDrop,false);}
else
{eventElement.addEventListener('drop',that.doDrop,false);}
if(Qualtrics.Browser.Features.onPaste)
{eventElement.addEventListener('paste',that.realPaste,false);}
else
{that.lastText=that.getValue();eventElement.addEventListener('input',that.doInputPaste,false);}}
eventElement=null;},hasCustomKeyMap:function(key)
{var thisObj=inlineEditor.getInstance();var parentObj=thisObj.parentObj;if(parentObj.keyMap&&parentObj.keyMap[key]!==undefined)
{return true;}
return false;},useCustomKeyMap:function(key,evt)
{var thisObj=inlineEditor.getInstance();var parentObj=thisObj.parentObj;if(parentObj.keyMap&&parentObj.keyMap[key]!==undefined)
{if(parentObj[parentObj.keyMap[key]])
{var target=parentObj[parentObj.keyMap[key]](thisObj,evt);if(target&&target.edit)
{target.edit(null,null,{select:true,lang:thisObj.lang});}}
else
{if(parentObj.keyMap[key]===null)
{return true;}
if(parentObj.keyMap[key]==='close')
{this.removeInlineEditor();return false;}}
return true;}
return false;},doChange:function(evt)
{var thisObj=inlineEditor.getInstance();var validChars=thisObj.parentObj.validChars;if(typeof validChars=='string')
{validChars=new RegExp(validChars);}
if(validChars)
{var chr=evt.target.value;var result='';for(var i=0;i<chr.length;i++)
{if(chr.charAt(i)&&chr.charAt(i).match(validChars))
{result+=chr.charAt(i);}}
thisObj.setValue(result);}},doKeyDown:function(evt)
{if(!evt)var evt=window.event;var thisObj=inlineEditor.getInstance();thisObj.blockKeyUp=false;var parentObj=thisObj.parentObj;thisObj.repeatCount++;if(parentObj.onKeyDown&&parentObj.onKeyDown(evt)===false)
{Event.stop(evt);return false;}
if(evt.keyCode==Event.KEY_BACKSPACE)
{thisObj.parentObj.changed=true;if(thisObj.hasCustomKeyMap('backspace'))
{var result=thisObj.useCustomKeyMap('backspace',evt);return;}}
else if(evt.keyCode==Event.KEY_ESC)
{if((evt.keyCode==Event.KEY_ESC)&&thisObj.hasCustomKeyMap('esc'))
{return thisObj.useCustomKeyMap('esc',evt);}
if(thisObj)
{thisObj.setValue(parentObj.originalText);thisObj.removeInlineEditor({evt:evt});Event.stop(evt);return;}}
else if(evt.keyCode==Event.KEY_UP||(evt.keyCode==Event.KEY_TAB&&evt.shiftKey))
{if((evt.keyCode==Event.KEY_UP)&&thisObj.hasCustomKeyMap('up'))
{return thisObj.useCustomKeyMap('up');}
var customUp=thisObj.useCustomKeyMap('up',evt);if((evt.shiftKey&&evt.keyCode==Event.KEY_TAB)&&thisObj.hasCustomKeyMap('shiftTab'))
{return thisObj.useCustomKeyMap('shiftTab',evt);}
var prevSelection=parentObj.getPrev&&parentObj.getPrev(thisObj.seriesIndex);if(prevSelection)
{prevSelection.edit(null,null,{select:true,lang:thisObj.lang});}
else
{var prevGroup=parentObj.getPrevGroup&&parentObj.getPrevGroup(thisObj.seriesIndex);if(prevGroup)
{prevGroup.edit(null,null,{select:true,lang:thisObj.lang});}}
evt.preventDefault();return false;}
else if(evt.keyCode==Event.KEY_DOWN||evt.keyCode==Event.KEY_TAB)
{if(evt.keyCode==Event.KEY_TAB)
{Event.stop(evt);if(thisObj.codeViewMode)
{thisObj.insert('\t');return true;}}
if((evt.keyCode==Event.KEY_DOWN)&&thisObj.hasCustomKeyMap('down'))
{return thisObj.useCustomKeyMap('down',evt);}
if((evt.keyCode==Event.KEY_TAB)&&thisObj.hasCustomKeyMap('tab'))
{return thisObj.useCustomKeyMap('tab',evt);}
var nextSelection=parentObj.getNext&&parentObj.getNext(thisObj.seriesIndex);if(nextSelection)
{nextSelection.edit(null,null,{select:true,lang:thisObj.lang});}
else
{var nextGroup=parentObj.getNextGroup&&parentObj.getNextGroup(thisObj.seriesIndex);if(nextGroup)
{nextGroup.edit(null,null,{select:true,lang:thisObj.lang});}}
evt.preventDefault();return false;}
else if(evt.keyCode==Event.KEY_LEFT||evt.keyCode==Event.KEY_RIGHT)
{if(evt.metaKey&&Qualtrics.Browser.Gecko)
{Event.stop(evt);}
if(evt.keyCode==Event.KEY_LEFT)
{if(evt.ctrlKey&&!evt.shiftKey)
{if(parentObj.getLeft)
{var leftSelection=parentObj.getLeft();if(leftSelection)
{leftSelection.edit(null,null,{select:true,lang:thisObj.lang});Event.stop(evt);return false;}}
return true;}
if(parentObj.keyMap&&parentObj.keyMap['left'])
{var selectionRange=thisObj.getSelectRange();var caretPos=selectionRange.start;if(caretPos==selectionRange.end&&caretPos==0&&thisObj.hasCustomKeyMap('left'))
{Event.stop(evt);return thisObj.useCustomKeyMap('left',evt);}}}
else if(evt.keyCode==Event.KEY_RIGHT)
{if(evt.ctrlKey&&!evt.shiftKey)
{if(parentObj.getRight)
{var rightSelection=parentObj.getRight();if(rightSelection)
{rightSelection.edit(null,null,{select:true,lang:thisObj.lang});Event.stop(evt);return false;}}
return true;}
if(parentObj.keyMap&&parentObj.keyMap['right'])
{var selectionRange=thisObj.getSelectRange();var caretPos=selectionRange.start;if(caretPos==selectionRange.end&&caretPos==thisObj.getValue().length&&thisObj.hasCustomKeyMap('right'))
{Event.stop(evt);return thisObj.useCustomKeyMap('right',evt);}}}}
else if(evt.keyCode==Event.KEY_SPACE)
{if(thisObj.editorType=='textarea')
{var inputText=thisObj.getValue();if(inputText.charCodeAt(inputText.length-1)==Event.KEY_SPACE)
{Event.stop(evt);}}}
if(evt.keyCode!=Event.KEY_RETURN)
{if(thisObj.isModifyKey(evt))
{var hasSelection=thisObj.element.selectionEnd-thisObj.element.selectionStart;if(!hasSelection&&thisObj.parentObj.maxlength!==undefined&&thisObj.getValue().length>=thisObj.parentObj.maxlength)
{if(evt.keyCode!=Event.KEY_BACKSPACE&&evt.keyCode!=Event.KEY_DELETE)
{Event.stop(evt);return;}}
if(!thisObj.parentObj.multiline&&(thisObj.editorType!='div'&&!this.updateInner))
{thisObj.estimateEditorWidth();}}
thisObj.updateText(thisObj.getValue());thisObj.parentObj.fresh=0;}},doKeyUp:function(evt)
{var thisObj=inlineEditor.getInstance();thisObj.repeatCount=0;if(thisObj.blockKeyUp)
{return;}
if(thisObj.isModifyKey(evt))
{thisObj.updateText(thisObj.getValue());}},isModifyKey:function(evt)
{if(evt.keyCode!=Event.KEY_SHIFT&&evt.keyCode!=Event.KEY_CTRL&&evt.keyCode!=Event.KEY_ALT&&evt.keyCode!=Event.KEY_CAPS&&evt.keyCode!=Event.KEY_LEFT&&evt.keyCode!=Event.KEY_RIGHT&&evt.keyCode!=Event.KEY_UP&&evt.keyCode!=Event.KEY_DOWN&&evt.keyCode!=Event.KEY_TAB&&evt.keyCode!=224&&!evt.ctrlKey&&!evt.metaKey)
{return true;}
return false;},doKeyPress:function(evt)
{if(!evt)var evt=window.event;var thisObj=inlineEditor.getInstance();var parentObj=thisObj.parentObj;if(evt.keyCode==Event.KEY_RETURN)
{if(evt.shiftKey&&thisObj.hasCustomKeyMap('shiftEnter'))
{Event.stop(evt);return thisObj.useCustomKeyMap('shiftEnter',evt);}
if(thisObj.hasCustomKeyMap('enter'))
{if(!thisObj.parentObj.multiline)
{Event.stop(evt);}
return thisObj.useCustomKeyMap('enter',evt);}
if(thisObj.parentObj.multiline)
{if(window.QuestionActions){var questionObj=thisObj.parentObj.parentObj;questionObj.checkForHeightShift();}}
else
{Event.stop(evt);}}
else if(evt.keyCode==Event.KEY_TAB)
{Event.stop(evt);}
else if(thisObj.parentObj.onType)
{if(thisObj.isModifyKey(evt))
{thisObj.parentObj.onType(thisObj,thisObj.seriesIndex,thisObj.lang);thisObj.parentObj.changed=true;}}
else if(thisObj.isModifyKey(evt))
{thisObj.parentObj.changed=true;if(evt.keyCode!=Event.KEY_BACKSPACE&&evt.keyCode!=Event.KEY_DELETE)
{var validChars=thisObj.parentObj.validChars;if(typeof validChars=='string')validChars=new RegExp(validChars);if(validChars)
{var code='';if(evt.charCode)
code=evt.charCode;else
code=evt.keyCode;if(code)
{var chr=String.fromCharCode(code);if(chr&&!chr.match(validChars))
{Event.stop(evt);}}}}}},clear:function()
{this.getTextElement().innerHTML='';this.updateText('');},insert:function(text,position)
{var locatorText="<span id='qtmpinsert'>"+text+"</span>";if(this.editorType=='div')
{if(document.selection)
{this.focus(position);document.selection.createRange().pasteHTML(text);this.updateText(this.getValue());return;}
else
{this.focus(position);document.execCommand("InsertHTML",false,locatorText);}}
else if(this.editorType=='iframe')
{if(this.iFrameLoaded)
{this.element.contentDocument.execCommand('inserthtml',false,locatorText);}}
else if(this.editorType=='textarea')
{position=position||{};var val=this.getValue();var firstPos=position.offset!==undefined?position.offset:val.length;var secondPos=position.end||firstPos;var first=val.substring(0,firstPos);var last=val.substring(secondPos);this.setValue(first+text+last);this.updateText(this.getValue());this.focus({offset:(first+text).length});return;}
var textNode,doc=this.element.contentDocument||document;var els=$(this.element).select('#qtmpinsert');for(var i=0;i<els.length;++i)
{textNode=doc.createTextNode(els[i].innerHTML);els[i].parentNode.insertBefore(textNode,els[i]);$(els[i]).remove();}
if(textNode)
{this.focus({node:textNode,offset:textNode.length});}
if(this.updateInner)
{this.updateDom();}
this.updateText(this.getValue());this.updateEditorWidth();},doDrop:function()
{var thisObj=inlineEditor.getInstance();setTimeout(function(){thisObj.updateText(thisObj.getValue());},100);},doInput:function()
{var thisObj=inlineEditor.getInstance();thisObj.updateDom();thisObj.updateText(thisObj.getValue());thisObj.updateEditorWidth();},doInputPaste:function(evt)
{var thisObj=inlineEditor.getInstance();var oldString=thisObj.lastText;var newString=thisObj.getValue();var diff=newString.length-oldString.length;var pasteDetected=false;if(Math.abs(diff)>1)
{pasteDetected=true;}
else if(diff===1)
{var firstPart=newString.substring(0,newString.length-1);if(firstPart!==oldString)
{pasteDetected=true;}}
else if(diff===-1)
{var firstPart=oldString.substring(0,oldString.length-1);if(firstPart!==newString)
{pasteDetected=true;}}
else if(diff===0)
{if(oldString!==newString)
{pasteDetected=true;}}
if(pasteDetected)
{thisObj.doPaste(evt);}
thisObj.lastText=newString;},doPaste:function()
{var thisObj=inlineEditor.getInstance();if(thisObj.repeatCount>0)
{thisObj.blockKeyUp=true;}
if(this.parentObj&&this.parentObj.onChange)
{this.parentObj.onChange();}
thisObj.doParse.bind(thisObj).defer();},realPaste:function(evt)
{var thisObj=inlineEditor.getInstance();var oldVal=thisObj.getValue();if(thisObj&&thisObj.editorType!='textarea')
{if(thisObj.parentObj.onPaste)
{thisObj.parentObj.onPaste.bind(thisObj.parentObj).defer(thisObj,oldVal);}}
thisObj.doPaste(evt);},doParse:function()
{var thisObj=inlineEditor.getInstance();if(thisObj)
{if(thisObj.parentObj.parse&&thisObj.parentObj.parse(thisObj.getValue(),thisObj.seriesIndex,thisObj.lang))
{return;}
thisObj.updateText(thisObj.getValue());}},getTextElement:function()
{if(this.editorType=='iframe')
{if(this.element.contentDocument)
{var doc=this.element.contentDocument;if(doc)
{var bod=doc.getElementsByTagName('body')[0];return bod;}}}
else if(this.editorType=='div')
{if(this.element)
return this.element.firstChild;}
else if(this.editorType=='textarea')
{return this.element;}
else if(this.editorType=='fck')
{if(this.element)
return this.element.firstChild;}
return false;},getEventElement:function()
{if(this.editorType=='iframe')
{if(this.element&&this.element.contentDocument)
{return this.element.contentDocument;}}
return this.element;},getValue:function()
{if(this.element)
{if(this.editorType=='div')
{var text=this.getTextElement().innerHTML;if(text.slice(-4)=='<br>')
text=text.slice(0,-4);return text;}
else if(this.editorType=='iframe')
{if(this.iFrameLoaded)
{return this.getTextElement().innerHTML;}
if(this.parentObj.getText)
{return this.parentObj.getText();}}
else if(this.editorType=='fck')
{if(this.fck)
{if(this.fck.getData)
{var data=this.fck.getData();}
if(data!==null&&!this.fck.updating)
{return data;}}
if(this.parentObj.getText)
{return this.parentObj.getText();}
else
{return this.getTextElement().innerHTML;}}
else
{return this.getTextElement().value;}}
return null;},getPlainTextValue:function()
{var val=this.getValue();if(val!=undefined)
{return val.stripTags();}
return"";},setValue:function(v)
{if(this.editorType=='textarea')
{this.getTextElement().value=String(v);}
else
{this.getTextElement().innerHTML=String(v);}},setDocumentClickObserver:function()
{var that=this;that.documentClickObserver=that.removeByDocumentClick.bindAsEventListener(that);Event.observe(document,'mousedown',that.documentClickObserver);},removeDocumentClickObserver:function()
{Event.stopObserving(document,'mousedown',this.documentClickObserver);},removeByDocumentClick:function(evt)
{if(this.element)
{if(Event.isLeftClick(evt))
{if(this.skipAnEvent)
{this.skipAnEvent=false;return;}
var clickedEl=Event.element(evt);var parent=clickedEl.parentNode;if(clickedEl.getAttribute('keepeditoropen')){return;}
if(clickedEl.getAttribute('keepeditoropenforever')){this.keepOpen=true;return;}
if(clickedEl.id=='InlineEditorElement')
{return;}
var iswithin=(Position.within(this.element,mousePos[0],mousePos[1]));if(!iswithin)
{if(this.editorType=='fck')
{var overlayId=this.overlayObj&&this.overlayObj._id;if(overlayId)
{if($(clickedEl).id==overlayId)
{this.overlayObj.remove();}
else
{return;}}}
var removed=this.removeInlineEditor({evt:evt});if(removed===false)
{return;}
if(clickedEl&&clickedEl.nodeName=='INPUT'&&!clickedEl.disabled)
{Form.Element.focus(clickedEl);}
clickedEl=null;}}}},getHeight:function()
{return this.height;},getTotalPaddingWidth:function()
{return this.padding[1]+this.padding[3]+this.borderWidth[1]+this.borderWidth[3];},getTotalPaddingHeight:function()
{return this.padding[0]+this.padding[2]+this.borderWidth[0]+this.borderWidth[2];},updateEditorWidth:function()
{var oldWidth=this.width;var oldHeight=this.height;if(this.editorType=='div'&&!this.updateInner)
{var choiceWidth=this.getInner().offsetWidth;$(this.element).setStyle({minWidth:(choiceWidth)+'px'});var choiceHeight=this.getInner().offsetHeight;var el=this.getTextElement();$(el).setStyle({minHeight:(choiceHeight)+'px'});if(this.parentObj.getMinWidth)
{$(el).setStyle({minWidth:(this.parentObj.getMinWidth())+'px'});}
if(this.parentObj.getMinHeight)
{$(el).setStyle({minHeight:(this.parentObj.getMinHeight())+'px'});}
if(this.parentObj.getMaxWidth)
{$(el).setStyle({maxWidth:(this.parentObj.getMaxWidth())+'px'});}
if(this.parentObj.getMaxHeight)
{$(el).setStyle({maxHeight:(this.parentObj.getMaxHeight())+'px'});}
this.width=el.offsetWidth;this.height=el.offsetHeight;}
else
{var existingEditorPaddingWidth=this.getTotalPaddingWidth();var existingEditorPaddingHeight=this.getTotalPaddingHeight();if(this.parentObj.getDimensions)
{var dims=this.parentObj.getDimensions();if(dims&&(dims.width||dims.height))
{if(dims.width)
{$(this.element).setStyle({width:(dims.width-existingEditorPaddingWidth)+'px'});}
if(dims.height)
{$(this.element).setStyle({height:(dims.height-existingEditorPaddingHeight)+'px'});}
return;}}
choiceWidth=this.getInner().offsetWidth;choiceHeight=this.getInner().offsetHeight;if(choiceHeight==0)
choiceHeight=this.lastChoiceHeight;else
this.lastChoiceHeight=choiceHeight;var inputLeftPadding=this.getInputLeftPadding();var nextLetterWidth=10;if(this.parentObj.getNextLetterWidth)
{nextLetterWidth=this.parentObj.getNextLetterWidth();}
var inputText=this.getValue();if(inputText!=undefined)
{if(inputText.charCodeAt(inputText.length-1)==Event.KEY_SPACE)
{nextLetterWidth+=10;}
if(!this.parentObj.multiline)
{if(inputText!=undefined&&inputText.length===0)
{$(this.element).addClassName('WillBeDeleted');}else{$(this.element).removeClassName('WillBeDeleted');}}
if(Qualtrics.Browser.WebKit)
{choiceWidth=(choiceWidth+10);}
this.width=(choiceWidth-(inputLeftPadding*2)+nextLetterWidth);if(inputText.length>0&&!this.parentObj.multiline)
{choiceHeight=$(this.getInner()).offsetHeight;this.width=$(this.getInner()).offsetWidth+nextLetterWidth;}
$(this.element).setStyle({width:this.width+'px'});var additionalLines=(function(searchStr,str){var startIndex=0,searchStrLen=searchStr.length;var index,indices=0;while((index=str.indexOf(searchStr,startIndex))>-1){indices++;startIndex=index+searchStrLen;}
return indices;})('\n',inputText);if(Qualtrics.Translate)
{var lineHeight=19;}
else
{lineHeight=13;}
choiceHeight+=additionalLines*lineHeight+2;choiceHeight=(choiceHeight<lineHeight)?lineHeight:choiceHeight;if(!this.codeViewMode)
{$(this.element).setStyle({height:choiceHeight+'px'});}
var newHeight=choiceHeight+existingEditorPaddingHeight;if(this.height&&newHeight!=this.height)
{this.updateEditorPosition();}
this.height=newHeight;}}
this.updateButtonPosition();if(this.parentObj.multiline)
{var optionsHeight=18;if(this.optionsElement)
{$(this.optionsElement).setStyle({left:this.left+'px',top:(this.top-optionsHeight)+'px',width:this.width+(inputLeftPadding*2)+'px'});}}
if(this.parentObj.onUpdate)
{this.parentObj.onUpdate(this);}
if((oldHeight||oldWidth)&&(this.height!=oldHeight||this.width!=oldWidth))
{if(this.parentObj.onDimensionChange)
{this.parentObj.onDimensionChange(this.width,this.height);}}},updateFCKPosition:function(ev)
{if(ev.editor&&ev.editor._&&ev.editor._.cke_contents&&ev.editor._.cke_contents.$)
{$('fckStorageUnit').setStyle({zIndex:'12000',display:'block'});var top=this.top;var left=this.left;var contents=ev.editor._.cke_contents.$;var toolbar=$(contents).up().previous();if(toolbar)
{top-=toolbar.offsetHeight;}
$('fckStorageUnit').setStyle({position:'absolute',top:top+'px',left:left+'px'});}},updateButtonPosition:function(opt_width)
{if(this.menuButtonElement)
{var optionsHeight=19;var textBoxPadding=8;if(this.menuButtonElement)
{$(this.menuButtonElement).setStyle({left:(this.left+(opt_width||this.width)+textBoxPadding)+'px',top:(this.top)+'px'});}}},estimateEditorWidth:function()
{var estimatedWidth=$(this.element).offsetWidth;$(this.element).setStyle({width:(estimatedWidth)+'px'});this.updateButtonPosition(estimatedWidth);},updateEditorPosition:function()
{this.top=undefined;this.left=undefined;var pos=undefined;if(this.parentObj.getPosition)
{pos=this.parentObj.getPosition();if(pos&&(pos.top!==undefined||pos.left!==undefined))
{this.top=pos.top;this.left=pos.left;}}
if(this.top==undefined||this.left==undefined)
{var element=this.getInner();if(element)
{var scrollElement=element;var scrollOffset=[0,0];do{if(scrollElement.nodeName!=='HTML'&&scrollElement.nodeName!=='BODY')
{scrollOffset[0]+=scrollElement.scrollLeft||0;scrollOffset[1]+=scrollElement.scrollTop||0;}
scrollElement=scrollElement.parentNode;}while(scrollElement);pos=Position.cumulativeOffset(element);pos[0]-=scrollOffset[0];pos[1]-=scrollOffset[1];pos=Q_Window.preparePos(pos);var leftOffset=this.getLeftOffset();var vOffset=-2;if(Qualtrics.Browser.IE)
{vOffset=0;leftOffset+=2;}
if(Qualtrics.Browser.Safari&&Qualtrics.Browser.Version<530)
{leftOffset+=3;if(this.vAlign&&this.vAlign=='middle')
{if(this.height)
{var parentHeight=element&&element.parentNode.offsetHeight;if(parentHeight)
{vOffset+=(parentHeight/2)-(this.height/2);}}}}
this.left=pos[0]-leftOffset+1;this.top=pos[1]+vOffset-1;}}
if(this.element)
{$(this.element).setStyle({left:this.left+'px',top:this.top+'px'});}},getRightOffset:function()
{var rightOffset=0;if(this.parentObj.rightOffset!=undefined)
{rightOffset=this.parentObj.rightOffset;}
return rightOffset;},getLeftOffset:function()
{if(this.parentObj.getLeftOffset)
{return this.parentObj.getLeftOffset();}
else
{if(this.align=='center')
{return 6;}
return this.padding[3]+this.borderWidth[3];}},getInputLeftPadding:function()
{var padding=$(this.getInner()).getStyle('paddingLeft');padding=padding.substr(0,padding.indexOf('px'));return Number(padding);},checkPositionShift:function()
{if(this.align&&this.align!=='left')
{this.updateEditorPosition();this.updateEditorWidth();return;}
var el=$(this.parentObj.id);if(el)
{var parent=el.parentNode;var quickTop=el.offsetTop+parent.offsetTop;var quickLeft=el.offsetLeft+parent.offsetLeft;if(this.positionShiftTriggers[0]!=quickLeft||this.positionShiftTriggers[1]!=quickTop)
{this.updateEditorPosition();this.updateEditorWidth();}
this.positionShiftTriggers[0]=quickLeft;this.positionShiftTriggers[1]=quickTop;}},updateDom:function(text,opt_forceUpdate,opt_updatePosition)
{var display=text||this.parentObj.getText(this.seriesIndex,this.lang);var safeDisplay=QualtricsTools.filterForDisplay(display);var domNode=this.getInner();if(domNode)
{if(!this.parentObj.html)
{domNode.innerHTML=' ';domNode.appendChild(document.createTextNode(display||' '));if(Qualtrics.Browser.WebKit)
{var oldDisplay=domNode.style.display;if(oldDisplay=='inline')
{domNode.style.display='block';domNode.offsetWidth;domNode.style.display=oldDisplay;}}}
else
{if(safeDisplay!==undefined&&safeDisplay.stripScripts&&safeDisplay.stripScripts()=='')
{safeDisplay+='<br />';}
domNode.innerHTML=safeDisplay;}
if(opt_updatePosition!==false)
{this.updateEditorWidth();this.checkPositionShift();}}
this.updateRemoveFormattingButton(text);domNode=null;},updateText:function(text,opt_forceUpdate,opt_updatePosition)
{text=String(text);if(text.length>20000)
{alert('You have exceeded the size limit. Please reduce your text');return;}
else if(this.parentObj.maxlength)
{text=text.substr(0,this.parentObj.maxlength);}
var now=new Date();if(!opt_forceUpdate&&this.lastUpdateTime&&this.lastUpdateTime>now-300)
{this.parentObj.setText(text,this.seriesIndex,this.lang);this.delayedUpdateText(text);return;}
this.cancelDelayedUpdateText();this.lastUpdateTime=now;this.parentObj.setText(text,this.seriesIndex,this.lang);if(this.updateInner)
{this.updateDom(text,opt_forceUpdate,opt_updatePosition);}
if(this.parentObj&&this.parentObj.parentObj&&this.parentObj.parentObj.setEdited)
{this.parentObj.parentObj.setEdited(1);}
if(this.parentObj&&this.parentObj.setEdited&&!this.parentObj.isDefault)
{this.parentObj.setEdited(1);}},delayedUpdateText:function(text)
{if(this.updateTextDelay)
{clearTimeout(this.updateTextDelay);}
var that=this;this.updateTextDelay=setTimeout(function(){that.updateTextDelay=null;that.updateText(text);},0.4);},cancelDelayedUpdateText:function()
{if(this.updateTextDelay)
{clearTimeout(this.updateTextDelay);this.updateTextDelay=null;}},finishEdit:function()
{if(this.parentObj)
{this.getInner().innerHTML=QualtricsTools.filterForDisplay(this.parentObj.getText(this.seriesIndex,this.lang));this.updateEditorWidth();}},isEmpty:function()
{var val=this.getValue();if(trim(this.getPlainTextValue()).length===0&&val.indexOf('img')==-1&&val.indexOf('embed')==-1&&val.indexOf('object')==-1&&val.indexOf('iframe')==-1)
{return true;}
return false;},removeInlineEditor:function(options)
{var inlineEditorObj=inlineEditor.getInstance();options=options||{};if(inlineEditorObj)
{if(inlineEditorObj.parentObj.beforeClose)
{if(Qualtrics.Event.execute(inlineEditorObj.parentObj.beforeClose,[options],inlineEditorObj.parentObj)===false)
{return false;}}
if(inlineEditorObj.keepOpen)
{return false;}
var val=inlineEditorObj.getValue();val=val.strip();if(inlineEditorObj.parentObj.maxlength!==undefined&&inlineEditorObj.getValue().length>=inlineEditorObj.parentObj.maxlength)
{inlineEditorObj.setValue(inlineEditorObj.getValue().truncate(inlineEditorObj.parentObj.maxlength));}
if(val)
{inlineEditorObj.codeViewMode=false;var changed=inlineEditorObj.parentObj&&inlineEditorObj.parentObj.changed||inlineEditorObj.parentObj.originalText&&inlineEditorObj.parentObj.originalText!=inlineEditorObj.parentObj.getText(inlineEditorObj.seriesIndex,inlineEditorObj.lang);if(changed||this.editorType=='fck')
{inlineEditorObj.parentObj.changed=true;inlineEditorObj.updateText(val,true,false);}
else
{inlineEditorObj.updateDom(val,true,false);}}
inlineEditorObj.cancelDelayedUpdateText();if(inlineEditorObj.parentObj.multiline&&!inlineEditorObj.parentObj.html)
{$(inlineEditorObj.cachedInner).setStyle({'whiteSpace':''});}
if((inlineEditorObj.editorType=='textarea')||(inlineEditorObj.editorType=='fck'))
{var inner=inlineEditorObj.getInner(inlineEditorObj.seriesIndex,inlineEditorObj.lang);if(inner)
{if(inlineEditorObj.editorType=='textarea'){inner.innerHTML='';inner.appendChild(document.createTextNode(inlineEditorObj.parentObj.getText(inlineEditorObj.seriesIndex,inlineEditorObj.lang)));}else{inner.innerHTML=QualtricsTools.filterForDisplay(inlineEditorObj.parentObj.getText(inlineEditorObj.seriesIndex,inlineEditorObj.lang));}}}
var optionsNode=inlineEditorObj.optionsElement;var menuButtonNode=inlineEditorObj.menuButtonElement;if(optionsNode)
{optionsNode.onmouseover=null;optionsNode.onmouseout=null;optionsNode.onclick=null;optionsNode.onmousedown=null;optionsNode.onmouseup=null;}
if(menuButtonNode)
{menuButtonNode.onmouseover=null;menuButtonNode.onclick=null;menuButtonNode.onmouseout=null;menuButtonNode.onmousedown=null;menuButtonNode.onmouseup=null;}
optionsNode=null;menuButtonNode=null;var eventElement=inlineEditorObj.getEventElement();if(eventElement)
{if(eventElement.detachEvent)
{eventElement.detachEvent('onkeydown',inlineEditorObj.doKeyDown,false);eventElement.detachEvent('onkeyup',inlineEditorObj.doKeyUp,false);eventElement.detachEvent('onkeypress',inlineEditorObj.doKeyPress,false);eventElement.detachEvent('onpaste',inlineEditorObj.realPaste,false);eventElement.detachEvent('input',inlineEditorObj.doInput,false);}
else
{eventElement.removeEventListener('keydown',inlineEditorObj.doKeyDown,false);eventElement.removeEventListener('keyup',inlineEditorObj.doKeyUp,false);eventElement.removeEventListener('keypress',inlineEditorObj.doKeyPress,false);eventElement.removeEventListener('input',inlineEditorObj.doInput,false);if(Qualtrics.Browser.Features.onPaste)
{eventElement.removeEventListener('paste',inlineEditorObj.realPaste,false);}
else
{eventElement.removeEventListener('input',inlineEditorObj.doInputPaste,false);}}}
if(inlineEditorObj.getPlainTextValue()!=undefined)
{if(inlineEditorObj.isEmpty())
{if(inlineEditorObj.parentObj.onEmpty&&!options.transitional&&!options.clean)
{inlineEditorObj.parentObj.onEmpty(inlineEditorObj.seriesIndex,inlineEditorObj.lang);}}}
var editorEl=$(inlineEditorObj.element);inlineEditorObj.element=null;if(editorEl)
{editorEl.blur();removeElement(editorEl);}
var optionsEl=$(inlineEditorObj.optionsElement);inlineEditorObj.optionsElement=null;if(optionsEl)
{if(Qualtrics.Browser.IE&&Qualtrics.Browser.Version<8)
{removeElement.curry(optionsEl).defer();}
else
{removeElement(optionsEl);}}
var menuEl=$(inlineEditorObj.menuButtonElement);inlineEditorObj.menuButtonElement=null;if(menuEl)
{removeElement(menuEl);}
inlineEditorObj.removeDocumentClickObserver();inlineEditorObj.documentClickObserver=null;if(inlineEditorObj.parentObj)
{inlineEditorObj.parentObj.editing=0;}
if(inlineEditorObj.parentObj&&$(inlineEditorObj.parentObj.id))
{$(inlineEditorObj.parentObj.id).removeClassName('Editing');}
if(inlineEditorObj.parentObj&&inlineEditorObj.parentObj._afterEdit)
{inlineEditorObj.parentObj._afterEdit.call(inlineEditorObj.parentObj,inlineEditorObj,inlineEditorObj.seriesIndex,inlineEditorObj.lang);}
if(inlineEditorObj.parentObj&&inlineEditorObj.parentObj.afterEdit)
{inlineEditorObj.parentObj.afterEdit.call(inlineEditorObj.parentObj,inlineEditorObj,inlineEditorObj.seriesIndex,inlineEditorObj.lang);}
if(inlineEditorObj.editorType=='fck')
{if(inlineEditorObj.fck)
{inlineEditorObj.fck.destroy();}
if($('fckStorageUnit'))
{$('fckStorageUnit').remove();}}
inlineEditorObj.parentObj.changed=false;inlineEditorObj.cachedInner=null;inlineEditorObj=null;inlineEditor.instance=null;inlineEditor.fck=null;}
return true;}});var inlineEditor_lastParentObj=null;Object.extend(inlineEditor,{instance:null,getInstance:function()
{return inlineEditor.instance;},clear:function()
{if(inlineEditor.getInstance())
{inlineEditor.getInstance().removeInlineEditor();}},allowClose:function()
{if(inlineEditor.getInstance())
{inlineEditor.getInstance().allowClose();}},keepEditorOpen:function()
{if(inlineEditor.getInstance())
{inlineEditor.getInstance().keepEditorOpen();}}});var Editable=Class.create({objType:'',text:'',id:null,bindedParentObj:null,edited:0,bindedName:null,originalText:null,keyMap:{enter:'onEnter'},changed:false,forcedSeriesIndex:null,validChars:null,initialize:function(idOrElement,opt_bindedParentObj,opt_variableToBind,opt_optionsObjectName)
{this.languages={};if(idOrElement)
{this.bindedParentObj=opt_bindedParentObj;if(typeof idOrElement=='string')
{this.id=idOrElement;this.domNode=$(this.id);}
else
{this.id=QualtricsCPTools.createNewId('E');this.domNode=idOrElement;}
if(this.getInner())
{this.text=this.getInner().innerHTML;}
if(opt_variableToBind!=null)
{this.bindedName=opt_variableToBind;}
if(opt_optionsObjectName)
{if(typeof opt_optionsObjectName=='string')opt_optionsObjectName=window[opt_optionsObjectName];Object.extend(this,opt_optionsObjectName);}}},onEnter:function(opt_editorObj)
{if(!this.multiline)
{if(typeof this.close!='undefined')
{this.close();}
else if(opt_editorObj)
{opt_editorObj.removeInlineEditor();}
return false;}},edit:function(event,options)
{options=options||{};options.evt=event;var e=new inlineEditor(this,options);return e;},updateBinded:function()
{if(this.bindedName!==null&&this.bindedParentObj)
{if(this.bindedParentObj[this.bindedName]&&typeof this.bindedParentObj[this.bindedName]=='function')
{this.bindedParentObj[this.bindedName](this.text);}
else
{this.bindedParentObj[this.bindedName]=this.text;}}},onEmpty:function(seriesIndex,lang)
{this.revert();},revert:function(seriesIndex,lang)
{if(inlineEditor.getInstance())
{inlineEditor.getInstance().updateText(this.originalText,true);this.setText(this.originalText);}},getEdited:function()
{return this.edited;},setEdited:function(v)
{this.edited=v;},getText:function()
{return this.text.unescapeHTML();},setText:function(v)
{this.text=v;this.updateBinded();},getInner:function()
{return this.domNode||$(this.id);},refresh:function(seriesIndex,lang)
{if(this.getInner(seriesIndex,lang))
this.getInner(seriesIndex,lang).innerHTML=this.getText(seriesIndex,lang);},afterEdit:function()
{}});Object.extend(Editable,{bindedEdit:function(domNode,varPath,opt_instanceId,opt_optionsObjectName)
{var parts=QualtricsCPTools.getDotSyntaxParts(varPath,opt_instanceId);var editable=new Editable($(domNode),parts.root,parts.callBack,opt_optionsObjectName);return editable.edit();}});

function makeSortable(listIds){if(listIds.constructor!=Array){var listIds=[listIds];}
for(var i=0;i<listIds.length;i++){var listId=listIds[i];Sortable.create(listId,{dropOnEmpty:true,containment:listIds,constraint:false,scroll:$('body'),onChange:function(o){rankOrderAll(listIds,o);updateInputValues(listIds);},onUpdate:function(o){updateInputValues(listIds);adjustCSS(listIds);}});if('ontouchstart'in document.documentElement)
{var ul=$(listId);var sortable=Sortable.sortables[listId];for(var x=0,len=sortable.draggables.length;x<len;++x)
{var draggable=sortable.draggables[x];var li=draggable.element;Event.observe(li,'touchstart',draggable.eventMouseDown);Event.observe(document,'touchend',Draggables.eventMouseUp);Event.observe(document,'touchmove',Draggables.eventMouseMove);}}}}
function updateInputValues(listIds){if(listIds.constructor!=Array){var listIds=[listIds];}
for(var i=0;i<listIds.length;i++){var listId=listIds[i];var rank="";var choice="";var choiceId="";list=$(listId);var groupId=list.getAttribute('rel');for(var j=0;j<list.childNodes.length;j++){var choiceItem=list.childNodes[j];if(choiceItem.nodeName!='LI')
continue;choiceId=choiceItem.id;for(var ranki=0;ranki<choiceItem.childNodes.length;ranki++){if(choiceItem.childNodes[ranki].className=="rank"){rank=(choiceItem.childNodes[ranki].innerHTML);}}
for(var ranki=0;ranki<choiceItem.childNodes.length;ranki++){if(choiceItem.childNodes[ranki].className=="choice"){choice=(choiceItem.childNodes[ranki].innerHTML);}}
if($(choiceId+"~Group")){if(listId.indexOf('items')==-1){if(list.getAttribute("maxChoices"))
{if(list.childNodes.length>list.getAttribute("maxChoices"))
{list.previous(1).addClassName("ValidationError");list.previous().innerHTML=maxChoicesMsg;list.previous().addClassName("ValidationError");}
else
{list.previous(1).removeClassName("ValidationError");list.previous().innerHTML="";list.previous().removeClassName("ValidationError");}}
$(choiceId+"~Group").value=groupId;$(choiceId+"~Rank").value=rank;}else{$(choiceId+"~Group").value="";$(choiceId+"~Rank").value="";}}else if($(choiceId+"~Rank")){$(choiceId+"~Rank").value=rank;}else{console.error("Error! there is no input: "+listId+"~Rank");}}}}
function rankOrderAll(listIds,itemBeingDragged){for(var i=0;i<listIds.length;i++){var listId=listIds[i];list=$(listId);if(!list.edited)
{$(list).removeClassName('NotEdited');$(list).addClassName('Edited');list.edited=true;}
rankOrder(list,itemBeingDragged);}}
function rankOrder(list,itemBeingDragged){var rank=0;var stacked=false;if($(list).getAttribute('stacked'))
{stacked=true;var progressCounterID=list.getAttribute('progressCounter');var itemCount=list.getAttribute('itemCount');if($(progressCounterID))
{$(progressCounterID).innerHTML=list.childNodes.length+' / '+itemCount;}}
for(var i=0;i<list.childNodes.length;i++)
{var listItem=list.childNodes[i];if(!listItem||listItem.nodeName!='LI')
{continue;}
if(stacked)
{if($(listItem).getAttribute('id')==$(itemBeingDragged).getAttribute('id'))
{}
var stackedClasses='';if($(listItem).hasClassName('last'))
{stackedClasses+=' last';}
if($(listItem).hasClassName('penultimate'))
{stackedClasses+=' penultimate';}
if($(listItem).hasClassName('antepenultimate'))
{stackedClasses+=' antepenultimate';}}
rank++;if(i%2==0)
{listItem.className="BorderColor "+list.getAttribute('regularClass');}
else
{listItem.className="BorderColor "+list.getAttribute('altClass');}
if(stacked)
{listItem.className+=' stack';}
if(stacked)
{listItem.className+=stackedClasses;if($(listItem).getAttribute('id')==$(itemBeingDragged).getAttribute('id'))
{}
if($(listItem).getAttribute('id')!=$(itemBeingDragged).getAttribute('id'))
{}}
var listItemContents=(list.childNodes[i].childNodes);for(var j=0;j<listItemContents.length;j++){if(listItemContents[j].className=="rank"){listItemContents[j].innerHTML=rank;}}}}
function adjustCSS(listIds)
{for(var i=0;i<listIds.length;i++)
{var listId=listIds[i];list=$(listId);adjustListCSS(list);}}
function adjustListCSS(list){var rank=0;if($(list).getAttribute('stacked'))
{for(var i=0;i<list.childNodes.length;i++){var listItem=list.childNodes[i];if(!listItem||listItem.nodeName!='LI')
continue;rank++;$(listItem).removeClassName('antepenultimate');$(listItem).removeClassName('penultimate');if(list.childNodes.length>2)
{if(i==(list.childNodes.length-2))
{$(listItem).addClassName('penultimate');}
else if(i==(list.childNodes.length-3))
{$(listItem).addClassName('antepenultimate');}}
else if(list.childNodes.length==2)
{if(i==(list.childNodes.length-1))
{$(listItem).addClassName('penultimate');}
else if(i==(list.childNodes.length-2))
{$(listItem).addClassName('antepenultimate');}}
else if(list.childNodes.length==1)
{$(listItem).addClassName('antepenultimate');}}}}

if(window.Effect)
{Effect.Scroll=Class.create();Object.extend(Object.extend(Effect.Scroll.prototype,Effect.Base.prototype),{initialize:function(element){this.element=$(element);var options=Object.extend({x:0,y:0,mode:'absolute'},arguments[1]||{});this.start(options);},setup:function(){if(this.options.continuous&&!this.element._ext){this.element.cleanWhitespace();this.element._ext=true;this.element.appendChild(this.element.firstChild);}
this.originalLeft=this.element.scrollLeft;this.originalTop=this.element.scrollTop;if(this.options.mode=='absolute'){this.options.x-=this.originalLeft;this.options.y-=this.originalTop;}else{}},update:function(position){if(this.element.offsetWidth)
{this.element.scrollLeft=this.options.x*position+this.originalLeft;this.element.scrollTop=this.options.y*position+this.originalTop;}}});Effect.ScrollContainerTo=Class.create();Object.extend(Object.extend(Effect.ScrollContainerTo.prototype,Effect.Scroll.prototype),{initialize:function(element,toElement){this.element=$(element);Position.prepare();if(!toElement.parentNode||!element.parentNode)
{return;}
var element_y=Position.cumulativeOffset($(element))[1];var toElement_y=Position.cumulativeOffset($(toElement))[1];var y=toElement_y-element_y;var offset=0;var options=arguments[2];if(options&&options.offset)
{offset=options.offset;}
options=Object.extend({x:0,y:y+offset,mode:'absolute'},options||{});this.start(options);}});Effect.ScrollToY=Class.create();Object.extend(Object.extend(Effect.ScrollToY.prototype,Effect.Base.prototype),{initialize:function(y){this.y=y;this.start(arguments[1]||{});},setup:function(){Position.prepare();var offsets=[0,this.y];var max=window.innerHeight?window.height-window.innerHeight:document.body.scrollHeight-
(document.documentElement.clientHeight?document.documentElement.clientHeight:document.body.clientHeight);this.scrollStart=Position.deltaY;this.delta=(offsets[1]>max?max:offsets[1])-this.scrollStart;if(!this.delta)
{this.cancel();}},update:function(position){Position.prepare();window.scrollTo(Position.deltaX,this.scrollStart+(position*this.delta));}});Effect.OverlayHighlight=function(element,options){var overlayOptions=Object.extend({color:'#ffff99'},arguments[1]||{});element=QualtricsCPTools.Highlighter.autoHighlight(element,overlayOptions).element;var oldOpacity=Element.getInlineOpacity(element);options=Object.extend({from:element.getOpacity()||1.0,to:0.0,afterFinishInternal:function(effect){if(effect.options.to!=0)return;effect.element.hide().setStyle({opacity:oldOpacity});}},arguments[1]||{});return new Effect.Opacity(element,options);};}
Draggable.prototype.updateDrag=function(event,pointer){if(!this.dragging)this.startDrag(event);var fixedOffset=[0,0];if(this.options.fixedPosition)
{fixedOffset=[getScrollInfo()[0],getScrollInfo()[1]];}
if(!this.options.quiet)
{Position.prepare();var point=pointer;point[0]-=fixedOffset[0];point[1]-=fixedOffset[1];Droppables.show(point,this.element);}
pointer[0]+=fixedOffset[0];pointer[1]+=fixedOffset[1];Draggables.notify('onDrag',this,event);this.draw(pointer);if(this.options.change)this.options.change(this);if(this.options.scroll){this.stopScrolling();var p;if(this.options.scroll==window){with(this._getWindowScroll(this.options.scroll)){p=[left,top,left+width,top+height];}}else{p=Position.page(this.options.scroll).toArray();p[0]+=fixedOffset[0];p[1]+=fixedOffset[1];p.push(p[0]+this.options.scroll.offsetWidth);p.push(p[1]+this.options.scroll.offsetHeight);}
var speed=[0,0];if(pointer[0]<(p[0]+this.options.scrollSensitivity))speed[0]=pointer[0]-(p[0]+this.options.scrollSensitivity);if(pointer[1]<(p[1]+this.options.scrollSensitivity))speed[1]=pointer[1]-(p[1]+this.options.scrollSensitivity);if(pointer[0]>(p[2]-this.options.scrollSensitivity))speed[0]=pointer[0]-(p[2]-this.options.scrollSensitivity);if(pointer[1]>(p[3]-this.options.scrollSensitivity))speed[1]=pointer[1]-(p[3]-this.options.scrollSensitivity);this.startScrolling(speed);}
if(Prototype.Browser.WebKit&&!Qualtrics.Browser.MobileWebKit)window.scrollBy(0,0);var el=Event.element(event);if(el&&el.getAttribute&&el.getAttribute('distancedragged'))
{if(!el.dragTracker)
{el.dragTracker=[pointer[0],pointer[1]];}
var distanceDragged=[Math.abs(pointer[0]-el.dragTracker[0]),Math.abs(pointer[1]-el.dragTracker[1])];el.setAttribute('distancedraggedx',distanceDragged[0]);el.setAttribute('distancedraggedy',distanceDragged[1]);el.setAttribute('distancedragged',distanceDragged[0]+distanceDragged[1]);}
Event.stop(event);};Draggable.prototype._getWindowScroll=function(w){var T,L,W,H;with(w.document){if(w.document.documentElement&&documentElement.scrollTop){T=documentElement.scrollTop;L=documentElement.scrollLeft;}else if(w.document.body){T=body.scrollTop||window.pageYOffset||0;L=body.scrollLeft||window.pageXOffset||0;}
if(w.innerWidth){W=w.innerWidth;H=w.innerHeight;}else if(w.document.documentElement&&documentElement.clientWidth){W=documentElement.clientWidth;H=documentElement.clientHeight;}else{W=body.offsetWidth;H=body.offsetHeight;}}
return{top:T,left:L,width:W,height:H};};Draggable.prototype.scroll=function(){var current=new Date();var delta=current-this.lastScrolled;this.lastScrolled=current;if(this.scrollSpeed[1]<0&&this.options.scroll.scrollTop!==undefined&&this.options.scroll.scrollTop<1)
{return;}
if(this.options.scroll==window){with(this._getWindowScroll(this.options.scroll)){if(this.scrollSpeed[0]||this.scrollSpeed[1]){var d=delta/1000;this.options.scroll.scrollTo(left+d*this.scrollSpeed[0],top+d*this.scrollSpeed[1]);}}}else{this.options.scroll.scrollLeft+=this.scrollSpeed[0]*delta/1000;this.options.scroll.scrollTop+=this.scrollSpeed[1]*delta/1000;}
Position.prepare();Droppables.show(Draggables._lastPointer,this.element);Draggables.notify('onDrag',this);if(this._isScrollChild){Draggables._lastScrollPointer=Draggables._lastScrollPointer||$A(Draggables._lastPointer);Draggables._lastScrollPointer[0]+=this.scrollSpeed[0]*delta/1000;Draggables._lastScrollPointer[1]+=this.scrollSpeed[1]*delta/1000;if(Draggables._lastScrollPointer[0]<0)
Draggables._lastScrollPointer[0]=0;if(Draggables._lastScrollPointer[1]<0)
Draggables._lastScrollPointer[1]=0;this.draw(Draggables._lastPointer);}
if(this.options.change)this.options.change(this);};Draggable.prototype.initDrag=function(event){if(this.element.hasAttribute('grabClass'))
$(this.element).addClassName(this.element.getAttribute('grabClass'));var trash=$('g'+this.element.parentNode.id);if(trash)
QualtricsTools.fastDown($(trash),'icon').appear({duration:0.5});if(!Object.isUndefined(Draggable._dragging[this.element])&&Draggable._dragging[this.element])return;if(Event.isLeftClick(event)||event.touches){var src=Event.element(event);var el=Event.element(event);if(el)
{el.dragTracker=null;el.setAttribute('distancedraggedx','0');el.setAttribute('distancedraggedy','0');el.setAttribute('distancedragged','0');}
if(src.getAttribute('preventDrag'))
{return;}
if((tag_name=src.tagName.toUpperCase())&&(tag_name=='INPUT'||tag_name=='SELECT'||tag_name=='OPTION'||tag_name=='BUTTON'||tag_name=='TEXTAREA'))return;var pointer=[Event.pointerX(event),Event.pointerY(event)];var pos=Position.cumulativeOffset(this.element);this.offset=[0,1].map(function(i){return(pointer[i]-pos[i])});if(this.element.parentNode&&!this.options.ignoreParentScrollTop)
{this.offset[1]=this.offset[1]+this.element.parentNode.scrollTop;}
Draggables.activate(this);Event.stop(event);}};Draggable.prototype.endDrag2=Draggable.prototype.endDrag;Draggable.prototype.endDrag=function(event)
{if(this.element.hasAttribute('grabClass'))
$(this.element).removeClassName(this.element.getAttribute('grabClass'));var trash=$('g'+this.element.parentNode.id);if(trash)
QualtricsTools.fastDown($(trash),'icon').fade({duration:0.5});this.endDrag2(event);};Droppables.isAffected2=Droppables.isAffected;Droppables.isAffectedScroll=function(point,element,drop){return((drop.element!=element)&&((!drop._containers)||this.isContained(element,drop))&&((!drop.accept)||(Element.classNames(element).detect(function(v){return drop.accept.include(v)})))&&Position.withinIncludingScrolloffsets(drop.element,point[0],point[1]));};Droppables.isAffected=function(point,element,drop)
{if(!drop.hasOwnProperty('isFixed'))
drop.isFixed=QualtricsTools.isFixed(drop.element);if(drop.isFixed)
point=[point[0]-scrollInfo[0],point[1]-scrollInfo[1]];if(element&&element.parentElement&&$(element.parentElement).retrieve('SortableMayScroll'))
{return this.isAffectedScroll(point,element,drop);}
return this.isAffected2(point,element,drop);};Effect.SlideRight=function(element){element=$(element);Element.cleanWhitespace(element);var oldInnerRight=Element.getStyle(element.firstChild,'right');var elementDimensions=Element.getDimensions(element);return new Effect.Scale(element,100,Object.extend({scaleContent:false,scaleY:false,scaleFrom:0,scaleMode:{originalHeight:elementDimensions.height,originalWidth:elementDimensions.width},restoreAfterFinish:true,afterSetup:function(effect){with(Element){makePositioned(effect.element);makePositioned(effect.element.firstChild);if(window.opera)setStyle(effect.element,{top:''});makeClipping(effect.element);setStyle(effect.element,{width:'0px'});show(element);}},afterUpdateInternal:function(effect){with(Element){setStyle(effect.element.firstChild,{right:(effect.dims[0]-effect.element.clientWidth)+'px'});}},afterFinishInternal:function(effect){with(Element){undoClipping(effect.element);undoPositioned(effect.element.firstChild);undoPositioned(effect.element);setStyle(effect.element.firstChild,{right:oldInnerRight});}}},arguments[1]||{}));};Effect.SlideLeft=function(element){element=$(element);Element.cleanWhitespace(element);var oldInnerRight=Element.getStyle(element.firstChild,'right');return new Effect.Scale(element,0,Object.extend({scaleContent:false,scaleY:false,scaleMode:'box',scaleFrom:100,restoreAfterFinish:true,beforeStartInternal:function(effect){with(Element){makePositioned(effect.element);makePositioned(effect.element.firstChild);if(window.opera)setStyle(effect.element,{top:''});makeClipping(effect.element);show(element);}},afterUpdateInternal:function(effect){with(Element){setStyle(effect.element.firstChild,{right:(effect.dims[0]-effect.element.clientWidth)+'px'});}},afterFinishInternal:function(effect){with(Element){[hide,undoClipping].call(effect.element);undoPositioned(effect.element.firstChild);undoPositioned(effect.element);setStyle(effect.element.firstChild,{right:oldInnerRight});}}},arguments[1]||{}));};Effect.BlindLeft=function(element){element=$(element);element.makeClipping();return new Effect.Scale(element,0,Object.extend({scaleContent:false,scaleY:false,restoreAfterFinish:true,afterFinishInternal:function(effect){effect.element.hide().undoClipping();}},arguments[1]||{}));};Effect.BlindRight=function(element){element=$(element);var elementDimensions=element.getDimensions();return new Effect.Scale(element,100,Object.extend({scaleContent:false,scaleY:false,scaleFrom:0,scaleMode:{originalHeight:elementDimensions.height,originalWidth:elementDimensions.width},restoreAfterFinish:true,afterSetup:function(effect){effect.element.makeClipping().setStyle({width:'0px'}).show();},afterFinishInternal:function(effect){effect.element.undoClipping();}},arguments[1]||{}));};Effect.Transitions.InQuad=function(x){return x*x};Effect.Transitions.OutQuad=function(x){return-1*x*(x-2);};Effect.Transitions.InExpo=function(x){return(x==0)?0:Math.pow(2,10*(x-1));};Effect.Transitions.Elastic=function(x){if(x==0||x==1)
return x;var p=0.3;var s=p/4;return-(Math.pow(2,10*(x-=1))*Math.sin((x*1-s)*(2*Math.PI)/p));};var INQUAD=Effect.Transitions.InQuad;var OUTQUAD=Effect.Transitions.OutQuad;var INEXPO=Effect.Transitions.InExpo;var ELASTIC=Effect.Transitions.Elastic;Effect.Transitions.Elastic=function(pos){return-1*Math.pow(4,-8*pos)*Math.sin((pos*6-1)*(2*Math.PI)/2)+1;};Effect.Transitions.SwingFromTo=function(pos){var s=5.70158;if((pos/=0.5)<1)return 0.5*(pos*pos*(((s*=(1.525))+1)*pos-s));return 0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos+s)+2);};Effect.Transitions.SwingFrom=function(pos){var s=1.70158;return pos*pos*((s+1)*pos-s);};Effect.Transitions.SwingTo=function(pos){var s=1.70158;return(pos-=1)*pos*((s+1)*pos+s)+1;};Effect.Transitions.Bounce=function(pos){if(pos<(1/2.75)){return(7.5625*pos*pos);}else if(pos<(2/2.75)){return(7.5625*(pos-=(1.5/2.75))*pos+0.75);}else if(pos<(2.5/2.75)){return(7.5625*(pos-=(2.25/2.75))*pos+0.9375);}else{return(7.5625*(pos-=(2.625/2.75))*pos+0.984375);}};Effect.Transitions.BouncePast=function(pos){if(pos<(1/2.75)){return(7.5625*pos*pos);}else if(pos<(2/2.75)){return 2-(7.5625*(pos-=(1.5/2.75))*pos+0.75);}else if(pos<(2.5/2.75)){return 2-(7.5625*(pos-=(2.25/2.75))*pos+0.9375);}else{return 2-(7.5625*(pos-=(2.625/2.75))*pos+0.984375);}};Effect.Transitions.EaseFromTo=function(pos){if((pos/=0.5)<1)return 0.5*Math.pow(pos,4);return-0.5*((pos-=2)*Math.pow(pos,3)-2);};Effect.Transitions.EaseFrom=function(pos){return Math.pow(pos,4);};Effect.Transitions.EaseTo=function(pos){return Math.pow(pos,0.25);};Control.Slider.prototype.initialize=function(handle,track,options){var slider=this;if(Object.isArray(handle)){this.handles=handle.collect(function(e){return $(e)});}else{this.handles=[$(handle)];}
this.track=$(track);this.options=options||{};this.axis=this.options.axis||'horizontal';this.increment=this.options.increment||1;this.step=parseInt(this.options.step||'1');this.range=this.options.range||$R(0,1);this.value=0;this.values=this.handles.map(function(){return 0});this.spans=this.options.spans?this.options.spans.map(function(s){return $(s)}):false;this.options.startSpan=$(this.options.startSpan||null);this.options.endSpan=$(this.options.endSpan||null);this.restricted=this.options.restricted||false;this.maximum=this.options.maximum||this.range.end;this.minimum=this.options.minimum||this.range.start;this.alignX=parseInt(this.options.alignX||'0');this.alignY=parseInt(this.options.alignY||'0');this.trackLength=this.maximumOffset()-this.minimumOffset();this.handleLength=this.isVertical()?(this.handles[0].offsetHeight!=0?this.handles[0].offsetHeight:this.handles[0].style.height.replace(/px$/,"")):(this.handles[0].offsetWidth!=0?this.handles[0].offsetWidth:this.handles[0].style.width.replace(/px$/,""));this.active=false;this.dragging=false;this.disabled=false;if(this.options.disabled)this.setDisabled();this.allowedValues=this.options.values?this.options.values.sortBy(Prototype.K):false;if(this.allowedValues){this.minimum=this.allowedValues.min();this.maximum=this.allowedValues.max();}
this.eventMouseDown=this.startDrag.bindAsEventListener(this);this.eventMouseUp=this.endDrag.bindAsEventListener(this);this.eventMouseMove=this.update.bindAsEventListener(this);this.handles.each(function(h,i){i=slider.handles.length-1-i;slider.setValue(parseFloat((Object.isArray(slider.options.sliderValue)?slider.options.sliderValue[i]:slider.options.sliderValue)||slider.range.start),i);h.makePositioned().observe("mousedown",slider.eventMouseDown);});this.track.observe("mousedown",this.eventMouseDown);document.observe("mouseup",this.eventMouseUp);document.observe("mousemove",this.eventMouseMove);this.track.observe("touchstart",this.eventMouseDown);document.observe("touchend",this.eventMouseUp);document.observe("touchmove",this.eventMouseMove);this.initialized=true;};Control.Slider.prototype.update=function(event){if(this.active){if(!this.dragging)this.dragging=true;this.draw(event);if(Prototype.Browser.WebKit&&!event.touches)window.scrollBy(0,0);Event.stop(event);}};Control.Slider.prototype.startDrag=function(event){if(Event.isLeftClick(event)||event.touches){if(!this.disabled){this.active=true;var handle=Event.element(event);var pointer=[Event.pointerX(event),Event.pointerY(event)];var track=handle;if(track==this.track){var offsets=Element.cumulativeOffset(this.track);this.event=event;if(Qualtrics.Browser.IE==true&&Qualtrics.Browser.Version<=7&&$(document.body).getStyle('direction')==='rtl')
{this.setValue(this.translateToValue((this.isVertical()?pointer[1]-offsets[1]:pointer[0]-offsets[0])-(this.handleLength*2)));}
else
{this.setValue(this.translateToValue((this.isVertical()?pointer[1]-offsets[1]:pointer[0]-offsets[0])-(this.handleLength/2)));}
offsets=Position.cumulativeOffset(this.activeHandle);this.offsetX=(pointer[0]-offsets[0]);this.offsetY=(pointer[1]-offsets[1]);}else{while((this.handles.indexOf(handle)==-1)&&handle.parentNode)
handle=handle.parentNode;if(this.handles.indexOf(handle)!=-1){this.activeHandle=handle;this.activeHandleIdx=this.handles.indexOf(this.activeHandle);this.updateStyles();offsets=Position.cumulativeOffset(this.activeHandle);this.offsetX=(pointer[0]-offsets[0]);this.offsetY=(pointer[1]-offsets[1]);}}
this.draw(event);}
Event.stop(event);}};Effect.MorphClip=Class.create();Object.extend(Object.extend(Effect.MorphClip.prototype,Effect.Base.prototype),{initialize:function(element){this.element=$(element);if(!this.element)throw(Effect._elementDoesNotExistError);var options=Object.extend({style:{}},arguments[1]||{});this.clip=options.clip;this.start(options);},setup:function(){this.transform={originalValue:this.parseCSSClip(this.element.getStyle('clip')),targetValue:this.parseCSSClip(this.clip)};},parseCSSClip:function(str)
{var regex=/rect\(([\d|.]+)px,*\s*([\d|.]+)px,*\s*([\d|.]+)px,*\s*([\d|.]+)px\)/;var matches=str.match(regex);return{top:matches[1]*1,right:matches[2]*1,bottom:matches[3]*1,left:matches[4]*1};},update:function(position){var o=this.transform.originalValue;var t=this.transform.targetValue;var top=o.top+Math.round(((t.top-o.top)*position)*1000)/1000;var right=o.right+Math.round(((t.right-o.right)*position)*1000)/1000;var bottom=o.bottom+Math.round(((t.bottom-o.bottom)*position)*1000)/1000;var left=o.left+Math.round(((t.left-o.left)*position)*1000)/1000;var style={clip:'rect('+top+'px,'+right+'px,'+bottom+'px,'+left+'px)'};this.element.setStyle(style,true);}});Effect.Opacity=Class.create(Effect.Base,{initialize:function(element){this.element=$(element);if(!this.element)throw(Effect._elementDoesNotExistError);if(Prototype.Browser.IE&&(this.element.currentStyle&&!this.element.currentStyle.hasLayout))
this.element.setStyle({zoom:1});var options=Object.extend({from:this.element.getOpacity()||0.0,to:1.0},arguments[1]||{});this.start(options);},update:function(position){this.element.setOpacity(position);}});

Object.extend(Qualtrics,{Browser:{IE:!!(window.attachEvent&&!window.opera),Opera:!!window.opera,WebKit:navigator.userAgent.indexOf('AppleWebKit/')>-1,Safari:navigator.userAgent.indexOf('Safari/')>-1,MobileWebKit:navigator.userAgent.indexOf('AppleWebKit/')>-1&&navigator.userAgent.indexOf('Mobile/')>-1,Gecko:navigator.userAgent.indexOf('Gecko')>-1&&navigator.userAgent.indexOf('KHTML')==-1,Firefox:navigator.userAgent.indexOf('Firefox')>-1,Version:null,Features:null,getVersion:function()
{var ua=navigator.userAgent.toLowerCase();var v='99';if(Qualtrics.Browser.Firefox)
{v=ua.substring(ua.lastIndexOf('firefox/')+8,ua.lastIndexOf('firefox/')+10);}
else if(Qualtrics.Browser.WebKit)
{v=ua.substring(ua.indexOf('applewebkit/')+12,ua.indexOf(' (khtml'));}
else if(Qualtrics.Browser.IE)
{v=ua.substring(ua.indexOf('msie ')+5,ua.indexOf('; w'));}
if(v.indexOf('.')!=-1)
{v=v.substring(0,v.indexOf('.'));}
return Number(v);},getFeatures:function()
{var b=Qualtrics.Browser;var f={onPaste:(!((b.Firefox&&b.Version<3)||b.Opera))};return f;}},Error:function(msg)
{QError(msg);if(window.customErrorHandler)
{window.customErrorHandler(msg);}},isEmpty:function(obj)
{if(Object.isArray(obj))
{if(!obj.length)return true;}
else if(!Object.values(obj).length)
{return true;}
return false;},getArrayValues:function(obj)
{if(Object.isArray(obj))
{return obj;}
else
{return Object.values(obj);}},isNumericKey:function(evt)
{return((evt.keyCode>=48&&evt.keyCode<=57)||(evt.keyCode>=96&&evt.keyCode<=105)||(evt.keyCode==8)||(evt.keyCode==9)||(evt.keyCode==12)||(evt.keyCode==27)||(evt.keyCode==37)||(evt.keyCode==39)||(evt.keyCode==46)||(evt.keyCode==190&&!evt.shiftKey)||(evt.keyCode==110&&!evt.shiftKey)||(evt.keyCode==188&&!evt.shiftKey)||(evt.keyCode==109&&!evt.shiftKey)||(evt.keyCode==189&&!evt.shiftKey)||evt.metaKey||evt.ctrlKey||evt.altKey);},isNumberFormatKey:function(evt)
{return((evt.keyCode==190&&!evt.shiftKey)||(evt.keyCode==110&&!evt.shiftKey)||(evt.keyCode==188&&!evt.shiftKey));},alphaNumericValidation:function(el,evt)
{if(el.getAttribute('validation'))
{var validation=el.getAttribute('validation');if(validation=='Number'||validation=='AlphaNumeric'||validation=='Integer')
{if(this.isNumericKey(evt))
{if(validation=='Integer'&&this.isNumberFormatKey(evt))
{Event.stop(evt);return false;}}
else
{if(validation=='Number'||validation=='Integer')
{if(evt.keyCode==173)
{}
else
{Event.stop(evt);return false;}}
if(validation=='AlphaNumeric')
{if(evt.keyCode>=65&&evt.keyCode<=90)
{}
else
{Event.stop(evt);return false;}}}}}
return true;},alphaNumbericInputFilter:function(evt,el)
{var validation=el.getAttribute('validation');if(validation=='Number')
{var testStr=el.value.replace(/[^0-9\.\-\,\%]+/g,'');if(testStr!==el.value&&el.getAttribute('autoclear')!=el.value)
{el.value=testStr;}}
else if(validation=='AlphaNumeric')
{el.value=el.value.replace(/[^0-9a-zA-Z\.\-\,]+/g,'');}
else if(validation=='CharacterSet')
{var regex=el.getAttribute('charSet');if(regex)
{regex=regex.replace('[','[^')+'+';el.value=el.value.replace(new RegExp(regex,'g'),'');}}},getInputValue:function(input)
{var val=input.value,autoclear=input.getAttribute('autoclear');if(autoclear&&val==autoclear)
val='';return val;},Cache:{cache:{},set:function(key,val)
{this.cache[key]=val;},get:function(key)
{if(this.cache[key]!==null&&typeof(this.cache[key])!='undefined')
return this.cache[key];else
return null;},unset:function(key)
{delete this.cache[key];}},getMessage:function(var_args)
{var sectionName='Javascript',params=null,tag=arguments[1]||arguments[0];if(arguments[1])
{sectionName=arguments[0];params=Array.prototype.slice.call(arguments,2);}
var messages=window.javascriptMessages;if(window.javascriptMessages)
{if(tag&&messages&&window.javascriptMessages[sectionName])
{var message=window.javascriptMessages[sectionName][tag];if(message)
{if(Qualtrics&&Qualtrics.System&&Qualtrics.System.productName=='ThreeSixty')
{var ignoredTags=['Survey','Survey1','Survey2','Survey3','Form','Form1','Form2','Form3','Assessment','Assessment1','Assessment2','Assessment3','Project','Project1','Project2','Project3'];if(ignoredTags.indexOf(tag)===-1)
{if(Qualtrics.ThreeSixty.currentType=='EE')
{message=message.replace(new RegExp('\\b'+getMessage('SiteWide','Form')+'\\b'),getMessage('SiteWide','Survey'));message=message.replace(new RegExp('\\b'+getMessage('SiteWide','Form1')+'\\b'),getMessage('SiteWide','Survey1'));message=message.replace(new RegExp('\\b'+getMessage('SiteWide','Form2')+'\\b'),getMessage('SiteWide','Survey2'));message=message.replace(new RegExp('\\b'+getMessage('SiteWide','Form3')+'\\b'),getMessage('SiteWide','Survey3'));message=message.replace(getMessage('SiteWide','Assessment'),getMessage('SiteWide','Project'));message=message.replace(getMessage('SiteWide','Assessment1'),getMessage('SiteWide','Project1'));message=message.replace(getMessage('SiteWide','Assessment2'),getMessage('SiteWide','Project2'));message=message.replace(getMessage('SiteWide','Assessment3'),getMessage('SiteWide','Project3'));}
else
{message=message.replace(getMessage('SiteWide','Survey'),getMessage('SiteWide','Form'));message=message.replace(getMessage('SiteWide','Survey1'),getMessage('SiteWide','Form1'));message=message.replace(getMessage('SiteWide','Survey2'),getMessage('SiteWide','Form2'));message=message.replace(getMessage('SiteWide','Survey3'),getMessage('SiteWide','Form3'));}}}
if(params&&params.length)
{for(i=0,len=params.length;i<len;++i)
{var re=new RegExp("%"+(i+1),'g');message=message.replace(re,params[i]);}}
return message;}}}
return'#'+tag;},parseJSON:function(json,opt_silent)
{try{if(json)
{if(typeof json=='string')
{var parsed=json.evalJSON();return parsed;}
else if(typeof json=='object')
{return json;}}}catch(e)
{if(!opt_silent)
console.error(e);}
return false;},toJSON:function(object,opt_silent)
{var json;try
{json=Object.toJSON(object);}
catch(e)
{if(!opt_silent)
console.error(e);json=false;}
return json;},getHashCode:function(str)
{var hash1=(5381<<16)+5381;var hash2=hash1;var hashPos=0;while(hashPos<str.length){hash1=((hash1<<5)+hash1+(hash1>>27))^str.charCodeAt(hashPos);if(hashPos==str.length-1){break;}
hash2=((hash2<<5)+hash2+(hash2>>27))^str.charCodeAt(hashPos+1);hashPos+=2;}
return hash1+(hash2*1566083941);},arrayCast:function(object)
{if(!object)
{return[];}
if(object.length!==undefined&&object.push)
{return object;}
var array=[];for(var key in object)
{array.push(object[key]);}
return array;}});Qualtrics.Browser.Version=Qualtrics.Browser.getVersion();Qualtrics.Browser.Features=Qualtrics.Browser.getFeatures();var OverRegistry=[];var dragInProgress=false;var suspendOvers=false;function clearOverRegistry(){if(suspendOvers)return;for(i=0;i<OverRegistry.length;i++){var elem=OverRegistry[i];var cn=Element.classNames(elem);cn.remove("Over");}
OverRegistry.clear();}
function AddOver(el,options)
{if(!el)
return;if(window.dragInProgress!=undefined)
{if(window.dragInProgress)return;if(window.suspendOvers)return;}
var className=(options&&options.className||"Over");$(el).addClassName(className);OverRegistry.push(el);if(options&&options.onComplete){options.onComplete(el,options);}}
function RemoveOver(el,options){if(window.dragInProgress!=undefined)
{if(window.dragInProgress)return;if(window.suspendOvers)return;}
var className=(options&&options.className||"Over");$(el).removeClassName(className);clearOverRegistry();if(options&&options.onComplete){options.onComplete(el,options);}}
function getOverClosure(type,opt_options)
{return function(evt)
{evt=evt||window.event;if(evt)
{var el=(opt_options&&opt_options.element)||Event.element(evt);if(window[type])
{window[type](el,opt_options);}}};}
function AddOverHelper(el)
{if(!el.overAdded)
{el.overAdded=true;Event.observe(el,'mouseover',function()
{AddOver(el);});Event.observe(el,'mouseout',function()
{RemoveOver(el);});}}
var translationTip={originalText:'',suggestionText:'',section:'',item:'',userLang:'',userID:'',span:'',event:'',keepTip:false,off:function()
{if($('translationTip'))
{setTimeout(translationTip.removeTip,750);}},on:function(el,ev,section,item,lang,userID)
{if($('translationTip'))
return;this.span=el;this.event=ev;this.section=section;this.item=item;this.userLang=lang;this.userID=userID;setTimeout(translationTip.addTip,750);},keepAlive:function(value)
{this.keepTip=value;if(value==false)
this.off();},removeTip:function(override){if((!this.keepTip&&$('translationTip')&&!$('suggestionText').value)||override)
{$('translationTip').remove();}},addTip:function(){var el=this.span;var coordinates=Element.positionedOffset(el);var event=this.event;if(!event)event=window.event;var mouseCoordinates=getMousePosition(event);this.originalText=el.innerHTML;var x=mouseCoordinates[0];var y=mouseCoordinates[1];var stripped=this.originalText.replace(/(<([^>]+)>)/ig,"");var translationTip=QBuilder('div',{id:'translationTip',onmouseover:'translationTip.keepAlive(true)',onmouseout:'translationTip.keepAlive(false)',style:'left:'+x+'px; top:'+y+'px;'},[QBuilder('div',{className:'header'},[QBuilder('h3',{},[getMessage('SiteWide','SuggestTranslation')])]),QBuilder('div',{className:'content'},[QBuilder('div',{id:'translationTipContent'},[QBuilder('div',{},[getMessage('SiteWide','CurrentText')]),QBuilder('div',{},[this.originalText])]),QBuilder('div',{},[getMessage('SiteWide','BetterSuggestion')]),QBuilder('input',{type:'text',id:'suggestionText'},[])]),QBuilder('div',{className:'footer'},[QBuilder('div',{className:'translationTipButton',id:'submitTranslation',onclick:'translationTip.submitSuggestion()'},[getMessage('SiteWide','Submit')]),QBuilder('div',{className:'translationTipButton',onclick:'translationTip.removeTip(true)'},[getMessage('SiteWide','Close')]),QBuilder('div',{className:'clear'},[])])]);$('body').appendChild(translationTip);},submitSuggestion:function(){if($('submitTranslation')&&$('submitTranslation').hasClassName('disabled'))
return;$('submitTranslation').addClassName('disabled');if($('suggestionText')&&$('suggestionText').value)
this.suggestionText=$('suggestionText').value;else
{$('translationTipContent').innerHTML=getMessage('SiteWide','NoSuggestion');this.off();return;}
var url='http://reporting.qualtrics.com/projects/translations.php?userID='+this.userID+'&suggestion='+this.suggestionText+'&sectionTag='+this.section+'&messageTag='+this.item+'&language='+this.userLang;new Ajax.Request(url,{params:{userID:this.userID,translation:this.suggestionText,sectionTag:this.section,messageTag:this.item,language:this.userLang},onSuccess:function(){$('translationTipContent').innerHTML=getMessage('SiteWide','TranslationReceived');this.off();},onFailure:function(){$('translationTipContent').innerHTML=getMessage('SiteWide','TranslationNotReceived');this.off();}});}};Cookie={createCookie:function(name,value,days){if(days){var date=new Date();date.setTime(date.getTime()+(days*24*60*60*1000));var expires="; expires="+date.toGMTString();}
else
expires="";document.cookie=name+"="+value+expires+"; path=/";},readCookie:function(name){var nameEQ=name+"=";var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' ')c=c.substring(1,c.length);if(c.indexOf(nameEQ)==0)return c.substring(nameEQ.length,c.length);}
return null;},readCookieNames:function(){var cookies=[];var ca=document.cookie.split(';');ca.each(function(item){var index=item.indexOf('=');cookies.push(item.substring(0,index));});return cookies;},eraseCookie:function(name){Cookie.createCookie(name,"",-1);},acceptsCookies:function(){if(typeof navigator.cookieEnabled=='boolean'){return navigator.cookieEnabled;}
Cookie.createCookie('_test','1');var val=Cookie.readCookie('_test');Cookie.eraseCookie('_test');return val=='1';}};function stopEnterSubmit(evt)
{if(evt.keyCode==Event.KEY_RETURN)
{Event.stop(evt);return false;}}
function pressSubmitButtonOnEnter(evt,id)
{if(evt.keyCode==Event.KEY_RETURN)
{Event.stop(evt);$(id).click();return false;}}
function number_format(number,decimals,dec_point,thousands_sep,pad_right)
{if(!decimals||decimals>0)
{var decimalPos=String(number).indexOf(".");if(decimalPos===-1&&!pad_right)
{decimals=0;}
else
{var numOfCharactersAfterDecimal=String(number).substring(decimalPos+1).length;if(decimals)
{decimals=pad_right?decimals:Math.min(numOfCharactersAfterDecimal,decimals);}
else
{decimals=numOfCharactersAfterDecimal;}}}
var n=number;var c=isNaN(decimals=Math.abs(decimals))?2:decimals;var d=dec_point==undefined?".":dec_point;var t=thousands_sep==undefined?",":thousands_sep;var s=n<0?"-":"";var i=parseInt(n=Math.abs(+n||0).toFixed(c))+"";var j=(j=i.length)>3?j%3:0;var finalNum=s+(j?i.substr(0,j)+t:"")+i.substr(j).replace(/(\d{3})(?=\d)/g,"$1"+t)+(c?d+Math.abs(n-i).toFixed(c).slice(2):"");return finalNum;}
function trim(str)
{return str.replace(/^\s+|\s+$/g,'');}
function UpdateCSTotal(CSQuestion,DesiredSum)
{var displayOrderEl=$("QR~"+CSQuestion+"~DisplayOrder");var displayedChoices=(displayOrderEl)?displayOrderEl.value.split('|'):[];var TotalCount=0;for(var i=0;i<displayedChoices.length;i++)
{var CurrentChoice="QR~"+CSQuestion+"~"+displayedChoices[i];var choiceEl=$(CurrentChoice);if(choiceEl)
{var num=Number(choiceEl.value.replace(/,/g,''));if(!isNaN(num))
{TotalCount+=num;}}}
if(TotalCount==DesiredSum||DesiredSum==-1)
$(CSQuestion+"_Total").style.color="";else
$(CSQuestion+"_Total").style.color="red";TotalCount=number_format(TotalCount);$(CSQuestion+"_Total").value=TotalCount;}
function UpdateMatrixCSTotal(Question,choiceId,desiredSum)
{if(!desiredSum)
desiredSum=-1;var questionId=Question;if(questionId.indexOf('~')!=-1)
{choiceId=questionId.substring(questionId.indexOf('~')+1);questionId=questionId.substring(0,questionId.indexOf('~'));}
var displayOrderEl=$("QR~"+questionId+"~AnswerDisplayOrder");var displayedAnswers=(displayOrderEl)?displayOrderEl.value.split('|'):[];var TotalCount=0;for(var i=0;i<displayedAnswers.length;i++)
{var CurrentAnswer="QR~"+questionId+"~"+choiceId+"~"+displayedAnswers[i];var answerEl=$(CurrentAnswer);if(answerEl)
{TotalCount+=Number(answerEl.value.replace(/,/g,''));}}
var OutputCell=questionId+"~"+choiceId+"_Total";if(TotalCount==desiredSum||desiredSum==-1)
$(OutputCell).style.color="";else
$(OutputCell).style.color="red";TotalCount=number_format(TotalCount);$(OutputCell).value=TotalCount;}
function UpdateMatrixCSTotalVert(Question,answerId,desiredSum)
{if(!desiredSum)
desiredSum=-1;var questionId=Question;if(questionId.indexOf('~')!=-1)
{answerId=questionId.substring(questionId.indexOf('~')+1);questionId=questionId.substring(0,questionId.indexOf('~'));}
var displayOrderEl=$("QR~"+questionId+"~DisplayOrder");var displayedChoices=(displayOrderEl)?displayOrderEl.value.split('|'):[];var TotalCount=0;for(var i=0;i<displayedChoices.length;i++)
{var CurrentAnswer="QR~"+questionId+"~"+displayedChoices[i]+"~"+answerId;var answerEl=$(CurrentAnswer);if(answerEl)
{TotalCount+=Number(answerEl.value.replace(/,/g,''));}}
var OutputCell=questionId+"~"+answerId+"_Total";if(TotalCount==desiredSum||desiredSum==-1)
$(OutputCell).style.color="";else
$(OutputCell).style.color="red";TotalCount=number_format(TotalCount);$(OutputCell).value=TotalCount;}
function updateConjointTotal(prefix,total_levels)
{var conjoint_level=1;var total_count=0;var features=$('featuresShown').value.split(',');for(var i=0;i<features.length;i++)
{conjoint_level=features[i];level_element=prefix+"~"+conjoint_level+"~UCS";if($(level_element))
total_count+=Number($(level_element).value);conjoint_level++;}
var output_element=prefix+"~Total";if(total_count==100)
document.Page.elements[output_element].style.color="";else
document.Page.elements[output_element].style.color="red";document.Page.elements[output_element].value=total_count;}
function SBChangeOrder(selectionID,offset)
{offset=Number(offset);var element=$(selectionID);if((offset!=-1&&offset!=1)||element==null)
return;var index=element.selectedIndex;if(index==-1||index+offset<0||index+offset>=element.options.length)
return;var optionA=new Option(element.options[index].text,element.options[index].value,0,1);optionA.nomove=element.options[index].nomove;var optionB=new Option(element.options[index+offset].text,element.options[index+offset].value);optionB.nomove=element.options[index+offset].nomove;element.options[index]=optionB;element.options[index+offset]=optionA;element.focus();}
function moveItemToSelectionBox(oldSelectionBoxID,newSelectionBoxID,deleteOption){var old_element=$(oldSelectionBoxID);var new_element=$(newSelectionBoxID);if(old_element==null||new_element==null)
{return;}
var old_element_length=old_element.options.length;for(var index=0;index<old_element_length;index++)
{if(old_element.options[index].selected)
{var option=old_element.options[index];option=new Option(option.text,option.value);option.referer=oldSelectionBoxID;if(deleteOption)
{old_element.options[index--]=null;old_element_length=old_element.options.length;}
new_element.options.add(option);}}
old_element.focus();}
function deleteItemFromSelectionBox(selectionBoxID)
{var element=$(selectionBoxID);if(element==null)
{return;}
var index=element.selectedIndex;if(index==-1)
return;var newSelected=index-1;var element_length=element.options.length;for(index=0;index<element_length;index++)
{if(element.options[index].selected)
{element.options[index--]=null;element_length=element.options.length;if(index<0)
index=0;}}
if(newSelected>=0)
element.options[newSelected].selected=true;else
element.options[0].selected=true;element.focus();}
function updateDrillDown(selectPrefix,answerMap,answers,depth,maxDepth,value)
{var hasAnswerMap=false;for(var test in answerMap)
{hasAnswerMap=true;break;}
if(!hasAnswerMap||depth>maxDepth)
{return;}
var selectedAnswer=parseValue(value);var currentSelect=$(selectPrefix+depth);var nextSelect=$(selectPrefix+(depth+1));if(currentSelect&&selectedAnswer!=false)
{var selectValue="QR~"+selectPrefix+depth+"~"+selectedAnswer;currentSelect.value=selectValue;var options=currentSelect.select('option');options.each(function(option){if(option.value==selectValue)
{option.setAttribute('selected','selected');}});}
if(nextSelect)
{nextSelect.disabled=true;nextSelect.options.length=0;if(selectedAnswer!=false||depth==0)
{var valuePrefix=nextSelect.name+'~';var newAnswers=createDDAnswers(answerMap,answers,selectedAnswer,depth);var i=0;nextSelect.options[i++]=new Option('','');for(var answerID in newAnswers)
{nextSelect.options[i++]=new Option(newAnswers[answerID],valuePrefix+answerID);}
if(!Element.hasClassName(nextSelect,'disabled'))
{nextSelect.disabled=false;}}
for(i=depth+2;i<=maxDepth;i++)
{var select=$(selectPrefix+i);select.options.length=0;select.disabled=true;}}}
function parseValue(value)
{if(value==false||value.indexOf('~')==-1)
return value;var startIndex=value.lastIndexOf('~')+1;var endIndex=value.length;return value.substring(startIndex,endIndex);}
function createDDAnswers(answerMap,DDanswers,selectedAnswer,depth)
{var answerArray=getAnswerArray(answerMap,selectedAnswer,depth);var answers=new Object();for(var answerID in answerArray)
{answers[answerID]=DDanswers[answerID].substring(DDanswers[answerID].lastIndexOf('~ ')+1);}
return answers;}
function getAnswerArray(answerMap,selectedAnswer,depth)
{if(answerMap=='')
return false;if(depth==0)
return answerMap;for(var answerID in answerMap)
{if(answerID==selectedAnswer)
return answerMap[answerID];var answerArray=getAnswerArray(answerMap[answerID],selectedAnswer);if(answerArray!=false)
return answerArray;}
return false;}
function validateNumber(event)
{var keyCode=event.keyCode;if(keyCode==8||keyCode==9||keyCode==35||keyCode==36||keyCode==37||keyCode==39||keyCode==46)
return true;if(keyCode==0)
keyCode=event.which;if(keyCode==46)
return true;if(keyCode==45)
return true;if(keyCode>=48&&keyCode<=57||keyCode<=97&&keyCode>=122)
return true;return false;}
function noneOfTheAboveCheck(postTag,choiceId,notAChoice,thisID)
{if(choiceId=="")
var items=document.Page.elements[postTag+"~DisplayOrder"].value.split('|');else
{items=document.Page.elements[postTag+"~AnswerDisplayOrder"].value.split('|');postTag=postTag+"~"+choiceId;}
if(thisID==notAChoice)
{var thisCheckBox=$(postTag+"~"+thisID);if(thisCheckBox.checked)
{for(var i=0;i<items.length;i++)
{var checkBox=$(postTag+"~"+items[i]);if(thisID==items[i]||!checkBox)
continue;checkBox.checked=false;}}}
else
{var notAChoiceCheckBox=$(postTag+"~"+notAChoice);notAChoiceCheckBox.checked=false;}}
function exclusiveAnswerCheck(postTag,group,elementId)
{try
{if($(postTag+"~AnswerDisplayOrder"))
var displayedChoices=$F(postTag+"~AnswerDisplayOrder").split('|');else if($(postTag+"~DisplayOrder"))
displayedChoices=$F(postTag+"~DisplayOrder").split('|');else
return;}
catch(e)
{console.log(e);}
var isExclusive=$(group+"~"+elementId).getAttribute('exclusive');for(var i=0;i<displayedChoices.length;i++)
{var checkBox=$(group+"~"+displayedChoices[i]);var id=displayedChoices[i];if(isExclusive==1)
{if(elementId==id||!checkBox)
continue;checkBox.checked=false;}
else
{if(checkBox&&checkBox.getAttribute('exclusive')==1)
checkBox.checked=false;}}}
function exclusiveChoiceCheck(postTag,group,choiceId,elementId)
{try
{if($(postTag+"~DisplayOrder"))
var displayedChoices=$F(postTag+"~DisplayOrder").split('|');else
return;}
catch(e)
{console.log(e);}
var isExclusive=$(group+"~"+elementId).getAttribute('choiceexclusive');for(var i=0;i<displayedChoices.length;i++)
{var checkBox=$(postTag+"~"+displayedChoices[i]+'~'+elementId);var id=displayedChoices[i];if(isExclusive==1)
{if(choiceId==id||!checkBox)
{continue;}
checkBox.checked=false;}
else
{if(checkBox&&checkBox.getAttribute('choiceexclusive')==1)
checkBox.checked=false;}}}
function rankOrderRadioCheck(colId,selectedRow,numRows)
{for(var row=0;row<numRows;row++)
{if(row==selectedRow)
continue;var radio=$(colId+"~"+row);if(radio.checked==true)
radio.checked=false;}}
function getTimeArray(d)
{d=Number(d);return{h:Math.floor(d/3600),m:Math.floor(d%3600/60),s:Math.floor(d%3600%60)};}
function startTimer(tId)
{$(tId+'Timer').timer=setInterval((function(){var t=$(tId+'Timer');var i=parseInt(t.getAttribute('time'));var e=i-parseInt(t.getAttribute('endTime'));if(e==0)
{clearInterval(t.timer);return;}
var j=i-e/Math.abs(e);t.setAttribute('time',j);$('TimerClock'+tId+'Time').setValue(j);i=getTimeArray(i);j=getTimeArray(j);flipNumber(i.s,j.s,tId+'S');if(i.m!=j.m)
flipNumber(i.m,j.m,tId+'M');if(i.h!=j.h)
flipNumber(i.h,j.h,tId+'H');}).bind(null,tId),1000);}
function flipNumber(i,j,hms)
{var flip=function(i,j,n)
{$('TimerClock'+n).setValue(j);if(!(Qualtrics.Browser.WebKit||Qualtrics.Browser.Firefox))
{$(n).down('.Number').update(j);return;}
var field=QBuilder('fieldset',{},[QBuilder('span',{className:'Change B'},j+''),QBuilder('span',{className:'Change TF'},i+''),QBuilder('span',{className:'Change TB'},j+'')]);$(n).appendChild(field);(function(n){n.className+=' Flip'}).delay(.05,field);setTimeout((function(n,j){$(n).down('.Number').update(j);$(n).down('.Flip').hide();}).curry(n,j),800);};if(i%10!=j%10)
{flip(i%10,j%10,hms+'2');}
i=Math.max(Math.floor(i/10),0);j=Math.max(Math.floor(j/10),0);if(i!=j)
{flip(i,j,hms+'1');}}
function InsertSlider(SliderName,Direction,min,max,DefaultValue,GraphicDirectory,SliderValue)
{var html=generateSliderDOM(SliderName,Direction,min,max,DefaultValue,GraphicDirectory,SliderValue);var SliderParentId='SSParent~'+SliderName;$(SliderParentId).appendChild(html);createSlider.defer(SliderName,Direction,min,max,DefaultValue,GraphicDirectory,SliderValue);}
function generateSliderDOM(SliderName,Direction,min,max,DefaultValue,GraphicDirectory,SliderValue)
{if(SliderValue!==undefined&&SliderValue!==null&&SliderValue!==''&&SliderValue>=min&&SliderValue<=max)
DefaultValue=SliderValue;var SliderNM=SliderName;var SliderImage=SliderName+"_Image";var sliderPath='../WRQualtricsShared/SlidingScales/'+GraphicDirectory+'/';var ssImages=QBuilder('div',{className:'SSImage'});for(var i=min;i<=max;i++)
{var display=(i==DefaultValue)?'block':'none';var img=QBuilder('img',{src:sliderPath+i+'.gif',id:'Image_'+SliderName+'@'+i});$(img).setStyle({display:display});$(ssImages).appendChild(img);}
var track=QBuilder('a',{className:'SSTrack',id:'DV_'+SliderName},[QBuilder('span',{className:'handle',id:'H_'+SliderName})]);var ret=QBuilder('div');if(Direction=='vertical')
{ret.appendChild(QBuilder('table',{className:'SSDisplay '+Direction+'bar'},[QBuilder('tbody',{},[QBuilder('tr',{},[QBuilder('td',{},[ssImages]),QBuilder('td',{},[track])])])]));}
else
{ret.appendChild(QBuilder('table',{className:'SSDisplay '+Direction+'bar'},[QBuilder('tbody',{},[QBuilder('tr',{},[QBuilder('td',{},[ssImages])]),QBuilder('tr',{},[QBuilder('td',{},[track])])])]));}
var opts={'type':'hidden',id:SliderName,'name':SliderName};if(SliderValue!==undefined&&SliderValue!==null&&SliderValue!==''&&SliderValue>=min&&SliderValue<=max)
opts['value']=SliderValue;ret.appendChild(Builder.node('input',opts));return ret;}
function createSlider(SliderName,Direction,min,max,DefaultValue,GraphicDirectory,SliderValue)
{var slider='DV_'+SliderName;var handle='H_'+SliderName;var range=$R(parseInt(min),parseInt(max));var activated=false;if(SliderValue!==undefined&&SliderValue!==null&&SliderValue!==''&&SliderValue>=min&&SliderValue<=max)
{DefaultValue=SliderValue;activated=true;$(slider).addClassName('activated');}
var defValue=DefaultValue;if(Direction=='vertical')
{DefaultValue=range.end-DefaultValue+parseInt(min);}
var mySlider=new Control.Slider(handle,slider,{range:range,values:$A(range),axis:Direction,sliderValue:DefaultValue,onSlide:function(value)
{if(!this.value&&this.value!=0)
{this.value=defValue;}
if(this.axis=='vertical')
value=this.range.end-value+this.range.start;if($('Image_'+SliderName+'@'+this.value))
$('Image_'+SliderName+'@'+this.value).setStyle({display:'none'});if($('Image_'+SliderName+'@'+value))
$('Image_'+SliderName+'@'+value).setStyle({display:'block'});this.value=value;},onChange:function(value){if(!activated)
{activated=true;$(slider).addClassName('activated');}
if(this.axis=='vertical')
value=this.range.end-value+this.range.start;$(SliderName).value=value;}});}
function submitForm(formID)
{var form=$(formID);if(form)
{Event.fire(form,'submit');if(form.onsubmit)
form.onsubmit();if(form.submit)
form.submit();return true;}}
function submitFormJumpTo(formID,jumpTo)
{$(formID).action=jumpTo;submitForm(formID);}
function getMousePosition(e)
{if(e.pageX&&e.pageY)
{posx=e.pageX;posy=e.pageY;}
else if(e.clientX&&e.clientY)
{posx=e.clientX+window.scrollInfo[0];posy=e.clientY+window.scrollInfo[1];}
return[posx,posy];}
function setPosition(obj,newX,newY)
{$(obj).setStyle({top:newY+'px',left:newX+'px'});}
function findPosX(obj)
{var curleft=0;if(obj.offsetParent)
{while(obj.offsetParent)
{curleft+=obj.offsetLeft;obj=obj.offsetParent;}}
else if(obj.x)
curleft+=obj.x;return curleft;}
function findPosY(obj,opt_UseScrollOffset)
{var curtop=0;if(obj.offsetParent)
{while(obj.offsetParent)
{curtop+=obj.offsetTop;if(opt_UseScrollOffset)
{curtop-=obj.scrollTop;}
obj=obj.offsetParent;}}
else if(obj.y)
curtop+=obj.y;return curtop;}
function autoCheck(id,text)
{var el=$(id);if(el==null)
return;if(el&&el.id!=id)
return;var type=el.getAttribute('type');if(type=='checkbox'||type=='radio')
{if(text==''||text==null)
el.checked=false;else
el.checked=true;}
if($(el).onclick)
$(el).onclick();if(Qualtrics.syncLabelsAndInputs)
{Qualtrics.syncLabelsAndInputs(false);}}
var SEonSubmit={add:function(onSubmitFunction)
{Event.observe('Page','submit',onSubmitFunction);}};var SEonClick={add:function(onClickFunction)
{Event.observe('Page','click',onClickFunction);}};var SEonMouseDown={add:function(onMouseDownFunction)
{Event.observe('Page','mouseup',onMouseDownFunction);Event.observe('Page','touchend',onMouseDownFunction);}};var IeFixFlashFixOnload=function(){};function refreshPage()
{}
function Q_UpdatePage()
{}
function SlideToggle(el,options)
{if(el.inAction!=true)
{el.inAction=true;if(options&&options.onStart)
{options.onStart();}
if(Element.getStyle(el,'display')=='block')
{if(options&&options.ExpandOnly==true)
{el.inAction=false;if(options&&options.onExit)
{options.onExit();}
return;}
if(options&&options.toggleArrow)
{ArrowToggle(options.toggleArrow,{ContractOnly:true});}
new Effect.BlindUp(el,{duration:options.duration||0.15,afterFinish:function()
{el.inAction=false;if(refreshPage)
{refreshPage();}
if(Q_UpdatePage)
{Q_UpdatePage();}
if(options&&options.onContract)
{options.onContract();}
if(options&&options.onFinish)
{options.onFinish();}
if(options&&options.onExit)
{options.onExit();}}});}
else
{if(options&&options.ContractOnly==true)
{el.inAction=false;if(options&&options.onExit)
{options.onExit();}
return;}
if(options&&options.toggleArrow)
{ArrowToggle(options.toggleArrow,{ExpandOnly:true});}
if(options&&options.beforeExpand){options.beforeExpand();}
new Effect.BlindDown(el,{duration:options.duration||0.15,afterFinish:function()
{el.inAction=false;if(refreshPage)
{refreshPage();}
if(Q_UpdatePage)
{Q_UpdatePage();}
if(options&&options.onExpand)
{options.onExpand();}
if(options&&options.onFinish)
{options.onFinish();}
if(options&&options.onExit)
{options.onExit();}}});}}}
function ArrowToggle(TitleDiv,options){if(options&&options.ContractOnly){$(TitleDiv).addClassName("Collapsed");return;}
if(options&&options.ExpandOnly){$(TitleDiv).removeClassName("Collapsed");return;}
if(Element.hasClassName(TitleDiv,'Collapsed')){$(TitleDiv).removeClassName("Collapsed");}else{$(TitleDiv).addClassName("Collapsed");}}
function HelpToggle()
{SlideToggle($('HelpContent'),{onContract:function()
{Element.setStyle($('HelpButton'),{borderBottom:'1px solid #FCD570'});$('GapCloser').hide();},beforeExpand:function()
{Element.setStyle($('HelpButton'),{borderBottom:'none'});$('GapCloser').show();}});}
function fillVerticalSpace(element,container)
{try
{if(element)
{if(!container||container.tagName=='body')
fillBody=true;else
fillBody=false;var newHeight=0;var headerAndFooterHeight=0;var mainContentDiv=$('mainContentDiv');if(mainContentDiv)
{if(fillBody)
{headerAndFooterHeight+=Position.cumulativeOffset(mainContentDiv)[1];}
else if($('popupMainHeaderDiv'))
{headerAndFooterHeight+=Position.cumulativeOffset(mainContentDiv)[1]-Position.cumulativeOffset($('popupMainHeaderDiv'))[1];}}
var topOfFooterDiv=$('topOfFooter');var botOfFooterDiv=$('bottomOfFooter');var footerDiv=$('popupMainFooterDiv');if(topOfFooterDiv&&botOfFooterDiv)
{var footerHeight=Position.cumulativeOffset(botOfFooterDiv)[1]-Position.cumulativeOffset(topOfFooterDiv)[1];headerAndFooterHeight+=footerHeight;}
else if(footerDiv)
{footerHeight=footerDiv.offsetHeight;headerAndFooterHeight+=footerHeight;}
if(fillBody)
{if(window.innerHeight)
{newHeight=window.innerHeight-headerAndFooterHeight;}
else
{newHeight=document.documentElement.clientHeight-headerAndFooterHeight;}}
else
{newHeight=$(container).offsetHeight-headerAndFooterHeight;}
element.style.height=newHeight+'px';}}
catch(e)
{console.error(e);}}
function resizedWindow()
{fillVerticalSpace($('mainContentDiv'));}
function removeElement(element){if(!element)
return;var garbageBin=$('IELeakGarbageBin');if(!garbageBin)
{garbageBin=QBuilder('DIV');garbageBin.id='IELeakGarbageBin';garbageBin.style.display='none';document.body.appendChild(garbageBin);}
garbageBin.appendChild(element);garbageBin.innerHTML='';}
function getMessage(msg)
{return'#'+msg;}
var QualtricsTools={createNewId:function(prefix)
{var number;try{if((typeof(Uint32Array)!=='undefined')&&window.crypto&&window.crypto.getRandomValues){var numbers=new Uint32Array(1);window.crypto.getRandomValues(numbers);var numberString=numbers[0].toString();var padding='00000000';var paddedNumber=padding+numberString;number=paddedNumber.substring(paddedNumber.length-8,paddedNumber.length);}}finally{if(!number){number=Math.round(Math.random()*100000000);}}
return prefix+'_'+number;},createFauxGUID:function(prefix)
{var S=function(){return"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random()*59));};return prefix+'_'+S()+S()+S()+S()+S()+S()+S()+S()+S()+S()+S()+S()+S()+S()+S();},clearSelection:function()
{if(window.getSelection)
{if(window.getSelection().empty)
{window.getSelection().empty();}
else if(window.getSelection().removeAllRanges)
{window.getSelection().removeAllRanges();}
else if(document.selection)
{document.selection.empty();}}},focusInput:function(el,opt_pos)
{if(opt_pos==undefined)
{$(el).focus();return;}
if(el&&el.createTextRange)
{var range=el.createTextRange();if(range){range.collapse(true);range.moveStart('character',opt_pos);range.moveEnd('character',opt_pos);try{range.select();}catch(e){}}}
else if(el)
{if($(el).focus)
{$(el).focus();if(el.setSelectionRange)
{try{el.setSelectionRange(opt_pos,opt_pos);}catch(e)
{}}}}},getPageSize:function()
{var xScroll,yScroll;if(window.innerHeight&&window.scrollMaxY){xScroll=document.body.scrollWidth;yScroll=window.innerHeight+window.scrollMaxY;}else if(document.body.scrollHeight>document.body.offsetHeight){xScroll=document.body.scrollWidth;yScroll=document.body.scrollHeight;}else{xScroll=document.body.offsetWidth;yScroll=document.body.offsetHeight;}
var windowWidth,windowHeight;if(self.innerHeight){windowWidth=self.innerWidth;windowHeight=self.innerHeight;}else if(document.documentElement&&document.documentElement.clientHeight){windowWidth=document.documentElement.clientWidth;windowHeight=document.documentElement.clientHeight;}else if(document.body){windowWidth=document.body.clientWidth;windowHeight=document.body.clientHeight;}
if(yScroll<windowHeight){pageHeight=windowHeight;}else{pageHeight=yScroll;}
if(xScroll<windowWidth){pageWidth=windowWidth;}else{pageWidth=xScroll;}
var arrayPageSize={pageWidth:pageWidth,pageHeight:pageHeight,windowWidth:windowWidth,windowHeight:windowHeight,0:pageWidth,1:pageHeight,2:windowWidth,3:windowHeight};return arrayPageSize;},getScrollInfo:function()
{if(document.viewport.getScrollOffsets)
{var scrollOffsets=document.viewport.getScrollOffsets();return[scrollOffsets.left,scrollOffsets.top];}
return[0,0];},getInstanceHelper:function(registry,idString)
{return function(id)
{if(registry.push)
{for(var i=0,len=registry.length;i<len;++i)
{if(registry[i][idString]==id)
{return registry[i];}}}
else
{if(registry[id])
{return registry[id];}}
return undefined;};},createInstanceRegistry:function()
{var _reg={};return{register:function(obj,prefix)
{obj.id=obj.id||QualtricsTools.createNewId(prefix);_reg[obj.id]=obj;},deregister:function(obj)
{_reg[obj.id]=null;delete _reg[obj.id];},clearRegistry:function()
{for(var i in _reg)
{_reg[i]=null;delete _reg[i];}},getInstance:function(id)
{return _reg[id];},getInstancesLike:function(search)
{var ret=[];for(var i in _reg)
{if(i.indexOf(search)!==-1)
{ret.push(_reg[i]);}}
return ret;},executeOnAll:function(func)
{for(var i in _reg)
{if(typeof _reg[i][func]=='function')
_reg[i][func]();}}};},sortByKey:function(array,key)
{return array.sort(function(a,b){var x=a[key];var y=b[key];return((x<y)?-1:((x>y)?1:0));});},fastDown:function(startNode,className,maxDepth)
{if($(startNode).hasClassName(className))
{return startNode;}
var parentNode=startNode;var lastRealNode=null;if(maxDepth==undefined)
{maxDepth=10;}
for(var i=0;i<maxDepth;++i)
{if(!parentNode.firstChild)
{break;}
var child=parentNode.firstChild;if(child&&child.nodeType==3&&child.nextSibling)
{child=child.nextSibling;}
if(child)
{if(child.nodeType==1)
{if($(child).hasClassName(className))
{return child;}
else if(child.nextSibling&&child.nextSibling.nodeType==1&&$(child.nextSibling).hasClassName(className))
{return child.nextSibling;}
parentNode=child;}}}
if(!className)return child;return $(startNode).down('.'+className);},fastUp:function(startNode,className,maxDepth)
{if(!$(startNode))
return null;if($(startNode).hasClassName&&$(startNode).hasClassName(className))
{return startNode;}
var thisNode=startNode;if(maxDepth==undefined)
{maxDepth=10;}
for(var i=0;i<maxDepth;++i)
{var parent=thisNode.parentNode;if(parent)
{if(parent.nodeType==1)
{if($(parent).hasClassName&&$(parent).hasClassName(className))
{return parent;}
thisNode=parent;}}}
if($(startNode).up)
return $(startNode).up('.'+className);else
return null;},BrowserInfo:{cachedBrowserInfo:null,Flash:{isIE:(navigator.appVersion.indexOf("MSIE")!=-1)?true:false,isWin:(navigator.appVersion.toLowerCase().indexOf("win")!=-1)?true:false,isOpera:(navigator.userAgent.indexOf("Opera")!=-1)?true:false,ControlVersion:function()
{var version;var axo;var e;try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");version=axo.GetVariable("$version");}catch(e){}
if(!version)
{try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");version="WIN 6,0,21,0";axo.AllowScriptAccess="always";version=axo.GetVariable("$version");}catch(e){}}
if(!version)
{try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");version=axo.GetVariable("$version");}catch(e){}}
if(!version)
{try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");version="WIN 3,0,18,0";}catch(e){}}
if(!version)
{try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");version="WIN 2,0,0,11";}catch(e){version=-1;}}
return version;},GetSwfVer:function(){var flashVer=-1;if(navigator.plugins!=null&&navigator.plugins.length>0){if(navigator.plugins["Shockwave Flash 2.0"]||navigator.plugins["Shockwave Flash"]){var swVer2=navigator.plugins["Shockwave Flash 2.0"]?" 2.0":"";var flashDescription=navigator.plugins["Shockwave Flash"+swVer2].description;var descArray=flashDescription.split(" ");var tempArrayMajor=descArray[2].split(".");var versionMajor=tempArrayMajor[0];var versionMinor=tempArrayMajor[1];var versionRevision=descArray[3];if(versionRevision==""){versionRevision=descArray[4];}
if(versionRevision[0]=="d"){versionRevision=versionRevision.substring(1);}else if(versionRevision[0]=="r"){versionRevision=versionRevision.substring(1);if(versionRevision.indexOf("d")>0){versionRevision=versionRevision.substring(0,versionRevision.indexOf("d"));}}
flashVer=versionMajor+"."+versionMinor+"."+versionRevision;}}
else if(navigator.userAgent.toLowerCase().indexOf("webtv/2.6")!=-1)flashVer=4;else if(navigator.userAgent.toLowerCase().indexOf("webtv/2.5")!=-1)flashVer=3;else if(navigator.userAgent.toLowerCase().indexOf("webtv")!=-1)flashVer=2;else if(this.isIE&&this.isWin&&!this.isOpera){flashVer=this.ControlVersion();}
return flashVer;}},_parseUserAgent:function(userAgent)
{var agentString=userAgent||(typeof navigator!=='undefined'?navigator.userAgent:'');var browserInfo={ua:agentString,browser:''};var rvPattern=/rv:([\d+\.]+)/;var uaPattern=/(([^\/\s]*)\/([^\s;]*))/;var pattern;var ua=agentString;var matches=true;while(matches)
{matches=uaPattern.exec(ua);if(matches)
{ua=RegExp.rightContext;if(matches[2]&&matches[2].toLowerCase)
{switch(matches[2].toLowerCase())
{case'chrome':browserInfo.browser=matches[2];browserInfo.version=matches[3];if(ua.toLowerCase().indexOf('edge')===-1)
{matches=false;}
break;case'trident':if(parseFloat(matches[3])>=7)
{var versionMatches=rvPattern.exec(ua);if(versionMatches){browserInfo.browser='MSIE';browserInfo.version=versionMatches[1];matches=false;}}
break;case'edge':case'firefox':case'netscape':case'safari':case'camino':case'mosaic':case'galeon':case'opera':case'mozilla':case'konqueror':case'applewebkit':case'nintendobrowser':browserInfo.browser=matches[2];browserInfo.version=matches[3];}}}}
if(browserInfo.browser=='Mozilla')
{if(browserInfo.browser=='Mozilla'&&agentString.indexOf('(compatible;')!=-1)
{pattern=/\(compatible; ([^ ]*)[ \/]([^;]*).*/;matches=pattern.exec(agentString);if(matches)
{browserInfo.browser=matches[1];browserInfo.version=matches[2];}}}
function handleDefaultOS()
{pattern=/U;\s*([^;\)]*)/;matches=pattern.exec(agentString);if(matches)
{browserInfo.os=matches[1];}
else
{pattern=/\(([^)]*)\)/;matches=pattern.exec(agentString);if(matches)
{matches=matches[1].split(';');if(matches[0][0]=='X')
{browserInfo.os=matches[1];}
else if(matches[0]=='Mobile'&&matches[1])
{browserInfo.os=matches[1];}
else if(matches[0]=='Linux'&&matches[1]&&matches[1].indexOf('Android')!==-1)
{browserInfo.os=matches[1];}
else
{browserInfo.os=matches[0];}}}
if(browserInfo.os){browserInfo.os=browserInfo.os.trim();}}
handleDefaultOS();if(browserInfo.os=='iPad'||browserInfo.os=='iPhone'){browserInfo.browser='Safari';browserInfo.version='Unknown';}
switch(browserInfo.browser.toLowerCase())
{case'msie':pattern=/\(compatible;[^;]*;\s*([^;\)]*)/;matches=pattern.exec(agentString);if(matches)
{browserInfo.os=matches[1];}
else
{handleDefaultOS();}
break;case'opera':pattern=/\(([^;\)]*)/;matches=pattern.exec(agentString);browserInfo.os=matches[1];break;case'konqueror':pattern=/Konqueror[^;]*;\s*([^;\)]*)/;matches=pattern.exec(agentString);browserInfo.os=matches[1];break;case'safari':pattern=/Version\/([^ ]*)/;matches=pattern.exec(agentString);if(matches&&matches[1])
{matches=pattern.exec(agentString);browserInfo.version=matches&&matches[1];}
else
{pattern=/CriOS\/([^ ]*)/;matches=pattern.exec(agentString);if(matches&&matches[1])
{matches=pattern.exec(agentString);browserInfo.version=matches&&matches[1];browserInfo.browser='Chrome';}}
if(agentString.indexOf('iPhone')!=-1)
{browserInfo.browser+=' iPhone';}
if(agentString.indexOf('iPad')!=-1)
{browserInfo.browser+=' iPad';}
case'firefox':default:handleDefaultOS();break;}
if(browserInfo.os)
{browserInfo.os=browserInfo.os.replace(/^\s+|\s+$/g,'');}
browserInfo.resolution={x:screen.width,y:screen.height};browserInfo.java=navigator.javaEnabled()?1:0;browserInfo.flashVersion=this.Flash.GetSwfVer();if(browserInfo.flashVersion&&browserInfo.flashVersion.replace)
{browserInfo.flashVersion=browserInfo.flashVersion.replace(/,/g,'.');browserInfo.flashVersion=browserInfo.flashVersion.replace(/WIN /g,'');}
return browserInfo;},getBrowserInfo:function()
{if(!this.cachedBrowserInfo)
this.cachedBrowserInfo=this._parseUserAgent();return this.cachedBrowserInfo;},getCurrentPosition:function(callback)
{var timeout=10000;var maximumAge=60000;var highAccuracyOpts={enableHighAccuracy:true,timeout:timeout,maximumAge:maximumAge};var mediumAccuracyOpts={enableHighAccuracy:false,timeout:timeout,maximumAge:maximumAge};var mediumAccuracySuccess=function(pos){var returnData={accuracy:pos.coords.accuracy||-1,latitude:pos.coords.latitude,longitude:pos.coords.longitude};this.getBrowserInfo();this.cachedBrowserInfo.locationaccuracy=returnData.accuracy;this.cachedBrowserInfo.latitude=returnData.latitude;this.cachedBrowserInfo.longitude=returnDataos.longitude;if(callback)
callback(returnData);}.bind(this);var mediumAccuracyError=function(pos){this.getBrowserInfo();this.cachedBrowserInfo.locationerror=pos.code;if(callback)
callback({error:pos.code});}.bind(this);var highAccuracySuccess=function(pos){var returnData={accuracy:pos.coords.accuracy||-1,latitude:pos.coords.latitude,longitude:pos.coords.longitude};this.getBrowserInfo();this.cachedBrowserInfo.locationaccuracy=returnData.accuracy;this.cachedBrowserInfo.latitude=returnData.latitude;this.cachedBrowserInfo.longitude=returnData.longitude;if(callback)
callback(returnData);}.bind(this);var highAccuracyError=function(pos){this.geoPosition.getCurrentPosition(mediumAccuracySuccess,mediumAccuracyError,mediumAccuracyOpts);}.bind(this);if(!this.geoPosition.getCurrentPosition(highAccuracySuccess,highAccuracyError,highAccuracyOpts))
{this.getBrowserInfo();this.cachedBrowserInfo.locationerror=1;callback({locationerror:1});}},geoPosition:function()
{var pub={};var provider=null;var u="undefined";var getCurrentPosition;pub.getCurrentPosition=function(success,error,opts)
{try
{var hasGeolocation=typeof(navigator.geolocation)!=u;if(!hasGeolocation)
{if(!confirm('Qualtrics wants to use your location.\nDo you want to allow it?')())
{return false;}}
if((typeof(geoPositionSimulator)!=u)&&(geoPositionSimulator.length>0))
{provider=geoPositionSimulator;}
else if(typeof(bondi)!=u&&typeof(bondi.geolocation)!=u)
{provider=bondi.geolocation;}
else if(hasGeolocation)
{provider=navigator.geolocation;getCurrentPosition=function(success,error,opts)
{function _success(p)
{var params;if(typeof(p.latitude)!=u)
{params={timestamp:p.timestamp,coords:{latitude:p.latitude,longitude:p.longitude}};}
else
{params=p;}
success(params);}
provider.getCurrentPosition(_success,error,opts);};}
else if(typeof(window.blackberry)!=u&&blackberry.location.GPSSupported)
{if(typeof(blackberry.location.setAidMode)==u)
{return false;}
blackberry.location.setAidMode(2);getCurrentPosition=function(success,error,opts)
{var bb={success:0,error:0,blackberryTimeoutId:-1};function handleBlackBerryLocationTimeout()
{if(bb.blackberryTimeoutId!=-1)
{bb.error({message:"Timeout error",code:3});}}
bb.success=success;bb.error=error;if(opts['timeout'])
{bb.blackberryTimeoutId=setTimeout(handleBlackBerryLocationTimeout,opts['timeout']);}
else
{bb.blackberryTimeoutId=setTimeout(handleBlackBerryLocationTimeout,60000);}
blackberry.location.onLocationUpdate(function()
{clearTimeout(bb.blackberryTimeoutId);bb.blackberryTimeoutId=-1;if(bb.success&&bb.error)
{if(blackberry.location.latitude==0&&blackberry.location.longitude==0)
{bb.error({message:"Position unavailable",code:2});}
else
{var timestamp=null;if(blackberry.location.timestamp)
{timestamp=new Date(blackberry.location.timestamp);}
bb.success({timestamp:timestamp,coords:{latitude:blackberry.location.latitude,longitude:blackberry.location.longitude}});}
bb.success=null;bb.error=null;}});blackberry.location.refreshLocation();};provider=blackberry.location;}
else if(typeof(Mojo)!=u&&typeof(Mojo.Service.Request)!="Mojo.Service.Request")
{provider=true;getCurrentPosition=function(success,error,opts)
{parameters={};if(opts)
{if(opts.enableHighAccuracy&&opts.enableHighAccuracy==true)
{parameters.accuracy=1;}
if(opts.maximumAge)
{parameters.maximumAge=opts.maximumAge;}
if(opts.responseTime)
{if(pts.responseTime<5)
{parameters.responseTime=1;}
else if(opts.responseTime<20)
{parameters.responseTime=2;}
else
{parameters.timeout=3;}}}
r=new Mojo.Service.Request('palm://com.palm.location',{method:"getCurrentPosition",parameters:parameters,onSuccess:function(p)
{success({timestamp:p.timestamp,coords:{latitude:p.latitude,longitude:p.longitude,heading:p.heading}});},onFailure:function(e)
{if(e.errorCode==1)
{error({code:3,message:"Timeout"});}
else if(e.errorCode==2)
{error({code:2,message:"Position unavailable"});}
else
{error({code:0,message:"Unknown Error: webOS-code"+errorCode});}}});};}
else if(typeof(device)!=u&&typeof(device.getServiceObject)!=u)
{provider=device.getServiceObject("Service.Location","ILocation");getCurrentPosition=function(success,error,opts)
{function callback(transId,eventCode,result)
{if(eventCode==4)
{error({message:"Position unavailable",code:2});}
else
{success({timestamp:null,coords:{latitude:result.ReturnValue.Latitude,longitude:result.ReturnValue.Longitude,altitude:result.ReturnValue.Altitude,heading:result.ReturnValue.Heading}});}}
var criteria=new Object();criteria.LocationInformationClass="BasicLocationInformation";provider.ILocation.GetLocation(criteria,callback);};}
else{provider=false;}
if(provider&&getCurrentPosition)
{getCurrentPosition(success,error,opts);return true;}else{return false;}}
catch(e)
{if(typeof(console)!=u)console.log(e);return false;}
return provider!=null;};return pub;}()},cumulativeScrollOffset:function(element)
{var scrollElement=element;var scrollOffset=[0,0];do{if(scrollElement.nodeName!=='HTML'&&scrollElement.nodeName!=='BODY')
{scrollOffset[0]+=scrollElement.scrollLeft||0;scrollOffset[1]+=scrollElement.scrollTop||0;}
scrollElement=scrollElement.parentNode;}while(scrollElement);return scrollOffset;},isFixed:function(element)
{try
{var position=$(element).getStyle('position');}
catch(e)
{position=element.style.position;}
try
{var offsetParent=element.offsetParent;}
catch(e)
{offsetParent=document.body;}
return(!!element)&&(element.style&&position=='fixed'||offsetParent&&QualtricsTools.isFixed(offsetParent));},addToHiddenHelper:function(element)
{var hidden=$('QHiddenHelper');if(!hidden)
{hidden=QBuilder('div',{id:'QHiddenHelper'});document.body.appendChild(hidden);}
hidden.appendChild($(element));},getSurveySelectMenu:function(opt_filter,opt_action)
{opt_filter=(opt_filter==="")?undefined:opt_filter;if(!opt_action)
{opt_action='PageAction(setActiveSurvey, $surveyId)';}
var items=[];if(Qualtrics.folders&&opt_filter===undefined&&!Object.isArray(Qualtrics.folders['SurveyFolders']))
{folderOrdering=[];for(var folderId in Qualtrics.folders['SurveyFolders'])
{folderOrdering.push({'id':folderId,'name':Qualtrics.folders['SurveyFolders'][folderId]});}
folderOrdering.sort(function(a,b){var lowerA=a['name'].toLowerCase();var lowerB=b['name'].toLowerCase();if(lowerA<lowerB)return-1;if(lowerA==lowerB)return 0;if(lowerA>lowerB)return 1;});for(var i=0;i<folderOrdering.length;++i)
{var folderId=folderOrdering[i]['id'];var subMenuItems=[];for(var surveyId in Qualtrics.folders['Surveys'])
{if(typeof Qualtrics.folders['Surveys'][surveyId]=='function')
{continue;}
var containingFolderId=Qualtrics.folders['Surveys'][surveyId];if(folderId==containingFolderId&&Qualtrics.surveys[surveyId])
{var current_action=opt_action.replace('$surveyId',surveyId);subMenuItems.push({label:Qualtrics.surveys[surveyId],action:current_action,className:'Survey',defer:true});}}
var item={label:Qualtrics.folders['SurveyFolders'][folderId],className:'Folder',submenu:{items:subMenuItems}};items.push(item);}
items.push({separator:true});}
for(surveyId in Qualtrics.surveys)
{if(!Qualtrics.surveys.hasOwnProperty(surveyId))
{continue;}
var inFolder=Qualtrics.folders&&Qualtrics.folders['Surveys']&&Qualtrics.folders['Surveys'][surveyId];var showMenu=!inFolder;if(opt_filter!==undefined)
{showMenu=(Qualtrics.surveys[surveyId].toLowerCase().indexOf(opt_filter.toLowerCase())!=-1);}
if(showMenu)
{var current_action=opt_action.replace('$surveyId',surveyId);item={label:Qualtrics.surveys[surveyId],action:current_action,className:'Survey',defer:true};items.push(item);}}
var searchValue=opt_filter||getMessage('EditSection','SearchExistingSurveys')+"...";var surveySelectMenuDef={items:items,searchText:searchValue,search:'QualtricsTools.getSurveySelectMenu($search, '+opt_action+')'};return surveySelectMenuDef;},surveySelectKeyDownHandler:function(el,evt,callback)
{if(Qualtrics.Navigation.subSection=='Blocks')
{if(evt&&evt.shiftKey&&(evt.ctrlKey||evt.metaKey))
{if(evt.preventDefault)
evt.preventDefault();return QModules.loadModule('supportmode.js');}}
Qualtrics.Menu.showMenu(callback,el,null,evt);},decToHexString:function(dec,includeHash)
{if(typeof dec=='string'&&dec.substr(0,1)=='#')
{return dec;}
var hex=dec.toString(16);hex=QualtricsTools.leftPadString(hex,'0',6);return(includeHash===false?'':'#')+hex.toUpperCase();},hexStringToDec:function(hex)
{return parseInt(QualtricsTools.stripHash(hex),16);},hexStringToRgb:function(hex)
{hex=QualtricsTools.stripHash(hex);var splitHex=hex.match(/.{1,2}/g);var rgb=[];for(var i=0;i<splitHex.length;i++)
{rgb.push(parseInt(splitHex[i],16));}
return rgb;},rgbToHexString:function(rgb,includeHash)
{var hex=(includeHash===false)?'':'#';for(var i=0;i<rgb.length;i++)
{var val=Math.round(rgb[i]);if(val<0)
val=0;else if(val>255)
val=255;val=QualtricsTools.leftPadString(val.toString(16),'0',2);hex+=val.toUpperCase();}
return hex;},hexStringToHsv:function(hex)
{var rgb=QualtricsTools.hexStringToRgb(hex);return QualtricsTools.rgbToHsv(rgb);},hsvToHexString:function(hsv,includeHash)
{var rgb=QualtricsTools.hsvToRgb(hsv);return QualtricsTools.rgbToHexString(rgb,includeHash);},hsvToRgb:function(hsv)
{var rgb=[0,0,0];if(hsv[2]!=0)
{var i=Math.floor(hsv[0]*6);var f=(hsv[0]*6)-i;var p=hsv[2]*(1-hsv[1]);var q=hsv[2]*(1-(hsv[1]*f));var t=hsv[2]*(1-(hsv[1]*(1-f)));switch(i)
{case 1:rgb[0]=q;rgb[1]=hsv[2];rgb[2]=p;break;case 2:rgb[0]=p;rgb[1]=hsv[2];rgb[2]=t;break;case 3:rgb[0]=p;rgb[1]=q;rgb[2]=hsv[2];break;case 4:rgb[0]=t;rgb[1]=p;rgb[2]=hsv[2];break;case 5:rgb[0]=hsv[2];rgb[1]=p;rgb[2]=q;break;case 6:case 0:rgb[0]=hsv[2];rgb[1]=t;rgb[2]=p;break;}}
for(var index=0;index<rgb.length;index++)
{rgb[index]*=256;}
return rgb;},rgbToHsv:function(rgb)
{var max=rgb.max();var min=rgb.min();var hsv=[0,0,(max/256)];if(min!=max)
{var delta=max-min;hsv[1]=delta/max;if(rgb[0]==max)
{hsv[0]=(rgb[1]-rgb[2])/delta;}
else if(rgb[1]==max)
{hsv[0]=2+((rgb[2]-rgb[0])/delta);}
else
{hsv[0]=4+((rgb[0]-rgb[1])/delta);}
hsv[0]/=6;if(hsv[0]<0)
{hsv[0]+=1;}
if(hsv[0]>1)
{hsv[0]-=1;}}
return hsv;},darkenColor:function(hex,amount)
{var rgb=QualtricsTools.hexStringToRgb(hex);var hsv=QualtricsTools.rgbToHsv(rgb);var hueAdjustment=0;if(hsv[0]<0.15)
{hueAdjustment=(hsv[0]/2);hsv[0]-=hueAdjustment;}
var valueFactor=amount;hsv[2]=(hsv[2]-valueFactor)+hueAdjustment;if(hsv[2]<0){hsv[2]=0;}
rgb=QualtricsTools.hsvToRgb(hsv);return QualtricsTools.rgbToHexString(rgb,true);},lightenColor:function(hex,amount)
{var rgb=QualtricsTools.hexStringToRgb(hex);var hsv=QualtricsTools.rgbToHsv(rgb);var hueAdjustment=0;if(hsv[0]<0.15)
{hueAdjustment=(hsv[0]/2);hsv[0]-=hueAdjustment;}
var valueFactor=Number(amount);hsv[2]=(hsv[2]+valueFactor)+hueAdjustment;if(hsv[2]>1){hsv[2]=1;}
rgb=QualtricsTools.hsvToRgb(hsv);return QualtricsTools.rgbToHexString(rgb,true);},fadeColor:function(hex,amount)
{var rgb=QualtricsTools.hexStringToRgb(hex);var hsv=QualtricsTools.rgbToHsv(rgb);var hueAdjustment=0;if(hsv[0]<0.15)
{hueAdjustment=(hsv[0]/2);hsv[0]-=hueAdjustment;}
var saturationFactor=1-amount;hsv[1]=(hsv[1]-(saturationFactor));if(hsv[1]<0){hsv[1]=0;}
var valueFactor=(Number(amount));hsv[2]=(hsv[2]+(valueFactor));if(hsv[2]>1){hsv[2]=1;}
rgb=QualtricsTools.hsvToRgb(hsv);return QualtricsTools.rgbToHexString(rgb,true);},stripHash:function(hex)
{return(hex.substr(0,1)=='#')?hex=hex.substr(1):hex;},leftPadString:function(string,pad,length)
{while(string.length<length)
{string=pad+string;}
return string;},getColorComplement:function(color)
{if(typeof color=='number')
{color=QualtricsTools.decToHexString(color,true);}
var hasHash=(color.substr(0,1)=='#');var hsv=QualtricsTools.hexStringToHsv(color);if(hsv[2]==0)
{hsv[2]=0.999;}
else if(hsv[2]<0.3)
{hsv[2]*=1.8;}
else
{hsv[2]*=0.2;}
return QualtricsTools.hsvToHexString(hsv,hasHash);},getQueryVariable:function(URL,paramToFind)
{var questionMark=URL.split('?');if(questionMark.length!=2)
return null;var vars=questionMark[1].split('&');for(var i=0;i<vars.length;i++)
{var pair=vars[i].split('=');if(decodeURIComponent(pair[0])===paramToFind)
return decodeURIComponent(pair[1]);}
return null;},isArray:function(v,opt_andNotEmpty)
{return v&&Object.prototype.toString.call(v)==="[object Array]"&&(!opt_andNotEmpty||v.length);},isObject:function(v,opt_andNotEmpty)
{return v&&Object.prototype.toString.call(v)==="[object Object]"&&(!opt_andNotEmpty||Object.keys(v).length);},arraySum:function(arrayOfNumbers)
{if(!QualtricsTools.isArray(arrayOfNumbers))return false;if(!arrayOfNumbers.length)return 0;if(arrayOfNumbers.length==1)return arrayOfNumbers[0];var len=arrayOfNumbers.length,sum=0;for(var i=0;i<len;++i)
{sum+=arrayOfNumbers[i];}
return sum;},arrayMean:function(arrayOfNumbers)
{if(!QualtricsTools.isArray(arrayOfNumbers))return false;if(!arrayOfNumbers.length)return 0;if(arrayOfNumbers.length==1)return arrayOfNumbers[0];return QualtricsTools.arraySum(arrayOfNumbers)/arrayOfNumbers.length;},arrayMedian:function(arrayOfNumbers)
{if(!QualtricsTools.isArray(arrayOfNumbers))return false;if(!arrayOfNumbers.length)return 0;if(arrayOfNumbers.length==1)return arrayOfNumbers[0];var arr=$(arrayOfNumbers).clone().sort(function(a,b){return a-b});var medIndex=(arr.length-1)/2;var flr=Math.floor(medIndex);return(medIndex===flr)?arr[flr]:(arr[flr]+arr[flr+1])/2;},arrayVariance:function(arrayOfNumbers)
{if(!QualtricsTools.isArray(arrayOfNumbers))return false;if(!arrayOfNumbers.length||arrayOfNumbers.length==1)return 0;var mean=QualtricsTools.arrayMean(arrayOfNumbers);var i=arrayOfNumbers.length,v=0;while(i--){v+=Math.pow((arrayOfNumbers[i]-mean),2);}
return v/arrayOfNumbers.length;},arrayStdDev:function(arrayOfNumbers)
{if(!QualtricsTools.isArray(arrayOfNumbers))return false;if(!arrayOfNumbers.length||arrayOfNumbers.length==1)return 0;return Math.sqrt(QualtricsTools.arrayVariance(arrayOfNumbers));},arrayMerge:function()
{var arrays=Array.prototype.slice.call(arguments);var a=[];for(var i=0,len=arrays.length;i<len;++i)
{var array=arrays[i];for(var j=0,jlen=array.length;j<jlen;++j)
{if($(a).indexOf(array[j])===-1)
{a.push(array[j]);}}}
return a;},filterForDisplay:function(value)
{if(typeof value=='string')
{var text=value;text=text.stripScripts();text=text.replace(/<meta\s[^>]*>/g,'');text=this.removeInlineJavascript(text,'onclick');text=this.removeInlineJavascript(text,'onload');text=this.removeInlineJavascript(text,'onerror');return text;}
else
{return value;}},removeInlineJavascript:function(text,attribute)
{var regexWithQuotes=new RegExp('(<\\w+[^>]*'+attribute+'\\s*=\\s*)("|\')((?:[^\\2\\\\]|\\\\.)*?)\\2([^>]*>)','gi');var regexWithOutQuotes=new RegExp('(<\\w+[^>]*'+attribute+'\\s*=\\s*)[^\\s>]+([^>]*>)','gi');return text.replace(regexWithQuotes,'$1$2$2$4').replace(regexWithOutQuotes,'$1""$2');}};window.getPageSize=QualtricsTools.getPageSize;function deleteChildren(node)
{if(node)
{if(!Qualtrics.Browser.IE)
{node.innerHTML="";}
else
{for(var x=node.childNodes.length-1;x>=0;--x)
{var childNode=node.childNodes[x];if(childNode.onmouseover)
{childNode.onmouseover=null;}
if(childNode.onmouseout)
{childNode.onmouseout=null;}
if(childNode.onmousedown)
{childNode.onmousedown=null;}
if(childNode.onclick)
{childNode.onclick=null;}
if(childNode.hasChildNodes()){deleteChildren(childNode);}
node.removeChild(childNode);if(childNode.outerHTML){childNode.outerHTML='';}
childNode=null;}
node=null;}}}
var QualtricsSETools={highlightOn:false,killHighlight:false,highlightRegistry:[],unHighlightAll:function()
{for(var i=0,len=QualtricsSETools.highlightRegistry.length;i<len;++i)
{var questionNode=QualtricsSETools.highlightRegistry[i];$(questionNode).removeClassName('Highlight');questionNode=null;}
QualtricsSETools.highlightRegistry=[];},highlightHandler:function(evt)
{QualtricsSETools.unHighlightAll();if(QualtricsSETools.highlightOn==true)
{var clickedEl=Event.element(evt);var questionNode=QualtricsTools.fastUp(clickedEl,'QuestionOuter');if(questionNode)
{QualtricsSETools.highlightRegistry.push(questionNode);$(questionNode).addClassName('Highlight');}
questionNode=null;clickedEl=null;}},questionHighlighter:function()
{if(!this.highlightOn)
{Event.observe(document,'mousedown',QualtricsSETools.highlightHandler);if(!this.killHighlight)
this.highlightOn=true;}},killHighlighter:function()
{this.killHighlight=true;},scrollToDiv:function(id)
{new Effect.ScrollTo(id,{afterFinish:function(){try{var p=$(id);found=false;while(!found)
{p=$(p.nextSibling);if(p==null)
found=true;else if(p.hasClassName&&p.hasClassName('QuestionOuter'))
found=true;}
if(p)
{new Effect.Highlight(p);}}
catch(e)
{console.error(e);}}});},replaceButtons:function()
{var next=$('NextButton');var save=$('SaveButton');var prev=$('PreviousButton');var jump=$('JumpButton');var parentNode=next?next.parentNode:(prev?prev.parentNode:null);if(parentNode)
{var innerHTML="<input type=hidden id='buttonPressed' name='' value='1' />";if(next)
{innerHTML+="<button style=\"display: none;\" id=\"submitPageFeauBTN\" type=\"submit\"></button>"+"<div tabindex='0' id='NextButton' role='button' aria-labelledby='NextLabel' onkeypress=\"if(!this.disabled){Qualtrics.SurveyEngine.navEnter(arguments[0],this, 'NextButton'); };  \" onclick=\"if(!this.disabled){Qualtrics.SurveyEngine.navClick(this, 'NextButton'); };  \">"
+"<label id='NextLabel' class='offScreen'>Next</label><span class='ButtonLeft'></span><span class='ButtonText' id='NextButtonText'>"+next.value+"</span><span class='ButtonRight'></span></div>";}
if(save)
{innerHTML+="<button style=\"display: none;\" id=\"submitPageFeauBTN\" type=\"submit\"></button>"+"<div tabindex='0' id='SaveButton' role='button' aria-labelledby='SaveLabel' onkeypress=\"if(!this.disabled){Qualtrics.SurveyEngine.navEnter(arguments[0],this, 'SavePageButton'); };  \" onclick=\"if(!this.disabled){Qualtrics.SurveyEngine.navClick(this, 'SavePageButton'); };  \">"
+"<label id='SaveLabel' class='offScreen'>Save</label><span class='ButtonLeft'></span><span class='ButtonText' id='SaveButtonText'>"+save.value+"</span><span class='ButtonRight'></span></div>";}
if(prev)
{innerHTML+="<button style=\"display: none;\" id=\"submitPageFeauBTN\" type=\"submit\"></button>"+"<div tabindex='0' id='PreviousButton' role='button' aria-labelledby='PreviousLabel' onkeypress=\"if(!this.disabled){Qualtrics.SurveyEngine.navEnter(arguments[0],this, 'PreviousButton'); };  \" onclick=\"if(!this.disabled){Qualtrics.SurveyEngine.navClick(this, 'PreviousButton');};  \">"
+"<label id='PreviousLabel' class='offScreen' >Previous</label><span class='ButtonLeft'></span><span class='ButtonText' id='PreviousButtonText'>"+prev.value+"</span><span class='ButtonRight'></span></div>";}
if(jump)
{innerHTML+="<button style=\"display: none;\" id=\"submitPageFeauBTN\" type=\"submit\"></button>"+"<div tabindex='0' class='"+jump.className+"' id='JumpButton' role='button' aria-labelledby='JumpLabel' onkeypress=\"if(!this.disabled){Qualtrics.SurveyEngine.navEnter(arguments[0],this, 'JumpButton'); };  \" onclick=\"if(!this.disabled){Qualtrics.SurveyEngine.navClick(this, 'JumpButton'); };  \">"
+"<label id='JumpLabel' class='offScreen'>Table of Contents</label><span class='ButtonLeft'></span><span class='ButtonText' id='JumpButtonText'>"+jump.value+"</span><span class='ButtonRight'></span></div>";innerHTML+="<input type='hidden' value='' name='JumpIndex' id='JumpIndex'>";}
parentNode.innerHTML=innerHTML;return;if(next)
{parentNode.removeChild(next);var newNext=QBuilder('button',{type:'submit',id:'NextButton'},[QBuilder('span',{className:'ButtonLeft'}),QBuilder('span',{className:'ButtonText'},[next.value]),QBuilder('span',{className:'ButtonRight'})]);parentNode.appendChild(newNext);newNext.onclick=function()
{$('buttonPressed').name='NextButton';};}
if(prev)
{parentNode.removeChild(prev);var newPrev=QBuilder('button',{type:'submit',id:'PreviousButton'},[QBuilder('span',{className:'ButtonLeft'}),QBuilder('span',{className:'ButtonText'},[prev.value]),QBuilder('span',{className:'ButtonRight'})]);parentNode.appendChild(newPrev);newPrev.onclick=function()
{$('buttonPressed').name='PreviousButton';};}}}};var QHeatMap=Class.create({clickedPoint:null,clickCounter:1,clickHistory:1,maxClicks:1,id:null,showRegions:false,_imgWidth:null,_imgHeight:null,initialize:function(id,opt_maxClicks,opt_showRegions,opt_regions)
{this.id=id;var that=this;if(opt_maxClicks)
this.maxClicks=opt_maxClicks;this.showRegions=opt_showRegions||false;this.regions=opt_regions;this.clickdownFunction=this.clickdown.bind(this);this.clickupFunction=this.clickup.bind(this);Event.observe($(this.id+"_Container"),'mousedown',that.clickdownFunction);Event.observe($(this.id+"_Container"),'mouseup',that.clickupFunction);this.imageContainer=$(this.id+"_Container");this.image=$(this.id);var imageLoaded=false;var tempImage=new Image();tempImage.src=this.image.src;var tempImageLoaded=false;var imageLoadedCallback=function(){if(imageLoaded&&tempImageLoaded){this.imageLoaded();}}.bind(this);if(this.image.complete)
{imageLoaded=true;imageLoadedCallback();}
else
{this.image.onload=function()
{imageLoaded=true;imageLoadedCallback();};}
if(tempImage.complete)
{tempImageLoaded=true;this._imgWidth=tempImage.width;this._imgHeight=tempImage.height;imageLoadedCallback();}
else
{tempImage.onload=function()
{tempImageLoaded=true;this._imgWidth=tempImage.width;this._imgHeight=tempImage.height;imageLoadedCallback();}.bind(this);}},imageLoaded:function()
{try
{if($F(this.id+'_ClickY')&&$F(this.id+'_ClickX'))
{this.presetPoint($F(this.id+'_ClickX'),$F(this.id+'_ClickY'));}}
catch(e)
{}
try
{for(var click=1;click<=this.maxClicks;click++)
{if($F(this.id+'_Click_'+click))
{var xy=$F(this.id+'_Click_'+click).split(",");this.presetPoint(xy[0],xy[1]);}}}
catch(e)
{}
if(this.showRegions)
{this.renderRegions();}},renderRegions:function(){var options={selectable:false,enableDescriptions:false,style:{}};var regionContainer=$(this.id+'_Regions');regionContainer.setStyle({width:$(this.image).getWidth()+'px',height:$(this.image).getHeight()+'px'});var ret=new Qualtrics.RegionEditor($(this.id+'_Regions'),null,this.regions,options);if(!window.Raphael||!Raphael.type)
ret.element.setStyle({display:'block'});ret.render();},clickdown:function(event)
{Event.stop(event);},drawCrossHair:function()
{var height=$(this.image).offsetHeight;var width=$(this.image).offsetWidth;var horiz=QBuilder('div',{id:this.id+'_chh_'+this.clickCounter,className:'chh'},' ');var vert=QBuilder('div',{id:this.id+'_chv_'+this.clickCounter,className:'chv'},' ');$(horiz).setStyle({width:width+'px',top:'0px',left:'0px',opacity:0.6});$(vert).setStyle({height:height+'px',top:'0px',left:'0px',opacity:0.6});$(this.imageContainer).appendChild(horiz);$(this.imageContainer).appendChild(vert);},setPoint:function(event)
{if(!event)event=window.event;var pointerX=event.offsetX||event.layerX;var pointerY=event.offsetY||event.layerY;var element=Event.element(event);if(element.id.startsWith(this.id+'_chh'))
{pointerY=element.offsetTop;}
if(element.id.startsWith(this.id+'_chv'))
{pointerX=element.offsetLeft;}
var pointID=this.id+"_Point_"+this.clickCounter;var realX=pointerX;var realY=pointerY;this.clickedPoint=this.generatePoint(pointID,realX,realY);this.imageContainer.appendChild(this.clickedPoint);return[realX,realY];},generatePoint:function(id,x,y)
{if(!$(id))
{var point=QBuilder('div',{id:id,className:'point'});this.imageContainer.appendChild(point);}
else
{point=$(id);}
point.setStyle({top:y-2+'px',left:x-2+'px'});point.setAttribute('x',x);point.setAttribute('y',y);return point;},presetPoint:function(x,y)
{var pointID=this.id+"_Point_"+this.clickCounter;var xy=this.translateCoordinates(x,y);var realX=xy.x;var realY=xy.y;this.clickedPoint=this.generatePoint(pointID,realX,realY);var loc=[realX,realY];if(!$(this.id+'_chh_'+this.clickCounter))
{this.drawCrossHair();}
new Effect.Morph(this.id+'_chh_'+this.clickCounter,{transition:this.EaseFrom,duration:0.5,style:{top:loc[1]+'px'}});new Effect.Morph(this.id+'_chv_'+this.clickCounter,{transition:this.EaseFrom,duration:0.5,style:{left:loc[0]+'px'}});this.recordClick();this.clickCounter=(this.clickCounter%this.maxClicks)+1;this.clickedPoint=null;},clickup:function(event)
{if(!event)event=window.event;var element=Event.element(event);if(this.isValidClick(element))
{var loc=this.setPoint(event);if(!$(this.id+'_chh_'+this.clickCounter))
{this.drawCrossHair();}
new Effect.Morph(this.id+'_chh_'+this.clickCounter,{transition:this.EaseFrom,duration:0.5,style:{top:loc[1]+'px'}});new Effect.Morph(this.id+'_chv_'+this.clickCounter,{transition:this.EaseFrom,duration:0.5,style:{left:loc[0]+'px'}});this.recordClick();this.clickCounter=(this.clickCounter%this.maxClicks)+1;this.clickedPoint=null;}},isValidClick:function(element)
{var isValid=false;if(element==this.image&&this._imgWidth&&this._imgHeight)
isValid=true;else if(element.id.indexOf('chh')!==-1||element.id.indexOf('chv')!==-1)
isValid=true;return isValid;},EaseFrom:function(pos){return Math.pow(pos,2);},translateCoordinates:function(x,y,getOriginal)
{var op=function(a,b){return a*b;};if(getOriginal){op=function(a,b){return a/b;};}
x=Math.round(op(x,this._getRatioX()));y=Math.round(op(y,this._getRatioY()));return{x:x,y:y};},_getImgWidth:function(){if(!this._imgWidth){return this.image.getWidth();}
return this._imgWidth;},_getImgHeight:function(){if(!this._imgHeight){return this.image.getHeight();}
return this._imgHeight;},_getRatioX:function(){return this.image.getWidth()/this._getImgWidth();},_getRatioY:function(){return this.image.getHeight()/this._getImgHeight();},recordClick:function()
{if(this.clickedPoint)
{var x=this.clickedPoint.getAttribute('x');var y=this.clickedPoint.getAttribute('y');var xy=this.translateCoordinates(x,y,true);x=xy.x;y=xy.y;try
{var clickData=$(this.id+'_Click_'+this.clickCounter);clickData.value=x+","+y;}
catch(e)
{var clickX=$(this.id+'_ClickX');var clickY=$(this.id+'_ClickY');clickX.value=x;clickY.value=y;}}}});var QHotSpot={selectRegion:function(selector,postTagChoiceId)
{if(selector=='OnOff')
{if($(postTagChoiceId).value==1)
{$(postTagChoiceId).value=2;$(postTagChoiceId+'-Region').addClassName('Like');}
else
{$(postTagChoiceId).value=1;$(postTagChoiceId+'-Region').removeClassName('Like');}}
else if(selector=='LikeDislike')
{$(postTagChoiceId+'-Region').removeClassName('Like');$(postTagChoiceId+'-Region').removeClassName('Dislike');if($(postTagChoiceId).value==1)
{$(postTagChoiceId).value=2;}
else if($(postTagChoiceId).value==2)
{$(postTagChoiceId).value=3;$(postTagChoiceId+'-Region').addClassName('Like');}
else
{$(postTagChoiceId).value=1;$(postTagChoiceId+'-Region').addClassName('Dislike');}}
else
{console.log("WARNING: HotSpot.tpl::Unknown selector: '+selector+'");}},autoSizeRegions:function(imgId)
{var img=$(imgId);if(img)
{var hotSpotContainer=img.parentNode;if(hotSpotContainer&&hotSpotContainer.getAttribute('hotspotwidth'))
{var originalDimensions=[hotSpotContainer.getAttribute('hotspotwidth'),hotSpotContainer.getAttribute('hotspotheight')];var currentDimensions=[img.offsetWidth,img.offsetHeight];var ratio=[currentDimensions[0]/originalDimensions[0],currentDimensions[1]/originalDimensions[1]];if(ratio[0]!=1||ratio[1]!=1)
{var children=$(hotSpotContainer).childElements();var regions=[];for(var i=0,len=children.length;i<len;++i)
{if(children[i].nodeName=='A')
{regions.push(children[i]);QHotSpot.adjustRegion(children[i],ratio);}}}}}},adjustRegion:function(regionNode,ratio)
{$(regionNode).setStyle({left:regionNode.offsetLeft*ratio[0]+'px',top:regionNode.offsetTop*ratio[1]+'px'});var innerInner=$(regionNode).down('.RegionInnerInner');if(innerInner)
{$(innerInner).setStyle({width:innerInner.offsetWidth*ratio[0]+'px',height:innerInner.offsetHeight*ratio[1]+'px'});}}};var QHotSpot2={createRegionEditor:function(holderEl,regions,postTag,selector,visibility,size)
{var options={selectable:true,enableDescriptions:false,onSelect:QHotSpot2.selectRegion,style:{}};if(selector=="OnOff")
{options.selectionStates=[{fill:'rgb(0, 0, 0)','fill-opacity':0,iconSrc:null},{fill:'rgb(0%, 100%, 0%)','fill-opacity':.3,iconSrc:null}];}
else
{options.selectionStates=[{fill:'rgb(100%, 0%, 0%)','fill-opacity':.3,iconSrc:"../WRQualtricsShared/Graphics/icons/x_trans.png"},{fill:'rgb(0, 0, 0)','fill-opacity':0,iconSrc:null},{fill:'rgb(0%, 100%, 0%)','fill-opacity':.3,iconSrc:"../WRQualtricsShared/Graphics/icons/check_trans.png"}];}
if(visibility=="HiddenUntilHover"||!visibility)
{options.style.shape={stroke:"none",'stroke-opacity':0,'stroke-width':.75,fill:"none"};options.style.shapeHover={stroke:"#000",'stroke-opacity':1,'stroke-width':1.5};options.style.shapeGlowOpacity=0;}
var ret=new Qualtrics.RegionEditor(holderEl,null,regions,options);ret.postTag=postTag;if(!window.Raphael||!Raphael.type)
ret.element.setStyle({display:'block'});ret.render();var image=$("HotSpot_"+postTag+"_Image");if(image.complete)
{QHotSpot2.renderRegion.defer(postTag,size);}
else
{Event.observe(image,'load',QHotSpot2.renderRegion.curry(postTag,size));}
this.readSelectionsFromInputs(ret);return ret;},readSelectionsFromInputs:function(editor)
{var regions=editor.getRegions();for(var regionId=0;regionId<regions.length;++regionId)
{var v=+$("QR~"+editor.postTag+"~"+regions[regionId].ChoiceID).value;editor.selectRegion(regionId,v-1);}},renderRegion:function(postTag,originalSize)
{var re=window.regionEditors[postTag];var img=$("HotSpot_"+postTag+"_Image");var layout=new Element.Layout(img);re.element.setStyle(layout.toCSS());re.rescaleRegions(originalSize,{w:layout.get('width'),h:layout.get('height')});re.render();re.element.setStyle({display:'block'});},selectRegion:function(editor,regionId)
{var choiceId=editor.getRegionProperty(regionId,"ChoiceID");$("QR~"+editor.postTag+"~"+choiceId).value=editor.selectedRegions[regionId]+1;}};if(Qualtrics.ofcData==undefined)
Qualtrics.ofcData={};if(Qualtrics.ofcImages==undefined)
Qualtrics.ofcImages={};Qualtrics.ofcGetData=function(id)
{return Qualtrics.ofcData[id];};function ofc_ready(chart_id)
{Element.fire(document,"OFC:ofc_ready_"+chart_id[0]);}
function ofc_stoped_animating(chart_id)
{Element.fire(document,"Event:ofc_stoped_animating_"+chart_id[0]);}
function html5Store(key,item)
{if('localStorage'in window&&window.localStorage!==null)
{window.localStorage[key]=Object.toJSON(item);return true;}
return false;}
function html5Retrieve(key,opt_default)
{var item=opt_default;if('localStorage'in window&&window.localStorage!==null&&key in window.localStorage)
item=Qualtrics.parseJSON(window.localStorage[key],true);return item;}
function save_image(imageId)
{imageId=imageId[0];var eId=$(imageId).getAttribute('eid');var vId=$(imageId).getAttribute('vid');var filename=$(imageId).getAttribute('graphName')+".png";var binary=$(imageId).get_img_binary();new Ajax.Request('Ajax.php?action=SaveFlashImage',{parameters:{imageBinary:binary,vid:vId,eid:eId},onSuccess:function(transport){var link=transport.responseText;window.location='File.php?flashImage=true&F='+link+'&filename='+filename;}});}
function saveFlashImages(options)
{if(!options)
options={};if(Object.keys(Qualtrics.ofcImages).size()<=0)
{if(options&&options.onComplete)
options.onComplete();}
else
{var params;if(!options.url)
options.url="Ajax.php";if(options.reportId)
params="&ReportID="+options.reportId;else
params='';var binary=Object.toJSON(Qualtrics.ofcImages);new Ajax.Request(options.url+"?action=saveFlashImages"+params,{method:'post',parameters:{'binary':binary},onComplete:function()
{msg('Saving Flash Images...');Qualtrics.ofcImages={};if(options.onComplete)
options.onComplete();}});}}
function changePagePosition(foreward,pageCount)
{if(!Qualtrics.currentReportPage)
{Qualtrics.currentReportPage=0;}
var curPage=Qualtrics.currentReportPage;$('page'+curPage).toggleClassName('visible');if(foreward)
{curPage=(curPage<pageCount-1)?curPage+1:0;}
else
{curPage=(curPage>0)?curPage-1:pageCount-1;}
$('page'+curPage).toggleClassName('visible');$('pageNumberDisplay').update(curPage+1);Qualtrics.currentReportPage=curPage;}
function addReportNavigator(pageCount)
{return QBuilder('div',{id:'ReportNavigator'},[QBuilder('div',{},[QBuilder('a',{className:'qbutton',clickcallback:'changePagePosition',p1:false,p2:pageCount},[QBuilder('span',{className:'icon previous'})]),QBuilder('span',{id:'pageNumberDisplay'},1),QBuilder('a',{className:'qbutton',clickcallback:'changePagePosition',p1:true,p2:pageCount},[QBuilder('span',{className:'icon next'})])])]);}
FileUploader={prevFileID:'',buildFileUploadIFrame:function(qID,maxSize)
{var iframe=Builder.node('iframe',{id:'FileUploader',scrolling:'no',name:'FileUploader',frameBorder:0,src:'blank.html'});$(iframe).setStyle({width:'0px',height:'0px'});var fileField=QBuilder('input',{id:'fileField',type:'file',size:'48',name:'fileField',autocomplete:'off',qid:qID});var form=QBuilder('form',{id:'fileUploadForm',enctype:'multipart/form-data',method:'post',action:'Ajax.php?action=uploadRFile',target:'FileUploader'},[QBuilder('div',{className:'inputContainer'},[QBuilder('div',{className:'fileInputContainer',id:'fileInputContainer'},[QBuilder('input',{type:'hidden',value:maxSize,name:'MAX_FILE_SIZE'}),QBuilder('input',{type:'hidden',value:$('SurveyID').value,name:'SurveyID'}),QBuilder('input',{type:'hidden',value:$('SessionID').value,name:'SessionID'}),fileField])]),QBuilder('input',{type:'hidden',id:'QID',name:'QID',value:qID})]);var frameDiv=QBuilder('div',{},[form,iframe]);$('fIFrame~'+qID).contentWindow.document.write(frameDiv.innerHTML);$('fIFrame~'+qID).contentWindow.document.body.style.background='transparent';new Form.Element.Observer($('fIFrame~'+qID).contentWindow.document.getElementById('fileField'),0.2,FileUploader.clearOldAndSubmit);},clearOldAndSubmit:function(el,value)
{var qid=el.getAttribute('qid');if($('fileInfo~'+qid))
$('fileInfo~'+qid).remove();$('Filename~'+qid).value='';$('TmpFilepath~'+qid).value='';$('FileType~'+qid).value='';$('Size~'+qid).value='';$('loadingImage~'+qid).show();$('loadingError~'+qid).hide();$('fileInfoCont~'+qid).hide();if(value!='')
{$('fIFrame~'+qid).contentWindow.document.getElementById('fileUploadForm').submit();if(/AppleWebKit|MSIE/.test(navigator.userAgent)){new Ajax.Request("blank.html",{asynchronous:false});}}},fail:function(qid,errorMsg)
{$('fileInfoCont~'+qid).hide();if($('fileInfo~'+qid))
$('fileInfo~'+qid).remove();if(errorMsg)
$('loadingError~'+qid).innerHTML=errorMsg;$('loadingImage~'+qid).hide();$('loadingError~'+qid).show();$('Filename~'+qid).value='';$('TmpFilepath~'+qid).value='';$('FileType~'+qid).value='';$('Size~'+qid).value='';},uploadOnload:function(qID,fileData)
{if(fileData.errors&&fileData.errors!='')
{this.fail(qID,fileData.errors);return;}
$('loadingImage~'+qID).hide();$('loadingError~'+qID).hide();$('Filename~'+qID).value=fileData.origFilename;$('TmpFilepath~'+qID).value=fileData.fullpath;$('FileType~'+qID).value=fileData.type;$('Size~'+qID).value=fileData.size;$('fileInfoCont~'+qID).show();$('FILE~'+qID).value=fileData.fileId||$('FILE~'+qID).value;var fileURL='File.php?F='+(fileData.fileId||fileData.fullpath)+'&filePreview=true&PrevID='+this.prevFileID;var filePreview=QBuilder('tr',{id:'filePreviewRow~'+qID},[QBuilder('td',{className:'right'},[QBuilder('img',{id:'imagePreviewRow~'+qID,src:fileURL,className:'filePreview',onerror:'$(this).hide();'})])]);var nameInfo=QBuilder('tr',{id:'filenameInfoRow~'+qID},[QBuilder('td',{className:'right'},fileData.origFilename)]);var size=fileData.size;var sizeTag='B';if(size>1024)
{size/=1024;sizeTag='KB';}
if(size>1024)
{size/=1024;sizeTag='MB';}
var sizeInfo=QBuilder('tr',{id:'sizeInfoRow~'+qID},[QBuilder('td',{className:'right'},(Math.round(size*10)/10)+sizeTag)]);var typeInfo=QBuilder('tr',{id:'typeInfoRow~'+qID},[QBuilder('td',{className:'right'},fileData.type)]);var fileInfo=QBuilder('table',{className:'fileInfo',id:'fileInfo~'+qID},[QBuilder('tbody',{},[filePreview,nameInfo,sizeInfo,typeInfo])]);$('fileInfoCont~'+qID).appendChild(fileInfo);}};Qualtrics.objToHideButton=function(o,header)
{if(!header)
header='';var showButton=QBuilder('input',{type:'button',value:'show'});var hideButton=QBuilder('input',{type:'button',value:'hide'});var obj=QBuilder('div',{},[QBuilder('pre',{},Qualtrics.objToString(o))]);var inner=QBuilder('div',{},[header,obj,hideButton]);$(inner).hide();Event.observe(hideButton,'click',function(){$(inner).hide();showButton.value='show';});Event.observe(showButton,'click',function(){if(showButton.value=='show')
{showButton.value='hide';$(inner).show();}
else
{showButton.value='show';$(inner).hide();}});var container=QBuilder('div',{},[showButton,inner]);return container;};Qualtrics.objToString=function(obj,tab)
{tab=tab||0;var ret='';if(Object.isArray(obj))
obj=obj.toObject();for(var id in obj)
{ret+='\t'.times(tab);ret+=(id+' => ');if(typeof obj[id]=='object')
{ret+='\n';ret+=Qualtrics.objToString(obj[id],tab+1);}
else
{ret+=String(obj[id]);}
ret+='\n';}
return ret;};function isNumeric(input)
{input=input.replace(/,/g,'');return(input-0)==input&&input.length>0;}
Qualtrics.truncateEllipse=function(string,maxLength)
{if(!string)
return string;if(string.length<=maxLength)
return string;var xMaxFit=maxLength-3;var xTruncateAt=string.lastIndexOf(' ',xMaxFit);if(xTruncateAt==-1||xTruncateAt<maxLength/2)
xTruncateAt=xMaxFit;return string.substr(0,xTruncateAt)+"...";};Qualtrics.pluralize=function(string)
{var len=string.length;var lastChar=string[len-1];if(lastChar=='y')
{return string.substr(0,len-1)+'ies';}
return string+'s';};Qualtrics.noop=function(){};Qualtrics.isFeatureEnabled=function(feature,callback)
{new Ajax.CachedRequest('Ajax.php?action=FeatureIsEnabled',{parameters:{Feature:feature},onSuccess:function(resp){var results=resp.responseText.evalJSON();callback(results.enabled);}});};

window.QMetrics=(function(){var _pageLoadedTimestamp=null;var _pageTimes=null;var _numbers={};var _timers={};var _strings={};Event.observe(window,'load',function(){_pageLoadedTimestamp=new Date().getTime();_capturePageTimes(window);});function _capturePageTimes(w)
{_pageTimes={};if(Qualtrics.__naive_page_start)
{_timers['FirstScriptTagToLoad']={times:[_pageLoadedTimestamp-Qualtrics.__naive_page_start],uniqueEvent:true};}
var p=w.performance||w.msPerformance||w.webkitPerformance||w.mozPerformance;if(p&&p.timing)
{_pageLoadedTimestamp=p.timing.loadEventStart;_timers['NavTimeToLoaded']={times:[_pageLoadedTimestamp-(p.timing.navigationStart||p.timing.fetchStart)],uniqueEvent:true};_timers['RequestStartToLoaded']={times:[_pageLoadedTimestamp-p.timing.requestStart],uniqueEvent:true};}}
function _getTimer(key)
{if(!_timers[key])
{_timers[key]={times:[]};}
return _timers[key];}
function _getTimerStats(key,opt_appendToObject)
{var t=_getTimer(key);var timesArray=t.times;var stats=opt_appendToObject||{};if(t.uniqueEvent)
{stats[key]=timesArray.shift();}
else if(timesArray.length)
{stats[key+'_mean']=QualtricsTools.arrayMean(timesArray);stats[key+'_count']=timesArray.length;stats[key+'_min']=timesArray.min();stats[key+'_max']=timesArray.max();stats[key+'_total']=QualtricsTools.arraySum(timesArray);stats[key+'_median']=QualtricsTools.arrayMedian(timesArray);if(timesArray.length>1)
{stats[key+'_stdDev']=QualtricsTools.arrayStdDev(timesArray);}}
return stats;}
function _getDurationStats(opt_includeTotalPageTime)
{var durations={};for(var k in _timers)
{_getTimerStats(k,durations);}
if(opt_includeTotalPageTime)
durations.TimeOnPage=new Date().getTime()-_pageLoadedTimestamp;return durations;}
function _incCounter(key,inc)
{if(inc==undefined)inc=1;if(!_numbers[key])
_numbers[key]=0;_numbers[key]+=inc;}
function _hasData()
{return QualtricsTools.isObject(_timers,true)||QualtricsTools.isObject(_numbers,true)||QualtricsTools.isObject(_strings,true);}
function _reset()
{_numbers={};_timers={};_strings={};}
function _sendData(key,opt_onUnload)
{if(!key||!_hasData()||!$('T'))
return;var paramData={Key:key,Data:Object.toJSON({Durations:_getDurationStats(opt_onUnload),Numbers:_numbers,Strings:_strings})};if(opt_onUnload)
{paramData['T']=$F('T');var img=new Image();img.src='Ajax.php?action=LogQMetrics&'+Object.toQueryString(paramData)+'&_End=1';_reset();}
else
{paramData['_End']=1;new Ajax.Request('Ajax.php?action=LogQMetrics',{method:'POST',parameters:paramData,onComplete:function(transport){_reset();}});}}
return{startTimer:function(key,opt_onlyOnce)
{var t=_getTimer(key);if(opt_onlyOnce)
{if(t.uniqueEvent)
return;t.uniqueEvent=true;}
t.started=new Date();return t.started;},stopTimer:function(key,opt_cancel)
{var duration=0;var t=_getTimer(key);if(t.started)
{var end=new Date();var delta=end-t.started;delete t.started;if(!opt_cancel)
{t.times.push(delta);duration=delta;}}
return duration;},markTimeSincePageLoad:function(key,opt_onlyOnce)
{var n=new Date().getTime();var t=_getTimer(key);if(opt_onlyOnce)
{if(t.uniqueEvent)
return;t.uniqueEvent=true;}
var duration=n-_pageLoadedTimestamp;t.times.push(duration);return duration;},incrementCounter:function(key)
{_incCounter(key);return _numbers[key];},consoleDump:function(key)
{var data;if(key!=null)
{if(_numbers[key]!==undefined)
{data=_numbers[key];}
else if(_strings[key]!==undefined)
{data=_strings[key];}
else
{data=_getTimerStats(key);}}
else
{data={Timers:_timers,Counters:_numbers,Strings:_strings,PageLoadTimestamp:_pageLoadedTimestamp};}
console.dir(data);return data;},resetStat:function(key)
{if(key==null)
return;var data=this.consoleDump(key);delete _numbers[key];delete _timers[key];delete _strings[key];return data;},logString:function(key,value)
{if(!key||!value)
return;_strings[key]=value;},logStrings:function(stringsObj)
{if(!QualtricsTools.isObject(stringsObj,true))
return;for(var k in stringsObj)
{this.logString(k,stringsObj[k]);}},logNumber:function(key,value)
{_incCounter(key,value);},logNumbers:function(numbersObj)
{if(!QualtricsTools.isObject(numbersObj,true))
return;for(var k in numbersObj)
{this.logNumber(k,numbersObj[k]);}},logDuration:function(key,value)
{var t=_getTimer(key);t.times.push(value);},logDurations:function(durationsObj)
{if(!QualtricsTools.isObject(durationsObj,true))
return;for(var k in durationsObj)
{this.logDuration(k,durationsObj[k]);}},logMetrics:function(strings,numbers,durations)
{this.logStrings(strings);this.logNumbers(numbers);this.logDurations(durations);},sendToServer:function(metricIdentifier,opt_onUnload)
{_sendData(metricIdentifier,opt_onUnload);}};})();

var QModules={moduleBasePath:'../WRQualtricsShared/JavaScript/Modules/',basePath:'../',loadedModules:{},loadType:'script',loadModule:function(path,options)
{var defaultOptions={method:'get',asynchronous:false,modulePath:path};if(options&&options.onComplete)
{defaultOptions.asynchronous=true;options.customOnComplete=options.onComplete;options.onComplete=null;}
if(QModules.loadType=='script'||QModules.loadType=='head')
{defaultOptions.evalJS=false;}
defaultOptions.evalJS=false;options=Object.extend(defaultOptions,options);options.onComplete=QModules.onModuleLoad;var parsedPath=options.noParse&&path||QModules.parsePath(path);if(!QModules.loadedModules[path])
{if(options.killCache)
{var prefix='?';if(parsedPath.indexOf('?')!=-1)
{prefix='&';}
parsedPath+=prefix+'CacheKiller='+Math.random();}
if((QModules.loadType=='head'||options.loadType=='head')&&(options.customOnComplete||options.asynchronous))
{var script=QBuilder('script',{src:parsedPath});script.onload=script.onreadystatechange=function(_,isAbort)
{if(isAbort||!script.readyState||/loaded|complete/.test(script.readyState))
{script.onload=script.onreadystatechange=null;script=undefined;if(!isAbort)
{QModules.moduledLoaded(options);}}};document.head.appendChild(script);}
else
{var requestObj=new Ajax.Request(parsedPath,options);}}
else if(options.customOnComplete)
{options.customOnComplete.defer();}},onModuleLoad:function(transport)
{if(transport.status==412&&!transport.request.options.killCache)
{transport.request.options.killCache=true;QModules.loadModule(transport.request.options.modulePath,transport.request.options);return;}
if(QModules.loadType=='script'||QModules.loadType=='head')
{try
{QModules.exec(transport.responseText);}
catch(e)
{QES_Error('Error loading script module: '+e);}}
else if(transport.request.options.evalJS===false)
{try
{new Function(transport.responseText)();}
catch(e)
{QES_Error('Error running module: '+e);}}
if(transport.status==200)
{QModules.moduledLoaded(transport.request.options);}},moduledLoaded:function(options)
{if(options.modulePath)
{QModules.loadedModules[options.modulePath]='loaded';}
if(options.customOnComplete)
{try
{options.customOnComplete();}
catch(e)
{console.error(e);}}},loadStylesheet:function(path,options)
{options=options||{};var fullPath='../WRQualtricsShared/Stylesheet.php?';if(path.indexOf('/')==-1)
{fullPath+='p=ControlPanel&s='+path;}
else
{fullPath+='sf='+encodeURIComponent(path.split('?')[0]);}
fullPath=QModules.getVersionedFile(fullPath,true);if(options.blocking&&!QModules.loadedModules[fullPath])
{QModules.loadedModules[fullPath]='loaded';new Ajax.Request(fullPath,{method:'get',asynchronous:false,onComplete:QModules.onStylesheetLoad});return;}
(function(){if(!QModules.loadedModules[fullPath])
{QModules.loadedModules[fullPath]='loaded';var link=QBuilder('link',{rel:'stylesheet',type:'text/css',href:fullPath});document.getElementsByTagName("head")[0].appendChild(link);}
if(options.onLoad&&options.triggerClass)
{var triggerElement=QBuilder('span',{className:options.triggerClass});$(triggerElement).hide();document.body.appendChild(triggerElement);new PeriodicalExecuter(function(pe){var color=$(triggerElement).getStyle('color');if(color=='#abcdef'||color=='rgb(171, 205, 239)')
{pe.stop();options.onLoad(path,options.triggerClass);}},.2);}}).defer();},onStylesheetLoad:function(transport)
{QModules.loadedModules[transport.request.url]='loaded';var style=QBuilder('style',{type:'text/css'});if(style.styleSheet)
{style.styleSheet.cssText=transport.responseText;}
else
{style.appendChild(document.createTextNode(transport.responseText));}
document.getElementsByTagName("head")[0].appendChild(style);},exec:function(code)
{if((code+='').blank())
return;var script,scriptId;var head=$$('head').first()||$(document.documentElement);if(document.loaded)
{try
{script=new Element('script',{type:'text/javascript'});try
{script.appendChild(document.createTextNode(code));}
catch(e)
{script.text=code;}
head.insert(script);}
catch(e)
{console.error(e);}}
else
{scriptId='__prototype_exec_script';document.write('<script id="'+scriptId+'" type="text/javascript">'+code+'<\/script>');script=$(scriptId);}
script.remove();},loadExternalModule:function(path,callback)
{var head=$$('head').first()||$(document.documentElement);var script=new Element('script',{type:'text/javascript',src:path});if(callback)
{if(script.onreadystatechange!==undefined)
{script.onreadystatechange=function(){if(this.readyState=='loaded'||this.readyState=='complete')
{callback();}};}
else
{Event.observe(script,'load',callback);}}
head.insert(script);},isLoaded:function(path)
{if(!QModules.loadedModules[path])
return false;else
return true;},markModulesLoaded:function(modules)
{for(var i=0,len=modules.length;i<len;++i)
{QModules.loadedModules[modules[i]]='loaded';}},parsePath:function(path)
{path=QModules.getVersionedFile(path);if(path.indexOf('http')===0)
{QModules.loadType="script";return path;}
if(path.indexOf('./')==0)
{path=QModules.moduleBasePath+path.substr(2);}
else if(path.search('/')==-1)
{path=QModules.moduleBasePath+path;}
else
{path=QModules.basePath+path;}
return path;},unload:function(path)
{if(QModules.loadedModules[path])
{delete QModules.loadedModules[path];}},getVersionedFile:function(file,forceParamVersioning)
{if(typeof qVersion!='undefined')
{var matches=file.match(/(.*)\.(js|css|jpg|gif|png)$/i);if(matches&&!forceParamVersioning)
{return matches[1]+"."+qVersion+"."+matches[2];}
else
{var prefix='?';if(file.indexOf('?')!=-1)
{prefix='&';}
return file+prefix+'v='+qVersion;}}
else
return file;}};

Qualtrics.Event={currentZoom:1,preventEvents:function(duration)
{Qualtrics.Event.preventingEvents=true;setTimeout(Qualtrics.Event.stopPreventingEvents,duration||100);},stopPreventingEvents:function()
{Qualtrics.Event.preventingEvents=false;},addBubbleUp:function(domNode,stopOnCallback)
{if(stopOnCallback)
return this.addBubbleUpRecursive(domNode);var descendants=$(domNode).descendants();for(var i=0,len=descendants.length;i<len;++i)
{descendants[i].setAttribute('bubbleup',true);}
return domNode;},addBubbleUpRecursive:function(domNode)
{var cur=$(domNode.firstChild);while(cur)
{if(cur.nodeType!=3&&!cur.hasAttribute('clickcallback')&&!cur.hasAttribute('downcallback'))
{cur.setAttribute('bubbleup',true);this.addBubbleUpRecursive(cur);}
cur=$(cur.nextSibling);}
return domNode;},preventingEvents:false,dotCallback:function(command)
{return function()
{var parameterMap={};parameterMap['$this']=this;parameterMap['$args']=arguments;for(var i=0;i<arguments.length;++i)
parameterMap["$arg"+i]=arguments[i];Qualtrics.Event.executeDotSyntax(command,null,null,null,parameterMap);};},baseDistributerReader:function(evt,el,callbackType,opt_rootObject)
{if(window.QualtricsCPTools)
{QualtricsCPTools.resetTimeoutTimer();}
var callbackNode=Qualtrics.Event.getCallbackNode(el,callbackType);if(!callbackNode)
return;var callback=callbackNode.getAttribute(callbackType);if(callback)
{el=callbackNode;Qualtrics.Event.baseDistributer(evt,el,callback,opt_rootObject,callbackNode);}},getCallbackNode:function(el,callbackType)
{if(!(el||{}).getAttribute||el.getAttribute('disabled')=='disabled')
return null;var bubble=el.getAttribute('bubbleup')||null;if(bubble==='false')
bubble=false;var callbackNode=null;if(el.hasAttribute(callbackType))
{callbackNode=el;}
else if((el.tagName=='SPAN'||el.tagName=='EM'||el.tagName=='IMG'||el.tagName=='P'||el.tagName=='B'||el.tagName=='STRONG'))
{if(bubble!==false&&el.parentNode)
{bubble=true;el=$(el.parentNode);}}
if(bubble)
{while(!callbackNode&&el)
{if(el.hasAttribute(callbackType))
{callbackNode=el;}
else if((el.hasAttribute('bubbleup')||el.tagName=='SPAN')&&el.getAttribute('bubbleup')!=='false')
{el=$(el.parentNode);}
else
{el=null;}}}
return callbackNode;},baseDistributer:function(event,clickedEl,clickCallBack,opt_rootObject,opt_callbackNode)
{if(Qualtrics.Event.preventingEvents)return;if(typeof clickCallBack!='string')
{return;}
var params=Qualtrics.Event.packageParameters(clickedEl);var parameterMap={'$el':clickedEl||(event&&Event.element(event)),'$evt':event,'$val':this.getInputValue(clickedEl),'$this':opt_callbackNode};var instanceId=clickedEl.getAttribute('instanceid');if(clickedEl.getAttribute('defer'))
{if(Qualtrics.Browser.IE&&Qualtrics.Browser.getVersion()<=8)
{var copiedEvent={};for(var i in event)
{copiedEvent[i]=event[i];}
parameterMap['$evt']=copiedEvent;}
Qualtrics.Event.executeDotSyntax.curry(clickCallBack,instanceId,opt_rootObject,null,parameterMap,params).defer();}
else
{Qualtrics.Event.executeDotSyntax(clickCallBack,instanceId,opt_rootObject,null,parameterMap,params);}},getInputValue:function(el)
{if(el)
{if(el.type=='checkbox')
{return el.checked;}
return el.value;}},packageParameters:function(el)
{var paramIndex=1;var params=[];while(paramIndex!==null)
{var param=el.getAttribute('p'+paramIndex);if(param!==null)
{if(param==='false')
param=false;if(param==='true')
param=true;params.push(param);paramIndex++;}
else
{paramIndex=null;}}
return params;},parseParam:function(param,evt,opt_target)
{opt_target=opt_target||(evt&&Event.element(evt));if(param=='$evt')
{param=evt;}
else if(param=='$el')
{param=opt_target;}
else if(param=='$val')
{if(opt_target.type=='checkbox')
{param=opt_target.checked;}
else
{param=opt_target.value;}}
return param;},globalClickHandler:function(evt)
{if(!evt){evt=window.event;}
var el=Event.element(evt);if(el.tagName=='INPUT')
{if(el.getAttribute('autoselect'))
{if(el.value==el.getAttribute('autoselect'))$(el).activate();}
if(el.getAttribute('autoclear'))
{if(el.value==el.getAttribute('autoclear')){QualtricsTools.focusInput(el,0);}}
else if(el.getAttribute('autohide'))
{if(Qualtrics.Inputs)
Qualtrics.Inputs.autoHideClick(el);}
else if(el.getAttribute('autoclearonclick'))
{if(el.value==el.getAttribute('autoclearonclick')){el.value='';$(el).removeClassName('AutoClearMessage');}}}
if(el.getAttribute&&el.getAttribute('distancedragged')&&el.getAttribute('distancedragged')>3)
{return;}
Qualtrics.Event.baseDistributerReader(evt,el,'clickcallback');},activateOverCallbacks:function()
{Event.observe(document,'mouseover',Qualtrics.Event.globalOverHandler);Event.observe(document,'mouseout',Qualtrics.Event.globalOutHandler);},globalOverHandler:function(evt)
{evt=evt||window.event;var el=Event.element(evt);if(el.getAttribute('infobutton'))
{Qualtrics.Info.showButton(el.getAttribute('infobutton'),evt);}
Qualtrics.Event.baseDistributerReader(evt,el,'overcallback');},addGlobalOutCallback:function(callback)
{if(!Qualtrics.Event.globalOutCallbacks)
{Qualtrics.Event.globalOutCallbacks=[];}
Qualtrics.Event.globalOutCallbacks.push(callback);},globalOutHandler:function(evt)
{evt=evt||window.event;var el=Event.element(evt);if(Qualtrics.Event.globalOutCallbacks)
{while(Qualtrics.Event.globalOutCallbacks.length)
{Qualtrics.Event.baseDistributer(evt,el,Qualtrics.Event.globalOutCallbacks.pop());}}
Qualtrics.Event.baseDistributerReader(evt,el,'outcallback');},globalDownHandler:function(evt)
{evt=evt||window.event;var el=Event.element(evt);Qualtrics.Event.baseDistributerReader(evt,el,'downcallback');},globalUpHandler:function(evt)
{evt=evt||window.event;var el=Event.element(evt);if(Event.isLeftClick(evt)||evt.type==='touchend')
{Qualtrics.Event.baseDistributerReader(evt,el,'mouseupcallback');if(window.customMouseUp)
{window.customMouseUp(evt);}}},globalDblClickHandler:function(evt)
{evt=evt||window.event;var el=Event.element(evt);Qualtrics.Event.baseDistributerReader(evt,el,'doubleclickcallback');},globalKeyDownHandler:function(evt)
{if(!evt){evt=window.event}
var el=Event.element(evt);if(el&&el.getAttribute)
{if(Qualtrics.Menu)
{Qualtrics.Menu.handleKeyDown(evt);}
if(el.getAttribute('keyentercallback'))
{if(evt.keyCode==Event.KEY_RETURN)
{Event.stop(evt);Qualtrics.Event.baseDistributer(evt,el,el.getAttribute('keyentercallback'));}}
if(el.getAttribute('keytabcallback'))
{if(evt.keyCode==Event.KEY_TAB)
{Event.stop(evt);Qualtrics.Event.baseDistributer(evt,el,el.getAttribute('keytabcallback'));}}
if(el.getAttribute('keydowncallback'))
{Qualtrics.Event.baseDistributerReader(evt,el,'keydowncallback');}
if(el.getAttribute('autoclear'))
{if(el.value==el.getAttribute('autoclear')&&!el.getAttribute('data_autoclearuserdata')){el.value='';$(el).removeClassName('AutoClearMessage');el.setAttribute('data_autoclearuserdata','true');}
else if(!el.getAttribute('data_autoclearuserdata'))
{$(el).removeClassName('AutoClearMessage');el.setAttribute('data_autoclearuserdata','true');}}
if(el.getAttribute('autohide'))
{if(Qualtrics.Inputs)
Qualtrics.Inputs.autoHideKeyDown(el,evt);}
if(el.getAttribute('numericupdown'))
{Qualtrics.Event.numericUpDown(el,evt);}
if(el.getAttribute('validation'))
{if(!Qualtrics.alphaNumericValidation(el,evt))
return false;}}
if(Qualtrics.customKeyDown)
{Qualtrics.customKeyDown(evt);}
if(evt.keyCode==Event.KEY_BACKSPACE&&!Qualtrics.Reporting)
{if(el.nodeName=='INPUT'||el.nodeName=='TEXTAREA'||window.inlineEditor.getInstance()||el.hasAttribute('contenteditable'))
{}
else
{Event.stop(evt);}}
if(evt.keyCode==90)
{if(el&&el.nodeName=='INPUT'||el.nodeName=='TEXTAREA')
{}
else
{if(evt.metaKey||evt.ctrlKey)
{if(evt.shiftKey)
{Qualtrics.History.getInstance().redo();}
else
{Qualtrics.History.getInstance().undo();}}}}
if(evt.keyCode==32)
{if(el&&el.nodeName=='INPUT'||el.nodeName=='TEXTAREA'||inlineEditor.getInstance())
{}
else
{if(Q_Window.getWindowCount())
Event.stop(evt);}}
if(Qualtrics.savePage)
{if(evt.keyCode==83&&(evt.ctrlKey||evt.metaKey))
{Event.stop(evt);Qualtrics.savePage(true);return false;}}},globalKeyUpHandler:function(evt)
{var el=Event.element(evt);if(el.getAttribute('autohide'))
{if(Qualtrics.Inputs)
Qualtrics.Inputs.autoHideKeyUp(el,evt);}
if(el.getAttribute('qautosuggest'))
{QModules.loadModule('QAutoSuggest.js');if(el.qAutoSuggest)
{el.qAutoSuggest.handleKeyPress(evt);}
else
{var instanceid=el.getAttribute('instanceid');var list=Qualtrics.Event.executeDotSyntax(el.getAttribute('qautosuggest'),instanceid);var as=new Qualtrics.AutoSuggest(el,{keycallback:true,list:list});as.handleKeyPress(evt);el.qAutoSuggest=as;}}
if(el.getAttribute('qautocomplete'))
{QModules.loadModule('QAutoComplete.js');if(el.qAutoComplete)
{el.qAutoComplete.handleKeyPress(evt);}
else
{instanceid=el.getAttribute('instanceid');list=Qualtrics.Event.executeDotSyntax(el.getAttribute('qautocomplete'),instanceid);var ac=new QAutoComplete(el,{keycallback:true,list:list});ac.handleKeyPress(evt);el.qAutoComplete=ac;}}
if(el.getAttribute('numericmax')||el.getAttribute('numericmin'))
{Qualtrics.Event.limit(el,evt);}
Qualtrics.Event.baseDistributerReader(evt,el,'keyupcallback');if(evt.keyCode==Event.KEY_DELETE||evt.keyCode==Event.KEY_BACKSPACE)
{if(el.getAttribute('autoclear'))
{if(el.value=='')
{el.value=el.getAttribute('autoclear');el.removeAttribute('data_autoclearuserdata');$(el).addClassName('AutoClearMessage');QualtricsTools.focusInput(el,0);}}}
if(el.getAttribute('validation'))
{Qualtrics.alphaNumbericInputFilter(evt,el);}},execute:function(command,params,opt_scope)
{params=params||[];if(typeof command=='function')
{return command.apply(opt_scope,params);}
else if(typeof command=='string')
{return Qualtrics.Event.executeDotSyntax(command,null,opt_scope,params);}},executeDotSyntax:function(command,opt_instanceId,opt_root,opt_forcedParams,opt_parameterMap,opt_defaultParams,opt_quiet)
{if(command)
{if(command.indexOf(';')!=-1)
{var commands=command.split(';');var lastValue=null;for(var i=0,len=commands.length;i<len;++i)
{lastValue=Qualtrics.Event.executeDotSyntax(commands[i].strip(),opt_instanceId,opt_root,opt_forcedParams,opt_parameterMap,opt_defaultParams);}
return lastValue;}
var pkg=Qualtrics.Event.getDotSyntaxParts(command,opt_instanceId,opt_root,opt_quiet);if(!pkg)return;var params=pkg[3]||opt_defaultParams||[];if(opt_forcedParams&&opt_forcedParams.length)
{params=opt_forcedParams;}
opt_parameterMap=opt_parameterMap||{};opt_parameterMap['$null']=null;opt_parameterMap['$undefined']=undefined;if(params.length)
{for(var i=0,len=params.length;i<len;++i)
{var param=params[i];if(opt_parameterMap[params[i]]!==undefined)
{params[i]=opt_parameterMap[params[i]];}
if(params[i]=='$availableVariables')
{params[i]=opt_parameterMap;}
if(typeof param=='string'&&param.indexOf('.')!==-1)
{var dotSyntaxParts=param.split('.');var base=dotSyntaxParts[0];var newParam=dotSyntaxParts[1];if(opt_parameterMap[base]&&opt_parameterMap[base][newParam])
{params[i]=opt_parameterMap[base][newParam];}
else if(opt_parameterMap[base])
{params[i]=undefined;}}}}
var returnVal=pkg[0].apply(pkg[1],params);return returnVal;}},getDotSyntaxValue:function(command,opt_root)
{var pkg=Qualtrics.Event.getDotSyntaxParts(command,null,opt_root,true);if(pkg&&pkg.root&&pkg.callBack)
{return pkg.root[pkg.callBack];}},callbackHasParams:function(command)
{if(command.lastIndexOf(')')===command.length-1)
{return true;}
return false;},getDotSyntaxParts:function(command,opt_instanceId,opt_alternateRoot,opt_quiet)
{var params,originalCommand=command;if(Qualtrics.Event.callbackHasParams(command))
{var openIndex=command.indexOf('(');if(openIndex!=-1)
{var paramsString=command.substring(openIndex+1,command.lastIndexOf(')'));var str=paramsString;if(str)
{var tokens=[];var i=-1;do{i=str.indexOf(',');var openP=str.indexOf('(');var closeP=str.indexOf(')');if(openP>-1&&openP<i)
{i=str.indexOf(',',closeP);}
if(i>-1)
{tokens.push(str.substring(0,i));str=str.substring(i+1);}}while(i>-1);tokens.push(str);params=tokens;params=params.invoke('strip');}
command=command.substring(0,openIndex);}}
if(command.indexOf(':')!=-1)
{opt_instanceId=command.substring(command.indexOf(':')+1);command=command.substring(0,command.indexOf(':'));}
var parts=command.split('.');var root=opt_alternateRoot||window;var method=null;var _this=window;var callBack=null;for(var i=0,len=parts.length;i<len;++i)
{method=root[parts[i]];if(parts[i+1])
{if(!method)
{if(!opt_quiet)
{console.error('getDotSyntaxParts: Cannot find object: '+parts[i]+' in: '+originalCommand);}
return;}
root=method;method=root[parts[i+1]];}
else
{method=root[parts[i]];callBack=parts[i];_this=root;}}
if(root.getInstance)
{if(root.getInstance(opt_instanceId)&&root.getInstance(opt_instanceId)[callBack]!==undefined)
{method=root.getInstance(opt_instanceId)[callBack];_this=root.getInstance(opt_instanceId);}}
if(method===undefined)
{if(!opt_quiet)
{console.error('getDotSyntaxParts 2: Cannot find object: '+callBack+' in: '+originalCommand);}
return;}
if(params)
{for(i=0,len=params.length;i<len;++i)
{if(params[i]=='null')
{params[i]=null;}}}
var pkg={};pkg.method=method;pkg.callBack=callBack;pkg.root=_this;pkg.params=params;pkg[0]=method;pkg[1]=pkg.root;pkg[2]=callBack;pkg[3]=params;return pkg;},isValidCallback:function(dotSyntax)
{var func;try
{var parts=this.getDotSyntaxParts(dotSyntax,undefined,undefined,true);func=(typeof parts[0]==='function');}
catch(e)
{func=false;}
return func;},getClass:function(dotSyntax)
{var parts=dotSyntax.split('.');var classObj=window;for(var i=0,len=parts.length;i<len;++i)
{classObj=classObj[parts[i]];}
return classObj;},numericUpDown:function(el,evt)
{var val=el.value;if(!isNaN(val))
{val*=1;switch(evt.keyCode)
{case Event.KEY_DOWN:if(val>0)
el.value=val-1;Event.stop(evt);break;case Event.KEY_UP:el.value=val+1;Event.stop(evt);break;}}
if(!Qualtrics.isNumericKey(evt))
{Event.stop(evt);return false;}},limit:function(el,evt)
{var max=el.getAttribute('numericmax');var min=el.getAttribute('numericmin');var val=el.value;if(val!==null&&isNaN(val))
{return;}
val*=1;if(max!==null&&!isNaN(max))
{max*=1;if(val>max)
{el.value=max;}}
if(min!==null&&!isNaN(min))
{min*=1;if(val<min)
{el.value=min;}}},globalResizeHandler:function(evt)
{if(Qualtrics.Event.zoomDetectDelay)
{clearTimeout(Qualtrics.Event.zoomDetectDelay);}
Qualtrics.Event.zoomDetectDelay=setTimeout(Qualtrics.Event.detectZoom,500);if(Qualtrics.Menu)
{Qualtrics.Menu.positionMenus(true);}},detectZoom:function()
{if(Qualtrics.Event.zoomDetectDelay)
{Qualtrics.Event.zoomDetectDelay=null;}
if(Qualtrics.DetectZoom)
{var currentZoom=Qualtrics.DetectZoom.zoom();if(Qualtrics.Event.currentZoom!=currentZoom)
{Qualtrics.Event.currentZoom=currentZoom;Qualtrics.Event.onZoomChange();}}},onZoomChange:function()
{if(Qualtrics.Event.currentZoom!=1)
{$(document.body).addClassName('IsZoomed');}
else
{$(document.body).removeClassName('IsZoomed');}},load:function()
{if(Qualtrics.onLoad)
{Qualtrics.onLoad();}},getSelfFunction:function(classPath,instanceId,args)
{var functionName=args[0];var dotSyntaxExpression=classPath+'.'+functionName;if(instanceId)
{dotSyntaxExpression+=':'+instanceId;}
if(args[1]!==undefined)
{dotSyntaxExpression+='(';for(var i=1,len=args.length;i<len;++i)
{if(i!=1)
{dotSyntaxExpression+=',';}
dotSyntaxExpression+=args[i];}
dotSyntaxExpression+=' )';}
return dotSyntaxExpression;}};Event.observe(window,'load',Qualtrics.Event.load);Event.observe(document,'click',Qualtrics.Event.globalClickHandler);Event.observe(document,'dblclick',Qualtrics.Event.globalDblClickHandler);Event.observe(document,'touchstart',Qualtrics.Event.globalDownHandler);Event.observe(document,'mousedown',Qualtrics.Event.globalDownHandler);Event.observe(document,'touchend',Qualtrics.Event.globalUpHandler);Event.observe(document,'mouseup',Qualtrics.Event.globalUpHandler);Event.observe(document,'keydown',Qualtrics.Event.globalKeyDownHandler);Event.observe(document,'keyup',Qualtrics.Event.globalKeyUpHandler);Event.observe(window,'resize',Qualtrics.Event.globalResizeHandler);var mousePos=new Array();Event.observe(document,'mousemove',updateMousePos);function updateMousePos(event,forcedY){if(event){mousePos[0]=((event.pageX)||(event.clientX+window.scrollInfo[0]));mousePos[1]=((event.pageY)||(event.clientY+window.scrollInfo[1]));if(forcedY)
{mousePos[1]=forcedY;}
if(window.Q_Window)
{var chopped=Q_Window.getChopOffset();if(chopped)
{if(chopped[0])mousePos[0]=mousePos[0]-chopped[0];if(chopped[1])mousePos[1]=mousePos[1]-chopped[1];}}
if(window.updateCustomMousePos)
{window.updateCustomMousePos(event);}}}

function QError(msg)
{console.error('QES_Error '+msg);console.trace();}
function PageAction(ClientAction,Section,SubSection,SubSubSection,repeatable,dontChangeAction,options,asyncSavePage)
{if(Qualtrics.savePage)
{Qualtrics.savePage(asyncSavePage);Event.stopObserving(window,'unload',Qualtrics.savePageOnUnload);}
if(SubSection===undefined)
{SubSection='';}
if(SubSubSection===undefined)
{SubSubSection='';}
if(ClientAction=='ChangePage')
{var pathArray=window.location.pathname;var pathname=pathArray.substring(0,pathArray.lastIndexOf("/"));var url=pathname+'?ClientAction=ChangePage&s='+Section+'&ss='+SubSection+'&sss='+SubSubSection;if(options)
{url+='&options='+options;}
window.location=url;}
else
{var page=$('Page');page.ClientAction.value=ClientAction;page.Section.value=Section;page.SubSection.value=SubSection;page.SubSubSection.value=SubSubSection;if((typeof(repeatable)=='string'&&repeatable=='true')||(typeof(repeatable)!='string'&&repeatable))
{page.Repeatable.value='1';}
if(options&&page.PageActionOptions)
{page.PageActionOptions.value=options;}
if(!dontChangeAction)
page.action='?';submitForm(page);if(Qualtrics.Browser.IE&&Qualtrics.Browser.Version==6)
{window.href=window.href;}
page.ClientAction.value='';return false;}}
function PageActionGet(ClientAction,Section,SubSection,SubSubSection,repeatable,options)
{var page=$('Page');page.method='GET';if($('T'))
$('T').remove();(function(){return PageAction(ClientAction,Section,SubSection,SubSubSection,repeatable,null,options);}).defer();return;}
function PageActionJumpTo(ClientAction,Section,SubSection,SubSubSection,jump_to)
{var page=$('Page');page.ClientAction.value=ClientAction;page.Section.value=Section;page.SubSection.value=SubSection;page.SubSubSection.value=SubSubSection;page.action=jump_to;submitForm(page);return false;}
function is_int(mixed_var){if(typeof mixed_var!=='number'){return false;}
if(parseFloat(mixed_var)!=parseInt(mixed_var)){return false;}
return true;}
function isRTLLanguage(lang)
{return lang==='HE'||lang==='AR'||lang==='FA'||lang==='UR';}
function array_merge(){var args=Array.prototype.slice.call(arguments);var retObj={},k,j=0,i=0;var retArr;for(i=0,retArr=true;i<args.length;i++){if(!(args[i]instanceof Array)){retArr=false;break;}}
if(retArr){return args;}
var ct=0;for(i=0,ct=0;i<args.length;i++){if(args[i]instanceof Array){for(j=0;j<args[i].length;j++){retObj[ct++]=args[i][j];}}else{for(k in args[i]){if(is_int(k)){retObj[ct++]=args[i][k];}else{retObj[k]=args[i][k];}}}}
return retObj;}
function array_merge_recursive(arr1,arr2){var idx='';if((arr1&&(arr1 instanceof Array))&&(arr2&&(arr2 instanceof Array))){for(idx in arr2){arr1.push(arr2[idx]);}}else if((arr1&&(arr1 instanceof Object))&&(arr2&&(arr2 instanceof Object))){for(idx in arr2){if(idx in arr1){if(typeof arr1[idx]=='object'&&typeof arr2=='object'){arr1[idx]=array_merge_recursive(arr1[idx],arr2[idx]);}else{arr1[idx]=arr2[idx];}}else{arr1[idx]=arr2[idx];}}}
return arr1;}
var ScriptQuery=function(scriptPath){this.scriptPath=scriptPath;};ScriptQuery.prototype={parse:function(url){var result={};if(!url)
url=this.scriptPath;var query=url.split('?')[1];if(!query)
return null;var components=query.split('&');for(var i=0;i<components.length;i++){var pair=components[i].split('=');var name=pair[0],value=pair[1];if(!result[name])result[name]=[];if(!value){value='true';}else{try{value=decodeURIComponent(value);}catch(e){value=unescape(value);}}
var values=result[name];values[values.length]=value;}
return result;},flatten:function(url){var queries=this.parse(url);for(var name in queries){queries[name]=queries[name][0];}
return queries;},toString:function(){return'ScriptQuery [path='+this.scriptPath+']';}};var ClosePopupWindows={closePopUpWindow:function(opt_windowName)
{if(!window.opener)
{var queries=new ScriptQuery().parse(window.location.href);if(opt_windowName||queries&&parent.Q_Window.getWindow(queries['WID']))
{Q_Window.closeWindow(opt_windowName||queries['WID']);}
else
{Q_Window.closeWindow();}}
else
{window.close();}},_cleanUrl:function(url,removeQuery)
{if(removeQuery)
{var index=url.lastIndexOf('?');if(index!=-1)
url=url.substring(0,index);}
index=url.lastIndexOf('#');if(index!=-1)
url=url.substring(0,index);return url;},closeWindowAndRefreshMaster:function()
{if(!window.opener)
{var url=this._cleanUrl(parent.location.href);parent.location.href=url;parent.location.href=url;}
else
{url=this._cleanUrl(window.opener.location.href);window.opener.location.href=url;window.opener.location.href=url;}
this.closePopUpWindow();},closeWindowAndSubmitMaster:function(clientAction,bookmark)
{if(!bookmark)
bookmark='';try
{if(!window.opener)
{if(parent&&parent.document.Page)
{if(parent.document.Page.ClientAction)
parent.document.Page.ClientAction.value=clientAction;if(parent.document.Page.onsubmit)
parent.document.Page.onsubmit();parent.document.Page.submit();}}
else
{if(window.opener&&window.opener.document.Page)
{window.opener.document.Page.ClientAction.value=clientAction;if(window.opener.document.Page.onsubmit)
window.opener.document.Page.onsubmit();window.opener.document.Page.submit();}}}
catch(e)
{console.error('closeWindowAndSubmitMaster error:'+e);}
this.closePopUpWindow();}};function createFCKEditor(id,width,height,updateOnSubmit,surveyId,instanceReadyFunc,options)
{if($(id))
{var offsetHeight=112;if(!width)
{width=$(id).getWidth();}
if(!height)
{height=$(id).offsetHeight-offsetHeight;}}
if(instanceReadyFunc==undefined)
{instanceReadyFunc=function(e){e.editor.focus();};}
if(!options)
{options={};}
var options=Object.extend(options,{width:width,height:height,on:{instanceReady:instanceReadyFunc}});var firstButton=null;switch(surveyId)
{case'LibMessage':firstButton='QSurveyLink';break;case'TSInviteOrReminderMessage':firstButton='QThreeSixtyLink';break;}
var QFileButton='QFile';if(Qualtrics.System.productName=='ThreeSixty')
{QFileButton='';}
if(firstButton!=null)
{options.toolbar=[[firstButton,'QSmartText','QImage',QFileButton,'QVideo','-','SpecialChar','Table','Link','Unlink'],['Undo','Redo'],['JustifyLeft','JustifyCenter','JustifyRight','-','Outdent','Indent','-','NumberedList','BulletedList'],['Source'],'/',['RemoveFormat'],['Font','FontSize'],['Bold','Italic','Underline','-','Subscript','Superscript'],['BGColor','TextColor']];}
var ckid=$(id).id;if(CKEDITOR.instances&&CKEDITOR.instances[ckid])
{CKEDITOR.remove(CKEDITOR.instances[ckid]);}
if(options&&!options.language&&Qualtrics.User.language)
{options.language=Qualtrics.User.language;}
var editor=CKEDITOR.replace(id,options);if(updateOnSubmit){Event.observe('Page','submit',function(){if(editor)
{var data=editor.getData();$(id).value=data;}});}
return editor;}
function submitAllCheckBoxes(notCheckedValue)
{var elements=document.getElementsByTagName("input");for(var i=0;i<elements.length;i++)
{if(elements[i].getAttribute("type")=="checkbox")
{if(!elements[i].checked)
{if(elements[i].getAttribute("notCheckedValue"))
var elemNotCheckedValue=elements[i].getAttribute("notCheckedValue");else
elemNotCheckedValue=notCheckedValue;elements[i].style.visibility='hidden';elements[i].checked=true;elements[i].value=elemNotCheckedValue;}}}}
function submitButton(element,formID,inputID,inputName,inputValue)
{var form=$(formID);var input=$(inputID);if(input)
{input.setAttribute('name',inputName);input.setAttribute('value',inputValue);}
submitForm(formID);}
function setupCalendarObserver(elementID,buttonElementID,destinationElementID)
{var calendarClickObserver=function(event){Event.stopObserving($(elementID),'click',calendarClickObserver);Event.stop(event);displayCalendar($(destinationElementID),"yyyy-mm-dd",$(buttonElementID),false,null);var calendarCloseCheck=function(event){if(event&&!event.findElement('#calendarDiv'))
{closeCalendar();Event.stopObserving(document,'click',calendarCloseCheck);if($(elementID))
$(elementID).observe('click',calendarClickObserver);}};Event.observe(document,'click',calendarCloseCheck);};$(elementID).observe('click',calendarClickObserver);}
function qualtricsPopupCalendar(buttonElementID,destinationElementID,xoffset,yoffset)
{displayCalendar($(destinationElementID),"yyyy-mm-dd",$(buttonElementID),false,null);}
function qualtricsPopupCalendarWithTime(buttonElementID,destinationElementID,xoffset,yoffset)
{displayCalendar($(destinationElementID),"yyyy-mm-dd hh:ii",$(buttonElementID),true,null);}
function qualtricsPopupCalendarMonthPicker(buttonElementID,destinationElementID,xoffset,yoffset)
{Qualtrics.QMonthPicker.displayCalendar($(destinationElementID),"yyyy-mm",$(buttonElementID),false);}
function getPositioningExtras(width,height)
{if(!Qualtrics.Browser.Gecko||screen.width==null||screen.width=='undefined'||screen.availLeft==null||screen.availLeft=='undefined')
return'';var left=(screen.width-width)/2;if(screen.availLeft>100||screen.availLeft<100)
left+=screen.availLeft;var top=(screen.height-height)/2;if(screen.availTop>50||screen.availTop<50)
top+=screen.availTop;return"left="+left+",top="+top+",";}
var fullscreenCallBack=false;var fullscreenOnComplete=false;function assignFullScreen(el){el.onmousedown=function(){if($('FullScreenLabel')){new Effect.Fade($('FullScreenLabel'),{duration:0.5,afterFinish:function(){$('FullScreenLabel').remove();}});}
el.downFlag=true;var cn=Element.classNames(el);if(Element.hasClassName(el,'FullScreenActivated')){cn.remove("FullScreenActivated");}else{cn.add("FullScreenActivated");}};el.onmouseup=function(){el.downFlag=false;};el.onmouseout=function(){if(el.downFlag){if($(el).hasClassName("FullScreenActivated")){$(el).removeClassName("FullScreenActivated");}else{$(el).addClassName("FullScreenActivated");}}
el.downFlag=false;$(el).removeClassName("Over");};el.onclick=function(){toggleFullScreen(el);clearOverRegistry();};}
function toggleFullScreen(el,options){if(!el)
{el=$('FullScreen');}
if(fullscreenCallBack)
{fullscreenCallBack();}
else
{if(el.isFull)
{if(options&&options.fullScreenOnly)
{return;}
$(document.body).removeClassName('Full');$('center').setStyle({width:null});$('Toolbar').setStyle({width:null,marginRight:'0',left:'0'});el.isFull=false;}
else
{$(document.body).addClassName('Full');$('center').setStyle({width:'100%'});$('Toolbar').setStyle({width:'100%',marginRight:'0',left:'0'});el.isFull=true;}
if(options&&options.preventOnComplete)
{return;}
if(fullscreenOnComplete){fullscreenOnComplete();}}}
function chunk(a,s)
{for(var x,i=0,c=-1,l=a.length,n=[];i<l;i++)
(x=i%s)?n[c][x]=a[i]:n[++c]=[a[i]];return n;}
function getScrollInfo()
{return QualtricsTools.getScrollInfo();}
function updateScroll()
{window.scrollInfo=getScrollInfo();}
function getPageCenter(offsetObject)
{var offsetX=0;var offsetY=0;var scrollInfo=getScrollInfo();if(offsetObject)
{var width=$(offsetObject).getWidth();var height=$(offsetObject).getHeight();offsetX=Math.round(width/2);offsetY=Math.round(height/2);}
var s=getPageSize();var x=s[2];var y=s[3];return[Math.round(x/2)-offsetX+scrollInfo[0],Math.round(y/2)-offsetY+scrollInfo[1]];}
function stripNewLines(text)
{return text.replace(/(\n\r|\n|\r)/g,' ');}
function isValidDate(dateStr)
{return QualtricsCPTools.regex.date.test(dateStr);}
function isValidEmail(email)
{return QualtricsCPTools.regex.email.test(email);}
function isValidURL(url)
{return QualtricsCPTools.regex.url.test(url);}
function isValidGUID(str,prefix)
{if(prefix)
{return QualtricsCPTools.regex.guid.test(str)&&str.startsWith(prefix+'_');}
else
return QualtricsCPTools.regex.guid.test(str);}
window.getMessage=Qualtrics.getMessage;function benchmark(startd,end,label){var seconds=(end.getTime()-startd.getTime())/1000;var time=Math.round(seconds*100)/100;return(label+": "+time);}
if(!Qualtrics.Messages)
Qualtrics.Messages={};Object.extend(Qualtrics.Messages,{mouseDown:false,mouseDrag:false});Event.observe(window,'load',runOnLoads);function runOnLoads()
{if($('MessageBox'))
{Event.observe($('MessageBox'),'mouseover',HoldMessageBox);Event.observe($('MessageBox'),'mouseout',ReleaseMessageBox);Event.observe($('MessageBox'),'click',function(evt)
{if(evt)
{var el=Event.element(evt);if(evt.ctrlKey)
{QualtricsCPTools.hideDebugs=true;}
if(el&&el.tagName!='INPUT'&&el.tagName!='BUTTON'&&el.tagName!='A'&&!Qualtrics.Messages.mouseDrag)
{var ignoreClick=false;var depth=3;var depthEl=el;while(depth>=0&&ignoreClick==false)
{if(depthEl.getAttribute('ignoreMsgClick')=='1')
{ignoreClick=true;}
if(depthEl.parentNode)
{depthEl=depthEl.parentNode;depth--;}
else
{depth=-1;}}
if(!ignoreClick)
HideMessage(true);}}});Event.observe($('MessageBox'),'mousedown',function(evt)
{Qualtrics.Messages.mouseDown=true;Qualtrics.Messages.mouseDrag=false;});Event.observe($('MessageBox'),'mouseup',function(evt)
{Qualtrics.Messages.mouseDown=false;});Event.observe($('MessageBox'),'mousemove',function(evt)
{if(Qualtrics.Messages.mouseDown)
Qualtrics.Messages.mouseDrag=true;});$('MessageBox').oncontextmenu=function(){PermaMessageBox();return false;};}
if(Qualtrics.Browser.IE&&Qualtrics.Browser.Version<7)
{var days=0;var today=new Date();var year=2010;var eoy=new Date(year,11,31);var diff=Date.UTC(eoy.getYear(),eoy.getMonth(),eoy.getDate(),0,0,0)-Date.UTC(today.getYear(),today.getMonth(),today.getDate(),0,0,0);days=diff/1000/60/60/24;if(days<0)
days=0;if($('SystemMessageArea'))
{var browserWarning;$('SystemMessageArea').appendChild(QualtricsCPTools.roundy(QBuilder('div',null,[browserWarning=QBuilder('div',{className:'message'}),QBuilder('br'),getMessage('SiteWide','BrowserUpgrade'),QBuilder('ul',null,[QBuilder('li',null,[QBuilder('a',{href:'http://www.getfirefox.com',className:'Firefox',target:'_blank'},[QBuilder('strong',{className:'icon'}),QBuilder('strong',null,'Firefox'),QBuilder('span',null,' (Free)')])]),QBuilder('li',null,[QBuilder('a',{href:'http://www.google.com/chrome',className:'Chrome',target:'_blank'},[QBuilder('strong',{className:'icon'}),QBuilder('strong',null,'Chrome'),QBuilder('span',null,' (Free)')])]),QBuilder('li',null,[QBuilder('a',{href:'http://www.microsoft.com/windows/Internet-explorer/default.aspx',className:'IE8',target:'_blank'},[QBuilder('strong',{className:'icon'}),QBuilder('strong',null,'Internet Explorer 8'),QBuilder('span',null,' (Free)')])]),QBuilder('li',null,[QBuilder('a',{href:'http://code.google.com/chrome/chromeframe/',className:'IE8',target:'_blank'},[QBuilder('strong',{className:'icon'}),QBuilder('strong',null,'Chrome Frame Plugin'),QBuilder('span',null,' (Free)')])])]),QBuilder('div',{className:'clear'})]),{className:'BrowserWarning',id:'BrowserWarning'}));browserWarning.innerHTML=getMessage('SiteWide','BrowserWarning');}}}
Qualtrics.Inputs={autoHideFocus:function(evt)
{if(!evt)evt=window.event;var el=Event.element(evt);Qualtrics.Inputs.autoHideFade(el);},autoHideClick:function(el)
{Qualtrics.Inputs.autoHideFade(el);},autoHideFade:function(el)
{var forEl=$(el.getAttribute('autohide'));if(forEl&&!forEl.autofaded)
{forEl.autofaded=true;$(forEl).addClassName('Fade');}
if(!el.onblur)
{el.onblur=Qualtrics.globalBlurHandler;}
Qualtrics.Inputs.autoHide(el);},autoHide:function(el)
{var forEl=$(el.getAttribute('autohide'));if(forEl&&$(forEl))
{if(el.value!=''&&!forEl.autohidden)
{forEl.autohidden=true;$(forEl).hide();}}},autoShow:function(el)
{if(el.getAttribute('autohide'))
{var forEl=$(el.getAttribute('autohide'));if(forEl)
{if(el.value==''&&forEl.autohidden)
{forEl.autohidden=false;$(forEl).show();}}}},autoHideBlur:function(el)
{if(el.getAttribute('autohide'))
{var forEl=$(el.getAttribute('autohide'));if(forEl)
{if(forEl.autofaded)
{forEl.autofaded=false;$(forEl).removeClassName('Fade');}
Qualtrics.Inputs.autoShow(el);}}},checkForPrepopulatedValue:function(el)
{Qualtrics.Inputs.autoHideFade(el);},watchInputsForAutoComplete:function(var_args)
{var args=arguments;setInterval(function(){Qualtrics.Inputs.checkInputsForAutoComplete.apply(this,args)},100);},checkInputsForAutoComplete:function(var_args)
{for(var i=0,len=arguments.length;i<len;++i)
{Qualtrics.Inputs.autoHide(arguments[i]);}},autoHideKeyUp:function(el,evt)
{if(el.getAttribute('autohide')){var forEl=$(el.getAttribute('autohide'));if(el.value=='')
{if(evt&&evt.keyCode==Event.KEY_DELETE||evt.keyCode==Event.KEY_BACKSPACE)
{if(forEl)
{forEl.autohidden=false;$(forEl).show();}}}
else
{forEl.autohidden=true;$(forEl).hide();}}},autoHideKeyDown:function(el,evt)
{if(el.getAttribute('autohide'))
{var forEl=$(el.getAttribute('autohide'));if(forEl)
{forEl.autohidden=true;$(forEl).hide();}
if(el.value=='')
{if(evt&&evt.keyCode==Event.KEY_TAB)
{forEl.autohidden=false;$(forEl).show();}}}}};Qualtrics.globalBlurHandler=function(evt)
{evt=evt||window.event;var clickedEl=Event.element(evt);Qualtrics.Inputs.autoHideBlur(clickedEl);var callback=clickedEl.getAttribute('blurcallback');Qualtrics.Event.baseDistributerReader(evt,clickedEl,'blurcallback');};Qualtrics.globalContextMenuHandler=function(evt)
{evt=evt||window.event;var el=Event.element(evt);if(el.nodeName=='INPUT')
{if(el.getAttribute('autoclear')&&el.value==el.getAttribute('autoclear')){el.value='';$(el).removeClassName('AutoClearMessage');}
else if(el.getAttribute('autohide'))
{if(el.getAttribute('autohide')){var forEl=$(el.getAttribute('autohide'));if(forEl)
{$(forEl).hide();}}}}};Event.observe(document,'contextmenu',Qualtrics.globalContextMenuHandler);if(!Qualtrics.showPermissionError_ActivateSurvey)
{Qualtrics.showPermissionError_ActivateSurvey=function()
{alert(getMessage('ErrorCodes','ESEC35'));};}
Qualtrics.showPermissionError_DeactivateSurvey=function()
{alert(getMessage('ErrorCodes','ESEC26'));};Qualtrics.showPermissionError_ActivateSurvey_XDataCenter=function()
{alert(getMessage('ErrorCodes','ESEC35'));};Qualtrics.showPermissionError_DeactivateSurvey_XDataCenter=function()
{alert(getMessage('ErrorCodes','ESEC26'));};var QualtricsCPTools={cachedFixedPosSupport:null,regex:{email:/^([a-zA-Z0-9\'_\+\.\-\&\/])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,url:/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,guid:/^[0-9a-zA-Z]{1,4}_[0-9a-zA-Z]{11,15}$/,date:/^\d{4}(\-|\/|\.)\d{1,2}(\-|\/|\.)\d{1,2}$/,number:/^[0-9]+$/,SSOUserName:/.+#.+/},ttOn:function(evt,el,sn,tag,ul,uID){translationTip.on(el,evt,sn,tag,ul,uID);},showTip:function(template,options){var src='Ajax.php?action=ShowTip&t='+template;var windowOptions={id:'tipWindow',width:(options.width||400)+'px',padding:0};if(options.onClose)
{windowOptions.onClose=options.onClose;}
if(options.closeButton===false)
{windowOptions.closeButton=false;}
var tipWindow=new Q_Window(windowOptions);var tip=QBuilder('div',{className:'HelpTip',id:'ShowTip'});new Ajax.Updater(tip,src,{evalScripts:true,parameters:options.parameters||null,onComplete:function()
{if(options.onComplete)
{try
{Qualtrics.Event.execute.defer(options.onComplete);}
catch(e)
{console.error(e);}}
tipWindow.center();},asynchronous:options.asynchronous===undefined?true:options.asynchronous});tipWindow.setContent(tip);},disableButton:function(id)
{var button=$(id);if(button)
{$(button).addClassName('disabled');if(button.hasAttribute('clickcallback'))
{button.setAttribute('pendingcallback',button.getAttribute('clickcallback'));button.removeAttribute('clickcallback');}}},enableButton:function(id)
{var button=$(id);button.disabled=false;if(button)
{$(button).removeClassName('disabled');if(button.hasAttribute('pendingcallback'))
{button.setAttribute('clickcallback',button.getAttribute('pendingcallback'));button.removeAttribute('pendingcallback');}}},closeTip:function(){Q_Window.closeWindow('tipWindow');},feedback:function(url)
{var popup=new Q_Window({id:'Feedback',title:'Support & Feedback',width:'650px',height:'650px',closeButton:true,url:url,iframescrolling:true});var content=QBuilder('div',{},[]);},inviteFriend:function(){var win=new Q_Window({id:'inviteFriend',width:'auto',title:"Invite a Friend to use Qualtrics",buttons:[{icon:'cancel',className:'negative',text:'Cancel',clickcallback:'Q_Window.closeWindow'},{icon:'check',text:'Send',id:'SendInvite',className:'disabled',clickcallback:'QualtricsCPTools.inviteFriendCallbacks.save'}]});var content=QBuilder('form',{id:'inviteFriendForm'},[QBuilder('div',null,[QBuilder('strong',null,"Friend's Email"),QBuilder('br'),QBuilder('input',{type:'text',className:'TextBox',id:'email',name:'email',keyupcallback:'QualtricsCPTools.inviteFriendCallbacks.checkEmail'})]),QBuilder('div',null,[QBuilder('strong',null,'Message'),QBuilder('br'),QBuilder('textarea',{name:'message',className:'TextBox'},"I use Qualtrics for my research and have been impressed with it.  I thought you might like to try it out.  I have arranged for you to have a free account.")])]);win.setContent(content);win.showCenter();$('email').activate();},inviteFriendCallbacks:{save:function()
{if(!$('SendInvite').hasClassName('disabled'))
{new Ajax.Request('Ajax.php?action=InviteFriend',{parameters:$('inviteFriendForm').serialize(),onSuccess:function()
{$('SendInvite').addClassName('disabled');var count=Number($('inviteNum').innerHTML);if(count>0)
count--;$('inviteNum').innerHTML=count;msg('Invitation Sent');Q_Window.closeWindow();}});}},checkEmail:function()
{if(QualtricsCPTools.regex.email.test($F('email')))
{$('SendInvite').removeClassName('disabled');}
else
{$('SendInvite').addClassName('disabled');}}},showAlertDialog:function(options)
{var zIndex=2020000;if(options.zIndex)
{zIndex=options.zIndex;}
var okText='OK';if(options.okText)
okText=options.okText;var showButton=true;if(options.showCloseButton===false)
showButton=false;var icon='check';if(options.icon)
icon=options.icon;var button=QBuilder('a',{className:'qbutton'},okText);if(options.okButtonClassName)
button.addClassName(options.okButtonClassName);var buttons=(options.buttons)?options.buttons:[];if(icon&&icon!='none'&&options.buttons&&!buttons[0].icon)
buttons[0]['icon']=icon;var win=new Q_Window({id:'alertDialog',className:(options.className||'')+' alertDialog',width:'auto',title:options.title||getMessage('SiteWide','Alert'),zIndex:zIndex,buttons:buttons,closeButton:showButton});if(!options.okCallBack)
{options.okCallBack=function(){win.close();};}
else
{var f=options.okCallBack;options.okCallBack=function()
{try{Qualtrics.Event.execute(f);}
catch(e)
{console.error('callback function error:'+e);}
win.close();};}
if(buttons.length==0)
{Event.observe(button,'click',options.okCallBack);win.rightFooterArea.appendChild(button);}
var content=QBuilder('table',{},[QBuilder('tbody',null,[QBuilder('tr',null,[QBuilder('th',null,[QBuilder('div',{className:'warningGraphic'})]),QBuilder('td',null,[QBuilder('div',{className:'message',id:options.messageDivId||'message'},[options.message])])])])]);win.setContent(content);win.showCenter();},showConfirmDialog:function(opts)
{var callback=function(action,params){this.destroy();if(action)
Qualtrics.Event.execute(action,params);};return new Q_Window({id:'alertDialog',className:(opts.className||'')+' alertDialog',width:opts.width||'auto',title:opts.title,buttons:['cancel:cancelCallBack|'+(opts.cancelText||getMessage('SiteWide','No')),'ok:okCallBack|'+(opts.okText||getMessage('SiteWide','Yes'))],okButtonHelper:callback.curry(opts.okCallBack||'',opts.okCallBackParams||[]),cancelButtonHelper:callback.curry(opts.cancelCallBack||'',opts.cancelCallBackParams||[]),content:QBuilder('table',{},[QBuilder('tbody',null,[QBuilder('tr',null,[QBuilder('th',null,[QBuilder('div',{className:'warningGraphic'})]),QBuilder('td',null,[QBuilder('div',{className:'message'},[opts.message||''])])])])])});},showPromptDialog:function(opts)
{opts=opts||{};var input=QBuilder('input',{id:'PromptDialogInput',value:opts.value||'',keyentercallback:'Q_Window.okButtonHelper('+(opts.okCallBack||'')+')',type:'text'});var window=new Q_Window({className:'PromptDialog BigFields',width:'auto',title:opts.title,content:QBuilder('div',{},[QBuilder('label',{},opts.prompt||''),input]),okButtonHelper:function(action){var val=$F($(this.content).down('input'));this.destroy();QualtricsCPTools.executeDotSyntax(action,null,null,null,{'$val':val,'$value':val});},buttons:['cancel|'+(opts.cancelText||''),'ok:'+(opts.okCallBack||'')+'|'+(opts.okText||'')]});if(opts.value)
{QualtricsCPTools.select(input,0,opts.value.length);}
else
{$(input).focus();}},showUpgradeDialog:function(contentType)
{var win=new Q_Window({id:'UpgradeAccountPopup',width:'auto',height:'auto',title:getMessage('Registration','UpgradeToUseFeature'),zIndex:2020000,closeButton:true});new Ajax.Request('Ajax.php?action=getBrandAdminContactInfo',{onComplete:function(brandAdminTransport)
{new Ajax.Request('Ajax.php?action=GetUpgradePopupContent',{parameters:{content:contentType},onComplete:function(transport){var content="";var contactHeader=null;var brandAdminText=JSON.parse(brandAdminTransport.responseText);if(brandAdminText.length>0)
{var contactChildren=[QBuilder('h3',{},getMessage('ErrorCodes','ESEC94')),QBuilder('br',{})];for(var i=0;i<brandAdminText.length;i++)
{contactChildren.push(QBuilder('h3',{},brandAdminText[i]));}
contactHeader=QBuilder('div',{className:'contactInfo'},contactChildren);}
if(transport.responseText==""||contactHeader!=null){var message='ESEC69';if(contentType==='QuestionsPerSurvey'){message='ESEC99';}
content=QBuilder('div',{className:'main'},[QBuilder('div',{className:'content'},[QBuilder('div',{className:'clear'},[QBuilder('div',{className:'whole'},[QBuilder('h3',{},getMessage('ErrorCodes',message)),contactHeader])]),QBuilder('div',{className:'clear'},[QBuilder('div',{className:'whole'},[QBuilder('a',{className:'ok button',clickcallback:'Q_Window.closeWindow',p1:'UpgradeAccountPopup'},getMessage('SiteWide','OK'))])])])]);}
else
{var json=transport.responseText.evalJSON();if(json["Feature"])
{contentType=json["Feature"];}
var benefits=QBuilder('ul');for(var i=0,ilen=json.Benefits.Benefit.length;i<ilen;i++)
{benefits.appendChild(QBuilder('li',{},json.Benefits.Benefit[i]));}
content=QBuilder('div',{className:'main'},[QBuilder('div',{className:'content'},[QBuilder('div',{className:'clear'},[QBuilder('div',{className:'whole'},[QBuilder('h2',{},json.Headline)])]),QBuilder('div',{className:'clear'},[QBuilder('div',{className:'oneThird'},[QBuilder('img',{src:"../WRQualtricsShared/UpgradePopup/Images/"+json.Image})]),QBuilder('div',{className:'twoThirds'},[QBuilder('h3',{},'Benefits:'),benefits])]),QBuilder('div',{className:'clear'},[QBuilder('div',{className:'whole'},[QBuilder('h3',{},'Real World Application:'),QBuilder('p',{},json.RealWorldApplication)])]),QBuilder('div',{className:'clear'},[QBuilder('div',{className:'half'},[QBuilder('a',{className:'upgrade button',clickcallback:'QualtricsCPTools.showUpgradeForm',p1:contentType,p2:'UpgradeAccountPopup'},'Upgrade My Account')]),QBuilder('div',{className:'half'},[QBuilder('a',{className:'noThanks button',clickcallback:'Q_Window.closeWindow',p1:'UpgradeAccountPopup'},'No Thanks')])])])]);}
win.setContent(content);win.center();}});}});},showUpgradeForm:function(product,windowId)
{var surveyLink='https://survey.qualtrics.com/SE/?SID=SV_0cheXlKJ5WZq4Pa';if(windowId)
{win=Q_Window.closeWindow(windowId);}
if(!product)
{product='Unknown';}
var url=surveyLink
+'&Name='+Qualtrics.User['name']
+'&Email='+Qualtrics.User.email
+'&userId='+Qualtrics.User.userId
+'&product='+product
+'&Q_lang='+Qualtrics.User.language;url=encodeURI(url);var win=new Q_Window({id:'UpgradeAccountSurvey',width:'560px',height:'500px',url:url,zIndex:2020000,closeButton:true});},showWhyUpgradeDialog:function()
{var win=new Q_Window({id:'WhyUpgradeLightbox',width:750,height:650,zIndex:2020000,content:QBuilder('a',{clickcallback:'QualtricsCPTools.showUpgradeForm',p1:false,p2:'WhyUpgradeLightbox'},[QBuilder('img',{src:'../WRQualtricsShared/Graphics/WhyUpgrade.png'})]),closeButton:true});},showHelpMenu:function(qualtricsLink,wikiLink,helpLink)
{return QMenu.showMenu({items:[{display:getMessage('SiteWide','QualtricsUniversity'),params:{href:wikiLink+'/'+helpLink,target:'_blank'}}]},$('HelpButton'));},showActivateConfirmation:function(options)
{options.activate=true;this.showDeleteConfirmation(options);},showDeleteConfirmation:function(options)
{if(typeof(options)=="string")
{options=options.evalJSON();}
if(!(options instanceof Object))
{options={};}
var title='Delete';var strongConfirm=false;var secondConfirm=false;var deleteButtonText='Delete';var deleteMessage=getMessage('SiteWide','DeleteConfirmMessage');var confirmDeleteText=getMessage('SiteWide','ConfirmDelete').toLowerCase();var deleteCallBackParameters={};var confirmAction=null;var windowZIndex=options.windowZIndex;var deletingMessage=getMessage('Deleting');var activate=false;if(options.disable)
{title='Disable';deleteMessage=getMessage('SiteWide','DisableConfirmMessage');confirmDeleteText=getMessage('SiteWide','ConfirmDisable').toLowerCase();deletingMessage=getMessage('Disabling');deleteButtonText=getMessage('ServerAdminSection','Disable');}
if(options.title)
{title=options.title;}
if(options.strong)
{strongConfirm=true;}
if(options.secondConfirm)
{secondConfirm=true;}
if(options.deleteButtonText)
{deleteButtonText=options.deleteButtonText;}
if(options.deleteMessage)
{deleteMessage=options.deleteMessage;}
if(options.deletingMessage)
{deletingMessage=options.deletingMessage;}
if(options.deleteCallBackParameters)
{deleteCallBackParameters=options.deleteCallBackParameters;}
if(options.confirmAction)
{confirmAction=options.confirmAction;}
if(options.confirmDeleteText)
{confirmDeleteText=options.confirmDeleteText;}
if(options.activate)
{activate=options.activate;}
this.advancedOptions=options.advancedOptions;this.deleteConfirmationCompleteOnEnter=function(e)
{if(!e)e=window.event;if(e.keyCode==Event.KEY_RETURN)
{QualtricsCPTools.deleteConfirmationComplete(e);Event.stop(e);}};this.deleteConfirmationCancel=function()
{Q_Window.closeAllWindows('deleteConfirmation');};this.deleteConfirmationComplete=function(e)
{var skipStrong=false;var skipSecond=false;if(e.shiftKey&&(e.ctrlKey||e.metaKey))
{skipStrong=true;skipSecond=true;}
if(deleteCallBackParameters.strong)
{if(skipStrong)
{Event.stop(e);}
else
{var confirmed=$('confirmationInput').value.toLowerCase();var confirmCloseText=getMessage('SiteWide','ConfirmClose').toLowerCase();if(confirmAction&&confirmAction=='Deactivate')
{if(confirmed!=confirmCloseText&&confirmed!='"'+confirmCloseText+'"')
{QualtricsCPTools.showAlertDialog({message:getMessage('SiteWide','MustConfirmClose')});return false;}}
else
{if(confirmed!=confirmDeleteText.toLowerCase()&&confirmed!='"'+confirmDeleteText.toLowerCase()+'"')
{QualtricsCPTools.showAlertDialog({message:getMessage('SiteWide','MustConfirmDeletion')});return false;}}}
if($('CloseSessions'))
{deleteCallBackParameters.ajaxParameters['CloseSessions']=$('CloseSessions').checked;}
if(deleteCallBackParameters.secondConfirm&&!skipSecond)
{var newOptions=deleteCallBackParameters.options;newOptions['strong']=false;newOptions['deleteMessage']=deleteCallBackParameters.options.confirmMessage;this.confirmedOptions={};for(var s in this.advancedOptions)
{if($('advancedOptionCheckbox'+s).checked)
{newOptions['deleteMessage']+='<br/><br/> - '+this.advancedOptions[s].label;this.confirmedOptions[s]=true;}}
newOptions.hideAdvancedOptions=true;Q_Window.closeAllWindows('deleteConfirmation');this.showDeleteConfirmation(newOptions);return false;}}
if(deleteCallBackParameters.ajaxAction)
{var action=deleteCallBackParameters.ajaxAction;var parametersForAjax=deleteCallBackParameters.ajaxParameters;if(deleteCallBackParameters.longAjax)
var longAjax=true;else
var longAjax=false;if(this.advancedOptions!=null)
{for(var s in this.advancedOptions)
{if((this.confirmedOptions&&this.confirmedOptions[s])||($('advancedOptionCheckbox'+s)&&$('advancedOptionCheckbox'+s).checked))
{parametersForAjax[s]='true';}}}
if(options.optionalInput)
{if($(options.optionalInputName)&&$(options.optionalInputName).checked)
{parametersForAjax[options.optionalInputName]='true';}}
if(parametersForAjax!='')
{if(longAjax)
var url="LongAjax.php?action=";else
var url="Ajax.php?action=";new Ajax.Request(url+action,{parameters:parametersForAjax,onComplete:function(transport){Q_Window.closeAllWindows('deleteConfirmation');if(confirmAction&&confirmAction=='Deactivate')
{if(!parametersForAjax.admin||parametersForAjax.admin!=1)
{if(window.MySurveys&&parametersForAjax.el)
{MySurveys.uncheckElement(parametersForAjax.el,parametersForAjax.SID,parametersForAjax.svd);}}}
if(deleteCallBackParameters.ajaxOnComplete)
{QualtricsCPTools.executeDotSyntax(deleteCallBackParameters.ajaxOnComplete,null,null,null,{'$transport':transport});}},onSuccess:function(transport){Q_Window.closeAllWindows('deleteConfirmation');if(confirmAction&&confirmAction=='Deactivate')
{if(!parametersForAjax.admin||parametersForAjax.admin!=1)
{if(window.MySurveys&&parametersForAjax.el)
{MySurveys.uncheckElement(parametersForAjax.el,parametersForAjax.SID,parametersForAjax.svd);}}}
if(deleteCallBackParameters.ajaxOnSuccess)
{QualtricsCPTools.executeDotSyntax(deleteCallBackParameters.ajaxOnSuccess,null,null,null,{'$transport':transport});}}});}}
if(deleteCallBackParameters.javascriptAction)
{var params=deleteCallBackParameters.javascriptParameters||[];if(!Object.isArray(params))
params=[params];var instanceid=deleteCallBackParameters.javascriptInstanceId||null;QualtricsCPTools.executeDotSyntax(deleteCallBackParameters.javascriptAction,instanceid,null,null,null,params);Q_Window.closeAllWindows('deleteConfirmation');return true;}
if(deleteCallBackParameters.javascriptFunction)
{deleteCallBackParameters.javascriptFunction();Q_Window.closeAllWindows('deleteConfirmation');return true;}
if(confirmAction&&confirmAction=='Deactivate')
{deletingMessage=getMessage('Deactivating');}
else if(options.deletingMessage)
{deletingMessage=options.deletingMessage;}
var button=$('ConfirmDeleteButton');if(button)
{$(button).setAttribute('clickcallback','');$(button).addClassName('Disabled');$('ConfirmDeleteButton').innerHTML=deletingMessage;}};var confirmTextInput=QBuilder('input',{autocomplete:'off',type:'text',id:'confirmationInput',name:'confirmationInput',className:'TextBox'});Event.observe(confirmTextInput,'keydown',QualtricsCPTools.deleteConfirmationCompleteOnEnter);deleteCallBackParameters.strong=strongConfirm;deleteCallBackParameters.secondConfirm=secondConfirm;deleteCallBackParameters.options=options;if(confirmAction&&confirmAction=='Deactivate')
{var confirmationForm=QBuilder('div',{id:'deleteConfirmationForm'},[QBuilder('div',{className:'confirmMessage'},[getMessage('SiteWide','MustEnterClose',getMessage('SiteWide','ConfirmClose'))]),confirmTextInput,QBuilder('table',{className:'PopUpWarningTable'},[QBuilder('tbody',null,[QBuilder('tr',{},[QBuilder('td',{},[QBuilder('input',{type:'checkbox',name:'CloseSessions',id:'CloseSessions',value:'true',checked:'true',className:'checkbox'})]),QBuilder('td',{},[QBuilder('label',{className:'PopUpWarningText',htmlFor:'CloseSessions'},[getMessage('MySurveysSection','CloseSessions')])])])])])]);}
else
{var confirmMessage=getMessage('SiteWide','MustEnterDelete',confirmDeleteText);if(options&&options.strongConfirmPrompt)
{confirmMessage=options.strongConfirmPrompt;}
confirmationForm=QBuilder('div',{id:'deleteConfirmationForm'},[QBuilder('div',{className:'confirmMessage'},confirmMessage),confirmTextInput]);}
var strongConfirmHeading=QBuilder('div',{className:'deleteHeader'},getMessage('SiteWide','WarningCaption'));var className=options.className||'';var contentClass='deleteConfirmationContainer '+(strongConfirm?'strong':'')+' '+className;var contentChildren=[QBuilder('div',{className:'deleteWarningGraphic'}),QBuilder('div',{className:'rightContainer'},[(strongConfirm)?strongConfirmHeading:'',QBuilder('div',{className:'deleteMessage',id:'deleteMessage'},''),(strongConfirm)?confirmationForm:'']),QBuilder('div',{className:'clear'})];if(this.advancedOptions!=null&&!options.hideAdvancedOptions)
{var checkboxes=[];for(var advOption in this.advancedOptions){var label=this.advancedOptions[advOption].label;var value=this.advancedOptions[advOption].value;if(this.advancedOptions[advOption].newLine)
{checkboxes.push(QBuilder('br'));}
checkboxes.push(QBuilder('input',{className:'checkbox',id:'advancedOptionCheckbox'+advOption,type:'checkbox',checked:value}));checkboxes.push(QBuilder('label',{'for':'advancedOptionCheckbox'+advOption},label));}
contentChildren.push(QBuilder('br',{}));contentChildren.push(QBuilder('div',{className:'rightContainer'},[QBuilder('div',{className:'advancedOptions'},checkboxes)]));}
if(options.optionalInput)
{var optionalInput=[];optionalInput.push(QBuilder('input',{className:'checkbox',type:'checkbox',id:options.optionalInputName,name:options.optionalInputName}));optionalInput.push(QBuilder('label',{'for':options.optionalInputName},options.optionalInputLabel));contentChildren.push(QBuilder('br',{}));contentChildren.push(QBuilder('div',{className:'deleteConfirmation'},optionalInput));}
var content=QBuilder('div',{className:contentClass},contentChildren);var alreadyActiveConfirm=Q_Window.getInstanceByWindowName('deleteConfirmation');if(alreadyActiveConfirm)
{console.error('Already a delete confirm active. Cannot have more than one. Aborting...');return;}
var buttonOptions=null;if(activate)
{buttonOptions=[{icon:'',text:getMessage('SiteWide','Cancel'),click:'QualtricsCPTools.deleteConfirmationCancel',className:'neutral'},{icon:'check',text:deleteButtonText,click:'QualtricsCPTools.deleteConfirmationComplete',p1:'$evt',className:'positive',id:'ConfirmDeleteButton'}];}
else
{buttonOptions=[{icon:'',text:getMessage('SiteWide','Cancel'),click:'QualtricsCPTools.deleteConfirmationCancel',className:'neutral'},{icon:'cancel',text:deleteButtonText,click:'QualtricsCPTools.deleteConfirmationComplete',p1:'$evt',className:'negative',id:'ConfirmDeleteButton'}];}
var deleteConfirmation=new Q_Window({id:'deleteConfirmation',className:(options.className||'')+' deleteConfirmation',title:title,width:'auto',height:'auto',zIndex:windowZIndex,closeButton:true,buttons:buttonOptions});deleteConfirmation.setContent(content);if(typeof deleteMessage=='string')
$('deleteMessage').innerHTML=deleteMessage;else
$('deleteMessage').appendChild(deleteMessage);deleteConfirmation.center();if(options.strong&&$(confirmTextInput))
$(confirmTextInput).focus();},createNewId:QualtricsTools.createNewId,getInstanceHelper:QualtricsTools.getInstanceHelper,getPageSize:function()
{return getPageSize();},select:function(el,start,end)
{$(el).focus();if(document.selection)
{var completeEntry=el.createTextRange();completeEntry.findText(el.value.substring(start,end));completeEntry.select();}
else{el.setSelectionRange(start,end);}},focusInput:function(el,opt_pos)
{return QualtricsTools.focusInput(el,opt_pos);},Overlay:{hasOverlay:false,suspend:false,ShowOverlay:function(options){if(!QualtricsCPTools.Overlay.suspend)
{return new Q_Overlay(options);}},HideOverlay:function(hideWindow,options){if(!QualtricsCPTools.Overlay.suspend)
{Q_Overlay.removeAll();}}},roundy:function(insideDiv,options)
{if(!options)options={};options=Object.extend({id:'','className':'','color':'black','hasClose':false,rootType:'div'},options);return QBuilder(options.rootType,{id:options.id,className:'RoundedCorners Roundy '+options.className},[QBuilder('div',{className:'TopRight'},[QBuilder('div',{className:'BottomLeft'},[QBuilder('div',{className:'BottomRight'},[insideDiv])])])]);},fadeElement:function(id)
{var afterFinish;if(window['QES_Global'])
{afterFinish=QES_Global.getTopCacheClearFunction();}
new Effect.Fade($(id),{duration:0.5,afterFinish:afterFinish});},executeDotSyntax:Qualtrics.Event.executeDotSyntax,getDotSyntaxParts:Qualtrics.Event.getDotSyntaxParts,preventEvents:Qualtrics.Event.preventEvents,stopPreventingEvents:Qualtrics.Event.stopPreventingEvents,buildDotSyntaxStringFromNode:function(node)
{var callback=node.getAttribute('clickcallback');var instanceid=node.getAttribute('instanceid');var params=QualtricsCPTools.packageParameters(node);return QualtricsCPTools.buildDotSyntaxString(callback,params,instanceid);},buildDotSyntaxString:function(command,parameters,instanceid)
{if(!command)
return false;var str=command;if(instanceid)
{str+=(':'+instanceid);}
if(parameters&&parameters.length)
{str+='(';for(var i=0,ilen=parameters.length;i<ilen;i++)
{str+=parameters[i];if(i<parameters.length-1)
str+=',';}
str+=')';}
else if(str.indexOf('(')==-1)
{str+='()';}
return str;},stripComments:function(text)
{return text.replace(/<!--(.|\n|\r)*?-->/g,"");},stripFormatting:function(text)
{text=QualtricsCPTools.stripComments(text);text=text.replace(/<[Bb][Rr][^>]*>/g,"##br##");text=text.replace(/<\/[Pp]>/g,"##/p##");text=text.replace(/<[Pp][^>]*>/g,"##p##");text=text.replace(/<[Ii][Mm][Gg][^>]/g,"##img##");text=text.stripTags();text=text.replace(/##br##/g,"<br>");text=text.replace(/##p##/g,"<P>");text=text.replace(/##\/p##/g,"</P>");text=text.replace(/##img##/g,"<img ");return text;},stripMostFormatting:function(text)
{text=QualtricsCPTools.stripComments(text);text=text.replace(/<[Bb][Rr][^>]*>/g,"~#br#~");text=text.replace(/<[Pp][^>]*>/g,"~#p#~");text=text.replace(/<\/[Pp]>/g,"~#/p#~");text=text.replace(/<[Bb][^>]*>/g,"~#b#~");text=text.replace(/<\/[Bb]>/g,"~#/b#~");text=text.replace(/<[Ss][Tt][Rr][Oo][Nn][Gg][^>]*>/g,"~#strong#~");text=text.replace(/<\/[Ss][Tt][Rr][Oo][Nn][Gg]>/g,"~#/strong#~");text=text.replace(/<[Ee][Mm][^>]*>/g,"~#em#~");text=text.replace(/<\/[Ee][Mm]>/g,"~#/em#~");text=text.replace(/<[Uu][^>]*>/g,"~#u#~");text=text.replace(/<\/[Uu]>/g,"~#/u#~");text=text.replace(/<[Ii][^>]*>/g,"~#i#~");text=text.replace(/<\/[Ii]>/g,"~#/i#~");text=text.replace(/<[Dd][Ii][Vv][^>]*>/g,"~#div#~");text=text.replace(/<\/[Dd][Ii][Vv]>/g,"~#/div#~");text=text.replace(/<span/gi,"~#span#~");text=text.replace(/<\/span>/gi,"~#/span#~");text=text.replace(/<[Tt][Aa][Bb][Ll][Ee][^>]*>/g,"~#table#~");text=text.replace(/<\/[Tt][Aa][Bb][Ll][Ee]>/g,"~#/table#~");text=text.replace(/<[Tt][Rr][^>]*>/g,"~#tr#~");text=text.replace(/<\/[Tt][Rr]>/g,"~#/tr#~");text=text.replace(/<[Tt][Dd][^>]*>/g,"~#td#~");text=text.replace(/<\/[Tt][Dd]>/g,"~#/td#~");text=text.replace(/<[Tt][Hh][^>]*>/g,"~#th#~");text=text.replace(/<\/[Tt][Hh]>/g,"~#/th#~");text=text.stripTags();text=text.replace(/~#br#~/g,"<br />");text=text.replace(/~#p#~/g,"<p>");text=text.replace(/~#\/p#~/g,"</p>");text=text.replace(/~#b#~/g,"<strong>");text=text.replace(/~#\/b#~/g,"</strong>");text=text.replace(/~#u#~/g,"<u>");text=text.replace(/~#\/u#~/g,"</u>");text=text.replace(/~#i#~/g,"<em>");text=text.replace(/~#\/i#~/g,"</em>");text=text.replace(/~#div#~/g,"<div>");text=text.replace(/~#\/div#~/g,"</div>");text=text.replace(/~#span#~/g,"<span");text=text.replace(/~#\/span#~/g,"</span>");text=text.replace(/~#strong#~/g,"<strong>");text=text.replace(/~#\/strong#~/g,"</strong>");text=text.replace(/~#em#~/g,"<em>");text=text.replace(/~#\/em#~/g,"</em>");text=text.replace(/~#table#~/g,"<table class='UserTable'>");text=text.replace(/~#\/table#~/g,"</table>");text=text.replace(/~#tr#~/g,"<tr>");text=text.replace(/~#\/tr#~/g,"</tr>");text=text.replace(/~#td#~/g,"<td>");text=text.replace(/~#\/td#~/g,"</td>");text=text.replace(/~#th#~/g,"<th>");text=text.replace(/~#\/th#~/g,"</th>");return text;},selectSurveyOnload:function()
{var select=$('SurveySelect');if(select&&select.options&&select.options[select.selectedIndex].getAttribute('folder')==1)
{if(Qualtrics.Browser.Gecko)
select.addClassName('FireFoxFolder');}},selectSurvey:function(select)
{if(select.options[select.selectedIndex].getAttribute('folder')==1)
{select.addClassName('Folder');if(Qualtrics.Browser.Gecko)
select.addClassName('FireFoxFolder');var folders=$('SurveySelector');var selects=folders.getElementsByTagName('div');var showElement=null;var hideElement=null;for(var i=0;i<selects.length;i++)
{var element=$(selects[i]);if(element.getAttribute('folderDiv')=='1')
{if("SurveyFolder_"+select.value==element.id)
{showElement=element;}
else
{if(element.getStyle('display')!='none')
{hideElement=element;}}}}
if(hideElement&&showElement)
{var hidden=false;select.blur();hideElement.focus();Effect.Appear(showElement,{duration:0.5,afterUpdate:function()
{if(!hidden)
{hideElement.setStyle({display:'none'});hidden=true;}},afterFinish:function(){}});}
else
{select.blur();hidden=false;if(showElement)
{new Effect.BlindRight(showElement,{duration:0.35,afterUpdate:function()
{if(!hidden)
{showElement.focus();hidden=true;}},afterFinish:function()
{showElement.focus();}});}}}
else
{select.removeClassName('Folder');select.removeClassName('FireFoxFolder');PageAction("setActiveSurvey",select.value);}},smartTruncateSelectBox:function(selectNode,opt_size,opt_cutSize,opt_startAt)
{var cutSize=opt_cutSize||3;var startAt=0;if(opt_startAt!==undefined)
{startAt=opt_startAt;}
var size=opt_size||100;var list=selectNode.childNodes;var uniques={};var uniquesCount=0;for(var i=startAt,len=list.length;i<len;++i)
{var opt=list[i].innerHTML.strip();var lastPart=opt.substring(opt.length-cutSize,opt.length);if(!uniques[lastPart])
{++uniquesCount;}
uniques[lastPart]=1;}
var percentThatHaveTheSameEnding=uniquesCount/(list.length-startAt);for(i=startAt,len=list.length;i<len;++i)
{if(list[i].innerHTML.length>size)
{var full=list[i].innerHTML;if(percentThatHaveTheSameEnding<0.6)
{list[i].innerHTML=list[i].innerHTML.truncate(size);}
else
{list[i].innerHTML=QualtricsCPTools.middleTruncate(list[i].innerHTML,size);}
list[i].title=full;}}},middleTruncate:function(v,size,rep)
{if(v&&v.length>size)
{if(rep==undefined)
{rep='...';}
var middle=(size/2)-(rep.length);var end=v.substring(v.length-middle,v.length);var start=v.substring(0,middle);v=start+rep+end;}
return v;},setTimeoutTimer:function()
{var page=$('Page');if(page&&page.ClientAction)
{QualtricsCPTools.preventSessionTimeout();QualtricsCPTools.resetTimeoutTimer();if(Qualtrics.TimeoutInterval)
{clearInterval(Qualtrics.TimeoutInterval);}
Qualtrics.TimeoutInterval=setInterval(function(){Qualtrics.TimeoutTimerCountDown--;if(Qualtrics.TimeoutTimerCountDown==0)
{new Ajax.Request('Ajax.php?action=getRemainingSessionMinutes',{onSuccess:function(transport)
{var minutesRemaining=transport.responseText.evalJSON();var minutesLeeway=10;if(minutesRemaining<=minutesLeeway)
{if(Qualtrics.savePage)
Qualtrics.savePage();var countDown=120;var win=new Q_Window('Keepalive',{title:'You are about to be logged out due to inactivity',buttons:[{text:'Cancel',click:'QualtricsCPTools.cancelTimeout'},'close:PageAction(Logout)|Logout']});win.setContent(QBuilder('div',{},['If you do nothing you will automatically be logged out in ',QBuilder('span',{id:'TimeoutTimer'},countDown),' Seconds']));if(Qualtrics.TimeoutMiniTimer)
{Qualtrics.TimeoutMiniTimer.stop();}
Qualtrics.TimeoutMiniTimer=new PeriodicalExecuter(function(pe){if($('TimeoutTimer'))
{countDown--;$('TimeoutTimer').innerHTML=countDown;if(countDown<1)
{pe.stop();PageAction('Logout');}}
else
{pe.stop();}},1);}
else
Qualtrics.TimeoutTimerCountDown=Math.min(minutesRemaining-minutesLeeway,55);}});}},60*1000);}},cancelTimeout:function()
{Q_Window.closeWindow('Keepalive');QualtricsCPTools.resetTimeoutTimer();if(Qualtrics.TimeoutMiniTimer)
{Qualtrics.TimeoutMiniTimer.stop();}
QualtricsCPTools.keepAlive();},resetTimeoutTimer:function()
{Qualtrics.TimeoutTimerCountDown=55;QualtricsCPTools.keepAlive();},resetKeepAliveTimer:function()
{Qualtrics.KeepAliveTimerCountDown=30;},keepAlive:function()
{if(Qualtrics.KeepAliveTimerCountDown<=0)
{new Ajax.Request('Ajax.php?action=keepAlive');QualtricsCPTools.resetKeepAliveTimer();}},preventSessionTimeout:function()
{QualtricsCPTools.resetKeepAliveTimer();if(Qualtrics.KeepAliveInterval)
{clearInterval(Qualtrics.KeepAliveInterval);}
Qualtrics.KeepAliveInterval=setInterval(function(){Qualtrics.KeepAliveTimerCountDown--;},60*1000);},getBooleanClassName:function(variable,value,className)
{return(variable==value)?className:'';},activateSurveyAccessibilityCheck:function(callback,surveyID)
{QModules.loadModule('Accessibility.js');Accessibility.activateSurveyAccessibilityCheck(callback,surveyID);},buildAccountMenu:function(hideMessageCenter)
{var items=[{display:Qualtrics.System.brandDescription,disabled:true,className:'BrandName'},{display:Qualtrics.User.name+' - '+Qualtrics.User.accountType,disabled:true,className:'UserName'}];if(Qualtrics.System.AvailableProducts)
{var count=0;for(var product in Qualtrics.System.AvailableProducts)
{count++;}
if(count>1)
{var canAccessCP=!!Qualtrics.System.AvailableProducts.ControlPanel;var canAccessThreeSixty=!!Qualtrics.System.AvailableProducts.ThreeSixty;var canAccessSI=!!Qualtrics.System.AvailableProducts.SiteIntercept;var canAccessContacts=!!Qualtrics.System.AvailableProducts.Contacts;var productSwitchers={ControlPanel:{display:getMessage('SiteMenu','ControlPanel'),action:'QualtricsCPTools.changeProduct(ControlPanel)'},ThreeSixty:{display:getMessage('SiteMenu','ThreeSixty'),action:'QualtricsCPTools.changeProduct(ThreeSixty)'},SiteIntercept:{display:getMessage('SiteMenu','SiteIntercept'),action:'QualtricsCPTools.changeProduct(SiteIntercept)'},Contacts:{display:getMessage('SiteMenu','Contacts'),action:'QualtricsCPTools.changeProduct(Contacts)'}};var activeProduct=productSwitchers[Qualtrics.System.productName];activeProduct.action='';activeProduct.keepmenuopen=true;activeProduct.className='ActiveProduct';if(canAccessCP)
items.push(productSwitchers.ControlPanel);if(canAccessThreeSixty)
items.push(productSwitchers.ThreeSixty);if(canAccessSI)
items.push(productSwitchers.SiteIntercept);if(canAccessContacts)
items.push(productSwitchers.Contacts);items.push({separator:true});}}
if(Qualtrics.User.displayUserOptIn==='1')
{var displayDisableOptOutDate=false;var forceTransitionDate=window.Qualtrics&&window.Qualtrics.User&&window.Qualtrics.User.genesisForceTransitionDate;var disableOptOutDate=window.Qualtrics&&window.Qualtrics.User&&window.Qualtrics.User.genesisDisableOptOutDate;if(forceTransitionDate&&disableOptOutDate)
{displayDisableOptOutDate=Date.parse(forceTransitionDate)<=new Date();}
else if(disableOptOutDate)
{displayDisableOptOutDate=true;}
if(displayDisableOptOutDate)
{items.push({htmlContent:''+
getMessage('SiteMenu','CPRedesignOptIn')+'<em class="Description">'+getMessage('SiteMenu','CPRedesignTransition',disableOptOutDate)+'</em>'+'',action:'PageAction(UIRefreshOptIn, 1)',defer:true,className:'Genesis'});}
else
{items.push({display:getMessage('SiteMenu','CPRedesignOptIn'),action:'PageAction(UIRefreshOptIn, 1)',defer:true});}
items.push({separator:true});}
if(Qualtrics.System.ControlPanelRefresh)
{items.push({display:getMessage('SiteMenu','AccountSettings')+'...',action:'PageAction(ChangePage, UserSettingsSection)',defer:true});}
else
{items.push({display:getMessage('SiteMenu','AccountSettings')+'...',action:'PageAction(ChangePage, UserSettingsSection, UserSettings)',defer:true});}
if(!hideMessageCenter)
{if(Qualtrics.System.ControlPanelRefresh)
{items.push({htmlContent:getMessage('SiteMenu','ReadMessages')+'... <b>('+Qualtrics.User.newMessageCount+')</b>',action:'PageAction(ChangePage,InboxSection, , ,true)',defer:true});}
else
{items.push({htmlContent:getMessage('SiteMenu','ReadMessages')+'... <b>('+Qualtrics.User.newMessageCount+')</b>',action:'PageAction(ChangePage,MessageCenterSection,MessageCenter, ,true)',defer:true});}}
items.push({separator:true});if($('SupportAndFeedback'))
{var feedbackLink=$('SupportAndFeedback').value;var feedback={display:getMessage('SiteWide','SupportAndFeedback'),action:'QualtricsCPTools.feedback('+feedbackLink+')'};items.push(feedback);}
items.push({display:getMessage('SiteMenu','RefreshAccount'),action:'PageAction(RefreshUserInformation)',defer:true});items.push({display:getMessage('SiteMenu','Logout'),action:'PageAction(Logout)',defer:true});items.push({domNode:'QualtricsCPTools.SupportLoginEnabler.buildAllowSupportLoginEnabler',keepmenuopen:true});return{className:'AccountMenu',items:items,onMenuClose:'QualtricsCPTools.accountMenuClosed'};},accountMenuClosed:function()
{QualtricsCPTools.SupportLoginEnabler.accountMenuClosed();},changeProduct:function(product)
{if(product&&Qualtrics.System.AvailableProducts&&Qualtrics.System.AvailableProducts[product])
{var relUrl=Qualtrics.System.AvailableProducts[product];var a=document.createElement('a');a.href=relUrl;window.location.href=a.href;}},browserSupportsFixedPosition:function()
{if(this.cachedFixedPosSupport===null)
{var testBox=QBuilder('div');$(testBox).setStyle({position:'fixed',top:'0px'});$('pageDiv').appendChild(testBox);var pos=testBox.offsetTop;removeElement(testBox);if(pos===0)
{this.cachedFixedPosSupport=true;}
else
{this.cachedFixedPosSupport=false;}}
return this.cachedFixedPosSupport;},modernBrowserWarning:function(){var win=new Q_Window('OutcomesBrowserWarning',{id:'IENotSupportedSplash',width:'auto',height:'auto',title:getMessage('EditSection','UpgradeBrowser'),zIndex:2020000,closeButton:true});var browserWarning=QBuilder('div',null,[QBuilder('div',{className:'error-message'},[getMessage('EditSection','IENotSupported')]),QBuilder('ul',null,[QBuilder('li',null,[QBuilder('div',{className:'browser-option'},[QBuilder('a',{href:'http://www.getfirefox.com',className:'firefox',target:'_blank'},[QBuilder('strong',null,'Firefox'),QBuilder('span',null,' (Free)')])])]),QBuilder('li',null,[QBuilder('div',{className:'browser-option'},[QBuilder('a',{href:'http://www.google.com/chrome',className:'chrome',target:'_blank'},[QBuilder('strong',null,'Chrome'),QBuilder('span',null,' (Free)')])])]),QBuilder('li',null,[QBuilder('div',{className:'browser-option'},[QBuilder('a',{href:'http://www.microsoft.com/windows/Internet-explorer/default.aspx',className:'ie',target:'_blank'},[QBuilder('strong',null,'Internet Explorer 9+'),QBuilder('span',null,' (Free)')])])])])]);win.setContent(browserWarning);win.center();},updateScrollables:function(scrollableId,parentContainer,scrollableWrapperId)
{if($(scrollableId))
{var scrollTop=getScrollInfo()[1];var scrollablePos;if(scrollableWrapperId!=null)
{scrollablePos=Position.cumulativeOffset($(scrollableWrapperId))[1];}
else
{if($(parentContainer))
{scrollablePos=Position.cumulativeOffset($(parentContainer))[1];}}
var newScrollable=scrollTop-scrollablePos;if(newScrollable<0)
{newScrollable=0;}
var fixedPosition=this.browserSupportsFixedPosition();if($(parentContainer)){var parentHeight=$(parentContainer).getHeight();var height=$(scrollableId).getHeight();var parentOffset=Position.cumulativeOffset($(parentContainer))[1];var distanceFromBottom=parentHeight-(scrollablePos-parentOffset);if(height+newScrollable>=distanceFromBottom)
{newScrollable=distanceFromBottom-height;if(newScrollable<0)
{newScrollable=0;}
fixedPosition=false;}}
if(fixedPosition)
{if(scrollTop>scrollablePos)
{var width=$(scrollableId).getWidth();newScrollable=0;$(scrollableId).setStyle({position:'fixed',width:width+'px'});}
else
{$(scrollableId).setStyle({position:'static'});fixedPosition=false;}
$(scrollableId).setStyle({top:(newScrollable)+'px'});}
else
{$(scrollableId).setStyle({position:'relative'});$(scrollableId).setStyle({top:(newScrollable)+'px'});}
return fixedPosition;}},numberFormat:function(number,decimals,dec_point,thousands_sep)
{number=(number+'').replace(/[^0-9+\-Ee.]/g,'');var n=!isFinite(+number)?0:+number,prec=!isFinite(+decimals)?0:Math.abs(decimals),sep=(typeof thousands_sep==='undefined')?',':thousands_sep,dec=(typeof dec_point==='undefined')?'.':dec_point,s='',toFixedFix=function(n,prec)
{var k=Math.pow(10,prec);return''+Math.round(n*k)/k;};s=(prec?toFixedFix(n,prec):''+Math.round(n)).split('.');if(s[0].length>3)
{s[0]=s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g,sep);}
if((s[1]||'').length<prec)
{s[1]=s[1]||'';s[1]+=new Array(prec-s[1].length+1).join('0');}
return s.join(dec);},hexToRgb:function(hex_string,default_)
{if(default_==undefined)
{default_=null;}
if(hex_string.substr(0,1)=='#')
{hex_string=hex_string.substr(1);}
var r;var g;var b;if(hex_string.length==3)
{r=hex_string.substr(0,1);r+=r;g=hex_string.substr(1,1);g+=g;b=hex_string.substr(2,1);b+=b;}
else if(hex_string.length==6)
{r=hex_string.substr(0,2);g=hex_string.substr(2,2);b=hex_string.substr(4,2);}
else
{return default_;}
r=parseInt(r,16);g=parseInt(g,16);b=parseInt(b,16);if(isNaN(r)||isNaN(g)||isNaN(b))
{return default_;}
else
{return{r:r/255,g:g/255,b:b/255};}},rgbToHex:function(r,g,b,includeHash)
{r=Math.round(r*255);g=Math.round(g*255);b=Math.round(b*255);if(includeHash==undefined)
{includeHash=true;}
r=r.toString(16);if(r.length==1)
{r='0'+r;}
g=g.toString(16);if(g.length==1)
{g='0'+g;}
b=b.toString(16);if(b.length==1)
{b='0'+b;}
return((includeHash?'#':'')+r+g+b).toUpperCase();},hsvToRgb:function(hue,saturation,value)
{var red;var green;var blue;if(value==0.0)
{red=0;green=0;blue=0;}
else
{var i=Math.floor(hue*6);var f=(hue*6)-i;var p=value*(1-saturation);var q=value*(1-(saturation*f));var t=value*(1-(saturation*(1-f)));switch(i)
{case 1:red=q;green=value;blue=p;break;case 2:red=p;green=value;blue=t;break;case 3:red=p;green=q;blue=value;break;case 4:red=t;green=p;blue=value;break;case 5:red=value;green=p;blue=q;break;case 6:case 0:red=value;green=t;blue=p;break;}}
return{r:red,g:green,b:blue};},rgbToHsv:function(red,green,blue)
{var max=Math.max(Math.max(red,green),blue);var min=Math.min(Math.min(red,green),blue);var hue;var saturation;var value=max;if(min==max)
{hue=0;saturation=0;}
else
{var delta=(max-min);saturation=delta/max;if(red==max)
{hue=(green-blue)/delta;}
else if(green==max)
{hue=2+((blue-red)/delta);}
else
{hue=4+((red-green)/delta);}
hue/=6;if(hue<0)
{hue+=1;}
if(hue>1)
{hue-=1;}}
return{h:hue,s:saturation,v:value};},questionTextHasIllegalScripting:function(newText,oldText){var canUseJavascript=Survey.getInstance().getPermission('allowJavaScript',true);if(canUseJavascript){return false;}
var blacklist=[/onabort\s*=/i,/onblur\s*=/i,/onchange\s*=/i,/onclick\s*=/i,/ondblclick\s*=/i,/ondragdrop\s*=/i,/onerror\s*=/i,/onfocus\s*=/i,/onkeydown\s*=/i,/onkeypress\s*=/i,/onkeyup\s*=/i,/onload\s*=/i,/onmousedown\s*=/i,/onmousemove\s*=/i,/onmouseout\s*=/i,/onmouseover\s*=/i,/onmouseup\s*=/i,/onmove\s*=/i,/onreset\s*=/i,/onresize\s*=/i,/onselect\s*=/i,/onsubmit\s*=/i,/onunload\s*=/i,/<script/i];var newTextHasScript=false,oldTextHasScript=false;blacklist.forEach(function(regex){if(newText.match(regex)){newTextHasScript=true;}
if(oldText.match(regex)){oldTextHasScript=true;}});return(newTextHasScript&&!oldTextHasScript);}};QualtricsCPTools.SupportLoginEnabler={intervalPeriod:5000,intervalId:null,domNode:null,loginRequested:false,requestorEmail:null,innerDisplay:null,displayText:null,errors:0,errorThreshold:5,allowSupportLoginInProgress:false,self:'QualtricsCPTools.SupportLoginEnabler',build:function()
{if(!this.domNode)
this.domNode=QBuilder('div',{id:'AllowSupportLoginEnabler',clickcallback:this.self+'.allowSupportLogin',className:'Requested'});return this.domNode;},buildAllowSupportLoginEnabler:function(opt_repositionCallback)
{this.repositionMenuCallback=opt_repositionCallback||Qualtrics.Menu.positionMenus;this.build();this.hide();var that=this;this.checkForSupportLoginRequested();this.intervalId=setInterval(function(){that.checkForSupportLoginRequested()},this.intervalPeriod);return this.domNode;},show:function()
{var firstTime=false;if(this.requestorEmail)
{if(!this.innerDisplay)
{this.displayText=getMessage('SiteWide','AllowSupportLogin',getMessage('UserSettingsSection','QualtricsSupport'));this.innerDisplay=QBuilder('span',{},this.displayText);firstTime=true;}
$(this.domNode).appendChild(this.innerDisplay);}
$(this.domNode).show();this.repositionMenuCallback();},hide:function()
{$(this.domNode).hide();},destroy:function()
{this.stopAjaxRequests();$(this.domNode).remove();this.domNode=null;},stopAjaxRequests:function()
{if(this.intervalId)
{clearInterval(this.intervalId);this.intervalId=null;}},accountMenuClosed:function()
{this.stopAjaxRequests();},handleError:function()
{this.loginRequested=false;this.errors++;if(this.errors>this.errorThreshold)
{this.stopAjaxRequests();console.error('too many errors, stop polling for Login Requested');}},checkForSupportLoginRequested:function()
{if(this.loginRequested)
{this.supportLoginRequested();}
else
{var that=this;new Ajax.Request('Ajax.php?action=GetPermissionedLogins',{onSuccess:function(transport)
{var response=transport.responseText.evalJSON();if(response)
{for(var i=0;i<response.length;++i)
{var permissionedLogin=response[i];if(permissionedLogin.Accepted!==true&&permissionedLogin.Email.indexOf('@')!==-1){that.requestorEmail=permissionedLogin.Email;that.loginRequested=true;that.supportLoginRequested();break;}}}
else
{that.loginRequested=false;}},onFailure:function()
{that.handleError.apply(that);}});}},supportLoginRequested:function()
{this.stopAjaxRequests();this.show();},supportLoginGranted:function(duration)
{this.stopAjaxRequests();this.displayText=getMessage('SiteWide','SupportLoginGranted',getMessage('UserSettingsSection','QualtricsSupport'));this.innerDisplay=QBuilder('span',{},[this.displayText]);var newDomNode=QBuilder('div',{id:'AllowSupportLoginEnabler',className:'Enabled'},[this.innerDisplay]);$(this.domNode).replace(newDomNode);this.domNode=newDomNode;this.repositionMenuCallback();},allowSupportLogin:function()
{var that=this;if(!this.allowSupportLoginInProgress)
{var finshedSaveGrantAcess=false;var finishedSavePermissionedLogin=false;this.allowSupportLoginInProgress=true;new Ajax.Request('Ajax.php?action=SaveGrantAccess',{parameters:{loginType:'GrantLoginOther',expireTime:'+7 day',email:undefined},onSuccess:function(transport)
{if(transport.responseText!='')
{var result=transport.responseText.evalJSON();if(result.Diff&&result.Date){console.log('allowing Qualtrics Support to login for '+result.Diff);that.supportLoginGranted();}}},onFailure:function()
{that.handleError.apply(that);},onComplete:function()
{finshedSaveGrantAcess=true;if(finishedSavePermissionedLogin)
that.allowSupportLoginInProgress=false;}});new Ajax.Request('Ajax.php?action=SavePermissionedLogin',{parameters:{loginType:'SavePermissionedLogin',expireTime:'+7 day',email:that.requestorEmail},onSuccess:function(transport)
{if(transport.responseText!='')
{var result=transport.responseText.evalJSON();if(result.Diff&&result.Date){console.log('allowing '+that.requestorEmail+' to login for '+result.Diff);that.supportLoginGranted();}}},onFailure:function()
{that.handleError();},onComplete:function()
{finishedSavePermissionedLogin=true;if(finshedSaveGrantAcess)
that.allowSupportLoginInProgress=false;}});}}};QualtricsCPTools.Highlighter=Class.create();QualtricsCPTools.Highlighter.registry=new Array();QualtricsCPTools.Highlighter.autoHighlight=function(element,options)
{if($(element))
{if(!options){options={};}
options.targetObj=element;if(options&&options.type&&options.type=='class')
{return new QualtricsCPTools.Highlighter(options).render();}
else
{var width=$(element).getWidth();var height=$(element).getHeight();var pos=Position.cumulativeOffset($(element));options.x=pos[0];options.y=pos[1];options.width=width;options.height=height;}
return new QualtricsCPTools.Highlighter(options).render();}};QualtricsCPTools.Highlighter.getAll=function()
{return QualtricsCPTools.Highlighter.registry;};QualtricsCPTools.Highlighter.removeAll=function()
{for(var i=0,len=QualtricsCPTools.Highlighter.registry.length;i<len;++i)
{QualtricsCPTools.Highlighter.registry[i].remove();}
QualtricsCPTools.Highlighter.registry.length=0;};QualtricsCPTools.Highlighter.getById=function(id)
{for(var i=0,len=QualtricsCPTools.Highlighter.registry.length;i<len;++i)
{if(QualtricsCPTools.Highlighter.registry[i].id==id)
return QualtricsCPTools.Highlighter.registry[i];}
return null;};QualtricsCPTools.Highlighter.prototype={id:null,x:null,y:null,width:null,height:null,element:null,options:null,backgroundColor:null,color:null,opacity:0.6,type:'overlay',className:null,zIndex:10001,targetObj:null,initialize:function(options)
{if(options&&options.type)
{this.type=options.type;}
if(options&&options.className)
{this.className=options.className;}
if(options&&options.id)
{this.id=options.id;}
if(options&&options.targetObj)
{this.targetObj=options.targetObj;}
else
{if(options&&options.type=="class")
{console.error('if you use a "class" highlighter, you must use options.targetObj');return;}}
if(options&&options.backgroundColor)
{if(options.backgroundColor=='red')
{options.backgroundColor='#C75E5E';}
if(options.backgroundColor=='blue')
{options.backgroundColor='#3D72D6';}
this.backgroundColor=options.backgroundColor;}
if(options&&options.color)
{if(options.color=='red')
{options.color='#C75E5E';}
if(options.color=='blue')
{options.color='#3D72D6';}
this.color=options.color;}
if(options&&options.opacity)
{this.opacity=options.opacity;}
if(options&&options.zIndex)
{this.zIndex=options.zIndex;}
if(this.type=='overlay')
{var x=options.x;var y=options.y;var width=options.width;var height=options.height;if(!options||x==undefined||y==undefined||width==undefined||height==undefined)
{return QES_Error('an overlay highlight needs x, y, width, and height in the options');}
this.x=Number(x)+1;this.y=Number(y)+1;this.width=Number(width);this.height=Number(height);if(Qualtrics.Browser.IE)
{this.x=Number(x)+2;this.y=Number(y)+2;}
if(options&&options.padding)
{this.x=this.x-(options.padding);this.y=this.y-(options.padding);this.width=this.width+(options.padding*2);this.height=this.height+(options.padding*2);}
if(!options||!options.backgroundColor)
{this.backgroundColor='white';}
if(this.color)this.backgroundColor=this.color;}
this.options=options;QualtricsCPTools.Highlighter.registry.push(this);return this;},render:function()
{if(this.type=='overlay')
{var highlighter=QBuilder('div',{className:'Highlighter'});if(this.options.caption)
{highlighter.appendChild(QBuilder('div',{className:'Caption'},this.options.caption));}
$(highlighter).setStyle({opacity:this.opacity,position:'absolute',zIndex:this.zIndex,backgroundColor:this.backgroundColor,top:this.y+'px',left:this.x+'px',width:this.width+'px',height:this.height+'px'});$('pageDiv').appendChild(highlighter);this.element=highlighter;}
else if(this.type=='class')
{$(this.targetObj).addClassName(this.className);if(this.backgroundColor)
{$(this.targetObj).setStyle({backgroundColor:this.backgroundColor});}
if(this.color)
{$(this.targetObj).setStyle({color:this.color});}}
if(this.options&&this.options.onclick)
{var el=this.element;if(this.targetObj)
{el=this.targetObj;}
el.onclick=this.options.onclick;$(el).setStyle({cursor:'pointer'});}
return this;},remove:function()
{if(this.type=='overlay')
{if($(this.element))
{if(this.options&&this.options.onclick)
this.element.onclick=null;removeElement(this.element);}}
else if(this.type=='class')
{if($(this.targetObj))
{$(this.targetObj).removeClassName(this.className);if(this.backgroundColor)
{$(this.targetObj).setStyle({backgroundColor:''});}
if(this.color)
{$(this.targetObj).setStyle({color:''});}
if(this.options&&this.options.onclick)
this.targetObj.onclick=null;$(this.targetObj).setStyle({cursor:''});}}}};QualtricsCPTools.errorHandlers={timeoutRedirect:false,timeout:function(msg)
{if(QualtricsCPTools.errorHandlers.timeoutRedirect)
return;alert(msg);QualtricsCPTools.errorHandlers.timeoutRedirect=true;var s=window.location+'';window.location=s.substring(0,s.indexOf('?'));}};QualtricsCPTools.parseHeaderJSON=function(json,transport)
{if(json)
{if(json['error']&&json['error'].length)
{for(var i=0,error;error=json['error'][i];++i)
{if(QualtricsCPTools.errorHandlers[error['code']])
{QualtricsCPTools.errorHandlers[error['code']](error['message']);}}}
ShowMessage(json,transport);}};QualtricsCPTools.velocimeter={currentVelocity:[0,0],lastPos:null,intervalObj:null,callbacks:null,nextCallbackIndex:'1',started:false,add:function(callback)
{if(!QualtricsCPTools.velocimeter.callbacks)QualtricsCPTools.velocimeter.callbacks={};var index=QualtricsCPTools.velocimeter.nextCallbackIndex;QualtricsCPTools.velocimeter.callbacks[index]=callback;QualtricsCPTools.velocimeter.nextCallbackIndex=String(Number(QualtricsCPTools.velocimeter.nextCallbackIndex)+1);if(!QualtricsCPTools.velocimeter.started)
{QualtricsCPTools.velocimeter.start();}
return index;},remove:function(callbackIndex)
{delete QualtricsCPTools.velocimeter.callback[callbackIndex];for(i in QualtricsCPTools.velocimeter.callbacks)
{return;}
QualtricsCPTools.velocimeter.stop();},start:function()
{QualtricsCPTools.velocimeter.currentVelocity=[0,0];QualtricsCPTools.velocimeter.lastPos=[window.mousePos[0],window.mousePos[1]];QualtricsCPTools.velocimeter.intervalObj=setInterval(QualtricsCPTools.velocimeter.measureVelocity,50);QualtricsCPTools.velocimeter.started=true;},stop:function()
{if(this.intervalObj)
{clearInterval(this.intervalObj);this.intervalObj=null;}
QualtricsCPTools.velocimeter.callbacks=null;QualtricsCPTools.velocimeter.started=false;},measureVelocity:function()
{QualtricsCPTools.velocimeter.currentVelocity=[window.mousePos[0]-QualtricsCPTools.velocimeter.lastPos[0],window.mousePos[1]-QualtricsCPTools.velocimeter.lastPos[1]];QualtricsCPTools.velocimeter.lastPos=[window.mousePos[0],window.mousePos[1]];QualtricsCPTools.velocimeter.executeCallBacks();},executeCallBacks:function()
{for(i in QualtricsCPTools.velocimeter.callbacks)
{QualtricsCPTools.velocimeter.callbacks[i](QualtricsCPTools.velocimeter.currentVelocity);}}};QualtricsCPTools.arrayIntersect=function(a,b,opt_shouldSort)
{a=a.clone();b=b.clone();if(!!opt_shouldSort)
{a.sort();b.sort();}
var result=[];while(a.length>0&&b.length>0)
{if(a[0]<b[0])
a.shift();else if(a[0]>b[0])
b.shift();else
{result.push(a.shift());b.shift();}}
return result;};window.Q_GlobalLogic={getDataFromLocator:function(locator)
{var data={};var aggregate=false;if(locator)
{if(locator.indexOf('%')!=-1)
{locator=decodeURIComponent(locator);}
var locatorParts=this.getLocatorParts(locator);var query=locatorParts.query;if(query!=undefined)
{locator=this.removeQueryStringFromLocator(locator);}
var parts=locator.split('/');data.type=parts[3];if(locator.startsWith('qo://'))
{data.quotaId=parts[2];if(query!=undefined&&query.SV!=undefined)
{data.surveyId=query.SV;}}
else
{data.questionId=parts[2];if(data.questionId&&data.questionId.indexOf('#')!=-1)
{var questionParts=data.questionId.split('#');data.questionId=questionParts[0];data.aggregateId=questionParts[1];aggregate=true;}
if(parts[4]=='Group')
{data.choiceId=parts[5];data.answerIndex=parts[6];data.subType='Group';}
else if(parts[4]=='Rank')
{data.choiceId=parts[5];data.subType='Rank';}
else
{if(data.type=='DisplayableQuestion')
{return data;}
else if(data.type=='SelectableAnswer'||data.type=='SelectedAnswerCount'||data.type=='SelectedChoicesCount')
{data.answerId=parts[4];}
else if(data.type=='Region')
{data.regionId=parts[4];}
else
{data.choiceId=parts[4];}
if(parts.length>5)
{data.answerId=parts[5];}}
if(aggregate)
{data.answerId=data.aggregateId;if(data.type=='SelectableAnswer'||data.type=='SelectedAnswerCount'||data.type=='SelectedChoicesCount')
{data.answerSeriesIndex=parts[4];}
else if(data.type=='ChoiceGroup')
{data.choiceId=parts[5];data.answerSeriesIndex=parts[5];}
else
{data.choiceId=parts[4];data.answerSeriesIndex=parts[5];}
if(data.answerSeriesIndex!==undefined)
{data.answerSeriesIndex--;}}}}
return data;},removeQueryStringFromLocator:function(locator)
{var index=locator.indexOf('?');if(index>=0)
{return locator.substr(0,index);}
else
{return locator;}},getLocatorParts:function(locator)
{if(!locator)
return{};var ret={};var typeStart=locator.indexOf('://');if(typeStart==-1)
return{};ret.type=locator.substring(0,typeStart);var str=locator.substring(typeStart+3);var parts=str.split('?');ret.base=parts[0];var query=parts[1];if(query!=undefined)
{var subparts=query.split('&');ret.query={};for(var i=0,ilen=subparts.length;i<ilen;i++)
{var kvp=subparts[i].split('=');var key=kvp[0];var val=kvp[1];ret.query[key]=val;}}
return ret;},getLocatorFromDataObject:function(data)
{var location1=data['regionId']||data['choiceId']||data.location1;var opt_location2=data['answerId']||data['answerIndex']||data.location2;var id=data.questionId||data.quotaId||data.elementId;var type=data.type;var subType=data.subType;var opt_id2=data.aggregateId;switch(type)
{case'Quota':if(id&&location1)
{var locator="qo://"+encodeURIComponent(id)+"/";if(location1!='QuotaMet'&&location1!='QuotaNotMet')
{location1='QuotaCount';}
locator+=location1;if(opt_location2)
{locator+=('?SV='+opt_location2);}}
else
{locator=null;}
break;case'Status':var prefix='';var key='';switch(data.elementType)
{case'Survey':prefix='s';if(location1=='IsActive'||location1=='IsNotActive')
key='SurveyStatus';break;case'Poll':prefix='p';if(location1=='IsActive'||location1=='IsNotActive')
key='Active';break;}
locator=prefix+'://'+encodeURIComponent(id)+'/'+key;break;case'EmbeddedData':locator='e://Field/'+encodeURIComponent(id);break;case'PanelMember':locator='m://'+encodeURIComponent(id);break;case'SurveyDirectorActionCount':locator='sd://'+encodeURIComponent(id)+'/'+location1+'/Count';break;default:if(!opt_location2)
{opt_location2=undefined;}
if(!opt_id2)
{opt_id2=undefined;}
if(opt_id2)
{id+='#'+opt_id2;}
if(data.loopId)
{id=data.loopId+'_'+id;}
if(data.aggregateId!==undefined)
{if(data.answerSeriesIndex!=undefined)
{opt_location2=Number(data.answerSeriesIndex)+1;}
else
{opt_location2=null;}}
if(location1===undefined||location1===null)
{if(opt_location2!==undefined&&opt_location2!==null)
{location1=opt_location2;opt_location2=null;}}
locator='q://'+encodeURIComponent(id)+'/'+type;if(subType)
{locator+='/'+subType;}
if(location1)
{locator+='/'+location1;}
if(opt_location2!==undefined&&opt_location2!==null&&opt_location2!=="")
{locator+='/'+opt_location2;}
break;}
return locator;},getLocatorFromData:function(id,type,location1,opt_location2,opt_id2,opt_subType)
{var data={type:type};switch(type)
{case'Quota':data.quotaId=id;data.location1=location1;data.location2=opt_location2;break;case'Status':data.elementId=id;data.elementType=opt_location2;data.location1=location1;break;case'SurveyDirectorActionCount':data.elementId=id;data.location1=location1;break;case'EmbeddedData':data.elementId=id;break;case'PanelMember':data.elementId=id;break;default:data.questionId=id;data.location1=location1;data.location2=opt_location2;data.subType=opt_subType;break;}
return Q_GlobalLogic.getLocatorFromDataObject(data);},getDefaultLocatorType:function(questionType,selector)
{var retVal='';switch(questionType)
{case'DB':case'FileUpload':case'Captcha':retVal='DisplayableQuestion';break;case'TE':retVal='ChoiceTextEntryValue';break;case'CS':case'RO':case'Slider':case'Timing':retVal='ChoiceNumericEntryValue';break;case'Matrix':if(selector&&selector=='RO')
{retVal='ChoiceNumericEntryValue';}
else
{retVal='SelectableChoice';}
break;case'SBS':retVal='SelectableAnswer';break;default:retVal='SelectableChoice';break;}
return retVal;},getDefaultOperator:function(locatorType)
{var retVal='';switch(locatorType)
{case'DisplayableQuestion':retVal='Displayed';break;case'SelectableAnswer':case'SelectableChoice':case'DisplayableChoice':retVal='Selected';break;case'ChoiceNumericEntryValue':case'ChoiceTextEntryValue':case'AnswerNumericEntryValue':case'AnswerTextEntryValue':case'SelectedAnswerCount':case'SelectedChoicesCount':retVal='NotEmpty';break;case'EmbeddedField':retVal='EqualTo';break;case'UploadedFile':retVal='Uploaded';break;case'UploadedFileSize':retVal='GreaterThan';break;case'UploadedFileType':retVal='Document';break;}
return retVal;},needsValueBox:function(condition)
{switch(condition)
{case'Displayed':case'NotDisplayed':case'Selected':case'NotSelected':case'Empty':case'NotEmpty':case'QuotaMet':case'QuotaNotMet':case'ClickedIn':case'NotClickedIn':case'Uploaded':case'NotUploaded':case'Document':case'Spreadsheet':case'Graphic':case'PDF':return false;break;default:return true;break;}},getQuestionIdFromLocator:function(locator)
{var data=Q_GlobalLogic.getDataFromLocator(locator);var questionId=data.questionId;if(data.aggregateId)
{questionId+='#'+data.aggregateId;}
return questionId;},getQuestionLeftOperand:function(questionId,choiceLocator,operator,opt_location1,opt_location2,descriptor)
{var values=[];if(descriptor)
{values=descriptor.split(',');}
var blockId=values[0];var loopId=values[1];var locatorData=Q_GlobalLogic.getDataFromLocator(choiceLocator);if(operator=='Displayed'||operator=='NotDisplayed')
{if(locatorData.type=='SelectableAnswer')
{locatorData['type']='AnswerDisplayed';}
else if(locatorData.type=='DisplayableQuestion')
{locatorData['type']='QuestionDisplayed';}
else
{locatorData['type']='ChoiceDisplayed';}}
locatorData.location1=opt_location1;locatorData.location2=opt_location2;if(blockId&&loopId&&loopId!='all'&&loopId!='any')
{locatorData.loopId=loopId;}
var locator=Q_GlobalLogic.getLocatorFromDataObject(locatorData);return locator;},getTypeFromLocator:function(locator)
{return this.getDataFromLocator(locator).type;},questionIsInLoopTextResponse:function(isInLoop)
{var text=isInLoop===true?'yes':'no';return text;},loopAndMergeTargetFunction:function(descriptor){var values=[];if(descriptor)
{values=descriptor.split(',');}
var blockId=values[0];var loop=values[1];if(loop=='all')
{return'evaluateAllInArrayFunction';}
else if(loop=='any')
{return'evaluateAnyInArrayFunction';}
else
{return'none';}},isROQuestionType:function(qId){var question=BaseQuestion.getQuestionByQuestionId(qId);if(question&&question.questionType=='RO')
{return true;}
return false;},canUseRankOrder:function(subtype){if(subtype&&subtype.length>0)
{var exceptions=['NotDisplayedChoices'];if(subtype.toLowerCase().indexOf('choices')>=0)
{return!(exceptions.indexOf(subtype)>=0);}}
return false;}};Ajax.Responders.register({onComplete:function(responseObj){if(responseObj)
{try
{var json;if(Ajax.Response)
responseObj=new Ajax.Response(responseObj);if(responseObj.evalJSON)
{json=responseObj.evalJSON();}
else
{json=responseObj.headerJSON;}
QualtricsCPTools.parseHeaderJSON(json,responseObj.transport);}
catch(e)
{console.error(e);}}}});Ajax.Responders.register({onCreate:function(request)
{try
{request.options=request.options||{};request.options.requestHeaders=request.options.requestHeaders||{};var xsrfCookie=window.Cookie.readCookie('XSRF-TOKEN');request.options.requestHeaders['X-XSRF-TOKEN']=xsrfCookie;}
catch(e)
{console.error(e);}},onComplete:function(requester,trans,xjson)
{if(trans.transport.responseText)
{if(trans.transport.responseText.indexOf('PHP Fatal error:')!=-1)
{console.error("Ajax Fatal Error: "+trans.responseText);}}}});var EditorPopup=Class.create({initialize:function(options)
{this.options=options||{};this.id=QualtricsCPTools.createNewId('EP');EditorPopup.reg[this.id]=this;this.width=650;this.height=300;if(options.width)
this.width=options.width;if(options.height)
this.height=options.height;if(options.contents)
{this.contents=options.contents;}
else
{this.contents='';}
this.initializeButtons();this.buttons=[{icon:'cancel',text:getMessage('SiteWide','Cancel'),click:'EditorPopup.cancel',instanceid:this.id,className:'negative'},{id:'Save',icon:'check',text:getMessage('SiteWide','Save'),click:'EditorPopup.save',instanceid:this.id,className:'positive'}];if(options.fullScreenButton&&this.fullScreenButton)
this.buttons.push(this.fullScreenButton);if(options.clearButton&&this.clearButton)
this.buttons.push(this.clearButton);if(options.buttons&&options.buttons instanceof Array)
{this.buttons=this.buttons.concat(options.buttons);}
this.contentContainer=QBuilder('div',{style:'min-width:'+this.width+'px;min-height:'+this.height+'px;'});this.popup=new Q_Window({id:this.options.id?this.options.id:'EditorPopup',title:options.title,width:'auto',height:'auto',buttons:this.buttons,className:this.options.className||'EditorPopup'});this.popup.setContent(this.contentContainer);if(typeof(options.contents)!='undefined')
{if(Object.isString(options.contents))
{this.setEditorContent();this.popup.center();}
else
{if(options.contents.ajaxAction)
{this.setupAjaxContents();this.popup.center();}}}},initializeButtons:function()
{this.clearButton={icon:'popup',align:'left',text:getMessage('SiteWide','Clear'),click:'EditorPopup.clear',instanceid:this.id,className:'negative'};this.restoreButton={icon:'next',align:'left',text:getMessage('SiteWide','RestoreSize'),click:"EditorPopup.resizePopupToDefault()",instanceid:this.id};this.fullScreenButton={icon:'previous',align:'left',text:getMessage('SiteWide','FullScreen'),click:"EditorPopup.resizePopupToFullScreen()",instanceid:this.id};},setHeaderContent:function(header)
{this.popup.updateHeader(header);},setEditorContent:function()
{this.ta=QBuilder('textarea',{id:this.id},[this.contents]);$(this.ta).setStyle({width:this.width+'px',height:this.height-90+'px'});this.contentContainer.appendChild(this.ta);var that=this;var options={on:{instanceReady:function(e){that.popup.center();e.editor.focus();}}};if(this.options.toolbar)
options.toolbar=this.options.toolbar;if(this.width)
options.width=this.options.width;if(this.height)
options.height=this.options.height;(function(){that.editor=CKEDITOR.replace(that.ta,options)}).defer();},setupAjaxContents:function()
{var waiter=QAjaxWaiter.showMediumRing();this.contentContainer.appendChild(waiter);$(waiter).setStyle({width:this.width+'px',height:this.height+'px'});this.popup.center();if(this.options.contents.ajaxAction)
{var that=this;new Ajax.Request('Ajax.php?action='+this.options.contents.ajaxAction,{parameters:this.options.contents.ajaxParams,onSuccess:function(transport)
{var content=transport.responseText;if(that.options.contents.ajaxResultsFormatter)
{content=that.options.contents.ajaxResultsFormatter(content);}
that.contents=content;that.contentContainer.innerHTML='';that.setEditorContent();}});}},save:function()
{if(this.options.saveCallBack(this.editor.getData(),this)!==false)
{this.closeWindow();}},cancel:function()
{this.closeWindow();},clear:function()
{$(this.ta).value="";},closeWindow:function()
{Q_Window.closeWindow(this.popup.options.id);},resizePopupToFullScreen:function()
{var win=Q_Window.getInstance(this.popup.options.id);var leftButtonsContainer=$(win.footerNode).down('.LeftButtons');leftButtonsContainer.innerHTML="";if(this.options.fullScreenButton&&this.restoreButton)
leftButtonsContainer.appendChild(win.buildButton(this.restoreButton));if(this.options.clearButton&&this.clearButton)
leftButtonsContainer.appendChild(win.buildButton(this.clearButton));this.appendAdditionalButtons(win,leftButtonsContainer);var viewport=getPageSize();var width=viewport.windowWidth-win.getResizeOffset('x')-20;var height=viewport.windowHeight-win.getResizeOffset('y')-20;$(this.ta).setStyle({width:width+"px",height:height+"px"});if(this.resizeContents)
this.resizeContents(width,height);win.setSize(width,height);win.center();},resizePopupToDefault:function()
{var win=Q_Window.getInstance(this.popup.options.id);var leftButtonsContainer=$(win.footerNode).down('.LeftButtons');leftButtonsContainer.innerHTML="";if(this.options.fullScreenButton&&this.fullScreenButton)
leftButtonsContainer.appendChild(win.buildButton(this.fullScreenButton));if(this.options.clearButton&&this.clearButton)
leftButtonsContainer.appendChild(win.buildButton(this.clearButton));this.appendAdditionalButtons(win,leftButtonsContainer);this.resizeContents(this.width,this.height);win.setSize(this.width,this.height);win.center();},appendAdditionalButtons:function(qwindow,container)
{if(this.additionalButtons&&this.additionalButtons.length)
{for(var i=0,len=this.additionalButtons.length;i<len;i++)
{var button=this.additionalButtons[i];if(button['align']==='left')
container.appendChild(qwindow.buildButton(button));}}},resizeContents:function(width,height)
{$(this.ta).setStyle({width:width+"px",height:height+"px"});}});EditorPopup.reg={};EditorPopup.getInstance=QualtricsCPTools.getInstanceHelper(EditorPopup.reg);var CodeMirrorEditorPopup=Class.create(EditorPopup,{setEditorContent:function(opt_replacementContents)
{QModules.loadStylesheet('codemirroreditor.css',{blocking:true});QModules.loadModule('/WRQualtricsShared/JavaScript/CodeMirror/js/codemirror.js');var container=QBuilder('div',{className:'cssEditorContainer'});if(opt_replacementContents)
{this.contents=opt_replacementContents;}
this.ta=QBuilder('textarea',{id:this.id},this.contents);$(container).setStyle({height:this.height+'px',width:this.width+'px'});container.appendChild(this.ta);this.popup.setContent(container);this.loadEditor.curry(this).delay();},loadEditor:function(that)
{that.editor=window.CodeMirror.fromTextArea($(that.ta),{matchBrackets:true,content:that.contents,textWrapping:false,height:that.height+'px',width:that.width+'px',indentUnit:4,indentWithTabs:true,smartIndent:true,lineNumbers:(!!that.options.lineNumbers),extraKeys:{"Ctrl-S":function(instance){return that.keySave(instance);},"Cmd-S":function(instance){return that.keySave(instance);}}});if(that.options.mode)
{window.CodeMirror.modeURL="../WRQualtricsShared/JavaScript/CodeMirror/js/%Nsyntax.js";that.editor.setOption("mode",that.options.mode);window.CodeMirror.autoLoadMode(that.editor,that.options.mode);}
if(that.options.alwaysFullScreen)
{that.resizePopupToFullScreen();}
else
{that.resizePopupToDefault();}},keySave:function()
{if(this.options.keySaveCallBack)
{return this.options.keySaveCallBack(this.editor.getValue());}
return undefined;},save:function()
{if(this.options.saveCallBack(this.editor.getValue())!==false)
{this.closeWindow();}},clear:function(optionalCode)
{this.editor.setValue(optionalCode||"");},resizeContents:function(width,height)
{if(this.options.apiLink)
{height-=25;}
$(this.ta).parentElement.setStyle({height:height+'px',width:width+'px'});this.editor.setSize(width,height);this.editor.refresh();}});var CSSEditorPopup=Class.create(CodeMirrorEditorPopup,{initialize:function($super,options)
{options.mode='css';$super(options);}});var JavascriptEditorPopup=Class.create(CodeMirrorEditorPopup,{initialize:function($super,options)
{options.mode='javascript';$super(options);if(options.apiLink)
{$(this.popup.content).addClassName('JavaScriptAPI');$(this.popup.content).parentElement.addClassName('JavaScriptAPI Container');this.addAPILink();}},addAPILink:function()
{var apiLink=QBuilder('a',{href:'../WRAPI/QuestionAPI/',className:'JavaScriptAPI Link',target:'_blank'},getMessage('UserSettingsSection','JSAPILink'));$(this.popup.content).parentElement.appendChild(apiLink);},clear:function($super,optionalCode)
{$super(optionalCode||JavascriptEditorPopup.defaultJS);},save:function()
{QModules.loadModule('/WRQualtricsShared/JavaScript/Esprima/esprima.js');var code=this.editor.getValue();var allowWindowClose=true;try{window.esprima.parse(code);var that=this;var alertOptions={showCloseButton:true,cancelText:getMessage('EditSection','SaveAnyway'),okText:getMessage('EditSection','FixErrors'),cancelCallBack:function(){that.closeWindow();}};if(code.indexOf('setInterval')!==-1){if(code.indexOf('clearInterval')===-1){alertOptions.message=getMessage('EditSection','SetIntervalNotCleared');QualtricsCPTools.showConfirmDialog(alertOptions);allowWindowClose=false;}}
if(code.indexOf('Ajax.php')!==-1){alertOptions.message=getMessage('EditSection','AjaxCallNotAllowed');QualtricsCPTools.showConfirmDialog(alertOptions);allowWindowClose=false;}
if(code.indexOf('document.write')!==-1){alertOptions.message=getMessage('EditSection','DocumentWriteWarning');QualtricsCPTools.showConfirmDialog(alertOptions);allowWindowClose=false;}
if(code.indexOf('window.onload')!==-1){alertOptions.message=getMessage('EditSection','WindowOnloadNotAllowed');QualtricsCPTools.showConfirmDialog(alertOptions);allowWindowClose=false;}}catch(e){var alertOptions={message:getMessage('EditSection','InvalidJavaScript')+e.description};QualtricsCPTools.showAlertDialog(alertOptions);console.log(e);return false;}
if(code==JavascriptEditorPopup.defaultJS)
code="";if(this.options.saveCallBack(code)!==false&&allowWindowClose===true)
{this.closeWindow();}}});var JsonEditorPopup=Class.create(JavascriptEditorPopup,{initialize:function($super,options)
{JsonEditorPopup.instance=this;$super(options);},initializeButtons:function($super)
{this.additionalButtons=[{icon:'warning',align:'left',text:"Validate JSON",click:"EditorPopup.validateJson(1,1)",instanceid:this.id}];if(this.options.buttons&&this.options.buttons instanceof Array)
{this.options.buttons=this.options.buttons.concat(this.additionalButtons);this.additionalButtons=this.options.buttons;}
else
{this.options.buttons=this.additionalButtons;}
$super();},validateJson:function(opt_showAlertIfFailed,opt_showAlertIfPassed)
{QModules.loadModule("jsonlint.js");var success=true;var errorMessage="";try
{window.jsl.parser.parse(this.editor.getValue());}
catch(e)
{errorMessage=e.message;success=false;}
if((success&&opt_showAlertIfPassed)||(!success&&opt_showAlertIfFailed))
{var message=(success)?"This JSON is valid":QBuilder('span',{},["Validation failed:",QBuilder('pre',{style:'color:red'},"\n\n"+errorMessage)]);var alertOptions={message:message};QualtricsCPTools.showAlertDialog(alertOptions);}
return success;},save:function()
{if(this.options.mustValidate&&!this.validateJson(true,false))
return false;Q_Window.getInstance('EditorPopup').busifyButton('Save');var code=this.editor.getValue();var success=this.options.saveCallBack(code);if(success!==false)
{this.closeWindow();}
return success;}});var SIJavascriptEditorPopup=Class.create(JavascriptEditorPopup,{initialize:function($super,options)
{options.apiLink=false;$super(options);},clear:function($super,optionalCode)
{$super(optionalCode||SIJavascriptEditorPopup.defaultSIJS);},save:function()
{var code=this.editor.getValue();if(code==SIJavascriptEditorPopup.defaultSIJS)
code="";if(this.options.saveCallBack(code)!==false)
{this.closeWindow();}},initializeButtons:function()
{this.clearButton={align:'left',text:getMessage('SiteWide','Clear'),click:'EditorPopup.clear',instanceid:this.id,className:'negative'};this.restoreButton={align:'left',text:getMessage('SiteWide','RestoreSize'),click:"EditorPopup.resizePopupToDefault()",instanceid:this.id};this.fullScreenButton={align:'left',text:getMessage('SiteWide','FullScreen'),click:"EditorPopup.resizePopupToFullScreen()",instanceid:this.id};}});JavascriptEditorPopup.defaultJS='Qualtrics.SurveyEngine.addOnload(function()\n{\n\t/*Place Your Javascript Below This Line*/\n\n});';SIJavascriptEditorPopup.defaultSIJS='(function() {\n\n\t/*Insert code here*/\n\n})();';var SIMultiJavascriptEditorPopup=Class.create(SIJavascriptEditorPopup,{initialize:function($super,options)
{options.mode='javascript';this.options=options||{};this.id=QualtricsCPTools.createNewId('EP');EditorPopup.reg[this.id]=this;this.width=650;this.height=300;if(options.width)
this.width=options.width;if(options.height)
this.height=options.height;this.initializeButtons();this.buttons=[{icon:'cancel',text:getMessage('SiteWide','Cancel'),click:'EditorPopup.cancel',instanceid:this.id,className:'negative'},{id:'Save',icon:'check',text:getMessage('SiteWide','Save'),click:'EditorPopup.save',instanceid:this.id,className:'positive'}];if(options.fullScreenButton&&this.fullScreenButton)
this.buttons.push(this.fullScreenButton);if(options.clearButton&&this.clearButton)
this.buttons.push(this.clearButton);if(options.buttons&&options.buttons instanceof Array)
{this.buttons=this.buttons.concat(options.buttons);}
this.tabsContainer=QBuilder('div',{className:'EditorTabs'});this.tabs={};if(options.tabs)
{this.tabContents={};var tabs=options.tabs;var i=0;for(var tabId in tabs)
{var tab=tabs[tabId];if(i==0)
this.currentTab=tabId;if(tab.contents)
{this.tabContents[tabId]=tab.contents;}
else
{this.tabContents[tabId]='';}
var tabEl=QBuilder('div',{className:'EditorTab',clickcallback:'EditorPopup.selectTab:'+this.id+'('+tabId+')'},getMessage('SiteInterceptSection',tabId));this.tabs[tabId]=tabEl;this.tabsContainer.appendChild(tabEl);i++;}
this.tabsContainer.appendChild(QBuilder('div',{className:'clear'}));}
QModules.loadStylesheet('codemirroreditor.css',{blocking:true});QModules.loadModule('/WRQualtricsShared/JavaScript/CodeMirror/js/codemirror.js');this.contentContainer=QBuilder('div',{style:'min-width:'+this.width+'px;min-height:'+this.height+'px;',className:'MultiContentContainer'});this.outerContainer=QBuilder('div',{},[this.tabsContainer,this.contentContainer]);this.popup=new Q_Window({id:this.options.id?this.options.id:'EditorPopup',title:options.title,width:'auto',height:'auto',buttons:this.buttons,className:this.options.className||'EditorPopup'});this.popup.setContent(this.outerContainer);this.selectTab(this.currentTab);},setEditorContent:function(opt_replacementContents)
{var container=QBuilder('div',{className:'EditorContainer'});if(opt_replacementContents)
{this.contents=opt_replacementContents;}
this.ta=QBuilder('textarea',{id:this.id},this.contents);$(container).setStyle({height:this.height+'px',width:this.width+'px'});container.appendChild(this.ta);this.contentContainer.innerHTML='';this.contentContainer.appendChild(container);this.loadEditor.curry(this).delay();},selectTab:function(tab)
{if(this.currentTab)
{$(this.tabs[this.currentTab]).removeClassName('selected');if(this.editor)
{var code=this.editor.getValue();this.tabContents[this.currentTab]=code;}}
$(this.tabs[tab]).addClassName('selected');this.currentTab=tab;this.setEditorContent(this.tabContents[tab]);},save:function()
{var code=[];for(var tabId in this.tabs)
{var tabCode=this.tabContents[tabId];if(this.currentTab==tabId)
{tabCode=this.editor.getValue();}
if(tabCode==SIJavascriptEditorPopup.defaultSIJS)
tabCode="";var origCode=this.options.tabs[tabId].contents;code.push(origCode);code.push(tabCode);}
if(this.options.saveCallBack.apply(null,code)!==false)
{this.closeWindow();}}});var AjaxQueue={queue:[],type:'QUEUE',state:0,stateExecuting:1,stateStopped:0,setType:function(type)
{this.type=type;},push:function(job)
{this.queue.push(job);if(this.state==this.stateStopped)
{this.execute();}},clear:function()
{this.queue.length=0;this.state=this.stateStopped;},execute:function()
{if(this.queue.length>0)
{this.state=this.stateExecuting;var job;if(this.type=='QUEUE')
{job=this.queue[0];this.queue.splice(0,1);}
else if(this.type=='STACK')
{job=this.queue.pop();}
var that=this;var url;if(!job.url)
url='Ajax.php?action='+job.action;else
url=job.url;var ajaxType='Request';if(job.cached)
{ajaxType='CachedRequest';}
new Ajax[ajaxType](url,{parameters:job.parameters,asynchronous:!job.asynchronous,onSuccess:function(transport)
{try
{job.onSuccess(transport);}
catch(e)
{console.warn('Queued Job Callback could not be run: '+e);}},onComplete:function()
{that.execute();}});}
else
{this.state=this.stateStopped;}}};var JobQueue={queue:[],type:'QUEUE',waitForFinish:false,setType:function(type)
{this.type=type;},push:function(job)
{this.queue.push(job);},pop:function()
{if(this.queue.length>0)
{var job=this.queue.pop();var that=this;job.call();}},setCurrentJobStatus:function(status)
{if(this.currentJob)
this.currentJob.callStatus=status;},execute:function()
{if(this.queue.length>0)
{var job;if(this.type=='QUEUE')
{job=this.queue[0];this.queue.splice(0,1);}
else if(this.type=='STACK')
{job=this.queue.pop();}
this.currentJob=job;job.call();if(this.waitForFinish)
{var that=this;that.executor=new PeriodicalExecuter(function(pe)
{if(job.callStatus=='finished')
{pe.stop();that.execute();}},.5);}
else
{this.execute();}}},getJobCount:function()
{return this.queue.length;},clear:function()
{this.queue.length=0;}};var QAjaxWaiter={showBar:function(node,options)
{options=options||{};options.className='candyBarLoadingImage';return this.show(node,options);},showSmallRing:function(node,options)
{options=options||{};options.className='smallRingLoadingImage';return this.show(node,options);},showSmallBar:function(node,options)
{options=options||{};options.className='smallBarLoadingImage';return this.show(node,options);},showMediumRing:function(node,options)
{options=options||{};options.className='mediumRingLoadingImage';return this.show(node,options);},show:function(node,options)
{var className='candyBarLoadingImage';if(options.className!=undefined)
className=options.className;if(node==undefined)
{return QBuilder('div',{className:className});}
options=options||{};var replace;if(options.repNode==undefined)
replace=true;else
replace=options.repNode;var type;if(options.type==undefined)
type='div';else
type=options.type;if($(node))
{var dimensions=$(node).getDimensions();if(replace)
{deleteChildren($(node));}
if(type=='div')
{$(node).appendChild(QBuilder('div',{className:className}));}
else if(type=='tbody')
{var colSpan;if(options.colSpan==undefined)
colSpan=1;else
colSpan=options.colSpan;var nst=false;if(options.nst!=undefined)
nst=options.nst;var td=QBuilder('td',{colSpan:colSpan},[QBuilder('div',{className:className})]);$(td).setStyle({height:dimensions.height+'px'});var loadingimage=QBuilder('tr',{},[(nst)?QBuilder('td',{className:"Col_Selected"}):'',td]);$(node).appendChild(loadingimage);}}
return $(node);}};Qualtrics.savePageOnUnload=function()
{if(typeof Qualtrics!==undefined&&Qualtrics.savePage)
{Qualtrics.savePage(false);}};Event.observe(window,'unload',Qualtrics.savePageOnUnload);QualtricsCPTools.setTimeoutTimer();Qualtrics.disableInput=function(el)
{if($(el))
{var parentNode=$(el).up();var cover=QBuilder('div',{className:'disablingCover'});$(cover).setStyle({backgroundColor:'#ffffff',opacity:.6,position:'absolute'});cover.clonePosition($(el));$('body').appendChild(cover);}};Qualtrics.QButtonBuilder={build:function(options)
{if(!options.id)
options.id=QualtricsCPTools.createNewId('BTN');var buttonClass='';if(options.buttonClass)
buttonClass=options.buttonClass;var className='qbutton '+buttonClass;var iconClass='';if(options.iconType)
{iconClass='icon '+options.iconType;}
var clickcallback=options.clickcallback;return QBuilder('a',{id:options.id,className:className,href:'javascript:void(0);',clickcallback:clickcallback},[QBuilder('span',{className:iconClass}),options.buttonText]);}};Qualtrics.DateTools={getMonths:function()
{return[getMessage('SiteWide','January'),getMessage('SiteWide','February'),getMessage('SiteWide','March'),getMessage('SiteWide','April'),getMessage('SiteWide','May'),getMessage('SiteWide','June'),getMessage('SiteWide','July'),getMessage('SiteWide','August'),getMessage('SiteWide','September'),getMessage('SiteWide','October'),getMessage('SiteWide','November'),getMessage('SiteWide','December')];},getDays:function()
{return[getMessage('SiteWide','Sunday'),getMessage('SiteWide','Monday'),getMessage('SiteWide','Tuesday'),getMessage('SiteWide','Wednesday'),getMessage('SiteWide','Thursday'),getMessage('SiteWide','Friday'),getMessage('SiteWide','Saturday')];},mysqlTimeStampToDate:function(timestamp)
{var regex=/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;var p=timestamp.replace(regex,"$1 $2 $3 $4 $5 $6").split(' ');return new Date(p[0],p[1]-1,p[2],p[3],p[4],p[5]);},dateToMysqlTimeStamp:function(date)
{var year=date.getFullYear();var month=date.getMonth()+1;if(month<10)
month='0'+month;var day=date.getDate();if(day<10)
day='0'+day;var hour=date.getHours();if(hour<10)
hour='0'+hour;var min=date.getMinutes();if(min<10)
min='0'+min;var sec=date.getSeconds();if(sec<10)
sec='0'+sec;return year+'-'+month+'-'+day+' '+hour+':'+min+':'+sec;},roundDay:function(d,up)
{if(!d)
d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate(),up?23:0,up?59:0,up?59:0);},getFormattedDate:function(date)
{if(!date)
var d=new Date();else
var d=new Date(date);return this.getMonths()[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear();},getFormattedDateTime:function(date)
{if(!date)
var d=new Date();else
var d=new Date(date);return this.getMonths()[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes();},getDurationText:function(start,end)
{var duration=end-start;return Qualtrics.DateTools.getFormattedTime(duration/1000);},getFormattedTime:function(time)
{var sec=time;var min=0;var str='';var hasDay=false;if(time>=60)
{min=Math.floor(time/60);sec=time%60;if(min>=60)
{var hour=Math.floor(min/60);min=min%60;if(hour>=24)
{hasDay=true;var day=Math.floor(hour/24);hour=hour%24;str+=(day+'d ');}
str+=(hour+'h ');}}
str+=(min+'m ');if(!hasDay)
str+=(sec+'s ');return str;},formatMySQLDate:function(date)
{var date=this.mysqlTimeStampToDate(date);return this.formatJSDate(date);},formatJSDate:function(date)
{if(date)
{var d=date.getDate();d=d<10?'0'+d:d;var m=this.getMonths()[date.getMonth()];var y=date.getFullYear();var h=date.getHours();var am=h<12;h=h%12;if(h==0)
h=12;var mn=date.getMinutes();mn=mn<10?'0'+mn:mn;return m+' '+d+', '+y+' '+h+':'+mn+' '+(am?'am':'pm');}}};Qualtrics.RichTextEditor=Class.create({readyQueue:[],initialize:function(options)
{this.options=options||{};if(this.options.value)
this.val=this.options.value;this.id=QualtricsCPTools.createNewId('RTE');Qualtrics.RichTextEditor.reg[this.id]=this;this.ready=false;this.heightOffset=-83;},buildContainer:function()
{this.container=QBuilder('div',{className:'QualtricsRTE'});},buildEditor:function()
{var that=this;var options={on:{instanceReady:function(e){try
{that.ready=true;e.editor.focus();that.editorReady();if(that.options.onReady)
that.options.onReady();}
catch(err)
{console.error(err);}}}};var style={};if(this.options.width)
{options.width=this.options.width;style.width=this.options.width+'px';}
if(this.options.height)
{options.height=this.options.height+this.heightOffset;style.height=this.options.height+'px';}
if(this.options.toolbar)
options.toolbar=this.options.toolbar;$(this.container).setStyle(style);(function(){that.editor=CKEDITOR.appendTo(that.container,options);}).defer();this.setText(this.options.value);},build:function()
{this.buildContainer();this.buildEditor();return this.container;},editorReady:function()
{while(this.readyQueue.length)
{this.readyQueue[0]();this.readyQueue.splice(0,1);}},replace:function(id,options)
{this.editor=CKEDITOR.replace(id,options);},setText:function(val)
{this.val=val;var that=this;var f=function(){if(that.editor)that.editor.setData(val);};this.execute(f);},isDirty:function()
{if(this.ready&&this.editor)
{return this.editor.checkDirty();}
return false;},resetDirty:function()
{var that=this;var f=function(){if(that.editor)that.editor.resetDirty();};this.execute(f);},execute:function(f)
{if(this.ready)f();else this.readyQueue.push(f);},getText:function()
{if(this.editor)
return this.editor.getData();else if(this.val)
return this.val;},destroy:function()
{var that=this;var f=function(){if(that.editor)that.editor.destroy();that.editor=null;};this.execute(f);}});Qualtrics.RichTextEditor.reg={};Qualtrics.RichTextEditor.getInstance=QualtricsCPTools.getInstanceHelper(Qualtrics.RichTextEditor.reg);function disableSelects()
{var elements=$$(".menuButton");var elements2=$$(".menuButton b b b");elements.each(function(el){el.setAttribute('onclick',"return false;");el.addClassName('Disabled');});elements2.each(function(el){el.setAttribute('downcallback','');});elements=$$('input');elements.each(function(el)
{el.disabled=true;});elements=$$('select');elements.each(function(el)
{el.disabled=true;});}
Object.extend(Qualtrics,{removeLabelHint:function(e)
{var textBox=this;textBox.removeClassName('Initial');if(textBox.value==getMessage('SiteWide','EnterLabelHint'))
{textBox.value='';}
Event.stopObserving(textBox,'click');Event.stopObserving(textBox,'keydown');},renumberFirstChildOnSort:function(li)
{if(li)
{var ul=li.parentNode;var childs=$(ul).childElements();for(var i=0,len=childs.length;i<len;++i)
{$(childs[i]).down().innerHTML=(i+1);}}}});Qualtrics.EditableSpan=Class.create(Editable,{objType:'EditableSpan',keyMap:{enter:'onEnter'},maxlength:255,initialize:function(id,parent,callback)
{this.parentObj=parent;this.callback=callback;this.id=id;Qualtrics.EditableSpan.reg[this.id]=this;},onEnter:function()
{inlineEditor.getInstance().removeInlineEditor();},afterEdit:function()
{this.text=stripNewLines(this.text);var name=this.text;if(name)
{this.callback(this.id,name);}},onEmpty:function()
{this.text=this.originalText;$(this.id).innerHTML=this.text;}});Qualtrics.EditableSpan.reg={};Qualtrics.EditableSpan.getInstance=QualtricsCPTools.getInstanceHelper(Qualtrics.EditableSpan.reg,'id');Qualtrics.DetectZoom={mediaQueryBinarySearch:function(property,unit,a,b,maxIter,epsilon){var head=document.getElementsByTagName('head')[0];var style=document.createElement('style');var div=document.createElement('div');div.className='mediaQueryBinarySearch';head.appendChild(style);div.style.display='none';document.body.appendChild(div);var r=binarySearch(a,b,maxIter);head.removeChild(style);document.body.removeChild(div);return r;function binarySearch(a,b,maxIter){var mid=(a+b)/2;if(maxIter==0||b-a<epsilon)return mid;if(mediaQueryMatches(mid+unit)){return binarySearch(mid,b,maxIter-1);}else{return binarySearch(a,mid,maxIter-1);}}
function mediaQueryMatches(r){style.sheet.insertRule('@media ('+property+':'+r+') {.mediaQueryBinarySearch '+'{text-decoration: underline} }',0);var computedStyle=getComputedStyle(div,null);if(computedStyle)
{var matched=computedStyle.textDecoration=='underline';}
style.sheet.deleteRule(0);return matched;}},_zoomIe7:function(){var rect=document.body.getBoundingClientRect();var z=(rect.right-rect.left)/document.body.offsetWidth;z=Math.round(z*100)/100;return{zoom:z,devicePxPerCssPx:z};},_zoomIe8:function(){return{zoom:screen.systemXDPI/screen.logicalXDPI,devicePxPerCssPx:screen.deviceXDPI/screen.logicalXDPI};},_zoomWebkitMobile:function(){var z=document.documentElement.clientWidth/window.innerWidth;var devicePixelRatio=window.devicePixelRatio!=null?window.devicePixelRatio:1;return{zoom:z,devicePxPerCssPx:z*devicePixelRatio};},_zoomWebkit:function(){var devicePixelRatio=window.devicePixelRatio!=null?window.devicePixelRatio:1;var container=document.createElement('div'),div=document.createElement('div');container.setAttribute('style','width:0; height:0; overflow:hidden;'+'visibility:hidden; position: absolute');div.innerHTML="one<br>two<br>three<br>four<br>five<br>six<br>seven<br>eight<br>nine<br>ten";div.setAttribute('style',"font: 100px/1em sans-serif; -webkit-text-size-adjust:none;");container.appendChild(div);document.body.appendChild(container);var z=1000/div.clientHeight;z=Math.round(z*100)/100;var r={zoom:z,devicePxPerCssPx:devicePixelRatio*z};document.body.removeChild(container);return r;},_zoomFF35:function(){var z=screen.width/this.mediaQueryBinarySearch('min-device-width','px',0,6000,20,.0001);z=Math.round(z*100)/100;return{zoom:z,devicePxPerCssPx:z};},_zoomFF36:function(){var container=document.createElement('div'),outerDiv=document.createElement('div');container.setAttribute('style','width:0; height:0; overflow:hidden;'+'visibility:hidden; position: absolute');outerDiv.style.width=outerDiv.style.height='500px';var div=outerDiv;for(var i=0;i<10;++i){var child=document.createElement('div');child.style.overflowY='scroll';div.appendChild(child);div=child;}
container.appendChild(outerDiv);document.body.appendChild(container);var outerDivWidth=outerDiv.clientWidth;var innerDivWidth=div.clientWidth;var scrollbarWidthCss=(outerDivWidth-innerDivWidth)/10;document.body.removeChild(container);var z=15/scrollbarWidthCss;z=Math.round(z*100)/100;return{zoom:z,devicePxPerCssPx:z};},_zoomFF4:function(){var z=this.mediaQueryBinarySearch('min--moz-device-pixel-ratio','',0,10,20,.0001);z=Math.round(z*100)/100;return{zoom:z,devicePxPerCssPx:z};},_zoomOpera:function(){var fixedDiv=document.createElement('div');fixedDiv.style.position='fixed';fixedDiv.style.border='5px solid blue';fixedDiv.style.width='100%';fixedDiv.style.height='100%';fixedDiv.style.top=fixedDiv.style.left='0';fixedDiv.style.visibility='hidden';document.body.appendChild(fixedDiv);var z=window.innerWidth/fixedDiv.offsetWidth;z=Math.round(z*100)/100;document.body.removeChild(fixedDiv);return{zoom:z,devicePxPerCssPx:z};},ratios:function(){var r;if(!isNaN(screen.logicalXDPI)&&!isNaN(screen.systemXDPI)){return this._zoomIe8();}else if('ontouchstart'in window&&document.body.style.webkitTextSizeAdjust!=null){return this._zoomWebkitMobile();}else if(document.body.style.webkitTextSizeAdjust!=null){return this._zoomWebkit();}else if(-1!=navigator.userAgent.indexOf('Firefox/3.5')){return this._zoomFF35();}else if(-1!=navigator.userAgent.indexOf('Firefox/3.6')){return this._zoomFF36();}else if(-1!=navigator.appVersion.indexOf("MSIE 7.")){return this._zoomIe7();}else if(-1!=navigator.userAgent.indexOf('Opera')){return this._zoomOpera();}else if(0.001<(r=this._zoomFF4()).zoom){return r;}else{return{zoom:1,devicePxPerCssPx:1};}},zoom:function(){return this.ratios().zoom;},device:function(){return this.ratios().devicePxPerCssPx;}};Qualtrics.History=Class.create({undoStack:null,redoStack:null,initialize:function()
{Qualtrics.History._instance=this;this.undoStack=[];this.redoStack=[];},addAction:function(description,undoActionDef,redoActionDef)
{if(Qualtrics.History.suppressAddAction)
{return;}
if(!redoActionDef)
{console.error('Created undo without a redo, bad programmer');}
if(undoActionDef.parameters)
{this.autoPackageParameters(undoActionDef.parameters);}
if(redoActionDef.parameters)
{this.autoPackageParameters(redoActionDef.parameters);}
this.undoStack.push({description:description,undo:undoActionDef,redo:redoActionDef});},autoPackageParameters:function(params)
{for(var i=0,len=params.length;i<len;++i)
{if(params[i]&&typeof params[i]=='object'&&!params[i].qPacked)
{params[i]=Qualtrics.History.Actions.buildParameter(params[i]);}}},undo:function()
{var action=this.undoStack.pop();if(action)
{this.executeAction(action.undo);this.redoStack.push(action);}},redo:function()
{var action=this.redoStack.pop();if(action)
{this.executeAction(action.redo);this.undoStack.push(action);}},executeAction:function(actionDef)
{Qualtrics.History.suppressAddAction=true;Qualtrics.History.Actions.execute(actionDef);Qualtrics.History.suppressAddAction=false;}});Qualtrics.History.getInstance=function()
{if(!Qualtrics.History._instance)
{return new Qualtrics.History();}
return Qualtrics.History._instance;};Qualtrics.History.Actions={buildParameter:function(var_args)
{var a=arguments[0];if(typeof a=='object')
{if(Object.isArray(a))
{return Qualtrics.History.Actions.buildParameter_ObjectArray(a);}
else
{return Qualtrics.History.Actions.buildParameter_Object(a);}}
else if(typeof a=='number')
{return Qualtrics.History.Actions.buildParameter_Number(a);}
else if(typeof a=='string')
{return Qualtrics.History.Actions.buildParameter_String(a);}
else if(typeof a=='boolean')
{return Qualtrics.History.Actions.buildParameter_Boolean(a);}
if(a===undefined)
{return undefined;}
if(a===null)
{return null;}
console.warn('Could not build parameter for arguments',arguments,typeof a);return null;},buildParameter_ObjectArray:function(a)
{var param={};param.type='Array';param.items=[];param.qPacked=true;for(var i=0,len=a.length;i<len;++i)
{param.items[i]=Qualtrics.History.Actions.buildParameter(a[i]);}
return param;},buildParameter_Object:function(a)
{if(a===null)
{return null;}
var actionPath=a.actionPath||a.self;if(actionPath)
{var param={};param.type='Object';param.qPacked=true;param.actionPath=actionPath;if(a.getInstanceId&&a.getInstanceId())
{param.instanceId=a.getInstanceId();}
return param;}
else
{var param={};param.type='Object';param.qPacked=true;param.items={};for(var key in a)
{if(typeof a[key]!=='function')
param.items[key]=Qualtrics.History.Actions.buildParameter(a[key]);}
return param;}
return null;},buildParameter_Number:function(a)
{return a;},buildParameter_String:function(a)
{return a;},buildParameter_Boolean:function(a)
{return a;},recreateParametersFromDef:function(parametersDef)
{var params=[];for(var i=0,len=parametersDef.length;i<len;++i)
{params.push(Qualtrics.History.Actions.recreateParameterFromDef(parametersDef[i]));}
return params;},recreateParameterFromDef:function(paramDef)
{if(paramDef==null)
{return null;}
if(paramDef==undefined)
{return undefined;}
if(typeof paramDef=='object')
{if(paramDef.type)
{if(paramDef.type=='Array')
{var param=[];for(var i=0,len=paramDef.items.length;i<len;++i)
{param.push(Qualtrics.History.Actions.recreateParameterFromDef(paramDef.items[i]));}
return param;}
else if(paramDef.type=='Object')
{if(paramDef.actionPath)
{var pkg=Qualtrics.Event.getDotSyntaxParts(paramDef.actionPath);if(pkg&&pkg.root&&pkg.callBack)
{var obj=pkg.root[pkg.callBack];if(obj.getInstance)
{var instance=obj.getInstance(paramDef.instanceId);if(instance)
{return instance;}}
return obj;}}
else if(paramDef.items)
{if(paramDef.items instanceof Array)
paramDef.items={};var param={};for(var key in paramDef.items)
{param[key]=Qualtrics.History.Actions.recreateParameterFromDef(paramDef.items[key]);}
return param;}}}}
if(typeof paramDef=='number'||typeof paramDef=='string'||typeof paramDef=='boolean')
{return paramDef;}
console.warn('could not recreate parameterDef',paramDef);return null;},execute:function(actionDef)
{if(actionDef.action)
{var action=actionDef.action;var instanceId=actionDef.instanceId;var root=null;var parameters=null;var paramMap=null;var defaultParams=null;if(actionDef.parameters)
{parameters=Qualtrics.History.Actions.recreateParametersFromDef(actionDef.parameters);}
Qualtrics.Event.executeDotSyntax(actionDef.action,instanceId,root,parameters,paramMap,defaultParams);}}};Qualtrics.Help={getHelp:function()
{this.generateScreenshot();this.popup=new Q_Window({id:'GetHelp',title:'Get Help',width:'auto',height:'auto',closeButton:false,buttons:['cancel','save:Qualtrics.Help.getHelp']});this.content=QBuilder('div',{},[QAjaxWaiter.showBar()]);this.popup.setContent(this.content);},generateScreenshot:function()
{var html=document.documentElement.innerHTML;var that=this;new Ajax.Request('Ajax.php?action=generateScreenshot',{parameters:{HTML:html},onSuccess:function(transport)
{var file=transport.responseText;var img=QBuilder('img',{width:400,height:300,src:file});that.content.innerHTML='';that.content.appendChild(img);that.popup.center();}});}};Qualtrics.Confirm=Class.create({getDefaultOptions:function(){return{title:getMessage('SiteWide','Delete'),confirmButtonText:getMessage('SiteWide','Delete'),buttonBusyText:getMessage('SiteWide','Deleting'),confirmButtonClassName:'negative',confirmButtonIcon:'cancel',strong:false,contentClassName:'',confirmMessage:'Are you sure you wish to delete this item?',secondConfirmMessage:'Are you really sure you wish to delete this item?',strongConfirmPrompt:getMessage('SiteWide','MustEnterDelete',getMessage('SiteWide','ConfirmDelete').toLowerCase()),confirmInputText:getMessage('SiteWide','ConfirmDelete').toLowerCase(),doubleConfirm:false};},initialize:function(options)
{this.id=QualtricsCPTools.createNewId('QC');Qualtrics.Confirm.reg[this.id]=this;options=options||{};if(typeof(options)=="string")
{options=options.evalJSON();}
this.options=this.getDefaultOptions();Object.extend(this.options,options);this.show();},show:function()
{this.popup=new Q_Window({id:'Confirm',title:this.options.title,width:'auto',height:'auto',closeButton:true,buttons:[{icon:'',text:getMessage('SiteWide','Cancel'),click:'Qualtrics.Confirm.confirmationCancel:'+this.id,className:'neutral'},{icon:this.options.confirmButtonIcon,text:this.options.confirmButtonText,click:'Qualtrics.Confirm.confirmationComplete:'+this.id,p1:'$evt',className:this.options.confirmButtonClassName,id:'ConfirmButton'}]});this.popup.setContent(this.build());},build:function()
{var confirmationForm=this.buildStrongConfirmationForm();var contentClass='ConfirmationContainer '+(this.options.strong?'strong':'')+' '+this.options.contentClassName;var contentChildren=[QBuilder('div',{className:'ConfirmationWarningGraphic'}),QBuilder('div',{className:'rightContainer'},[(this.options.strong)?QBuilder('div',{className:'ConfirmationHeader'},getMessage('SiteWide','WarningCaption')):'',QBuilder('div',{className:'ConfirmationMessage'},[this.options.confirmMessage]),(this.options.strong)?confirmationForm:'']),QBuilder('div',{className:'clear'})];var content=QBuilder('div',{className:contentClass},contentChildren);return content;},buildStrongConfirmationForm:function()
{this.confirmTextInput=QBuilder('input',{autocomplete:'off',type:'text',id:'confirmationInput',name:'confirmationInput',className:'TextBox'});Event.observe(this.confirmTextInput,'keydown',this.confirmationCompleteOnEnter.bind(this));return QBuilder('div',{id:'deleteConfirmationForm'},[QBuilder('div',{className:'StrongConfirmMessage'},this.options.strongConfirmPrompt),this.confirmTextInput]);},confirmationCompleteOnEnter:function(e)
{e=e||window.event;if(e.keyCode==Event.KEY_RETURN)
{this.confirmationComplete(e);Event.stop(e);}},confirmationCancel:function()
{this.popup.close();},confirmationComplete:function(e)
{e=e||window.event;var skipStrong=false;var skipSecond=false;if(e.shiftKey&&(e.ctrlKey||e.metaKey))
{skipStrong=true;skipSecond=true;}
if(this.options.strong)
{if(skipStrong)
{Event.stop(e);}
else
{var confirmed=this.confirmTextInput.value.toLowerCase();if(confirmed!=this.options.confirmInputText&&confirmed!='"'+this.options.confirmInputText+'"'){alert(getMessage('SiteWide','MustConfirmDeletion'));return false;}}
if(this.options.doubleConfirm&&!skipSecond)
{this.popup.close();var options=this.options;delete(options.doubleConfirm);options.strong=false;options.confirmMessage=options.secondConfirmMessage;new Qualtrics.Confirm(options);return;}}
if(this.options.onConfirm)
{if(this.options.onConfirm.ajax)
{var ajaxOptions=this.options.onConfirm.ajax;var action=ajaxOptions.action;var parameters=ajaxOptions.parameters;if(action)
{var that=this;new Ajax.Request('Ajax.php?action='+action,{parameters:parameters,onComplete:function(transport){that.popup.close();if(ajaxOptions.onComplete)
{ajaxOptions.onComplete(transport);}},onSuccess:function(transport){if(ajaxOptions.onSuccess)
{ajaxOptions.onSuccess(transport);}}});}}
else if(Object.isFunction(this.options.onConfirm))
{this.options.onConfirm();this.popup.close();}
else if(Object.isString(this.options.onConfirm))
{Qualtrics.Event.executeDotSyntax(this.options.onConfirm);this.popup.close();}}
var button=$('ConfirmButton');if(button)
{$(button).setAttribute('clickcallback','');$(button).addClassName('Disabled');$(button).innerHTML=this.options.buttonBusyText;}}});Qualtrics.Confirm.reg={};Qualtrics.Confirm.getInstance=QualtricsCPTools.getInstanceHelper(Qualtrics.Confirm.reg);Qualtrics.Draggable=Class.create({initialize:function(el)
{el=$(el);if(el.id)
{Qualtrics.Draggable.reg[el.id]=this;new Draggable(el);}}});Qualtrics.Draggable.dragNode=function(el)
{if(el.id)
{var instance=Qualtrics.Draggable.getInstance(el.id);if(instance)
{}
else
{new Qualtrics.Draggable(el);}}};Qualtrics.Draggable.reg={};Qualtrics.Draggable.getInstance=QualtricsTools.getInstanceHelper(Qualtrics.Draggable.reg);function prettyPrintJson(json)
{var prettyJson="";var indent="    ";if(json&&typeof json!=="string")
{prettyJson=JSON.stringify(json,null,indent);}
else
{try
{var parsed=JSON.parse(json);prettyJson=JSON.stringify(parsed,null,indent);}
catch(e)
{QModules.loadModule("jsonlint.js");prettyJson=window.jsl.format.formatJson(json);}}
return prettyJson||"";}

var messageFadeTimer=null;var MessageFade=null;var PermaMessage=false;function PermaMessageBox()
{HoldMessageBox();if(PermaMessage)
{$('MessageBox').setStyle({opacity:0.9});}
PermaMessage=!PermaMessage;}
function HoldMessageBox()
{clearTimeout(messageFadeTimer);if(MessageFade)
MessageFade.cancel();$('MessageBox').setStyle({opacity:1});}
function ReleaseMessageBox(time)
{if(typeof time!='number')
{time=false;}
if(!time)
{time=1000;}
if(!PermaMessage)
{$('MessageBox').setStyle({backgroundColor:''});$('MessageBox').setStyle({opacity:0.90});messageFadeTimer=setTimeout(HideMessage,time);}}
function msgDebug(str){var json={"debug":[str]};ShowMessage(json);}
function msg(str,id,limit)
{ShowMessageStr(str,id,limit);}
function ShowMessageStr(str,id,limit){var json={"message":[{msg:str}]};if(id)
{json={"message":[{id:id,msg:str}]};}
ShowMessage(json,null,limit);}
function ShowMessage(json,obj,limit){if(limit===undefined)
{limit=2;}
if(json)
{var msgDom=$('MessageBox');if(!msgDom)return;var msg=json.message;var debug=json.debug;if(json.message){for(var i=0,len=msg.length;i<len;++i){var inside=QBuilder('div',{className:'message'},msg[i]['msg']);var id=msg[i]['id'];if(id){if($('msgId_'+id))
{removeElement($('msgId_'+id));}
$(inside).id='msgId_'+id;}
if(msgDom.childNodes.length>limit){removeElement(msgDom.firstChild);}
msgDom.appendChild(inside);inside=null;}}
if(!QualtricsCPTools.hideDebugs)
{if(json.debug)
{for(var i=0,len=debug.length;i<len;++i)
{var inside=constructDebugData(debug[i],false);msgDom.appendChild(inside);inside=null;}}
if(json.debugHtml){var debugHtml=json.debugHtml;for(var i=0,len=debugHtml.length;i<len;++i)
{var inside=constructDebugData(debugHtml[i],true);msgDom.appendChild(inside);inside=null;}
debugHtml=null;}
if(json.longDebug)
{var longDebug=json.longDebug;var button=QBuilder('button',{},'Show Debug');button.onclick=ShowLongMessages;msgDom.appendChild(button);}}
if(MessageFade){MessageFade.cancel();}
clearTimeout(messageFadeTimer);msgDom.show();ReleaseMessageBox(500);msg=null;debug=null;}}
function ShowLongMessages(event)
{if(!event)event=window.event;Event.stop(event);new Ajax.Request(AjaxMessaging.longDebugURL,{parameters:{},onSuccess:function(transport)
{var json=transport.responseText.evalJSON();var newWindow=window.open('','AJAX Debug','height=800,width=800,scrollbars=yes,resizable=yes,titlebar=yes');var doc=newWindow.document;if(json['debugHtml'])
{var html=json['debugHtml'];for(var i=0,ilen=html.length;i<ilen;i++)
{doc.write(html[i]['label']);doc.write(html[i]['msg']);}}
if(json['debug'])
{var dbg=json['debug'];doc.write('<pre>');for(var i=0,ilen=dbg.length;i<ilen;i++)
{var out;if(dbg[i]['label']){out=dbg[i]['label']+" : ";out+=dbg[i]['msg'];}
else
{out=dbg[i];}
out+='\n';doc.write(out);}
doc.write('</pre>');}
if(json['message'])
{doc.write('MESSAGE<br/>');doc.write('not supported yet');}
doc.close();}});}
function constructDebugData(msg,showHtml)
{try
{if(msg['label'])
{var inside=QBuilder('div',{className:"debug"});inside.onmouseover=function(){AddOver(this);};inside.onmouseout=function(){RemoveOver(this);};var label=QBuilder('p',msg['label']+' \u21B5');if(showHtml)
{var content=QBuilder('pre',{ignoreMsgClick:'0'});content.innerHTML=msg['msg'];}
else
{var content=QBuilder('pre',{ignoreMsgClick:'0'},msg['msg']);}
var hideFlag=QBuilder('div',{className:"HiddenDebug"},[label,content]);inside.appendChild(hideFlag);hideFlag=null;label=null;content=null;return inside;}}
catch(e)
{}
var inside=QBuilder('div',{className:"debug"},[QBuilder('pre',msg)]);return inside;}
function HideMessage(instant)
{if(MessageFade){MessageFade.cancel();MessageFade=null;}
if(instant){clearTimeout(messageFadeTimer);$('MessageBox').setStyle({display:'none'});deleteChildren($('MessageBox'));}
if(typeof Effect!='undefined')
{MessageFade=new Effect.Fade($('MessageBox'),{duration:2,from:0.9,to:0,afterFinish:function(){$('MessageBox').setStyle({display:'block'});$('MessageBox').setStyle({opacity:1});deleteChildren($('MessageBox'));MessageFade=null;}});}}
AjaxMessaging={longDebugURL:'Ajax.php?action=GetLongDebug'};

window.Q_Window=Class.create();Q_Window._chopOffset=null;Q_Window.getChopOffset=function()
{if(parent)
{try
{return parent.Q_Window._chopOffset;}
catch(e)
{}}
return Q_Window._chopOffset;};Q_Window.preparePos=function(pos)
{var offset=Q_Window.getChopOffset();if(offset&&pos&&pos.length==2)
{if(offset[0])pos[0]=pos[0]-offset[0];if(offset[1])pos[1]=pos[1]-offset[1];}
return pos;};Q_Window.registry={};Q_Window.openedOrder=[];Q_Window.getWindowCount=function()
{var reg=Q_Window.getRegistry();var count=0;for(var id in reg)
{count++;}
return count;};Q_Window.getInstance=function(id)
{var reg=Q_Window.getRegistry();if(id)
{if(reg[id])
return reg[id];var namedWindow=Q_Window.getInstanceByWindowName(id);if(namedWindow)return namedWindow;}
else
{for(var i=Q_Window.openedOrder.length-1;i>=0;--i)
{if(reg[Q_Window.openedOrder[i]])
{return reg[Q_Window.openedOrder[i]];}}
for(id in reg)
return reg[id];}
return null;};Q_Window.getInstanceByWindowName=function(windowName)
{var reg=Q_Window.getRegistry();var foundInstances=[];for(id in reg)
{if(reg[id].windowName==windowName)
{foundInstances.push(reg[id]);}}
if(foundInstances.length==1)
{return foundInstances[0];}
else if(foundInstances.length>1)
{var highestZIndex=-1;var highestZIndexInstance=null;for(var i=0;i<foundInstances.length;i++)
{if(foundInstances[i].zIndex>highestZIndex)
{highestZIndex=foundInstances[i].zIndex;highestZIndexInstance=foundInstances[i];}}
return highestZIndexInstance;}
return false;};Q_Window.getRegistry=function(id)
{var reg=Q_Window.registry;reg=Q_Window.registry;return reg;};Q_Window.getRoot=function()
{var root=window;var last=window;try
{var limit=0;while(root.parent&&limit<10)
{root.name;if(root.parent==root)
break;last=root;root=root.parent;limit++;}}
catch(e)
{return last;}
return root;};Q_Window.setRegistry=function(windowObj)
{Q_Window.registry[windowObj.id]=windowObj;Q_Window.openedOrder.push(windowObj.id);};Q_Window.removeFromRegistry=function(id)
{delete Q_Window.registry[id];};Q_Window.isRegistryEmpty=function()
{for(el in Q_Window.registry)
{return false;}
return true;};Q_Window.getWindow=function(windowName)
{return Q_Window.getInstance(windowName);};Q_Window.closeWindow=function(windowName)
{var inst=Q_Window.getInstance(windowName);if(inst)
inst.destroy();};Q_Window.closeAllWindows=function(windowName)
{if(windowName)
{var inst=Q_Window.getInstanceByWindowName(windowName);while(inst)
{inst.destroy();inst=Q_Window.getInstanceByWindowName(windowName);}}
else
{while(Q_Window.getInstance())
Q_Window.getInstance().destroy();}};Q_Window.addObserver=function(windowName)
{};Q_Window.resizeWatcher=null;Q_Window.centerTimer=null;Q_Window.centerWindows=function()
{if(Q_Window.centerTimer)
{clearTimeout(Q_Window.centerTimer);Q_Window.centerTimer=null;}
Q_Window.centerTimer=setTimeout(function(){var reg=Q_Window.getRegistry();for(id in reg)
{if(reg[id].keepCentering)
{reg[id].center();}}},50);};Q_Window.setChopOffset=function(v)
{Q_Window._chopOffset=v;};(Q_Window.resetZIndex=function(){Q_Window.currentZIndex=10001;})();Q_Window.getNextZIndex=function()
{Q_Window.currentZIndex+=100;return Q_Window.currentZIndex;};Q_Window.setCurrentZIndex=function(z)
{Q_Window.currentZIndex=z;};Q_Window.getCurrentZIndex=function()
{return Q_Window.currentZIndex;};Q_Window.getInstanceOrCreate=function(windowName,options)
{var win=Q_Window.getInstanceByWindowName(windowName);if(win&&options&&options.buttons!==undefined)
{if(win.footerNode)
{deleteChildren(win.footerNode);if(options.buttons)
{win.footerNode.appendChild(win.buildButtons(options.buttons));}}}
if(!win)
{win=new Q_Window(windowName,options);}
return win;};Q_Window.prototype={width:'600px',height:'auto',element:null,headerDom:null,innerElement:null,className:'',url:null,windowName:null,id:null,keepCentering:false,buttons:null,title:null,pctHeight:null,pctWidth:null,preservePctHeightAndWidth:false,closeButton:false,fitContents:false,padding:null,zIndex:10000,autoWidth:false,autoHeight:true,buttonReg:{},initialize:function(windowName,options,var_args)
{this.initTime=new Date();this.id=QualtricsTools.createNewId('QW');if(arguments.length==1&&typeof windowName=='object')
{options=windowName;options.id=options.id||this.id;this.windowName=options.id;if(options.id)
{this.className=options.id;}}
else
{this.windowName=windowName;this.className=windowName;}
options=options||{};this.options=options;for(var option in options)
{if(option!='id')
this[option]=options[option];}
if(this.skeleton)
this.className+=' Skeleton';if(this.hidden)
this.className+=' Hide';Q_Window.setRegistry(this);var startZIndex=Q_Window.getCurrentZIndex();this.setSize(this.width,this.height,false);if(options&&options.zIndex)
{this.zIndex=options.zIndex;}
else
{this.zIndex=Q_Window.getNextZIndex();}
this.zDiff=this.zIndex-startZIndex;Q_Window.setCurrentZIndex(this.zIndex);if(!options.buttons&&options.closeButton===undefined)
{options.closeButton=true;}
this.render();if(!options.enableScroll)
this.disableScroll();this.focusInput();if(options.content)
{this.setContent(options.content);}},focusInput:function(opt_node)
{var inputs=(opt_node||this.innerElement).getElementsByTagName('INPUT');if(inputs)
{for(var i=0,len=inputs.length;i<len;++i)
{var type=inputs[i].getAttribute('type');if((type=='text')&&(!inputs[i].disabled))
{Form.Element.focus(inputs[i]);break;}}}},getFocusInputFunction:function(iframe)
{var that=this;return function()
{if(that.hasBeenFocused)
{return function(){};}
that.hasBeenFocused=true;try
{that.focusInput(iframe.contentDocument||iframe.contentWindow.document);}
catch(e)
{}};},build:function()
{this.innerElement=QBuilder('div',{id:this.id,className:'Q_Window PopUp'});if(this.options.id)
{this.innerElement.id=this.options.id;}
if(this.options.onScroll)
{var that=this;Event.observe(this.innerElement,'scroll',function(evt){Qualtrics.Event.executeDotSyntax(that.options.onScroll,null,null,null,{'$evt':evt,'$scrollTop':that.innerElement.scrollTop,'$scrollLeft':that.innerElement.scrollLeft},null);});}
if(this.stylesheet)
{QModules.loadStylesheet(this.stylesheet);}
this.element=QBuilder('div',{className:'Q_WindowBorder '+this.className,id:'Q_Window_'+this.id});this.element.div=QBuilder('div');if(this.tabs)
{this.element.appendChild(this.buildTabs());}
this.element.appendChild(this.element.div);if(this.title)
{this.headerDom=QBuilder('div',{className:'Q_WindowHeader'},[this.buildTitle(this.title,{closeButton:this.closeButton})]);this.element.div.appendChild(this.headerDom);}
else if(this.headerDom)
{this.element.div.appendChild(this.headerDom);}
if(this.options.banner)
{this.element.div.appendChild(QBuilder('span',{className:'Q_WindowBanner'},this.options.banner));}
var innerContainer=this.innerElement;if(this.options.bottomFade)
{innerContainer=QBuilder('div',{className:'InnerContainer'},[this.innerElement]);innerContainer.appendChild(QBuilder('div',{className:'BottomFade'}));$(this.innerElement).addClassName('HasBottomFade');}
this.element.div.appendChild(innerContainer);if(this.options&&this.options.closeButton&&!this.title)
{this.element.div.appendChild(QBuilder('div',{clickcallback:'Q_Window.destroy',instanceid:this.id,className:'Q_WindowClose'}));}
if(this.url)
{var scrolling='no';if(this.options.iframescrolling)
{scrolling='auto';}
var iframe=QBuilder('iframe',{className:'Q_WindowFrame',frameBorder:'0',scrolling:scrolling,src:this.url});var waiter=QAjaxWaiter.showMediumRing();$(iframe).hide();this.innerElement.appendChild(waiter);this.innerElement.appendChild(iframe);var that=this;(function()
{if(Qualtrics.Browser.IE&&Qualtrics.Browser.Version>7)
{iframe.show();}
iframe.src=that.url;Event.observe(iframe,'load',function(){$(iframe).show();$(waiter).hide();that.getFocusInputFunction(iframe);Q_Window.centerWindows();if(iframe.contentDocument&&iframe.contentDocument.body&&$(iframe.contentDocument.body).addClassName)
{$(iframe.contentDocument.body).addClassName('iframe');}});}).defer();var frameHeight='100%';var frameWidth='100%';if(this.options.frameHeight)
frameHeight=this.options.frameHeight;if(this.options.frameWidth)
frameWidth=this.options.frameWidth;$(iframe).setStyle({width:frameWidth,height:frameHeight,border:'none',marginBottom:'-3px'});this.iframe=iframe;this.setSize(this.width,this.height);}
if(this.ajaxUrl)
{new Ajax.Updater(this.innerElement,this.ajaxUrl);this.setSize(this.width,this.height);}
if(!this.noFooter||this.buttons)
{this.footerNode=QBuilder('div',{className:'Q_WindowFooterContainer'});this.element.div.appendChild(this.footerNode);if(this.buttons)
{this.footerNode.appendChild(this.buildButtons(this.buttons));}}
if(this.padding!==null)
{this.innerElement.style.padding=this.padding+'px';}
if(this.zIndex!==null)
{$(this.element).setStyle({zIndex:this.zIndex});}
if(this.minHeight)
{$(this.innerElement).setStyle({minHeight:this.minHeight});}
if(this.minWidth)
{$(this.innerElement).setStyle({minWidth:this.minWidth});}
return this.element;},buildTabs:function()
{this.tabsContainer=QBuilder('div',{className:'TabsContainer'},[this.buildTabsInner()]);return this.tabsContainer;},buildTabsInner:function()
{var tabsContainer=document.createDocumentFragment();for(var i=0,len=this.tabs.length;i<len;++i)
{var className=' NotSelected';if(this.currentTab==this.tabs[i].name)
{className=' Selected';}
tabsContainer.appendChild(QBuilder('a',{className:'Q_WindowTab'+className,downcallback:this.getSelfFunction('switchTab',this.tabs[i].name,this.tabs[i].action)},[this.tabs[i].display]));}
tabsContainer.appendChild(QBuilder('div',{className:'clear'}));return tabsContainer;},redrawTabs:function()
{deleteChildren(this.tabsContainer);this.tabsContainer.appendChild(this.buildTabsInner());},switchTab:function(tabName,action)
{this.currentTab=tabName;var curHeight=this.innerElement.offsetHeight;$(this.innerElement).setStyle({height:curHeight+'px'});this.minHeight=curHeight;this.redrawTabs();Qualtrics.Event.executeDotSyntax(action);},getCurrentTab:function()
{return this.currentTab;},getSelfFunction:function(var_args)
{return Qualtrics.Event.getSelfFunction('Q_Window',this.id,arguments);},setupDraggable:function()
{new Draggable(this.element,{handle:this.headerDom,onStart:function(el){$(el.element).setStyle({zIndex:200000000})}});},updateHeader:function(domNode)
{deleteChildren(this.headerDom);this.headerDom.appendChild(domNode);},buildButtons:function(buttonsArray)
{var footer=QBuilder('div',{className:'Q_WindowFooter'});this.leftFooterArea=QBuilder('div',{className:'LeftButtons'});this.rightFooterArea=QBuilder('div',{className:'RightButtons'});for(var i=0,len=buttonsArray.length;i<len;++i)
{if(buttonsArray[i]&&buttonsArray[i].align&&buttonsArray[i].align=='left')
{this.leftFooterArea.appendChild(this.buildButton(buttonsArray[i]));}
else
{this.rightFooterArea.appendChild(this.buildButton(buttonsArray[i]));}}
footer.appendChild(this.leftFooterArea);footer.appendChild(this.rightFooterArea);return footer;},buildTitle:function(title,options)
{options=options||{};var h2=QBuilder('h2');var bundle=[h2];if(typeof title=='string')
{h2.innerHTML=title;bundle=[h2];}
else if(typeof title.push=='function')
{bundle=title;}
else
{h2=QBuilder('h2',null,[title]);bundle=[h2];}
var inner=QBuilder('div',{className:'Q_WindowHeaderInner'},bundle);var header=QBuilder('div',{},[inner]);if(options.closeButton&&(this.options.forceCloseButton||!this.options.buttons||(this.options.buttons&&this.options.buttons.length<2)))
{header.appendChild(QBuilder('div',{clickcallback:'Q_Window.closeWindow',p1:this.windowName,instanceId:this.id,className:'Q_WindowCloseSQ'},[QBuilder('div',{bubbleup:true,className:'Q_WindowCloseSQInner'})]));}
if(this.options.draggable)
{inner.setAttribute('downcallback','Qualtrics.Draggable.dragNode(Q_Window_'+this.id+')');$(inner).addClassName('Draggable');h2.setAttribute('downcallback','Qualtrics.Draggable.dragNode(Q_Window_'+this.id+')');$(h2).addClassName('Draggable');}
return header;},buildIframeCover:function()
{this.iFrameCover=QBuilder('iframe',{className:'Q_WindowIframeCover',src:'blank.html'});var windowHeight=window.innerHeight;if(!windowHeight||windowHeight==0)
windowHeight=document.body.clientHeight;$(this.iFrameCover).setStyle({opacity:0,zIndex:this.zIndex-2,backgroundColor:'blue',position:'absolute',left:'1px',top:'0px',width:'100%',height:windowHeight+'px'});return this.iFrameCover;},disableScroll:function()
{if($('pageDiv'))
{if(!document.body.scrollDisabled)
{var scrollInfo=QualtricsTools.getScrollInfo();var xscroll=0-scrollInfo[0];var yscroll=0-scrollInfo[1];if(Qualtrics.Browser.Gecko&&Qualtrics.Browser.Version<3)
{Q_Window.setChopOffset([xscroll,yscroll]);$('pageDiv').setStyle({position:'relative',top:yscroll+'px'});$(document.body).setStyle({overflow:'hidden'});}
else if(Qualtrics.Browser.Gecko)
{$('pageDiv').setStyle({position:'relative'});$(document.body).setStyle({overflow:'hidden'});}
else
{$(document.body.parentNode).setStyle({overflow:'hidden'});}
var scrollBarWidth=this.getScrollBarWidth();if(scrollBarWidth)
{scrollBarWidth+='px';$(document.body).setStyle({marginRight:scrollBarWidth});}
document.body.scrollDisabled=true;if(this.onDisableScroll)
{this.onDisableScroll(scrollBarWidth);}}}},enableScroll:function()
{if($('pageDiv'))
{var chopped=Q_Window.getChopOffset();var x=chopped&&chopped[0]||0;var y=chopped&&chopped[1]||0;if(Qualtrics.Browser.Gecko&&Qualtrics.Browser.Version<3)
{$(document.body).setStyle({overflow:''});}
else if(Qualtrics.Browser.Gecko)
{$('pageDiv').setStyle({position:''});$(document.body).setStyle({overflow:''});}
else
{$(document.body.parentNode).setStyle({overflow:''});}
$(document.body).setStyle({marginRight:'0px'});$('pageDiv').setStyle({position:'',top:'',left:''});if(y||x)
{var scrollY=0-(Number(y));var scrollX=0-(Number(x));if(scrollY||scrollX)
{window.scrollTo(scrollX,scrollY);}}
Q_Window.setChopOffset(null);document.body.scrollDisabled=false;document.body.scrollTop=document.body.scrollTop+1;document.body.scrollTop=document.body.scrollTop-1;if(this.onEnableScroll)
{this.onEnableScroll();}}},getScrollBarWidth:function()
{var scrollDiv=QBuilder('div',{style:"width:100px;height:100px;overflow:scroll;position:absolute;top:-9999px;"});document.body.appendChild(scrollDiv);var scrollbarWidth=scrollDiv.offsetWidth-scrollDiv.clientWidth;document.body.removeChild(scrollDiv);return scrollbarWidth;},render:function()
{if(Qualtrics.Browser.IE&&Qualtrics.Browser.Version<7)
{document.body.appendChild(this.buildIframeCover());}
var overlayOptions={zIndex:this.zIndex-1,id:this.windowName};if(this.options.overrideOverlayWidth)
{var scrollOffsets=document.viewport.getScrollOffsets();overlayOptions.dim={width:scrollOffsets[0]+document.body.scrollWidth+'px'};}
if(this.options.overlayOpacity!==undefined)
{overlayOptions.opacity=this.options.overlayOpacity;}
if(window.Q_Overlay&&!this.options.hideOverlay)
{if(this.overlayClose)
{this.overlayObj=new Q_Overlay(Object.extend(overlayOptions,{onClick:this.getCloseFunction()}));}
else
{this.overlayObj=new Q_Overlay(overlayOptions);}}
document.body.appendChild(this.build());this.center();},getResizeOffset:function(axis)
{var defaultOffset=80;if(axis=='y')
{var offset=90;if(this.title)offset+=defaultOffset;return offset;}
return defaultOffset;},getForcedDimensionPreserveScroll:function(axis,max)
{var axisString='width';if(axis=='y')axisString='height';var offset=this.getResizeOffset(axis);var innerInnerDim={width:this.innerElement.scrollWidth,height:this.innerElement.scrollHeight};if(innerInnerDim[axisString]>max-offset)
{if(!this.options.disableOverflowScrolling)
{this.innerElement.style['position']='relative';this.innerElement.style['overflow'+axis.capitalize()]='auto';}
return max-offset+'px';}
return false;},resize:function()
{var newHeight,newWidth;if(window.QualtricsTools)
{var windowSize=QualtricsTools.getPageSize();var previousScrollTop=0;if(this.pctHeight||this.pctWidth)
{if(this.pctHeight)
{newHeight=String(Math.round(this.pctHeight*windowSize[3]-80));}
if(this.pctWidth)
{newWidth=String(Math.round(this.pctWidth*windowSize[2]));}}
if(!this.pctHeight)
{if(this.autoHeight)
{previousScrollTop=this.innerElement.scrollTop;$(this.innerElement).setStyle({height:'auto'});if(this.minHeight&&this.innerElement.offsetHeight<this.minHeight)
{$(this.innerElement).setStyle({height:this.minHeight+'px'});}}
var forcedHeight=this.getForcedDimensionPreserveScroll('y',windowSize[3]);if(forcedHeight)
{newHeight=forcedHeight;}}
if(!this.pctWidth)
{if(this.autoWidth)
{$(this.innerElement).setStyle({width:'auto'});if(this.minWidth&&this.innerElement.offsetWidth<this.minWidth)
{$(this.innerElement).setStyle({width:this.minWidth+'px'});}}
var forcedWidth=this.getForcedDimensionPreserveScroll('x',windowSize[2]);if(forcedWidth)
{newWidth=forcedWidth;}}
newHeight=newHeight||this.height;newWidth=newWidth||this.width;if(newHeight&&newHeight!='auto'&&newHeight.startsWith&&!newHeight.startsWith('-'))
{var h=newHeight;if(!String(h).endsWith('px'))
{h+='px';}
$(this.innerElement).setStyle({height:h});if(previousScrollTop)
{this.innerElement.scrollTop=previousScrollTop;}}
if(newWidth&&newWidth!='auto'&&newWidth.startsWith&&!newWidth.startsWith('-'))
{var w=newWidth;if(!String(w).endsWith('px'))
{w+='px';}
$(this.innerElement).setStyle({width:w});}
this.calculatedHeight=newHeight;this.calculatedWidth=newWidth;if(this.options.onResize)
this.options.onResize();}},setupEvents:function()
{Event.observe(document,'keypress',this.keyPress);},destroyEvents:function()
{Event.stopObserving(document,'keypress',this.keyPress);},keyPress:function(evt)
{if(evt.keyCode==Event.KEY_ESC)
{Q_Window.closeWindow();}},close:function()
{this.destroy();},destroy:function(opt_enableScroll)
{if(this.element)
{if(this.onClose)
{try
{if(Qualtrics.Event.execute(this.onClose)===false)
{return false;}}
catch(e)
{console.log('Error in onclose event',e);}}
this.destroyEvents();Q_Window.removeFromRegistry(this.id);if(this.contentParent)
{this.contentParent.appendChild(this.content);}
this.content=null;removeElement(this.element);this.element=null;if(this.iFrameCover)
{removeElement(this.iFrameCover);this.iFrameCover=null;}
if(this.overlayObj)
{this.overlayObj.remove();}
if(Q_Window.isRegistryEmpty())
{if((opt_enableScroll||opt_enableScroll===undefined))
{this.enableScroll();}
Q_Window.resetZIndex();}
else if(this.zDiff&&this.zDiff>0)
{var currentZIndex=Q_Window.getCurrentZIndex();if(this.zIndex>=currentZIndex)
Q_Window.setCurrentZIndex(currentZIndex-this.zDiff);}
if(this.keepingCentered)
{window.onresize=null;}
if(this.headerDom)
{this.headerDom=null;}
return true;}},transformIntoLoading:function()
{$(this.innerElement).setStyle({width:this.innerElement.offsetWidth+'px',height:this.innerElement.offsetHeight+'px',padding:0});this.showLoading();new Effect.Morph(this.innerElement,{transition:INQUAD,duration:0.3,style:{height:'60px',width:'350px'},afterUpdate:this.center.bind(this,null,false)});},showLoading:function()
{deleteChildren(this.innerElement);var loading=QBuilder('div',{className:'candyBarLoadingImage'});$(loading).setOpacity(0);this.innerElement.appendChild(loading);new Effect.Opacity(loading,{from:0.0,to:1.0,duration:0.5});},getCloseFunction:function()
{var that=this;return function()
{that.destroy();};},appendChild:function(node)
{this.innerElement.appendChild(node);},setContent:function(node)
{if(!node)return;if(typeof node=='string')
{node=QBuilder('div',null,[node]);}
this.content=node;if(node.parentNode)
{this.contentParent=node.parentNode;}
this.clear();this.appendChild(node);$(node).show();this.setSize(this.width,this.height,false);this.center();},morphContent:function(options)
{options=options||{};if(!options.content)options.content=options;if(options.content)
{deleteChildren(this.innerElement);this.setContent(options.content);this.center();}},scrollBottom:function()
{if(this.innerElement)
{this.innerElement.scrollTop=this.innerElement.scrollHeight;}},scrollTop:function()
{if(this.innerElement)
{this.innerElement.scrollTop=0;}},getContent:function()
{return this.innerElement;},clear:function()
{deleteChildren(this.getContent());},setIframeParent:function(parentWindowObj)
{this.iframeParent=parentWindowObj;},center:function(el,opt_skipResize)
{if(this.beforeCenter)
{this.beforeCenter();}
if(opt_skipResize!==false)
{this.resize();}
if(!el)el=this.element;var dim=Element.getDimensions(el);var scrollInfo=QualtricsTools.getScrollInfo();var pageDim=QualtricsTools.getPageSize();var browserWidth=pageDim[2];var browserHeight=pageDim[3];if(window.alternateQWindowOverflow)
{scrollInfo=[window.alternateQWindowOverflow.scrollLeft,window.alternateQWindowOverflow.scrollTop];browserHeight=window.alternateQWindowOverflow.offsetHeight;}
var center=(browserWidth/2)-(dim.width/2)+scrollInfo[0];var middle=(browserHeight/2)-(dim.height/2)+scrollInfo[1];try
{if(this.iframeParent)
{if(window.frameElement&&this.iframeParent&&this.iframeParent.Qualtrics)
{var frameOffsets=Position.cumulativeOffset(window.frameElement);var parentScrollY=this.iframeParent.scrollInfo[1];if(parentScrollY)
{var viewTop=parentScrollY-frameOffsets.top;var viewPageHeight=this.iframeParent.clientHeight||this.iframeParent.innerHeight||this.iframeParent.document.documentElement.clientWidth;if(viewPageHeight)
{middle=Math.min(parentScrollY-frameOffsets.top+(viewPageHeight/2)-(dim.height/2));}}}}}catch(e)
{}
center=Math.round(center)+'px';middle=Math.round(middle)+'px';$(el).setStyle({left:center,top:middle});if(this.keepCentered)
{this.keepCentered();}},buildButton:function(buttonObj)
{if(buttonObj==undefined)
{return;}
if(typeof buttonObj=='string')
{var type=buttonObj,obj={},text=null,action=null;if(buttonObj.indexOf('|')!=-1){text=buttonObj.substring(buttonObj.indexOf('|')+1);type=buttonObj.substring(0,buttonObj.indexOf('|'));}
if(type.indexOf(':')!=-1){action=type.substring(buttonObj.indexOf(':')+1);type=type.substring(0,buttonObj.indexOf(':'));}
type=type.toLowerCase();switch(type)
{case'cancel':{obj.text=getMessage('SiteWide','Cancel');obj=Object.extend(obj,{id:this.windowName+'CancelButton',icon:'cancel',click:'Q_Window.closeWindow('+this.windowName+')',className:'negative'});break;}
case'closewithoutsaving':{obj.text=getMessage('EditSection','CloseWithoutSaving');obj=Object.extend(obj,{id:this.windowName+'CancelButton',icon:'cancel',click:'Q_Window.closeWindow('+this.windowName+')',className:'negative'});break;}
case'close':{obj.text=getMessage('SiteWide','Close');obj=Object.extend(obj,{id:this.windowName+'CancelButton',icon:'cancel',click:'Q_Window.closeWindow('+this.id+')',className:'negative'});break;}
case'save':{obj=Object.extend(obj,{id:this.windowName+'SaveButton',icon:'check',text:getMessage('SiteWide','Save'),className:'positive'});break;}
case'ok':{obj=Object.extend(obj,{id:this.windowName+'OKButton',icon:'check',text:getMessage('SiteWide','OK'),className:'positive',click:'Q_Window.closeWindow('+this.id+')'});break;}}
if(action)
{obj.click=action;if(type.indexOf('save')!=-1)
{if(this.options.disableSave)
{obj.className+=' Disabled';obj.click='';obj.permanentDisable=true;}
else
{obj.click='Q_Window.saveButtonHelper:'+this.windowName+'('+action+')';}}
if(type=='ok')
{obj.click='Q_Window.okButtonHelper:'+this.windowName+'('+action+')';}
if(type=='cancel')
{obj.click='Q_Window.cancelButtonHelper:'+this.windowName+'('+action+')';}}
if(text)
{obj.text=text;}
buttonObj=obj;}
var className='';if(buttonObj.className)
{className=' '+buttonObj.className;}
var style='';if(buttonObj.style)
{style=' '+buttonObj.style;}
var elementType='a';if(buttonObj['button'])
{elementType='button';}
if(buttonObj.domNode)
{var button=Qualtrics.Event.execute(buttonObj.domNode);}
else
{button=QBuilder(elementType,{className:'qbutton'+className+style});}
if(buttonObj.icon)
{button.appendChild(QBuilder('span',{className:'icon '+buttonObj.icon}));}
if(buttonObj.text)
{button.appendChild(document.createTextNode(buttonObj.text));}
if(buttonObj.click)
{button.setAttribute('clickcallback',buttonObj.click);}
if(buttonObj.clickcallback)
{button.setAttribute('clickcallback',buttonObj.clickcallback);}
if(buttonObj.instanceid)
{button.setAttribute('instanceid',buttonObj.instanceid);}
var buttonIndex=1;while(buttonObj['p'+buttonIndex]!=undefined)
{button.setAttribute('p'+buttonIndex,buttonObj['p'+buttonIndex]);buttonIndex++;}
if(buttonObj.id)
{button.id=buttonObj.id;this.buttonReg[button.id]=button;}
if(buttonObj.type)
{button.type=buttonObj.type;}
if(buttonObj.permanentDisable)
{button.setAttribute('permanentDisable',buttonObj.permanentDisable);}
return button;},getButton:function(id)
{return $(this.buttonReg[id]);},isButtonDisabled:function(id)
{return this.getButton(id).hasClassName('disabled');},busifyButton:function(id,message)
{var button=this.getButton(id);if(!button)
{button=this.getButton(this.windowName+id+'Button');if(!button)
{button=$(id);}}
button=$(button);$(button).addClassName('disabled');$(button).addClassName('Disabled');button.disabled=true;button.originalHTML=button.innerHTML;if(message)
button.innerHTML=message;if(button.hasAttribute('clickcallback'))
{button.setAttribute('pendingcallback',button.getAttribute('clickcallback'));button.removeAttribute('clickcallback');}},unbusifyButton:function(id,message)
{var button=this.getButton(id);if(!button)
{button=$(id);}
if(message)
button.innerHTML=message;if(button&&!button.hasAttribute('permanentDisable'))
{$(button).removeClassName('disabled');$(button).removeClassName('Disabled');button.disabled=false;if(button.originalHTML)
button.innerHTML=button.originalHTML;}
if(button.hasAttribute('pendingcallback'))
{button.setAttribute('clickcallback',button.getAttribute('pendingcallback'));button.removeAttribute('pendingcallback');}},disableButton:function(id)
{var button=this.getButton(id);if(button)
{button.disabled=true;$(button).addClassName('disabled');if(button.hasAttribute('clickcallback'))
{button.setAttribute('pendingcallback',button.getAttribute('clickcallback'));button.removeAttribute('clickcallback');}}},enableButton:function(id)
{var button=this.getButton(id);if(button&&!button.hasAttribute('permanentDisable'))
{button.disabled=false;$(button).removeClassName('disabled');if(button.hasAttribute('pendingcallback'))
{button.setAttribute('clickcallback',button.getAttribute('pendingcallback'));button.removeAttribute('pendingcallback');}}},reenableButton:function(buttonType)
{var id=this.windowName+buttonType+'Button';this.unbusifyButton(id);},saveButtonHelper:function(action)
{var button=$(this.windowName+'SaveButton');if(button&&!button.disabled)
{button.originalHTML=button.innerHTML;button.innerHTML=this.customSavingMessage||getMessage('SiteWide','Saving')+'...';button.disabled=true;button.addClassName('Disabled');QualtricsCPTools.executeDotSyntax(action);}},okButtonHelper:function(action)
{this.destroy();QualtricsCPTools.executeDotSyntax(action);},cancelButtonHelper:function(action)
{this.destroy();QualtricsCPTools.executeDotSyntax(action);},keepCentered:function()
{this.keepCentering=true;if(!Q_Window.resizeWatcher)
{Q_Window.resizeWatcher=Event.observe(window,'resize',function(evt){Qualtrics.Cache.unset('PageSize');Q_Window.centerWindows();});}},showCenter:function()
{this.center();},getSize:function()
{return{width:this.width,height:this.height};},setSize:function(width,height,opt_resize)
{this.width=String(width);this.height=String(height);if(!this.preservePctHeightAndWidth)
{this.pctWidth=null;this.pctHeight=null;}
var that=this;['height','width'].map(function(s){if(String(that[s]).endsWith('%'))
{that['pct'+s.capitalize()]=parseInt(that[s].substr(0,that[s].indexOf('%')),10)/100;}
else if(that[s]!=='auto'&&!String(that[s]).endsWith('px'))
{}
that['auto'+s.capitalize()]=(that[s]=='auto');});if(opt_resize!==false)
this.resize();},getInnerDimensions:function()
{return $(this.innerElement).getDimensions();},setTitle:function(title)
{var closeButton=this.closeButton;this.updateHeader(this.buildTitle(title,{closeButton:closeButton}));},replace:function(options)
{var skeleton=new Q_Window({title:'A',buttons:['close'],hidden:true,skeleton:true,hideOverlay:true});options.hidden=true;options.hideOverlay=true;var win=new Q_Window(options);win.overlayObj=this.overlayObj;delete this.overlayObj;var dims=this.getInnerDimensions();skeleton.setSize(dims.width,dims.height);$(skeleton.element).setStyle({top:this.element.style.top,left:this.element.style.left});skeleton.unHide((function(skeleton,win)
{var dims=win.getInnerDimensions();new Effect.Morph(skeleton.element,{style:'top:'+win.element.style.top+'; left:'+win.element.style.left,duration:0.3});new Effect.Morph(skeleton.innerElement,{style:{width:dims.width+'px',height:dims.height+'px'},duration:0.3,afterFinish:(function(skeleton,win)
{win.unHide();skeleton.hide(skeleton.destroy.bind(skeleton,false));}).curry(skeleton,win)});}).curry(skeleton,win));this.hide(this.destroy.bind(this,false));return win;},hide:function(opt_afterFinish)
{$(this.element).fade({duration:0.4,afterFinish:opt_afterFinish||function(effect){effect.element.className+=' Hide';}});},unHide:function(opt_afterFinish)
{$(this.element).setOpacity(0);$(this.element).removeClassName('Hide');$(this.element).appear({duration:0.2,afterFinish:opt_afterFinish});}};window.Q_Overlay=Class.create();Q_Overlay.reg=[];Q_Overlay.getInstance=QualtricsTools.getInstanceHelper(Q_Overlay.reg,'_id');Q_Overlay.removeAll=function()
{var i=Q_Overlay.reg.length;while(i--)
{Q_Overlay.reg[i].remove();}};Q_Overlay.prototype={_id:null,overlayName:null,initialize:function(options)
{options=options||{};this.options=options;Q_Overlay.reg.push(this);this._id=QualtricsTools.createNewId('QO');var opacity=options.opacity;var overlayId="Overlay";if(options.id){overlayId=options.id;}
this.overlayName=overlayId;var objOverlay=QBuilder('div',{id:this._id,className:'Overlay Overlay_'+this.overlayName,style:"display:none"});if(options.onClick)
{objOverlay.onclick=options.onClick;}
if(options.keepMenuOpen)
{Event.observe(document.body,'mousedown',this.mouseDownHandler);}
if(options.onClose)
{this.onClose=options.onClose;}
if(options.parentId){options.append=options.parentId;}
if(options.append){$(options.append).appendChild(objOverlay);}else{document.body.appendChild(objOverlay);}
if($('pageDiv'))
{$('pageDiv').addClassName('HideOnOverlay');}
var arrayPageSize=getPageSize();Element.setStyle(objOverlay,{height:arrayPageSize[1]+'px'});if(options.dim){if(options.dim.width){Element.setStyle($(objOverlay),{width:options.dim.width});}
if(options.dim.height){Element.setStyle(objOverlay,{height:options.dim.height});}
if(options.dim.x){Element.setStyle($(objOverlay),{left:options.dim.x+'px'});}
if(options.dim.y){Element.setStyle($(objOverlay),{top:options.dim.y+'px'});}}
if(options.zindex)options.zIndex=options.zindex;if(options.zIndex){Element.setStyle($(objOverlay),{zIndex:options.zIndex});}
if(options.color){Element.setStyle($(objOverlay),{backgroundColor:options.color});}
$(objOverlay).show();if(opacity!==undefined)
{$(objOverlay).setStyle({opacity:opacity});objOverlay.style.opacity=opacity;}
this.domNode=objOverlay;objOverlay=null;this.manageMultipleOverlays();},manageMultipleOverlays:function()
{if(this.options.dontManageOverlays)
{return;}
if(Q_Overlay.reg.length)
{for(var i=0,len=Q_Overlay.reg.length;i<len;++i)
{if(i<len-1)
{Q_Overlay.reg[i].domNode&&$(Q_Overlay.reg[i].domNode).setStyle({backgroundColor:'transparent'});}
else
{Q_Overlay.reg[i].domNode&&$(Q_Overlay.reg[i].domNode).setStyle({backgroundColor:''});}}}},getPosition:function()
{for(var i=0,len=Q_Overlay.reg.length;i<len;++i)
{if(Q_Overlay.reg[i]._id==this._id)
return i;}},remove:function(options)
{Event.stopObserving(document.body,'mousedown',this.mouseDownHandler);if(this.onClose)
{this.onClose();}
if(this.domNode){removeElement(this.domNode);this.domNode=null;}
var pos=this.getPosition();Q_Overlay.reg.splice(pos,1);if(!Q_Overlay.reg.length)
{if($('pageDiv'))
$('pageDiv').removeClassName('HideOnOverlay');}
this.manageMultipleOverlays();},mouseDownHandler:function(evt)
{if(!evt)
evt=window.event;evt.cancelBubble=true;if(evt.stopPropagation)
evt.stopPropagation();}};window.Q_PopoverWindow=Class.create(Q_Window,{initialize:function($super,windowName,options,var_args)
{$super(windowName,options);var windowBackgroundColor='#ebebeb';if(options.anchor)
{var dims=Element.getDimensions(options.anchor);var manageLink=QBuilder('a',{className:'ManageDataSource'},getMessage('Reporting','ManageOtherFilters'));var anchorDiv=QBuilder('div',{},[manageLink]);$(anchorDiv).setStyle({display:'block',position:'absolute',backgroundColor:windowBackgroundColor,style:'padding:5px',textAlign:'center',right:0,top:(-1*dims.height)+'px',width:dims.width+'px',height:dims.height+'px'});if(this.options.anchor.firstChild)
{$(manageLink).setStyle({lineHeight:$(this.options.anchor.firstChild).getStyle('line-height'),whiteSpace:$(this.options.anchor.firstChild).getStyle('white-space'),color:$(this.options.anchor.firstChild).getStyle('color'),textDecoration:$(this.options.anchor.firstChild).getStyle('text-decoration')});}
this.element.appendChild(anchorDiv);$(this.element).setStyle({backgroundColor:windowBackgroundColor});}
$(this.element).removeClassName('Q_WindowBorder');$(this.element).addClassName('Q_Popover');},center:function($super,el,opt_skipResize)
{$super(el,opt_skipResize);if(this.options.anchor)
{var dims=Element.getDimensions(this.options.anchor);var pos=Element.cumulativeOffset(this.options.anchor);var width=Element.getDimensions(this.element).width;pos.top+=(dims.height+5);pos.left-=(width-dims.width);$(this.element).setStyle({top:pos.top+'px',left:pos.left+'px'});}
this.fitToScreen();},setContent:function($super,content)
{$super(content);this.fitToScreen();},fitToScreen:function()
{var windowSize=$(this.element).getDimensions();var pageDim=QualtricsTools.getPageSize();var browserWidth=pageDim[2];var browserHeight=pageDim[3];var bottomPadding=150;var currentTop=parseInt($(this.element).getStyle('top'));if(currentTop+windowSize.height>browserHeight)
{var restrictedHeight=(browserHeight-currentTop-bottomPadding);$(this.innerElement).setStyle({height:restrictedHeight+'px'});}}});

Qualtrics.Menu={menuPaneStack:[],buildMenuButton:function(title,menuCallBack,options)
{options=options||{};var buttonId=(options&&options.buttonId||options.id)||QualtricsTools.createNewId('BTN');var innerTitle=QBuilder('span',{});this.innerTitleDom=innerTitle;if(title===null&&(options.initialValue!==undefined||options.autoSelect))
{var buttonMenuPaneOptions=Object.extend({headless:true,onLoad:'Qualtrics.Menu.loadTitleFromMenuDef('+buttonId+', $menuPane, '+options.autoSelect+')',allowAbort:false},options);var menuPane=new Qualtrics.MenuPane(menuCallBack,null,null,buttonMenuPaneOptions);menuPane.buildMenu(menuCallBack);var menuDef=menuPane.menuDef;var initialValue;if(menuDef.items)
{if(options.initialValue!==undefined)
{initialValue=options.initialValue;}
else if(options.autoSelect)
{initialValue=this.getDefaultValue(menuDef,menuPane);var itemDef=Qualtrics.Menu.getItemDefByValue(initialValue,menuDef);var selectionNode=undefined;menuPane.runSelectCallBack(menuPane,itemDef,selectionNode);}
title=Qualtrics.Menu.getMenuDisplayByValue(initialValue,menuDef,true);}
else if(menuDef.loading)
{title=QBuilder('span',{className:'Loading'});}
menuPane.destroy();}
if(title=='')
{$(innerTitle).update('&nbsp;');}
else
{if(options.displayAsText)
{var textnode=document.createTextNode(title);innerTitle.innerHTML='';innerTitle.appendChild(textnode);}
else if((options.buttonTruncate||options.truncate)&&window.QualtricsCPTools&&typeof title=='string')
{var truncatedTitle=QualtricsCPTools.middleTruncate(title.stripTags(),options.buttonTruncate||options.truncate);$(innerTitle).update(truncatedTitle);}
else
{$(innerTitle).update(title);}}
var className;if(options.className)
{className=' '+options.className;}
else
{className='';}
var callbacktype=options.callbacktype||'downcallback';var p3='';if(typeof options!='string')
{p3=Object.toJSON(options);}
var button;var b;var highlight='';if(options.highlight)
highlight=QBuilder('span',{className:'HighlightTop',bubbleup:'true'});if(!options.menuButtonCallback)
{options.menuButtonCallback='Qualtrics.Menu.showMenu';}
innerTitle.id='ButtonInner_'+buttonId;if(options.theme)
{button=QBuilder('a',{p1:menuCallBack,p2:'$el',p3:p3,p4:'$evt',preventDrag:'true',id:buttonId,className:'ThemedMenuButton menuButton_'+options.theme+className},[highlight,b=QBuilder('b',{bubbleup:'true',preventDrag:'true'},[options.icon!==false?QBuilder('span',{className:'icon'}):'',options.misc!==false?QBuilder('span',{className:'misc'}):'',innerTitle])]);button.setAttribute(callbacktype,options.menuButtonCallback);}
else
{var iconDom='';if(options.iconDom)
{if(typeof options.iconDom=='string')
{iconDom=Qualtrics.Event.executeDotSyntax(options.iconDom);}
else if(typeof options.iconDom=='object')
{iconDom=options.iconDom;}}
button=QBuilder('a',{id:buttonId,className:'menuButton'+className},[highlight,QBuilder('b',{preventDrag:'true'},[QBuilder('b',{preventDrag:'true'},[b=QBuilder('b',{p1:menuCallBack,p2:'$el',p3:p3,p4:'$evt',preventDrag:'true'},[options.icon!==false?QBuilder('span',{className:'icon'},[iconDom]):'',innerTitle])])])]);b.setAttribute(callbacktype,options.menuButtonCallback);}
button.updateTitle=Qualtrics.Menu.getUpdateButtonFunction(buttonId);b.updateTitle=button.updateTitle;button.callbackNode=b;button.updateCallback=function(b,type,c){b.setAttribute(type,c)}.curry(b,callbacktype);b.aNode=button;if(options.menuItemSelectCallback)
{button.setAttribute('menuitemselectcallback',options.menuItemSelectCallback);}
if(options.initialValue!==undefined)
{this.currentValue=options.initialValue;button.setAttribute('currentvalue',options.initialValue);}
return button;},buildColorMenuButton:function(colorPickerOptions)
{colorPickerOptions=colorPickerOptions||{};var menuOptions={colorPickerColor:colorPickerOptions.color,colorPickerCallback:colorPickerOptions.action,checkForFixed:colorPickerOptions.checkForFixed!==undefined?colorPickerOptions.checkForFixed:true,showNone:colorPickerOptions.showNone||true,noneMessage:colorPickerOptions.noneMessage};menuOptions.className='SelectMenuButton ColorMenuButton';return this.buildMenuButton(this.buildColorTitle(menuOptions),'Qualtrics.Menu.getColorMenuDef('+menuOptions.colorPickerColor+', $options)',menuOptions);},buildColorTitle:function(options)
{var color=options.colorPickerColor||'transparent';var title='';if(options.buttonLabel)
{title=options.buttonLabel;}
var swatch=QBuilder('div',{className:'ColorMenuSwatch',bubbleup:true},[QBuilder('div',{className:'SwatchBorder',bubbleup:true})]);if(options.colorPickerColor)
{$(swatch).setStyle({backgroundColor:color});}
return QBuilder('div',{bubbleup:true},[QBuilder('div',{className:'ColorMenuSwatchContainer',bubbleup:true},[swatch]),QBuilder('span',{className:'ColorMenuLabel',bubbleup:true},[title])]);},getColorMenuDef:function(selectedColor,options)
{return{items:[{domNode:'Qualtrics.Menu.getColorPickerDom($options)'}]};},getColorPickerDom:function(options)
{QModules.loadModule('colorpicker.js');var colorPicker=new ColorPicker({color:options.colorPickerColor,useTransparent:true,onColorPick:options.colorPickerCallback});var cpNode=colorPicker.buildColorPicker();var additionalItems=document.createDocumentFragment();if(options.showNone)
{additionalItems.appendChild(QBuilder('a',{className:'MenuItemLink',mouseupcallback:colorPicker.getSelfFunction('resetColor')},options.noneMessage||getMessage('SiteWide','Reset')));}
return QBuilder('div',{className:'ColorPickerMenu'},[cpNode,additionalItems]);},getUpdateButtonFunction:function(buttonId)
{return function(htmlContent)
{Qualtrics.Menu.updateButtonTitle(buttonId,htmlContent);};},updateButtonTitle:function(id,htmlContent)
{var buttonInner=$('ButtonInner_'+id)||this.innerTitleDom;if(buttonInner)
buttonInner.innerHTML=htmlContent;},loadTitleFromMenuDef:function(buttonId,menuPane,autoSelect)
{var buttonNode=$(buttonId);var menuDef=menuPane.menuDef;var value=buttonNode.callbackNode.getAttribute('currentvalue');if((value===undefined||value===null||value==='null')&&autoSelect)
{var value=this.getDefaultValue(menuDef,menuPane);if(value!==undefined)
{var itemDef=Qualtrics.Menu.getItemDefByValue(value,menuDef);var selectionNode=undefined;menuPane.runSelectCallBack(menuPane,itemDef,selectionNode);}}
var title=Qualtrics.Menu.getMenuDisplayByValue(value,menuDef,true);Qualtrics.Menu.updateButtonTitle(buttonId,title);},getDefaultValue:function(menuDef,menuPane)
{if(menuPane.options.autoSelectCallback)
{return Qualtrics.Event.executeDotSyntax(menuPane.options.autoSelectCallback,null,null,null,{'$menuDef':menuDef},[menuDef]);}
else
{if(menuDef&&menuDef['items'])
{return menuDef['items'][0].value;}}},getItemDefByValue:function(val,def)
{if(def['items'])
{for(var i=0,len=def['items'].length;i<len;++i)
{if(def['items'][i].value==val)
{return def['items'][i];}}}
return null;},getMenuDisplayByValue:function(val,def,opt_selectedDisplay)
{if(def['items'])
{for(var i=0,len=def['items'].length;i<len;++i)
{if(def['items'][i].value==val)
{var selectedDisplay=(opt_selectedDisplay)?def['items'][i].selectedDisplay:false;return selectedDisplay||def['items'][i].display||def['items'][i].label;}}}
return val;},buildSelectMenuButton:function(initialValue,fieldName,options)
{var buttonId=fieldName+'_Button';options=options||{};var list=options.list||{};var className=options.className?'SelectMenuButton '+options.className:'SelectMenuButton';if(!initialValue&&Object.keys(list).length&&!options.prompt)
{initialValue=Object.keys(list)[0];}
var menuButtonOptions=Object.extend(options,{menuType:'SelectMenuPane',className:className,buttonId:buttonId,fieldName:fieldName,list:list,useArrayIndex:options.useArrayIndex,initialValue:initialValue,p1:fieldName,p2:buttonId,p3:'$options'});var value=initialValue;if(list[initialValue])
{if(typeof list[initialValue]=='object')
{var html=list[initialValue].label||list[initialValue];if(typeof html=='object')
{value=html.value;}}
else
{value=list[initialValue];}}
if(value===null&&options.prompt)
{value=options.prompt;}
var button=Qualtrics.Menu.buildMenuButton(value,'Qualtrics.Menu.buildSelectMenu',menuButtonOptions);Qualtrics.Menu.setupMenuButtonInput.curry(initialValue,fieldName,button).defer();return button;},buildNumericMenuButton:function(options)
{options=options||{};options.range=options.range||[10,20,50,100,200,500,1000,2000,5000];options.value=options.value||options.range[0];options.min=options.min||0;options.max=options.max||undefined;options.unlimitedValue=options.unlimitedValue||'Unlimited';options.allowCustom=options.allowCustom||false;return Qualtrics.Menu.buildMenuButton(null,'Qualtrics.Menu.getNumericMenuDef($options, $el)',{initialValue:options.value,selectMenu:true,className:'SelectMenuButton',menuItemSelectCallback:options.menuItemSelectCallback,numericOptions:options});},getNumericMenuDef:function(options,button)
{var items=[];for(var i=0,len=options.numericOptions.range.length;i<len;++i)
{if(options.numericOptions.min&&options.numericOptions.range[i]<options.numericOptions.min)continue;if(options.numericOptions.max&&options.numericOptions.range[i]>options.numericOptions.max)continue;items.push({display:number_format(options.numericOptions.range[i],0,'',','),value:options.numericOptions.range[i]});}
if(!options.numericOptions.max)
{items.push({display:getMessage('ServerAdminSection','Unlimited'),value:options.unlimitedValue});}
if(options.numericOptions.allowCustom)
{var buttonId=button?QualtricsTools.fastUp(button,'menuButton').id:'';items.push({type:'TextInput',action:'Qualtrics.Menu.validateNumericMenuValue($val, '+buttonId+', '+options.numericOptions.menuItemSelectCallback+', '+options.numericOptions.min+', '+options.numericOptions.max+')',label:'Custom'+(options.numericOptions.max?' (up to '+number_format(options.numericOptions.max,0,'',',')+')':''),validation:'Number',focus:true});}
return{items:items};},validateNumericMenuValue:function(value,buttonId,callback,min,max)
{if(!Number(value))return;if(Number(min)&&Number(value)<Number(min))return;if(Number(max)&&Number(value)>Number(max))return;var button=$(buttonId);if(button)
{button.updateTitle(value);button.callbackNode.setAttribute('currentvalue',value);}
Qualtrics.Event.executeDotSyntax(callback,false,false,false,{'$value':value});},setupMenuButtonInput:function(initialValue,fieldName,button)
{if(!$(fieldName))
{var input=QBuilder('input',{type:'hidden',id:fieldName,name:fieldName,value:initialValue});if(initialValue===null&&input.getAttribute('value')=='null')
input.value=null;if(button&&button.firstChild&&button.firstChild.nodeType==1)
button.firstChild.appendChild(input);}
else
{if(!$(fieldName).value)$(fieldName).value=initialValue;}},buildSelectMenu:function(fieldName,buttonId,options)
{options=Qualtrics.Menu.processOptions(options);var menuList=Qualtrics.Menu.buildSelectMenuList(fieldName,buttonId,options.list,options.useArrayIndex);if(options.search)
menuList.search=options.search;return menuList;},buildSelectMenuList:function(fieldName,buttonId,list,opt_useArrayIndex)
{console.warn('buildSelectMenuList is deprecated use selectMenu:true on a regular menu');var callbackNode=$(buttonId).callbackNode;var currentValue=($(fieldName)&&$(fieldName).value)||callbackNode&&callbackNode.getAttribute('currentvalue');var isArray=false;if(list.push&&typeof list.push=='function')
{isArray=true;}
if(list&&!Qualtrics.isEmpty(list))
{var items=[];for(var listId in list)
{var key=listId;if(isArray&&!opt_useArrayIndex)
{key=list[listId];}
var itemOptions={};if(typeof list[listId]=='object')
{itemOptions=list[listId];}
var html=itemOptions.label||list[listId];var listItem=html;var className='';if(typeof html=='function')
{continue;}
if(typeof html=='object')
{if(html.className)
{className=' '+html.className;}
html=html.value;}
var checked=false;if(listId==currentValue)checked=true;if(isArray&&!opt_useArrayIndex)
{if(list[listId]==currentValue)checked=true;}
var item={display:html,className:className,value:key,checked:checked,parameters:{p1:fieldName,p2:buttonId,p3:key,p4:list[listId]}};if(typeof listItem=='object')
{item=listItem;}
if(list[listId].action)
{item.action=list[listId].action;}
items.push(item);}
return{items:items,togglecheckexclusive:true};}
else
{return{string:getMessage('SiteWide','NoResults')};}},showMenu:function(menuBuilder,parentButton,options,evt)
{if(evt)
{Event.stop(evt);}
if(Qualtrics.Menu.skipNextOpen&&Qualtrics.Menu.skipNextOpen==menuBuilder)
{Qualtrics.Menu.skipNextOpen=false;return;}
var alreadyOpenMenuPane=Qualtrics.Menu.findMenu(menuBuilder);if(alreadyOpenMenuPane&&alreadyOpenMenuPane.isOpen())
{return;}
options=this.processOptions(options);var opt_parentMenu=options.parentMenu;if(parentButton&&parentButton.aNode)
{$(parentButton.aNode).addClassName('HasActiveMenu');}
if(options.checkForFixed)
{options.fixed=this.isFixed(parentButton);}
if(options.menuType)
{return new Qualtrics[options.menuType](menuBuilder,parentButton,opt_parentMenu,options,evt);}
return new Qualtrics.MenuPane(menuBuilder,parentButton,opt_parentMenu,options,evt);},isFixed:function(element)
{if(element.parentNode)
{return QualtricsTools.isFixed(element);}
return false;},findMenu:function(menuBuilder)
{for(var i=0,len=Qualtrics.Menu.menuPaneStack.length;i<len;++i)
{if(Qualtrics.Menu.menuPaneStack[i].menuBuilder==menuBuilder)
{return Qualtrics.Menu.menuPaneStack[i];}}},removeMenuPaneFromStack:function(menuPane)
{var i=menuPane.getStackIndex();if(Qualtrics.Menu.menuPaneStack[i]&&Qualtrics.Menu.menuPaneStack[i].id==menuPane.id)
Qualtrics.Menu.menuPaneStack.splice(i,1);},getActiveMenuPane:function()
{if(!Qualtrics.Menu.menuPaneStack.length)
{return null;}
return Qualtrics.Menu.menuPaneStack[Qualtrics.Menu.menuPaneStack.length-1];},getRootMenuPane:function()
{if(!Qualtrics.Menu.menuPaneStack.length)
{return null;}
return Qualtrics.Menu.menuPaneStack[0];},processVelocity:function(velocity)
{var activeSubMenuParentIndex=Qualtrics.Menu.menuPaneStack.length-2;var activeSubMenuIndex=Qualtrics.Menu.menuPaneStack.length-1;if(activeSubMenuParentIndex<0)activeSubMenuParentIndex=0;var activeParent=Qualtrics.Menu.menuPaneStack[activeSubMenuParentIndex];var activeSubMenu=Qualtrics.Menu.menuPaneStack[activeSubMenuIndex];if(!activeParent)
{if(window.QualtricsCPTools)
QualtricsCPTools.velocimeter.stop();Qualtrics.Menu.velocityProcessor=null;return;}
var dir=activeSubMenu.forcedDirection||activeSubMenu.direction;if(dir=='right'&&velocity[0]<2||dir=='left'&&velocity[0]>-2)
{activeParent.traveling=false;}
else
{activeParent.traveling=true;}
if(!activeParent.traveling&&activeParent.hideSubMenuOnLowVelocity&&activeParent.menuUl)
{activeParent.hideSubMenu();}
else if(activeParent.suppressedSubMenu&&!activeParent.traveling)
{activeParent.getSubMenuShowClosure(activeParent.suppressedSubMenu.menu,activeParent.suppressedSubMenu.button,activeParent.suppressedSubMenu.options)();}},processOptions:function(options)
{options=options||{};if(typeof options=='string')
{try{options=options.evalJSON();}catch(e){console.error(e);}}
return options;},documentDownHandler:function(evt)
{if(!Qualtrics.Menu.documentObserver)
{return;}
var posX=evt.pageX;var posY=evt.pageY;if(evt.touches&&evt.touches[0]&&evt.touches[0].pageX&&evt.touches[0].pageY)
{posX=evt.touches[0].pageX;posY=evt.touches[0].pageY;}
window.mousePos=[posX,posY];if(Qualtrics.Menu.menuPaneStack.length)
{var clickedEl=Event.element(evt);var clickedMenu=clickedEl&&$(clickedEl).up&&$(clickedEl).up('#QMenu');if(clickedEl&&clickedEl.id=='QMenu')
{clickedMenu=clickedEl;}
if(!clickedMenu)
{Qualtrics.Menu.destroyAllMenus();clearOverRegistry();return;}
var menuClicked=null,menusToClose=[],menus=Qualtrics.Menu.menuPaneStack;var isFixed=false;for(var i=0,ilen=menus.length;i<ilen;++i)
{var menuPane=menus[i];menuPane.options.fixed=isFixed=!!(isFixed||menuPane.options.fixed||(menuPane.menuDef||{}).fixed);}
for(i=menus.length;i--;)
{var menuPane=menus[i],menu=menuPane.menuDom;if(!!menu&&menu==clickedMenu)
{menuClicked=menuPane;break;}
else if(menuPane.menuUl&&Event.element(evt)==menuPane.menuUl.openedByNode)
{menusToClose.push(menuPane);}
else if(Event.isLeftClick(evt))
{if(menuPane.skipNextClose)
menuPane.skipNextClose=false;else
menusToClose.push(menuPane);}}
if(menusToClose.length)
{for(var i=0,len=menusToClose.length;i<len;++i)
{if(menusToClose[i].options.menuWithinMenu&&menusToClose[i]!=menuClicked.parentMenu)
{menusToClose[i].destroy(true);}}
clearOverRegistry();}}},destroyAllMenus:function()
{var menus=Qualtrics.Menu.menuPaneStack;for(var i=menus.length;i--;)
{if(menus[i])
menus[i].destroy(true);}},unsuspendMenu:function(menuId)
{var menuPane=Qualtrics.MenuPane.getInstance(menuId);if(menuPane){menuPane.setSuspend(false);}},destroyMenu:function(menuId)
{var menuPane=Qualtrics.MenuPane.getInstance(menuId);if(menuPane){menuPane.destroy(true);}},deactivateArrowMode:function()
{for(var i=Qualtrics.Menu.menuPaneStack.length-1;i>-1;--i)
{Qualtrics.Menu.menuPaneStack[i].deactivateArrowMode();}},handleKeyDown:function(evt,opt_allowOnInputs)
{var el=Event.element(evt);{if(el.nodeName=='INPUT'&&!opt_allowOnInputs)
{return;}}
var keyActions={40:'down',38:'up',39:'right',37:'left',13:'enter',27:'escape',8:'escape',46:'escape'};if(Qualtrics.Menu.getActiveMenuPane()&&keyActions[evt.keyCode])
Qualtrics.Menu[keyActions[evt.keyCode]](evt);},down:function(evt)
{if(evt)
{Event.stop(evt);}
var menuPane=Qualtrics.Menu.getActiveMenuPane();var item=menuPane.getActiveMenuItem();var noneWereSelected=false;if(!item)
{if(Qualtrics.Menu.getActiveMenuPane().menuUl)
{noneWereSelected=true;item=Qualtrics.Menu.getActiveMenuPane().menuUl.firstChild;}}
if(item&&(noneWereSelected||item.nextSibling))
{var current;if(noneWereSelected)
current=item;else
current=item.nextSibling;var nextVisibleSibling=current;while(!current.visible()&&(current.nextSibling))
{if($(current.nextSibling).hasClassName('Separator')&&current.nextSibling.nextSibling)
{current=current.nextSibling.nextSibling;}
else
{current=current.nextSibling;}
nextVisibleSibling=current;}
if(nextVisibleSibling.visible())
menuPane.selectItem(nextVisibleSibling);}},up:function(evt)
{if(evt)
{Event.stop(evt);}
var menuPane=Qualtrics.Menu.getActiveMenuPane();var item=menuPane.getActiveMenuItem();var noneWereSelected=false;if(!item)
{var noneWereSelected=true;if(Qualtrics.Menu.getActiveMenuPane().menuUl)
{menuPane.selectItem(Qualtrics.Menu.getActiveMenuPane().menuUl.lastChild);}}
if(noneWereSelected||!item.previousSibling)
{menuPane.focusSearch();}
else
{var current;if(noneWereSelected)
current=item;else
current=item.previousSibling;var prevVisibleSibling=current;while(!current.visible()&&(current.previousSibling))
{if($(current.previousSibling).hasClassName('Separator')&&current.previousSibling.previousSibling)
{current=current.previousSibling.previousSibling;}
else
{current=current.previousSibling;}
prevVisibleSibling=current;}
if(prevVisibleSibling.visible())
menuPane.selectItem(prevVisibleSibling);else
menuPane.focusSearch();}},right:function(evt)
{var menuPane=Qualtrics.Menu.getActiveMenuPane();var item=menuPane.getActiveMenuItem();if(item)
{var link=$(item).down&&$(item).down();if(item&&item.hasSubMenu)
{if(link.getAttribute('submenu'))
{menuPane.getDynamicSubMenuClosure(link.getAttribute('submenu'),link)();if(evt)
{Event.stop(evt);}}}
else
{}}},left:function(evt)
{var menuPane=Qualtrics.Menu.getActiveMenuPane();if(menuPane.parentMenu)
{var parentLink=menuPane.parentButton;menuPane.destroy();if(parentLink&&parentLink.parentNode.tagName=='LI')
{menuPane.selectItem.bind(menuPane,parentLink.parentNode).delay(1);}
if(evt)
{Event.stop(evt);}}
else
{}},enter:function(evt)
{var menuPane=Qualtrics.Menu.getActiveMenuPane();var item=menuPane.getActiveMenuItem();menuPane.flashSelectionAndDestroyMenu();menuPane.artificiallyExecuteMenuItem(item);},escape:function(evt)
{var menuPane=Qualtrics.Menu.getActiveMenuPane();if(menuPane.parentButton.focus)
menuPane.parentButton.focus();if(menuPane.options.escapeCallback)
Qualtrics.Event.execute(menuPane.options.escapeCallback);menuPane.destroy(true);},drawOutline:function()
{var parentNode=$('pageDiv')||document.body;if(!Qualtrics.Menu.outlineContainer)
{Qualtrics.Menu.outlineContainer=QBuilder('div',{className:'MenuOutlineContainer'});}
if(!Qualtrics.Menu.outlineContainer.parentNode)
{parentNode.appendChild(Qualtrics.Menu.outlineContainer);}
Qualtrics.Menu.outlineContainer.innerHTML='';for(var i=0,len=Qualtrics.Menu.menuPaneStack.length;i<len;++i)
{var m=Qualtrics.Menu.menuPaneStack[i];var bg=QBuilder('div',{className:'MenuOutline'});m.menuOutlineDom=bg;Qualtrics.Menu.outlineContainer.appendChild(bg);m.positionOutline();}},getAjaxData:function(url,ajaxDef,opt_delay,source,allowAbort)
{ajaxDef=ajaxDef||{};if(Qualtrics.Menu.activeAjaxRequest&&allowAbort)
{Qualtrics.Menu.activeAjaxRequest.abort();}
if(Qualtrics.Menu.activeAjaxTimer)
{clearTimeout(Qualtrics.Menu.activeAjaxTimer);}
var executeAjax=function(){Qualtrics.Menu.activeAjaxTimer=null;Qualtrics.Menu.activeAjaxRequest=new Ajax.CachedRequest(url,{source:source,parameters:ajaxDef.parameters,onComplete:function(transport){if(ajaxDef.onComplete)
{ajaxDef.onComplete(transport);}
Qualtrics.Menu.activeAjaxRequest=null;},onFailure:function(transport)
{console.error('ajax fail');}});};if(opt_delay)
{Qualtrics.Menu.activeAjaxTimer=setTimeout(executeAjax,opt_delay);}
else
{executeAjax();}},getMultiAjaxData:function(requests,ajaxDef,opt_delay,allowAbort)
{ajaxDef=ajaxDef||{};if(Qualtrics.Menu.activeAjaxRequest&&Qualtrics.Menu.activeAjaxRequest.abort&&allowAbort)
{Qualtrics.Menu.activeAjaxRequest.abort();}
if(Qualtrics.Menu.activeAjaxTimer)
{clearTimeout(Qualtrics.Menu.activeAjaxTimer);}
var executeAjax=function(){Qualtrics.Menu.activeAjaxTimer=null;Qualtrics.Menu.activeAjaxRequest=new Ajax.MultipleCachedRequest(requests,{onComplete:function(transport){if(ajaxDef.onComplete)
{ajaxDef.onComplete(transport);}
Qualtrics.Menu.activeAjaxRequest=null;},abort:function()
{}});};if(opt_delay)
{Qualtrics.Menu.activeAjaxTimer=setTimeout(executeAjax,opt_delay);}
else
{executeAjax();}},keepMenuOpen:function()
{if(Qualtrics.Menu.menuCloseTimer)
{clearTimeout(Qualtrics.Menu.menuCloseTimer);}},toggleCheck:function(li,options)
{if(li){if(options&&options.selectOne){if(li.getAttribute('menugroup'))
{options.group=li.getAttribute('menugroup');}
Qualtrics.Menu.uncheckAll(li.parentNode,options);$(li).addClassName('check');}else{if($(li).hasClassName('check')){$(li).removeClassName('check');}else{$(li).addClassName('check');}}}},toggleCheckByEvent:function(evt,options)
{if(evt)
{evt.cancelBubble=true;var li=(Event.findElement(evt,'li'));Qualtrics.Menu.toggleCheck(li,options);}},nodeHasGroup:function(node,groups)
{for(var i=0,len=groups.length;i<len;++i)
{var valid=false;if(node.getAttribute('menugroup')==groups[i])
{return true;}}
return false;},uncheckAll:function(ul,options)
{if(ul){var childs=$(ul).immediateDescendants();for(var i=0,len=childs.length;i<len;++i){var li=childs[i];if(options&&options.group)
{if(li.getAttribute('menugroup')!=options.group)
{continue;}}
if(options&&options.groups)
{if(!Qualtrics.Menu.nodeHasGroup(li,options.groups))
{continue;}}
$(li).removeClassName('check');}
childs=null;}},positionMenus:function(opt_updateButtonInfo)
{for(var i=0,len=Qualtrics.Menu.menuPaneStack.length;i<len;++i)
{var menuPane=Qualtrics.Menu.menuPaneStack[i];if(!menuPane.options.mousePosition)
{menuPane.positionMenu(null,opt_updateButtonInfo);}}},hideMenuOnMouseOut:function()
{var menu=$('QMenu');if(menu)
{$(menu).setStyle({opacity:0.85});menu.onmouseout=Qualtrics.Menu.beginHideMenuSequence;menu.onmouseover=Qualtrics.Menu.cancelHideMenuSequence;}},beginHideMenuSequence:function()
{var menu=$('QMenu');if(menu)
{Qualtrics.Menu.fadeEffect=setTimeout(Qualtrics.Menu.destroyAllMenus,500);}},cancelHideMenuSequence:function()
{if(Qualtrics.Menu.fadeEffect)
{clearTimeout(Qualtrics.Menu.fadeEffect);}},refreshMenu:function(i)
{var a=i&&Qualtrics.Menu.menuPaneStack[i]||Qualtrics.Menu.getActiveMenuPane();if(a)
{a.refreshMenu();}},refreshAllMenus:function()
{for(var i=Qualtrics.Menu.menuPaneStack.length-1;i>-1;--i)
{Qualtrics.Menu.menuPaneStack[i].refreshMenu();}},openMenuHelper:function(evt)
{if(Qualtrics.Menu.menuPaneStack.length)
{Qualtrics.Menu.skipNextOpen=Qualtrics.Menu.menuPaneStack[0].menuBuilder;}}};Qualtrics.MenuPane=Class.create();Qualtrics.MenuPane.getInstance=QualtricsTools.getInstanceHelper(Qualtrics.Menu.menuPaneStack,'id');Qualtrics.MenuPane.getInstanceByName=QualtricsTools.getInstanceHelper(Qualtrics.Menu.menuPaneStack,'menuPaneName');Qualtrics.MenuPane.prototype={type:'MenuPane',destroyed:false,direction:null,alignment:null,parentMenu:null,parentButton:null,arrowSelectedItem:null,closeSubMenuOnMouseOut:false,onClose:null,fieldName:null,needsMouseOverEventObserver:null,paginate:false,perpage:null,startIndex:0,searchTerm:null,startMousePos:null,menuPaneName:null,suspend:false,initialize:function(menuBuilder,parentButton,opt_parentMenu,options,opt_evt)
{if(typeof options=='string')
{options=options.evalJSON();}
this.id=QualtricsTools.createNewId('MP');options=this.options=options||{};this.menuBuilder=menuBuilder;this.parentMenu=opt_parentMenu;this.parentButton=parentButton;this.buttonInfo={};if(this.parentButton)
{this.getButtonInfo();if(this.parentButton.getAttribute('currentvalue')!==undefined)
{this.currentValue=this.parentButton.getAttribute('currentvalue');if(this.currentValue==='null')
{this.currentValue=null;}}}
if(options.initialValue&&!this.currentValue)
{this.currentValue=options.initialValue;}
this.startMousePos=[window.mousePos[0],window.mousePos[1]];if(this.options.fieldName)
{this.fieldName=this.options.fieldName;}
if(!this.parentMenu&&!this.options.menuWithinMenu&&!this.options.allowMultipleMenus&&!options.headless)
{Qualtrics.Menu.destroyAllMenus();}
if(this.options.menuWithinMenu)
{this.skipNextClose=true;}
Qualtrics.Menu.menuPaneStack.push(this);if(!options.headless&&(this.options.asynchronous))
{this.constructAsynchronousMenu(menuBuilder,this.options,opt_evt);}
else
{this.constructMenu(menuBuilder,this.options,opt_evt);}
this.direction=this.options.direction||this.getAutoDirection();this.alignment=this.options.alignment||this.getAutoAlignment();if(!options.headless)
{this.insertMenu();if(this.needsMouseOverEventObserver)
{Event.observe(this.menuDom,'mouseover',this.distributeMouseOvers.bind(this));}
if(this.options.onMenuOpen)
{Qualtrics.Event.executeDotSyntax(options.onMenuOpen,null,null,null,{'$menuPane':this,'$menuPaneId':this.id});}
if(this.menuDef&&this.menuDef.onMenuOpen)
{Qualtrics.Event.executeDotSyntax(this.menuDef.onMenuOpen,null,null,null,{'$menuPane':this,'$menuPaneId':this.id});}}},distributeMouseOvers:function(evt)
{evt=evt||window.event;Qualtrics.Event.baseDistributerReader(evt,Event.element(evt),'menupanemouseover',this.mouseOverObject||this);},insertMenu:function()
{if(this.menuDom)
{var parentNode=this.options.parentNode||$('pageDiv')||document.body;if(this.options.relative)
{$(this.parentButton).setStyle({position:'relative'});parentNode=this.parentButton;}
if(parentNode!==this.menuDom.parentNode)
{parentNode.appendChild(this.menuDom);}
this.setupSubMenus();this.positionMenu();if(this.searchInputDom)
{QualtricsTools.focusInput(this.searchInputDom,0);}
this.setupRemoveObserver.bind(this).defer();}},setupRemoveObserver:function()
{if(!Qualtrics.Menu.documentObserver&&!Qualtrics.Menu.overlayObj)
{if(this.options.useOverlay)
{Qualtrics.Menu.overlayObj=new Q_Overlay({parentId:'pageDiv',zindex:1999997,opacity:0,dontManageOverlays:true,onClick:function(){Qualtrics.Menu.overlayObj.remove();},onClose:function(){Qualtrics.Menu.destroyAllMenus.defer();clearOverRegistry();}});}
else
{Qualtrics.Menu.documentObserver=Event.observe(document,'mousedown',Qualtrics.Menu.documentDownHandler);Qualtrics.Menu.documentTouchObserver=Event.observe(document,'touchstart',Qualtrics.Menu.documentDownHandler);}}},constructAsynchronousMenu:function(menuBuilder,opt_options,opt_evt)
{this.menuDom=QBuilder('div',{className:'RoundedShadow',id:'QMenu'},[QBuilder('ul',{className:'Loading'},[QBuilder('li',{className:'Loading'})])]);if(Qualtrics.Menu.asyncMenuTimout)
{clearTimeout(Qualtrics.Menu.asyncMenuTimout);Qualtrics.Menu.asyncMenuTimout=null;}
Qualtrics.Menu.asyncMenuTimout=this.showAsynchronousMenu.bind(this).delay(0.2);return this.menuDom;},showAsynchronousMenu:function(menuBuilder,opt_options,opt_evt)
{this.replaceMenuDefinition(menuBuilder);},constructMenu:function(menuBuilder,opt_options,opt_evt)
{var menu=this.buildMenu((menuBuilder||this.menuBuilder),opt_options,opt_evt);if(menu)
{if(this.parentButton)
{$(this.parentButton).addClassName('ActiveSubMenu');}
if(this.parentMenu)
{this.menuDom=menu;this.addClassNames();$(this.parentMenu.menuUl).addClassName('HasActiveSubMenu');}
else
{var className='';if(this.options.className)
{className=this.options.className;}
if(this.menuDef&&this.menuDef.className)
{className+=' '+this.menuDef.className;}
if(this.options.outline)
{className+=' DarkShadow';}
else
{className+=' RoundedShadow';}
if(menu.id=='QMenu'&&menu.firstChild)
menu=menu.firstChild;this.menuDom=QBuilder('div',{className:className,id:'QMenu'},[menu]);}
if(this.options.relative)
{$(this.parentButton).setStyle({zIndex:$(this.menuDom).getStyle('zIndex')||2000000});$(this.menuDom).addClassName('RelativelyPositioned');}
if(!this.menuUl)
{if(this.menuDom.tagName=='UL')
{this.menuUl=this.menuDom;}
else
{this.menuUl=$(this.menuDom).down('ul');}}}
return this.menuDom;},getButtonInfo:function(opt_update)
{if(opt_update||!this.buttonInfo||!this.buttonInfo.height||!this.buttonInfo.width||!this.buttonInfo.top||!this.buttonInfo.left)
{if(this.parentButton&&this.parentButton.offsetHeight!=undefined&&this.parentButton.offsetWidth!=undefined)
{this.buttonInfo=Object.extend({height:this.parentButton.offsetHeight,width:this.parentButton.offsetWidth},this.getButtonPos());}}
return this.buttonInfo;},refreshMenu:function(opt_clearCache)
{if(opt_clearCache)
{Ajax.CachedRequest.clearCache();}
this.replaceMenuDefinition(this.menuBuilder);},addClassNames:function()
{if(this.parentMenu)
{$(this.menuDom).addClassName('QSubMenu');}
if(this.options.className)
{$(this.menuDom).addClassName(this.options.className);}
if(this.options.outline)
{$(this.menuDom).addClassName('DarkShadow');}
else
{$(this.menuDom).addClassName('RoundedShadow');}},getRootMenu:function()
{var root=this;while(root.parentMenu)
{root=root.parentMenu;}
return root;},getAppropriateOffset:function()
{return this.options.relative?Position.cumulativeOffset(this.menuDom):{left:this.menuDom.offsetLeft,top:this.menuDom.offsetTop};},getCumulativeOffset:function()
{var offset=this.getAppropriateOffset();var root=this;while(root.parentMenu)
{root=root.parentMenu;var border=root.getBorderWidth();var currentOffset=root.getAppropriateOffset();offset.left+=currentOffset.left+border;offset.top+=currentOffset.top+border;if(Qualtrics.Browser.IE)
{offset.left-=1;offset.top-=1;}}
return offset;},getBorderWidth:function()
{if(window.getComputedStyle){var border=getComputedStyle(this.menuDom,'').getPropertyValue('border-top-width');}else{var border=this.menuDom.currentStyle.borderWidth;}
return Number(border.substring(0,border.length-2));},getStackIndex:function()
{return Qualtrics.Menu.menuPaneStack.indexOf(this);},buildMenu:function(menuBuilder,opt_options,opt_evt)
{if(typeof menuBuilder=='string')
{if(menuBuilder.startsWith('{'))
{this.menuDom=this.evaluateMenuDefinition(menuBuilder,opt_options);}
else if(menuBuilder.endsWith(')')&&(menuBuilder.indexOf("'")!=-1||menuBuilder.indexOf('"')!=-1))
{console.warn('buildMenu had to resort to eval, try to avoid this');this.menuDom=this.buildMenu(eval(menuBuilder),opt_options);}
else if(menuBuilder.indexOf('.')!=-1)
{var paramIndex=1;var params=null;while(paramIndex!==null)
{var param=this.options['p'+paramIndex];if(param!==undefined)
{if(!params)params=[];params.push(param);paramIndex++;}
else
{paramIndex=null;}}
var ctrlKeyPressed=false;var altKeyPressed=false;if(opt_evt)
{ctrlKeyPressed=opt_evt.metaKey||opt_evt.ctrlKey;altKeyPressed=opt_evt.altKey;}
this.menuDom=this.buildMenu(Qualtrics.Event.executeDotSyntax(menuBuilder,this.options.instanceid,null,params,{'$options':this.options,'$el':this.parentButton,'$evt':opt_evt,'$parentMenu':this.parentMenu,'$menuPane':this,'$menuPaneId':this.id,'$ctrlKey':ctrlKeyPressed,'$altKey':altKeyPressed}),opt_options);}
else
{console.warn('legacy menu');if($(menuBuilder))
{var ul=$(menuBuilder);if(!Qualtrics.Menu.prebuiltMenuCache)
{Qualtrics.Menu.prebuiltMenuCache={};}
Qualtrics.Menu.prebuiltMenuCache[menuBuilder]=ul;this.menuDom=ul;}
else if(Qualtrics.Menu.prebuiltMenuCache&&Qualtrics.Menu.prebuiltMenuCache[menuBuilder])
{this.menuDom=Qualtrics.Menu.prebuiltMenuCache[menuBuilder];}}}
else if(typeof menuBuilder=='function')
{if(this.options.scope)
{this.menuDom=this.buildMenu(menuBuilder.call(this.options.scope,this.options.p1,this.options.p2),opt_options);}
else
{this.menuDom=this.buildMenu(menuBuilder(),opt_options);}}
else if(typeof menuBuilder=='object')
{if(!menuBuilder.tagName)
{this.menuDom=this.evaluateMenuDefinition(menuBuilder,opt_options);}
else
{this.menuDom=menuBuilder;}}
if(this.menuDom)
{this.observeMenuUp(this.menuDom);}
return this.menuDom;},getCheckedItems:function()
{var menuDef=this.menuDef;var liNodes=this.menuUl.childNodes;var checkedItems=[];for(var i=0,len=liNodes.length;i<len;++i)
{var li=liNodes[i];var link=li.firstChild;if(link&&link.getAttribute)
{var itemIndex=link.getAttribute('itemindex');if($(li).hasClassName('check'))
{var itemCopy=Object.toJSON(menuDef.items[itemIndex]).evalJSON();itemCopy.index=itemIndex;checkedItems.push(itemCopy);}}}
return checkedItems;},createMenuDefFromFlatObject:function(obj)
{var items=[];for(var key in obj)
{items.push({display:obj[key],value:key});}
return{items:items};},onSuperMenuSelect:function(value,itemDef,opt_key)
{if(!this.superMenuInfo)
{this.superMenuInfo={};}
this.superMenuInfo.value=value;this.superMenuInfo.selectedItem=itemDef;if(opt_key)
{this.superMenuInfo.key=opt_key;}
this.refreshMenu(true);},evaluateMenuDefinition:function(def,options)
{def=def||{};options=options||{};if(typeof def=='string')
{if(!def.startsWith('{'))
{return this.evaluateMenuDefinition(Qualtrics.Event.executeDotSyntax(def.callback));}
try{def=def.evalJSON();}catch(e)
{console.error('Could not evaluate JSON of Menu Def; setting to empty.');def={};}}
if(def.menuPaneName)
{this.menuPaneName=def.menuPaneName;}
if(def.ajax)
{return this.evaluateAjaxMenu(def);}
if(def.multiAjax)
{return this.evaluateMultipleAjaxMenu(def);}
this.menuDef=def;this.originalItemCount=0;if(def.items)
{this.originalItemCount=def.items.length;}
if(this.options.processDefinition)
{def=this.options.processDefinition(def,this.options);}
if(Object.values(def).length)
{var menuAttributes={};if(def.keepmenuopen)
{this.options.keepmenuopen=def.keepmenuopen;}
if(def.addMouseOverObserver)
{this.needsMouseOverEventObserver=true;}
if(def.menuClass)
{menuAttributes.className=def.menuClass;}
if(this.options.menuClass)
{menuAttributes.className=this.options.menuClass;}
if(def.className)
{menuAttributes.className=def.className;}
if(def.id)
{menuAttributes.id=def.id;}
this.menuUl=QBuilder('ul',{className:'QMenuList'});if(def.width)
{this.menuUl.style.width=def.width+'px';}
if(def.className)
{this.menuUl.className=def.className;}
var header=document.createDocumentFragment();if(def.superMenu)
{var superMenuDisplay=def.superMenu.display||'';if(this.superMenuInfo&&this.superMenuInfo.selectedItem&&this.superMenuInfo.selectedItem.display)
{superMenuDisplay=this.superMenuInfo.selectedItem.display;}
header.appendChild(QBuilder('div',{className:'SuperMenuContainer'},[QBuilder('div',{className:'SuperMenuPositioner'},[Qualtrics.Menu.buildMenuButton(superMenuDisplay,def.superMenu.menu,{selectMenu:true,menuWithinMenu:true,menuItemSelectCallback:'Qualtrics.MenuPane.onSuperMenuSelect:'+this.id+'($value, $item, '+def.superMenu.key+')'}),QBuilder('div',{className:'BottomHighlight'}),QBuilder('div',{className:'clear'})])]));}
if(def.title)
{this.headerDom=this.buildHeader(QBuilder('h2',{},[def.title]));}
if(def.header)
{this.headerDom=this.buildHeader(def.header);}
if(this.headerDom)
{header.appendChild(this.headerDom);}
if(def.search)
{var autoClear=getMessage('SiteWide','Search')+'...';if(def.searchText&&this.searchTerm!=def.searchText)
autoClear=def.searchText;var searchInput=QBuilder('input',{type:'text',className:'TextBox AutoClearMessage',keyupcallback:'Qualtrics.MenuPane.search:'+this.id+'($val, $el, $evt)',autoclear:autoClear,value:this.searchTerm||autoClear});this.searchInputDom=searchInput;var searchDom=QBuilder('div',{className:'MenuSearch'},[QBuilder('div',{},[QBuilder('span',{className:'Icon'}),this.searchInputDom])]);header.appendChild(searchDom);Event.observe(this.searchInputDom,'keydown',function(evt){try
{if(evt){if(evt.keyCode==Event.KEY_ESC)
{if(searchInput.value=='')
{searchInput.addClassName('AutoClearMessage');searchInput.value=autoClear;}
Qualtrics.Menu.escape();}
else if(evt.keyCode==Event.KEY_DOWN)
{Event.stop(evt);searchInput.blur();Qualtrics.Menu.down();}
else if(evt.keyCode==Event.KEY_RETURN)
{Event.stop(evt);searchInput.blur();Qualtrics.Menu.enter();}}}
catch(e)
{console.error(e);}});}
if(Qualtrics.Browser.IE&&Qualtrics.Browser.Version<8)
{if(this.searchInputDom)
{$(this.searchInputDom).setStyle({width:'200px'});}}
this.menuDom=QBuilder('div',menuAttributes,[QBuilder('div',{className:'OverflowWrapper'},[header,this.menuUl])]);if(def.domNode)
{var domNode=Qualtrics.Event.executeDotSyntax(def.domNode);if(domNode)
this.menuDom=domNode;if(def.width)
{this.menuDom.style.width=def.width+'px';}}
if(def.height)
{this.options.height=def.height;}
if(def.items)
{this.addMenuItems(def.items,options);}
if(def.loading)
{this.menuUl.appendChild(QBuilder('li',{className:'Loading'}));}
else if(this.paginate)
{this.menuDom.appendChild(this.buildPagination(def.count));}
if(def.string)
{this.menuUl.appendChild(QBuilder('li',null,[QBuilder('a',{className:'MenuItemLink'},def.string)]));}
this.observeMenuUp(this.menuDom);}
this.menuIsEvaluated();if(this.options.connector)
{this.menuDom.appendChild(QBuilder('div',{className:'MenuConnector'},[QBuilder('div',{className:'A'}),QBuilder('div',{className:'B'})]));}
return this.menuDom;},buildPagination:function(count)
{var prev='',next='';if(this.startIndex>0)
prev=QBuilder('a',{className:'Pagination left',clickcallback:'Qualtrics.MenuPane.prevPage:'+this.id},getMessage('SiteWide','PaginatePrevious'));if(this.startIndex+this.perpage<count)
{next=QBuilder('a',{className:'Pagination right',clickcallback:'Qualtrics.MenuPane.nextPage:'+this.id},getMessage('SiteWide','PaginateNext'));}
return QBuilder('div',{className:'Pagination'},[prev,next,QBuilder('div',{className:'clear'})]);},buildHeader:function(content)
{var domNode;if(typeof content=='string')
{var parsedExpression=content.replace('$menuPaneId',this.id);domNode=Qualtrics.Event.executeDotSyntax(parsedExpression,null,null,null,null,null,true)||content;}
else
{domNode=content;}
return QBuilder('div',{className:'Header MenuHeader'},[domNode]);},updateHeader:function(content)
{deleteChildren(this.headerDom);if(typeof content=='string')
{this.headerDom.innerHTML=content;}
else
{this.headerDom.appendChild(content);}},menuIsEvaluated:function()
{if(this.onShowMenu)
{this.onShowMenu(this.options);}},evaluateAjaxMenu:function(def)
{if(!def.ajax)
{return false;}
var delay=def.delay||false;if(this.parentMenu)
{delay=200;}
if(!def.ajax.parameters)
{def.ajax.parameters={};}
var action=def.ajax.action;var url=def.ajax.url;if(url&&url.startsWith&&url.startsWith('http'))
{action='WebService';def.ajax.parameters.url=def.ajax.url;url='CleanAjax.php?action='+action;}
else if(action)
{url='Ajax.php?action='+action;}
if(def.paginate&&!this.paginate)
{this.paginate=true;this.perpage=def.perpage;}
if(this.paginate)
{def.ajax.parameters.start=this.startIndex;def.ajax.parameters.perpage=this.perpage;}
if(!this.searchTerm)
var loadingDom=this.evaluateMenuDefinition({loading:true,fixed:def.ajax.fixed,className:def.className});else
{def.ajax.parameters.Search=this.searchTerm.toLowerCase();}
var source=undefined;if(def.ajax.parameters&&def.ajax.parameters.PageItemID)
{source=def.ajax.action+def.ajax.parameters.PageItemID;}
var params=def.ajax.parameters||{};if(this.superMenuInfo)
{var superMenuKey=this.superMenuInfo.key||'superMenuValue';params[superMenuKey]=this.superMenuInfo.value;}
var allowAbort=true;if(this.options.allowAbort===false)
{allowAbort=false;}
Qualtrics.Menu.getAjaxData(url,{parameters:params,onComplete:this.getAjaxComplete(loadingDom,def.ajax)},delay,source,allowAbort);if(loadingDom)
return loadingDom;else
return this.menuDom;},evaluateMultipleAjaxMenu:function(def)
{if(!def.multiAjax)
{return false;}
var delay=def.delay||false;if(this.parentMenu)
{delay=200;}
var loadingDom=this.evaluateMenuDefinition({loading:true});var allowAbort=true;if(this.options.allowAbort===false)
{allowAbort=false;}
Qualtrics.Menu.getMultiAjaxData(def.multiAjax.requests,{onComplete:this.getMultiAjaxComplete(loadingDom,def.multiAjax)},delay,allowAbort);return loadingDom;},addMenuItems:function(items,options)
{options=options||{};if(items.length)
{for(var i=0,len=items.length;i<len;++i)
{if(items[i])
this.addMenuItem(items[i],i);}}
else if(!this.menuDef||!this.menuDef.loading)
{var emptyString=options.empty||getMessage('SiteWide','NoResults');this.menuUl.appendChild(QBuilder('li',{className:'Empty Disabled'},[QBuilder('a',{className:'MenuItemLink'},[emptyString])]));}},addMenuItem:function(item,index)
{var link=null;var liParams={};if(item.domNode)
{var paramMap={'$options':this.options};if(!this.options.headless)
{var domNode=Qualtrics.Event.executeDotSyntax(item.domNode,null,null,null,paramMap);if(item.disabled)
liParams.className='Disabled';if(domNode)
{link=domNode;if(item.action)
{domNode.setAttribute('mouseupcallback',this.getItemCallback(item,index));}
if(item.downcallback)
{domNode.setAttribute('downcallback',item.downcallback);}
else
{domNode.setAttribute('downcallback','Event.stop($evt)');}
if(item.bubbleup)
{var descendants=$(domNode).descendants();for(var i=0,len=descendants.length;i<len;++i)
{descendants[i].setAttribute('bubbleup',true);}}}
if(item.onmouseover)
{link.setAttribute('menupanemouseover',item.onmouseover);this.needsMouseOverEventObserver=true;if(item.mouseOverObject)
this.mouseOverObject=item.mouseOverObject;}
if(item.keepmenuopen)
{liParams['keepmenuopen']=true;}}}
if(item.type=='TextInput')
{link=this.addTextInputItem(item);}
if(!link)
{var icon=this.getItemIcon(item);var display=this.getItemDisplay(item);var value=this.getItemValue(item);var className=this.getItemClass(item);var parameters=this.getItemParameters(item,index);if(item.separator)
{link=display;}
if(!link)
{var tag='',rightTag='';if(item.tag)
{tag=QBuilder('span',{className:'Tag'},[item.tag]);}
if(item.rightTag)
{rightTag=QBuilder('span',{className:'RightTag'},[String(item.rightTag)]);}
if(item.htmlContent)
{link=QBuilder('a',parameters,[icon,tag]);link.innerHTML=link.innerHTML+item.htmlContent;if(rightTag)
{link.appendChild(rightTag);}}
else
{var elements=[icon,tag];if(Object.isArray(display))
elements=elements.concat(display);else
elements.push(display);if(rightTag)
{elements.push(rightTag);}
if(item.rightTagDom)
{var rightTagDom=item.rightTagDom;if(rightTagDom)
{elements.push(Qualtrics.Event.executeDotSyntax(rightTagDom,null,null,null,paramMap));}}
link=QBuilder('a',parameters,elements);}}
if(item.blockContent)
{link=QBuilder('div',parameters,[icon]);$(link).addClassName('BlockMenuItem');}
if(className){liParams.className=className;}
if(item.id)
{liParams.id=item.id;}
if(item.group)
{liParams['menugroup']=item.group;}
if(item.keepmenuopen)
{liParams['keepmenuopen']=true;}
if(item.onmouseover)
{link.setAttribute('menupanemouseover',item.onmouseover);this.needsMouseOverEventObserver=true;if(item.mouseOverObject)
this.mouseOverObject=item.mouseOverObject;}
if(link&&link.setAttribute)
{if(item.downcallback)
{link.setAttribute('downcallback',item.downcallback);}
else
{link.setAttribute('downcallback','Event.stop($evt)');}}
if(item.submenu&&!item.disabled)
{var subMenuDef=item.submenu;if(typeof subMenuDef=='object')
{subMenuDef=Object.toJSON(subMenuDef);}
link.setAttribute('submenu',subMenuDef);}}
this.menuUl.appendChild(QBuilder('li',liParams,[link]));},addTextInputItem:function(item)
{var input=QBuilder('input',{type:'text',className:'TextBox'});var label='';if(item.action)
{input.setAttribute('keyentercallback','Qualtrics.Menu.destroyAllMenus; '+item.action);if(item.realTime)
{input.setAttribute('keyupcallback',item.action);}}
if(item.validation)
{input.setAttribute('validation',item.validation);}
if(item.display)
{input.setAttribute('autoclear',item.display);$(input).addClassName('AutoClearMessage');input.value=item.display;}
if(item.label)
{label=QBuilder('label',{},item.label);}
if(item.value!=undefined)
{input.value=item.value;}
if(item.focus)
{QualtricsTools.focusInput.curry(input).defer();}
return QBuilder('div',{className:'MenuInputContainer'},[label,input]);},updateMenuUl:function(def)
{deleteChildren(this.menuUl);if(def.ajax)
{return this.evaluateAjaxMenu(def);}
this.addMenuItems(def.items);},getMenuItemById:function(itemId)
{for(var i=0;i<this.menuDef.items.length;i++)
{if(this.menuDef.items[i].id==itemId)
return this.menuDef.items[i];}},getMenuItemPath:function(opt_idOnly)
{var id;var parent=this;var path=[];if(this.selectionNode)
{if(opt_idOnly)
path.push(this.selectionNode.id);else
path.push(this.getMenuItemById(this.selectionNode.id));}
while(parent!=null)
{if(parent.parentButton&&parent.parentMenu)
{if(opt_idOnly)
path.push(parent.parentButton.id);else
path.push(parent.parentMenu.getMenuItemById(parent.parentButton.id));}
parent=parent.parentMenu;}
return path.reverse();},getItemClass:function(item)
{var checked=item.checked;if(this.options.selectMenu)
{if(this.currentValue===null||item.value===null)
{if(this.currentValue===item.value)
{checked=true;}}
else if(this.currentValue==item.value)
{checked=true;}}
if(this.options.showChecks===false)
{checked=false;}
var className=(item.className||'');if(item.separator)
{className+=' Separator';}
if(checked)
{className+=' check';}
if(item.disabled)
{className+=' Disabled';}
return className;},getItemParameters:function(item,index)
{if(item.params)
{item.parameters=item.params;}
var parameters={};if(!parameters.className)
{parameters.className='';}
parameters.className+=' MenuItemLink';var clickcallback=this.getItemCallback(item,index);if(clickcallback)
{parameters.mouseupcallback=clickcallback;parameters.touchendcallback=clickcallback;if(Qualtrics.Browser.IE6)
{parameters.href='javascript:void(0)';}}
if(item.parameters)
{Object.extend(parameters,item.parameters);}
if(item.defer)
{parameters.defer=item.defer;}
if(item.uncheckGroup)
{parameters.uncheckGroup=item.uncheckGroup;}
if(this.menuDef&&this.menuDef.togglecheck)
{parameters['togglecheck']='true';}
if(this.menuDef&&this.menuDef.togglecheckexclusive!=undefined||this.options.selectMenu)
{if(this.menuDef.togglecheckexclusive||this.options.selectMenu)
parameters['togglecheckexclusive']='true';else
parameters['togglecheckexclusive']='false';}
else if(item.checked!=undefined)
{parameters['togglecheck']='true';}
parameters['itemindex']=index;return parameters;},getItemCallback:function(item,index)
{var callback='';var value=this.getItemValue(item);if(item.action)
{callback=item.action;}
callback=callback.replace('$menuPaneId',this.id);callback=callback.replace('$value',value);return callback;},getItemIcon:function(item)
{if(item.icon!==false&&this.menuDef.icon!==false)
{if(typeof item.icon!='boolean'&&typeof item.icon!='undefined')
return QBuilder('span',{className:'icon '+item.icon});else
return QBuilder('span',{className:'icon'});}
else
{return'';}},getItemDisplay:function(item,opt_selectedDisplay)
{if(item.separator)
{return'-';}
var display=item.display;if(opt_selectedDisplay&&item.selectedDisplay)
{display=item.selectedDisplay;}
if(!item.display&&(item.display!=0||item.display!='0'))
{display=item.label;}
if(typeof display=='number')
display=String(display);if(this.processItemDisplay)
{display=this.processItemDisplay(display,item);}
if(this.options.itemDisplayProcessor&&item.display)
{display=Qualtrics.Event.executeDotSyntax(this.options.itemDisplayProcessor,null,null,null,{'$display':display});}
if(display===undefined||display===null)
{display='';}
var truncate=item.truncate||this.menuDef.truncate||this.options.truncate||false;if(truncate&&window.QualtricsCPTools&&display.stripTags)
{display=QualtricsCPTools.middleTruncate(display.stripTags(),truncate);}
return(!display)?'\xa0':display;},getItemValue:function(item)
{var value='';if(item.value);value=item.value;return value;},search:function(s,el,evt)
{if(evt&&evt.keyCode>36&&evt.keyCode<41||evt.keyCode==Event.KEY_RETURN)
{return;}
var sCopy=s;s=s.toLowerCase();if(this.searchTerm&&sCopy==this.searchTerm)
return;var cleared='';if(el.getAttribute('autoclear'))
{cleared=el.getAttribute('autoclear').toLowerCase();if(s==cleared)
{s=undefined;}}
this.hideSubMenu();var filtered=false;if(s&&this.menuDef.search&&this.menuDef.search!==true)
{if(typeof this.menuDef.search=='string'&&this.menuDef.search.startsWith('{"ajax'))
{var searchAjax=Qualtrics.parseJSON(this.menuDef.search);if(!searchAjax.ajax.parameters)
searchAjax.ajax.parameters={};searchAjax.ajax.parameters.Search=s;this.searchTerm=sCopy;this.startIndex=0;this.customFilteredMenu=true;this.evaluateAjaxMenu(searchAjax);}
else
{var filterDef=Qualtrics.Event.executeDotSyntax(this.menuDef.search,null,null,null,{'$search':s});if(filterDef.items)
{this.customFilteredMenu=true;this.replaceItemsWithNewDef(filterDef);}
filtered=true;}}
else
{this.searchTerm=null;if(this.customFilteredMenu)
{this.replaceItemsWithNewDef(this.menuDef);}
filtered=this.filterMenu(s,el,evt);}
this.positionMenu();this.positionOutline();if(filtered)
{Qualtrics.Menu.down();}},filterMenu:function(s,el,evt)
{if(this.menuUl)
{var children=$(this.menuUl).childElements();for(var i=0,len=children.length;i<len;++i)
{if(!children[i].firstChild)
continue;var text=children[i].firstChild.textContent||children[i].firstChild.innerText||'';text=text.toLowerCase();if(s&&s.length>0&&(children[i].hasClassName('Disabled')||text.indexOf(s)==-1))
{children[i].hide();}
else
{children[i].show();}}}},replaceItemsWithNewDef:function(menuDef)
{this.searchMenuDef=menuDef;Qualtrics.Menu.deactivateArrowMode();deleteChildren(this.menuUl);this.addMenuItems(menuDef.items);this.subMenuSetupComplete=false;this.setupSubMenus();var pagination=$(this.menuDom).down('.Pagination');if(pagination)
{$(pagination).remove();}
if(this.paginate&&menuDef.count>this.perpage)
{this.menuDom.appendChild(this.buildPagination(menuDef.count));}},getAjaxComplete:function(loadingDom,ajaxOptions)
{var that=this;ajaxOptions=ajaxOptions||{};return function(transport)
{try{if(that.searchTerm||(loadingDom&&loadingDom.offsetWidth)||that.options.onLoad)
{var response=transport.responseText;if(ajaxOptions.preparser)
{var params=[response];var paramMap={$response:response,$ajaxParams:transport.request.parameters,$menuDef:that.menuDef,$parentMenu:that.parentMenu};if(ajaxOptions.preparams)
{for(var param in ajaxOptions.preparams)
params.push(ajaxOptions.preparams[param]);}
response=Qualtrics.Event.executeDotSyntax(ajaxOptions.preparser,null,null,null,paramMap,params);}
if(ajaxOptions.postparser)
{var params=[response];var paramMap={$response:response,$ajaxParams:transport.request.parameters,$menuDef:that.menuDef,$parentMenu:that.parentMenu};response=Qualtrics.Event.executeDotSyntax(ajaxOptions.postparser,null,null,null,paramMap,params);}
if(that.searchTerm)
{that.replaceItemsWithNewDef(response);}
else
{if(that.options.onLoad)
{that.evaluateMenuDefinition(response);Qualtrics.Event.executeDotSyntax(that.options.onLoad,null,null,null,{'$menuDef':that.menuDef,'$menuPane':that});}
else
{that.replaceMenuDefinition(response);}}}}catch(e)
{console.error('cant parse menu def: '+e,e);}};},getMultiAjaxComplete:function(loadingDom,ajaxOptions)
{var that=this;ajaxOptions=ajaxOptions||{};return function(transport)
{try{if(that.searchTerm||loadingDom.offsetWidth||that.options.onLoad)
{var response=transport.responseText;if(ajaxOptions.preparser)
{var params=[response];var paramMap={$response:response,$ajaxParams:transport.request.parameters,$menuDef:that.menuDef,$parentMenu:that.parentMenu};if(ajaxOptions.preparams)
{for(var param in ajaxOptions.preparams)
params.push(ajaxOptions.preparams[param]);}
response=Qualtrics.Event.executeDotSyntax(ajaxOptions.preparser,null,null,null,paramMap,params);}
if(ajaxOptions.postparser)
{var params=[response];var paramMap={$response:response,$ajaxParams:transport.request.parameters,$menuDef:that.menuDef,$parentMenu:that.parentMenu};response=Qualtrics.Event.executeDotSyntax(ajaxOptions.postparser,null,null,null,paramMap,params);}
if(that.searchTerm)
{that.replaceItemsWithNewDef(response);}
else if(that.options.onLoad)
{that.evaluateMenuDefinition(response);Qualtrics.Event.executeDotSyntax(that.options.onLoad,null,null,null,{'$menuDef':that.menuDef,'$menuPane':that});}
else
{that.replaceMenuDefinition(response);}}}catch(e)
{console.error('cant parse menu def: '+e);}};},isOpen:function()
{if(this.menuDom&&this.menuDom.offsetWidth)
{return true;}
return false;},replaceMenuDefinition:function(newMenuDef)
{var forcedPosition=null;if(this.options.mousePosition)
{forcedPosition={top:this.top,left:this.left,right:this.right};}
var that=this;var oldDom=that.menuDom;var newDom=that.constructMenu(newMenuDef,{empty:getMessage('SiteWide','NoResults')});if(newDom)
{if(oldDom&&oldDom.parentNode)
{oldDom.parentNode.insertBefore(newDom,oldDom);newDom.id=oldDom.id;}
else
{this.insertMenu();}
if(that.parentMenu)
{that.addClassNames();that.setupSubMenuEvents();}
that.positionMenu(forcedPosition);that.deactivateArrowMode();that.subMenuSetupComplete=false;that.setupSubMenus();if(that.searchInputDom&&!this.searchTerm)
{QualtricsTools.focusInput(that.searchInputDom,0);}}
if(oldDom&&oldDom!=newDom)
{oldDom.onmouseup=null;removeElement(oldDom);}},setupSubMenus:function(opt_forceAgain)
{if(this.subMenuSetupComplete&&!opt_forceAgain)
{return;}
this.subMenuSetupComplete=true;if(this.menuUl)
{var ul=this.menuUl;var children=$(ul).childElements();var widestItem=0;for(var i=0,len=children.length;i<len;++i)
{var foundSub=null;var link=$(children[i]).down&&$(children[i]).down();if(link)
{var width=link.offsetWidth;if(width>widestItem)
{widestItem=width;}
var submenuOptions={mouse:true};if(this.options.outline)
{submenuOptions.outline=this.options.outline;}
if(link.getAttribute('menuclass'))
{submenuOptions.className=link.getAttribute('menuclass');}
if(this.options.fixed)
{submenuOptions.fixed=this.options.fixed;}
if(this.options.classicSubMenu)
{submenuOptions.classicSubMenu=this.options.classicSubMenu;}
if(link.getAttribute('submenu'))
{foundSub=true;link.onmouseover=this.getDynamicSubMenuClosure(link.getAttribute('submenu'),children[i],submenuOptions);}
else if(!link.hasClassName('Pagination'))
{var subMenu=$(link).next();if(subMenu)
{foundSub=true;link.onmouseover=this.getSubMenuShowClosure(subMenu,children[i],submenuOptions);$(subMenu).hide();$(subMenu).addClassName('QSubMenu');}}
if(foundSub)
{this.hasSubMenus=true;children[i].hasSubMenu=true;link.appendChild(QBuilder('span',{className:'ArrowIcon'}));$(children[i]).addClassName('HasSubMenu');}
else
{link.onmouseover=this.getSubMenuHideClosure({mouse:true});}}}
if(Qualtrics.Browser.IE&&Qualtrics.Browser.Version<8)
{var paddingOffset=null;for(var i=0,len=children.length;i<len;++i)
{var link=$(children[i]).down&&$(children[i]).down();if(link)
{if(paddingOffset===null)
{var paddingLeftRight=[$(link).getStyle('paddingLeft'),$(link).getStyle('paddingRight')].invoke('replace','px','');paddingOffset=Number(paddingLeftRight[0])+Number(paddingLeftRight[1]);}
if(widestItem&&paddingOffset&&!link.hasAttribute('NoIE7SetW'))
{$(link).setStyle({minWidth:(widestItem-paddingOffset)+'px'});}}
if(children[i].className.indexOf('Separator')!=-1)
{$(children[i]).setStyle({minWidth:(widestItem-paddingOffset)+'px'});}}}
if(this.hasSubMenus)
{if(!Qualtrics.Menu.velocityProcessor&&window.QualtricsCPTools)
{Qualtrics.Menu.velocityProcessor=QualtricsCPTools.velocimeter.add(Qualtrics.Menu.processVelocity);}}}},getAutoDirection:function()
{if(this.options.mousePosition)
{var pageSize=getPageSize();return(mousePos[0]>pageSize[0]/2)?'left':'right';}
if(this.menuDef&&this.menuDef.direction)
{return this.menuDef.direction;}
var page=$('center')||document.body;var pageWidth=$(page).getWidth();var pagePos=Position.cumulativeOffset(page);var pageCenter=pagePos[0]+((pagePos[0]+pageWidth)/2);if(this.buttonInfo.left<pageCenter)
{return'right';}
return'left';},getAutoAlignment:function()
{if(this.direction=='left')
{return'right';}
else
{return'left';}},positionMenu:function(opt_forcePosition,opt_updateButtonInfo)
{if(opt_updateButtonInfo)
{this.getButtonInfo(true);}
this.forcedDirection=null;if(this.options.positionCallback)
{var position=this.options.positionCallback();if(position.width&&position.width!='auto')
{$(this.menuDom).setStyle({width:position.width+'px'});}
if(position.y&&position.x)
{var topPos=position.y;$(this.menuDom).setStyle({top:topPos+'px',left:position.x+'px'});return;}}
var pageSize=getPageSize();if(this.parentMenu)
{$(this.menuDom).show();}
var buttonTag=(this.parentButton||{}).nodeName;if(buttonTag!=='IMG'&&this.menuDom.offsetWidth<this.buttonInfo.width&&!this.parentMenu)
{$(this.menuDom).setStyle({width:this.buttonInfo.width+'px'});}
var menuWidth=this.menuDom.offsetWidth;var topPos=this.buttonInfo.top+this.buttonInfo.height-1;var leftPos=this.buttonInfo.left+1;var leftCenter=leftPos;var rightPos=leftPos+this.buttonInfo.width-menuWidth;var rightCenter=rightPos;var centerPos=leftPos;if(this.options.mousePosition)
{if(this.options.forceMousePosition)
{topPos=this.options.forceMousePosition.y+1;leftPos=this.options.forceMousePosition.x+1;rightPos=this.options.forceMousePosition.x-menuWidth-1;}
else
{topPos=window.mousePos[1]+1;leftPos=window.mousePos[0]+1;rightPos=window.mousePos[0]-menuWidth-1;}}
this.options.fixed=this.options.fixed||(this.menuDef&&(this.menuDef.fixed||this.menuDef.checkForFixed&&Qualtrics.Menu.isFixed(this.parentButton)));if(this.options.fixed)
{if(Qualtrics.Browser.IE&&Qualtrics.Browser.Version<9&&this.buttonInfo.top<0)
{topPos=this.buttonInfo.height-1;}
$(this.menuDom).addClassName('Fixed');}
if(this.options.position=='horizontal')
{leftPos=this.buttonInfo.left+this.buttonInfo.width;topPos=this.buttonInfo.top;centerPos=leftPos;rightPos=this.buttonInfo.left-menuWidth;}
else if(this.options.position=='vertical')
{leftPos=this.buttonInfo.left+this.buttonInfo.width;centerPos=this.buttonInfo.left-(menuWidth/2)+(this.buttonInfo.width/2);topPos=this.buttonInfo.top+this.buttonInfo.height;rightPos=this.buttonInfo.left-menuWidth;leftCenter=this.buttonInfo.left-(menuWidth/2);rightCenter=leftCenter+this.buttonInfo.width;}
else if(this.options.position=='horizontal-right')
{leftPos=this.buttonInfo.left+this.buttonInfo.width;centerPos=leftPos;rightPos=this.buttonInfo.left-menuWidth;topPos=this.buttonInfo.top+(this.buttonInfo.height/2)-(this.menuDom.offsetHeight/2);}
if(this.direction=='up')
{topPos=this.buttonInfo.top-this.menuDom.offsetHeight;if(this.options.connector)
{topPos-=10;}}
else
{if(this.options.connector)
{topPos+=10;$(this.menuDom).addClassName("Direction_down");}}
if(this.options.connectorPosition)
{if(this.options.connectorPosition==='left')
{leftPos+=11;topPos-=10;$(this.menuDom).addClassName("Direction_right");}}
if(this.parentMenu)
{topPos-=this.parentMenu.menuUl.scrollTop;leftPos=this.parentMenu.menuUl.offsetWidth;rightPos=0-menuWidth;}
if(this.options.relative)
{leftPos=0;topPos=this.buttonInfo.height;rightPos=0-menuWidth+this.buttonInfo.width;}
if(opt_forcePosition)
{var f=opt_forcePosition;if(f.top)
{topPos=f.top;}
if(f.left)
{leftPos=f.left;}
if(f.right)
{rightPos=f.right;}}
if(this.menuDef&&this.menuDef.offsetRight)
{rightPos-=this.menuDef.offsetRight;leftPos+=this.menuDef.offsetLeft;}
if(this.alignment=='left')
{$(this.menuDom).setStyle({top:topPos+'px',left:leftPos+'px'});}
else if(this.alignment=='center-left')
{$(this.menuDom).setStyle({top:topPos+'px',left:leftCenter+'px'});}
else if(this.alignment=='center-right')
{$(this.menuDom).setStyle({top:topPos+'px',left:rightCenter+'px'});}
else if(this.alignment=='center')
{$(this.menuDom).setStyle({top:topPos+'px',left:centerPos+'px'});}
else
{$(this.menuDom).setStyle({top:topPos+'px',left:rightPos+'px'});}
this.top=topPos;this.left=leftPos;this.right=rightPos;var cumulativeOffset=this.getCumulativeOffset();var breathingRoom=40;if(this.direction=='right'&&cumulativeOffset.left+menuWidth>(pageSize[0]-breathingRoom))
{rightPos=Math.max(this.buttonInfo.width-cumulativeOffset.left,rightPos);this.forcedDirection='left';$(this.menuDom).setStyle({top:topPos+'px',left:rightPos+'px'});}
else if(this.direction=='left'&&cumulativeOffset.left<0)
{this.forcedDirection='right';$(this.menuDom).setStyle({top:topPos+'px',left:leftPos+'px'});}
if(this.options.height)
{this.clipMenu(this.options.height);}
this.adjustMenu({leftPos:leftPos,rightPos:rightPos,topPos:topPos});if(this.options.outline)
{Qualtrics.Menu.drawOutline();}
if(this.options.positionOverRide)
{Qualtrics.Event.executeDotSyntax(this.options.positionOverRide,null,null,null,null,[this.menuDom]);}},adjustMenu:function(options)
{options=options||{};var leftPos=options.leftPos||0;var rightPos=options.rightPos||0;var topPos=options.topPos||0;var pageSize=getPageSize();var cumulativeOffset=this.getCumulativeOffset();var viewHeight=pageSize[3];var viewBottom=scrollInfo[1]+viewHeight;var menuTop=this.menuDom.offsetTop;var menuHeight=this.menuDom.offsetHeight;var padding=24;var menuTop=cumulativeOffset.top;if(this.options.fixed)
{menuTop+=scrollInfo[1];}
var clippedY=menuTop+menuHeight-viewBottom;if(clippedY>0)
{var adjustedTop=null;var adjustedLeft=null;if(leftPos<this.buttonInfo.left+this.buttonInfo.width-10)
{var buttonHeadRoom=this.buttonInfo.top-scrollInfo[1];if(this.options.fixed)
{buttonHeadRoom=this.buttonInfo.top;}
if(menuHeight<buttonHeadRoom)
{if(!this.options.relative)
{adjustedTop=this.buttonInfo.top-menuHeight;}}
else
{if(!this.options.dontAdjustHorizontally)
{if(this.direction=='right')
{adjustedLeft=leftPos+this.buttonInfo.width;}
else
{adjustedLeft=rightPos-(this.buttonInfo.width);}}}}
if(!adjustedTop)
{var remainder=0;var headRoom=cumulativeOffset.top;if(!this.options.fixed)
{headRoom-=scrollInfo[1];}
if(this.options.dontAdjustHorizontally)
{clippedY+=this.buttonInfo.height;}
if(clippedY>headRoom)
{remainder=clippedY-headRoom;clippedY=headRoom;}
adjustedTop=topPos-clippedY;if(remainder>0)
{var domNode=this.menuUl||this.menuDom;var listHeight=domNode.offsetHeight;var maxHeight=listHeight-remainder;this.clipMenu(maxHeight-(padding*2));adjustedTop+=padding;}
else
{adjustedTop-=padding;}}
if(adjustedTop)
{$(this.menuDom).setStyle({top:(adjustedTop)+'px'});}
if(adjustedLeft)
{var menuWidth=this.menuDom.offsetWidth;if(pageSize[2]<menuWidth)
{$(this.menuDom).setStyle({width:(pageSize[2]-adjustedLeft-10)+'px'});$(this.menuDom).down().setStyle({width:((pageSize[2]-adjustedLeft)-10)+'px',overflowX:'auto'});}
$(this.menuDom).setStyle({left:(adjustedLeft)+'px'});}}
else if(pageSize[2]<this.menuDom.offsetWidth)
{if(this.direction=='right')
{adjustedLeft=leftPos+this.buttonInfo.width;}
else
{adjustedLeft=rightPos-(this.buttonInfo.width);}
$(this.menuDom).setStyle({width:(pageSize[2]-adjustedLeft-10)+'px',left:(adjustedLeft)+'px'});$(this.menuDom).down().setStyle({width:((pageSize[2]-adjustedLeft)-10)+'px',overflowX:'auto'});}},clipMenu:function(height)
{if(this.menuUl)
{$(this.menuUl).setStyle({height:height+'px',overflowX:'visible',overflowY:'scroll',position:'relative'});}
else if(this.menuDom)
{$(this.menuDom).setStyle({height:height+'px',overflowX:'visible',overflowY:'scroll'});}},getButtonPos:function()
{if(this.options.customPositionCallback)
{var rm=Qualtrics.Event.getDotSyntaxParts(this.options.customPositionCallback);return rm.method.apply(rm.root,[this.parentButton]);}
if(this.parentMenu)
{var topPos=this.parentButton.offsetTop;return{left:this.parentButton.offsetLeft,top:topPos};}
var pos=Position.cumulativeOffset(this.parentButton);var scrollOffsets=QualtricsTools.cumulativeScrollOffset(this.parentButton);pos[0]-=scrollOffsets[0];pos[1]-=scrollOffsets[1];if(Qualtrics.Browser.IE&&this.menuDef&&this.menuDef.fixed)
{pos[0]+=scrollInfo[0];pos[1]+=scrollInfo[1];}
return{left:pos[0],top:pos[1]};},positionOutline:function()
{if(this.menuOutlineDom)
{var bg=this.menuOutlineDom;var m=this;var offset=m.getCumulativeOffset();bg.style.left=offset.left+'px';bg.style.top=offset.top+'px';bg.style.width=m.menuDom.offsetWidth+'px';bg.style.height=m.menuDom.offsetHeight+'px';}
if($(Qualtrics.Menu.outlineContainer)&&this.options.fixed||(this.menuDef&&this.menuDef.fixed))
{$(Qualtrics.Menu.outlineContainer).addClassName('Fixed');}
else if($(Qualtrics.Menu.outlineContainer))
{$(Qualtrics.Menu.outlineContainer).removeClassName('Fixed');}},getActiveMenuItem:function(opt_itemIndex)
{var menu=this.menuUl;if(this.arrowMode)
{if(this.arrowSelectedItem)
{this.selectionNode=this.arrowSelectedItem;return this.selectionNode;}}
if(menu)
{var menuTopScroll=this.menuDom.scrollTop;$(menu).cleanWhitespace();var childs=menu.childNodes;var selectionNode=null;if(opt_itemIndex!==undefined&&childs[opt_itemIndex])
{return childs[opt_itemIndex];}
for(var i=0,len=childs.length;i<len;++i)
{if($(childs[i]).cumulativeOffset)
{var offset=$(childs[i]).cumulativeOffset();if(menu.scrollTop)
{offset[1]-=menu.scrollTop;}
if(this.options.fixed||(this.menuDef||{}).fixed)
{offset.left=offset[0]+=scrollInfo[0];offset.top=offset[1]+=scrollInfo[1];}
var strangeBottomOffset=1;var isWithinChild=(mousePos[0]>offset[0]&&mousePos[0]<offset[0]+childs[i].offsetWidth&&mousePos[1]>(offset[1]-menuTopScroll)&&mousePos[1]<(offset[1]+childs[i].offsetHeight-menuTopScroll+strangeBottomOffset));if(isWithinChild)
{selectionNode=childs[i];this.selectionNode=selectionNode;return this.selectionNode;}}}}},observeMenuUp:function(menuNode)
{if(!menuNode.mouseUpObserver)
{menuNode.mouseUpObserver=true;menuNode.onmouseup=this.flashSelectionAndDestroyMenu.bind(this);}
if(!menuNode.touchEndObserver)
{menuNode.touchEndObserver=true;menuNode.ontouchend=this.flashSelectionAndDestroyMenu.bind(this);}},flashSelectionAndDestroyMenu:function(evt,options)
{if(!evt)evt=window.event;options=options||{};var shouldRunSelectionFunctions=true;if(evt)
{if(!evt.keyCode&&evt.type!=='touchend'&&!Event.isLeftClick(evt))
{return;}
var clickedEl=Event.element(evt);if(clickedEl&&!evt.keyCode)
{if(clickedEl.id=='QMenu'||clickedEl.tagName=='UL')return;if(clickedEl.nodeName=='INPUT')return;if(clickedEl.getAttribute('keepmenuopen'))return;if(clickedEl.getAttribute('doNotSelectOption')){shouldRunSelectionFunctions=false;}
clickedEl=null;}}
var menu=Qualtrics.Menu.getActiveMenuPane();if(menu.id!=this.id)
return;var selectionNode=menu.getActiveMenuItem(options.itemIndex);var itemDef={};var link=null;if(selectionNode)
{if($(selectionNode).hasClassName('Disabled')||$(selectionNode).hasClassName('Pagination')||selectionNode.getAttribute('keepmenuopen'))
{return;}
$(selectionNode).cleanWhitespace();link=selectionNode.firstChild;if(link&&link.nodeType==1)
{var itemIndex=link.getAttribute('itemindex');if(itemIndex!==undefined)
{if(menu.searchTerm&&menu.searchMenuDef&&menu.searchMenuDef.items)
{itemDef=menu.searchMenuDef.items[itemIndex]||{};}
else if((menu.menuDef||{}).items)
{itemDef=menu.menuDef.items[itemIndex]||{};}}
if(itemDef&&!itemDef.notselectable&&!itemDef.ignoreSelects)
{if(link.getAttribute('uncheckGroup'))
{var groups=link.getAttribute('uncheckGroup').split(',');if(selectionNode&&selectionNode.parentNode)
{Qualtrics.Menu.uncheckAll(selectionNode.parentNode,{groups:groups});}}
if(link.getAttribute('togglecheck'))
{QMenu.toggleCheck(selectionNode);}
if(link.getAttribute('togglecheckexclusive'))
{QMenu.toggleCheck(selectionNode,{selectOne:true});}
if(link.getAttribute('keepmenuopen'))
{return;}}}
else
{return;}
$(selectionNode.firstChild).addClassName('hover');$(selectionNode.firstChild).addClassName('SelectionFlash');$(selectionNode.firstChild).removeClassName.bind(selectionNode.firstChild,'SelectionFlash').delay(0.1);$(selectionNode.firstChild).removeClassName.bind(selectionNode.firstChild,'hover').delay(0.1);}
if(!link||link.nodeName!='A')
{if(menu.options&&menu.options.closeMenuOnNonMenuItem===false)
{return;}}
if(itemDef.ignoreSelects)
{shouldRunSelectionFunctions=false;}
var keepMenuOpen=menu.options.keepmenuopen||itemDef.keepMenuOpen;if(selectionNode&&menu&&shouldRunSelectionFunctions)
{if(!keepMenuOpen)
{clearTimeout(Qualtrics.Menu.menuCloseTimer);Qualtrics.Menu.menuCloseTimer=Qualtrics.Menu.destroyMenu.curry(menu.id).delay(0.3);}
this.runSelectCallBack(menu,itemDef,selectionNode);}
if(selectionNode&&(menu.options.buttonTitleCallback||menu.options.selectMenu||(menu.menuDef||{}).selectMenu)&&itemDef&&!itemDef.notselectable)
{menu.currentValue=itemDef.value;if(menu.parentButton)
{menu.parentButton.setAttribute('currentvalue',menu.currentValue);}
var text=menu.getItemDisplay(itemDef,true);if(itemDef.htmlContent)
{text=itemDef.htmlContent;}
if(this.options.buttonTitleCallback)
{var parameterMap={'$menuPane':this,'$originalText':text};text=Qualtrics.Event.executeDotSyntax(this.options.buttonTitleCallback,null,null,null,parameterMap);}
menu.setButtonText(text);}
if(itemDef.refreshMenu)
{menu.refreshMenu.bind(menu).defer();}
menu=null;},runSelectCallBack:function(menu,itemDef,opt_selectionNode)
{if(menu.type!='SelectMenuPane')
{var selectCallBack=menu.options['menuItemSelectCallback']||(menu.menuDef&&menu.menuDef['menuItemSelectCallback']);var selectCallBackSyncronous=menu.options['menuItemSelectCallbackSync']||(menu.menuDef&&menu.menuDef['menuItemSelectCallbackSync']);if(selectCallBack||selectCallBackSyncronous)
{var params=[opt_selectionNode];var parameterMap={'$selected':opt_selectionNode,'$value':itemDef.value,'$item':itemDef,'$checked':itemDef.checked,'$menuPaneId':this.id,'$menuPane':this,'$options':this.options,'$menuDef':this.menuDef};if(selectCallBackSyncronous)
{Qualtrics.Event.executeDotSyntax(selectCallBackSyncronous,null,null,null,parameterMap,params);}
else
{Qualtrics.Event.executeDotSyntax.curry(selectCallBack,null,null,null,parameterMap,params).defer();}}}},artificiallyExecuteMenuItem:function(liNode)
{if(liNode&&$(liNode).down)
{var a=$(liNode).down();if(a)
{var clickcallback=a.getAttribute('clickcallback')||a.getAttribute('mouseupcallback');var instanceid=a.getAttribute('instanceid');var i=0,params=[];do{i++;var param=a.getAttribute('p'+i);if(param)
{params.push(param);}}while(param);if(clickcallback)
{Qualtrics.Event.executeDotSyntax(clickcallback,instanceid,null,params);}}}},getDynamicSubMenuClosure:function(subMenu,button,options)
{options=Qualtrics.Menu.processOptions(options);options.right=0;return this.getSubMenuShowClosure(subMenu,button,options);},getSubMenuShowClosure:function(menuBuilder,button,options)
{var that=this;options=options||{};options.parentNode=this.menuDom;return function(evt)
{if(that.parentMenu)
{that.parentMenu.traveling=false;}
if(options.mouse)
{Qualtrics.Menu.deactivateArrowMode();}
var activeMenuPane=Qualtrics.Menu.getActiveMenuPane();if(activeMenuPane.getRootMenu().id!=that.getRootMenu().id)
{return;}
if(that.activeSubMenu&&that.activeSubMenu.parentButton==button)
{that.hideSubMenuOnLowVelocity=false;that.suppressedSubMenu=null;return;}
that.hideSubMenuOnLowVelocity=false;that.showSubMenu.bind(that,menuBuilder,button,options)();};},getSubMenuHideClosure:function(options)
{var that=this;options=options||{};return function(evt)
{that.hideSubMenuOnLowVelocity=false;that.suppressedSubMenu=null;var activeMenu=Qualtrics.Menu.getActiveMenuPane();if(options.mouse)
{Qualtrics.Menu.deactivateArrowMode();}
if(Qualtrics.Menu.asyncMenuTimout)
{clearTimeout(Qualtrics.Menu.asyncMenuTimout);Qualtrics.Menu.asyncMenuTimout=null;}
if(activeMenu&&activeMenu.parentMenu)
{if(activeMenu==that.activeSubMenu)
{activeMenu.parentMenu.hideSubMenuOnLowVelocity=true;}
else
{that.hideSubMenu();}}};},getSubMenuHideSequenceClosure:function(subMenu)
{var menuPane=this;return function()
{if(menuPane.suppressedSubMenu&&menuPane.suppressedSubMenu.menu==subMenu)
{menuPane.suppressedSubMenu=null;}
if(menuPane.showTimer)
{clearTimeout(menuPane.showTimer);menuPane.showTimer=null;}
menuPane.hideSubMenuOnLowVelocity=true;};},showSubMenu:function(subMenu,button,options)
{options=Qualtrics.Menu.processOptions(options);this.showTimer=null;if(this.traveling)
{this.suppressedSubMenu={menu:subMenu,button:button,options:options};return false;}
this.suppressedSubMenu=null;this.hideSubMenu();options.position="horizontal";if(this.type=="SelectMenuPane")
{var parentNode=options.parentNode;Object.extend(options,this.options);if(parentNode)
options.parentNode=parentNode;this.activeSubMenu=new Qualtrics.SelectMenuPane(subMenu,button,this,options);}
else
{if(!options.classicSubMenu)
options.asynchronous=true;this.activeSubMenu=new Qualtrics.MenuPane(subMenu,button,this,options);}
this.activeSubMenu.setupSubMenuEvents();if(this.arrowMode)
{Qualtrics.Menu.down(subMenu);}},setupSubMenuEvents:function(subMenuBuilder,menuDom,button)
{if(this.parentMenu)
{if(this.getRootMenu().options.closeSubMenuOnMouseOut)
{this.parentButton.onmouseout=this.parentMenu.getSubMenuHideSequenceClosure(this.menuDom);this.menuDom.onmouseout=this.parentMenu.getSubMenuHideSequenceClosure(this.menuDom);}
this.menuDom.onmouseover=this.parentMenu.getSubMenuShowClosure(this.menuBuilder,this.parentButton);}},hideSubMenu:function()
{if(this.activeSubMenu)
{this.activeSubMenu.destroy();}},setSuspend:function(v)
{this.suspend=v;if(this.parentMenu)
{this.parentMenu.setSuspend(true);}},destroy:function(opt_recursive)
{if(this.suspend)
{return false;}
this.destroyed=true;Qualtrics.Menu.removeMenuPaneFromStack(this);if(this.menuOutlineDom)
{removeElement(this.menuOutlineDom);}
if(this.parentButton)
{$(this.parentButton).removeClassName('ActiveSubMenu');}
if(this.parentMenu)
{if(this.activeSubMenu)
{this.activeSubMenu.destroy();}
if($(this.parentMenu.menuUl))
$(this.parentMenu.menuUl).removeClassName('HasActiveSubMenu');if(this.menuDom)
{$(this.menuDom).hide();}
if(this.menuDom)
{this.menuDom.onmouseup=null;this.menuDom.ontouchend=null;if($(this.menuDom).parentNode!=null)
{$(this.menuDom).remove();}}
this.parentMenu.activeSubMenu=null;this.parentMenu.hideSubMenuOnLowVelocity=null;if(opt_recursive)
{this.parentMenu.destroy(opt_recursive);}}
else
{this.selectionNode=null;if(!Qualtrics.Menu.menuPaneStack.length)
{Event.stopObserving(document,'mousedown',Qualtrics.Menu.documentDownHandler);Event.stopObserving(document,'touchstart',Qualtrics.Menu.documentTouchObserver);Qualtrics.Menu.documentObserver=null;Qualtrics.Menu.documentTouchObserver=null;if(Qualtrics.Menu.overlayObj)
{Qualtrics.Menu.overlayObj.remove();Qualtrics.Menu.overlayObj=null;}}
if(this.menuDom)
{this.menuDom.onmouseup=null;if($(this.menuDom).parentNode!=null)
{$(this.menuDom).remove();}}
this.menuDom=null;this.menuUl=null;this.searchInput=null;}
if(this.parentButton&&this.parentButton.aNode)
{$(this.parentButton.aNode).removeClassName('HasActiveMenu');}
if(this.options.onMenuClose)
{Qualtrics.Event.executeDotSyntax(this.options.onMenuClose,null,null,null,{'$menuPane':this,'$menuPaneId':this.id});}
if(this.menuDef&&this.menuDef.onMenuClose)
{Qualtrics.Event.executeDotSyntax(this.menuDef.onMenuClose,null,null,null,{'$menuPane':this,'$menuPaneId':this.id});}
if(this.onClose)
{try{this.onClose();}catch(e)
{throw(e);}}},activateArrowMode:function()
{this.setupMouseModeEvents();this.arrowMode=true;$(this.menuUl).addClassName('ArrowSelectMode');},deactivateArrowMode:function()
{if(this.arrowMode)
{$(this.menuUl).removeClassName('ArrowSelectMode');this.arrowMode=false;this.arrowSelectedItem=null;if(!this.parentMenu)
{this.menuUl.onmouseover=null;}
this.hideSubMenu();}},setupMouseModeEvents:function()
{if(this.menuUl&&!this.parentMenu)
{this.menuUl.onmouseover=Qualtrics.Menu.deactivateArrowMode;}},unselectAll:function()
{var children=$(this.menuUl).childElements();for(var i=0,len=children.length;i<len;++i)
{var li=children[i];li.removeClassName('ArrowSelected');}},selectItem:function(liNode)
{if(!this.arrowMode)
{this.activateArrowMode();}
this.unselectAll();this.arrowSelectedItem=liNode;$(liNode).addClassName('ArrowSelected');},focusSearch:function()
{if(this.searchInputDom)
this.searchInputDom.focus();},setButtonText:function(text)
{var button=this.parentButton;if(button)
{var callbackNode='';var aTag=QualtricsTools.fastUp(button,'menuButton');if(!aTag)
{if(button.nodeName=='A')
{aTag=button;}
else if(button.aNode)
{aTag=button.aNode;}
else
{aTag=$(button.up('a'));}}
if(aTag&&aTag.callbackNode)
{callbackNode=aTag.callbackNode;}
else
{var root=aTag||button;callbackNode=$(root).down('b');if(callbackNode)
callbackNode=$(callbackNode).down('b')||callbackNode;if(callbackNode)
callbackNode=$(callbackNode).down('b')||callbackNode;if(!callbackNode)
{var textNode=QualtricsTools.fastDown(button);if(textNode&&textNode.nodeType==3)
{callbackNode=textNode.parentNode;}}}
if(callbackNode)
{if(callbackNode.updateTitle)
callbackNode.updateTitle(text);else
callbackNode.innerHTML=text;}}},setupMenuButtonInput:function(initialValue,fieldName,button)
{if(!$(fieldName))
{var input=QBuilder('input',{type:'hidden',id:fieldName,name:fieldName,value:initialValue});if(button&&button.firstChild)
button.firstChild.appendChild(input);}
else
{if(!$(fieldName).value)$(fieldName).value=initialValue;}
button.setAttribute('currentvalue',initialValue);},nextPage:function()
{this.startIndex+=this.perpage;this.hideSubMenu();Qualtrics.Menu.keepMenuOpen();this.refreshMenu();},prevPage:function()
{if(this.startIndex>0)
{this.startIndex-=this.perpage;this.hideSubMenu();Qualtrics.Menu.keepMenuOpen();this.refreshMenu();}}};Qualtrics.SelectMenuPane=Class.create(Qualtrics.MenuPane,{type:'SelectMenuPane',initialize:function($super,menuBuilder,parentButton,opt_parentMenu,options)
{$super(menuBuilder,parentButton,opt_parentMenu,options);},getItemCallback:function(item,itemIndex)
{if(item.disabled)
{return false;}
return(item.action)?item.action.replace('$menuPaneId',this.id):'Qualtrics.SelectMenuPane.selectMenuItemSelect:'+this.id+'('+itemIndex+', $evt)';},selectMenuItemSelect:function(itemIndex,opt_evt)
{var item=this.menuDef.items[itemIndex];var fieldName=this.options.fieldName;var value=this.getItemValue(item);if(!value)
{if(!item.unselectable)
return;}
if($(fieldName))
{$(fieldName).value=value;}
var button=this.parentButton;if(button)
{button.setAttribute('currentvalue',value);}
var text=this.getItemDisplay(item);var truncate=this.menuDef.truncate;if(truncate)
{text.truncate(truncate);}
var selectCallBack=this.options['menuItemSelectCallback']||button.getAttribute('menuitemselectcallback');if(this.selectionNode&&!this.options.displayAsText)
this.setButtonText(text);if(selectCallBack&&this.selectionNode)
{var selectedNode=this.selectionNode;var aNode=$(selectedNode).down('a');if(!value)
{value=aNode.getAttribute('p3');}
if(!text)
{text=aNode.getAttribute('p4');}
var params=[this.options.buttonId,value,text];var parameterMap={'$selected':selectedNode,'$value':value,'$label':text,'$fieldName':fieldName,'$buttonId':this.options.buttonId,'$menuDef':this.menuDef,'$item':item,'$itemIndex':itemIndex,'$evt':opt_evt};if(Qualtrics.Event.callbackHasParams(selectCallBack))
{params=null;}
Qualtrics.Event.executeDotSyntax.curry(selectCallBack,null,null,params,parameterMap).defer();}}});Qualtrics.SelectMenuPane.getInstance=QualtricsTools.getInstanceHelper(Qualtrics.Menu.menuPaneStack,'id');Qualtrics.Select=Class.create({initialize:function(options)
{this.options=options||{};this.id=QualtricsTools.createNewId('SEL');Qualtrics.Select.reg[this.id]=this;this.list=this.options.list||{};var index=0;if(this.options.value)
{index=this.getValueIndex(this.options.value);}
this.setIndex(index);},getValueIndex:function(val)
{for(var i=0,ilen=this.list.length;i<ilen;i++)
{if(val==this.list[i].value)
return i;}
return-1;},select:function(index)
{if(!this.list[index].disabled)
{this.setIndex(index);if(this.options.onSelect)
this.options.onSelect(index,this.getValue(),this.getDisplay());}},setIndex:function(index)
{if(index==-1)
index=0;if(this.list[index])
{this.selected=index;if(this.button)
this.updateTitle(this.list[index].display);}},updateTitle:function(display)
{if(this.options.truncateButton&&window.QualtricsCPTools)
{display=QualtricsCPTools.middleTruncate(display,this.options.truncateButton);}
this.button.updateTitle(display);},getValue:function()
{return this.list[this.selected].value;},getDisplay:function()
{return this.list[this.selected].display;},build:function()
{this.button=Qualtrics.Menu.buildMenuButton('Select...','Qualtrics.Select.showMenu:'+this.id,{className:'SelectMenuButton '+this.options.className});this.updateTitle(this.list[this.selected].display);return this.button;},showMenu:function()
{var items=[];for(var i=0,ilen=this.list.length;i<ilen;i++)
{var item={display:this.list[i].display,action:'Qualtrics.Select.select:'+this.id+'('+i+')',disabled:this.list[i].disabled};if(this.selected==i)
item.checked=true;items.push(item);}
var menuDef={items:items,togglecheck:true,togglecheckexclusive:true};return menuDef;}});Qualtrics.Select.reg={};Qualtrics.Select.getInstance=QualtricsTools.getInstanceHelper(Qualtrics.Select.reg);Qualtrics.Info={infoId:'',languages:{},altLanguage:'',content:'',targetURL:'',masterList:{},loadedPageInfo:false,activatedOverCalls:false,defaultMessage:null,loadInfoForPageSection:function()
{new Ajax.Request('Ajax.php?action=GetInfoTipsForPage',{onComplete:function(transport)
{var results=transport.responseText.evalJSON();if(results._enabled===false)
{Qualtrics.User.helpTipsEnabled=0;Qualtrics.HelpInfoTips._enabled=false;}
else
{Qualtrics.HelpInfoTips=results;Qualtrics.User.helpTipsEnabled=1;if(!this.activatedOverCalls)
{Qualtrics.Event.activateOverCallbacks();this.activateOverCallbacks=true;}}}});},createInfoElement:function(el,infoId,options)
{options=options||{};if(!this.loadedPageInfo)
{this.loadInfoForPageSection();this.loadedPageInfo=true;}
if(options&&options.left)
{el.setAttribute('className','Left');}
if(options&&options.right)
{el.setAttribute('className','Right');}
if(options&&options.recurse)
{this.addInfoAttribute(el,infoId);}
else
{el.setAttribute('infoButton',infoId);}
if(options&&options.InlineBlock)
{el.addClassName('InfoInlineBlock');el=QBuilder('div',{},[el,QBuilder('div',{className:'clear'})]);}
return el;},addInfoAttribute:function(el,infoId)
{el.setAttribute('infoButton',infoId);var children=el.childElements();for(var x=0;x<children.length;x++)
{this.addInfoAttribute(children[x],infoId);}},showButton:function(infoId,evt){if(!Qualtrics.User.helpTipsEnabled||!Qualtrics.HelpInfoTips||!Qualtrics.HelpInfoTips._enabled)
return;if(evt.target.hasAttribute('message')&&this.defaultMessage===null)
{this.defaultMessage=evt.target.getAttribute('message');}
var myTips=Qualtrics.HelpInfoTips['ValidTips'][infoId];if(myTips===undefined)
{if(!Qualtrics.HelpInfoTips['EmptyTips'].include(infoId))
{Qualtrics.HelpInfoTips['EmptyTips'].push(infoId);new Ajax.Request('Ajax.php?action=RegisterHelpInfoTip',{parameters:{InfoID:infoId}});}
if(Qualtrics.User.userType!='UT_SERVERADMIN'&&this.defaultMessage===null)
return;}
var infoButton=$('InfoButton_'+infoId);if(!infoButton&&evt)
{var el=Event.element(evt);infoButton=QBuilder('span',{bubbleup:false,className:'InfoButton',id:'InfoButton_'+infoId});if(el.nextSibling)
{el.parentNode.insertBefore(infoButton,el.nextSibling);}
else
{el.parentNode.appendChild(infoButton);}}
if(infoButton)
{if(!infoButton.childNodes.length)
{infoButton.appendChild(QBuilder('span',{className:'InfoInner',infobutton:infoId}));}
infoButton=$(infoButton);infoButton.setAttribute('infobutton',infoId);infoButton.setAttribute('downcallback','Qualtrics.Info.showInfo('+infoId+', $evt, '+this.defaultMessage+')');infoButton.addClassName('Show');if(!infoButton.hasClassName('HoverFree'))
{Qualtrics.Event.addGlobalOutCallback('Qualtrics.Info.hideButton('+infoId+')');}}},hideButton:function(infoId,evt){var infoButton=$('InfoButton_'+infoId);if(infoButton)
{infoButton.removeClassName('Show');}},showInfo:function(infoId,evt)
{if(!Qualtrics.User.helpTipsEnabled)
return;if(this.defaultMessage===null&&evt.target.hasAttribute('message'))
{this.defaultMessage=evt.target.getAttribute('message');}
var helpText=Qualtrics.HelpInfoTips['ValidTips'][infoId]||{};if((helpText.Value=='No help available'||helpText.Value===undefined)&&helpText.targetURL!=undefined&&Qualtrics.User.userType!='UT_SERVERADMIN'&&this.defaultMessage===null)
{this.showTargetURL(helpText.targetURL);return;}
var menu=Qualtrics.Menu.showMenu('Qualtrics.Info.getInfoMenuDef('+infoId+')',Event.element(evt),{position:'vertical',alignment:'center',direction:'up',connector:true},evt);this.infoId=infoId;var infoBox=document.getElementsByClassName('InfoBox')[0];var offSet=infoBox.getBoundingClientRect().top;if(offSet<0)
{QMenu.destroyMenu();menu.menu=Qualtrics.Menu.showMenu('Qualtrics.Info.getInfoMenuDef('+infoId+')',Event.element(evt),{position:'vertical',alignment:'center',direction:'down',connector:true},evt);}},getInfoMenuDef:function(infoId)
{var helpText=Qualtrics.HelpInfoTips['ValidTips'][infoId]||{};if(helpText.Value===undefined||helpText.Value==='No help available')
{if(typeof this.defaultMessage==='string'&&this.defaultMessage.indexOf('|')!==-1)
{var messageParts=this.defaultMessage.split('|');helpText.Value=getMessage(messageParts[0],messageParts[1]);}
else
{helpText.Value='No help available';}}
return this.processMenuDef(helpText);},showInfoForCustomElement:function(infoId,evt){if(!Qualtrics.User.helpTipsEnabled||!Qualtrics.HelpInfoTips||!Qualtrics.HelpInfoTips._enabled)
return;var myTips=Qualtrics.HelpInfoTips['ValidTips'][infoId];if(Qualtrics.User.userType=='UT_SERVERADMIN'&&myTips===undefined)
{if(!Qualtrics.HelpInfoTips['EmptyTips'].include(infoId))
{Qualtrics.HelpInfoTips['EmptyTips'].push(infoId);new Ajax.Request('Ajax.php?action=RegisterHelpInfoTip',{parameters:{InfoID:infoId}});}}
if(this.defaultMessage===null&&evt.target.hasAttribute('message'))
{this.defaultMessage=evt.target.getAttribute('message');}
if(Qualtrics.User.userType=='UT_SERVERADMIN'||myTips||this.defaultMessage!==null)
this.showInfo(infoId,evt);},getInfoTipEditor:function()
{var infoId=this.infoId;Element.hide($$('.InfoBox')[0]);var response='';new Ajax.Request('Ajax.php?action=GetHelpInfoForEditing',{parameters:{InfoID:infoId},asynchronous:false,onComplete:function(transport){response=transport.responseText.evalJSON();delete response.RequestStatus;}});if(response=='')
{return;}
else if(response.Error||response.ErrorMessage)
{this.showErrorMessage('Error retrieving Help Info.');return;}
var targetURL=response['targetURL']['Value']||'';delete response.targetURL;var textboxes=[];for(var lang in response)
{if(!this.languages[lang])
{this.languages[lang]={};this.languages[lang]['Name']=response[lang]['Name'];}
var div=QBuilder('div',{className:'infoTextLanguageEditor'},[QBuilder('div',{className:'LanguageName'},[QBuilder('span',{},response[lang]['Name']),QBuilder('br'),QBuilder('span',{},'('+lang+') ')]),QBuilder('textarea',{className:'infoTextEditor',id:'infoTextEditor_'+lang,type:'textarea',name:lang},response[lang]['Value']||'')]);textboxes.push(div);}
textboxes.push(QBuilder('br'));textboxes.push(QBuilder('hr',{className:'clear'}));textboxes.push(QBuilder('h2',{},'Target URL'));var targetInputElement=QBuilder('input',{className:'infoTextEditor',id:'infoTextEditor_targetURL_'+infoId,name:'targetURL'});targetInputElement.value=targetURL;var targetURLDiv=QBuilder('div',{className:'infoTextLanguageEditor'},[targetInputElement,QBuilder('a',{className:'qbutton neutral',clickcallback:'Qualtrics.Info.showTestTargetURL('+infoId+')'},'Test Target URL')]);textboxes.push(targetURLDiv);textboxes.push(QBuilder('hr',{className:'clear'}));new Q_Window('InfoTipEditor',{title:QBuilder('div',{},[QBuilder('div',{},[QBuilder('div',{style:'float:left'},'Edit Text for \''+infoId+'\' ToolTip'),QBuilder('a',{href:'javascript:void(0);',style:'float:right;',clickcallback:'Qualtrics.Info.getInfoTipMasterEditor'},'  View/Edit all Help Tips (System-Wide)')]),QBuilder('br')]),width:'75%',content:QBuilder('form',{},textboxes),buttons:[{text:'Cancel',className:'negative',click:'Q_Window.closeWindow'},{id:'SaveButton',text:'Save',className:'positive',click:'Qualtrics.Info.save('+infoId+')'}]});},showTestTargetURL:function(infoId)
{var sourceDiv=$('infoTextEditor_targetURL_'+infoId);var source=sourceDiv.value||'';if(source==='')
return;this.showTargetURL(source);},showTargetURL:function(windowSource)
{if(windowSource.indexOf('?')==-1)
{windowSource+='?Q_IFrame=true';}
else
{windowSource+='&Q_IFrame=true';}
QMenu.destroyMenu();var window=new Q_Window('HelpPage',{'url':windowSource,iframescrolling:true,width:'90%',height:'90%'});},getInfoTipMasterEditor:function(editorWindow)
{var that=this;var error=null;new Ajax.Request('Ajax.php?action=GetHelpInfoMasterList',{asynchronous:false,onComplete:function(transport){var masterList=transport.responseText.evalJSON();if(masterList.ErrorMessage||masterList.Error)
{error='Error retrieving Help Info.';that.masterList=[];}
else
{delete masterList.RequestStatus;that.masterList=masterList;}}});Q_Window.closeWindow(editorWindow);if(error)
{this.showErrorMessage(error);return;}
if(this.altLanguage=='')
{this.altLanguage='ES';}
var table=QBuilder('table',{className:'InfoTextMasterEditor'},[QBuilder('tr',{className:'InfoTextMasterHeader'},[QBuilder('td',{className:'infoTipIdHeader'}),QBuilder('td',{className:'infoTipEditorHeader'},[QBuilder('span',{className:'languageItem'},'English')]),QBuilder('td',{className:'infoTipEditorHeader'},[QBuilder('select',{className:'languageItem',id:'languageSelector'})])])]);for(var tipId in this.masterList){var tr=QBuilder('tr',{className:'infoTextMasterEditor'},[QBuilder('td',{className:'InfoTipName'},[QBuilder('span',{},[QBuilder('b',{},tipId)])]),QBuilder('td',{className:'InfoTextEditorCell'},[QBuilder('textarea',{className:'infoTextEditor',id:'infoTextEditor_EN_'+tipId,type:'textarea',name:tipId+'_EN'},this.masterList[tipId]['EN']||'')]),QBuilder('td',{className:'InfoTextEditorCell'},[QBuilder('textarea',{className:'infoTextAltEditor',id:'infoTextEditor_'+this.altLanguage+'_'+tipId,type:'textarea',name:tipId+'_'+this.altLanguage},this.masterList[tipId][this.altLanguage]||'')])]);table.appendChild(tr);}
new Q_Window('InfoTipMasterEditor',{title:QBuilder('div',{},[QBuilder('span',{},'Edit Help Info Tips (System-Wide)')]),width:'75%',content:QBuilder('form',{},[table]),buttons:[{text:'Cancel',className:'negative',click:'Q_Window.closeWindow'},{id:'SaveButton',text:'Save',className:'positive',click:'Qualtrics.Info.save(_master)'}]});for(var lang in this.languages)
{if(lang!='EN')
{var opt=QBuilder('option',{value:lang},this.languages[lang]['Name']);if(lang==this.altLanguage){opt.selected=true;}
$('languageSelector').options.add(opt);}}
$('languageSelector').observe('change',function(){that.changeMasterEditorLanguage();});},changeMasterEditorLanguage:function()
{var newLanguage=$('languageSelector').getValue();var tempList=this.masterList;for(var id in tempList)
{var selector='infoTextEditor_'+this.altLanguage+'_'+id;var textBox=$(selector);var text=textBox.getValue();this.masterList[id][this.altLanguage]=text;var newTextbox=QBuilder('textarea',{className:'infoTextAltEditor',id:'infoTextEditor_'+newLanguage+'_'+id,type:'textarea',name:id+'_'+newLanguage},this.masterList[id][newLanguage]||'');Element.replace(textBox,newTextbox);}
this.altLanguage=newLanguage;},save:function(infoId)
{var formValues={};if(infoId=='_master')
{var tempList=this.masterList;for(var id in tempList)
{if(Object.isArray(this.masterList[id]))
{this.masterList[id]={};}
var selector='infoTextEditor_'+this.altLanguage+'_'+id;var text=$(selector).getValue();this.masterList[id][this.altLanguage]=text;var engSelector='infoTextEditor_EN_'+id;var engText=$(engSelector).getValue();this.masterList[id]['EN']=engText;}
formValues=this.masterList;}
else
{var infoText={};for(var lang in this.languages)
{infoText[lang]=$F($('infoTextEditor_'+lang));}
infoText['targetURL']=$F($('infoTextEditor_targetURL_'+infoId))||"";formValues[infoId]=infoText;}
var error=null;var that=this;new Ajax.Request('Ajax.php?action=EditHelpInfoTips',{parameters:{FormValues:Object.toJSON(formValues)},onComplete:function(transport){var result=transport.responseText.evalJSON();if(result.Error||result.ErrorMessage)
{error="Error Saving Help Info Tips.";that.showErrorMessage(error);}
else
{Q_Window.closeWindow();new Ajax.Request('Ajax.php?action=GetInfoTipsForPage',{parameters:{IgnoreCache:true},onComplete:function(transport)
{var tips=transport.responseText.evalJSON();Qualtrics.HelpInfoTips=tips;}});}}});},processMenuDef:function(text)
{this.content=text.Value;this.targetURL=text.targetURL||'';return{domNode:'Qualtrics.Info.buildInfo',className:'InfoBox'};},buildInfo:function()
{var text=this.content;var target=this.targetURL;var node=QBuilder('div',{className:'InfoContent'});node.innerHTML=text;if(Qualtrics.User.userType=='UT_SERVERADMIN')
{var editLink=QBuilder('div',{className:'EditInfoText'},[QBuilder('a',{href:'javascript:void(0);',clickcallback:'Qualtrics.Info.getInfoTipEditor'},'Edit')]);node.appendChild(editLink);}
if(target!=''&&target)
{var helpButton=QBuilder('div',{className:'HelpButton'},[QBuilder('a',{className:'qbutton neutral',href:'javascript:void(0);',clickcallback:'Qualtrics.Info.showTargetURL('+target+')'},getMessage('SiteWide','MoreInformation'))]);node.appendChild(QBuilder('hr'));node.appendChild(helpButton);}
return QBuilder('div',{className:'HelpInfo'},[node]);},showErrorMessage:function(message)
{new Q_Window('InfoTipEditor',{title:QBuilder('div',{},'Error'),content:QBuilder('div',{style:'color:red;font-weight:bold'},message),buttons:[{text:'Close',className:'negative',click:'Q_Window.closeWindow'}]});},setHelpInfoEnabled:function(isEnabled)
{var enabled=(isEnabled=='true')?1:0;new Ajax.Request('Ajax.php?action=SetHelpInfoEnabled',{parameters:{Enabled:enabled},onComplete:function()
{Qualtrics.User.helpTipsEnabled=enabled;if(!Qualtrics.HelpInfoTips||!Qualtrics.HelpInfoTips['_enabled'])
{new Ajax.Request('Ajax.php?action=GetInfoTipsForPage',{onComplete:function(transport)
{Qualtrics.HelpInfoTips=transport.responseText.evalJSON();if(!Qualtrics.Info.activatedOverCalls&&enabled)
{Qualtrics.Event.activateOverCallbacks();Qualtrics.Info.activatedOverCalls=true;}}});}}});}};QMenu={buildMenuButton:function(title,menuCallBack,options)
{return Qualtrics.Menu.buildMenuButton(title,menuCallBack,options);},buildSelectMenuButton:function(initialValue,fieldName,options)
{return Qualtrics.Menu.buildSelectMenuButton(initialValue,fieldName,options);},buildAjaxMenuButton:function(title,options)
{var fieldName=options.fieldName;var buttonId=fieldName+'_Button';var opt_url=options.opt_url;var searchParam=null;if(options.searchParam)
searchParam=options.searchParam;var menuOptions={className:'SelectMenuButton',menuType:'SelectMenuPane',buttonId:buttonId,fieldName:fieldName,searchParam:searchParam,url:opt_url,p1:fieldName,p2:buttonId,p3:'$options',menuItemSelectCallback:options.menuItemSelectCallback||null};menuOptions.selectMenu=true;var button=QMenu.buildMenuButton(title,'QMenu.buildAjaxMenu',menuOptions);return button;},buildSelectMenu:function(fieldName,buttonId,options)
{return Qualtrics.Menu.buildSelectMenu(fieldName,buttonId,options);},buildAjaxMenu:function(fieldName,buttonId,options)
{var button=$(options.p2);var params={};if(options.searchParam)
{params[options.searchParam]=options.searchText;}
var menuDef={ajax:{url:options.url,parameters:params,preparser:'QMenu.parseOldAjaxList'}};return menuDef;},parseOldAjaxList:function(list)
{list=list.evalJSON();var items=[];for(id in list['List'])
{if(typeof list['List'][id]=='function')
{continue;}
items.push({display:list['List'][id],value:id,icon:'false'});}
return{items:items};},keepMenuOpen:function()
{Qualtrics.Menu.keepMenuOpen();},showMenu:function(menuBuilder,clickedEl,options,opt_evt)
{Qualtrics.Menu.showMenu(menuBuilder,clickedEl,options,opt_evt);},toggleCheck:function(li,options)
{Qualtrics.Menu.toggleCheck(li,options);},isMenuExists:function()
{if($('QMenu'))
return true;else
return false;},positionMenu:function()
{Qualtrics.Menu.positionMenus();},mousedownHandler:Qualtrics.Menu.documentDownHandler,destroyMenu:Qualtrics.Menu.destroyAllMenus,buildComboBoxMenu:function(inputId,items)
{console.warn('buildComboBoxMenu is deprecated');var menu=QBuilder('ul');menu.appendChild(QMenu.buildComboBoxMenuItems(inputId,items));return menu;},buildComboBoxMenuItems:function(inputId,items)
{console.warn('buildComboBoxMenuItems is deprecated');var menu=document.createDocumentFragment();var values=Qualtrics.getArrayValues(items);if(values&&values.length)
{for(var i=0,len=values.length;i<len;++i)
{menu.appendChild(QBuilder('li',{},[QBuilder('a',{className:'MenuItemLink',href:'javascript:void(0)',clickcallback:'QMenu.setComboBoxValue',p1:inputId,p2:values[i]},[values[i]])]));}}
else
{menu.appendChild(QBuilder('li',{style:'width:100px'},'\xa0'));}
return menu;},setComboBoxValue:function(id,val)
{console.warn('setComboBoxValue is deprecated');$(id).value=val;Qualtrics.Event.baseDistributerReader(null,$(id),'comboboxupdatecallback');},hideMenuOnMouseOut:function()
{Qualtrics.Menu.hideMenuOnMouseOut();},refreshMenu:function()
{Qualtrics.Menu.refreshMenu();}};

window.QPDFPrinter={pageSizes:{Letter:{width:935,height:1210},Legal:{width:935,height:1541},A4:{width:910,height:1286}},pageSizeOffset:1,pageMargin:25,enablePDF:true,getStylesheets:function()
{var styleSheets=document.styleSheets;var ret='<style>\n';for(var i=0;i<styleSheets.length;i++)
{var href=styleSheets[i].href;var cssRules=styleSheets[i].cssRules;var path='';if(href)
{path=href.substr(0,href.lastIndexOf('/'));path=path.substr(0,path.lastIndexOf('/'));}
for(var j=0;j<cssRules.length;j++)
{var css=cssRules[j].cssText;if(css.indexOf('../')!=-1)
{css=css.replace('..',path);}
ret+=css+'\n';}}
ret+='</style>\n';return ret;},getStylesheetLinks:function(altWindow)
{var ret='';var doc=document;var win=window;if(altWindow)
{win=altWindow;doc=win.document;}
try{var styleSheets=doc.styleSheets;var path=win.location.href;path=path.substr(0,path.lastIndexOf('/'));path=path.substr(0,path.lastIndexOf('/'));for(var i=0;i<styleSheets.length;i++)
{var href=styleSheets[i].href;if(href)
{if(href.indexOf('../')!=-1)
{href=href.replace('..',path);}
href+=((href.indexOf('?')!=-1)?'&x=':'?=')+Math.random();ret+='<link rel="stylesheet" type="text/css" href="'+href+'" />\n';}
else
{var cssRules=styleSheets[i].cssRules||styleSheets[i].rules;ret+='<style>';for(var j=0;j<cssRules.length;j++)
{var css=cssRules[j].cssText;if(css)
{if(css.indexOf('../')!=-1)
{css=css.replace('..',path);}
ret+=css+'\n';}}
ret+='</style>';}}}
catch(e)
{console.error(e);}
return ret;},showDialog:function(buttons,options)
{if(Qualtrics.Browser.IE&&Qualtrics.Browser.Version<7)
{alert('PDF creation is not currently supported in Internet Explorer 6. Please upgrade your browser.');return;}
options=options||{};if(Qualtrics.pdfOptions)
{Object.extend(options,Qualtrics.pdfOptions);}
var filenameInput=QBuilder('div',{},[QBuilder('label',{},'File name'),QBuilder('input',{className:'TextBox',id:'pdffilename',name:'pdffilename',value:options.filename})]);var poCheck=QBuilder('input',{type:'radio',id:'pdforientationPortrait',name:'pdforientation'});var loCheck=QBuilder('input',{type:'radio',id:'pdforientationLandscape',name:'pdforientation'});var popts={'letter':QBuilder('option',{value:'Letter'},'Letter'),'legal':QBuilder('option',{value:'Legal'},'Legal'),'a4':QBuilder('option',{value:'A4'},'A4')};if(options.pageSize)
{$(popts[options.pageSize]).writeAttribute('selected');}
var pageSize=QBuilder('select',{id:'pdfPageSize',name:'pdfpageSize'},Object.values(popts));if(options.orientation=='landscape')
{loCheck.checked=true;loCheck.defaultChecked=true;}
else
{poCheck.checked=true;poCheck.defaultChecked=true;}
var orientationInput=QBuilder('div',{id:'PDFOrientationInput'},[poCheck,QBuilder('label',{htmlFor:'pdforientationPortrait'},'Portrait'),loCheck,QBuilder('label',{htmlFor:'pdforientationLandscape'},'Landscape'),QBuilder('br'),QBuilder('label',{htmlFor:'pdfPageSize'},'Page Size'),pageSize]);var autoSizeInput='';if(!options.noResizeOption)
{QBuilder('fieldSet',{},[QBuilder('input',{type:'checkbox',name:"AutoSizePDFToggle",id:"AutoSizePDFToggle",clickcallback:'QPDFPrinter.toggleAutoSize:'+this.id}),QBuilder('label',{htmlFor:"AutoSizePDFToggle"},"Do not resize content")]);}
var panel=QBuilder('div',{className:'pdfExportOptions'},[filenameInput,autoSizeInput,orientationInput]);QPDFPrinter.options=options;var win=new Q_Window({id:'QPDFPrinter',width:'auto',height:'auto',title:options.title||'PDF Export',zIndex:options.zIndex,buttons:buttons});win.setContent(panel);},printPDF:function(nodeList,options)
{QPDFPrinter.nodeList=nodeList;var buttonText=options.exportButtonText?options.exportButtonText:'Export';var buttons=[{icon:'cancel',text:'Close',click:'QPDFPrinter.close',className:'negative'},{icon:'',text:buttonText,click:'QPDFPrinter.printFromDialog',className:'positive'},{icon:'',text:'Preview',id:'PDFPreviewButton',click:'QPDFPrinter.printPreview',className:'positive',align:"left"}];this.showDialog(buttons,options);},toggleAutoSize:function()
{$('PDFPreviewButton').toggle();$('PDFOrientationInput').toggle();QPDFPrinter.options.noAutoSize=$('AutoSizePDFToggle').checked;},printPreview:function()
{var win=new Q_Window({id:'QPDFPrinterPreview',width:'90%',height:'90%',title:'PDF Export',buttons:[{icon:'cancel',text:'Close',click:'Q_Window.closeWindow(QPDFPrinterPreview)',className:'negative'},{icon:'',text:'Export',click:'QPDFPrinter.printFromDialog',className:'positive'}]});this.buildPages();var previewPages=[];if(QPDFPrinter.options.noAutoPage)
{previewPages=this.pages;}
else
{for(var i=0,ilen=this.pages.length;i<ilen;i++)
{var page=this.pages[i];var width=parseInt($(page).getStyle('width'));if(width>this.pageWidth)
{page=QBuilder('div',{},[page]);var wScale=(this.pageWidth)/width;$(page).setStyle({'zoom':wScale,'MozTransform':'scale('+wScale+')','MozTransformOrigin':'left top'});}
var prevPage=QBuilder('div',{className:"PDFPreviewPage"},[page]);$(prevPage).setStyle({"width":(this.pageWidth+2*this.pageMargin)+"px","height":(this.pageHeight+2*this.pageMargin)+"px"});previewPages.push(prevPage);}}
var preview=QBuilder('div',{className:'PDFPreview'},previewPages);win.setContent(preview);var zoom=($('QPDFPrinterPreview').offsetWidth-40)/(this.pageWidth+2*this.pageMargin);if(zoom<1)
{var style={'zoom':zoom,'MozTransform':'scale('+zoom+')','MozTransformOrigin':'left top'};$(preview).setStyle(style);}},generateNodeInfo:function()
{if(!(QPDFPrinter.nodeList instanceof Array))
{QPDFPrinter.nodeList=new Array(QPDFPrinter.nodeList);}
var nodeList=QPDFPrinter.nodeList;var nodeInfo=[];var max={};var min={};for(var i=0,ilen=nodeList.length;i<ilen;i++)
{var node=nodeList[i];if(!node)
continue;var dims={'width':node.offsetWidth,'height':node.offsetHeight};if(dims.height==0||dims.width==0)
{QualtricsTools.addToHiddenHelper(node);dims=$(node).getDimensions();}
var count=1;var child=$(node).down(count);var childWidth=$(child).getWidth();while(count<3&&typeof child!='undefined'&&dims.width<childWidth)
{dims.width=childWidth;count++;child=$(node).down(count);childWidth=$(child).getWidth();}
if(!max.width||max.width<dims.width)
{max.width=dims.width;}
if(!max.height||max.height<dims.height)
{max.height=dims.height;}
if(!min.width||min.width>dims.width)
{min.width=dims.width;}
if(!min.height||min.height>dims.height)
{min.height=dims.height;}
nodeInfo.push({size:dims,index:i});}
this.nodeInfo={max:max,min:min,info:nodeInfo};return this.nodeInfo.info;},buildPages:function()
{this.pages=[];var options=QPDFPrinter.options;if(options.noAutoPage)
{this.pages=this.nodeList;return;}
this.generateNodeInfo();var pageSize=$('pdfPageSize').value||"Letter";var orientation=($('pdforientationLandscape')&&$('pdforientationLandscape').checked)?"Landscape":"Portrait";pageSize=this.pageSizes[pageSize];var pageMargin=this.pageMargin;this.pageWidth=((orientation=="Landscape")?pageSize.height:pageSize.width)-2*pageMargin;this.pageHeight=((orientation=="Landscape")?pageSize.width:pageSize.height)-2*pageMargin;var pageHeightDif=0;var pageArray=[];var scale=1;for(var i=0,ilen=this.nodeInfo.info.length;i<ilen;i++)
{var newScale=scale;var nodeInfo=this.nodeInfo.info[i];var node=this.nodeList[nodeInfo.index].cloneNode(true);if(nodeInfo.size.width>this.pageWidth*scale||nodeInfo.size.height>this.pageHeight*scale)
{newScale=this.getPageScale(this.pageWidth,this.pageHeight,nodeInfo.size.width,nodeInfo.size.height);if(newScale<scale)
newScale=scale;}
if(nodeInfo.size.height>this.pageHeight*newScale-pageHeightDif)
{this.addPage(pageArray,scale);pageHeightDif=0;pageArray=[];newScale=Math.max(this.getPageScale(this.pageWidth,this.pageHeight,nodeInfo.size.width,nodeInfo.size.height),1);}
scale=newScale;pageArray.push(node);pageHeightDif+=nodeInfo.size.height;}
this.addPage(pageArray,scale);QPDFPrinter.options.margin=0;QPDFPrinter.options.baseCSS="";},addPage:function(pageArray,scale)
{var pageClass=QPDFPrinter.options.pageClass||"";var page=QBuilder('div',{className:'PDFPage '+pageClass},pageArray);$(page).setStyle({"width":(this.pageWidth*scale)+"px","height":(this.pageHeight*scale)+"px","margin":(this.pageMargin*scale)+"px "
+(this.pageMargin*scale)+"px 0"});this.pages.push(page);},getPageScale:function(pageWidth,pageHeight,itemWidth,itemHeight)
{var widthScale=(itemWidth)/pageWidth;var heightScale=itemHeight/pageHeight;var scale=widthScale>heightScale?widthScale:heightScale;return scale;},printFromDialog:function()
{var nodeList=this.nodeList;var options=QPDFPrinter.options;if(!options.noResizeOption)
{if(options.noAutoSize)
{this.generateNodeInfo();options.nodeInfo=this.nodeInfo.info;}
else
{this.buildPages();nodeList=QPDFPrinter.pages;}}
if($('pdffilename')&&$('pdffilename').value)
{var filename=$('pdffilename').value;if(filename.indexOf('.pdf')==-1)
{filename+='.pdf';}
options.filename=filename;}
if($('pdforientationLandscape')&&$('pdforientationLandscape').checked)
{options.orientation='landscape';}
if($('pdforientationPortrait')&&$('pdforientationPortrait').checked)
{options.orientation='portrait';}
if($('pdfPageSize'))
{options.size=$('pdfPageSize').value;}
if(!options.ajaxAction&&!options.skipAlert)
{QualtricsCPTools.showTip('GenericDownload',{onComplete:function(){QPDFPrinter.print(nodeList,options);}});}
else
{QPDFPrinter.print(nodeList,options);}
QPDFPrinter.close();},close:function()
{Q_Window.closeWindow('QPDFPrinterPreview');Q_Window.closeWindow('QPDFPrinter');},getJSONHTML:function(nodeList,options)
{options=options||{};var htmlArray=[];var css='';var baseCSS=options.baseCSS||"overflow:hidden; float:left;";var path=window.location.href;path=path.substr(0,path.lastIndexOf('/'));path=path.substr(0,path.lastIndexOf('/'))+'/';if(typeof(options.includeCSS)!='undefined'&&options.includeCSS)
{var altWindow=null;if(options.iframe)
{altWindow=options.iframe.contentWindow;}
css=this.getStylesheetLinks(altWindow);}
if(options.customCSS)
{css+='<style>'+options.customCSS+'</style>';}
if(!(nodeList instanceof Array))
{nodeList=new Array(nodeList);}
for(var i=0,ilen=nodeList.length;i<ilen;i++)
{var node=nodeList[i].cloneNode(true);var outer=QBuilder('div',{},[node]);var baseHTML=outer.innerHTML;if(baseHTML.indexOf('../')!=-1)
{baseHTML=baseHTML.replace(/\.\.\//g,path);}
var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html><head><meta http-equiv="content-type" content="text/html; charset=UTF-8" />'+css+'</head><body style="min-width:0; background:#fff;">';html+='<div style="'+baseCSS+'" class="ToPDF">'+baseHTML+'</div></body></html>';html=html.replace(/-moz-use-text-color/g,'');htmlArray.push(html);}
return Object.toJSON(htmlArray);},print:function(nodeList,options)
{options=options||{};options.paginate=true;var jsonHTML=this.getJSONHTML(nodeList,options);var external=false;if(typeof(options.external)!='undefined')
{external=options.external;}
if(this.canExportPDF(jsonHTML))
{if(options.ajaxAction)
{new Ajax.Request('Ajax.php?action='+options.ajaxAction,{parameters:{HTML:jsonHTML,Options:Object.toJSON(options)},onComplete:options.ajaxOnComplete});}
else if(window.PageAction)
{delete options.iframe;var clientAction=options.clientAction||'GeneratePDF';options=Object.toJSON(options);PageAction(clientAction,jsonHTML,options,null,true,external);}
else
{QPDFPrinter.postWith('PDF.php',{Section:jsonHTML,SubSection:Object.toJSON(options)});}}
else
{alert('Report is too large to be exported');}},canExportPDF:function(jsonHTML)
{return jsonHTML.length<16000000;},postPrintPDF:function(action,parameters,options)
{QPDFPrinter.postAction=action;QPDFPrinter.postParameters=parameters;var buttonText=options.exportButtonText?options.exportButtonText:'Export';var buttons=[{icon:'cancel',text:'Close',click:'QPDFPrinter.close',className:'negative'},{icon:'',text:buttonText,click:'QPDFPrinter.postPrintFromDialog',className:'positive'},{icon:'',text:'Preview',id:'PDFPreviewButton',click:'QPDFPrinter.postPrintPreview',className:'positive',align:"left"}];this.showDialog(buttons,options);},postPrintPreview:function()
{var action=QPDFPrinter.postAction;var parameters=QPDFPrinter.postParameters;var win=new Q_Window({id:'QPDFPrinterPreview',width:'90%',height:'90%',title:'PDF Export',buttons:[{icon:'cancel',text:'Close',click:'Q_Window.closeWindow(QPDFPrinterPreview)',className:'negative'},{icon:'',text:'Export',click:'QPDFPrinter.postPrintFromDialog',className:'positive'}]});var waiter=QBuilder('div',{},[QAjaxWaiter.showMediumRing()]);var panel=QBuilder('div',{},[waiter]);$(panel).setStyle({zoom:1});$(waiter).setStyle({width:'800px'});var that=this;new Ajax.Request('Ajax.php?action='+action,{parameters:parameters,evalScripts:true,onComplete:function(transport)
{try{var html=transport.responseText;that.nodeList=[];var htmlList=html.split("<!-- ~BREAK~ -->");for(var i=0;i<htmlList.length;i++)
{if(!htmlList[i])
continue;var node=QBuilder('div');node.innerHTML=htmlList[i];that.nodeList.push(node);}
that.buildPages();QPDFPrinter.options.margin=25;var previewPages=[];if(QPDFPrinter.options.noAutoPage)
{previewPages=that.pages;}
else
{for(var i=0,ilen=that.pages.length;i<ilen;i++)
{var page=that.pages[i];var width=parseInt($(page).getStyle('width'));if(width>that.pageWidth)
{page=QBuilder('div',{},[page]);var wScale=(that.pageWidth)/width;$(page).setStyle({'zoom':wScale,'MozTransform':'scale('+wScale+')','MozTransformOrigin':'left top'});}
var prevPage=QBuilder('div',{className:"PDFPreviewPage"},[page]);$(prevPage).setStyle({"width":(that.pageWidth+2*that.pageMargin)+"px","height":(that.pageHeight+2*that.pageMargin)+"px"});previewPages.push(prevPage);}}
var preview=QBuilder('div',{className:'PDFPreview'},previewPages);win.setContent(preview);}
catch(e){console.error(e);}}});win.setContent(panel);},postPrintFromDialog:function()
{var action=QPDFPrinter.postAction;var parameters=QPDFPrinter.postParameters;var options=QPDFPrinter.options;if($('pdffilename')&&$('pdffilename').value)
{var filename=$('pdffilename').value;if(filename.indexOf('.pdf')==-1)
filename+='.pdf';options.filename=filename;}
if($('pdforientationLandscape')&&$('pdforientationLandscape').checked)
{options.orientation='landscape';}
if($('pdforientationPortrait')&&$('pdforientationPortrait').checked)
{options.orientation='portrait';}
if($('pdfPageSize'))
{options.size=$('pdfPageSize').value;}
QPDFPrinter.postPrint(action,parameters,options);QPDFPrinter.close();},postWith:function(to,p)
{var myForm=document.createElement("form");myForm.method="post";myForm.action=to;for(var k in p)
{var myInput=document.createElement("textarea");myInput.setAttribute("name",k);myInput.value=p[k];myForm.appendChild(myInput);}
document.body.appendChild(myForm);myForm.submit();document.body.removeChild(myForm);},postPrint:function(action,parameters,options)
{var p={};p.Parameters=Object.toJSON(parameters);p.Options=Object.toJSON(options);p.PostAction=action;this.postWith('?ClientAction=PrintPDF',p);}};

var QXLSPrinter={printXLS:function(html,options)
{var jsonHTML=Object.toJSON(html);var clientAction=options.clientAction||'GenerateXLS';PageAction(clientAction,jsonHTML,Object.toJSON(options),null,true,null,null,true);}};

QComboBox={reg:{},cachedLists:{},destroyAll:function()
{for(var id in QComboBox.reg)
{QComboBox.destroy(id);}},destroy:function(id)
{if(QComboBox.reg[id].inputObserver)
QComboBox.reg[id].inputObserver.stop();},buildComboBoxButton:function(options)
{options.p1='$options';options.direction='left';var p3='';if(options)
{if(typeof options!='string')
{p3=Object.toJSON(options);}}
var buttonId=(options&&options.buttonId)||QualtricsCPTools.createNewId('BTN');var button=QBuilder('button',{type:'button',id:buttonId,className:'ComboBoxButton',downcallback:'QMenu.showMenu',p1:'QComboBox.buildComboBoxList',p2:'$el',p3:p3},'V');return button;},replaceSelect:function(select,options)
{select=$(select);var opts=select.options;var name=select.getAttribute('name');var id=select.getAttribute('id');var precache={};var defaultValue=opts[0].value;var defaultText=opts[0].text;var autoComplete=true;if(options.autoComplete===false)
autoComplete=false;for(var i=0,ilen=opts.length;i<ilen;i++)
{var opt=opts[i];var value=opt.value;var text=opt.text;precache[value]=text;if(opt.selected||(opt.hasAttribute&&opt.hasAttribute('selected')))
{defaultText=text;defaultValue=value;}}
if(!this.list)
this.list={};this.list[name]=precache;var comboBoxOpts={inputId:id+'Text',inputName:name+'Text',inputValueID:id,autoSearch:false,inputBoxParameterName:name,defaultValue:defaultValue,defaultText:defaultText,selectedField:'',onSelectCallBack:'',cacheAjaxResults:false,precachedList:precache,replaceSelect:true,autoComplete:autoComplete};if(typeof options=='object')
Object.extend(comboBoxOpts,options);var comboBox=QComboBox.buildComboBox(comboBoxOpts);var parent=select.parentNode;if(parent)
{parent.appendChild(comboBox);Element.remove($(select));}
return comboBox;},buildComboBox:function(options)
{if(!options)
options={};var inputId='';if(options.inputId)
inputId=options.inputId;else
{inputId=QualtricsCPTools.createNewId('CMB');options.inputId=inputId;}
var inputName='';if(options.inputName)
inputName=options.inputName;else
inputName=inputId;if(options.filterOnClick===null)
options.filterOnClick=false;if(options.showButton==undefined)
options.showButton=true;options.type='ComboBox';var autoclearClass='';var inputClass='';if(options.inputClass!==null)
inputClass=' '+options.inputClass;var defaultValue='';var defaultText='';if(options.defaultValue)
defaultValue=options.defaultValue;if(options.defaultText)
defaultText=options.defaultText;if(options.prompt)
{autoclearClass=' AutoClearMessage';defaultText=options.prompt;}
var inputField=QBuilder('input',{autocomplete:'off',className:'TextBox'+autoclearClass+inputClass,type:'text',id:inputId,name:inputName,value:defaultText});if(options.prompt)
{inputField.setAttribute('autoclear',options.prompt);}
var button='';if(options.showButton)
button=QComboBox.buildComboBoxButton(options);var comboBox=QBuilder('div',{className:'QComboBox'},[inputField,button]);QComboBox.reg[inputId]={};if(options.autoSearch)
QComboBox.reg[inputId].inputObserver=new Form.Element.Observer(inputField,1,QComboBox.showComboBoxList);if(options.autoComplete&&options.precachedList)
{inputField.setAttribute('qautocomplete','QComboBox.getCachedList('+options.inputBoxParameterName+')');QModules.loadModule('QAutoComplete.js');}
QComboBox.reg[inputId].options=options;QComboBox.reg[inputId].button=button;QComboBox.reg[inputId].input=inputField;QComboBox.reg[inputId].showComboBox=true;if(options.selectedField)
{if(!$(options.selectedField))
{var input=QBuilder('input',{type:'hidden',id:options.selectedField,name:options.selectedField});if(defaultValue)
input.value=defaultValue;comboBox.appendChild(input);QComboBox.reg[inputId].hiddenInput=input;}
else
{QComboBox.reg[inputId].hiddenInput=$(options.selectedField);}}
if(options.replaceSelect)
{var input=QBuilder('input',{type:'hidden',id:options.inputValueID,name:options.inputBoxParameterName});if(defaultValue)
input.value=defaultValue;comboBox.appendChild(input);QComboBox.reg[inputId].hiddenInput=input;}
if(options.emulateSelect)
{Event.observe(inputField,'keypress',function(e){Event.stop(e)});inputField.addClassName('readonly');if(options.precachedList)
{var firstID;var firstValue;for(var id in options.precachedList)
{firstID=id;firstValue=options.precachedList[id];break;}
QComboBox.reg[inputId].hiddenInput.value=firstID;inputField.value=firstValue;}
inputField.setAttribute('clickcallback','QComboBox.showComboBoxListOnClick($evt)');}
else if(options.replaceSelect)
{new Form.Element.Observer(inputField,.2,function(el,value){input.value=value;});}
if(options.onEnter)
{Event.observe(inputField,'keypress',options.onEnter);}
return comboBox;},clearCache:function()
{this.cachedLists={};},getCachedList:function(name)
{return this.list[name];},getInstance:function(id)
{if(QComboBox.reg[id])
return QComboBox.reg[id];else
return false;},insertSelectedValue:function(id,key,value)
{var comboBox=QComboBox.getInstance(id);if(comboBox)
{comboBox.showComboBox=false;if(comboBox.hiddenInput)
comboBox.hiddenInput.value=key;if(comboBox.input)
{$(comboBox.input).removeClassName('AutoClearMessage');comboBox.input.value=value;$(comboBox.input).addClassName('validated');}
if(comboBox.options.onSelectCallBack)
{var callback=comboBox.options.onSelectCallBack;callback();}
setTimeout(function(){comboBox.showComboBox=true},1000);}},disable:function(id)
{var comboBox=QComboBox.getInstance(id);comboBox.showComboBox=false;},enable:function(id)
{var comboBox=QComboBox.getInstance(id);comboBox.showComboBox=true;},remove:function(id)
{if($('QMenu'))
$('QMenu').remove();},showComboBoxListOnClick:function(e)
{var el=Event.element(e);var val='';if(el.tagName=='INPUT')
val=el.value;this.showComboBoxList(el,val);},showComboBoxList:function(el,value)
{var comboBox=QComboBox.getInstance(el.id);if(comboBox)
{if(comboBox.showComboBox)
{var options=comboBox.options;var button=comboBox.button;if(comboBox.input)
{comboBox.input.value=value;$(comboBox.input).removeClassName('validated');}
options.filterOnClick=true;if(value!='')
QMenu.showMenu('QComboBox.buildComboBoxList',button,Object.toJSON(options));else
{QComboBox.remove(el.id);}}}},buildComboBoxList:function(options)
{options=this.processOptions(options);var url='';if(options.url)
url=options.url;var params={};if(options.params)
params=options.params;var searchVal='';if(options.autoSearch&&options.filterOnClick&&options.inputBoxParameterName)
{searchVal=$F(options.inputId);params[options.inputBoxParameterName]=searchVal;}
var menu=QBuilder('ul',{className:'ComboBox',id:options.inputId+'_menu'});menu.appendChild(QBuilder('li',{className:'Loading'},[]));var cacheAjaxResults=true;var useAjax=true;if(options.cacheAjaxResults!==undefined)
{cacheAjaxResults=options.cacheAjaxResults;}
if(searchVal!='')
{cacheAjaxResults=false;}
if(cacheAjaxResults&&QComboBox.cachedLists[options.inputId])
{useAjax=false;}
if(options.precachedList)
{useAjax=false;QComboBox.cachedLists[options.inputId]=options.precachedList;}
var ajaxIndex='List';if(options.AjaxResultIndex)
ajaxIndex=options.AjaxResultIndex;var noResults=true;if(useAjax)
{new Ajax.Request('Ajax.php?action='+options.ajaxAction,{parameters:params,onComplete:function(transport)
{deleteChildren(menu);try{var items=transport.responseText.evalJSON();}catch(e){}
console.log('items',items);var list=items[ajaxIndex];if(cacheAjaxResults)
{QComboBox.cachedLists[options.inputId]=list;}
console.log('list',list);if(list&&Object.values(list).length&&!(list instanceof Array))
{for(var id in list)
{var listEntry=String(list[id]);var regEx=new RegExp(searchVal,'i');var match=listEntry.match(regEx);if(match)
{noResults=false;var innerText=listEntry.replace(regEx,"<span class='match'>"+match+"</span>");var inner=QBuilder('a',{className:'MenuItemLink',href:'javascript:void(0)',clickcallback:'QComboBox.insertSelectedValue',p1:options.inputId,p2:id,p3:list[id]});inner.innerHTML=innerText;menu.appendChild(QBuilder('li',{},[inner]));}}}
if(noResults)
{menu.appendChild(QBuilder('li',{className:'NoResults'},getMessage('SiteWide','NoResults')));}
QComboBox.resizeOnChange(menu);}});}
else
{deleteChildren(menu);var list=QComboBox.cachedLists[options.inputId];if(list&&Object.values(list).length&&!(list instanceof Array))
{for(var id in list)
{var listEntry=String(list[id]);var regEx=new RegExp(searchVal,'i');var match=listEntry.match(regEx);if(match)
{noResults=false;var innerText=listEntry.replace(regEx,"<span class='match'>"+match+"</span>");var inner=QBuilder('a',{className:'MenuItemLink',href:'javascript:void(0)',clickcallback:'QComboBox.insertSelectedValue',p1:options.inputId,p2:id,p3:list[id]});inner.innerHTML=innerText;menu.appendChild(QBuilder('li',{},[inner]));}}}
if(noResults)
{menu.appendChild(QBuilder('li',{className:'Loading'},getMessage('SiteWide','NoResults')));}}
return QBuilder('div',{className:'OverflowWrapper'},[menu]);},resizeOnChange:function(menuDiv)
{var viewHeight=getPageSize()[3];var viewBottom=scrollInfo[1]+viewHeight;var menuHeight=menuDiv.offsetHeight;var topPos=$(menuDiv).cumulativeOffset().top;var clippedY=topPos+menuHeight-(viewBottom-10);if(clippedY>0)
{$(menuDiv).setStyle({height:menuHeight-clippedY+'px',overflowY:'scroll',width:(menuDiv.offsetWidth+20)+'px'});}},processOptions:function(options)
{if(typeof options=='string')
{options=options.evalJSON();}
return options;}};Qualtrics.ComboBox=Class.create({initialize:function(options)
{this.id=QualtricsCPTools.createNewId('CMB');Qualtrics.ComboBox.reg[this.id]=this;options=options||{};if(!options.inputId)
options.inputId=QualtricsCPTools.createNewId('CMB');if(!options.hiddenInputId)
options.hiddenInputId=QualtricsCPTools.createNewId('CMBHI');if(!options.inputName)
options.inputName=QualtricsCPTools.createNewId('CMB');if(!options.hiddenInputName)
options.hiddenInputName=QualtricsCPTools.createNewId('CMB');if(!options.buttonId)
options.buttonId=QualtricsCPTools.createNewId('CMB');this.options=options;var listOptions={combobox:this,listType:'qAutoComplete'};if(options.filtered)
{listOptions.filtered=options.filtered;}
Object.extend(listOptions,this.options.list);if(options.list.type=='static')
{this.activelist=new Qualtrics.ComboBoxStaticList(listOptions);}
else if(options.list.type=='ajax')
{this.activelist=new Qualtrics.ComboBoxAjaxList(listOptions);}
else if(options.list.type=='dynamicSectioned')
{this.activelist=new Qualtrics.ComboBoxDynamicListSectioned(listOptions);}
else if(options.list.type=='dynamic')
{this.activelist=new Qualtrics.ComboBoxDynamicList(listOptions);}},build:function()
{this.input=this.buildInput();this.hiddenInput=this.buildHiddenInput();this.button=this.buildButton();if(this.options.disableInput)
{this.cover=QBuilder('div',{className:'cover',downcallback:'Qualtrics.ComboBox.showListOnButtonClick',instanceid:this.id});var that=this;(function(){Element.clonePosition(that.cover,that.input);}).defer();}
else
{this.cover='';}
var className='QComboBox';if(this.options.className)
className+=(' '+this.options.className);var comboBox=QBuilder('div',{className:className},[this.input,this.button,this.hiddenInput,this.cover]);return comboBox;},buildInput:function()
{var attrs={autocomplete:'off',className:'TextBox',type:'text',id:this.options.inputId,name:this.options.inputName,instanceid:this.id,comboboxhiddeninput:this.options.hiddenInputId,keyupcallback:'Qualtrics.ComboBox.keyUpCallback:'+this.id+'($evt, $el, $val)'};if(this.options.autoComplete)
attrs.qautocomplete='Qualtrics.ComboBox.getActiveList';if(this.options.inputClass)
attrs.className+=' '+this.options.inputClass;if(this.options.validation)
attrs.validation=this.options.validation;if(this.options.charSet)
attrs.charSet=this.options.charSet;if(this.options.keyentercallback)
attrs.keyentercallback=this.options.keyentercallback;if(this.options.keydowncallback)
attrs.keydowncallback=this.options.keydowncallback;var inputField=QBuilder('input',attrs);var text='';if(this.options.defaultValue!==undefined)
{if(this.options.skipValueLookup)
text=this.options.defaultValue;else
text=this.activelist.getValue(this.options.defaultValue);if(text===false)
{var list=this.activelist;if(!this.options.skipValueLookup)
{list.updateValue.bind(list).defer(this.options.defaultValue);}
text=this.options.defaultValue;}}
if(this.options.defaultText||this.options.defaultText=='')
{text=this.options.defaultText;}
if(text==''&&this.options.prompt)
{$(inputField).addClassName('AutoClearMessage');inputField.setAttribute('autoclear',this.options.prompt);text=this.options.prompt;}
inputField.value=text;if(this.options.disableInput)
{Event.observe(inputField,'keypress',function(e){Event.stop(e)});Event.observe(inputField,'focus',function(e){inputField.blur();Event.stop(e);});}
return inputField;},buildHiddenInput:function()
{var defaultValue='';if(this.options.defaultValue)
defaultValue=this.options.defaultValue;var input=QBuilder('input',{type:'hidden',id:this.options.hiddenInputId,name:this.options.hiddenInputName,value:defaultValue,comboboxinput:this.options.inputId});return input;},buildButton:function()
{if(this.options.hasOwnProperty('showButton')&&!this.options.showButton)
return'';var button=QBuilder('button',{tabindex:'-1',type:'button',id:this.options.buttonId,className:'ComboBoxButton',preventdragscroll:true,downcallback:'Qualtrics.ComboBox.showListOnButtonClick:'+this.id+'($evt)'},[QBuilder('span')]);return button;},showListOnButtonClick:function(evt)
{evt=evt||window.evt;Event.stop(evt);if(this.menupane&&this.menupane.menuDom)
{this.hideList();}
else
{this.showList();}},hideList:function()
{if(this.menupane&&this.menupane.menuDom)
this.menupane.destroy();},showList:function()
{var params=this.activelist.getMenuParameters();var options={className:'ComboBoxMenuPane',input:this.input,escapeCallback:'Qualtrics.ComboBox.focusInput:'+this.id};this.menupane=new Qualtrics.ComboBoxMenuPane(params,this.button,null,options);},focusInput:function()
{this.input&&this.input.focus();},searchList:function()
{},getActiveList:function()
{return this.activelist.getList();},getText:function()
{var v=this.input.value;if(v==this.input.getAttribute('autoclear'))
return'';return this.input.value;},getValue:function()
{return this.hiddenInput.value;},keyUpCallback:function(evt,el,val)
{this.inputChange(el,val);if(this.options.keyupcallback)
Qualtrics.Event.execute(this.options.keyupcallback,[evt,el,val]);},inputChange:function(el,value)
{var key=this.activelist.getKey(value);if(key===false)
{var list=this.activelist;list.updateValue.bind(list).defer(key);key=value;}
if(!this.options.updateKeyOnSelect)
{this.setHiddenInput(key);}
if(this.options.onChange)
Qualtrics.Event.execute(this.options.onChange,[this.hiddenInput.value,this.input.value]);},setInput:function(val)
{if(this.input.value!=val)
{this.input.value=val;this.inputChange(null,val);if(this.options.onInputChange)
this.options.onInputChange(this.input);}},setHiddenInput:function(val)
{if(this.hiddenInput.value!=val)
{this.hiddenInput.value=val;if(this.options.onHiddenInputChange)
this.options.onHiddenInputChange(this.hiddenInput);}},selectItem:function(value,text,evt)
{$(this.input).removeClassName('AutoClearMessage');this.setInput(text);this.setHiddenInput(value);if(this.options.onSelect)
{this.options.onSelect(value,text,evt);}}});Qualtrics.ComboBox.reg={};Qualtrics.ComboBox.getInstance=QualtricsCPTools.getInstanceHelper(Qualtrics.ComboBox.reg);Qualtrics.ComboBox.replaceSelect=function(select,options)
{select=$(select);var name=select.getAttribute('name');var id=select.getAttribute('id');var opts=select.options;var precache={};if(opts.length)
{var defaultValue=opts[0].value;var defaultText=opts[0].text;for(var i=0,ilen=opts.length;i<ilen;i++)
{var opt=opts[i];var value=opt.value;var text=opt.text;precache[value]=text;if(opt.selected||(opt.hasAttribute&&opt.hasAttribute('selected')))
{defaultValue=value;}}}
var defaultOptions={inputId:id,hiddenInputName:name,defaultValue:defaultValue,autoSearch:false,autoComplete:false,disableInput:true,list:{type:'static',values:precache}};defaultOptions=Object.extend(defaultOptions,options);var comboBox=new Qualtrics.ComboBox(defaultOptions);var parent=select.parentNode;if(parent)
{parent.appendChild(comboBox.build());Element.remove($(select));}
return comboBox;};Qualtrics.DataList=Class.create({initialize:function(options)
{this.options=options||{};this.list={};this.id=QualtricsCPTools.createNewId('DL');Qualtrics.DataList.reg[this.id]=this;},setList:function(list)
{if(Object.isArray(list))
{var temp={};for(var i=0,ilen=list.length;i<ilen;i++)
{temp[i]=list[i];}
list=temp;}
this.list=list;},getKey:function(val)
{var list=this.getList();for(var id in list)
{if(list[id]==val)
return id;}
return false;},getValue:function(key)
{var list=this.getList();if(list[key])
return list[key];else
return false;},getList:function()
{return this.list||{};}});Qualtrics.DataList.reg={};Qualtrics.DataList.getInstance=QualtricsCPTools.getInstanceHelper(Qualtrics.DataList.reg);Qualtrics.ComboBoxList=Class.create(Qualtrics.DataList,{initialize:function($super,options)
{$super(options);},setList:function(list)
{if(Object.isArray(list))
{var temp={};for(var i=0,ilen=list.length;i<ilen;i++)
{temp[i]=list[i];}
list=temp;}
this.list=list;try
{if(this.options.combobox.input&&this.options.listType&&this.options.combobox.input[this.options.listType])
{this.options.combobox.input[this.options.listType].setList(list);}}
catch(e)
{console.error('error updating autocomplete list: '+e);}},getMenuParameters:function()
{var params=this.buildParameters();return params;},updateValue:function(key)
{var list=this.getList();if(list[key])
{var comboBox=this.options.combobox;comboBox.setInput(this.list[key]);comboBox.setHiddenInput(key);}},buildParameters:function()
{var params={};var items=[];var list=this.getList(true);if(list)
{for(var id in list)
{if(list.hasOwnProperty(id))
{items.push({display:list[id],value:id,action:'Qualtrics.ComboBox.selectItem',parameters:{instanceid:this.options.combobox.id,p1:id,p2:list[id],p3:'$evt'},icon:false});}}}
params.items=items;if(this.options&&this.options.combobox&&this.options.combobox.options&&this.options.combobox.options.search!==undefined)
{params.search=this.options.combobox.options.search;}
return params;}});Qualtrics.ComboBoxStaticList=Class.create(Qualtrics.ComboBoxList,{initialize:function($super,options)
{$super(options);if(options.values)
{this.setList(options.values);}
else
{console.warn('No list values were assigned to the combobox.');}}});Qualtrics.ComboBoxDynamicList=Class.create(Qualtrics.ComboBoxList,{getList:function()
{var c=this.options.combobox;var search=c.options.autoComplete&&c.input.realValue||c.inputvalue;return this.options.listCallback&&Qualtrics.Event.execute(this.options.listCallback,[search])||{};}});Qualtrics.ComboBoxDynamicListSectioned=Class.create(Qualtrics.ComboBoxDynamicList,{buildParameters:function($super)
{if(!this.options.parseFunction)
return $super();var params={};var items=[];var list=this.getList();var subFolders={};if(list)
{for(var id in list)
{var sectionName=this.options.parseFunction(id,list);if(!subFolders[sectionName])
{subFolders[sectionName]={};}
if(list.hasOwnProperty(id))
{subFolders[sectionName][list[id]]={display:list[id],value:id,action:'Qualtrics.ComboBox.selectItem',parameters:{instanceid:this.options.combobox.id,p1:id,p2:list[id],p3:'$evt'},icon:false};}}
for(var folder in subFolders)
{var folderObj=subFolders[folder];items.push({display:folder,value:'Folder|'+folder,className:'Disabled',parameters:{instanceid:this.options.combobox.id},icon:false});for(var item in subFolders[folder])
{items.push(subFolders[folder][item]);}}}
params.items=items;return params;}});Qualtrics.ComboBoxAjaxList=Class.create(Qualtrics.ComboBoxList,{initialize:function($super,options)
{$super(options);if(options.values)
{this.setList(options.values);}},parseAjaxList:function(transport)
{try
{var list=transport.evalJSON();if(list.List&&typeof list.List!='string')
{this.setList(list.List);}
else
{this.setList(list);}}
catch(e)
{console.warn("Invalid combobox list results",transport);this.setList({});}
var params=this.buildParameters();return params;},updateValue:function(key)
{var that=this;this.updateList({onAjaxComplete:function()
{if(that.list[key])
{var comboBox=that.options.combobox;comboBox.setInput(that.list[key]);comboBox.setHiddenInput(key);}
if(that.options.combobox.options.autoSuggest)
{that.options.combobox.showList();}}});},getList:function(opt_refresh)
{if(!opt_refresh)
this.updateList();return this.list;},updateList:function(options)
{if(this.ajaxDelay)
{clearTimeout(this.ajaxDelay);}
var that=this;var delay=20;if(this.options&&this.options.delay)
{delay=this.options.delay;}
this.ajaxDelay=setTimeout(function(){options=options||{};var ajaxParameters=that.getAjaxParameters();new Ajax.CachedRequest('Ajax.php?action='+that.options.ajaxAction,{parameters:ajaxParameters,onComplete:function(transport)
{var response=transport.responseText;that.parseAjaxList(response);if(options.onAjaxComplete)
options.onAjaxComplete();}});},delay);},getAjaxParameters:function(options)
{options=options||{};var comboBox=this.options.combobox;var defaultAjaxParameters={};if(this.options.filtered)
defaultAjaxParameters[comboBox.options.inputName]=comboBox.getText();var params={};if(typeof this.options.ajaxParameters=='function'||typeof this.options.ajaxParameters=='string')
{params=Qualtrics.Event.execute(this.options.ajaxParameters,[comboBox.getText()]);}
else
{params=this.options.ajaxParameters;}
var ajaxParameters=Object.extend(defaultAjaxParameters,params);return ajaxParameters;},getMenuParameters:function()
{var ajaxParameters=this.getAjaxParameters();var params={};params.ajax={action:this.options.ajaxAction,parameters:ajaxParameters,preparser:QualtricsCPTools.buildDotSyntaxString('Qualtrics.ComboBoxAjaxList.parseAjaxList',null,this.id)};return params;}});Qualtrics.ComboBoxAjaxList.getInstance=QualtricsCPTools.getInstanceHelper(Qualtrics.DataList.reg);Qualtrics.ComboBoxMenuPane=Class.create(Qualtrics.MenuPane,{initialize:function($super,menuBuilder,parentButton,opt_parentMenu,options)
{$super(menuBuilder,parentButton,opt_parentMenu,options);},positionMenu:function()
{var input=this.options.input;var inputPos=$(input).cumulativeOffset();var inputScrollOffset=$(input).cumulativeScrollOffset();var comboboxWidth=input.offsetWidth+this.buttonInfo.width-3;if(comboboxWidth>this.menuDom.offsetWidth)
{$(this.menuDom).setStyle({width:comboboxWidth+'px'});}
var menuWidth=this.menuDom.offsetWidth;var menuScrollOffset=$(this.menuDom).cumulativeScrollOffset();var topPos=inputPos.top+input.offsetHeight-(inputScrollOffset.top-menuScrollOffset.top);var leftPos=inputPos.left+1;$(this.menuDom).setStyle({top:topPos+'px',left:leftPos+'px'});this.adjustMenu({topPos:topPos,leftPos:leftPos});},adjustMenu:function(options)
{var topPos=options.topPos||0;var viewHeight=getPageSize()[3];var viewBottom=scrollInfo[1]+viewHeight;var menuHeight=this.menuDom.offsetHeight;var clippedY=topPos+menuHeight-(viewBottom-10);if(clippedY>0)
{$(this.menuDom).setStyle({height:menuHeight-clippedY+'px',overflowY:'scroll',width:(this.menuDom.offsetWidth)+'px'});}}});

Qualtrics.SurveyEngine={registry:{},getInstance:function(id)
{return this.registry[id];},addOnload:function(f)
{if($('body')&&$('body').hasClassName('EditSection'))
return;try
{var obj=new Qualtrics.SurveyEngine.QuestionData();obj.onload=f;Event.observe(window,'load',obj.onload.bind(obj));}
catch(e)
{console.error('SE API Error: '+e);}},addOnUnload:function(f)
{if($('body')&&$('body').hasClassName('EditSection'))
return;try
{var obj=new Qualtrics.SurveyEngine.QuestionData();obj.onload=f;Event.observe(window,'beforeunload',obj.onload.bind(obj));}
catch(e)
{console.error('SE API Error: '+e);}},setAccessibleSkin:function()
{this.addEmbeddedData('ED~Q_Skin','Qualtrics|MQ|Accessible');window.noSEAutoSave=true;submitForm('Page');},addEmbeddedData:function(key,value)
{$('Page').appendChild(QBuilder('input',{type:'hidden',name:key,value:value}));},setEmbeddedData:function(key,value)
{var fieldName='ED~'+key;if($(fieldName))
{$(fieldName).value=value;}
else
{$('Header').appendChild(QBuilder('input',{type:'hidden',id:fieldName,name:fieldName,value:value}));}},getEmbeddedData:function(key)
{var fieldName='ED~'+key;if($(fieldName))
{return $(fieldName).value;}},globalKeyDownHandler:function(evt)
{if(document.body.id=='SurveyEngineBody')
{if(!evt){evt=window.event}
var el=Event.element(evt);if(el&&el.getAttribute)
Qualtrics.alphaNumericValidation(el,evt);var isButton=el.tagName=='BUTTON'||(el.tagName=='INPUT'&&el.type=='button')||(el.id=='NextButton'||el.id=='PreviousButton');if(evt.keyCode==Event.KEY_RETURN&&el.tagName!='TEXTAREA'&&!isButton)
{Event.stop(evt);}}},globalKeyUpHandler:function(evt)
{if(!evt){evt=window.event}
var el=Event.element(evt);if(el.getAttribute('validation'))
{Qualtrics.alphaNumbericInputFilter(evt,el);}},displayErrorMessage:function(msg){alert(msg);},navEnter:function(e,el,opt_buttonName,opt_confirmValidation,jumpIndex)
{e=e||window.event;if(e.keyCode==Event.KEY_RETURN||e.charCode==32)
{Qualtrics.SurveyEngine.navClick(el,opt_buttonName,opt_confirmValidation,jumpIndex);}},navClick:function(el,opt_buttonName,opt_confirmValidation,jumpIndex)
{var setSubmitting=function(opt_buttonName,value){if(opt_buttonName&&$(opt_buttonName)){$(opt_buttonName).setAttribute('submitting',value.toString());}};var event=null;if(el&&!el.nodeName)
{event=el;el=Event.element(el);}
if(el&&el.getAttribute&&el.getAttribute('confirmed'))
{opt_confirmValidation=true;}
if(opt_buttonName=='NextButton'||opt_buttonName=='PreviousButton'||opt_buttonName=='JumpButton')
{window.noSEAutoSave=true;}
if(opt_buttonName=='NextButton'&&Qualtrics.SurveyPage&&Qualtrics.SurveyPage.getInstance())
{var surveyPage=Qualtrics.SurveyPage.getInstance();var info=surveyPage.getValidationInfo();if(info.frontEndValidation&&info.valid==false)
{if(!opt_confirmValidation&&!Qualtrics.SurveyPage.getInstance().validatePage())
{if(event)
{Event.stop(event);}
setSubmitting(opt_buttonName,false);return false;}}
if(Qualtrics.SurveyPage.getInstance().validate)
{if(!opt_confirmValidation&&!Qualtrics.SurveyPage.getInstance().validate())
{if(event)
{Event.stop(event);}
setSubmitting(opt_buttonName,false);return false;}}}
if(opt_buttonName=='PreviousButton'&&Qualtrics.ToC&&!$$('.END_OF_SURVEY').length)
{if(window.Q_Window&&!Q_Window.getInstance('ConfirmBackButton'))
{Qualtrics.SurveyPage.getInstance().confirmBackButton();if(event)
{Event.stop(event);}
setSubmitting(opt_buttonName,false);return false;}}
if(opt_buttonName=='JumpButton')
{if(jumpIndex)
{$('JumpIndex').value=jumpIndex;}
else if($('JumpIndex').value=='')
$('JumpIndex').value=-1;}
if(opt_buttonName&&$('buttonPressed'))
{$('buttonPressed').name=opt_buttonName;$('submitPageFeauBTN').click();}
else if(opt_buttonName&&$(opt_buttonName))
{if($(opt_buttonName).getAttribute('submitting')!='true'){$(opt_buttonName).setAttribute('confirmed',true);setSubmitting(opt_buttonName,true);$(opt_buttonName).click();}}
try{if(el)
{(function(){el.disabled=true;}).defer();(function(){el.disabled=false;setSubmitting(opt_buttonName,false);}).delay(10);}}catch(e)
{}},restartResponse:function()
{window.noSEAutoSave=true;$('Page').appendChild(QBuilder('input',{hidden:'true',value:'true',name:'RestartResponse'}));submitForm('Page');},recordPageStartTime:function()
{if(window.performance&&performance.timing)
{var loadTime=performance.timing.domComplete-performance.timing.fetchStart;new Ajax.Request('Ajax.php?action=RUM',{parameters:{loadTime:loadTime,SurveyID:$F('SurveyID')}});}}};Qualtrics.SurveyEngine.QuestionInfo={};Qualtrics.SurveyEngine.QuestionData=Class.create({questionId:this.questionId||null,questionContainer:this.questionContainer||null,questionclick:this.questionclick||null,initialize:function(opt_questionId)
{var el=null;if(opt_questionId)
{this.questionContainer=$(opt_questionId);}
if(!this.questionContainer)
{var d=document.getElementsByTagName('script');el=d[d.length-1];this.questionContainer=$(el).up('.QuestionOuter')||$(el).up('question');}
if(this.questionContainer)
{this.questionId=this.questionContainer.getAttribute('questionid')||this.questionContainer.getAttribute('posttag');this.addOnClick();Qualtrics.SurveyEngine.registry[this.questionId]=this;}},addOnClick:function()
{this.questionclick=function(){};var that=this;Event.observe(this.questionContainer,'click',(function(event){that.questionclick(event,Event.element(event));}).bind(this));},disableNextButton:function()
{if($('NextButton'))
$('NextButton').disabled=true;},enableNextButton:function()
{if($('NextButton'))
$('NextButton').disabled=false;},showNextButton:function()
{if($('NextButton'))
$('NextButton').show();},hideNextButton:function()
{if($('NextButton'))
$('NextButton').hide();},clickNextButton:function()
{var nextButton=$('NextButton');if(nextButton&&nextButton.click)
nextButton.click();else if(nextButton&&nextButton.onclick)
nextButton.onclick();},disablePreviousButton:function()
{if($('PreviousButton'))
$('PreviousButton').disabled=true;},enablePreviousButton:function()
{if($('PreviousButton'))
$('PreviousButton').disabled=false;},showPreviousButton:function()
{if($('PreviousButton'))
$('PreviousButton').show();},hidePreviousButton:function()
{if($('PreviousButton'))
$('PreviousButton').hide();},clickPreviousButton:function()
{var previousButton=$('PreviousButton');if(previousButton&&previousButton.click)
previousButton.click();else if(previousButton&&previousButton.onclick)
previousButton.onclick();},hideChoices:function()
{var choices=this.getChoiceContainer();if($(choices))
$(choices).hide();},getQuestionContainer:function()
{return this.questionContainer;},getQuestionTextContainer:function()
{return $(this.questionContainer).down('.QuestionText');},getChoiceContainer:function()
{return $(this.questionContainer).down('.ChoiceStructure');},getInput:function(choiceId,answerId,opt_returnArray)
{var postTag=this.getPostTag()||this.questionId;var inputName='QR~'+postTag+((!choiceId!==null&&choiceId!==undefined)?('~'+choiceId):'');var questionType=$('QR~'+postTag+'~QuestionType');var questionSelector=$('QR~'+postTag+'~Selector');if(questionType&&questionType.value==='MC'&&questionSelector&&(questionSelector.value==='DL'||questionSelector.value==='SB'))
{inputName='QR~'+postTag;}
var valueName=inputName+((answerId!==null&&answerId!==undefined)?'~'+answerId:'');var input=null;if($(inputName)&&$(inputName).id==inputName&&($(inputName).nodeName=='INPUT'||$(inputName).nodeName=='TEXTAREA'||$(inputName).nodeName=='SELECT'))
{input=$(inputName);}
else if($(valueName)&&($(valueName).nodeName=='INPUT'||$(valueName).nodeName=='TEXTAREA'||$(valueName).nodeName=='SELECT'))
{input=$(valueName);}
else if($('Select~'+postTag))
{input=$('Select~'+postTag);}
else if($(valueName+'~TEXT'))
{input=$(valueName+'~TEXT');}
else
{if($('Page')[inputName])
{var control=$('Page')[inputName];if(!control.getAttribute)
{for(var i=0,ilen=control.length;i<ilen;i++)
{if(control[i].value==valueName)
{input=control[i];return input;}}
if(opt_returnArray)
{return control;}}
else
{input=control;}}}
return input;},getCurrentVisualTime:function(){try{return $('_'+this.questionId+'Timer').getAttribute('time');}catch(e){}
return undefined;},setChoiceValueByRecodeValue:function()
{var choiceIds=this.getChoicesFromRecodeValue(arguments[0]);for(var i=0,ilen=choiceIds.length;i<ilen;i++)
{var cid=choiceIds[i];if(arguments.length==3)
{this.setChoiceAnswerValue(cid,arguments[1],arguments[2]);}
else
{this.setChoiceAnswerValue(cid,null,arguments[1]);}}},setChoiceValueByVariableName:function()
{var choiceIds=this.getChoicesFromVariableName(arguments[0]);for(var i=0,ilen=choiceIds.length;i<ilen;i++)
{var cid=choiceIds[i];if(arguments.length==3)
{this.setChoiceAnswerValue(cid,arguments[1],arguments[2]);}
else
{this.setChoiceAnswerValue(cid,null,arguments[1]);}}},setChoiceValue:function()
{if(arguments.length==3)
{this.setChoiceAnswerValue(arguments[0],arguments[1],arguments[2]);}
else
{this.setChoiceAnswerValue(arguments[0],null,arguments[1]);}},setChoiceAnswerValue:function(choiceId,answerId,value)
{var input=this.getInput(choiceId,answerId);if(input&&(input.getAttribute('type')||input.tagName))
{var inputType=input.getAttribute('type')||input.tagName;switch(inputType)
{case'checkbox':case'radio':input.checked=value;input.defaultChecked=value;var postTag=this.getPostTag()||this.questionId;var questionInfo=this.getQuestionInfo();if(questionInfo['QuestionType']=='Matrix')
{exclusiveAnswerCheck('QR~'+postTag,'QR~'+postTag+'~'+choiceId,answerId);exclusiveChoiceCheck('QR~'+postTag,'QR~'+postTag+'~'+choiceId,choiceId,answerId);}
else if(questionInfo['QuestionType']=='MC')
{exclusiveAnswerCheck('QR~'+postTag,'QR~'+postTag,choiceId);exclusiveChoiceCheck('QR~'+postTag,'QR~'+postTag,choiceId,choiceId);}
break;case'SELECT':var postTag=this.getPostTag()||this.questionId;var valueName='QR~'+postTag+'~'+choiceId+(answerId!==null?'~'+answerId:'');for(var i=0,iLen=input.options.length;i<iLen;i++)
{if(input.options[i].value==valueName)
{var questionType=$('QR~'+postTag+'~QuestionType');var questionSelector=$('QR~'+postTag+'~Selector');if(questionType&&questionType.value==='MC'&&questionSelector&&(questionSelector.value==='DL'||questionSelector.value==='SB'))
{input.value=input.options[i].value;}
else
{input.options[i].setAttribute('selected',true);}}}
break;default:var postTag=this.getPostTag()||this.questionId;var questionType=$('QR~'+postTag+'~QuestionType');if(questionType&&questionType.value==='Slider')
{var slider=window['CS_'+postTag];var barTag=postTag+'~'+choiceId;if(slider&&slider.snapToGrid)
{value=(Math.round((value/100)*slider.gridLines)/slider.gridLines)*100;}
slider.sliders[barTag].setValue(value/100);}
input.value=value;break;}
return true;}
return false;},getChoiceValue:function(choiceId,subId)
{var ret=false;var input=this.getInput(choiceId,null,true);if(input&&input.getAttribute&&(input.getAttribute('type')||input.tagName))
{var inputType=input.getAttribute('type')||input.tagName;switch(inputType)
{case'checkbox':case'radio':ret=input.checked;break;case'SELECT':var postTag=this.getPostTag()||this.questionId;var valueName='QR~'+postTag+'~'+choiceId+(subId?'~'+subId:'');ret=input.options[input.selectedIndex].value==valueName;break;default:ret=input.value;break;}}
else if(input&&input.length)
{for(var i=0,ilen=input.length;i<ilen;i++)
{if(input[i].checked)
{return input[i].value;}}}
return ret;},getTextValue:function(opt_choiceId)
{var input=null;if(opt_choiceId)
{input=this.getInput(opt_choiceId+'~TEXT',null);}
else
{input=this.getInput();}
if(input)
{return input.value;}},getChoiceAnswerValue:function(choiceId,answerId,subId)
{var ret=null;var input=this.getInput(choiceId,answerId);if(input&&(input.getAttribute('type')||input.tagName))
{var inputType=input.getAttribute('type')||input.tagName;switch(inputType)
{case'checkbox':case'radio':ret=input.checked;break;case'SELECT':var postTag=this.getPostTag()||this.questionId;var valueName='QR~'+postTag+'~'+choiceId+(subId?'~'+subId:'');ret=input.options[input.selectedIndex].value==valueName;break;default:ret=input.value;break;}}
return ret;},getQuestionDisplayed:function()
{var questionIsHidden=this.questionContainer.getAttribute('hiddenbyinpagedisplaylogic')=='true'?true:false;return!questionIsHidden;},getChoiceDisplayed:function(choiceId,answerId,subId)
{var questionIsHidden=this.questionContainer.getAttribute('hiddenbyinpagedisplaylogic')=='true'?true:false;if(questionIsHidden)
{return false;}
var input=this.getInput(choiceId,answerId);if(input)
{if(subId)
{if(input.options[subId])
{return true;}}
else
{return true;}}
return false;},getQuestionInfo:function()
{if(Qualtrics.SurveyEngine&&Qualtrics.SurveyEngine.QuestionInfo&&Qualtrics.SurveyEngine.QuestionInfo[this.questionId])
{return Qualtrics.SurveyEngine.QuestionInfo[this.questionId];}
return null;},getPostTag:function()
{var questionInfo=this.getQuestionInfo();if(questionInfo&&questionInfo.postTag)
{return questionInfo.postTag;}
return null;},getChoiceRecodeValue:function(choiceId)
{var questionInfo=this.getQuestionInfo();if(questionInfo&&questionInfo['Choices'][choiceId])
{return questionInfo['Choices'][choiceId]['RecodeValue'];}},getAnswerRecodeValue:function(answerId)
{var questionInfo=this.getQuestionInfo();if(questionInfo&&questionInfo['Answers']&&questionInfo['Answers'][answerId])
{return questionInfo['Answers'][answerId]['RecodeValue'];}},getChoiceVariableName:function(choiceId)
{var questionInfo=this.getQuestionInfo();if(questionInfo&&questionInfo['Choices'][choiceId])
{return questionInfo['Choices'][choiceId]['VariableName'];}},getChoicesFromVariableName:function(varName)
{return this.getChoicesFromQuestionInfo('VariableName',varName);},getChoicesFromRecodeValue:function(recodeVal)
{return this.getChoicesFromQuestionInfo('RecodeValue',recodeVal);},getChoicesFromQuestionInfo:function(type,val)
{var choices=[];var questionInfo=this.getQuestionInfo();if(questionInfo&&questionInfo['Choices'])
{for(var cid in questionInfo['Choices'])
{if(val==questionInfo['Choices'][cid][type])
{choices.push(cid);}}}
return choices;},getChoices:function()
{var choices=[];var questionInfo=this.getQuestionInfo();if(questionInfo&&questionInfo['Choices'])
{for(var cid in questionInfo['Choices'])
{choices.push(cid);}}
return choices;},getAnswers:function()
{var answers=[];var questionInfo=this.getQuestionInfo();if(questionInfo&&questionInfo['Answers'])
{for(var aid in questionInfo['Answers'])
{answers.push(aid);}}
return answers;},getSelectedChoices:function()
{var choices=this.getChoices();var selectedChoices=[];for(var i=0,len=choices.length;i<len;++i)
{if(this.getChoiceValue(choices[i]))
{selectedChoices.push(choices[i]);}}
return selectedChoices;},getSelectedAnswers:function()
{var choices=this.getChoices();var answers=this.getAnswers();var selectedAnswers={};for(var i=0,len=choices.length;i<len;++i)
{for(var a=0,alen=answers.length;a<alen;++a)
{if(this.getChoiceAnswerValue(choices[i],answers[a]))
{if(!selectedAnswers[answers[a]])
{selectedAnswers[answers[a]]=0;}
selectedAnswers[answers[a]]++;}}}
return selectedAnswers;},getSelectedAnswerValue:function(choiceId)
{var answers=this.getAnswers();var choices=this.getChoices();var selectedAnswerValue=null;for(var a=0,alen=answers.length;a<alen;++a)
{if(this.getChoiceAnswerValue(choiceId,answers[a],answers[a]))
{if(selectedAnswerValue==null||selectedAnswerValue>answers[a])
selectedAnswerValue=answers[a];}}
return selectedAnswerValue;}});Qualtrics.SurveyEngine.QuestionData.getInstance=function(questionId)
{if(Qualtrics.SurveyEngine.registry[questionId])
{return Qualtrics.SurveyEngine.registry[questionId];}
return new Qualtrics.SurveyEngine.QuestionData(questionId);};Qualtrics.SurveyEngine.OnEndOfSurvey=function()
{try
{if(window.top.postMessage&&$('SessionID'))
{var sid=$F('SurveyID');var ssid=$F('SessionID');window.top.postMessage('closeQSIWindow','*');window.top.postMessage('QualtricsEOS|'+sid+'|'+ssid,'*');}
if(window.parent&&window.parent.qualtricsEndOfSurvey)
{window.parent.qualtricsEndOfSurvey.call(window.parent);}}
catch(e)
{console.log(e);}};Qualtrics.SurveyEngine.onPageLoad=function()
{try
{if(window.canCheckParent)
{if(window.parent)
{if(window.parent.qualtricsPageLoad)
{window.parent.qualtricsPageLoad.call(window.parent);}}}}
catch(e)
{}};Qualtrics.SurveyEngine.savePageBeforeUnload=function()
{if(!window.noSEAutoSave)
{if(!$('submitPageFeauBTN'))
{if($('PreviousButton'))
$('PreviousButton').disable();if($('NextButton'))
$('NextButton').disable();}
if($F('SessionID')!='DummySessionID')
$('Page').request({parameters:{SavePageButton:true,ReturnSessionMeta:true},asynchronous:false});if($('PreviousButton'))
(function(){$('PreviousButton').disabled=false;}).defer(0.1);if($('NextButton'))
(function(){$('NextButton').disabled=false;}).defer(0.1);}};Qualtrics.SurveyEngine.changeLanguage=function()
{window.noSEAutoSave=true;submitForm('Page');};Qualtrics.inputClickHelper=function(e)
{e=e||window.event;var el=Event.element(e);var kids=el.childNodes;var count=0;var inputNode=null;if(kids&&kids.length)
{for(i=0;i<kids.length;i++)
{if(kids[i].nodeName=='INPUT'&&(kids[i].type=='radio'||kids[i].type=='checkbox'))
{count++;inputNode=kids[i];}}}
if(el.nodeName=='LABEL'||el.nodeName=='INPUT')
return;if(count==1&&inputNode)
{inputNode.click();}
if(el.parentNode&&el.parentNode.nodeName=='LABEL'&&el.parentNode.click&&Qualtrics.Browser.IE&&Qualtrics.Browser.Version<=8)
{el.parentNode.click();}};Qualtrics.openPageInPDF=function()
{QModules.loadModule('WRQualtricsShared/JavaScript/Libraries/QPDFPrinter.js');var pages=[QBuilder('div',{},[$('SurveyEngineBody').cloneNode(true)])];QPDFPrinter.print(pages,{includeCSS:true,orientation:'portrait',filename:'surveysummary.pdf',usePrintMediaType:true,paginate:true,background:true,margin:'0px',marginTop:'50px',marginBottom:'50px',baseCSS:'width: auto;',customCSS:' div.END_OF_SURVEY,div#EndSurveyResponseSummary,.DownloadResponsesPDF { display: none; } .Skin input[type=radio], .Skin input[type=checkbox] { opacity: .3; } .Skin input[type=radio]:checked, .Skin input[type=checkbox]:checked { opacity: 1; } .QuestionOuter div.Inner { page-break-inside: avoid; }'});};Qualtrics.syncLabelsAndInputs=function(addEvent){if(!$('SurveyEngineBody')||!$('SurveyEngineBody').hasClassName('CSSV4')){return;}
if(addEvent===undefined)
addEvent=true;Qualtrics.cachedInputs=Qualtrics.cachedInputs||$$('#Questions input[type="radio"], #Questions input[type="checkbox"]');Qualtrics.cachedInputs.each(function(input){Qualtrics.cachedLabels=Qualtrics.cachedLabels||{};Qualtrics.cachedLabels[input.id]=Qualtrics.cachedLabels[input.id]||$$('label[for="'+input.id+'"]');Qualtrics.cachedLabels[input.id].each(function(label){if(!label.hasClassName('offScreen'))
{if(input.checked)
label.addClassName('q-checked');else
label.removeClassName('q-checked');if(!label.hasClassName('q-radio')&&!label.hasClassName('q-checkbox'))
{if(input.type==='radio')
{label.addClassName('SingleAnswer');}else{label.addClassName('MultipleAnswer');}}
if(addEvent)
{input.on('click',function(event,el)
{var questionOuter=$(el).up('.QuestionOuter');if(questionOuter)
{var qId=questionOuter.id;Qualtrics.cachedQuestionInputs=Qualtrics.cachedQuestionInputs||{};Qualtrics.cachedQuestionInputs[qId]=Qualtrics.cachedQuestionInputs[qId]||questionOuter.select('input[type="radio"], input[type="checkbox"]');Qualtrics.cachedQuestionInputs[qId].each(function(questionInput){Qualtrics.cachedLabels[questionInput.id]=Qualtrics.cachedLabels[questionInput.id]||$$('label[for="'+questionInput.id+'"]');Qualtrics.cachedLabels[questionInput.id].each(function(inputLabel){if(!inputLabel.hasClassName('offScreen'))
{if(questionInput.checked&&!inputLabel.hasClassName('q-checked'))
{inputLabel.addClassName('q-checked');}
else if(!questionInput.checked&&inputLabel.hasClassName('q-checked'))
{inputLabel.removeClassName('q-checked');}}});});}});input.on('focus',function(event,el)
{Qualtrics.cachedLabels[el.id]=Qualtrics.cachedLabels[el.id]||$$('label[for="'+el.id+'"]');Qualtrics.cachedLabels[el.id].each(function(inputLabel){if(!inputLabel.hasClassName('offScreen'))
{inputLabel.addClassName('q-focused');}});});input.on('blur',function(event,el)
{Qualtrics.cachedLabels[el.id]=Qualtrics.cachedLabels[el.id]||$$('label[for="'+el.id+'"]');Qualtrics.cachedLabels[el.id].each(function(inputLabel){inputLabel.removeClassName('q-focused');});});}}});});};Qualtrics.uniformLabelHeight=function(){var makeUniform=function($question)
{var tallest=0;var labels=$question.select('label.SingleAnswer, label.MultipleAnswer');labels.each(function(label){if(label.getHeight()>tallest)
{tallest=label.getHeight();}});labels.each(function(label){var layout=label.getLayout();var newHeight=tallest-layout.get('border-box-height');newHeight=parseInt(newHeight/2);var paddingTop=layout.get('padding-top')+newHeight;var paddingBottom=layout.get('padding-bottom')+newHeight;label.setStyle({paddingTop:paddingTop+'px',paddingBottom:paddingBottom+'px'});});};$$('.QuestionOuter.MC .Inner.SAHR, .QuestionOuter.MC .Inner.MAHR, .QuestionOuter.MC .Inner.MACOL, .QuestionOuter.MC .Inner.SACOL').each(function(questionInner){makeUniform(questionInner);});$$('.QuestionOuter.Matrix .Inner.Profile').each(function(questionInner){makeUniform(questionInner);});$$('.QuestionOuter.GAP').each(function(questionInner){makeUniform(questionInner);});};Event.observe(window,'load',function()
{if($('SurveyEngineBody'))
{Event.observe('SurveyEngineBody','mousedown',Qualtrics.inputClickHelper);if(!$('SurveyEngineBody').hasClassName('NoRUM'))
{Qualtrics.SurveyEngine.recordPageStartTime();}}
Qualtrics.syncLabelsAndInputs(true);setTimeout(function dirtyWatch(){Qualtrics.syncLabelsAndInputs(false);setTimeout(dirtyWatch,200);},200);});Event.observe(document,'keydown',Qualtrics.SurveyEngine.globalKeyDownHandler);Event.observe(document,'keyup',Qualtrics.SurveyEngine.globalKeyUpHandler);
