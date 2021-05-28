
QModules.loadType='script';QModules.loadModule('QRegion.js');QModules.loadModule('raphael.js');QModules.loadType='eval';window.Q_FormHelpers={buildOutlineSelection:function()
{alert('deprecated use selectionObj.buildOutlineSelection');},buildChangeChoiceIdBox:function(selection,brPosition)
{var recodeFragment=document.createDocumentFragment();if(brPosition===0)recodeFragment.appendChild(QBuilder('br'));recodeFragment.appendChild(QBuilder('input',{title:'Change Choice ID',className:'ChangeChoiceId Left',size:'2',clickcallback:'Form.Element.activate',keyupcallback:'Question.changeChoiceIdKeyUp',instanceid:selection.parentObj.id,p1:'$el',p2:selection.id,value:selection.choiceId}));if(brPosition===1)recodeFragment.appendChild(QBuilder('br'));return recodeFragment;return document.createDocumentFragment();},buildRecodeValuesBox:function(selection,brPosition)
{if(selection.recodeValue||selection.recodeValue===0||selection.recodeValue==='')
{var recodeFragment=document.createDocumentFragment();if(brPosition===0)recodeFragment.appendChild(QBuilder('br'));var recodeInput=QBuilder('input',{title:'Recode Values',className:'RecodeValues Left',id:'RecodeChoice_'+selection.choiceId,size:'2',keyupcallback:'Question.recodeKeyUp',instanceid:selection.parentObj.id,p1:'$el',p2:selection.id,p3:selection.seriesIndex,value:selection.recodeValue});recodeInput.blurcallback='Question.recodeOnBlur:'+selection.parentObj.id+'($el, '+selection.id+','+selection.seriesIndex+')';recodeInput.onblur=Qualtrics.globalBlurHandler;recodeFragment.appendChild(recodeInput);if(brPosition===1)recodeFragment.appendChild(QBuilder('br'));return recodeFragment;}
return document.createDocumentFragment();},buildVariableNamingBox:function(selection,brPosition)
{if(selection.variableNaming||selection.variableNaming===0||selection.variableNaming==='')
{if(typeof selection.variableNaming!='string'&&selection.variableNaming.length===0)
{return document.createDocumentFragment();}
var varableNameFragment=document.createDocumentFragment();if(brPosition===0)varableNameFragment.appendChild(QBuilder('br'));varableNameFragment.appendChild(QBuilder('input',{title:'Variable Name',className:'VariableNaming Left',size:'25',keyupcallback:'Question.variableNamingKeyUp',instanceid:selection.parentObj.id,p1:'$el',p2:selection.id,p3:selection.seriesIndex,value:(selection.variableNaming||'')}));if(brPosition===1)varableNameFragment.appendChild(QBuilder('br'));return varableNameFragment;}
return document.createDocumentFragment();},buildChoiceDataExportTagBox:function(selection,brPosition)
{if(selection.choiceDataExportTag||selection.choiceDataExportTag===0||selection.choiceDataExportTag==='')
{var choiceDataExportTagFragment=document.createDocumentFragment();if(brPosition===0)choiceDataExportTagFragment.appendChild(QBuilder('br'));choiceDataExportTagFragment.appendChild(QBuilder('input',{title:'Answer Data Export Tag',className:'ChoiceDataExportTags Left',size:'10',keyupcallback:'Question.choiceDataExportTagKeyUp',instanceid:selection.parentObj.id,p1:'$el',p2:selection.id,value:(selection.choiceDataExportTag||'')}));if(brPosition===1)choiceDataExportTagFragment.appendChild(QBuilder('br'));return choiceDataExportTagFragment;}
if(selection.answerDataExportTag||selection.answerDataExportTag===0||selection.answerDataExportTag==='')
{var dataExportTagFragment=document.createDocumentFragment();if(brPosition===0)dataExportTagFragment.appendChild(QBuilder('br'));dataExportTagFragment.appendChild(QBuilder('input',{title:'Answer Data Export Tag',className:'ChoiceDataExportTags Left',size:'10',keyupcallback:'Question.answerDataExportTagKeyUp',instanceid:selection.parentObj.id,p1:'$el',p2:selection.id,value:(selection.answerDataExportTag||'')}));if(brPosition===1)dataExportTagFragment.appendChild(QBuilder('br'));return dataExportTagFragment;}
return document.createDocumentFragment();},parseAjaxResponse:function(transportOrJson)
{var r=transportOrJson;var json=null;if(typeof r=='object')
{if(r.responseText!=undefined)
{if(r.responseText)
{try{json=r.responseText.evalJSON();}catch(e)
{}}}
else
{json=transportOrJson;}}
if(json)
{var errorList=null;var syncError=false;if(json['Error'])
{if(json['Error']['ErrorMessage'])
{errorList=new Array(json['Error']['ErrorMessage'],json['Error']['ErrorCode'],json['Error']['SyncError']);}
else if(json['Error'][0])
{errorList=json['Error'];}}
if(errorList)
{var dialogMsg=null;errorList.each(function(error){if(error['ErrorMessage'])
{QES_Error(error['ErrorMessage']);dialogMsg=error['ErrorMessage'];}
if(error['SyncError'])
{syncError=true;}
if(error['ErrorCode']=='ECP07')
{document.Page.action='./';PageAction('Logout','','','');return false;}});}
if(dialogMsg&&!syncError)
{var errorWindow=new Q_Window();errorWindow.appendChild(QBuilder('h2',null,getMessage('ValidationErrorCodes','VE_ERROR')));errorWindow.appendChild(QBuilder('div',null,dialogMsg));errorWindow.center();}
if(syncError)
{Survey.getInstance().reload();}
if(!dialogMsg)
{return false;}}},showNetworkConnectivityDialog:function(optCallbackString)
{if(inlineEditor&&inlineEditor.getInstance())inlineEditor.getInstance().removeInlineEditor();if(Q_Window.getInstance('NetworkConnectivityDialog'))
{Q_Window.closeWindow('NetworkConnectivityDialog');}
var win=new Q_Window('NetworkConnectivityDialog',{title:QBuilder('span',null,['Cannot Save',Q_FormHelpers.getNetworkStatusNode()]),buttons:[{text:getMessage('EditSection','Ignore'),className:'negative',click:'Q_Window.closeWindow'},{id:'TryAgainButton',text:getMessage('EditSection','TryAgain'),className:'positive',click:optCallbackString||'Q_FormHelpers.trySave'}]});var unsaved=BaseForm.getInstance().getUnsavedQuestions();var content=QBuilder('div',{},[QBuilder('p',{},['Your browser cannot connect to qualtrics and you have ',QBuilder('strong',null,unsaved.length),' unsaved questions']),QBuilder('p',null,'Check your network connection and try again')]);win.setContent(content);win.center();},getNetworkStatusNode:function()
{var span=QBuilder('span');var introText='Your network status is: ';if(navigator.onLine===true)
{span.innerHTML='Online';span.addClassName('Online');}
else if(navigator.onLine===false)
{span.innerHTML='Offline';span.addClassName('Offline');}
else
{introText='';}
return QBuilder('span',{className:'NetworkStatus'},[introText,span]);},trySave:function()
{BaseForm.getInstance().save();if($('TryAgainButton'))
{$('TryAgainButton').innerHTML=getMessage('SiteWide','Saving')+'...';$('TryAgainButton').addClassName('Disabled');$('TryAgainButton').setAttribute('clickcallback','');}},onlineEventHandler:function()
{if(Q_Window.getInstance('NetworkConnectivityDialog'))
{Q_FormHelpers.showNetworkConnectivityDialog();}
Q_FormHelpers.trySave();},offlineEventHandler:function()
{Q_FormHelpers.showNetworkConnectivityDialog();},questionExistsInSurvey:function(questionId)
{var q=BaseQuestion.getQuestionByQuestionId(questionId);if(q&&q.parentObj&&q.parentObj.type!='Trash')
{return true;}
return false;}};Qualtrics.savePage=function()
{if(BaseForm.getInstance()&&BaseForm.getInstance().save)
BaseForm.getInstance().save();};window.BaseForm=Class.create();BaseForm.getInstance=function()
{return BaseForm._instance;};BaseForm.prototype={blocks:null,notes:null,id:null,ownerId:null,surveyNameObj:null,surveyDescriptionObj:null,previewURL:null,parentId:null,element:null,responses:0,collapsedBlockThreshold:70,collapsedBlockMode:0,defaultPreviewMode:1,mobileCompatibilityChecker:0,resetPreviewModeFlag:0,trashBlock:null,lastSkipLogicId:0,questionCount:0,renderCount:0,permissions:{seeQuestions:0,editQuestions:0,useBlocks:0,deleteSurveyQuestions:0,deleteBlocks:1,addBlocks:1,lockBlocks:1,blockLooping:1,moveBlocks:1,copyBlock:1,copyBlockToLibrary:1,copySurveyQuestionsToLibrary:1},isEditingLibrarySurvey:null,defaultLanguage:'EN',carryForwardDependencies:null,surveyOptions:{},revisionNumber:null,revisionSystem:null,currentVersionNumber:null,lastModified:null,displayLogicValidTime:null,initialize:function(surveyId,parentId,opt_sync)
{this.baseInit(surveyId,parentId,opt_sync);},baseInit:function(surveyId,parentId,opt_sync)
{if(typeof QuestionTypes=='undefined')
{console.error('You need QuestionTypes.js');}
BaseForm._instance=this;BaseQuestion.totalQuestionCount=0;this.surveyNameObj=new SurveyName(this);this.questionCount=0;this.renderCount=0;this.id=surveyId;this.parentId=parentId;this.blocks=[];this.notes={};if(surveyId)
{var surveyObj=this;new Ajax.Request('Ajax.php?action=GetSurveyJSON',{asynchronous:!opt_sync,parameters:{ForceSurveyID:surveyId},onSuccess:function(transport)
{try
{try
{if($(parentId))
$(parentId).innerHTML='';var surveyData=transport.responseText.evalJSON();}
catch(e)
{console.error(e);}
if(surveyData)
{window['QES_Global']&&Q_FormHelpers.parseAjaxResponse(surveyData);if(surveyData['OwnerID'])
{BaseForm.getInstance().ownerId=surveyData['OwnerID'];}
if(surveyData['Responses'])
{BaseForm.getInstance().responses=parseInt(surveyData['Responses'])||0;}
if(surveyData['Scoring'])
{BaseForm.getInstance().scoringDefinition=surveyData['Scoring'];}
if(surveyData.hasOwnProperty('PreviewMode'))
{surveyObj.defaultPreviewMode=surveyData['PreviewMode'];}
if(surveyData['LastModified'])
{BaseForm.getInstance().lastModified=surveyData['LastModifiedDay']+" "+surveyData['LastModifiedTime'];}
if(surveyData['SurveyName']&&surveyObj.surveyNameObj)
{surveyObj.surveyNameObj.text=surveyData['SurveyName'];if(!surveyObj.surveyNameObj.text.strip())
{surveyObj.surveyNameObj.text=getMessage('CreateSection','UntitledSurvey');}}
if(surveyData['SurveyDescription']!=undefined)
{surveyObj.surveyDescriptionObj=new SurveyDescription(this);if(surveyData['SurveyDescription'])
surveyObj.surveyDescriptionObj.text=surveyData['SurveyDescription'];else
surveyObj.surveyDescriptionObj.text='';if(surveyData['SurveyDescriptionLabel'])
{surveyObj.surveyDescriptionObj.label=surveyData['SurveyDescriptionLabel'];}
if(surveyData['SurveyDescriptionValidationRegEx'])
{surveyObj.surveyDescriptionObj.validationRegEx=surveyData['SurveyDescriptionValidationRegEx'];}
if(surveyData['SurveyDescriptionValidationMsg'])
{surveyObj.surveyDescriptionObj.validationMsg=surveyData['SurveyDescriptionValidationMsg'];}}
if(surveyData['SurveyOptions'])
{surveyObj.surveyOptions=surveyData['SurveyOptions'];var spellChecked=surveyObj.surveyOptions['SpellChecked']||0;surveyObj.setSpellChecked(spellChecked,true);if(surveyData['SurveyOptions']['SurveyLanguage'])
{surveyObj.defaultLanguage=surveyData['SurveyOptions']['SurveyLanguage'];}
if(surveyData['SurveyOptions']['AvailableLanguages'])
{if(!Object.isArray(surveyData['SurveyOptions']['AvailableLanguages']))
{surveyObj.languages=surveyData['SurveyOptions']['AvailableLanguages'];}}
if(surveyData['SurveyOptions']['SkinQuestionWidth'])
{surveyObj.skinQuestionWidth=surveyData['SurveyOptions']['SkinQuestionWidth'];}}
if(surveyData['Default'])
{var block=surveyObj.newBlock('Block');surveyObj.addBlock(block);if(!block.generate(surveyData.Default))
{Qualtrics.Error('error generating block cannot render');}}
if(surveyData['Standard'])
{for(var i=0,len=surveyData.Standard.length;i<len;++i)
{var blockData=surveyData['Standard'][i];if(blockData)
{if(blockData['Type']=='Conjoint'&&blockData['ConjointInfo'])
{var conjointBlock=surveyObj.newBlock('Conjoint');conjointBlock.generate(blockData['ConjointInfo']);surveyObj.addBlock(conjointBlock);}
else if(blockData['SubType']&&blockData['SubType']=='Benchmark')
{var block=surveyObj.newBlock('Benchmark');surveyObj.addBlock(block);if(!block.generate(blockData))
{Qualtrics.Error('error generating benchmark block cannot render');block=null;}}
else
{var block=surveyObj.newBlock('Block');surveyObj.addBlock(block);if(!block.generate(blockData))
{Qualtrics.Error('error generating block cannot render');block=null;}}}}}
if(surveyData['Notes'])
{for(var elementIndex in surveyData.Notes)
{var notesObj=surveyData.Notes[elementIndex];var notes=notesObj.Notes;var elementId=notesObj.ID;var userId=Qualtrics.User.userId;var status=(notesObj.UserStatuses[userId])?notesObj.UserStatuses[userId]:'Collapsed';surveyObj.addNotes(elementIndex,elementId,notes,status);}}
var offlineAppPermission=(Qualtrics.User&&Qualtrics.User.offlineAppPermission==1);if(surveyData['JSECompatibility']&&offlineAppPermission&&surveyObj.mobileCompatibilityChecker==1)
{surveyObj.JSECompatibility=surveyData.JSECompatibility;}
else
{surveyObj.JSECompatibility=null;}
if(surveyData['Trash'])
{var blockData=surveyData['Trash'];if(blockData)
{var block=surveyObj.newBlock('Trash');surveyObj.addBlock(block);block.generate(blockData);surveyObj.trashBlock=block;}}
if(surveyData['Permissions'])
{for(var permission in surveyData['Permissions'])
{surveyObj.setPermission(permission,surveyData['Permissions'][permission]);}}
if(surveyData['CurrentVersionNumber']!==undefined)
{surveyObj.currentVersionNumber=surveyData['CurrentVersionNumber'];}
if(surveyData['RevisionInfo']!==undefined)
{surveyObj.revisionSystem='RevisionsV2';surveyObj.revisionDescription=surveyData['RevisionInfo']['Description'];surveyObj.revisionId=surveyData['RevisionInfo']['RevisionId'];surveyObj.revisionNumber=surveyData['RevisionInfo']['RevisionNumber'];surveyObj.revisionDateAndTime=surveyData['RevisionInfo']['RevisionDateAndTime'];surveyObj.revisionTime=surveyData['RevisionInfo']['RevisionTime'];surveyObj.prevRevision=surveyData['RevisionInfo']['PrevRevision'];surveyObj.nextRevision=surveyData['RevisionInfo']['NextRevision'];surveyObj.currentVersionNumber="0";if(surveyObj.revisionNumber!='Curr')
{surveyObj.setPermission('editQuestions',0);surveyObj.setPermission('useBlocks',0);surveyObj.setPermission('deleteSurveyQuestions',0);surveyObj.setPermission('editSurveyOptions',0);surveyObj.setPermission('editSurveyFlow',0);}}
else
{var revisionNumber=surveyObj.extractParamFromURL('v');if(revisionNumber&&revisionNumber==surveyObj.currentVersionNumber){surveyObj.revisionNumber="Curr";surveyObj.prevRevision=surveyObj.currentVersionNumber-1;surveyObj.nextRevision=surveyObj.currentVersionNumber;}}
if(!surveyObj.getPermission('editQuestions',true)||!!surveyData['Locked'])
{surveyObj.locked=true;}
if(surveyData['PreviewURL'])
{surveyObj.previewURL=surveyData['PreviewURL'];}
if(surveyObj.additionalDefProcessing)
{surveyObj.additionalDefProcessing(surveyData);}
if(surveyData['IsEditingHiddenLibrarySurvey'])
{surveyObj.isEditingLibrarySurvey=true;}}
else
{Qualtrics.Error('cannot parse json');return false;}
try
{surveyObj.generateProxieSelections();surveyObj.unpackgeQuestions();if(surveyObj.afterGenerate)
{surveyObj.afterGenerate();}
surveyObj.initialRender();if(window.QES_Global)
{var pos=surveyObj.extractParamFromURL('p');QES_Global.scrollToPos(pos);}}
catch(e)
{console.dir(e);Qualtrics.Error(e);}}
catch(e)
{console.error(e);}}});}},protectSelectionIds:function()
{var form=BaseForm.getInstance();if(form&&form.surveyOptions&&form.surveyOptions.ProtectSelectionIds)
{return true;}
else if(Survey.getInstance().responses!==0)
{form.surveyOptions.ProtectSelectionIds=true;return true;}
return false;},extractParamFromURL:function(name)
{name=name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");var regexS="[\\?&]"+name+"=([^&#]*)";var regex=new RegExp(regexS);var results=regex.exec(window.location.href);if(results==null)
return"";else
return results[1];},blowDisplayLogicCache:function()
{this.displayLogicValidTime=new Date().getTime();if(Ajax.CachedRequests&&Ajax.CachedRequests['Ajax.php?action=GetQuestionList'])
{delete Ajax.CachedRequests['Ajax.php?action=GetQuestionList'];}},initialRender:function()
{this.render();},generateProxieSelections:function()
{for(var i=0,len=this.blocks.length;i<len;++i)
{var block=this.blocks[i];for(var qi=0,qlen=block.questions.length;qi<qlen;++qi)
{var q=block.questions[qi];if(q.dynamicChoices)
{q.generateProxieSelections('choices');q.recodeValuesFromStoredJSON();}
if(q.dynamicAnswers)
{q.generateProxieSelections('answers');q.recodeValuesFromStoredJSON();}}}},unpackgeQuestions:function()
{for(var i=0,len=this.blocks.length;i<len;++i)
{var block=this.blocks[i];for(var qi=0,qlen=block.questions.length;qi<qlen;++qi)
{block.questions[qi].unpackage();}}},setDisplayLogicDependencies:function(qId,dependencies)
{if(qId)
{if(!this.displayLogicDependencies)
{this.displayLogicDependencies={};}
delete this.displayLogicDependencies[qId];for(var i in(dependencies||{}))
{this.displayLogicDependencies[qId]=dependencies;break;}}},isQuestionDisplayLogicDependent:function(questionId)
{var deps=this.displayLogicDependencies||{};for(var i in deps)
{if(questionId!=i&&deps[i][questionId])
return true;}
return false;},getQuestionDisplayLogicDependents:function(qId)
{var matches=[];var deps=this.displayLogicDependencies||{};for(var i in deps)
{if(qId!=i&&deps[i][qId])
{matches.push({type:'DisplayLogic',questionId:i});}}
return matches;},setCarryForwardDependency:function(rootQuestion,dependant)
{if(!this.carryForwardDependencies)
{this.carryForwardDependencies={};}
var rootId=rootQuestion.questionId;var dependantId=dependant.questionId;if(rootId==dependantId)
{return;}
if(!this.carryForwardDependencies[rootId])
{this.carryForwardDependencies[rootId]={};}
if(!this.carryForwardDependencies[rootId][dependantId])
{this.carryForwardDependencies[rootId][dependantId]=dependant;}},getSelectableQuestionCount:function()
{var count=0;for(var i=0,len=this.blocks.length;i<len;++i)
{if(this.blocks[i].type!='Trash')
{count+=this.blocks[i].questions.length;}}
return count;},setPermission:function(name,value)
{this.permissions[name]=value;},getPermission:function(name,opt_silentCheck)
{if(name=='addNewQuestion')
{var maxQuestions=Survey.getInstance().permissions.allowedQuestions;if(maxQuestions&&Survey.getInstance().questionCount>=maxQuestions)
{QualtricsCPTools.showUpgradeDialog("QuestionsPerSurvey");return false;}
return true;}
else if(name=='WebService')
{if(Qualtrics.User&&Qualtrics.User.accountType)
{if(Qualtrics.User.accountType.indexOf("QTrial")===-1)
return true;}
return false;}
if((opt_silentCheck!=true)&&!this.permissions[name])
{msg('You do not have permission');}
return this.permissions[name];},getQuestionPermission:function(questionType,opt_silent)
{if(!this.permissions['questionPermissions'])
{return true;}
if(this.permissions['questionPermissions']['ServerAdmin'])
{return true;}
if(!this.permissions['questionPermissions'][questionType]||this.permissions['questionPermissions'][questionType]==0)
{if(!opt_silent)
{if(Qualtrics.System.brandType=='Demo')
{QualtricsCPTools.showUpgradeDialog(questionType);}
else if(Qualtrics.System.brandId.toLowerCase().indexOf('qtrial')>=0){QualtricsCPTools.showAlertDialog({title:QBuilder('div',{id:'qtrial_upgrade_alert_title'},getMessage('ErrorCodes','ESEC69A')),message:getMessage('ErrorCodes','ESEC69B'),messageDivId:'qtrial_upgrade_alert_message',okButtonClassName:'no-icon'});}
else
{QualtricsCPTools.showAlertDialog({message:getMessage('ErrorCodes','ESEC69')});}}
return false;}
return true;},setPreviewURL:function(url)
{this.previewURL=url;},setDefaultPreviewMode:function(v)
{this.defaultPreviewMode=v;if($('SurveyPreviewModeMenuItem'))
{if(v)
{$('SurveyPreviewModeMenuItem').addClassName('check');}
else
{$('SurveyPreviewModeMenuItem').removeClassName('check');}}},setDefaultMobileCompatibilityChecker:function(v)
{this.mobileCompatibilityChecker=v;if($('MobileCopatibilityCheckerMenuItem'))
{if(v)
{$('MobileCopatibilityCheckerMenuItem').addClassName('check');}
else
{$('MobileCopatibilityCheckerMenuItem').removeClassName('check');}}},getDefaultPreviewMode:function()
{return this.defaultPreviewMode;},newBlock:function()
{return new BaseBlock();},addBlock:function(block,position)
{if(position===undefined)position=this.blocks.length;block.parentObj=this;this.blocks.splice(position,0,block);block.parentId=this.parentId;},getBlocks:function()
{return this.blocks;},addNotes:function(elementIndex,elementId,notes,status)
{notes=notes||[];this.notes[elementIndex]=new BaseNotes(elementIndex,elementId);for(var i=0;i<notes.length;i++){this.notes[elementIndex].addNote(notes[i]);}
this.notes[elementIndex].setStatus(status);},getUnsavedQuestions:function(opt_selectedOnly)
{var saveList=[];var questions=opt_selectedOnly?QuestionActions.selectedRegistry:this.getAllQuestions();for(var i=0,len=questions.length;i<len;++i)
{var q=questions[i];if(q.skipLogicEditor)
{SkipLogic.exitSkipLogicEditMode(q);}
if(!q.isSaved()&&!q.savedSkipLogic)
{saveList.push(q);}}
return saveList;},getUnsavedNotes:function()
{var saveList=[];var notes=this.getAllNotes();for(var i in notes)
{var note=notes[i];if(!note.saved)
{saveList.push(note);}}
return saveList;},reload:function()
{this.execReload();},execReload:function()
{var scrollTop=scrollInfo[1];var surveyHeight=$(this.element).getHeight();$(this.element).setStyle({height:surveyHeight+'px'});if(window.QES_Global)
{QES_Global.stopScrolling();QES_Global.scroller=new Effect.ScrollToY(scrollTop,{duration:0,afterFinish:updateScrollInfo});}
var surveyId=this.id;var parentId=this.parentId;this.clearDom();this.clearObj();this.initialize(surveyId,parentId);},clearObj:function()
{for(var i in this)
{if(i=='element')
continue;if(this.hasOwnProperty(i)&&this[i])
{this[i]=null;delete this[i];}}},clearDom:function()
{if(window.QuestionActions)
{QuestionActions.unselectAll();}
deleteChildren(this.element);if($('TrashArea'))
{$('TrashArea').remove();}},refresh:function()
{this.renderCount=0;this.clearDom();this.render();},refreshHeader:function()
{var header=$('SurveyHeader');if(header&&this.buildHeader)
{deleteChildren(header);header.appendChild(this.buildHeader());}},checkForEmptyBlocks:function()
{for(var i=0,len=this.blocks.length;i<len;++i)
{var block=this.blocks[i];block.checkForEmptyBlock();}},countQuestions:function()
{var questionCount=0;for(var i=0,len=this.blocks.length;i<len;++i)
{var block=this.blocks[i];if(block.shell)
{block.realQuestionCount=block.elementCount;continue;}
block.realQuestionCount=0;for(var qi=0,qlen=block.questions.length;qi<qlen;++qi)
{if(block.questions[qi].type=='Question')
{++block.realQuestionCount;}
++questionCount;}}
this.questionCount=questionCount;},render:function()
{this.countQuestions();if(this.questionCount>=this.collapsedBlockThreshold||this.collapsedBlockMode)
{this.collapsedBlockMode=1;for(var i=0,len=this.blocks.length;i<len;++i)
{this.blocks[i].collapsed=1;}}
this.element=$(this.parentId);var headerContent='';if(this.buildHeader&&(Qualtrics.System.productName!='ControlPanel'||Qualtrics.Navigation.subSection=='GradingEditor'))
{headerContent=this.buildHeader();}
this.element.appendChild(QBuilder('div',{id:'SurveyHeader',className:'SurveyHeader'},[headerContent]));this.bodyNode=this.element.appendChild(QBuilder('div',{className:'SurveyBody'}));if(this.revisionNumber!=null)
{this.element.appendChild(this.buildRevisionsHeadsup());var revisionHeadsUp=$('RevisionsHeadsup');var revisionWrapper=$('RevisionsHeadsupWrapper');if(revisionHeadsUp&&revisionWrapper)
{Event.observe(window,'scroll',function(event){if(revisionWrapper.viewportOffset().top<=0)
{revisionHeadsUp.setStyle({position:'fixed',width:revisionWrapper.getWidth()+'px',zIndex:10001});}
else
{revisionHeadsUp.setStyle({position:'static',top:0,width:'auto'});}});Event.observe(window,'resize',function(event){if(revisionHeadsUp.getStyle('position')=='fixed')
{revisionHeadsUp.setStyle({width:revisionWrapper.getWidth()+'px'});}});}}
if(window.QSB_Global&&(QSB_Global.surveyUnlocked||QSB_Global.surveyLocked))
{var warning=QBuilder('div',{id:'SurveyLockedWarning',className:'LockedWarning'});if(QSB_Global.surveyUnlocked)
{var unlockLink=QBuilder('a',{'clickcallback':'Survey.lockSurvey'},[getMessage('EditSection','SurveyLockLink')]);$(warning).appendChild(QBuilder('span',{},[QBuilder('div',{className:'Icon'}),getMessage('EditSection','SurveyRelockWarning1')+' ',unlockLink,' '+getMessage('EditSection','SurveyRelockWarning2')]));Survey.getInstance().unlocked=true;Survey.getInstance().locked=false;}
else
{var unlockLink=QBuilder('a',{'clickcallback':'Survey.unlockSurveyConfirm(false, $evt)'},[getMessage('EditSection','SurveyUnlockLink')]);$(warning).appendChild(QBuilder('span',{},[QBuilder('div',{className:'Icon'}),getMessage('EditSection','SurveyLockedWarning1')+' ',unlockLink,' '+getMessage('EditSection','SurveyLockedWarning2')]));Survey.getInstance().locked=true;}
this.bodyNode.appendChild(warning);}
if(Qualtrics.System.productName=='ThreeSixty'&&BaseForm.getInstance().getPermission('seeQuestions')=='0')
{this.renderBlackBox($(this.parentId));}
else
{blockPointer=0;this.renderBlocks();}
if(this.surveyNameObj.text==getMessage('CreateSection','UntitledSurvey')&&window.QES_Global)
{QES_Global.editSurveyName();}
var offlineAppPermission=(Qualtrics.User&&Qualtrics.User.offlineAppPermission==1);if(offlineAppPermission&&this.mobileCompatibilityChecker==1&&this.JSECompatibility)
{var errors=this.JSECompatibility.Errors||{};setTimeout(function(){QES_Global.updateMobileCompatibilityErrors(errors);QES_Global.checkMobileCompatibility(true);},1000);}
else if(this.mobileCompatibilityChecker==1)
{QES_Global.checkMobileCompatibility(true);}
this.afterRender();},afterRender:function()
{},buildRevisionsHeadsup:function()
{QModules.loadModule('revisionhistory.js');var revisionDescription=new Qualtrics.RevisionDescription(this.id,this.revisionId,this.revisionNumber,this.revisionDescription,0,'Current');revisionDescription.text=this.revisionDescription||getMessage("EditSection","ClickToAddDescription");QES_Global.currentRevision=revisionDescription;var descriptionNode=QBuilder('div',{id:revisionDescription.id,className:'Editable Description',clickcallback:'QES_Global.editCurrentRevisionDescription()'});descriptionNode.innerHTML=revisionDescription.text;return QBuilder('div',{className:'ScrollableWrapper',id:'RevisionsHeadsupWrapper'},[QBuilder('div',{className:'RevisionsHeadsup Scrollable',id:'RevisionsHeadsup'},[QBuilder('div',{className:'Inner'},[QBuilder('div',{className:'FluxCapacitor'},[]),QBuilder('div',{className:'VersionDisplay'},[QBuilder('h3',{},getMessage('EditSection','RevisionCaps')),QBuilder('div',{className:'RevisionNavigator'},[QBuilder('ul',{},[QBuilder('li',{className:'PreviousRevision'},[QBuilder('a',{href:'?v='+(this.prevRevision)})]),QBuilder('li',{className:'RevisionNumber'},this.revisionNumber),QBuilder('li',{className:'NextRevision'},[QBuilder('a',{href:'?v='+(this.nextRevision)})])])]),QBuilder('div',{className:'clear'}),QBuilder('h3',{className:'Date'},this.revisionDateAndTime)]),QBuilder('a',{href:'?v=',className:'CloseButton'}),QBuilder('div',{className:'Controls'},[descriptionNode,QBuilder('div',{className:'Buttons'},[QBuilder('a',{href:'javascript:void(0)',mouseupcallback:'Qualtrics.Menu.showMenu(QES_Global.getRevisionsMenu($el, $evt), $el,{},$evt)',className:'Button Green Menu',id:'JumpTo'},[QBuilder('span',{},getMessage('EditSection','JumpTo')),QBuilder('b',{},[QBuilder('b',{})])]),QBuilder('a',{href:'javascript:void(0)',mouseupcallback:'QES_Global.exportSurvey',className:'Button Red',id:'ExportVersion'},[getMessage('EditSection','ExportRevision')]),QBuilder('a',{href:'javascript:void(0)',mouseupcallback:'QES_Global.confirmSetRevisionToCurrent',className:'Button Blue',id:'SetCurrentVersion'},[getMessage('EditSection','RestoreRevision')])])])])])]);},renderBlackBox:function(parentNode)
{var blackBox=QBuilder('div',{className:'BlackBox'},[QBuilder('span',{},['This assessment was purchased from the marketplace, and the publisher has not allowed it to be viewed or edited in this section'])]);parentNode.appendChild(blackBox);},renderUseOnlyMarketplaceNotice:function()
{return QBuilder('div',{className:'BlackBox'},[QBuilder('span',{},[getMessage('ThreeSixty','AssessmentPurchasedFromMarketplace')])]);},renderBlocks:function()
{for(var i=0,len=this.blocks.length;i<len;++i)
{this.blocks[i].render();}
this.finishRendering();},finishRendering:function()
{$(this.element).setStyle({height:''});document.fire("Survey:finishRendering");},updateRenderProgress:function()
{if(this.collapsedBlockMode)
{return;}
var survey=BaseForm.getInstance();var percent=(survey.renderCount/survey.questionCount);if(survey.questionCount)
{var width=survey.element.offsetWidth*percent;if($('ProgressBar'))
{$('ProgressBar').setStyle({width:width+'px'});}
if(percent==1)
{new Effect.Fade($('ProgressBar'));}}},getBlockById:function(id)
{for(var i=0,len=this.blocks.length;i<len;++i)
{if(this.blocks[i].id===id)
{return this.blocks[i];}}
return null;},getBlockByBlockId:function(blockId)
{for(var i=0,len=this.blocks.length;i<len;++i)
{if(this.blocks[i].blockId===blockId)
{return this.blocks[i];}}
return null;},getBlockIndexByBlockId:function(blockId)
{for(var i=0,len=this.blocks.length;i<len;++i)
{if(this.blocks[i].blockId==blockId)
{return i;}}
return null;},getQuestionIndexByQuestionId:function(block,questionId)
{for(var i=0,len=block.questions.length;i<len;++i)
{if(block.questions[i].id==questionId)
{return i;}}
return null;},getChoiceIndexByChoiceId:function(question,choiceId)
{for(var i=0,len=question.choices.length;i<len;++i)
{if(question.choices[i].id==choiceId)
{return i;}}
return null;},getAnswerIndexByChoiceId:function(question,choiceId)
{for(var i=0,len=question.answers.length;i<len;++i)
{if(question.answers[i].id==choiceId)
{return i;}}
return null;},getQuestionBySystemId:function(qid)
{for(var i=0,len=this.blocks.length;i<len;++i)
{var q=this.blocks[i].getQuestionBySystemId(qid);if(q)
{return q;}}
return null;},getAllQuestions:function()
{var questionList=[];for(var i=0,len=this.blocks.length;i<len;++i)
{if(this.blocks[i].type!='Trash')
{questionList=questionList.concat(this.blocks[i].questions);}}
return questionList;},getAllNotes:function()
{return this.notes;},getAllQuestionNodes:function()
{var questionList=[];var questions=this.getAllQuestions();for(var i=0,len=questions.length;i<len;++i)
{questionList.push(questions[i].element);}
return questionList;},resetPreviewModes:function()
{QuestionTopCache={};this.resetCachedQuestionHeights();for(var i=0,len=this.blocks.length;i<len;++i)
{this.blocks[i].resetPreviewModes();this.blocks[i].defaultPreviewMode=null;}},resetCachedQuestionHeights:function()
{for(var i=0,len=this.blocks.length;i<len;++i)
{this.blocks[i].resetCachedQuestionHeights();}},getTop:function()
{if(!this.top)
{this.top=Position.cumulativeOffset($(this.element))[1];}
return this.top;},getHeight:function()
{var height=$(this.element).getHeight();return height;},getBottom:function()
{var bottom=this.getTop()+this.getHeight();return bottom;},setFolder:function(folderId)
{new Ajax.Request('Ajax.php?action=setFolder',{method:'post',parameters:{folderId:folderId}});},getSavedString:function()
{return'Saved';},setSpellChecked:function(v,opt_force,opt_notifyServer)
{if(!$('ToolbarContainer'))return;if(v)
{this.isSpellCheckedOnServer=true;}
if(this.surveyOptions['SpellChecked']!==v||opt_force)
{if(v)
{$('ToolbarContainer').addClassName('SpellChecked');}
else
{$('ToolbarContainer').removeClassName('SpellChecked');}
if(opt_notifyServer)
{new Ajax.Request('Ajax.php?action=SetSurveyOption',{parameters:{option:'SpellChecked',value:v}});}}
this.surveyOptions['SpellChecked']=v;},getSurveyOption:function(option)
{return this.surveyOptions[option];},setSurveyOption:function(option,value)
{this.surveyOptions[option]=value;},getScoringDefinition:function()
{if(this.scoringDefinition)
{return this.scoringDefinition;}
else
{return{};}},getScoringCategoryById:function(catId)
{var cat=null;if(catId&&this.scoringDefinition&&this.scoringDefinition.ScoringCategories)
{var categories=this.scoringDefinition.ScoringCategories;for(var i=0,len=categories.length;i<len;++i)
{if(categories[i].ID==catId)
{cat=Object.clone(categories[i]);break;}}}
return cat;},getAutoScoringCategory:function()
{var catId=null;catId=this.getScoringDefinition().AutoScoringCategory||'SC1';var autoScoreCat=this.getScoringCategoryById(catId);if(!catId||!autoScoreCat||autoScoreCat.Name!='Score')
{catId=null;}
return catId;},search:function(v)
{if(v=='')
{return this.clearSearchFilter();}
this.searchFilter={};for(var b=0,blen=this.blocks.length;b<blen;++b)
{var block=this.blocks[b];for(var q=0,qlen=block.questions.length;q<qlen;++q)
{var question=block.questions[q];if(question.search(v.toLowerCase()))
{this.searchFilter[question.id]=true;}}}
this.refresh();},clearSearchFilter:function()
{this.searchFilter=false;this.refresh();},isRTL:function()
{return isRTLLanguage(this.defaultLanguage);},openSurveyPreview:function(opt_dontSave)
{var s=BaseForm.getInstance();var url=s.previewURL;if(window.QES_Global)
QES_Global.saveSurvey(false);if(window.QTS_Global)
QTS_Global.saveSurvey(false);if(window.QGS_Global)
QGS_Global.saveSurvey(false);if(opt_dontSave)
{url+='&Q_DONT_SAVE=1';}
if(window.Qualtrics&&window.Qualtrics.previewWindow)
{Qualtrics.previewWindow.close();}
var w=window.open(url,'SurveyPreviewWindow');Qualtrics.previewWindow=w;},getSurveyPreviewURL:function(opt_lookAndFeel,opt_skinLib,opt_skinType,opt_skin,opt_numQuestions)
{var s=BaseForm.getInstance();var url=s.previewURL;var skinParam='';if(opt_skinLib)
{skinParam='&Q_Skin='+opt_skinLib+'|'+opt_skinType+'|'+opt_skin;}
var lookAndFeelParam='';if(opt_lookAndFeel)
lookAndFeelParam='&LookAndFeel=true';var questionsParam='';if(opt_numQuestions)
questionsParam='&QuestionsPerPage='+opt_numQuestions;if(this.revisionId)
{revisionParam='&Q_REV='+this.revisionId;}
else
{var revisionParam='';}
return url+lookAndFeelParam+questionsParam+skinParam+'&Q_DONT_SAVE=1'+revisionParam;}};window.BaseNotes=Class.create();BaseNotes.prototype={id:null,parentId:null,elementId:null,notes:null,status:null,saved:1,initialize:function(parentId,elementId)
{this.baseInit(parentId,elementId);},baseInit:function(parentId,elementId)
{this.id='notes_'+(Math.round(Math.random()*100000000));this.parentId=parentId;this.elementId=elementId;this.notes=new Array();this.status='Hidden';},addNote:function(note)
{var noteObj=new BaseNote();noteObj.generate(note);this.notes.push(noteObj);},getNote:function(noteId)
{for(var i in this.notes)
{if(this.notes[i].id==noteId)
{return this.notes[i];}}
return null;},removeNote:function(noteId)
{for(var i=0;i<this.notes.length;i++)
{if(this.notes[i].noteId==noteId)
{this.notes[i].removed=true;}}},setElementId:function(id)
{this.elementId=id;},setSaved:function(val)
{this.saved=val;},setStatus:function(status)
{this.status=status;},exportData:function()
{var pkg={Status:this.status,SurveyElementID:this.elementId,ParentID:this.parentId};return pkg;}};window.BaseNote=Class.create();BaseNote.prototype={id:null,noteId:null,message:null,excerpt:null,userId:null,userFirstName:null,userLastName:null,userFullName:null,dateTime:null,removed:true,initialize:function()
{this.baseInit();},baseInit:function()
{this.id='note_'+(Math.round(Math.random()*100000000));},generate:function(note)
{this.noteId=note.ID;this.message=note.Message;this.userId=note.UserID;this.userFullName=note.UserFullName;this.dateTime=note.DateTime;this.removed=note.Removed;this.excerpt=note.Excerpt;},exportData:function()
{var pkg={ID:this.noteId,Message:this.message,UserID:this.userId,Timestamp:this.timestamp,Removed:this.removed};return pkg;}};window.BaseBlock=Class.create();BaseBlock.getInstance=function(id)
{return BaseForm.getInstance().getBlockById(id);};BaseBlock.getBlockByBlockId=function(blockId)
{return BaseForm.getInstance()&&BaseForm.getInstance().getBlockByBlockId(blockId);};BaseBlock.prototype={id:null,type:null,subType:null,objType:'Block',blockId:null,element:null,blockNameObj:null,questions:null,parentId:null,addFirstQuestion:null,questionsDiv:null,parentObj:null,defaultPreviewMode:null,questionClusterSize:25,collapsedQuestionThreshold:60,collapsedQuestionMode:0,collapsed:0,rendering:0,flow:null,locked:false,passwordProtected:false,looping:null,loopingOptions:null,randomizeQuestions:null,elementCount:0,realQuestionCount:0,shell:false,options:null,ED:{},initialize:function()
{this.baseInit();},baseInit:function()
{this.id='block_'+(Math.round(Math.random()*100000000));this.questions=new Array();this.blockNameObj=new BlockName(this);this.blockNameObj.text='Default Block';},isReferenceElement:function()
{return this.isReferenceSurveyBlock()||this.isReferenceBlock();},isReferenceSurveyBlock:function()
{return this.subType=='ReferenceSurvey';},isReferenceBlock:function()
{return this.subType=='Dereferenced';},generate:function(json)
{if(json.collapsed){this.collapsed=json.collapsed;}
if(json['Shell'])
{this.elementCount=json['ElementCount'];this.shell=true;this.collapsed=1;}
this.blockId=json['ID'];var blockName=json['Description'];if(!blockName)
{blockName='Block Description (Click to edit)';}
this.blockNameObj.text=blockName;this.type=json['Type'];this.subType=json['SubType']||null;this.flow=json['Flow'];if(this.isReferenceElement())
{this.locked=4;}
if(json['Options'])
{if(json['Options']['BlockLocking']=='true'||json['Options']['BlockLocking']===true)
{this.locked=1;}
if(json['Options']['BlockLocking']=='partial')
{this.locked=2;}
if(json['Options']['BlockPassword']!=''&&json['Options']['BlockLocking']&&json['Options']['BlockLocking']!='false')
{this.passwordProtected=true;}
if(json['Options']['BenchmarkData'])
{this.benchmarkData=json['Options']['BenchmarkData'];}
if(json['Options']['EmbeddedData'])
{this.ED=json['Options']['EmbeddedData']||{};}
this.looping=json['Options']['Looping'];this.loopingOptions=json['Options']['LoopingOptions'];this.randomizeQuestions=json['Options']['RandomizeQuestions'];this.options={};this.options['NextButton']=json['Options']['NextButton'];this.options['PreviousButton']=json['Options']['PreviousButton'];this.options['nextButtonMID']=json['Options']['nextButtonMID'];this.options['previousButtonMID']=json['Options']['previousButtonMID'];this.options['nextButtonLibraryID']=json['Options']['nextButtonLibraryID'];this.options['previousButtonLibraryID']=json['Options']['previousButtonLibraryID'];}
if(json.BlockElements)
{if(json.BlockElements.length==undefined)
{Qualtrics.Error('BlockElements is an object instead of an array, cannot continue.');return false;}
for(var i=0,len=json.BlockElements.length;i<len;++i)
{var questionData=json.BlockElements[i];this.addBlockElement(questionData);}}
json=null;return true;},getName:function()
{return this.blockNameObj.text;},getBlockED:function(key)
{if(key&&this.ED[key])
{return this.ED[key];}
else if(!key)
{return this.ED;}
else
{return null;}},addBlockElement:function(questionData)
{var type=null;if(questionData['Type'])
{type=questionData['Type'];}
var question=this.createQuestion(type,null);question.generate(questionData);question.setSaved(true,null,true);this.addQuestion(question);questionData=null;return question;},createQuestion:function(type,opt_dontAssignQuestionNumber)
{return new BaseQuestion(this,opt_dontAssignQuestionNumber,type);},hasInPageDisplayLogic:function()
{var inPage=false;var qLength=this.questions.length;for(var i=0;i<qLength;i++)
{var inPage=this.questions[i].hasInPageDisplayLogic();if(inPage)break;}
return inPage;},render:function(parentId)
{if(this.parentId)
{parentId=this.parentId;}
this.element=QBuilder('div',{className:'BlockOuter'},[this.buildBlockInner(),QBuilder('div',{className:'BlockShadow'})]);if(this.type!='Trash')
{$(parentId).appendChild(this.element);}},buildBlockInner:function()
{this.blockInner=QBuilder('div',{id:this.id,className:'Block '+this.type},[this.buildHeader(),this.buildInner()]);return this.blockInner;},redraw:function()
{var old=this.blockInner;$(old).replace(this.buildBlockInner());},buildInner:function()
{this.questionsDiv=QBuilder('div',{className:'QuestionsDiv'});if(this.questions.length>0)
{this.renderQuestions();}
else
{this.noQuestionsRenderer();}
return this.questionsDiv;},buildHeader:function()
{var title=this.blockNameObj.text;var titleSpan=QBuilder('span',{});titleSpan.innerHTML=title;return QBuilder('div',{className:'BlockHeader'},[titleSpan,QBuilder('div',{className:'clear'})]);},noQuestionsRenderer:function()
{},buildBlockStatusIcon:function(className,text,callBack,blockId,param1)
{var icon=QBuilder('div',{className:'BlockStatus '+className,clickcallback:callBack,blockid:blockId,param1:param1},[QBuilder('div',{className:'Icon '+className,clickcallback:callBack,blockid:blockId,param1:param1}),QBuilder('div',{className:'LeftCap',clickcallback:callBack,blockid:blockId,param1:param1}),QBuilder('div',{className:'StatusText',clickcallback:callBack,blockid:blockId,param1:param1},text),QBuilder('div',{className:'RightCap',clickcallback:callBack,blockid:blockId,param1:param1}),QBuilder('div',{className:'clear',clickcallback:callBack,blockid:blockId,param1:param1})]);return icon;},renderQuestions:function()
{if(this.questions.length>0)
{if(this.collapsed)
{this.collapsed=0;if(this.element!=null)
{$(this.element).removeClassName('Collapsed');}}
for(var i=0,len=this.questions.length;i<len;++i)
{var q=this.questions[i];q.render({initialRender:true});}}},refreshQuestions:function()
{var selectedQuestion=QuestionActions.unselectAll();deleteChildren(this.questionsDiv);this.renderQuestions();if(selectedQuestion)
{QuestionActions.select(selectedQuestion);}
if(this.getQuestionOverlay&&this.questionsDiv&&this.getQuestionOverlay())
{this.questionsDiv.appendChild(this.getQuestionOverlay());}},getFilteredQuestionsCount:function()
{var survey=this.parentObj;if(survey.searchFilter)
{var filteredQuestionsCount=0;for(var i=0,len=this.questions.length;i<len;++i)
{if(survey.searchFilter[this.questions[i].id])
{filteredQuestionsCount++;}}
return filteredQuestionsCount;}
return this.realQuestionCount;},isLocked:function()
{if(this.locked)
return true;if(this.parentObj)
{if(this.parentObj.isLocked)
{return this.parentObj.isLocked();}
if(this.parentObj.locked)
{return this.parentObj.locked;}}
return false;},countRealQuestions:function()
{this.realQuestionCount=0;for(var i=0,len=this.questions.length;i<len;++i)
{if(this.questions[i].elementType=='Question')
{this.realQuestionCount++;}}
return this.realQuestionCount;},addBlockBelow:function()
{return addBlock({},this.getPosition()+1);},toggleLargeBlockMode:function()
{if(this.rendering)
{return false;}
if(QES_Global.suspendSelects)
{return;}
if(this.collapsedQuestionMode)
{this.collapsedQuestionMode=0;}
else
{this.collapsedQuestionMode=1;}
var blocks=BaseForm.getInstance().blocks;for(var i=0,len=blocks.length;i<len;++i)
{blocks[i].resetCachedQuestionHeights();}
this.refreshQuestions();},expand:function()
{if(this.shell)
{return this.unShell();}
if(this.collapsed)
{this.collapsed=0;if(this.element&&this.element.firstChild)
{var blockDiv=this.element.firstChild;$(blockDiv).removeClassName('Collapsed');}
this.renderQuestions();this.countRealQuestions();this.updateMeta();QuestionTopCache={};this.height=null;}},unShell:function()
{var blockObj=this;blockObj.shell=0;blockObj.loading=1;blockObj.collapsed=0;blockObj.redraw();new Ajax.Request('Ajax.php?action=GetBlockElements',{parameters:{'BlockID':blockObj.blockId},onComplete:function(transport){try{var elements=Qualtrics.parseJSON(transport.responseText);for(var i=0,len=elements.length;i<len;++i)
{blockObj.addBlockElement(elements[i]);}
for(var i=0,len=blockObj.questions.length;i<len;++i)
{blockObj.questions[i].unpackage();}
blockObj.loading=0;blockObj.redraw();}
catch(e)
{console.error(e);}}});},collapseAndScroll:function()
{if(QES_Global.suspendSelects)
{return;}
var viewTop=getScrollInfo()[1];var blockHeight=$(this.element).getHeight();var blockHeaderHeight=242;this.collapse();new Effect.ScrollToY(viewTop-blockHeight+blockHeaderHeight,{duration:0,afterFinish:updateScrollInfo});},collapse:function()
{if(QES_Global.suspendSelects)
{return;}
if(!this.collapsed)
{if(!this.rendering)
{QuestionActions.unselectAll();if(this.element&&this.element.firstChild)
{var blockDiv=this.element.firstChild;$(blockDiv).addClassName('Collapsed');}
for(var qi=0,len=this.questions.length;qi<len;++qi)
{var question=this.questions[qi];question.removeQuestionDOM();}
this.collapsed=1;QuestionTopCache={};this.updateMeta();}}},updateMeta:function()
{if($(this.id+'_TitleMeta'))
$(this.id+'_TitleMeta').innerHTML=this.getMetaTitle();},getMetaTitle:function()
{var metaTitle='';if(this.collapsed)
{var questionCount=this.getFilteredQuestionsCount();var labelText=questionCount!=1?getMessage('SiteWide','Questions'):getMessage('SiteWide','Question');metaTitle='('+questionCount+' '+labelText+')';}
if(this.questions.length>this.collapsedQuestionThreshold)
{metaTitle+=' <a href="#toggleLargeBlockMode" class="LargeBlockToggle" clickcallback="Block.toggleLargeBlockMode($evt)" instanceid="'+this.id+'">Turn on/off large block mode.</a>';}
return metaTitle;},confirmRemoveBlock:function()
{if(QES_Global.suspendSelects)
{return;}
var block=this;if(block.questions.length<1)
{if(block)
{block.fadeRemoveBlock();}}},fadeRemoveBlock:function()
{if(QES_Global.suspendSelects)
{return;}
window.QES_OverQuestion.init();window.QES_OverQuestion.suspend=true;var that=this;new Effect.Fade($(this.element),{duration:0.5,afterFinish:function(){that.removeBlock();window.QES_OverQuestion.suspend=false;if(that.parentObj.blocks.length<2)
{that.parentObj.refresh();}}});},removeBlock:function()
{if(QES_Global.suspendSelects)
{return;}
QuestionTopCache={};try{$(this.element).remove();}
catch(e)
{Qualtrics.Error('remove question error: '+e);}
this.element=null;var pos=this.getPosition();this.parentObj.blocks.splice(pos,1);this.questionsDiv=null;this.element=null;var that=this;new Ajax.Request('Ajax.php?action=RemoveBlock',{method:'post',parameters:{BID:that.blockId}});Toolbox.getInstance().updatePosition();},checkForEmptyBlock:function()
{if(this.questions.length===0)
{this.addEmptyClass();}
else if($(this.id+'_removeBlock'))
{this.removeEmptyClass();}},addEmptyClass:function()
{$(this.element).addClassName('Empty');this.collapsed=0;},removeEmptyClass:function()
{$(this.element).removeClassName('Empty');},addQuestion:function(question,position)
{var baseForm=BaseForm.getInstance();if(baseForm)
{baseForm.blowDisplayLogicCache();}
question.parentObj=this;if(this.defaultPreviewMode!=null)
{question.previewMode=this.defaultPreviewMode;}
if(position===undefined)
{this.questions[this.questions.length]=question;}
else
{this.questions.splice(position,0,question);}
if(question.elementType=='Question')
this.realQuestionCount++;},addDefaultQuestionAndRender:function(position,includeBenchmarkQuestionID)
{if(this.locked)
{msg(getMessage('EditSection','Locked'));return false;}
var questionCount=this.questions.length;if(inlineEditor.getInstance())
{inlineEditor.getInstance().removeInlineEditor();}
if(!BaseForm.getInstance().getPermission('editQuestions')||!BaseForm.getInstance().getPermission('addNewQuestion'))
{return;}
var q=createDefaultQuestion();if(includeBenchmarkQuestionID)
{q.benchmarkID=QualtricsTools.createNewId('TGQID');}
this.addQuestion(q,position);Survey.getInstance().questionCount++;q.render();q.frameQuestion();if(QES_Global.suspendSelects)
{q.save({asynchrounous:false});}
else
{QuestionActions.select(q);}
if(q.scoreAll&&q.canScore())
{q.scoreAll();}
return q;},getDefaultPreviewMode:function()
{if(this.defaultPreviewMode!=null)
{return this.defaultPreviewMode;}
else
{return BaseForm.getInstance().defaultPreviewMode;}},resetPreviewModes:function()
{for(var i=0,len=this.questions.length;i<len;++i)
{this.questions[i].previewMode=null;}},resetCachedQuestionHeights:function()
{for(var i=0,len=this.questions.length;i<len;++i)
{this.questions[i].height=null;}},getPosition:function()
{var pos=null;for(var i=0,len=this.parentObj.blocks.length;i<len;++i)
{var b=this.parentObj.blocks[i];if(this.id==b.id){pos=i;return pos;}}
return pos;},getSibling:function(delta,skipCollapsedBlocks)
{if(skipCollapsedBlocks===undefined)
skipCollapsedBlocks=true;var pos=this.getPosition();var sibling=this.parentObj.blocks[pos+delta];for(var i=pos+delta,len=this.parentObj.blocks.length;(i<len&&i>-1);)
{sibling=this.parentObj.blocks[i];if(sibling)
{if(((!sibling.collapsed||!skipCollapsedBlocks)&&sibling.type!='Trash')&&sibling.type!='Conjoint')
{return sibling;}}
i+=(delta>0)?1:-1;}
return false;},getFirst:function()
{if(this.questions.length>0)
{return this.questions[0];}},getLast:function()
{if(this.questions.length>0)
{return this.questions[this.questions.length-1];}},getQuestionBySystemId:function(questionId)
{for(var i=0,len=this.questions.length;i<len;++i)
{var question=this.questions[i];if(question.questionId==questionId)
{return question;}}},frameBlock:function()
{if(this.element)
{var el=this.element.firstChild;var top=Position.cumulativeOffset(this.element)[1];var viewBottom=scrollInfo[1]+getPageSize()[3];if(top>viewBottom)
{new Effect.ScrollTo(this.element,{afterFinish:function(effect)
{new Effect.Highlight(el.firstChild);Toolbox.getInstance().deferredUpdatePosition();}});}
else
{Toolbox.getInstance().deferredUpdatePosition();new Effect.Highlight(this.element.firstChild);}}},shrinkTextToFit:function(text)
{var max=15;var min=6;var range=max-min;var p=1-(text.length/max);var x=range*p;var size=min+x;if(size<min)
size=min;return size;},getLoopDescriptionByIndex:function(index,truncate)
{var description=getMessage('Piping','Loop')+' '+(index+1)+': ';if(!truncate)
{truncate=40;}
if(this.hasLoops())
{var loops=this.getAllLoops();for(var label in loops[index])
{description+=loops[index][label]+', ';}
description=description.substr(0,description.length-2);if(description.length>truncate)
{description=description.substr(0,truncate)+'...';}
return description;}
else
{return'';}},getAllLoops:function()
{var loops=[];if(this.hasLoops())
{var i=0;var staticLoops=this.loopingOptions.Static;for(var label in staticLoops)
{var loopFields={};if(this.hasLoopQuestion())
{var loopQID=this.loopingOptions.QID;var loopQuestion=BaseQuestion.getQuestionByQuestionId(loopQID);var choiceText='';if(loopQuestion.choices[i])
{choiceText=loopQuestion.choices[i].getText();}
loopFields['1']=choiceText;}
if(this.hasStaticLoops())
{for(var field in staticLoops[label])
{loopFields[field]=staticLoops[label][field];}}
loops.push(loopFields);i++;}}
return loops;},hasLoops:function()
{return this.loopingOptions!=null;},hasLoopQuestion:function()
{return this.hasLoops()&&this.loopingOptions.QID!=null;},hasStaticLoops:function()
{var noStatic=true;var staticLoops=this.loopingOptions.Static;if(!staticLoops)
{return false;}
for(var label in staticLoops)
{noStatic=noStatic&&staticLoops[label]instanceof Array&&!staticLoops[label].length;}
return!noStatic;}};window.ConjointBlock=Class.create(BaseBlock,{type:'Conjoint',objType:'ConjointBlock',build:function()
{var container=QBuilder('div',{});this.conjointInfo={};return container;},generate:function(conjointInfo)
{if(conjointInfo)
{this.conjointInfo=conjointInfo;}
try{QModules.loadModule('conjointeditor.js');if(!this.conjointEditor)
{this.conjointEditor=new Qualtrics.ConjointEditor({onEdit:this.onInlineEdit.bind(this),onSave:this.onConjointSave.bind(this),headsUp:false});}
this.conjointEditor.generate(this.conjointInfo);this.saved=true;}catch(e)
{alert(e);}},noQuestionsRenderer:function()
{this.questionsDiv.appendChild(this.buildInner());},buildInner:function()
{var exportTag=this.conjointInfo?this.conjointInfo.DataExportTag:'';var questionNumberDiv='';var div=QBuilder('div',{className:'ConjointContainer'},[QBuilder('div',{className:'Sidebar'},[questionNumberDiv=QBuilder('span',{className:'ExportTag Editable',clickcallback:'ConjointBlock.editExportTag:'+this.id+'($evt)'},[exportTag])]),QBuilder('div',{className:'ConjointEditorContainer'},[this.buildEditor()])]);div.appendChild(QBuilder('div',{className:'BlockOptionsFooter'},[QBuilder('div',{className:'TheAddBlockLink',clickcallback:'Block.addBlockBelow',instanceid:this.id},getMessage('EditSection','AddBlock'))]));if(exportTag&&exportTag.length>3)
{var size=this.shrinkTextToFit(exportTag);$(questionNumberDiv).setStyle({fontSize:size+'px'});}
return div;},buildEditor:function()
{if(!this.conjointInfo)
{return QBuilder('div',{className:'Loading loadingImage'});}
return this.conjointEditor.build();},buildHeader:function()
{var desc=this.conjointInfo?this.conjointInfo.Description:'';return QBuilder('div',{className:'BlockHeader'},[QBuilder('div',{className:'Arrow',clickcallback:'BlockActions.headerClick($evt)'}),QBuilder('span',{className:'Conjoint BlockTitle Editable',clickcallback:'ConjointBlock.editTitle:'+this.id+'($evt)'},[desc]),QBuilder('div',{className:'ExpandLabel',bubbleup:'true',clickcallback:'BlockActions.headerClick($evt)'},getMessage('EditSection','ClickToShowQuestions')),this.buildHeaderMenuButton()]);},buildHeaderMenuButton:function()
{return Qualtrics.Menu.buildMenuButton(getMessage('Conjoint','ConjointBlockOptions'),'ConjointBlock.getConjointMenu:'+this.id);},getConjointMenu:function()
{var type=this.conjointInfo['Type'];return{items:[{display:getMessage('SiteWide','AdvancedOptions')+'...',action:'ConjointBlock.openAdvancedOptions:'+this.id},{separator:true},{display:getMessage('Conjoint','DeleteConjoint')+'...',action:'ConjointBlock.confirmDeleteConjoint:'+this.id}]};},openAdvancedOptions:function()
{this.tempInfo=null;var win=new Q_Window({id:'AdvancedConjointOptions',width:780,buttons:['cancel','save:ConjointBlock.saveAdvancedOptions:'+this.id]});win.setContent(this.conjointEditor.buildAdvancedOptions());},saveAdvancedOptions:function()
{this.conjointEditor.saveAdvancedOptions();},setConjointProperty:function(key,val)
{this.conjointInfo[key]=val;this.onConjointSave();},editTitle:function(evt)
{new Editable(Event.element(evt),this.conjointInfo,'Description',{afterEdit:this.afterTitleEdit.bind(this),onEdit:this.onInlineEdit.bind(this)}).edit();},editExportTag:function(evt)
{new Editable(Event.element(evt),this.conjointInfo,'DataExportTag',{afterEdit:this.afterTitleEdit.bind(this),onEdit:this.onInlineEdit.bind(this)}).edit();},afterTitleEdit:function()
{},onInlineEdit:function()
{this.onConjointSave();},onConjointSave:function()
{this.saved=false;this.startSaveTimer();QuestionTopCache={};},startSaveTimer:function()
{if(this.saveTimer)
{window.clearTimeout(this.saveTimer);}
this.saveTimer=window.setTimeout(this.save.bind(this),2000);},save:function()
{if(this.conjointEditor)
{this.conjointInfo=this.conjointEditor.conjointInfo;this.saved=true;new Ajax.Request('Ajax.php?action=SetConjoint',{parameters:{'ConjointInfo':Object.toJSON(this.conjointInfo)}});}},confirmDeleteConjoint:function()
{var blockObj=this;if(blockObj.isLocked())
{msg(getMessage('EditSection','Locked'));return false;}
var surveyId=Survey.getInstance().id;var name=this.conjointInfo['Description'];var deleteOptions={title:getMessage('ResultsSection','Confirmation'),strong:false,deleteButtonText:getMessage('SiteWide','Delete'),deleteMessage:getMessage('EditSection','ConjointConfirmDeletion',name),deleteCallBackParameters:{ajaxAction:'DeleteConjoint',ajaxParameters:{SID:surveyId,'conjointID':this.conjointInfo.ID},ajaxOnComplete:'ConjointBlock.completeRemoveConjoint:'+this.id}};QualtricsCPTools.showDeleteConfirmation(deleteOptions);},completeRemoveConjoint:function()
{this.conjointEditor.destroy();removeElement(this.element);Survey.getInstance().reload();},handleCreateConjointResult:function(transport)
{var json=Qualtrics.parseJSON(transport.responseText);if(json['ConjointInfo'])
{this.generate(json['ConjointInfo']);this.redraw();}}});ConjointBlock.getInstance=BaseBlock.getInstance;window.questionsRegistry={};window.QuestionTopCache={};window.BaseQuestion=Class.create();BaseQuestion.getQuestionById=function(id)
{var q=questionsRegistry[id];if(q)
{return q;}
return null;};BaseQuestion.getQuestionByQuestionId=function(questionId)
{var internalId=BaseQuestion.questionIdMap[questionId];if(internalId)
{return BaseQuestion.getQuestionById(internalId);}
return null;};BaseQuestion.questionIdMap={};BaseQuestion.getInstance=function(id)
{return BaseQuestion.getQuestionById(id);};BaseQuestion.dynamicChoicesLocatorStack=null;BaseQuestion.prototype={id:null,actionPath:'BaseQuestion',type:'Question',objType:'Question',questionId:null,_saved:0,_lastModifiedDate:null,savedSkipLogic:null,text:"",text_Unsafe:"",description:"",customDescription:false,questionNumber:1,exportTag:null,choices:null,answers:null,columnLabels:null,columnLabelsTrash:null,dynamicChoices:null,dynamicAnswers:null,proxieChoices:null,proxieAnswers:null,nextChoiceId:1,nextAnswerId:1,choiceTextPosition:null,answerTextPosition:null,choicesTrash:null,answersTrash:null,languages:null,questionType:'MC',questionJS:null,options:null,element:null,choicesDiv:null,choicesArchive:null,questionTextDiv:null,questionCanvas:null,skipLogicDiv:null,showEditLinksInPreview:false,height:null,parentObj:null,questionTextEdited:0,collapsed:0,selected:0,last:0,skipAutoEdit:0,choicesWidth:null,previewMode:0,allowOutlineMode:1,previewDiv:null,selector:'',subSelector:'',URL:null,Graphics:null,GraphicsDescription:null,elementType:'Question',onLoad:null,questionSpecificData:null,skipLogic:null,skipLogicEditor:null,displayLogic:null,displayLogicEditor:null,cachedPipingOptions:null,autoResponseScalesY:null,autoResponseScalesX:null,randomization:null,answerRandomization:null,renderer:null,gradingData:null,variableNaming:false,recodeValues:false,recodeValuesJSON:null,choiceDataExportTags:false,changedOption:[],regionHandler:null,initialize:function(parentObj,opt_dontAssignQuestionNumber,opt_type)
{this.baseInit(parentObj,opt_dontAssignQuestionNumber,opt_type);},baseInit:function(parentObj,opt_dontAssignQuestionNumber,opt_type)
{if(parentObj)
{this.parentObj=parentObj;}
this.setSaved(false);this.questionTextObj=new BaseQuestionText(this);this.choices=[];this.answers=[];this.columnLabels=[];this.columnLabelsTrash=[];this.choicesTrash=[];this.answersTrash=[];this.languages={};this.id='q'+(Math.round(Math.random()*100000000));if(opt_type)
{this.type=opt_type;}
questionsRegistry[this.id]=this;if(!opt_dontAssignQuestionNumber)
{this.assignNewQuestionNumber();}
else
{this.exampleQuestion=true;}
this.createQuestionOptions();if(this.parentObj)
{this.previewMode=this.parentObj.getDefaultPreviewMode();}
else
{this.previewMode=BaseForm.getInstance().defaultPreviewMode;}
this.setDefaultSelectors();},isInReferenceElement:function()
{return this.parentObj&&this.parentObj.isReferenceElement();},swapSelectionAxes:function()
{var old=this.choices;var oldTrash=this.choicesTrash;var oldNextId=this.nextChoiceId;this.choices=this.answers;this.choicesTrash=this.answersTrash;this.nextChoiceId=this.nextAnswerId;this.answers=old;this.answersTrash=oldTrash;this.nextAnswerId=oldNextId;},hasInPageDisplayLogic:function()
{var inPage=false;if(this.displayLogic)
{inPage=this.displayLogic.getData().inPage;}
return inPage;},safeToUseInPageDisplayLogic:function()
{var hasSkipLogic=this.hasSkipLogic();var hasCarryForwardChoices=(this.dynamicChoices!=null);var options=this.getOptions();var hasValidation=options.validation&&options.validation!='None';var hasForceResponse=(options.ForceResponse&&options.ForceResponse!='OFF');var usedByLoopAndMerge=false;var blocks=this.parentObj.parentObj.blocks;for(var i=0;i<blocks.length;i++)
{var block=blocks[i];if(this.questionId&&block.loopingOptions&&block.loopingOptions.QID==this.questionId)
{usedByLoopAndMerge=true;break;}}
var hasChoiceDisplayLogic=false;if(this.choices)
{var len=this.choices.length;for(var i=0;i<len;i++)
{if(this.choices[i].displayLogic!=undefined)
{hasChoiceDisplayLogic=true;break;}}}
var loopTargetInvalid=false;var incompatibleQuestionType=false;if(this.displayLogic&&this.displayLogic.logicEditor)
{var logic=this.displayLogic.logicEditor.getData();for(var expressionSetIndex in logic)
{if(!isNaN(expressionSetIndex))
{for(var expressionIndex in logic[expressionSetIndex])
{if(!isNaN(expressionIndex))
{var ex=logic[expressionSetIndex][expressionIndex];if(ex['LogicType']=='Question')
{if(ex['QuestionID'])
{var question=this.parentObj.parentObj.getQuestionBySystemId(ex['QuestionID']);if(question)
{var questionType=question.questionType;if(questionType=='DD'||questionType=='SS'||questionType=='FileUpload'||questionType=='GAP'||questionType=='PGR'||questionType=='Timing'||questionType=='SBS'||questionType=='HeatMap'||questionType=='HotSpot'||questionType=='RO'||questionType=='CS')
{incompatibleQuestionType=questionType;}
if(question.selector=='DL'||question.selector=='MSB'||question.selector=='Bipolar')
{incompatibleQuestionType=question.selector;}
if(questionType=='Matrix'&&(question.selector=='RO'||question.selector=='CS'||question.selector=='TE'))
{incompatibleQuestionType=question.selector;}
if(questionType=='Matrix'&&question.subSelector=='DL')
{incompatibleQuestionType=question.subSelector;}}
else
{console.error('getQuestionBySystemId returned no question:'+ex['QuestionID']);}}
if(ex['LoopAndMergeLoops']&&ex['LoopAndMergeLoops']!='current')
{loopTargetInvalid=true;}}}}}}}
if(this.questionType=='Slider')
{incompatibleQuestionType=this.questionType;}
var incompatibleFeatures={safe:(!hasSkipLogic&&!hasCarryForwardChoices&&!usedByLoopAndMerge&&!hasChoiceDisplayLogic&&!incompatibleQuestionType&&!loopTargetInvalid),skipLogic:hasSkipLogic,carryForwardChoices:hasCarryForwardChoices,validation:hasValidation,forceResponse:hasForceResponse,loopAndMerge:usedByLoopAndMerge,choiceDisplayLogic:hasChoiceDisplayLogic,incompatibleQuestionType:incompatibleQuestionType,loopAndMergeTarget:loopTargetInvalid};return incompatibleFeatures;},getUndoPkg:function()
{return Qualtrics.History.Actions.buildParameter({def:this.exportData(),blockId:this.parentObj.id,pos:this.getPosition()});},addUndo:function(undoPkg,redoPkg,opt_description)
{var desc=opt_description||'Modify Question '+this.exportTag;Qualtrics.History.getInstance().addAction(desc,{action:'QuestionActions.restoreQuestion',parameters:[this.id,undoPkg]},{action:'QuestionActions.restoreQuestion',parameters:[this.id,redoPkg]});},getInstanceId:function()
{return this.id;},getAutoDescription:function(opt_text)
{return QualtricsCPTools.stripComments(opt_text||this.text).stripTags().truncate(200);},assignNewQuestionNumber:function()
{if(this.type=='Question')
{BaseQuestion.totalQuestionCount++;this.questionNumber=BaseQuestion.totalQuestionCount;}},setDefaultSelectors:function()
{var selectors=QuestionTypes.getDefaultSelectors(this.questionType);if(selectors)
{this.selector=selectors['selector'];this.subSelector=selectors['subSelector'];}},generate:function(json)
{try
{if(json['Type'])
{this.elementType=json['Type'];}
this.questionTextEdited=1;if(!this.exampleQuestion)
{questionsRegistry[this.id]=this;}
this.dynamicChoices=null;this.dynamicAnswers=null;if(!this.elementType||this.elementType=='Question')
{if(json['QuestionID'])
{this.questionId=json['QuestionID'];}
if(json['QuestionDefinition'])
{var def=json['QuestionDefinition'];this.questionType=def['QuestionType'];this.text=def['QuestionText'];this.text_Unsafe=def['QuestionText_Unsafe'];this.description=def['QuestionDescription'];this.questionJS=def['QuestionJS'];this.defaultChoices=def['DefaultChoices'];if(this.description&&this.description.length>200)
{this.description=this.getAutoDescription(this.description);}
this.exportTag=def['DataExportTag'];this.selector=def['Selector'];this.subSelector=def['SubSelector'];if(this.selector=='NPS')
{this.questionType='NPS';}
if(!this.questionId)
{this.questionId=def['QuestionID'];}
var choicesData=def['Choices'];var answersData=def['Answers'];if(def['Labels'])
{answersData=def['Labels'];}
var groupsData=def['Groups'];if(def['URL'])
{this.Graphics=def['URL'];this.url=def['URL'];}
if(def['Graphics'])
{this.Graphics=def['Graphics'];}
if(def['GraphicsDescription'])
{this.GraphicsDescription=def['GraphicsDescription'];}
if(def['Files'])
{this.Files=def['Files'];}
if(def['FilesDescription'])
{this.FilesDescription=def['FilesDescription'];}
if(def['Videos'])
{this.Videos=def['Videos'];}
if(def['VideosEmbed'])
{this.VideosEmbed=def['VideosEmbed'];}
if(def['ChoiceTextPosition'])
{this.choiceTextPosition=def['ChoiceTextPosition'];}
if(def['AnswerTextPosition'])
{this.answerTextPosition=def['AnswerTextPosition'];}
if(def['OrgHierarchyID'])
{this.OrgHierarchyID=def['OrgHierarchyID'];}
if(def['OrgHierarchyName'])
{this.OrgHierarchyName=def['OrgHierarchyName'];}
if(def['DynamicChoices'])
{this.dynamicChoices=def['DynamicChoices'];}
if(def['DynamicAnswers'])
{this.dynamicAnswers=def['DynamicAnswers'];}
if(def['InPageDisplayLogic']&&this.addDisplayLogic)
{this.addDisplayLogic(def['InPageDisplayLogic'],false,true);}
if(def['DisplayLogic']&&this.addDisplayLogic)
{this.addDisplayLogic(def['DisplayLogic'],false,true);}
if(def['Configuration'])
{var config=def['Configuration'];if(config['ChoiceColumnWidth'])
{this.choicesWidth=config['ChoiceColumnWidth'];}
if(config['ChoiceColumnWidthPixels'])
{this.choicesWidthPixels=config['ChoiceColumnWidthPixels'];}
if(config['QuestionDescriptionOption']=='SpecifyLabel')
{this.customDescription=true;}
if(config['OrgHierarchySearchField'])
{this.OrgHierarchySearchField=config['OrgHierarchySearchField'];}}
if(def['Randomization'])
{this.randomization=def['Randomization'];}
if(def['AnswerRandomization'])
{this.answerRandomization=def['AnswerRandomization'];}
if(json['SkipLogic'])
{QModules.loadModule('SkipLogic.js');this.skipLogic=json['SkipLogic'];var lastSkipLogic=this.parentObj.parentObj.lastSkipLogicId;for(var i=0,len=this.skipLogic.length;i<len;++i)
{if(this.skipLogic[i]['SkipLogicID']>lastSkipLogic)
{this.parentObj.parentObj.lastSkipLogicId=this.skipLogic[i]['SkipLogicID'];}}}
if(json['SkipMarker'])
{this.skipMarker=json['SkipMarker'];}
if(choicesData)
{this.choices=[];if(def['ChoiceOrder']&&def['ChoiceOrder'].length===0)
{delete def['ChoiceOrder'];}
var order=def['ChoiceOrder']||Object.keys(choicesData);this.addChoices(choicesData,order);}
if(answersData)
{this.answers=[];var highestAnswerId=0;order=def['AnswerOrder']||Object.keys(answersData);for(i=0,len=order.length;i<len;++i)
{var answerId=order[i];var answerNumber=Number(answerId);var answerData=answersData[answerId];if(answerData)
var display=answerData['Display'];else
display='';if(answerData&&display!=undefined)
{var answer=this.addAnswer(display,null,true);answer.answerId=answerId;if(answerData['ExclusiveAnswer'])answer.exclusive=answerData['ExclusiveAnswer'];answer.generate(answerData);if(answerNumber>highestAnswerId)
{highestAnswerId=answerNumber;this.nextAnswerId=highestAnswerId+1;}}}}
if(def['Answers']!=undefined&&def['AnswerMap'])
{this.answerMap=def['AnswerMap'];}
if(def['ColumnLabels'])
{this.columnLabels=this.generateColumnLabels(def['ColumnLabels'],false);}
if(groupsData)
{this.answers=[];for(i in groupsData)
{if(typeof groupsData[i]=='function')continue;var groupName=groupsData[i];answer=this.addAnswer(groupName);answer.setEdited(1);}}
if(def['ChoiceGroupOrder'])
{this.choiceGroupOrder=def['ChoiceGroupOrder'];}
if(def['ChoiceGroups'])
{this.addChoiceGroups(def['ChoiceGroups']);}
if(def.Regions&&QuestionTypes[this.questionType].hasRegions)
this.getRegionHandler().setRegions(def.Regions);var applicableSelectionListType=this.getRecodeListType();if(def['AnalyzeChoices'])
{var analyzeChoice=def['AnalyzeChoices'];for(var selectionId in analyzeChoice)
{var selectionObj=this.getSelectionBySystemId(applicableSelectionListType,selectionId);if(selectionObj)
{if(analyzeChoice[selectionId]=='on'||analyzeChoice[selectionId]===true)
{selectionObj.analysis=true;}
else if(analyzeChoice[selectionId]=='No'||analyzeChoice[selectionId]===false)
{selectionObj.analysis=false;}}}}
if(def['RecodeValues'])
{this.recodeValuesJSON=def['RecodeValues'];this.recodeValuesFromStoredJSON();}
if(def['VariableNaming'])
{var variableNaming=def['VariableNaming'];for(selectionId in variableNaming)
{selectionObj=this.getSelectionBySystemId(applicableSelectionListType,selectionId);if(selectionObj)
{selectionObj.variableNaming=variableNaming[selectionId];}}}
if(def['ChoiceDataExportTags'])
{var choiceDataExportTags=def['ChoiceDataExportTags'];for(selectionId in choiceDataExportTags)
{selectionObj=this.getSelectionBySystemId('choices',selectionId);if(selectionObj)
{selectionObj.choiceDataExportTag=choiceDataExportTags[selectionId];}}}
if(def['GradingPoints'])
{this.generateGrading(def);}
if(def['RecodeValues'])
{this.recodeValues=true;}
if(def['VariableNaming'])
{this.variableNaming=true;}
if(def['ChoiceDataExportTags'])
{this.choiceDataExportTags=true;}
if(def['GradingData'])
{this.gradingData=def['GradingData'];}
if(def['DynamicChoicesData'])
{this.dynamicChoicesData=def['DynamicChoicesData'];}
this.options={};this.populateQuestionOptions(json);if(QES_UnPackagers[this.questionType])
{this.tempDefinitionToUnpackage=def;}
if(def['Language'])
{this.generateLanguages(def['Language']);}
json=null;}
else
{this.text=json['Description'];this.questionId=json['QuestionID'];}}
if(this.questionId&&!this.exampleQuestion)
{BaseQuestion.questionIdMap[this.questionId]=this.id;}
this.checkForMissingGroups();}
catch(e)
{Qualtrics.Error(this.questionType+' '+e);}},addChoices:function(choicesData,order,prefix)
{var highestChoiceId=0;for(var i=0,len=order.length;i<len;++i)
{var choiceElementId=order[i];var choiceNumber=Number(choiceElementId);if(typeof choicesData[choiceElementId]=='undefined')
continue;var choiceData=choicesData[choiceElementId];var display=choiceData['Display'];if(choiceData&&display!=undefined)
{var choice=this.addChoice(display,null,true);choice.choiceId=choiceElementId;choice.generate(choiceData);if(choiceNumber>highestChoiceId)
{highestChoiceId=choiceNumber;this.nextChoiceId=highestChoiceId+1;}
if(choiceData['ExclusiveAnswer'])choice.exclusive=choiceData['ExclusiveAnswer'];}}
return highestChoiceId;},recodeValuesFromStoredJSON:function()
{for(selectionId in this.recodeValuesJSON)
{selectionObj=this.getSelectionBySystemId(this.getRecodeListType(),selectionId);if(selectionObj)
{selectionObj.recodeValue=this.recodeValuesJSON[selectionId];}}},getNewGroupId:function()
{var highestNumber=0;for(var groupId in this.choiceGroups)
{groupId=String(groupId);var groupNumber=Number(groupId.substring(3));if(groupNumber>highestNumber)
{highestNumber=groupNumber;}}
return'cg_'+(highestNumber+1);},hasChoiceGroups:function()
{if(this.choiceGroups)
{return true;}
return false;},createNewChoiceGroup:function(groupName,opt_position)
{if(this.isLocked())
{msg(getMessage('EditSection','Locked'));return;}
if(this.dynamicChoices)
{alert(getMessage('EditSection','ChoiceCarryForwardBreaksGroupsWarning'));return false;}
this.activateChoiceGroups(true);var newGroupId=this.getNewGroupId();var groupDef={GroupLabel:groupName};if(opt_position||opt_position===0)
{this.choiceGroupOrder.splice(opt_position,0,newGroupId);}
else
{this.choiceGroupOrder.push(newGroupId);}
this.setSaved(0);return this.addChoiceGroup(newGroupId,groupDef);},addChoiceGroups:function(choiceGroupsData)
{for(var itemId in choiceGroupsData)
{this.addChoiceGroup(itemId,choiceGroupsData[itemId]);}},removeAllChoiceGroups:function()
{if(this.choiceGroups)
{for(var groupId in this.choiceGroups)
{this.choiceGroups[groupId].remove();}}},checkForMissingGroups:function()
{for(var groupId in this.choiceGroups)
{var parent=this.findGroupItemParent(groupId);if(!parent)
{this.choiceGroupOrder.push(groupId);}}},findGroupItemParent:function(itemId)
{for(var i=0,len=this.choiceGroupOrder.length;i<len;++i)
{if(this.choiceGroupOrder[i]==itemId)
{return this;}}
for(var groupId in this.choiceGroups)
{for(var i=0,len=this.choiceGroups[groupId].choiceGroupOrder.length;i<len;++i)
{if(this.choiceGroups[groupId].choiceGroupOrder[i]==itemId)
{return this.choiceGroups[groupId];}}}},unpackage:function()
{if(this.dynamicChoicesData)
{this.restoreSelectionDataMap('proxieChoices',this.dynamicChoicesData,'meta');}
if(this.tempDefinitionToUnpackage)
{if(this.tempDefinitionToUnpackage['RecodeValues'])
{this.restoreSelectionDataMap('proxieChoices',this.tempDefinitionToUnpackage['RecodeValues'],'recodeValue');this.restoreSelectionDataMap('proxieAnswers',this.tempDefinitionToUnpackage['RecodeValues'],'recodeValue');}
if(this.tempDefinitionToUnpackage['VariableNaming'])
{this.restoreSelectionDataMap('proxieChoices',this.tempDefinitionToUnpackage['VariableNaming'],'variableNaming');this.restoreSelectionDataMap('proxieAnswers',this.tempDefinitionToUnpackage['VariableNaming'],'variableNaming');}
this.runSelectionPostUnPackagers(this.tempDefinitionToUnpackage);if(QES_UnPackagers[this.questionType]&&this.tempDefinitionToUnpackage)
{QES_UnPackagers[this.questionType](this,this.tempDefinitionToUnpackage);}
if(this.tempDefinitionToUnpackage['AdditionalQuestions'])
{for(var qid in this.tempDefinitionToUnpackage['AdditionalQuestions'])
{var qdef=this.tempDefinitionToUnpackage['AdditionalQuestions'][qid];if(qdef['DisplayLogic'])
{var answerObj=this.getAnswerByAnswerId(qid);answerObj.addDisplayLogic(qdef['DisplayLogic']);}}}
this.tempDefinitionToUnpackage=null;this.setSaved(true,null,true);}
this.updateDisplayLogicDependencies();},packageDDAnswers:function(){var pkg={};for(var i in this.answers)
{var answerObj=this.answers[i];if(answerObj.text!=undefined)
{pkg[(i*1)+1]={Display:answerObj.text};}}
return pkg;},exportData:function(options)
{options=options||{};var questionObj=this;var pkgContainer={};pkgContainer['SurveyID']=BaseForm.getInstance().id;pkgContainer['Type']='Question';var pkg={};if(questionObj.questionId)
{pkg['QuestionID']=questionObj.questionId;}
if(questionObj.benchmarkID)
{pkg['BenchmarkQuestionID']=questionObj.benchmarkID;}
if(!questionObj.questionId||questionObj.deleted)
{var block=questionObj.parentObj;if(block){pkg['BlockId']=block.blockId;}
pkg['Pos']=questionObj.getServerPosition();}
if(questionObj.exportTag!==undefined)
{pkg['DataExportTag']=questionObj.exportTag;}
pkg['QuestionType']=questionObj.questionType;pkg['Language']=this.exportLanguages(options);if(options.languageOnly)
{return pkg;}
pkg['Configuration']={};pkgContainer['QuestionDefinition']=pkg;var xAxis=questionObj.getAxisDef('x');var yAxis=questionObj.getAxisDef('y');var questionTypeHasChoices=false;var questionTypeHasAnswers=false;var useRecodeValues=false;if((xAxis&&xAxis.listType=='choices')||(yAxis&&yAxis.listType=='choices'))
{questionTypeHasChoices=true;}
else if(QuestionTypes[questionObj.questionType]&&QuestionTypes[questionObj.questionType].useRecodeValues)
{useRecodeValues=true;}
if((xAxis&&xAxis.listType=='answers')||(yAxis&&yAxis.listType=='answers'))
{questionTypeHasAnswers=true;}
pkg['Choices']=null;pkg['Answers']=null;if(questionObj.answerMap!=undefined)
{pkg['AnswerMap']=questionObj.answerMap;pkg['Answers']=questionObj.packageDDAnswers();}
if(questionObj.choices&&questionTypeHasChoices)
{var order=this.addSelectionsToPackage(pkg,'Choices',questionObj.choices);if(questionObj.proxieChoices)
{pkg['DynamicChoicesData']=questionObj.getSelectionDataMap('proxieChoices','meta');this.addSelectionsMetaToPackage(pkg,questionObj.proxieChoices);}
pkg['ChoiceOrder']=order;}
else if(questionObj.choices&&useRecodeValues)
{this.addSelectionsMetaToPackage(pkg,questionObj.choices);}
if(questionObj.choiceGroups!==undefined&&questionObj.choiceGroupOrder!==undefined)
{var choiceGroupOrder=questionObj.choiceGroupOrder;var choiceGroups=null;if(questionObj.choiceGroups)
{choiceGroups={};for(var choiceGroupId in questionObj.choiceGroups)
{choiceGroups[choiceGroupId]=questionObj.choiceGroups[choiceGroupId].getData();}}
pkg['ChoiceGroups']=choiceGroups;pkg['ChoiceGroupOrder']=choiceGroupOrder;}
if(questionObj.answers&&questionTypeHasAnswers)
{if(questionObj.questionType=='PGR')
{pkg['Groups']=[];pkg['NumberOfGroups']=questionObj.answers.length;for(var i=0,len=questionObj.answers.length;i<len;++i)
{var group=questionObj.answers[i];pkg['Groups'].push(group.text);}}
else if(questionObj.questionType=='CS'||questionObj.questionType=='Slider')
{order=this.addSelectionsToPackage(pkg,'Labels',questionObj.answers);}
else if(questionObj.questionType=='GAP')
{}
else
{order=this.addSelectionsToPackage(pkg,'Answers',questionObj.answers);pkg['AnswerOrder']=order;}
if(questionObj.proxieAnswers)
{pkg['DynamicAnswersData']=questionObj.getSelectionDataMap('proxieAnswers','meta');this.addSelectionsMetaToPackage(pkg,questionObj.proxieAnswers);}}
if(questionObj.columnLabels&&questionObj.columnLabels.length>0)
{if(questionObj.questionType=='Matrix')
{pkg['ColumnLabels']=questionObj.exportColumnLabels();}}
if(questionObj.recodeValues===false)
{pkg['RecodeValues']=questionObj.recodeValues;pkg['QuestionOptionsRecodeValues']='No';}
if(questionObj.variableNaming===false)
{pkg['VariableNaming']=questionObj.variableNaming;pkg['QuestionOptionsVariableNaming']='No';}
if(questionObj.choiceDataExportTags===false)
{pkg['ChoiceDataExportTags']=questionObj.choiceDataExportTags;pkg['QuestionOptionsChoiceDataExportTags']='No';}
if(questionObj.randomization)
{pkg['Randomization']=questionObj.randomization;}
if(questionObj.answerRandomization)
{pkg['AnswerRandomization']=questionObj.answerRandomization;}
if(questionObj.gradingData)
{pkg['GradingData']=questionObj.gradingData;}
if(questionObj.gradingData)
{if(!Qualtrics.isEmpty(questionObj.gradingData))
{this.cleanUpGradingData();pkg['GradingData']=questionObj.gradingData;}}
pkg['DynamicChoices']=this.packageDynamicSelections(questionObj.dynamicChoices);pkg['DynamicAnswers']=this.packageDynamicSelections(questionObj.dynamicAnswers);pkg['DisplayLogic']=null;pkg['InPageDisplayLogic']=null;if(questionObj.displayLogic)
{var displayLogicData=questionObj.displayLogic.getData();if(displayLogicData.inPage)
{pkg['InPageDisplayLogic']=displayLogicData;}
else
{pkg['DisplayLogic']=displayLogicData;}}
if(questionObj.choiceTextPosition)
{pkg['ChoiceTextPosition']=questionObj.choiceTextPosition;}
if(questionObj.answerTextPosition)
{pkg['AnswerTextPosition']=questionObj.answerTextPosition;}
pkg['QuestionText']=questionObj.text;pkg['QuestionText_Unsafe']=questionObj.text_Unsafe;pkg['QuestionJS']=questionObj.questionJS;pkg['DefaultChoices']=questionObj.defaultChoices;if(questionObj.customDescription)
{pkg['QuestionDescriptionOption']='SpecifyLabel';pkg['QuestionDescription']=questionObj.description;}
else
{pkg['QuestionDescriptionOption']='UseText';}
if(questionObj.selector)
{pkg['Selector']=questionObj.selector;}
if(questionObj.subSelector)
{pkg['SubSelector']=questionObj.subSelector;}
else
{pkg['SubSelector']=null;}
if(questionObj.options)
{if(questionObj.options['NumColumns'])
{pkg['NumColumns']=questionObj.options['NumColumns'];}
if(questionObj.options['Transpose']!==undefined)
{pkg['Transpose']=questionObj.options['Transpose'];}
if(questionObj.options['InputWidth'])
{pkg['Configuration']['InputWidth']=questionObj.options['InputWidth'];}
if(questionObj.options['InputHeight']){pkg['Configuration']['InputHeight']=questionObj.options['InputHeight'];}}
if(questionObj.OrgHierarchyID)
pkg['OrgHierarchyID']=questionObj.OrgHierarchyID;if(questionObj.OrgHierarchyName)
pkg['OrgHierarchyName']=questionObj.OrgHierarchyName;if(questionObj.allowSearch)
pkg['Configuration']['AllowSearch']=questionObj.allowSearch;if(questionObj.OrgHierarchySearchField)
pkg['Configuration']['OrgHierarchySearchField']=questionObj.OrgHierarchySearchField;if(questionObj.choicesWidth)
{pkg['Configuration']['ChoiceColumnWidth']=questionObj.choicesWidth;}
if(questionObj.choicesWidthPixels)
{pkg['Configuration']['ChoiceColumnWidthPixels']=questionObj.choicesWidthPixels;}
if(questionObj.Graphics)
{if(questionObj.Graphics.startsWith('IM_'))
{pkg['Graphics']=questionObj.Graphics;}
else
{pkg['URL']=questionObj.Graphics;}}
if(questionObj.GraphicsDescription)
{pkg['GraphicsDescription']=questionObj.GraphicsDescription;}
if(questionObj.Files)
{pkg['Files']=questionObj.Files;}
if(questionObj.FilesDescription)
{pkg['FilesDescription']=questionObj.FilesDescription;}
if(questionObj.Videos)
{pkg['Videos']=questionObj.Videos;}
if(questionObj.VideosEmbed)
{pkg['VideosEmbed']=questionObj.VideosEmbed;}
if(questionObj.url)
{pkg['URL']=questionObj.url;pkg['Graphics']=questionObj.url;}
for(var name in questionObj.questionSpecificData)
{var dataObj=questionObj.questionSpecificData[name];pkg[name]=dataObj.text;}
this.autoPackageQuestionOptions(pkg,questionObj);if(QES_Packagers[questionObj.questionType])
{QES_Packagers[questionObj.questionType](questionObj,pkg);}
var selectionPkgEntries=this.runSelectionPostPackagers(questionObj);if(selectionPkgEntries)
{for(var key in selectionPkgEntries)
{if(pkg[key]===null)
{delete pkg[key];}}
pkg=array_merge_recursive(pkg,selectionPkgEntries);}
if(pkg['DynamicChoices']&&pkg['AdditionalQuestions'])
{for(var qid in pkg['AdditionalQuestions'])
{pkg['AdditionalQuestions'][qid]['DynamicChoices']=pkg['DynamicChoices'];}}
if(questionObj.regionHandler)
{pkg.Regions=questionObj.getRegionHandler().getRegions();}
else
{pkg.Regions=[];}
return pkg;},cleanUpGradingData:function()
{var newGradingData=[];for(var i=0,len=this.gradingData.length;i<len;i++)
{var d=this.gradingData[i];if(d['ChoiceID']&&this.getChoiceByChoiceId(d['ChoiceID']))
{newGradingData.push(this.gradingData[i]);continue;}
if(d['AnswerID']&&this.getAnswerByAnswerId(d['AnswerID']))
{newGradingData.push(this.gradingData[i]);continue;}
if(d['TextEntry'])
{newGradingData.push(this.gradingData[i]);continue;}
if(d['TextEntry'])
{newGradingData.push(this.gradingData[i]);continue;}
if(d['Equation'])
{newGradingData.push(this.gradingData[i]);continue;}}
this.gradingData=newGradingData;},findFunctionInSelectorHierarchy:function(root)
{var packager=null;if(root[this.questionType])
{packager=root[this.questionType];if(packager[this.selector])
{return packager[this.selector];}
return packager;}
return packager;},runSelectionPostPackagers:function(opt_questionObj)
{var pkg={};var packager=this.findFunctionInSelectorHierarchy(SelectionPostPackagers);if(packager&&typeof packager=='function')
{var choiceList=this.choices;if(this.proxieChoices)
{choiceList=choiceList.concat(this.proxieChoices);}
var answerList=this.answers;if(this.proxieAnswers)
{answerList=answerList.concat(this.proxieAnswers);}
pkg=packager(choiceList,answerList,opt_questionObj);}
return pkg;},runSelectionPostUnPackagers:function(def)
{var unpackager=this.findFunctionInSelectorHierarchy(SelectionPostUnPackagers);if(unpackager&&typeof unpackager=='function')
{var pkgToBeMerged=unpackager(def);if(pkgToBeMerged)
{this.mergeSelectionIdListIntoQuestion(pkgToBeMerged);}}},runSelectionPostUnPackagerForLanguages:function(langCode,langDef)
{if(Object.isArray(langDef['Answers']))
{langDef['Answers']={};}
if(Object.isArray(langDef['Choices']))
{langDef['Choices']={};}
var unpackager=this.findFunctionInSelectorHierarchy(SelectionPostUnPackagers);if(unpackager&&typeof unpackager=='function')
{var pkgToBeMerged=unpackager(langDef);if(pkgToBeMerged)
{this.mergeSelectionIdListIntoQuestionHelper(pkgToBeMerged,'choicesByChoiceId','choices','choiceId',langCode);this.mergeSelectionIdListIntoQuestionHelper(pkgToBeMerged,'answersByAnswerId','answers','answerId',langCode);}}},mergeSelectionIdListIntoQuestion:function(pkg)
{this.mergeSelectionIdListIntoQuestionHelper(pkg,'choicesByChoiceId','choices','choiceId');this.mergeSelectionIdListIntoQuestionHelper(pkg,'answersByAnswerId','answers','answerId');},mergeSelectionIdListIntoQuestionHelper:function(pkg,pkgListName,objListName,idName,opt_langCode)
{if(pkg[pkgListName])
{for(var systemId in pkg[pkgListName])
{if(this[objListName])
{var selectionObj=this.getSelectionBySystemId(objListName,systemId);if(!selectionObj)
{selectionObj=this.addSelection(objListName,pkg[pkgListName].text,null,true);selectionObj.edited=true;selectionObj.isDefault=false;selectionObj[selectionObj.objType+'Id']=systemId;}
var actionObj=selectionObj;if(opt_langCode)
{actionObj=selectionObj.getLanguageObject(opt_langCode);}
if(actionObj)
{if(pkg[pkgListName][systemId].text)
{actionObj.text=pkg[pkgListName][systemId].text;}
if(pkg[pkgListName][systemId].series)
{actionObj.series=pkg[pkgListName][systemId].series;}
if(pkg[pkgListName][systemId].variableNaming)
{actionObj.variableNaming=pkg[pkgListName][systemId].variableNaming;}
if(pkg[pkgListName][systemId].recodeValues)
{actionObj.recodeValues=pkg[pkgListName][systemId].recodeValues;}
if(pkg[pkgListName][systemId].meta)
{actionObj.meta=pkg[pkgListName][systemId].meta;}
if(pkg[pkgListName][systemId].answerDataExportTag)
{actionObj.answerDataExportTag=pkg[pkgListName][systemId].answerDataExportTag;}
if(pkg[pkgListName][systemId].displayLogic)
{actionObj.displayLogic=pkg[pkgListName][systemId].displayLogic;}
if(pkg[pkgListName][systemId].defaultChoices)
{actionObj.defaultChoices=pkg[pkgListName][systemId].defaultChoices;}
if(pkg[pkgListName][systemId].hasImage)
{actionObj.hasImage=pkg[pkgListName][systemId].hasImage;actionObj.imageDisplay=pkg[pkgListName][systemId].imageDisplay;actionObj.imageLocation=pkg[pkgListName][systemId].imageLocation;}
if(pkg[pkgListName][systemId].analysis)
{actionObj.analysis=pkg[pkgListName][systemId].analysis;}
if(pkg[pkgListName][systemId].recodeValue)
{actionObj.recodeValue=pkg[pkgListName][systemId].recodeValue;}}}}}},packageDynamicSelections:function(dynamicData)
{var pkg=null;if(dynamicData)
{var locator=dynamicData['Locator'];if(locator)
{pkg={};pkg['DynamicType']='ChoiceGroup';pkg['Locator']=locator;pkg['Type']='Dynamic';pkg['Type']=dynamicData.Type;if(dynamicData.Description)
{pkg['Description']=dynamicData.Description;}}}
return pkg;},addDisplayLogic:function(opt_data,opt_edit,opt_force)
{if(BaseForm.getInstance().revisionId)
{return;}
QModules.loadModule('displaylogic.js');if(this.displayLogic)
{if(opt_edit)
{if(this.isLocked())
{msg(getMessage('EditSection','Locked'));return;}
if(!this.displayLogic.logicEditor.getExpressionCount())
{this.displayLogic.logicEditor.addExpression();}
this.displayLogic.edit();}}
else
{this.displayLogic=new Qualtrics.DisplayLogic(this,opt_data,opt_edit,opt_force);}
this.updateDisplayLogicDependencies();return this.displayLogic;},generateLanguages:function(languageDefs)
{if(languageDefs)
{for(var langCode in languageDefs)
{var lang=languageDefs[langCode];if(typeof lang=='function')continue;if(lang['QuestionText'])
{this.getLanguageObject(langCode).text=lang['QuestionText'];}
if(lang['Choices'])
{for(var systemId in lang['Choices'])
{var selection=this.getSelectionBySystemId('choices',systemId);if(selection)
selection.getSimpleLanguageObject(langCode).text=lang['Choices'][systemId]['Display'];}}
if(lang['Answers'])
{for(systemId in lang['Answers'])
{selection=this.getSelectionBySystemId('answers',systemId);if(selection)
selection.getSimpleLanguageObject(langCode).text=lang['Answers'][systemId]['Display'];}}
if(lang['Labels'])
{for(systemId in lang['Labels'])
{selection=this.getSelectionBySystemId('answers',systemId);if(selection)
selection.getSimpleLanguageObject(langCode).text=lang['Labels'][systemId]['Display'];}}
if(lang['ChoiceGroups'])
{for(systemId in lang['ChoiceGroups'])
{selection=this.getChoiceGroupByChoiceGroupId(systemId);if(selection)
selection.getSimpleLanguageObject(langCode).text=lang['ChoiceGroups'][systemId]['GroupLabel'];}}
if(lang['ColumnLabels'])
{for(systemId in lang['ColumnLabels'])
{if(lang['ColumnLabels'].hasOwnProperty(systemId))
{selection=this.getColumnLabelById(systemId);if(selection)
selection.getSimpleLanguageObject(langCode).text=lang['ColumnLabels'][systemId]['Display'];}}}
this.runSelectionPostUnPackagerForLanguages(langCode,lang);}}},exportLanguages:function(options)
{if(!options)options={};var languagesPkg={};if(this.languages)
{for(var lang in this.languages)
{if(!languagesPkg[lang])languagesPkg[lang]={};languagesPkg[lang]['QuestionText']=this.languages[lang].text;}}
this.packageSelectionLanguages(languagesPkg,'Choices',this.choices);if(this.questionType=='CS'||this.questionType=='Slider')
{this.packageSelectionLanguages(languagesPkg,'Labels',this.answers);}
else
{this.packageSelectionLanguages(languagesPkg,'Answers',this.answers);}
this.packageSelectionLanguages(languagesPkg,'ChoiceGroups',this.choiceGroups);this.packageSelectionLanguages(languagesPkg,'ColumnLabels',this.columnLabels);for(lang in this.languages)
{var languageChoices=this.getPseudoSelectionListByLanguage('choices',lang);var languageAnswers=this.getPseudoSelectionListByLanguage('answers',lang);var selectionPostPackager=this.findFunctionInSelectorHierarchy(SelectionPostPackagers);if(selectionPostPackager&&typeof selectionPostPackager=='function')
{var extraPackagingForLang=selectionPostPackager(languageChoices,languageAnswers);if(extraPackagingForLang)
{languagesPkg[lang]=array_merge_recursive(languagesPkg[lang],extraPackagingForLang);}}}
if(this.questionSpecificData)
{for(var id in this.questionSpecificData)
{if(this.questionSpecificData[id].languages)
{for(var lang in this.questionSpecificData[id].languages)
{if(languagesPkg[lang])
{if(!languagesPkg[lang]['QuestionSpecificData'])
{languagesPkg[lang]['QuestionSpecificData']={};}
languagesPkg[lang]['QuestionSpecificData'][id]=this.questionSpecificData[id].languages[lang];}}}}}
if(options.filterLanguage)
{var filtered={};if(languagesPkg[options.filterLanguage])
{filtered[options.filterLanguage]=languagesPkg[options.filterLanguage];}
else
{filtered[options.filterLanguage]=null;}
return filtered;}
return languagesPkg;},getPseudoSelectionListByLanguage:function(listType,lang)
{var pseudoList=[];for(var i=0,len=this[listType].length;i<len;++i)
{var pseudoSelection={};if(this[listType][i].languages&&this[listType][i].languages[lang])
{var objType=this[listType][i].objType;pseudoSelection.text=this[listType][i].languages[lang].text;pseudoSelection.series=this[listType][i].languages[lang].series;pseudoSelection[objType+'Id']=this[listType][i][objType+'Id'];}
pseudoList.push(pseudoSelection);}
return pseudoList;},packageSelectionLanguages:function(languagesPkg,packageKey,selectionList)
{var foundLanguages={};for(var i in selectionList)
{if(selectionList[i].languages)
{var selection=selectionList[i];var systemId;if(packageKey=='ChoiceGroups')
{systemId=selection.getChoiceGroupId();}
else if(packageKey=='ColumnLabels')
{systemId=selection.getColumnLabelIndex();}
else
{systemId=selection.assignSystemId();}
for(var lang in selection.languages)
{foundLanguages[lang]=true;if(!languagesPkg[lang])languagesPkg[lang]={};if(!languagesPkg[lang][packageKey])languagesPkg[lang][packageKey]={};if(packageKey=='ChoiceGroups')
languagesPkg[lang][packageKey][systemId]={GroupLabel:selection.languages[lang].text};else
{languagesPkg[lang][packageKey][systemId]={Display:selection.languages[lang].text};}}}}},packageValidation:function(questionObj)
{var settings={};settings['Type']=questionObj.options['validation'];return{Settings:settings};},autoGenerateQuestionOptions:function(pkg)
{var sections=this.getPossibleOptions();if(sections)
{for(var sectionName in sections)
{var section=sections[sectionName];var saveKey=section['saveKey'];if(saveKey)
{var parts=QualtricsCPTools.getDotSyntaxParts(saveKey,null,pkg,true);if(parts&&parts['method'])
{this.setOption(sectionName,parts['method']);}}}}},autoPackageQuestionOptions:function(pkg,questionObj)
{var sections=this.getPossibleOptions();if(sections)
{for(var sectionName in sections)
{var section=sections[sectionName];if(questionObj.options[sectionName]!==undefined)
{var saveKey=section['saveKey'];if(section.dependant)
{}
if(saveKey)
{if(saveKey.indexOf('.')==-1)
{pkg[saveKey]=questionObj.options[sectionName];}
else
{var parts=saveKey.split('.');var cur=pkg;for(var i=0,len=parts.length;i<len;++i)
{if(i!=len-1)
{if(!cur[parts[i]])
{cur[parts[i]]={};}}
else
{var optionValue=QuestionTypes.getOptionValue(questionObj,section,questionObj.options[sectionName],true);if(optionValue===undefined&&section.defaultValue!==undefined)
{optionValue=section.defaultValue;}
if(optionValue!==undefined)
{cur[parts[i]]=optionValue;}}
cur=cur[parts[i]];}}}}}}},addSelectionsToPackage:function(pkg,packageKey,selectionList)
{pkg[packageKey]={};var order=[];for(var i=0,len=selectionList.length;i<len;++i)
{var c=selectionList[i];var systemId=c.assignSystemId();order.push(systemId);pkg[packageKey][systemId]={Display:c.text};if(c.textEntry)
{pkg[packageKey][systemId].TextEntry='true';}
if(c.meta)
{if(c.meta['InputHeight'])
{pkg[packageKey][systemId]['InputHeight']=c.meta['InputHeight'];}
if(c.meta['InputWidth'])
{pkg[packageKey][systemId]['InputWidth']=c.meta['InputWidth'];}
if(c.meta['TextEntryLength'])
{pkg[packageKey][systemId]['TextEntryLength']=c.meta['TextEntryLength'];}
if(c.meta['TextEntryValidation'])
{pkg[packageKey][systemId]['TextEntryValidation']=c.meta['TextEntryValidation'];}
if(c.meta['TextEntrySize'])
{pkg[packageKey][systemId]['TextEntrySize']=c.meta['TextEntrySize'];}
if(c.meta['TextEntryForceResponse'])
{pkg[packageKey][systemId]['TextEntryForceResponse']=c.meta['TextEntryForceResponse'];}
if(c.meta['GraphicSize'])
{pkg[packageKey][systemId]['GraphicSize']=c.meta['GraphicSize'];}
if(c.meta['ExpandedGraphicSize'])
{pkg[packageKey][systemId]['ExpandedGraphicSize']=c.meta['ExpandedGraphicSize'];}}
if(c.hasImage)
{pkg[packageKey][systemId]['Image']={Display:c.imageDisplay,ImageLocation:c.imageLocation};}
if(c.exclusive!==null)
{if(!pkg[packageKey][systemId]['ExclusiveAnswer'])pkg[packageKey][systemId]['ExclusiveAnswer']={};pkg[packageKey][systemId]['ExclusiveAnswer']=c.exclusive;}
if(c.customClasses)
{pkg[packageKey][systemId]['CustomClasses']=c.customClasses;}
if(c.displayLogic)
{pkg[packageKey][systemId]['DisplayLogic']=c.displayLogic.getData();}}
this.addSelectionsMetaToPackage(pkg,selectionList);return order;},addSelectionsMetaToPackage:function(pkg,selectionList)
{for(var i=0,len=selectionList.length;i<len;++i)
{var c=selectionList[i];var systemId=c.assignSystemId();if(this.getRecodeListType()==c.parentList||c.parentList=='proxieChoices'||c.parentList=='proxieAnswers')
{if(c.recodeValue!==null)
{if(!pkg['RecodeValues'])pkg['RecodeValues']={};pkg['RecodeValues'][systemId]=c.recodeValue;}
if(c.variableNaming!==null)
{if(!pkg['VariableNaming'])pkg['VariableNaming']={};pkg['VariableNaming'][systemId]=c.variableNaming;}
if(c.analysis!==null&&typeof c.analysis!='object')
{if(!pkg['AnalyzeChoices'])pkg['AnalyzeChoices']={};pkg['AnalyzeChoices'][systemId]=c.analysis?true:false;}}
else
{if(c.choiceDataExportTag!==undefined&&c.choiceDataExportTag!==null)
{if(!pkg['ChoiceDataExportTags'])pkg['ChoiceDataExportTags']={};pkg['ChoiceDataExportTags'][systemId]=c.choiceDataExportTag;}}}},generateGrading:function(def)
{this.gradingData=[];for(var choiceId in def.GradingPoints)
{if(def.GradingPoints[choiceId]!=="")
{this.gradingData.push({'ChoiceID':choiceId,'Grades':{'Grade':def.GradingPoints[choiceId]}});}}},getGrades:function(choiceId,opt_answerId,opt_loose,opt_seriesId)
{if(this.gradingData)
{for(var i=0,len=this.gradingData.length;i<len;++i)
{if(choiceId)
{if(this.gradingData[i].ChoiceID==choiceId)
{this.gradingData[i].index=i;if(!opt_answerId)return this.gradingData[i];if(this.gradingData[i].AnswerID==opt_answerId)
{if(!opt_seriesId)return this.gradingData[i];if(this.gradingData[i].SeriesID==opt_seriesId)
{return this.gradingData[i];}}}}
else if(opt_answerId&&opt_loose)
{if(this.gradingData[i].AnswerID==opt_answerId)
{if(opt_seriesId)
{if(this.gradingData[i].SeriesID==opt_seriesId)
{this.gradingData[i].index=i;return this.gradingData[i];}}
else
{this.gradingData[i].index=i;return this.gradingData[i];}}}}}},getGrade:function(category,choiceId,opt_answerId,opt_seriesId)
{var grades=this.getGrades(choiceId,opt_answerId,false,opt_seriesId);if(grades&&grades['Grades'])
{if(grades['Grades']&&grades['Grades'][category]!==undefined)
{return grades['Grades'][category];}}
return;},setTextGrades:function(elements)
{this.gradingData=elements;},setSelectionText:function(selectionId,text,opt_seriesIndex,opt_lang,opt_refresh)
{var selection=this.getSelectionById(selectionId);if(selection)
{selection.setText(text,opt_seriesIndex,opt_lang,opt_refresh);}},setGrade:function(category,gradeValue,opt_choiceId,opt_answerId,opt_textEntryString,opt_seriesId)
{if(this.parentObj&&this.parentObj.locked)
{msg(getMessage('EditSection','Locked'));return;}
if(!BaseForm.getInstance().getActiveScoringCategory())
{return;}
if(this.questionType=='SBS')
{var answerObj=this.getAnswerByAnswerId(opt_answerId);if(!answerObj||(answerObj.meta&&answerObj.meta.Selector=='TE'))
{return;}}
var gradeDef=this.getGrades(opt_choiceId,opt_answerId,opt_textEntryString,opt_seriesId);if((gradeDef||{}).Grades)
{if(gradeValue=='-'||gradeValue=='')
{delete gradeDef.Grades[category];if(Qualtrics.isEmpty(gradeDef.Grades))
{this.gradingData.splice(gradeDef.index,1);}}
else
{if(Object.isArray(gradeDef.Grades))
{gradeDef.Grades={};}
gradeDef.Grades[category]=gradeValue;}}
else
{if(gradeValue=='-')
{return;}
if(!this.gradingData)
{this.gradingData=[];}
if(!gradeDef)
{gradeDef={};this.gradingData.push(gradeDef);}
if(opt_choiceId)
{gradeDef.ChoiceID=opt_choiceId;}
if(opt_answerId)
{gradeDef.AnswerID=opt_answerId;}
if(opt_textEntryString)
{gradeDef.TextEntry=opt_textEntryString;}
if(opt_seriesId)
{gradeDef.SeriesID=opt_seriesId;}
(gradeDef.Grades={})[category]=gradeValue;}
if(this.getQuestionDef().gradeAsWeight)
{gradeDef.GradeAsWeight=true;}
this.setEdited();},getRecodeListType:function()
{if(this.questionType=='Matrix'||this.questionType=="SBS")
{return'answers';}
return'choices';},getRecodeSelections:function()
{return this[this.getRecodeListType()];},recodeKeyUp:function(el,selectionId,seriesIndex)
{var sel=this.getAnySelectionById(selectionId);if(sel)
{var val=el.value.replace(/[^x\.\-0-9]/g,'');if(seriesIndex!=undefined&&seriesIndex!=null)
{if(typeof sel.recodeValues!='object')
{sel.recodeValues={};}
var old=sel.recodeValues[seriesIndex];sel.recodeValues[seriesIndex]=val;}
else
{old=sel.recodeValue;sel.recodeValue=val;}
if(old!=val||el.value!=val)
{el.value=val;this.setEdited();}}},recodeOnBlur:function(el,selectionId,seriesIndex){var sel=this.getAnySelectionById(selectionId);if(sel)
{var val=el.value.replace(/[^x\.\-0-9]/g,'');val=parseFloat(val)+"";if(val=='NaN')
val="";if(seriesIndex!=undefined&&seriesIndex!=null)
{if(typeof sel.recodeValues!='object')
{sel.recodeValues={};}
var old=sel.recodeValues[seriesIndex];sel.recodeValues[seriesIndex]=val;}
else
{old=sel.recodeValue;sel.recodeValue=val;}
if(old!=val||el.value!=val)
{el.value=val;this.setEdited();}}},variableNamingKeyUp:function(el,selectionId,seriesIndex)
{var sel=this.getAnySelectionById(selectionId);if(sel)
{if(seriesIndex!=undefined&&seriesIndex!=null)
{if(typeof sel.variableNaming!='object')
{sel.variableNaming={};}
sel.variableNaming[seriesIndex]=el.value;}
else
{sel.variableNaming=el.value;}}
this.setEdited();},choiceDataExportTagKeyUp:function(el,selectionId)
{var sel=this.getAnySelectionById(selectionId);if(sel)
{sel.choiceDataExportTag=el.value;}
this.setEdited();},answerDataExportTagKeyUp:function(el,selectionId)
{var sel=this.getAnySelectionById(selectionId);if(sel)
{sel.answerDataExportTag=el.value;}
this.setEdited();},changeChoiceIdKeyUp:function(el,selectionId)
{var sel=this.getChoiceBySelectionId(selectionId);if(sel)
{sel.choiceId=el.value;}
this.setEdited();},generateProxieSelections:function(listType,resetStack)
{if(resetStack!==false)
{BaseQuestion.dynamicChoicesLocatorStack={};}
var proxieListName='proxie'+listType.capitalize();var dynamicList=this.getDynamicSelections(listType);if(dynamicList)
{this[proxieListName]=dynamicList;}},setSaved:function(saved,optSaveDate,optForce)
{if(!saved)
{this._lastModifiedDate=new Date();this._saved=false;}
else
{if(this._lastModifiedDate<=optSaveDate)
{this._saved=true;}
else
{if(!optForce)
{msg("Question "+this.questionId+" edited during save.");}}}
if(optForce)
this._saved=saved;this.cachedPipingOptions=null;},getLastModified:function(){return this._lastModifiedDate;},isSaved:function(){return this._saved;},setEdited:function()
{this.setSaved(0);this.needsPreparing=1;},isLocked:function()
{if(this.locked)
return true;if(this.parentObj)
{if(this.parentObj.isLocked)
{return this.parentObj.isLocked();}
if(this.parentObj.locked)
{return this.parentObj.locked;}}
return false;},isBenchmark:function()
{return(this.parentObj&&this.parentObj.subType&&this.parentObj.subType==='Benchmark');},clone:function(opt_dontAssignQuestionNumber)
{var copy=this.parentObj.createQuestion(null,opt_dontAssignQuestionNumber);copy.generate({QuestionDefinition:this.exportData()});copy.questionId=null;copy.exportTag=null;copy.setSaved(0);copy.saveInProgress=false;return copy;},reLoad:function(successCallBack)
{var questionObj=this;if(this.questionId)
{new Ajax.Request('Ajax.php?action=GetQuestionJSON',{method:'post',parameters:{QID:questionObj.questionId},onSuccess:function(transport)
{try{var questionData=transport.responseText.evalJSON();}
catch(e)
{Qualtrics.Error(transport.responseText);}
if(questionData)
{questionObj.generate({Type:'Question',QuestionDefinition:questionData});questionObj.unpackage();questionObj.refreshQuestion();Toolbox.getInstance().refresh();}
if(successCallBack)
{successCallBack();}}});}},getPipingOptions:function(filterType)
{var questionObj=this;if(!questionObj.cachedPipingOptions)
{var rand=Math.random();new Ajax.Request('Ajax.php?action=GetPipingOptionsByQuestionId&r='+rand,{method:'get',parameters:{'QID':questionObj.questionId,group:'Questions'},asynchronous:false,onComplete:function(transport){var pipingOptions=transport.responseText&&transport.responseText.evalJSON();for(var i=0;i<pipingOptions.length;i++)
{pipingOptions[i]['Locator']=decodeURIComponent(pipingOptions[i]['Locator']);}
if(pipingOptions)
{questionObj.cachedPipingOptions=pipingOptions;}
else
{Qualtrics.Error('No piping options returns for questionId: '+questionObj.questionId);return;}}});}
return QuestionActions.filterPipingOptions(questionObj.cachedPipingOptions,filterType);},createQuestionOptions:function()
{var sections=this.getPossibleOptions();if(sections)
{this.options={};for(var section in sections)
{var sectionOptions=sections[section]['options'];if(!sections[section].dependant)
{if(sectionOptions)
{for(var optionName in sectionOptions)
{if(sectionOptions[optionName].selectedByDefault)
{var value=optionName;if(sectionOptions[optionName]['value']!==undefined)
{value=sectionOptions[optionName]['value'];}
this.setOption(section,value);break;}}}
else
{if(sections[section]['defaultValue']!==undefined)
{this.setOption(section,sections[section]['defaultValue']);}}}}}},populateQuestionOptions:function(json)
{var fromSelectorMap=(QuestionTypes[this.questionType]&&QuestionTypes[this.questionType].questionOptions&&QuestionTypes[this.questionType].questionOptions.fromSelectorMap);if(fromSelectorMap)
{var selector=this.selector;var subSelector=this.subSelector;if(selector)
{var optionsToSet=new Array();if(fromSelectorMap[selector])
{if(subSelector&&fromSelectorMap[selector]&&fromSelectorMap[selector][subSelector]){optionsToSet.push(fromSelectorMap[selector][subSelector]);}
else
{optionsToSet.push(fromSelectorMap[selector]);if(fromSelectorMap[subSelector])
{optionsToSet.push(fromSelectorMap[subSelector]);}}
for(var i=0,len=optionsToSet.length;i<len;++i)
{if(optionsToSet[i])
{for(var sectionName in optionsToSet[i])
{this.setOption(sectionName,optionsToSet[i][sectionName]);}}
else
{}}}
else
{Qualtrics.Error('No entry in fromSelectorMap for selector: '+selector);}}}
else
{throw'no fromSelectorMap for questiontype '+this.questionType;}
if(json)
{this.autoGenerateQuestionOptions(json['QuestionDefinition']);if(json['QuestionDefinition']['Configuration'])
{var config=json['QuestionDefinition']['Configuration'];if(config['Transpose'])
{this.setOption('Transpose','transposeTable');}
if(config['NumColumns']!==undefined)
{this.setOption('NumColumns',config['NumColumns']);}
if(config['InputHeight']!==undefined)
{this.options['InputHeight']=config['InputHeight'];}
if(config['InputWidth']!==undefined)
{this.options['InputWidth']=config['InputWidth'];}
if(config['EnforceRange']!==undefined&&!json['QuestionDefinition']['Validation']['Settings']['EnforceRange'])
{json['QuestionDefinition']['Validation']['Settings']['EnforceRange']=config['EnforceRange'];json['QuestionDefinition']['Configuration']['EnforceRange']=null;}
if(config['CSSliderMin']!==undefined)
{this.setOption('CSSliderMin',config['CSSliderMin']);}
if(config['CSSliderMax']!==undefined)
{this.setOption('CSSliderMax',config['CSSliderMax']);}
if(config['GridLines']!==undefined)
{this.setOption('GridLines',config['GridLines']);}
if(config['ShowValue']!=undefined)
{this.setOption('ShowValue',config['ShowValue']);}
if(config['NumDecimals']!==undefined)
{this.setOption('NumDecimals',config['NumDecimals']);}
if(config['CustomStart']!==undefined)
{this.setOption('CustomStart',config['CustomStart']);if(config['SliderStartPositions'])
{this.setOption('sliderStartPositions',config['SliderStartPositions']);}}
if(config['NotApplicable'])
{this.setOption('NotApplicable',config['NotApplicable']);}
if(config['NotApplicableText'])
{this.setOption('NotApplicableText',config['NotApplicableText']);}
if(config['RepeatHeaders'])
{this.setOption('RepeatHeaders',config['RepeatHeaders']);}
if(config['ColumnOrder'])
{this.setOption('ColumnOrder',config['ColumnOrder']);}
if(config['WhiteSpace'])
{this.setOption('WhiteSpace',config['WhiteSpace']);}
if(config['IncludeDescription'])
{this.setOption('IncludeDescription',config['IncludeDescription']);}
if(config['VideoAutoplay'])
{this.setOption('VideoAutoplay',config['VideoAutoplay']);}
if(config['IncludeThumbnail'])
{this.setOption('IncludeThumbnail',config['IncludeThumbnail']);}
if(config['UseLinkText'])
{this.setOption('UseLinkText',config['UseLinkText']);this.setOption('LinkText',config['LinkText']);}
if(config['ForceDownload'])
{this.setOption('ForceDownload',config['ForceDownload']);}
if(config['TextPosition'])
{this.setOption('TextPosition',config['TextPosition']);}
else if(this.questionType=='Matrix'&&this.selector=='Bipolar')
{this.setOption('TextPosition','above');}
if(config['MobileFirst']!=undefined)
{this.setOption('MobileFirst',config['MobileFirst']);}
else
{this.setOption('MobileFirst',false);}}
if(json['QuestionDefinition']['ClarifyingSymbol'])
{this.setOption('ClarifyingSymbol',json['QuestionDefinition']['ClarifyingSymbol']);}
if(json['QuestionDefinition']['ClarifyingSymbolType'])
{this.setOption('ClarifyingSymbolType',json['QuestionDefinition']['ClarifyingSymbolType']);}
if(json['QuestionDefinition']['Validation']&&json['QuestionDefinition']['Validation']['Settings'])
{var valList=json['QuestionDefinition']['Validation']['Settings'];for(var key in valList)
{if(key=='Type')
{this.setOption('validation',valList[key]);}
else
{if(typeof valList[key]=='object')
{for(var subKey in valList[key])
{if((typeof valList[key][subKey]=='string')||(typeof valList[key][subKey]=='number'))
{this.setOption(key+'_'+subKey,valList[key][subKey]);}}}
else
{if(this.getPossibleOptions()['ForceResponseType']&&key=='ForceResponse'&&valList[key]!='OFF')
{this.setOption(key,'$option.ForceResponseType');}
else
{this.setOption(key,valList[key]);}}}}
if(!valList['ForceResponse']&&valList['ContentType'])
{this.setOption('ForceResponse','ON');}
if(valList['Type']&&valList['Type']=='ForceResponse')
{this.setOption('validation','None');this.setOption('ForceResponse','ON');}}}
json=null;},getPossibleOptions:function()
{return QuestionTypes[this.questionType]&&QuestionTypes[this.questionType].questionOptions&&QuestionTypes[this.questionType].questionOptions.sections||{};},setQuestionText:function(v,opt_seriesIndex,opt_language,opt_refresh)
{this.questionTextObj.setText(v,opt_seriesIndex,opt_language,opt_refresh);},isReadOnly:function()
{var data=QuestionTypes[this.questionType];if(data)
{if(data.readonly)
{return true;}
if(data.previewEdit!==undefined&&!data.previewEdit&&this.previewMode)
{return true;}}
return false;},smartRemoveSelection:function(listType)
{if(this.isLocked())
{msg(getMessage('EditSection','Locked'));return false;}
var axis=this.getAxis(listType);if(this.hasAutoScale(axis))
{if(inlineEditor.getInstance())
{inlineEditor.getInstance().removeInlineEditor();}
var scaleName=this.getScaleDefinition(axis).scaleName;if(scaleName)
{var scaleType=this.getScaleDefinition(axis).scaleType;var previousAvailableLength=choiceScaleHelpers.getASiblingLength(scaleName,scaleType,this[listType].length,-1);if(previousAvailableLength)
{this.insertAutoResponseSelections(axis,previousAvailableLength);ToolboxActions.highlightResponseScaleBox(axis);}
else
{var selection=ToolboxActions.getSelectionToRemove(listType,this);if(selection&&!selection.auto)
{selection.removeSelection();}
else
{ToolboxActions.highlightResponseScaleBox(axis,'#cc0000');return false;}}}}
else
{selection=ToolboxActions.getSelectionToRemove(listType,this);if(selection)
{selection.removeSelection();}}
var property;if(listType=='answers')property='AnswerID';if(listType=='choices')property='ChoiceID';var limit=this[listType].length+1;if(this.gradingData&&this.gradingData.length)
{for(var i=this.gradingData.length-1;i>=0;i--){if(this.gradingData[i][property]>=limit)
{this.gradingData.splice(i,1);}}}
return true;},smartAddSelection:function(listType)
{if(this.isLocked())
{msg(getMessage('EditSection','Locked'));return false;}
var axis=this.getAxis(listType);if(this.hasAutoScale(axis))
{if(inlineEditor.getInstance())
{inlineEditor.getInstance().removeInlineEditor();}
var scaleName=this.getScaleDefinition(axis).scaleName;var scaleType=this.getScaleDefinition(axis).scaleType;if(scaleName)
{var nextAvailableLength=choiceScaleHelpers.getASiblingLength(scaleName,scaleType,this[listType].length,1);if(nextAvailableLength)
{this.insertAutoResponseSelections(axis,nextAvailableLength);ToolboxActions.highlightResponseScaleBox(axis);}
else
{this.addSelection(listType);}}}
else
{var text=null;var list=this[listType];var last=list.last();if(last){var secondToLastText=null;var secondToLast=last.getPrev();if(secondToLast)secondToLastText=secondToLast.text;var nextItemInSequence=Qualtrics.findSequence(last.text,secondToLastText);if(nextItemInSequence){text=nextItemInSequence;}}
var sel=this.addSelection(listType,text);if(nextItemInSequence)
{sel.auto=true;}}
var baseForm=BaseForm.getInstance();if(baseForm)
{baseForm.blowDisplayLogicCache();}},addSelection:function(listType,text,opt_position,opt_initial,opt_groupId)
{if(listType=='choices'||listType=='choice')
{var objFunc='createChoice';var axisGetter='getY';listType='choices';}
else if(listType=='answers'||listType=='answer')
{objFunc='createAnswer';axisGetter='getX';listType='answers';}
else if(listType=='columnLabels'||listType=='columnLabel')
{objFunc='createColumnLabel';axisGetter='getX';listType='columnLabels';}
var obj=this[objFunc](text);obj.parentObj=this;var axisObj=this[axisGetter]();if(text==undefined)
{obj.text=this.getDefaultSelectionText(axisObj,this[listType].length+1);var trash=this[listType+'Trash'];if(trash.length)
{var trashObj=trash.pop();if(trashObj.text.strip().length&&trashObj.text!='&nbsp;')
{obj=trashObj;obj.fromTrash=true;var existing=this.getSelectionBySystemId(listType,obj.getSystemId());if(existing)
{obj[obj.objType+'Id']=null;}}}
obj.isDefault=true;obj.wasDefault=obj.isDefault;obj.edited=false;}
var previousSelection=null;if(opt_position!=undefined)
{previousSelection=this[listType][opt_position];if(this[listType][opt_position]&&!this[listType][opt_position].getEdited()&&!this[listType][opt_position].auto)
{this[listType][opt_position].removeSelection();}
this[listType].splice(opt_position,0,obj);}
else
{previousSelection=this[listType][this[listType].length-1];this[listType][this[listType].length]=obj;}
obj.assignSystemId();var groupId=opt_groupId||null;if(!groupId&&previousSelection)
{groupId=previousSelection.parentGroupId;}
if(this.choiceGroups&&listType=='choices'&&obj.assignGroup)
{obj.assignGroup(groupId);}
if(this.recodeValues)
{obj.recodeValue=obj.getAnyId();}
if(this.variableNaming)
{obj.variableNaming=obj.text;}
if(listType=='choices'&&this.choiceDataExportTags)
{obj.choiceDataExportTag=this.exportTag+"_"+obj.choiceId;}
if(!opt_initial)
{this.setEdited();}
this.changeToMCifDB();return obj;},changeToMCifDB:function()
{if(this.questionType=='DB')
{if(this.choices.length==1)
{this.choices[0].edited=true;}
var sel=this.selector;var subSel=this.subSelector;Toolbox.getInstance().changeQuestionType(this,'MC',this.sel_bak||'SAVR',this.subSel_bak||'TX');this.sel_bak=sel;this.subSel_bak=subSel;}},changeToDBifMC:function()
{if(this.questionType=='MC'&&this.choices.length<=0&&!this.dynamicChoices)
{var sel=this.selector;var subSel=this.subSelector;Toolbox.getInstance().changeQuestionType(this,'DB',this.sel_bak||'TB',this.subSel_bak||null);this.sel_bak=sel;this.subSel_bak=subSel;}},setSelectionCountByAxis:function(axis,evt)
{var inputNode=Event.element(evt);if(inputNode)
{return this.setSelectionCount(this.getListType(axis),inputNode.value);}},setSelectionCount:function(listType,count)
{if(this.isLocked())
{msg(getMessage('EditSection','Locked'));return false;}
count=Math.round(count);var currentCount=this[listType].length;var diff=count-currentCount;if(diff==0)
{return;}
var undoPkg=this.getUndoPkg();if(diff>0)
{for(var i=0;i<diff;++i)
{this.smartAddSelection(listType);}}
else if(diff<0)
{for(i=diff;i<0;++i)
{if(this[listType].length<=count)
{break;}
this.smartRemoveSelection(listType);}}
this.resetSelectionIdsIfNoResponses(listType);this.refreshCanvas();this.refreshDependencies();this.updateSkipLogic();this.addUndo(undoPkg,this.getUndoPkg());},surveyHasResponses:function()
{var survey=BaseForm.getInstance();if(survey.responses!==0)
{return true;}},hasChoiceIdsInUseByRandomization:function()
{if(this.randomization&&this.randomization['Advanced'])
{return true;}},selectionIdsAreLocked:function()
{if(this.surveyHasResponses())
{return true;}
if(this.hasChoiceIdsInUseByRandomization())
{return true;}
var carryForwards=this.getCarryForwardDependencies();if(carryForwards)
{for(var qid in carryForwards)
{var q=carryForwards[qid];if(q.hasChoiceIdsInUseByRandomization())
{return true;}}}
if(this.isPartOfLogic())
{return true;}
if(this.protectSelectionIds())
{return true;}
if(this.questionType=='NPS')
{return true;}},protectSelectionIds:function()
{return BaseForm.getInstance().protectSelectionIds();},getRegionHandler:function()
{if(!this.regionHandler)
{QModules.loadModule('QQuestionRegionHandler.js');this.regionHandler=new Qualtrics.QuestionRegionHandler(this,QuestionTypes[this.questionType].choicePerRegion);}
return this.regionHandler;},addRegion:function(opt_regionName,opt_regionChoiceId)
{var rh=this.getRegionHandler();if(!rh.editor)
throw new Error("Cannot add a region without a visible editor");rh.editor.addRegion();var regionId=rh.getRegions().length-1;if(opt_regionName)
rh.editor.setRegionProperty(regionId,"Description",opt_regionName);if(opt_regionChoiceId)
rh.editor.setRegionProperty(regionId,"ChoiceID",opt_regionChoiceId);return regionId;},getRegionCount:function()
{return this.getRegionHandler().getRegions().length;},resetSelectionIdsIfNoResponses:function(listType,opt_skipScoring)
{if(!this.selectionIdsAreLocked()&&!this.isLocked())
{return this.resetSelectionIds(listType,opt_skipScoring);}
return false;},resetSelectionIds:function(listType,opt_skipScoring)
{if(listType=='choices')
{var idName='choiceId';}
else if(listType=='answers')
{idName='answerId';}
var selections=this[listType];var regions=this.regionHandler?this.regionHandler.getRegions():null;var idMapping={};if(this.choiceGroups)
{var choiceGroupsWithRoot=Object.clone(this.choiceGroups);choiceGroupsWithRoot['root']=this;for(var choiceGroupId in choiceGroupsWithRoot)
{choiceGroupsWithRoot[choiceGroupId].getGroupItems(true);}
var list=this.getFlatGroupsList();var choiceCount=0;for(var i=0,len=list.length;i<len;++i)
{var selection=list[i];if(selection.isSelection)
{choiceCount++;idMapping[selection[idName]]=choiceCount;selection[idName]=choiceCount;}}
for(var choiceGroupId in choiceGroupsWithRoot)
{var newChoiceGroupOrder=[];var items=choiceGroupsWithRoot[choiceGroupId].getGroupItems(false);for(var i=0,len=items.length;i<len;++i)
{newChoiceGroupOrder.push(items[i].getSystemId());}
choiceGroupsWithRoot[choiceGroupId].choiceGroupOrder=newChoiceGroupOrder;}
return idMapping;}
else if(regions&&regions.length&&(listType=='choices'))
{}
else
{for(var i=0,len=selections.length;i<len;++i)
{var selection=selections[i];idMapping[selection[idName]]=i+1;selection[idName]=i+1;}}
if(this.scoreAll&&this.canScore()&&!opt_skipScoring)
{this.scoreAll();idMapping=false;}
return idMapping;},updateGradingData:function(property,opt_idMap,opt_selectionToRemove)
{var ownProperty=(property=='ChoiceID')?'choiceId':'answerId';var selectionId=(opt_selectionToRemove)?opt_selectionToRemove[ownProperty]:null;if(this.gradingData&&this.gradingData.length)
{for(var i=this.gradingData.length-1;i>=0;i--)
{if(selectionId&&this.gradingData[i][property]==selectionId)
{this.gradingData.splice(i,1);}
else if(opt_idMap)
{if(opt_idMap[this.gradingData[i][property]])
this.gradingData[i][property]=opt_idMap[this.gradingData[i][property]]+'';else
this.gradingData.splice(i,1);}}}},hasMoreAdvancedOptions:function()
{return!QuestionTypes[this.questionType].hideAdvancedOptions;},hasRecodeValueOptions:function()
{if(this.questionType=='CS'&&(this.selector=='HSLIDER'||this.selector=='HBAR'))
{return false;}
return!QuestionTypes[this.questionType].hideRecodeValues;},hasRandomizationOptions:function()
{return!QuestionTypes[this.questionType].hideRandomizationOptions;},setupDefaultSelections:function()
{var yAxisObj=QuestionTypes.getY(this.questionType);if(yAxisObj)
{this.setupDefaultSelectionType(yAxisObj);}
var xAxisObj=QuestionTypes.getX(this.questionType);if(xAxisObj)
{this.setupDefaultSelectionType(xAxisObj);}},removeDefaultSelections:function(selectionType)
{var changed=false;if(this[selectionType])
{for(var i=this[selectionType].length-1;i>-1;--i)
{if(!this[selectionType][i].edited&&!this[selectionType][i].auto)
{changed=true;this[selectionType][i].removeSelection();}}}
if(changed)
{Toolbox.getInstance().update();this.setSaved(0);}},removeAllChoices:function()
{this.choices=[];this.nextChoiceId=0;this.choicesTrash=[];},removeAllAnswers:function()
{this.answers=[];this.nextAnswerId=0;this.answersTrash=[];},archiveChoices:function()
{this.choicesArchive={choices:this.choices,nextChoiceId:this.nextChoiceId,choicesTrash:this.choicesTrash};},restoreArchivedChoices:function(){this.choices=this.getArchivedChoices('choices');this.nextChoiceId=this.getArchivedChoices('nextChoiceId');this.choicesTrash=this.getArchivedChoices('choicesTrash');},getArchivedChoices:function(key)
{if(!key)
{return this.choicesArchive;}
else
{return this.choicesArchive[key];}},hasAnswers:function()
{return this.answers&&this.answers.length>0;},removeAllColumnLabels:function()
{this.columnLabels=[];this.columnLabelsTrash=[];},setupDefaultSelectionType:function(axisDef)
{var type=axisDef.listType;if(this[type]&&this[type].length>0)
{for(var i=0,len=this[type].length;i<len;++i)
{var selection=this[type][i];if(!selection.edited&&!selection.auto)
{selection.text=this.getDefaultSelectionText(axisDef,i+1);}}}},getDefaultSelectionText:function(axisDef,i)
{return axisDef.defaultPrefix||getMessage('EditSection','ClickToWrite')+' '+String(axisDef.label).capitalize()+' '+i;},activateChoiceGroups:function(opt_migrateChoices)
{if(!this.choiceGroups)
{this.choiceGroups={};}
if(!this.choiceGroupOrder)
{this.choiceGroupOrder=[];if(opt_migrateChoices)
{for(var i=0,len=this.choices.length;i<len;++i)
{this.choiceGroupOrder.push(this.choices[i].choiceId);}}}},addChoiceGroup:function(itemId,opt_choiceGroupDef)
{this.activateChoiceGroups();if(String(itemId).indexOf('cg_')==0&&opt_choiceGroupDef)
{this.choiceGroups[itemId]=new ChoiceGroup(itemId,opt_choiceGroupDef,this);}
return this.choiceGroups[itemId];},unassignChoiceGroupItem:function(itemId)
{for(var i=0,len=this.choiceGroupOrder.length;i<len;++i)
{if(this.choiceGroupOrder[i]==itemId)
{this.choiceGroupOrder.splice(i,1);}}},addChoice:function(text,position,initial,opt_groupId)
{var choice=this.addSelection('choices',text,position,initial,opt_groupId);return choice;},addAnswer:function(text,position,initial)
{var answer=this.addSelection('answers',text,position,initial);return answer;},addColumnLabel:function(text,position,initial)
{var columnLabel=this.addSelection('columnLabels',text,position,initial);this.options.ColumnLabelsCounter++;this.setEdited();return columnLabel;},addDefaultColumnLabel:function()
{var defaultText=getMessage('EditSection','DefaultLabel',this.options.ColumnLabelsCounter+1);if(this.questionType=='NPS')
{defaultText='';}
var columnLabel=this.addColumnLabel(defaultText);return columnLabel;},popColumnLabelOff:function()
{if(this.hasColumnLabels())
{removedLabel=this.columnLabels.pop();this.columnLabelsTrash.push(removedLabel);}},removeColumnLabel:function(opt_seriesIndex)
{if(this.hasColumnLabels())
{if(opt_seriesIndex==(this.columnLabels.length-1))
{var removedLabel=this.columnLabels.splice(opt_seriesIndex,1);}
else
{this.popColumnLabelOff();}
this.options.ColumnLabelsCounter=this.columnLabels.length;this.refreshCanvas();this.setEdited();}},hasColumnLabels:function()
{return(this.getColumnLabelCount()>0);},getColumnLabelCount:function()
{if(this.columnLabels&&this.columnLabels.length)
{return this.columnLabels.length;}
return 0;},getColumnLabelById:function(id)
{if(this.columnLabels)
{if(ColumnLabel.getInstance)
{var label=ColumnLabel.getInstance(id);if(label)
{return label;}}
for(var i=0,len=this.columnLabels.length;i<len;++i)
{var columnLabel=this.columnLabels[i];if(columnLabel.id==id)
{return columnLabel;}
if(columnLabel.columnLabelIndex==id)
{return columnLabel;}}}
console.warn('failed looking up columnLabel by Id:'+id,this.columnLabels);},addSelectionsByString:function(listType,string)
{var axis=this.getAxis(listType);var scaleDef=this.getScaleDefinition(axis);if(scaleDef)
{scaleDef.active=false;Toolbox.getInstance().render();}
var lines=string.split('\n');if(lines.length>1)
{for(var i=0,len=lines.length;i<len;++i)
{lines[i]=stripNewLines(lines[i]);if(lines[i])
{var newSelection=this.addSelection(listType,lines[i]);newSelection.setEdited(1);}}}
this.resetSelectionIdsIfNoResponses(listType);this.changeToDBifMC();},getChoiceGroupByChoiceGroupId:function(groupId)
{return this.choiceGroups[groupId];},getChoiceGroupById:function(id)
{if(this.choiceGroups)
{for(var groupId in this.choiceGroups)
{if(this.choiceGroups[groupId].id==id)
{return this.choiceGroups[groupId];}}}},getSelectionBySystemId:function(listType,id)
{var attribute=listType.substring(0,listType.length-1)+'Id';return this.getSelectionByAttribute(listType,attribute,id);},getSelectionById:function(listType,id)
{if(arguments.length==1)
{return this.getAnySelectionById(arguments[0]);}
var attribute='id';return this.getSelectionByAttribute(listType,attribute,id);},getAnySelectionById:function(id)
{return this.getSelectionByAttribute('choices','id',id)||this.getSelectionByAttribute('answers','id',id);},getSelectionByAttribute:function(listType,attribute,val)
{for(var i=0,len=this[listType].length;i<len;++i)
{if(String(this[listType][i][attribute])===String(val))
{return this[listType][i];}}
var proxieListType='proxie'+listType.capitalize();if(this[proxieListType])
{for(i=0,len=this[proxieListType].length;i<len;++i)
{if(String(this[proxieListType][i][attribute])===String(val))
{return this[proxieListType][i];}}}
return null;},getChoiceBySelectionId:function(id)
{return this.getSelectionById('choices',id);},getAnswerBySelectionId:function(id)
{return this.getSelectionById('answers',String(id));},getChoiceByChoiceId:function(id)
{return this.getSelectionBySystemId('choices',id);},getAnswerByAnswerId:function(id)
{return this.getSelectionBySystemId('answers',id);},getRegionByRegionId:function(id)
{return this.regions[id];},getSelectionListToRender:function(listType,opt_restoreProxieSeries,opt_resetStack)
{if(!listType)return[];if(listType=='choiceGroups')
{if(this.choiceGroupOrder)
{return this.getChoiceGroupsToRender();}
else
{listType='choices';}}
var restoreProxieSeries=true;if(opt_restoreProxieSeries===false)
{restoreProxieSeries=false;}
var proxieName='proxie'+listType.capitalize();if(restoreProxieSeries)
{var oldProxieSeriesMap=this.getSelectionDataMap(proxieName,'series');var oldMetaMap=this.getSelectionDataMap(proxieName,'meta');var oldRecodeValuesMap=this.getSelectionDataMap(proxieName,'recodeValue');var oldVariableNamingMap=this.getSelectionDataMap(proxieName,'variableNaming');}
this[proxieName]=null;this.generateProxieSelections(listType,opt_resetStack);if(this[proxieName])
{for(var i=0,len=this[proxieName].length;i<len;++i)
{var proxie=this[proxieName][i];if(this.recodeValues)
{if(oldRecodeValuesMap&&oldRecodeValuesMap[proxie[proxie.objType+'Id']])
{proxie.recodeValue=oldRecodeValuesMap[proxie[proxie.objType+'Id']];}
if(!proxie.recodeValue)
{proxie.recodeValue=proxie[proxie.objType+'Id'];}}
if(this.variableNaming)
{if(oldVariableNamingMap&&oldVariableNamingMap[proxie[proxie.objType+'Id']])
{proxie.variableNaming=oldVariableNamingMap[proxie[proxie.objType+'Id']];}
if(!proxie.variableNaming)
{proxie.variableNaming=proxie['text'];}}}}
if(restoreProxieSeries)
{if(oldProxieSeriesMap)
{this.restoreSelectionDataMap(proxieName,oldProxieSeriesMap,'series');}
if(oldMetaMap)
{this.restoreSelectionDataMap(proxieName,oldMetaMap,'meta');}}
var list=this[listType].clone();if(this[proxieName])
{var dynamics=this[proxieName];if(dynamics)
{var newList=list.concat(dynamics);return newList;}}
return list;},getColumnLabelsToRender:function()
{var useCounterValue=!(this.columnLabels&&(this.columnLabels.length!=undefined));if(this.options.useSpinnerValue===true)
{useCounterValue=true;this.prepareColumnLabelsToRender();delete this.options.useSpinnerValue;}
return this.generateColumnLabels(this.columnLabels,useCounterValue);},prepareColumnLabelsToRender:function()
{var difference=this.columnLabels.length-this.options.ColumnLabelsCounter;if(difference>0)
{var from=this.columnLabels;var to=this.columnLabelsTrash;}
else
{from=this.columnLabelsTrash;to=this.columnLabels;difference=(-1)*difference;}
while(difference>0&&from.length>0)
{difference--;to.push(from.pop());}},generateColumnLabels:function(opt_columnLabelsDef,opt_useSpinnerValue)
{this.columnLabels=opt_columnLabelsDef||this.columnLabels;if(this.columnLabels&&this.columnLabels.length!=undefined&&!opt_useSpinnerValue)
{this.options['ColumnLabelsCounter']=this.columnLabels.length;}
var labelsList=[];for(var i=0;i<this.options['ColumnLabelsCounter'];++i)
{var colLabel=this.columnLabels[i];var isDefault;if(colLabel.isDefaultLabel)
{isDefault=colLabel.isDefaultLabel();}
else
{isDefault=!!colLabel.IsLabelDefault;}
if(this.columnLabels[i]&&(this.columnLabels[i].Display||this.columnLabels[i].text))
{var labelText=this.columnLabels[i].Display||this.columnLabels[i].text;}
else
{isDefault=true;labelText=getMessage('EditSection','DefaultLabel',i+1);}
if(this.columnLabels[i]&&this.columnLabels[i].languages)
{var languages=this.columnLabels[i].languages;}
else
{languages={};}
var columnLabel;if(window.TranslateQuestion&&this instanceof TranslateQuestion){columnLabel=new TranslateColumnLabel(labelText,i,languages);}else{columnLabel=new ColumnLabel(labelText,i,languages);}
columnLabel.parentObj=this;columnLabel.setIsDefaultLabel(isDefault);labelsList.push(columnLabel);}
this.columnLabels=labelsList;if(this.columnLabels&&this.columnLabels.length)
this.options['ColumnLabelsCounter']=this.columnLabels.length;return this.columnLabels||[];},exportColumnLabels:function()
{var columnLabelsExport=[];if(this.columnLabels)
{for(var i=0;i<this.columnLabels.length;++i)
{if(this.columnLabels[i].text)
{columnLabelsExport.push({Display:this.columnLabels[i].text,IsLabelDefault:this.columnLabels[i].isDefaultLabel()});}
else
{this.columnLabels.splice(i,1);this.options['ColumnLabelsCounter']--;$('ColumnLabelsCounter_Spinner').value=this.options['ColumnLabelsCounter'];}}}
return columnLabelsExport;},getChoiceGroupsToRender:function()
{return this.getFlatGroupsList();},getFlatGroupsList:function(opt_excludeGroups)
{var list=[];if(this.choiceGroupOrder)
{this.pushGroupItemsOntoList(list,this,null,null,opt_excludeGroups);}
return list;},getGroupItems:function(opt_update)
{if(this.groupItemsCache&&!opt_update)
{return this.groupItemsCache;}
var items=[];if(this.choiceGroupOrder)
{for(var i=0,len=this.choiceGroupOrder.length;i<len;++i)
{if(String(this.choiceGroupOrder[i]).indexOf('cg_')==0)
{var group=this.getChoiceGroupByChoiceGroupId(this.choiceGroupOrder[i]);if(group)
{group.parentGroupId=null;items.push(group);}}
else
{var choice=this.getChoiceByChoiceId(Number(this.choiceGroupOrder[i]));if(choice)
{choice.parentGroupId=null;items.push(choice);}}}}
this.groupItemsCache=items;return items;},pushGroupItemsOntoList:function(list,root,stack,level,opt_excludeGroups)
{if(!stack)
{stack={};}
if(level==undefined)
{level=-1;}
level++;if(stack[root.id])
{return;}
stack[root.id]=true;if(root.choiceGroupOrder)
{for(var i=0,len=root.choiceGroupOrder.length;i<len;++i)
{var id=root.choiceGroupOrder[i];if(id!==null)
{if(String(id).indexOf('cg_')==0)
{if(this.choiceGroups)
{var choiceGroupObj=this.choiceGroups[root.choiceGroupOrder[i]];if(choiceGroupObj)
{if(!opt_excludeGroups)
{list.push(choiceGroupObj);}
if(choiceGroupObj.objType=='choiceGroup')
{this.pushGroupItemsOntoList(list,choiceGroupObj,stack,level);}}}}
else
{var choiceObj=this.getChoiceByChoiceId(root.choiceGroupOrder[i]);if(choiceObj)
{list.push(choiceObj);}}}}}},getSelectionDataMap:function(listName,attribute)
{var idAttribute='choiceId';if(listName=='answers'||listName=='proxieAnswers')idAttribute='answerId';var seriesMap={};if(this[listName])
{for(var i=0,len=this[listName].length;i<len;++i)
{var selection=this[listName][i];if(selection[attribute])
{seriesMap[selection[idAttribute]]=selection[attribute];}}}
return seriesMap;},restoreSelectionDataMap:function(listName,seriesMap,attribute)
{if(!seriesMap)return;var idAttribute='choiceId';if(listName=='answers'||listName=='proxieAnswers')idAttribute='answerId';if(this[listName])
{for(var i=0,len=this[listName].length;i<len;++i)
{var selection=this[listName][i];if(seriesMap[selection[idAttribute]])
{selection[attribute]=seriesMap[selection[idAttribute]];}}}},createChoice:function(opt_text)
{return new Choice(opt_text);},createAnswer:function(opt_text)
{return new Answer(opt_text);},createColumnLabel:function(opt_text)
{return new ColumnLabel(opt_text);},getDynamicSelections:function(listType)
{var dynDef=this['dynamic'+listType.capitalize()];if(dynDef)
{if(dynDef['Type']=='Dynamic')
{QModules.loadModule('carryforward.js');var locator=dynDef['Locator'];if(BaseQuestion.dynamicChoicesLocatorStack[locator])
{return null;}
BaseQuestion.dynamicChoicesLocatorStack[locator]=1;var locatorData=DynamicChoices.getDataFromLocator(locator);if(locatorData.questionId&&locatorData.listTypeToRender)
{var questionObj=BaseForm.getInstance().getQuestionBySystemId(locatorData.questionId);if(questionObj)
{BaseForm.getInstance().setCarryForwardDependency(questionObj,this);var allDynamicSelections=[];var activeSelections=questionObj.getSelectionListToRender(locatorData.listTypeToRender,null,false);for(var i=0,len=activeSelections.length;i<len;++i)
{if(listType=='choices')
{var proxie=this.createChoice();}
else if(listType=='answers')
{var proxie=this.createAnswer();}
if(proxie)
{proxie[proxie.objType+'Id']='x'+activeSelections[i].getAnyId();proxie.id=questionObj.id+'~'+(proxie.choiceId||proxie.answerId);proxie.text=activeSelections[i].text;proxie.languages=activeSelections[i].languages;proxie.proxie=true;proxie.parentObj=this;proxie.parentList='proxie'+listType.capitalize();proxie.edited=1;allDynamicSelections.push(proxie);}}
return allDynamicSelections;}}}}},updateDisplayLogicDependencies:function()
{BaseForm.getInstance().setDisplayLogicDependencies(this.questionId,this.getQuestionIdsUsedInDisplayLogic());},getQuestionIdsUsedInDisplayLogic:function()
{var ids={};if(this.displayLogic)
{ids=this.displayLogic.getQuestionIds();}
ids=Object.extend(ids,this.getSelectorDisplayLogicQIDs('choices'));ids=Object.extend(ids,this.getSelectorDisplayLogicQIDs('answers'));return ids;},getSelectorDisplayLogicQIDs:function(selector)
{var ids={};if(this[selector])
{for(var i=0,len=this[selector].length||0;i<len;i++)
{if(this[selector][i].displayLogic)
{ids=Object.extend(ids,this[selector][i].displayLogic.getQuestionIds());}}}
return ids;},isPartOfLogic:function()
{return BaseForm.getInstance().isQuestionDisplayLogicDependent(this.questionId);},getDisplayLogicDependents:function()
{var matches=BaseForm.getInstance().getQuestionDisplayLogicDependents(this.questionId);if(!matches.length)
return false;return matches;},getCarryForwardDependencies:function()
{if(window.QuestionActions)
return QuestionActions.getCarryForwardDependencies(this['questionId']);},refreshDependencies:function(opt_resetStack)
{if(window.QuestionActions)
QuestionActions.refreshDependencies(this['questionId'],opt_resetStack);},getNextChoiceId:function()
{var current=this.nextChoiceId;this.nextChoiceId++;return current;},getNextAnswerId:function()
{var current=this.nextAnswerId;this.nextAnswerId++;return current;},getSelectionDisplay:function(selection,opt_seriesIndex,opt_lang)
{return QualtricsTools.filterForDisplay(selection.build(opt_seriesIndex,opt_lang));},getOptions:function()
{return this.options||{};},setOption:function(option,val,opt_setEdited,opt_checkForLocked,opt_refresh,opt_setupDefaultSelections)
{if(opt_checkForLocked&&this.isLocked())
{var allow=false;if(this.isLocked()!==1)
{if(option=='position'||option=='NumColumns'||option=='labelPosition')
{allow=true;}
if(option=='answers'&&val=='DL'&&this.options[option]=='SA')
{allow=true;}
if(option=='answers'&&val=='SA'&&this.options[option]=='DL')
{allow=true;}}
if(!allow){msg(getMessage('EditSection','Locked'));return false;}}
if(opt_setEdited)this.setEdited();var setSelectorValues=false;var oldValue=this.options[option];var optionsObject=QuestionTypes[this.questionType].questionOptions;if(!optionsObject['sections'][option])
{if(this.options[option])
{this.options[option]=null;}
return;}
this.changedOption=[];this.changedOption['option']=option;this.changedOption['newValue']=val;this.clearLinkedSections(option,oldValue,val);this.options[option]=val;if(optionsObject['sections'][option]['linkedCallback'])
{if(this[optionsObject['sections'][option]['linkedCallback']])
{this[optionsObject['sections'][option]['linkedCallback']](val,option);}}
if(optionsObject['sections'][option]['options']&&optionsObject['sections'][option]['options'][val]&&optionsObject['sections'][option]['options'][val]['linkedCallback'])
{if(this[optionsObject['sections'][option]['options'][val]['linkedCallback']])
{this[optionsObject['sections'][option]['options'][val]['linkedCallback']](val,option);}}
var qTypeVal=(optionsObject['sections'][option]['options']&&optionsObject['sections'][option]['options'][val]);if(qTypeVal)
{if(qTypeVal['defaultPreviewMode']===0)
{this.previewMode=0;}
if(qTypeVal['allowOutlineMode']!=undefined)
{this.allowOutlineMode=qTypeVal['allowOutlineMode'];}
else
{this.allowOutlineMode=1;}
var aSelectorWasSet=false;if(qTypeVal['linkedSections'])
{var linkedSections=qTypeVal['linkedSections'];for(var i=0,len=linkedSections.length;i<len;++i)
{var linkedSection=linkedSections[i];var existingOption=this.options[linkedSection];if(existingOption)
{if(!QuestionTypes.isRealOptionValue(this.questionType,linkedSection,existingOption))
{existingOption=null;}}
var optionToSet=existingOption;if(!optionToSet)
{optionToSet=this.getDefaultOptionValue(linkedSection);}
if(optionToSet!==undefined)
{if(!this.options[linkedSection])
{aSelectorWasSet=this.setOption(linkedSection,optionToSet,opt_setEdited,opt_checkForLocked);}}}}
if(aSelectorWasSet)
{return true;}
if(qTypeVal['selectorMapValues'])
{var selectorData=QuestionTypes.getSelectorDataFromSelectorMapValues(this.questionType,qTypeVal['selectorMapValues'],this.options);if(!selectorData||!selectorData['selector'])
{return;}
this.selector=null;this.subSelector=null;if(selectorData['selector'])
{this.selector=selectorData['selector'];setSelectorValues=true;}
if(selectorData['subSelector'])
{this.subSelector=selectorData['subSelector'];}}}
if(opt_refresh)
this.refreshCanvas();window.QES_Global&&QES_Global.refreshPreviewWindow(this);if(opt_setupDefaultSelections)
{this.setupDefaultSelections();}
return setSelectorValues;},getDefaults:function(keyList,copy,strict)
{var choices={};if(copy)
{if(this.defaultChoices)
{choices=Object.toJSON(this.defaultChoices).evalJSON();}}
else
{if(!this.defaultChoices)
this.defaultChoices={};choices=this.defaultChoices;}
if(keyList!=undefined&&keyList.length>0)
{var base=choices;for(var i=0;i<keyList.length;i++)
{if(keyList[i]==undefined)
continue;if(base[keyList[i]]==undefined)
{if(copy&&!strict)
return{};else
base[keyList[i]]={};}
base=base[keyList[i]];}
return base;}
return choices;},removeDefaultChoices:function()
{this.defaultChoices=false;if(this.questionType=='SBS')
{var that=this;this.answers.each(function(ans)
{ans.removeDefaultChoices=that.removeDefaultChoices;ans.removeDefaultChoices();});}},transposeDefaultChoices:function(val,option)
{var type=this.questionType;var callback=(QuestionTypes[type]&&QuestionTypes[type].transposeDefaultChoices);if(callback)
callback(this,option,val);},getDefaultOptionValue:function(section)
{var type=this.questionType;var sections=(QuestionTypes[type]&&QuestionTypes[type]['questionOptions']&&QuestionTypes[type]['questionOptions']['sections']);if(sections)
{if(sections[section]['defaultValue']!==undefined)
{return sections[section]['defaultValue'];}
var sectionOptions=sections[section]['options'];for(var optionName in sectionOptions)
{var option=sectionOptions[optionName];if(option['selectedByDefault'])
{return sectionOptions[optionName]['value']||optionName;}}
if(sections[section].type=='CheckBox')
{if(sections[section]['options']['OFF']&&sections[section]['options']['OFF']['value']!==undefined)
{return sections[section]['options']['OFF']['value'];}
return'OFF';}
for(optionName in sectionOptions)
{return optionName;}}
return null;},clearLinkedSections:function(option,value,newValue)
{var section=this.getPossibleOptions()[option];if(value&&section&&section['options']&&section['options'][value]&&section['options'][value].linkedSections)
{var linkedSections=section['options'][value].linkedSections;if(newValue&&section['options'][newValue])
var newLinkedSections=section['options'][newValue].linkedSections;newLinkedSections=newLinkedSections||[];var dependsOn=section['options'][value].dependsOn;if(dependsOn)
{var passed=false;for(var i=0;i<dependsOn.length;i++)
{var dependency=dependsOn[i];if(dependency[this.changedOption['option']]&&dependency[this.changedOption['option']]==this.changedOption['newValue'])
passed=true;}
if(!passed)
{newLinkedSections=[];this.options[option]=null;}}
var len;for(i=0,len=linkedSections.length;i<len;++i){var linkedSection=this.getPossibleOptions()[linkedSections[i]];var index=newLinkedSections.indexOf(linkedSections[i]);if(linkedSection)
{var linkedSelectedCurrentValue=this.options[linkedSections[i]];var newCurrentValue=this.options[newLinkedSections[index]];this.clearLinkedSections(linkedSections[i],linkedSelectedCurrentValue,newCurrentValue);if(linkedSection.type=='Textbox')
{continue;}}
if(index==-1)
this.options[linkedSections[i]]=null;}}},hasSkipLogic:function()
{if((this.skipLogic&&this.skipLogic.length)||(this.skipMarker&&this.skipMarker.length))
{return true;}
return false;},getTop:function()
{var id=this.id;top=QuestionTopCache[id];if(!top&&this.element)
{var top=Position.cumulativeOffset(this.element)[1];QuestionTopCache[id]=top;}
return top;},getHeight:function(refresh){if(!this.height||refresh)
{this.height=this.element.offsetHeight;}
return this.height;},getWidth:function(refresh){if(1||!this.width||refresh)
{this.width=this.element.offsetWidth;}
return this.width;},getBottom:function()
{return(this.getTop()+this.getHeight());},checkForHeightShift:function()
{if(this.element)
{var currentHeight=this.element.offsetHeight;var oldHeight=this.height;if(currentHeight!=oldHeight)
{this.height=currentHeight;window.QuestionTopCache={};QuestionActions.updateIcons();QuestionActions.updateConnectors();return true;}}
return false;},getPosition:function(ignorePlacementItems)
{var pos=null;var realCount=0;for(var i=0,len=this.parentObj.questions.length;i<len;++i)
{var q=this.parentObj.questions[i];if(this.id==q.id){pos=i;return realCount;}
if(!q.placementTag||!ignorePlacementItems)
{realCount++;}}
return pos;},getServerPosition:function()
{var realCount=0;for(var i=0,len=this.parentObj.questions.length;i<len;++i)
{var q=this.parentObj.questions[i];if(this.id==q.id){return realCount;}
if(q.questionId||q.saveInProgress||q.elementType=='Page Break')
{realCount++;}}
return null;},fadeRemoveQuestion:function()
{window.QES_OverQuestion.init();window.QES_OverQuestion.suspend=true;var that=this;new Effect.Fade($(this.element),{duration:0.5,afterFinish:function(){that.removeQuestion();window.QES_OverQuestion.suspend=false;}});},removeQuestion:function(opt_trashOverride)
{if(!opt_trashOverride&&this.isLocked())
{return false;}
var baseForm=BaseForm.getInstance();if(baseForm)
{baseForm.blowDisplayLogicCache();}
this.removeQuestionDOM();QuestionTopCache={};var pos=this.getPosition();this.parentObj.questions.splice(pos,1);if(this.parentObj.questions.length<1&&this.parentObj.type!='Trash')
{this.parentObj.addEmptyClass();}
window.QES_OverQuestion.init();updateCustomMousePos();if(this.selected)
{Toolbox.getInstance().removeToolbox();}
else if(Toolbox.getInstance().element)
{Toolbox.getInstance().updatePosition();}
if(this.elementType=='Question')
{this.parentObj.realQuestionCount--;}},removeQuestionDOM:function()
{this.choicesDiv=null;this.questionTextDiv=null;this.previewDiv=null;this.questionCanvas=null;this.selectConnector=null;this.skipLogicDiv=null;if(this.wizardButton)
{var wiz=this.wizardButton;this.wizardButton=null;wiz.onclick=null;removeElement(wiz);wiz=null;}
if(this.element)
{this.element.onmouseover=null;this.element.onmouseout=null;this.element.onmousedown=null;this.element.onmouseup=null;var el=this.element;this.element=null;removeElement(el);}},insertNewQuestionAbove:function(){var pos=this.getPosition();if(this.parentObj&&this.parentObj.subType==='Benchmark')
this.parentObj.addDefaultQuestionAndRender(this.getPosition(pos),true);else
this.parentObj.addDefaultQuestionAndRender(this.getPosition(pos),false);},insertNewQuestionBelow:function(){var pos=this.getPosition();if(this.parentObj&&this.parentObj.subType==='Benchmark')
this.parentObj.addDefaultQuestionAndRender(pos+1,true);else
this.parentObj.addDefaultQuestionAndRender(pos+1,false);},getPrev:function(jumpBlocks,questionsOnly)
{return this.getSibling(-1,jumpBlocks,false,questionsOnly);},getNext:function(jumpBlocks,questionsOnly)
{return this.getSibling(1,jumpBlocks,false,questionsOnly);},getSibling:function(delta,jumpBlocks,skipCollapsedBlocks,questionsOnly)
{var pos=this.getPosition();var sibling=this.parentObj.questions[pos+delta];if(sibling)
{if(questionsOnly&&sibling.elementType!='Question')
{if(delta>0)
{return this.getSibling(delta+1,jumpBlocks,skipCollapsedBlocks,questionsOnly);}
else
{return this.getSibling(delta-1,jumpBlocks,skipCollapsedBlocks,questionsOnly);}}
return sibling;}
else
{if(jumpBlocks)
{if(delta>0)
{var nextBlock=this.parentObj.getSibling(1,true);if(nextBlock)
{return nextBlock.getFirst();}}
else
{nextBlock=this.parentObj.getSibling(-1,true);if(nextBlock)
{return nextBlock.getLast();}}}}},getFirstEditable:function()
{var questionTextObj=this.getQuestionTextObj();if(questionTextObj)
{return questionTextObj;}
else
{return this.getFirstEditableSelection();}},getFirstEditableSelection:function(opt_selectionType)
{if(this.answers[0]&&opt_selectionType!=='choice')
{return this.answers[0];}
else if(this.choices[0]&&opt_selectionType!=='answer')
{return this.choices[0];}},getLastEditable:function()
{if(this.regions.length&&this.regions[this.regions.length-1])
{inlineEditor.clear();QuestionActions.select(this);return this.regions[this.regions.length-1];}
else if(this.choices.length>0)
{return this.choices[this.choices.length-1];}
else if(this.answers.length>0)
{return this.answers[this.answers.length-1];}
else
{return this.getQuestionTextObj();}},getQuestionDef:function()
{return QuestionTypes[this.questionType];},getAxisDef:function(axis)
{var axisName=axis.toLowerCase()+'Axis';var def=false;var type=this.questionType;if(QuestionTypes[type]&&QuestionTypes[type][axisName])
{def=QuestionTypes[type][axisName];}
if(this.options&&QuestionTypes[type][axisName]===null||def&&def.checkForOverride)
{if(QuestionTypes[type]['questionOptions']&&QuestionTypes[type]['questionOptions']['sections'])
{for(var key in this.options)
{if(QuestionTypes[type]['questionOptions']['sections'][key])
{var val=this.options[key];if(QuestionTypes[type]['questionOptions']['sections'][key]['options'])
{var optionsDef=QuestionTypes[type]['questionOptions']['sections'][key]['options'][val];if(optionsDef)
{if(optionsDef[axisName])
{return optionsDef[axisName];}}}}}}}
return def;},getX:function()
{return this.getAxisDef('x');},getY:function()
{return this.getAxisDef('y');},getListType:function(axis)
{var def=this.getAxisDef(axis);if(def)
return def.listType;},getAxis:function(listType)
{var y=this.getY();if(y&&y.listType==listType)
{return'Y';}
var x=this.getX();if(x&&x.listType==listType||listType=='columnLabels')
{return'X';}},getPreviewMode:function()
{if(QuestionTypes[this.questionType])
{if(this.allowOutlineMode==0||QuestionTypes[this.questionType].allowOutlineMode==0)
{return 1;}}
return this.previewMode;},togglePreview:function(opt_mode)
{if(opt_mode&&opt_mode=='preview')
{this.preview();}
else if(opt_mode&&opt_mode=='outline')
{this.outline();}
else
{if(this.previewMode)
{this.outline();}
else
{this.preview();}}
Toolbox.getInstance().render();},preview:function()
{var questionObj=this;if(QuestionTypes[this.questionType]&&(QuestionTypes[this.questionType].render))
{questionObj.previewMode=1;questionObj.refreshQuestion();}},outline:function()
{this.previewMode=0;this.refreshQuestion();},editFirstSelectionInOutline:function(opt_selectionType)
{this.outline();var first=this.getFirstEditableSelection(opt_selectionType);if(first)
{first.edit();}},editFirstSelectionSeriesInOutline:function(selectionType,selectionId)
{this.outline();var selection=this.getSelectionBySystemId(selectionType,selectionId);if(selection&&selection.series.length)
{selection.edit(null,0);}},prepare:function(opt_force)
{if(this.needsPreparing||opt_force)
{if(QuestionTypes[this.questionType]&&QuestionTypes[this.questionType].prepare)
{QuestionTypes[this.questionType].prepare(this);}
if(QES_QuestionPreparer[this.questionType])
{QES_QuestionPreparer[this.questionType](this);}}},render:function()
{if(this.parentObj.type==='Trash')
{return;}
else if(this.elementType=='Page Break')
{this.questionDiv=QBuilder('div',{className:'PageBreak'});}
else
{this.questionCanvas=QBuilder('div',{className:'QuestionCanvas Skin'});this.renderCanvas();this.questionDiv=QBuilder('div',{className:'Question'},[this.questionCanvas,QBuilder('div',{className:'clear'})]);}
this.parentObj.questionsDiv.appendChild(this.questionDiv);},shrinkTextToFit:function(text)
{return this.parentObj.shrinkTextToFit(text);},renderCollapsed:function()
{var choicesString='';if(this.getY())
{for(var i=0,len=this.choices.length;i<len;++i)
{choicesString+=this.choices[i].text;if(i<len-1)
{choicesString+=', ';}}
choicesString='('+choicesString.truncate(100)+')';}
var answersString='';if(this.getX())
{for(i=0,len=this.answers.length;i<len;++i)
{answersString+=this.answers[i].text;if(i<len-1)
{answersString+=', ';}}
answersString='('+answersString.truncate(100)+')';}
var questionText=QBuilder('div',{className:'QuestionText'});questionText.innerHTML=this.text;var questionNumberDiv=QBuilder('div',{className:'QuestionNumber'},this.exportTag);if(this.exportTag&&this.exportTag.length>3)
{var size=this.shrinkTextToFit(this.exportTag);$(questionNumberDiv).setStyle({fontSize:size+'px'});}
var questionDiv=QBuilder('div',{className:'Question Collapsed'},[QBuilder('div',{className:'QuestionSelect '+this.questionType},[questionNumberDiv,QBuilder('div',{className:'TypeIcon '+this.questionType,title:getMessage(this.questionType)}),questionText,QBuilder('div',{className:'clear'}),QBuilder('div',{className:'CollapsedSelections'},choicesString),QBuilder('div',{className:'CollapsedSelections'},answersString)])]);return questionDiv;},renderCanvas:function(options)
{if(options){this.renderOptions=options;}
options=options||{};if(this.tempDefinitionToUnpackage){QError('Question.generate was called without calling Question.unpackage');}
var parentElement=options.parentElement||this.questionCanvas;if(parentElement)
{if(!options.lang)options.lang=BaseForm.getInstance().defaultLanguage;parentElement.appendChild(this.buildCanvas(options));}},buildCanvas:function(options)
{var canvas=document.createDocumentFragment();this.prepare();if(!this.text)
{this.text='&nbsp;';}
if(QuestionTypes[this.questionType])
{if(QuestionTypes[this.questionType].readonly&&!QuestionTypes[this.questionType].noWizardButton||QuestionTypes[this.questionType].editButton)
{this.wizardButton=QBuilder('span',{id:'editbutton',clickcallback:'BaseQuestion.advancedOptions:'+this.id},getMessage('EditSection','ClickToAddAnswer'));canvas.appendChild(QBuilder('div',{className:'QuestionEditBar'},[this.wizardButton]));}}
if(this.buildHeader)
{canvas.appendChild(this.buildHeader());}
canvas.appendChild(QBuilder('div',{className:'clear'}));if(this.getPreviewMode())
{if(QuestionTypes[this.questionType]&&(QuestionTypes[this.questionType].render))
{this.previewDiv=document.createElement('div');this.previewDiv.className='QuestionPreview';this.previewDiv.appendChild(QuestionTypes[this.questionType].render(this,options));if(this.previewDiv)
{var surveyObj=BaseForm.getInstance();if(surveyObj&&(surveyObj.skinQuestionWidth&&Qualtrics.System.productName!='ThreeSixty'||options.skinWidth))
{var skinWidth=options.skinWidth||surveyObj.skinQuestionWidth;$(this.previewDiv).setStyle({width:skinWidth+'px'});}
canvas.appendChild(this.previewDiv);}}}
else
{canvas.appendChild(this.buildOutline(options));}
var footer=QBuilder('div',{className:'CanvasFooter'});if(this.buildCanvasFooter)
{footer.appendChild(this.buildCanvasFooter());}
canvas.appendChild(footer);return canvas;},buildOutline:function(options)
{var frag=document.createDocumentFragment();frag.appendChild(this.buildText(options));this.choicesDiv=QBuilder('div',{className:'choicesDiv OutlineMode'},[this.buildOutlineSelections(options)]);frag.appendChild(this.choicesDiv);return frag;},buildOutlineSelections:function(options)
{if(!options)
options=this.renderOptions;if(!QuestionTypes[this.questionType])
{return QBuilder('div',null,'Question type not supported');}
var customRenderer=QuestionTypes[this.questionType].renderOutline;if(customRenderer)
{var customRender=customRenderer(this,options);if(customRender)
{return customRender;}}
return this.buildDefaultOutlineSelections(options);},buildDefaultOutlineSelections:function(options)
{if(this.getX())
{var choiceStructure=document.createElement('table');choiceStructure.className='choiceStructure';choiceStructure.setAttribute('cellspacing','0');choiceStructure.setAttribute('border','0');choiceStructure.setAttribute('width','100%');var tBody=document.createElement('tbody');var xAxisDef=this.getX();if(xAxisDef)
{var tHead=document.createElement('thead');var xAxis=document.createElement('tr');xAxis.className='xAxis';var sec2=QBuilder('td',{className:'c4'});var xtr=QBuilder('tr');var xSeriesTr=QBuilder('tr');var xTable=QBuilder('table',{},[QBuilder('tbody',null,[xtr,xSeriesTr])]);var xListType=xAxisDef.listType;if(this[xListType])
{var listToRender=this.getSelectionListToRender(xListType);for(var i=0,len=listToRender.length;i<len;++i)
{var selection=listToRender[i];xtr.appendChild(QBuilder('td',{align:'center'},[Q_FormHelpers.buildRecodeValuesBox(selection,1),selection.buildOutlineSelection(options),Q_FormHelpers.buildVariableNamingBox(selection,0)]));if(selection.series)
{var seriesFrag=document.createDocumentFragment();for(var seriesIndex=0,seriesLength=selection.series.length;seriesIndex<seriesLength;seriesIndex++)
{seriesFrag.appendChild(selection.buildOutlineSelection({lang:options.lang,seriesIndex:seriesIndex}));}
xSeriesTr.appendChild(QBuilder('td',{align:'center'},[seriesFrag]));}}}
sec2.appendChild(xTable);var choiceWidthStrut=QBuilder('div',{className:'WidthStrut'});xAxis.appendChild(QBuilder('td',{className:'c1'},[choiceWidthStrut]));xAxis.appendChild(QBuilder('td',{className:'c2 yAxisBorder'}));xAxis.appendChild(QBuilder('td',{className:'c3 yAxisBorder'}));xAxis.appendChild(sec2);sec2=null;tHead.appendChild(xAxis);xAxis=null;choiceStructure.appendChild(tHead);tHead=null;}
if(this.getY())
{var yAxis=QBuilder('tr',{className:'yAxis'});var sec3=QBuilder('td',{className:'c1'});yAxis.appendChild(sec3);yAxis.appendChild(QBuilder('td',{className:'c2 yAxisBorder'}));var yListType=QuestionTypes[this.questionType].yAxis.listType;if(this[yListType])
{listToRender=this.getSelectionListToRender(yListType);for(i=0,len=listToRender.length;i<len;++i)
{selection=listToRender[i];sec3.appendChild(Q_FormHelpers.buildChoiceDataExportTagBox(selection));if(Qualtrics.supportMode)
{sec3.appendChild(Q_FormHelpers.buildChangeChoiceIdBox(selection));}
sec3.appendChild(selection.buildOutlineSelection(options));sec3.appendChild(document.createElement('br'));}}
yAxis.appendChild(QBuilder('td',{className:'c3 yAxisBorder'}));yAxis.appendChild(QBuilder('td',{className:'c4'}));tBody.appendChild(yAxis);yAxis=null;}
choiceStructure.appendChild(tBody);sec3=null;tBody=null;}
else
{var yAxisDef=this.getY();yListType=yAxisDef.listType;if(yAxisDef.useGroups)
{yListType='choiceGroups';}
var currentGroupId='root';var parentNodes={};parentNodes[currentGroupId]=QBuilder('div',{className:'ChoiceStructure'});if(yListType)
{listToRender=this.getSelectionListToRender(yListType);for(i=0,len=listToRender.length;i<len;++i)
{selection=listToRender[i];var parentGroupId=selection.parentGroupId||'root';if(selection.isGroup)
{if(!parentNodes[selection.choiceGroupId])
{parentNodes[selection.choiceGroupId]=QBuilder('div',{style:'padding-left:20px'});}
parentNodes[parentGroupId].appendChild(selection.buildOutlineSelection(options));parentNodes[parentGroupId].appendChild(QBuilder('br'));parentNodes[parentGroupId].appendChild(parentNodes[selection.choiceGroupId]);}
else
{if(Qualtrics.supportMode)
{parentNodes[parentGroupId].appendChild(Q_FormHelpers.buildChangeChoiceIdBox(selection));}
parentNodes[parentGroupId].appendChild(Q_FormHelpers.buildRecodeValuesBox(selection));parentNodes[parentGroupId].appendChild(Q_FormHelpers.buildVariableNamingBox(selection));parentNodes[parentGroupId].appendChild(selection.buildOutlineSelection(options));parentNodes[parentGroupId].appendChild(QBuilder('br'));}}}
choiceStructure=parentNodes['root'];}
return choiceStructure;},trashRender:function()
{var altClass='';if(QES_QuestionRenderCount%2==0)
{altClass=' AltTrashQuestion';}
if(this.deleted)
{var questionDiv=QBuilder('div',{className:'TrashQuestion Deleted '},[getMessage('EditSection','QuestionHasBeenDeleted',this.exportTag),' ',QBuilder('a',{className:'Undo',clickcallback:'Question.undoDelete:'+this.id},getMessage('SiteWide','Undo'))]);return questionDiv;}
if(this.parentObj.expandedId==this.id)
{var options={};this.questionCanvas=QBuilder('div',{className:'QuestionCanvas Skin Preview'},[this.buildCanvas(options)]);var questionDiv=QBuilder('div',{className:'Question Expanded TrashQuestion'},[this.questionCanvas]);}
else
{var questionText=QBuilder('div',{className:'QuestionText'});var questionDiv=QBuilder('div',{className:'Contracted TrashQuestion'},[questionText]);questionText.innerHTML=(this.text||'').stripScripts();}
questionDiv.appendChild(this.buildTrashButtons());questionDiv.appendChild(QBuilder('div',{className:'clear'}));QES_QuestionRenderCount++;return questionDiv;},buildTrashButtons:function()
{return QBuilder('div',{className:'Buttons'},[QBuilder('a',{className:'QButton Positive Restore',clickcallback:'Question.restorePosition:'+this.id},getMessage('EditSection','Restore')),QBuilder('a',{className:'QButton Negative PermanetlyDelete',clickcallback:'Question.permanentlyDelete:'+this.id+'($evt)'},getMessage('EditSection','PermanentlyDelete'))]);},resetQuestion:function()
{this.height=null;QuestionTopCache={};},refreshSelections:function(options)
{this.resetQuestion();if($(this.choiceDiv))
{deleteChildren(this.choicesDiv);this.choicesDiv.appendChild(this.buildOutlineSelections(options));}
else
{Qualtrics.Error('Cant refreshSelections. No choiceDiv');}
QuestionActions.updateIcons();if(this.selected)
{QuestionActions.select(this);}},refreshCanvas:function(options)
{options=options||this.renderOptions||{};this.resetQuestion();this.choicesDiv=null;this.questionTextDiv=null;this.previewDiv=null;deleteChildren(this.questionCanvas);this.renderCanvas(options);if(this.afterRefresh)
{}
if(this.onLoad)
{this.onLoad();this.onLoad=null;}
if(inlineEditor.instance)
{inlineEditor.instance.cachedInner=null;}},refreshRegions:function()
{if(this.regionHandler)
this.regionHandler.render();},getQuestionTextId:function(lang)
{lang=lang||BaseForm.getInstance().defaultLanguage;return'QuestionText_'+this.id+'_'+lang;},buildText:function(options)
{options=options||{};var text=this.getFilteredText();var hasBoldClass='';if(text.search(/<b>/i)!=-1||text.search(/<b /i)!=-1||text.search(/<strong>/i)!=-1)
{hasBoldClass=' HasBold';}
var builtText=QBuilder('div',{className:'QuestionText'+hasBoldClass,id:this.getQuestionTextId(options.lang)});builtText.title=this.description;builtText.innerHTML=text;this.questionTextDiv=builtText;return builtText;},getFilteredText:function()
{var text=this.text;if(text.search(/autoplay/i)!=-1)
{text=text.replace(/autoplay/gi,'autoplay_disabled');}
return QualtricsTools.filterForDisplay(text);},getLanguageObject:function(lang)
{if(!this.languages[lang])
{this.languages[lang]={};}
return this.languages[lang];},getQuestionTextObj:function()
{return this.questionTextObj;},buildLabelIcon:function()
{return QBuilder('span');},frameInternalNode:function(node)
{var canvasParent=this.questionCanvas.parentNode;if(node&&canvasParent)
{var padding=10;var canvasWidth=canvasParent.offsetWidth;var canvasLeft=canvasParent.scrollLeft;var canvasRight=canvasLeft+canvasParent.offsetWidth;var nodeWidth=node.offsetWidth;var nodeLeft=node.offsetLeft;var nodeRight=nodeLeft+nodeWidth;if(nodeRight>canvasRight)
{canvasParent.scrollLeft=nodeLeft-canvasWidth+nodeWidth+padding;}
else if(nodeLeft<canvasLeft)
{canvasParent.scrollLeft=nodeLeft-padding;}}},getScrollNode:function()
{return this.questionCanvas.parentNode;},openPreview:function(opt_lang)
{if(BaseForm.getInstance().revisionId)
{return;}
if(this.parentObj)
{BaseForm.getInstance().save(false);QModules.loadModule('QQuestionPopups.js');var that=this;if(!this.questionPreviewPopup)
{this.questionPreviewPopup=new QuestionPreviewPopup({title:getMessage('EditSection',"ViewQuestion"),width:900,height:500,questionObj:that});}
else
{this.questionPreviewPopup.clearContent();}
this.questionPreviewPopup.show();}},moveChoiceGroupItem:function(id,delta,opt_group)
{var parent=opt_group||this;if(parent.choiceGroupOrder)
{for(var i=0,len=parent.choiceGroupOrder.length;i<len;++i)
{if(String(parent.choiceGroupOrder[i])==String(id))
{if(i+delta<0||i+delta>len)
{break;}
parent.choiceGroupOrder.splice(i,1);parent.choiceGroupOrder.splice(i+delta,0,id);break;}}}
this.setSaved(0);Qualtrics.Menu.keepMenuOpen();this.resetChoiceOrder();this.refreshDependencies();this.refreshCanvas();},resetChoiceGroupSelectionType:function(val,key)
{if(this.choiceGroups)
{for(var groupId in this.choiceGroups)
{if(this.choiceGroups[groupId].options['Selection'])
{delete this.choiceGroups[groupId].options['Selection'];}}}},resetChoiceOrder:function()
{this.choices=this.getFlatGroupsList(true);},search:function(v)
{if(!this.text)
return false;if(this.text.toLowerCase().indexOf(v)!=-1)
{return{type:'text'};}
else if(this.questionId&&this.questionId.toLowerCase().indexOf(v)!=-1)
{return{type:'id'};}
else if(this.exportTag&&this.exportTag.toLowerCase().indexOf(v)!=-1)
{return{type:'exportTag'};}
else
{if(this.choices)
{for(var i=0,len=this.choices.length;i<len;++i)
{if(this.choices[i].text.toLowerCase&&this.choices[i].text.toLowerCase().indexOf(v)!=-1)
{return{type:'choice',choiceId:this.choices[i].choiceId};}}}
if(this.answers)
{for(var i=0,len=this.answers.length;i<len;++i)
{if(this.answers[i].text.toLowerCase().indexOf(v)!=-1)
{return{type:'answer',choiceId:this.answers[i].answerId};}
if(this.answers[i].series)
{for(var j=0;j<this.answers[i].series.length;j++)
{var series=this.answers[i].series[j];if(series.toLowerCase().indexOf(v)!=-1)
{return{type:'series'};}}}}}}
return false;},searchEntireQuestion:function(searchRegExp)
{var returnValue=[];if(this.text.search(searchRegExp)!=-1)
{returnValue.push({type:'text'});}
if(this.choices)
{for(var i=0,len=this.choices.length;i<len;i++)
{if(this.choices[i].text.search&&this.choices[i].getInner()&&this.choices[i].text.search(searchRegExp)!=-1)
{returnValue.push({type:'choice',index:i});}}}
if(this.answers)
{for(var i=0,len=this.answers.length;i<len;i++)
{if(this.answers[i].text.search&&this.answers[i].getInner()&&this.answers[i].text.search(searchRegExp)!=-1)
{returnValue.push({type:'answer',index:i});}}}
return returnValue;},searchNextQuestionFromStartingPoint:function(searchRegExp,lastSearchResult)
{var returnValue=[];if((this.text.search(searchRegExp)!=-1&&!lastSearchResult)||(lastSearchResult&&lastSearchResult.type!='choice'&&lastSearchResult.type!='answer'))
{returnValue.push({type:'text'});}
if((this.choices&&!lastSearchResult)||(lastSearchResult&&lastSearchResult.type!='answer'))
{for(var i=0,len=this.choices.length;i<len;i++)
{if(this.choices[i].text.search&&this.choices[i].getInner()&&this.choices[i].text.search(searchRegExp)!=-1)
{returnValue.push({type:'choice',index:i});}}}
if(this.answers)
{for(var i=0,len=this.answers.length;i<len;i++)
{if(this.answers[i].text.search&&this.answers[i].getInner()&&this.answers[i].text.search(searchRegExp)!=-1)
{returnValue.push({type:'answer',index:i});}}}
return returnValue;},searchPreviousQuestionFromStartingPoint:function(searchRegExp,lastSearchResult)
{var returnValue=[];if((this.answers&&!lastSearchResult)||(lastSearchResult&&lastSearchResult.type!='choice'&&lastSearchResult.type!='text'))
{for(var i=this.answers.length-1;i>=0;i--)
{if(this.answers[i].text.search&&this.answers[i].getInner()&&this.answers[i].text.search(searchRegExp)!=-1)
{returnValue.push({type:'answer',index:i});}}}
if((this.choices&&!lastSearchResult)||(lastSearchResult&&lastSearchResult.type!='text'))
{for(var i=this.choices.length-1;i>=0;i--)
{if(this.choices[i].text.search&&this.choices[i].getInner()&&this.choices[i].text.search(searchRegExp)!=-1)
{returnValue.push({type:'choice',index:i});}}}
if(this.text.search(searchRegExp)!=-1)
{returnValue.push({type:'text'});}
return returnValue;},canCarryForward:function(listType)
{var questionObj=this;var canCarryForward=true;if(questionObj.hasInPageDisplayLogic()||questionObj.isReadOnly()||questionObj.isLocked()||questionObj.questionType=='DD'||questionObj.questionType=='HotSpot')
{canCarryForward=false;}
if(!questionObj.getAxis(listType))
{canCarryForward=false;}
if(canCarryForward)
{var selectionDef=questionObj.getAxisDef(questionObj.getAxis(listType));if(selectionDef.carryForward===false)
{canCarryForward=false;}
if(listType=='answers'&&questionObj.selector=='Profile')
{canCarryForward=false;}}
return canCarryForward;},isInLoopAndMergeBlock:function()
{if(this.parentObj&&this.parentObj.blockId)
{var block=this.parentObj;return block.hasLoops();}
return false;},getParentBlockId:function(){if(this.parentObj&&this.parentObj.blockId)
{return this.parentObj.blockId;}
return null;}};window.BaseQuestionText=Class.create(Editable,{questionObj:null,objType:'questionText',rightOffset:-5,fontsize:13,multiline:1,html:1,options:1,keyMap:{up:null,down:null},styleSheetPath:'../WRQualtricsShared/DefaultStyleSheets/EditorStyles.css',initialize:function(questionObj)
{this.questionObj=questionObj;this.parentObj=questionObj;},getInner:function(seriesIndex,lang)
{return $(this.questionObj.getQuestionTextId(lang));},getText:function(seriesIndex,lang)
{if(lang&&lang!=BaseForm.getInstance().defaultLanguage)
{var translation=this.questionObj.getLanguageObject(lang).text;if(translation)
{return translation;}}
return this.questionObj.text_Unsafe;},setText:function(text,seriesIndex,opt_lang,opt_refresh)
{if(opt_lang&&opt_lang!=BaseForm.getInstance().defaultLanguage)
{this.questionObj.getLanguageObject(opt_lang).text=text;this.questionObj.getLanguageObject(opt_lang).text_Unsafe=text;}
else
{this.questionObj.text=text;this.questionObj.text_Unsafe=text;}
this.questionObj.setSaved(0);if(opt_refresh)
{this.parentObj.refresh();}},getPrev:function()
{return null;},getPrevGroup:function()
{var prevQuestion=this.questionObj.getPrev(true,true);if(prevQuestion)
{return prevQuestion.getLastEditable();}},getNextGroup:function()
{var nextQuestion=this.questionObj.getNext();if(nextQuestion)
{return nextQuestion.getFirstEditable();}},getNext:function()
{if(this.questionObj.regions&&this.questionObj.regions[0])
{inlineEditor.clear();return this.questionObj.regions[0];}
else if(this.questionObj.answers[0]&&this.questionObj.getX()&&!this.questionObj.getX().surrogate)
{return this.questionObj.answers[0];}
else if(this.questionObj.choices[0]&&this.questionObj.getY()&&!this.questionObj.getY().surrogate)
{return this.questionObj.choices[0];}},insertBelow:function(options)
{var choiceObj=this.questionObj.addChoiceAndRender(null,0);choiceObj.edit(null,null,options);return choiceObj;},edit:function(evt,seriesIndex,options)
{if(!evt&&Qualtrics.SearchAndReplace&&Qualtrics.SearchAndReplace.startedSearchAndReplace==true)
{Qualtrics.SearchAndReplace.currentBlock=BaseForm.getInstance().getBlockIndexByBlockId(this.parentObj.parentObj.blockId);Qualtrics.SearchAndReplace.currentQuestion=BaseForm.getInstance().getQuestionIndexByQuestionId(this.parentObj.parentObj,this.parentObj.id);Qualtrics.SearchAndReplace.currentSearchResult={};Qualtrics.SearchAndReplace.currentSearchResult.type='text';Qualtrics.SearchAndReplace.currentChoice=0;Qualtrics.SearchAndReplace.currentAnswer=0;Qualtrics.SearchAndReplace.currentSearchQuestionResult=null;Qualtrics.SearchAndReplace.nextSearchStartPosition=0;Qualtrics.SearchAndReplace.currentMatchPosition=0;Qualtrics.SearchAndReplace.currentMatchExists=false;Qualtrics.SearchAndReplace.removeHighlightFromWord();}
if(!options)options={};if(evt)
{var el=Event.element(evt);if(el.nodeName=='TEXTAREA')return false;if(el.getAttribute('clickcallback')&&!$(el).hasClassName('QuestionText'))return false;}
if(this.questionObj.isReadOnly())
{return false;}
if(this.questionObj.isLocked()==1)
{return false;}
if(QuestionTypes[this.questionObj.questionType].readonly)
{return;}
if(!this.questionObj.selected&&window.QuestionActions)
{QuestionActions.select(this.questionObj);}
this.questionObj.getScrollNode(options.lang).scrollLeft=0;options.evt=evt;if(options.richText===undefined)
{options.richText=true;}
options.ckMinHeight=300;var editor=new inlineEditor(this,options);return editor;},onEdit:function()
{this.startedFresh=1-this.questionObj.questionTextEdited;this.edited=true;},onType:function()
{},onEmpty:function()
{this.setText(getMessage('EditSection','ClickToWriteQuestion'));this.refresh();},onPaste:function(editor)
{var val=editor.getValue();var newText=QualtricsCPTools.stripMostFormatting(val);if(val!=newText)
{editor.setValue(newText);}},afterEdit:function(editor,seriesIndex,lang)
{var text=this.getText(seriesIndex,lang);var len=text.length;var brcheck=text.substr(len-4);if(brcheck=="<br>")
{this.setText(text.substr(0,len-4),seriesIndex,lang);}
if(this.startedFresh)
{if(this.questionObj&&this.questionObj.selectionIdsAreLocked&&!this.questionObj.selectionIdsAreLocked())
{var scalePackage=choiceScaleHelpers.findScaleByTrigger(this.questionObj.text);if(scalePackage)
{if(this.questionObj.answers)
{var answersAxis=this.questionObj.getAxis('answers');if(answersAxis)scalePackage.axis=this.questionObj.getAxis('answers');}
if(!this.questionObj.hasAutoScale(scalePackage.axis))
{this.questionObj.setScaleDefinition(scalePackage.axis,scalePackage.scaleName,scalePackage.scaleType,true,scalePackage.length,scalePackage.reverse);this.questionObj.replaceDefaultsWithScale(scalePackage.axis);var scaleDef=this.questionObj['autoResponseScales'+scalePackage.axis];if(scaleDef)
{scaleDef.assumed=true;}
var q=this.questionObj;if(q.scoreAll&&q.canScore())
{q.scoreAll();}
Toolbox.getInstance().render();this.questionObj.refreshCanvas.bind(this.questionObj).defer();}}}}
if(this.changed)
{if(QualtricsCPTools.questionTextHasIllegalScripting(text,this.originalText))
{var alertOptions={message:getMessage('EditSection','NoJavaScriptInQuestionText')};QualtricsCPTools.showAlertDialog(alertOptions);this.setText(this.originalText,seriesIndex,lang);}
BaseForm.getInstance().setSpellChecked(0);Qualtrics.History.getInstance().addAction('Change Question Text',{action:'BaseQuestion.setQuestionText',instanceId:this.parentObj.id,parameters:[this.originalText,seriesIndex,lang,true]},{action:'BaseQuestion.setQuestionText',instanceId:this.parentObj.id,parameters:[text,seriesIndex,lang,true]});}
BaseForm.getInstance().blowDisplayLogicCache();if(this.questionObj.afterQuestionTextEdit)
{this.questionObj.afterQuestionTextEdit();}},getEdited:function(opt_lang)
{if(opt_lang)
{if(opt_lang==BaseForm.getInstance().defaultLanguage)
{return this.questionObj.questionTextEdited;}
return this.hasTranslation(opt_lang);}
return this.questionObj.questionTextEdited;},setEdited:function(v)
{this.questionObj.questionTextEdited=v;if(this.questionObj.setEdited)
{this.questionObj.setEdited(v);}},onUpdate:function(inlineEditorObj)
{if(inlineEditorObj.editorType=='textarea')
{return;}
if(inlineEditorObj.editorType=='fck')
{return;}
if(this.questionObj.questionTextEdited)
{if(!this.questionObj.customDescription)
{this.questionObj.description=this.questionObj.getAutoDescription();}
var labelHidden;if(!this.questionObj.customDescription)
{labelHidden=true;}
if(!this.questionObj.labelControls)
{var customClass='';if(this.questionObj.customDescription)
{customClass=' CustomLabelControls';}
if(labelHidden)
{customClass+=' LabelControlsHidden';}
if(!window.textClassToggle)
{window.textClassToggle=true;}
else
{window.textClassToggle=false;}
this.questionObj.labelControls=QBuilder('div',{className:'LabelControls'+customClass});$('pageDiv').appendChild(this.questionObj.labelControls);}
var labelTop=inlineEditorObj.top+inlineEditorObj.height;$(this.questionObj.labelControls).setStyle({top:(labelTop-5)+'px',left:(inlineEditorObj.left+2)+'px',width:(inlineEditorObj.width-4)+'px'});if(labelHidden)
{this.questionObj.labelControls.innerHTML='';this.questionObj.labelControls.addClassName('LabelControlsHidden');this.questionObj.labelControls.appendChild(this.questionObj.buildLabelIcon());return;}
this.questionObj.labelControls.removeClassName('LabelControlsHidden');var title=getMessage('EditSection','EditQuestionLabelSS');this.questionObj.labelControls.innerHTML='';var labelInner=QBuilder('span',{className:'LabelInner'});labelInner.appendChild(this.questionObj.buildLabelIcon());labelInner.appendChild(QBuilder('span',null,getMessage('EditSection','QuestionLabel')));labelInner.appendChild(QBuilder('a',{href:'javascript:void(0)',keepeditoropen:'true',title:title,clickcallback:'Question.editLabel',instanceid:this.questionObj.id,p1:'$evt'},this.questionObj.description));this.questionObj.labelControls.appendChild(labelInner);}},hasTranslation:function(seriesIndex,lang)
{if(lang==BaseForm.getInstance().defaultLanguage||this.questionObj.languages[lang]&&this.questionObj.languages[lang].text)
{if(lang==BaseForm.getInstance().defaultLanguage)
{return this.questionObj.questionTextEdited;}
return true;}
return false;}});window.BlockName=Class.create(Editable,{objType:'blockName',keyMap:{enter:null},maxlength:80,initialize:function(parentObj)
{this.parentObj=parentObj;this.id=parentObj.id+'_NameObject';},edit:function($super,event,options)
{if(this.parentObj.isLocked()==1)
{return false;}
$super(event,options);},afterEdit:function()
{var blockId=this.parentObj.blockId;this.text=stripNewLines(this.text);var title=this.text;if(blockId)
{msg('Renaming Block','blockrename');new Ajax.Request('Ajax.php?action=SetBlockName',{method:'post',parameters:{BID:blockId,title:title}});}}});window.SurveyName=Class.create();SurveyName.getInstance=function(){return SurveyName._instance;};SurveyName.prototype=Object.extend(new Editable(),{objType:'SurveyName',keyMap:{enter:null},maxlength:100,options:1,initialize:function(parentObj)
{this.parentObj=parentObj;this.id='SurveyNameEditable';SurveyName._instance=this;},afterEdit:function()
{this.text=stripNewLines(this.text);if(this.edited)
{var title=this.text;var menu=$('SelectSurveyMenu');if(menu)
{var textNode=QualtricsTools.fastDown(menu);if(textNode)
{textNode.nodeValue=title;}
if(Qualtrics.surveys[this.parentObj.id])
{Qualtrics.surveys[this.parentObj.id]=title;}}
if(title)
{msg('Changing Survey Title','surveyrename');new Ajax.Request('Ajax.php?action=SetSurveyName',{method:'post',parameters:{title:title}});}}},buildInlineEditorMenuButton:function()
{var options=QBuilder('div',{className:'inlineEditorOptions',editordowncallback:'showMenu'},[QBuilder('b',{bubbleup:true},[QBuilder('b',{bubbleup:true})])]);return options;},buildMenu:function()
{return{ajax:{action:"getFolders",preparser:"SurveyName.createMenuDef",parameters:{rand:Math.random()}}};},createMenuDef:function(json)
{var folderInfo=Qualtrics.parseJSON(json);var items=[{separator:1}];if(folderInfo)
{var currentFolder=false;if(folderInfo['Surveys'])
{currentFolder=folderInfo['Surveys'][BaseForm.getInstance().id];}
if(!Object.isArray(folderInfo['SurveyFolders']))
{for(var index in folderInfo['SurveyFolders'])
{items.push({display:folderInfo['SurveyFolders'][index],action:'BaseForm.setFolder('+index+')',checked:currentFolder==index?true:false});}
items.unshift({display:'Not in any folder',action:'BaseForm.setFolder',checked:!currentFolder});}
else
{items=[];}}
return{items:items,togglecheckexclusive:true};}});window.SurveyDescription=Class.create(Editable,{objType:'SurveyDescription',keyMap:{enter:null},maxlength:100,options:1,text:null,label:null,validationRegEx:null,validationMsg:null,initialize:function(parentObj)
{this.parentObj=parentObj;this.id='SurveyDescriptionEditable';},afterEdit:function()
{this.text=stripNewLines(this.text);if(this.edited)
{var title=this.text;if(this.validationRegEx&&(!title||!title.match(this.validationRegEx)))
{alert(this.validationMsg);this.revert();return;}
if(true)
{msg('Saving...','surveydescription');new Ajax.Request('Ajax.php?action=SetSurveyDescription',{method:'post',parameters:{title:title}});}}},onEmpty:function()
{}});window.QuestionText=Class.create();QuestionText.prototype={text:'',id:null,parentObj:null,edited:0,editing:0,initialize:function(text)
{this.text=text;this.id='ch'+(Math.round(Math.random()*100000000));}};window.SelectionSeriesIndexMapper=Class.create();SelectionSeriesIndexMapper.prototype={selection:null,seriesIndex:null,initialize:function(selection,seriesIndex)
{this.selection=selection;this.seriesIndex=seriesIndex;},edit:function()
{var options=arguments[2]||{};options.select=true;this.selection.edit(null,this.seriesIndex,options);}};window.Translatable=Class.create(Editable,{languages:null,getLanguageObject:function(lang)
{if(lang==BaseForm.getInstance().defaultLanguage)
{return this;}
return this.getSimpleLanguageObject(lang);},getSimpleLanguageObject:function(lang)
{if(!this.languages[lang])
{this.languages[lang]={};}
return this.languages[lang];},hasTranslation:function(opt_seriesIndex,lang)
{if(lang==BaseForm.getInstance().defaultLanguage)
{return true;}
var obj=this.getSimpleLanguageObject(lang);if(obj)
{if(obj.text)
{return true;}}
return false;},getText:function(opt_seriesIndex,opt_lang)
{var obj=this;if(opt_lang&&opt_lang!=BaseForm.getInstance().defaultLanguage)
{if(this.languages[opt_lang])
{obj=this.languages[opt_lang];}}
if(opt_seriesIndex||opt_seriesIndex===0)
{if(obj.series&&obj.series[opt_seriesIndex]!==undefined)
{var returnString=String(obj.series[opt_seriesIndex]);if(returnString=="")
{returnString=String(this.series[opt_seriesIndex]);}
return returnString;}}
else if(obj.text)
{return String(obj.text);}
else if(!opt_lang)
{return"";}
if(opt_lang)
{return this.getText(opt_seriesIndex,false);}
return"";},setText:function(text,opt_seriesIndex,opt_lang,opt_refresh)
{if(text==' ')text='&nbsp;';var obj=this;if(opt_lang&&opt_lang!=BaseForm.getInstance().defaultLanguage)
{obj=this.getLanguageObject(opt_lang);}
if(opt_seriesIndex||opt_seriesIndex===0)
{if(!obj.series)
{obj.series=[];}
obj.series[opt_seriesIndex]=text;}
else
{obj.text=text;}
if(opt_refresh)
{this.refresh();}}});window.QuestionSpecificData=Class.create(Translatable,{objType:'questionSpecificData',initialize:function(parentObj,dataType,pkg)
{this.languages={};if(pkg&&pkg['Language'])
{for(var lang in pkg['Language'])
{if(pkg['Language'][lang]['QuestionSpecificData']&&pkg['Language'][lang]['QuestionSpecificData'][dataType])
{this.languages[lang]=pkg['Language'][lang]['QuestionSpecificData'][dataType];}}}
this.parentObj=parentObj;this.id=parentObj.id+'_QSD_'+dataType;}});BaseForm.Groupable=Class.create(Translatable,{getSystemId:function()
{return this[this.objType+'Id'];},baseInit:function()
{this.languages={};},getAssignToGroupMenuDef:function()
{var items=[];items.push({display:getMessage('SiteWide','None'),action:this.path+'.assignGroup:'+this.id+'(, true)',checked:!this.parentGroupId},{separator:true});if(this.parentObj.choiceGroups)
{for(var groupId in this.parentObj.choiceGroups)
{var group=this.parentObj.choiceGroups[groupId];if(group.objType=='choiceGroup')
{var checked=this.parentGroupId==group.choiceGroupId;items.push({display:group.text,action:this.path+'.assignGroup:'+this.id+'('+group.choiceGroupId+', true)',checked:checked});}}}
items.push({type:'TextInput',display:getMessage('EditSection','NewGroup')+'…',action:this.path+'.createAndAssignGroup:'+this.id+'($val, true)',focus:true});return{menuClass:'GroupsMenu',togglecheckexclusive:true,items:items};},assignGroup:function(groupId,opt_redrawQuestion)
{if(groupId&&groupId==this.choiceGroupId)
{Qualtrics.Menu.keepMenuOpen();alert('You cannot assign a group to itself');return;}
if(this.isDescendant(groupId))
{Qualtrics.Menu.keepMenuOpen();alert('You cannot assign a group to its descendant');return;}
var existingGroup=this.getParentGroup();this.unassignGroup();if(groupId)
{var group=this.parentObj.getChoiceGroupByChoiceGroupId(groupId);if(group)
{group.addItem(this.getSystemId());this.parentGroupId=groupId;group.getGroupItems(true);}}
else
{this.parentObj.addChoiceGroup(this.getSystemId());if(existingGroup)
{var pos=existingGroup.getPosition();this.parentObj.choiceGroupOrder.splice(pos,0,this.getSystemId());}
else
{this.parentObj.choiceGroupOrder.push(this.getSystemId());}}
this.parentObj.resetChoiceOrder();if(opt_redrawQuestion)
{this.parentObj.refresh();}
this.parentObj.setSaved(0);},isDescendant:function(groupId)
{if(this.choiceGroupOrder)
{for(var i=0,len=this.choiceGroupOrder.length;i<len;++i)
{var childGroup=this.parentObj.choiceGroups[this.choiceGroupOrder[i]];if(childGroup)
{if(childGroup.choiceGroupId==groupId)
{return true;}
if(childGroup.isDescendant(groupId))
{return true;}}}}
return false;},createAndAssignGroup:function(groupName,opt_redrawQuestion)
{if(this.isLocked())
{msg(getMessage('EditSection','Locked'));return;}
var group=this.parentObj.createNewChoiceGroup(groupName,this.getPosition());if(group)
{this.assignGroup(group.choiceGroupId,opt_redrawQuestion);}},unassignGroup:function()
{if(this.isLocked())
{msg(getMessage('EditSection','Locked'));return;}
if(this.parentGroupId)
{var parentGroup=this.parentObj.getChoiceGroupByChoiceGroupId(this.parentGroupId);parentGroup.removeItem(this.getSystemId());this.parentGroupId=null;parentGroup.getGroupItems(true);}
else
{this.parentObj.unassignChoiceGroupItem(this.getSystemId());}
this.parentObj.setSaved(0);},getParentGroupMenu:function()
{var parentGroup=this.getParentGroup();if(parentGroup)
{return{display:'Parent Group Options',submenu:'ChoiceGroup.buildMenu:'+parentGroup.id};}
return'';},getParentGroup:function()
{if(this.parentGroupId&&this.parentObj.choiceGroups[this.parentGroupId])
{return this.parentObj.choiceGroups[this.parentGroupId];}}});window.ChoiceGroup=Class.create(BaseForm.Groupable,{path:'ChoiceGroup',objType:'choiceGroup',parentList:'choiceGroups',parentObj:null,parentGroupId:null,options:null,text:'group',id:null,choiceGroupId:null,choiceGroupOrder:null,groupItemsCache:null,isSelection:false,isGroup:true,randomization:null,keyMap:{enter:'onEnter'},initialize:function(groupId,opt_groupDef,opt_parentObj)
{this.id=QualtricsTools.createNewId('gr');ChoiceGroup.registry[this.id]=this;this.choiceGroupId=groupId;this.options={};if(opt_parentObj)
{this.parentObj=opt_parentObj;}
if(opt_groupDef)
{this.generate(opt_groupDef);}
this.languages={};},edit:function($super,event,options)
{if(this.isLocked())
{msg(getMessage('EditSection','Locked'));return;}
$super(event,options);},afterEdit:function(inlineEditor)
{QuestionTypes.Universal.makeDescendantsEditable(this.getInner(inlineEditor.seriesIndex,inlineEditor.lang));if(this.originalText!=this.text)
{this.storeUndo(this.id,this.originalText,this.text,inlineEditor.seriesIndex,inlineEditor.lang);}},isLocked:function()
{if(this.parentObj&&this.parentObj.isLocked)
{return this.parentObj.isLocked();}},generate:function(groupDef)
{if(groupDef['ChoiceGroupOrder'])
{this.choiceGroupOrder=[];for(var i=0,len=groupDef['ChoiceGroupOrder'].length;i<len;++i)
{this.choiceGroupOrder.push(groupDef['ChoiceGroupOrder'][i]);}
this.getGroupItems();}
if(groupDef['GroupLabel'])
{this.text=groupDef['GroupLabel'];}
if(groupDef['Options'])
{if(groupDef['Options'].push&&typeof groupDef['Options'].push=='function')
{groupDef['Options']={};}
this.options=groupDef['Options'];}
if(groupDef['Randomization'])
{this.randomization=groupDef['Randomization'];}
if(groupDef['ParentGroupId'])
{this.parentGroupId=groupDef['ParentGroupId'];}},getGroupItems:function(opt_update)
{if(this.groupItemsCache&&!opt_update)
{return this.groupItemsCache;}
var items=[];if(this.choiceGroupOrder)
{for(var i=0,len=this.choiceGroupOrder.length;i<len;++i)
{if(String(this.choiceGroupOrder[i]).indexOf('cg_')==0)
{var group=this.parentObj.getChoiceGroupByChoiceGroupId(this.choiceGroupOrder[i]);if(group)
{group.parentGroupId=this.choiceGroupId;items.push(group);}}
else
{var choice=this.parentObj.getChoiceByChoiceId(Number(this.choiceGroupOrder[i]));if(choice)
{choice.parentGroupId=this.choiceGroupId;items.push(choice);}}}}
this.groupItemsCache=items;return items;},addItem:function(itemId)
{if(!this.choiceGroupOrder)
{this.choiceGroupOrder=[];}
for(var i=0,len=this.choiceGroupOrder.length;i<len;++i)
{if(this.choiceGroupOrder[i]==itemId)
{console.error('ChoiceGroup Item: "'+itemId+'" already exists');return;}}
this.choiceGroupOrder.push(itemId);},removeItem:function(itemId)
{for(var i=0,len=this.choiceGroupOrder.length;i<len;++i)
{if(this.choiceGroupOrder[i]==itemId)
{this.choiceGroupOrder.splice(i,1);return;}}},buildOutlineSelection:function(options)
{if(options&&options.lang&&options.lang!=BaseForm.getInstance().defaultLanguage)
{return QBuilder('label',{id:this.id+'_'+options.lang,className:'Selection ChoiceGroup',objtype:'choiceGroup'},[QBuilder('span',{className:'Editable',clickcallback:'BaseQuestion.editChoiceGroup',language:options.lang,instanceid:this.parentObj.id,p1:'$evt',p2:this.id,p3:'',p4:options.lang},this.getText(options.seriesIndex,options.lang))]);}
else
{return QBuilder('label',{id:this.id,className:'Selection ChoiceGroup',objtype:'choiceGroup'},[QBuilder('span',{className:'Editable'},this.text)]);}},build:function()
{if(this.getOption('HideTitle'))
{return false;}
return this.text;},getClasses:function()
{var indentClass='';if(this.getOption('HideTitle'))
{indentClass=' HiddenTitle';}
return indentClass;},getChoiceGroupId:function()
{return this.choiceGroupId;},getData:function()
{var def={ChoiceGroupOrder:this.choiceGroupOrder,GroupLabel:this.text};if(this.parentGroupId)
{def['ParentGroupId']=this.parentGroupId;}
if(this.randomization)
{def['Randomization']=this.randomization;}
if(this.options)
{def['Options']=this.options;}
return def;},getInner:function(seriesIndex,lang)
{var parentNode=null;var targetId=this.id;var defaultLanguage=BaseForm.getInstance().defaultLanguage;if(lang&&lang!=defaultLanguage)
{targetId=targetId+'_'+lang;}
if(seriesIndex||seriesIndex===0)
{targetId=targetId+'_'+seriesIndex;}
parentNode=$(targetId);if(parentNode)
{return QualtricsTools.fastDown(parentNode,'Editable');}},showRichTextEditor:function(opt_seriesIndex,opt_lang)
{var seriesId=inlineEditor.seriesId;var lang=inlineEditor.lang;var originalText=this.text;inlineEditor.clear();var choice=this.getText(opt_seriesIndex);var that=this;new EditorPopup({title:'Group Text',contents:choice,width:700,height:400,seriesIndex:opt_seriesIndex,saveCallBack:function(val,editorPopup)
{var seriesIndex;if(editorPopup.options&&editorPopup.options.seriesIndex)
{seriesIndex=editorPopup.options.seriesIndex;}
that.isDefault=false;that.setText(val,seriesIndex);that.edited=true;that.parentObj.setSaved(0);var options={};if(opt_lang)
{options.lang=opt_lang;}
that.parentObj.refreshCanvas(options);var questionId=that.parentObj.id;var selectionId=that.id;if(originalText!=that.text)
{that.storeUndo(that.id,originalText,that.text,seriesId,lang);}}});},storeUndo:function(choiceGroupId,originalText,newText,seriesId,lang)
{Qualtrics.History.getInstance().addAction('Set Selection Text',{action:'ChoiceGroup.setText',instanceId:choiceGroupId,parameters:[originalText,seriesId,lang,true]},{action:'ChoiceGroup.setText',instanceId:choiceGroupId,parameters:[newText,seriesId,lang,true]});},buildMenu:function()
{var selectionMenu='';if(this.parentObj.questionType!='Matrix')
{selectionMenu={display:getMessage('EditSection','Selection'),submenu:'ChoiceGroup.getSelectionMenuDef:'+this.id};}
return{title:this.text.stripTags(),items:[this.getParentGroupMenu(),{display:getMessage('EditSection','HideGroupTitle'),action:this.path+'.toggleOption:'+this.id+'(HideTitle, true)',checked:this.getOption('HideTitle',false)},{action:this.path+'.showRichTextEditor:'+this.id,display:getMessage('ResultsSection','RichTextEditor')},{display:getMessage('SiteWide','MoveUp'),action:this.path+'.moveUp:'+this.id,className:'MoveUp'},{display:getMessage('SiteWide','MoveDown'),action:this.path+'.moveDown:'+this.id,className:'MoveDown'},{separator:true},selectionMenu,{display:getMessage('EditSection','ChoiceGroupRandomization'),submenu:'ChoiceGroup.getRandomizationMenuDef:'+this.id},{separator:true},{display:getMessage('EditSection','RemoveGroup'),action:this.path+'.remove:'+this.id,className:'Remove'}]};},getRandomizationMenuDef:function()
{var existing=this.getOption('randomization','Default');return{togglecheckexclusive:true,items:[{display:getMessage('QuestionOptions','RD_UseQuestion'),action:'ChoiceGroup.unsetOption:'+this.id+'(randomization, true)',checked:existing=='Default'},{separator:true},{display:getMessage('QuestionOptions','RD_NoRD'),action:'ChoiceGroup.setOption:'+this.id+'(randomization, None, true)',checked:existing=='None'},{display:getMessage('QuestionOptions','RD_RDAll'),action:'ChoiceGroup.setOption:'+this.id+'(randomization, All, true)',checked:existing=='All'}]};},getSelectionMenuDef:function()
{var existing=this.getOption('Selection');return{togglecheckexclusive:true,items:[{display:getMessage('EditSection','SingleAnswerWithinQuestion'),action:'ChoiceGroup.setOption:'+this.id+'(Selection,SAWithinQuestion, true)',checked:existing=='SAWithinQuestion'},{display:getMessage('EditSection','SingleAnswerWithinGroup'),action:'ChoiceGroup.setOption:'+this.id+'(Selection,SAWithinGroup, true)',checked:existing=='SAWithinGroup'},{separator:true},{display:getMessage('EditSection','MultipleAnswerWithinQuestion'),action:'ChoiceGroup.setOption:'+this.id+'(Selection,MAWithinQuestion, true)',checked:existing=='MAWithinQuestion'}]};},toggleOption:function(key,opt_redraw)
{this.setOption(key,!this.getOption(key),opt_redraw);},setOption:function(key,val,opt_redraw)
{this.parentObj.setSaved(0);if(key=='randomization')
{if(!this['randomization'])
{this['randomization']={};}
this['randomization']['Type']=val;}
else
{this.options[key]=val;}
if(key=='Selection'&&(val=='SAWithinGroup'||val=='MAWithinGroup'||val=='MAWithinQuestion'))
{if(this.parentObj.options['answers']=='SA')
{this.parentObj.setOption('answers','MA');if(window.Toolbox)
{Toolbox.getInstance().render();}}}
if(opt_redraw)
{this.parentObj.refreshCanvas();}},getOption:function(key,opt_default)
{if(key=='randomization')
{if(this['randomization']&&this['randomization']['Type'])
{return this['randomization']['Type'];}}
else if(this.options[key]!==undefined)
{return this.options[key];}
if(opt_default!==undefined)
{return opt_default;}
if(key=='Selection')
{var defaultSelection='SAWithinQuestion';if(this.parentObj.options['answers']=='MA')
{defaultSelection='MAWithinQuestion';}
return defaultSelection;}},unsetOption:function(key,opt_redraw)
{if(key=='randomization'&&this[key]!==undefined)
{delete this[key];}
else
{if(this.options[key]!==undefined)
{delete this.options[key];}}
if(opt_redraw)
{this.parentObj.refreshCanvas();}},onEmpty:function()
{this.confirmRemove();},confirmRemove:function()
{this.remove();},remove:function()
{if(this.parentObj.choiceGroups&&this.parentObj.choiceGroups[this.choiceGroupId])
{this.parentObj.choiceGroups[this.choiceGroupId].ungroupAllItems();delete this.parentObj.choiceGroups[this.choiceGroupId];}
var parent=null;if(this.parentGroupId)
{parent=this.parentObj.choiceGroups[this.parentGroupId];}
else
{parent=this.parentObj;}
if(parent.choiceGroupOrder)
{for(var i=0,len=parent.choiceGroupOrder.length;i<len;++i)
{if(parent.choiceGroupOrder[i]==this.choiceGroupId)
{parent.choiceGroupOrder.splice(i,1);break;}}}
if(this.parentObj.choiceGroups&&Object.keys(this.parentObj.choiceGroups).length==0)
{this.parentObj.choiceGroups=null;this.parentObj.choiceGroupOrder=null;}
this.parentObj.refreshCanvas();this.parentObj.setSaved(0);Toolbox.getInstance().update();},clearItemsCache:function()
{this.groupItemsCache=null;},removeAllItems:function()
{if(this.groupItemsCache)
{for(var i=this.groupItemsCache.length-1;i>-1;--i)
{this.groupItemsCache[i].remove();}}},ungroupAllItems:function()
{if(this.groupItemsCache)
{var items=[];for(var i=0,len=this.groupItemsCache.length;i<len;++i)
{items.push(this.groupItemsCache[i]);}
for(var i=0,len=items.length;i<len;++i)
{items[i].assignGroup();}}},getPosition:function()
{var parentGroup=this.getParentGroup()||this.parentObj;if(parentGroup.choiceGroupOrder)
{for(var i=0,len=parentGroup.choiceGroupOrder.length;i<len;++i)
{if(parentGroup.choiceGroupOrder[i]==this.getSystemId())
{return i;}}}
return null;},moveUp:function()
{var parentGroup=this.getParentGroup();(parentGroup||this.parentObj).moveChoiceGroupItem(this.choiceGroupId,-1);},moveDown:function()
{var parentGroup=this.getParentGroup();(parentGroup||this.parentObj).moveChoiceGroupItem(this.choiceGroupId,1);},moveChoiceGroupItem:function(id,delta)
{this.parentObj.moveChoiceGroupItem(id,delta,this);},onEnter:function(editor,evt)
{if(evt.shiftKey)
{var group=this.parentObj.createNewChoiceGroup(null,this.getPosition()+1);this.parentObj.refreshCanvas();group.edit({lang:editor.lang});}
else
{editor.removeInlineEditor();var selection=this.parentObj.addChoiceAndRender(null,null,this.choiceGroupId);selection.edit({lang:editor.lang});}}});ChoiceGroup.registry={};ChoiceGroup.getInstance=function(id)
{return ChoiceGroup.registry[id];};window.BaseSelection=Class.create(BaseForm.Groupable,{path:'BaseSelection',objType:'choice',parentList:'choices',options:1,text:'',id:null,imageIDs:null,choiceId:null,recodeValue:null,element:null,isDefault:false,wasDefault:false,parentObj:null,edited:0,changed:0,auto:0,editing:0,fresh:0,textEntry:0,hasImage:0,imageLocation:null,imageDisplay:null,series:null,meta:null,keyMap:{backspace:'deleteSelectionIfEmpty',enter:'onEnter'},carriedForward:false,analysis:null,exclusive:null,grading:null,isSelection:true,initialize:function(text)
{this.baseInit(text);},baseInit:function(text)
{if(text!=undefined)
{this.text=text;}
this.id='ch'+(Math.round(Math.random()*100000000));this.languages={};},assignSystemId:function()
{if(!this[this.objType+'Id'])
{var typeCapitalized=this.objType.capitalize();this[this.objType+'Id']=String(this.parentObj['next'+typeCapitalized+'Id']);this.parentObj['next'+typeCapitalized+'Id']++;}
return this[this.objType+'Id'];},generate:function(data)
{if(data['Image'])
{this.hasImage=1;this.imageLocation=data['Image']['ImageLocation'];this.imageDisplay=data['Image']['Display'];}
if(data['Display'])
{this.text=data['Display'];}
if(data['CustomClasses'])
{this.customClasses=data['CustomClasses'];}
if(data['TextEntry'])
{this.textEntry=1;}
if(data['InputWidth']){this.setMeta('InputWidth',data['InputWidth']);}
if(data['InputHeight']){this.setMeta('InputHeight',data['InputHeight']);}
if(data['TextEntryLength'])
{this.setMeta('TextEntryLength',data['TextEntryLength']);}
if(data['TextEntryValidation'])
{this.setMeta('TextEntryValidation',data['TextEntryValidation']);}
if(data['TextEntrySize'])
{this.setMeta('TextEntrySize',data['TextEntrySize']);}
if(data['TextEntryForceResponse'])
{this.setMeta('TextEntryForceResponse',data['TextEntryForceResponse']);}
if(data['GraphicSize'])
{this.setMeta('GraphicSize',data['GraphicSize']);}
if(data['ExpandedGraphicSize'])
{this.setMeta('ExpandedGraphicSize',data['ExpandedGraphicSize']);}
if(data['DisplayLogic'])
{this.addDisplayLogic(data['DisplayLogic'],false,false);}
this.setEdited(1);},setSaved:function(v)
{return this.parentObj.setSaved(v);},build:function(opt_seriesIndex,opt_lang)
{var selection=this;var displayStr="";if(selection)
{if(opt_seriesIndex!==undefined&&opt_seriesIndex!==null)
{displayStr=selection.getText(opt_seriesIndex,opt_lang);if(selection.analysis&&selection.analysis[1+parseInt(opt_seriesIndex)]===false)
{displayStr='<span class="ExcludeFromAnalysisSymbol" title="Excluded From Analysis">&times;&nbsp;</span>'+displayStr;}
return displayStr;}
if(selection.text)
{displayStr+=selection.getText(opt_seriesIndex,opt_lang);}
if(selection.hasImage)
{var htmlID="IMG_"+(Math.round(Math.random()*100000000));if(selection.imageIDs===null)
{selection.imageIDs=new Array();}
selection.imageIDs.push(htmlID);var graphic=selection.getImageHtml(htmlID);var textPosition=this.parentObj[selection.objType+'TextPosition'];if(textPosition)
{if(textPosition=='Bottom')displayStr=graphic+'<br />'+displayStr;else if(textPosition=='Top')displayStr=displayStr+'<br />'+graphic;else if(textPosition=='Left')displayStr=displayStr+graphic;else displayStr=graphic+displayStr;}
else
{displayStr+=graphic;}}
if(selection.proxie)
{displayStr='<span class="CarryForwardSymbol" title="Carry Forward">&raquo;&nbsp;</span>'+displayStr;}
if(selection.analysis===false)
{displayStr='<span class="ExcludeFromAnalysisSymbol" title="Excluded From Analysis">&times;&nbsp;</span>'+displayStr;}
if(selection.exclusive==true&&(((this.parentObj.questionType=='Matrix'&&this.parentObj.selector=='Likert'&&(this.parentObj.subSelector=='MultipleAnswer'||(this.parentObj.subSelector=='SingleAnswer'&&selection.objType!='answer'))))||(this.parentObj.questionType=='MC'&&this.parentObj.options.answers=='MA')))
{displayStr='<span style="color:#2054AF; font-size:14px;" title="Exclusive Answer">&otimes;&nbsp;</span>'+displayStr;}
if(selection.displayLogic)
{displayStr='<a class="ChoiceDisplayLogicIcon"  bubbleup="false" clickcallback="BaseSelection.addDisplayLogic:'+this.id+'" title="Has Display Logic">&nbsp;</a> '+displayStr;}
if(displayStr=="")
{displayStr='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';}
return displayStr;}},getConstructor:function()
{if(this.objType=='choice')
{return Choice;}
if(this.objType=='answer')
{return Answer;}},setMeta:function(metaName,metaData)
{if(!this.meta)this.meta={};this.meta[metaName]=metaData;this.parentObj.setSaved(0);},unsetMeta:function(metaName)
{if(this.meta&&this.meta[metaName])
{delete this.meta[metaName];}
this.parentObj.setSaved(0);},getMeta:function(metaName)
{if(!this.meta)return false;return this.meta[metaName];},getAnyId:function()
{return this.choiceId||this.answerId;},getValue:function()
{return this.recodeValue||this.getAnyId();},getAutoDescription:function()
{return QualtricsCPTools.stripComments(this.text).stripTags().truncate(60);},buildOutlineSelection:function(options)
{options=options||{};var selectionObj=this;var selectionTypeClass=' '+selectionObj.objType.capitalize();var defaultChoiceClass='';var textEntryClass='';var alignClass='';var carriedForwardClass='';var id=selectionObj.id;if(selectionObj.textEntry)
{textEntryClass=' TextEntry';}
var hasImageClass='';if(selectionObj.hasImage)
{hasImageClass=' HasImage';}
if(options&&options.textEntry)
{textEntryClass=' TextEntry';}
if(selectionObj.getEdited()===0)
{defaultChoiceClass=' DefaultSelection';}
if(options&&options.align)
{alignClass=' '+options.align;}
var textDisplay=selectionObj.text;if(options&&options.seriesIndex!=undefined)
{id=id+'_'+options.seriesIndex;var textNode=QBuilder('span',{className:'BottomRight Editable Series'+selectionTypeClass,seriesindex:options.seriesIndex});textDisplay=selectionObj.series[options.seriesIndex];}
else
{textNode=QBuilder('span',{className:'BottomRight'+(options.readOnlyChoices?'':' Editable')+selectionTypeClass});}
if(selectionObj.proxie)
{carriedForwardClass=' CarriedForward';textDisplay='&rsaquo; '+textDisplay;}
textNode.innerHTML=textDisplay;QuestionTypes.Universal.makeDescendantsEditable(textNode);var choiceDiv=QBuilder('span',{className:'Selection'+carriedForwardClass+textEntryClass+hasImageClass+selectionTypeClass+defaultChoiceClass+alignClass,id:id},[QBuilder('span',{className:'TopRight'},[QBuilder('span',{className:'BottomLeft'},[textNode])])]);var questionObj=selectionObj.parentObj;var grader='';if(questionObj)
{var outlineGrader=QuestionTypes[questionObj.questionType].renderOutlineGrader;if(outlineGrader)
{grader=outlineGrader(questionObj,selectionObj.choiceId,selectionObj.answerId);}}
textNode=null;return QBuilder('div',{},[grader,choiceDiv]);},edit:function(event,seriesIndex,options)
{if(event&&Qualtrics.SearchAndReplace&&Qualtrics.SearchAndReplace.startedSearchAndReplace==true)
{Qualtrics.SearchAndReplace.currentBlock=BaseForm.getInstance().getBlockIndexByBlockId(this.parentObj.parentObj.blockId);Qualtrics.SearchAndReplace.currentQuestion=BaseForm.getInstance().getQuestionIndexByQuestionId(this.parentObj.parentObj,this.parentObj.id);if(this.objType=='choice')
{Qualtrics.SearchAndReplace.currentSearchResult={};Qualtrics.SearchAndReplace.currentSearchResult.type='choice';Qualtrics.SearchAndReplace.currentChoice=BaseForm.getInstance().getChoiceIndexByChoiceId(this.parentObj,this.id);}
else
{Qualtrics.SearchAndReplace.currentChoice=0;}
if(this.objType=='answer')
{Qualtrics.SearchAndReplace.currentSearchResult={};Qualtrics.SearchAndReplace.currentSearchResult.type='answer';Qualtrics.SearchAndReplace.currentAnswer=BaseForm.getInstance().getAnswerIndexByChoiceId(this.parentObj,this.id);}
else
{Qualtrics.SearchAndReplace.currentAnswer=0;}
Qualtrics.SearchAndReplace.currentSearchQuestionResult=null;Qualtrics.SearchAndReplace.nextSearchStartPosition=0;Qualtrics.SearchAndReplace.currentMatchPosition=0;Qualtrics.SearchAndReplace.currentMatchExists=false;Qualtrics.SearchAndReplace.removeHighlightFromWord();}
if(this.parentObj.isReadOnly())
{return false;}
if(this.parentObj.isLocked()==1)
{return false;}
if(window.QuestionActions&&!this.parentObj.selected)
{QuestionActions.select(this.parentObj);}
this.changed=false;this.frame(seriesIndex);var targetId=this.id;if(seriesIndex||seriesIndex===0)
{targetId=targetId+'_'+seriesIndex;}
else if(options&&options.useLanguage)
{targetId=targetId+'_'+options.lang;}
if(this.isDefault)
{var prevOne=this.getPrev();if(prevOne)
{var prevTwo=prevOne.getPrev();if(prevTwo)
{var prevThreeText=null;var prevThree=prevTwo.getPrev();if(prevThree)prevThreeText=prevThree.text;var nextItemInSequence=Qualtrics.findSequence(prevOne.text,prevTwo.text,prevThreeText);if(nextItemInSequence)
{this.text=nextItemInSequence;this.auto=true;}}}}
if($(targetId))
{options=Object.extend({evt:event,seriesIndex:seriesIndex},options||{});var e=new inlineEditor(this,options);return e;}
return false;},frame:function(opt_seriesIndex,opt_langCode)
{var seriesIndexSuffix='';if(opt_seriesIndex||opt_seriesIndex===0)seriesIndexSuffix='_'+opt_seriesIndex;var langSuffix='';if(opt_langCode)
{langSuffix='_'+opt_langCode;}
var node=$(this.id+langSuffix+seriesIndexSuffix);this.parentObj.frameInternalNode(node,opt_langCode);},buildInlineEditorMenuButton:function(opt_seriesIndex)
{return QBuilder('div',{className:'inlineEditorOptions',editordowncallback:'showMenu'},[QBuilder('b',{bubbleup:true},[QBuilder('b',{bubbleup:true})])]);},buildMenu:function(opt_seriesIndex)
{inlineEditor.allowClose();if(this.wasDefault)
{this.autoExcludeFromAnalysis();}
var items=[];var choiceId=this.choiceId||null;var answerId=this.answerId||null;var qType=this.parentObj.questionType;var scoring=(BaseForm.getInstance().showInlineScoring&&BaseForm.getInstance().showInlineScoring());var excludeAnalysisClass='';this.exclusiveClass='';if(this.analysis===false||(this.analysis!=null&&this.analysis[1+parseInt(opt_seriesIndex)]===false))
{excludeAnalysisClass='check';}
if(this.exclusive===true)
{this.exclusiveClass='check';}
if(opt_seriesIndex&&qType=='SBS')
{items.push({action:'BaseSelection.toggleAnalysis:'+this.id+'('+opt_seriesIndex+')',className:excludeAnalysisClass,display:getMessage('ExcludeFromAnalysis')});if(scoring&&this.meta.Selector!='TE')
{var seriesId=parseInt(opt_seriesIndex)+1;items.push({separator:1});items.push({display:getMessage('EditThreeSixtySection','Scoring'),submenu:this.parentObj.buildAutoScoreMenu(choiceId,answerId,seriesId)});}
return{items:items};}
if(this.textEntry!==null)
{var textEntryClass='';var textEntryOptionsClass='';var textEntryValidationSubMenu='BaseSelection.getTEValidationMenu:'+this.id+'()';var textEntrySizeSubMenu='BaseSelection.getTESizeMenu:'+this.id+'()';if(this.textEntry)
{textEntryClass='check';}
else
{textEntryOptionsClass='Disabled';textEntryValidationSubMenu='';textEntrySizeSubMenu='';}}
var richText=true;var textEntry=true;var graphic=true;var axisDef=this.parentObj.getAxisDef(this.axis);if(axisDef.textEntry===false)
{textEntry=false;}
if((qType=='PGR'&&(this.objType=='answer'||this.parentObj.selector!='DragAndDrop'))||qType=='MC'&&!(this.parentObj.selector.startsWith('SA')||this.parentObj.selector.startsWith('MA')))
{graphic=false;textEntry=false;richText=false;}
if(textEntry)
{var textEntryValidation={display:getMessage('TextEntryValidation'),className:'TextEntryValidation '+textEntryOptionsClass};if(textEntryValidationSubMenu)
{textEntryValidation.submenu=textEntryValidationSubMenu;}
items.push({action:'BaseSelection.toggleTextEntry:'+this.id+'('+opt_seriesIndex+')',className:textEntryClass,display:getMessage('AllowTextEntry')},{action:'',className:textEntryOptionsClass,display:getMessage('TextEntrySize'),submenu:textEntrySizeSubMenu},textEntryValidation,{separator:true});}
if(richText)
{items.push({action:'BaseSelection.showRichTextEditor:'+this.id,display:getMessage('ResultsSection','RichTextEditor')});}
var customGraphicSize=this.getMeta('GraphicSize');var sizeIsSmall=false,sizeIsMedium=false,sizeIsLarge=false,sizeIsExtraLarge=false,sizeIsCustom=false;if(customGraphicSize)
{if(customGraphicSize[0]===70&&customGraphicSize[1]===null)
{sizeIsSmall=true;}
else if(customGraphicSize[0]===150&&customGraphicSize[1]===null)
{sizeIsMedium=true;}
else if(customGraphicSize[0]===300&&customGraphicSize[1]===null)
{sizeIsLarge=true;}
else if(customGraphicSize[0]===600&&customGraphicSize[1]===null)
{sizeIsExtraLarge=true;}
else
{sizeIsCustom=true;}}
var expandThumbnailOnClick=!!this.getMeta('ExpandedGraphicSize');var disabledExpandThumbNail=!!!customGraphicSize;if(graphic)
{if(!this.imageLocation)
{items.push({action:'BaseSelection.editGraphic:'+this.id+'('+opt_seriesIndex+')',downcallback:'inlineEditor.keepEditorOpen',display:getMessage('Javascript','InsertGraphic')+'...'});}
else
{items.push({action:'BaseSelection.editGraphic:'+this.id+'('+opt_seriesIndex+')',display:getMessage('EditSection','EditGraphic')+'...'},{action:'BaseSelection.edit:'+this.id+'('+opt_seriesIndex+')',display:getMessage('EditSection','EditText')+'...'},{display:getMessage('EditSection','TextPosition'),submenu:{items:[{action:'BaseSelection.setChoiceTextPosition:'+this.id+'(Top, '+opt_seriesIndex+')',display:getMessage('SiteWide','Top')},{action:'BaseSelection.setChoiceTextPosition:'+this.id+'(Bottom, '+opt_seriesIndex+')',display:getMessage('SiteWide','Bottom')},{action:'BaseSelection.setChoiceTextPosition:'+this.id+'(Left, '+opt_seriesIndex+')',display:getMessage('SiteWide','Left')},{action:'BaseSelection.setChoiceTextPosition:'+this.id+'(Right, '+opt_seriesIndex+')',display:getMessage('SiteWide','Right')}]}},{action:'BaseSelection.removeGraphic:'+this.id+'('+opt_seriesIndex+')',className:'RemoveChoice',display:getMessage('EditSection','RemoveGraphic')},{display:getMessage('EditSection','GraphicSize'),submenu:{items:[{action:'BaseSelection.setGraphicSize:'+this.id,display:getMessage('EditSection','Original'),checked:!!!customGraphicSize,uncheckGroup:'GraphicSize',group:'GraphicSize'},{separator:true},{action:'BaseSelection.setGraphicSize:'+this.id+'(70)',display:getMessage('EditSection','Small'),checked:sizeIsSmall,uncheckGroup:'GraphicSize',group:'GraphicSize'},{action:'BaseSelection.setGraphicSize:'+this.id+'(150)',display:getMessage('EditSection','Medium'),checked:sizeIsMedium,uncheckGroup:'GraphicSize',group:'GraphicSize'},{action:'BaseSelection.setGraphicSize:'+this.id+'(300)',display:getMessage('EditSection','Large'),checked:sizeIsLarge,uncheckGroup:'GraphicSize',group:'GraphicSize'},{action:'BaseSelection.setGraphicSize:'+this.id+'(600)',display:getMessage('EditSection','ExtraLarge'),checked:sizeIsExtraLarge,uncheckGroup:'GraphicSize',group:'GraphicSize'},{action:'BaseSelection.openCustomGraphicSize:'+this.id,display:getMessage('SiteWide','Custom')+'...',checked:sizeIsCustom,uncheckGroup:'GraphicSize',group:'GraphicSize'},{separator:true},{action:'BaseSelection.toggleExpandThumbnailOnClick:'+this.id,display:getMessage('EditSection','ShowFullSizeWhenClicked'),checked:expandThumbnailOnClick,disabled:disabledExpandThumbNail}]}});}}
if(this.parentList==this.parentObj.getRecodeListType())
{if(qType!='SBS'&&axisDef.excludable!==false)
{items.push({separator:true},{action:'BaseSelection.toggleAnalysis:'+this.id+'('+opt_seriesIndex+')',className:excludeAnalysisClass,display:getMessage('ExcludeFromAnalysis')});}
if(scoring&&(qType=='SBS'||qType=='Matrix'))
{if(qType=='SBS')
{items.push({separator:1});}
items.push({display:getMessage('EditThreeSixtySection','Scoring'),submenu:this.parentObj.buildAutoScoreMenu(choiceId,answerId,null)});}
if(this.parentObj.options.answers=='MA'&&qType=='MC')
{items.push({action:'BaseSelection.toggleExclusive:'+this.id+'('+opt_seriesIndex+')',className:this.exclusiveClass,display:getMessage('MakeAnswerExclusive')});}}
if(qType=='Matrix'&&this.parentObj.selector!='Profile'&&(this.parentObj.options.answers=='MA'||(this.parentObj.options.answers=='SA'&&this.parentObj.selector=='Likert'&&this.objType=='choice')))
{items.push({action:'BaseSelection.toggleExclusive:'+this.id+'('+opt_seriesIndex+')',className:this.exclusiveClass,display:getMessage('MakeAnswerExclusive')});if(scoring)
{items.push({separator:1},{display:getMessage('EditThreeSixtySection','Scoring'),submenu:this.parentObj.buildAutoScoreMenu(choiceId,null,null)});}}
if(scoring&&qType=='SBS'&&this.objType=='choice')
{items.push({display:getMessage('EditThreeSixtySection','Scoring'),submenu:this.parentObj.buildAutoScoreMenu(choiceId,null,null)});}
items.push({submenu:'BaseSelection.getPipedTextMenu:'+this.id+'($parentMenu, $el, $menuPane)',display:getMessage('Piping','InsertPipedText')});if(this.displayLogic)
{items.push({separator:true},{action:'BaseSelection.addDisplayLogic:'+this.id+'(null, true)',className:'ChoiceDisplayLogic',display:getMessage('EditSection','EditDisplayLogic')+'...'},{action:'BaseSelection.removeDisplayLogic:'+this.id,className:'Remove',display:getMessage('EditSection','RemoveDisplayLogic')});}
else
{if(this.parentObj.hasInPageDisplayLogic())
{items.push({className:'ChoiceDisplayLogic Disabled',display:getMessage('EditSection','AddDisplayLogic')+'...'});}
else if((qType!='PGR'||this.objType=='choice')&&!axisDef.noDisplayLogic)
{items.push({action:'BaseSelection.addDisplayLogic:'+this.id+'(null, true)',className:'ChoiceDisplayLogic',display:getMessage('EditSection','AddDisplayLogic')+'...'});}}
var selectionLabel=axisDef.label||'Choice';var assignToGroup='';var parentGroupMenu='';if(this.assignGroup&&axisDef.useGroups)
{assignToGroup={className:'AssignToGroup',display:getMessage('EditSection','AssignToGroup'),submenu:'BaseSelection.getAssignToGroupMenuDef:'+this.id};parentGroupMenu=this.getParentGroupMenu();}
items.push({separator:true},assignToGroup,parentGroupMenu,parentGroupMenu?{separator:true}:'',{action:'BaseSelection.moveUp:'+this.id+'('+opt_seriesIndex+')',className:'MoveUp',display:getMessage('SiteWide','MoveUp')},{action:'BaseSelection.moveDown:'+this.id+'('+opt_seriesIndex+')',className:'MoveDown',display:getMessage('SiteWide','MoveDown')});if(axisDef.canRemove!==false)
{items.push({action:'BaseSelection.removeSelectionAndRefresh:'+this.id+'('+opt_seriesIndex+')',className:'RemoveChoice',display:getMessage('SiteWide','Remove')+' '+selectionLabel});}
this.processCustomMenu(items);if(opt_seriesIndex!=undefined)
{return{items:[{action:'BaseSelection.showRichTextEditor:'+this.id+'('+opt_seriesIndex+')',display:getMessage('ResultsSection','RichTextEditor')}]};}
if(BaseForm.getInstance().revisionId)
{var disabledClassName=' Disabled';for(var i in items)
{if(items[i].className)
{items[i].className+=disabledClassName;}
else
{items[i].className=disabledClassName;}}}
return{items:items};},addDisplayLogic:function(opt_data,opt_edit,opt_force)
{if(!this.isLocked())
{QModules.loadModule('displaylogic.js');if(this.displayLogic&&opt_edit)
{this.displayLogic.edit();}
else
{this.displayLogic=new Qualtrics.DisplayLogic(this,opt_data,opt_edit,opt_force);}
if(this.parentObj)
this.parentObj.updateDisplayLogicDependencies();}},removeDisplayLogic:function()
{if(this.isLocked()===1)
{msg(getMessage('EditSection','Locked'));return false;}
this.displayLogic=null;this.setSaved(0);this.refresh();},isLocked:function()
{if(this.parentObj&&this.parentObj.isLocked)
{return this.parentObj.isLocked();}},getPipedTextMenu:function(parentMenu,parentButton,menuPane)
{QModules.loadModule('pipedtext.js');if(Qualtrics.PipedText)
{var editor=inlineEditor.getInstance();if(editor)
{editor.keepOpen=true;menuPane.onClose=editor.allowClose.bind(editor);}
var pipedText=new Qualtrics.PipedText(parentButton,'inlineEditor.insert',{className:'PipedTextMenu',isSubmenu:true,parentMenu:parentMenu});if(pipedText)
{if(pipedText.options&&editor)
{pipedText.options.position=editor.getCaret();}
var menu=pipedText.buildMainMenu();if(this.parentObj.canCarryForward(this.parentList))
{menu.items.push({domNode:'BaseSelection.buildPipedTextCarryForwardBridge:'+this.id});}
return menu;}}
return{empty:true};},buildPipedTextCarryForwardBridge:function()
{var axisDef=this.parentObj.getAxisDef(this.parentObj.getAxis(this.parentList));var label=strToPlural(axisDef['label']).toLowerCase();return QBuilder('div',{className:'Footer CarryForwardBridge'},[QBuilder('div',{className:'Weak'},getMessage('EditSection','NotWhatYouWanted')),QBuilder('div',{className:'CarryForwardMenuItem'},[QBuilder('a',{className:' MenuItemLink',clickcallback:'BaseQuestion.addDynamicChoices:'+this.parentObj.id+'('+this.parentList+')'},[QBuilder('span',{className:'icon'}),QBuilder('span',{className:'text'},getMessage('EditSection','CarryForwardBridge',label)+'...')])])]);},getTESizeMenu:function()
{var size=this.getMeta('TextEntrySize');return{className:'TextEntrySizeMenu',items:[{id:'TextEntrySizeSmall',className:((!size||size=='Small')&&'check'),display:getMessage('EditSection','Small'),action:'BaseSelection.setTextEntrySize:'+this.id+'(Small)'},{id:'TextEntrySizeMedium',className:(size=='Medium'&&'check'),display:getMessage('EditSection','Medium'),action:'BaseSelection.setTextEntrySize:'+this.id+'(Medium)'},{id:'TextEntrySizeLarge',className:(size=='Large'&&'check'),display:getMessage('EditSection','Large'),action:'BaseSelection.setTextEntrySize:'+this.id+'(Large)'}]};},getTEValidationMenu:function()
{var frClass=(this.getMeta('TextEntryForceResponse'))?'check':'';var teVal=this.getMeta('TextEntryValidation');var items=[{id:'TextEntryForceResponse',className:frClass,display:getMessage('ForceResponse'),action:'BaseSelection.toggleTextEntryForceResponse:'+this.id+'()'},{id:'EmailValidation',className:(teVal=='ValidEmail'&&'check'),display:getMessage('ValidationTypes','ValidEmail'),action:'BaseSelection.changeTextEntryValidation:'+this.id+'(ValidEmail)'},{id:'PNValidation',className:(teVal=='USPhone'||teVal=='CAPhone'||teVal=='UKPhone'||teVal=='AUPhone'||teVal=='NZPhone'||teVal=='NLPhone')&&'check',display:getMessage('ValidationTypes','ValidPhone'),submenu:{items:[{display:getMessage('ValidationTypes','USPhone'),className:(teVal=='USPhone'&&'check'),action:'BaseSelection.changeTextEntryValidation:'+this.id+'(USPhone)'},{display:getMessage('ValidationTypes','CAPhone'),className:(teVal=='CAPhone'&&'check'),action:'BaseSelection.changeTextEntryValidation:'+this.id+'(CAPhone)'},{display:getMessage('ValidationTypes','UKPhone'),className:(teVal=='UKPhone'&&'check'),action:'BaseSelection.changeTextEntryValidation:'+this.id+'(UKPhone)'},{display:getMessage('ValidationTypes','AUPhone'),className:(teVal=='AUPhone'&&'check'),action:'BaseSelection.changeTextEntryValidation:'+this.id+'(AUPhone)'},{display:getMessage('ValidationTypes','NZPhone'),className:(teVal=='NZPhone'&&'check'),action:'BaseSelection.changeTextEntryValidation:'+this.id+'(NZPhone)'},{display:getMessage('ValidationTypes','NLPhone'),className:(teVal=='NLPhone'&&'check'),action:'BaseSelection.changeTextEntryValidation:'+this.id+'(NLPhone)'}]}},{id:'StateValidation',className:(teVal=='ValidUSState'&&'check'),display:getMessage('ValidationTypes','ValidUSState'),action:'BaseSelection.changeTextEntryValidation:'+this.id+'(ValidUSState)'},{id:'ZipValidation',className:(teVal=='USZip'||teVal=='CAZip'||teVal=='UKZip'||teVal=='AUZip'||teVal=='NZZip'||teVal=='NLZip')&&'check',display:getMessage('ValidationTypes','ValidZip'),submenu:{items:[{display:getMessage('ValidationTypes','USZip'),className:(teVal=='USZip'&&'check'),action:'BaseSelection.changeTextEntryValidation:'+this.id+'(USZip)'},{display:getMessage('ValidationTypes','CAZip'),className:(teVal=='CAZip'&&'check'),action:'BaseSelection.changeTextEntryValidation:'+this.id+'(CAZip)'},{display:getMessage('ValidationTypes','UKZip'),className:(teVal=='UKZip'&&'check'),action:'BaseSelection.changeTextEntryValidation:'+this.id+'(UKZip)'},{display:getMessage('ValidationTypes','AUZip'),className:(teVal=='AUZip'&&'check'),action:'BaseSelection.changeTextEntryValidation:'+this.id+'(AUZip)'},{display:getMessage('ValidationTypes','NZZip'),className:(teVal=='NZZip'&&'check'),action:'BaseSelection.changeTextEntryValidation:'+this.id+'(NZZip)'},{display:getMessage('ValidationTypes','NLZip'),className:(teVal=='NLZip'&&'check'),action:'BaseSelection.changeTextEntryValidation:'+this.id+'(NLZip)'}]}},{id:'DateValidation',className:(teVal=='DateWithFormat'||teVal=='DateAltFormat')&&'check',display:getMessage('ValidationTypes','ValidDate'),submenu:{items:[{htmlContent:getMessage('ValidationTypes','ValidDate')+'<span class="SubText">'+getMessage('ValidationTypes','MenuDateUS')+'</span>',action:'BaseSelection.changeTextEntryValidation:'+this.id+'(DateWithFormat)'},{htmlContent:getMessage('ValidationTypes','ValidDate')+'<span class="SubText">'+getMessage('ValidationTypes','MenuDateStd')+'</span>',action:'BaseSelection.changeTextEntryValidation:'+this.id+'(DateAltFormat)'},{htmlContent:getMessage('ValidationTypes','ValidDate')+'<span class="SubText">'+getMessage('ValidationTypes','MenuDateIntl')+'</span>',action:'BaseSelection.changeTextEntryValidation:'+this.id+'(DateIntlFormat)'}]}},{id:'NumericValidation',className:(teVal=='ValidNumber'&&'check'),display:getMessage('ValidationTypes','ValidNumber'),action:'BaseSelection.changeTextEntryValidation:'+this.id+'(ValidNumber)'},{id:'TextValidation',className:(teVal=='ValidTextOnly'&&'check'),htmlContent:getMessage('ValidationTypes','MenuTextOnly')+'<span class="SubText">'+' '+getMessage('ValidationTypes','MenuTextOnlySub')+'</span>',action:'BaseSelection.changeTextEntryValidation:'+this.id+'(ValidTextOnly)'}];return{className:'TextEntryValidationMenu',items:items};},processCustomMenu:function(menuArray)
{},hasCustomClass:function(customClass,opt_returnString)
{if(this.customClasses&&this.customClasses.indexOf(customClass)!=-1)
{return opt_returnString||true;}
if(opt_returnString)
{return'';}
return false;},toggleCustomClass:function(customClass)
{this.customClasses=this.customClasses||[];var index=this.customClasses.indexOf(customClass);if(index==-1)
{this.customClasses.push(customClass);}
else
{this.customClasses.splice(index,1);}
this.onChange();},setChoiceTextPosition:function(position,seriesIndex)
{if(this.parentObj.isLocked()==1)
{return false;}
var listType=this.objType;this.parentObj[listType+'TextPosition']=position;this.parentObj.refreshCanvas();this.onChange();},setGraphicSize:function(opt_width,opt_height)
{if(this.parentObj.isLocked()==1)
{return false;}
if(opt_width||opt_height)
{var size=[null,null];if(opt_width!==undefined)
{size[0]=Number(opt_width);}
if(opt_height!==undefined)
{size[1]=Number(opt_height);}
this.setMeta('GraphicSize',size);}
else
{this.unsetMeta('GraphicSize');this.unsetMeta('ExpandedGraphicSize');}
this.parentObj.refreshCanvas();this.onChange();},openCustomGraphicSize:function()
{var win=new Q_Window({width:200,id:'CustomGraphicWindow',title:getMessage('EditSection','GraphicSize'),buttons:['cancel','save:BaseSelection.saveCustomGraphicSize:'+this.id]});win.setContent(this.buildCustomGraphicSizeContent());},buildCustomGraphicSizeContent:function()
{var prompt=getMessage('SiteWide','Auto');var width=prompt;var height=prompt;var customSize=this.getMeta('GraphicSize');var widthInputClass=' AutoClearMessage';var heightInputClass=' AutoClearMessage';if(customSize)
{if(customSize[0])
{width=customSize[0];widthInputClass=' HasValue';}
if(customSize[1])
{height=customSize[1];heightInputClass=' HasValue';}}
return QBuilder('div',{},[QBuilder('div',{},[QBuilder('label',{},getMessage('DistributeSection','Width')),QBuilder('span',null,' '),QBuilder('input',{type:'text',id:'CustomGraphicWidth',validation:'Number',autoclear:prompt,className:'TextBox'+widthInputClass,value:width})]),QBuilder('div',{},[QBuilder('label',{},getMessage('DistributeSection','Height')),QBuilder('span',null,' '),QBuilder('input',{type:'text',id:'CustomGraphicHeight',validation:'Number',autoclear:prompt,className:'TextBox'+heightInputClass,value:height})])]);},saveCustomGraphicSize:function()
{if(!$('CustomGraphicWidth')||!$('CustomGraphicHeight'))
{return;}
var customWidth=$F('CustomGraphicWidth');var customHeight=$F('CustomGraphicHeight');if(customWidth==''||$('CustomGraphicWidth').getAttribute('autoclear')==customWidth)
{customWidth=undefined;}
if(customHeight==''||$('CustomGraphicHeight').getAttribute('autoclear')==customHeight)
{customHeight=undefined;}
if(customWidth||customHeight)
{this.setGraphicSize(customWidth,customHeight);}
Q_Window.closeWindow('CustomGraphicWindow');},toggleExpandThumbnailOnClick:function(seriesIndex)
{if(this.parentObj.isLocked()==1)
{return false;}
if(this.getMeta('ExpandedGraphicSize'))
{this.unsetMeta('ExpandedGraphicSize');}
else
{this.setMeta('ExpandedGraphicSize',[null,null]);}
this.parentObj.refreshCanvas();this.onChange();return true;},showRichTextEditor:function(opt_seriesIndex,opt_lang)
{var seriesId=inlineEditor.seriesId;var lang=inlineEditor.lang;var originalText=this.text;inlineEditor.clear();var choice=this.getText(opt_seriesIndex);var that=this;new EditorPopup({title:'Choice Text',contents:choice,width:700,height:400,seriesIndex:opt_seriesIndex,saveCallBack:function(val,editorPopup)
{var seriesIndex;if(editorPopup.options&&editorPopup.options.seriesIndex)
{seriesIndex=editorPopup.options.seriesIndex;}
that.isDefault=false;that.setText(val,seriesIndex);that.edited=true;that.setSaved(0);var options={};if(opt_lang)
{options.lang=opt_lang;}
that.parentObj.refreshCanvas(options);var questionId=that.parentObj.id;var selectionId=that.id;if(originalText!=that.text)
{that.storeUndo(questionId,selectionId,originalText,that.text,seriesId,lang);}}});},toggleTextEntry:function()
{if(this.parentObj.isLocked())
{return false;}
this.textEntry=!this.textEntry;this.parentObj.refreshQuestion();this.onChange();},toggleTextEntryForceResponse:function()
{if(this.parentObj.isLocked())
{return false;}
this.setMeta('TextEntryForceResponse',!this.getMeta('TextEntryForceResponse'));this.parentObj.refreshQuestion();this.onChange();},setTextEntrySize:function(size)
{if(this.parentObj.isLocked())
{return false;}
if(this.getMeta('TextEntrySize')==size)
{this.setMeta('TextEntrySize',null);}
else
{this.setMeta('TextEntrySize',size);}
this.parentObj.refreshQuestion();this.onChange();},changeTextEntryValidation:function(type)
{if(this.parentObj.isLocked())
{return false;}
if(this.getMeta('TextEntryValidation')==type)
this.setMeta('TextEntryValidation',null);else
this.setMeta('TextEntryValidation',type);this.parentObj.refreshQuestion();this.onChange();},editGraphic:function()
{if(this.parentObj.isLocked())
{return false;}
QModules.loadModule('librarymanager.js');var that=this;new Qualtrics.QGraphicsManager({onSelectWithDimensions:function(url,graphicId,description,version,dims){try
{if(!that.edited)
{that.text='';}
that.imageLocation=graphicId;that.hasImage=1;that.imageDisplay=description;if(dims&&dims['width']>600)
{that.setGraphicSize(600);}
else
{that.setGraphicSize();}
that.parentObj.refreshCanvas();that.parentObj.setSaved(0);inlineEditor.allowClose();inlineEditor.clear();}
catch(e)
{console.error(e);}},onClose:function()
{var editor=inlineEditor.getInstance();if(editor)
{if(editor.isEmpty())
{that.revert();}
editor.allowClose();editor.removeInlineEditor();}}});},removeGraphic:function()
{if(this.parentObj.isLocked())
{return false;}
this.imageLocation=null;this.hasImage=null;this.imageDisplay=null;this.parentObj.refreshCanvas();this.parentObj.setEdited(1);window.QuestionTopCache={};this.onEmpty();},toggleAnalysis:function(opt_seriesIndex)
{if(this.parentObj.isLocked())
{return false;}
if(opt_seriesIndex)
{if(typeof this.analysis!='object'||this.analysis==null)
this.analysis={};var seriesAnalysis=this.analysis[1+parseInt(opt_seriesIndex)];if(seriesAnalysis===null||seriesAnalysis===undefined)seriesAnalysis=true;seriesAnalysis=!seriesAnalysis;this.analysis[1+parseInt(opt_seriesIndex)]=seriesAnalysis;}
else
{if(this.analysis===null)this.analysis=true;this.analysis=!this.analysis;}
this.parentObj.refreshCanvas();this.onChange();},toggleExclusive:function()
{if(this.parentObj.isLocked())
{return false;}
if(this.exclusive===null)this.exclusive=false;this.exclusive=!this.exclusive;this.parentObj.refreshCanvas();this.onChange();},moveUp:function(opt_seriesIndex)
{this.move(-1,opt_seriesIndex);},moveDown:function(opt_seriesIndex)
{this.move(1,opt_seriesIndex);},move:function(delta,opt_seriesIndex)
{if(this.parentObj.isLocked())
{return false;}
QMenu.keepMenuOpen();if(this.parentObj.choiceGroupOrder&&(opt_seriesIndex===undefined||opt_seriesIndex===null))
{if(this.parentGroupId)
{var parentGroup=this.parentObj.choiceGroups[this.parentGroupId];if(parentGroup)
{parentGroup.moveChoiceGroupItem(this.getSystemId(),delta);}}
else
{this.parentObj.moveChoiceGroupItem(this.getSystemId(),delta);}
return;}
var target=this.getSibling(delta,true);var parentList=this.parentList;if(target)
{var pos=this.getPosition();var targetPos=target.getPosition();this.parentObj[parentList].splice(pos,1);target.parentObj[parentList].splice(targetPos,0,this);}
var idMap=this.parentObj.resetSelectionIdsIfNoResponses(this.parentList);var type='ChoiceID';if(this.hasOwnProperty('answerId')&&this.answerId!==null)
{type='AnswerID';}
this.parentObj.updateGradingData(type,idMap);this.parentObj.refreshCanvas();this.edit(null,opt_seriesIndex);this.onChange();},remove:function()
{this.removeSelection();this.parentObj.refreshDependencies();},removeSelectionAndRefresh:function()
{var undoPkg=this.parentObj.getUndoPkg();this.removeSelection();this.refresh();this.parentObj.refreshDependencies();Toolbox.getInstance().update();this.parentObj.addUndo(undoPkg,this.parentObj.getUndoPkg());var baseForm=BaseForm.getInstance();if(baseForm)
{baseForm.blowDisplayLogicCache();}},refresh:function()
{this.parentObj.refreshCanvas();},renderText:function()
{return'hidere';},getImageHtml:function(elementID)
{var serverId=Qualtrics.System.serverId||'';var imageLocation=this.imageLocation;var graphicSize=this.getMeta('GraphicSize');var expandThumbnailOnClick=!!this.getMeta('ExpandThumbnailOnClick');var src=imageLocation;if(imageLocation.substr(0,3)=='IM_')
{src="Graphic.php?SR="+serverId+"&IM="+imageLocation;if(graphicSize)
{src+='&thumb=true';if(graphicSize[0])
{src+='&width='+graphicSize[0];}
if(graphicSize[1])
{src+='&height='+graphicSize[1];}}}
srcTag="src='"+src+"'";var graphic="<img border='0' "+srcTag+" selectionimage='true' ";if(elementID)
{graphic+=" id='"+elementID+"' ";}
graphic+="/>";return graphic;},getPosition:function()
{var pos=null;for(var i=0,len=this.parentObj[this.parentList].length;i<len;++i)
{var c=this.parentObj[this.parentList][i];if(this.id==c.id){pos=i;return pos;}}
return pos;},getSibling:function(delta)
{var sibling=this.parentObj[this.parentList][this.getPosition()+delta];if(sibling)
{return sibling;}
return false;},getPrev:function(opt_seriesIndex)
{if(opt_seriesIndex!=undefined&&this.series)
{return this.getPrevSeries(opt_seriesIndex);}
var prevChoice=this.parentObj[this.parentList][this.getPosition()-1];if(prevChoice)
{return prevChoice;}
return false;},getNext:function(opt_seriesIndex)
{if(opt_seriesIndex!=undefined&&this.series)
{return this.getNextSeries(opt_seriesIndex);}
var nextSelection=this.parentObj[this.parentList][this.getPosition()+1];if(nextSelection)
{return nextSelection;}
return false;},getNextSeries:function(seriesIndex)
{if(this.series[Number(seriesIndex)+1]!==undefined)
{return new SelectionSeriesIndexMapper(this,Number(seriesIndex)+1);}
else
{if(this.getNext()&&this.getNext().series[0]!==undefined)
{return new SelectionSeriesIndexMapper(this.getNext(),0);}}
return false;},getPrevSeries:function(seriesIndex)
{if(this.series[Number(seriesIndex)-1]!==undefined)
{return new SelectionSeriesIndexMapper(this,Number(seriesIndex)-1);}
else
{var prev=this.getPrev();if(prev&&prev.series[prev.series.length-1]!==undefined)
{return new SelectionSeriesIndexMapper(prev,prev.series.length-1);}}
return false;},removeSelection:function()
{if(this.parentObj.isLocked())
{return false;}
this.onChange();var pos=this.getPosition();if(this.parentObj.choiceGroups&&this.unassignGroup)
{this.unassignGroup();}
if(this.parentObj[this.parentList][pos]&&(this.parentObj[this.parentList][pos].id==this.id))
{if(!this.isDefault||this.fromTrash)
{this.parentObj[this.parentList+'Trash'].push(this);}
this.parentObj[this.parentList].splice(pos,1);}
var idMapping=this.parentObj.resetSelectionIdsIfNoResponses(this.parentList);this.parentObj.setEdited();var property='ChoiceID';if(this.hasOwnProperty('answerId')&&this.answerId!==null)
{property='AnswerID';}
this.parentObj.updateGradingData(property,idMapping,this);if(this.parentObj.autoResponseScalesY!==null)
{for(var i=0,len=this.parentObj.choices.length;i<len;i++)
{this.setSelectionEdited(i,true);}}
var q=this.parentObj;if(q.scoreAll&&q.canScore())
{q.scoreAll();}
this.parentObj.changeToDBifMC();},setSelectionEdited:function(selectionIndex,edited)
{if(typeof selectionIndex==='number'&&typeof edited==='boolean')
{if(selectionIndex<this.parentObj.choices.length)
{this.parentObj.choices[selectionIndex].edited=edited;}}},isEmpty:function()
{if(this.text.stripTags().length===0)
{if(!this.hasImage)
{return true;}}
return false;},onEmpty:function(seriesIndex)
{if(seriesIndex!==undefined&&seriesIndex!==null)
{if(this.series&&this.series[seriesIndex].stripTags().length===0)
{if(this.series[seriesIndex]!==undefined)
{var isBipolar=this.parentObj&&this.parentObj.questionType&&this.parentObj.questionType=='Matrix'&&this.parentObj.selector=='Bipolar';if(isBipolar)
{this.series[seriesIndex]=('Click to enter text');return;}
this.series.splice(seriesIndex,1);this.parentObj.refreshCanvas();}
else
{console.log('not real series');}}
return;}
if(this.isEmpty())
{if(BaseForm.getInstance().responses>0)
{var plural='';if(BaseForm.getInstance().responses>1)
{plural='s';}
if(!confirm('This survey has '+BaseForm.getInstance().responses+' response'+plural+'.\n Are you sure you want to delete this choice?'))
{this.revert();return;}}
this.removeSelectionAndRefresh();}},getInner:function(seriesIndex,lang,opt_useLanguage)
{var parentNode=null;var targetId=this.id;if(seriesIndex||seriesIndex===0)
{targetId=targetId+'_'+seriesIndex;}
else if(opt_useLanguage)
{targetId=targetId+'_'+lang;}
parentNode=$(targetId);if(!parentNode)
parentNode=$(targetId+'_'+lang);if(parentNode)
{return QualtricsTools.fastDown(parentNode,'Editable');}},onType:function()
{this.onChange();},onChange:function()
{this.changed=true;this.removeDefaultState();if(this.auto)
{var axis=this.parentObj.getAxis(this.parentList);if(this.parentObj.hasAutoScale(axis))
{this.parentObj['autoResponseScales'+axis].active=false;for(var i=0,len=this.parentObj[this.parentList].length;i<len;++i)
{this.parentObj[this.parentList][i].removeDefaultState();}
Toolbox.getInstance().render();}}
this.parentObj.setSaved(0);},removeDefaultState:function()
{if(this.isDefault)
{if($(this.id))
{$(this.id).removeClassName('DefaultSelection');}
this.isDefault=0;}
if(this.assumed)
{if($(this.id))
{$(this.id).removeClassName('Assumed');}
this.assumed=0;}
BaseForm.getInstance().blowDisplayLogicCache();this.parentObj.setSaved(0);},_afterEdit:function(inlineEditor)
{if(this.getInner(inlineEditor.seriesIndex,inlineEditor.lang))
{if(this.parentObj.getPreviewMode())
{this.getInner(inlineEditor.seriesIndex,inlineEditor.lang).innerHTML=this.parentObj.getSelectionDisplay(this,inlineEditor.seriesIndex,inlineEditor.lang);}
if(this.parentObj.setSmartResponseScale&&this.getPosition()==0)
{this.parentObj.setSmartResponseScale(this.parentObj.getAxis(this.parentList),this.text);}
if(this.autoExcludeFromAnalysis&&this.wasDefault)
{this.autoExcludeFromAnalysis();}
QuestionTypes.Universal.makeDescendantsEditable(this.getInner(inlineEditor.seriesIndex,inlineEditor.lang));inlineEditor.updateEditorWidth();inlineEditor.checkPositionShift();this.parentObj.refreshDependencies();this.wasDefault=this.isDefault;if(this.changed)
{BaseForm.getInstance().setSpellChecked(0);}
if(this.imageLocation)
{this.parentObj.refreshCanvas({lang:inlineEditor.lang});}
var axisDef=this.parentObj.getAxisDef(this.axis);if(axisDef&&axisDef.refreshAfterEdit)
{this.parentObj.refreshCanvas({lang:inlineEditor.lang});}
var questionId=this.parentObj.id;var selectionId=this.id;if(this.originalText!=this.text)
{this.storeUndo(questionId,selectionId,this.originalText,this.text,inlineEditor.seriesId,inlineEditor.lang);}}},storeUndo:function(questionId,selectionId,originalText,newText,seriesId,lang)
{Qualtrics.History.getInstance().addAction('Set Selection Text',{action:'BaseQuestion.setSelectionText',instanceId:questionId,parameters:[selectionId,originalText,seriesId,lang,true]},{action:'BaseQuestion.setSelectionText',instanceId:questionId,parameters:[selectionId,newText,seriesId,lang,true]});},autoExcludeFromAnalysis:function()
{if(this.parentObj.isLocked())
{return false;}
if(this.parentList!=this.parentObj.getRecodeListType())
{return;}
var exList=['none of the above','na','n/a','not applicable',"i don't know","don't know"];for(var i=0,len=exList.length;i<len;++i)
{if(this.text.toLowerCase()==exList[i])
{this.analysis=false;this.parentObj.refreshCanvas();}}},parse:function(text,opt_seriesIndex,opt_lang)
{if(this.parentObj.isLocked())
{return false;}
if(opt_seriesIndex||opt_seriesIndex===0)
{return this.parseSeries(text,opt_seriesIndex,opt_lang);}
var lines=text.split(/[\n\r]+/g);if(lines.length>1)
{var selectionObj=this;var selectionType=selectionObj.objType;var questionObj=selectionObj.parentObj;var listType=(selectionType=='choice')?'choices':'answers';var property=(selectionType=='choice')?'ChoiceID':'AnswerID';var position=selectionObj.getPosition();var editor=inlineEditor.getInstance();var defaultLanguage=BaseForm.getInstance().defaultLanguage;if(editor)
{editor.removeInlineEditor();}
if(opt_lang&&opt_lang!=defaultLanguage&&selectionObj.languages[opt_lang])
{delete selectionObj.languages[opt_lang];}
else
{selectionObj.removeSelection();}
for(var i=0,len=lines.length;i<len;++i)
{if(lines[i])
{if(opt_lang&&opt_lang!=defaultLanguage)
{if(this.parentObj[listType][position+i])
{this.parentObj[listType][position+i].setText(lines[i],null,opt_lang);}}
else
{var newSelection=this.parentObj.addSelection(listType,lines[i],position);if(newSelection)
newSelection.setEdited(1);position++;}}}
var idMap=questionObj.resetSelectionIdsIfNoResponses(listType);questionObj.updateGradingData(property,idMap);questionObj.refreshCanvas({lang:opt_lang});if(window.Toolbox)Toolbox.getInstance().update();if(newSelection)
newSelection.edit();return true;}
return false;},parseSeries:function(text,position,opt_lang)
{var lines=text.split('\n');var defaultLanguage=BaseForm.getInstance().defaultLanguage;if(lines.length>1)
{var editor=inlineEditor.getInstance();if(editor)
{editor.removeInlineEditor();}
this.series.splice(position,1);for(var i=0,len=lines.length;i<len;++i)
{if(opt_lang&&opt_lang!=defaultLanguage)
{this.setText(lines[i],position,opt_lang);}
else
{if(lines[i])
{this.series.splice(position,0,lines[i]);}}
position++;}
this.parentObj.refreshCanvas({lang:opt_lang});this.edit(null,position-1);return true;}
return false;},deleteSelectionIfEmpty:function(editor,evt)
{if(this.parentObj.isLocked())
{return false;}
if(editor.getValue().length<1)
{if(editor.repeatCount<2)
{var selection=editor.parentObj;if(selection&&selection.hasImage)
{return;}
Event.stop(evt);var prev=editor.parentObj.getPrev(editor.seriesIndex);editor.removeInlineEditor();if(prev)
{prev.edit();}
return false;}}},onEnter:function(editor,evt)
{if(this.parentObj.isLocked())
{return false;}
editor.updateText(editor.getValue());if(evt.shiftKey)
{var axis=this.parentObj.getAxisDef(this.parentObj.getAxis(this.parentList));if(axis&&axis.useGroups)
{var position=null;if(this.parentGroupId)
{var parentGroup=this.parentObj.choiceGroups[this.parentGroupId];if(parentGroup)
{position=parentGroup.getPosition()+1;}}
var group=this.parentObj.createNewChoiceGroup(null,position);this.parentObj.refreshCanvas();group.edit({lang:editor.lang});return;}}
var isBipolar=this.parentObj&&this.parentObj.questionType&&this.parentObj.questionType=='Matrix'&&this.parentObj.selector=='Bipolar';if(editor.seriesIndex!==null)
{if(!isBipolar)
{this.series.splice(Number(editor.seriesIndex)+1,0,'Enter Text here');this.parentObj.refreshCanvas();}
var nextSeries=this.getNext(editor.seriesIndex);if(nextSeries)
{nextSeries.edit(null,null,{select:true,lang:this.lang});}
else
{editor.removeInlineEditor();if(this.insertBelow)
{var choiceObj=this.insertBelow();if(choiceObj)
{choiceObj.edit(null,0,{lang:editor.lang});}}}
return;}
else
{var next=this.getNext&&this.getNext();if(next)
{if(next.getEdited()||next.auto)
{editor.removeInlineEditor();this.insertBelow&&this.insertBelow({lang:editor.lang});}
else
{editor.removeInlineEditor();next.edit(undefined,undefined,{lang:editor.lang});}}
else
{editor.removeInlineEditor();this.insertBelow&&this.insertBelow({lang:editor.lang});}}
if(evt)Event.stop(evt);return false;},getClasses:function()
{var classes='';if(this.isDefault)
{classes+=' DefaultSelection';}
if(this.auto)
{classes+=' AutoSelection';}
if(this.assumed)
{classes+=' Assumed';}
return classes;}});window.Choice=Class.create(BaseSelection,{objType:'choice',parentList:'choices',axis:'y',getPrevGroup:function()
{if(this.parentObj.answers.length>0)
{var lastSelection=this.parentObj.answers.last();if(lastSelection.series&&lastSelection.series.length)
{return new SelectionSeriesIndexMapper(lastSelection,lastSelection.series.length-1);}
return this.parentObj.answers[this.parentObj.answers.length-1];}
else
{return this.parentObj.getQuestionTextObj();}},getNextGroup:function()
{var nextQuestion=this.parentObj.getNext(true,true);if(nextQuestion)
{return nextQuestion.getFirstEditable();}
return null;},getRight:function()
{if(this.parentObj.answers.length>0)
{return this.parentObj.answers[0];}},insertBelow:function(options)
{var pos=this.getPosition();if(pos!==null)
{var choiceObj=this.parentObj.addChoiceAndRender(null,pos+1,this.parentGroupId);choiceObj.edit(undefined,undefined,options);return choiceObj;}}});window.Answer=Class.create(BaseSelection,{objType:'answer',parentList:'answers',textEntry:null,axis:'x',buildInlineEditorMenuButton:function(opt_seriesIndex)
{return QBuilder('div',{className:'inlineEditorOptions',editordowncallback:'showMenu'},[QBuilder('b',{bubbleup:true},[QBuilder('b',{bubbleup:true})])]);},getPrevGroup:function(opt_seriesIndex)
{if(opt_seriesIndex!=null)
{var lastSelection=this.parentObj[this.parentList].last();if(lastSelection)
{return lastSelection;}}
return this.parentObj.getQuestionTextObj();},getNextGroup:function(opt_seriesIndex)
{if(opt_seriesIndex==null)
{var firstSelection=this.parentObj[this.parentList][0];if(firstSelection.series&&firstSelection.series.length)
{return new SelectionSeriesIndexMapper(firstSelection,0);}}
if(this.parentObj.choices.length>0)
{return this.parentObj.choices[0];}
else
{return null;}},getLeft:function()
{if($(this.id)&&$(this.id).offsetLeft<5){if(this.parentObj.choices.length>0)
{return this.parentObj.choices[0];}}
else
{return this.getPrev();}},getRight:function()
{return this.getNext();},insertBelow:function(options)
{var pos=this.getPosition();if(pos!==null)
{var answerObj=this.parentObj.addAnswerAndRender(null,pos+1);answerObj.edit(null,null,options);return answerObj;}}});window.ColumnLabel=Class.create(BaseSelection,{objType:'columnLabel',parentList:'columnLabels',spinner:'ColumnLabelsCounter',textEntry:null,axis:'x',isLabelDefault:true,keyMap:{enter:'onEnter',backspace:'onBackSpace'},initialize:function($super,text,seriesIndex,languages)
{$super(text);this.seriesIndex=seriesIndex;this.columnLabelIndex=seriesIndex;this.languages=languages;},setEdited:function()
{this.isLabelDefault=false;},isDefaultLabel:function()
{return this.isLabelDefault;},setIsDefaultLabel:function(val)
{this.isLabelDefault=!!val;},buildInlineEditorMenuButton:function(opt_seriesIndex)
{return QBuilder('div',{className:'inlineEditorOptions',editordowncallback:'showMenu'},[QBuilder('b',{bubbleup:true},[QBuilder('b',{bubbleup:true})])]);},buildMenu:function(opt_seriesIndex)
{return{items:[{action:'BaseSelection.showRichTextEditor:'+this.id+'(,'+this.language+')',display:getMessage('ResultsSection','RichTextEditor')}]};},getLeft:function()
{if($(this.id)&&$(this.id).offsetLeft<5){if(this.parentObj.answers.length>0)
{return this.parentObj.answers[0];}}
else
{return this.getPrev();}},getRight:function()
{return this.getNext();},insertBelow:function(options)
{var pos=this.getPosition();if(pos!==null)
{var newText=getMessage('EditSection','DefaultLabel',''+(pos+2));var columnLabelObj=this.parentObj.addColumnLabelAndRender(newText,pos+1);columnLabelObj.edit(null,null,options);$(this.spinner+'_Spinner').value=this.parentObj.options.ColumnLabelsCounter;return columnLabelObj;}},buildOutlineSelection:function(options)
{if(options&&options.lang&&options.lang!=BaseForm.getInstance().defaultLanguage)
{this.translation=true;this.language=options.lang;return QBuilder('label',{id:this.id+'_'+options.lang,className:'Selection ColumnLabel',objtype:'ColumnLabel'},[QBuilder('span',{className:'Editable',clickcallback:'BaseQuestion.editColumnLabel',language:options.lang,instanceid:this.parentObj.id,p1:'$evt',p2:this.id,p3:'',p4:options.lang},this.getText(options.seriesIndex,options.lang))]);}
else if(Qualtrics.Navigation.subSection=='Translate'||Qualtrics.Navigation.subSection=='TranslateBlock')
{return QBuilder('label',{id:this.id,className:'Selection ColumnLabel',objtype:'ColumnLabel'},[QBuilder('span',{className:''},this.text)]);}
else if(Survey.getInstance().defaultPreviewMode==0)
{return QBuilder('span',{id:this.id,className:'Selection ColumnLabel',objtype:'ColumnLabel'},[QBuilder('span',{className:'TopRight'},[QBuilder('span',{className:'BottomLeft'},[QBuilder('span',{className:'BottomRight Editable ColumnLabel',clickcallback:'BaseQuestion.editColumnLabel',language:options.lang,instanceid:this.parentObj.id,p1:'$evt',p2:this.id,p3:'',p4:options.lang},[this.getText(options.seriesIndex,options.lang)])])])]);}
else if(Qualtrics.Navigation.subSection=='Blocks')
{return QBuilder('label',{id:this.id,className:'Selection ColumnLabel',objtype:'ColumnLabel'},[QBuilder('span',{className:'Editable',clickcallback:'BaseQuestion.editColumnLabel',language:options.lang,instanceid:this.parentObj.id,p1:'$evt',p2:this.id,p3:'',p4:options.lang},this.getText(options.seriesIndex,options.lang))]);}},getColumnLabelIndex:function()
{return this.columnLabelIndex;},onEnter:function(editor,evt)
{var totalColumnLabels=this.parentObj.options.ColumnLabelsCounter;var empty=editor.isEmpty();editor.removeInlineEditor();if(empty)
return;if(this.columnLabelIndex==(totalColumnLabels-1))
{var maxValue=QuestionTypes[this.parentObj.questionType]['questionOptions']['sections']['ColumnLabelsCounter']['maxValue'];if(totalColumnLabels>=maxValue)
return;this.parentObj.addColumnLabelAndRender();var selection=this.parentObj.getColumnLabelById(this.columnLabelIndex+1);selection.edit(evt,null,{lang:editor.lang});}
if(!evt)evt=window.event;Event.stop(evt);},onBackSpace:function(editor,evt)
{if(editor.isEmpty())
{editor.removeInlineEditor();var selection=this.parentObj.getColumnLabelById(this.columnLabelIndex-1);if(selection)
selection.edit(evt,null,{lang:editor.lang});if(!evt)evt=window.event;Event.stop(evt);}}});window.SelectionPostPackagers={Matrix:{Profile:function(choices)
{var pkg={};pkg['Answers']={};for(var i=0,len=choices.length;i<len;++i)
{if(choices[i].choiceId)
{pkg['Answers'][choices[i].choiceId]={};if(choices[i].series)
{for(var seriesIndex=0,seriesLen=choices[i].series.length;seriesIndex<seriesLen;++seriesIndex)
{if(choices[i].series[seriesIndex])
{pkg['Answers'][choices[i].choiceId][seriesIndex+1]={Display:choices[i].series[seriesIndex]};}}}}}
return pkg;},Bipolar:function(choices)
{var pkg={};pkg['Choices']={};pkg['Answers']={};for(var i=0,len=choices.length;i<len;++i)
{var choiceObj=choices[i];if(choiceObj.series)
{if(choiceObj.series[0]===undefined)choiceObj.series[0]='';if(choiceObj.series[1]===undefined)choiceObj.series[1]='';choiceObj.text=choiceObj.series[0].replace(/\\/g,'\\\\').replace(/:/g,'\\:')+':'+choiceObj.series[1].replace(/\\/g,'\\\\').replace(/:/g,'\\:');pkg['Choices'][choiceObj.choiceId]={Display:choiceObj.text};}}
return pkg;}},GAP:function(choices)
{var pkg={};pkg['Choices']={};for(var i=0,len=choices.length;i<len;++i)
{var choiceObj=choices[i];if(choiceObj.choiceId!==undefined)
{var GapWhy=[];if(choiceObj.series)
{for(var j=0,seriesLen=choiceObj.series.length;j<seriesLen;++j)
{var whyEntry='';if(choiceObj.series[j]&&choiceObj.series[j]!=' ')
{whyEntry=choiceObj.series[j];}
GapWhy.push(whyEntry);}}
pkg['Choices'][choiceObj.choiceId]={GapWhy:GapWhy};}}
return pkg;},CS:function(choices,answers)
{var pkg={};pkg['Labels']={};if(answers)
{for(var i=0,len=answers.length;i<len;++i)
{if(answers[i].answerId)
pkg['Labels'][answers[i].answerId]={Display:answers[i].text};}}
return pkg;},Slider:function(choices,answers,question)
{var pkg={};pkg['Labels']={};if(answers)
{for(var i=0,len=answers.length;i<len;++i)
{if(answers[i].answerId)
pkg['Labels'][answers[i].answerId]={Display:answers[i].text};}}
if(question&&question.options&&question.options['NotApplicable']){pkg['Labels']['NA']={Display:question.options['NotApplicableText']||getMessage('QuestionText','NotApplicable')};}
if(choices[0]&&choices[0].parentObj&&choices[0].parentObj.options.SnapToGrid)
{pkg['Answers']={};var questionObj=choices[0].parentObj;var gridStep=(questionObj.options.CSSliderMax-questionObj.options.CSSliderMin)/questionObj.options.GridLines;for(var j=1;j<=questionObj.options.GridLines+1;j++)
{pkg['Answers'][j]={Display:questionObj.options.CSSliderMin+Math.round((j-1)*gridStep)};}}
return pkg;},PGR:function(choices,answers)
{var pkg={};pkg['Answers']={};pkg['Groups']={};if(answers)
{for(var i=0,len=answers.length;i<len;++i)
{pkg['Groups'][i]=answers[i].text;}}
return pkg;},SBS:function(choices,answers,opt_questionObj)
{var pkg={};pkg['Answers']={};var answersArray=answers;pkg['AdditionalQuestions']={};for(i=0;i<answersArray.length;i++)
{var answer=answersArray[i];var seriesAnswers={};var recodeValues={};var variableNaming={};var analysis={};if(answer.series)
{for(var j=0;j<answer.series.length;j++)
{var seriesAnswer={};seriesAnswer.Display=answer.series[j];seriesAnswers[j+1]=seriesAnswer;if(answer.recodeValues)
recodeValues[j+1]=answer.recodeValues[j];if(answer.variableNaming)
variableNaming[j+1]=answer.variableNaming[j];if(answer.analysis)
{if(answer.analysis[j+1]==false)
analysis[j+1]='No';else if(answer.analysis[j+1]==true)
analysis[j+1]='on';}}}
var meta=answer.meta;var newAdditionalQuestion={QuestionText:answer.text,Answers:seriesAnswers,RecodeValues:recodeValues,VariableNaming:variableNaming};if(analysis)
newAdditionalQuestion['AnalyzeChoices']=analysis;if(answer.displayLogic)
{newAdditionalQuestion['DisplayLogic']=answer.displayLogic.getData();}
if(answer.answerDataExportTag)
{newAdditionalQuestion['AnswerDataExportTag']=answer.answerDataExportTag;}
if(answer.defaultChoices)
{newAdditionalQuestion['DefaultChoices']=answer.defaultChoices;}
if(meta)
{newAdditionalQuestion['QuestionType']=meta.QuestionType;newAdditionalQuestion['Selector']=meta.Selector;newAdditionalQuestion['SubSelector']=meta.SubSelector;newAdditionalQuestion['ChoiceColumnWidthPixels']=null;if(meta.choicesWidthPixels)
{if(!newAdditionalQuestion['Configuration'])newAdditionalQuestion['Configuration']={};newAdditionalQuestion['Configuration']['ChoiceColumnWidthPixels']=meta.choicesWidthPixels;}
newAdditionalQuestion['Validation']=meta.Validation;if(meta.GraphicSize){newAdditionalQuestion['GraphicSize']=meta.GraphicSize;}
if(meta.ExpandedGraphicSize){newAdditionalQuestion['ExpandedGraphicSize']=meta.ExpandedGraphicSize;}}
if(answer.hasImage)
{newAdditionalQuestion['HasImage']=answer.hasImage;newAdditionalQuestion['ImageDisplay']=answer.imageDisplay;newAdditionalQuestion['ImageLocation']=answer.imageLocation;}
pkg['AdditionalQuestions'][i+1]=newAdditionalQuestion;}
pkg['NumberOfQuestions']=answersArray.length;if(opt_questionObj&&opt_questionObj.gradingData)
{for(var i=0,len=opt_questionObj.gradingData.length;i<len;i++)
{var scoring=opt_questionObj.gradingData[i];var additionalQuestionId=parseInt(scoring.AnswerID);var newAnswerId=scoring.SeriesID;var additionalQuestion=pkg['AdditionalQuestions'][additionalQuestionId];if(!additionalQuestion.GradingData)
{additionalQuestion.GradingData=[];}
var index=additionalQuestion.GradingData.length;additionalQuestion.GradingData.push({AnswerID:newAnswerId,ChoiceID:scoring.ChoiceID,Grades:scoring.Grades,index:index});}}
return pkg;}};window.SelectionPostUnPackagers={Matrix:{Profile:function(def)
{var obj={};obj.choicesByChoiceId={};for(var choiceId in def['Answers'])
{var choiceObj={};obj.choicesByChoiceId[choiceId]=choiceObj;choiceObj.series=new Array();var answerDef=def['Answers'][choiceId];for(var subAnswersId in answerDef)
{var subAnswerDef=answerDef[subAnswersId];var display='';if(subAnswerDef['Display'])
{display=subAnswerDef['Display'];}
choiceObj.series.push(display);}}
return obj;},Bipolar:function(def)
{var obj={};obj.choicesByChoiceId={};for(var choiceId in def['Choices'])
{var choiceObj={};obj.choicesByChoiceId[choiceId]=choiceObj;var rowSelection=def['Choices'][choiceId];if(rowSelection['Display'])
{var displayEscaped=rowSelection['Display'].replace(/\\\\/g,'\\~').replace(/\\:/g,'\\^');var choice_left=displayEscaped.replace(/\\\^/g,':').replace(/\\\\/g,'\\');var choice_right='Right';var separatorLocation=displayEscaped.indexOf(':');if(separatorLocation!=-1)
{choice_left=displayEscaped.substr(0,separatorLocation).replace(/\\\^/g,':').replace(/\\~/g,'\\');choice_right=displayEscaped.substr(separatorLocation+1).replace(/\\\^/g,':').replace(/\\~/g,'\\');choiceObj.series=[choice_left,choice_right];}}}
return obj;}},GAP:function(def)
{var obj={};obj.choicesByChoiceId={};for(var choiceId in def['Choices'])
{if(typeof def['Choices'][choiceId]=='function')
{continue;}
var choiceObj={};obj.choicesByChoiceId[choiceId]=choiceObj;choiceObj.series=new Array();if(def['Choices'][choiceId]['GapWhy'])
{for(var i=0,len=def['Choices'][choiceId]['GapWhy'].length;i<len;++i)
{choiceObj.series.push(def['Choices'][choiceId]['GapWhy'][i]);}}}
return obj;},PGR:function(def)
{if(def)
{var obj={};obj.answersByAnswerId={};var answerId=0;for(var groupId in def['Groups'])
{if(Object.isNumber(groupId))
{answerId++;var answerObj=new Answer(def['Groups'][groupId]);obj.answersByAnswerId[answerId]=answerObj;}}
return obj;}},SBS:function(def)
{var obj={};var additionalQuestions=def['AdditionalQuestions'];if(additionalQuestions&&!Object.isArray(additionalQuestions))
{obj.answersByAnswerId={};for(var num in additionalQuestions)
{var q=additionalQuestions[num];var answerObj=new Answer(q['QuestionText']);obj.answersByAnswerId[num]=answerObj;answerObj.series=new Array();answerObj.recodeValues=new Array();answerObj.variableNaming=new Array();if(Object.isArray(q['Answers']))
{q['Answers']={};}
if(q['AnalyzeChoices'])
answerObj.analysis={};for(var id in q['Answers'])
{var questionAnswer=q['Answers'][id];answerObj.series.push(questionAnswer['Display']);if(q['RecodeValues']&&q['RecodeValues'][id])
answerObj.recodeValues.push(q['RecodeValues'][id]);if(q['VariableNaming']&&q['VariableNaming'][id])
answerObj.variableNaming.push(q['VariableNaming'][id]);if(q['AnalyzeChoices']&&q['AnalyzeChoices'][id])
{if(q['AnalyzeChoices'][id]=='on')
{answerObj.analysis[id]=true;}
else if(q['AnalyzeChoices'][id]=='No')
{answerObj.analysis[id]=false;}}}
answerObj.meta={QuestionType:q['QuestionType'],Selector:q['Selector'],SubSelector:q['SubSelector']};if(q['GraphicSize']){answerObj.meta.GraphicSize=q['GraphicSize'];}
if(q['ExpandedGraphicSize']){answerObj.meta.ExpandedGraphicSize=q['ExpandedGraphicSize'];}
if(q['HasImage'])
{answerObj.hasImage=q['HasImage'];answerObj.imageDisplay=q['ImageDisplay'];answerObj.imageLocation=q['ImageLocation'];}
if(q['Configuration']&&q['Configuration']['ChoiceColumnWidthPixels'])
{answerObj.meta.choicesWidthPixels=q['Configuration']['ChoiceColumnWidthPixels'];}
if(q['AnswerDataExportTag'])
{answerObj.answerDataExportTag=q['AnswerDataExportTag'];}
if(q['DefaultChoices'])
{answerObj.defaultChoices=q['DefaultChoices'];}
if(q['Validation'])
answerObj.meta.Validation=q['Validation'];}
return obj;}}};window.QES_UnPackagers={MC:function(questionObj,def)
{if(def['Configuration']&&def['Configuration']['LabelPosition'])
{questionObj.setOption('labelPosition',def['Configuration']['LabelPosition']);}},GAP:function(questionObj,def)
{var choicesData=def['Choices'];if(choicesData)
{var choices=questionObj.getSelectionListToRender('choices');for(var i=0,len=choices.length;i<len;++i)
{var series=choices[i].series;if(series)
{questionObj.answers.length=0;for(var j=0,seriesLen=series.length;j<seriesLen;++j)
{questionObj.addAnswer(series[j]);}}
break;}}
questionObj.questionSpecificData={};if(def['AnalysisText'])
{var analObj=new QuestionSpecificData(questionObj,'AnalysisText',def);analObj.text=def['AnalysisText'];questionObj.questionSpecificData['AnalysisText']=analObj;}
if(def['WhyText'])
{var whyObj=new QuestionSpecificData(questionObj,'WhyText',def);whyObj.text=def['WhyText'];questionObj.questionSpecificData['WhyText']=whyObj;}},SBS:function(questionObj,def)
{},Matrix:function(questionObj)
{if(questionObj.options['RepeatHeaders']&&questionObj.options['RepeatHeaders']!='none')
{questionObj.setOption('RepeatHeadersController','ON');}
if(questionObj.selector=='Profile')
{var choices=questionObj.getSelectionListToRender('choices');for(var i=0,len=choices.length;i<len;++i)
{var series=choices[i].series;if(series)
{questionObj.answers.length=0;for(var j=0,seriesLen=series.length;j<seriesLen;++j)
{questionObj.addAnswer(series[j]);}}
break;}}},SS:function(questionObj,def)
{if(def['Category'])
{questionObj.options['Category']=def['Category'];if(def['Category']=='Bars')
{var bar=def['Scale'].split('_');questionObj.options['Bars']=bar[0];if(bar.length>1)
questionObj.options['BarType']=bar[1];else
questionObj.options['BarType']='HBAR';}
else if(def['Category']=='Gauges')
{questionObj.options['Gauges']=def['Scale'];}}},TE:function(questionObj)
{questionObj.createTextGradingEditorObjects&&questionObj.createTextGradingEditorObjects();},Slider:function(questionObj)
{questionObj.createEquationGradingEditorObjects&&questionObj.createEquationGradingEditorObjects();},HeatMap:function(questionObj,def)
{questionObj.Graphics=def.GraphicID;if(def.Width)
{questionObj.setOption('GraphicWidth',def.Width);questionObj.setOption('GraphicHeight',def.Height);var version=def.GraphicVersion||new Date().valueOf();questionObj.setOption('GraphicVersion',version);}},HotSpot:function(questionObj,def)
{questionObj.Graphics=def.GraphicID;questionObj.setOption('Visibility',def.Visibility);if(def.Width)
{questionObj.setOption('GraphicWidth',def.Width);questionObj.setOption('GraphicHeight',def.Height);var version=def.GraphicVersion||new Date().valueOf();questionObj.setOption('GraphicVersion',version);}}};window.QES_Packagers={DB:function(questionObj,pkg)
{if(pkg['Configuration']&&pkg['Configuration']['LinkText']=='')
delete pkg['Configuration']['LinkText'];},Matrix:function(questionObj,pkg)
{if(questionObj.selector=='Profile')
{pkg['Answers']={};pkg['AnswerColumns']=questionObj.answers.length;if(!pkg['Configuration'])pkg['Configuration']={};pkg['Configuration']['VariableCount']=questionObj.answers.length;}
else if(questionObj.selector=='Bipolar')
{pkg['AnswerColumns']=questionObj.answers.length;for(var i in pkg['Answers'])
{if(pkg['Answers'][i])
{pkg['Answers'][i].Display=i;}}}
else if(questionObj.selector=='TE')
{QuestionTypes.Universal.packageNumerics(questionObj,pkg);}},SS:function(questionObj,pkg)
{var cat=questionObj.options['Category'];pkg['Category']=cat;if(cat=='Gauges')
{pkg['Scale']=questionObj.options['Gauges'];}
else if(cat=='Bars')
{pkg['Scale']=questionObj.options['Bars'];if(questionObj.options['BarType']&&questionObj.options['BarType']!=''&&questionObj.options['BarType']!='HBAR')
pkg['Scale']+='_'+questionObj.options['BarType'];}
if(pkg['Choices'])
{for(var choiceId in pkg['Choices'])
{pkg['Choices'][choiceId]['Display']='';}}},TE:function(questionObj,pkg)
{if(questionObj.selector=='FORM')
{for(var i=0,len=questionObj.choices.length;i<len;++i)
{var choiceObj=questionObj.choices[i];if(choiceObj.meta)
{pkg['Choices'][choiceObj.choiceId]['TextEntry']='on';}}}
else
{QuestionTypes.Universal.packageNumerics(questionObj,pkg);}},HeatMap:function(questionObj,pkg)
{pkg.GraphicID=questionObj.Graphics;if(pkg.GraphicID==null)
pkg.GraphicID=0;if(questionObj.options.GraphicWidth)
{pkg.GraphicWidth=questionObj.options.GraphicWidth;pkg.GraphicHeight=questionObj.options.GraphicHeight;var version=questionObj.options.GraphicVersion||new Date().valueOf();pkg.GraphicVersion=version;pkg.GraphicSize='1';}},HotSpot:function(questionObj,pkg)
{pkg.GraphicID=questionObj.Graphics;pkg.Visibility=questionObj.options.Visibility;if(questionObj.options.GraphicWidth)
{pkg.GraphicWidth=questionObj.options.GraphicWidth;pkg.GraphicHeight=questionObj.options.GraphicHeight;var version=questionObj.options.GraphicVersion||new Date().valueOf();pkg.GraphicVersion=version;}},Timing:function(questionObj,pkg)
{pkg['QuestionText']='Timing';},NPS:function(questionObj,pkg)
{pkg['QuestionType']='MC';pkg['Selector']='NPS';pkg['ColumnLabels']=questionObj.exportColumnLabels();}};window.choiceScaleHelpers={scalePointsIndex:null,triggersIndex:null,getScaleLibrary:function(questionObj)
{if(questionObj.questionType=='TE'&&questionObj.selector=='FORM')
{return'forms';}
return'scales';},getScale:function(scaleName,scaleType,opt_length)
{if(!scaleType)
{scaleType='likert';}
var scale;var length=2;var scaleDef=choiceScales[scaleName];if(scaleDef['defaultLength'])
{length=scaleDef['defaultLength'];}
if(opt_length)
{length=opt_length;}
if(scaleType=='category')
{var lengths=choiceScaleHelpers.getPossibleLengths(scaleName);var biggest=lengths[lengths.length-1];var largestScale=choiceScaleHelpers.getRawScale(scaleName,biggest);scale=[];scale.push(largestScale.first());for(var i=2;i<length;++i)
{scale.push('&nbsp;');}
scale.push(largestScale.last());}
else
{scale=choiceScaleHelpers.getRawScale(scaleName,opt_length);}
return scale.clone();},getRawScale:function(scaleName,opt_length)
{var scaleDef=choiceScales[scaleName];if(scaleDef)
{var length=2;var scale=null;if(scaleDef['defaultLength'])
{length=scaleDef['defaultLength'];}
if(opt_length)
{length=opt_length;}
if(scaleDef['choices']['length'+length])
{scale=scaleDef['choices']['length'+length];}
else if(scaleDef['choices']['multiLength'])
{var impliedLengths;if(scaleDef.choices.multiLength.length==7)
{impliedLengths={length2:[1,5],length3:[1,3,5],length4:[0,1,5,6],length5:[0,1,3,5,6],length6:[0,1,2,4,5,6],length7:[0,1,2,3,4,5,6]};}
else
{impliedLengths={length2:[1,3],length3:[1,2,3],length4:[0,1,3,4],length5:[0,1,2,3,4]};}
var points=impliedLengths['length'+length];if(points)
{scale=[];for(var i=0,len=points.length;i<len;++i)
{scale.push(scaleDef['choices']['multiLength'][points[i]]);}}
else
{scale=scaleDef['choices']['multiLength'];}}
else
{var closestLength=choiceScaleHelpers.getClosestLength(scaleName,length);scale=scaleDef['choices']['length'+closestLength];}}
return scale.clone();},getPossibleLengthsFromMultiLength:function(scaleName)
{if(!choiceScales[scaleName].choices.multiLength)
{return[2,3,4,5,6,7];}
var possibleLengths=[];for(var i=1;i<choiceScales[scaleName].choices.multiLength.length;i++)
{possibleLengths.push(i+1);}
return possibleLengths;},getPossibleLengths:function(scaleName,scaleType)
{var choicesObject=choiceScales[scaleName]&&choiceScales[scaleName]['choices'];if(choicesObject)
{var possibleLengths=[];for(var lengthName in choicesObject)
{if(lengthName!='multiLength')
{var length=lengthName.substr(6);possibleLengths.push(Number(length));}}
if(choicesObject['multiLength'])
{var multis=choiceScaleHelpers.getPossibleLengthsFromMultiLength(scaleName);possibleLengths=possibleLengths.concat(multis);}
possibleLengths.sort();return possibleLengths.uniq();}},getClosestLength:function(scaleName,currentLength)
{var lengths=choiceScaleHelpers.getPossibleLengths(scaleName);if(lengths)
{var bestMatch=lengths[0];for(var i=0,len=lengths.length;i<len;++i)
{var diff=Math.abs(lengths[i]-currentLength);var bestDiff=Math.abs(bestMatch-currentLength);if(lengths[i]==currentLength)
{return lengths[i];}
if(diff<bestDiff)
{bestMatch=lengths[i];}}
return bestMatch;}},getASiblingLength:function(scaleName,scaleType,currentLength,delta)
{if(scaleType=='category')
{return currentLength+delta;}
var closestLength=choiceScaleHelpers.getClosestLength(scaleName,currentLength);var lengths=choiceScaleHelpers.getPossibleLengths(scaleName);if(currentLength>lengths[lengths.length-1])
{return false;}
if(currentLength==lengths[lengths.length-1])
{if(delta>0)
{return false;}}
if(currentLength<lengths[0]&&delta>0)
{return lengths[0];}
for(var i=0,len=lengths.length;i<len;++i)
{if(lengths[i]==closestLength)
{if(lengths[i+delta])
{return lengths[i+delta];}}}},previewQuestionObj:null,activePreviewing:false,getPreviewScaleClosure:function(scaleName,axis,scaleType)
{return function(evt){if(!evt)evt=window.event;Event.stop(evt);var el=Event.element(evt);var scaleType=el.getAttribute('scaletype');choiceScaleHelpers.previewScale(scaleName,axis,scaleType);return false;};},previewScale:function(scaleName,axis,scaleType)
{if(choiceScaleHelpers.activePreviewing)
{var questionObj=QuestionActions.selectedRegistry[0];var currentScaleDef=questionObj.getScaleDefinition(axis);if(!scaleType)
{scaleType='likert';if(currentScaleDef)
{if(currentScaleDef.scaleType)
{scaleType=currentScaleDef.scaleType;}}}
if(questionObj)
{var listType=questionObj.getAxisDef(axis).listType;if(listType)
{if(!choiceScaleHelpers.previewQuestionObj||choiceScaleHelpers.previewQuestionObj.previewId!=questionObj.id)
{choiceScaleHelpers.previewQuestionObj=questionObj.clone(true);choiceScaleHelpers.previewQuestionObj.unpackage();choiceScaleHelpers.previewQuestionObj.previewId=questionObj.id;}
if(choiceScaleHelpers.previewQuestionObj)
{deleteChildren(questionObj.questionCanvas);var scale=choiceScaleHelpers.getScale(scaleName,scaleType);if(currentScaleDef.reverse)
{scale=scale.reverse();}
choiceScaleHelpers.previewQuestionObj[listType].length=0;for(var i=0,len=scale.length;i<len;++i)
{choiceScaleHelpers.previewQuestionObj.addSelection(listType,scale[i]);}
choiceScaleHelpers.previewQuestionObj.renderCanvas({parentElement:questionObj.questionCanvas});}}}
questionObj=null;}},generateScalePointsIndex:function()
{choiceScaleHelpers.scalePointsIndex={};choiceScaleHelpers.triggersIndex=[];for(var scaleName in choiceScales)
{var lengths=choiceScales[scaleName]['choices'];var triggers=choiceScales[scaleName]['triggers'];if(triggers)
{for(var i=0,len=triggers.length;i<len;++i)
{choiceScaleHelpers.triggersIndex.push({trigger:triggers[i],scale:scaleName});}}
for(var lengthName in lengths)
{var scale=lengths[lengthName];for(i=0,len=scale.length;i<len;++i)
{if(scale[i])
{choiceScaleHelpers.scalePointsIndex[scale[i].toLowerCase()]=scaleName;}}}}},findScaleByTrigger:function(text)
{if(!choiceScaleHelpers.triggersIndex)
{choiceScaleHelpers.generateScalePointsIndex();}
for(var i=0,len=choiceScaleHelpers.triggersIndex.length;i<len;++i)
{var triggerDef=choiceScaleHelpers.triggersIndex[i].trigger;var accepted=false;if(triggerDef&&triggerDef.accept)
{for(var j=0,jlen=triggerDef.accept.length;j<jlen;++j)
{if(text.search(triggerDef.accept[j])!==-1)
{accepted=true;j=jlen;}}
if(accepted&&triggerDef.reject)
{for(j=0,jlen=triggerDef.reject.length;j<jlen;++j)
{if(text.search(triggerDef.reject[j])!==-1)
{accepted=false;j=jlen;}}}}
if(accepted)
{var scaleName=choiceScaleHelpers.triggersIndex[i].scale;var length=null;if(choiceScales[scaleName]['defaultLength'])
{length=choiceScales[scaleName]['defaultLength'];}
return{axis:'Y',scaleName:scaleName,scaleType:'likert',length:length,reverse:null};}}},findScaleByText:function(text,opt_position)
{text=String(text);text=text.toLowerCase().strip();if(!choiceScaleHelpers.scalePointsIndex)
{choiceScaleHelpers.generateScalePointsIndex();}
var match=choiceScaleHelpers.scalePointsIndex[text];var reverse=false;if(match)
{var lengths=choiceScaleHelpers.getPossibleLengths(match);var matchedLengths=[];for(var i=0,len=lengths.length;i<len;++i)
{var testScale=choiceScaleHelpers.getRawScale(match,lengths[i]);if(testScale)
{if(opt_position!==undefined)
{if(testScale[opt_position].toLowerCase()==text)
{matchedLengths.push(lengths[i]);}
if(testScale[testScale.length-opt_position-1].toLowerCase()==text)
{matchedLengths.push(lengths[i]);reverse=true;}}
else
{for(var j=0,scaleLen=testScale.length;j<scaleLen;++j)
{if(testScale[j]==text)
{matchedLengths.push(lengths[i]);break;}}}}}
if(matchedLengths.length)
{var pkg={scaleName:match,lengths:matchedLengths,reverse:reverse};return pkg;}}
return false;},setCustomScale:function(scale)
{if(choiceScaleHelpers.scalePointsIndex&&choiceScaleHelpers.scalePointsIndex[scale[0]])
{return;}
var choicesObject={};choicesObject['length'+scale.length]=scale;choiceScales.customAnswers={lib:'scales',name:'Custom',defaultLength:scale.length,choices:choicesObject};choiceScaleHelpers.generateScalePointsIndex();}};function stripNewLines(text)
{return String(text).replace(/(\n\r|\n|\r)/g,' ');}
Qualtrics.isNumeric=function(v)
{if(v!==undefined)
{if(!isNaN(v)&&v!='')
{return true;}}
return false;};Qualtrics.findSequence=function(p1,p2,p3)
{if(Qualtrics.isNumeric(p1))
{var delta=1;p1=Number(p1);if(Qualtrics.isNumeric(p2))
{p2=Number(p2);delta=p1-p2;}
return String(p1+delta);}
return false;};