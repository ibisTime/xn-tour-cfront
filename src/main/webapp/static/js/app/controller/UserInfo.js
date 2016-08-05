define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'Handlebars'
], function (base, Ajax, dialog, Handlebars) {
    $(function () {
    	var tradeFlag = false;
    	initView();
	    function initView() {
	        Ajax.get(APIURL + '/user', {})
	            .then(function (response) {
	                if (response.success) {
	                    var data = response.data;
	                    if(data.tradePwdStrength){
                        	tradeFlag = true;
                        	$("#uTop").attr("href", "./user_set.html?t=1");
                        }else{
                        	$("#uTop").attr("href", "./user_set.html?t=0");
                        }
	                    $("#mobile").text(data.mobile);
	                    sessionStorage.setItem("m", data.mobile);
	                } else {
	                	showMsg("暂时无法获取用户信息！");
	                }
	            });

	        Ajax.get(APIURL + "/account/infos/page", {"start": 0, "limit": 8}, true)
	            .then(function (response) {
	                if(response.success){
	                    $("#amount").text("￥"+(+response.data.list[0].amount / 1000).toFixed(2));
	                }else{
	                    $("#amount").text("--");
	                }
	            });

	        $("#fundList").on("click", function () {
	            location.href = "../account/fundDetails.html";
	        });
	        $("#withdraw").on("click", function () {
	            if(tradeFlag){
	                location.href = "../account/withdraw.html";
	            }else{
	                showMsg("请先设置交易密码！");
	            }
	        })
	    }
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