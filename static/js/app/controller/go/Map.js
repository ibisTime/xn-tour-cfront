define([
    'app/controller/base'
], function(base) {
	
    var opt = {
        lng: base.getUrlParam('longitude'),
        lat: base.getUrlParam('latitude')
    }

    init();

    function init() {
    	var defaultOpt = {
	        title: "位置",
	        lng: '120.21937542',
	        lat: '30.25924446'
	    };
        defaultOpt = $.extend(defaultOpt, opt);
        var map = new BMap.Map("J_OnePointMapCont");
        var point = new BMap.Point(defaultOpt.lng, defaultOpt.lat);
        map.centerAndZoom(point, 12);
        var marker = new BMap.Marker(point);// 创建标注
        map.addOverlay(marker);             // 将标注添加到地图中
        //marker.disableDragging();           // 不可拖拽
        map.enableScrollWheelZoom(true);
    }
});