define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'app/module/loading/loading',
    'app/util/dict'
], function(base, Ajax, dialog, loading, Dict) {
    var code = base.getUrlParam("code");
    var hotelOrderStatus = Dict.get("hotelOrderStatus");
    var hhType = {};
    init();

    function init() {
        if(!code){
            base.showMsg("未传入订单编号");
            return;
        }
        loading.createLoading();
        getOrder();
        addListeners();
    }

    function getOrder(){
        $.when(
            // base.getDictList("hh_type"),
            Ajax.get("618052", {code: code})
        ).then(function(res){
            if(res.success){
                getHotelAndRoom(res.data.hotalOrder.hotalCode, res.data.hotalOrder.hotalRoomCode);
                // $.each(res0.data, function(i, d) {
                //     hhType[d.dkey] = d.dvalue;
                // });
                var data = res.data.hotalOrder;
                $("#code").html(code);
                $("#createDatetime").html(base.formatDate(data.applyDatetime, 'yyyy-MM-dd hh:mm'));
                $("#status").html(hotelOrderStatus[data.status]);
                // $("#hotelPic").attr("src", base.getImg(data.pic1 || ""));
                $("#name").html(res.data.name);
                // $("#addr").html(getAddr(data));
                $("#datetime")
                    .html(base.formatDate(data.startDate, 'MM月dd号')+
                        ' - '+base.formatDate(data.endDate, 'MM月dd号')+'<span class="pl4">'+
                        base.calculateDays(data.startDate, data.endDate)+'晚'+data.quantity+'间</span>');
                $("#type").html(res.data.roomType);
                $("#checkInName").html(data.checkInName);
                $("#checkInMobile").html(data.checkInMobile);
                $("#applyNote").html(data.applyNote || "无");
                $("#amount").html(base.formatMoney(data.amount));
                $("#orderA").attr("href", "../go/hotel-detail.html?code=" + data.hotalCode);
                if(data.remark){
                    $("#remarkWrap").show();
                    $("#remark").html(data.remark);
                }
                if(data.status == "0")
                    $(".order-hotel-detail-btn0").removeClass("hidden");
                else if(data.status == "1")
                    $(".order-hotel-detail-btn1").removeClass("hidden");
            }else{
                base.showMsg("订单信息获取失败");
            }
            loading.hideLoading();
        }, function () {
            base.showMsg("订单信息获取失败");
        });
    }
    function getHotelAndRoom(hotelCode, roomCode) {
        $.when(
            Ajax.get("618012", {code: hotelCode}),
            Ajax.get("618032", {code: roomCode})
        ).then(function (res0, res1) {
            if(res0.success && res1.success){
                $("#addr").html(getAddr(res0.data.hotal));
                $("#hotelPic").attr("src", base.getImg(res1.data.picture));
            }
        })
    }
    function getAddr(data){
        return data.province + (data.city || "") + (data.area || "") + (data.detail || "");
    }
    function cancelOrder(){
        loading.createLoading("取消中...");
        Ajax.post("618041", {
            json: {
                orderCodeList: [code]
            }
        }).then(function(res){
                loading.hideLoading();
                if(res.success){
                    $("#status").html(hotelOrderStatus['91']);
                    base.showMsg("取消成功");
                    $(".order-hotel-detail-btn0, .order-hotel-detail-btn1").addClass("hidden");
                }else{
                    base.showMsg(res.msg || "取消失败");
                }
            }, function(){
                loading.hideLoading();
                base.showMsg("取消失败");
            });
    }
    function tuik(remark) {
        loading.createLoading("退款中...");
        Ajax.post("618045", {
            json: {
                code: code,
                remark: remark,
                updater: base.getUserId()
            }
        }).then(function(res){
                loading.hideLoading();
                if(res.success){
                    $("#status").html(hotelOrderStatus['2']);
                    base.showMsg("退款成功");
                    $(".order-hotel-detail-btn0, .order-hotel-detail-btn1").addClass("hidden");
                }else{
                    base.showMsg(res.msg || "退款失败");
                }
            }, function(){
                loading.hideLoading();
                base.showMsg("退款失败");
            });
    }
    function addListeners(){
        //支付
        $("#payBtn").on("click", function(){
            location.href = "../pay/pay.html?code=" + code + "&type=0";
        });
        //取消订单
        $("#cancelBtn").on("click", function(){
            base.confirm("确定取消订单吗？")
                .then(cancelOrder, base.emptyFun);
        });
        //退款申请
        $("#tuikBtn").on("click", function(){
            var d = dialog({
                title: '退款申请',
                content: '退款理由：<textarea id="cancelNote" class="dialog-textarea"></textarea>'+
                         '<div class="tr t_fa5555 hidden dialog-error-tip dialog-error-tip0">请填写退款理由</div>'+
                         '<div class="tr t_fa5555 hidden dialog-error-tip dialog-error-tip1">退款理由中包含非法字符</div>',
                ok: function (argument) {
                    var remark = $(".dialog-textarea").val();
                    if(!remark || remark.trim() == ""){
                        $(".dialog-error-tip1").addClass("hidden");
                        $(".dialog-error-tip0").removeClass("hidden");
                        return false;
                    }else if(!base.isNotFace(remark)){
                        $(".dialog-error-tip0").addClass("hidden");
                        $(".dialog-error-tip1").removeClass("hidden");
                        return false;
                    }
                    tuik(remark);
                },
                okValue: '确定',
                cancel: function(){
                    d.close().remove();
                },
                cancelValue: '取消'
            });
            d.showModal();
        });
    }

});
