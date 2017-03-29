define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading'
], function(base, Ajax, Handlebars, loading) {
    var code = base.getUrlParam("code") || "",
        type = base.getUrlParam("type") || "1",
        q = base.getUrlParam("q") || "1",
        contentTmpl = __inline("../../ui/mall-submit-order.handlebars");
    init();

    function init() {
        if (!base.isLogin()) {
            base.goLogin();
            return;
        } else {
            Handlebars.registerHelper('formatProductName', function(name, options){
                if(name)
                    return name;
                var idx = options.data.index;
                return options.data.root.items[idx].productName || "--";
            });
            Handlebars.registerHelper('fProductCode', function(code, options){
                if(code)
                    return code;
                var idx = options.data.index;
                return options.data.root.items[idx].productCode || "";
            });
            //单件商品购买
            if (type == 1) {
                $.when(
                    getAddress(),
                    getModel()
                ).then(function () {
                    loading.hideLoading();
                }, function () {
                    loading.hideLoading();
                });
                //购物车提交订单
            } else if (type == 2) {
                code = code.split(/_/);
                $.when(
                    getAddress(),
                    getModel1()
                ).then(function () {
                    loading.hideLoading();
                }, function () {
                    loading.hideLoading();
                });
            }
            addListeners();
        }
    }

    function getAddress() {
        var code = "805165",
            config = {
                "isDefault": "",
                userId: base.getUserId()
            },
            addressTmpl = __inline("../../ui/submit-order-address.handlebars");
        return Ajax.get(code, config)
            .then(function(response) {
                if (response.success) {
                    var data = response.data,
                        len = data.length;
                    if (len) {
                        for (var i = 0; i < len; i++) {
                            if (data[i].isDefault == "1") {
                                break;
                            }
                        }
                        i = i == len ? 0 : i;
                        var content = addressTmpl(data[i]);
                        $("#addressDiv").append(content);
                        $("#addressRight").removeClass("hidden");
                    } else {
                        $("#noAddressDiv").removeClass("hidden");
                    }
                } else {
                    $("#noAddressDiv").removeClass("hidden");
                }
            }, function() {
                base.showMsg("地址信息获取失败");
                $("#noAddressDiv").removeClass("hidden");
            });
    }

    function doError(cc) {
        $(cc).html('<div class="item-error">商品信息获取失败</div>');
    }

    function getModel1() {
        var postCode = "618441";
        return Ajax.get(postCode, {
            userId: base.getUserId()
        }).then(function(response) {
                if (response.success && response.data.length) {
                    var data = response.data,
                        totalCount = 0, items = [];
                    for (var i = 0, len = code.length; i < len; i++) {
                        var d = data[code[i]];
                        var eachCount = (+d.price1) * (+d.quantity);
                        totalCount += eachCount;
                        items.push(d);
                    };
                    var html = contentTmpl({ items: items });
                    $("#items-cont").html(html);
                    $("#amount").html(base.fZeroMoney(totalCount));
                } else {
                    doError("#items-cont");
                }
            }, function() {
                doError("#items-cont");
            });
    }

    function getModel() {
        var postCode = "618422",
            config = {
                "code": code
            };
        return Ajax.get(postCode, config)
            .then(function(response) {
                if (response.success) {
                    var data = response.data.product;
                    data.quantity = q;
                    var html = contentTmpl({ items: [data] });
                    $("#items-cont").html(html);
                    $("#amount").html(base.fZeroMoney(+q * +data.price1));
                } else {
                    doError("#items-cont");
                }
            }, function() {
                doError("#items-cont");
            });
    }

    function addListeners() {
        $("#addressDiv").on("click", "a", function() {
            location.href = "./address-list.html?c=" + $(this).attr("code") + "&return=" + base.makeReturnUrl();
        });
        $("#noAddressDiv").on("click", function(e) {
            location.href = "./add-address.html?return=" + base.makeReturnUrl();
        });
        $("#sbtn").on("click", function() {
            var $a = $("#addressDiv>a");
            if ($a.length) {
                var applyVal = $("#apply_note").val();
                if(applyVal){
                    if (applyVal.length > 255) {
                        base.showMsg("买家嘱咐字数必须少于255位");
                        return;
                    }else if(!base.isNotFace(applyVal)){
                        base.showMsg("买家嘱咐不能包含特殊字符");
                        return;
                    }
                }
                var postCode = "618450",
                    config;
                if (type == 1) {
                    config = {
                        "productCode": code,
                        "quantity": q,
                        "receiver": $a.find(".a-addressee").text(),
                        "reMobile": $a.find(".a-mobile").text(),
                        "reAddress": $a.find(".a-province").text() + $a.find(".a-city").text() + $a.find(".a-district").text() + $a.find(".a-detailAddress").text(),
                        "applyNote": $("#apply_note").val() || "",
                        "applyUser": base.getUserId()
                    };
                } else if (type == 2) {
                    var cartList = [],
                        $lis = $("#items-cont .order-list-item-center");
                    for (var i = 0, len = $lis.length; i < len; i++) {
                        cartList.push($($lis[i]).attr("data-code"));
                    }
                    config = {
                        "receiver": $a.find(".a-addressee").text(),
                        "reMobile": $a.find(".a-mobile").text(),
                        "reAddress": $a.find(".a-province").text() + $a.find(".a-city").text() + $a.find(".a-district").text() + $a.find(".a-detailAddress").text(),
                        "applyNote": $("#apply_note").val() || "",
                        "cartCodeList": cartList,
                        "applyUser": base.getUserId()
                    };
                    postCode = "618451";
                } else {
                    base.showMsg("类型错误，无法提交订单");
                    return;
                }
                doSubmitOrder(config, postCode);
            } else {
                base.showMsg("未选择地址");
            }
        });
    }

    function doSubmitOrder(config, postCode) {
        loading.createLoading("提交中...");
        Ajax.post(postCode, { json: config })
            .then(function(response) {
                loading.hideLoading();
                if (response.success) {
                    var code = response.data || response.data.code;
                    location.href = '../pay/pay.html?code=' + code + '&type=5';
                } else {
                    base.showMsg(response.msg);
                }
            }, function() {
                loading.hideLoading();
                base.showMsg("非常抱歉，订单提交失败");
            });
    }
});
