define([
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/common/Global',
    'app/common/Dict',
    'app/ux/GenericTooltip',
    'app/controllers/Helper',
    'app/views/operator/ShowMsg',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query,
            Ajax, Global, Dict, Tooltip, Helper, ShowMsg) {
    var config = {
        "accountNumber": "",
        "amount": "",
        "toType": "BC",
        "toCode": "",
        "toBelong": "",
        "tradePwd": ""
    }, currencyUnit = Dict.get("currencyUnit"), AMOUNT;
    function initView() {
        Ajax.get(Global.baseUrl + "/account/infos/page", {"start": 0, "limit": 8}, true)
            .then(function (response) {
                if(response.success){
                    var data = response.data.list[0];
                    config.accountNumber = data.accountNumber;
                    AMOUNT = data.amount;
                    $("#account_amount").text(currencyUnit[data.currency] + Global.roundAmount(AMOUNT / 1000, 2));
                }else{
                    
                }
            });
        addListeners();
    }

    function addListeners() {
        $("#bankCard").on("change", validate_bankCard)
            .on("keyup", enterListener);
        $("#amount").on("change", validate_amount)
            .on("keyup", enterListener);
        $("#trade_pwd").on("change", validate_tradePwd)
            .on("keyup", enterListener);
        $("#toBelong").on("change", validate_toBelong)
            .on("keyup", enterListener);
        $("#wdBtn").on("click", function () {
            if(validate()){
                $(this).attr("disabled", "disabled").css("cursor", "default").val("提交中...");
                config.amount = (+$("#amount").val()) * 1000;
                config.toCode = $("#bankCard").val();
                config.tradePwd = $("#trade_pwd").val();
                config.toBelong = $("#toBelong").val();
                withdraw();
            }
        });
    }
    function enterListener(e) {
        var keyCode = e.charCode || e.keyCode;
        if(keyCode == 13){
            $("#wdBtn").click();
        }
    }
    function validate_amount() {
        var flag = true, amount = $("#amount").val();
        if(amount == undefined || amount === ""){
            Tooltip.show("金额不能为空！", dom.byId("amount"), "warning");
            flag = false;
        }else if( !/^\d+(?:\.\d{1,2})?$/.test(amount) ) {
            Tooltip.show("金额只能是两位以内小数！", dom.byId("amount"), "warning");
            flag = false;
        }else if((+amount * 1000) > AMOUNT){
            Tooltip.show("取现金额必须小于可用金额！", dom.byId("amount"), "warning");
            flag = false;
        }else if(+amount <= 0){
            Tooltip.show("取现金额必须大于0！", dom.byId("amount"), "warning");
            flag = false;
        }
        return flag;
    }
    function validate_tradePwd() {
        if( $("#trade_pwd").val() == undefined || trim($("#trade_pwd").val()) === "" ){
            Tooltip.show("交易密码不能为空！", dom.byId("trade_pwd"), "warning");
            return false;
        }
        return true;
    }
    function validate_toBelong() {
        if( $("#toBelong").val() == undefined || trim($("#toBelong").val()) === "" ){
            Tooltip.show("开户支行不能为空！", dom.byId("toBelong"), "warning");
            return false;
        }
        return true;
    }
    function validate_bankCard() {
        if( $("#bankCard").val() == undefined || trim($("#bankCard").val()) === ""){
            Tooltip.show("银行卡不能为空！", dom.byId("bankCard"), "warning");
            return false;
        }else if( !/^\d{16}|\d{19}$/.test($("#bankCard").val()) ){
            Tooltip.show("银行卡格式错误！", dom.byId("bankCard"), "warning");
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
        Ajax.post(Global.baseUrl + "/account/doWithdraw", config)
            .then(function (response) {
                if(response.success){
                    new ShowMsg({
                        "msg": "取现申请提交成功！",
                        "btn": function () {
                            location.href = Global.baseUrl + "/user/user_info.htm";
                        }
                    }).show();
                }else{
                    Tooltip.show(response.msg, dom.byId("wdBtn"), "warning");
                    $("#wdBtn").css("cursor", "pointer").removeAttr("disabled").val("提交");
                }
            });
    }
    
    return {
        init: function() {
            initView();
            Helper.init();
        }
    }
});