define('app/controllers/OrderList', [
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/common/Global',
    'app/controllers/Helper',
    'app/jquery/Pagination',
    'app/common/Dict',
    'dojo/when',
    'app/common/Data',
    'app/jquery/$',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query,
            Ajax, Global, Helper, Pagination, Dict, when, Data, J) {

    var config = {
        status: "",
        limit: "4",
        start: "1",
        orderDir: "desc",
        orderColumn: "apply_datetime"
    }, totalCount = 0, totalPage = 0, pageNO = 1, userKind = "",
        curList = [], orderStatus = Dict.get("orderStatus");

    function initView() {
        if(sessionStorage.getItem("uKind") == undefined){
            when(Data.getUser(), function(user) {
                if (user) {
                    if(user.kind == "f2"){
                        sessionStorage.setItem("uKind", "f2");
                        userKind = "f2";
                    }else{
                        sessionStorage.setItem("uKind", "f1");
                    }
                    addListener();
                    getOrderList();
                }else{
                    sessionStorage.removeItem("uKind");
                }
            });
        }else if(sessionStorage.getItem("uKind") == "f2"){
            userKind = "f2";
            addListener();
            getOrderList();
        }else{
            addListener();
            getOrderList();
        }
        (function () {
            var html = '<li class="selected" status="0"><a>全部状态</a></li>';
            for(var n in orderStatus){
                html += '<li status="'+n+'"><a>'+orderStatus[n]+'</a></li>';
            }
            dom.byId("status_ul").innerHTML = html;
        })();
    }
    
    function addListener() {
        $("#order_status").on("click", function () {
            if($("#status_ul").hasClass("hide-ul")){
                $("#status_ul").removeClass("hide-ul").addClass("show-ul");
            }else{
                $("#status_ul").removeClass("show-ul").addClass("hide-ul");
            }
        });
        $("#status_ul").on("click", "li", function (e) {
            config.start = "1";
            $("#status_ul").find("li.selected").removeClass("selected");
            $("#order_status").find("span").text($(this).text());
            $("#order_status").click();
            var status = $(this).addClass("selected").attr("status");
            status = status == "0" ? "" : status;
            config.status = status;
            $("#ol-ul").html("<i style='height:521px;' class='loading-icon'></i>");
            getOrderList();
            e.stopPropagation();
        });
        $("#ol-ul").on("click", "li.order-detail>span.button", function (e) {
            e.stopPropagation();
            var me = $(this);
            if(me.hasClass("close-button") || me.attr("status") !== "1"){
                return;
            }
            location.href = Global.baseUrl + "/operator/pay_order.htm?code="+me.closest("li[code]").attr("code");
        });
        $("#ol-ul").on("click", "span.order-detail", function () {
            location.href = Global.baseUrl + "/user/order_detail.htm?code=" + $(this).parent().parent().attr("code");
        });
        $("body").on("click", function (e) {
            var target = e.target || e.srcElement;
            if(!$("#status_ul").find($(target)).length &&
                !$("#order_status").find($(target)).length &&
                $("#status_ul")[0] != target && $("#order_status")[0] != target){
                $("#status_ul").removeClass("show-ul").addClass("hide-ul");
                $("#status_ul").find("li.selected").removeClass("selected");
            }
        });
    }

    function getOrderList() {
        Ajax.post(Global.baseUrl + "/operators/queryPageOrders", config)
            .then(function (response) {
                if (response.success) {
                    var data = response.data, html = "";
                    totalCount = data.totalCount;
                    totalPage = data.totalPage;
                    curList = data.list;
                    if(curList.length){
                        curList.forEach(function (cl) {
                            var invoices = cl.invoiceModelList,
                                totalAmount = cl.totalAmount,
                                code = cl.code;
                            html +=
                                '<li code="'+code+'">' +
                                '<div class="cb-nav">' +
                                    '<span class="order-date">'+getMyDate(cl.applyDatetime)+'</span>' +
                                    '<span class="order-no" style="'+(userKind=="f2"? "width: 300px" : "width: 232px")+'">订单号：<span>'+cl.code+'</span></span>' +
                                    '<span class="'+(userKind=="f2"? "order-unit1" : "order-unit")+'">单价</span>' +
                                    '<span class="'+(userKind=="f2"? "order-count1" : "order-count")+'">数量</span>' +
                                    '<span class="order-amount">应付总额</span>' +
                                    '<span class="order-detail" style="cursor: pointer;color:#F39910;">查看详情</span>' +
                                '</div>' +
                                '<div class="cb-list-item ol-list-item">';
                            invoices.forEach(function (invoice) {
                                html +=
                                    '<ul>' +
                                    '<li class="order-img"><a target="_blank" href="'+Global.baseUrl+'/detail/mall_detail.htm?code='+invoice.productCode+'"><img src="'+invoice.pic1+'"/></a></li>' +
                                    '<li class="'+(userKind=="f2"? "order-name1" : "order-name")+'"><div style="line-height: 1.2em;margin-bottom: 10px;">'+invoice.productName+'</div><div style="line-height: 1.2em;">'+invoice.modelName+'</div></li>' +
                                    '<li class="'+(userKind=="f2"? "order-unit1" : "order-unit")+'">￥'+Global.roundAmount((+invoice.salePrice)/1000, 2)+'</li>' +
                                    '<li class="pad-l3 '+(userKind=="f2"? "order-count1" : "order-count")+'">'+invoice.quantity+'</li>' +
                                    '</ul>';
                            });
                            var h = invoices.length * 111 + "px";
                            html +=
                                '<div style="height:' + h + ';">' +
                                    '<ul>' +
                                        '<li class="order-amount">￥'+Global.roundAmount(+totalAmount / 1000, 2)+'</li>' +
                                        '<li class="order-detail no-pay">'+getStatus(cl.status)+'</li>'+
                                    '</ul>' +
                                '</div></div></li>';
                        });
                        $("#ol-ul").html(html);
                        $("#pagination_div").pagination({
                            items: totalCount,
                            itemsOnPage: config.limit,
                            pages: totalPage,
                            prevText: '<',
                            nextText: '>',
                            displayedPages: '2',
                            currentPage: pageNO,
                            onPageClick: function(pageNumber){
                                config.start = pageNumber;
                                pageNO = pageNumber;
                                $("#ol-ul").html("<i style='height:521px;' class='loading-icon'></i>");
                                getOrderList();
                            }
                        });
                    }else{
                        pageNO = config.start = "1";
                        $("#pagination_div").empty();
                        $("#ol-ul").html("<span style='margin:80px 0;display:inline-block;font-size:30px;width: 100%;text-align: center;'>暂无数据</span>");
                    }
                }else{
                    pageNO = config.start = "1";
                    $("#pagination_div").empty();
                    $("#ol-ul").html("<span style='margin:80px 0;display:inline-block;font-size:30px;width: 100%;text-align: center;'>暂无数据</span>");
                }
            });
    }

    function getStatus(status) {
        var res = orderStatus[status] || "未知状态";
        if(res == "待支付"){
            return "<span status='1' class=\"button\">待支付</span>";
        }
        return "<span status='2' class=\"button close-button\">"+res+"</span>";
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

    return {
        init: function() {
            initView();
            Helper.init();
        }
    }
});