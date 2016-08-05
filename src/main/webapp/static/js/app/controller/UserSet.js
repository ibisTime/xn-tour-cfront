define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog'
], function (base, Ajax, dialog) {
    $(function () {
    	var t = base.getUrlParam("t") || "0";
    	if(t == "1"){
			$("#tradePwd").attr("href", "./find_tradePwd.html");
		}else{
			$("#tradePwd").attr("href", "./set_tradePwd.html").html('设置交易密码<i class="r-tip"></i>');
		}
    	$("#loginOut").on("click", function(){
    		$("#loaddingIcon").removeClass("hidden");
    		Ajax.post(APIURL + "/user/logout")
    			.then(function(res){
    				$("#loaddingIcon").addClass("hidden");
    				if(res.success){
                        location.href = '../home/index.html';
                    }else{
                    	showMsg(res.msg);
                    }
    			});
    	});
    	
    	function showMsg(cont){
	        var d = dialog({
	        	content: cont,
	            quickClose: true
	        });
	        d.show();
	        setTimeout(function () {
	            d.close().remove();
	        }, 2000);
	    }
    });
});