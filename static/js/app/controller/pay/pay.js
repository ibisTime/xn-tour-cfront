define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {

    var code = base.getUrlParam("code");
    // 0:酒店 1:线路
    var type = base.getUrlParam("type") || 0;
    var choseIdx = 0;

    init();

    function init() {
        if(!code){
            base.showMsg("未传入订单编号");
            return;
        }
        if(!base.isLogin()){
            location.href = "../user/login.html?return=" + base.makeReturnUrl();
            return;
        }
        if(type == 0){
            getCont0();
        }else if(type == 1){
            getCont1();
        }
    }

    function addListener() {
        $("#content").on("click", ".pay-item", function(){
            var _self = $(this), idx = _self.index();
            _self.siblings(".active").removeClass("active");
            _self.addClass("active");
            choseIdx = idx;
        });
        $("#payBtn").on("click", function() {
            // 微信支付
            if(choseIdx == 0){
                if(type == 0){
                    wxPayOrder0();
                }else if(type == 1){
                    wxPayOrder1();
                }else{
                    wxPayOrder0();
                }
            // 支付宝支付
            }else{}
        });
        // addSub.createByEle({
        //     sub: $("#subCount"),
        //     add: $("#addCount"),
        //     input: $("#bookNum"),
        //     changeFn: function() {
        //         var unit = +$("#fee").val();
        //         var value = +this.value;
        //         $("#count1").html((+unit / 1000) + "*" + value);
        //         $("#count2").html((unit * value) / 1000 + "元");
        //     }
        // });
    }

    function getCont0() {
        loading.createLoading("加载中...");
        Ajax.get("618052", { code: code })
            .then(function(res) {
                loading.hideLoading();
                if (res.success) {
                    $("#price").html(base.formatMoney(res.data.amount));
                    addListener();
                } else {
                    base.showMsg("订单信息获取失败");
                }
            });
    }
    function getCont1() {
        loading.createLoading("加载中...");
        Ajax.get("618152", { code: code })
            .then(function(res) {
                loading.hideLoading();
                if (res.success) {
                    $("#price").html(base.formatMoney(res.data.amount));
                    addListener();
                } else {
                    base.showMsg("订单信息获取失败");
                }
            });
    }
    function wxPayOrder0(){
        Ajax.getIp()
            .then(function(res){
                Ajax.post("618042", {
                    json: {
                        code: code,
                        payType: "2",
                        ip: res.ip
                    }
                }).then(function(res){
                    if(res.success){
                        base.showMsg("支付成功");
                        setTimeout(function(){
                            location.href = "../user/user.html";
                        }, 1000);
                    }else{
                        base.showMsg("支付失败");
                    }
                }, function(){
                    base.showMsg("支付失败");
                });
        });
    }
    function wxPayOrder1() {
        loading.createLoading("支付中...");
        Ajax.getIp()
            .then(function(res) {
                Ajax.post("618141", {
                    json: {
                        code: code,
                        ip: res.ip,
                        payType: "2"
                    }
                }).then(wxPay, function() {
                    loading.hideLoading();
                    base.showMsg("非常抱歉，支付请求提交失败");
                });
            }, function() {
                loading.hideLoading();
                base.showMsg("ip获取失败");
                // base.showMsg("非常抱歉，支付请求提交失败");
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
                base.showMsg(res.err_msg, 100000);
                if (res.err_msg == "get_brand_wcpay_request:ok") { // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                    base.showMsg("支付成功");
                    setTimeout(function() {
                        location.href = "../user/user.html";
                    }, 2000);
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
            base.showMsg("微信支付失败");
        }
    }
});