define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/showInMap/showInMap'
    // 'app/module/searchMap/searchMap'
], function(base, Ajax, loading, showInMap) {
	var startSite = "",
        endSite = "";
    var code = base.getUrlParam("code");
    init();

    function init() {
        if(!code){
            base.showMsg("未传入拼车单号");
            return;
        }
        getCarpool();
    	loading.createLoading();
    }

    function getCarpool() {
        Ajax.get("618252", {
            code: code
        }).then(function (res) {
            loading.hideLoading();
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
                location.href = "../pay/pay.html?code=" + res.data.code + "&type=4";
            }else{
                base.showMsg(res.msg);
            }
        }, function () {
            base.showMsg("参与拼车失败");
            loading.hideLoading();
        });
    }
});