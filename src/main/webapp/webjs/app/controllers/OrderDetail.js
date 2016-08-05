define([
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/common/Global',
    'app/controllers/Helper',
    'app/views/operator/Confirm',
    'app/views/operator/ShowMsg',
    'dojo/when',
    'app/common/Data',
    'app/common/Dict',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query, Ajax,
            Global, Helper, Confirm, ShowMsg, when, Data, Dict) {
    var code = Global.getUrlParam('code'),
        receiptType = Dict.get("receiptType"),
        orderStatus = Dict.get("orderStatus"),
        fastMail = Dict.get("fastMail"),
        companyCode = Dict.get("companyCode");
    function initView() {
        if(sessionStorage.getItem("uKind") == undefined) {
            when(Data.getUser(), function (user) {
                if (user) {
                    if (user.kind == "f2") {
                        sessionStorage.setItem("uKind", "f2");
                        getBInfo();
                    } else {
                        sessionStorage.setItem("uKind", "f1");
                    }
                } else {
                    sessionStorage.removeItem("uKind");
                }
            });
        }else if(sessionStorage.getItem("uKind") == "f2"){
            getBInfo();
        }
        (function () {
            var url = Global.baseUrl + '/operators/queryOrder',
                config = {
                    "invoiceCode": code
                };
            var modelCode = "" ,modelName, quantity, salePrice, receiveCode, productName;
            Ajax.post(url, config)
                .then(function(response) {
                    if (response.success) {
                        var data = response.data,
                            html = "",
                            approveNote = data.approveNote,
                            invoiceModelLists = data.invoiceModelList;
                        //收货信息编号
                        receiveCode = data.addressCode;

                        if(approveNote){
                            $("#approveNoteCont").text(approveNote);
                            $("#approveNoteTitle, #approveNoteInfo").show();
                        }

                        if (invoiceModelLists.length) {
                            invoiceModelLists.forEach(function (invoiceModelList) {
                                modelCode = invoiceModelList.modelCode;
                                modelName = invoiceModelList.modelName;
                                quantity = invoiceModelList.quantity;
                                salePrice = invoiceModelList.salePrice;
                                productName = invoiceModelList.productName;
                                var pic = invoiceModelList.pic1;
                                var t = (+salePrice) * (+quantity);
                                html +=
                                    '<li class="pad24">' +
                                    '<div class="d-order-img"><a target="_blank" href="'+Global.baseUrl+'/detail/mall_detail.htm?code='+invoiceModelList.productCode+'"><img src="' + pic + '"/></a></div>' +
                                    '<div class="d-order-item-info">' +
                                    '<ul style="height: 100px;line-height: 100px;">' +
                                    '<li class="d-order-name-li" style="text-align:left;width: 450px;"><div style="line-height: 1.2em;margin-bottom: 10px;">'+productName+'</div><div style="line-height: 1.2em;">'+modelName+'</div></li>' +
                                    '<li class="d-order-unit" style="width: 138px">￥' + Global.roundAmount((+salePrice)/1000, 2) + '</li>' +
                                    '<li class="d-order-count">' + quantity + '</li>' +
                                    '<li class="d-order-amount">￥' + Global.roundAmount( t / 1000, 2 ) + '</li>' +
                                    '</ul></div></li>';
                            });
                            $("#od-ul").html(html);
                            $("#od-total").html('商品总计：￥' + Global.roundAmount((+data.totalAmount)/1000, 2));
                            $("#od-rtype").html(getReceiptType(data.receiptType));
                            $("#od-rtitle").html(data.receiptTitle || "无");
                            $("#od-title").html(getStatus(data.status));
                            $("#od-id").html(data.code);

                            var addData = data.address,
                                html1 = '<li class="block-li">姓名：<span>'+addData.addressee+'</span></li>' +
                                    '<li class="block-li">联系电话：<span>'+addData.mobile+'</span></li>' +
                                    '<li class="block-li">详细地址：<span>'+addData.province+'&nbsp;'
                                    +addData.city+'&nbsp;'+addData.district+'&nbsp;'+
                                    addData.detailAddress+'</span></li>';
                            $("#od-address").html(html1);
                            var logistic = data.logistics;
                            if(logistic && logistic.code){
                                $("#logisticsTitle, #logisticsInfo").show();
                                dom.byId("logisticsComp").innerHTML = fastMail[logistic.company];
                                dom.byId("logisticsNO").innerHTML = logistic.code;
                                dom.byId("deliverer").innerHTML = logistic.deliverer;
                                dom.byId("deliveryDatetime").innerHTML = getMyDate(logistic.deliveryDatetime);
                            }
                        }else{
                            query(".cont-body")[0].innerHTML = "<span style='margin: 80px 0;display: inline-block;font-size: 24px;width: 100%;text-align: center;'><img style='width: 120px;margin-bottom: 20px;' src='"+Global.staticUrl+"/images/noData.png'/><br>暂无数据</span>";
                        }
                    }else{
                        query(".cont-body")[0].innerHTML = "<span style='margin: 80px 0;display: inline-block;font-size: 24px;width: 100%;text-align: center;'><img style='width: 120px;margin-bottom: 20px;' src='"+Global.staticUrl+"/images/noData.png'/><br>暂无数据</span>";
                    }
                });
        })();
    }

    function getBInfo() {
        $("#b-info-b, #b-info-t").show();
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
                        $("#bInfo").replaceWith("<span style='padding:80px 0;display:inline-block;font-size:20px;width: 100%;text-align: center;'>暂时无法获取汇款账户信息!</span>");
                    }
                }else{
                    $("#bInfo").replaceWith("<span style='padding:80px 0;display:inline-block;font-size:20px;width: 100%;text-align: center;'>暂时无法获取汇款账户信息!</span>");
                }
            });
    }

    function getMyDate(value) {
        var date = new Date(value);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
            get2(date.getHours()) + ":" + get2(date.getMinutes()) + ":" + get2(date.getSeconds());
    }

    function get2(val) {
        if(val < 10){
            return "0" + val;
        }else{
            return val;
        }
    }

    function getReceiptType(data) {
        return data == "" ? "无": receiptType[data];
    }

    function addListener() {
        $("#od-title").on("click", "span.button", function (e) {
            e.stopPropagation();
            if($(this).hasClass("cancel-btn")){
                new Confirm({
                    tMsg: "取消订单",
                    ok: function () {
                        var $ta = $("#od-cancel-note");
                        if(trimStr($ta.val()) !== ""){
                            cancelOrder(this);
                        }
                    },
                    cancel: function () {
                        this.close();
                    },
                    msg: "<span style='display: block;font-size: 14px;text-align: left;'>取消说明：</span>" +
                    "<div><textarea style='vertical-align: text-top;border-color: rgb(224, 222, 222);' rows=\"4\" cols=\"25\" id='od-cancel-note'></textarea><br><span style='font-size: 12px;float: right;color: #f00;'>必须填写说明</span></div>"
                }).show();
            }else{
                location.href = Global.baseUrl + '/operator/pay_order.htm?code=' + code;
            }
        });
    }

    function getStatus(status){
        var res = orderStatus[status] || "未知状态";
        if(res == "待支付"){
            return '<span class="button cancel-btn">取消订单</span>' +
                '<span class="button">现在支付</span>';
        }
        return "<span>"+res+"</span>";
    }

    function trimStr(val) {
        if(val == undefined || val === ''){
            return '';
        }
        return val.replace(/^\s*|\s*$/g, "");
    }

    function cancelOrder(me){
        me.okHandler.remove && me.okHandler.remove();
        $(me.okBtn).css("cursor", "default").text("取消中...");
        var url = Global.baseUrl + '/operators/cancelOrder',
            config = {
                code: code,
                applyNote: $("#od-cancel-note").val()
            };
        Ajax.post(url, config)
            .then(function(response) {
                if (response.success) {
                    var data = response.data;
                    new ShowMsg({
                        "msg": "取消订单成功！",
                        "btn": function () {
                            location.href = Global.baseUrl + "/user/order_list.htm";
                        }
                    }).show();
                    me.close();
                }else{
                    new ShowMsg({
                        "msg": response.msg,
                        "btn": function () {
                            this.close();
                        }
                    }).show();
                    me.set("ok", function () {
                        var $ta = $("#od-cancel-note");
                        if(trimStr($ta.val()) !== ""){
                            cancelOrder(me);
                        }
                    });
                    $(me.okBtn).css("cursor", "pointer").text("确认");
                }
            });
    }

    return {
        init: function() {
            initView();
            addListener();
            Helper.init();
        }
    }
});