define([
    'app/controller/base',
    'app/module/validate/validate',
    'app/module/loading/loading',
    'app/util/ajax',
    'app/module/identity/identity',
    'app/module/bindMobile/bindMobile'
], function(base, Validate, loading, Ajax, Identity, BindMobile) {
    var lineCode = base.getUrlParam("lineCode") || "";
    var lineInfo = sessionStorage.getItem("line-info");
    var totalHotelAmount = 0, totalLineAmount = 0, totalOutAmount = 0;
    var isBindMobile = false, isIdentity = false;

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
        $.when(
            base.getUser(),
            getLineInfo()
        ).then(function (res) {
            loading.hideLoading();
            if(res.success){
                isBindMobile = !!res.data.mobile;
                isIdentity = !!res.data.realName;
                addListener();
            }else{
                base.showMsg(res.msg);
            }
        }, function () {
            loading.hideLoading();
        });
        if(lineInfo){
            lineInfo = $.parseJSON(lineInfo);
            var lineCodeInfo;
            if(lineCodeInfo = lineInfo[lineCode]){
                setInfo(lineCodeInfo);
            }
        }
    }
    function getLineInfo() {
        return Ajax.get("618102", {
            code: lineCode
        }).then(function (res) {
            if(res.success){
                var outDateStart = base.formatDate(res.data.outDateStart, "yyyy-MM-dd"),
                    outDateEnd = base.formatDate(res.data.outDateEnd, "yyyy-MM-dd");
                $("#pathPic").attr("src", base.getImg(res.data.pathPic));
                $("#lineName").html(res.data.name);
                $("#lineDatetime").html(outDateStart + " ~ " + outDateEnd);
                $("#linePlace").html(res.data.joinPlace);
                $("#xlA").attr("href", "../travel/travel-detail.html?code=" + lineCode);
                initOutDate(outDateStart, outDateEnd);
            }else{
                base.showMsg(res.msg);
            }
        }, function () {
            base.showMsg("线路信息获取失败");
        })
    }
    function initOutDate(min, max){
        var start = {
            elem: '#choseStartDate',
            format: 'YYYY-MM-DD',
            min: min, //设定最小日期为当前日期
            max: max,
            start: min,
            isclear: false, //是否显示清空
            istoday: false,
            choose: function(datas) {
                $("#outDate").val(datas).trigger("change");
                $("#startSpan").text(datas);
            }
        };
        laydate(start);
    }
    function setInfo(lineCodeInfo){
        if(lineCodeInfo.hotelName){
            $("#roomPic").attr("src", lineCodeInfo.roomPic);
            $("#hotelName").html(lineCodeInfo.hotelName);
            $("#hotelAddr").html(lineCodeInfo.hotelAddr);
            var startDate = lineCodeInfo.startDate;
            var endDate = lineCodeInfo.endDate;
            var quantity = +lineCodeInfo.quantityHotal;
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
            $("#outNum").html(lineCodeInfo.quantitySpecial);
        }else{
            $("#cxxx-t, #cxxx").hide();
        }
        $("#totalLineAmount").html(base.formatMoney(lineCodeInfo.lineAmount));
        totalLineAmount = +lineCodeInfo.lineAmount;
        var totalAmount = totalHotelAmount + totalLineAmount + totalOutAmount;
        $("#price").html(base.formatMoney(totalAmount));
    }

    function addListener(){
        if(!isBindMobile){
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
        }
        if(!isIdentity){
            Identity.addIdentity({
                success: function(){
                    isIdentity = true;
                    if(!isBindMobile)
                        BindMobile.showMobileCont();
                },
                error: function(msg){
                    base.showMsg(msg);
                }
            })
        }
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
        	if($("#submitForm").valid()){
                if(!$("#outDate").val()){
                    base.showMsg("出行日期不能为空");
                    return;
                }
                submitOrder();
        	}
        });
	}

    function submitOrder(){
        loading.createLoading("提交中...");
        var data = $("#submitForm").serializeObject();
        data.applyUser = base.getUserId();
        data.lineCode = lineCode;
        var midObj = {};
        if(lineInfo && !$.isEmptyObject(lineInfo[lineCode])){
            midObj = $.extend({}, lineInfo[lineCode]);
            delete midObj.outName;
            delete midObj.outPic;
            delete midObj.outStartSite;
            delete midObj.outDatetime;
            delete midObj.totalOutAmount;

            delete midObj.hotelName;
            delete midObj.roomDescription;
            delete midObj.roomPic;
            delete midObj.roomName;
            delete midObj.roomPrice;
            delete midObj.hotelAddr;
            delete midObj.lineAmount;
            data = $.extend(data, midObj);
        }
        Ajax.get("618140", data).then(function(res){
            if(res.success){
                if(lineInfo && !$.isEmptyObject(lineInfo[lineCode])){
                    // delete lineInfo[lineCode];
                    sessionStorage.setItem("line-info", JSON.stringify(lineInfo));
                }
                location.href = "../pay/pay.html?code=" + res.data.code+"&type=1";
            }else{
                loading.hideLoading();
                base.showMsg(res.msg || "订单提交失败");
            }
        });
    }
});
