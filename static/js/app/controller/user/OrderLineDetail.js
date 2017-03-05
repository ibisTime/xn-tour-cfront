define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'app/module/loading/loading',
    'app/util/dict'
], function(base, Ajax, dialog, loading, Dict) {
    var code = base.getUrlParam("code");
    var lineOrderStatus = Dict.get("lineOrderStatus");
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
        Ajax.get("618152", {code: code})
            .then(function(res){
                if(res.success){
                    var data = res.data;
                    getLineInfo(data.lineCode);
                    $("#code").html(code);
                    $("#createDatetime").html(base.formatDate(data.applyDatetime, 'yyyy-MM-dd hh:mm'));
                    $("#status").html(lineOrderStatus[data.status]);
                    // $("#hotelPic").attr("src", base.getImg(data.hotal.pic1));
                    // $("#name").html(data.hotal.name);
                    // $("#addr").html(getAddr(data.hotal));
                    $("#applyNote").html(data.applyNote || "无");
                    $("#amount").html(base.formatMoney(data.amount));
                    $("#orderA").attr("href", "../go/line-detail.html?code=" + data.lineCode);
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

    function getLineInfo(lineCode){
        return Ajax.get("618102", {
            code: lineCode
        }).then(function(res){
            loading.hideLoading();
            if(res.success){
                var data = res.data;
                var pic = data.pathPic.split(/\|\|/), html = "";
                $("#linePic").attr("src", base.getImg(pic[0]));
                $("#name").html(data.name);
                $("#joinPlace").html(data.joinPlace);
            }else{
                base.showMsg(res.msg);
            }
        }, function(){
            base.showMsg("线路信息加载失败");
            loading.hideLoading();
        })
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
        loading.createLoading("提交申请中...");
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