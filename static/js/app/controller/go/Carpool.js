define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/searchMap/searchMap',
    'app/module/normalTextInput/normalTextInput',
    'app/module/validate/validate',
    'app/module/identity/identity',
    'app/module/bindMobile/bindMobile'
], function(base, Ajax, loading, searchMap, normalTextInput, Validate, Identity, BindMobile) {
	var startSite = {
		name: "",
		point: {
			lng: "",
			lat: ""
		}
	}, endSite = {
		name: "",
		point: {
			lng: "",
			lat: ""
		}
	};
    var isBindMobile = false, isIdentity = false;
    var code, orderCode;
    init();

    function init() {
        if(base.isLogin()){
            loading.createLoading();
            base.getUser()
                .then(function (res) {
                    loading.hideLoading();
                    if(res.success){
                        isBindMobile = !!res.data.mobile;
                        isIdentity = !!res.data.realName;
                    }else{
                        base.showMsg(res.msg);
                    }
                }, function () {
                    loading.hideLoading();
                });
        }
        setTimeout(function () {
            addListener();
        }, 1);
    }

    function addListener() {
        searchMap.addMap();
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
        normalTextInput.addCont({
            type: "Z",
            success: function(result){
                var rtn = $("#totalNum").val(result).valid();
                $("#showNum").text(result);
            },
            title: "拼车人数"
        });
        laydate({
            elem: '#choseDate',
            format: 'YYYY-MM-DD hh:mm',
            choose: function(datas){ //选择日期完毕的回调
                $("#showDate").text(datas);
                $("#outDatetime").val(datas).valid();
            },
            isclear: false, //是否显示清空
            min: laydate.now(),
            istime: true
        });

        $("#startSiteWrap").on("click", function (e) {
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
        	searchMap.showMap({
        		point: startSite.point,
        		text: startSite.name,
                showDw: true,
        		success: function (point, text) {
	        		startSite.name = text;
	        		startSite.point.lng = point.lng;
	        		startSite.point.lat = point.lat;
                    $("#showStartSite").text(text);
	        		$("#startSite").val(text).valid();
	        	}
        	});
        });
        $("#endSiteWrap").on("click", function (e) {
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
        	searchMap.showMap({
        		point: endSite.point,
        		text: endSite.name,
                showDw: true,
        		success: function (point, text) {
	        		endSite.name = text;
	        		endSite.point.lng = point.lng;
	        		endSite.point.lat = point.lat;
                    $("#showEndSite").text(text);
	        		$("#endSite").val(text).valid();
	        	}
        	});
        });
        $("#choseNum").on("click", function(){
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
            normalTextInput.showCont($("#totalNum").val());
        });
        $("#carpoolForm").validate({
            'rules': {
                "startSite": {
                    required: true,
                    maxlength: 255,
                    isNotFace: true
                },
                "endSite": {
                    required: true,
                    maxlength: 255,
                    isNotFace: true
                },
                "outDatetime": {
                    required: true,
                    isNotFace: true
                },
                "totalNum": {
                    required: true,
                    "Z+": true
                }
            }
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
            if($("#carpoolForm").valid()){
                loading.createLoading();
                // calculateDistancePrice(startSite.name, endSite.name);
        		searchMap.calculatePointDistance(startSite.point, endSite.point, [], submit, doError);
        	}
        });
    }
    function doError(msg){
    	base.showMsg(msg || "距离计算失败");
    }
    function submit(result){
        var data = $("#carpoolForm").serializeObject();
        data.distance = result;
        data.userId = base.getUserId();
        data.outDatetime = data.outDatetime + ":00";
        Ajax.post("618240", {
            json: data
        }).then(function (res) {
            // loading.hideLoading();
            if(res.success){
                code = res.data.code;
                orderCode = res.data.orderCode;
                getCarpool();
            }else{
                base.showMsg(res.msg);
            }
        }, function () {
            base.showMsg("拼车发布失败");
            loading.hideLoading();
        });
    }
    function getCarpool(){
        Ajax.get("618252", {
            code: code
        }).then(function (res) {
            loading.hideLoading();
            if(res.success){
                base.confirm("拼车申请提交成功，总价为 " + base.formatMoney(res.data.distancePrice) + "元。<br/>点击确认前往支付定金")
                    .then(function () {
                        location.href = "../pay/pay.html?code=" + orderCode + "&type=4";
                    }, function () {
                        history.back();
                    });
            }else{
                base.showMsg("拼车申请提交成功");
                setTimeout(function () {
                    history.back();
                }, 1000);
            }
        }, function () {
            base.showMsg("拼车申请提交成功");
            setTimeout(function () {
                history.back();
            }, 1000);
        })
    }
});
