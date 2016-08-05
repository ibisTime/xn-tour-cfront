define([
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/common/Global',
    'app/views/operator/ShowMsg',
    'app/controllers/Helper',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query, Ajax, Global, ShowMsg, Helper) {
    var tradeFlag = false;
    function initView() {
        Ajax.get(Global.baseUrl + '/user', {})
            .then(function (response) {
                if (response.success) {
                    var data = response.data;
                    if(data.kind == "f2"){
                        sessionStorage.setItem("uKind", "f2");
                    }else{
                        sessionStorage.setItem("uKind", "f1");
                    }
                    if(data.tradePwdStrength){
                        tradeFlag = true;
                        var tradePD = $("#tradePwdDiv");
                        tradePD.find("i").removeClass("warning-icon").addClass("success-icon");
                        $("#tradePwdOp")
                            .html('<a class="r-edit" href="' + Global.baseUrl + '/user/reset_tradePwd.htm" target="_blank">修改</a>' +
                                '<span style="padding: 0 5px;color: #F39910;font-size: 13px;">|</span>' +
                                '<a class="r-edit" href="' + Global.baseUrl + '/user/find_tradePwd.htm" target="_blank">找回</a>');
                    }else{
                        var tradePD = $("#tradePwdDiv");
                        tradePD.find("i").removeClass("success-icon").addClass("warning-icon");
                        tradePD.find("a").attr("href", Global.baseUrl + "/user/set_tradePwd.htm").text("设置");
                    }
                    dom.byId("mobile").innerText = blurMobile(data.mobile);
                    sessionStorage.setItem("m", data.mobile);
                    $("#changeMobile").on("click", function () {
                        if(tradeFlag){
                            location.href = Global.baseUrl + "/user/changeMobile.htm";
                        }else{
                            new ShowMsg({
                                "msg": "请先设置交易密码！",
                                "btn": function () {
                                    this.close();
                                }
                            }).show();
                        }
                    });
                } else {
                    query(".cont-body")[0].innerHTML = "<span style='margin:80px 0;display:inline-block;font-size:30px;width: 100%;text-align: center;'>暂无数据</span>";
                }
            });

        Ajax.get(Global.baseUrl + "/account/infos/page", {"start": 0, "limit": 8}, true)
            .then(function (response) {
                if(response.success){
                    $("#amount").text(Global.roundAmount(response.data.list[0].amount / 1000, 2));
                }else{
                    $("#amount").text("--");
                }
            });

        $("#fundList").on("click", function () {
            location.href = Global.baseUrl + "/account/fundDetails.htm";
        });
        $("#withdraw").on("click", function () {
            if(tradeFlag){
                location.href = Global.baseUrl + "/account/withdraw.htm";
            }else{
                new ShowMsg({
                    "msg": "请先设置交易密码！",
                    "btn": function () {
                        this.close();
                    }
                }).show();
            }
        })
    }

    function blurMobile(mobile){
        if(mobile == undefined || mobile == ""){
            return "";
        }
        return mobile.substring(0, 3) + "****" + mobile.substring(7);
    }

    return {
        init: function() {
            initView();
            Helper.init();
        }
    }
});