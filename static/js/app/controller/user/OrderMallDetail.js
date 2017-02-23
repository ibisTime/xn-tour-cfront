define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'app/module/loading/loading',
    'app/util/dict',
    'app/util/handlebarsHelpers'
], function(base, Ajax, dialog, loading, Dict, Handlebars) {
    var code = base.getUrlParam("code");
    var commodityStatus = Dict.get("commodityStatus");
    var tmpl = __inline("../../ui/order-mall-items.handlebars");
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
            base.getDictList("wl_company"),
            Ajax.get("618472", {code: code})
        ).then(function(res0, res){
            if(res0.success && res.success){
                var data = res.data;
                $("#code").html(code);
                $("#createDatetime").html(base.formatDate(data.applyDatetime, 'yyyy-MM-dd hh:mm'));
                $("#status").html(commodityStatus[data.status]);

                $("#content").html( tmpl({items: data.productOrderList}) );
                $("#receiver").html(data.receiver);
                $("#reMobile").html(data.reMobile);
                $("#reAddress").html(data.reAddress);

                if(data.logisticsCode){
                    $("#logisticsTitle, #logisticsCont").removeClass("hidden");
                    var logisticsArr = res0.data;
                    $("#logisticsCode").html(data.logisticsCode);
                    $("#logisticsCompany").html(base.findObj(logisticsArr, "dkey", data.logisticsCompany)['dvalue']);
                }

                $("#applyNote").html(data.applyNote || "无");

                if(data.status == "0")
                    $(".order-hotel-detail-btn0").removeClass("hidden");
                else if(data.status == "1")
                    $(".order-hotel-detail-btn1").removeClass("hidden");
            }else{
                base.showMsg(res0.msg || res.msg || "订单信息获取失败");
            }
            loading.hideLoading();
        }, function () {
            base.showMsg("订单信息获取失败");
        });
    }

    function cancelOrTkOrder(bizType, remark){
        loading.createLoading("提交申请中...");
        Ajax.post(bizType, {
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
    function tuikOrder(remark) {
        cancelOrTkOrder("618461", remark);
    }
    function cancelOrder(remark) {
        cancelOrTkOrder("618455", remark);
    }
    function addListeners(){
        //支付
        $("#payBtn").on("click", function(){
            location.href = "../pay/pay.html?code=" + code + "&type=5";
        });
        //取消订单
        $("#cancelBtn").on("click", function(){
            showCancelOrTKModal(cancelOrder);
        });
        //退款申请
        $("#tuikBtn").on("click", function(){
            showCancelOrTKModal(tuikOrder, 1);
        });
    }
    function showCancelOrTKModal(success, type) {
        var str1 = type ? "请填写退款理由" : "请填写取消理由",
            str2 = type ? "退款理由中包含非法字符" : "取消理由中包含非法字符",
            title = type ? "退款申请" : "取消订单";

        var d = dialog({
            title: title,
            content: '理由：<textarea id="cancelNote" class="dialog-textarea"></textarea>' +
                '<div class="tr t_fa5555 hidden dialog-error-tip dialog-error-tip0">' + str1 + '</div>' +
                '<div class="tr t_fa5555 hidden dialog-error-tip dialog-error-tip1">' + str2 + '</div>',
            ok: function(argument) {
                var remark = $(".dialog-textarea").val();
                if (!remark || remark.trim() == "") {
                    $(".dialog-error-tip0").removeClass("hidden");
                    $(".dialog-error-tip1").addClass("hidden");
                    return false;
                } else if (!base.isNotFace(remark)) {
                    $(".dialog-error-tip0").addClass("hidden");
                    $(".dialog-error-tip1").removeClass("hidden");
                    return false;
                }
                success(remark);
            },
            okValue: '确定',
            cancel: function() {
                d.close().remove();
            },
            cancelValue: '取消'
        });
        d.showModal();
    }
});