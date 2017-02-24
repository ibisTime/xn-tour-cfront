define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {

	init();
	function init(){
		loading.createLoading();
		getAboutus()
	}
	function getAboutus(){
		return Ajax.get("807717", {
            "ckey": "aboutus"
		}).then(function(res){
		 	if(res.success){
			 	//
			 	$("#content").html(res.data.cvalue);
			}else{
				base.showMsg("加载失败");
			}
		 	loading.hideLoading();
		}, function(){
		 	base.showMsg("加载失败");
		 	loading.hideLoading();
		});
	}
});