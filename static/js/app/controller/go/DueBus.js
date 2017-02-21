define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/searchMap/searchMap',
    'app/module/normalTextInput/normalTextInput'
], function(base, Ajax, loading, searchMap, normalTextInput) {
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
	}
    init();

    function init() {
    	loading.createLoading();
        searchMap.addMap();
        normalTextInput.addCont({
            type: "Z"
        });
        setTimeout(function () {
        	loading.hideLoading();
        	addListener();
        }, 1);
    }

    function addListener() {
        laydate({
            elem: '#choseDate',
            choose: function(datas){ //选择日期完毕的回调
                $("#showDate").text(datas);
            },
            isclear: false, //是否显示清空
            min: laydate.now()
        });
        $("#startSiteWrap").on("click", function (e) {
        	searchMap.showMap({
        		point: startSite.point,
        		text: startSite.name,
        		success: function (point, text) {
	        		startSite.name = text;
	        		startSite.point.lng = point.lng;
	        		startSite.point.lat = point.lat;
	        		$("#startSite").text(text);
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
	        		$("#endSite").text(text);
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
	        		$("#midSite").text(text);
	        	}
        	});
        });
        $("#sbtn").on("click", function () {
        	if(startSite.name && endSite.name && midSite.name){
        		searchMap.calculatePointDistance(startSite.point, endSite.point, [midSite.point], submit, doError);
        	}
        });
    }
    function doError(msg){
    	base.showMsg(msg || "距离计算失败");
    }
    function submit(result){
    	result.cg
    }
});