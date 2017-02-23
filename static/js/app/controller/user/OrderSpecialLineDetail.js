define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'app/module/loading/loading',
    'app/util/dict'
], function(base, Ajax, dialog, loading, Dict) {
    var code = base.getUrlParam("code");
    var orderStatus = Dict.get("specialLineOrderStatus");
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
        return Ajax.get("806052", {type: 3, location: 'goout'})
            .then(function(res){
                if(res.success){
                    $.each(res.data, function(i, d){
                        specialModule[d.code] = d.name;
                    });
                }else{
                    base.showMsg(res.msg);
                }
            }, function(){
                base.showMsg("数据加载失败");
            });
    }
    function getOrder(){
        $.when(
            Ajax.get("806052", {type: 3, location: 'goout'}),
            Ajax.get("618192", {code: code})
        ).then(function(res0, res){
            if(res0.success && res.success){
                $.each(res0.data, function(i, d){
                    specialModule[d.code] = d.name;
                });
                var data = res.data;
                $("#code").html(code);
                $("#createDatetime").html(base.formatDate(data.applyDatetime, 'yyyy-MM-dd hh:mm'));
                $("#status").html(orderStatus[data.status]);
                getSpecialLine(data.specialLineCode);
                // $("#pic").attr("src", base.getImg(data.specialLine.pic));
                // $("#sType").html(specialModule[data.specialLine.type]);
                // $("#address").html(data.specialLine.address);
                // $("#outDatetime").html(base.formatDate(data.specialLine.outDatetime, 'yyyy-MM-dd hh:mm'));
                $("#quantity").html(data.quantity);
                $("#applyNote").html(data.applyNote || "无");
                $("#amount").html(base.formatMoney(data.amount));
                $("#orderA").attr("href", "../go/special-line-detail.html?code=" + data.code);
                if(data.status == "0")
                    $(".order-hotel-detail-btn0").removeClass("hidden");
                else if(data.status == "1")
                    $(".order-hotel-detail-btn1").removeClass("hidden");
            }else{
                loading.hideLoading();
                base.showMsg(res0.msg || res.msg);
            }
        }, function () {
            base.showMsg("订单信息获取失败");
        });
    }

    function getSpecialLine(code) {
        Ajax.get("618172", {code: code})
            .then(function (res) {
                loading.hideLoading();
                if(res.success){
                    var data = res.data;
                    $("#pic").attr("src", base.getImg(data.pic));
                    $("#sType").html(specialModule[data.type]);
                    $("#address").html(data.address);
                    $("#outDatetime").html(base.formatDate(data.outDatetime, 'yyyy-MM-dd hh:mm'));
                }else{
                    base.showMsg(res.msg);
                }
            }, function () {
                base.showMsg("线路信息加载失败");
            })
    }

    function cancelOrder(remark){
        loading.createLoading("提交申请中...");
        Ajax.post("618182", {
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
    function addListeners(){
        //支付
        $("#payBtn").on("click", function(){
            location.href = "../pay/pay.html?code=" + code + "&type=2";
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
    }

});