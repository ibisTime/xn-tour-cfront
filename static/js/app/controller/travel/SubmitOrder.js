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
        if(lineInfo){
            lineInfo = $.parseJSON(lineInfo);
            var lineCodeInfo;
            if(lineCodeInfo = lineInfo[lineCode]){
                setInfo(lineCodeInfo);
            }
        }
        addListener();
    }
    function setInfo(lineCodeInfo){
        if(lineCodeInfo.hotelName){
            $("#hotelPic").attr("src", lineCodeInfo.roomPic);
            $("#name").html(lineCodeInfo.hotelName);
            $("#addr").html(lineCodeInfo.hotelAddr);
            var startDate = lineCodeInfo.startDate;
            var endDate = lineCodeInfo.endDate;
            var quantity = +lineCodeInfo.quantity;
            var days = +base.calculateDays(startDate, endDate);
            totalHotelAmount = days * quantity * +lineCodeInfo.roomPrice;
            $("#datetime").html(
                base.formatDate(startDate, "M月d号") + " - " + base.formatDate(endDate, "M月d号") + 
                '<span class="plr4">'+days+'晚'+quantity+'间</span>');
            $("#type").html(lineCodeInfo.roomTypeName);
            $("#amount").html(base.formatMoney(totalHotelAmount));
        }else{
            $("#jdxx-t, #jdxx").hide();
        }
        totalLineAmount = +lineCodeInfo.lineAmount;
        var totalAmount = totalHotelAmount + totalLineAmount + totalOutAmount;
        $("#price").html(base.formatMoney(totalAmount));
    }

    function addListener(){
		$("#applyNote").on("keyup", function(){
			var val = $(this).val();
			if(!val)
				$("#applyPlaceholder").show();
			else
				$("#applyPlaceholder").hide();
		});
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
            delete lineInfo[lineCode].hotelName;
            delete lineInfo[lineCode].outName;
            delete lineInfo[lineCode].roomDescription;
            delete lineInfo[lineCode].roomPic;
            delete lineInfo[lineCode].roomTypeName;
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