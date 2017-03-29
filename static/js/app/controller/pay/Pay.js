define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {
    var code = base.getUrlParam("code");
    // 0:酒店 1:线路 2:专线 3:大巴 4:拼车 5:商品
    var type = base.getUrlParam("type") || 0;
    var choseIdx = 1,
        bizType, payBizType;

    init();

    function init() {
        if (!code) {
            base.showMsg("未传入订单编号");
            return;
        }
        if (!base.isLogin()) {
            base.goLogin();
            return;
        }
        bizType = "618052";
        payBizType = "618042";
        // 0:酒店 1:线路 2:专线 3:大巴 4:拼车 5:商品
        if (type == 1) {
            bizType = "618152";
            payBizType = "618142";
        } else if (type == 2) {
            bizType = "618192";
            payBizType = "618182";
        } else if (type == 3) {
            bizType = "618222";
            payBizType = "618212";
        } else if (type == 4) {
            bizType = "618255";
            payBizType = "618242"; //尾款：618246
        } else if (type == 5) {
            bizType = "618472";
            payBizType = "618453";
            $("#content").hide();
            $("#content1").show();
        }
        $.when(
            getAccount(),
            getCont()
        ).then(function () {
            loading.hideLoading();
        }, function () {
            loading.hideLoading();
        })
    }

    function getAccount() {
        return Ajax.get("802503", {
            userId: base.getUserId()
        }).then(function (res) {
            if(res.success && res.data.length){
                var data = res.data;
                $.each(data, function (i, d) {
                    if(d.currency == "XNB")
                        $("#XNBAmount").html(base.fZeroMoney(d.amount));
                    else if(d.currency == "CNY")
                        $("#CNYAmount").html(base.formatMoney(d.amount));
                });
            }else{
                res.msg && base.showMsg(res.msg);
            }
        }, function () {
            base.showMsg("账号信息获取失败");
        });
    }

    function addListener() {
        $("#content").on("click", ".pay-item", function() {
            var _self = $(this),
                idx = _self.index();
            _self.siblings(".active").removeClass("active");
            _self.addClass("active");
            choseIdx = idx;
        });
        $("#payBtn").on("click", function() {
            if (type != 5) {
                if (choseIdx == 1) {
                    // 微信支付
                    wxPayOrder();
                } else if(choseIdx == 0){
                    // 余额支付
                    payOrder();
                }
            } else {
                //商品支付
                payOrder();
            }
        });
    }

    function payOrder() {
        loading.createLoading("支付中...");

        Ajax.post(payBizType, {
            json: {
                orderCodeList: [code],
                payType: "1"
            }
        }).then(function(res) {
            loading.hideLoading();
            if(res.success) {
                base.showMsg("支付成功");
                setTimeout(function() {
                    location.href = "../user/user.html";
                }, 1000);
            }else{
                base.showMsg(res.msg);
            }
        }, function() {
            loading.hideLoading();
            base.showMsg("非常抱歉，支付失败");
        });
    }

    function getCont() {
        return Ajax.get(bizType, {
                code: code
            })
            .then(function(res) {
                if (res.success) {
                    // 0:酒店 1:线路 2:专线 3:大巴 4:拼车 5:商品
                    var price = type == 0 ? res.data.hotalOrder.amount :
                                type == 2 ? res.data.amount :
                                type == 3 ? res.data.distancePrice :
                                type == 5 ? res.data.amount1 : 0;
                    if(type == 1){
                        var p1 = +res.data.amount;
                        var p2 = res.data.hotalOrder && +res.data.hotalOrder.amount || 0;
                        var p3 = res.data.specialLineOrder && +res.data.specialLineOrder.amount || 0;
                        price = p1 + p2 + p3;
                    }
                    if(type == 5){
                        $("#unit").hide();
                        $("#price").html(base.fZeroMoney(price)+"积分");
                    }else{
                        $("#price").html(base.formatMoney(price));
                    }
                    if(type == 4){
                        if(res.data.status == "0" || res.data.status == "97"){
                            $("#payBtn").val("支付定金");
                            price = res.data.firstAmount;
                        }
                        else if(res.data.status == "2"){
                            $("#payBtn").val("支付尾款");
                            price = res.data.secondAmount;
                            payBizType = "618246";
                        }
                        $("#price").html(base.formatMoney(price));
                    }
                    price = +price;
                    if(price === 0){
                        choseIdx = 0;
                        $("#wxCont").removeClass("active").addClass("hidden");
                        $("#yeCont").addClass("active");
                    }
                    addListener();
                } else {
                    base.showMsg(res.msg || "订单信息获取失败");
                }
            }, function () {
                base.showMsg("订单信息获取失败");
            });
    }

    function wxPayOrder() {
        loading.createLoading("支付中...");
        Ajax.post(payBizType, {
            json: {
                orderCodeList: [code],
                payType: "2"
            }
        }).then(wxPay, function() {
            loading.hideLoading();
            base.showMsg("非常抱歉，支付请求提交失败");
        });
    }
    var response = {};

    function onBridgeReady() {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": response.data.appId, //公众号名称，由商户传入
                "timeStamp": response.data.timeStamp, //时间戳，自1970年以来的秒数
                "nonceStr": response.data.nonceStr, //随机串
                "package": response.data.wechatPackage,
                "signType": response.data.signType, //微信签名方式：
                "paySign": response.data.paySign //微信签名
            },
            function(res) {
                loading.hideLoading();
                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    base.showMsg("支付成功");
                    setTimeout(function() {
                        location.href = "../user/user.html";
                    }, 1000);
                } else {
                    base.showMsg("支付失败");
                }
            }
        );
    }

    function wxPay(response1) {
        response = response1;
        if (response.data && response.data.signType) {
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.removeEventListener("WeixinJSBridgeReady", onBridgeReady);
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                } else if (document.attachEvent) {
                    document.detachEvent('WeixinJSBridgeReady', onBridgeReady);
                    document.detachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                }
            } else {
                onBridgeReady();
            }
        } else {
            loading.hideLoading();
            base.showMsg(response1.msg || "微信支付失败");
        }
    }
});
