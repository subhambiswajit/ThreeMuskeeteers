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
    var len=arr.searchdata.length;
    var inc;
    var results='<div class="row" style="margin-bottom:2px;height:40px;"><a href="foreign_profile/'+arr.searchdata[0].id+'">'+'<div class="col s10 l10 m10">'+arr.searchdata[0].name+'-'+arr.searchdata[0].username+'</div>'+'<div class="col s2 l2 m2">'+arr.searchdata[0].type+'</div>'+'</a></div>';
    for(inc=1;inc<len;inc++)
    {
      results+='<div class="row" style="margin-bottom:2px;height:40px;"><a href="foreign_profile/'+arr.searchdata[inc].id+'">'+'<div class="col s10 l10 m10">'+arr.searchdata[inc].name+'-'+arr.searchdata[inc].username+'</div>'+'<div class="col s2 l2 m2">'+arr.searchdata[inc].type+'</div>'+'</a></div>';
    }
    results+='<div class="row" style="margin-bottom:0px;height:10px;">&nbsp;</div>';
    document.getElementById("panel1").innerHTML =results;
}

