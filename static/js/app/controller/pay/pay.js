define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {
    var code = base.getUrlParam("code");
    // 0:酒店 1:线路 2:专线 3:大巴 4:拼车 5:商品
    var type = base.getUrlParam("type") || 0;
    var choseIdx = 0,
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
        getCont();
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
                if (choseIdx == 0) {
                    // 微信支付
                    wxPayOrder();
                } else {
                    // 支付宝支付
                }
            } else {
                //商品支付
                payMall();
            }
        });
    }

    function payMall() {
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
        loading.createLoading("加载中...");
        Ajax.get(bizType, {
                code: code
            })
            .then(function(res) {
                loading.hideLoading();
                if (res.success) {
                    // 0:酒店 1:线路 2:专线 3:大巴 4:拼车 5:商品
                    var price = type == 0 ? res.data.hotalOrder.amount :
                                type == 1 ? res.data.amount :
                                type == 2 ? res.data.amount :
                                type == 3 ? res.data.distancePrice :
                                type == 5 ? res.data.amount1 : 0;
                    if(type == 5){
                        $("#unit").hide();
                        $("#price").html(base.fZeroMoney(price)+"积分");
                    }else{
                        $("#price").html(base.formatMoney(price));
                    }
                    
                    if(type == 4){
                        /*
                            "0": "待支付定金",
                            "1": "已支付定金",
                            "2": "待支付尾款",
                            "3": "已支付尾款",
                            "97": "待支付定金"*/
                        if(res.data.status == "0" || res.data.status == "97"){
                            $("#payBtn").val("支付定金");
                            $("#price").html(base.formatMoney(res.data.firstAmount));
                        }
                        else if(res.data.status == "1" || res.data.status == "2"){
                            $("#price").html(base.formatMoney(res.data.secondAmount));
                            $("#payBtn").val("支付尾款");
                            payBizType = "618246";
                        }
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