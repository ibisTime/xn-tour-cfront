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
    function cancelOrder(){
        loading.createLoading("取消中...");
        Ajax.post("618452", {
            json: {
                orderCodeList: [code]
            }
        }).then(function(res){
                loading.hideLoading();
                if(res.success){
                    $("#status").html(commodityStatus['91']);
                    base.showMsg("取消成功");
                    $(".order-hotel-detail-btn0, .order-hotel-detail-btn1").addClass("hidden");
                }else{
                    base.showMsg(res.msg || "取消失败");
                }
            }, function(){
                loading.hideLoading();
                base.showMsg("取消失败");
            })
    }
    function tuik(remark) {
        loading.createLoading("退款中...");
        Ajax.post("618456", {
            json: {
                code: code,
                remark: remark,
                userId: base.getUserId()
            }
        }).then(function(res){
                loading.hideLoading();
                if(res.success){
                    $("#status").html(commodityStatus['2']);
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
            location.href = "../pay/pay.html?code=" + code + "&type=5";
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
