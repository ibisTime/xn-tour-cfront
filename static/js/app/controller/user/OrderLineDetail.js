define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'app/module/loading/loading',
    'app/util/dict'
], function(base, Ajax, dialog, loading, Dict) {
    var code = base.getUrlParam("code");
    var lineOrderStatus = Dict.get("lineOrderStatus");
    var specialModule = {};

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
    //专线数据字典
    function getSDict(){
        return Ajax.get("806052", {type: 3, location: 'goout'});
    }
    function getOrder(){
        Ajax.get("618152", {code: code})
            .then(function(res){
                loading.hideLoading();
                if(res.success){
                    var data = res.data;
                    $("#code").html(code);
                    $("#createDatetime").html(base.formatDate(data.applyDatetime, 'yyyy-MM-dd hh:mm'));
                    $("#status").html(lineOrderStatus[data.status]);
                    $("#applyNote").html(data.applyNote || "无");
                    $("#lineAmount").html(base.formatMoney(data.amount));
                    $("#lineOrderA").attr("href", "../travel/travel-detail.html?code=" + data.lineCode);
                    var pic = data.line.pathPic.split(/\|\|/);
                    $("#linePic").attr("src", base.getImg(pic[0]));
                    $("#name").html(data.line.name);
                    $("#joinPlace").html(data.line.joinPlace);
                    $("#outDate").html(base.formatDate(data.outDate, "yyyy-MM-dd"));

                    if(data.hotalOrder){
                        getHotelAndRoom(data.hotalOrder.hotalCode, data.hotalOrder.hotalRoomCode);
                        $("#hotelWrap").removeClass("hidden");
                        var data1 = data.hotalOrder;
                        $("#hotelName").html(data1.name);

                        $("#datetime")
                            .html(base.formatDate(data1.startDate, 'MM月dd号')+
                                ' - '+base.formatDate(data1.endDate, 'MM月dd号')+'<span class="pl4">'+
                                base.calculateDays(data1.startDate, data1.endDate)+'晚'+data1.quantity+'间</span>');
                        $("#checkInName").html(data1.checkInName);
                        $("#checkInMobile").html(data1.checkInMobile);
                        $("#hotelAmount").html(base.formatMoney(data1.amount));
                        $("#hotelOrderA").attr("href", "../go/hotel-detail.html?code=" + data1.hotalCode);
                    }
                    if(data.specialLineOrder){
                        var data2 = data.specialLineOrder;
                        $.when(
                            getSDict(),
                            getSpecialLine(data.specialLineOrder.specialLineCode)
                        ).then(function (res, res1) {
                            if(res.success && res1.success){
                                $.each(res.data, function(i, d){
                                    specialModule[d.code] = d.name;
                                });
                                var data = res1.data;
                                $("#pic").attr("src", base.getImg(data.pic));
                                $("#sType").html(specialModule[data.type]);
                                $("#address").html(data.address);
                                $("#outDatetime").html(base.formatDate(data.outDatetime, 'yyyy-MM-dd hh:mm'));
                            }else{
                                base.showMsg(res.msg || res1.msg);
                            }
                        }, function () {
                            base.showMsg("专线加载失败");
                        })
                        $("#specLineWrap").removeClass("hidden");
                        $("#quantity").html(data2.quantity);
                        $("#applyNote").html(data2.applyNote || "无");
                        $("#specAmount").html(base.formatMoney(data2.amount));
                        $("#specOrderA").attr("href", "../go/special-line-detail.html?code=" + data2.specialLineCode);
                    }
                    if(data.status == "0")
                        $(".order-hotel-detail-btn0").removeClass("hidden");
                    else if(data.status == "1")
                        $(".order-hotel-detail-btn1").removeClass("hidden");
                }else{
                    base.showMsg(res.msg);
                    loading.hideLoading();
                }
            }, function(){
                base.showMsg("订单信息获取失败");
                loading.hideLoading();
            });
    }
    function getHotelAndRoom(hotelCode, roomCode) {
        $.when(
            Ajax.get("618012", {code: hotelCode}),
            Ajax.get("618032", {code: roomCode})
        ).then(function (res0, res1) {
            if(res0.success && res1.success){
                $("#type").html(res1.data.name);
                $("#addr").html(getAddr(res0.data.hotal));
                $("#hotelPic").attr("src", base.getImg(res1.data.picture));
            }
        })
    }
    function getAddr(data){
        return data.province + (data.city || "") + (data.area || "") + (data.detail || "");
    }
    function getSpecialLine(code) {
        return Ajax.get("618172", {code: code});
    }

    function cancelOrder(remark){
        loading.createLoading("提交申请中...");
        Ajax.post("618141", {
            json: {
                orderCodeList: [code]
            }
        }).then(function(res){
                loading.hideLoading();
                if(res.success){
                    $("#status").html(lineOrderStatus['91']);
                    base.showMsg("申请提交成功");
                    $(".order-hotel-detail-btn0, .order-hotel-detail-btn1").addClass("hidden");
                }else{
                    base.showMsg(res.msg || "申请失败");
                }
            }, function(){
                loading.hideLoading();
                base.showMsg("申请失败");
            })
    }
    function tuik(remark){
        loading.createLoading("退款中...");
        Ajax.post("618145", {
            json: {
                code: code,
                remark: remark,
                userId: base.getUserId()
            }
        }).then(function(res){
                loading.hideLoading();
                if(res.success){
                    $("#status").html(lineOrderStatus['2']);
                    base.showMsg("退款成功");
                    $(".order-hotel-detail-btn0, .order-hotel-detail-btn1").addClass("hidden");
                }else{
                    base.showMsg(res.msg || "退款失败");
                }
            }, function(){
                loading.hideLoading();
                base.showMsg("退款失败");
            })
    }
    function addListeners(){
        //支付
        $("#payBtn").on("click", function(){
            location.href = "../pay/pay.html?code=" + code + "&type=1";
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
