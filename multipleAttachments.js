
	//Declare an array to contain id for all attachment questions in the Attachment section
	var attachmentQstns=[];
	
	//On document ready populate the array to contain the ids of the attachment questions.  On review request
	//display the attachment questions which are populated.
	$(function() {
		$(".multiple-attachment-section > div > div.questionAnswer > input[name*='ATTACHLOAD_']").each(function(){
		  var qlayerQstn = $(this).attr('id').replace("ATTACHLOAD_","");
		  attachmentQstns.push(qlayerQstn);
		  if(KD.utils.Action.getQuestionValue(qlayerQstn)!=""){
			KD.utils.Util.getQuestionLayer(qlayerQstn).style.display='block';
			}
		})
	});
		
	/**
	* 
	* 
	*This function is an over-ride of the original KD.utils.Action._setFileLink.
	*It has been modified to accomodate multiple attachments on a Service Item.
	*Functionality has been added to automatically display an additional attachement
	*question after uploading a file into an attachment filed.
	*
	* Toggle between a file link and the input value for attachment questions.
	*
	* @method _setFileLink
	* @private
	* @param {HTMLElement} qstnEl The question input element
	* @return void
	*/
	KD.utils.Action._setFileLink = function (qstnEl) {
	   var link=Dom.get(qstnEl.getAttribute("id")+"_link");
	   if(link){
		   var qstn=link.parentNode;
		   qstn.removeChild(link);
		   // Change the button label to "Replace File"
		   $(qstnEl).next('.templateButton').val('Get File')
	   }
	   if(qstnEl.value && qstnEl.value != ""){
		   
		   //Build link and layer
		   link = document.createElement('a');
		   link.setAttribute('id', qstnEl.getAttribute("id")+"_link");
		   link.setAttribute('target','_blank');
		   var sessionId=encodeURIComponent(KD.utils.ClientManager.sessionId);
		   var now = new Date();
		   var questionId=encodeURIComponent(KD.utils.Util.getIDPart(qstnEl.getAttribute("id")));
		   var path = "SimpleDataRequest?requestName=getFile&dataRequestId=attachment&sessionId="+sessionId+"&questionId="+questionId+"&noCache="+now.getTime()+"&fileName="+encodeURIComponent(qstnEl.value);
		   link.setAttribute('href', path);
		   link.className="fileLink";
		   link.style.marginRight="20px";
		   var fileName=document.createTextNode(qstnEl.value);
		   link.appendChild(fileName);
		   qstnEl.originalDisplay=qstnEl.style.display;
		   qstnEl.style.display="none";
		   var qstnLyr=qstnEl.parentNode;
		   var first = qstnLyr.firstChild;
		   qstnLyr.insertBefore(link,first);
		   // Change the button label to "Replace File"
		   $(qstnEl).next('.templateButton').val('Replace File')
		   // If a question has been added to the Request, expose the next attachment questions in the array
		   if(clientManager.isLoading!=true){
				var attachmentIndex=attachmentQstns.indexOf(questionId);
				//If an attachment has been added to the last attachment question, present a message
				if(attachmentIndex>=attachmentQstns.length-1){
					alert("The Maximumn number of attachments that may be added to this Request has been reached.");
				}
				// Else expose the next attachment question.
				else{	
					KD.utils.Action.insertElement(attachmentQstns[attachmentIndex+1]);
				}
			}
	   } else{
		   if(!qstnEl.originalDisplay || !qstnEl.originalDisplay ==""){
			   qstnEl.originalDisplay="inline";
		   }
		   qstnEl.style.display=qstnEl.originalDisplay;
	   }
	};



