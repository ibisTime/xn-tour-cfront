define([
    'app/controller/base',
    'app/util/ajax',
    'Handlebars'
], function(base, Ajax, Handlebars) {
    var code = base.getUrlParam("code") || "",
        //receiptType = Dict.get("receiptType"),
        // contentTmpl = __inline("../ui/pay-order-imgs.handlebars"),
        addressTmpl = __inline("../ui/pay-order-address.handlebars");
    init();

    function init() {
        if (!base.isLogin()) {
            location.href = "../user/login.html?return=" + base.makeReturnUrl();
        } else {
            queryOrder();
            addListener();
        }
    }

    function queryOrder() {
        var url = APIURL + '/operators/queryOrder',
            config = {
                "code": code
            };
        var quantity, salePrice;
        Ajax.get(url, config)
            .then(function(response) {
                if (response.success) {
                    var data = response.data,
                        invoiceModelLists = data.productOrderList;
                    if (data.status !== "1") {
                        location.href = "../user/order_list.html";
                    }
                    $("#cont").remove();
                    // $("#od-rtype").html(getReceiptType(data.receiptType));
                    // $("#od-rtitle").html(data.receiptTitle || "无");
                    //收货信息编号
                    if (invoiceModelLists.length) {
                        // invoiceModelLists.forEach(function(invoiceModelList) {
                        //     quantity = invoiceModelList.quantity;
                        //     salePrice = invoiceModelList.salePrice;
                        //     invoiceModelList.totalAmount = ((+salePrice) * (+quantity) / 1000).toFixed(2);
                        // });
                        $("#cont").remove();
                        // $("#items-cont").append(contentTmpl({ items: invoiceModelLists }));
                        // $("#po-total").html("￥" + (+data.totalAmount / 1000).toFixed(2));

                        data.totalAmount = ((+data.amount + (+data.yunfei)) / 1000).toFixed(2);
                        $("#addressDiv").html(addressTmpl(data));
                    } else {
                        $("#cont").remove();
                        doError("#container");
                    }
                } else {
                    $("#cont").remove();
                    doError("#container");
                }
            }, function() {
                $("#cont").remove();
                doError("#container");
            });
    }

    function doError(cc) {
        $(cc).html('<div class="bg_fff" style="text-align: center;line-height: 150px;">暂时无法获取订单信息</div>');
    }

    // function getReceiptType(data) {
    //     return data == "" ? "无" : receiptType[data];
    // }

    function addListener() {
        $("#sbtn").on("click", function(e) {
            e.stopPropagation();
            $("#loaddingIcon").removeClass("hidden");
            Ajax.post(APIURL + '/operators/payOrder', {
                code: code
            }).then(function(response) {
                if (response.success) {
                    location.href = "./pay_success.html";
                } else {
                    $("#loaddingIcon").addClass("hidden");
                    base.showMsg(response.msg);
                }
            }, function() {
                $("#loaddingIcon").addClass("hidden");
                base.showMsg("非常抱歉，订单支付失败");
            });
        });
    }
});