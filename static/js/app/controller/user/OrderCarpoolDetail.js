define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'app/module/loading/loading',
    'app/util/dict'
], function(base, Ajax, dialog, loading, Dict) {
    var code = base.getUrlParam("code");
    var carpoolStatus = Dict.get("carpoolStatus");
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

    function getOrder(refresh){
        Ajax.get("618255", {code: code}, !refresh)
            .then(function(res){
                if(res.success){
                    var data = res.data;
                    $("#code").html(code);
                    $("#createDatetime").html(base.formatDate(data.applyDatetime, 'yyyy-MM-dd hh:mm'));
                    $("#status").html(carpoolStatus[data.status]);
                    $("#applyNote").html(data.applyNote);

                    getCarpool(data.carpoolCode);

                    // var price = data.totalPrice || ( +(data.firstPayAmount || data.firstAmount) + +(data.secondPayAmount || data.secondAmount || 0) );
                    // $("#price").html(base.formatMoney(price));
                    if(data.status == "0" || data.status == "1" || data.status == "97"){
                        if(data.status == "1")
                            $("#payBtn").val("支付尾款");
                        $(".order-hotel-detail-btn0").removeClass("hidden");
                    }
                }else{
                    loading.hideLoading();
                    base.showMsg("订单信息获取失败");
                }
            }, function () {
                loading.hideLoading();
                base.showMsg("订单信息获取失败");
            });
    }
    function getCarpool(code) {
        Ajax.get("618252", {
            code: code
        }).then(function(res){
            loading.hideLoading();
            if(res.success){
                var data = res.data;
                $("#startSite").html(data.startSite);
                $("#endSite").html(data.endSite);
                $("#outDatetime")
                    .html(base.formatDate(data.outDatetime, 'yyyy-MM-dd hh:mm'));
                $("#takePartNum").html(data.takePartNum);
                $("#price").html(base.formatMoney(data.curPrice));
            }else{
                base.showMsg(res.msg);
            }
        }, function(){
            loading.hideLoading();
            base.showMsg("拼车信息获取失败");
        });
    }
    function cancelOrder(){
        loading.createLoading("提交申请中...");
        Ajax.post("618243", {
            json: {
                orderCodeList: [code]
            }
        }).then(function(res){
                loading.hideLoading();
                if(res.success){
                    base.showMsg("申请提交成功");
                    loading.createLoading();
                    getOrder(true);
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
            base.confirm("确定取消订单吗？")
                .then(cancelOrder, base.emptyFun);
        });
    }

});