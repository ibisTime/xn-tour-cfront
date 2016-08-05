define('app/controllers/PayOrder', [
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/common/Global',
    'app/controllers/Helper',
    'app/views/operator/ShowMsg',
    'app/views/operator/Confirm',
    'app/common/Dict',
    'dojo/when',
    'app/common/Data',
    'app/jquery/$',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query,
            Ajax, Global, Helper, ShowMsg, Confirm, Dict, when, Data, J) {

    var code = Global.getUrlParam("code") || "",
        confirm = new Confirm(),
        showMsg = new ShowMsg(),
        receiptType = Dict.get("receiptType"),
        companyCode = Dict.get("companyCode");
    function initView() {
        if(sessionStorage.getItem("uKind") == undefined){
            when(Data.getUser(), function(user) {
                if (user) {
                    if(user.kind == "f2"){
                        doQDS();
                    }else{
                        sessionStorage.setItem("uKind", "f1");
                        $("#po-top").show();
                        $("#po-pfs-top").remove();
                        $("#po-top").show();
                        $('<img src="'+Global.alipayQR+'"/>').appendTo("#alipayImg");
                        addListener();
                    }
                }else{
                    sessionStorage.removeItem("uKind");
                }
            });
        }else if(sessionStorage.getItem("uKind") == "f2"){
            doQDS();
        }else{
            $("#po-top").show();
            $("#po-pfs-top").remove();
            $("#po-top").show();
            $('<img src="'+Global.alipayQR+'"/>').appendTo("#alipayImg");
            addListener();
        }
        queryOrder();
    }

    function doQDS() {
        sessionStorage.setItem("uKind", "f2");
        $("#pfs-code").text(code);
        $("#po-top").remove();
        $("#po-pfs-top").show();
        Ajax.get(Global.baseUrl + "/operators/page/accountNumber",
            {"start": 0, "limit": 1})
            .then(function (res) {
                if(res.success){
                    var list = res.data.list;
                    if(list.length){
                        var data = list[0];
                        $("#uName").text(data.companyCode || "");
                        $("#oName").text(data.subbranch);
                        $("#cName").text(data.cardNo);
                    }else{
                        $("#bInfo").replaceWith("<span style='padding:80px 0;display:inline-block;font-size:20px;width: 100%;text-align: center;border-bottom: #dadada solid 1px;'>暂时无法获取汇款账户信息!<br>稍后可以在<a class='b-a' href='"+Global.baseUrl+"/user/order_detail.htm?code="+code+"'>订单详情</a>中查看!</span>");
                    }
                }else{
                    $("#bInfo").replaceWith("<span style='padding:80px 0;display:inline-block;font-size:20px;width: 100%;text-align: center;border-bottom: #dadada solid 1px;'>暂时无法获取汇款账户信息!<br>稍后可以在<a class='b-a' href='"+Global.baseUrl+"/user/order_detail.htm?code="+code+"'>订单详情</a>中查看!</span>");
                }
            });
    }

    function queryOrder() {
        var url = Global.baseUrl + '/operators/queryOrder',
            config = {
                "invoiceCode": code
            };
        var modelCode = "" ,modelName, quantity, salePrice, receiveCode, productName;
        Ajax.post(url, config)
            .then(function(response){
                if(response.success){
                    var data = response.data,
                        html = "", total = 0,
                        invoiceModelLists = data.invoiceModelList;
                    if(data.status !== "1"){
                        location.href = Global.baseUrl + "/user/order_list.htm";
                    }
                    $("#od-rtype").html(getReceiptType(data.receiptType));
                    $("#od-rtitle").html(data.receiptTitle || "无");
                    //收货信息编号
                    receiveCode = data.addressCode;
                    if(invoiceModelLists.length){
                        invoiceModelLists.forEach(function (invoiceModelList) {
                            modelCode = invoiceModelList.modelCode;
                            modelName = invoiceModelList.modelName;
                            quantity = invoiceModelList.quantity;
                            salePrice = invoiceModelList.salePrice;
                            productName = invoiceModelList.productName;
                            var pic = invoiceModelList.pic1;
                            var t = (+salePrice)*(+quantity);
                            total += t;
                            html +=
                                '<li class="pad24">' +
                                '<div class="d-order-img"><a target="_blank" href="'+Global.baseUrl+'/detail/mall_detail.htm?code='+invoiceModelList.productCode+'"><img src="'+pic+'"/></a></div>' +
                                '<div class="d-order-item-info">' +
                                '<ul style="height: 100px;line-height: 100px;">' +
                                '<li class="d-order-name-li" style="width: 450px;"><div style="line-height: 1.2em;margin-bottom: 10px;padding-left: 5px;">'+productName+'</div><div style="line-height: 1.2em;padding-left: 5px;">'+modelName+'</div></li>' +
                                '<li class="d-order-unit" style="width: 138px">￥'+(+salePrice)/1000+'</li>' +
                                '<li class="d-order-count">'+quantity+'</li>' +
                                '<li class="d-order-amount">￥'+t/1000+'</li>' +
                                '</ul></div></li>';
                        });
                        $("#po-total").html("商品总计：￥" + (+data.totalAmount/1000));
                        $("#po-ul").html(html);

                        var addData = data.address,
                            html1 = '<li class="block-li">姓名：<span>'+addData.addressee+'</span></li>' +
                                '<li class="block-li">联系电话：<span>'+addData.mobile+'</span></li>' +
                                '<li class="block-li">详细地址：<span>'+addData.province+'&nbsp;'
                                +addData.city+'&nbsp;'+addData.district+'&nbsp;'+
                                addData.detailAddress+'</span></li>';

                        $("#po-address").html(html1);
                        $("#po-top-total").html(+data.totalAmount/1000);

                    }else{
                        query(".user-info-body")[0].innerHTML = "<span style='margin: 80px 0;display: inline-block;font-size: 24px;width: 100%;text-align: center;'><img style='width: 120px;margin-bottom: 20px;' src='"+Global.staticUrl+"/images/noData.png'/><br>暂无数据</span>";
                    }
                }else{
                    query(".user-info-body")[0].innerHTML = "<span style='margin: 80px 0;display: inline-block;font-size: 24px;width: 100%;text-align: center;'><img style='width: 120px;margin-bottom: 20px;' src='"+Global.staticUrl+"/images/noData.png'/><br>暂无数据</span>";
                }
            });
    }

    function getReceiptType(data) {
        return data == "" ? "无": receiptType[data];
    }

    function addListener() {
        $("#pay_order_img").on("click", "li", function () {
            $(this).parent().children("li.on").removeClass("on");
            $(this).addClass("on");
            if($("#po-payBtn").hasClass("payOrderBtn")){
                $("#po-payBtn").removeClass("payOrderBtn");
                $("#po-payBtn").on("click", function (e) {
                    e.stopPropagation();
                    confirm.set("ok", function () {
                        Ajax.post(Global.baseUrl + '/operators/payOrder',
                            {
                                code: code
                            }
                        ).then(function (response) {
                            if(response.success){
                                $("#po-success").fadeIn(300);
                                $("#po-success").siblings().remove();
                            }else{
                                showMsg.set("msg", response.msg);
                                showMsg.show();
                            }
                            confirm.hide();
                        })
                    });
                    confirm.set("cancel", function () {
                        confirm.hide();
                    });
                    confirm.set("msg", "确定支付订单吗?");
                    confirm.show();
                });
            }
        });
        $("#pay_order_img>li:first").hover(function (e) {
            if(!$("#po-payBtn").hasClass("payOrderBtn")){
                $("#alipayImg").show();
            }
        }, function (e) {
            $("#alipayImg").hide();
        }).click();
    }
    return {
        init: function() {
            initView();
            Helper.init();
        }
    }
});