define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'app/module/loading/loading',
    'app/util/dict'
], function(base, Ajax, dialog, loading, Dict) {
    var code = base.getUrlParam("code");
    var busStatus = Dict.get("busStatus");
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
        Ajax.get("618255", {code: code})
            .then(function(res){
                if(res.success){
                    var data = res.data;
                    $("#code").html(code);
                    $("#createDatetime").html(base.formatDate(data.applyDatetime, 'yyyy-MM-dd hh:mm'));
                    $("#status").html(busStatus[data.status]);
                    $("#applyNote").html(data.applyNote);

                    getCarpool(data.carpoolCode);

                    var price = data.totalPrice || ( +(data.firstPayAmount || data.firstAmount) + +(data.secondPayAmount || data.secondAmount || 0) );
                    $("#price").html(base.formatMoney(price));
                    if(data.status == "0" || data.status == "1" || data.status == "2"){
                        if(data.status == "1" || data.status == "2")
                            $("#payBtn").val("支付尾款")
                        $(".order-hotel-detail-btn0").removeClass("hidden");
                    }
                }else{
                    base.showMsg("订单信息获取失败");
                }
                loading.hideLoading();
            }, function () {
                base.showMsg("订单信息获取失败");
            });
    }
    function getCarpool(code) {
        Ajax.get("618252", {
            code: code
        }).then(function(res){
            if(res.success){
                var data = res.data;
                $("#startSite").html(data.startSite);
                $("#endSite").html(data.endSite);
                $("#outDatetime")
                    .html(base.formatDate(data.outDatetime, 'yyyy-MM-dd hh:mm'));
                $("#takePartNum").html(data.takePartNum);
            }else{
                base.showMsg(res.msg);
            }
        }, function(){
            base.showMsg("拼车信息获取失败");
        });
    }
    function cancelOrder(remark){
        loading.createLoading("提交申请中...");
        Ajax.post("618243", {
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
            location.href = "../pay/pay.html?code=" + code + "&type=4";
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
    }

});