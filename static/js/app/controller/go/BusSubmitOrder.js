define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/searchMap/searchMap',
    'app/module/validate/validate'
], function(base, Ajax, loading, searchMap, Validate) {
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
	}, busInfo;
    init();

    function init() {
    	loading.createLoading();
        busInfo = sessionStorage.getItem("due-bus-info");
        busInfo = busInfo && $.parseJSON(busInfo);
        if(busInfo){
            startSite.name = busInfo.startSite;
            startSite.point = busInfo.otherInfo.sPoint;
            endSite.name = busInfo.endSite;
            endSite.point = busInfo.otherInfo.ePoint;
            midSite.name = busInfo.midSite;
            midSite.point = busInfo.otherInfo.mPoint;
            var unitPrice = busInfo.otherInfo.unitPrice;
            delete busInfo.otherInfo;
            $("#showStartSite").html(startSite.name);
            $("#showEndSite").html(endSite.name);
            $("#showMidSite").html(midSite.name);
            $("#outDatetime").html(base.formatDate(busInfo.outDatetime, "yyyy-MM-dd hh:mm"));
            $("#totalNum").html(busInfo.totalNum);
            $("#unitPrice").html(base.formatMoney(unitPrice));
            $("#amount").html( base.formatMoney(+unitPrice * +busInfo.totalNum * +busInfo.distance) );
            addListener();
            loading.hideLoading();
        }else{
            loading.hideLoading();
            base.showMsg("大巴信息获取失败");
        }
    }

    function addListener() {
        searchMap.addMap();

        // $("#bookNote").on("keyup", function(){
        //     var val = $(this).val();
        //     if(!val)
        //         $("#bookNotePlaceholder").show();
        //     else
        //         $("#bookNotePlaceholder").hide();
        // });

        $("#submitForm").validate({
            'rules': {
                bookNote: {
                    isNotFace: true,
                    maxlength: 255
                }
            },
            onkeyup: false
        });

        $("#startSiteWrap").on("click", function (e) {
        	searchMap.showMap({
        		point: startSite.point,
        		text: startSite.name
        	});
        });
        $("#endSiteWrap").on("click", function (e) {
        	searchMap.showMap({
        		point: endSite.point,
        		text: endSite.name
        	});
        });
        $("#midSiteWrap").on("click", function (e) {
        	searchMap.showMap({
        		point: midSite.point,
        		text: midSite.name
        	});
        });
        $("#sbtn").on("click", function () {
            if($("#submitForm").valid()){
        		submit();
        	}
        });
    }
    function submit(result){
        loading.createLoading();
        busInfo.bookNote = $("#bookNote").val();
        Ajax.post("618210", {
            json: busInfo
        }).then(function(res){
            if(res.success){
                sessionStorage.removeItem("due-bus-info");
                location.href = "../pay/pay.html?code=" + res.data.code + "&type=3"; 
            }else{
                loading.hideLoading();
                base.showMsg(res.msg);
            }
        }, function(){
            loading.hideLoading();
            base.showMsg("订单提交失败")
        });
    }
});