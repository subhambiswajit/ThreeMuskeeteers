function getData(parameter, onSuccess) {
	var url = 'http://localhost:3000/api/'+parameter;
	$.ajax({
            type: 'GET',
              url:url,
              data:{},              
              success: function(data) {
                console.log(data);
                onSuccess(data);
                //return(data);

              }
            
        });

}

function fillInfoPanel(data) {
	data1=JSON.stringify(data);
    var arr=JSON.parse(data1);
    console.log(arr);
    // var results = "<div class=\"row\"> <div class=\"col s-12\">"+arr+"</div></div>"
    var len=arr.customFields.length;
    var inc;
    var results = "";
    results += "<div class=\"row\"><center><h4><b>"+ arr.name +"</b><h4></center></div>";
	results += "<div class=\"row\"><center><h6>"+ arr.desc +"<h6></center></div><hr>";
	results += "<div class=\"row\"><center><b>Fields</b></center></div><hr>";
    // var results='<div class="row" style="margin-bottom:2px;height:40px;"><a href="foreign_profile/'+arr.searchdata[0].id+'">'+'<div class="col s10 l10 m10">'+arr.searchdata[0].name+'-'+arr.searchdata[0].username+'</div>'+'<div class="col s2 l2 m2">'+arr.searchdata[0].type+'</div>'+'</a></div>';
    for(inc=0;inc<len;inc++)
		results += '<div class=\"row\"> <div class=\"card-panel\"><b>'+arr.customFields[inc].label+": "+arr.customFields[inc].value+'</b></div> </div>'
	len=arr.objects.length;
	results += "<div class=\"row\"><center><b>Objects</b></center></div><hr>";
	for(inc=0;inc<len;inc++)
		
    document.getElementById("details_area").innerHTML =results;
}

