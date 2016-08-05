define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'app/util/dict',
    'Handlebars'
], function (base, Ajax, dialog, Dict, Handlebars) {
    $(function () {
    	var config = {
	        "accountNumber": "",
	        "amount": "",
	        "toType": "BC",
	        "toCode": "",
	        "toBelong": "",
	        "tradePwd": ""
	    }, currencyUnit = Dict.get("currencyUnit"), AMOUNT;
	    
	    initView();

	    function initView() {
	        Ajax.get(APIURL + "/account/infos/page", {"start": 0, "limit": 8}, true)
	            .then(function (response) {
	                if(response.success){
	                    var data = response.data.list[0];
	                    config.accountNumber = data.accountNumber;
	                    AMOUNT = data.amount;
	                    $("#account_amount").text(currencyUnit[data.currency] + (+AMOUNT / 1000).toFixed(2));
	                }else{
	                    showMsg("账户信息获取失败！");
	                    $("#wdBtn").attr("disabled", "disabled");
	                }
	            });
	        addListeners();
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

	    function addListeners() {
	        $("#bankCard").on("change", validate_bankCard);
	        $("#amount").on("change", validate_amount);
	        $("#trade_pwd").on("change", validate_tradePwd);
	        $("#toBelong").on("change", validate_toBelong);
	        $("#wdBtn").on("click", function () {
	            if(validate()){
	                $(this).attr("disabled", "disabled").val("提交中...");
	                config.amount = (+$("#amount").val()) * 1000;
	                config.toCode = $("#bankCard").val();
	                config.tradePwd = $("#trade_pwd").val();
	                config.toBelong = $("#toBelong").val();
	                withdraw();
	            }
	        });
	    }
	    function validate_amount() {
	        var flag = true, me = $("#amount"), amount = me.val();
	        if(amount == undefined || amount === ""){
	            showMsg("取现金额不能为空！");
	            flag = false;
	        }else if( !/^\d+(?:\.\d{1,2})?$/.test(amount) ) {
	            showMsg("取现金额只能是两位以内小数！");
	            flag = false;
	        }else if((+amount * 1000) > AMOUNT){
	            showMsg("取现金额必须小于可用金额！");
	            flag = false;
	        }else if(+amount <= 0){
	            showMsg("取现金额必须大于0！");
	            flag = false;
	        }
	        return flag;
	    }
	    function validate_tradePwd() {
	        if( $("#trade_pwd").val() == undefined || trim($("#trade_pwd").val()) === "" ){
	            showMsg("交易密码不能为空！");
	            return false;
	        }
	        return true;
	    }
	    function validate_toBelong() {
	        if( $("#toBelong").val() == undefined || trim($("#toBelong").val()) === "" ){
	            showMsg("开户支行不能为空！");
	            return false;
	        }
	        return true;
	    }
	    function validate_bankCard() {
	        if( $("#bankCard").val() == undefined || trim($("#bankCard").val()) === ""){
	            showMsg("银行卡不能为空！");
	            return false;
	        }else if( !/^\d{16}|\d{19}$/.test($("#bankCard").val()) ){
	            showMsg("银行卡格式错误！");
	            return false;
	        }
	        return true;
	    }
	    function validate() {
	        return validate_amount() && validate_bankCard() && validate_tradePwd() && validate_toBelong();
	    }

	    function trim(str) {
	        return str == undefined ? "" : str.replace(/^\s*|\s*$/ig, "");
	    }

	    function withdraw() {
	        Ajax.post(APIURL + "/account/doWithdraw", config)
	            .then(function (response) {
	                if(response.success){
	                	$("#wdBtn").val("提交");
	                    showMsg("取现申请提交成功！");
	                    setTimeout(function(){
	                    	location.href = "../user/user_info.html";
	                    }, 1000);
	                }else{
	                    showMsg(response.msg);
	                    $("#wdBtn").removeAttr("disabled").val("提交");
	                }
	            });
	    }
    });
});