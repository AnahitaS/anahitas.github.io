
window.CSBar=Class.create();window.CSBar.suspendRounding=false;window.CSBar.prototype={initialize:function(minValue,maxValue,gridLines,QID,snapToGrid,type)
{this.type=type||'bar';this.QID;this.minValue=0;this.barMaxWidth=500;this.maxValue=100;this.totalMax=0;this.sliders=new Object();this.gridLines=5;this.snapToGrid=false;this.labelWidth=undefined;this.gridLinePosition=0;this.decimals=0;this.rtl=false;this.realQuestionId=QID;if(this.realQuestionId.indexOf('_')!=-1)
{this.realQuestionId=this.realQuestionId.substring(this.realQuestionId.indexOf('_')+1,this.realQuestionId.length);}
var questionOuterNode=$(this.realQuestionId);if(questionOuterNode&&questionOuterNode.className!='QuestionOuter')
{questionOuterNode=$$(".QuestionOuter#"+this.realQuestionId);if(questionOuterNode)
{questionOuterNode=questionOuterNode[0];}}
if(!$(questionOuterNode)||!$(questionOuterNode).offsetWidth)
{this.loaded=false;return false;}
if($(document.body).getStyle('direction')==='rtl')
this.rtl=true;if(maxValue!==undefined){this.maxValue=Number(maxValue);}
if(minValue!==undefined){this.minValue=Number(minValue);}
if(gridLines!==undefined){this.gridLines=gridLines;}
if(QID){this.QID=QID;}
if($(this.QID+'~totalMax')){this.totalMax=$(this.QID+'~totalMax').value;this.totalMax=parseInt(this.totalMax);}
if(snapToGrid!==undefined){this.snapToGrid=snapToGrid=='1';}
this.animation=false;this.resizeObserver=new Event.observe(window,'resize',this.reCalculateMaxWidth.bind(this));this.onLoadObserver=new Event.observe(window,'load',this.reCalculateMaxWidth.bind(this));this.loaded=true;},calculateTableMinWidth:function()
{var labelsTable=$('LabelDescriptions~'+this.realQuestionId);var labelsTableWidth=0;var choiceTextWidth=0;var valueWidth=0;var notApplicableWidth=0;var minLabelsWidth=100;var minNotApplicableWidth=100;if(labelsTable)
{labelsTableWidth=labelsTable.offsetWidth;if(labelsTable.style.width!='100%')
{labelsTableWidth*=(100/parseFloat(labelsTable.style.width));}
choiceTextWidth=labelsTable.parentNode.offsetLeft;}
if(labelsTableWidth<minLabelsWidth)
{labelsTableWidth=minLabelsWidth;}
var valueTd=$('ValueHeader~'+this.realQuestionId);if(valueTd)
{valueWidth=valueTd.offsetWidth;}
var notApplicableTd=$('NotApplicableHeader~'+this.realQuestionId);if(notApplicableTd)
{notApplicableWidth=notApplicableTd.offsetWidth;if(notApplicableWidth<minNotApplicableWidth)
{notApplicableWidth=minNotApplicableWidth;}}
return labelsTableWidth+choiceTextWidth+valueWidth+notApplicableWidth;},reCalculateMaxWidth:function()
{for(var sliderTag in this.sliders)
{var barContainer=$(sliderTag+'~barTd');if(barContainer)
{var barOuter=barContainer.parentNode;var rightTd=$(sliderTag+'~RightBorder');if(this.rtl===false)
this.barMaxWidth=rightTd.offsetLeft-barOuter.offsetLeft;else
{this.barMaxWidth=$(sliderTag+'~LeftBorder').offsetLeft-rightTd.offsetLeft;}
$(this.sliders[sliderTag].track).setStyle({width:this.barMaxWidth+'px'});this.sliders[sliderTag].trackLength=this.barMaxWidth;if(this.sliders[sliderTag].value)
{this.suspend=true;this.sliders[sliderTag].setValue(this.sliders[sliderTag].value);this.suspend=false;}}}},makeSlider:function(barTag,preset)
{var barContainer=$(barTag+'~barTd');if(!barContainer)
{return;}
try
{var barOuter=barContainer.parentNode;var rightTd=$(barTag+'~RightBorder');this.barMaxWidth=Math.abs(rightTd.offsetLeft-barOuter.offsetLeft);var track=QBuilder('div',{id:barTag+'~track',className:'track'},[QBuilder('div',{id:barTag+'~handle',className:'handle'})]);$(track).setStyle({width:this.barMaxWidth+'px'});var tmpBar=QBuilder('div',{id:barTag+'~holder',className:'trackHolderRel'},[track,QBuilder('div',{id:barTag+'~bar',className:'bar'})]);if(barContainer)
barContainer.appendChild(tmpBar);var barMaxWidth=this.barMaxWidth;var this_=this;var sliderOptions={onSlide:this_.onSlide.bind(this_,barTag),onChange:this_.onSliderChange.bind(this_,barTag)};if(this.snapToGrid)
{var allowedValues=[];for(var i=0;i<=this.gridLines;i++)
{allowedValues[i]=i/this.gridLines;}
sliderOptions.values=allowedValues;}
this.sliders[barTag]=new Control.Slider(barTag+'~handle',barTag+'~track',sliderOptions);if(this.rtl)
{this.sliders[barTag].value=this.maxValue;}
this.sliders[barTag]['choiceId']=barTag.substring(barTag.indexOf('~')+1);if(this.snapToGrid)
{var resultsContainer=$(barTag+'~ResultsTd');if(!resultsContainer)return;var testExists=$(barTag+'~result~'+1);if(!testExists)
{var numResults=Number(this.gridLines)+1;for(var i=1;i<=numResults;i++)
{resultsContainer.appendChild(QBuilder('input',{type:'hidden',id:barTag+'~result~'+i,name:'QR~'+barTag+'~'+i}));}}}
if($(barTag+'~result')){var resultValue=this.getResultValue(barTag);if(resultValue){var value=this.valueToBar(resultValue);this.sliders[barTag].setValue(value);}else{if(preset!=undefined){if(this.snapToGrid)
{this.sliders[barTag].setValue(Math.round(preset*this.gridLines)/this.gridLines);}
else
{this.sliders[barTag].setValue(preset);}}}}
if($(barTag+'~result')){$(barTag+'~result').onchange=this.onValueEnter.bindAsEventListener(this_,barTag);}
if($(barTag+'~NA'))
{$(barTag+'~NA').onclick=this_.notApplicableHandler.bindAsEventListener(this_,barTag);if($(barTag+'~NA').checked){$(barTag+'~result~NA').value='1';}}
this.reCalculateMaxWidth.bind(this).defer();return this.sliders[barTag];}
catch(e)
{console.log(e);}},onSlide:function(barTag,v,sliderObj){if(this.totalMax){v=this.enforceMaxValue(v,barTag);}
var percent=v*this.barMaxWidth;var bar=$(barTag+'~bar');this.updateBar(bar,percent,false);if(this.suspend)
{return false;}
if($(barTag+'~result')!=undefined){this.updateResultTextField(v,barTag);}else{console.error("no input for "+barTag);}
if(this.sliders[barTag]&&!this.sliders[barTag].activated)
{this.activateBar(barTag);}},onSliderChange:function(barTag,v,sliderObj)
{this.onSlide(barTag,v,sliderObj);if(this.suspend)
{return false;}
if(this.snapToGrid)
{this.suspend=true;var gridStep=(this.maxValue-this.minValue)/this.gridLines;var numAnswers=Number(this.gridLines)+1;var answerNumber=Math.round((this.barToValue(v)-this.minValue)/gridStep+1);for(var i=1;i<=numAnswers;i++)
{$(barTag+'~result~'+i).value='';}
$(barTag+'~result~'+answerNumber).value='Selected';this.suspend=false;}
if(this.totalMax){var max=this.getSliderMax(barTag);}
if(this.onChange)
{this.onChange(this.sliders[barTag]);}},getSliderMax:function(currentbarTag){var maxTotal=this.totalMax;var othersTotal=0;var total=0;var currentSliderMax=0;var remaining=0;for(var slider in this.sliders){var val=Number($(slider+'~result').value);if(isNaN(val)){val=0;}
total=total+val;if(slider!=currentbarTag){othersTotal+=(val);}}
currentSliderMax=maxTotal-othersTotal;remaining=currentSliderMax-this.barToValue(this.sliders[currentbarTag].value);$(this.QID+'~total').value=this.roundNumber(total,this.decimals);return this.valueToBar(currentSliderMax);},updateBar:function(bar,v,smooth){if(bar)
{if(this.rtl===true)
{bar.style.width=((this.barMaxWidth-v))+'px';}
else
bar.style.width=((v))+'px';}},notApplicableHandler:function(evt,barTag)
{var input=Event.element(evt);if(!input.checked)
{var sliderObj=this.sliders[barTag];var val=sliderObj.values.length>1?sliderObj.values:sliderObj.value;this.onSliderChange(barTag,val);this.onSlide(barTag,val);}
else
{this.deactivateBar(barTag);}},activateBar:function(barTag,setDefaultValue)
{this.sliders[barTag].activated=true;var bar=$(barTag+'~bar');$(bar.parentNode).addClassName('activated');if($(barTag+'~NA'))
{$(barTag+'~NA').checked=false;$(barTag+'~result~NA').value='';if(Qualtrics.syncLabelsAndInputs)
{Qualtrics.syncLabelsAndInputs(false);}}
if(setDefaultValue)
{this.sliders[barTag].setValue(this.sliders[barTag].value);}},deactivateBar:function(barTag)
{this.sliders[barTag].activated=false;var bar=$(barTag+'~bar');var input=$(barTag+'~result');var NABox=$(barTag+'~result~NA');if(bar)
{$(bar.parentNode).removeClassName('activated');}
if(input)
{input.value='';}
if(NABox)
{NABox.value='1';}
var numAnswers=Number(this.gridLines)+1;for(var i=1;i<=numAnswers;i++)
{if($(barTag+'~result~'+i))
$(barTag+'~result~'+i).value='';}},barToValue:function(v)
{var raw=(v*(this.maxValue-this.minValue))+this.minValue;if(window.CSBar.suspendRounding)
{return raw;}
return this.roundNumber(raw,this.decimals);},valueToBar:function(v)
{var barValue=(v-this.minValue)/(this.maxValue-this.minValue);if(barValue<0)
{barValue=0;}
if(barValue>1)
{barValue=1;}
if(this.rtl===true)
{barValue=1-barValue;}
if(!isNaN(barValue)){return barValue;}else{return this.minValue;}},setDecimals:function(v)
{this.decimals=v;},roundNumber:function(num,dec){var result=Math.round(Math.round(num*Math.pow(10,dec+1))/Math.pow(10,1))/Math.pow(10,dec);return result;},enforceMaxValue:function(vValue,barTag)
{var v=vValue;var max=this.getSliderMax(barTag);if(this.rtl)
{if(v<max){v=(max);this.sliders[barTag].setValue(max);}
if(max>1){v=1;this.sliders[barTag].setValue(1);}}
else
{if(v>max){v=(max);this.sliders[barTag].setValue(max);}
if(max<0){v=0;this.sliders[barTag].setValue(0);}}
return v;},updateResultTextField:function(v,barTag)
{if($(barTag+'~result')!=undefined)
{var newVal;var oldVal=this.getResultValue(barTag);if(this.rtl===true)
{newVal=this.roundNumber(this.maxValue-this.barToValue(v)+this.minValue,this.decimals);}
else
{newVal=this.barToValue(v);}
if(this.totalMax){var max=this.getSliderMax(barTag);}
if($(barTag+'~result').hasClassName('IndividualResponseSummaryInput'))
{$(barTag+'~result').textContent=newVal;}
else
{$(barTag+'~result').value=newVal;}
if(newVal!=oldVal)
{jQuery($(barTag+'~result')).trigger('change');}}},getResultValue:function(barTag)
{var responseSummaryInput=$$('#'+barTag.replace('~','\\~')+'\\~result.IndividualResponseSummaryInput');return $(barTag+'~result').value||(responseSummaryInput.length>0?responseSummaryInput[0].textContent:'');},onValueEnter:function(evt,barTag)
{if(this.suspend)return false;var el=Event.element(evt);if(!el)
{return;}
var value=el.value;if(value==='')
{this.deactivateBar(barTag);}
else
{el.value=this.enforceLimits(value);this.activateBar(barTag);this.suspend=true;value=this.roundNumber(value,this.decimals);var v=this.valueToBar(value);if(this.snapToGrid)
{var roundedV=Math.round(v*this.gridLines)/this.gridLines;this.sliders[barTag].setValue(roundedV);var gridStep=(this.maxValue-this.minValue)/this.gridLines;var numAnswers=Number(this.gridLines)+1;var answerNumber=Math.round((this.barToValue(roundedV)-this.minValue)/gridStep+1);for(var i=1;i<=numAnswers;i++)
{$(barTag+'~result~'+i).value='';}
$(barTag+'~result~'+answerNumber).value='Selected';$(barTag+'~result').value=this.roundNumber((answerNumber-1)*gridStep+this.minValue,this.decimals);}
else
{this.sliders[barTag].setValue(v);}
this.suspend=false;if(this.totalMax)
{v=this.enforceMaxValue(v,barTag);this.updateResultTextField(v,barTag);}}
if(this.onChange)
{this.onChange(this.sliders[barTag]);}},enforceLimits:function(v)
{var min=this.minValue;var max=this.maxValue;if(min>max){min=this.maxValue;max=this.minValue;}
if(v<min)
{v=min;}
if(v>max)
{v=max;}
return v;},setStartPositionsArray:function(list)
{var orderedSliders=$H(this.sliders).values();this.suspend=true;for(var i=0,len=list.length;i<len;++i)
{if(orderedSliders[i]&&!orderedSliders[i].value)
{orderedSliders[i].setValue(list[i]);}}
this.suspend=false;},setStartPositions:function(json)
{if(Object.isArray(json))
{return this.setStartPositionsArray(json);}
var orderedSliders=$H(this.sliders).values();this.suspend=true;for(var i in json)
{var barTag=this.QID+'~'+i;if(typeof json[i]=='function')continue;if(this.sliders[barTag]&&!this.sliders[barTag].value&&!this.sliders[barTag].activated)
{if(this.snapToGrid)
{this.sliders[barTag].setValue(Math.round(json[i]*this.gridLines)/this.gridLines);}
else
{this.sliders[barTag].setValue(json[i]);}}}
this.suspend=false;}};function getStyle(el,styleProp)
{var x=document.getElementById(el);if(x.currentStyle)
var y=x.currentStyle[styleProp];else if(window.getComputedStyle)
var y=document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);return y;}