define([
    'app/controller/base',
    'app/module/validate/validate',
    'app/module/loading/loading',
    'app/util/ajax'
], function(base, Validate, loading, Ajax) {
    var lineCode = base.getUrlParam("lineCode") || "";
    var lineInfo = sessionStorage.getItem("line-info");
    var totalHotelAmount = 0, totalLineAmount = 0, totalOutAmount = 0;
    init();
    function init(){
        if(!lineCode){
            base.showMsg("未传入线路编号");
            return;
        }
        if(!base.isLogin()){
            base.goLogin();
            return;
        }
        loading.createLoading();
        getLineInfo();
        if(lineInfo){
            lineInfo = $.parseJSON(lineInfo);
            var lineCodeInfo;
            if(lineCodeInfo = lineInfo[lineCode]){
                setInfo(lineCodeInfo);
            }
        }
        addListener();
    }
    function getLineInfo() {
        Ajax.get("618102", {
            code: lineCode
        }).then(function (res) {
            loading.hideLoading();
            if(res.success){
                $("#pathPic").attr("src", base.getImg(res.data.pathPic));
                $("#lineName").html(res.data.name);
                $("#lineDatetime").html(base.formatDate(res.data.outDate, "yyyy-MM-dd hh:mm"));
                $("#linePlace").html(res.data.joinPlace);
                $("#xlA").attr("href", "../travel/travel-detail.html?code=" + lineCode);
            }else{
                base.showMsg(res.msg);
            }
        }, function () {
            loading.hideLoading();
            base.showMsg("线路信息获取失败");
        })
    }
    function setInfo(lineCodeInfo){
        if(lineCodeInfo.hotelName){
            $("#roomPic").attr("src", lineCodeInfo.roomPic);
            $("#hotelName").html(lineCodeInfo.hotelName);
            $("#hotelAddr").html(lineCodeInfo.hotelAddr);
            var startDate = lineCodeInfo.startDate;
            var endDate = lineCodeInfo.endDate;
            var quantity = +lineCodeInfo.quantity;
            var days = +base.calculateDays(startDate, endDate);
            totalHotelAmount = days * quantity * +lineCodeInfo.roomPrice;
            $("#hotelDatetime").html(
                base.formatDate(startDate, "M月d号") + " - " + base.formatDate(endDate, "M月d号") + 
                '<span class="plr4">'+days+'晚'+quantity+'间</span>');
            $("#roomType").html(lineCodeInfo.roomName);
            $("#totalHotelAmount").html(base.formatMoney(totalHotelAmount));
            $("#jdA").attr("href", "../go/hotel-detail.html?code=" + lineCodeInfo.hotalCode);
        }else{
            $("#jdxx-t, #jdxx").hide();
        }
        if(lineCodeInfo.outName){
            $("#outPic").attr("src", base.getImg(lineCodeInfo.outPic));
            $("#outName").html(lineCodeInfo.outName);
            $("#outStartSite").html(lineCodeInfo.outStartSite);
            $("#outDatetime").html(lineCodeInfo.outDatetime);
            totalOutAmount = +lineCodeInfo.totalOutAmount;
            $("#totalOutAmount").html(base.formatMoney(lineCodeInfo.totalOutAmount));
            $("#outNum").html(lineCodeInfo.outNum);
        }else{
            $("#cxxx-t, #cxxx").hide();
        }
        $("#totalLineAmount").html(base.formatMoney(lineCodeInfo.lineAmount));
        totalLineAmount = +lineCodeInfo.lineAmount;
        var totalAmount = totalHotelAmount + totalLineAmount + totalOutAmount;
        $("#price").html(base.formatMoney(totalAmount));
    }

    function addListener(){
		$("#submitForm").validate({
            'rules': {
                applyNote: {
                	isNotFace: true,
                	maxlength: 255
                }
            },
            onkeyup: false
        });
        $("#submitBtn").on("click", function(){
        	if($("#submitForm").valid()){
                submitOrder();
        	}
        });
	}

    function submitOrder(){
        loading.createLoading("提交中...");
        var data = $("#submitForm").serializeObject();
        data.applyUser = base.getUserId();
        data.lineCode = lineCode;
        if(lineInfo && !$.isEmptyObject(lineInfo[lineCode])){

            delete lineInfo[lineCode].outName;
            delete lineInfo[lineCode].outPic;
            delete lineInfo[lineCode].outStartSite;
            delete lineInfo[lineCode].outDatetime;
            delete lineInfo[lineCode].outNum;
            delete lineInfo[lineCode].totalOutAmount;

            delete lineInfo[lineCode].hotelName;
            delete lineInfo[lineCode].roomDescription;
            delete lineInfo[lineCode].roomPic;
            delete lineInfo[lineCode].roomName;
            delete lineInfo[lineCode].roomPrice;
            delete lineInfo[lineCode].hotelAddr;
            delete lineInfo[lineCode].lineAmount;
            data = $.extend(data, lineInfo[lineCode]);
        }
        Ajax.get("618140", data).then(function(res){
            if(res.success){
                if(lineInfo && !$.isEmptyObject(lineInfo[lineCode])){
                    delete lineInfo[lineCode];
                    sessionStorage.setItem("line-info", JSON.stringify(lineInfo));
                }
                location.href = "../pay/pay.html?code=" + res.data.code+"&type=1";
            }else{
                loading.hideLoading();
                base.showMsg(res.msg || "订单提交失败");
            }
        })
    }
});