define([
    'app/controller/base',
    'app/util/ajax',
    'Handlebars'
], function(base, Ajax, Handlebars) {
    var code = base.getUrlParam("code") || "",
        type = base.getUrlParam("type") || "1",
        q = base.getUrlParam("q") || "1",
        //receiptType = Dict.get("receiptType"),
        contentTmpl = __inline("../ui/submit-order-imgs.handlebars");
    init();

    function init() {
        if (!base.isLogin()) {
            location.href = "../user/login.html?return=" + base.makeReturnUrl();
        } else {
            getAddress();
            //单件商品购买
            if (type == 1) {
                getModel();
                //购物车提交订单
            } else if (type == 2) {
                code = code.split(/_/);
                getModel1();
            }
            addListeners();
        }

        // (function() {
        //     var html = '<option value="0">无</option>';
        //     for (var rec in receiptType) {
        //         html += '<option value="' + rec + '">' + receiptType[rec] + '</option>';
        //     }
        //     $("#receipt").html(html);
        // })();
    }

    function getAddress() {
        var url = APIURL + '/user/queryAddresses',
            config = {
                "isDefault": ""
            },
            addressTmpl = __inline("../ui/submit-order-address.handlebars");
        Ajax.get(url, config, true)
            .then(function(response) {
                $("#cont").hide();
                if (response.success) {
                    var data = response.data,
                        html1 = "",
                        len = data.length;;
                    if (len) {
                        for (var i = 0; i < len; i++) {
                            if (data[i].isDefault == "1") {
                                break;
                            }
                        }
                        if (i == len) {
                            i = 0;
                        }
                        var content = addressTmpl(data[i]);
                        $("#addressDiv").append(content);
                        $("#addressRight").removeClass("hidden");
                    } else {
                        $("#noAddressDiv").removeClass("hidden");
                    }
                } else {
                    doError("#addressDiv");
                }
            });
    }

    function doError(cc) {
        $(cc).html('<div class="bg_fff" style="text-align: center;line-height: 150px;">暂时无法获取数据</div>');
    }

    function getModel1() {
        var url = APIURL + '/operators/queryCart';
        Ajax.get(url, true)
            .then(function(response) {
                if (response.success) {
                    var data = response.data,
                        html = "",
                        totalCount = 0;
                    if (data.length) {
                        var items = [];
                        for (var i = 0, len = code.length; i < len; i++) {
                            var d = data[code[i]];
                            var eachCount = (+d.salePrice) * (+d.quantity);
                            d.product = {};
                            d.product.name = d.productName;
                            d.product.advPic = d.advPic;
                            d.product.productCode = d.productCode;
                            d.product.discountPrice = (+d.salePrice / 1000).toFixed(2);
                            totalCount += eachCount;
                            items.push(d);
                        }
                        var html = contentTmpl({ items: items });
                        $("#cont").hide();
                        $("#items-cont").append(html);
                        $("#totalAmount").html((totalCount / 1000).toFixed(2));
                    } else {
                        $("#cont").hide();
                        doError("#items-cont");
                    }
                } else {
                    $("#cont").hide();
                    doError("#items-cont");
                }
            });
    }

    function getModel() {
        var url = APIURL + '/commodity/product/info',
            config = {
                "code": code
            };
        Ajax.get(url, config)
            .then(function(response) {
                if (response.success) {
                    var data = response.data,
                        items = [];
                    var eachCount = +data.discountPrice * +q;
                    data.product = {};
                    data.product.discountPrice = (+data.discountPrice / 1000).toFixed(2);
                    data.quantity = q;
                    data.product.name = data.name;
                    data.product.advPic = data.advPic;
                    data.product.productCode = data.code;
                    items.push(data);
                    var html = contentTmpl({ items: items });
                    $("#items-cont").append(html);
                    $("#totalAmount").html((eachCount / 1000).toFixed(2));
                    $("#cont").hide();
                } else {
                    doError("#items-cont");
                }
            });
    }

    function addListeners() {
        $("#addressDiv").on("click", "a", function() {
            location.href = "./address_list.html?c=" + $(this).attr("code") + "&return=" + base.makeReturnUrl();
        });
        $("#add-addr").on("click", "a", function() {
            location.href = "./add_address.html?return=" + base.makeReturnUrl();
        });
        $("#sbtn").on("click", function() {
            var $a = $("#addressDiv>a");
            if ($a.length) {
                // if ($("#receiptTitle").val().length > 32) {
                //     base.showMsg("发票抬头字数必须少于32位");
                //     return;
                // }
                if ($("#apply_note").val().length > 255) {
                    base.showMsg("买家嘱咐字数必须少于255位");
                    return;
                }
                var url = APIURL + '/operators/submitOrder',
                    config;
                if (type == 1) {
                    var tPrice = (+$("#items-cont").find(".item_totalP").text().substr(1)) * 1000;
                    config = {
                        "productCode": code,
                        "quantity": q,
                        "receiver": $a.find(".a-addressee").text(),
                        "reMobile": $a.find(".a-mobile").text(),
                        "reAddress": $a.find(".a-province").text() + $a.find(".a-city").text() + $a.find(".a-district").text() + $a.find(".a-detailAddress").text(),
                        // "receiptType": ($("#receipt").val() == "0" ? "" : $("#receipt").val()),
                        // "receiptTitle": $("#receiptTitle").val(),
                        "applyNote": $("#apply_note").val() || ""
                    };
                } else if (type == 2) {
                    var cartList = [],
                        $lis = $("#items-cont > ul > li");
                    for (var i = 0, len = $lis.length; i < len; i++) {
                        cartList.push($($lis[i]).attr("modelCode"));
                    }
                    var config = {
                        "receiver": $a.find(".a-addressee").text(),
                        "reMobile": $a.find(".a-mobile").text(),
                        "reAddress": $a.find(".a-province").text() + $a.find(".a-city").text() + $a.find(".a-district").text() + $a.find(".a-detailAddress").text(),
                        // "receiptType": ($("#receipt").val() == "0" ? "" : $("#receipt").val()),
                        // "receiptTitle": $("#receiptTitle").val(),
                        "applyNote": $("#apply_note").val() || "",
                        "cartCodeList": cartList
                    };
                    url = APIURL + '/operators/submitCart';
                } else {
                    base.showMsg("类型错误，无法提交订单");
                    return;
                }
                doSubmitOrder(config, url);
            } else {
                base.showMsg("未选择地址");
            }
        });
    }

    function doSubmitOrder(config, url) {
        Ajax.post(url, config)
            .then(function(response) {
                if (response.success) {
                    var code = response.data || response.data.code;
                    location.href = './pay_order.html?code=' + code;
                } else {
                    base.showMsg(response.msg);
                }
            });
    }
});