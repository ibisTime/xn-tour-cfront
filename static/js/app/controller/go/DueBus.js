define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/searchMap/searchMap',
    'app/module/normalTextInput/normalTextInput',
    'app/module/validate/validate'
], function(base, Ajax, loading, searchMap, normalTextInput, Validate) {
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
	}, midSite = {
		name: "",
		point: {
			lng: "",
			lat: ""
		}
	};
    init();

    function init() {
        setTimeout(function () {
            addListener();
        }, 1);
    }

    function addListener() {
        searchMap.addMap();
        normalTextInput.addCont({
            type: "Z",
            success: function(result){
                var rtn = $("#totalNum").val(result).valid();
                $("#showNum").text(result);
            },
            title: "预定人数"
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
        	searchMap.showMap({
        		point: startSite.point,
        		text: startSite.name,
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
        	searchMap.showMap({
        		point: endSite.point,
        		text: endSite.name,
        		success: function (point, text) {
	        		endSite.name = text;
	        		endSite.point.lng = point.lng;
	        		endSite.point.lat = point.lat;
                    $("#showEndSite").text(text);
	        		$("#endSite").val(text).valid();
	        	}
        	});
        });
        $("#midSiteWrap").on("click", function (e) {
        	searchMap.showMap({
        		point: midSite.point,
        		text: midSite.name,
        		success: function (point, text) {
	        		midSite.name = text;
	        		midSite.point.lng = point.lng;
	        		midSite.point.lat = point.lat;
                    $("#showMidSite").text(text);
	        		$("#midSite").val(text).valid();
	        	}
        	});
        });
        $("#choseNum").on("click", function(){
            normalTextInput.showCont($("#totalNum").val());
        });
        $("#deuBusForm").validate({
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
                "midSite": {
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
                },
                "bookNote": {
                    isNotFace: true,
                    maxlength: 255
                }
            }
        });
        $("#sbtn").on("click", function () {
            if($("#deuBusForm").valid()){
                loading.createLoading();
        		searchMap.calculatePointDistance(startSite.point, endSite.point, [midSite.point], submit, doError);
        	}
        });
    }
    function doError(msg){
        loading.hideLoading();
    	base.showMsg(msg || "距离计算失败");
    }
    function submit(result){
        var data = $("#deuBusForm").serializeObject();
        data.distance = result.cg;
        data.booker = base.getUserId();
        data.outDatetime = data.outDatetime + ":00";
        Ajax.post("618210", {
            json: data
        }).then(function(res){
            if(res.success){
                getOrderDetail(res.data.code);
            }else{
                loading.hideLoading();
                base.showMsg(res.msg);
            }
        }, function(){
            loading.hideLoading();
            base.showMsg("订单提交失败")
        });
    }
    function getOrderDetail(code) {
        Ajax.get("618222", {code: code})
            .then(function (res) {
                loading.hideLoading();
                if(res.success){
                    base.confirm("大巴预定成功，总价为：" + base.formatMoney(res.data.distancePrice) + "。<br/>点击确认前往支付")
                        .then(function () {
                            location.href = "../pay/pay.html?code=" + code + "&type=3"; 
                        }, function () {
                            history.back();
                        });
                }else{
                    base.showMsg("大巴预定成功");
                    setTimeout(function () {
                        history.back();
                    }, 1000);
                }
            }, function () {
                loading.hideLoading();
                base.showMsg("大巴预定成功");
                setTimeout(function () {
                    history.back();
                }, 1000);
            });
    }
});