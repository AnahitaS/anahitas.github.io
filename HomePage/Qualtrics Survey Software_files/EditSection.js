
window.QES_OverQuestion={};window.QES_QuestionRenderCount=0;window.dragCallBack=null;window.dragCallBackOptions=null;window.QES_MouseOverWidgets=1;QES_OverQuestion={alwaysUpdate:false,callback:['QuestionActions','updateIcons'],clearCallback:['QuestionActions','clearIcons'],init:function(){this.suspend=false;this.questionObj=null;this.lastElement=null;this.location=null;},execute:function()
{window[QES_OverQuestion.callback[0]][QES_OverQuestion.callback[1]]();}};QES_OverQuestion.init();window.MouseHold={isDown:false,set:function(){MouseHold.isDown=true;Event.observe(document,'mouseup',MouseHold.release);},release:function()
{MouseHold.isDown=false;Event.stopObserving(document,'mouseup',MouseHold.release);},get:function()
{return MouseHold.isDown;}};window.selectedQuestionHeightWatcher=null;window.scrollInfo=getScrollInfo();window.customErrorHandler=QES_Error;function QES_Error(msg)
{if($('SystemErrorArea'))
$('SystemErrorArea').appendChild(QBuilder('div',{className:'ErrorMsg'},[QBuilder('span',null,msg),QBuilder('span',{className:'ErrorClose',clickcallback:'QES_Global.closeError($el)'})]));QuestionTopCache={};}
Event.observe(window,'scroll',updateScroll);Event.observe(window,'DOMMouseScroll',QES_GlobalScrollDistributer);window.onmousewheel=document.onmousewheel=QES_GlobalScrollDistributer;Event.observe(window,'load',function(){if(Qualtrics.Navigation&&Qualtrics.Navigation.subSection=='SurveyOptions')
{QES_Global.openOptions();}
if($('LogoutLink'))
{$('LogoutLink').onclick=function(evt)
{QES_Global.saveSurvey(false);document.Page.action='./?Brand=Qualtrics';PageAction('Logout','','','');return false;};}
if($('AdvancedMenu'))
{$('AdvancedMenu').setAttribute('downcallback',"Qualtrics.Menu.showMenu(QES_Global.getAdvancedOptionMenu, $el,{},$evt)");}});Qualtrics.savePage=function(asynchronous)
{if(!asynchronous)
asynchronous=false;if(inlineEditor.getInstance())
{inlineEditor.getInstance().removeInlineEditor();}
QES_Global.saveSurvey(asynchronous);};Event.observe(document,'dragdrop',function(evt){Event.stop(evt);});window.updateCustomMousePos=function(event,forcedY)
{if(forcedY)
{mousePos[1]=forcedY;}
if(QES_MouseOverWidgets)
{if(QES_OverQuestion.questionObj&&QES_OverQuestion.questionObj.element)
{if(QES_OverQuestion.suspend==false)
{if(QES_OverQuestion.questionObj.element!=QES_OverQuestion.lastElement||QES_OverQuestion.alwaysUpdate)
{if(QES_OverQuestion.questionObj.parentObj.type!='Trash')
{QES_OverQuestion.lastElement=QES_OverQuestion.questionObj.element;QES_OverQuestion.execute();}}}}
else
{if(QES_OverQuestion.clearCallback&&window[QES_OverQuestion.clearCallback[0]])
{window[QES_OverQuestion.clearCallback[0]][QES_OverQuestion.clearCallback[1]]();}}}
if(event&&dragCallBack)
{dragCallBack(dragCallBackOptions);}};window.customMouseUp=function()
{QES_Global.preventFakeDragging=false;};function QES_GlobalScrollDistributer(event)
{QES_Global.stopScrolling();var delta=0;if(!event)
event=window.event;if(event.wheelDelta){delta=event.wheelDelta/120;if(window.opera)
delta=-delta;}else if(event.detail){delta=-event.detail/3;}
delta=Math.round((0-delta*50));if(delta)
{if(QES_Global.scrollRedirectElement!==null)
{if(QES_Global.scrollRedirectElement)
{QES_Global.scrollRedirectElement.scrollTop=QES_Global.scrollRedirectElement.scrollTop+delta;}
Event.stop(event);}}}
window.QES_Global={carryForwardDependencyStack:null,scrollRedirectElement:null,suspendOvers:false,suspendOverBorders:false,wizardQuestionObj:null,scroller:null,suspendSelects:false,previewWindow:null,totalQuestionCount:0,rev:null,revOld:null,chooseGraphic:function()
{if(BaseForm.getInstance().revisionId)
{return false;}
var questionObj=QuestionActions.selectedRegistry[0];if(questionObj&&questionObj.isLocked())
{var continueOn=QES_Global.handleEditWhenSurveyLocked();if(!continueOn)
{return;}}
QModules.loadModule('librarymanager.js');new Qualtrics.QGraphicsManager({onSelect:function(url,graphicId,description,version){try
{var questionObj=Toolbox.getInstance().questionObj;if(questionObj.isLocked()){var continueOn=QES_Global.handleEditWhenSurveyLocked();if(!continueOn)
return;}
if(questionObj.subSelector=='WOTXB')
{questionObj.text=description;questionObj.description=description;}
questionObj.GraphicsDescription=description;questionObj.Graphics=graphicId;questionObj.GraphicVersion=version;questionObj.url=null;questionObj.refreshCanvas();questionObj.setSaved(false);questionObj.height=null;window.QuestionTopCache={};}
catch(e)
{console.error(e);}}});},chooseFile:function()
{var questionObj=QuestionActions.selectedRegistry[0];if(questionObj&&questionObj.isLocked()){var continueOn=QES_Global.handleEditWhenSurveyLocked();if(!continueOn)
return;}
QModules.loadModule('QFiles.js');window.insertFile=function(fileId,description,version)
{var questionObj=Toolbox.getInstance().questionObj;if(questionObj.isLocked()){var continueOn=QES_Global.handleEditWhenSurveyLocked();if(!continueOn)
return;}
if(questionObj.options.IncludeDescription=='ON')
{questionObj.text=description;questionObj.description=description;}
questionObj.FilesDescription=description;questionObj.Files=fileId;questionObj.setOption('FileVersion',version);questionObj.url=null;questionObj.refreshCanvas();questionObj.setSaved(false);questionObj.height=null;window.QuestionTopCache={};};InsertQFile.insertQFile('filequestion');},chooseVideo:function()
{var questionObj=QuestionActions.selectedRegistry[0];if(questionObj&&questionObj.isLocked()){var continueOn=QES_Global.handleEditWhenSurveyLocked();if(!continueOn)
return;}
QModules.loadModule('QFiles.js');window.insertFile=function(fileId,description,version)
{var questionObj=Toolbox.getInstance().questionObj;if(questionObj.isLocked()){var continueOn=QES_Global.handleEditWhenSurveyLocked();if(!continueOn)
return;}
questionObj.VideosEmbed="";questionObj.Videos=fileId;questionObj.setOption('FileVersion',version);questionObj.url=null;questionObj.refreshCanvas();questionObj.setSaved(false);questionObj.height=null;window.QuestionTopCache={};};InsertQFile.insertQFile('filequestion',undefined,{videoOnly:true,filter:{Extensions:['wmv','avi','mov','mp4','mpg','mpeg','asf','flv','swf','ogv','ogg']}});},chooseGraphicUrl:function(textbox,url)
{Toolbox.getInstance().questionObj.Graphics=url;Toolbox.getInstance().questionObj.url=url;Toolbox.getInstance().questionObj.setSaved(false);if(url.endsWith('gif')||url.endsWith('jpg')||url.endsWith('png')||url.indexOf('?')!=-1)
{Toolbox.getInstance().questionObj.refreshCanvas();}},getGraphicUrl:function()
{var questionObj=Toolbox.getInstance().questionObj;var s=questionObj.Graphics;if(questionObj.url||questionObj.URL)
s=questionObj.url?questionObj.url:questionObj.URL;return s||'';},getUrl:function()
{return Toolbox.getInstance().questionObj.url||'';},setUrl:function(textbox,url)
{Toolbox.getInstance().questionObj.url=url;if(Toolbox.getInstance().questionObj.graphics)
{Toolbox.getInstance().questionObj.graphics=null;}
Toolbox.getInstance().questionObj.setSaved(false);},checkMobileCompatibility:function(doNotLog)
{var questions=Survey.getInstance().getAllQuestions();var surveyCompatible=true;for(var i=0;i<questions.length;i++)
{var compatible=questions[i].checkMobileCompatibility(null);if(!compatible)
{surveyCompatible=false;}}
if(!doNotLog)
{new Ajax.Request('Ajax.php?action=logSurveyMobileCompatibilityStat',{parameters:{sid:Survey.getInstance().id,mobileCompatible:surveyCompatible},onSuccess:function(transport){}});}},compatibilityLevels:{"MC":{"SAHR":"CountChoices","SACOL":"CountColumns","MAHR":"CountChoices","MACOL":"CountColumns","DL":"IsMobileCompatible","SAVR":"IsMobileCompatible","MAVR":"IsMobileCompatible","MSB":"IsMobileCompatible","SB":"IsMobileCompatible"},"Matrix":{"Likert":{"DL":"IsMobileCompatible","MultipleAnswer":"CountAnswers","SingleAnswer":"CountAnswers"},"BiPolar":"CountAnswers","Bipolar":"CountAnswers","RO":"CountAnswers","CS":"CountAnswers","TE":"CountAnswers","Profile":"CountAnswers","MaxDiff":"CountAnswers"},"RO":{"HR":"CountChoices","RB":"CountChoices","SB":"NotMobileCompatible","VR":"IsMobileCompatible"},"Slider":{"STAR":"MaybeMobileCompatible","HSLIDER":"CountLabels","HBAR":"CountLabels"},"CS":{"VRTL":"IsMobileCompatible","HSLIDER":"CountLabels","HBAR":"CountLabels"},"HotSpot":"CheckWidth","HeatMap":"CheckWidth","DB":{"GRB":"CheckWidth","FLB":"IsMobileCompatible","PTB":"IsMobileCompatible","TB":"IsMobileCompatible"},"SBS":"MaybeMobileCompatible","PGR":"MaybeMobileCompatible","GAP":"MaybeMobileCompatible","FileUpload":"IsMobileCompatible","DD":"IsMobileCompatible","Timing":"IsMobileCompatible","Captcha":"IsMobileCompatible","SS":"IsMobileCompatible","TE":"IsMobileCompatible","DynamicMatrix":"MaybeMobileCompatible"},checkMobileOfflineCompatibility:function()
{var offlineAppPermission=(Qualtrics.User&&Qualtrics.User.offlineAppPermission==1);if(offlineAppPermission)
{new Ajax.Request('Ajax.php?action=checkMobileOfflineCompatibility',{parameters:{sid:Survey.getInstance().id},onSuccess:function(transport)
{var response=transport.responseText.evalJSON();var errors=response.Errors;if(response.Status==='Denied')
{errors={};}
this.updateMobileCompatibilityErrors(errors);}.bind(this)});}},removeMobileCompatibilityMessages:function(){this.updateMobileCompatibilityErrors(null);},updateMobileCompatibilityErrors:function(errors)
{var survey=Survey.getInstance();var questions=survey.getAllQuestions();var message=null;var i;var statusBarLogs;for(i=0;i<questions.length;i++)
{var question=questions[i];message=null;if(errors&&errors.Questions&&errors.Questions[question.questionId])
{message=errors.Questions[question.questionId];}
this.updateMobileCompatibilityIcon(question,'offline',message);}
if(errors&&errors.Flow&&errors.Flow.length>0)
{statusBarLogs=Qualtrics.StatusBarModules.SurveyLastSaved.getInstance();if(statusBarLogs)
{for(i=0;i<errors.Flow.length;i++)
{statusBarLogs.addLogEntry(errors.Flow[i],{action:'QES_Global.openSurveyFlow'});}}}
if(errors&&errors.Flow&&errors.Flow.length===0&&errors.Blocks&&errors.Blocks.length===0&&errors.Questions&&errors.Questions.length===0)
{statusBarLogs=Qualtrics.StatusBarModules.SurveyLastSaved.getInstance();if(statusBarLogs)
{statusBarLogs.addLogEntry(getMessage('ErrorCodes','EOAPP11'),{className:'check'});}}},updateMobileCompatibilityIcon:function(element,type,message,statusIconsContainer)
{if(element&&(type==='mobile'||type==='offline'))
{if(!element.mobileCompatibility)
{element.mobileCompatibility={};}
var compatibility=element.mobileCompatibility;compatibility[type]=message;if(!statusIconsContainer)
{statusIconsContainer=$$('#'+element.id+' .StatusIcons')[0];}
if(statusIconsContainer)
{var mobileIcon=$(statusIconsContainer).down('.MobileCompatibility');if(mobileIcon&&(!Survey.getInstance().mobileCompatibilityChecker||(compatibility.mobile==null&&compatibility.offline==null)))
{mobileIcon.remove();}
else if((compatibility.mobile!=null||compatibility.offline!=null))
{if(mobileIcon)
{mobileIcon.remove();}
var extraClassname='';if(compatibility.offline!=null||compatibility.mobile=='NotMobileCompatible')
{extraClassname=' NotMobileCompatible';}
statusIconsContainer.appendChild(QBuilder('div',{className:'MobileCompatibility'+extraClassname,title:getMessage('EditSection','ClickToLearnAboutMobileCompatibility'),clickcallback:'QES_Global.showMobileCompatibilityMessages('+element.id+', $evt)'}));}}}},showMobileCompatibilityMessages:function(id,evt)
{var content='';var element=null;if(id.indexOf('block_')===0)
{element=Survey.getInstance().getBlockById(id);}
else if(id.indexOf('q')===0)
{element=Question.getQuestionById(id);}
else
{return;}
if(element.mobileCompatibility.mobile)
{var mobileMsg=getMessage('EditSection',element.mobileCompatibility.mobile);var mobileLinkMsg=getMessage('EditSection','LearnMore');var mobileLink='http://www.qualtrics.com/university/researchsuite';content+="<div class='MobileCompatibility'>"+mobileMsg+"</div>";}
var offlineAppPermission=(Qualtrics.User&&Qualtrics.User.offlineAppPermission==1);if(offlineAppPermission&&element.mobileCompatibility.offline)
{var offlineMsg=element.mobileCompatibility.offline;var offlineLinkMsg=getMessage('EditSection','LearnMore');var offlineLink='http://www.qualtrics.com/university/researchsuite';content+="<div class='MobileCompatibility'>"+offlineMsg+"</div>";}
var menuDef=Qualtrics.Info.processMenuDef({Value:content});Qualtrics.Menu.showMenu(menuDef,Event.element(evt),{className:'MobileCompatibilityInfo',position:'horizontal-right',direction:'right',connectorPosition:'left',connector:true},evt);},stopScrolling:function()
{if(QES_Global.scroller&&QES_Global.scroller.state!='finished')
{if(QES_Global.scroller.options.afterFinish)
{QES_Global.scroller.options.afterFinish(QES_Global.scroller);}
QES_Global.scroller.cancel();}},emptyTrash:function(evt)
{if(evt)
Event.stop(evt);if(confirm(getMessage('EditSection','EmptyTrashConfirm')))
{QES_Global._emptyTrash();}},_emptyTrash:function()
{if(!Survey.getInstance().getPermission('editQuestions'))
{return;}
if(!Survey.getInstance().getPermission('deleteSurveyQuestions'))
{return;}
var trashBlock=Survey.getInstance().getTrash();var surveyId=BaseForm.getInstance().id;if(trashBlock)
{msg(getMessage('EditSection','EmptyingTrash'),'emptytrash');new Ajax.Request('Ajax.php?action=EmptyTrash',{method:'post',parameters:{SurveyID:surveyId,BID:trashBlock.blockId}});var survey=Survey.getInstance();for(var i=trashBlock.questions.length-1;i>-1;--i)
{var qid=trashBlock.questions[i].questionId;trashBlock.questions[i].removeQuestion(true);survey.questionCount--;QuestionActions.refreshDependencies(qid);}
trashBlock.realQuestionCount=0;trashBlock.checkStatus();}},closeError:function(xspan){var errorDiv=($(xspan).up('div'));new Effect.Fade(errorDiv,{duration:0.5,afterFinish:QES_Global.getTopCacheClearFunction()});},getTopCacheClearFunction:function()
{return function(){QuestionTopCache={};};},saveSurvey:function(asynchronous,opt_selectedOnly,opt_suppressMoves,opt_suppressRevision)
{if(Survey)
{var survey=Survey.getInstance();if(survey)
{var unsavedQuestions=survey.getUnsavedQuestions(opt_selectedOnly);var unsavedNotes=survey.getUnsavedNotes(opt_selectedOnly);QuestionActions.saveQuestions(unsavedQuestions,{asynchronous:asynchronous});QuestionActions.saveConjoints();QuestionActions.saveNotes(unsavedNotes,{asynchronous:asynchronous});if(!opt_suppressRevision)
{var lastCreated=QES_Global.createRevision.lastCreated;if(!lastCreated||(new Date()-lastCreated)>(1800*1000))
{QES_Global.createRevision();}}}
if(QuestionActions.moveQueue.length&&!opt_suppressMoves)
{QuestionActions.executeMoves({msg:'',asynchronous:asynchronous});}
if(Ajax.CachedRequest)
{Ajax.CachedRequest.clearCache();}}},addFirstQuestionToBlock:function(id)
{var block=Survey.getInstance().getBlockById(id);if(block&&block.subType&&block.subType=='Benchmark')
{var q=block.addDefaultQuestionAndRender(undefined,true);block.checkForEmptyBlock();return q;}
if(block)
{var q=block.addDefaultQuestionAndRender();block.checkForEmptyBlock();return q;}},showQuestionTypeMenu:function(el,evt,id)
{QuestionTypeActions.showQuestionTypeMenu(el,evt,'QES_Global.addNewQuestionToBlock($el,'+id+')');},addNewQuestionToBlock:function(el,blockId)
{var q=this.addFirstQuestionToBlock(blockId);if(q)
{var type=el.getAttribute('questiontype');var selector=el.getAttribute('selector');var subSelector=el.getAttribute('subSelector');var overrideLocked=true;Toolbox.getInstance().changeQuestionType(q,type,selector,subSelector,overrideLocked);q.checkForHeightShift();}},addQuestionsFromLibrary:function(blockId)
{if(QES_Global.suspendSelects||!BaseForm.getInstance().getPermission('addNewQuestion'))
{return;}
var b=Survey.getInstance().getBlockById(blockId);var win=new Q_Window('AddQuestionFromLibrary',{width:'910',height:'92%',overlayClose:true,closeButton:false,onClose:QES_Global.onCloseLibrary});var options={returnFunction:Q_Window.closeWindow.curry('AddQuestionFromLibrary'),returnText:getMessage('SiteWide','Cancel'),executeFunction:function(questionDefs,surveyId,opt_libraryId){var b=Survey.getInstance().getBlockById(blockId);QuestionActions.unselectAll();if(questionDefs.length)
{if(b.locked)
{alert(getMessage('EditSection','CannotImportQuestionsIntoLockedBlock'));return false;}
for(var i=0,len=questionDefs.length;i<len;++i)
{var newDefinition=questionDefs[i];var newQuestionObj=new Question();newQuestionObj.generate({Type:'Question',QuestionDefinition:newDefinition});newQuestionObj.unpackage();newQuestionObj.exportTag=null;newQuestionObj.assignNewQuestionNumber();newQuestionObj.setSaved(0);newQuestionObj.questionId=null;newQuestionObj.displayLogic=null;newQuestionObj.dynamicChoices=null;newQuestionObj.dynamicChoicesData=null;if(b)
{b.addQuestion(newQuestionObj);Survey.getInstance().questionCount++;}
newQuestionObj.render();QuestionActions.select(newQuestionObj,null,true);}}
else
{if(surveyId&&surveyId.search('LB')!=-1)
{var action='ImportBlockFromLibrary';var copyBlockBy=$$('input:checked[type="radio"][name="CopyBlockBy"]').pluck('value');if(copyBlockBy=='Reference')
action='AddReferenceBlockToSurvey';new Ajax.Request('Ajax.php?action='+action,{parameters:{BlockID:surveyId,LibraryID:opt_libraryId,SurveyID:Survey.getInstance().id},onSuccess:function(transport)
{BlockActions.reloadSurvey();}});}
else
{BaseForm.getInstance().importSurvey(surveyId,opt_libraryId);}}
if(b)
{b.checkForEmptyBlock();}
Q_Window.closeWindow('AddQuestionFromLibrary');},multipleAdd:true,height:win.calculatedHeight,maxQuestions:Survey.getInstance().permissions.allowedQuestions,questionCount:Survey.getInstance().questionCount};QModules.loadModule('inavigator.js');QES_Global.addQuestionsFromLibrary.iNavigator=new INavigator(win.innerElement,options);win.center();},addQuestionsFromSurvey:function(blockId)
{var win=new Q_Window('AddQuestionFromSurvey',{width:'910',height:'92%',overlayClose:true,closeButton:false});var options={returnFunction:Q_Window.closeWindow.curry('AddQuestionFromSurvey'),returnText:getMessage('SiteWide','Cancel'),saveText:getMessage('SiteWide','Copy'),mainMenuText:'Assessment Forms',mainMenuSubText:'Please Select a Form',executeFunction:function(surveyId,questionDefs){var b=Survey.getInstance().getBlockById(blockId);QuestionActions.unselectAll();if(questionDefs.length)
{if(b.locked)
{alert(getMessage('EditSection','CannotImportQuestionsIntoLockedBlock'));return false;}
for(var i=0,len=questionDefs.length;i<len;++i)
{var qDef=questionDefs[i];var newQuestionObj=new Question();newQuestionObj.generate({Type:'Question',QuestionDefinition:qDef});newQuestionObj.unpackage();newQuestionObj.exportTag=null;newQuestionObj.assignNewQuestionNumber();newQuestionObj.setSaved(0);newQuestionObj.questionId=null;newQuestionObj.displayLogic=null;if(b)
{b.addQuestion(newQuestionObj);Survey.getInstance().questionCount++;}
newQuestionObj.render();QuestionActions.select(newQuestionObj,null,true);}}
Q_Window.closeWindow('AddQuestionFromSurvey');},height:win.calculatedHeight};QModules.loadModule('inavigator2.js');var structure=[{ajax:'getThreeSixtySurveys',params:{},bindings:{name:''}},{ajax:'getThreeSixtySurveyQuestions',params:{SurveyID:false},bindings:{name:['QuestionDescription']},renderer:this.renderQuestion}];QES_Global.addQuestionsFromSurvey.iNavigator=new INavigator(win.innerElement,structure,options);win.center();},renderQuestion:function(stack,key)
{var question=stack[stack.length-1][key];var qData={Type:'Question',QuestionDefinition:question};var previewQuestionObj=new Question(null,true);previewQuestionObj.previewMode=true;previewQuestionObj.generate(qData);previewQuestionObj.unpackage();var container=QBuilder('div');previewQuestionObj.renderCanvas({parentElement:container});var children=$(container).childElements();for(var i=0;i<children.length;++i)
if($(children[i]).className=='CanvasFooter')
$(children[i]).remove();return container;},onCloseLibrary:function()
{QES_Global.libraryBrowser=null;QES_Global.scrollRedirectElement=null;QES_Global.addQuestionsFromLibrary.iNavigator=null;},openSurveyFlow:function(opt_surveyFlow)
{QES_Global.saveSurvey();QModules.loadModule('SurveyFlow.js');QModules.loadStylesheet('surveyflow.css');var flowPage=new Q_SurveyFlowPage(opt_surveyFlow);var qWindowOptions={className:'SurveyFlowWindow',width:'95%',height:'92%',title:getMessage('EditSection','SurveyFlow'),buttons:['cancel:Q_SurveyFlowPage.cancel','save:Q_SurveyFlowPage.save|'+getMessage('EditSection','SaveFlow')],onClose:flowPage.confirmClose};if(Survey.getInstance()&&Survey.getInstance().revisionId)
{qWindowOptions.banner=getMessage('EditSection','ViewingPreviousRevisionBanner',getMessage('EditSection','SurveyFlow'));qWindowOptions.disableSave=true;}
var win=new Q_Window('SurveyFlow',qWindowOptions);flowPage.Q_WindowObj=win;win.setContent(flowPage.build());return true;},bootstrapOutcomes:function(opt_outcomes)
{QES_Global.saveSurvey();if(!window.angular){var modalcss=document.createElement("link");modalcss.setAttribute("rel","stylesheet");modalcss.setAttribute("type","text/css");modalcss.setAttribute("href","/outcomes/static/styles/modal.css");document.getElementsByTagName("head")[0].appendChild(modalcss);}
var curScript=document.createElement('script');curScript.type='text/javascript';curScript.src='/outcomes/static/bootstrap.js?t={:$timestamp:}';var oldScript=document.getElementsByTagName('script')[0];oldScript.parentNode.insertBefore(curScript,oldScript);return true;},openEmailTriggers:function()
{QES_Global.saveSurvey(false);QModules.loadModule('Triggers.js');var triggersPage=new Q_TriggersPage();var qWindowOptions={width:'800',title:getMessage('EditSection','Triggers'),buttons:['closewithoutsaving:Q_TriggersPage.cancel','save:Q_TriggersPage.save|'+getMessage('EditSection','SaveTriggers')]};if(Survey.getInstance()&&Survey.getInstance().revisionId)
{qWindowOptions.banner=getMessage('EditSection','ViewingPreviousRevisionBanner',getMessage('EditSection','Triggers'));qWindowOptions.disableSave=true;}
var win=new Q_Window('Triggers',qWindowOptions);win.setContent(triggersPage.build());},openPanelTriggers:function()
{QES_Global.saveSurvey(false);QModules.loadModule('Triggers.js');var triggersPage=new Q_PanelTriggersPage();var qWindowOptions={width:'860',title:getMessage('EditSection','Triggers'),buttons:['closewithoutsaving:Q_PanelTriggersPage.cancel','save:Q_PanelTriggersPage.save|'+getMessage('EditSection','SaveTriggers')]};if(Survey.getInstance()&&Survey.getInstance().revisionId)
{qWindowOptions.banner=getMessage('EditSection','ViewingPreviousRevisionBanner',getMessage('EditSection','Triggers'));qWindowOptions.disableSave=true;}
var win=new Q_Window('Triggers',qWindowOptions);win.setContent(triggersPage.build());},openQuotas:function()
{QES_Global.saveSurvey();Ajax.CachedRequest.clearCache();var useAdvancedQuotas=Survey.getInstance().getPermission('useAdvancedQuotas',true);QModules.loadModule('Quotas.js');var quotaEditor=new QuotaEditor(useAdvancedQuotas);quotaEditor.open();},openSpellCheck:function()
{if(Qualtrics.SearchAndReplace&&Qualtrics.SearchAndReplace.startedSearchAndReplace)
{Qualtrics.SearchAndReplaceDialog.close();}
QModules.loadModule('spellcheck.js');SurveySpellChecker.spellCheckSurvey();return false;},openSearchAndReplace:function()
{QModules.loadModule('SearchAndReplace.js');Qualtrics.SearchAndReplace.openSearchAndReplace();return false;},openConjoints:function()
{if(Survey.getInstance().getPermission('useAEConjoint'))
{QES_Global.saveSurvey(false);QModules.loadModule('conjoints.js');var conjointsPage=new Q_ConjointsPage();var win=new Q_Window('ConjointsWindow',{className:'',width:'800',title:getMessage('EditSection','Conjoints'),buttons:['close:Q_ConjointsPage.cancel']});win.setContent(conjointsPage.build());win.showCenter();}},openSurveyTester:function()
{QES_Global.saveSurvey(false);if(Qualtrics.System.productName=='ThreeSixty')
{QModules.loadModule('surveytester360.js');}
else
{QModules.loadModule('surveytester.js');}
new Q_SurveyTest();},openOmnitureConfig:function()
{QModules.loadModule('omnitureIntegration.js');var integration=new Qualtrics.OmnitureIntegration();integration.showConfig();},openSalesforceLeadTrigger:function()
{QES_Global.saveSurvey(false);QModules.loadModule('salesforceIntegration.js');var leadTrigger=new SF_LeadTriggerPage();var win=new Q_Window({id:'SF_LeadTrigger',width:'905px',title:getMessage('EditSection','SalesForceWTLT'),buttons:['closewithoutsaving','save:SF_LeadTriggerPage.save|'+getMessage('SiteWide','Save')]});win.setContent(leadTrigger.build());},openSalesforceResponseMapping:function()
{QES_Global.saveSurvey(false);QModules.loadModule('salesforceIntegration.js');var win=new Q_Window({id:'SF_ResponseMapping',width:'905px',title:getMessage('EditSection','SalesforceResponseMapping'),height:'92%',buttons:['closewithoutsaving:SF_ResponseMappingPage.cancel|'+getMessage('EditSection','CloseWithoutSaving'),'save:SF_ResponseMappingPage.save|'+getMessage('SiteWide','Save')]});var page=new SF_ResponseMappingPage();win.setContent(page.build());},openSalesforceOutboundMessage:function()
{QES_Global.saveSurvey(false);QModules.loadModule('salesforceIntegration.js');var win=new Q_Window({id:'SF_OutboundMessage',width:'905px',height:'92%',title:getMessage('EditSection','SalesForceTES'),buttons:['closewithoutsaving','save:SF_OutboundMessagePage.save|'+getMessage('SiteWide','Save')]});var page=new SF_OutboundMessagePage();win.setContent(page.build());},openSalesforceAccountData:function()
{QModules.loadModule('salesforceIntegration.js');SF_AccountData.showAccountSetup();},authenticateSalesForce:function()
{QModules.loadModule('salesforceIntegration.js');SF_AccountData.authenticateSalesForce();},getPreviewWindow:function()
{if(QES_Global.previewWindow)
{try{var closed=QES_Global.previewWindow.closed;}
catch(e)
{QES_Global.previewWindow=null;}
if(closed)
{return false;}
return QES_Global.previewWindow;}
return false;},refreshPreviewWindow:function(questionObj)
{if(QES_Global.previewWindow)
{try{var closed=QES_Global.previewWindow.closed;}
catch(e)
{QES_Global.previewWindow=null;}
if(closed||!questionObj)
{return false;}
var name='_WINDOW_PREVIEW_'+questionObj.questionId;if(QES_Global.previewWindow.name==name)
{questionObj.save({onComplete:function(){QES_Global.previewWindow.location=QES_Global.previewWindow.location;}});}}},handleEditWhenSurveyLocked:function()
{var continueOn=true;if(Survey.getInstance().locked==true)
{msg(getMessage('EditSection','Locked'));if(!this.editLockAttempts||this.editLockAttempts==this.editLockTriggerLimit)
this.editLockAttempts=0;this.editLockAttempts++;if(this.editLockAttempts==this.editLockTriggerLimit)
Survey.getInstance().unlockSurveyConfirm(true);continueOn=false;}
return continueOn;},editLockAttempts:0,editLockTriggerLimit:1,editSurveyDescription:function()
{var editor=Survey.getInstance().surveyDescriptionObj.edit();editor.selectAll();},editSurveyName:function()
{Qualtrics.StatusBarModules.SurveySelector.getInstance().openMenuAndFocusSurveyTitle();},updateSurveySavedTime:function()
{if(Qualtrics.System.productName=='ControlPanel'&&Qualtrics.StatusBarModules)
{var surveyLastSaved=Qualtrics.StatusBarModules.SurveyLastSaved.getInstance();if(surveyLastSaved)
{surveyLastSaved.updateSavedTime();}}},openLookAndFeel:function(evt)
{QModules.loadModule('LookAndFeel.js');LookAndFeel.openDialog(evt.ctrlKey);},OptionPopup:null,openOptions:function()
{QModules.loadModule('surveyoptions.js');Qualtrics.SurveyOptions.openOptions();},stripFormattingOnSelectedQuestions:function()
{var list=QuestionActions.selectedRegistry;var plural='';if(list.length)
{if(list.length>1)
{confirmationMessage=getMessage('EditSection','ConfirmStripFormatting_Plural',list.length);}
else
{confirmationMessage=getMessage('EditSection','ConfirmStripFormatting',list.length,'');}
var sure=confirm(confirmationMessage);if(sure)
{for(var i=0,len=list.length;i<len;++i)
{list[i].stripFormatting();}
QES_Global.saveSurvey(false);Survey.getInstance().refresh();}}
else
{alert(getMessage('EditSection','MustHaveQuestionsSelected'));}},openBlockRandomization:function()
{QModules.loadModule('blockrandomization.js');Qualtrics.BlockRandomization.open();},autoNumberMethod:'',autoNumberPrefix:'',autoNumberQuestions:function()
{var explanation=QBuilder('div',{id:'autoNumberExplanation'});$(explanation).innerHTML=getMessage('EditSection','AutoNumberExplanation');var sequential=QBuilder('div',{},[QBuilder('a',{href:'javascript:void(0);',className:'qbutton autoNumberButton',clickcallback:'QES_Global.seqAutoNumberQuestions'},[QBuilder('span',{className:'autoNumberText'},getMessage('EditSection','SequentialNumbering')),QBuilder('span',{id:'seqAutoNumber',className:'autoNumberPreview'},'Q1')])]);var block=QBuilder('div',{},[QBuilder('a',{href:'javascript:void(0);',className:'qbutton autoNumberButton',clickcallback:'QES_Global.blockAutoNumberQuestions'},[QBuilder('span',{className:'autoNumberText'},getMessage('EditSection','BlockNumbering')),QBuilder('span',{id:'blockAutoNumber',className:'autoNumberPreview'},'Q1.1')])]);var qid=QBuilder('div',{},[QBuilder('a',{href:'javascript:void(0);',className:'qbutton autoNumberButton',clickcallback:'QES_Global.qidAutoNumberQuestions'},[QBuilder('span',{className:'autoNumberText'},getMessage('EditSection','QNumbering')),QBuilder('span',{id:'qidAutoNumber',className:'autoNumberPreview'},'QID1')])]);var prefixText=QBuilder('span',{id:'autoNumberPrefix'},getMessage('EditSection','Prefix')+':');var prefix=QBuilder('div',{id:'autoNumberPrefixContainer'},[prefixText,QBuilder('input',{type:'text',id:'autoNumberPrefixInput',value:'Q',size:'8',maxlength:'4',onkeyup:'QES_Global.updateAutoNumber();',validation:'AlphaNumeric'})]);var content=QBuilder('div',{},[explanation,sequential,block,qid,prefix]);var popup=new Q_Window({id:'autoNumberPopUp',width:'auto',title:getMessage('EditSection','AutoNumber'),buttons:['cancel']});popup.setContent(content);popup.center();},updateAutoNumber:function()
{var prefix=$('autoNumberPrefixInput').value;if(prefix.match(/^V[0-9]*$/))
{$('autoNumberPrefixInput').addClassName('invalid');$('autoNumberPrefixInput').title=getMessage('EditSection','AutoNumberWarning');}
else
{$('autoNumberPrefixInput').removeClassName('invalid');$('autoNumberPrefixInput').title="";}
$('seqAutoNumber').innerHTML=prefix+'1 ';$('blockAutoNumber').innerHTML=prefix+'1.1 ';},seqAutoNumberQuestions:function()
{QES_Global.autoNumberMethod='Seq';QES_Global.autoNumberPrefix=$('autoNumberPrefixInput').value;Q_Window.closeWindow('autoNumberPopUp');QES_Global.autoNumber();},blockAutoNumberQuestions:function()
{QES_Global.autoNumberMethod='Block';QES_Global.autoNumberPrefix=$('autoNumberPrefixInput').value;Q_Window.closeWindow('autoNumberPopUp');QES_Global.autoNumber();},qidAutoNumberQuestions:function()
{QES_Global.autoNumberMethod='QID';QES_Global.autoNumberPrefix=$('autoNumberPrefixInput').value;Q_Window.closeWindow('autoNumberPopUp');QES_Global.autoNumber();},autoNumber:function()
{QES_Global.saveSurvey(false);QuestionActions.unselectAll();QES_Global.updateAutoNumberQuestions();},updateAutoNumberQuestions:function()
{new Ajax.Request('Ajax.php?action=autoNumberQuestions',{parameters:{sid:Survey.getInstance().id,prefix:QES_Global.autoNumberPrefix,method:QES_Global.autoNumberMethod},onSuccess:function(transport)
{var s=Survey.getInstance();s.reload();}});},checkAccessibility:function()
{QES_Global.saveSurvey(false);QuestionActions.unselectAll();QModules.loadModule('Accessibility.js');if(!Accessibility.display())
return;var s=Survey.getInstance();if(s)
{new Ajax.Request('Ajax.php?action=checkAccessibility',{parameters:{sid:s.id},onSuccess:function(transport)
{var response=transport.responseText.evalJSON();Accessibility.populate(response);}});}},viewBlock:function(blockId)
{QES_Global.saveSurvey(false);var blockObj=Survey.getInstance().getBlockById(blockId);if(blockObj)
{var bid=blockObj.blockId;var serverId=Qualtrics.System.serverId;var surveyId=Survey.getInstance().id;var url="../WRQualtricsSurveyEngine?SID="+surveyId+"&SVID="+serverId+"&Preview=Block&ID="+bid+'&Q_DONT_SAVE=1';window.open(url);}},convertToBenchmarkBlock:function(blockId)
{QES_Global.saveSurvey(false);var blockObj=Survey.getInstance().getBlockById(blockId);if(blockObj)
{var bid=blockObj.blockId;var surveyId=Survey.getInstance().id;new Ajax.Request('Ajax.php?action=ConvertBlockToBenchmark',{parameters:{'sid':surveyId,'bid':bid},onSuccess:function(transport)
{BlockActions.reloadSurvey();}});}},buildResponseScalesMenu:function(questionId,axis)
{if(choiceScaleHelpers)
{choiceScaleHelpers.previewQuestionObj=null;choiceScaleHelpers.activePreviewing=true;}
var questionObj=Question.getInstance(questionId);var lib=choiceScaleHelpers.getScaleLibrary(questionObj);var currentDef=questionObj.getScaleDefinition(axis);var currentScaleName=currentDef.scaleName;var currentScaleType=currentDef.scaleType;var reverseCheckbox;var menu=QBuilder('ul',{className:'ResponseScalesMenu'},[QBuilder('li',{className:'reverse'},[QBuilder('a',{className:'MenuItemLink',clickcallback:'Question.reverseScale',instanceid:questionId,p1:axis,p2:'$evt'},[reverseCheckbox=QBuilder('input',{type:'checkbox',id:'Reverse_'+axis,clickcallback:'Question.reverseScale',instanceid:questionId,p1:axis,p2:'$evt'}),QBuilder('label',{htmlFor:'Reverse_'+axis,clickcallback:'Question.reverseScale',instanceid:questionId,p1:axis,p2:'$evt'},getMessage('EditSection','ReverseOrder'))])]),QBuilder('li',{className:'Separator'},'-')]);if(currentDef.reverse)
{reverseCheckbox.checked=true;reverseCheckbox.defaultChecked=true;reverseCheckbox=null;}
if(typeof choiceScales!='undefined')
{for(var scaleName in choiceScales)
{var scaleDef=choiceScales[scaleName];if(scaleDef['lib']==lib)
{var defaultLength='';if(scaleDef['defaultLength'])
{defaultLength=scaleDef['defaultLength'];}
if(scaleDef)
{var checkClass='';if(scaleName==currentScaleName)
{checkClass='check';if(currentScaleType=='category')
{checkClass='check2';}}
var li;menu.appendChild(li=QBuilder('li',{className:checkClass},[QBuilder('a',{className:'MenuItemLink',href:'javascript:void(0)',togglecheckexclusive:'true',clickcallback:'Question.setSelectedResponseScale',instanceid:questionId,p1:scaleName,p2:'',p3:axis,p4:defaultLength},[QBuilder('a',{href:'javascript:void(0)',className:'LikertIcon',scaletype:'likert',clickcallback:'Question.setSelectedResponseScale',instanceid:questionId,p1:scaleName,p2:'likert',p3:axis,p4:defaultLength}),QBuilder('a',{href:'javascript:void(0)',className:'CategoryIcon',scaletype:'category',clickcallback:'Question.setSelectedResponseScale',instanceid:questionId,p1:scaleName,p2:'category',p3:axis,p4:defaultLength}),scaleDef['name']])]));li.onmouseover=choiceScaleHelpers.getPreviewScaleClosure(scaleName,axis);}}}}
if(Qualtrics.Browser.IE)
{menu.onmouseleave=QES_Global.refreshSelectedCanvas;}
else
{menu.onmouseout=QES_Global.refreshSelectedCanvas;}
return menu;},refreshSelectedCanvas:function()
{var questionObj=QuestionActions.selectedRegistry[0];if(questionObj)
{questionObj.refreshCanvas();}},getRevisionsMenu:function()
{var surveyId=BaseForm.getInstance().id;return{ajax:{action:'GetRevisionsV2',parameters:{SurveyID:surveyId},postparser:'QES_Global.buildRevisionsMenuDef'}};},buildRevisionsMenuDef:function(transport)
{var revisionInfo=Qualtrics.parseJSON(transport);QModules.loadModule('revisionhistory.js');QES_Global.revisionHistory=new Qualtrics.RevisionHistory(BaseForm.getInstance().id,revisionInfo);var menuDef={header:'QES_Global.buildRevisionsMenuHeader',className:'RevisionMenu',fixed:true};var items=[];var revisions=QES_Global.revisionHistory.revisions;for(var i=0;i<revisions.length;i++)
{var rev=revisions[i];var item={domNode:'Qualtrics.RevisionHistory.buildMenuItem('+(rev.RevisionNumber)+')'};items.push(item);}
menuDef.items=items;return menuDef;},buildRevisionsMenuHeader:function(){return QBuilder('div',{className:'RevisionMenuHeader'},[QBuilder('span',{className:'RevisionTitle'},[getMessage('EditSection','Revision')]),QBuilder('span',{className:'DateTitle'},[getMessage('SiteWide','Date')]),QBuilder('span',{className:'DescriptionTitle'},[getMessage('SiteWide','Description')])]);},openRevisions:function()
{QES_Global.saveSurvey();var win=new Q_Window('ViewRevisionHistory',{title:'Revision History',loading:true,width:'675',buttons:['close']});var formId=BaseForm.getInstance().id;QModules.loadModule('revisionhistory.js',{onComplete:function(){QES_Global.revisionHistory=new Qualtrics.RevisionHistory(formId);win.setContent(QES_Global.revisionHistory.build());QES_Global.revisionHistory.onComplete=function()
{QES_Global.revisionHistory.refresh();win.center();};}});},openCreateRevision:function()
{var win=new Q_Window('CreateNewRevision',{title:getMessage('EditSection','CreateRevision'),loading:true,width:'500',buttons:['close','save:QES_Global.createManualRevision|'+getMessage('EditSection','CreateRevision')]});var formId=BaseForm.getInstance().id;QModules.loadModule('createrevision.js',{onComplete:function(){var newRev=new Qualtrics.CreateRevision(formId);win.setContent(newRev.build());newRev.onComplete=function()
{win.center();};}});},editRevisionDescription:function(event,i)
{Event.stop(event);QES_Global.revisionHistory.editRevisionDescription(i);},editCurrentRevisionDescription:function()
{if(QES_Global.currentRevision)
{QES_Global.currentRevision.editRevisionDescription();}},confirmSetRevisionToCurrent:function()
{var options={};options['title']=getMessage('EditSection','RestoreRevision');options['message']=getMessage('EditSection','ConfirmRestoreRevision');options['okCallBack']='QES_Global.setRevisionToCurrent';QualtricsCPTools.showConfirmDialog(options);},setRevisionToCurrent:function()
{QES_Global.saveSurvey();new Ajax.Request('Ajax.php?action=SetRevisionToCurrent',{parameters:{RevisionId:BaseForm.getInstance().revisionId,RevisionNumber:BaseForm.getInstance().revisionNumber},onSuccess:function(transport)
{if(Qualtrics.System.productName=='ThreeSixty')
PageAction("ChangePage","Form");else
PageAction("ChangePage","EditSection");}});},createManualRevision:function()
{var description=$('NewRevisionDescription').getValue();var onSuccess=function(response){if(response.RevisionId===0)
{alert(getMessage('EditSection','IdenticalSurveyNoRevision'));}
Q_Window.closeWindow();};var onFailure=function(response){Q_Window.closeWindow('CreateNewRevision');var options={title:getMessage('SiteWide','Error'),message:response.ErrorMessage,moreInfo:response.ErrorMessage,showCloseButton:false};QualtricsCPTools.showAlertDialog(options);};QES_Global.saveSurvey(false,false,false,true);QES_Global.createRevision(description,onSuccess,onFailure);},createRevision:function(opt_description,opt_onSuccess,opt_onFailure)
{opt_description=opt_description||getMessage("EditSection","Autorevision");new Ajax.Request('Ajax.php?action=createRevisionV2',{parameters:{description:opt_description,surveyId:BaseForm.getInstance().id},onSuccess:function(transport){QES_Global.createRevision.lastCreated=new Date();var response=transport.responseText.evalJSON();if(opt_onSuccess)
{opt_onSuccess(response);}},onFailure:function(transport){var response=transport.responseText.evalJSON();if(opt_onFailure)
{opt_onFailure(response);}}});},exportSurvey:function()
{QES_Global.saveSurvey(false);var options=null;if(BaseForm.getInstance().protectSelectionIds())
{options="ProtectSelectionIds";}
PageAction('ExportSurvey',null,null,null,null,options);},exportSurveyToWordDialog:function(options)
{QES_Global.saveSurvey(false);options=options||{};var numberQuestionsCheck=QBuilder('input',{type:'checkbox',id:'wordExportNumberQuestions',name:'wordExportNumberQuestions'});var numberQuestionsInput=QBuilder('div',{},[numberQuestionsCheck,QBuilder('label',{htmlFor:'wordExportNumberQuestions'},getMessage('EditSection','NumberQuestionsWordExport'))]);var showLogicCheck=QBuilder('input',{type:'checkbox',id:'wordExportShowLogic',name:'wordExportShowLogic'});var showLogicInput=QBuilder('div',{},[showLogicCheck,QBuilder('label',{htmlFor:'wordExportShowLogic'},getMessage('EditSection','ShowLogic'))]);var showCodedValuesCheck=QBuilder('input',{type:'checkbox',id:'wordExportShowCodedValues',name:'wordExportShowLogic'});var showCodedValuesInput=QBuilder('div',{},[showCodedValuesCheck,QBuilder('label',{htmlFor:'wordExportShowCodedValues'},getMessage('EditSection','ShowCodedValues'))]);var stripHTMLTagsCheck=QBuilder('input',{type:'checkbox',id:'wordExportStripHTMLTags',name:'wordExportStripHTMLTags'});var stripHTMLTagsInput=QBuilder('div',{},[stripHTMLTagsCheck,QBuilder('label',{htmlFor:'wordExportStripHTMLTags'},getMessage('EditSection','StripHTMLTags'))]);var languageInput=QBuilder('div',{className:'WordExportLanguageButton'},[]);if(BaseForm.getInstance().languages&&Object.keys(BaseForm.getInstance().languages).length>1)
{new Ajax.Request('Ajax.php?action=GetFormLanguageInformation',{asynchronous:false,onComplete:function(t){var l=t.responseText.evalJSON();var systemLanguages=l.SystemLanguages||{};var customLanguages=l.CustomLanguages||{};var availableLanguages=l.AvailableLanguages||{};var lang=BaseForm.getInstance().defaultLanguage;var list={};var count=0;for(var language in availableLanguages)
{if(systemLanguages[language])
list[language]=systemLanguages[language];else if(customLanguages[language]&&customLanguages[language]['DisplayName'])
list[language]=customLanguages[language]['DisplayName'];else
continue;count++;}
languageInput.appendChild(QMenu.buildSelectMenuButton(lang,'wordExportLanguage',{list:list,className:'Left'},'QES_Global.buildWordExportLanguageMenu:',{}));}});}
if(!options.numberQuestions)
{numberQuestionsCheck.checked=true;numberQuestionsCheck.defaultChecked=true;}
else
{numberQuestionsCheck.checked=options.numberQuestions;}
if(!options.showLogic)
{showLogicCheck.checked=true;showLogicCheck.defaultChecked=true;}
else
{showLogicCheck.checked=options.showLogic;}
if(!options.showCodedValues)
{showCodedValuesCheck.checked=true;showCodedValuesCheck.defaultChecked=true;}
else
{showCodedValuesCheck.checked=options.showCodedValues;}
if(!options.stripHTMLTags)
{stripHTMLTagsCheck.checked=true;stripHTMLTagsCheck.defaultChecked=true;}
else
{stripHTMLTagsCheck.checked=options.stripHTMLTags;}
var disclaimerDiv=QBuilder('div',{className:'Help'},[getMessage('EditSection','ExportToWordDisclaimer')]);$(disclaimerDiv).setStyle({width:'375px'});var panel=QBuilder('div',{className:'pdfExportOptions'},[disclaimerDiv,QBuilder('br'),numberQuestionsInput,showLogicInput,showCodedValuesInput,stripHTMLTagsInput,languageInput,QBuilder('div',{className:'clear'})]);var win=new Q_Window({id:'QPDFPrinter',width:'auto',height:'auto',title:getMessage('EditSection','ExportSurveyToWord'),buttons:['cancel',{icon:'',text:getMessage('EditSection','Export'),click:'QES_Global.exportSurveyToWord',className:'positive'}]});win.setContent(panel);},exportSurveyToWord:function()
{var options={};if($('wordExportNumberQuestions'))
{options.numberQuestions=$('wordExportNumberQuestions').checked;}
if($('wordExportShowLogic'))
{options.showLogic=$('wordExportShowLogic').checked;}
if($('wordExportShowCodedValues'))
{options.showCodedValues=$('wordExportShowCodedValues').checked;}
if($('wordExportStripHTMLTags'))
{options.stripHTMLTags=$('wordExportStripHTMLTags').checked;}
if($('wordExportLanguage'))
{options.language=$('wordExportLanguage').value;}
PageAction('ExportSurveyToWord',null,Object.toJSON(options),null);Q_Window.closeWindow('QPDFPrinter');},importSurvey:function()
{QES_Global.saveSurvey();QuestionActions.unselectAll();QModules.loadModule('importsurvey.js');Qualtrics.ImportSurvey.openImportSurveyWindow('UploadSurveyImport',getMessage('EditSection','ImportSurvey'));},printForm:function()
{QES_Global.saveSurvey(false);popup=window.open('Ajax.php?action=GetSurveyPrintPreview','_blank','width=819,height=600,'+getPositioningExtras(819,600)+'directories=no,location=no,menubar=yes,scrollbars=yes,status=no,toolbar=no,resizable=yes');if(popup.focus)
popup.focus();Event.stop(event);return false;},displayAccessibilityBanner:function()
{new Ajax.Request('Ajax.php?action=checkAccessibility',{parameters:{sid:Qualtrics.User.currentSurveyId},onSuccess:function(transport)
{var response=transport.responseText.evalJSON();accessible=response.Accessible;if(!accessible)
{var oldBanner=$('accessibilityBanner');if(oldBanner==null)
{var banner=QBuilder('div',{id:'accessibilityBanner'},[getMessage('EditSection','NotCompliant'),QBuilder('a',{href:'http://www.qualtrics.com/university/accessibility/',target:'_blank'},getMessage('SiteWide','More').toLowerCase()+'...')]);$('SurveyHeader').appendChild(banner);}}}});},showManageResponseSets:function()
{QModules.loadModule('QManageResponseSets.js');var manageRS=new QManageResponseSets(QES_Global.updateResponseSets);manageRS.show();},updateResponseSets:function(rs)
{$('responseSetSelect').innerHTML='';for(var id in rs)
{if(rs[id].Active)
$('responseSetSelect').appendChild(QBuilder('option',{value:id,selected:''},rs[id].Name));else
$('responseSetSelect').appendChild(QBuilder('option',{value:id},rs[id].Name));}},getAdvancedOptionMenu:function()
{if(BaseForm.getInstance().revisionId)
{var disableAction='return false;';var disabledClassName='Disabled';}
var exportSurvey={action:disableAction||'QES_Global.exportSurvey',display:getMessage('EditSection','ExportSurvey'),id:'advancedoptions-export',className:disabledClassName};var exportSurveyToWord={action:disableAction||'QES_Global.exportSurveyToWordDialog',display:getMessage('EditSection','ExportSurveyToWord')+'...',id:'advancedoptions-exporttoword',className:disabledClassName};var publishSurvey='';var copyToLibrary='';if(Qualtrics.User.accountType=='Server Administrator'||Qualtrics.User.accountType=='Multi-Brand Administrator')
{publishSurvey={action:disableAction||'Qualtrics.PublishProduct.openDialog('+Survey.getInstance().id+')',display:getMessage('Marketplace','PublishToMarket')+'...',className:disabledClassName};copyToLibrary={action:disableAction||'Qualtrics.PublishProduct.openDialog('+Survey.getInstance().id+', null, null, brand)',display:getMessage('Marketplace','CopyToLibrary')+'...',className:disabledClassName};}
var salesforce={display:getMessage('EditSection','SalesForce'),submenu:{items:[{action:disableAction||'QES_Global.openSalesforceLeadTrigger',id:'sfdc-webtolead',display:getMessage('EditSection','SalesForceWTL_Ellipses')}]},className:disabledClassName};if(Survey.getInstance().getPermission('salesforceIntegration',true)=="1")
{salesforce.submenu.items.push({action:'QES_Global.openSalesforceResponseMapping',id:'sfdc-responsemapping',display:getMessage('EditSection','SalesForceRM')+'...'});salesforce.submenu.items.push({action:'QES_Global.openSalesforceOutboundMessage',id:'sfdc-triggeremailsurvey',display:getMessage('EditSection','SalesForceTES')+'...'});salesforce.submenu.items.push({action:'QES_Global.openSalesforceAccountData',display:getMessage('EditSection','SalesForceSLSA')+'...'});}
var omniture=null;if(Survey.getInstance().getPermission('omnitureIntegration',true)=="1")
{omniture={display:disableAction||getMessage('EditSection','Omniture')+'...',id:'adobeanalytics',action:'QES_Global.openOmnitureConfig',className:disabledClassName};}
var revisionHistory={action:'QES_Global.openRevisions',display:getMessage('EditSection','ViewRevisionHistory')+'...'};var saveRevision={action:disableAction||'QES_Global.openCreateRevision',display:getMessage('EditSection','CreateNewRevision')+'...',className:disabledClassName};var eventLog=null;if(Qualtrics.supportMode)
{eventLog={action:'QES_Global.openEventLog',display:getMessage('EditSection','FormEventLog')+'...'};}
var triggers='';if(Survey.getInstance().getPermission('useAETriggers',true))
{triggers={display:getMessage('EditSection','Triggers'),submenu:{items:[{action:'QES_Global.openEmailTriggers',id:'emailtriggers',display:getMessage('EditSection','EmailTriggers')+'...'},{action:'QES_Global.openPanelTriggers',id:'paneltriggers',display:getMessage('EditSection','PanelTriggers')+'...'}]}};}
var conjoint='';var addConjoint='';if(Survey.getInstance().getPermission('useAEConjoint'))
{conjoint={action:disableAction||'QES_Global.openConjoints',display:getMessage('EditSection','Conjoints')+'...',id:'conjointanalyses',className:disabledClassName};addConjoint={action:disableAction||'Qualtrics.createNewConjoint',id:'addconjointblock',display:getMessage('EditSection','AddConjoint'),className:disabledClassName};}
var importBenchmarkBlock='';if(Qualtrics.Features.BenchmarkSurveys&&Qualtrics.User.useBenchmarkPermission)
{importBenchmarkBlock={action:disableAction||"importBenchmarkBlock()",display:getMessage('EditSection','ImportBenchmarkBlock'),className:disabledClassName};}
var addBenchmarkBlock='';if(Qualtrics.User.canAddBenchmarkBlock&&Qualtrics.supportMode)
{addBenchmarkBlock={action:disableAction||"addBenchmarkBlock()",display:getMessage('EditSection','AddBenchmarkBlock'),className:disabledClassName};}
var translate='';var isDemo=Qualtrics.System.brandType=='Demo';var canTranslate=Survey.getInstance().getPermission('translateSurveys',true);if(canTranslate||isDemo)
{translate={action:disableAction||((!canTranslate&&isDemo)?'QualtricsCPTools.showUpgradeDialog(Translate)':'PageActionGet(ChangePage,EditSection,Translate,,true)'),display:getMessage('EditSection','TranslateSurvey')+'...',id:'advancedoptions-translate',className:disabledClassName};}
var surveyPreviewMode=BaseForm.getInstance()&&BaseForm.getInstance().defaultPreviewMode;var mobileCompatibilityChecker=BaseForm.getInstance()&&BaseForm.getInstance().mobileCompatibilityChecker;var menuDef={items:[{action:disableAction||'addBlock()',display:getMessage('EditSection','AddBlock'),className:disabledClassName},addConjoint,importBenchmarkBlock,addBenchmarkBlock,{separator:'1'},{action:'toggleSurveyPreviewMode($evt)',display:getMessage('EditSection','SurveyPreviewMode'),checked:surveyPreviewMode},{action:disableAction||'QES_Global.stripFormattingOnSelectedQuestions',display:getMessage('EditSection','StripFormatting')+'...',className:disabledClassName},{action:disableAction||'QES_Global.autoNumberQuestions',display:getMessage('EditSection','AutoNumber')+'...',className:disabledClassName},{action:disableAction||'QES_Global.openBlockRandomization',display:getMessage('EditSection','BlockRandomization')+'...',className:disabledClassName},{action:disableAction||'toggleMobileCompatiblityChecker($evt)',display:getMessage('EditSection','MobileCompatibilityChecker'),checked:mobileCompatibilityChecker,id:'MobileCopatibilityCheckerMenuItem',className:disabledClassName},{separator:'1'},{action:disableAction||'QES_Global.openSearchAndReplace',display:getMessage('EditSection','SearchAndReplace')+'...',className:disabledClassName},{separator:'1'},{action:disableAction||'QES_Global.checkAccessibility',display:getMessage('EditSection','CheckAccessibility')+'...',className:disabledClassName},triggers,salesforce,omniture,{action:'QES_Global.openQuotas',id:'advancedoptions-quotas',display:getMessage('EditSection','Quotas')+'...'},conjoint,{separator:'1'},translate,{action:disableAction||'PageActionGet(ChangePage,EditSection,GradingEditor,,true)',display:getMessage('EditSection','GradingEditor')+'...',id:'advancedoptions-scoring',className:disabledClassName},{action:disableAction||'QES_Global.openSurveyTester',display:getMessage('EditSection','SurveyTester')+'...',className:disabledClassName},{separator:'1'},revisionHistory,saveRevision,{action:'QES_Global.importSurvey',id:'advancedoptions-import',display:getMessage('EditSection','ImportSurvey')+'...'},exportSurvey,exportSurveyToWord,publishSurvey,copyToLibrary]};if(QES_Global.processAdvancedOptionsMenuDef)
{menuDef=QES_Global.processAdvancedOptionsMenuDef(menuDef);}
return menuDef;},scrollToPos:function(pos,speed)
{if(speed===undefined)
{speed=0.0005;}
else if(speed<0.00001)
{speed=0;}
QES_Global.scroller=new Effect.ScrollToY(pos,{duration:speed*pos});},ColumnLabelHandlers:{NPS:{calibrateLabels:function(q)
{if(q.questionType!='NPS')
{return;}
var labelCount=q.getColumnLabelCount();var defaultText=[];if(labelCount==1)
{defaultText.push(getMessage('EditSection','NPSThirdLabelDescription'));}
else if(labelCount==2)
{defaultText.push(getMessage('EditSection','NPSFirstLabelDescription'));defaultText.push(getMessage('EditSection','NPSSecondLabelDescription'));}
else if(labelCount==3)
{defaultText.push(getMessage('EditSection','NPSFirstLabelDescription'));defaultText.push(getMessage('EditSection','NPSThirdLabelDescription'));defaultText.push(getMessage('EditSection','NPSSecondLabelDescription'));}
if(labelCount>0)
{var labels=q.columnLabels;for(var i=0;i<labelCount;i++)
{var label=labels[i];if(label.isDefaultLabel())
{label.text=defaultText[i];}}}}},addColumnLabel:function()
{if(QuestionActions&&QuestionActions.selectedRegistry&&QuestionActions.selectedRegistry.length===1)
{var q=QuestionActions.selectedRegistry[0];if(q)
{var maxValue=QuestionTypes[q.questionType]['questionOptions']['sections']['ColumnLabelsCounter']['maxValue'];if(maxValue&&q.options.ColumnLabelsCounter>=maxValue)
{return;}
if(q.columnLabelsTrash&&q.columnLabelsTrash.length>0)
{var restoredLabel=q.columnLabelsTrash.pop();var newRestoredLabel=q.addColumnLabel(restoredLabel.text);newRestoredLabel.setIsDefaultLabel(restoredLabel.isDefaultLabel());}
else
{q.addDefaultColumnLabel();}
this.NPS.calibrateLabels(q);q.refresh();}}},removeColumnLabel:function()
{if(QuestionActions&&QuestionActions.selectedRegistry&&QuestionActions.selectedRegistry.length===1)
{var q=QuestionActions.selectedRegistry[0];if(q)
{q.removeColumnLabel();this.NPS.calibrateLabels(q);q.refresh();}}},handleColumnLabelSpinnerKeyDown:function(evt)
{if(!evt)evt=window.event;if(evt&&evt.keyCode==Event.KEY_RETURN)
{QES_Global.ColumnLabelHandlers.updateColumnLabelsBySpinnerValue();$('ColumnLabelsCounter_Spinner').focus();}},handleColumnLabelSpinnerBlur:function()
{QES_Global.ColumnLabelHandlers.updateColumnLabelsBySpinnerValue();},updateColumnLabelsBySpinnerValue:function()
{var spinnerInput=$('ColumnLabelsCounter_Spinner');var val=parseInt(Toolbox.getInstance().getSpinnerValue(spinnerInput));if(QuestionActions&&QuestionActions.selectedRegistry&&QuestionActions.selectedRegistry[0])
{var selectedQuestion=QuestionActions.selectedRegistry[0];selectedQuestion.options.useSpinnerValue=true;var maxValue=QuestionTypes[selectedQuestion.questionType]['questionOptions']['sections']['ColumnLabelsCounter']['maxValue'];var minValue=QuestionTypes[selectedQuestion.questionType]['questionOptions']['sections']['ColumnLabelsCounter']['minValue'];if(maxValue!=undefined&&spinnerInput.value>maxValue)
val=maxValue;if(minValue!=undefined&&spinnerInput.value<minValue)
val=minValue;spinnerInput.value=val;selectedQuestion.options.ColumnLabelsCounter=val;selectedQuestion.refresh();selectedQuestion.setEdited();}}}};window.updateScroll=function(event)
{scrollInfo=getScrollInfo();if((event.clientX)||(event.pageX))
{updateCustomMousePos(event);}
else
{updateCustomMousePos();}
updateFixedTop();QualtricsCPTools.updateScrollables("RevisionsHeadsup","Survey","RevisionsHeadsupWrapper");updateRevisionLinks();};window.updateRevisionLinks=function()
{if($("RevisionsHeadsup"))
{var scrollTop=getScrollInfo()[1];var prevRev=BaseForm.getInstance().prevRevision;var nextRev=BaseForm.getInstance().nextRevision;$("PrevRev").writeAttribute("href","?v="+(prevRev)+"&p="+scrollTop);$("NextRev").writeAttribute("href","?v="+(nextRev)+"&p="+scrollTop);}};window.updateFixedTop=function()
{if(Qualtrics.Browser.IE&&Qualtrics.Browser.Version<7)
{if($('FixedTop'))
{var viewBottom=scrollInfo[1]+getPageSize()[3]-38;$('FixedTop').setStyle({top:viewBottom+'px'});}}};window.start=new Date();window.Survey=Class.create(BaseForm,{lastScales:null,initialize:function(surveyId,parentId)
{Survey._instance=this;QuestionActions.moveQueue.length=0;this.baseInit(surveyId,parentId);},buildHeader:function()
{var header=QBuilder('div');var title=QBuilder('div',{className:'SurveyName'},[QBuilder('span',{className:'Editable',onmouseover:'AddOver(this)',onmouseout:'RemoveOver(this)',clickcallback:'QES_Global.editSurveyName',p1:'$evt',id:'SurveyNameEditable'},[this.surveyNameObj.text])]);var progress=QBuilder('div',{id:'ProgressArea'},[QBuilder('div',{id:'ProgressBar'})]);$(progress).setStyle({width:'0px'});if(BaseForm.getInstance().getPermission('seeQuestions',true)!='0')
{header.appendChild(title);}
if(this.surveyDescriptionObj!=null)
{var description=QBuilder('div',{className:'SurveyDescription'},[QBuilder('span',{className:'Editable SectionSubTitle',onmouseover:'AddOver(this)',onmouseout:'RemoveOver(this)',clickcallback:'QES_Global.editSurveyDescription',p1:'$evt',id:'SurveyDescriptionEditable'},[this.surveyDescriptionObj.text])]);header.appendChild(description);}
header.appendChild(progress);return header;},rename:function(name,opt_onCompleteCallback)
{var oldName=Qualtrics.surveys[Survey.getInstance().id];if(name!=oldName&&name!='')
{var surveySelector=Qualtrics.StatusBarModules.SurveySelector.getInstance();surveySelector.disableRenameSurvey();new Ajax.Request('Ajax.php?action=SetSurveyName',{parameters:{title:name},onComplete:function(transport)
{var response=Qualtrics.parseJSON(transport.responseText);if(opt_onCompleteCallback)
{opt_onCompleteCallback(response,name);}}});}},addFirstBlock:function()
{addBlock();this.refresh();},clearDom:function()
{if(window.QuestionActions)
{QuestionActions.unselectAll();}
QuestionRenderer.cancelAllRenderings();deleteChildren(this.element);if($('TrashArea'))
{$('TrashArea').remove();}},renderBlocks:function()
{if(this.blocks.length==1)
{this.bodyNode.appendChild(QBuilder('div',{className:'AddFirstBlock'},[QBuilder('a',{className:'AddFirstBlock',clickcallback:'BaseForm.addFirstBlock'},[QBuilder('span',{className:'icon'}),QBuilder('span',{},getMessage('EditSection','AddBlock'))])]));return;}
var survey=this;for(var i=0,len=this.blocks.length;i<len;++i)
{var hasFilteredQuestions=false;var block=this.blocks[i];if(survey.searchFilter)
{if(!block.getFilteredQuestionsCount())
{continue;}}
block.render();}
this.renderedBlockPointer=0;this.renderNextBlock();},renderNextBlock:function()
{if(this.blocks[this.renderedBlockPointer])
{var block=this.blocks[this.renderedBlockPointer];if(!block.collapsed&&block.questions&&block.questions.length)
{block.renderQuestions();this.renderedBlockPointer++;}
else
{this.renderedBlockPointer++;this.renderNextBlock();}}
else
{Survey.getInstance().finishRendering();}},checkForRepeatedScales:function(questionObj)
{if(!questionObj.questionId)
{if(!this.lastScales)this.lastScales={};var answerScale=questionObj.getScale('answers');if(answerScale)
{if(this.lastScales.answers&&this.lastScales.answers.join()==answerScale.join())
{if(!Object.isUndefined(choiceScales))
{choiceScaleHelpers.setCustomScale(answerScale);}}
this.lastScales.answers=answerScale;}}},unlockSurveyConfirm:function(opt_smartUnlockInitiated,evt)
{if(evt&&evt.shiftKey&&evt.metaKey)
{if(evt.preventDefault)
evt.preventDefault();this.unlockSurvey();return;}
if(!$('UnlockSurveyConfirm'))
{var options={id:'UnlockSurveyConfirm',closeButton:false,buttons:[{icon:'cancel',text:getMessage('SiteWide','Cancel'),click:'Q_Window.closeWindow()',className:'negative'},{icon:'check',text:getMessage('SiteWide','Unlock'),click:'Survey.unlockSurvey()',className:'positive'}]};if(Survey.getInstance().revisionId)
{options.title=getMessage('EditSection','SurveyLocked'),options.width='620px';options.buttons=[{icon:'check',text:getMessage('SiteWide','OK'),click:'Survey.unlockSurvey()',className:'positive'}];var warningDiv=QBuilder('label',{className:'Warning'},[getMessage('EditSection','RevisionLocked')]);}
else if(opt_smartUnlockInitiated===true)
{options.title=getMessage('EditSection','UnlockSurveyConfirmSmart'),options.width='620px';var warningDiv=QBuilder('label',{className:'Warning'},[getMessage('EditSection','UnlockSurveyConfirmSmartContent')+' ',getMessage('EditSection','InvalidateResults',String(BaseForm.getInstance().responses))+' ',QBuilder('a',{href:"https://www.qualtrics.com/university/researchsuite/testing-and-editing-an-active-survey/",target:'_BLANK'},[getMessage('EditSection','LearnMore')])]);}
else
{options.title=getMessage('EditSection','UnlockSurveyConfirm'),options.width='620px';var warningDiv=QBuilder('label',{className:'Warning'},[getMessage('EditSection','InvalidateResults',String(BaseForm.getInstance().responses))+' ',QBuilder('a',{href:"https://www.qualtrics.com/university/researchsuite/testing-and-editing-an-active-survey/",target:'_BLANK'},[getMessage('EditSection','LearnMore')])]);}
var popupWindow=new Q_Window(options);popupWindow.setContent(QBuilder('div',{},[warningDiv]));}},unlockSurvey:function()
{Survey.getInstance().locked=false;Q_Window.closeWindow('UnlockSurveyConfirm');if($('SurveyLockedWarning'))
{var warning=QBuilder('div',{id:'SurveyLockedWarning',className:'LockedWarning'});var unlockLink=QBuilder('a',{'clickcallback':'Survey.lockSurvey'},[getMessage('EditSection','SurveyLockLink')]);$(warning).appendChild(QBuilder('span',{},[QBuilder('div',{className:'Icon'}),getMessage('EditSection','SurveyRelockWarning1')+' ',unlockLink,' '+getMessage('EditSection','SurveyRelockWarning2')]));$('SurveyLockedWarning').replace(warning);Qualtrics.StatusBar.getInstance().removeElement('SurveyLocked');}
if(!$('SurveyLastSavedLabel')&&!BaseForm.getInstance().revisionId)
{var surveyLastSaved=new Qualtrics.StatusBarModules.SurveyLastSaved(QSB_Global.surveySavedMessage);Qualtrics.StatusBar.getInstance().attachToLeft(surveyLastSaved.build());}
QSB_Global.surveyLocked=false;QSB_Global.surveyUnlocked=true;new Ajax.Request('Ajax.php?action=SetActiveSurveyLock',{parameters:{SurveyLock:0,SurveyID:Survey.getInstance().id}});BaseForm.getInstance().refresh();},lockSurvey:function()
{this.save();Survey.getInstance().locked=true;Qualtrics.StatusBar.getInstance().removeElement('SurveyLastSaved');if(!$('SurveyLocked'))
{var surveyLocked=new Qualtrics.StatusBarModules.SurveyLockInfo();Qualtrics.StatusBar.getInstance().attachToLeft(surveyLocked.build());}
QSB_Global.surveyLocked=true;QSB_Global.surveyUnlocked=false;new Ajax.Request('Ajax.php?action=SetActiveSurveyLock',{parameters:{SurveyLock:1,SurveyID:Survey.getInstance().id}});BaseForm.getInstance().refresh();},save:function(sync)
{QES_Global.saveSurvey(sync);},importSurvey:function(surveyId,opt_libraryId,includeFlow)
{if(Q_Window.getInstance('FlowConfirm'))
{Q_Window.getInstance('FlowConfirm').destroy();}
if(surveyId)
{includeFlow=true;if(includeFlow===undefined)
{var dialog=new Q_Window('FlowConfirm',{});dialog.setContent(QBuilder('div',{},[QBuilder('a',{className:'qbutton negative',clickcallback:'Q_Window.closeWindow(FlowConfirm)'},getMessage('SiteWide','Cancel')),QBuilder('a',{className:'qbutton',clickcallback:'Survey.importSurvey',p1:surveyId,p2:false,instanceid:this.id},'Import Survey Questions Only'),QBuilder('a',{className:'qbutton',clickcallback:'Survey.importSurvey',p1:surveyId,p2:true,instanceid:this.id},'Import Survey Questions & Survey Flow')]));return;}
var params={SrcSurveyID:surveyId,IncludeFlow:includeFlow};if(opt_libraryId)
{params.LibraryID=opt_libraryId;}
new Ajax.Request('Ajax.php?action=ImportSurvey',{parameters:params,onComplete:function()
{Survey.getInstance().reload();}});}},newBlock:function(type)
{if(type=='Trash')
{return new Trash();}
else if(type=='Conjoint')
{return new ConjointBlock();}
else if(type=='Benchmark')
{return new BenchmarkBlock();}
return new Block();},getTrash:function()
{return this.trashBlock;}});Survey._instance=BaseForm._instance;Survey.getInstance=BaseForm.getInstance;window.Block=Class.create(BaseBlock,{unsavedTimer:null,initialize:function()
{this.baseInit();},build:function()
{},createQuestion:function(type,opt_dontAssignQuestionNumber)
{return new Question(this,opt_dontAssignQuestionNumber,type);},redraw:function()
{deleteChildren(this.element);this.element.appendChild(this.buildBlockInner());this.element.appendChild(QBuilder('div',{className:'BlockShadow'}));this.renderQuestions();},render:function(parentId,initial)
{if(this.isReferenceSurveyBlock())
{this.collapsed=true;}
var survey=BaseForm.getInstance();if(this.parentId)parentId=this.parentId;var parentNode=$(parentId);if(this.realQuestionCount>this.collapsedQuestionThreshold)
{this.collapsedQuestionMode=1;}
var className='';if(this.getStatusClassName)
{className=this.getStatusClassName();}
this.element=QBuilder('div',{className:'BlockOuter'+className},[this.buildBlockInner()]);if(this.type=='Trash')
{var trashBottom=QBuilder('div',{className:'TrashBottom'},[QBuilder('div',{className:'LeftCap'}),QBuilder('div',{className:'RightCap'})]);var trash=QBuilder('div',{id:'TrashArea'},[this.element,trashBottom]);trashBottom=null;$(parentId).parentNode.appendChild(trash);}
else
{this.element.appendChild(QBuilder('div',{className:'BlockShadow'}));if(initial)
{parentNode.appendChild(this.element);}
else
{var nextBlock=this.getSibling(1,false);if(nextBlock&&nextBlock.element&&nextBlock.element.parentNode&&nextBlock.element.parentNode.parentNode)
{parentNode.insertBefore(this.element,nextBlock.element);}
else
{parentNode.appendChild(this.element);}}}
if(this.type!='Trash'&&this.questions&&!this.questions.length&&!this.shell)
{this.addEmptyClass();}
blockDiv=null;},getQuestionOverlay:function()
{return'';},getAdditionalClassNames:function()
{return'';},getBlockEDKeys:function()
{var edNames={};var edRegex=/e:\/\/Field\/([^\u0000-\u001F\u007F-\u00BF\/`<>\[\]\{\}?]+)/g;var badKeys={parentObj:true,questionObj:true,block:true};var searchForEd=function(data,depth)
{if(depth>20)
{console.warn("getBlockEDKeys broke: the block definition is recursive",data);return;}
if(!data)
{return;}
else if(typeof data==="string")
{var match,name;while((match=edRegex.exec(data)))
{try
{name=decodeURIComponent(match[1]);edNames[name]=true;}
catch(e)
{console.warn("Failed to comprehend ed \""+match[1]+"\"",e);}}}
else if(typeof data==="object"&&data.length!==undefined)
{for(var i=0;i<data.length;++i)
{searchForEd(data[i],depth+1);}}
else if(typeof data==="object")
{if(data.className)
return;for(var k in data)
{if(badKeys[k])
continue;if(k==="logicEditor")
{searchForEDInLogicEditor(data[k]);}
else
{searchForEd(data[k],depth+1);}}}};var searchForEDInLogicEditor=function(editor)
{var expressions=editor.getAllExpressions();for(var i=0;i<expressions.length;++i)
{var data=expressions[i].data;if(data.LogicType==="EmbeddedField")
{edNames[data.LeftOperand]=true;}}};for(var i=0;i<this.questions.length;++i)
{searchForEd(this.questions[i],0);}
var ret=[];for(var k in edNames)
{ret.push(k);}
return ret;},getBlockEDValue:function(key)
{return this.ED[key];},setBlockED:function(key,value)
{if(value)
{if(this.ED[key]!=value)
{this.changeBlockEDValue(key,value);}}
else if(this.ED[key])
{this.changeBlockEDValue(key);}},changeBlockEDValue:function(key,value)
{if(value)
{this.ED[key]=value;}
else
{delete this.ED[key];}
this.blockEDChanged();},saveBlockED:function()
{msg(getMessage('SiteWide','Saving')+'...','SaveBlock');new Ajax.Request('Ajax.php?action=SaveBlockED',{method:'post',parameters:{BlockId:this.blockId,ED:Object.toJSON(this.getBlockED())},onSuccess:function(){msg(getMessage('SiteWide','Saved'),'SaveBlock');}});},blockEDChanged:function()
{var self=this;clearTimeout(this.unsavedTimer);this.unsavedTimer=setTimeout(function(){self.saveBlockED();},500);},buildEmbeddedDataEditorRow:function(name)
{var self=this;var inputAttrs={type:'text',placeholder:getMessage('EditSection','BlockEmbeddedDataValuePlaceholder',name),id:'EDValue-'+name,value:this.getBlockEDValue(name)||''};if(BaseForm.getInstance().revisionId)
{inputAttrs.readOnly=true;}
var input=QBuilder('input',inputAttrs);Event.observe(input,'keyup',function(){self.setBlockED(name,this.value);});return QBuilder('tr',null,[QBuilder('td',{className:'EDKey'},[QBuilder('label',{htmlFor:'EDValue-'+name},[name+':'])]),QBuilder('td',{className:'EDValue'},[input])]);},buildEmbeddedDataEditor:function()
{var ed=this.getBlockEDKeys();var editor=QBuilder('div',{className:'ReferenceEDEditor'});if(ed.length)
{editor.appendChild(QBuilder('h4',{className:'Title'},[getMessage('EditSection','BlockEmbeddedDataEditorTitle')]));var edTable=QBuilder('table',{className:'EDEditor'});var tableBody=QBuilder('tbody');edTable.appendChild(tableBody);for(var i=0;i<ed.length;i++)
{tableBody.appendChild(this.buildEmbeddedDataEditorRow(ed[i]));}
editor.appendChild(edTable);}
else
{Element.addClassName(editor,'Empty');}
return editor;},buildReferenceBlockDescription:function()
{return QBuilder('div',null,[QBuilder('div',{className:'ReferenceBlockDescription'},[QBuilder('span'),getMessage('EditSection','LibraryReferenceBlockDescription')]),Q.buildMenuButton('','Block.buildReferenceBlockOptionsMenu:'+this.id,'Gear','',{title:getMessage('EditSection','BlockOptions')})]);},buildReferenceSurveyBlockDescription:function()
{return QBuilder('div',null,[QBuilder('div',{className:'ReferenceSurveyBlockDescription'},[QBuilder('span'),getMessage('EditSection','LibraryReferenceSurveyBlockDescription')]),Q.buildMenuButton('','Block.buildReferenceSurveyBlockOptionsMenu:'+this.id,'Gear','',{title:getMessage('EditSection','BlockOptions')})]);},buildBlockInner:function()
{var blockPreviewClass='';if(this.getDefaultPreviewMode()===1)
{blockPreviewClass=' BlockPreview';}
var className='';if(this.collapsed)
{className=' Collapsed';}
if(this.loading)
{className=' BlockLoading';}
if(this.locked)
{className+=' Locked';}
var additionalClasses=this.getAdditionalClassNames();var blockDiv=QBuilder('div',{id:this.id,className:'Block '+this.type+blockPreviewClass+className+additionalClasses});var BlockBorder=QBuilder('div',{className:'BlockBorder'});var blockQuestionsDiv=QBuilder('div',{className:'QuestionsDiv'},[this.getQuestionOverlay()]);BlockBorder.appendChild(this.buildHeader());if(this.isReferenceBlock())
{BlockBorder.appendChild(this.buildEmbeddedDataEditor());}
BlockBorder.appendChild(blockQuestionsDiv);if(this.loading)
{BlockBorder.appendChild(QBuilder('div',{className:'loadingImage'}));}
if(this.type!='Trash')
{var blockFooter=this.buildFooterButtons();BlockBorder.appendChild(blockFooter);if(this.getfooterMouseOverFunction)
{blockFooter.onmouseover=this.getfooterMouseOverFunction();}
if(this.parentId)
{var addBlockLink='';var minimizeBlock='';if(BaseForm.getInstance().getPermission('addBlocks',true)&&!this.isReferenceSurveyBlock())
{addBlockLink=QBuilder('div',{id:'TheAddBlockLink',className:'TheAddBlockLink',clickcallback:'Block.addBlockBelow',instanceid:this.id},getMessage('EditSection','AddBlock'));}
minimizeBlock=QBuilder('div',{clickcallback:'Block.collapseAndScroll',instanceid:this.id,className:'MinimizeBlock'},getMessage('EditSection','MinimizeBlock'));BlockBorder.appendChild(QBuilder('div',{id:this.id+'_removeBlock',className:'BlockOptionsFooter'},[minimizeBlock,addBlockLink]));BlockBorder.appendChild(QBuilder('div',{className:'clear'}));}}
this.questionsDiv=blockQuestionsDiv;blockDiv.appendChild(BlockBorder);return blockDiv;},buildFooterButtons:function()
{if(this.isReferenceSurveyBlock())
{return QBuilder('div',{className:'BlockFooter'});}
var copyQuestionsFrom=this.buildCopyQuestionsFromButton();return QBuilder('div',{className:'BlockFooter'},[copyQuestionsFrom,this.buildAddQuestionButton(),QBuilder('div',{className:'clear'})]);},buildCopyQuestionsFromButton:function()
{var copyQuestionsFrom='';var form=BaseForm.getInstance();if(form&&form.getPermission('copySurveyQuestions',true)=='0')
{copyQuestionsFrom=QBuilder('div',{className:'AddQuestionsFromLibrary'},[]);}
else if(Qualtrics.System.productName=='ThreeSixty')
{copyQuestionsFrom=QBuilder('div',{className:'AddQuestionsFromLibrary'},[QBuilder('div',{className:'TheLink',title:'Copy questions from another 360'},[QBuilder('span',{className:'icon',clickcallback:'QES_Global.addQuestionsFromSurvey',p1:this.id}),QBuilder('label',{clickcallback:'QES_Global.addQuestionsFromSurvey',p1:this.id},getMessage('EditSection','CopyQuestionsFrom')+'...')])]);}
else
{copyQuestionsFrom=QBuilder('div',{className:'AddQuestionsFromLibrary'},[QBuilder('div',{className:'TheLink',title:'Copy questions from another survey, or from the library'},[QBuilder('span',{className:'icon',clickcallback:'QES_Global.addQuestionsFromLibrary',p1:this.id}),QBuilder('label',{clickcallback:'QES_Global.addQuestionsFromLibrary',p1:this.id},getMessage('EditSection','CopyQuestionsFrom')+'...')])]);}
return copyQuestionsFrom;},buildAddQuestionButton:function()
{var addAnotherQuestion='';var form=BaseForm.getInstance();if(Qualtrics.System.productName=='ThreeSixty'&&form&&form.getPermission('editQuestions',true)=='0')
{addAnotherQuestion=QBuilder('div',{className:'AddAnotherQuestion'},[]);}
else
{var addTypeButton='';if(!Qualtrics.Browser.MobileWebKit)
{addTypeButton=QBuilder('div',{downcallback:'QES_Global.showQuestionTypeMenu($el, $evt, '+this.id+')'},[QBuilder('span',{bubbleup:true}),QBuilder('b',{bubbleup:true})]);}
addAnotherQuestion=QBuilder('div',{className:'AddAnotherQuestion'},[QBuilder('div',{className:'TheLink',clickcallback:'QES_Global.addFirstQuestionToBlock',p1:this.id},[QBuilder('span',{className:'icon',bubbleup:true}),QBuilder('label',{bubbleup:true},getMessage('EditSection','CreateANewQuestion')),addTypeButton])]);}
return addAnotherQuestion;},redrawHeader:function()
{deleteChildren(this.headerDom);this.headerDom.appendChild(this.buildHeaderInner());},buildHeader:function()
{this.headerDom=QBuilder('div',{className:'HeaderContainer'},[this.buildHeaderInner()]);return this.headerDom;},buildHeaderInner:function()
{var IE7=(Qualtrics.Browser.IE==true&&Qualtrics.Browser.Version==7)?" IE7":"";var metaTitleSpan=QBuilder('span',{className:'BlockMetaTitle',id:this.id+'_TitleMeta'});$(metaTitleSpan).update(this.getMetaTitle());return QBuilder('div',{className:'BlockHeader '+this.type+'Block'+IE7,clickcallback:'BaseBlock.expand',instanceid:this.id},[QBuilder('div',{className:'LeftCap'}),QBuilder('div',{className:'Arrow',clickcallback:'BlockActions.headerClick($evt)'}),QBuilder('span',{className:'BlockTitle Editable',clickcallback:'BlockActions.headerClick($evt)',id:this.blockNameObj.id},[this.blockNameObj.text]),metaTitleSpan,QMenu.buildMenuButton(getMessage('EditSection','BlockOptions'),'Block.buildBlockOptionsMenu:'+this.id,{alignment:'right',className:'blockOptions'}),QBuilder('div',{className:'ExpandLabel',bubbleup:'true'},getMessage('EditSection','ClickToShowQuestions')),QBuilder('div',{className:'RightCap'}),QBuilder('div',{className:'clear'}),this.buildBlockStatusIcons()]);},buildBlockStatusIcons:function()
{var statusIcons='';if(this.type=='Standard'||this.type=='Default')
{var statusIcons=QBuilder('div',{className:'StatusIcons'});if(this.flow=='false')
{statusIcons.appendChild(this.buildBlockStatusIcon('Flow','Not in Survey Flow','BlockActions.openSurveyFlow('+this.id+')'));}
if(this.locked&&this.passwordProtected)
{statusIcons.appendChild(this.buildBlockStatusIcon('Locked',getMessage('EditSection','BlockPasswordLock'),'BlockActions.confirmUnlock('+this.id+')'));}
else
{if(this.locked===1)
{statusIcons.appendChild(this.buildBlockStatusIcon('Locked','Locked','BlockActions.confirmUnlock('+this.id+')'));}
if(this.locked===2)
{statusIcons.appendChild(this.buildBlockStatusIcon('Locked','Partially Locked','BlockActions.confirmUnlock('+this.id+')'));}
if(this.locked===3)
{statusIcons.appendChild(this.buildBlockStatusIcon('Benchmark','Benchmark','BlockActions.setBenchmarkVariables('+this.id+')'));}}
if(this.looping&&this.looping!='None')
{statusIcons.appendChild(this.buildBlockStatusIcon('Looping','Loop & Merge Text','BlockActions.openBlockOptions('+this.id+', 2)'));}
if(this.randomizeQuestions!='false'&&this.randomizeQuestions!=null)
{statusIcons.appendChild(this.buildBlockStatusIcon('RandomizedQuestions',getMessage('EditSection','RandomizedQuestions'),'BlockActions.openBlockOptions('+this.id+', 1)'));}
statusIcons.appendChild(QBuilder('div',{className:'clear'}));if(statusIcons.children.length>1)
{statusIcons.addClassName('HasIcons');}}
return statusIcons;},refresh:function()
{removeElement(this.element);this.render();},renderQuestions:function(opt_filterIds)
{if(this.questions&&this.questions.length)
{new QuestionRenderer(this.questions,{onComplete:this.parentObj.renderNextBlock.bind(this.parentObj)});}
return;},getfooterMouseOverFunction:function()
{var blockObj=this;return function()
{QES_OverQuestion.questionObj=blockObj;QES_OverQuestion.execute();};},move:function(delta)
{msg(getMessage('EditSection','MovingBlock'),'blockmove');var overlay=new Q_Overlay({opacity:0});var surveyId=BaseForm.getInstance().id;new Ajax.Request('Ajax.php?action=MoveBlock',{method:'post',parameters:{SurveyID:surveyId,BID:this.blockId,SID:this.parentObj.id,delta:delta},onComplete:function(transport)
{overlay.remove();var response=transport.responseText;if(response=='true')
{msg(getMessage('EditSection','BlockMoved'),'blockmove');Survey.getInstance().reload();}
else
{msg(getMessage('EditSection','CannotMoveBlock'),'blockmove');alert(getMessage('EditSection','BlockCouldNotBeMoved'));}}});},openQuestionRandomization:function()
{if(!this.QuestionRandomization)
{QModules.loadModule('QRandomization.js');this.QuestionRandomization=new QuestionRandomization(this,this.id);}
this.QuestionRandomization.show();},buildBlockOptionsMenu:function(blockId)
{var blockObj=this;blockId=this.id;var disabled=' Disabled';var convertToBenchmark='';if(Qualtrics.User.canAddBenchmarkBlock=='true'&&Qualtrics.supportMode)
{convertToBenchmark={display:getMessage('EditSection','ConvertToBenchmark')+'...',action:'QES_Global.convertToBenchmarkBlock('+blockId+')'};}
var viewBlock={display:getMessage('EditSection','ViewBlock')+'...',action:'QES_Global.viewBlock('+blockId+')'};var collapseQuestions={checked:blockObj.collapsedQuestionMode?true:false,display:getMessage('EditSection','CollapseQuestions')+'...',action:'Block.toggleLargeBlockMode:'+blockId+''};var lockBlock={checked:blockObj.locked?true:false,display:getMessage('EditSection','LockBlock')+'...',action:'BlockActions.lockMenuItemClicked('+blockId+')'};var QuestionRandomizationObj={display:getMessage('EditSection','QuestionRandomization')+'...',id:'blockoptions-questionrandomization',action:'BlockActions.openBlockOptions('+blockId+',1)'};var BlockLoopingObj={display:getMessage('EditSection','BlockLooping')+'...',action:'BlockActions.openBlockOptions('+blockId+',2)'};var NextPreviousButtonTextObj={display:getMessage('SiteWide','NextPreviousButtonText')+'...',action:'BlockActions.openBlockOptions('+blockId+',3)'};var moveBlockUp={className:'MoveUp',display:getMessage('EditSection','MoveBlockUp')+'...',action:'Block.move:'+blockId+'(-1)'};var moveBlockDown={className:'MoveDown',display:getMessage('EditSection','MoveBlockDown')+'...',action:'Block.move:'+blockId+'(1)'};var copyBlock={display:getMessage('EditSection','CopyBlock')+'...',action:'BlockActions.copyBlock('+blockId+')',defer:1};var copyBlockToLib='';if(Qualtrics.User.canUploadBlock==1)
{copyBlockToLib={display:getMessage('EditSection','CopyBlockToLibrary')+'...',action:'BlockActions.copyBlockToLibrary('+blockId+')',defer:1};}
var copyQuestionsToLib={display:getMessage('EditSection','CopyQuestionsToLibrary')+'...',action:'BlockActions.copyQuestionsToLibrary('+blockId+')',defer:1};var DeleteBlockObj={display:getMessage('EditSection','DeleteBlock')+'...',action:'BlockActions.confirmDeleteBlock('+blockId+')',defer:1};if(blockObj.isLocked())
{DeleteBlockObj={display:getMessage('EditSection','DeleteBlock')+'...',className:disabled};}
var form=BaseForm.getInstance();if(form)
{if(convertToBenchmark&&!(Qualtrics.User.canAddBenchmarkBlock=='true'&&Qualtrics.supportMode))
convertToBenchmark.className=disabled;if(!form.getPermission('lockBlocks',true))
lockBlock.className=disabled;if(!form.getPermission('blockLooping',true))
BlockLoopingObj.className=disabled;if(!form.getPermission('moveBlocks',true))
{moveBlockUp.className=disabled;moveBlockDown.className=disabled;}
if(!form.getPermission('copyBlock',true))
copyBlock.className=disabled;if(!form.getPermission('copyBlockToLibrary',true))
if(copyBlockToLib)copyBlockToLib.className=disabled;if(!form.getPermission('copySurveyQuestionsToLibrary',true))
copyQuestionsToLib.className=disabled;if(!form.getPermission('deleteBlocks',true))
DeleteBlockObj.className=disabled;}
var menuDef={items:[viewBlock,convertToBenchmark,{separator:1},collapseQuestions,{separator:1},lockBlock,QuestionRandomizationObj,BlockLoopingObj,NextPreviousButtonTextObj,{separator:1},moveBlockUp,moveBlockDown,{separator:1},copyBlock,copyBlockToLib,copyQuestionsToLib,DeleteBlockObj]};if(BaseForm.getInstance().revisionId)
{for(var i in menuDef.items)
{if(menuDef.items[i])
{if(menuDef.items[i].className&&menuDef.items[i].className.indexOf('Disabled')===-1)
{menuDef.items[i].className+=disabled;}
else
{menuDef.items[i].className=disabled;}}}}
return menuDef;},buildReferenceBlockOptionsMenu:function()
{var blockObj=this;var blockId=this.id;var viewBlock={display:getMessage('EditSection','ViewBlock')+'...',action:'QES_Global.viewBlock('+blockId+')'};var collapseQuestions={checked:blockObj.collapsedQuestionMode?true:false,display:getMessage('EditSection','CollapseQuestions')+'...',action:'Block.toggleLargeBlockMode:'+blockId+''};var moveBlockUp={className:'MoveUp',display:getMessage('EditSection','MoveBlockUp')+'...',action:'Block.move:'+blockId+'(-1)'};var moveBlockDown={className:'MoveDown',display:getMessage('EditSection','MoveBlockDown')+'...',action:'Block.move:'+blockId+'(1)'};var deleteBlockObj={display:getMessage('EditSection','DeleteBlock')+'...',action:'BlockActions.confirmDeleteBlock('+blockId+')',defer:1};var menuDef={items:[viewBlock,collapseQuestions,{separator:1},moveBlockUp,moveBlockDown,{separator:1},deleteBlockObj]};return menuDef;},buildReferenceSurveyBlockOptionsMenu:function()
{var blockObj=this;var blockId=this.id;var viewBlock={display:getMessage('EditSection','ViewBlock')+'...',action:'QES_Global.viewBlock('+blockId+')'};var collapseQuestions={checked:blockObj.collapsedQuestionMode?true:false,display:getMessage('EditSection','CollapseQuestions')+'...',action:'Block.toggleLargeBlockMode:'+blockId+''};var menuDef={items:[viewBlock,collapseQuestions]};return menuDef;}});Block.getInstance=BaseBlock.getInstance;Block.getBlockByBlockId=BaseBlock.getBlockByBlockId;window.BenchmarkBlock=Class.create(Block,{initialize:function($super)
{this.subType='Benchmark';if(Qualtrics.supportMode&&Qualtrics.User.canAddBenchmarkBlock)
this.locked=false;else
this.locked=3;this.passwordProtected=false;$super();},buildCopyQuestionsFromButton:function($super)
{if(Qualtrics.supportMode&&Qualtrics.User.canAddBenchmarkBlock)
return $super();return'';},buildAddQuestionButton:function($super)
{if(Qualtrics.supportMode&&Qualtrics.User.canAddBenchmarkBlock)
return $super();return'';},buildBlockStatusIcons:function($super)
{if(Qualtrics.supportMode&&Qualtrics.User.canAddBenchmarkBlock)
this.locked=false;else
this.locked=3;this.passwordProtected=false;return $super();},getQuestionOverlay:function()
{if(Qualtrics.supportMode&&Qualtrics.User.canAddBenchmarkBlock)
return'';return QBuilder('div',{className:'QuestionOverlay'});},getAdditionalClassNames:function()
{return' Benchmark';},parseForBenchmarkVariables:function(benchmarkVariables)
{var regexString=/\${e:\/\/Field\/(.*?)}/g;var vars={};$A(this.questions).each(function(question){var match=null;while(match=regexString.exec(question.text))
{if(!vars[match[1]])
{vars[match[1]]=true;benchmarkVariables.push(match[1]);}}
$A(question.choices).each(function(choice){while(match=regexString.exec(choice.text))
{if(!vars[match[1]])
{vars[match[1]]=true;benchmarkVariables.push(match[1]);}}});});},setBenchmarkVariables:function()
{var benchmarkVariables=[];var buildFromBlockData=false;if(this.benchmarkData&&this.benchmarkData.length!==0)
{buildFromBlockData=true;benchmarkVariables=this.benchmarkData;}
else
{this.parseForBenchmarkVariables(benchmarkVariables);}
if(benchmarkVariables.length===0)
{QualtricsCPTools.showAlertDialog({title:getMessage('EditSection','Info'),message:getMessage('EditSection','NoBenchmarkVariables')});return;}
var benchmarkPopup=new Q_Window({id:'BenchmarkDataPopup',title:getMessage('EditSection','SetBenchmarkData'),width:'800px',height:'auto',buttons:['cancel',{id:'BenchmarkSaveIcon',icon:'check',text:getMessage('SiteWide','Save'),clickcallback:'BenchmarkBlock.saveBenchmarkVariables:'+this.id,className:'positive'}]});this.initLogicEditor(benchmarkVariables,buildFromBlockData);var errorContainer=QBuilder('div',{id:'popupError',className:'popupError'});$(errorContainer).setStyle({display:'none'});benchmarkPopup.setContent(QBuilder('div',{},[errorContainer,this.logicEditor.build()]));benchmarkPopup.center();},saveBenchmarkVariables:function()
{var popup=Q_Window.getInstance('BenchmarkDataPopup');popup.busifyButton('BenchmarkSaveIcon');var rawData=this.logicEditor.getRawData();rawData=rawData[0];var valid=true;for(var i=0,ilen=rawData.length;i<ilen;i++)
{rawData[i].VariableName=this.logicExpressions[i].VariableName;if(!rawData[i].VariableValue)
valid=false;}
if(!valid)
{var errorContainer=$('popupError');if(errorContainer)
{errorContainer.show();errorContainer.innerHTML=getMessage('EditSection','NoBenchmarkVariablesError');}
popup.unbusifyButton('BenchmarkSaveIcon');return;}
Q_Window.getInstance('BenchmarkDataPopup').destroy();msg(getMessage('EditSection','SavingBenchmarkVariables'));new Ajax.Request('Ajax.php?action=setBenchmarkVariables',{parameters:{SID:Survey.getInstance().id,BID:this.blockId,BenchmarkData:Object.toJSON(rawData)},onSuccess:function(transport)
{msg(getMessage('EditSection','BenchmarkDataSaved'));Survey.getInstance().reload();}});},getSchema:function()
{var schemaDef={description:'description',fields:[{type:'text',fieldName:'VariableName'},{type:'text',value:":"},{type:'textbox',fieldName:'VariableValue'}]};var schema=new Q_LogicEditorSchema();schema.addElement(schemaDef);return schema;},initLogicEditor:function(benchmarkVariables,buildFromBlockData)
{QModules.loadModule('logiceditor.js');var schema=this.getSchema();this.logicEditor=new Q_LogicEditor(this,null,null,{schema:schema,editLink:false});this.logicEditor.alwaysShowExpressionSetHeader=false;this.logicEditor.allowConjunctions=false;this.logicEditor.minExpressions=benchmarkVariables.length;this.logicEditor.maxExpressions=benchmarkVariables.length;this.logicEditor.className='BenchmarkLogicEditor';var expressions={};var i=0;if(buildFromBlockData)
{$A(benchmarkVariables).each(function(variable){expressions[i++]={VariableName:decodeURIComponent(variable.VariableName),VariableValue:variable.VariableValue};});}
else
{$A(benchmarkVariables).each(function(variable){expressions[i++]={VariableName:decodeURIComponent(variable),VariableValue:''};});}
this.logicExpressions=expressions;this.logicEditor.generate({0:expressions,push:true});},buildBlockOptionsMenu:function($super,blockId)
{if(Qualtrics.supportMode&&Qualtrics.User.canAddBenchmarkBlock)
return $super();var blockObj=this;blockId=this.id;return{items:[{display:getMessage('EditSection','SetBenchmarkText')+'...',action:'BlockActions.setBenchmarkVariables('+blockId+')'},{separator:1},{display:getMessage('EditSection','ViewBlock')+'...',action:'QES_Global.viewBlock('+blockId+')'},{separator:1},{checked:blockObj.collapsedQuestionMode?true:false,display:getMessage('EditSection','CollapseQuestions')+'...',action:'Block.toggleLargeBlockMode:'+blockId+''},{separator:1},{display:getMessage('SiteWide','NextPreviousButtonText')+'...',action:'BlockActions.openBlockOptions('+blockId+',3)'},{separator:1},{className:'MoveUp',display:getMessage('EditSection','MoveBlockUp')+'...',action:'Block.move:'+blockId+'(-1)'},{className:'MoveDown',display:getMessage('EditSection','MoveBlockDown')+'...',action:'Block.move:'+blockId+'(1)'},{separator:1},{display:getMessage('EditSection','DeleteBlock')+'...',action:'BlockActions.confirmDeleteBlock('+blockId+')',defer:1}]};}});BenchmarkBlock.getInstance=BaseBlock.getInstance;BenchmarkBlock.getBlockByBlockId=BaseBlock.getBlockByBlockId;window.Trash=Class.create(Block,{fullThreshold:20,buildHeader:function()
{var title=getMessage('SurveyCreateWizard','SN_DefaultTrashBlock');var blockTypeClass=' '+this.type+'Block';var metaTitle=this.getMetaTitle();var metaTitleSpan=QBuilder('span',{id:this.id+'_TitleMeta'});metaTitleSpan.innerHTML=metaTitle;var emptyTrash=QBuilder('div',{className:'EmptyTrash',clickcallback:'QES_Global.emptyTrash($evt)'},getMessage('EditSection','EmptyTrash'));var blockHeader=QBuilder('div',{className:'BlockHeader'+blockTypeClass,clickcallback:'BaseBlock.expand',instanceid:this.id},[QBuilder('div',{className:'LeftCap'}),QBuilder('div',{className:'Arrow',clickcallback:'BlockActions.headerClick($evt)'}),QBuilder('span',{className:'BlockTitle',id:this.blockNameObj.id},[title]),metaTitleSpan,QBuilder('div',{className:'RightCap'}),emptyTrash,QBuilder('div',{className:'clear'})]);metaTitleSpan=null;return blockHeader;},isFull:function()
{return this.getQuestionCount()>this.fullThreshold;},checkStatus:function()
{if(this.element)
{if(this.isFull())
{$(this.element).addClassName('Full');}
else
{$(this.element).removeClassName('Full');}
this.updateMeta();}},getStatusClassName:function()
{if(this.getQuestionCount()>this.fullThreshold)
{return' Full';}
return'';},getMetaTitle:function()
{var questionCount=this.getQuestionCount();var labelText=questionCount!=1?getMessage('SiteWide','Questions'):getMessage('SiteWide','Question');var msg='';if(this.isFull())
{msg='<strong class="TrashFullMsg">'+getMessage('EditSection','EmptyTrashMsg',this.fullThreshold)+'</strong>';}
return'<span class="BlockMetaTitle">('+questionCount+' '+labelText+')</span>'+msg;},getQuestionCount:function()
{var count=0;for(var i=0,len=this.questions.length;i<len;++i)
{if(!this.questions[i].deleted)
{count++;}}
return count;},expandQuestion:function(id)
{if(this.expandedId)
{if(this.expandedId==id)
{return;}
var old=BaseQuestion.getInstance(this.expandedId);}
this.expandedId=id;if(old)
{old.refresh();}
var questionObj=BaseQuestion.getInstance(id);questionObj.refresh();}});Trash.getInstance=BaseBlock.getInstance;window.BlockActions={headerClick:function(evt){if(Qualtrics.SearchAndReplace&&Qualtrics.SearchAndReplace.startedSearchAndReplace)
{return;}
var clickedEl=Event.element(evt);var blockEl=$(clickedEl).up('.Block');var blockObj=Survey.getInstance().getBlockById(blockEl.id);if(clickedEl.className=='PreviewButton')
{blockObj.resetPreviewModes();if(blockObj.defaultPreviewMode===1)
{blockObj.defaultPreviewMode=0;$(blockEl).removeClassName('BlockPreview');}
else
{blockObj.defaultPreviewMode=1;$(blockEl).addClassName('BlockPreview');}
blockObj.resetCachedQuestionHeights();blockObj.refreshQuestions();}
else if($(clickedEl).hasClassName('Editable'))
{var editor=blockObj.blockNameObj.edit();return;}
else if(clickedEl.hasClassName('Arrow')||clickedEl.hasClassName('ExpandArrow')||(Qualtrics.Browser.IE&&(clickedEl.up('.ExpandArrow')||clickedEl.up('.Arrow'))))
{if(blockObj.collapsed)
{blockObj.expand();}
else
{blockObj.collapse();}}
if(clickedEl.hasClassName('ExpandLabel'))
blockObj.expand();},toggleBlockPreviewMode:function(blockId)
{if(QES_Global.suspendSelects)
{return;}
var blockObj=Survey.getInstance().getBlockById(blockId);if(blockObj)
{blockObj.resetPreviewModes();if(blockObj.getDefaultPreviewMode()===1)
{blockObj.defaultPreviewMode=0;}
else
{blockObj.defaultPreviewMode=1;}
blockObj.resetCachedQuestionHeights();blockObj.refreshQuestions();}},setBenchmarkVariables:function(blockId)
{var blockObj=Survey.getInstance().getBlockById(blockId);if(blockObj)
{blockObj.setBenchmarkVariables();}},loopAndMerge:function(blockId)
{var blockObj=Survey.getInstance().getBlockById(blockId);if(blockObj)
{if(Survey.getInstance().blocks.length>2)
{if(blockObj.type=="Standard")
{if(!BlockActions.loopMergeIsOpen)
{QES_Global.saveSurvey(false);BlockActions.loopMergeIsOpen=true;var bid=blockObj.blockId;var surveyId=Survey.getInstance().id;QModules.loadModule('QLoopMerge.js');new QLoopMerge(bid,surveyId);setTimeout(function(){BlockActions.loopMergeIsOpen=false},1000);}}
else
{alert(getMessage('EditSection','CannotLoopAndMergeDefaultBlock'));}}
else
{alert(getMessage('EditSection','LoopAndMergeLessThanTwoBlocks'));}}},openSurveyFlow:function(blockId)
{QES_Global.openSurveyFlow();},openBlockOptions:function(blockId,tabIndex)
{if(BaseForm.getInstance().revisionId)
{var popup=new Q_Window({id:'DefaultChoicesInPast',title:getMessage('EditSection','CannotEditRevisionTitle',getMessage('QuestionOptions','Rand')),buttons:['close']});popup.setContent(QBuilder('span',null,getMessage('EditSection','CannotEditRevisionDescription',getMessage('QuestionOptions','Rand'))));return false;}
QES_Global.saveSurvey(false);var blockObj=Survey.getInstance().getBlockById(blockId);if(blockObj)
{if(blockObj.isLocked())
{var continueOn=QES_Global.handleEditWhenSurveyLocked();if(!continueOn)
return;}
var bid=blockObj.blockId;var surveyId=Survey.getInstance().id;if(tabIndex==2)
{if(!BlockActions.loopMergeIsOpen)
{BlockActions.loopMergeIsOpen=true;QModules.loadModule('QLoopMerge.js');new QLoopMerge(bid,surveyId);setTimeout(function(){BlockActions.loopMergeIsOpen=false},1000);}}
else if(tabIndex==1)
{blockObj.openQuestionRandomization();}
else if(tabIndex==3)
{if(!BlockActions.flowButtonTextIsOpen)
{BlockActions.flowButtonTextIsOpen=true;QModules.loadModule('QBlockLookAndFeel.js');new QBlockLookAndFeel(bid,surveyId);setTimeout(function(){BlockActions.flowButtonTextIsOpen=false},1000);}}}},copyBlock:function(blockId)
{var blockObj=Survey.getInstance().getBlockById(blockId);if(blockObj)
{Survey.getInstance().save(false);var bid=blockObj.blockId;var surveyId=Survey.getInstance().id;var name=blockObj.blockNameObj.text;var panel=QBuilder('div',{id:'copyBlock',className:'CopyBlockPopup'},[QBuilder('div',{id:'CopyBlockForm'},[QBuilder('br'),QBuilder('div',{},getMessage('EditSection','CreateBlockDirections')),QBuilder('br'),QBuilder('input',{id:'BlockName',size:73,name:'BlockName',keyentercallback:'BlockActions.copy()'}),QBuilder('input',{id:'CopyBlockSurveyId',type:'hidden',value:surveyId}),QBuilder('input',{id:'CopyBlockBlockId',type:'hidden',value:bid})])]);var copyBlockWindow=new Q_Window({id:'CopyBlockPopupWindow',height:'100px',title:getMessage('EditSection','CopyBlock')+' - '+name,closeButton:false,buttons:[{icon:'cancel',text:getMessage('SiteWide','Cancel'),click:'Q_Window.closeWindow()',className:'negative'},{icon:'check',text:getMessage('SiteWide','Copy'),click:'BlockActions.copy()',className:'positive',entercallback:'BlockActions.copy('+surveyId+','+bid+')'}]});copyBlockWindow.setContent(panel);if($('BlockName'))
{$('BlockName').focus();}}},copyBlockToLibrary:function(blockID)
{QES_Global.saveSurvey(false);var b=Survey.getInstance().getBlockById(blockID);if(b&&b.locked)
{QualtricsCPTools.showAlertDialog({title:'Error',message:getMessage('EditSection','CopyBlockToLibraryLockedError')});return false;}
if(b&&b.questions&&b.questions.length===0||!b.questions)
{QualtricsCPTools.showAlertDialog({title:'Error',message:getMessage('EditSection','CopyBlockToLibraryEmptyError')});return false;}
if(b.subType&&b.subType=='Benchmark')
{msg('clearing benchmark variables');new Ajax.Request('Ajax.php?action=setBenchmarkVariables',{parameters:{SID:Survey.getInstance().id,BID:b.blockId,BenchmarkData:Object.toJSON({})},onSuccess:function(transport)
{msg('benchmark data cleared');}});}
var libBody=QBuilder('tbody',{},[QBuilder('tr',{},[QBuilder('td',{className:'libraryChooserLabel'},[QBuilder('label',{},getMessage('EditSection','SelectLibrary'))]),QBuilder('td',{className:'libraryChooserItem'},[QBuilder('select',{width:'100%',id:'librarySelect',name:'library'})])]),QBuilder('tr',{id:'categories',style:'display:none;'},[QBuilder('td',{className:'libraryChooserLabel'},[QBuilder('label',{},getMessage('EditSection','SelectCategory')+':')]),QBuilder('td',{id:'categorySelectContainer',className:'libraryChooserItem'})]),QBuilder('tr',{id:'nameSection',style:'display:none;'},[QBuilder('td',{className:'libraryChooserLabel'},[QBuilder('label',{},'Block Name:')]),QBuilder('td',{id:'nameSelectContainer'})])]);var errorContainer=QBuilder('div',{id:'blockPopupError',className:'popupError'});$(errorContainer).setStyle({display:'none'});var popup=new Q_Window({id:'BlockLibraryConfirm',title:getMessage('EditSection','ConfirmBlockText'),width:'600px',height:'auto',closeButton:true,buttons:[{icon:'cancel',text:getMessage('SiteWide','Cancel'),click:'BlockActions.cancelSaveAsBlockTo',className:'negative'},{id:'CopyLibraryBlockButton',icon:'check',text:getMessage('SiteWide','Copy'),click:'BlockActions.saveQuestionBlockAsBlockTo',className:'positive'}]});var qForm=QBuilder('form',{id:'copyBlockToLibraryForm'},[errorContainer,QBuilder('input',{type:'hidden',name:'sourceSurvey',value:Survey.getInstance().id}),QBuilder('input',{type:'hidden',name:'sourceBlock',value:blockID}),QBuilder('table',{id:'libraryChooser'},[libBody])]);popup.setContent(qForm);popup.center();$('librarySelect').appendChild(QAjaxWaiter.showSmallRing());new Ajax.Request('Ajax.php?action=getLibraries',{parameters:{'Type':'BlockCopyToLibraries'},onSuccess:function(transport)
{var libs=transport.responseText.evalJSON();$('librarySelect').innerHTML='';$('librarySelect').appendChild(QBuilder('option'));for(var lib in libs)
$('librarySelect').appendChild(QBuilder('option',{value:lib},libs[lib]));popup.center();}});$('librarySelect').observe('change',function()
{var libSelect=$(this);var firstChild=$(libSelect).firstDescendant();if($(firstChild).innerHTML=='')
$(firstChild).remove();if(libSelect.options.length>0)
{$('categorySelectContainer').innerHTML='';$('categorySelectContainer').appendChild(QAjaxWaiter.showSmallRing());$('nameSelectContainer').innerHTML='';new Ajax.Request('Ajax.php?action=getBlockCategories',{parameters:{LibraryID:libSelect.value},onSuccess:function(transport)
{var cat=QBuilder('select',{id:'libraryCategory',className:'input',name:'category'});$('categorySelectContainer').innerHTML='';$('categorySelectContainer').appendChild(cat);var nameDialog=QBuilder('input',{id:'blockLibraryName',className:'input',name:'blockLibraryName'});$('nameSelectContainer').innerHTML='';$('nameSelectContainer').appendChild(nameDialog);var categories=transport.responseText.evalJSON();var hasUnassigned=false;for(var i=0;i<categories.length;++i)
{if(categories[i]=='Unassigned')
hasUnassigned=true;$('libraryCategory').appendChild(QBuilder('option',{value:categories[i]},categories[i]));}
if(!hasUnassigned)
$('libraryCategory').appendChild(QBuilder('option',{value:'Unassigned'},'Unassigned'));QComboBox.replaceSelect(cat,{autoComplete:true});$('categories').show();$('nameSection').show();popup.center();}});}});},saveQuestionBlockAsBlockTo:function()
{if(!this.copying)
{var valid=true;var errorString='';var popupWindow=Q_Window.getInstance('BlockLibraryConfirm');popupWindow.busifyButton('CopyLibraryBlockButton',getMessage('Javascript','Copying'));var parameters=$('copyBlockToLibraryForm').serialize(true);var postData={};var blockObj=Survey.getInstance().getBlockById(parameters.sourceBlock);if(!parameters.library)
{valid=false;errorString=getMessage('LibrarySection','DropBox');}
else if(!parameters.categoryText)
{valid=false;errorString=getMessage('EditSection','IncludeCategoryError');}
else if(!parameters.blockLibraryName)
{valid=false;errorString=getMessage('EditSection','IncludeBlockNameError');}
else if(!parameters.sourceSurvey)
{valid=false;errorString=getMessage('EditSection','SourceSurveyError');}
else if(!blockObj.blockId)
{valid=false;errorString=getMessage('EditSection','SourceBlockIDError');}
postData['LibraryID']=parameters.library;postData['BlockName']=parameters.blockLibraryName;postData['Category']=parameters.categoryText;postData['BlockID']=blockObj.blockId;postData['SurveyID']=parameters.sourceSurvey;var that=this;if(valid)
{this.copying=true;new Ajax.Request('Ajax.php?action=CopySurveyBlockToLibrary',{parameters:postData,onComplete:function(transport)
{Q_Window.closeWindow('BlockLibraryConfirm');that.copying=false;},noSuccess:function(transport)
{if(window.INavigatorStaticVars)
window.INavigatorStaticVars.rootDataNode=null;},onFailure:function(transport)
{console.log('FAILED COPYING BLOCK TO LIBRARY!');}});}
else
{var error=$('blockPopupError');if(error)
{$('blockPopupError').show();$('blockPopupError').innerHTML=errorString;popupWindow.unbusifyButton('CopyLibraryBlockButton');}}}},copyQuestionsToLibrary:function(blockId)
{QES_Global.saveSurvey(true);var blockObj=Survey.getInstance().getBlockById(blockId);if(blockObj)
{var bid=blockObj.blockId;var params={};params['sourcesurvey']=Survey.getInstance().id;params['copy']=bid;BlockActions.validateBlockQuestions(params);}},validateBlockQuestions:function(params)
{var currentVRow='Row';var parameters=params;var that=this;new Ajax.Request('Ajax.php?action=getBlockQuestionsList',{parameters:{sid:parameters['sourcesurvey'],bid:parameters['copy']},onSuccess:function(transport)
{var questions=transport.responseText.evalJSON();var libBody=QBuilder('tbody',{},[QBuilder('tr',{},[QBuilder('td',{className:'libraryChooserLabel'},[QBuilder('label',{},getMessage('EditSection','SelectLibrary'))]),QBuilder('td',{className:'libraryChooserItem'},[QBuilder('select',{width:'100%',id:'librarySelect',name:'library'})])]),QBuilder('tr',{id:'categories',style:'display:none;'},[QBuilder('td',{className:'libraryChooserLabel'},[QBuilder('label',{},getMessage('EditSection','SelectCategory')+':')]),QBuilder('td',{id:'categorySelectContainer',className:'libraryChooserItem'})])]);var vBody=QBuilder('tbody',{});var errorContainer=QBuilder('div',{id:'blockPopupError',className:'popupError'});$(errorContainer).setStyle({display:'none'});var popup=new Q_Window({id:'LibraryQuestionConfirm',title:getMessage('EditSection','ConfirmBlockText'),width:'600px',height:'auto',closeButton:true,buttons:[{icon:'cancel',text:getMessage('SiteWide','Cancel'),click:'BlockActions.cancelQuestionBlockTo',className:'negative'},{icon:'check',text:getMessage('SiteWide','Copy'),click:'BlockActions.saveQuestionBlockTo',className:'positive'}]});var qForm=QBuilder('form',{id:'copyMultipleToLibraryForm'},[errorContainer,QBuilder('input',{type:'hidden',name:'sourcesurvey',value:parameters['sourcesurvey']}),QBuilder('table',{id:'libraryChooser'},[libBody]),QBuilder('table',{className:'QuestionBlockCopy NiceTable',width:'100px'},[QBuilder('thead',{},[QBuilder('tr',{},[QBuilder('th',{className:'categorytitle'},[QBuilder('a',{},[getMessage('SiteWide','Question')])]),QBuilder('th',{className:'categorytitle'},[QBuilder('a',{},[getMessage('SiteWide','Description')])])])]),vBody])]);popup.setContent(qForm);popup.center();var i=0;for(var id in questions)
{var lbl=QBuilder('label',{id:'qDescription_'+i},questions[id]);var hiddenLbl=QBuilder('input',{type:'hidden',id:'qDescHidden_'+i,name:'qDescHidden_'+i,value:questions[id]});var hiddenId=QBuilder('input',{type:'hidden',id:'qid_'+i,name:'qid_'+i,value:id});$(vBody).appendChild(QBuilder('tr',{className:currentVRow},[QBuilder('td',{width:'50%'},[QBuilder('label',{},questions[id])]),QBuilder('td',{width:'50%',id:'qDescriptionContainer_'+i},[lbl,hiddenLbl,hiddenId])]));that.setupMessageObserving($('qDescriptionContainer_'+i),i,lbl);currentVRow=='Row'?currentVRow='alternateRow':currentVRow='Row';++i;}
popup.center();$('librarySelect').appendChild(QAjaxWaiter.showSmallRing());new Ajax.Request('Ajax.php?action=getLibraries',{parameters:{'Type':'QuestionCopyToLibraries'},onSuccess:function(transport)
{var libs=transport.responseText.evalJSON();$('librarySelect').innerHTML='';$('librarySelect').appendChild(QBuilder('option'));for(var lib in libs)
$('librarySelect').appendChild(QBuilder('option',{value:lib},libs[lib]));popup.center();}});$('librarySelect').observe('change',function()
{var libSelect=$(this);var firstChild=$(libSelect).firstDescendant();if($(firstChild).innerHTML=='')
$(firstChild).remove();if(libSelect.options.length>0)
{$('categorySelectContainer').innerHTML='';$('categorySelectContainer').appendChild(QAjaxWaiter.showSmallRing());new Ajax.Request('Ajax.php?action=getQuestionCategories',{parameters:{LibraryID:libSelect.value},onSuccess:function(transport)
{var cat=QBuilder('select',{id:'libraryCategory',className:'input',name:'category'});$('categorySelectContainer').innerHTML='';$('categorySelectContainer').appendChild(cat);var categories=transport.responseText.evalJSON();var hasUnassigned=false;for(var i=0;i<categories.length;++i)
{if(categories[i]=='Unassigned')
hasUnassigned=true;$('libraryCategory').appendChild(QBuilder('option',{value:categories[i]},categories[i]));}
if(!hasUnassigned)
$('libraryCategory').appendChild(QBuilder('option',{value:'Unassigned'},'Unassigned'));QComboBox.replaceSelect(cat,{autoComplete:true});$('categories').show();popup.center();}});}});$('libraryCategory').observe('change',function(){var firstChild=$(this).firstDescendant();if($(firstChild).innerHTML=='')
$(firstChild).remove();parameters['category']=$('libraryCategory').value;popup.center();});}});},setupMessageObserving:function(cell,row,text)
{cell.observe('mouseover',function(){$(this).addClassName('CopyQuestionText');});cell.observe('mouseout',function(){$(this).removeClassName('CopyQuestionText');});cell.getInner=function(){return $(text);};cell.getText=function(){return $(text).innerHTML;};cell.setText=function(newText){$(text).innerHTML=newText;$('qDescHidden_'+row).value=newText;};cell.observe('click',function(){if(inlineEditor.getInstance())
inlineEditor.getInstance().removeInlineEditor();new inlineEditor(this);});},errorCheck:function(parameters){var error='';if(!parameters['category'])
error+=getMessage('LibrarySection','CategoryNotValid')+'<br/>';if(!parameters['description']||trim(parameters['description'])=='')
error+=getMessage('LibrarySection','DescriptionNotValid')+'<br/>';if(!parameters['sourcesurvey'])
error+=getMessage('LibrarySection','SourceSurveyNotValid')+'<br/>';if(!parameters['copy'])
error+=getMessage('LibrarySection','BlockNotValid')+'<br/>';return error;},saveQuestionBlockTo:function()
{if($('blockPopupError'))
$('blockPopupError').innerHTML='';var parameters=$('copyMultipleToLibraryForm').serialize(true);if(parameters['library']&&parameters['library']!=''&&parameters['category']&&parameters['category']!='')
{var questions=new Array();var invalidQuestion=false;var i=0;while(parameters['qid_'+i]!=undefined)
{questions[i]=new Array();questions[i]['lid']=parameters['library'];questions[i]['category']=parameters['category'];questions[i]['sourcesurvey']=parameters['sourcesurvey'];questions[i]['copy']=parameters['qid_'+i];questions[i]['description']=parameters['qDescHidden_'+i];var error=this.errorCheck(questions[i]);if(error!='')
{invalidQuestion=true;$('qDescriptionContainer_'+i).setStyle({background:'#cc0000'});}
++i;}
if(invalidQuestion)
{$('blockPopupError').show();$('blockPopupError').innerHTML+=getMessage('LibrarySection','DescriptionsNotValid')+'<br/>';}
else
{for(var i=0;i<questions.length;i++)
{var that=this;new Ajax.Request('Ajax.php?action=saveLibraryQuestionCopyTo',{parameters:questions[i],onSuccess:function(transport)
{var category=questions[i]['category'];that.loadQuestions(category);that.updateCategorySelector(category);}});}
Q_Window.closeWindow('LibraryQuestionConfirm');}}
else
{$('blockPopupError').show();if($('libraryCategory').value=='')
$('blockPopupError').innerHTML+=getMessage('SurveyCreateWizard','LB_Category')+'<br/>';if($('librarySelect').value=='')
$('blockPopupError').innerHTML+=getMessage('SurveyCreateWizard','LB_Library')+'<br/>';}},cancelQuestionBlockTo:function(){Q_Window.closeWindow('LibraryQuestionConfirm');},cancelSaveAsBlockTo:function()
{Q_Window.closeWindow('BlockLibraryConfirm');},copy:function(opt_evt)
{if(opt_evt)
{Event.stop(opt_evt);}
if(!this.copying)
{var that=this;this.copying=true;var postData={};postData['BlockName']=$('BlockName').getValue();postData['SurveyID']=$('CopyBlockSurveyId').getValue();postData['BlockID']=$('CopyBlockBlockId').getValue();new Ajax.Request('Ajax.php?action=CopySurveyBlock',{parameters:postData,onComplete:function(transport)
{Q_Window.closeWindow('CopyBlockPopupWindow');that.copying=false;BlockActions.reloadSurvey();},onFailure:function(transport)
{console.log('FAILED!');}});}},reloadSurvey:function()
{BaseForm.getInstance().reload();},submitPage:function()
{PageAction('');},confirmDeleteBlock:function(blockId)
{var blockObj=Survey.getInstance().getBlockById(blockId);if(blockObj.isLocked())
{var continueOn=QES_Global.handleEditWhenSurveyLocked();if(!continueOn)
return;}
var bid=blockObj.blockId;var surveyId=Survey.getInstance().id;var name=blockObj.blockNameObj.text;var deleteOptions={title:getMessage('ResultsSection','Confirmation'),strong:false,deleteButtonText:getMessage('SiteWide','Delete'),deleteMessage:getMessage('EditSection','BlockConfirmDeletion',name),deleteCallBackParameters:{ajaxAction:'DeleteSurveyBlock',ajaxParameters:{SID:surveyId,BID:bid},ajaxOnComplete:'BlockActions.reloadSurvey'}};Survey.getInstance().save();QualtricsCPTools.showDeleteConfirmation(deleteOptions);},lockMenuItemClicked:function(blockId)
{var blockObj=Survey.getInstance().getBlockById(blockId);if(blockObj.locked!=false){this.confirmUnlock(blockId);}else{this.confirmLock(blockId);}},confirmLock:function(blockId)
{var popup=new Q_Window({id:'LockBlock',title:getMessage('EditSection','LockBlock'),width:'400',buttons:['cancel',{icon:'check',text:getMessage('SiteWide','OK'),click:'BlockActions.lockUnlock',p1:blockId,p2:true,className:'positive'}]});popup.setContent(QBuilder('div',{},[QBuilder('div',{className:'Message'},[getMessage('EditSection','ConfirmLockBlock')]),QBuilder('fieldset',{id:'PasswordFieldset'},[QBuilder('legend',{},[getMessage('EditSection','OptionalPassword')]),QBuilder('div',{id:'PasswordMatchStatus'},[]),QBuilder('div',{className:'PasswordLabel'},[getMessage('SiteWide','Password')+': ']),QBuilder('input',{id:'BlockPassword',className:'TextBox',type:'password',keyentercallback:'BlockActions.lockUnlock',p1:blockId,p2:true},[]),QBuilder('div',{style:'clear: both'},[]),QBuilder('div',{className:'PasswordLabel'},[getMessage('EditSection','BlockPasswordConfirm')+': ']),QBuilder('input',{id:'ConfirmBlockPassword',className:'TextBox',type:'password',keyentercallback:'BlockActions.lockUnlock',p1:blockId,p2:true},[])])]));$('BlockPassword').focus();},confirmUnlock:function(blockId)
{if(BaseForm.getInstance().revisionId)
{return false;}
var popup=new Q_Window({id:'UnlockBlock',title:getMessage('EditSection','UnlockBlock'),width:'400',buttons:['cancel',{id:'UnlockBlockOkButton',icon:'check',text:getMessage('SiteWide','OK'),click:'BlockActions.lockUnlock',p1:blockId,p2:false,className:'positive'}]});var confirmHtml=[QBuilder('div',{className:'Message'},[getMessage('EditSection','ConfirmUnlockBlock')])];var blockObj=Survey.getInstance().getBlockById(blockId);if(blockObj&&blockObj.passwordProtected)
{confirmHtml.push(QBuilder('div',{id:'PasswordField'},[getMessage('SiteWide','Password')+': ',QBuilder('input',{className:'TextBox',type:'password',id:'BlockPassword',keyentercallback:'BlockActions.lockUnlock',p1:blockId,p2:false},[]),QBuilder('span',{id:'UnlockStatus'},[])]));}
popup.setContent(QBuilder('div',{},confirmHtml));if($('BlockPassword')){$('BlockPassword').focus();}},lockUnlock:function(blockId,newLockStatus)
{var popupWindow=Q_Window.getInstance('UnlockBlock');var password='';if($('BlockPassword'))
{password=$('BlockPassword').value;if($('ConfirmBlockPassword')&&password!=$('ConfirmBlockPassword').value)
{$('PasswordMatchStatus').innerHTML=getMessage('SiteWide','PasswordsDontMatch');return;}
if(popupWindow)
{popupWindow.busifyButton('UnlockBlockOkButton',getMessage('EditSection','Verifying'));}}
else
{Q_Window.closeWindow('UnlockBlock');}
Q_Window.closeWindow('LockBlock');var blockObj=Survey.getInstance().getBlockById(blockId);var bid=blockObj.blockId;var surveyId=Survey.getInstance().id;new Ajax.Request('Ajax.php?action=setBlockLocking',{parameters:{SID:surveyId,BID:bid,Locked:newLockStatus,Password:password,SupportMode:Qualtrics.supportMode},onSuccess:function(transport)
{if(popupWindow)
{popupWindow.unbusifyButton('UnlockBlockOkButton');}
var response=transport.responseText.evalJSON();if(response.PasswordMismatch)
{$('UnlockStatus').innerHTML=getMessage('EditSection','FailedUnlock');$('BlockPassword').value='';}
else
{Q_Window.closeWindow('UnlockBlock');var s=Survey.getInstance();s.reload();}}});}};window.blockRenderTimer=null;window.nextBlockToRender=null;window.blockPointer=0;window.debugQuestionCount=0;window.QuestionRenderer=Class.create({initialize:function(questions,options)
{this.id=QualtricsTools.createNewId('qr');QuestionRenderer.registry[this.id]=this;this.options=options||{};this.chunks=chunk(questions,25);this.next();this.survey=BaseForm.getInstance();},next:function()
{this.timeout=window.setTimeout(this.renderNextChunk.bind(this),100);},renderNextChunk:function()
{if(this.chunks.length)
{var questions=this.chunks[0];this.chunks.splice(0,1);for(var i=0,len=questions.length;i<len;++i)
{var okToRender=true;var question=questions[i];if(this.survey.searchFilter)
{okToRender=false;if(this.survey.searchFilter[question.id])
{okToRender=true;}}
if(question.parentObj.collapsedQuestionMode)
{question.collapsed=1;}
else
{question.collapsed=0;}
if(okToRender)
{question.render();}}}
if(this.chunks.length)
{this.next();}
else
{if(this.options.onComplete)
{this.options.onComplete();}
if(QuestionRenderer.registry[this.id])
{delete QuestionRenderer.registry[this.id];}}},cancel:function()
{this.chunks.length=0;if(this.timeout)
{clearTimeout(this.timeout);}}});QuestionRenderer.registry={};QuestionRenderer.getInstance=function(id)
{return QuestionRenderer.registry[id];};QuestionRenderer.getAll=function()
{return QuestionRenderer.registry;};QuestionRenderer.cancelAllRenderings=function()
{var renderers=QuestionRenderer.getAll();if(renderers)
{for(var id in renderers)
{renderers[id].cancel();}}};window.Question=Class.create(BaseQuestion,{initialize:function(parentObj,opt_dontAssignQuestionNumber,opt_type)
{this.regions=[];this.baseInit(parentObj,opt_dontAssignQuestionNumber,opt_type);},save:function(options)
{QuestionActions.saveQuestions([this],options);},buildHeader:function()
{var skipMarkersArea=QBuilder('div',{className:'SkipMarkers',id:'SkipMarkerArea_'+this.id});if(this.skipMarker)
{for(var i=0,len=this.skipMarker.length;i<len;++i)
{var id=this.skipMarker[i]['SkipLogicID'];var linkedQuestionDescription=this.skipMarker[i]['LinkedQuestionDescription'];skipMarkersArea.appendChild(SkipLogic.buildSkipMarker(id,linkedQuestionDescription,this.parentObj,this.id));}}
return skipMarkersArea;},buildRegions:function()
{var documentFragment=document.createDocumentFragment();if(this.regions&&(this.regions.length))
{for(i=0,len=this.regions.length;i<len;i++)
{var region=this.regions[i];documentFragment.appendChild(region.render());if(this.questionType=='HotSpot'&&this.defaultChoices)
{var choiceId=this.choices[i].choiceId;var defaultValue=this.getDefaults([choiceId],true).Value;if(defaultValue)
{region.removeBodyClassName('Like');region.removeBodyClassName('Dislike');if(this.selector=='OnOff')
{if(defaultValue==2)
region.addBodyClassName('Like');}
else if(this.selector=='LikeDislike')
{if(defaultValue==1)
region.addBodyClassName('Dislike');else if(defaultValue==3)
region.addBodyClassName('Like');}}}}}
return documentFragment;},select:function()
{QuestionActions.select(this);},moveClick:function(event,speed)
{if(!Survey.getInstance().getPermission('editQuestions'))
{return;}
if(inlineEditor.getInstance())
{inlineEditor.getInstance().removeInlineEditor();}
if(!speed)speed=0.3;var questionsToMove=QuestionActions.selectedRegistry;if(!this.selected)
{questionsToMove=[this];}
var el=Event.element(event);if(el)
{var mDir=el.hasAttribute('mDir')&&el.getAttribute('mDir');if(el.id=='UpButton'||mDir=='Up')
{QuestionActions.moveAndScroll(questionsToMove,-1,event,speed,this);}
else if(el.id=='DownButton'||mDir=='Down')
{QuestionActions.moveAndScroll(questionsToMove,1,event,speed,this);}}
el=null;},resizeTE:function(evt,formItem)
{new Qualtrics.ResizeTE(evt,this,formItem);},render:function(options)
{this.onLoad=null;this.showExtras=true;this.showEditLinksInPreview=true;options=options||{};if(!options.lang)options.lang=BaseForm.getInstance().defaultLanguage;this.prepare();if(this.getPreviewMode()===null)
{this.previewMode=this.parentObj.getDefaultPreviewMode();}
if(this.parentObj&&!this.parentObj.collapsed)
{if(this.parentObj.type==='Trash')
{var questionDiv=this.trashRender();}
else if(this.elementType=='Page Break')
{questionDiv=this.buildPageBreak();}
else if(this.collapsed)
{questionDiv=this.renderCollapsed();}
else
{questionDiv=this.build(options);}
if(options&&options.parentElement)
{if($(options.parentElement))
{$(options.parentElement).appendChild(questionDiv);}
options.parentElement=null;}
else
{if(options&&options.initialRender)
{delete options.initialRender;this.parentObj.questionsDiv.appendChild(questionDiv);}
else
{if(options&&(options.opacity!=undefined))
{if(questionDiv)
{$(questionDiv).setStyle({opacity:options.opacity});}}
if(this.parentObj.addFirstQuestion)
{this.parentObj.removeEmptyClass();}
var blockChilds=$(this.parentObj.questionsDiv).childElements();var last=blockChilds.length;var pos=this.getPosition();if(pos>=last)
{this.parentObj.questionsDiv.appendChild(questionDiv);}
else
{this.parentObj.questionsDiv.insertBefore(questionDiv,blockChilds[pos]);}}
this.element=questionDiv;var questionObj=this;questionDiv.onmouseover=QuestionActions.getOver(questionObj);questionDiv.onmouseout=QuestionActions.getOut(questionObj);questionDiv.onmousedown=QuestionActions.getDown(questionObj);questionDiv.onmouseup=QuestionActions.getUp(questionObj);questionDiv.oncontextmenu=QuestionActions.getContext(questionObj);this.showLastNote(questionDiv);questionDiv=null;QuestionTopCache={};if(this.last)
{this.parentObj.rendering=0;this.last=0;}
questionDiv=null;}
if(this.onLoad)
{this.onLoad();this.onLoad=null;}
debugQuestionCount++;if($(this.element).hasClassName('Question')&&!$(this.element).hasClassName('Collapsed')){this.adjustQuestionNumberStyle();}}},adjustQuestionNumberHeight:function()
{var checkboxHeight=12+3+3;var optionsButtonHeight=28+6;var questionNumberElement=$(this.element).select('.QuestionNumber')[0];var dropped=questionNumberElement.hasClassName('Dropped');var questionNumberOuterHeight=questionNumberElement.getHeight()+3;if(dropped)
{questionNumberOuterHeight+=3;}
else
{questionNumberOuterHeight+=10;checkboxHeight=0;}
var minimumQuestionHeight=questionNumberOuterHeight+checkboxHeight+optionsButtonHeight;$(this.element).select('.SelectBorder')[0].setStyle({minHeight:minimumQuestionHeight+'px'});},adjustQuestionNumberStyle:function()
{var maxWidth=39;var textWidth=this.calculateQuestionNumberWidth();if(textWidth>maxWidth)
{$(this.element).select('.QuestionNumber')[0].addClassName('Dropped');$(this.element).select('.QuestionInfoBar')[0].addClassName('Dropped');}
this.adjustQuestionNumberHeight();},calculateQuestionNumberWidth:function()
{var questionNumberContainer=$(this.element).select('.QuestionNumberContainer')[0],children=questionNumberContainer.childElements()[0],questionNumberOriginal=children.clone(),calculator=$('<span style="display: inline-block;" />'),width;calculator=new Element('span',{}).setStyle({display:'inline-block'});children.wrap(calculator);width=children.up().getWidth();questionNumberOriginal.innerHTML=children.innerHTML;children.up().replace(questionNumberOriginal);return width;},build:function(options)
{var previewModeClass=' Outline';var skinClass='';if(this.getPreviewMode())
{previewModeClass=' Preview';skinClass=' Skin';}
this.questionCanvas=QBuilder('div',{className:'QuestionCanvas '+skinClass});this.renderCanvas(options);var blockId=null;var questionId=null;if(this.parentObj&&this.parentObj.blockId)
{blockId=this.parentObj.blockId;}
if(this.questionId)
{questionId=this.questionId;}
var displayLogicDiv='';if(this.displayLogic)
{displayLogicDiv=QBuilder('div',{},[this.buildDisplayLogic()]);}
var skipLogicDiv='';if(options.ignoreSkipLogic===undefined||options.ignoreSkipLogic===false)
{skipLogicDiv=this.buildSkipLogic();}
var carryForwardChoicesDiv=this.buildDynamicChoicesBox('choices');var carryForwardAnswersDiv=this.buildDynamicChoicesBox('answers');var statusIcons=QBuilder('div',{className:'StatusIcons'});if(this.hasValidation())
{statusIcons.appendChild(QBuilder('div',{className:'HasValidation',clickcallback:'QuestionActions.highlightValidation('+this.id+')',title:getMessage('EditSection','QuestionHasValidation')}));}
if(this.randomization&&this.randomization.Type&&this.randomization.Type!='None')
{statusIcons.appendChild(QBuilder('div',{className:'Randomization',clickcallback:'Question.openChoiceRandomization',instanceid:this.id,title:getMessage('EditSection','QuestionHasRandomization')}));}
if(this.answerRandomization&&this.answerRandomization.Type&&this.answerRandomization.Type!='None')
{statusIcons.appendChild(QBuilder('div',{className:'Randomization',clickcallback:'Question.openAnswerRandomization',instanceid:this.id,title:getMessage('EditSection','QuestionHasAnswerRandomization')}));}
if(this.questionJS)
{statusIcons.appendChild(QBuilder('div',{className:'HasJavascript',clickcallback:'BaseQuestion.addJavascript',instanceid:this.id,title:getMessage('EditSection','QuestionHasJavascript')}));}
if(this.defaultChoices)
{var showDefaultChoicesMenu=true;if(QuestionTypes[this.questionType]&&QuestionTypes[this.questionType].showDefaultChoicesMenu)
showDefaultChoicesMenu=QuestionTypes[this.questionType].showDefaultChoicesMenu(this);if(showDefaultChoicesMenu)
statusIcons.appendChild(QBuilder('div',{className:'HasDefaultChoices',clickcallback:'Question.handleDefaultChoices',instanceid:this.id,title:getMessage('EditSection','QuestionHasDefaultChoices')}));}
if(this.recodeValues&&!QuestionTypes[this.questionType].hideRecodeValues)
{statusIcons.appendChild(QBuilder('div',{className:'HasRecodedValues',clickcallback:'BaseQuestion.openRecodeValues',instanceid:this.id,title:getMessage('EditSection','QuestionHasRecodedValues')}));}
if(this.variableNaming)
{statusIcons.appendChild(QBuilder('div',{className:'HasVariableNaming',clickcallback:'BaseQuestion.openRecodeValues',instanceid:this.id,title:getMessage('EditSection','QuestionHasVariableNaming')}));}
var checkBox=QBuilder('input',{type:'checkbox',title:getMessage('EditSection','SelectUnselectQuestion'),className:'QuestionSelector',clickcallback:'Event.stop($evt)',id:this.id+'_checkbox'});var accessiblePermission=Survey.getInstance().getPermission('allowNonAccessibleSurveys',true);var accessibleLevel=AccesibilityLevels.getAccessibleLevel(this);if(accessiblePermission!=1)
statusIcons.appendChild(QBuilder('div',{className:accessibleLevel,instanceid:this.id,title:getMessage('EditSection','QuestionAccessible'+accessibleLevel),clickcallback:'QES_Global.checkAccessibility'}));var choiceOptionsMenuButton=this.buildChoiceOptionsMenuButton();if(this.exportTag===undefined||this.exportTag===null){this.exportTag='Q'+this.questionNumber;}
var qid='';if(Qualtrics.supportMode)
{qid=(QBuilder('span',{id:'QuestionID_'+this.id,className:'QuestionID'},this.questionId));}
var questionNumberDiv=QBuilder('div',{id:'QuestionNumber_'+this.id,className:'QuestionNumber',clickcallback:'Editable.bindedEdit',p1:'$el',p2:'Question.exportTag',p3:this.id,p4:'ExportTagEditor'},this.exportTag);var questionStructure=this.buildQuestionStructure({'questionNumberDiv':questionNumberDiv,'checkBox':checkBox,'qid':qid,'choiceOptionsMenuButton':choiceOptionsMenuButton},statusIcons,{'carryForwardChoicesDiv':carryForwardChoicesDiv,'carryForwardAnswersDiv':carryForwardAnswersDiv},{'displayLogicDiv':displayLogicDiv,'skipLogicDiv':skipLogicDiv});if(this.exportTag&&this.exportTag.length>3)
{var size=this.shrinkTextToFit(this.exportTag);$(questionNumberDiv).setStyle({fontSize:size+'px'});}
this.skipLogicDiv=skipLogicDiv;skipLogicDiv=null;statusIcons=null;checkBox=null;var notesDiv=this.buildNotes();var footerNode='';if(this.buildFooter)
{footerNode=this.buildFooter();}
return QBuilder('div',{id:this.id,className:'Question NotSelected'+previewModeClass},[QBuilder('div',{className:'QuestionSelect '+this.questionType},[QBuilder('div',{className:'SelectBorder'},[QBuilder('div',{className:'SelectBorderInside'},[questionStructure,notesDiv])]),footerNode])]);},buildQuestionStructure:function(qInfoBar,statusIcons,carryForwardDivs,logicDivs)
{var questionNumberDiv=QBuilder('div',{id:'QuestionNumber_'+this.id,className:'QuestionNumber',clickcallback:'Editable.bindedEdit',p1:'$el',p2:'Question.exportTag',p3:this.id,p4:'ExportTagEditor'},this.exportTag);var droppedClass='';if(this.exportTag&&this.exportTag.length>3)
{var size=this.shrinkTextToFit(this.exportTag);size=(size<10)?10:size;$(questionNumberDiv).setStyle({fontSize:size+'px'});if(this.exportTag.length>4)
{$(questionNumberDiv).addClassName('Dropped');droppedClass='Dropped';}}
return QBuilder('div',{className:'QuestionStructure'},[QBuilder('div',null,[logicDivs.displayLogicDiv]),QBuilder('div',{className:'QuestionInfoBar '+droppedClass},[QBuilder('div',{className:'QuestionInfoBarInner'},[qInfoBar.questionNumberDiv=QBuilder('div',{className:'QuestionNumberContainer'},[questionNumberDiv]),qInfoBar.checkBox,qInfoBar.qid,qInfoBar.choiceOptionsMenuButton,QBuilder('div',{className:'TypeIcon '+this.questionType,title:getMessage(this.questionType)})])]),statusIcons,QBuilder('div',{className:'QuestionCanvasContainer'},[this.questionCanvas]),QBuilder('div',{className:'clear'}),QBuilder('div',null,[carryForwardDivs.carryForwardChoicesDiv]),QBuilder('div',null,[carryForwardDivs.carryForwardAnswersDiv]),QBuilder('div',null,[logicDivs.skipLogicDiv])]);},buildChoiceOptionsMenuButton:function()
{if(QuestionTypes[this.questionType].HideQuestionOptionsMenu){return QBuilder('div');}
return QBuilder('a',{className:'choiceOptionsMenu',title:'Advanced Question Options',clickcallback:'QMenu.showMenu',p1:'QuestionActions.buildChoiceMenu('+this.id+')',p2:'$el'});},buildPageBreak:function()
{return QBuilder('div',{className:'PageBreak'});},checkMobileCompatibility:function(statusIconsContainer,doNotDisplayIcon)
{var levels=QES_Global.compatibilityLevels;var qType=this.questionType;var selector=this.selector;var subSelector=this.subSelector;var mobileCompatibilityLevel=null;var mobileCompatibilityMsg=null;if(!levels[qType])
{}
else if(levels[qType][selector]&&levels[qType][selector][subSelector]&&levels[qType][selector][subSelector])
{mobileCompatibilityLevel=levels[qType][selector][subSelector];}
else if(levels[qType][selector]&&levels[qType][selector])
{mobileCompatibilityLevel=levels[qType][selector];}
else if(levels[qType])
{mobileCompatibilityLevel=levels[qType];}
var maxChoices=3;var maxAnswers=3;var maxColumns=2;var maxLabels=2;var maxGridLines=5;var maxWidth=320;var choicesCount=0;if(mobileCompatibilityLevel==='CountChoices')
{choicesCount=this.choices.length;if(this.proxieChoices)
{choicesCount+=this.proxieChoices.length;}
if(choicesCount>maxChoices)
{mobileCompatibilityLevel='MaybeMobileCompatible';mobileCompatibilityMsg='TooManyChoices';}
else
{mobileCompatibilityLevel=null;}}
else if(mobileCompatibilityLevel==='CountAnswers')
{var answersCount=this.answers.length;if(this.proxieAnswers)
{answersCount+=this.proxieAnswers.length;}
if(answersCount>maxAnswers)
{mobileCompatibilityLevel='MaybeMobileCompatible';mobileCompatibilityMsg='TooManyAnswers';}
else
{mobileCompatibilityLevel=null;}}
else if(mobileCompatibilityLevel==='CountColumns')
{choicesCount=this.choices.length;var opts=this.getOptions();if(this.proxieChoices)
{choicesCount+=this.proxieChoices.length;}
if(opts.NumColumns&&opts.NumColumns>maxColumns&&choicesCount>maxColumns)
{mobileCompatibilityLevel='MaybeMobileCompatible';mobileCompatibilityMsg='TooManyChoices';}
else
{mobileCompatibilityLevel=null;}}
else if(mobileCompatibilityLevel==='CountLabels')
{var labelsCount=this.answers.length;if(this.proxieAnswers)
{labelsCount+=this.proxieAnswers.length;}
var gridLinesCount=this.options.GridLines;if(labelsCount>maxLabels)
{mobileCompatibilityLevel='MaybeMobileCompatible';mobileCompatibilityMsg='TooManyLabels';}
else if(gridLinesCount>maxGridLines)
{mobileCompatibilityLevel='MaybeMobileCompatible';mobileCompatibilityMsg='TooManyGridLines';}
else
{mobileCompatibilityLevel=null;}}
else if(mobileCompatibilityLevel==='CheckWidth'){mobileCompatibilityLevel='MaybeMobileCompatible';mobileCompatibilityMsg='ContentMayBeTooWide';mobileCompatibilityLevel=null;mobileCompatibilityMsg=null;if(this.options&&this.options.GraphicWidth)
{if(this.options.GraphicWidth>maxWidth)
{mobileCompatibilityLevel='MaybeMobileCompatible';mobileCompatibilityMsg='ImageTooWide';}
else
{mobileCompatibilityLevel=null;mobileCompatibilityMsg=null;}}
else if(this.element)
{var img=this.element.down('img.Graphic');if(img&&img.width)
{if(img.width>maxWidth)
{mobileCompatibilityLevel='MaybeMobileCompatible';mobileCompatibilityMsg='ImageTooWide';}
else
{mobileCompatibilityLevel=null;mobileCompatibilityMsg=null;}}}}
else if(mobileCompatibilityLevel==='MaybeMobileCompatible')
{mobileCompatibilityMsg='MaybeMobileCompatible';}
else if(mobileCompatibilityLevel==='NotMobileCompatible')
{mobileCompatibilityMsg='NotMobileCompatible';}
try
{var images=$$('#'+this.id+' .QuestionText img');var graphics=$$('#'+this.id+' .QuestionBody .Graphic');var choices=$$('#'+this.id+' .QuestionBody .Choice img');images=images.concat(graphics,choices);for(var i=0;i<images.length;i++)
{var img=images[i];if(img.width&&img.width>maxWidth)
{mobileCompatibilityLevel='MaybeMobileCompatible';mobileCompatibilityMsg='ImageTooWide';break;}}}
catch(e)
{}
if(!doNotDisplayIcon)
{QES_Global.updateMobileCompatibilityIcon(this,'mobile',mobileCompatibilityMsg,statusIconsContainer);}
return(mobileCompatibilityLevel===null||mobileCompatibilityLevel==='IsMobileCompatible');},hasValidation:function()
{if(this.options['validation']&&this.options['validation']!='None')
return true;else if(this.options['ForceResponse']&&this.options['ForceResponse']!='OFF')
return true;else if(this.options['EnforceRange']&&this.options['EnforceRange']!='OFF')
return true;else if(this.options['MustTotal']&&this.options['MustTotal']!='OFF')
return true;if(this.choices)
{for(var i=0;i<this.choices.length;i++)
{if(!this.choices[i].meta)
continue;if(this.choices[i].meta.TextEntryValidation||this.choices[i].meta.TextEntryForceResponse)
return true;}}
if(this.answers)
{for(i=0;i<this.answers.length;i++)
{if(!this.answers[i].meta)
continue;var valSettings=(this.answers[i].meta.Validation&&this.answers[i].meta.Validation.Settings)||{};if(valSettings.ForceResponse&&valSettings.ForceResponse=='ON')
return true;if(valSettings.Type&&valSettings.Type!='None')
return true;}}
return false;},addDynamicChoices:function(selectionType)
{if(BaseForm.getInstance().revisionId)
{return;}
if(this.hasChoiceGroups())
{alert(getMessage('EditSection','ChoiceGroupsBreaksCarryForwardWarning'));return;}
QModules.loadModule('carryforward.js');this.changeToMCifDB();var defName='dynamic'+selectionType.capitalize();if(!this[defName])
{var siblingQuestion=this.getPrev(true,true);if(!siblingQuestion)
{siblingQuestion=this.getNext(true,true);}
if(siblingQuestion)
{var locatorData=DynamicChoices.getDefaultLocatorData(siblingQuestion);this[defName]={DynamicType:'ChoiceGroup',Locator:DynamicChoices.getLocatorFromData(locatorData),Type:'Dynamic'};this.setSaved(0);}}
this.removeDefaultSelections(selectionType);this.refreshQuestion();this.editDynamicChoices(selectionType);},exitDynamicChoices:function(listType)
{QuestionActions.saveDynamicChoices(this,listType);this.setEdited();this.refreshDynamicChoices(listType,false);this.dynamicChoicesEditor=null;this.refreshCanvas();},deleteDynamicChoices:function(selectionType)
{if(BaseForm.getInstance().revisionId)
{return false;}
if(!this.isReadOnly()&&!this.isLocked())
{var capType=selectionType.capitalize();this['dynamic'+capType]=null;this['proxie'+capType]=null;this['dynamic'+capType+'Editor']=null;this.setSaved(0);this.refreshQuestion();this.refreshDependencies();}},editChoiceGroup:function(evt,choiceGroupId,series,lang)
{var group=ChoiceGroup.getInstance(choiceGroupId);if(group)
{group.edit(evt,{lang:lang});}},skipLogicEditMode:function(skipLogicIndex)
{if(BaseForm.getInstance().revisionId)
{return false;}
if(this.isLocked())
{var continueOn=QES_Global.handleEditWhenSurveyLocked();if(!continueOn)
return;}
QModules.loadModule('SkipLogic.js');if(this.skipLogicEditor)
{SkipLogic.exitSkipLogicEditMode(this);}
SkipLogic.skipLogicEditMode(this,skipLogicIndex);},exitSkipLogicEditMode:function()
{SkipLogic.deferredExitSkipLogicEditMode(this);return false;},skipLogicDelete:function(skipLogicIndex)
{SkipLogic.removeSkipLogicFromQuestion(this,skipLogicIndex);},addSkipLogic:function()
{if(BaseForm.getInstance().revisionId)
{return;}
if(this.isLocked())
{QES_Global.handleEditWhenSurveyLocked();return;}
if(!this.skipLogic)
{this.skipLogic=[];this.addSkipLogic.bind(this).defer();this.refreshQuestion();return;}
QModules.loadModule('SkipLogic.js');SkipLogic.addSkipLogicToQuestion(this);},advancedOptions:function()
{QES_Global.saveSurvey(false);QModules.loadModule('advanced_question_options.js');new Qualtrics.AdvancedQuestionOptionsBuilder().getAdvancedQuestionOptions(this).show();},openRecodeValues:function()
{if(BaseForm.getInstance().revisionId)
{var popup=new Q_Window({id:'DefaultChoicesInPast',title:getMessage('EditSection','CannotEditRevisionTitle',getMessage('EditSection','RecodeValues')),buttons:['close']});popup.setContent(QBuilder('span',null,getMessage('EditSection','CannotEditRevisionDescription',getMessage('EditSection','RecodeValues'))));return false;}
if(this.isLocked())
{QES_Global.handleEditWhenSurveyLocked();return;}
var that=this;QModules.loadModule('recodevalues.js');Qualtrics.usingRecodeValues=true;var win=new Q_Window('RecodeValuesWindow',{title:getMessage('EditSection','RecodeValues'),onClose:function(){Qualtrics.RecodeValues.saveRecodeValues();that.refreshQuestion.bind(that);Qualtrics.usingRecodeValues=false;},width:'85%',buttons:['close']});win.setContent(Qualtrics.RecodeValues.buildRecodeValues(this));},openChoiceRandomization:function()
{if(BaseForm.getInstance().revisionId)
{var popup=new Q_Window({id:'DefaultChoicesInPast',title:getMessage('EditSection','CannotEditRevisionTitle',getMessage('QuestionOptions','RandAnswers')),buttons:['close']});popup.setContent(QBuilder('span',null,getMessage('EditSection','CannotEditRevisionDescription',getMessage('QuestionOptions','RandAnswers'))));return false;}
if(this.isLocked())
{QES_Global.handleEditWhenSurveyLocked();return;}
Qualtrics.savePage(false);if(!this.ChoiceRandomization)
{QModules.loadModule('QRandomization.js');this.ChoiceRandomization=new ChoiceRandomization(this,this.id);}
this.ChoiceRandomization.show();},openAnswerRandomization:function()
{if(this.isLocked())
{QES_Global.handleEditWhenSurveyLocked();return;}
Qualtrics.savePage(false);if(!this.AnswerRandomization)
{QModules.loadModule('QRandomization.js');this.AnswerRandomization=new AnswerRandomization(this,'a'+this.id);}
this.AnswerRandomization.show();},removeDisplayLogic:function()
{if(this.isLocked()===1)
{QES_Global.handleEditWhenSurveyLocked();return false;}
this.displayLogic=null;this.setSaved(0);this.refresh();Toolbox.getInstance().render();},validateSchema:function(schema,optionKey)
{var json=Qualtrics.parseJSON(schema,true);if(json)
{return true;}
alert(getMessage('EditSection','BadJSON'));return false;},buildSchemaHeader:function(editorId)
{QModules.loadModule('schemaeditor.js');return Qualtrics.SchemaEditor.buildHeader(editorId);},editTextOption:function(optionKey)
{var sectionDef=this.getPossibleOptions()[optionKey];var that=this;var content=this.options[optionKey]?this.options[optionKey]:'';var ep=new JavascriptEditorPopup({title:sectionDef.title,contents:content,width:750,height:500,fullScreenButton:true,apiLink:true,saveCallBack:function(val)
{return that.saveTextOption(content,val,optionKey);}});if(sectionDef.replaceHeader)
{ep.setHeaderContent(Qualtrics.Event.executeDotSyntax(sectionDef.replaceHeader,this.id,null,null,{'$editorId':ep.id}));}},saveTextOption:function(oldJS,newJS,optionKey)
{var sectionDef=this.getPossibleOptions()[optionKey];if(sectionDef.validator)
{var defaultParams=[newJS,optionKey];if(QualtricsCPTools.executeDotSyntax(sectionDef.validator,this.id,null,defaultParams,null)===false)
{return false;}}
if(oldJS!=newJS)
{newJS=newJS.strip();if(newJS=='')
newJS=false;this.options[optionKey]=newJS;this.setSaved(0);this.prepare();this.refreshQuestion();Toolbox.getInstance().refresh();}},addJavascript:function()
{if(BaseForm.getInstance().revisionId)
{var popup=new Q_Window({id:'DefaultChoicesInPast',title:getMessage('EditSection','CannotEditRevisionTitle',getMessage('SiteWide','Javascript')),buttons:['close']});popup.setContent(QBuilder('span',null,getMessage('EditSection','CannotEditRevisionDescription',getMessage('SiteWide','Javascript'))));return false;}
if(this.isLocked())
{QES_Global.handleEditWhenSurveyLocked();return false;}
var that=this;var content=this.questionJS||JavascriptEditorPopup.defaultJS;new JavascriptEditorPopup({title:getMessage("EditSection","JavascriptEditor"),contents:content,width:750,height:500,fullScreenButton:true,clearButton:true,apiLink:true,saveCallBack:function(val)
{that.saveJavascript(content,val);}});},saveJavascript:function(oldJS,newJS)
{if(oldJS!=newJS)
{newJS=newJS.strip();if(newJS=='')
newJS=false;this.questionJS=newJS;this.setSaved(0);this.refreshQuestion();}},addNotes:function()
{if(BaseForm.getInstance().revisionId)
{return;}
this.noteStatus='Expanded';this.refreshQuestion();this.showAddNote();},toggleNotes:function()
{var notesObj=BaseForm.getInstance().notes[this.questionId];this.noteStatus=(this.noteStatus=='Expanded')?'Collapsed':'Expanded';notesObj.setStatus(this.noteStatus);notesObj.setSaved(0);this.refreshQuestion();},showAddNote:function()
{var selector=$('ShowAddNote~'+this.id);selector.insert({after:QBuilder('input',{type:'button',className:'button',id:'AddNote~'+this.id,name:'AddNote~'+this.id,clickcallback:'Question.addNote:'+this.id,value:getMessage('EditSection','Post')})});selector.replace(QBuilder('textarea',{id:'NewNote~'+this.id,className:'text',name:'NewNote~'+this.id}));var textarea=$('NewNote~'+this.id);textarea.focus();var that=this;$('NewNote~'+this.id).observe('keydown',function(event)
{var key=event.keyCode||event.which;if(key==Event.KEY_RETURN)
{if(!event.shiftKey)
{that.addNote();}
else
{textarea.addClassName('Extended');}}});$('NewNote~'+this.id).observe('keyup',function(event)
{if(event.target.scrollHeight>25)
{textarea.addClassName('Extended');}});},showLastNote:function(questionDiv)
{$(questionDiv).select('.NotesList .ListContainer').each(function(a){a.scrollTop=a.scrollHeight;});},addNote:function()
{if(BaseForm.getInstance().revisionId)
{return;}
var message=trim($('NewNote~'+this.id).value);$('NewNote~'+this.id).value='';var note={Message:message};if(message!=''){this.setNote(note,'Expanded');}
this.noteStatus='Expanded';this.refreshQuestion();},removeNote:function(noteId)
{var note={ID:noteId,Removed:true};this.noteStatus=null;this.setNote(note,'Expanded');if(this.questionId)
{BaseForm.getInstance().notes[this.questionId].removeNote(noteId);this.refreshQuestion();}},setNote:function(note,status)
{var that=this;var baseForm=BaseForm.getInstance();var elementId=null;var questionId=this.questionId;if(!questionId)
{this.save({asynchronous:false});questionId=this.questionId;}
if(baseForm.notes[questionId])
{elementId=baseForm.notes[questionId].elementId;}
new Ajax.Request('Ajax.php?action=SetNoteSurveyElement',{parameters:{SurveyID:baseForm.id,ParentID:questionId,SurveyElementID:elementId,Status:status,Note:Object.toJSON(note)},onSuccess:function(data)
{var response=data.responseText.evalJSON();if(!response['Error'])
{var notes=response['Notes'];elementId=response['SurveyElementID'];var baseForm=BaseForm.getInstance();baseForm.addNotes(questionId,elementId,notes,status);var notesObj=baseForm.notes[questionId];notesObj.setSaved(0);that.setSaved(0);that.refreshQuestion();}
else
{Qualtrics.Error(response['Error']);}}});},addChoiceAndRender:function(text,position,opt_groupId)
{if(this.isLocked())
{return false;}
var newChoice=this.addChoice(text,position,false,opt_groupId);var idMap=this.resetSelectionIdsIfNoResponses('choices');this.updateGradingData('ChoiceID',idMap);this.refreshCanvas();QuestionActions.select(this);Toolbox.getInstance().update();return newChoice;},addAnswerAndRender:function(text,position)
{if(this.isLocked())
{return false;}
var newAnswer=this.addAnswer(text,position);var idMap=this.resetSelectionIdsIfNoResponses('answers');this.updateGradingData('AnswerID',idMap);this.refreshCanvas();QuestionActions.select(this);Toolbox.getInstance().update();return newAnswer;},addColumnLabelAndRender:function(text,position)
{if(this.isLocked())
{return false;}
var newColumnLabel=this.addColumnLabel(text,position,true);this.refreshCanvas();Toolbox.getInstance().updateSpinner('ColumnLabelsCounter',this.options.ColumnLabelsCounter);QuestionActions.select(this);return newColumnLabel;},handleDefaultChoices:function()
{if(this.isLocked())
{QES_Global.handleEditWhenSurveyLocked();return false;}
if(this.parentObj.parentObj.revisionNumber)
{var popup=new Q_Window({id:'DefaultChoicesInPast',title:getMessage('EditSection','CannotEditDefaultChoicesTitle'),buttons:['close']});popup.setContent(QBuilder('span',null,getMessage('EditSection','CannotEditDefaultChoicesViewingHistory')));return false;}
if(!this.parentObj.parentObj.getPermission('editQuestions',true))
{popup=new Q_Window({id:'DefaultChoicesPermissionDenied',title:getMessage('EditSection','CannotEditDefaultChoicesTitle'),buttons:['close']});popup.setContent(QBuilder('span',null,getMessage('EditSection','CannotEditDefaultChoicesPermissionDenied')));return false;}
Qualtrics.savePage(false);QModules.loadModule('QQuestionPopups.js');this.caretPos=0;var that=this;if(!this.defaultChoicesPopup)
{this.defaultChoicesPopup=new DefaultChoicesPopup({title:getMessage('EditSection',"DefaultChoicesEditor"),width:900,height:500,questionObj:that,onBeforeSave:function(popupId)
{try{that.beforeSaveDefaultChoices(popupId);}catch(e){console.error(e);}},saveCallBack:function(popupId,value)
{try{that.saveDefaultChoices(popupId,value);}catch(e){console.error(e);}},clearCallBack:function(popupId,form,win)
{try{that.clearDefaultChoices(popupId,form,win);}catch(e){console.error(e);}},onSetContent:function(popupId)
{try{that.initializeDefaultChoicesPreview(popupId);}catch(e){console.error(e);}},closeCallBack:function(popupId)
{try{that.closeDefaultChoices(popupId);}catch(e){console.error(e);}}});}
else
{this.defaultChoicesPopup.clearContent();}
this.defaultChoicesPopup.show();return true;},addPipedTextButton:function(el)
{var elementUnique=el.id;if(!elementUnique)
elementUnique=el.name;if(!elementUnique)
return;var pipedButton=QBuilder('span',{className:"pipedButton",clickcallback:"Question.openPipedText:"+this.id+"($el, "+elementUnique+")"});var offset=$(el).positionedOffset();var elWidth=$(el).getWidth();$(pipedButton).setStyle({top:(offset.top-1)+'px',left:(offset.left+elWidth+4)+'px',position:'absolute'});$(el).insert({after:pipedButton});},openPipedText:function(clickedEl,inputUniqueIdent)
{QModules.loadModule('pipedtext.js');this.inputID=inputUniqueIdent;var inputField=$(inputUniqueIdent);if(!inputField)
inputField=$$('input[name='+inputUniqueIdent+']')[0];var caretPos=this.getCaretPos(inputField);this.caretPos=caretPos;if(Qualtrics.PipedText)
{var pipedText=new Qualtrics.PipedText(clickedEl,"Question.insertPipedText:"+this.id,{position:this.caretPos});}},insertPipedText:function(text,position)
{var inputField=$(this.inputID);if(!inputField)
inputField=$$('input[name='+this.inputID+']')[0];var inputValue=inputField.value;var newValue=inputValue.substr(0,position.start)+text+inputValue.substr(position.end);inputField.value=newValue;},removeDCPipedEvents:function(){var textInputs=this.defaultChoicesPopup.form.select('input[type=text]','textarea');textInputs.each(function(input){Event.stopObserving(input);});},beforeSaveDefaultChoices:function(popupId)
{this.removeDCPipedEvents();var type=this.questionType;var callback=(QuestionTypes[type]&&QuestionTypes[type].beforeSaveDefaultChoices)||QuestionTypes.Universal.beforeSaveDefaultChoices;if(callback)
callback(this,popupId);},saveDefaultChoices:function(popupId,newChoices)
{var type=this.questionType;if(newChoices!==false)
{var hasSubChoices=false;var callback=(QuestionTypes[type]&&QuestionTypes[type].saveDefaultChoices)||QuestionTypes.Universal.saveDefaultChoices;if(callback)
callback(this,newChoices[this.questionId],popupId);if(type=='SBS')
{var that=this;var answerList=this.getSelectionListToRender('answers');answerList.each(function(answerObj)
{var answerId=answerObj.answerId;var subQuestionId=that.questionId+'#'+answerId;var subQuestionType=answerObj.meta.QuestionType;if(newChoices[subQuestionId]==undefined)
return;var subAnswers=[];for(var i=0,answerLen=answerObj.series.length;i<answerLen;i++)
{subAnswers[i]={answerId:i+1,text:answerObj.series[i]};}
var subQuestion={};Object.extend(subQuestion,that);subQuestion.questionId=subQuestionId;subQuestion.questionType=subQuestionType;subQuestion.selector=answerObj.meta.Selector;subQuestion.subSelector=answerObj.meta.SubSelector;subQuestion.answers=subAnswers;subQuestion.choices=that.choices;subQuestion.sideBySide=true;var subCallback=(QuestionTypes[subQuestionType]&&QuestionTypes[subQuestionType].saveDefaultChoices)||QuestionTypes.Universal.saveDefaultChoices;if(subCallback)
subCallback(subQuestion,newChoices[subQuestionId],popupId);answerObj.defaultChoices=subQuestion.defaultChoices;if(subQuestion.defaultChoices)
hasSubChoices=true;});}
if(!this.defaultChoices&&hasSubChoices)
this.defaultChoices={};}
else
{this.removeDefaultChoices();}
this.setEdited();},clearDefaultChoices:function(popupId,form,windowContext)
{var type=this.questionType;var win=windowContext||window;var callback=(QuestionTypes[type]&&QuestionTypes[type].clearDefaultChoices)||QuestionTypes.Universal.clearDefaultChoices;if(callback)
callback(this,form,popupId,win);},closeDefaultChoices:function(popupId)
{this.refreshQuestion();},initializeDefaultChoicesPreview:function(popupId)
{var type=this.questionType;var callback=(QuestionTypes[type]&&QuestionTypes[type].initializePreview)||QuestionTypes.Universal.initializePreview;if(callback)
{callback(this,popupId);}},buildDynamicChoicesBox:function(selectionType,opt_editMode)
{var capType=selectionType.capitalize();var editorName='dynamic'+capType+'Editor';var def=this['dynamic'+capType];if(def&&def.Type=='Dynamic')
{var data=DynamicChoices.getDataFromLocator(def['Locator']);var carryForwardQuestionObj=BaseForm.getInstance().getQuestionBySystemId(data.questionId);var type=data.carryForwardType;if(opt_editMode)
{if(!this[editorName])
{this[editorName]=new DynamicChoicesEditor(this,selectionType);}
var insideDiv=this[editorName].buildEditor();var button=QBuilder('span',{className:'CarryFowardEdit'},[QBuilder('a',{clickcallback:'Question.exitDynamicChoices:'+this.id,p1:selectionType},getMessage('SiteWide','Done'))]);}
else
{var editString='Edit';if(selectionType=='answers')
{var xDef=this.getX();if(xDef)
{var xLabel=xDef.label;editString+=' '+xLabel+'s';}}
if(carryForwardQuestionObj)
{var qdesc=String(carryForwardQuestionObj.description||carryForwardQuestionObj.text).stripTags();var qdescTrunc=qdesc.truncate(50);var carryForwardString=getMessage('CarryForward');var fromString=getMessage('From');var typeString=DynamicChoices.getDescriptionFromLocator(def['Locator']);if(def.Description!=undefined)
{typeString=def.Description;}
var qdescSpan=QBuilder('strong',{title:qdesc});qdescSpan.innerHTML=qdescTrunc;insideDiv=QBuilder('span',null,[carryForwardString,' ',QBuilder('strong',null,[typeString]),' ',fromString,' "',qdescSpan,'"']);button=QBuilder('span',{className:'CarryFowardEdit'},[QBuilder('a',{clickcallback:'Question.editDynamicChoices:'+this.id,p1:selectionType},editString)]);}
else
{insideDiv=QBuilder('span',{className:'Invalid'},getMessage('EditSection','InvalidCarryForward'));button=QBuilder('span',{className:'CarryFowardEdit'},[QBuilder('a',{clickcallback:'Question.editDynamicChoices:'+this.id,p1:selectionType},editString)]);}}
var carryForwardDiv=QBuilder('div',{id:'Dynamic'+capType+'Box~'+this.id,className:'DynamicChoicesBox LogicBox'},[QBuilder('table',null,[QBuilder('tbody',null,[QBuilder('tr',null,[QBuilder('td',{className:'TopCap',colSpan:'2'},[QBuilder('div',{className:'CloseButton',clickcallback:'Question.deleteDynamicChoices:'+this.id+'('+selectionType+')'})])]),QBuilder('tr',null,[QBuilder('td',{className:'InfoBarTab'},[QBuilder('img',{src:'../WRQualtricsControlPanel/CPGraphics/CarryForwardIconBig.png'})]),QBuilder('td',{className:'CarryForwardDesc',width:'100%'},[insideDiv,button])]),QBuilder('tr',null,[QBuilder('td',{className:'BottomCap',colSpan:'2'})])])])]);return carryForwardDiv;}
return'';},buildNotes:function()
{var notes=[];var noteList=[];var menuHTML=[];var status='Hidden';var empty=true;var i;var base=BaseForm.getInstance();if(base.notes[this.questionId])
{status=base.notes[this.questionId].status;notes=base.notes[this.questionId].notes;}
else if(this.noteStatus)
{status=this.noteStatus;}
if(status=='Hidden'){return'';}
else if(status=='Expanded')
{for(i=0;i<notes.length;i++)
{var note=notes[i];if(note.removed==false)
{empty=false;var removeHTML='';var accountType=Qualtrics.User.accountType;if(Qualtrics.User.userId==note.userId||base.ownerId==Qualtrics.User.userId||accountType=='Server Administrator'||accountType=='Multi-Brand Administrator'||accountType=='Brand Administrator')
{removeHTML=QBuilder('td',null,[QBuilder('div',{className:'RemoveNote',clickcallback:'Question.removeNote:'+this.id,p1:note.noteId},null)]);}
else
{removeHTML=QBuilder('td',null,' ');}
var message=document.createElement('div');message.innerHTML=note.message;var noteHTML=QBuilder('tr',null,[removeHTML,QBuilder('td',{className:'nowrap'},note.dateTime),QBuilder('td',{className:'userName nowrap'},[QBuilder('b',null,note.userFullName)]),QBuilder('td',null,[message])]);noteList.push(noteHTML);}}
if(notes.length==0&&!this.noteStatus)
{return'';}
if(notes.length>0)
{menuHTML.push(QBuilder('input',{type:'button',id:'ToggleNotes~'+this.id,name:'ToggleNotes~'+this.id,className:'button',clickcallback:'Question.toggleNotes:'+this.id,value:getMessage('EditSection','HideDiscussion')}));}
menuHTML.push(QBuilder('input',{type:'button',id:'ShowAddNote~'+this.id,name:'ShowAddNote~'+this.id,className:'button',clickcallback:'Question.showAddNote:'+this.id,value:getMessage('EditSection','AddAComment')}));}
else
{var lastNoteHTML='';i=notes.length;while(i>0)
{i--;note=notes[i];if(note.removed==false)
{empty=false;lastNoteHTML=QBuilder('span',null,[getMessage('EditSection','LastComment')+': '+note.dateTime+' '+getMessage('EditSection','By')+' '+note.userFullName+' -- ',QBuilder('b',null,[QBuilder('i',null,[note.excerpt])])]);break;}}
var buttonText=getMessage('EditSection','ShowDiscussion')+' ('+notes.length+')';menuHTML=[QBuilder('div',{className:'nowrap'},[QBuilder('span',null,[QBuilder('input',{type:'button',id:'ToggleNotes~'+this.id,name:'ToggleNotes~'+this.id,className:'button',clickcallback:'Question.toggleNotes:'+this.id,value:buttonText})]),lastNoteHTML])];}
var emptyHTML=(empty==true)?' Empty':'';var QuestionNotesHTML=QBuilder('div',{className:'QuestionNotes '+status+emptyHTML,id:'QuestionNotes~'+this.id},[QBuilder('div',{className:'NotesBorderTop'},[]),QBuilder('div',{className:'NotesList'},[QBuilder('div',{className:'ListContainer'},[QBuilder('table',null,[QBuilder('tbody',null,noteList)])])]),QBuilder('div',{className:'NotesToolbar'},[QBuilder('div',{className:'AddNotesMenu'},menuHTML)])]);this.noteStatus=status;return QuestionNotesHTML;},buildSkipLogic:function(opt_editMode,opt_editSkipLogicIndex)
{var blockId=this.parentObj&&this.parentObj.blockId;var questionId=this.questionId;if(this.skipLogic&&this.skipLogic.length&&blockId&&questionId)
{var items=QBuilder('tbody');for(var i=0,len=this.skipLogic.length;i<len;++i)
{var editMode=opt_editMode&&(opt_editSkipLogicIndex==undefined||opt_editSkipLogicIndex==i);if(SkipLogic.validateSkipLogic(this,i)||editMode)
{var id=this.skipLogic[i].SkipLogicID;var desc=this.skipLogic[i].Description;desc=SkipLogic.buildDescription(this,i);var colorData=SkipLogic.getSkipLogicColorById(id);var colorBox=QBuilder('td',{className:'SkipLogicColorBox',clickcallback:"scrollToSkipMarker("+id+", "+this.parentObj.id+")",id:'SkipLogic_'+id},[QBuilder('span')]);if(editMode)
{if(!this.skipLogicEditor)
{this.skipLogicEditor=new LogicEditor(this);}
var tr=QBuilder('tr',null,[QBuilder('td',{className:'SkipLogicDescription'},[this.skipLogicEditor.renderEditableElement(opt_editSkipLogicIndex)]),QBuilder('td',{className:'SkipLogicEdit'},[QBuilder('a',{target:'SkipLogic',clickcallback:'Question.exitSkipLogicEditMode:'+this.id},getMessage('SiteWide','Done'))])]);}
else
{var descLink=QBuilder('a',{id:'SkipLogic_'+id,target:'SkipLogic',clickcallback:'Question.skipLogicEditMode:'+this.id,p1:i});descLink.innerHTML=desc;tr=QBuilder('tr',null,[QBuilder('td',{className:'SkipLogicDescription'},[QBuilder('div',null,[descLink])]),QBuilder('td',{className:'SkipLogicEdit'},[this.buildSkipLogicMenuButton(i)])]);if(opt_editMode)
{$(tr).addClassName('GrayedOut');}}}
else
{colorBox=QBuilder('td',{className:'SkipLogicColorBox',clickcallback:"scrollToSkipMarker("+id+", "+this.parentObj.id+")",id:'SkipLogic_'+id},[QBuilder('span')]);tr=QBuilder('tr',null,[QBuilder('td',{className:'SkipLogicDescription'},[QBuilder('div',null,'Invalid Skip Logic')]),QBuilder('td',{className:'SkipLogicEdit'},[this.buildSkipLogicMenuButton(i)])]);$(colorBox).setStyle({backgroundColor:'red'});}
descLink=null;colorBox=null;items.appendChild(tr);tr=null;}
var skipLogicDiv=this.buildLogicBox(QBuilder('table',null,[items]),'SkipLogicBox');return skipLogicDiv;}
else
{if(this.skipLogic&&!this.skipLogic.length)
{return this.buildLogicBox(QBuilder('div',{className:'Loading'},getMessage('SiteWide','Loading')),'SkipLogicBox');}}
return'';},buildSkipLogicMenuButton:function(skipLogicIndex)
{var skipLogicId=this.skipLogic[skipLogicIndex].SkipLogicID;var colorData=SkipLogic.getSkipLogicColorById(skipLogicId);if(colorData)
{var dest=this.skipLogic[skipLogicIndex].SkipToDestination;if(dest=='ENDOFBLOCK')
{colorData['bg']='#888888';colorData['fg']='#fff';}
if(dest=='ENDOFSURVEY')
{colorData['bg']='#000000';colorData['fg']='#ccc';}}
var menuButton=QMenu.buildMenuButton(getMessage('EditSection','SkipLogicText'),'Question.getSkipLogicMenuDef:'+this.id+'('+skipLogicIndex+')',{className:'SkipLogicMenuButton SelectMenuButton'});if(menuButton.callbackNode)
{$(menuButton.callbackNode.parentNode).setStyle({background:colorData.bg,color:colorData.fg});}
return menuButton;},getSkipLogicMenuDef:function(skipLogicIndex)
{if(BaseForm.getInstance().revisionId)
{var disabledClassName='Disabled';}
var skipLogicId=this.skipLogic[skipLogicIndex].SkipLogicID;return{items:[{display:getMessage('EditSection','EditSkipLogic')+'...',action:'Question.skipLogicEditMode:'+this.id+'('+skipLogicIndex+')',className:disabledClassName},{display:getMessage('SiteWide','AdvancedOptions')+'...',action:'QuestionActions.skipLogicClick('+this.id+', '+skipLogicIndex+')',className:disabledClassName},{display:getMessage('EditSection','GoToSkipDestination'),action:'scrollToSkipMarker('+skipLogicId+', '+this.parentObj.id+')',id:'SkipLogic_'+skipLogicId},{separator:1},{display:getMessage('EditSection','RemoveSkipLogic'),action:'Question.skipLogicDelete:'+this.id+'('+skipLogicIndex+')',className:disabledClassName}]};},getFormValidationMenu:function(choiceID)
{var current=this.getChoiceByChoiceId(choiceID).getMeta('TextEntryValidation');var items=[{display:getMessage('ValidationTypes','NoValidation'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', )',className:(current==''&&'check')},{display:getMessage('ValidationTypes','ValidEmail'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', ValidEmail)',className:(current=='ValidEmail'&&'check')},{display:getMessage('ValidationTypes','ValidPhone'),className:(current=='USPhone'||current=='CAPhone'||current=='UKPhone'||current=='AUPhone'||current=='NZPhone'||current=='NLPhone')&&'check',submenu:{items:[{display:getMessage('ValidationTypes','USPhone'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', USPhone)',className:(current=='USPhone'&&'check')},{display:getMessage('ValidationTypes','CAPhone'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', CAPhone)',className:(current=='CAPhone'&&'check')},{display:getMessage('ValidationTypes','UKPhone'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', UKPhone)',className:(current=='UKPhone'&&'check')},{display:getMessage('ValidationTypes','AUPhone'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', AUPhone)',className:(current=='AUPhone'&&'check')},{display:getMessage('ValidationTypes','NZPhone'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', NZPhone)',className:(current=='NZPhone'&&'check')},{display:getMessage('ValidationTypes','NLPhone'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', NLPhone)',className:(current=='NLPhone'&&'check')}]}},{display:getMessage('ValidationTypes','ValidUSState'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', ValidUSState)',className:(current=='ValidUSState'&&'check')},{display:getMessage('ValidationTypes','ValidZip'),className:(current=='USZip'||current=='UKZip'||current=='AUZip'||current=='NZZip'||current=='NLZip')&&'check',submenu:{items:[{display:getMessage('ValidationTypes','USZip'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', USZip)',className:(current=='USZip'&&'check')},{display:getMessage('ValidationTypes','UKZip'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', UKZip)',className:(current=='UKZip'&&'check')},{display:getMessage('ValidationTypes','AUZip'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', AUZip)',className:(current=='AUZip'&&'check')},{display:getMessage('ValidationTypes','NZZip'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', NZZip)',className:(current=='NZZip'&&'check')},{display:getMessage('ValidationTypes','NLZip'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', NLZip)',className:(current=='NLZip'&&'check')}]}},{display:getMessage('ValidationTypes','ValidDate'),className:(current=='DateWithFormat'||current=='DateAltFormat')&&'check',submenu:{items:[{display:getMessage('ValidationTypes','DateWithFormat'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', DateWithFormat)',className:(current=='DateWithFormat'&&'check')},{display:getMessage('ValidationTypes','DateAltFormat'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', DateAltFormat)',className:(current=='DateAltFormat'&&'check')},{display:getMessage('ValidationTypes','DateIntlFormat'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', DateIntlFormat)',className:(current=='DateIntlFormat'&&'check')}]}},{display:getMessage('ValidationTypes','ValidNumber'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', ValidNumber)',className:(current=='ValidNumber'&&'check')},{display:getMessage('ValidationTypes','ValidTextOnly'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', ValidTextOnly)',className:(current=='ValidTextOnly'&&'check')},{display:getMessage('ForceResponse'),action:'Question.setFormValidation:'+this.id+'('+choiceID+', ForceResponse)',className:(current=='ForceResponse'&&'check')}];return{items:items};},setFormValidation:function(choiceID,val)
{var choice=this.getChoiceByChoiceId(choiceID);if(!choice.meta)
{choice.meta={};}
choice.meta['TextEntryValidation']=val;var newText=getMessage('ValidationTypes','NoValidation');if(val=='ForceResponse')
newText=getMessage('ForceResponse');else if(val)
newText=getMessage('ValidationTypes',val);choice.formValidationText.innerHTML=newText;this.setEdited();},buildDisplayLogic:function()
{var expressionCount=this.displayLogic.logicEditor.getAllExpressions().length;var warning='';if(this.parentObj.randomizeQuestions&&this.parentObj.randomizeQuestions!='false')
{warning=QBuilder('div',{className:'Warning'},getMessage('EditSection','RandomizationWarning'));}
else if(this.hasInPageDisplayLogic())
{var incompatibleFeatures=this.safeToUseInPageDisplayLogic();if(!incompatibleFeatures.safe)
{var warningMsg='';if(incompatibleFeatures.skipLogic)
warningMsg=getMessage('EditSection','InPageWithSkipLogic');else if(incompatibleFeatures.carryForwardChoices)
warningMsg=getMessage('EditSection','InPageWithCarryForward');else if(incompatibleFeatures.validation)
warningMsg=getMessage('EditSection','InPageWithValidation');else if(incompatibleFeatures.forceResponse)
warningMsg=getMessage('EditSection','InPageWithForceResponse');else if(incompatibleFeatures.loopAndMerge)
warningMsg=getMessage('EditSection','InPageWithLoopMerge');else if(incompatibleFeatures.choiceDisplayLogic)
warningMsg=getMessage('EditSection','InPageWithChoiceDisplayLogic');else if(incompatibleFeatures.incompatibleQuestionType)
warningMsg=getMessage('EditSection','InPageWithBadQuestionType')
+getMessage('EditSection',incompatibleFeatures.incompatibleQuestionType);warning=QBuilder('div',{className:'Warning'},warningMsg);}
else if(incompatibleFeatures.forceResponse)
{warning=QBuilder('div',{className:'Warning'},getMessage('EditSection','InPageWithForceResponse'));}
else if(incompatibleFeatures.validation)
{warning=QBuilder('div',{className:'Warning'},getMessage('EditSection','InPageWithValidation'));}}
if(expressionCount)
{var displayLogicContent=QBuilder('div',null,[this.displayLogic.logicEditor.build()]);return this.buildLogicBox(QBuilder('div',{},[warning,QBuilder('h3',{},'Display This Question:'),displayLogicContent]),'DisplayLogic');}
else
{return'';}},buildLogicBox:function(content,type)
{var className='SkipLogicBox';var icon='SkipLogicIconDark.png';var removeAction='Question.removeSkipLogic:'+this.id;if(type=='DisplayLogic')
{className='DisplayLogicBox';icon='/DisplayLogic/DisplayLogicIcon.png';removeAction='Qualtrics.DisplayLogic.removeDisplayLogic:'+this.displayLogic.id;}
return QBuilder('div',{className:className+' LogicBox',id:className+'~'+this.id},[QBuilder('div',{className:'CloseButton',clickcallback:removeAction,p1:'refresh'}),QBuilder('table',null,[QBuilder('tbody',null,[QBuilder('tr',null,[QBuilder('td',{className:className+'TopCap',colSpan:'2'})]),QBuilder('tr',null,[QBuilder('td',{className:'LogicInfoBarTab'},[QBuilder('img',{src:'../WRQualtricsControlPanel/CPGraphics/'+icon})]),QBuilder('td',{className:'SkipLogicDesc LogicDesc',width:'100%'},[content])]),QBuilder('tr',null,[QBuilder('td',{className:className+'BottomCap',colSpan:'2'})])])])]);},editDynamicChoices:function(selectionType)
{if(BaseForm.getInstance().revisionId)
{return false;}
if(!this.isReadOnly()&&!this.isLocked())
{QES_Global.saveSurvey(false);this.refreshDynamicChoices(selectionType,true);}},refreshDynamicChoices:function(selectionType,opt_editMode)
{if(selectionType)
{var type=selectionType.capitalize();var box=$('Dynamic'+type+'Box~'+this.id);if(box)
{var parentNode=box.parentNode;removeElement(box);box=null;var newElement=this.buildDynamicChoicesBox(selectionType,opt_editMode);if(newElement)
{parentNode.appendChild(newElement);if($('DynamicChoiceTextEntry'))
{$('DynamicChoiceTextEntry').focus();}}
newElement=null;}
this.refreshDependencies();}},updateSkipLogic:function()
{if(this.skipLogic)
{var editMode=false;var activeIndex=null;if(this.skipLogicEditor)
{editMode=true;activeIndex=this.skipLogicEditor.activeIndex;}
QES_Global.saveSurvey(false);this.cachedPipingOptions=null;this.refreshSkipLogic(editMode,activeIndex);}},refreshSkipLogic:function(opt_editMode,opt_editSkipLogicIndex)
{var skipLogicBox=$('SkipLogicBox~'+this.id);if(skipLogicBox)
{var parentNode=skipLogicBox.parentNode;var skipLogicElement=this.buildSkipLogic(opt_editMode,opt_editSkipLogicIndex);removeElement(skipLogicBox);skipLogicBox=null;if(skipLogicElement)
{parentNode.appendChild(skipLogicElement);}
skipLogicElement=null;}},removeSkipLogic:function(opt_refresh)
{if(BaseForm.getInstance().revisionId)
{return false;}
if(this.isLocked()===1)
{QES_Global.handleEditWhenSurveyLocked();return false;}
if(this.skipLogic)
{SkipLogic.exitSkipLogicEditMode(this);for(var i=0,len=this.skipLogic.length;i<len;++i)
{SkipLogic.removeSkipMarker(this,i);}
this.height=null;this.skipLogic=null;this.savedSkipLogic=0;this.setSaved(0);this.skipLogicEditor=null;if(opt_refresh)
{this.refreshQuestion();}}},refresh:function(renderOptions)
{this.refreshQuestion(renderOptions);},refreshQuestion:function(renderOptions)
{this.resetQuestion();if(inlineEditor.getInstance())
{inlineEditor.getInstance().removeInlineEditor();}
if(this.regionHandler)
this.regionHandler.clear();this.removeQuestionDOM();this.render(renderOptions);if(this.parentObj)
{QuestionActions.updateIcons();}
if(this.selected)
{QuestionActions.select(this,null,true,true);}},collapse:function()
{this.collapsed=1;this.refreshQuestion();QuestionTopCache={};this.height=null;QuestionActions.updateIcons();},expand:function()
{this.collapsed=0;this.refreshQuestion();QuestionTopCache={};this.height=null;QuestionActions.updateIcons();},frameQuestion:function(duration,returnValue,options)
{if(duration==undefined)
{duration=0.2;}
var windowBottom=getPageSize()[3];var viewBottom=scrollInfo[1]+windowBottom;var questionObj=this;var viewTop=scrollInfo[1];if(this.getHeight()>windowBottom)
{return false;}
options=Object.extend({topOffset:0,renderToolBox:true},options||{});var afterFinishAction=null;if(options.renderToolBox)
afterFinishAction=Toolbox.deferredRender;if(viewBottom<this.getBottom())
{var bottomPadding=20;if(returnValue)
{return returnValue;}
var top=questionObj.getTop();top+=0-(windowBottom-questionObj.getHeight()-bottomPadding);QES_Global.stopScrolling();QES_Global.scroller=new Effect.ScrollToY(top,{duration:duration,afterFinish:afterFinishAction});return true;}
if(viewTop+options.topOffset>this.getTop())
{var topPadding=20+options.topOffset;top=questionObj.getTop();top+=0-topPadding;QES_Global.stopScrolling();QES_Global.scroller=new Effect.ScrollToY(top,{duration:duration,afterFinish:afterFinishAction});return true;}
return false;},buildLabelIcon:function()
{return QBuilder('a',{href:'javascript:void(0)',title:getMessage('EditSection','EditQuestionLabel'),className:'LabelIcon',clickcallback:'Question.editLabel',instanceid:this.id,p1:'$evt'},[QBuilder('span',{className:'icon'}),getMessage('EditSection','EditQuestionLabel')]);},editLabel:function(evt)
{Event.stop(evt);if(this.labelControls)
{this.customDescription=true;this.labelControls.removeClassName('LabelControlsHidden');this.labelControls.innerHTML='';var labelInner=QBuilder('span',{className:'LabelInner'});labelInner.appendChild(this.buildLabelIcon());labelInner.appendChild(QBuilder('span',null,getMessage('EditSection','EditQuestionLabel')+':'));var input=QBuilder('input',{id:'EditLabelInput',keepeditoropen:'true',type:'text',size:70,maxlength:200,value:this.description});labelInner.appendChild(input);if(this.customDescription)
{labelInner.appendChild(QBuilder('span',{className:'ResetLink a',keepeditoropen:'true',downcallback:'Question.resetLabel',instanceid:this.id},'Reset Label'));}
this.labelControls.appendChild(labelInner);$(input).activate();this.labelObserver=new Form.Element.Observer(input,0.2,this.updateLabel.bind(this));input.onblur=this.labelBlur.bind(this);}},resetLabel:function()
{this.customDescription=false;this.questionTextObj.onUpdate(inlineEditor.getInstance());this.setSaved(0);},labelBlur:function(evt)
{this.updateLabel();this.questionTextObj.onUpdate(inlineEditor.getInstance());},updateLabel:function()
{var el=$('EditLabelInput');if(el)
{this.description=el.value;if(this.description==this.getAutoDescription())
{this.customDescription=false;}
this.setSaved(0);}},removeLabelControls:function()
{if(this.labelControls)
{removeElement(this.labelControls);this.labelControls=null;}},editQuestionText:function(event)
{return this.getQuestionTextObj().edit(event);},getQuestionSpecificDataObj:function(dataType)
{var dataObj=new QuestionSpecificData(this,this.id+'_QSD_'+dataType);dataObj.text=this.questionSpecificData[dataType];return dataObj;},sendToTrash:function(instant)
{if(this.isLocked())
{return false;}
var dependants=this.getDisplayLogicDependents();if(dependants||this.skipMarker)
{if(!confirm('This question is being used as part of logic, are you sure you want to remove it?'))
{return false;}}
var skipMarker=this.skipMarker;if(!this.trashing)
{this.trashing=true;}
if(QES_Global.suspendSelects)
{return false;}
if(!Survey.getInstance().getPermission('deleteSurveyQuestions')||!Survey.getInstance().getPermission('editQuestions',true))
{return false;}
window.QES_OverQuestion.init();window.QES_OverQuestion.suspend=true;var that=this;if(instant)
{that.trashQuestion(instant);if(dependants)
{Qualtrics.DisplayLogic.validateMultipleLogics(dependants);}}
else
{new Effect.Opacity($(this.element),{duration:0.5,from:1,to:0,afterFinish:function(){inlineEditor.clear();that.parentObj.height=undefined;that.trashQuestion(instant);if(dependants)
{Qualtrics.DisplayLogic.validateMultipleLogics(dependants);}
if(skipMarker)
{for(var i=0,len=skipMarker.length;i<len;++i)
{var qid=skipMarker[i]['QuestionID'];if(qid)
{var rootQuestionObj=BaseQuestion.getQuestionByQuestionId(qid);if(rootQuestionObj)
{rootQuestionObj.refreshQuestion();}}}}}});}},trashQuestion:function(instant)
{if(this.isLocked())
{return false;}
if(!instant)
{QES_Global.saveSurvey(false);if(this.selected)
{QuestionActions.unselect(this,{removeFromReg:true});}}
this.removeSkipLogic();var trash=BaseForm.getInstance().getTrash();var oldPos=this.getServerPosition();var oldBlock=this.parentObj;if(!this.tmpMoveData)
{this.tmpMoveData={oldBID:this.parentObj.blockId,oldPos:oldPos};}
this.tmpMoveData.lastPos=this.getPosition();this.restoreData={blockId:this.parentObj.blockId,pos:oldPos};this.removeQuestion();trash.addQuestion(this);this.render();QuestionActions.addToMoveQueue(this,true);if(!instant)
{QuestionActions.executeMoves();}
delete this.trashing;if(this.elementType=='Page Break')
{this.removeQuestion();}
window.QES_OverQuestion.suspend=false;this.parentObj.height=undefined;oldBlock.updateMeta();trash.checkStatus();if(trash.isFull())
{trash.frameBlock();}},addRemoveTextEntry:function(val)
{var lastChoice=this.choices[this.choices.length-1];if(lastChoice)
{lastChoice.textEntry=val;}},toggleAutoResponseScales:function(axis)
{axis=axis.toUpperCase();var autoResponseScales=false;if(this['autoResponseScales'+axis]&&this['autoResponseScales'+axis].active)
{autoResponseScales=true;}
if(!autoResponseScales&&this.choiceGroups)
{alert(getMessage('EditSection','AutomaticScalesNotAvailable1'));return false;}
if(!autoResponseScales&&this.surveyHasResponses()&&this.questionId)
{alert(getMessage('EditSection','AutomaticScalesNotAvailable2'));return false;}
if(this.isLocked())
{QES_Global.handleEditWhenSurveyLocked();return false;}
if(autoResponseScales)
{this['autoResponseScales'+axis].active=false;this.restoreAxisBackup(axis);this.changeToDBifMC();}
else
{if(!this['autoResponseScales'+axis])
{this['autoResponseScales'+axis]={};}
this['autoResponseScales'+axis].active=true;this['autoResponseScales'+axis].assumed=false;this.backupAxis(axis);this.setDefaultResponseScale(axis);this.insertAutoResponseSelections(axis);}
this.refreshDependencies();},hasAutoScale:function(axis)
{if(!this['autoResponseScales'+axis])
{return false;}else
{return this['autoResponseScales'+axis].active;}},getScaleDefinition:function(axis)
{if(this['autoResponseScales'+axis])
{return this['autoResponseScales'+axis];}},transposeScales:function()
{var x=this.getScaleDefinition('X');var y=this.getScaleDefinition('Y');if(x)x=Object.toJSON(x).evalJSON();if(y)y=Object.toJSON(y).evalJSON();this['autoResponseScalesY']=null;this['autoResponseScalesX']=null;if(y)
{this['autoResponseScalesX']=y;}
if(x)
{this['autoResponseScalesY']=x;}
if(x||y)
{QuestionActions.transposeQuestion(this);}},setScaleDefinition:function(axis,scaleName,opt_active,opt_scaleType,opt_length,opt_reverse)
{if(!this['autoResponseScales'+axis])
{this['autoResponseScales'+axis]={};}
var scaleDef=this['autoResponseScales'+axis];scaleDef.scaleName=scaleName;if(opt_scaleType)
{scaleDef.scaleType=opt_scaleType;}
if(opt_length)
{scaleDef.preferredLength=opt_length;}
if(opt_reverse!==undefined)
{scaleDef.reverse=opt_reverse;}
if(opt_active!==undefined)
{scaleDef.active=opt_active;}
scaleDef.assumed=false;},insertAutoResponseSelections:function(axis,opt_length)
{var listType=this.getListType(axis);var scaleDef=this.getScaleDefinition(axis);if(this[listType]&&scaleDef)
{var scaleType=scaleDef.scaleType;var choiceList=this.getSelectedResponseScale(axis,scaleType,opt_length);this[listType].length=0;if(choiceList)
{this.prepare();for(var i=0,len=choiceList.length;i<len;++i)
{var sel=this.addSelection(listType,choiceList[i]);sel.auto=1;if(this.recodeValues)
{sel.recodeValue=i+1;}
if(scaleDef.assumed)
{sel.assumed=1;}}
this.resetSelectionIdsIfNoResponses(listType);}}},replaceDefaultsWithScale:function(axis)
{var listType=this.getListType(axis);var scaleDef=this.getScaleDefinition(axis);if(this[listType]&&scaleDef)
{var choiceList=this.getSelectedResponseScale(axis,scaleDef.scaleType);for(var i=0,len=choiceList.length;i<len;++i)
{var sel;if(this[listType][i])
{if(!this[listType][i].edited)
{sel=this[listType][i];sel.text=choiceList[i];}}
else
{sel=this.addSelection(listType,choiceList[i]);}
if(sel)
{sel.assumed=1;sel.auto=1;}}
if(scaleDef.preferredLength)
{for(i=this[listType].length-1;i>=0;--i)
{if(!this[listType][i].edited&&!this[listType][i].assumed)
{this[listType][i].removeSelection();}}}}},reverseScale:function(axis,evt)
{QMenu.keepMenuOpen();if(evt)
{Event.stop(evt);}
var listType=this.getListType(axis);if(listType)
{var def=this.getScaleDefinition(axis);if(def)
{if(def.reverse)
{def.reverse=false;}
else
{def.reverse=true;}
if($('Reverse_'+axis))
{setTimeout(function(){$('Reverse_'+axis).checked=def.reverse;},1);}
var length=this[listType].length;this.insertAutoResponseSelections(axis,length);this.refreshCanvas();this.refreshDependencies();}}},setSelectedResponseScale:function(scaleName,scaleType,axis,opt_length)
{var listType=this.getListType(axis);if(listType)
{choiceScaleHelpers.activePreviewing=false;var def=this.getScaleDefinition(axis);def.assumed=false;def.scaleName=scaleName;if(scaleType)
{def.scaleType=scaleType;}
this.insertAutoResponseSelections(axis,opt_length);this.refreshCanvas();this.refreshDependencies();Toolbox.getInstance().render();}},setOptions:function(options,opt_refresh,opt_setupDefaultSelections)
{for(var optionKey in options)
{this.setOption(optionKey,options[optionKey],true,true,false,false);}
if(opt_refresh)
{this.refreshCanvas();}
if(opt_setupDefaultSelections)
{this.setupDefaultSelections();}
if(Toolbox.getInstance())
{Toolbox.getInstance().render();}},setSmartResponseScale:function(axis,firstChoiceText,questionText)
{if(this.selectionIdsAreLocked()&&this.questionId)
{return;}
if(this.questionType=='SBS')return;if(axis)
{var listType=this.getListType(axis);var hasDefaults=false;if(this[listType]&&this[listType].length)
{for(var i=0,len=this[listType].length;i<len;++i)
{if(!this[listType][i].edited)
{hasDefaults=true;break;}}
if(hasDefaults)
{if(!this.hasAutoScale(axis))
{var matchingScalePackage=choiceScaleHelpers.findScaleByText(firstChoiceText,0);if(matchingScalePackage)
{var scaleName=matchingScalePackage.scaleName;var length=matchingScalePackage.lengths[matchingScalePackage.lengths.length-1];if(choiceScales[scaleName]&&choiceScales[scaleName]['defaultLength'])
{var scaleDefaultLength=choiceScales[scaleName]['defaultLength'];if(matchingScalePackage.lengths.indexOf(scaleDefaultLength)!==-1)
{length=scaleDefaultLength;}}
this.backupAxis(axis);this.setScaleDefinition(axis,scaleName,'likert',true,length,matchingScalePackage.reverse);var scaleDef=this['autoResponseScales'+axis];if(scaleDef)
{scaleDef.assumed=true;}
this.replaceDefaultsWithScale(axis);this.refreshDependencies();this.refreshCanvas.bind(this).defer();Toolbox.getInstance().render();return true;}}}}}
return false;},setDefaultResponseScale:function(axis)
{var listType=this.getListType(axis);var reverse=null;var questionObj=Toolbox.getInstance().questionObj;var lib=choiceScaleHelpers.getScaleLibrary(questionObj);if(typeof choiceScales!='undefined')
{var first=this[listType][0];if(first)
{var position=0;var scaleNameToUse=null;var lengthToUse=null;var matchingScalePackage=choiceScaleHelpers.findScaleByText(first.text,position);if(matchingScalePackage)
{if(matchingScalePackage.lengths)
{for(var i=0,len=matchingScalePackage.lengths.length;i<len;++i)
{lengthToUse=matchingScalePackage.lengths[i];if(lengthToUse==this[listType].length)
{break;}}}
reverse=matchingScalePackage.reverse;scaleNameToUse=matchingScalePackage.scaleName;}}
if(!scaleNameToUse)
{for(scaleName in choiceScales)
{if(choiceScales[scaleName]['lib']==lib)
{scaleNameToUse=scaleName;break;}}}
var def=this.getScaleDefinition(axis);def.scaleName=scaleNameToUse;def.preferredLength=lengthToUse;if(reverse!==null)
{def.reverse=reverse;}
return{scaleName:scaleNameToUse,scaleLength:lengthToUse};}},getSelectedResponseScale:function(axis,scaleType,opt_length)
{var listType=this.getListType(axis);var selectedScaleDef=this.getScaleDefinition(axis);if(!selectedScaleDef.scaleName)
{this.setDefaultResponseScale(axis);}
var scaleName=selectedScaleDef.scaleName;if(scaleName)
{if(typeof choiceScales!='undefined')
{var scaleDef=choiceScales[scaleName];if(scaleDef['choices'])
{var length=this[listType].length;if(scaleDef['defaultLength'])
{length=scaleDef['defaultLength'];}
if(selectedScaleDef.preferredLength)
{length=selectedScaleDef.preferredLength;}
if(opt_length)
{length=opt_length;}
var scale=choiceScaleHelpers.getScale(scaleName,scaleType,length);if(scale)
{if(selectedScaleDef.reverse)
{scale=scale.reverse();}
return scale;}}}}
return null;},backupAxis:function(axis)
{var def=this.getAxisDef(axis);if(def)
{var listType=def.listType;if(this[listType])
{this[listType+'Backup']=this[listType].clone();}}},restoreAxisBackup:function(axis)
{var def=this.getAxisDef(axis);if(def)
{var listType=def.listType;if(this[listType+'Backup'])
{this[listType]=this[listType+'Backup'].clone();delete this[listType+'Backup'];}}},afterRefresh:function()
{QuestionActions.updateIcons();if(this.selected)
{QuestionActions.select(this);}},getScale:function(listType)
{if(this[listType]&&this[listType].length)
{var scale=[];for(var i=0,len=this[listType].length;i<len;i++)
{scale.push(this[listType][i].text);}
return scale;}
return false;},afterQuestionTextEdit:function()
{this.removeLabelControls();this.checkForHeightShift();},permanentlyDelete:function(evt)
{var el=Event.element(evt);new Ajax.Request('Ajax.php?action=PermanentlyDeleteQuestion',{method:'post',parameters:{SurveyID:BaseForm.getInstance().id,BID:this.parentObj.blockId,QID:this.questionId},onComplete:this.handlePermanentlyDelete.bind(this)});if(el)
{var questionDom=QualtricsTools.fastUp(el,'Question');$(questionDom).addClassName('HideButtons');var canvas=QualtricsTools.fastDown(questionDom,'QuestionCanvas');if(questionDom)
{$(questionDom).setStyle({overflow:'hidden'});new Effect.Parallel([new Effect.Fade(canvas,{sync:true}),new Effect.Morph(questionDom,{style:'height:20px;',sync:true})],{duration:0.2});}}},handlePermanentlyDelete:function(transport,el)
{var json=Qualtrics.parseJSON(transport.responseText);if(json['Success'])
{this.deleted=true;this.refresh();}
var trash=BaseForm.getInstance().getTrash();trash.checkStatus();},undoDelete:function()
{this.setSaved(false);this.save();this.deleted=false;this.refresh();var trash=BaseForm.getInstance().getTrash();trash.checkStatus();},stripFormatting:function()
{var oldText=this.text;var newText=QualtricsCPTools.stripFormatting(oldText);if(oldText!=newText)
{this.text=newText;this.setSaved(false);}
var selectionTypes=['choices','answers','labels'];for(var s=0,slen=selectionTypes.length;s<slen;++s)
{if(this[selectionTypes[s]])
{for(var i=0,len=this[selectionTypes[s]].length;i<len;++i)
{var oldSelectionText=this[selectionTypes[s]][i].text;this[selectionTypes[s]][i].text=QualtricsCPTools.stripFormatting(oldSelectionText);if(this[selectionTypes[s]][i].text!=oldSelectionText)
{this.setSaved(false);}}}}
this.height=null;},restorePosition:function()
{if(QES_Global.suspendSelects)
{return;}
var pos=0;var blocksAndConjoints=Survey.getInstance().blocks;var realBlocks=[];for(var i=0,len=blocksAndConjoints.length;i<len;++i)
{if(blocksAndConjoints[i].type=='Standard'||blocksAndConjoints[i].type=='Default')
{realBlocks.push(blocksAndConjoints[i]);}}
if(realBlocks.length<1)
{var newBlock=addBlock({asynchronous:false});realBlocks.push(newBlock);}
var blockObj=realBlocks[realBlocks.length-1];if(this.restoreData&&this.restoreData.pos!=undefined)
{pos=this.restoreData.pos;var foundBlock=Survey.getInstance().getBlockByBlockId(this.restoreData.blockId);if(foundBlock)
{blockObj=foundBlock;}}
this.assignNewQuestionNumber();this.removeQuestionDOM();QuestionActions.moveToBlock(this,blockObj,pos);this.render();var dependants=this.getDisplayLogicDependents();if(dependants)
{Qualtrics.DisplayLogic.validateMultipleLogics(dependants);}
Qualtrics.savePage(false);this.frameQuestion();QuestionActions.select(this);Survey.getInstance().getTrash().checkStatus();}});Question.getInstance=BaseQuestion.getInstance;Question.getQuestionByQuestionId=BaseQuestion.getQuestionByQuestionId;Question.getQuestionById=BaseQuestion.getQuestionById;window.ExportTagEditor={maxlength:20,keyMap:{tab:'tab',shiftTab:'prev'},tabbing:false,tab:function(inlineEditor,evt,opt_backwards)
{this.tabbing=true;var topQuestion=QuestionActions.selectedRegistry[0];if(topQuestion)
{var action='getNext';if(opt_backwards)
{action='getPrev';}
var nextQuestion=topQuestion[action]('jumpblocks');if(nextQuestion)
{var nextNumberEl=$('QuestionNumber_'+nextQuestion.id);ExportTagEditor.editExportTag(nextQuestion,nextNumberEl);}}},edit:function(event,options)
{if(this.bindedParentObj.isLocked()==1)
{return false;}
QuestionActions.selectedRegistry[0].element.select('.QuestionNumber')[0].addClassName('editing-question-number');options=options||{};options.evt=event;var e=new inlineEditor(this,options);return e;},prev:function(inlineEditor,evt)
{ExportTagEditor.tab(inlineEditor,evt,true);},onType:function(inlineEditor)
{var topQuestion=QuestionActions.selectedRegistry[0];topQuestion.setEdited(1);ExportTagEditor.adjustEditHeight(inlineEditor);},onEmpty:function()
{},setEdited:function(v)
{QuestionActions.selectedRegistry[0].setEdited(v);},editExportTag:function(questionObj,labelEl)
{QuestionActions.select(questionObj);Editable.bindedEdit(labelEl,'Question.exportTag',questionObj.id,'ExportTagEditor');},afterEdit:function()
{if(!this.tabbing)
{var topQuestion=QuestionActions.selectedRegistry[0];if(topQuestion)
{topQuestion.refresh.bind(topQuestion).defer();topQuestion.element.select('.QuestionNumber')[0].removeClassName('editing-question-number');}}
this.tabbing=false;},adjustEditHeight:function(inlineEditor)
{var topQuestion=QuestionActions.selectedRegistry[0];if(topQuestion)
{var editorHeight=inlineEditor.cachedInner.getHeight();var editorWidth=inlineEditor.cachedInner.getWidth();var singleLineHeight=20;var widthBeforeOverflow=39;var checkboxHeight=12+3+3;var optionsButtonHeight=28+6;var minimumQuestionHeight=inlineEditor.element.getHeight()+optionsButtonHeight;if(editorWidth>widthBeforeOverflow)
{minimumQuestionHeight+=checkboxHeight;}
$(topQuestion.element).select('.SelectBorder')[0].setStyle({minHeight:minimumQuestionHeight+'px'});}}};window.QuestionActions={initTimer:null,selectedRegistry:new Array(),lastSelected:null,getDown:function(questionObj)
{return function(evt){QuestionActions.down(questionObj,evt);};},getUp:function(questionObj)
{return function(evt){QuestionActions.up(questionObj,evt);};},getOver:function(questionObj)
{return function(){QuestionActions.over(questionObj);};},getOut:function(questionObj)
{return function(){QuestionActions.out(questionObj);};},getContext:function(questionObj)
{return function(evt){evt=evt||window.event;QuestionActions.context(questionObj,evt);};},over:function(questionObj){if(!QES_Global.suspendOvers&&!QES_Global.preventFakeDragging)
{clearTimeout(QuestionActions.initTimer);if(!QES_Global.suspendOverBorders)
{AddOver(questionObj.element);}
window.QES_OverQuestion.questionObj=questionObj;updateCustomMousePos();}},out:function(questionObj)
{if(!QES_Global.suspendOvers&&!QES_Global.preventFakeDragging)
{if(QES_MouseOverWidgets)
{QuestionActions.delayedInitOverInfo();}
if(!QES_Global.suspendOverBorders)
{RemoveOver(questionObj.element);}}},up:function()
{if(document.onselectstart)
{document.onselectstart=null;}},context:function(questionObj,evt)
{Event.stop(evt);return false;},down:function(questionObj,event)
{if(!event)event=window.event;window.mousePos=getMousePosition(event);if(questionObj.isLocked())
{QES_Global.handleEditWhenSurveyLocked();return;}
var isCollapsed=questionObj.collapsed;if(questionObj.elementType=='Page Break')
{return;}
if(questionObj.parentObj&&questionObj.parentObj.type=='Trash')
{questionObj.parentObj.expandQuestion(questionObj.id);return;}
if(event.shiftKey&&event.ctrlKey||event.shiftKey&&event.metaKey)
{console.dir(questionObj);Event.stop(event);return;}
var clickedEl=Event.element(event);var isHtmlElement=true;if(clickedEl.raphael||clickedEl.nodeName=='svg'||clickedEl.nodeName=='vml')
{isHtmlElement=false;}
Toolbox.getInstance().deferredUpdatePosition();var multipleModifier=false;if(isHtmlElement&&$(clickedEl).hasClassName("yAxisBorder"))
{var segment=clickedEl.getAttribute('segment');QuestionActions.yAxisStartDrag(questionObj,segment);Event.stop(event);}
if(event&&event.ctrlKey||event.metaKey||event.shiftKey)
{multipleModifier=true;document.onselectstart=new Function('return false');Event.stop(event);}
if(event&&event.shiftKey)
{QuestionActions.multiSelect(questionObj,event);}
else
{QuestionActions.select(questionObj,event);}
var isWithinQuestionText;if(questionObj.questionTextDiv)
{Position.includeScrollOffsets=false;isWithinQuestionText=(Position.within(questionObj.questionTextDiv,mousePos[0],mousePos[1]));}
if(isHtmlElement&&$(clickedEl).hasAttribute('editablechild'))
{var realEditable=$(clickedEl).up('.Editable');if(realEditable)
{clickedEl=realEditable;}}
if(isWithinQuestionText&&!isCollapsed)
{var questionTextObj=questionObj.getQuestionTextObj();if(!multipleModifier)
{var editorObj=questionTextObj.edit(event,null,{lang:BaseForm.getInstance().defaultLanguage});if(editorObj)
{editorObj.skipAnEvent=1;}}}
else if(isHtmlElement&&$(clickedEl).hasClassName('Editable'))
{if($(clickedEl).hasClassName('QuestionText_Edit')){if(!multipleModifier)
{editorObj=questionTextObj.edit(event,null,{lang:BaseForm.getInstance().defaultLanguage});if(editorObj)
{editorObj.skipAnEvent=1;}}}
else
{if($(clickedEl).hasClassName('QuestionSpecificData'))
{var dataType=clickedEl.getAttribute('questionspecificdata');if(dataType)
{var dataObj=questionObj.questionSpecificData[dataType];editorObj=dataObj.edit(event);}
else
{var optionKey=clickedEl.getAttribute('optionkey');if(optionKey)
{var editable=new Editable(clickedEl,questionObj.options,optionKey,QuestionActions.getOptionEditor(questionObj,optionKey));editorObj=editable.edit();}}
if(editorObj)
{questionObj.setSaved(0);editorObj.skipAnEvent=1;}}
else
{var rootSelection=QualtricsTools.fastUp(clickedEl,'Selection');if(rootSelection){var id=rootSelection.id;var seriesIndex=null;if(clickedEl.getAttribute('seriesindex')!==null)
{seriesIndex=clickedEl.getAttribute('seriesindex');var underscorePos=id.indexOf('_');if(underscorePos!=-1)
{id=id.substring(0,underscorePos);}
else
{QES_Error('If there is a seriesIndex, it needs to be appeneded to the selection element id. So it can be targeted');rootSelection=null;return false;}}
if(!id)
{QES_Error('the Selection node needs a selection object id');return false;}
var objType=rootSelection.getAttribute('objtype');if(objType=='choiceGroup')
{var choiceGroup=questionObj.getChoiceGroupById(id);if(choiceGroup)
{editIt=BindedChoiceActions.down.bind(choiceGroup,event,seriesIndex);editIt();}}
else if(objType=='columnLabel'||$(clickedEl).hasClassName('ColumnLabel'))
{var columnLabel=questionObj.getColumnLabelById(id);if(columnLabel)
{columnLabel.edit(event,seriesIndex,{lang:BaseForm.getInstance().defaultLanguage});}
else
{QES_Error('cant get ColumnLabel by id: '+id);}}
else if($(clickedEl).hasClassName('Choice'))
{var choice=questionObj.getChoiceBySelectionId(id,true);if(choice)
{if(questionObj.skipLogicEditor)
{questionObj.skipLogicEditor.toggleSelectionItem(choice);return;}
var editIt=BindedChoiceActions.down.bind(choice,event,seriesIndex);editIt();}}
else if(objType=='Answer'||$(clickedEl).hasClassName('Answer'))
{var answer=questionObj.getAnswerBySelectionId(id);if(answer)
{if(questionObj.skipLogicEditor)
{questionObj.skipLogicEditor.toggleSelectionItem(answer);return;}
editIt=BindedChoiceActions.down.bind(answer,event,seriesIndex);editIt();}}
rootSelection=null;}
else
{QES_Error('the "Editable" node needs a parent "Selection" node with a selection object id');return false;}}}}
else
{if(!Event.isLeftClick(event)&&!event.altKey)
{if(Event.element(event).raphael)
return;QMenu.showMenu.curry(QuestionActions.buildChoiceMenu(questionObj.id),null,{mousePosition:true}).defer();Event.stop(event);}}
questionTextObj=null;clickedEl=null;event=null;questionObj=null;},getOptionEditor:function(questionObj,key)
{return{getText:function(seriesIndex,lang)
{return questionObj.options[key]||this.getInner(seriesIndex,lang).innerHTML;},afterEdit:function(inlineEditor)
{if(this.getInner(inlineEditor.seriesIndex,inlineEditor.lang))
{if(questionObj.options[key])
{this.getInner(inlineEditor.seriesIndex,inlineEditor.lang).innerHTML=questionObj.options[key];}}
QuestionTypes.Universal.makeDescendantsEditable(this.getInner(inlineEditor.seriesIndex,inlineEditor.lang));inlineEditor.updateEditorWidth();inlineEditor.checkPositionShift();}};},multiSelect:function(questionObj,event)
{if(QES_Global.suspendSelects)
{return false;}
var topQuestion=QuestionActions.selectedRegistry[0];if(topQuestion)
{var blockPos1=topQuestion.parentObj.getPosition();var questionPos1=topQuestion.getPosition();var blockPos2=questionObj.parentObj.getPosition();var questionPos2=questionObj.getPosition();if((blockPos1==blockPos2&&questionPos1>questionPos2)||(blockPos1>blockPos2))
{QuestionActions.selectQuestionRange(blockPos2,questionPos2,blockPos1,questionPos1);}
else
{QuestionActions.selectQuestionRange(blockPos1,questionPos1,blockPos2,questionPos2);}}},selectQuestionRange:function(startBlock,startQuestion,endBlock,endQuestion)
{if(QES_Global.suspendSelects)
{return false;}
var s=Survey.getInstance();for(var blockIndex=startBlock;blockIndex<=endBlock;++blockIndex)
{var block=s.blocks[blockIndex];for(var questionIndex=0,questionsLength=block.questions.length;questionIndex<questionsLength;++questionIndex)
{if(blockIndex==startBlock&&questionIndex==0)
{questionIndex=startQuestion;}
QuestionActions.select(block.questions[questionIndex],null,true,true,true);if(blockIndex==endBlock&&questionIndex==endQuestion)
{break;}}
Toolbox.getInstance().render();QuestionActions.updateIcons();}},select:function(questionObj,event,multipleSelections,selectOnly,suspendRender)
{if(questionObj.parentObj.type=='Trash')
{return;}
if(event&&Qualtrics.SearchAndReplace&&Qualtrics.SearchAndReplace.startedSearchAndReplace==true)
{Qualtrics.SearchAndReplace.currentBlock=BaseForm.getInstance().getBlockIndexByBlockId(questionObj.parentObj.blockId);Qualtrics.SearchAndReplace.currentQuestion=BaseForm.getInstance().getQuestionIndexByQuestionId(questionObj.parentObj,questionObj.id);Qualtrics.SearchAndReplace.currentChoice=0;Qualtrics.SearchAndReplace.currentAnswer=0;Qualtrics.SearchAndReplace.currentSearchQuestionResult=null;Qualtrics.SearchAndReplace.nextSearchStartPosition=0;Qualtrics.SearchAndReplace.currentMatchPosition=0;Qualtrics.SearchAndReplace.currentMatchExists=false;Qualtrics.SearchAndReplace.removeHighlightFromWord();}
if(QES_Global.suspendSelects)
{return false;}
if(!questionObj)
{QES_Error('no questionObj passed to select');return;}
var el=event?Event.element(event):null;if(el&&el.id==questionObj.id+'_checkbox')
{multipleSelections=true;}
if(!questionObj.parentObj.collapsed)
{QuestionActions.lastSelected=questionObj;if(multipleSelections||(event&&(event.ctrlKey||event.metaKey)))
{multipleSelections=true;if(questionObj.selected&&!selectOnly)
{QuestionActions.unselect(questionObj,{removeFromReg:true});Toolbox.getInstance().render();if(event)
{Event.stop(event);}
return;}}
if(!multipleSelections&&!questionObj.selected)
{QuestionActions.unselectAll();}
if(QuestionActions.selectedRegistry.length>1&&questionObj.selected&&!multipleSelections)
{QuestionActions.unselectAll();}
var wasSelected=Boolean(questionObj.selected);if(!questionObj.selected)
{questionObj.selected=1;QuestionActions.selectedRegistry.insertByPosition(questionObj);if(questionObj.collapsed&&!multipleSelections)
{questionObj.expand();}
if(!multipleSelections)
{QuestionActions.over(questionObj);clearOverRegistry();}}
if(questionObj.element)
{$(questionObj.element).removeClassName('NotSelected');$(questionObj.element).addClassName('Selected');if(QuestionActions.selectedRegistry.length>1)
{$(questionObj.element).addClassName('MultiSelected');}
var checkbox=$(questionObj.id+'_checkbox');if(checkbox)checkbox.checked='checked';checkbox=null;if(event&&(event.ctrlKey||event.metaKey))
{QuestionActions.updateIcons();}
if(!suspendRender)
{if(!wasSelected)
{QuestionActions.updateIcons();if(!questionObj.frameQuestion())
{if(!wasSelected)
{Toolbox.getInstance().deferredRender();}}}}
QuestionActions.createSelectConnector(questionObj);if(event&&multipleSelections)
{Event.stop(event);}}}},createSelectConnector:function(questionObj)
{if(!questionObj.selectConnector)
{questionObj.selectConnector=this.buildSelectConnector();var noteStatus=questionObj.noteStatus;if(noteStatus=='Expanded')
{questionObj.element.children[0].children[0].children[0].children[0].appendChild(questionObj.selectConnector);}
else
{questionObj.element.appendChild(questionObj.selectConnector);}}},buildSelectConnector:function()
{return QBuilder('div',{className:'Connector'},[QBuilder('div',{className:'ConnectorBorder'},[QBuilder('div',{className:'TopBorder'}),QBuilder('div',{className:'BottomBorder'})])]);},unselect:function(questionObj,options)
{if(QES_Global.suspendSelects)
{return false;}
if(options&&options.removeFromReg)
{for(var i=0,len=this.selectedRegistry.length;i<len;++i)
{var testq=this.selectedRegistry[i];if(testq.id==questionObj.id)
{this.selectedRegistry.splice(i,1);break;}}}
Toolbox.getInstance().removeToolbox();var questionEl=questionObj.element;if(questionEl)
{$(questionEl).removeClassName('Selected');$(questionEl).removeClassName('MultiSelected');$(questionEl).addClassName('NotSelected');if($(questionObj.id+'_checkbox'))
{$(questionObj.id+'_checkbox').checked=false;}
if(questionObj.selectConnector){removeElement(questionObj.selectConnector);questionObj.selectConnector=null;}
if(questionObj)
{questionObj.selected=0;var block=questionObj.parentObj;if(block.collapsedQuestionMode)
{questionObj.collapse();}}
if(questionObj.previewMode!=questionObj.parentObj.getDefaultPreviewMode())
{questionObj.previewMode=questionObj.parentObj.getDefaultPreviewMode();questionObj.refreshQuestion();}}
if(questionObj.skipLogicEditor)
{SkipLogic.exitSkipLogicEditMode(questionObj);}
if(questionObj.dynamicChoicesEditor)
{questionObj.exitDynamicChoices('choices');}
if(questionObj.dynamicAnswersEditor)
{questionObj.exitDynamicChoices('answers');}
var asynchronous=true;if(options&&options.asynchronous!=undefined)
{asynchronous=options.asynchronous;}
if(!questionObj.isSaved())
{questionObj.save({asynchronous:asynchronous});BaseForm.getInstance().checkForRepeatedScales(questionObj);}
this.checkForLoneSelectedPageBreaks();},checkForLoneSelectedPageBreaks:function()
{var hasQuestions=false;var hasPageBreaks=false;for(var i=0,len=this.selectedRegistry.length;i<len;++i)
{var testq=this.selectedRegistry[i];if(testq.elementType=='Question')
{hasQuestions=true;}
if(testq.elementType=='Page Break')
{hasPageBreaks=true;}}
if(hasPageBreaks&&!hasQuestions)
{for(i=0,len=this.selectedRegistry.length;i<len;++i)
{testq=this.selectedRegistry[i];testq.selected=0;}
this.selectedRegistry.length=0;QuestionActions.clearSelectedRegistry();}},updateConnectors:function()
{for(var i=0,len=this.selectedRegistry.length;i<len;++i)
{var questionObj=this.selectedRegistry[i];if(questionObj.selectConnector&&$(questionObj.selectConnector))
{questionObj.selectConnector.childNodes[0].style.border='1px solid white';questionObj.selectConnector.childNodes[0].style.border='none';}}},updateIcons:function()
{if(QES_OverQuestion.questionObj&&QES_OverQuestion.questionObj.objType=='Question'&&QES_OverQuestion.questionObj.element&&QES_OverQuestion.questionObj.parentObj.type!='Trash')
{var questionHeight=QES_OverQuestion.questionObj.getHeight();var questionY=QES_OverQuestion.questionObj.getTop();var topPos=null;var midPos=null;var bottomPos=null;topPos=questionY;midPos=questionY+(questionHeight/2);bottomPos=questionY+questionHeight;if($(QES_OverQuestion.questionObj.element))
{QuestionActions.clearIcons();QuestionActions.createIcons(QES_OverQuestion.questionObj,topPos,midPos,bottomPos);}}},delayedInitOverInfo:function()
{QuestionActions.initTimer=setTimeout(function(){window.QES_OverQuestion.init();QuestionActions.clearIcons();},500);},getSurveyLeft:function()
{return $('center')?$('center').offsetLeft:0;},createIcons:function(questionObj,topPos,midPos,bottomPos)
{if(questionObj.isLocked())
{return false;}
if(midPos)
{midPos=midPos-8;}
var surveyLeft=this.getSurveyLeft();if(QuestionActions.selectedRegistry.length<=1||!questionObj.selected)
{var questionRight=surveyLeft+questionObj.getWidth()+10;if(topPos)
{topPos=topPos-5;var topIcon=this.buildAddAboveButton(questionObj);document.body.appendChild(topIcon);$(topIcon).setStyle({top:topPos+'px',left:questionRight+'px'});topIcon.onmouseover=function(){QuestionActions.over(questionObj);};topIcon.onmouseout=function(){QuestionActions.out(questionObj);};topIcon=null;}
if(midPos)
{var removeIcon=this.buildRemoveButton(questionObj);$(removeIcon).setStyle({top:(midPos)+'px',left:questionRight+'px'});document.body.appendChild(removeIcon);removeIcon.onmouseover=function(){QuestionActions.over(questionObj);};removeIcon.onmouseout=function(){QuestionActions.out(questionObj);};removeIcon=null;}
if(bottomPos)
{bottomPos=bottomPos-14;var bottomIcon=this.buildAddBelowButton(questionObj);$(bottomIcon).setStyle({top:bottomPos+'px',left:questionRight+'px'});document.body.appendChild(bottomIcon);bottomIcon.onmouseover=function(){QuestionActions.over(questionObj);};bottomIcon.onmouseout=function(){QuestionActions.out(questionObj);};bottomIcon=null;}}
var moveTab=this.buildMoveButtons(questionObj);var moveTop=midPos-15;$(moveTab).setStyle({top:moveTop+'px',left:(surveyLeft+1)+'px'});document.body.appendChild(moveTab);moveTab.onmouseover=function(){QuestionActions.over(questionObj);};moveTab.onmouseout=function(){QuestionActions.out(questionObj);};},buildAddAboveButton:function(questionObj)
{this.addAboveButton=QBuilder('div',{id:'InsertAbove',title:'New Question Above',downcallback:'BaseQuestion.insertNewQuestionAbove:'+questionObj.id});return this.addAboveButton;},buildRemoveButton:function(questionObj)
{var tooltip='Remove Question';if(questionObj.elementType=='Page Break')
{tooltip='Remove Page Break';}
this.removeButton=QBuilder('div',{id:'RemoveQuestion',title:tooltip,clickcallback:'BaseQuestion.sendToTrash:'+questionObj.id});return this.removeButton;},buildAddBelowButton:function(questionObj)
{this.addBelowButton=QBuilder('div',{id:'InsertBelow',title:'New Question Below',downcallback:'BaseQuestion.insertNewQuestionBelow:'+questionObj.id});return this.addBelowButton;},buildMoveButtons:function(questionObj)
{var specialClass=(questionObj.elementType=='Page Break')?' PageBreakMove':'';this.moveButtons=QBuilder('div',{id:'MoveTab',className:specialClass},[QBuilder('div',{className:'TabCap'}),QBuilder('div',{className:'TabMiddle',downcallback:'BaseQuestion.moveClick:'+questionObj.id+'($evt)'},[QBuilder('div',{id:'UpButton',className:'UpButton',bubbleup:'true'}),QBuilder('div',{id:'DownButton',className:'DownButton',bubbleup:'true'})]),QBuilder('div',{className:'TabBase'})]);return this.moveButtons;},clearIcons:function(){var l=['addAboveButton','addBelowButton','removeButton','moveButtons'];for(var i=0,len=l.length;i<len;++i)
{var el=this[l[i]];if(el)
{el.onmouseover=null;el.onmouseout=null;removeElement(el);el=null;}
this[l[i]]=null;}},saveConjoints:function()
{var form=Survey.getInstance();if(!form.getPermission('editQuestions'))
{return false;}
for(var i=0,len=form.blocks.length;i<len;++i)
{var conjoint=form.blocks[i];if(conjoint.type=='Conjoint')
{if(!conjoint.saved)
{conjoint.save();}}}},saveQuestions:function(questions,options)
{var questionsRef=questions;questions=[];for(var i=0,len=questionsRef.length;i<len;++i)
{if(!questionsRef[i].isSaved()&&!questionsRef[i].isLocked())
{questions.push(questionsRef[i]);}}
var commands=[];if(!Survey.getInstance().getPermission('editQuestions'))
{return false;}
if(!questions.length)
{QuestionActions.afterSaveComplete(false);return false;}
msg(getMessage('EditSection','Saving'),'saving');var questionsToSave=[];for(i=0,len=questions.length;i<len;++i)
{if(!questions[i].saveInProgress)
{questionsToSave.push(questions[i]);}}
for(i=0,len=questionsToSave.length;i<len;++i)
{var questionObj=questionsToSave[i];questionObj.saveInProgress=true;questionObj.prepare();if(!QuestionTypes[questionObj.questionType])
{QES_Error('Cannot save. There is no entry for QuestionTypes.'+questionObj.questionType);continue;}
if(QuestionTypes[questionObj.questionType].readonly&&!(options&&options.forceSave))
{continue;}
var pkg=questionObj.exportData();var action='EditSectionSaveQuestion';if(questionObj.elementType=='Page Break')
{action='AddPageBreak';pkg['Position']=questionObj.getPosition();}
var params={QuestionPackage:Object.toJSON(pkg)};if(Survey.getInstance().mobileCompatibilityChecker)
{params.MobileCompatible=questionObj.checkMobileCompatibility(null);}
if(questionObj.savedSkipLogic===0)
{if(questionObj.skipLogic&&questionObj.skipLogic.length)
{for(i=0,len=questionObj.skipLogic.length;i<len;++i)
{questionObj.skipLogic[i]['QuestionID']=questionObj.questionId;}
params['SkipLogicPackage']=Object.toJSON({skipLogic:questionObj.skipLogic});}
else
{params['SkipLogicPackage']=null;}}
questionObj.cachedPipingOptions=null;var command={action:action,parameters:params};commands.push(command);}
if(!commands.length)
{QuestionActions.afterSaveComplete(false);return;}
var customOnComplete=null;if(options&&options.onComplete)
{customOnComplete=options.onComplete;}
var spellChecked=BaseForm.getInstance().getSurveyOption('SpellChecked');if(BaseForm.getInstance().isSpellCheckedOnServer&&!spellChecked)
{var spellCheckCommand={action:'SetSurveyOption',parameters:{option:'SpellChecked',value:spellChecked}};commands.push(spellCheckCommand);BaseForm.getInstance().isSpellCheckedOnServer=spellChecked;}
var asynchronous=true;if(options&&options.asynchronous!=undefined)
{asynchronous=options.asynchronous;}
var saveQuestionDate=new Date();if(BaseForm.getInstance().isEditingLibrarySurvey)
{for(var i=0;i<commands.length;i++)
{var command=commands[i];if(command.parameters)
{command.parameters['GenerateQuestionGUID']=true;}}}
params={};params['commands']=Object.toJSON(commands);params['SurveyID']=BaseForm.getInstance().id;new Ajax.Request('Ajax.php?action=executeMultiple',{method:'post',asynchronous:asynchronous,parameters:params,onFailure:this.handleSaveFail.curry(questionsToSave),onComplete:function(transport)
{try
{var response=transport.responseText.evalJSON();}
catch(e)
{console.error('bad save response');console.error(e);QuestionActions.handleSaveFail(questionsToSave);}
var multiResponse=response&&response['MultiResponse'];if(multiResponse)
{try
{if(multiResponse.length!=commands.length)
{throw('SyncError');}
var exception=false;for(var i=0,len=multiResponse.length;i<len;++i)
{try
{var multiQuestionObj=questionsToSave[i];if(multiQuestionObj)
{try
{multiQuestionObj.setSaved(true,saveQuestionDate);}
catch(e)
{msg(getMessage('EditSection','UnableToSetSavedTrue'));console.error("unable to setSaved to true");}
if(multiQuestionObj.savedSkipLogic===0)
{multiQuestionObj.savedSkipLogic=1;}
if(multiQuestionObj.elementType=='Question')
{var responseJSON=multiResponse[i];if(responseJSON['QuestionID'])
{multiQuestionObj.questionId=responseJSON['QuestionID'];}
multiQuestionObj.saveInProgress=false;var offlineAppPermission=(Qualtrics.User&&Qualtrics.User.offlineAppPermission==1);if(Survey.getInstance().mobileCompatibilityChecker&&offlineAppPermission&&responseJSON&&responseJSON.JSECompatibility)
{var message=null;if(responseJSON.JSECompatibility.Status!=='Compatible')
{message=responseJSON.JSECompatibility.Error;}
QES_Global.updateMobileCompatibilityIcon(multiQuestionObj,'offline',message);}
if(multiQuestionObj.questionId)
{BaseQuestion.questionIdMap[multiQuestionObj.questionId]=questionObj.id;}
else
{throw('Error! Could not be saved');}
if($('QuestionID_'+multiQuestionObj.id)){$('QuestionID_'+multiQuestionObj.id).innerHTML=multiQuestionObj.questionId;}}}}
catch(e)
{console.log("Unable to process",multiQuestionObj);console.error(e);msg(getMessage('EditSection','UnableToProcessSave'));exception=e;}}
if(exception)
throw exception;QuestionActions.afterSaveComplete(true);}
catch(e)
{if(e=='SyncError')
{console.error('Response Sync Error!',e);BaseForm.getInstance().selectedRegistry.length=0;BaseForm.getInstance().reload();}
else
{responseJSON=transport.responseText;if(responseJSON)
{if(!Q_FormHelpers.parseAjaxResponse(responseJSON))
{alert(e);}}}}}
else if(response&&response['Error'])
{if(response['ErrorCode']&&response['ErrorCode']=='ESRV93')
{Q_Window.closeAllWindows();alert(response['Error']);window.location.replace(window.location.href);return;}
alert(response['Error']);for(i=0,len=questionsToSave.length;i<len;++i)
{questionsToSave[i].setSaved(0);questionsToSave[i].saveInProgress=false;}}
if(customOnComplete)
{customOnComplete();}}});},saveNotes:function(notesList,options)
{options=options||{};var asynchronous=options.asynchronous||false;var commands=[];var baseForm=BaseForm.getInstance();for(var i=0,len=notesList.length;i<len;i++)
{var notes=notesList[i];var noteParams=notes.exportData();noteParams['SurveyID']=baseForm.id;noteParams['Note']=null;var command={action:'SetNoteSurveyElement',parameters:noteParams};commands.push(command);}
if(commands.length==0)
{return;}
var params={};params['commands']=Object.toJSON(commands);new Ajax.Request('Ajax.php?action=executeMultiple',{method:'post',asynchronous:asynchronous,parameters:params,onComplete:function(transport)
{try
{var response=transport.responseText.evalJSON();if(response&&response['MultiResponse'])
{var responses=response['MultiResponse'];for(var i=0,len=responses.length;i<len;i++)
{if(responses[i]['Error'])
{console.log(response[i]['Error']);throw('SaveError');}}}
QuestionActions.markSavedNotes(notesList);}
catch(e)
{console.error('bad save response');console.error(e);}}});},markSavedNotes:function(notesList)
{var baseForm=BaseForm.getInstance();for(var i=0,len=notesList.length;i<len;i++)
{var index=notesList[i].parentId;baseForm.notes[index].setSaved(1);}},afterSaveComplete:function(actionPerformed)
{if(Q_Window.getInstance('NetworkConnectivityDialog'))
{Q_Window.closeWindow('NetworkConnectivityDialog');}
if(actionPerformed)
{if(window.QES_Global)
{QES_Global.updateSurveySavedTime();}}},handleSaveFail:function(questions)
{Q_FormHelpers.showNetworkConnectivityDialog();for(var i=0,len=questions.length;i<len;++i)
{questions[i].setSaved(0);questions[i].saveInProgress=false;console.error('question save failed: '+questions[i].id);}},unselectAll:function()
{QuestionActions.clearSelectedRegistry();},clearSelectedRegistry:function()
{var notSavedList=[];for(var i=0,len=this.selectedRegistry.length;i<len;++i)
{var questionObj=this.selectedRegistry[i];if(questionObj.elementType=='Question')
{if(!questionObj.isSaved())
{notSavedList.push(questionObj);}}}
if(notSavedList.length)
{QuestionActions.saveQuestions(notSavedList,{asynchronous:true});}
for(i=0,len=this.selectedRegistry.length;i<len;++i)
{questionObj=this.selectedRegistry[i];QuestionActions.unselect(questionObj,{removeFromReg:false});}
this.selectedRegistry.length=0;Toolbox.getInstance().removeToolbox();Toolbox.getInstance().questionObj=null;return questionObj;},yAxisStartDrag:function(questionObj,segmentIndex)
{var pos=Position.cumulativeOffset(questionObj.element);if(pos)
{var leftOffset=pos[0]+97;if(leftOffset<0)
{leftOffset=0;}
window.dragCallBack=QuestionActions.yAxisDrag;window.dragCallBackOptions={questionObj:questionObj};if($(questionObj.id).down('.QuestionCanvas').getStyle('direction')=='rtl')
{window.dragCallBackOptions.rtl=true;leftOffset+=575;}
window.dragCallBackOptions.leftOffset=leftOffset;window.dragCallBackOptions.segmentIndex=segmentIndex;Event.observe(document,'mouseup',QuestionActions.yAxisEndDrag);document.onselectstart=new Function('return false');}},yAxisDrag:function(options)
{var questionObj=options.questionObj;var segmentIndex=options.segmentIndex;var rtl=options.rtl;if(segmentIndex!==null)
{var segmentBase=$('SegmentBase_'+questionObj.id+'_'+(segmentIndex));if(segmentBase)
{var segOffLeft=segmentBase.offsetLeft;var x=mousePos[0]-options.leftOffset-5;var canvasContainer=QualtricsTools.fastUp(segmentBase,'QuestionCanvasContainer');var table=QualtricsTools.fastUp(segmentBase,'ChoiceStructure');var scrollOffset=canvasContainer.scrollLeft;var width=(x-segOffLeft+scrollOffset);if(rtl)
{scrollOffset=canvasContainer.down().scrollLeft;width=segOffLeft-x+scrollOffset-table.getWidth();}
if(width<10)
{width=10;}
if(segmentIndex=='YAxis')
{var xWidth=600;var percent=(width/xWidth)*100;questionObj.choicesWidth=percent;questionObj.choicesWidthPixels=width;}
else
{var answerObj=questionObj.getAnswerByAnswerId(segmentIndex);if(answerObj)
{answerObj.meta.choicesWidthPixels=width;}}}}
else
{x=mousePos[0]-options.leftOffset;if(rtl)
x*=-1;if(x<10)
{x=10;}
xWidth=600;percent=(x/width)*100;questionObj.choicesWidth=percent;questionObj.choicesWidthPixels=x;}
questionObj.setEdited();QuestionActions.showColumnSeperatorDrag.curry(questionObj,mousePos[0]).limit(0.1,'bar');questionObj.refreshCanvas.bind(questionObj).limit(1,'refresh',true);},showColumnSeperatorDrag:function(questionObj,x)
{var dragBar=$('DragBar');if(!dragBar)
{dragBar=$('pageDiv').appendChild(QBuilder('div',{id:'DragBar'}));}
$(dragBar).setStyle({height:questionObj.getHeight()+'px',left:x+'px',top:questionObj.getTop()+'px'});},yAxisEndDrag:function()
{(function(){var dragBar=$('DragBar');if(dragBar)
{removeElement(dragBar);}}).delay(0.5);window.dragCallBackOptions.questionObj.refreshCanvas();window.dragCallBack=null;Event.stopObserving(document,'mouseup',QuestionActions.yAxisEndDrag);document.onselectstart=null;if(window.inlineEditor&&window.inlineEditor.getInstance())
{window.inlineEditor.getInstance().updateEditorWidth();window.inlineEditor.getInstance().updateEditorPosition();window.inlineEditor.getInstance().updateButtonPosition();}},transformQuestion:function(questionObj,type,opt_surveyLockedOverride)
{if(questionObj.isLocked()&&!opt_surveyLockedOverride)
{return false;}
var oldType=questionObj.questionType;if(QuestionTypes[oldType]&&QuestionTypes[oldType].beforeTransform)
{QuestionTypes[oldType].beforeTransform(questionObj,oldType,type);}
questionObj.gradingData=[];questionObj.cachedPipingOptions=null;questionObj.removeSkipLogic();questionObj.removeDefaultChoices();questionObj.options['validation']=null;questionObj.setEdited();questionObj.questionType=type;if(questionObj.getY())
{if(type=='DB')
{questionObj.choices=[];}
else if(questionObj.choices.length<1)
{questionObj.addChoice();questionObj.addChoice();questionObj.addChoice();}}
if(questionObj.getX())
{if(questionObj.answers.length<1)
{var defaultNumberOfAnswers=3;var override=QuestionTypes&&QuestionTypes[type]&&QuestionTypes[type]['DefaultNumberOfAnswers'];if(override)
{defaultNumberOfAnswers=override;}
for(var i=0;i<defaultNumberOfAnswers;++i)
{questionObj.addAnswer();}}
else{questionObj.answers=QuestionActions.filterOutNALabel(questionObj.answers);}}
if(oldType!=type)
{if(QuestionTypes[oldType]&&QuestionTypes[oldType].transformFrom)
{QuestionTypes[oldType].transformFrom(questionObj,type);}
if(QuestionTypes[type]&&QuestionTypes[type].transformTo)
{QuestionTypes[type].transformTo(questionObj,oldType);}}
questionObj.createQuestionOptions();if(questionObj.choices.length)
{var disallowsTE=(!questionObj.getY()||questionObj.getY().textEntry===false||(questionObj.questionType=='MC'&&!(questionObj.selector.startsWith('SA')||questionObj.selector.startsWith('MA')))||(questionObj.selector=='PGR'&&questionObj.selector!='DragAndDrop'));for(i=0;i<questionObj.choices.length;i++)
{if(questionObj.choices[i].meta&&(disallowsTE||!questionObj.choices[i].textEntry))
{questionObj.choices[i].meta.TextEntryForceResponse=null;questionObj.choices[i].meta.TextEntryValidation=null;}}}
if(QES_QuestionPreparer[type])
{QES_QuestionPreparer[type](questionObj,oldType);}
questionObj.setupDefaultSelections();QES_Global.refreshPreviewWindow(questionObj);return true;},transposeQuestion:function(questionObj)
{var choices=questionObj.choices.clone();var answers=questionObj.answers.clone();questionObj.answers.length=0;questionObj.choices.length=0;for(var i=0,len=choices.length;i<len;++i)
{var answer=questionObj.addAnswer(choices[i].text);answer.edited=choices[i].getEdited();answer.answerId=choices[i].choiceId;answer.auto=choices[i].auto;answer.isDefault=choices[i].isDefault;answer.assumed=choices[i].assumed;}
for(i=0,len=answers.length;i<len;++i)
{var choice=questionObj.addChoice(answers[i].text);choice.edited=answers[i].getEdited();choice.choiceId=answers[i].answerId;choice.auto=answers[i].auto;choice.isDefault=answers[i].isDefault;choice.assumed=answers[i].assumed;}
questionObj.nextChoiceId=questionObj.nextAnswerId;questionObj.nextAnswerId=questionObj.nextChoiceId;},syncSeriesWithAnswers:function(questionObj,listType,opt_defaultList)
{var masterList=opt_defaultList||questionObj.answers;for(var i=0,len=questionObj[listType].length;i<len;++i)
{var selection=questionObj[listType][i];if(selection)
{if(!selection.series)
{selection.series=[];for(var j=0,answerLen=masterList.length;j<answerLen;++j)
{var text="x";if(typeof masterList[j]=='string')
{text=masterList[j];}
else if(masterList[j].text)
{text=masterList[j].text;}
selection.series.push(text);}}
else
{if(selection.series.length!=masterList.length)
{selection.series.length=masterList.length;for(var j=0,seriesLen=selection.series.length;j<seriesLen;++j)
{if(selection.series[j]==undefined)
{text="x";if(typeof masterList[j]=='string')
{text=masterList[j];}
else if(masterList[j].text)
{text=masterList[j].text;}
selection.series[j]=text;}}}
for(j=0,seriesLen=selection.series.length;j<seriesLen;++j)
{if(selection.series[j]=="")
{selection.series[j]=" ";}}}}}},moveAndScroll:function(questions,delta,event,speed,clickedQuestion)
{var isFirefox=$('body').hasClassName('gecko');var selected=QuestionActions.selectedRegistry;var forceSingleMove=false;if(isFirefox)
{for(var i=0;i<selected.length;i++)
{if(selected[i].isSaved&&!selected[i].isSaved())
{forceSingleMove=true;break;}}}
if(!QuestionActions.suspendMove)
{if(questions.length>1)
{var target=null;var frontQuestion=null;var blockDelta=1;if(delta<0)
{frontQuestion=questions[0];blockDelta=-1;}
else
{frontQuestion=questions[questions.length-1];}
target=frontQuestion.getSibling(delta,true);if(!target)
{target=frontQuestion.parentObj.getSibling(blockDelta);}
if(!target)
{return;}}
var moved=false;QES_Global.suspendOvers=true;var undoMovePkg=[];for(var i=0,len=questions.length;i<len;++i)
{var pkg={id:questions[i].id,blockId:questions[i].parentObj.id,pos:questions[i].getPosition()};undoMovePkg.push(pkg);}
if(delta<0)
{for(var i=0,len=questions.length;i<len;++i)
{var result=QuestionActions.move(questions[i],delta,event);if(result==true)
{moved=result;}}}
else
{for(i=questions.length-1;i>-1;--i)
{result=QuestionActions.move(questions[i],delta,event);if(result==true)
{moved=result;}}}
if(moved)
{var redoMovePkg=[];for(var i=0,len=questions.length;i<len;++i)
{var pkg={id:questions[i].id,blockId:questions[i].parentObj.id,pos:questions[i].getPosition()};redoMovePkg.push(pkg);}
Qualtrics.History.getInstance().addAction('Move',{action:'QuestionActions.moveQuestionsToBlock',parameters:[undoMovePkg]},{action:'QuestionActions.moveQuestionsToBlock',parameters:[redoMovePkg]});MouseHold.set();QuestionActions.suspendMove=1;if(speed===undefined)
{speed=0.5;}
if(delta>0)
{var offset=clickedQuestion.getHeight()/2+5;}
else
{offset=clickedQuestion.getHeight()/2-10;}
AddOver(clickedQuestion.element);var options={};if(!forceSingleMove)
{options.onHold=QuestionActions.moveAndScroll;}
QuestionActions.scrollTo(clickedQuestion,questions,offset,event,speed,delta,options);Toolbox.getInstance().deferredUpdatePosition();}}
else
{QES_Global.suspendOvers=false;}},scrollTo:function(questionObj,movedQuestions,offset,event,speed,delta,options)
{QuestionActions.suspendScroll=1;if(speed===undefined)
{speed=0.3;}
if(speed<0.1)
{speed=0;}
var scrollInfo=getScrollInfo();var windowMouseY=mousePos[1]-scrollInfo[1];var oldY=mousePos[1];QES_OverQuestion.suspend=true;var fakeEvent={clientY:event.pageY||event.clientY,clientX:event.pageX||event.clientX};QES_Global.stopScrolling();QES_Global.scroller=new Effect.ScrollTo(questionObj.element,{offset:0-(windowMouseY-offset),duration:speed,afterFinish:function(effect){var forcedPageY=oldY+effect.fromToDelta;QES_OverQuestion.questionObj=questionObj;updateMousePos(fakeEvent,forcedPageY);scrollInfo=getScrollInfo();QES_OverQuestion.suspend=false;QuestionActions.suspendMove=0;QES_Global.suspendOvers=false;if(MouseHold.get())
{if(options&&options.onHold)
{options.onHold(movedQuestions,delta,fakeEvent,speed/1.25,questionObj);}}}});},move:function(questionObj,delta)
{QES_Global.saveSurvey(false,true,true);var hasSkipLogic=(questionObj.skipLogic||questionObj.skipMarker||false);if(hasSkipLogic&&hasSkipLogic.length>0){hasSkipLogic=true;}
else
{hasSkipLogic=false;}
if(!Survey.getInstance().getPermission('editQuestions'))
{return;}
QES_OverQuestion.suspend=true;var target=questionObj.getSibling(delta,true);var locked=questionObj.isLocked()||target&&target.isLocked();if(!locked)
{var pos=questionObj.getPosition();var moved=0;var oldBlock=questionObj.parentObj;if(!questionObj.tmpMoveData)
{questionObj.tmpMoveData={oldBID:oldBlock.blockId,oldPos:pos};}
if(target)
{var targetPos=target.getPosition();var differentBlock=(questionObj.parentObj.id!=target.parentObj.id);if(!hasSkipLogic||(hasSkipLogic&&!differentBlock))
{if(delta==-1&&differentBlock)
{targetPos++;}
questionObj.parentObj.questions.splice(pos,1);target.parentObj.questions.splice(targetPos,0,questionObj);questionObj.parentObj=target.parentObj;moved=1;}}
else if(!hasSkipLogic)
{var emptyBlock=null;if(delta>0)
{emptyBlock=questionObj.parentObj.getSibling(1,true);}
else if(delta<0)
{emptyBlock=questionObj.parentObj.getSibling(-1,true);}
if(emptyBlock&&emptyBlock.questions.length===0)
{questionObj.parentObj.questions.splice(pos,1);emptyBlock.questions.splice(targetPos,0,questionObj);questionObj.parentObj=emptyBlock;moved=1;}}
if(moved)
{questionObj.tmpMoveData.newPos=questionObj.getPosition();questionObj.refreshQuestion();oldBlock.checkForEmptyBlock();questionObj.parentObj.checkForEmptyBlock();QuestionActions.over(questionObj);QuestionTopCache={};QuestionActions.updateIcons(questionObj);QuestionActions.addToMoveQueue(questionObj);QuestionActions.startMoveTimer();return true;}
else if(hasSkipLogic)
{msg(getMessage('EditSection','CannotMoveQuestionWithSkipLogicToNewBlock'));}}
else
{QES_Global.handleEditWhenSurveyLocked();}
var bump=-15;if(delta>0)
{bump=0-bump;}
new Effect.Move(questionObj.element,{y:bump,duration:0.0,afterFinish:function(){new Effect.Move(questionObj.element,{y:0-bump,duration:0.2,afterFinish:function(){$(questionObj.element).setStyle({left:'',top:''});}});}});QES_OverQuestion.suspend=false;QES_Global.suspendOvers=false;return false;},moveQueue:new Array(),moveTimer:null,addToMoveQueue:function(questionObj)
{var spliced=false;for(var i=0,len=QuestionActions.moveQueue.length;i<len;++i)
{var q=QuestionActions.moveQueue[i];if(q.id===questionObj.id)
{var removed=QuestionActions.moveQueue.splice(i,1);QuestionActions.moveQueue.push(removed[0]);spliced=true;}}
if(!spliced)
{QuestionActions.moveQueue.push(questionObj);}},startMoveTimer:function()
{if(QuestionActions.moveTimer)
{QuestionActions.moveTimer.stop();}
QuestionActions.moveTimer=new PeriodicalExecuter(function(pe){QuestionActions.executeMoves();pe.stop();},5);},executeMoves:function(options)
{var asynchronous=true;if(options&&options.asynchronous!=undefined)
{asynchronous=options.asynchronous;}
if(QuestionActions.moveQueue.length)
{var pkg=[];for(var i=0,len=QuestionActions.moveQueue.length;i<len;++i)
{var questionObj=QuestionActions.moveQueue[i];if(!questionObj.questionId&&questionObj.elementType!='Page Break')
{continue;}
var pos=questionObj.getPosition();if(!pos&&pos!==0)
{pos=questionObj.tmpMoveData['lastPos'];}
if(questionObj.tmpMoveData['newPos']!=undefined)
{pos=questionObj.tmpMoveData['newPos'];}
var surveyId=BaseForm.getInstance().id;pkg.push({action:'MoveQuestion',parameters:{SurveyID:surveyId,debug:questionObj.text,BID:questionObj.parentObj.blockId,QID:questionObj.questionId,pos:pos,oldBID:questionObj.tmpMoveData['oldBID'],oldPos:questionObj.tmpMoveData['oldPos']}});}
var message=options&&options.msg;if(message===undefined)
{message=getMessage('EditSection','MovingQuestions');}
msg(message,'move');var action='ExecuteMultiple';if(options&&options.batchMove)
{action='MoveMultiple';}
for(i=0,len=QuestionActions.moveQueue.length;i<len;++i)
{questionObj=QuestionActions.moveQueue[i];if(questionObj.tmpMoveData)
{questionObj.tmpMoveData=null;}}
QuestionActions.moveTimer=null;QuestionActions.moveQueue.length=0;surveyId=BaseForm.getInstance().id;new Ajax.Request('Ajax.php?action='+action,{method:'post',asynchronous:asynchronous,parameters:{commands:Object.toJSON(pkg),SurveyID:surveyId},onComplete:function(transport)
{Q_FormHelpers.parseAjaxResponse(transport);}});}},moveToBlock:function(questionObj,newBlock,newPos)
{if(questionObj.isLocked()||newBlock.locked)
{QES_Global.handleEditWhenSurveyLocked();return;}
var oldBlock=questionObj.parentObj;var pos=questionObj.getPosition();if(!questionObj.tmpMoveData)
{questionObj.tmpMoveData={oldBID:oldBlock.blockId,oldPos:pos};}
questionObj.parentObj.questions.splice(pos,1);if(newPos===undefined)
{newPos=newBlock.questions.length;}
newBlock.questions.splice(newPos,0,questionObj);questionObj.parentObj=newBlock;questionObj.tmpMoveData['newPos']=questionObj.getPosition();QuestionActions.addToMoveQueue(questionObj);oldBlock.checkForEmptyBlock();},moveQuestionsToBlock:function(questionsData)
{for(var i=0,len=questionsData.length;i<len;++i)
{var q=BaseQuestion.getInstance(questionsData[i].id);var b=BaseBlock.getInstance(questionsData[i].blockId);QuestionActions.moveToBlock(q,b,questionsData[i].pos);q.refreshQuestion();}},getSelectedTop:function()
{var topMost=10000000;for(var i=0,len=this.selectedRegistry.length;i<len;++i)
{var q=this.selectedRegistry[i];var top=q.getTop();if(top<topMost)
{topMost=top;}}
return topMost;},getSelectedBottom:function()
{var bottomMost=null;var bottomMostTop=0;for(var i=0,len=this.selectedRegistry.length;i<len;++i)
{var q=this.selectedRegistry[i];var top=q.getTop();if(top>bottomMostTop)
{bottomMostTop=top;bottomMost=q;}}
if(bottomMost)
{var bottom=bottomMost.getBottom();return bottom;}},getSelectedHeight:function()
{var top=QuestionActions.getSelectedTop();var bottom=QuestionActions.getSelectedBottom();return bottom-top;},saveDynamicChoices:function(questionObj,listType)
{var capType=listType.capitalize();var editorName='dynamic'+capType+'Editor';if(questionObj[editorName])
{var selectionType=questionObj[editorName].selectionType;var exported=questionObj[editorName].exportData();if(exported)
{questionObj['dynamic'+selectionType.capitalize()]=exported;}}},filterPipingOptions:function(pipingOptions,filterType)
{if(filterType=='SkipLogic')
{var validPipingType={'ChoiceNumericEntryValue':1,'ChoiceTextEntryValue':1,'SelectableChoice':1,'SelectableAnswer':1,'SelectedAnswerCount':1,'SelectedChoicesCount':1,'ChoiceDisplayed':1,'DisplayableChoice':1,'DisplayableQuestion':1,'Region':1,'UploadedFile':1,'UploadedFileSize':1,'UploadedFileType':1};}
else if(filterType=='ChoiceGroup')
{validPipingType={'ChoiceGroup':1};}
var validPipingOptions=[];if(pipingOptions)
{for(var i=0,len=pipingOptions.length;i<len;++i)
{var opt=pipingOptions[i];if(validPipingType[opt['Type']])
{validPipingOptions.push(opt);}}}
return validPipingOptions;},skipLogicClick:function(qid,skipLogicIndex)
{var questionObj=Question.getQuestionById(qid);if(questionObj)
{if(questionObj.isLocked())
{QES_Global.handleEditWhenSurveyLocked();return false;}
if(!questionObj.isSaved())
{questionObj.save({asynchronous:false});}
var skipLogic=questionObj.skipLogic[skipLogicIndex];var useResponseID=QBuilder('input',{type:'checkbox',name:'ResponseIDChecked',id:'ResponseIDChecked'});var responseIDInput=QBuilder('input',{type:'text',name:'ResponseID',id:'ResponseID'});var rIndex;var responseDiv='';if((rIndex=skipLogic.Locator.indexOf('?r='))!=-1)
{useResponseID.checked=true;responseIDInput.value=skipLogic.Locator.substr(rIndex+3);responseDiv=QBuilder('div',{id:'PrevRespDiv'},[useResponseID,QBuilder('label',{htmlFor:'IncludeQuota'},'Include Quota'),responseIDInput]);}
SkipLogic.quotaMenu=Qualtrics.Menu.buildMenuButton('Select a Quota...','SkipLogic.buildQuotaMenu',{});var quotaIDInput=QBuilder('input',{type:'hidden',name:'QuotaID',id:'QuotaID'});var useQuotaInput=QBuilder('input',{type:'checkbox',name:'IncludeQuota',id:'IncludeQuota',onclick:'$(\'Quota\').toggle()'});var quotaDiv=QBuilder('div',{style:'display:none',id:'Quota'},[SkipLogic.quotaMenu,quotaIDInput]);if(skipLogic.IncludeQuota&&skipLogic.IncludeQuota=='Yes')
{useQuotaInput.checked=true;$(quotaIDInput).value=skipLogic.QuotaLogic.QuotaID;new Ajax.Request('Ajax.php?action=GetQuotaDefinition',{parameters:{QOID:skipLogic.QuotaLogic.QuotaID},onComplete:function(transport)
{var quotaDef=Qualtrics.parseJSON(transport.responseText);SkipLogic.quotaMenu.callbackNode.innerHTML=quotaDef.Name;$(quotaDiv).show();}});}
var popup=new Q_Window({id:'SkipLogicAdvancedPopUp',title:getMessage('EditSection','SkipLogicAdvancedOptTitle'),closeButton:true,buttons:[{icon:'cancel',text:getMessage('SiteWide','Cancel'),click:'Q_Window.closeWindow(SkipLogicAdvancedPopUp)',className:'negative',align:'right'},{icon:'check',text:getMessage('SiteWide','Save'),click:'SkipLogic.saveAdvancedOptions('+qid+', '+skipLogicIndex+')',className:'positive',align:'right'}]});var content=QBuilder('div',{className:'AdvancedQL'},[responseDiv,QBuilder('div',{},[useQuotaInput,QBuilder('label',{htmlFor:'IncludeQuota'},getMessage('EditSection','IncludeQuota')),quotaDiv])]);popup.setContent(content);popup.center();return false;}},highlightValidation:function(id)
{(function(){var f=$('fieldSet_validation');var fVal=$('validation_None');var f2=$('fieldSet_ForceResponse');var f2Val=$('ForceResponse_CheckBox');var f3=$('fieldSet_CSOptions');var f3Val=$('EnforceRange_CheckBox');if(f&&!(fVal.getAttribute('checked')=='checked'))
{new Effect.Highlight(f,{startcolor:'#ff0000',endcolor:'#E6ECF5',restorecolor:'#E6ECF5'});}
if(f2&&f2Val.getAttribute('checked')=='checked')
{new Effect.Highlight(f2,{startcolor:'#ff0000',endcolor:'#E6ECF5',restorecolor:'#E6ECF5'});}
if(f3&&f3Val.getAttribute('checked')=='checked')
{new Effect.Highlight(f3,{startcolor:'#ff0000',endcolor:'#E6ECF5',restorecolor:'#E6ECF5'});}
var questionObj=Question.getQuestionById(id);if(questionObj.choices)
{for(var i=0;i<questionObj.choices.length;i++)
{if(!questionObj.choices[i].meta)
continue;if(questionObj.choices[i].meta.TextEntryValidation||questionObj.choices[i].meta.TextEntryForceResponse)
new Effect.Highlight($(questionObj.choices[i].id),{startcolor:'#ff0000',endcolor:'#E6ECF5',restorecolor:'transparent'});}}
if(questionObj.answers)
{for(i=0;i<questionObj.answers.length;i++)
{if(!questionObj.answers[i].meta)
continue;var valSettings=(questionObj.answers[i].meta.Validation&&questionObj.answers[i].meta.Validation.Settings)||{};if(valSettings.Type&&valSettings.Type!='None'||valSettings.ForceResponse&&valSettings.ForceResponse=='ON')
new Effect.Highlight($(questionObj.answers[i].id),{startcolor:'#ff0000',endcolor:'#E6ECF5',restorecolor:'transparent'});}}}).defer();},buildChoiceMenu:function(questionId)
{var questionObj=Question.getQuestionById(questionId);var choicesDef=questionObj.getY();var answersDef=questionObj.getX();var hasRecode=questionObj.hasRecodeValueOptions();var hasRandom=questionObj.hasRandomizationOptions();var hasAdvanced=questionObj.hasMoreAdvancedOptions()&&Qualtrics.System.productName=='ControlPanel';var hasScoring=(questionObj.showInlineScoring&&questionObj.showInlineScoring());var showDefaultChoicesMenu=false;if(QuestionTypes[questionObj.questionType])
{if(QuestionTypes[questionObj.questionType].showDefaultChoicesMenu)
showDefaultChoicesMenu=QuestionTypes[questionObj.questionType].showDefaultChoicesMenu(questionObj);else if(QuestionTypes[questionObj.questionType]&&QuestionTypes[questionObj.questionType].saveDefaultChoices)
showDefaultChoicesMenu=true;}
var canCarryForwardChoices=questionObj.canCarryForward('choices');var canCarryForwardAnswers=questionObj.canCarryForward('answers');var skipLogicMenuItem=null;var carryForwardChoices='';var carryForwardAnswers='';if(canCarryForwardChoices)
{carryForwardChoices={className:'CarryForwardMenuItem',display:getMessage('CarryForward')+' '+strToPlural(choicesDef['label'])+'...',action:'BaseQuestion.addDynamicChoices:'+questionObj.id+'(choices)'};}
else if(questionObj.getAxis('choices'))
{carryForwardChoices={className:'CarryForwardMenuItem Disabled',display:getMessage('CarryForward')+' '+strToPlural(choicesDef['label'])+'...'};}
if(canCarryForwardAnswers)
{carryForwardAnswers={className:'CarryForwardMenuItem',display:getMessage('CarryForward')+' '+strToPlural(answersDef['label'])+'...',action:'BaseQuestion.addDynamicChoices:'+questionObj.id+'(answers)'};}
else if(questionObj.getAxis('answers'))
{carryForwardAnswers={className:'CarryForwardMenuItem Disabled',display:getMessage('CarryForward')+' '+strToPlural(answersDef['label'])+'...'};}
var showRandomAnswers=(answersDef&&hasRandom&&questionObj.selector!='Profile'&&questionObj.selector!='Bipolar'&&questionObj.selector!='SBSMatrix'&&questionObj.selector!='HSLIDER'&&questionObj.selector!='HBAR'&&questionObj.questionType!='Slider');if(questionObj.hasInPageDisplayLogic())
{skipLogicMenuItem={className:'SkipLogicMenuItem Disabled',display:getMessage('EditSection','AddSkipLogic')+'...'};}
else
{skipLogicMenuItem={className:'SkipLogicMenuItem',action:'Question.addSkipLogic:'+questionObj.id,display:getMessage('EditSection','AddSkipLogic')+'...'};}
var scoringOptions=null;if(hasScoring)
{scoringOptions={className:'ScoringOptionsMenuItem',display:getMessage('EditThreeSixtySection','Scoring'),submenu:'Question.buildScoringSubMenu:'+questionObj.id};}
var javascriptMenuItem={className:'JavascriptMenuItem',action:'Question.addJavascript:'+questionObj.id,display:getMessage('EditSection','AddJavascript')+'...'};if(!Survey.getInstance().getPermission('allowJavaScript',true))
javascriptMenuItem=null;var notesMenuItem={className:'NotesMenuItem',action:'Question.addNotes:'+questionObj.id,display:getMessage('EditSection','AddNote')+'...'};var menuDef={className:'ChoiceOptionsMenu',items:[{className:'DisplayLogicMenuItem',action:'Question.addDisplayLogic:'+questionObj.id+'(null,1)',display:getMessage('EditSection','AddDisplayLogic')+'...'},carryForwardChoices,carryForwardAnswers,skipLogicMenuItem,javascriptMenuItem,(showDefaultChoicesMenu)?{className:'DefaultChoicesMenuItem',action:'Question.handleDefaultChoices:'+questionObj.id,display:getMessage('EditSection','DefaultChoices')+'...'}:null,notesMenuItem,(hasScoring)?{separator:1}:null,scoringOptions,(hasRecode||hasRandom||hasAdvanced)?{separator:1}:null,(hasRecode)?{action:'Question.openRecodeValues:'+questionObj.id,display:getMessage('EditSection','RecodeValues')+'...'}:null,(hasRandom)?{action:'Question.openChoiceRandomization:'+questionObj.id,display:getMessage('QuestionOptions','Rand')+'...'}:null,(showRandomAnswers)?{action:'Question.openAnswerRandomization:'+questionObj.id,display:getMessage('QuestionOptions','RandAnswers')+'...'}:null,(hasAdvanced)?{action:'Question.advancedOptions:'+questionObj.id,display:getMessage('EditSection','MoreAdvancedOptions')+'...'}:null,choicesDef.useGroups?{action:'QuestionActions.addChoiceGroup('+questionObj.id+')',display:getMessage('EditSection','AddChoiceGroup')}:'']};if(BaseForm.getInstance().revisionId)
{var disabled=' Disabled';for(var i in menuDef.items)
{if(menuDef.items[i])
{if(menuDef.items[i].className)
{menuDef.items[i].className+=disabled;}
else
{menuDef.items[i].className=disabled;}}}}
return menuDef;},addChoiceGroup:function(questionId)
{var questionObj=Question.getQuestionById(questionId);if(questionObj)
{questionObj.createNewChoiceGroup();questionObj.refreshCanvas();}},getCarryForwardDependencies:function(questionId)
{if(questionId)
{var allDepenencies=Survey.getInstance().carryForwardDependencies;if(allDepenencies)
{var dependsOnThisList=allDepenencies[questionId];if(dependsOnThisList)
{return dependsOnThisList;}}}
return null;},refreshDependencies:function(questionId,opt_resetStack)
{if(questionId)
{if(opt_resetStack!==false)
{QES_Global.carryForwardDependencyStack={};}
var dependsOnThisList=QuestionActions.getCarryForwardDependencies(questionId);if(dependsOnThisList)
{for(qid in dependsOnThisList)
{if(!QES_Global.carryForwardDependencyStack[qid])
{QES_Global.carryForwardDependencyStack[qid]=1;var questionObj=dependsOnThisList[qid];if(questionObj)
{if(qid!=questionId)
{questionObj.refreshCanvas();questionObj.refreshDependencies(false);}}}}}
var editedQuestion=Question.getQuestionByQuestionId(questionId);if(editedQuestion.hasSkipLogic()&&editedQuestion.refreshSkipLogic)
{editedQuestion.refreshSkipLogic();editedQuestion.savedSkipLogic=0;}}},restoreQuestion:function(questionId,restorePkg)
{if(restorePkg)
{var questionDef=restorePkg['def'];var blockId=restorePkg['blockId'];var pos=restorePkg['pos'];if(questionDef)
{var questionObj=Question.getQuestionById(questionId);if(questionObj)
{if(questionObj.isLocked())
{QES_Global.handleEditWhenSurveyLocked();return false;}
questionObj.generate({QuestionDefinition:questionDef});questionObj.unpackage();questionObj.setSaved(false);questionObj.refreshCanvas();var dependants=questionObj.getDisplayLogicDependents();if(dependants)
{Qualtrics.DisplayLogic.validateMultipleLogics(dependants);}}
else
{}}}},filterOutNALabel:function(answers){var newAnswers=[];for(var i=0;i<answers.length;i++){if(answers[i].answerId&&answers[i].answerId!=='NA'){newAnswers.push(answers[i]);}}
return newAnswers;}};QuestionActions.selectedRegistry.insertByPosition=function(questionObj)
{if(QuestionActions.selectedRegistry.length==0)
{QuestionActions.selectedRegistry.push(questionObj);return;}
var pos=questionObj.getPosition();var blockPos=questionObj.parentObj.getPosition();var insertedIntoMiddle=false;for(var i=0,len=QuestionActions.selectedRegistry.length;i<len;++i)
{var q=QuestionActions.selectedRegistry[i];var checkQuestionPos=q.getPosition();var checkBlockPos=q.parentObj.getPosition();if((checkQuestionPos>pos&&checkBlockPos==blockPos)||checkBlockPos>blockPos)
{QuestionActions.selectedRegistry.splice(i,0,questionObj);insertedIntoMiddle=true;break;}}
if(!insertedIntoMiddle)
{QuestionActions.selectedRegistry.push(questionObj);}};QuestionActions.selectedRegistry.sortByPosition=function()
{var list=QuestionActions.selectedRegistry;for(var x=0,len=list.length;x<len;++x)
{for(var y=0,ylen=list.length-1;y<ylen;y++)
{if(list[y].getPosition()>list[y+1].getPosition())
{var holder=list[y+1];list[y+1]=list[y];list[y]=holder;}}}
var i;for(var i=0,len=QuestionActions.selectedRegistry.length;i<len;++i)
{var q=QuestionActions.selectedRegistry[i];var p=q.getPosition();var bp=q.parentObj.getPosition();}};BaseSelection.getInstance=function(id)
{if(QuestionActions.selectedRegistry.length)
{for(var i=0,len=QuestionActions.selectedRegistry.length;i<len;++i)
{var sel=QuestionActions.selectedRegistry[i].getSelectionById('choices',id);if(sel)return sel;sel=QuestionActions.selectedRegistry[i].getSelectionById('answers',id);if(sel)return sel;sel=QuestionActions.selectedRegistry[i].getSelectionById('columnLabels',id);if(sel)return sel;}}};window.BindedChoiceActions={down:function(event,seriesIndex){this.parentObj.skipAutoEdit=1;if(this.proxie)
{if(seriesIndex===undefined||seriesIndex===null)
{return;}}
if(!Event.isLeftClick(event))
{if(event.altKey)
{return;}
var that=this;QMenu.showMenu.curry(that.buildMenu.bind(that),Event.element(event),{mousePosition:true}).defer();Event.stop(event);return;}
if(Event.element(event).getAttribute('selectionimage'))
{var that=this;(function(){QMenu.showMenu(that.buildMenu.bind(that),Event.element(event),{mousePosition:true,menuWidth:100});}).defer();return;}
var lang=BaseForm.getInstance().defaultLanguage;var editorObj=this.edit(event,seriesIndex,{lang:lang});if(editorObj)
{editorObj.skipAnEvent=1;}}};window.Toolbox=Class.create();Toolbox.toolboxVerticalHold=null;Toolbox._instance=null;Toolbox.getInstance=function()
{if(Toolbox._instance==null)
{Toolbox._instance=new Toolbox();}
return Toolbox._instance;};Toolbox.deferredRender=function()
{Toolbox.getInstance().deferredRender();};Toolbox.prototype={id:'QES_toolbox',element:null,questionObj:null,height:null,top:null,questionTypeButton:null,editMultipleBox:null,previewQuestionObj:null,initialize:function(id)
{},holdPosition:function(bool)
{if(bool)
{Toolbox.toolboxVerticalHold=this.top;}
else
{Toolbox.toolboxVerticalHold=null;}},removeToolbox:function()
{if(this.element)
{if(this.formObservers)
{while(this.formObservers.length)
{var formObserver=this.formObservers.pop();if(formObserver&&formObserver.stop)
{formObserver.stop();}}}
var el=this.element;this.element=null;el.onmouseover=null;el.onmouseout=null;el.onclick=null;if(this.mouseEnterCache)
{Event.stopObserving(el,'mouseenter',this.mouseEnterCache);Event.removeFromCache(el,'mouseenter',this.mouseEnterCache);}
if(this.mouseLeaveCache)
{Event.stopObserving(el,'mouseleave',this.mouseLeaveCache);Event.removeFromCache(el,'mouseleave',this.mouseLeaveCache);}
this.height=null;Toolbox.lastTop=this.top;this.top=null;removeElement(el);el=null;}},deferredRender:function()
{this.render.bind(this).defer();},checkDependsOn:function(option)
{if(option['dependsOn'])
{for(var i=0,len=option['dependsOn'].length;i<len;++i)
{var optionAnswerPair=option['dependsOn'][i];var matched=true;for(var key in optionAnswerPair)
{var matchingOption=this.questionObj.getOptions()[key];if(matchingOption!=optionAnswerPair[key])
{matched=false;break;}}
if(matched)return matched;}
return false;}
return true;},buildSection:function(sectionDef,sectionName)
{if(!sectionName||!sectionDef)
{console.error('Cannot build section no section name / section def');return false;}
var frag=document.createDocumentFragment();var questionType=this.questionObj.questionType;var selectedOption=(this.questionObj&&this.questionObj.options&&this.questionObj.options[sectionName]);if(sectionDef.type=='CheckBox')
{if(!this.checkDependsOn(sectionDef)){return QBuilder('span');}
var inputType='checkbox';var optionNameDisplay=sectionDef['subLabel']||sectionDef['label']||'';var offValue='',onValue='';if(sectionDef['options'])
{var offValue=sectionDef['options']['OFF']['value'];var onValue=sectionDef['options']['ON']['value'];}
if(this.getCheckBoxState(questionType,sectionName,selectedOption))
{var optionDef=sectionDef['options']['ON'];var input=QBuilder('input',{className:'Checkbox',checked:'checked',controltype:'QuestionOption',type:inputType,name:sectionName,id:sectionName+'_CheckBox',value:onValue});}
else
{if(sectionDef.deprecated){return frag;}
optionDef=sectionDef['options']['OFF'];input=QBuilder('input',{type:inputType,controltype:'QuestionOption',name:sectionName,id:sectionName+'_CheckBox',value:offValue});}
if(optionDef&&optionDef.linkedSections)
{for(var i=0,len=optionDef.linkedSections.length;i<len;++i)
{var linkedSection=optionDef.linkedSections[i];this.fulfilledDependancies.push(linkedSection);}}
if(sectionDef.onChangeAction)
{input.setAttribute('toolboxclickcallback',sectionDef.onChangeAction);}
var label=QBuilder('label',{htmlFor:sectionName+'_CheckBox'},optionNameDisplay);if(optionNameDisplay.startsWith('$option'))
{var parsedOption=optionNameDisplay.substring(optionNameDisplay.indexOf('.')+1);label=this.buildSection(QuestionTypes[questionType].questionOptions.sections[parsedOption],parsedOption);}
frag.appendChild(input);frag.appendChild(label);input=null;label=null;return frag;}
else if(sectionDef.type=='Menu')
{var initialValue;if(this.questionObj.options[sectionName])
{initialValue=this.questionObj.options[sectionName];}
if(initialValue===undefined)
{if(sectionDef.options)
{initialValue=Object.keys(sectionDef.options)[0];if(initialValue)
{this.setOption(sectionName,initialValue);}}}
var menu;if(this.questionObj.hasInPageDisplayLogic()&&sectionName=='ForceResponseType')
menu=QBuilder('label',{},sectionDef.options[initialValue]);else
menu=Qualtrics.Menu.buildSelectMenuButton(initialValue,sectionName,{showChecks:false,className:'TextMenu',list:sectionDef.options,menuItemSelectCallback:'Toolbox.setOption:'+this.id+'('+sectionName+', $value, '+sectionDef.forID+')'});return menu;}
return null;},setOption:function(sectionName,v,opt_checkItem)
{this.questionObj.setOption(sectionName,v,true,true,true);if(opt_checkItem&&!$(opt_checkItem).checked)
$(opt_checkItem).click();},render:function()
{if($(this.id))
{this.removeToolbox();}
var selectCount=QuestionActions.selectedRegistry.length;if(selectCount>1)
{this.renderMultiple();}
else if(selectCount===1)
{this.questionObj=QuestionActions.selectedRegistry[0];var toolboxObj=this;var previewModeClass='';if(this.questionObj.getPreviewMode())
{previewModeClass=' PreviewMode';}
this.element=QBuilder('div',{id:toolboxObj.id,className:'QuestionToolbox'+previewModeClass});var questionType=this.questionObj.questionType;if(!QuestionTypes[questionType]||QuestionTypes[questionType].hideToolBox)
{return;}
if(questionType=="DB"&&Qualtrics.Features&&Qualtrics.Features["ThirdPartyVideo"]){QuestionTypes["DB"]["Description"]=getMessage('EditSection','Media');}
this.questionTypeButton=this.buildQuestionTypeButton(questionType);this.element.appendChild(QBuilder('div',{className:'questionTypeLegend'},getMessage('EditSection','ChangeQuestionType')));this.element.appendChild(this.questionTypeButton);if(this.questionObj.getX()&&!this.questionObj.getX().readonly||this.questionObj.getY()&&!this.questionObj.getY().readonly)
{if(this.questionObj.getY()&&this.questionObj.getY().controls!==0)
{if(!this.questionObj.getY().readonly)
{this.element.appendChild(this.buildSelectionControls('y'));}}
if(this.questionObj.getX()&&this.questionObj.getX().controls!==0)
{if(!this.questionObj.getX().readonly)
{this.element.appendChild(QBuilder('hr'));this.element.appendChild(this.buildSelectionControls('x'));}}}
this.fulfilledDependancies=new Array();var sections=(QuestionTypes[questionType]&&QuestionTypes[questionType].questionOptions&&QuestionTypes[questionType].questionOptions.sections);if(sections)
{for(var sectionName in sections)
{var hr=QBuilder('hr');this.element.appendChild(hr);break;}
var previousFieldSet;for(sectionName in sections)
{var disabled=false;var section=sections[sectionName];var hasMore=0;var hasLess=0;if(section.hidden)
{continue;}
if(section.featureCheck&&!Qualtrics.Features[section.featureCheck])
continue;var sectionClass=sections[sectionName].type;var disabledClass=(disabled)?'Disabled':'';var sectionOptions=QBuilder('div',{className:disabledClass+' SectionType_'+sectionClass});var dependentSectionMap=null;if(section.dependant)
{var fulfilled=null;for(var i=0,len=this.fulfilledDependancies.length;i<len;++i)
{if(this.fulfilledDependancies[i]==sectionName)
{fulfilled=true;}}
if(!fulfilled)
{if(section.isAboveDependencies)
{this.element.appendChild(QBuilder('div',{id:sectionName,className:'SpaceHolder'}));if(!this.dependantSections)
this.dependantSections={};}
else
{continue;}}}
var selectedOption=(this.questionObj&&this.questionObj.options&&this.questionObj.options[sectionName]);if(sections[sectionName].type&&sections[sectionName].type=='CheckBox')
{sectionOptions.appendChild(this.buildSection(sections[sectionName],sectionName));}
else if(sections[sectionName].type&&sections[sectionName].type=='Spinner')
{inputType='text';var inputVal=0;if(sections[sectionName].defaultValue!=undefined)
{inputVal=sections[sectionName].defaultValue;}
if(selectedOption!==undefined)
{inputVal=selectedOption;}
if(sections[sectionName].getValue)
{inputVal=QualtricsCPTools.executeDotSyntax(sections[sectionName].getValue);}
var spinnerInput=QBuilder('input',{validation:'Number',className:'CountDisplay',keyupcallback:'Toolbox.spinnerKeyUp($evt)',keydowncallback:'Toolbox.spinnerKeyDown($evt)',forId:sectionName+'_Spinner',id:sectionName+'_Spinner',type:inputType,name:sectionName,value:inputVal});if(sections[sectionName].onBlurAction)
{spinnerInput.setAttribute("blurcallback",sections[sectionName].onBlurAction);Element.observe(spinnerInput,'blur',function(action){eval(action)();}.curry(sections[sectionName].onBlurAction));}
if(sections[sectionName].keyDownAction)
{spinnerInput.removeAttribute('keyupcallback');spinnerInput.setAttribute('keydowncallback',sections[sectionName].keyDownAction);}
if(sections[sectionName].readOnly)
{spinnerInput.readOnly=true;}
var controls=QBuilder('div',{className:'Spinner'},[QBuilder('div',{className:'RoundedMinus',clickcallback:'Toolbox.spinnerMinus($el)',forId:sectionName+'_Spinner'},'-'),spinnerInput,QBuilder('div',{className:'RoundedPlus',clickcallback:'Toolbox.spinnerPlus($el)',forId:sectionName+'_Spinner'},'+'),QBuilder('div',{className:'clear'})]);sectionOptions.appendChild(controls);}
else if(sections[sectionName].type&&sections[sectionName].type=='Button')
{var button=QBuilder('a',{className:'qbutton',clickcallback:sections[sectionName].action},sections[sectionName].title);sectionOptions.appendChild(button);}
else if(sections[sectionName].type&&sections[sectionName].type=='TextEditor')
{button=QBuilder('a',{className:'qbutton',clickcallback:'BaseQuestion.editTextOption:'+this.questionObj.id+'('+sectionName+')'},sections[sectionName].title);sectionOptions.appendChild(button);}
else if(sections[sectionName].type&&sections[sectionName].type=='Textbox')
{var value='';if(sections[sectionName].value){value=eval(sections[sectionName].value);if(!value)value='';}
else
{if(this.questionObj.options[sectionName])
{value=this.questionObj.options[sectionName];}}
if(value===''&&sections[sectionName].defaultValue!==undefined)
{value=sections[sectionName].defaultValue;this.questionObj.setOption(sectionName,value,true,true);}
var input=QBuilder('input',{id:'ToolboxText_'+sectionName,className:'textbox TextBox',sectionname:sectionName,value:value,type:'text',size:'20'});if(sections[sectionName].keycallback)
{input.setAttribute("keyupcallback",sections[sectionName].keycallback);input.setAttribute("blurcallback",sections[sectionName].keycallback);input.onblur=Qualtrics.globalBlurHandler;}
else if(!sections[sectionName].action)
{input.setAttribute("keyupcallback",'Toolbox.defaultFormObserver($el, $val)');}
sectionOptions.appendChild(input);if(sections[sectionName].validation)
{input.setAttribute('validation',sections[sectionName].validation);}
if(!this.formObservers)this.formObservers=[];this.formObservers.push(sectionName);}
else if(sections[sectionName].type&&sections[sectionName].type=='Custom')
{var callback=sections[sectionName].callback;if(callback)
{var parts=QualtricsCPTools.getDotSyntaxParts(callback);if(parts)
{var interfaceNode=parts.method.call(parts.root,this.questionObj);interfaceNode&&sectionOptions.appendChild(interfaceNode);}}}
else
{if(!selectedOption)
{if(sections[sectionName].defaultValue!==undefined)
{selectedOption=sections[sectionName].defaultValue;}
else if(sections[sectionName].defaultValueCallback!==undefined)
{selectedOption=QualtricsCPTools.executeDotSyntax(sections[sectionName].defaultValueCallback,null,null,null,{'$question':this.questionObj});}}
var options=sections[sectionName]['options'];var totalHiddenOptions=0;for(var optionName in options)
{if(options[optionName].hidden)
{totalHiddenOptions++;}}
for(optionName in options)
{var option=options[optionName];if(!this.checkDependsOn(option))
continue;if(option.featureCheck&&!Qualtrics.Features[option.featureCheck])
continue;var optionNameDisplay=options[optionName]['label']||'';var label=null;if(optionNameDisplay.startsWith('$option'))
{var parsedOption=optionNameDisplay.substring(optionNameDisplay.indexOf('.')+1);label=this.buildSection(QuestionTypes[questionType].questionOptions.sections[parsedOption],parsedOption);}
if(option)
{var inputType='radio';var moreClass='';if(option.deprecated&&optionName!==selectedOption)
{continue;}
if(option.hidden===1){hasMore=1;if(optionName===selectedOption)
{if(totalHiddenOptions==1)
{hasMore=0;}}
else
{if(!section.showHidden)
{continue;}
else
{hasLess=1;}}}
else if(option.hidden===0)
{}
input=null;if(optionName==selectedOption)
{input=QBuilder('input',{checked:'checked',type:inputType,controltype:'QuestionOption',name:sectionName,id:sectionName+'_'+optionName,value:optionName});if(option.linkedSections)
{for(i=0,len=option.linkedSections.length;i<len;++i)
{var linkedSection=option.linkedSections[i];this.fulfilledDependancies.push(linkedSection);}}}
else
{input=QBuilder('input',{type:inputType,controltype:'QuestionOption',name:sectionName,id:sectionName+'_'+optionName,value:optionName});}
if(option.type&&option.type=='Link'&&!disabled)
{optionNameDisplay=QBuilder('a',{toolboxclickcallback:option.clickcallback},[optionNameDisplay]);input.setAttribute('toolboxclickcallback',option.clickcallback);}
if(!label)
label=QBuilder('label',{htmlFor:sectionName+'_'+optionName,className:moreClass},[optionNameDisplay]);input.disabled=disabled;sectionOptions.appendChild(input);input=null;sectionOptions.appendChild(label);sectionOptions.appendChild(QBuilder('br',{className:moreClass}));}}
if(hasLess)
{var moreButton=QBuilder('div',{className:'moreButton',section:sectionName,toolboxclickcallback:'showLessOptions'},getMessage('EditSection','Less'));sectionOptions.appendChild(moreButton);}
else if(hasMore)
{moreButton=QBuilder('div',{className:'moreButton',section:sectionName,toolboxclickcallback:'showMoreOptions'},getMessage('SiteWide','More'));sectionOptions.appendChild(moreButton);}}
var sectionDisplay=section['label'];if(sectionDisplay&&(section.dependsOn===undefined||this.checkDependsOn(section)))
{var fieldSet=QBuilder('fieldset',{id:'fieldSet_'+sectionName},[QBuilder('legend',{},sectionDisplay),sectionOptions]);this.element.appendChild(fieldSet);if(section.useSeparatorBelow)
{this.element.appendChild(QBuilder('hr'));}
previousFieldSet=fieldSet;}
else if(previousFieldSet)
{previousFieldSet.appendChild(sectionOptions);}}
if(section&&section.isAboveDependencies)
{if(!dependentSectionMap)dependentSectionMap={};dependentSectionMap[sectionName]=sectionOptions;}}
if(dependentSectionMap)
{for(var sectionName in dependentSectionMap)
{section=sections[sectionName];sectionOptions=dependentSectionMap[sectionName];if(dependentSectionMap.hasOwnProperty(sectionOptions))
{sectionDisplay=section['label'];if(sectionDisplay&&(section.dependsOn===undefined||this.checkDependsOn(section)))
{fieldSet=QBuilder('fieldset',{id:'fieldSet_'+sectionName},[QBuilder('legend',{},sectionDisplay),sectionOptions]);var spotHolder=$(sectionName);if(spotHolder)
{spotHolder.appendChild(fieldSet);if(section.useSeparatorBelow)
{if(spotHolder.nextSibling)
{spotHolder.parentNode.insertBefore(QBuilder('hr'),$(sectionName).nextSibling);}
else
{spotHolder.parentNode.appendChild(QBuilder('hr'));}}}}}}}
hr=QBuilder('hr');this.element.appendChild(hr);var skipLogicMenuItem=null;if(this.questionObj.hasInPageDisplayLogic())
{skipLogicMenuItem=QBuilder('div',{className:'Item AddSkipLogic'},[QBuilder('div',{className:'Icon DisabledIcon'}),QBuilder('div',{className:'TheLink DisabledLink'},getMessage('EditSection','AddSkipLogic'))]);}
else
{skipLogicMenuItem=QBuilder('div',{className:'Item AddSkipLogic'},[QBuilder('div',{className:'Icon',toolboxclickcallback:'addSkipLogic'}),QBuilder('div',{className:'TheLink',toolboxclickcallback:'addSkipLogic'},getMessage('EditSection','AddSkipLogic'))]);}
var multipleActions=QBuilder('div',{className:'QuestionActions'},[QBuilder('div',{className:'Item AddPageBreak'},[QBuilder('div',{className:'Icon',toolboxclickcallback:'addPageBreak'}),QBuilder('div',{className:'TheLink',toolboxclickcallback:'addPageBreak'},getMessage('EditSection','AddPageBreak'))]),QBuilder('div',{className:'Item AddDisplayLogic',clickcallback:'BaseQuestion.addDisplayLogic:'+this.questionObj.id+'(null,true)'},[QBuilder('div',{className:'Icon',bubbleup:'true'}),QBuilder('div',{className:'TheLink',bubbleup:'true'},getMessage('EditSection','AddDisplayLogic'))]),skipLogicMenuItem,QBuilder('div',{className:'Item Copy'},[QBuilder('div',{className:'Icon',toolboxclickcallback:'copyQuestion'}),QBuilder('div',{className:'TheLink',toolboxclickcallback:'copyQuestion'},getMessage('EditSection','CopyQuestion'))]),QBuilder('div',{className:'Item Move'},[QBuilder('div',{className:'Icon',toolboxclickcallback:'moveQuestion'}),QBuilder('div',{className:'TheLink',toolboxclickcallback:'moveQuestion'},getMessage('EditSection','MoveQuestion'))]),QBuilder('div',{className:'Item Note'},[QBuilder('div',{className:'Icon',toolboxclickcallback:'addQuestionNote'}),QBuilder('div',{className:'TheLink',toolboxclickcallback:'addQuestionNote'},getMessage('EditSection','AddNote'))]),QBuilder('div',{className:'Item ViewQuestion'},[QBuilder('div',{className:'Icon',toolboxclickcallback:'viewQuestion'}),QBuilder('div',{className:'TheLink',toolboxclickcallback:'viewQuestion'},getMessage('EditSection','ViewQuestion'))])]);if(Qualtrics.System.productName=='ThreeSixty'&&BaseForm.getInstance().getPermission('editQuestions',true)=='0')
{multipleActions=QBuilder('div');}
this.element.appendChild(multipleActions);this.element.onmousedown=this.getDownListenerFunction();this.element.onclick=this.getClickListenerFunction();var style={};if(Toolbox.lastTop)
style.top=Toolbox.lastTop+'px';$(this.element).setStyle(style);$('Survey').appendChild(this.element);if(this.formObservers)
{var focused=false;for(i=0,len=this.formObservers.length;i<len;++i)
{if(typeof this.formObservers[i]=='string')
{var id='ToolboxText_'+this.formObservers[i];if(sections[this.formObservers[i]].action)
{this.formObservers[i]=new Form.Element.Observer($(id),1,eval(sections[this.formObservers[i]].action));}
else
{this.formObservers[i]=new Form.Element.Observer($(id),1,this.defaultFormObserver);}
if(!focused){focused=true;QualtricsCPTools.focusInput.defer(id);}}}}
this.updatePosition();}
if(BaseForm.getInstance().revisionId)
{$$('#QES_toolbox input[type="text"]').each(function(el){el.setAttribute('readonly','readonly');});$$('#QES_toolbox .menuButton').each(function(el){el.addClassName('Disabled');});}},buildQuestionTypeButton:function(questionType)
{return QBuilder('div',{className:'QuestionTypeButton',title:getMessage('EditSection','ChangeQuestionType'),downcallback:'Toolbox.showQuestionTypeMenu($el, $evt)'},[QBuilder('div',{bubbleup:true,className:'QuestionTypeIcon '+questionType},[QBuilder('div',{bubbleup:true,className:'Icon'})]),QBuilder('div',{bubbleup:true,className:'QuestionTypeDesc'},[QBuilder('div',{bubbleup:true,className:'Desc'},[(QuestionTypes[questionType]&&QuestionTypes[questionType]['Description'])||questionType]),QBuilder('div',{bubbleup:true,className:'Arrow'})]),QBuilder('div',{bubbleup:true,className:'clear'})]);},appendToToolboxSectionOptions:function(node,hasSpaceHolder,sectionName)
{if(hasSpaceHolder)
{var spaceHolderId=sectionName;for(var element in this.sectionOptions.getChildren())
{if(element.id==sectionName)
{element.appendChild(node);return;}}
console.warn('spaceHolder Key is broken for node:',node);}
this.sectionOptions.appendChild(node);},refresh:function()
{this.render();},buildNumericFormat:function(questionObj)
{return QBuilder('div',{className:'NumericFormat'},[QBuilder('label',{},getMessage('QuestionOptions','Min')),QBuilder('input',{type:'text',size:'6',className:'TextBox',value:questionObj.options['ValidNumber_Min']||'',keyupcallback:'Question.setOption',instanceid:questionObj.id,p1:'ValidNumber_Min',p2:'$val',p3:'true',p4:'true'}),QBuilder('br'),QBuilder('label',{},getMessage('QuestionOptions','Max')),QBuilder('input',{type:'text',size:'6',className:'TextBox',value:questionObj.options['ValidNumber_Max']||'',keyupcallback:'Question.setOption',instanceid:questionObj.id,p1:'ValidNumber_Max',p2:'$val',p3:'true',p4:'true'}),QBuilder('br'),QBuilder('label',{},getMessage('QuestionOptions','MaxDecimals')),QBuilder('input',{type:'text',size:'2',className:'TextBox',value:questionObj.options['ValidNumber_NumDecimals']||'',keyupcallback:'Question.setOption',instanceid:questionObj.id,p1:'ValidNumber_NumDecimals',p2:'$val',p3:'true',p4:'true'})]);},buildOrgHierarchyMetadataSelect:function(questionObj)
{if(questionObj.options.type!="SearchOnly"&&questionObj.options.type!="HierarchyAndSearch")
return;var name=getMessage('SiteWide','None');if(questionObj.OrgHierarchySearchField)
name=questionObj.OrgHierarchySearchField;return Q.buildMenuButton(name,'Toolbox.getHierarchyMetadataSearchSelectMenu');},getHierarchyMetadataSearchSelectMenu:function()
{return{ajax:{action:'GetOrgHierarchyMetadata',parameters:{OrgHierarchyID:QuestionActions.selectedRegistry[0].OrgHierarchyID},preparser:'Toolbox.parseHierarchyMetadataSearchMenu'}};},parseHierarchyMetadataSearchMenu:function(response)
{var currentSearchField=QuestionActions.selectedRegistry[0].OrgHierarchySearchField;var fields=Qualtrics.parseJSON(response,true);var items=[{display:getMessage('SiteWide','None'),checked:!currentSearchField||currentSearchField=='',action:'Toolbox.setHierarchyMetadataSearch()'}];if(!Object.isEmpty(fields))
{items.push({separator:true});for(var name in fields)
{var checked=currentSearchField==name;items.push({display:name,checked:checked,action:checked?'':'Toolbox.setHierarchyMetadataSearch('+name+')'});}
items.sort(function(a,b){return(a["display"]<b["display"])?-1:(a["display"]>b["display"])?1:0;});}
return{items:items,togglecheckexclusive:true};},setHierarchyMetadataSearch:function(field)
{var q=QuestionActions.selectedRegistry[0];q.OrgHierarchySearchField=field;q.setEdited();Toolbox.getInstance().refresh();q.refresh();},buildOrgHierarchySelect:function(questionObj)
{var name=getMessage('OrgHierarchies','SelectOrgHierarchy')+'...';if(questionObj.OrgHierarchyID)
name=questionObj.OrgHierarchyName;return Q.buildMenuButton(name,'Toolbox.getHierarchySelectMenu');},getHierarchySelectMenu:function()
{return{ajax:{action:'GetOrgHierarchies',parameters:{ThreeSixtyID:Qualtrics.ThreeSixty.currentThreeSixtyId},preparser:'Toolbox.parseHierarchySelectMenu'}};},parseHierarchySelectMenu:function(response)
{var hierarchies=Qualtrics.parseJSON(response,true);var items=[];if(!Object.isEmpty(hierarchies))
{var currentOrgHierarchyID=QuestionActions.selectedRegistry[0].OrgHierarchyID;for(var id in hierarchies)
{var name=hierarchies[id].name;var checked=currentOrgHierarchyID==id;items.push({id:id,display:name,checked:checked,action:checked?'':'Toolbox.setHierarchy('+id+', '+name+')'});}
items.sort(function(a,b){return(a["display"]<b["display"])?-1:(a["display"]>b["display"])?1:0;});}
return{items:items,togglecheckexclusive:true};},setHierarchy:function(ohID,ohName)
{var q=QuestionActions.selectedRegistry[0];q.OrgHierarchyID=ohID;q.OrgHierarchyName=ohName;q.setEdited();Toolbox.getInstance().refresh();q.refresh();},defaultFormObserver:function(el,val)
{var sectionName=el.getAttribute('sectionname');if(sectionName)
{Toolbox.getInstance().questionObj.setOption(sectionName,val,true,true);}},buildSelectionControls:function(axis)
{axis=axis.toUpperCase();var axisDef=null;if(axis=='Y')
{axisDef=this.questionObj.getY();var removeFunction='removeY';var addFunction='addY';var multipleFunction='editMultipleY';}
else if(axis=='X')
{axisDef=this.questionObj.getX();removeFunction='removeX';addFunction='addX';multipleFunction='editMultipleX';}
if(axisDef)
{var label=axisDef.label;var listType=axisDef.listType;var listCount=this.questionObj[listType].length;if(listType==='answers'||listType=='answer'){listCount=QuestionActions.filterOutNALabel(this.questionObj[listType]).length;}
var titleRemove='Remove the last '+label;var titleAdd='Add a '+label;if(this.questionObj.hasAutoScale(axis))
{titleAdd='';titleRemove='';}
var input;if(axisDef.readOnly)
{var controls=QBuilder('div',{className:'SelectionControls ReadOnlySelectionControls'},[input=QBuilder('div',{className:'CountDisplay TextBox',value:listCount,id:listType+'_count'},listCount)]);}
else
{controls=QBuilder('div',{className:'SelectionControls'},[QBuilder('div',{className:'RoundedMinus',title:titleRemove,toolboxclickcallback:removeFunction},'-'),input=QBuilder('input',{type:'text',autocomplete:'off',className:'CountDisplay TextBox',value:listCount,id:listType+'_count',keyentercallback:'BaseQuestion.setSelectionCountByAxis:'+this.questionObj.id+'('+axis+', $evt)',blurcallback:'BaseQuestion.setSelectionCountByAxis:'+this.questionObj.id+'('+axis+', $evt)'}),QBuilder('div',{className:'RoundedPlus',title:titleAdd,toolboxclickcallback:addFunction},'+')]);}
input.onblur=Qualtrics.globalBlurHandler;var labelTranslationKey=axisDef.labelKey;var pluralLabelTranslationKey=strToPlural(labelTranslationKey);var noResponses=(Survey.getInstance().responses===0);var protectSelectionIds=Survey.getInstance().protectSelectionIds();if(noResponses&&!protectSelectionIds&&this.questionObj.selector!='Bipolar'&&(axisDef.editMultiple===undefined||axisDef.editMultiple))
{controls.appendChild(QBuilder('div',{className:'EditMultiple',toolboxclickcallback:multipleFunction,title:getMessage('EditSection','EditAll'+pluralLabelTranslationKey)},getMessage('EditSection','EditMultiple')));}
controls.appendChild(QBuilder('div',{className:'clear'}));var responseCheckBox=null;var canDoResponseScales=true;if(axisDef.scales===false||this.questionObj.selector=='Bipolar'||this.questionObj.questionType=='DD'||this.questionObj.subSelector=='RecipientDefinesGroups')
{canDoResponseScales=false;}
var responseScales=QBuilder('div',{className:'ResponseScalesInner'},[responseCheckBox=QBuilder('input',{title:getMessage('EditSection','ResponseScales'),type:'checkbox',id:'responseScalesCheckBox'+axis,toolboxclickcallback:'toggleAutoResponseScales'+axis}),QBuilder('label',{htmlFor:'responseScalesCheckBox'+axis},getMessage('EditSection','Automatic'+labelTranslationKey+'Plural'))]);if(this.questionObj.questionType=='SBS'&&axis=='X')responseScales='';var roundedClass='';var selectedClass='';if(this.questionObj.hasAutoScale(axis))
{responseCheckBox.checked=true;responseCheckBox.defaultChecked=true;roundedClass=' RoundedBox';selectedClass=' ResponseScalesOn';var currentScaleName=this.questionObj.getScaleDefinition(axis).scaleName;var scaleLabel=choiceScales[currentScaleName].name;var instanceId=this.questionObj.id;var menuButton=QMenu.buildMenuButton(scaleLabel,'QES_Global.buildResponseScalesMenu("'+instanceId+'","'+axis+'")',{className:'SelectMenuButton ResponseScalesMenuButton'});responseScales.appendChild(menuButton);responseScales.appendChild(QBuilder('div',{className:'clear'}));}
var RoundedBox=QBuilder('div',{id:'ResponseScalesBox_'+axis,className:'ResponseScales'+selectedClass},[QBuilder('div',{className:roundedClass},[QBuilder('div',{className:'TopRight'},[QBuilder('div',{className:'BottomLeft'},[QBuilder('div',{className:'BottomRight'},[responseScales])])])])]);if(canDoResponseScales)
{controls.appendChild(RoundedBox);}
var ySet=QBuilder('fieldset',{},[QBuilder('legend',{},getMessage('EditSection',pluralLabelTranslationKey)),controls]);if(axisDef.disabled)
{ySet.appendChild(QBuilder('div',{className:'Disabled'}));}
return ySet;}},update:function()
{if(this.questionObj)
{var x=this.questionObj.getX();var y=this.questionObj.getY();if(x&&x.listType&&$(x.listType+'_count'))
{$(x.listType+'_count').value=this.questionObj[x.listType].length;}
if(y&&y.listType&&$(y.listType+'_count'))
{$(y.listType+'_count').value=this.questionObj[y.listType].length;}}},updateSpinner:function(id,value)
{if($(id+'_Spinner'))
$(id+'_Spinner').value=value;},renderMultiple:function()
{var toolboxObj=this;var selectCount=QuestionActions.selectedRegistry.length;if(selectCount>0)
{var validation_NoneInput;var validation_ForceResponseInput;var multipleActions=QBuilder('div',{className:'MultipleActions'},[QBuilder('div',{className:'MultipleSelectStatus'},[QBuilder('em',null,selectCount),' '+getMessage('EditSection','QuestionsSelected')]),QBuilder('div',{className:'Item Remove'},[QBuilder('div',{className:'Icon',toolboxclickcallback:'removeQuestions'}),QBuilder('div',{className:'TheLink',toolboxclickcallback:'removeQuestions'},getMessage('EditSection','SendToTrash'))]),QBuilder('div',{className:'Item Copy'},[QBuilder('div',{className:'Icon',toolboxclickcallback:'copyQuestions'}),QBuilder('div',{className:'TheLink',toolboxclickcallback:'copyQuestions'},getMessage('SiteWide','Copy'))]),QBuilder('div',{className:'Item Group'},[QBuilder('div',{className:'Icon',toolboxclickcallback:'groupQuestions'}),QBuilder('div',{className:'TheLink',toolboxclickcallback:'groupQuestions'},getMessage('SiteWide','Group'))]),QBuilder('div',{className:'Item MoveToBlock'},[QBuilder('div',{className:'Icon',toolboxclickcallback:'moveQuestionsToNewBlock'}),QBuilder('div',{className:'TheLink',toolboxclickcallback:'moveQuestionsToNewBlock'},getMessage('EditSection','MoveToNewBlock'))]),QBuilder('div',{className:'Item Move'},[QBuilder('div',{className:'Icon',toolboxclickcallback:'moveQuestions'}),QBuilder('div',{className:'TheLink',toolboxclickcallback:'moveQuestions'},getMessage('SiteWide','Move'))]),QBuilder('hr'),QBuilder('fieldset',null,[QBuilder('legend',null,getMessage('EditSection','Validation')),QBuilder('div',null,[validation_NoneInput=QBuilder('input',{id:'validation_None',controltype:'MultipleQuestionOption',type:'radio',name:'ForceResponse',value:'OFF'}),QBuilder('label',{htmlFor:'validation_None'},getMessage('SiteWide','None')),QBuilder('br'),validation_ForceResponseInput=QBuilder('input',{id:'validation_ForceResponse',controltype:'MultipleQuestionOption',type:'radio',name:'ForceResponse',value:'ON'}),QBuilder('label',{htmlFor:'validation_ForceResponse'},getMessage('EditSection','ForceResponse'))])])]);var validationState=this.getMultipleOptionState('ForceResponse');if(validationState=='OFF')
{validation_NoneInput.checked=true;validation_NoneInput.defaultChecked=true;}
else if(validationState=='ON')
{validation_ForceResponseInput.checked=true;validation_ForceResponseInput.defaultChecked=true;}
this.element=QBuilder('div',{id:toolboxObj.id,className:'QuestionToolbox'});this.element.appendChild(multipleActions);this.top=Toolbox.lastTop||QuestionActions.getSelectedTop();$(this.element).setStyle({top:this.top+'px',visibility:'hidden'});$('Survey').appendChild(this.element);this.element.onclick=this.getClickListenerFunction();this.updatePosition();}},getMultipleOptionState:function(option)
{var lastValue;for(var i=0,len=QuestionActions.selectedRegistry.length;i<len;++i)
{if(QuestionActions.selectedRegistry[i].type=='Question')
{var value=QuestionActions.selectedRegistry[i].options[option];if(value=='$option.ForceResponseType')
{value='ON';}
if(lastValue===undefined)
{lastValue=value;}
if(value!=lastValue)
{return;}
lastValue=value;}}
return lastValue;},getClickListenerFunction:function()
{var toolboxObj=this;return function(evt){if(!evt){var evt=window.event}
toolboxObj.clickListener(evt);};},getDownListenerFunction:function()
{var toolboxObj=this;return function(evt){if(!evt){var evt=window.event}
toolboxObj.downListener(evt);};},downListener:function(evt)
{if(!evt)evt=window.event;if(Event.element(evt).nodeName==='INPUT')
{return;}
var t=new Date();var doubleClickTime=500;if(this.lastClickTime&&(t-this.lastClickTime)<doubleClickTime)
{Event.stop(evt);}
this.lastClickTime=t;},clickListener:function(evt)
{if(QES_Global.suspendSelects)
{return;}
if(!evt){evt=window.event}
var clickedEl=Event.element(evt);var callback=clickedEl.getAttribute('toolboxclickcallback');if(callback)
{if(BaseForm.getInstance().revisionId)
{this.holdPosition(true);this.render();this.holdPosition(false);}
else if(ToolboxActions[callback])
{this.holdPosition(1);var result=ToolboxActions[callback](this.questionObj,clickedEl,this);if(result!==false)
{this.render();}
this.holdPosition(false);}
else
{console.error('no callback for: '+callback);}}
else if(clickedEl.getAttribute('name')&&clickedEl.getAttribute('controltype')&&clickedEl.getAttribute('controltype')=='QuestionOption')
{var fieldName=clickedEl.getAttribute('name');if(fieldName)
{var val=clickedEl.getAttribute('value');val=Form.Element.getValue(clickedEl);if(val!==undefined)
{if(Survey.getInstance().getPermission('editQuestions'))
{this.questionObj.previewMode=1;this.holdPosition(true);if(clickedEl.type=='checkbox')
{val=this.getCheckBoxValue(this.questionObj.questionType,fieldName,clickedEl);}
var oldOptions=Qualtrics.History.Actions.buildParameter(this.questionObj.options);this.questionObj.setOption(fieldName,val,true,true);this.questionObj.setupDefaultSelections();var newOptions=Qualtrics.History.Actions.buildParameter(this.questionObj.options);}
this.questionObj.refreshQuestion();this.render();this.holdPosition(false);Qualtrics.History.getInstance().addAction('Change Question Option',{action:'BaseQuestion.setOptions:'+this.questionObj.id,parameters:[oldOptions,true,true]},{action:'BaseQuestion.setOptions:'+this.questionObj.id,parameters:[newOptions,true,true]});}}}
else if(clickedEl.getAttribute('name')&&clickedEl.getAttribute('controltype')&&clickedEl.getAttribute('controltype')=='MultipleQuestionOption')
{fieldName=clickedEl.getAttribute('name');if(fieldName)
{val=Form.Element.getValue(clickedEl);if(val!==undefined)
{if(Survey.getInstance().getPermission('editQuestions'))
{this.holdPosition(true);if(clickedEl.type=='checkbox')
{val=this.getCheckBoxValue(this.questionObj.questionType,fieldName,clickedEl);}
var selectedList=QuestionActions.selectedRegistry;for(var i=0,len=selectedList.length;i<len;++i)
{var q=selectedList[i];if(q.elementType=='Question')
{var tempVal=val;if(fieldName=='ForceResponse'&&val=='ON'&&q.options.ForceResponseType)
tempVal='$option.ForceResponseType';q.setOption(fieldName,tempVal,true,true);q.setupDefaultSelections();}}
for(i=0,len=selectedList.length;i<len;++i)
{q=selectedList[i];if(q.elementType=='Question')
{q.refreshQuestion();}}
this.render();this.holdPosition(false);}}}}
clickedEl=null;},getCheckBoxValue:function(questionType,sectionName,clickedEl)
{if(clickedEl.checked)
{var val=this.getQuestionTypeOptionValueStructure(questionType,sectionName,'ON').value;}
else
{val=this.getQuestionTypeOptionValueStructure(questionType,sectionName,'OFF').value;}
return val;},getCheckBoxState:function(questionType,sectionName,selectedOption)
{if(selectedOption)
{var on=this.getQuestionTypeOptionValueStructure(questionType,sectionName,'ON');if(on.value==selectedOption)
{return 1;}}
return 0;},getQuestionTypeOptionValueStructure:function(questionType,sectionName,optionValue)
{var sections=(QuestionTypes[questionType]&&QuestionTypes[questionType].questionOptions&&QuestionTypes[questionType].questionOptions.sections);if(sections)
{if(!sections[sectionName]['options'])
{new QES_Error('no options array in QuestionTypes for: '+sectionName);return;}
if(!sections[sectionName]['options'][optionValue])
{new QES_Error('there is no options.'+optionValue+' set in QuestionTypes for: '+sectionName);return;}
return sections[sectionName]['options'][optionValue];}},overListener:function(evt)
{if(!evt){evt=window.event}
var clickedEl=Event.element(evt);var callback=clickedEl.getAttribute('overcallback');if(callback)
{if(ToolboxActions[callback])
{ToolboxActions[callback](this.questionObj);}}},outListener:function(evt)
{if(!evt){evt=window.event}
var clickedEl=Event.element(evt);var callback=clickedEl.getAttribute('outcallback');if(callback)
{if(ToolboxActions[callback])
{ToolboxActions[callback](this.questionObj);}}},showQuestionTypeMenu:function(el,evt)
{QuestionTypeActions.showQuestionTypeMenu(el,evt,'Toolbox.questionTypeMenuClickHandler($evt)');},questionTypeMenuClickHandler:function(evt)
{if(!Survey.getInstance().getPermission('editQuestions'))
{return;}
if(!evt){evt=window.event;}
if(!Event.isLeftClick(evt))
{return;}
var clickedEl=Event.element(evt);var callback=clickedEl.getAttribute('typeclickcallback');if(callback)
{if(QuestionTypeActions[callback])
{QuestionTypeActions[callback](evt,clickedEl);return;}}
var li=clickedEl;if(li.tagName!='LI'&&li.tagName!='A')
{li=clickedEl.up('li');}
if(li)
{var type=li.getAttribute('questiontype');var selector=li.getAttribute('selector');var subSelector=li.getAttribute('subSelector');if(type)
{if((evt.ctrlKey||evt.metaKey))
{if(evt.shiftKey)
{if(confirm("This is going to add 90+ example questions to your survey! \nDo you want to do this?"))
{this.addAllExamplesToBlock();return;}}
var q=this.addQuestionToBlockByPreviewData(type,selector,subSelector);return;}
if(!BaseForm.getInstance().getQuestionPermission(type))
return;this.changeQuestionType(this.questionObj,type,selector,subSelector);if(!evt.shiftKey)
{this.render();}
else
{new Effect.Highlight($('MenuInnerInner'));}}}
if($(clickedEl).hasClassName("LibrarySearch"))
{$(clickedEl).focus();}
Event.stop(evt);},changeQuestionType:function(questionObj,type,selector,subSelector,opt_surveyLockedOverride)
{Qualtrics.History.getInstance().addAction('Change Question Type',{action:'Toolbox.changeQuestionType',parameters:[Qualtrics.History.Actions.buildParameter(questionObj),questionObj.questionType,questionObj.selector,questionObj.subSelector]},{action:'Toolbox.changeQuestionType',parameters:[Qualtrics.History.Actions.buildParameter(questionObj),type,selector,subSelector]});var success=QuestionActions.transformQuestion(questionObj,type,opt_surveyLockedOverride);if(!success)
{return;}
if(selector)
{questionObj.selector=selector;}
else
{questionObj.selector=null;}
if(subSelector)
{questionObj.subSelector=subSelector;}
else
{questionObj.subSelector=null;}
questionObj.previewMode=1;questionObj.populateQuestionOptions();questionObj.refreshQuestion();this.refresh();if(questionObj.scoreAll&&questionObj.canScore()){questionObj.scoreAll();}
questionObj.frameQuestion();},addQuestionToBlockByPreviewData:function(type,selector,opt_subselector)
{if(selector)
{var exampleDef=QuestionTypeActions.questionPreviewData[type][selector];if(opt_subselector)
{exampleDef=QuestionTypeActions.questionPreviewData[type][selector][opt_subselector];}
var questionObj=new Question();var qData={};qData.Type='Question';qData.QuestionDefinition=exampleDef;questionObj.generate(qData);questionObj.unpackage();Survey.getInstance().blocks[0].addQuestion(questionObj);questionObj.render();QuestionActions.select(questionObj);questionObj.setSaved(0);questionObj.questionId=null;return questionObj;}},addAllExamplesToBlock:function()
{var flattenedExamples=QuestionTypeActions.getFlattenedPreviewExamples();for(var i=0,len=flattenedExamples.length;i<len;++i)
{var example=flattenedExamples[i];var q=this.addQuestionToBlockByPreviewData(example['QuestionType'],example['Selector'],example['SubSelector']);QuestionActions.select(q);}
this.addRecodeAndVariableNamingQuestions();},addRecodeAndVariableNamingQuestions:function()
{var questions={'MC':['SAVR','MAVR'],'Matrix':['Likert|SingleAnswer','Likert|MultipleAnswer'],'RO':['DND'],'CS':['VRTL'],'DD':['DL'],'SBS':['SBSMatrix']};var survey=Survey.getInstance();for(var type in questions)
{for(var i=0;i<questions[type].length;i++)
{var q=new Question();q.text=getMessage('EditSection','ClickToWriteQuestion');q.text_Unsafe=q.text;q.questionType=type;var parts=questions[type][i].split('|');q.selector=parts[0];if(parts[1])
q.subSelector=parts[1];q.addChoice.repeat(3,q);if(QuestionTypes[type].xAxis)
{for(var j=0;j<3;j++)
q.choices[j].choiceDataExportTag="C_"+(j+1);q.addAnswer.repeat(3,q);if(type!='SBS')
{for(j=0;j<3;j++)
q.answers[j].recodeValue=j+4;}
else
{for(j=0;j<3;j++)
{q.answers[j].answerDataExportTag=j+4;q.answers[j].recodeValue=true;q.answers[j].recodeValues=[(j+4)+":1",(j+4)+":2"];}}
q.choiceDataExportTags=true;}
else
{for(j=0;j<3;j++)
q.choices[j].recodeValue=j+4;}
q.recodeValues=true;survey.blocks[0].addQuestion(q);q.render();q.setSaved(0);q=new Question();q.text=getMessage('EditSection','ClickToWriteQuestion');q.text_Unsafe=q.text;q.questionType=type;q.selector=parts[0];if(parts[1])
q.subSelector=parts[1];q.addChoice.repeat(3,q);if(QuestionTypes[type].xAxis)
{q.addAnswer.repeat(3,q);if(type!='SBS')
{for(j=0;j<3;j++)
q.answers[j].variableNaming="Answer "+(j+1);}
else
{for(j=0;j<3;j++)
q.answers[j].variableNaming=["Answer "+(j+1)+":1","Answer "+(j+1)+":2"];}}
else
{for(j=0;j<3;j++)
q.choices[j].variableNaming="Choice "+(j+1);}
q.variableNaming=true;survey.blocks[0].addQuestion(q);q.render();q.setSaved(0);QuestionActions.select(q);}}},questionTypeMenuOverHandler:function(evt)
{if(!evt){evt=window.event;}
var overEl=Event.element(evt);if(overEl)
{var li=overEl;if(li.tagName!='LI')
{li=overEl.up('li');}
if(li)
{var action=li.getAttribute('typeovercallback');clearOverRegistry();AddOver(li);if(action)
{this[action](li);}}}},previewQuestionType:function(li)
{if(li)
{var type=li.getAttribute('questiontype');var selector=li.getAttribute('selector')||'';var subSelector=li.getAttribute('subSelector')||'';if(type)
{this.preview_oldType=this.questionObj.questionType;this.preview_oldMode=this.questionObj.previewMode;if(type+'_'+selector+'_'+subSelector==this.currentPreviewType)
{return;}
if(this.previewArea)
{if(this.previewQuestionObj)
{this.previewQuestionObj.removeQuestionDOM();}
this.currentPreviewType=type+'_'+selector+'_'+subSelector;deleteChildren(this.previewArea);var previewQuestionObj=new Question(null,true);this.previewQuestionObj=previewQuestionObj;this.previewQuestionObj.showEditLinksInPreview=false;previewQuestionObj.previewMode=1;if(QuestionTypeActions.questionPreviewData)
{if(QuestionTypeActions.questionPreviewData[type])
{if(selector&&QuestionTypeActions.questionPreviewData[type][selector])
{var definition=QuestionTypeActions.questionPreviewData[type][selector];if(subSelector&&QuestionTypeActions.questionPreviewData[type][selector][subSelector])
{definition=QuestionTypeActions.questionPreviewData[type][selector][subSelector];}
if(definition['QuestionType'])
{var qData={};qData.Type='Question';qData.QuestionDefinition=definition;previewQuestionObj.generate(qData);previewQuestionObj.unpackage();}}
else
{new QES_Error('no selector for an example '+type);}}
else
{}}
previewQuestionObj.renderCanvas({parentElement:this.previewArea,skinWidth:545});if(previewQuestionObj.onLoad)
{previewQuestionObj.onLoad();previewQuestionObj.onLoad=null;}
previewQuestionObj=null;}}}},frameQuestionsTypeMenu:function()
{var viewHeight=getPageSize()[3];var viewBottom=scrollInfo[1]+viewHeight;var top=Position.cumulativeOffset($(this.questionTypesMenu))[1];var height=$(this.questionTypesMenu).getHeight();var menuViewTop=viewHeight-height;var menuBottom=top+height;if(height>viewHeight)
{QES_Global.stopScrolling();QES_Global.scroller=new Effect.ScrollTo($(this.questionTypesMenu),{offset:0,duration:0.1});}
else if(viewBottom<menuBottom)
{QES_Global.stopScrolling();QES_Global.scroller=new Effect.ScrollTo($(this.questionTypesMenu),{offset:0-menuViewTop,duration:0.1});}},deferredUpdatePosition:function()
{var toolboxObj=this;if(!toolboxObj.deferredUpdatePositionTimer)
{toolboxObj.deferredUpdatePositionTimer=setTimeout(function(){toolboxObj.deferredUpdatePositionTimer=null;toolboxObj.updatePosition();},200);}},updatePosition:function()
{if(this.element)
{this.top=QuestionActions.getSelectedTop();var selectedHeight=QuestionActions.getSelectedHeight();var selectedBottom=this.top+selectedHeight;var midPoint=(this.getHeight()/2)-selectedHeight/2;this.top=this.top-midPoint;$(this.element).setStyle({top:this.top+'px'});var viewTop=scrollInfo[1];var viewBottom=scrollInfo[1]+getPageSize()[3];var surveyBottom=Survey.getInstance().getBottom();var surveyTop=Survey.getInstance().getTop();if(Toolbox.toolboxVerticalHold!==null)
{var overRide=false;if(this.top+this.getHeight()<viewTop||this.top>viewBottom)
{overRide=true;}
if(!overRide)
{$(this.element).setStyle({top:Toolbox.toolboxVerticalHold+'px'});this.top=Toolbox.toolboxVerticalHold;if(this.element)
{$(this.element).setStyle({visibility:'visible'});}
return;}}
$(this.element).setStyle({visibility:'visible'});var bottomOverlap=this.getBottom()-viewBottom;if(bottomOverlap>0)
{this.top=this.top-bottomOverlap;}
if(this.getTop()<viewTop)
{this.top=viewTop;}
if(this.getTop()<surveyTop)
{this.top=surveyTop;}
bottomOverlap=this.getBottom()-surveyBottom;if(bottomOverlap>0)
{this.top=this.top-bottomOverlap;}
var surveyInstance=Survey.getInstance();if(this.getHeight()>surveyInstance.getHeight())
{surveyInstance.element.setStyle({'min-height':this.getHeight()+'px'});this.top=surveyInstance.getTop();}
bottomOverlap=this.getTop()-selectedBottom;if(bottomOverlap>0)
{this.top=this.top-(bottomOverlap+selectedHeight);}
$(this.element).setStyle({top:this.top+'px'});}},getTop:function()
{return this.top;},getHeight:function()
{if(!this.height)
{if($(this.element))
{this.height=$(this.element).getHeight();}
else
{return 0;}}
return this.height;},getBottom:function()
{return this.getTop()+this.getHeight();},setQuestionObj:function(questionObj)
{this.questionObj=questionObj;this.render();},setMultiple:function(){this.questionObj=null;this.render();},spinnerPlus:function(clickedEl)
{var val=this.getSpinnerValue(clickedEl);this.spinnerAction(clickedEl,val,1);},spinnerMinus:function(clickedEl)
{var val=this.getSpinnerValue(clickedEl);this.spinnerAction(clickedEl,val,-1);},spinnerKeyDown:function(evt)
{var clickedEl=Event.element(evt);var val=this.getSpinnerValue(clickedEl);if(evt.keyCode==Event.KEY_RETURN)
{Event.stop(evt);return false;}
if(evt.keyCode==Event.KEY_UP||evt.keyCode==Event.KEY_RIGHT)
{this.spinnerAction(clickedEl,val,1);this.questionObj.refreshQuestion();}
if(evt.keyCode==Event.KEY_DOWN||evt.keyCode==Event.KEY_LEFT)
{this.spinnerAction(clickedEl,val,-1);this.questionObj.refreshQuestion();}},spinnerKeyUp:function(evt)
{var clickedEl=Event.element(evt);var val=this.getSpinnerValue(clickedEl);if(isNaN(val))
{return;}
this.spinnerAction(clickedEl,val,0);this.questionObj.refreshQuestion();},getSpinnerValue:function(clickedEl)
{var forId=clickedEl.getAttribute('forId');if($(forId))
{var spinnerVal=Number($(forId).value);return spinnerVal;}
return false;},spinnerAction:function(clickedEl,value,delta)
{var questionObj=this.questionObj;if(!Survey.getInstance().getPermission('editQuestions'))
{return;}
if(questionObj.isLocked())
{QES_Global.handleEditWhenSurveyLocked();return;}
var forId=clickedEl.getAttribute('forId');if($(forId))
{var optionName=$(forId).getAttribute('name');var inputVal=$F(forId);if(inputVal.endsWith('.')||(inputVal.startsWith('-')&&inputVal.endsWith('-')))
{return;}
var newVal=value+delta;var optionDefinition=QuestionTypes[questionObj.questionType]['questionOptions']['sections'][optionName]||{};if(optionDefinition.minValue!=undefined)
{if(newVal<optionDefinition.minValue)
{newVal=optionDefinition.minValue;}}
if(optionDefinition.maxValue!=undefined)
{if(newVal>optionDefinition.maxValue)
{newVal=optionDefinition.maxValue;}}
if(optionDefinition.addAction&&delta==1)
{QualtricsCPTools.executeDotSyntax(optionDefinition.addAction);this.refresh();return;}
if(optionDefinition.subtractAction&&delta==-1)
{QualtricsCPTools.executeDotSyntax(optionDefinition.subtractAction);this.refresh();return;}
if(optionName=='NumColumns'&&questionObj.questionType==='Matrix')
{if(newVal>questionObj.getSelectionListToRender('answers').length)
{newVal=questionObj.getSelectionListToRender('answers').length;}}
else if(optionName=='NumColumns')
{if(newVal>questionObj.getSelectionListToRender('choices').length)
{newVal=questionObj.getSelectionListToRender('choices').length;}}
$(forId).value=newVal;questionObj.setOption(optionName,newVal,true,true);questionObj.previewMode=1;questionObj.refreshQuestion();}}};window.FunnelEditBox=Class.create();FunnelEditBox.prototype={element:null,textarea:null,toolboxObj:null,listType:null,questionObj:null,formObserver:null,initialize:function(axis,questionObj,button,toolboxObj)
{this.questionObj=questionObj;var listType=questionObj.getListType(axis);this.listType=listType;this.toolboxObj=toolboxObj;this.axis=axis;var text=selectionListToString(questionObj[listType]);this.undoPkg=questionObj.getUndoPkg();var pos=Position.cumulativeOffset($(button));var textarea=QBuilder('textarea',{cols:5,rows:5},[text]);this.textarea=textarea;textarea.parentObj=this;var cancel=QBuilder('div',{id:'FunnelCancelButton'},getMessage('SiteWide','Cancel'));Event.observe(cancel,'click',this.escape.bind(this));var inner=QBuilder('div',{className:'InnerBox'},[QBuilder('div',{id:'FunnelDoneButton'},getMessage('SiteWide','Done')),cancel,textarea]);var multipleBox=QBuilder('div',{id:'EditMultipleBox',className:'EditMultipleBox'},[inner]);inner=null;var boxHeight=150;var buttonHeight=24;var buttonOverlap=-18;var vOffset=0-(boxHeight/2)+(buttonHeight/2)-1;var windowWidth=$(document.getElementsByTagName('body')[0]).getWidth();var buttonRight=(windowWidth-pos[0]-buttonOverlap);if(Qualtrics.Browser.IE&&Qualtrics.Browser.Version<7)
{buttonRight=buttonRight-1;}
$(multipleBox).setStyle({top:(pos[1]+vOffset)+'px',right:buttonRight+'px',opacity:0.93});$(textarea).setStyle({opacity:0.3});$('pageDiv').appendChild(multipleBox);this.element=multipleBox;new Effect.Morph(multipleBox,{transition:INQUAD,duration:0.3,style:{width:'750px'},afterFinish:function()
{new Effect.Appear(textarea,{duration:0.2});$(textarea).focus();textarea=null;}});var that=this;this.documentClickCache=function(evt){if(!evt){evt=window.evt}
var el=Event.element(evt);if(el.id&&el.id==='FunnelDoneButton')
{that.remove();return;}
var theBox=$(el).up('#EditMultipleBox');if(!theBox)
{that.remove();}
el=null;};this.documentKeyDownCache=this.documentKeyDown.bind(this);Event.observe(document,'mousedown',this.documentClickCache);Event.observe(document,'keydown',this.documentKeyDownCache);this.formObserver=new Form.Element.Observer(this.textarea,1,this.callBack);Toolbox.toolboxVerticalHold=toolboxObj.top;multipleBox=null;},documentKeyDown:function(evt)
{if(evt.keyCode==27)
{this.escape();}},escape:function()
{this.remove();Qualtrics.History.getInstance().undo();this.questionObj.refreshCanvas();},remove:function()
{this.questionObj.addUndo(this.undoPkg,this.questionObj.getUndoPkg());Event.stopObserving(document,'mousedown',this.documentClickCache);Event.stopObserving(document,'keydown',this.documentKeyDownCache);this.formObserver.stop();this.formObserver=null;this.documentClickCache=null;Toolbox.toolboxVerticalHold=null;this.textarea.parentObj=null;var textarea=this.textarea;this.textarea=null;removeElement(textarea);textarea=null;var el=this.element;this.element=null;if(el)
{removeElement(el);}
el=null;},callBack:function(el,value)
{if(el&&el.parentObj)
{Toolbox.getInstance().holdPosition(1);var q=el.parentObj.questionObj;if(q.isLocked())
{QES_Global.handleEditWhenSurveyLocked();return false;}
var listType=el.parentObj.listType;var oldMetaMap=q.getSelectionDataMap(listType,'meta');var oldSeriesMap=q.getSelectionDataMap(listType,'series');var oldRecodeMap=q.getSelectionDataMap(listType,'recodeValue');var oldVariableMap=q.getSelectionDataMap(listType,'variableNaming');q[listType].length=0;q.addSelectionsByString(listType,value);q.restoreSelectionDataMap(listType,oldMetaMap,'meta');q.restoreSelectionDataMap(listType,oldSeriesMap,'series');q.restoreSelectionDataMap(listType,oldRecodeMap,'recodeValue');q.restoreSelectionDataMap(listType,oldVariableMap,'variableNaming');q.refreshCanvas();Toolbox.getInstance().update();Toolbox.getInstance().holdPosition(0);}}};window.QuestionTypeActions={iNavigator:null,questionPreviewData:null,showQuestionTypeMenu:function(el,evt,opt_callback)
{this.selectCallback=opt_callback||'';this.questionTypeMenu=Qualtrics.Menu.showMenu({className:'QuestionTypesMenu',items:[{onmouseover:'QuestionTypeActions.timeoutQuestionTypePreview',mouseOverObject:window,domNode:'QuestionTypeActions.buildQuestionTypeMenuDom()'}]},el,{onMenuClose:'QuestionTypeActions.onQuestionTypeMenuClose'},evt);},onQuestionTypeMenuClose:function()
{this.destroySubQuestionTypeMenu();this.menuDom=null;this.questionTypeMenu=null;if($('QuestionTypePreview'))
{$('QuestionTypePreview').remove();}},buildQuestionTypeMenuDom:function()
{if(inlineEditor.getInstance())
{inlineEditor.getInstance().removeInlineEditor();}
if(!this.questionPreviewData)
{new Ajax.Request('Ajax.php?action=getQTPreviewJSON',{onComplete:function(transport)
{try{QuestionTypeActions.questionPreviewData=transport.responseText.evalJSON();}
catch(e)
{console.error(e);}}});}
var uls={'Static':QBuilder('ul',{className:'Static',bubbleup:true}),'Standard':QBuilder('ul',{bubbleup:true}),'Specialty':QBuilder('ul',{bubbleup:true}),'Advanced':QBuilder('ul',{bubbleup:true})};if(Qualtrics.System.productName!='ThreeSixty'&&(typeof this.selectCallback!='string'||this.selectCallback.indexOf('addNewQuestionToBlock')==-1))
{uls['ReplaceFromLibrary']=QBuilder('ul',{bubbleup:true},[QBuilder('li',{className:'QuestionType Library',mouseupcallback:'QuestionTypeActions.showLibrary'},[QBuilder('div',{className:'TypeIcon Library',bubbleup:true}),QBuilder('div',{className:'Desc',bubbleup:true},getMessage('EditSection','QuestionLibrary'))])]);}
for(var type in QuestionTypes)
{if(QuestionTypes[type].Description&&QuestionTypes[type].QuestionTypeMenu||type=='DynamicMatrix'&&Qualtrics.supportMode)
{if(Qualtrics.System.productName=='ThreeSixty')
{if(Qualtrics.ThreeSixty.currentType=='360'&&!QuestionTypes[type]['ThreeSixty'])
{continue;}
if(Qualtrics.ThreeSixty.currentType=='EE'&&!QuestionTypes[type]['EE'])
{continue;}}
else if(QuestionTypes[type]['isEEOnly'])
{continue;}
var selectors=QuestionTypes.getDefaultSelectors(type)||{};var description=QuestionTypes[type].Description;var subListSelectors='';if(type=='DB')
{description=getMessage('EditSection','DescriptiveText');subListSelectors='PTB TB';}
var li=this.buildQuestionTypeMenuItem(type,selectors['selector']||'',selectors['subSelector']||'',description,subListSelectors);uls[QuestionTypes[type].QuestionTypeCategory||'Specialty'].appendChild(li);if(type=='DB')
{var previewType='GRB';var messageName='Graphic';if(Qualtrics.Features&&Qualtrics.Features['ThirdPartyVideo']){previewType='Media';messageName='Media';}
li=this.buildQuestionTypeMenuItem(type,'GRB','WOTXB',getMessage('SiteWide',messageName),previewType);uls['Static'].appendChild(li);}}}
var tbody=QBuilder('tbody',{bubbleup:true});for(var cat in uls)
{if($(uls[cat]).childElements().length>0)
{tbody.appendChild(QBuilder('tr',{bubbleup:true},[QBuilder('th',{bubbleup:true},getMessage('EditSection',cat)),QBuilder('td',{bubbleup:true},[uls[cat]])]));}}
tbody.lastChild.className+=' Last';this.menuDom=QBuilder('div',{className:(document.viewport.getWidth()<1200)?'Thin':'',id:'QuestionTypesMenu',bubbleup:true},[QBuilder('table',{bubbleup:true},[tbody])]);this.menuDom.onmouseout=QuestionTypeActions.timeoutQuestionTypePreview;return this.menuDom;},buildQuestionTypeMenuItem:function(type,selector,subSelector,description,opt_validSubTypes)
{opt_validSubTypes=opt_validSubTypes||'';var subMenu='';var hasPermission=BaseForm.getInstance().getQuestionPermission(type,true);if(hasPermission)
{subMenu=QBuilder('div',{className:'SubMenu',menupanemouseover:'QuestionTypeActions.setSubQuestionTypeMenuTimeout($el, $evt, '+type+', '+opt_validSubTypes+')',mouseupcallback:'QuestionTypeActions.showSubQuestionTypeMenu($el, $evt, '+type+', '+opt_validSubTypes+')'},[QBuilder('span',{bubbleup:true}),QBuilder('b',{bubbleup:true})]);}
return QBuilder('li',{className:type+' QuestionType '+selector+(hasPermission?'':' Disabled'),id:'qt-'+type,questionType:type,selector:selector,subSelector:subSelector,mouseupcallback:'QuestionTypeActions.menuClickHandler($evt, $el)',menupanemouseover:'QuestionTypeActions.setPreviewTimeout($el)'},[QBuilder('div',{className:'TypeIcon '+type,bubbleup:true}),QBuilder('div',{className:'Desc',bubbleup:true},description),subMenu]);},menuClickHandler:function(evt,el)
{var type=el.getAttribute('questiontype');if(!BaseForm.getInstance().getQuestionPermission(type))
{Qualtrics.Menu.keepMenuOpen();return;}
if(!!this.selectCallback)
Qualtrics.Event.executeDotSyntax(this.selectCallback,null,null,null,{'$evt':evt,'$el':el});if(el.tagName=='A')
{this.questionTypeMenu.destroy();}},setSubQuestionTypeMenuTimeout:function(el,evt,type,validSubTypes)
{if(this.subMenuType!=type)
this.destroySubQuestionTypeMenu();if(!this.subMenuTimeout)
{this.subMenuType=type;this.subMenuTimeout=setTimeout(QuestionTypeActions.showSubQuestionTypeMenu.bind(this,el,evt,type,validSubTypes),450);}},showSubQuestionTypeMenu:function(el,evt,type,validSubTypes)
{Qualtrics.Menu.keepMenuOpen();this.destroySubQuestionTypeMenu();el.parentNode.className+=' Highlight';var callback=el.parentNode.getAttribute('mouseupcallback');this.subMenu=Qualtrics.Menu.showMenu('QuestionTypeActions.buildSubQuestionTypeMenu('+type+', '+validSubTypes+','+callback+')',el,{menuWithinMenu:true,onMenuClose:'QuestionTypeActions.removeHighlightClass($menuPane)'});this.subMenu.menuDom.onmouseout=QuestionTypeActions.timeoutQuestionTypePreview;},removeHighlightClass:function(menu)
{$(menu.parentButton.parentNode).removeClassName('Highlight');},destroySubQuestionTypeMenu:function(evt)
{if(this.subMenuTimeout)
{clearTimeout(this.subMenuTimeout);this.subMenuTimeout=null;}
if(this.subMenu)
{this.subMenu.destroy();this.subMenu=null;}},buildSubQuestionTypeMenu:function(type,validSelectors,callback)
{var acceptAll=false;var extraParams=[];if(type=="DB"&&validSelectors=="Media")
{if(this.questionPreviewData&&this.questionPreviewData["Media"])
{type="Media";extraParams=['VideosEmbed','Videos'];acceptAll=true;}}
var examples=QuestionTypeActions.getFlattenedPreviewExamples(type);var items=[];validSelectors=(!validSelectors)?false:validSelectors.split(' ');for(var i=0,len=examples.length;i<len;i++)
{if(!acceptAll&&validSelectors&&validSelectors.indexOf(examples[i].Selector)<0)
{continue;}
var item={label:examples[i].QuestionDescription,action:callback,onmouseover:'QuestionTypeActions.setPreviewTimeout($el,,true)',mouseOverObject:window,parameters:{questiontype:examples[i].QuestionType,selector:examples[i].Selector,subselector:examples[i].SubSelector}};for(var j=0;j<extraParams.length;j++)
{var param=extraParams[j];if(examples[i][param])
{item.parameters[param]=examples[i][param];}
item.parameters['_PreviewDataType']=type;}
items.push(item);}
return{items:items};},setPreviewTimeout:function(el,opt_useParent,opt_useSubMenu,opt_resizeOnly)
{if(this.previewTimeout)
clearTimeout(this.previewTimeout);this.previewTimeout=setTimeout(this.previewQuestionType.bind(this,el,opt_useParent,opt_useSubMenu,opt_resizeOnly),50);},previewQuestionType:function(el,opt_useParent,opt_useSubMenu,opt_resizeOnly)
{if(opt_useParent)
el=el.parentNode;if(!opt_useSubMenu&&!$(el).hasClassName('Highlight'))
this.destroySubQuestionTypeMenu();var type=el.getAttribute('questiontype');var previewType=el.getAttribute('_PreviewDataType');if(previewType)
{type=previewType;}
var menuDom=((!opt_useSubMenu?this.questionTypeMenu:this.subMenu)||{}).menuDom;if(!type||!menuDom)
return;if(QuestionTypeActions.removePreview)
{clearTimeout(QuestionTypeActions.removePreview);QuestionTypeActions.removePreview=null;}
var selector=el.getAttribute('selector')||'';var subSelector=el.getAttribute('subSelector')||'';if(!opt_resizeOnly&&type+'_'+selector+'_'+subSelector==this.currentPreviewType)
{return;}
this.currentPreviewType=type+'_'+selector+'_'+subSelector;var menuOffset=$(menuDom).cumulativeOffset();var skinWidth=570;var rightClass='';if(menuOffset.left<610)
{var rightSide=$(menuDom).offsetWidth+menuOffset.left;var winWidth=document.viewport.getWidth();if(rightSide+610<winWidth)
{rightClass='Right';}
else if(winWidth-rightSide>menuOffset.left)
{skinWidth=winWidth-rightSide-50;rightClass='Right';}
else
{skinWidth=menuOffset.left-50;}}
if(!$('QuestionTypePreview'))
{$('pageDiv').appendChild(QBuilder('div',{id:'QuestionTypePreview'},[QBuilder('div',{className:'PreviewInner Skin'}),QBuilder('div',{className:'Background'}),QBuilder('div',{className:'Arrow'},[QBuilder('b')])]));}
var prevDom=$('QuestionTypePreview');var div=QBuilder('div',{className:'PreviewInner Skin'});if(opt_resizeOnly)
{div=prevDom.down('.PreviewInner').replace(div);}
else
{var previewQuestion=this.buildPreviewQuestion(type,selector,subSelector);previewQuestion.renderCanvas({parentElement:div,skinWidth:skinWidth});}
var imgs=$(div).select('img');imgs.each(function(img){if(!img.complete)
img.onload=QuestionTypeActions.previewQuestionType.bind(QuestionTypeActions,el,opt_useParent,opt_useSubMenu,true);});QualtricsTools.addToHiddenHelper(div);if(previewQuestion&&typeof previewQuestion.onLoad=='function')
{previewQuestion.onLoad();}
var qWidth=$(div).offsetWidth+30;var qHeight=$(div).offsetHeight+30;prevDom.down('.PreviewInner').replace(div);var elOffset=$(el).cumulativeOffset();var left=menuOffset.left-qWidth-10;if(rightClass=='Right')
{left=$(menuDom).offsetWidth+menuOffset.left+10;}
var top=elOffset.top+el.offsetHeight/2-qHeight/2-$(menuDom).down('ul').scrollTop;$(prevDom).setStyle({left:left+'px',top:top+'px',width:qWidth+'px',height:qHeight+'px'});$('QuestionTypePreview').className='Visible '+rightClass;},buildPreviewQuestion:function(type,selector,subSelector)
{deleteChildren(this.previewArea);var previewQuestionObj=new Question(null,true);previewQuestionObj.showEditLinksInPreview=false;previewQuestionObj.previewMode=1;if(this.questionPreviewData)
{if(this.questionPreviewData[type])
{if(selector&&this.questionPreviewData[type][selector])
{var definition=this.questionPreviewData[type][selector];if(subSelector&&this.questionPreviewData[type][selector][subSelector])
{definition=this.questionPreviewData[type][selector][subSelector];}}
if(definition['QuestionType'])
{var qData={};qData.Type='Question';qData.QuestionDefinition=definition;previewQuestionObj.generate(qData);previewQuestionObj.unpackage();}
else
{new QES_Error('no selector for an example '+type);}}
else
{}}
return previewQuestionObj;},timeoutQuestionTypePreview:function()
{if(QuestionTypeActions.removePreview)
return;QuestionTypeActions.removePreview=setTimeout(QuestionTypeActions.hideQuestionTypePreview,150);},hideQuestionTypePreview:function()
{QuestionTypeActions.currentPreviewType=null;var preview=$('QuestionTypePreview');if(!preview)
return;preview.className='';},getFlattenedPreviewExamples:function(opt_startIndex)
{var exampleData=this.questionPreviewData;if(!!opt_startIndex&&exampleData[opt_startIndex])
exampleData=exampleData[opt_startIndex];exampleData=$H(exampleData);var flattenedExamples=new Array();var walk=function(obj,level){if(level>5)
{return;}
for(var item in obj)
{var child=obj[item];if(child)
{if(typeof child=='object')
{if(child['QuestionDescription'])
{flattenedExamples.push(child);}
else
{walk(child,level+1);}}}}};walk(exampleData,0);return flattenedExamples;},showLibrary:function()
{if(BaseForm.getInstance().revisionId)
{return;}
var win=new Q_Window('AddQuestionFromLibrary',{width:'910',height:'92%',closeButton:true});var opts={executeFunction:this.changeQuestionDefinitionWithAnimation.bind(this,win),returnFunction:Q_Window.closeWindow.curry('AddQuestionFromLibrary'),returnText:getMessage('SiteWide','Cancel')};QModules.loadModule('inavigator.js');QuestionTypeActions.iNavigator=new INavigator(win.innerElement,opts);},changeQuestionDefinitionWithAnimation:function(win,newDefinition)
{win.close();var questionObj=Toolbox.getInstance().questionObj;var newQuestionObj=new Question();newQuestionObj.generate({Type:'Question',QuestionDefinition:newDefinition});newQuestionObj.unpackage();var position=questionObj.getPosition();questionObj.parentObj.questions[position]=newQuestionObj;newQuestionObj.questionId=questionObj.questionId;newQuestionObj.exportTag=questionObj.exportTag;newQuestionObj.parentObj=questionObj.parentObj;newQuestionObj.previewMode=1;newQuestionObj.setEdited();new Effect.DropOut(questionObj.element,{duration:0.5,afterFinish:function()
{var trash=Survey.getInstance().getTrash();if(trash)
{trash.addQuestion(questionObj);questionObj.render();}
newQuestionObj.refreshQuestion({opacity:0});QuestionActions.select(newQuestionObj);new Effect.Appear(newQuestionObj.element,{duration:1});}});}};window.CanvasActions={sfClient:null,initSFClient:function(sfClient)
{this.sfClient=JSON.parse(sfClient);},sendSurveyCompleteEvent:function()
{QES_Global.saveSurvey(false);if(this.sfClient&&Sfdc)
{try
{Sfdc.canvas.client.publish(this.sfClient,{name:"qualtrics.editSurvey",payload:{status:'Completed'}});}
catch(err)
{console.log(err);}}},sendSurveyBackEvent:function()
{QES_Global.saveSurvey(false);if(this.sfClient&&Sfdc)
{try
{Sfdc.canvas.client.publish(this.sfClient,{name:"qualtrics.backEditSurvey",payload:{status:'Completed'}});}
catch(err)
{console.log(err);}}},sendResponseMappingsCompleteEvent:function()
{QES_Global.saveSurvey(false);if(this.sfClient&&Sfdc)
{try
{Sfdc.canvas.client.publish(this.sfClient,{name:"qualtrics.editMappings",payload:{status:'Completed'}});}
catch(err)
{console.log(err);}}},sendResponseMappingsCancelEvent:function()
{QES_Global.saveSurvey(false);if(this.sfClient&&Sfdc)
{try
{Sfdc.canvas.client.publish(this.sfClient,{name:"qualtrics.cancelMappingsEdit",payload:{status:'Completed'}});}
catch(err)
{console.log(err);}}}};window.ToolboxActions={performQuestionAction:function(action,p1,p2)
{var questionObj=Toolbox.getInstance().questionObj;if(questionObj[action])
{return questionObj[action](p1,p2);}},previewToggle:function(questionObj,clickedEl)
{var p1=clickedEl.getAttribute('p1');questionObj.togglePreview(p1);questionObj.refreshQuestion();},highlightResponseScaleBox:function(axis,opt_color)
{if($('ResponseScalesBox_'+axis))
{var color=opt_color||'#7197F0';Effect.Queues.get('responsescales').each(function(e){e.cancel()});new Effect.Highlight($('ResponseScalesBox_'+axis),{startcolor:color,endcolor:'#404F70',restorecolor:'#404F70',duration:0.6,afterFinish:function(){if($('ResponseScalesBox_'+axis))
{$('ResponseScalesBox_'+axis).setStyle({backgroundImage:'',backgroundColor:''});}},queue:{position:'start',scope:'responsescales',limit:1}});}},addY:function(questionObj)
{return ToolboxActions.addSelection(questionObj,'Y');},addX:function(questionObj)
{return ToolboxActions.addSelection(questionObj,'X');},addSelection:function(questionObj,axis)
{if(!Survey.getInstance().getPermission('editQuestions'))
{return;}
var undoPkg=questionObj.getUndoPkg();var listType=questionObj['get'+axis]().listType;questionObj.smartAddSelection(listType);questionObj.resetSelectionIdsIfNoResponses(listType);questionObj.refreshCanvas();questionObj.refreshDependencies();questionObj.updateSkipLogic();questionObj.checkForHeightShift();Toolbox.getInstance().update();questionObj.addUndo(undoPkg,questionObj.getUndoPkg());return false;},removeY:function(questionObj)
{return ToolboxActions.removeSelection(questionObj,'Y');},removeX:function(questionObj)
{return ToolboxActions.removeSelection(questionObj,'X');},removeSelection:function(questionObj,axis){if(!Survey.getInstance().getPermission('editQuestions'))
{return;}
var undoPkg=questionObj.getUndoPkg();var listType=questionObj['get'+axis]().listType;var result=questionObj.smartRemoveSelection(listType);if(!result)
{return false;}
questionObj.resetSelectionIdsIfNoResponses(listType);questionObj.refreshCanvas();questionObj.refreshDependencies();questionObj.updateSkipLogic();questionObj.checkForHeightShift();Toolbox.getInstance().refresh();questionObj.addUndo(undoPkg,questionObj.getUndoPkg());return false;},getSelectionToRemove:function(listType,questionObj)
{var uneditedSelection=null;if(questionObj[listType].length>0)
{for(var i=0,len=questionObj[listType].length;i<len;++i)
{var selection=questionObj[listType][i];if(selection.getEdited()===0&&!selection.auto)
{uneditedSelection=selection;}}
if(uneditedSelection)
{return uneditedSelection;}
return selection;}},editMultipleX:function(questionObj,button,toolboxObj)
{questionObj.gradingData=[];QES_Global.saveSurvey(false);ToolboxActions.editMultiple('x',questionObj,button,toolboxObj);},editMultipleY:function(questionObj,button,toolboxObj)
{questionObj.gradingData=[];QES_Global.saveSurvey(false);ToolboxActions.editMultiple('y',questionObj,button,toolboxObj);},editMultiple:function(axis,questionObj,button,toolboxObj)
{if(!Survey.getInstance().getPermission('editQuestions'))
{return;}
new FunnelEditBox(axis,questionObj,button,toolboxObj);},toggleAutoResponseScalesY:function(questionObj)
{ToolboxActions.toggleAutoResponseScales(questionObj,'y');},toggleAutoResponseScalesX:function(questionObj)
{ToolboxActions.toggleAutoResponseScales(questionObj,'x');},toggleAutoResponseScales:function(questionObj,axis)
{questionObj.toggleAutoResponseScales(axis);questionObj.refreshQuestion();},showMoreOptions:function(questionObj,clickedEl)
{var questionType=questionObj.questionType;var section=clickedEl.getAttribute('section');var sections=(QuestionTypes[questionType]&&QuestionTypes[questionType].questionOptions&&QuestionTypes[questionType].questionOptions.sections);if(sections&&sections[section])
{sections[section].showHidden=1;questionObj.refreshQuestion();}},showLessOptions:function(questionObj,clickedEl)
{var questionType=questionObj.questionType;var section=clickedEl.getAttribute('section');var sections=(QuestionTypes[questionType]&&QuestionTypes[questionType].questionOptions&&QuestionTypes[questionType].questionOptions.sections);if(sections&&sections[section])
{sections[section].showHidden=0;questionObj.refreshQuestion();}},showCustomValidation:function(questionObj)
{if(BaseForm.getInstance().revisionId)
{return;}
if(this.showingCustomValidation)
return;if(questionObj.isLocked())
{QES_Global.handleEditWhenSurveyLocked();return;}
this.showingCustomValidation=true;questionObj.setOption('validation','CustomValidation');if(!$('validation_CustomValidation').checked)
{$('validation_CustomValidation').click();}
QModules.loadModule('logiceditor.js');QModules.loadModule('messageselector.js');questionObj.save({asynchronous:false});var popup=new Q_Window('CustomValidation',{title:getMessage('CustomValidation'),width:'auto',buttons:[{icon:'cancel',text:getMessage('SiteWide','Cancel'),className:'negative',click:'ToolboxActions.closeCustomValidation'},{icon:'check',text:getMessage('SiteWide','Save'),className:'positive',click:'ToolboxActions.saveCustomValidation'}]});var customVal=questionObj.options.CustomValidation;var data=customVal&&customVal.Logic||{Type:'BooleanExpression',0:{Type:'If',0:{LogicType:'Question',QuestionID:questionObj.questionId,QuestionIDFromLocator:questionObj.questionId}}};var schema=new Q_LogicEditorSchema();schema.addElement(Qualtrics.schemaElementLibrary.Question);this.validationLogicEditor=new Q_LogicEditor(this,this.validationLogicRefresh,data,{schema:schema});this.validationLogicEditor.blockId=questionObj.parentObj.blockId;this.validationLogicEditor.useQMenus=true;this.validationLogicEditor.minExpressions=1;this.validationLogicEditor.clearCache();var logicEditorDiv=QBuilder('div',{className:'ValidationLogicEditor'},[QBuilder('div',{className:'HelpHeader',id:'ValidationConditionDiv'},getMessage('EditSection','ValidationWillPass')),this.validationLogicEditor.build()]);var messageData=customVal&&customVal.Message;var lid=null;var mid=null;var smid=null;var buttonText=getMessage('DistributeSection','LoadSavedMessage');if(messageData)
{lid=messageData.libraryID;mid=messageData.messageID;smid=messageData.subMessageID;buttonText=messageData.description;}
var VMOptions={buttonText:buttonText,lid:lid,mid:mid,smid:smid,categories:['MVD'],className:'menuButton',showSubMessages:true,onSelect:this.getSubMessage};this.validationMessageSelector=new Qualtrics.MessageSelector(VMOptions);var messageSelectorDiv=QBuilder('div',{className:'ValidationMessageSelector'},[QBuilder('span',{className:'HelpHeader',id:'ValidationMessageSpan'},getMessage('EditSection','ChooseFailureMessage')),this.validationMessageSelector.build()]);var content=QBuilder('div',{className:'ValidationLogicDiv'},[logicEditorDiv,messageSelectorDiv]);popup.setContent(content);popup.center();},closeCustomValidation:function()
{var questionObj=Toolbox.getInstance().questionObj;if(!questionObj.options.CustomValidation)
{questionObj.setOption('validation','None');questionObj.refresh();Toolbox.getInstance().refresh();questionObj.setSaved(false);}
Q_Window.closeWindow('CustomValidation');this.validationLogicEditor=undefined;this.showingCustomValidation=undefined;},saveCustomValidation:function()
{var messageData=this.validationMessageSelector.getData();if(messageData.subMessageID&&this.validationLogicEditor.validate())
{$('ValidationConditionDiv').removeClassName('errorBanner');$('ValidationMessageSpan').removeClassName('errorBanner');var questionObj=Toolbox.getInstance().questionObj;questionObj.options.CustomValidation={Logic:this.validationLogicEditor.getData(),Message:messageData};this.validationLogicEditor=undefined;this.validationMessageSelector=undefined;questionObj.refresh();questionObj.setSaved(false);Q_Window.closeWindow('CustomValidation');this.showingCustomValidation=undefined;return;}
if(!messageData.subMessageID)
$('ValidationMessageSpan').addClassName('errorBanner');else
$('ValidationMessageSpan').removeClassName('errorBanner');if(!this.validationLogicEditor.validate())
$('ValidationConditionDiv').addClassName('errorBanner');else
$('ValidationConditionDiv').removeClassName('errorBanner');},validationLogicRefresh:function(logicEditor,byUser)
{if(byUser)
{var expressions=logicEditor.getAllExpressions();if(expressions.length<1)
{logicEditor.generate();}
else if(logicEditor.validate())
$('ValidationConditionDiv').removeClassName('errorBanner');}
Q_Window.getInstance().center();},getSubMessage:function(lid,id)
{var messageSelector=ToolboxActions.validationMessageSelector;if(!messageSelector.subMessageID)
{new Ajax.Request('Ajax.php?action=getMessage',{parameters:{LID:lid,MID:id},onSuccess:function(transport)
{var message=Qualtrics.parseJSON(transport.responseText,true);var errors=message.Errors;if(errors.length!==undefined)
{messageSelector.reset();return;}
var numErrors=0;var errorArray=[];for(var error in errors)
{errorArray.push(error);numErrors++;}
if(numErrors==1)
{if(errorArray[0].substring(3,20)=='CUSTOM_VALIDATION')
var display=message.Custom[errorArray[0]];else
display=MessageEditor.validationErrors[errorArray[0]].Attributes.hint;messageSelector.selectMessage(lid,id,display,errorArray[0]);}
else
{ToolboxActions.customErrors=message;var popup=new Q_Window('GetSubMessage',{title:' ',width:'auto',buttons:[{icon:'cancel',text:'Cancel',className:'negative',click:'ToolboxActions.cancelSubMessage'}]});var content=QBuilder('div',{},[Qualtrics.Menu.buildMenuButton(getMessage('EditSection','SelectValidationMessage')+'...','ToolboxActions.buildSubMessageMenu',{className:'SelectMenuButton'})]);popup.setContent(content);popup.center();}}});}},buildSubMessageMenu:function()
{var items=[];for(var error in ToolboxActions.customErrors.Errors)
{if(error.substring(3,20)=='CUSTOM_VALIDATION')
var display=ToolboxActions.customErrors.Custom[error];else
display=MessageEditor.validationErrors[error].Attributes.hint;items.push({display:display,action:'ToolboxActions.selectSubMessage('+error+')'});}
return{items:items};},selectSubMessage:function(error)
{var messageSelector=ToolboxActions.validationMessageSelector;var data=messageSelector.getData();if(error.substring(3,20)=='CUSTOM_VALIDATION')
var display=ToolboxActions.customErrors.Custom[error];else
display=MessageEditor.validationErrors[error].Attributes.hint;messageSelector.selectMessage(data.libraryID,data.messageID,display,error);Q_Window.closeWindow('GetSubMessage');},cancelSubMessage:function()
{delete ToolboxActions.customErrors;ToolboxActions.validationMessageSelector.reset();Q_Window.closeWindow('GetSubMessage');},viewQuestion:function(questionObj)
{var lang=BaseForm.getInstance().defaultLanguage;questionObj.openPreview(lang);},setOptionAndRefreshQuestion:function(el)
{Toolbox.getInstance().questionObj.setOption(el.getAttribute('sectionname'),el.value,null,null,true);},getOptionValue:function(sectionName)
{return Toolbox.getInstance().questionObj.options[sectionName];},addPageBreak:function(questionObj)
{if(BaseForm.getInstance().revisionId)
{return;}
if(questionObj.isLocked()===1)
{QES_Global.handleEditWhenSurveyLocked();return;}
QES_Global.saveSurvey(false);var position=questionObj.getPosition();var q=new Question(null,true);q.elementType='Page Break';questionObj.parentObj.addQuestion(q,position+1);q.save();q.render();},addSkipLogic:function(questionObj)
{questionObj.addSkipLogic();},addDisplayLogic:function(questionObj)
{questionObj.addDisplayLogic(0,1);},copyQuestion:function(questionObj)
{ToolboxActions.copyQuestions();return;},addQuestionNote:function(questionObj)
{questionObj.addNotes();},groupQuestions:function()
{if(QES_Global.suspendSelects)
{return;}
QES_Global.saveSurvey(false);var selectedList=QuestionActions.selectedRegistry;var pivotQuestion=QuestionActions.lastSelected;var hasSkipLogic=false;var spansMultipleBlocks=false;if(pivotQuestion)
{for(var i=0,len=selectedList.length;i<len;++i)
{var q=selectedList[i];if(q.isLocked())
{msg(getMessage('EditSection','Locked'),'locked');return;}
var iPos=q.getPosition();var oldBlock=q.parentObj;if(!q.tmpMoveData)
{q.tmpMoveData={oldBID:oldBlock.blockId,oldPos:iPos};}}
var selectPos=QuestionActions.selectedRegistry.length-1;var blockIdCheck=selectedList[0].parentObj.id;for(i=0,len=selectedList.length;i<len;++i)
{q=selectedList[i];if(q.hasSkipLogic())
{hasSkipLogic=true;}
if(q.parentObj.id!=blockIdCheck)
{spansMultipleBlocks=true;}
blockIdCheck=q.parentObj.id;if(q.id==pivotQuestion.id)
{selectPos=i;}}
if(spansMultipleBlocks&&hasSkipLogic)
{msg(getMessage('EditSection','CannotGroupQuestionsWithSkipLogicOutsideBlock'));return false;}
pivotQuestion=selectedList[selectPos];var pivotBlock=pivotQuestion.parentObj;var insertOffset=0;for(i=0,len=selectedList.length;i<len;++i)
{q=selectedList[i];var pivotQuestionPos=pivotQuestion.getPosition();iPos=q.getPosition();if(i<selectPos)
{q.parentObj.questions.splice(iPos,1);var newPos=pivotQuestionPos;if(q.parentObj.id==pivotBlock.id)
{newPos=pivotQuestionPos-1;}
if(newPos<0)newPos=0;pivotQuestion.parentObj.questions.splice(newPos,0,q);q.parentObj=pivotQuestion.parentObj;q.refreshQuestion();QuestionActions.select(q,null,true,true);}
else if(i>selectPos)
{insertOffset++;iPos=q.getPosition();q.parentObj.questions.splice(iPos,1);newPos=pivotQuestionPos+insertOffset;pivotQuestion.parentObj.questions.splice(newPos,0,q);q.parentObj=pivotQuestion.parentObj;q.refreshQuestion();QuestionActions.select(q,null,true,true);}
QuestionActions.addToMoveQueue(q);}
QuestionActions.executeMoves({batchMove:true});}},getMoveQuestionPlacementFunction:function(selectedList)
{return function(){QuestionTopCache={};Toolbox.getInstance().updatePosition();var placer=new PlacementChooser(selectedList);QES_Global.suspendOvers=false;placer.onPlace=function(questions){var oldBlockId=questions[0].tmpMoveData.oldBID;var oldPos=questions[0].tmpMoveData.oldPos;var oldBlock=Survey.getInstance().getBlockByBlockId(oldBlockId);var oldBlockPos=oldBlock.getPosition();var oldDecimalPos=Number(oldBlockPos+'.'+oldPos);var blockPos=questions[0].parentObj.getPosition();var pos=questions[0].getPosition();var currentDecimalPos=Number(blockPos+'.'+pos);if(currentDecimalPos<oldDecimalPos)
{for(var i=0,len=questions.length;i<len;++i)
{var questionObj=questions[i];QuestionActions.addToMoveQueue(questionObj);Survey.getInstance().checkForEmptyBlocks();}}
else
{for(i=questions.length-1;i>-1;--i)
{questionObj=questions[i];QuestionActions.addToMoveQueue(questionObj);Survey.getInstance().checkForEmptyBlocks();}}
QuestionActions.executeMoves({batchMove:true});};placer.beforeUpdate=function(questions,targetQuestion)
{var hasSkipLogic=false;for(var i=0,len=questions.length;i<len;++i)
{var questionObj=questions[i];if(questionObj.hasSkipLogic())
{hasSkipLogic=true;}}
if(hasSkipLogic)
{var currentBlock=questions[0].parentObj;if(targetQuestion.parentObj.id!=currentBlock.id)
{placer.color='#FF0000';msg(getMessage('EditSection','CannotMoveQuestionsWithSkipLogicOutsideBlock'));return false;}
else
{placer.color=null;}}};};},moveQuestion:function()
{ToolboxActions.moveQuestions();},moveQuestions:function()
{if(!Survey.getInstance().getPermission('editQuestions'))
{return;}
QES_Global.saveSurvey(false);QES_Global.suspendOvers=true;var selectedList=QuestionActions.selectedRegistry;for(var i=0,len=selectedList.length;i<len;++i)
{var questionObj=selectedList[i];if(questionObj.parentObj.isLocked())
{msg(getMessage('EditSection','Locked'),'locked');return;}
if(!questionObj.tmpMoveData)
{questionObj.tmpMoveData={oldBID:questionObj.parentObj.blockId,oldPos:questionObj.getPosition()};}}
var parallelList=[];for(i=0,len=selectedList.length;i<len;++i)
{questionObj=selectedList[i];if(questionObj.elementType=='Question')
{questionObj.height=null;if(questionObj.selectConnector)
{removeElement(questionObj.selectConnector);}
$(questionObj.element).setStyle({overflow:'hidden'});if(questionObj.questionCanvas)
{parallelList.push(new Effect.Fade(questionObj.questionCanvas,{sync:true}));}
parallelList.push(new Effect.Morph(questionObj.element,{sync:true,style:'height:60px'}));}}
var pageDim=getPageSize();var windowHeight=pageDim[3];parallelList.push(new Effect.ScrollTo(selectedList[0].element,{sync:true,offset:-(windowHeight*0.2)}));new Effect.Parallel(parallelList,{duration:0.6,afterFinish:ToolboxActions.getMoveQuestionPlacementFunction(selectedList)});},copyQuestions:function()
{if(QES_Global.suspendSelects)
{return;}
if(!Survey.getInstance().getPermission('editQuestions')||!Survey.getInstance().getPermission('copySurveyQuestions'))
{return;}
var selectedList=QuestionActions.selectedRegistry;var lastQuestion=selectedList[selectedList.length-1];var position=lastQuestion.getPosition();var newList=[];var hasDD=false;for(var j=0;j<selectedList.length;j++)
{if(selectedList[j].questionType=='DD')
{hasDD=true;break;}}
if(hasDD)
{ToolboxActions.copyQuestionsAjax();return;}
var questionsMoved=0;for(var i=0,len=selectedList.length;i<len;++i)
{var questionObj=selectedList[i];if(questionObj.isLocked())
{msg(getMessage('EditSection','Locked'),'locked');return;}
if(questionObj.elementType=='Question')
{var q=questionObj.clone();if(!BaseForm.getInstance().getPermission('addNewQuestion'))
break;lastQuestion.parentObj.addQuestion(q,position+questionsMoved+1);q.unpackage();q.render();newList.push(q);q.setSaved(0);Survey.getInstance().questionCount++;questionsMoved++;}}
QuestionActions.unselectAll();for(i=0,len=newList.length;i<len;++i)
{QuestionActions.select(newList[i],null,true);}},copyQuestionsAjax:function()
{if(QES_Global.suspendSelects)
{return;}
QES_Global.saveSurvey(false);var selectedList=QuestionActions.selectedRegistry;var lastQuestion=selectedList[selectedList.length-1];var position=lastQuestion.getPosition();var newList=[];var ids=[];for(var i=selectedList.length-1;i>-1;--i)
{var questionObj=selectedList[i];if(questionObj.elementType=='Question')
{var q=new Question();lastQuestion.parentObj.addQuestion(q,position+1);q.render();q.setSaved(0);q.selected=0;newList.push(q);ids.push(questionObj.questionId);}}
var idsString=Object.toJSON(ids);var surveyId=BaseForm.getInstance().id;new Ajax.Request('Ajax.php?action=CopyAndGetQuestionsJSON',{method:'post',parameters:{SurveyID:surveyId,QIDs:idsString,Pos:position+1,BID:lastQuestion.parentObj.blockId},asynchronous:false,onComplete:function(transport)
{try
{var responseJSON=transport.responseText.evalJSON();if(responseJSON)
{var defList=responseJSON.toArray();for(var i=0,len=defList.length;i<len;++i)
{var qData=defList[i];var q=newList[i];q.generate(qData);q.unpackage();q.setSaved(true,null,true);q.refreshQuestion();Toolbox.getInstance().render();}
QES_Global.saveSurvey(false);}
else
{throw('Question could not be copied');}}
catch(e)
{throw('Question could not be copied, response was: '+transport.responseText);}}});QuestionActions.unselectAll();for(i=0,len=newList.length;i<len;++i)
{q=newList[i];QuestionActions.select(q,null,true);}},removeQuestions:function()
{QES_Global.saveSurvey(false);if(QES_Global.suspendSelects)
{return;}
var selectedList=QuestionActions.selectedRegistry;for(var i=0,len=selectedList.length;i<len;++i)
{if(selectedList[i].isLocked())
{continue;}
if(!selectedList[i].tmpMoveData)
{selectedList[i].tmpMoveData={oldBID:selectedList[i].parentObj.blockId,oldPos:selectedList[i].getPosition()};}}
for(var i=0,len=selectedList.length;i<len;++i)
{var questionObj=selectedList[i];if(questionObj.isLocked())
{continue;}
if(questionObj.elementType=='Question')
{questionObj.sendToTrash(true);}
else
{questionObj.sendToTrash(true);}}
QuestionActions.executeMoves({batchMove:true});QuestionActions.unselectAll();},moveQuestionsToNewBlock:function()
{var selectedList=QuestionActions.selectedRegistry;for(var i=0,len=selectedList.length;i<len;++i)
{if(selectedList[i].isLocked())
{QES_Global.handleEditWhenSurveyLocked();return;}}
if(QES_Global.suspendSelects)
{return;}
QES_Global.saveSurvey(false);var moveQuestionsFunction=function(newBlock)
{var selectedList=QuestionActions.selectedRegistry;for(var i=0,len=selectedList.length;i<len;++i)
{if(!selectedList[i].tmpMoveData)
{selectedList[i].tmpMoveData={oldBID:selectedList[i].parentObj.blockId,oldPos:selectedList[i].getPosition()};}}
for(i=0,len=selectedList.length;i<len;++i)
{var q=selectedList[i];QuestionActions.moveToBlock(q,newBlock);q.refreshQuestion({ignoreSkipLogic:true});}
for(i=0,len=selectedList.length;i<len;++i)
selectedList[i].refreshSkipLogic(false,null);newBlock.checkForEmptyBlock();QuestionActions.executeMoves({batchMove:true});};addBlock({afterFinish:moveQuestionsFunction});}};QualtricsCPTools.Highlighter.highlightSelection=function(selectionObj,options)
{QualtricsCPTools.Highlighter.autoHighlight($(selectionObj.id),options);};window.PlacementChooser=Class.create();PlacementChooser.placementChooserObj=null;PlacementChooser.scan=function()
{if(QES_OverQuestion.questionObj)
{if(QES_OverQuestion.questionObj.placementTag)
{return;}
var id=QES_OverQuestion.questionObj.id;var delta=0;if(QES_OverQuestion.questionObj.objType=='Question')
{var top=QES_OverQuestion.questionObj.getTop();var relativeMouseY=mousePos[1]-top;var height=QES_OverQuestion.questionObj.getHeight();var percent=relativeMouseY/height;if(percent>0.5)
{delta=1;}}
if(PlacementChooser.placementChooserObj.currentId+PlacementChooser.placementChooserObj.currentDelta!=id+delta)
{PlacementChooser.placementChooserObj.currentDelta=delta;PlacementChooser.placementChooserObj.currentId=id;PlacementChooser.placementChooserObj.refresh();}}};PlacementChooser.getPlaceFunction=function(){return function(){PlacementChooser.placementChooserObj.place();};};PlacementChooser.prototype={objectsToPlace:[],currentDelta:null,currentId:null,scroller:null,callbackRestore:null,color:null,clearCallbackRestore:null,initialize:function(objectsToPlace)
{if(PlacementChooser.placementChooserObj)
{return;}
this.objectsToPlace=objectsToPlace;QES_Global.suspendSelects=true;PlacementChooser.placementChooserObj=this;this.callbackRestore=QES_OverQuestion.callback;this.clearCallbackRestore=QES_OverQuestion.clearCallback;QES_OverQuestion.callback=['PlacementChooser','scan'];QES_OverQuestion.clearCallback=null;QES_OverQuestion.alwaysUpdate=true;QES_Global.suspendOverBorders=true;for(var i=0,len=this.objectsToPlace.length;i<len;++i)
{this.objectsToPlace[i].placementTag=1;this.objectsToPlace[i].height=null;}
this.lastY=mousePos[1];QuestionActions.clearIcons();this.refresh(this.objectsToPlace[0]);},refresh:function(forceInitialQuestion)
{if(this.scroller)
{this.scroller.cancel();}
if(!this.objectsToPlace.length)
{this.endPlacement();return;}
if(this.objectsToPlace&&!this.objectsToPlace[0].element)
{this.endPlacement();return;}
var overQuestion=QES_OverQuestion.questionObj||forceInitialQuestion;if(overQuestion)
{if(QES_OverQuestion.questionObj&&QES_OverQuestion.questionObj.isLocked())
{msg(getMessage('EditSection','Locked'),'locked');return;}
var okToMove=true;if(this.beforeUpdate)
{if(this.beforeUpdate(this.objectsToPlace,overQuestion)===false)
{okToMove=false;}}
if(overQuestion.objType=='Question')
{var mouseBlock=overQuestion.parentObj;var mouseQuestionPos=overQuestion.getPosition(true);}
else if(overQuestion.objType=='Block')
{var mouseBlock=overQuestion;if(mouseBlock.questions.length>0)
{return;}
mouseQuestionPos=0;}
if(okToMove)
{QualtricsCPTools.Highlighter.removeAll();for(var i=0,len=this.objectsToPlace.length;i<len;++i)
{var pos=this.objectsToPlace[i].getPosition();this.objectsToPlace[i].parentObj.questions.splice(pos,1);if(this.objectsToPlace[i].element)
{this.objectsToPlace[i].removeQuestionDOM();}}
for(i=0,len=this.objectsToPlace.length;i<len;++i)
{var placementPos=mouseQuestionPos+this.currentDelta+i;mouseBlock.questions.splice(placementPos,0,this.objectsToPlace[i]);this.objectsToPlace[i].parentObj=mouseBlock;this.objectsToPlace[i].collapsed=1;}
QES_OverQuestion.suspend=true;for(i=0,len=this.objectsToPlace.length;i<len;++i)
{this.objectsToPlace[i].render();}}
var lastQuestion=this.objectsToPlace[this.objectsToPlace.length-1];var x=Position.cumulativeOffset(this.objectsToPlace[0].element)[0];var y=this.objectsToPlace[0].getTop();var width=$(this.objectsToPlace[0].element).getWidth();var height=lastQuestion.getBottom()-y;var highlightColor='#49D9FF';if(this.color)highlightColor=this.color;var highlightOptions={x:x,y:y,height:height,width:width,color:highlightColor,opacity:0.6,caption:getMessage('EditSection','MoveQuestionInstructions'),onclick:PlacementChooser.getPlaceFunction()};new QualtricsCPTools.Highlighter(highlightOptions).render();QuestionTopCache={};QES_OverQuestion.questionObj=overQuestion;QES_OverQuestion.suspend=false;}},place:function()
{QES_Global.suspendSelects=false;for(var i=0,len=this.objectsToPlace.length;i<len;++i)
{this.objectsToPlace[i].height=null;this.objectsToPlace[i].collapsed=this.objectsToPlace[i].parentObj.collapsedQuestionMode;this.objectsToPlace[i].placementTag=null;this.objectsToPlace[i].refreshQuestion();}
this.endPlacement();Toolbox.getInstance().render();if(this.onPlace)
{this.onPlace(this.objectsToPlace);}},endPlacement:function()
{QES_Global.suspendSelects=false;QualtricsCPTools.Highlighter.removeAll();if(this.callbackRestore){QES_OverQuestion.callback=this.callbackRestore;}
if(this.clearCallbackRestore){QES_OverQuestion.clearCallback=this.clearCallbackRestore;}
QES_OverQuestion.alwaysUpdate=false;QES_Global.suspendOverBorders=false;PlacementChooser.placementChooserObj=null;}};Qualtrics.ResizeTE=Class.create({initialize:function(evt,quesObj,formItem){this._gridSize=10;this.eventObserve(evt);this.questionObj=quesObj;if(formItem!=undefined)
{this._formItem=this.questionObj.getChoiceBySelectionId(formItem);if(this._formItem.meta==null)
this._formItem.meta={};}
this._resizing=true;this._target=evt.target;this._textEntry=evt.target.previousSibling;this._startX=window.mousePos[0];this._startY=window.mousePos[1];this._catcher=QBuilder('div',{className:"ResizeTECatcher"});$(this._target.parentNode).insert(this._catcher);if(Qualtrics.Browser.IE&&Qualtrics.Browser.Version<8)
this._offsetX=this._target.offsetLeft-4;else
this._offsetX=this._target.offsetLeft;if(BaseForm.getInstance().isRTL())
this._offsetX=this._target.offsetRight;this._offsetY=this._target.offsetTop;if(this.questionObj.selector=="ML"||this.questionObj.selector=="ESTB")
$(document.body).addClassName("ResizeTEDraggingSE");else
$(document.body).addClassName("ResizeTEDraggingE");this._interval=setInterval(this.resize.bind(this),50);Event.stop(evt);document.onselectstart=function(){return false;};this._target.ondragstart=function(){return false;};return false;},eventObserve:function(evt){this._startSnapBound=this.startSnap.bind(this);this._endSnapBound=this.endSnap.bind(this);this._endDragBound=this.endDrag.bind(this);Event.observe(document,'mouseup',this._endDragBound);if(evt.shiftKey||evt.altKey||evt.ctrKey)
{this._grid=false;Event.observe(document,'keyup',this._startSnapBound);}
else
{this._grid=true;Event.observe(document,'keydown',this._endSnapBound);}},endSnap:function(evt){if(evt.keyCode==17||evt.keyCode==18)
{this._grid=false;Event.observe(document,'keyup',this._startSnapBound);Event.stopObserving(document,'keydown',this._endSnapBound);Event.stop(evt);}},startSnap:function(evt){this._grid=true;Event.stopObserving(document,'keyup',this._startSnapBound);Event.observe(document,'keydown',this._endSnapBound);Event.stop(evt);},endDrag:function(elem,evt){if(this._resizing){clearInterval(this._interval);this._resizing=false;$(this._status).fade({afterFinish:function(effect){$(effect.element).remove()}});$(this._catcher).remove();Event.stopObserving(document,'mouseup',this._endDragBound);Event.stopObserving(document,'keydown',this._endSnapBound);Event.stopObserving(document,'keyup',this._startSnapBound);$(document.body).removeClassName("ResizeTEDraggingSE");$(document.body).removeClassName("ResizeTEDraggingE");}},resize:function(){if(this._textEntry.tagName=="TEXTAREA")
this.multiLine();else
this.singleLine();if(this._status==undefined)
{if(this.outputDims()!=undefined)
{this._message=QBuilder('div',{className:"message"},this.outputDims());this._status=QBuilder('div',{className:"ResizeTEStatus"},[this._message]);$(document.body).insert(this._status);}}else
{if(this.outputDims()!=undefined)
this._message.innerHTML=this.outputDims();this._status.style.top=(mousePos[1]+10)+'px';this._status.style.left=mousePos[0]+'px';}
this.questionObj.setSaved(false);},singleLine:function(){var extraX=this._textEntry.offsetWidth-this._textEntry.clientWidth;if(this._textEntry.disabled)
{if(Qualtrics.Browser.Gecko)
this.xAxis(2);else if(Qualtrics.Browser.IE)
this.xAxis(6);else
this.xAxis(4);}
else
this.xAxis(6);},multiLine:function(){var extraX=this._textEntry.offsetWidth-this._textEntry.clientWidth;var extraY=this._textEntry.offsetHeight-this._textEntry.clientHeight;this.yAxis(extraX);this.xAxis(extraY);},xAxis:function(extra){var _mousePos=mousePos;var diffX=this._startX-_mousePos[0];var inputWidth;var handlePos;var centered=false;if(diffX!=0&&(this._constraint==undefined||this._constraint>_mousePos[0]||(this._constraint<_mousePos[0]&&BaseForm.getInstance().isRTL())))
{this._constraint=undefined;if((this.questionObj.options.answers=="MA"||this.questionObj.options.answers=="SA")&&this.questionObj.options.position=="HORZ")
{diffX=2*diffX;centered=true;}
if(BaseForm.getInstance().isRTL())
{inputWidth=(($(this._textEntry).getWidth()-extra)+diffX);handlePos=this._offsetX+diffX;}
else
{inputWidth=(($(this._textEntry).getWidth()-extra)-diffX);handlePos=this._offsetX-diffX;}
var gridDiff=0;if(this._grid)
{var result=this.snapToGrid(inputWidth,handlePos);inputWidth=result.inputDim;handlePos=result.handlePos;gridDiff=result.gridDiff;}
if(this.isValidWidth(inputWidth))
{this._offsetX=handlePos;if(centered)
{if(BaseForm.getInstance().isRTL())
{this._startX-=((diffX/2)-(gridDiff/2));}
else
{this._startX-=((diffX/2)+(gridDiff/2));}}else
{if(BaseForm.getInstance().isRTL())
this._startX-=diffX-gridDiff;else
this._startX-=diffX+gridDiff;}
this.updateXAxis(inputWidth,handlePos);}else
{if(inputWidth>10)
{var constraintDiff=this.getHorizontalConstraint()-($(this._textEntry).getWidth()-extra);inputWidth=($(this._textEntry).getWidth()-extra)+constraintDiff;handlePos=this._offsetX+constraintDiff;if(this.isValidWidth(inputWidth)){this._offsetX=handlePos;this._constraint=this._startX+constraintDiff;this._startX=this._startX+constraintDiff;this.updateXAxis(inputWidth,handlePos);}}}}},yAxis:function(extra){var _mousePos=mousePos;var diffY=this._startY-_mousePos[1];if(diffY!=0&&(this._yConstraint==undefined||this._yConstraint<_mousePos[1]))
{this._yConstraint=undefined;var inputHeight=(($(this._textEntry).getHeight()-extra)-diffY);var handlePos=(this._offsetY-diffY);var gridDiff=0;if(this._grid)
{var result=this.snapToGrid(inputHeight,handlePos);inputHeight=result.inputDim;handlePos=result.handlePos;gridDiff=result.gridDiff;}
if(this.isValidHeight(inputHeight))
{this._offsetY=handlePos;this._startY-=(diffY+gridDiff);this.updateYAxis(inputHeight,handlePos);}else
{var constraintDiff=this.getVerticalConstraint()-($(this._textEntry).getHeight()-extra);inputHeight=($(this._textEntry).getHeight()-extra)+constraintDiff;handlePos=this._offsetY+constraintDiff;if(this.isValidHeight(inputHeight)){this._offsetY=handlePos;this._yConstraint=this._startY+constraintDiff;this._startY=this._startY+constraintDiff;this.updateYAxis(inputHeight,handlePos);}}}},updateXAxis:function(inputWidth,handlePos){if(BaseForm.getInstance().isRTL())
this._target.style.right=inputWidth+'px';else
this._target.style.left=handlePos+'px';this._textEntry.style.width=inputWidth+'px';if(this.questionObj.options.position=="HORZ"){this._target.parentNode.style.margin='auto';this._target.parentNode.style.width=inputWidth+'px';}
this.saveWidth(inputWidth);},updateYAxis:function(inputHeight,handlePos){this._textEntry.style.height=inputHeight+'px';this._target.style.top=handlePos+'px';this.saveHeight(inputHeight);this.questionObj.height=this.questionObj.element.getHeight();QuestionActions.updateIcons();},snapToGrid:function(inputDim,handlePos){var gridDiff=0;gridDiff=(inputDim%this._gridSize);handlePos-=gridDiff;inputDim-=gridDiff;return{'handlePos':handlePos,'inputDim':inputDim,'gridDiff':gridDiff};},isValidHeight:function(height){return height>=this.getVerticalConstraint();},isValidWidth:function(width){return width>10&&(!this._grid||width<=this.getHorizontalConstraint());},getVerticalConstraint:function(){return 15;},getHorizontalConstraint:function(){if(this.questionObj.selector=="FORM")
return 470;else if(this.questionObj.questionType=="Matrix")
return 160;else if(this.questionObj.selector=="SACOL")
return 300;else if(this.questionObj.selector=="SAHR")
return 150;else if(this.questionObj.questionType=="RO"&&this.questionObj.selector=="DND")
return 550;else if(this.questionObj.questionType=="RO"&&this.questionObj.selector=="RB")
return 445;else if(this.questionObj.questionType=="RO"&&this.questionObj.selector=="VR")
return 525;else if(this.questionObj.questionType=="SBS")
return 200;else if(this.questionObj.questionType=="PGR")
return 175;else
return 680;},outputDims:function(){var width;var height;var itemIndex;if(this._formItem)
{width=this._formItem['meta']['InputWidth'];height=this._formItem['meta']['InputHeight'];}
else
{width=this.questionObj.options['InputWidth'];height=this.questionObj.options['InputHeight'];}
if(height==undefined&&width!=undefined)
return"width: "+width+"px";if(width==undefined&&height!=undefined)
return"height: "+height+"px";if(width!=undefined&&height!=undefined)
return width+"px"+" X "+height+"px";},saveHeight:function(height){if(this._formItem)
this._formItem['meta']['InputHeight']=height;else
this.questionObj.options['InputHeight']=height;},saveWidth:function(width){if(this._formItem!=undefined){this._formItem['meta']['InputWidth']=width;}else
this.questionObj.options['InputWidth']=width;}});window.strToPlural=function(text)
{var plural=text+'s';var lastLetter=(text.substring(text.length-1,text.length));if(lastLetter.toLowerCase()=='y')
{plural=text.substring(0,text.length-1)+'ies';}
return plural;};window.addQuestionToSurvey=function()
{var q=createDefaultQuestion();var lastBlock=Survey.getInstance().blocks[Survey.getInstance().blocks.length-2];lastBlock.addQuestion(q);q.render($(lastBlock.id));};Qualtrics.createNewConjoint=function()
{var b=new ConjointBlock();b.generate();b.conjointEditor.setupDefaults();Survey.getInstance().addBlock(b);b.render();b.frameBlock();new Ajax.Request('Ajax.php?action=CreateConjoint',{parameters:{ConjointInfo:Object.toJSON(b.conjointEditor.conjointInfo),'AddToFlow':true},onComplete:b.handleCreateConjointResult.bind(b)});};window.addBenchmarkBlock=function()
{window.addBlock({'subType':'Benchmark'});};window.importBenchmarkBlock=function()
{var win=new Q_Window('ImportBenchmarkBlock',{width:'910',height:'92%',overlayClose:true,closeButton:false});var options={returnFunction:Q_Window.closeWindow.curry('ImportBenchmarkBlock'),returnText:getMessage('SiteWide','Cancel'),executeFunction:function(questionDefs,surveyId){QuestionActions.unselectAll();BaseForm.getInstance().importSurvey(surveyId);Q_Window.closeWindow('ImportBenchmarkBlock');delete Q.CurrentBenchmarkSurveyNavigator;},multipleAdd:true,height:win.calculatedHeight};QModules.loadModule('inavigator.js');Q.CurrentBenchmarkSurveyNavigator=new Q.BenchmarkSurveyNavigator(win.innerElement,options);win.center();};window.addBlock=function(options,position)
{options=Object.extend({asynchronous:true},options);if(!Survey.getInstance().getPermission('editQuestions'))
{return;}
if(!Survey.getInstance().getPermission('useBlocks'))
{return;}
var surveyId=BaseForm.getInstance().id;var params={SurveyID:surveyId};if(position!==undefined)
{var relBlock=Survey.getInstance().blocks[position-1];if(relBlock)
{params['BelowBlockID']=relBlock.blockId;}
msg(getMessage('EditSection','InsertingNewBlock'),'addblock');}
else
{msg(getMessage('EditSection','CreatingNewBlockBottomSurvey'),'addblock');}
var b=new Block();b.type='Standard';if(options.subType)
{b.subType=options.subType;}
else
{b.subType='';}
params['SubType']=b.subType;if(position===undefined){if(Survey.getInstance().blocks.length==1)
{position=0;}
else
{position=Survey.getInstance().blocks.length;}}
Survey.getInstance().addBlock(b,position);b.blockNameObj.text='';b.render();b.frameBlock();new Ajax.Request('Ajax.php?action=NewBlock',{method:'post',parameters:params,asynchronous:options.asynchronous,onComplete:function(transport)
{try{var responseJSON=transport.responseText.evalJSON();if(responseJSON['ID'])
{b.blockId=responseJSON['ID'];b.blockNameObj.text=responseJSON['Description'];b.redrawHeader();window.QuestionTopCache={};if(options&&options.afterFinish)
{options.afterFinish(b);}}else{throw('Error could not be saved');}}catch(e)
{alert('Error creating block, server response was: '+transport.responseText+','+e);Survey.getInstance().reload();}},onFailure:function()
{QES_Error('Error Creating Block');Survey.getInstance().reload();}});return b;};window.createDefaultQuestion=function()
{var q=new Question();q.text=getMessage('EditSection','ClickToWriteQuestion');q.text_Unsafe=q.text;q.addChoice.repeat(3,q);return q;};window.selectionListToString=function(list)
{var out="";if(list)
{for(var i=0,len=list.length;i<len;++i)
{var sel=list[i];out+=sel.text;if(i<len-1)
{out+='\r';}}}
return out;};window.toggleMobileCompatiblityChecker=function(evt)
{var s=Survey.getInstance();if(s.mobileCompatibilityChecker!=1)
{s.mobileCompatibilityChecker=1;QES_Global.checkMobileCompatibility();var offlineAppPermission=(Qualtrics.User&&Qualtrics.User.offlineAppPermission==1);if(offlineAppPermission)
{QES_Global.checkMobileOfflineCompatibility();}}
else
{s.mobileCompatibilityChecker=0;QES_Global.removeMobileCompatibilityMessages();}
var surveyId=BaseForm.getInstance().id;new Ajax.Request('Ajax.php?action=SetMobileCompatibilityChecker',{method:'post',parameters:{SurveyID:surveyId,value:s.mobileCompatibilityChecker}});};window.toggleSurveyPreviewMode=function(evt)
{if(QES_Global.suspendSelects)
{return;}
if(!evt)evt=window.event;var s=Survey.getInstance();s.renderCount=0;QuestionActions.unselectAll();if(s.defaultPreviewMode==1)
{s.defaultPreviewMode=0;}
else
{s.defaultPreviewMode=1;}
s.resetPreviewModes();s.refresh();var surveyId=BaseForm.getInstance().id;new Ajax.Request('Ajax.php?action=SetSurveyPreviewMode',{method:'post',parameters:{SurveyID:surveyId,value:s.defaultPreviewMode}});};window.setChoiceMeta=function(selectEl)
{var questionObjId=selectEl.getAttribute('questionObjId');var choiceId=selectEl.getAttribute('choiceId');var meta=selectEl.name;if(questionObjId)
{var questionObj=Question.getQuestionById(questionObjId);var choice=questionObj.getChoiceByChoiceId(choiceId);if(choice)
{if(!choice.meta)
{choice.meta={};}
choice.meta[meta]=selectEl.value;questionObj.setEdited();}}};window.isInView=function(el){var height=getWindowSize()[1];var pos=Position.page(el)[1];if((pos>-1)&&(pos<height)){return true;}else{return false;}};window.getWindowSize=function(){var winWidth,winHeight,d=document;if(typeof window.innerWidth!='undefined'){winWidth=window.innerWidth;winHeight=window.innerHeight;}else{if(d.documentElement&&typeof d.documentElement.clientWidth!='undefined'&&d.documentElement.clientWidth!=0){winWidth=d.documentElement.clientWidth;winHeight=d.documentElement.clientHeight;}else{if(d.body&&typeof d.body.clientWidth!='undefined'){winWidth=d.body.clientWidth;winHeight=d.body.clientHeight;}}}
return[winWidth,winHeight];};Effect.Bounce=Class.create();Object.extend(Object.extend(Effect.Bounce.prototype,Effect.Base.prototype),{initialize:function(element){this.element=$(element);var options=Object.extend({x:0,y:22,acceleration:91.81,transition:Effect.Transitions.linear,mode:'relative'},arguments[1]||{});this.start(options);},setup:function(){Element.makePositioned(this.element);this.originalLeft=parseFloat(Element.getStyle(this.element,'left')||'0');this.originalTop=parseFloat(Element.getStyle(this.element,'top')||'0');if(this.options.mode=='absolute'){this.options.x=this.options.x-this.originalLeft;}},singlebounce:function(pos){var temp=(pos<0.5?0.5-pos:0.5+(1-pos));return(pos<0.5?this.options.acceleration/2*temp*temp:this.options.acceleration/2*(1-temp)*(1-temp))*8/this.options.acceleration-1;},multibounce:function(x){if(x<(1/2.75))
return 7.5625*x*x;else if(x<(2/2.75))
return 7.5625*(x-=(1.5/2.75))*x+0.75;else if(x<(2.5/2.75))
return 7.5625*(x-=(2.25/2.75))*x+0.9375;return 7.5625*(x-=(2.625/2.75))*x+0.984375;},update:function(position){Element.setStyle(this.element,{left:this.options.x*position+this.originalLeft+'px',top:this.originalTop+this.options.y*this.singlebounce(position)+'px'});}});document.onkeydown=function(evt)
{if(!evt)evt=window.event;if(evt.ctrlKey)
{window.ctrlKey=evt.ctrlKey;}
if(evt.keyCode==Event.KEY_BACKSPACE)
{var el=Event.element(evt);var tag=el.tagName;if(tag!='TEXTAREA'&&tag!='INPUT'&&(el.id!='InlineEditorElement'))
{Event.stop(evt);return false;}}
if(evt.keyCode==Event.KEY_RETURN)
{el=Event.element(evt);if(el.id=='SearchInput')
{var val=el.value;if(window[val]){window[val]();}
if(QES_Global[val]){QES_Global[val]();}
Event.stop(evt);el=null;return false;}
el=null;}};document.onkeyup=function(evt)
{if(!evt)evt=window.event;if(evt.ctrlKey)
{window.ctrlKey=0;}};Event.observe(document,'dblclick',function(){var editor=inlineEditor.getInstance();if(editor)
{if((new Date()-editor.initTime)<750)
{editor.selectAll();}}});window.clearSelection=function(){var sel;if(document.selection&&document.selection.empty)
{document.selection.empty();}
else if(window.getSelection)
{sel=window.getSelection();if(sel&&sel.removeAllRanges)
{sel.removeAllRanges();}}};Event.observe(document.body,'online',Q_FormHelpers.onlineEventHandler);Event.observe(document.body,'offline',Q_FormHelpers.offlineEventHandler);window.revisions=QES_Global.openRevisions;