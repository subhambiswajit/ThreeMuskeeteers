function getData(parameter, onSuccess) {
	var url = 'http://localhost:3000/api/'+parameter;
	$.ajax({
            type: 'GET',
              url:url,
              data:{},              
              success: function(data) {
                //console.log(data);
                onSuccess(data);
                //return(data);

              }
            
        });

}

function getFile(parameter, onSuccess) {
	var url = 'http://localhost:8000'+parameter;
	$.get({
              url:url,
              data:{},              
              success: function(data) {
                //console.log(data);
                onSuccess(data);
                //return(data);

              }
            
        });

}

function updateTreeViewLink(id){
  $('#lnkTreeView').attr('href', '/tree?id='+id);
}

$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results==null){
     return null;
  }
  else{
     return decodeURI(results[1]) || 0;
  }
}

function ApplyProjectTitle() {
  getData("/projectInfo", function(data) {
    data1=JSON.stringify(data);
    var arr=JSON.parse(data1);
    var spanTitle = $('#spnProjectTitle');
    spanTitle.text(arr[0].name);
  });
}

$("#details_area").on("click", "#infoEdit", function(){
  var id = $(this).data('id');
  if(id != null) {
    getData('/ItemInfo/' + id, function (data) {
      fillmodal("", getEditModalHtml(data));
    });
  }
  
});

$(document).on('click','#cfRowPlus', function(){
  //alert('test');
  var div = $('#divCFRows');
  div.append(getCustomFieldRowHtml('col s2 input_text','',''));
}); 

function getEditModalHtml(data) {
  var filesWrapperClass = '';
  var filesHeaderClass = '';
  var filesTextClass = '';

  var finalHtml = '';

  finalHtml += "<div id='infoEditModal'>";
  finalHtml += getItemHeaderHtml(data);
  finalHtml += getCustomFieldsHtml(data.customFields);
  finalHtml += getFilesHtml(data.files);
  finalHtml += "</div>";
  finalHtml += "<div><i id='infoSave' class=\"far fa-save fa-3x\"></i></div>"
  return finalHtml;
}

function getFilesHtml(files){
  var filesHeaderClass = 'col s2';
  var filesWrapperClass = '';
  var filesTextClass = 'col s2';

  var returnHtml = '';

  returnHtml += "<div>";
  returnHtml += "<div><strong>Related File(s)</strong>&nbsp;<i id='filesRowPlus' class=\"fas fa-plus\"></i></div>";
  returnHtml += getFilesHeaderHtml(filesHeaderClass);
  returnHtml += "<div id='divFileRows'>";
  returnHtml += getFilesRowsHtml(filesWrapperClass, filesTextClass, files)
  returnHtml += "</div>";
  returnHtml += "</div>";
  return returnHtml;
}

function getFilesRowsHtml(wrapperClass, textClass, files ) {
  var returnHtml = '';
  returnHtml += "<div class='" + wrapperClass + "'>";
  if(files.length > 0)
  {
    for(var i=0;i<files.length;i++) {
      returnHtml += getFilesRowHtml(textClass, files[i].label, files[i].fileName);
    }
  } else {
    returnHtml = getFilesRowHtml(textClass, '', '');
  }
  returnHtml += "</div>";
  return returnHtml;
}

function getFilesRowHtml(textClass, label, fileName) {
  return "<div class='row'>" +
         "<span class='" + textClass + "'>" + label +  "</span>" +
         "<span class='" + textClass + "'>" + fileName +  "</span>" +
         "</div>";
}

function getFilesHeaderHtml( fieldHeaderClass)
{
  return "<div class='row'><div class='" + fieldHeaderClass + "'>Name</div><div class='" + fieldHeaderClass + "'>Is Default</div></div>";
}

function getCustomFieldsHtml(customFields){
  var customFieldHeaderClass = 'col s2';
  var customFieldWrapperClass = 'col s2';
  var customFieldTextClass = 'col s2 input_text';

  var returnHtml = '';

  returnHtml += "<div ><strong>Related Information</strong>&nbsp;<i id='cfRowPlus' class=\"fas fa-plus\"></i></div>";
  
  returnHtml += getCustomFieldHeaderHtml(customFieldHeaderClass);
  returnHtml += "<div id='divCFRows'>";
  returnHtml += getCustomFieldRowsHtml(customFieldWrapperClass, customFieldTextClass, customFields)
  returnHtml += "</div>";
  return returnHtml;
}

function getCustomFieldRowsHtml(wrapperClass, textClass, customFields ) {
  var returnHtml = '';
  //returnHtml += "<div class='" + wrapperClass + "'>";
  if(customFields.length > 0)
  {
    for(var i=0;i<customFields.length;i++) {
      returnHtml += getCustomFieldRowHtml(textClass, customFields[i].label, customFields[i].value);
    }
  } else {
    returnHtml = getCustomFieldRowHtml(textClass, '', '');
  }
  //returnHtml += "</div>";
  return returnHtml;
}

function getCustomFieldRowHtml(textClass, label, value) {
  return "<div class='row'>" +
         "<input type='text' class='" + textClass + "' value='" + label +  "' />" +
         "<input type='text' class='" + textClass + "' value='" + value +  "' />" +
         "</div>";
}

function getCustomFieldHeaderHtml(fieldHeaderClass)
{
  return "<div class='row'><div class='" + fieldHeaderClass + "'>Label</div><div style='margin-left:33px;' class='" + fieldHeaderClass + "'>Value</div></div>";
}

function getItemHeaderHtml(data){
  //data.name;
  //data.desc;
  
  var nameLabelClass = '';
  var nameTextClass = 'input_text';

  var descLabelClass = '';
  var descTextClass = 'input_text';
  
  var returnHtml = '';
  returnHtml += "<div>";
  returnHtml += getItemHeaderRowHtml(nameLabelClass, nameTextClass, 'Name', data.name);
  returnHtml += getItemHeaderRowHtml(descLabelClass, descTextClass, 'Description', data.desc);
  returnHtml += "</div>";
  return returnHtml;
}

function getItemHeaderRowHtml(labelClass, textClass, label, text) {
  return "<div>" +
         "<span class='" + labelClass + "' ><strong>" + label + "&nbsp;:&nbsp;</strong></span>" +
         "<span><input type='text' style='width:1000px;'class='" + textClass + "' value='" + text + "' /></span>" + 
         "</div>";
}

ApplyProjectTitle();


// function fillInfoPanel(data) {
// 	data1=JSON.stringify(data);
//     var arr=JSON.parse(data1);
//     //console.log(arr);
//     // var results = "<div class=\"row\"> <div class=\"col s-12\">"+arr+"</div></div>"
//     //var len=arr.customFields.length;
//     var inc;
//     var results = "";
//     results += "<div class=\"row\"><center><h4><b>"+ arr.name +"</b><h4></center></div>";
//     results += "<div class=\"row\"><center><h6>"+ arr.desc +"<h6></center></div>";
//     if(arr.customFields.length>0)
//     {
//         results += "<div class=\"row\"><center><b>Info Fields</b></center></div>";
//     }
//     // var results='<div class="row" style="margin-bottom:2px;height:40px;"><a href="foreign_profile/'+arr.searchdata[0].id+'">'+'<div class="col s10 l10 m10">'+arr.searchdata[0].name+'-'+arr.searchdata[0].username+'</div>'+'<div class="col s2 l2 m2">'+arr.searchdata[0].type+'</div>'+'</a></div>';
//     for(var i=0;i<arr.customFields.length;i++)
//     {
//         var serial = (i + 1) + ".&nbsp;";
//         results += '<div class=\"row\"> <div class=\"\">'+ serial  +'<b>' + arr.customFields[i].label + ':</b><span>&nbsp;' + arr.customFields[i].value + '</p></div> </div>'
//     }
//         //results += '<div class=\"row\"> <div class=\"light-blue lighten-5\"><b>Supported Languaes:</b>ENG-US, ENG-US</div> </div>'
//         //results += '<div class=\"row\"> <div class=\"light-blue lighten-5\"><b>Sample SKUs:</b>1234567, 333333, 77777</div> </div>'
//     if(arr.files.length > 0)
//     {
//         results += "<div class=\"row\"><center><b>Files</b></center></div>";
//     }
//     for(var i=0;i<arr.files.length;i++)
//     {
//         var serial = (i + 1) + ".&nbsp;";
//         var hidId = 'hidFile_' + i;
//         results += '<div class=\"row\"> <div class=\"\">' + serial + '<b>'+ arr.files[i].label + ':&nbsp;</b><a data-hidField=\"' + hidId + '\" id=\"file_' + i +'">' + arr.files[i].fileName + '</a>' + '<input id="' + hidId + '" type="hidden" value="'+ arr.files[i].value + '"/></div>';
//     }
	
		
//     document.getElementById("details_area").innerHTML =results;
// }

function fillInfoPanel(data) {
    data1=JSON.stringify(data);
   var arr=JSON.parse(data1);
   console.log(arr);
   // var results = "<div class=\"row\"> <div class=\"col s-12\">"+arr+"</div></div>"
   //var len=arr.customFields.length;
   var inc;
   var results = "";
   results += "<div class=\"row\"><center><i id='infoEdit' data-id='" + arr.id + "' class=\"far fa-edit fa-3x\"></i><h4><b>"+ arr.name +"</b><h4></center></div>";
    results += "<div class=\"row\"><center><h6>"+ arr.desc +"<h6></center></div>";
    results += "<div class=\"row\"><b>Related Information(s)</b></div>";
   // var results='<div class="row" style="margin-bottom:2px;height:40px;"><a href="foreign_profile/'+arr.searchdata[0].id+'">'+'<div class="col s10 l10 m10">'+arr.searchdata[0].name+'-'+arr.searchdata[0].username+'</div>'+'<div class="col s2 l2 m2">'+arr.searchdata[0].type+'</div>'+'</a></div>';
   
       results += '<div class=\"row\"> <div class=\" lighten-5\">Supported Countries:&nbsp;US, UK & AU</div> </div>'
       results += '<div class=\"row\"> <div class=\" lighten-5\">Supported Languaes:&nbsp;ENG-US, ENG-US</div> </div>'
      
    results += "<div class=\"row\"><b>Related File(s)</b></div>";
    results += '<div class=\"row\"> <div class=\" lighten-5\">'+'Screenshot'+": &nbsp; "+"<a id='screenshot'>screenshot.png</a>"+'</a> </div>'
    
        
   document.getElementById("details_area").innerHTML =results;
}




function fillmodal(header,data)
{
	var elem = document.querySelector('.modal');
	var instance = M.Modal.getInstance(elem);
	var results= data;
	document.getElementById("modal_desc").innerHTML = results;
	document.getElementById("modal_header").innerHTML = header;
	instance.open();
}
