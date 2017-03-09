define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {

	var code = $(location).attr('href').split('?')[1].split('&')[0].split('=')[1]
	
    init();

    function init() {
        addListener();
    }

    function addListener() {
		Ajax.get("618087",{"code":code})
			.then(function(res){
				if(res.success){
					var name = res.data.name;
					var actDate = "活动日期："+base.formatDate(res.data.startDate,"yyyy-MM-dd hh:mm") + " 至 " + base.formatDate(res.data.endDate,"yyyy-MM-dd hh:mm");
					var description = res.data.description;
					
					$("#name").html(name)
					$("#actDate").html(actDate)
					$("#description").html(description)
					$("#site").html("活动地点：" + res.data.site);
					
				}else{
					base.showMsg(res.msg);
				}
			})
    }
});