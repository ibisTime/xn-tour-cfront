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
            base.getDictList("hh_type"),
            Ajax.get("618052", {code: code})
        ).then(function(res0, res){
            if(res0.success && res.success){
                $.each(res0.data, function(i, d){
                    hhType[d.dkey] = d.dvalue;
                });
                var data = res.data;
                $("#code").html(code);
                $("#createDatetime").html(base.formatDate(data.applyDatetime, 'yyyy-MM-dd hh:mm'));
                $("#status").html(hotelOrderStatus[data.status]);
                $("#hotelPic").attr("src", base.getImg(data.hotal.pic1));
                $("#name").html(data.hotal.name);
                $("#addr").html(getAddr(data.hotal));
                $("#datetime")
                    .html(base.formatDate(data.startDate, 'MM月dd号')+
                        ' - '+base.formatDate(data.endDate, 'MM月dd号')+'<span class="pl4">'+
                        base.calculateDays(data.startDate, data.endDate)+'晚'+data.quantity+'间</span>');
                $("#type").html(hhType[data.hotal.type]);
                $("#checkInName").html(data.checkInName);
                $("#checkInMobile").html(data.checkInMobile);
                $("#applyNote").html(data.applyNote || "无");
                $("#amount").html(base.formatMoney(data.amount));
                $("#orderA").attr("href", "../go/hotel-detail.html?code=" + data.code);
                if(data.status == "1")
                    $(".order-hotel-detail-btn0").removeClass("hidden");
                else if(data.status == "2")
                    $(".order-hotel-detail-btn1").removeClass("hidden");
                else if(data.status == "6")
                    $(".order-hotel-detail-btn2").removeClass("hidden");
            }else{
                base.showMsg("订单信息获取失败");
            }
            loading.hideLoading();
        });
    }

    function getAddr(data){
        return data.province + (data.city || "") + (data.area || "") + (data.detail || "");
    }
    function cancelOrder(remark){
        loading.createLoading("提交申请中...");
        Ajax.post("618043", {
            json: {
                code: code,
                remark: remark,
                userId: base.getUserId()
            }
        }).then(function(res){
                loading.hideLoading();
                if(res.success){
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
    function tuikcx(remark){
        loading.createLoading("提交申请中...");
        Ajax.post("618047", {
            json: {
                code: code,
                remark: remark,
                userId: base.getUserId()
            }
        }).then(function(res){
                loading.hideLoading();
                if(res.success){
                    base.showMsg("申请提交成功");
                    $(".order-hotel-detail-btn2").addClass("hidden");
                }else{
                    base.showMsg(res.msg || "申请失败");
                }
            }, function(){
                loading.hideLoading();
                base.showMsg("申请失败");
            })
    }
    function addListeners(){
        //支付
        $("#payBtn").on("click", function(){
            location.href = "../pay/pay.html?code=" + code + "&type=0";
        });
        //取消订单
        $("#cancelBtn").on("click", function(){
            var d = dialog({
                title: '取消订单',
                content: '取消理由：<textarea id="cancelNote" class="dialog-textarea"></textarea>'+
                    '<div class="tr t_fa5555 hidden dialog-error-tip dialog-error-tip0">请填写取消理由</div>'+
                    '<div class="tr t_fa5555 hidden dialog-error-tip dialog-error-tip1">取消理由中包含非法字符</div>',
                ok: function (argument) {
                    var remark = $(".dialog-textarea").val();
                    if(!remark || remark.trim() == ""){
                        $(".dialog-error-tip0").removeClass("hidden");
                        $(".dialog-error-tip1").addClass("hidden");
                        return false;
                    } else if(!base.isNotFace(remark)){
                        $(".dialog-error-tip0").addClass("hidden");
                        $(".dialog-error-tip1").removeClass("hidden");
                        return false;
                    }
                    cancelOrder(remark);
                },
                okValue: '确定',
                cancel: function(){
                    d.close().remove();
                },
                cancelValue: '取消'
            });
            d.showModal();
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
                    cancelOrder(remark);
                },
                okValue: '确定',
                cancel: function(){
                    d.close().remove();
                },
                cancelValue: '取消'
            });
            d.showModal();
        });
        //撤销退款
        $("#tuikchBtn").on("click", function(){
            var d = dialog({
                title: '撤销退款申请',
                content: '撤销退款理由：<textarea id="cancelNote" class="dialog-textarea"></textarea>'+
                         '<div class="tr t_fa5555 hidden dialog-error-tip dialog-error-tip0">请填写撤销退款理由</div>'+
                         '<div class="tr t_fa5555 hidden dialog-error-tip dialog-error-tip1">撤销退款理由中包含非法字符</div>',
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
                    tuikcx(remark);
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