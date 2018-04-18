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
   results += "<div class=\"row\"><center><h4><b>"+ arr.name +"</b><h4></center></div>";
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
