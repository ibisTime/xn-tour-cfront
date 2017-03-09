define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/showInMap/showInMap',
    'app/module/identity/identity',
    'app/module/bindMobile/bindMobile'
], function(base, Ajax, loading, showInMap, Identity, BindMobile) {
	var startSite = "",
        endSite = "";
    var code = base.getUrlParam("code");
    init();

    function init() {
        if(!code){
            base.showMsg("未传入拼车单号");
            return;
        }
        loading.createLoading();
        $.when(
            base.getUser(),
            getCarpool()
        ).then(function (res) {
            loading.hideLoading();
            if(res.success){
                isBindMobile = !!res.data.mobile;
                isIdentity = !!res.data.realName;
            }else{
                base.showMsg(res.msg);
            }
        }, function () {
            loading.hideLoading();
            base.showMsg("用户信息获取失败");
        });
    }

    function getCarpool() {
        return Ajax.get("618252", {
            code: code
        }).then(function (res) {
            if(res.success){
                startSite = res.data.startSite;
                endSite = res.data.endSite;
                outDatetime = res.data.outDatetime;
                takePartNum = res.data.takePartNum;
                amount = res.data.nextPrice;
                $("#startSite").html(startSite);
                $("#endSite").html(endSite);
                $("#outDatetime").html(base.formatDate(outDatetime, "yyyy-MM-dd hh:mm"));
                $("#amount").html(base.formatMoney(amount));
                $("#takePartNum").html(takePartNum);
                addListener();
            }else{
                base.showMsg(res.msg);
            }
        }, function () {
            base.showMsg("获取拼车信息失败");
        });
    }

    function addListener() {
        showInMap.addMap();
        BindMobile.addMobileCont({
            success: function(res){
                isBindMobile = true;
                if(!isIdentity)
                    Identity.showIdentity();
            },
            error: function(msg){
                base.showMsg(msg);
            }
        });
        Identity.addIdentity({
            success: function(){
                isIdentity = true;
                if(!isBindMobile)
                    BindMobile.showMobileCont();
            },
            error: function(msg){
                base.showMsg(msg);
            }
        });
        $("#startSiteWrap").on("click", function (e) {
            showInMap.showMapByName(startSite);
        });
        $("#endSiteWrap").on("click", function (e) {
            showInMap.showMapByName(endSite);
        });
        $("#sbtn").on("click", function () {
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
            if(!isBindMobile || !isIdentity){
                if(!isBindMobile && !isIdentity){
                    base.confirm("您还未实名认证，点击确认前往实名认证，并绑定手机号")
                        .then(function () {
                            Identity.showIdentity();
                        }, base.emptyFun);
                }else if(!isIdentity){
                    base.confirm("您还未实名认证，点击确认前往实名认证")
                        .then(function () {
                            Identity.showIdentity();
                        }, base.emptyFun);
                }else if(!isBindMobile){
                    base.confirm("您还未绑定手机号，点击确认前往绑定手机号")
                        .then(function () {
                            BindMobile.showMobileCont();
                        }, base.emptyFun);
                }
                return;
            }
            submit();
        });
    }
    function submit(){
        loading.createLoading();
        Ajax.post("618241", {
            json: {
                carpoolCode: code,
                userId: base.getUserId()
            }
        }).then(function (res) {
            loading.hideLoading();
            if(res.success){
                base.confirm("申请提交成功，点击确认前往支付")
                    .then(function () {
                        location.href = "../pay/pay.html?code=" + res.data.code + "&type=4";
                    }, function () {
                        location.href = "./go.html";
                    })
            }else{
                base.showMsg(res.msg);
            }
        }, function () {
            base.showMsg("参与拼车失败");
            loading.hideLoading();
        });
    }
});