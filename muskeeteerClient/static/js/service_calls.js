var apiBaseUrl = 'http://localhost:3000/api/';
var pythonBaseUrl = 'http://localhost:8000';
var db = 'NGP'

function getData(parameter, onSuccess) {
	var url = apiBaseUrl + parameter;
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

function postData(parameter, data, onSuccess) {
	var url = apiBaseUrl + parameter;
	$.ajax({
            type: 'post',
              url:url,
              data:data,              
              success: function(data) {
                //console.log(data);
                onSuccess(data);
                //return(data);

              }
            
        });

}

function getFile(parameter, onSuccess) {
	var url = pythonBaseUrl + parameter;
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
  customFieldRowsMax++;
  div.append(getCustomFieldRowHtml(customFieldRowsMax,'col s2 input_text','',''));
}); 

$(document).on('click', '#filesRowPlus', function(){
  var div = $('#divFileRows');
  
  var id = $("#infoEdit").data('id');
  div.append("<input type='file' id='fileContainer' />");

});
$(document).on('click','#infoSave', function() {
  var data = new FormData();
  var id = $("#infoEdit").data('id');
 // console.log(db);
  var img = null;
  var $fileContainer =  $('#fileContainer');
  if($fileContainer.length > 0)
  {
  var img = $('#fileContainer')[0].files[0];
  data.append('fileContainer', img);
  data.append('db', db);
  data.append('id', id)
 // console.log(img);
  }
  else
  {
    saveItemInfo();
    return;
  }
  jQuery.ajax
({
        url: pythonBaseUrl + '/fileUploader',
        type: "POST",
        data:   data,
        success: function(data)
        {
        //  console.log(data);
          saveItemInfo();
        },
        error: function(data)
        {
            alert( 'Sorry. Error occurred' );
        },
        cache: false,
        contentType: false,
        processData: false
});

});

function saveItemInfo(){
    var id = $("#infoEdit").data('id');
    var data = {id:id, name:'', desc:'',tags:'', cfCount:0, customFields:null, fCount: 0, files:null};
    data.name = $('#item_Name').val();
    data.desc = $('#item_Description').val();
    data.tags = $('#item_Tags').val();
    var cfArray = new Array();
    var fileArray = new Array();
    for(var i=0;i<=customFieldRowsMax;i++){
      var label = $('#item_cf_label_' + i).val();
      var value = $('#item_cf_value_' + i).val();
      if(label != '' && value != '')
      {
        cfArray.push({label: label, value: value});
      }
    
    }
    data.cfCount = cfArray.length;
    data.customFields = cfArray;
    var fileName = '';
    var $fileContainer =  $('#fileContainer');
    if($fileContainer.length > 0)
    {
      fileName = $fileContainer[0].files[0].name;
      fileArray.push({name:fileName, label: fileName});
      data.fCount = 1;
    }
    data.files = fileArray;
    postData('/saveItemInfo', data, function(){
      if(instance != null)
        instance.close();
      getData('/ItemInfo/' + id, fillInfoPanel);
    });
   // return data;
}

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
  finalHtml += "<br><br><div style='margin-left:5px;'><i id='infoSave' style='cursor:pointer;' class=\"far fa-save fa-3x\"></i></div>"
  return finalHtml;
}

function getFilesHtml(files){
  var filesHeaderClass = 'col s2';
  var filesWrapperClass = '';
  var filesTextClass = 'col s2';

  var returnHtml = '';

  returnHtml += "<div>";
  returnHtml += "<div><strong>Related File(s)</strong>&nbsp;<i id='filesRowPlus' class=\"fas fa-plus\"></i></div>";
 // returnHtml += getFilesHeaderHtml(filesHeaderClass);
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
        // "<span class='" + textClass + "'>" + fileName +  "</span>" +
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

var customFieldRowsMax = 0;

function getCustomFieldRowsHtml(wrapperClass, textClass, customFields ) {
  var returnHtml = '';
  //returnHtml += "<div class='" + wrapperClass + "'>";
  if(customFields.length > 0)
  {
    for(var i=0;i<customFields.length;i++) {
      returnHtml += getCustomFieldRowHtml(i, textClass, customFields[i].label, customFields[i].value);
      customFieldRowsMax = i;
    }
  } else {
    returnHtml = getCustomFieldRowHtml(0, textClass, '', '');
  }
  //returnHtml += "</div>";
  return returnHtml;
}

function getCustomFieldRowHtml(rowId, textClass, label, value) {
  return "<div class='row'>" +
         "<input type='text' id='item_cf_label_" + rowId + "' class='" + textClass + "' value='" + label +  "' />" +
         "<input type='text' id='item_cf_value_" + rowId + "' class='" + textClass + "' value='" + value +  "' />" +
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
  if(data.tags == null)
    data.tags = '';
  
  var returnHtml = '';
  returnHtml += "<div>";
  returnHtml += getItemHeaderRowHtml(nameLabelClass, nameTextClass, 'Name', data.name);
  returnHtml += getItemHeaderRowHtml(descLabelClass, descTextClass, 'Description', data.desc);
  returnHtml += getItemHeaderRowHtml(descLabelClass, descTextClass, 'Tags', data.tags);
  returnHtml += "</div>";
  return returnHtml;
}

function getItemHeaderRowHtml(labelClass, textClass, label, text) {
  return "<div>" +
         "<span class='" + labelClass + "' ><strong>" + label + "&nbsp;:&nbsp;</strong></span>" +
         "<span><input type='text' id='item_" + label + "' style='width:1000px;'class='" + textClass + "' value='" + text + "' /></span>" + 
         "</div>";
}

ApplyProjectTitle();


function fillInfoPanel(data) {
	data1=JSON.stringify(data);
    var arr=JSON.parse(data1);
    //console.log(arr);
    // var results = "<div class=\"row\"> <div class=\"col s-12\">"+arr+"</div></div>"
    //var len=arr.customFields.length;
    var inc;
    var results = "";
    results += "<div class=\"row\"><center><i id='infoEdit' data-id='" + arr.id + "' class=\"far fa-edit fa-2x\"></i><h4><b>"+ arr.name +"</b><h4></center></div>";
    results += "<div class=\"row\"><center><h6>"+ arr.desc +"<h6></center></div>";
    if(arr.customFields.length>0)
    {
        results += "<div class=\"row\" style=\"margin-left: -6px;margin-top:15px;\"><b>Related Information</b></div>";
    }
    // var results='<div class="row" style="margin-bottom:2px;height:40px;"><a href="foreign_profile/'+arr.searchdata[0].id+'">'+'<div class="col s10 l10 m10">'+arr.searchdata[0].name+'-'+arr.searchdata[0].username+'</div>'+'<div class="col s2 l2 m2">'+arr.searchdata[0].type+'</div>'+'</a></div>';
    for(var i=0;i<arr.customFields.length;i++)
    {
        var serial = (i + 1) + ".&nbsp;";
        results += '<div class=\"row\"> <div style="margin-left: 5px;margin-bottom: -22px;"  class=\"\"><b>' + arr.customFields[i].label + ':</b><span>&nbsp;' + arr.customFields[i].value + '</p></div> </div>'
    }
        //results += '<div class=\"row\"> <div class=\"light-blue lighten-5\"><b>Supported Languaes:</b>ENG-US, ENG-US</div> </div>'
        //results += '<div class=\"row\"> <div class=\"light-blue lighten-5\"><b>Sample SKUs:</b>1234567, 333333, 77777</div> </div>'
    if(arr.files.length > 0)
    {
        results += "<div class=\"row\"  style=\"margin-left: -6px;margin-top:15px;\"><b>Related File(s)</b></div>";
    }
    var iconHtml = '';
    for(var i=0;i<arr.files.length;i++)
    {
        var serial = (i + 1) + ".&nbsp;";
        var hidId = 'hidFile_' + i;
        var url = "/media/"+ db + "/" +  arr.id + "/" + arr.files[i].fileName;
        results += '<div class=\"row\"> <div  style="margin-left: 5px; margin-bottom: -22px;" class=\"\"><a style="cursor:pointer;" data-hidField=\"' + hidId + '\" data-url="' + url + '" data-title="' + arr.files[i].fileName + '" onclick="return onClick(this);" id=\"file_' + i +'">' + arr.files[i].fileName + '</a>' + '<input id="' + hidId + '" type="hidden" value="'+ arr.files[i].value + '"/></div>';
        if(i==0)
        {
          iconHtml += "<br><br><div class=\"row\">";
          iconHtml += '<img src="' + url + '" style="margin-left:15px;width:90%;cursor:pointer"  data-url="' + url + '" data-title="' + arr.files[i].fileName + '" onclick="return onClick(this);">';
          iconHtml += "</div>";
        }
    }

    if(iconHtml != '')
      results += iconHtml;
	
		
    document.getElementById("details_area").innerHTML =results;
}

// function fillInfoPanel(data) {
//     data1=JSON.stringify(data);
//    var arr=JSON.parse(data1);
//    console.log(arr);
//    // var results = "<div class=\"row\"> <div class=\"col s-12\">"+arr+"</div></div>"
//    //var len=arr.customFields.length;
//    var inc;
//    var results = "";
//    results += "<div class=\"row\"><center><i id='infoEdit' data-id='" + arr.id + "' class=\"far fa-edit fa-3x\"></i><h4><b>"+ arr.name +"</b><h4></center></div>";
//     results += "<div class=\"row\"><center><h6>"+ arr.desc +"<h6></center></div>";
//     results += "<div class=\"row\"><b>Related Information(s)</b></div>";
//    // var results='<div class="row" style="margin-bottom:2px;height:40px;"><a href="foreign_profile/'+arr.searchdata[0].id+'">'+'<div class="col s10 l10 m10">'+arr.searchdata[0].name+'-'+arr.searchdata[0].username+'</div>'+'<div class="col s2 l2 m2">'+arr.searchdata[0].type+'</div>'+'</a></div>';
   
//        results += '<div class=\"row\"> <div class=\" lighten-5\">Supported Countries:&nbsp;US, UK & AU</div> </div>'
//        results += '<div class=\"row\"> <div class=\" lighten-5\">Supported Languaes:&nbsp;ENG-US, ENG-US</div> </div>'
      
//     results += "<div class=\"row\"><b>Related File(s)</b></div>";
//     results += '<div class=\"row\"> <div class=\" lighten-5\">'+'Screenshot'+": &nbsp; "+"<a id='screenshot'>screenshot.png</a>"+'</a> </div>'
    
        
//    document.getElementById("details_area").innerHTML =results;
// }

var instance = null;
function fillmodal(header,data)
{
	var elem = document.querySelector('.modal');
	instance = M.Modal.getInstance(elem);
	var results= data;
	document.getElementById("modal_desc").innerHTML = results;
	document.getElementById("modal_header").innerHTML = header;
  instance.open();
  //instance.close();
}

function onClick(obj){
  var $object = $(obj);
  var url = $object.data('url');
  var title = $object.data('title');
  fillmodal(title, "<img src='" + url + "' style='width:100%'>");
  return false;
}
