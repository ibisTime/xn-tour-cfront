define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/bindMobile/bindMobile'
], function(base, Ajax, loading, BindMobile) {
    init();

    function init() {
        var code = base.getUrlParam("code");
        BindMobile.addMobileCont({
            success: function(res){
                base.goBackUrl("../user/user.html", true);
            },
            hideFn: function () {
                base.goBackUrl("../user/user.html", true);
            },
            error: function(msg){
                base.showMsg(msg);
            }
        });
        if(!code){
            loading.createLoading();
            getAppID();
            return;
        }
        if(!base.isLogin()){
            loading.createLoading("登录中...");
            wxLogin({
                code: code,
                companyCode: SYSTEM_CODE
            });
        }else{
            setTimeout(function () {
                base.goBackUrl("../user/user.html", true);
            }, 1000);
        }
    }
    function getAppID(){
        Ajax.get("806031", {
            companyCode: SYSTEM_CODE,
            account: "ACCESS_KEY",
            type: "3"
        })
        .then(function(res) {
            loading.hideLoading();
            if (res.success && res.data.length) {
                var appid = res.data[0].password;
                var redirect_uri = base.getDomain() + "/user/redirect.html";
                $("#iframe").attr("src", "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid +
                    "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo#wechat_redirect");
            } else {
                base.showMsg(res.msg || "非常抱歉，微信登录失败");
            }
        }, function() {
            loading.hideLoading();
            base.showMsg("非常抱歉，微信登录失败");
            setTimeout(function(){
                history.back();
            }, 1000);
        });
    }
    function wxLogin(param) {
        Ajax.post("618920", { json: param })    //805152
            .then(function(res) {
                if (res.success) {
                    base.setSessionUser(res);
                    base.getUser()
                        .then(function (res) {
                            loading.hideLoading();
                            if(res.success){
                                if(!res.data.mobile){
                                    BindMobile.showMobileCont();
                                }else{
                                    base.goBackUrl("../user/user.html", true);
                                }
                            }else{
                                base.goBackUrl("../user/user.html", true);
                            }
                        });
                } else {
                    loading.hideLoading();
                    base.showMsg(res.msg);
                }
            }, function() {
                loading.hideLoading();
                base.showMsg("非常抱歉，微信授权失败!");
            });
    }
});
