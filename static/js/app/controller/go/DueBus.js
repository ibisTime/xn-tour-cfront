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
	}, unitPrice;
    init();

    function init() {
    	loading.createLoading();
        base.getDictList("bus_unit_price")
            .then(function (res) {
                if (res.success) {
                    unitPrice = +res.data[0].dkey;
                    addListener();
                } else {
                    base.showMsg(res.msg);
                }
                loading.hideLoading();
            }, function () {
                loading.hideLoading();
                base.showMsg("数据加载失败");
            });
    }

    function addListener() {
        searchMap.addMap();
        normalTextInput.addCont({
            type: "Z",
            success: function(result){
                var rtn = $("#totalNum").val(result).valid();
                $("#showNum").text(result);
                if(rtn){

                    $("#amount").html( base.formatMoney(+result * unitPrice) );
                }else{
                    $("#amount").html("--");
                }
            },
            title: "预定人数"
        });
        laydate({
            elem: '#choseDate',
            format: 'YYYY-MM-DD hh:mm',
            choose: function(datas){ //选择日期完毕的回调
                $("#showDate").text(datas);
                $("#outDatetime").val(datas);
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
	        		$("#startSite").val(text);
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
	        		$("#endSite").val(text);
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
	        		$("#midSite").val(text);
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

        data.otherInfo = {
            "sPoint": startSite.point,
            "ePoint": endSite.point,
            "mPoint": midSite.point,
            "unitPrice": unitPrice
        }

        sessionStorage.setItem("due-bus-info", JSON.stringify(data));
        location.href = "./bus-submit-order.html";
    }
});