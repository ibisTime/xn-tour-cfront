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
    'app/jquery/$',
    'app/jquery/Pagination',
    'app/views/operator/ShowMsg',
    'app/ux/GenericTooltip',
    'app/common/Dict',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query, Ajax, Global,
            Helper, J, Pagination, ShowMsg, Tooltip, Dict) {

    var pageConfig = {
            "start": 1,
            "limit": 8,
            "code": ""
        }, url = Global.baseUrl + "/operators/queryPageCommodity",
        totalCount = 0, totalPage = 1, commitHandler = "",
        pageWxdConfig = {
            "start": 1,
            "limit": 8,
            "goodsCode": ""
        }, wxdUrl = Global.baseUrl + "/operators/queryPageRepairOrder",
        wxdTotalCount = 0, wxdTotalPage = 1, wxdStatus = Dict.get("wxdStatus");

    function initView() {
        queryCommondity();
        addListeners();
    }

    function queryCommondity() {
        Ajax.get(url, pageConfig, true)
            .then(function (response) {
                if(response.success){
                    var data = response.data,
                        list = data.list, html = "";
                    totalCount = data.totalCount;
                    totalPage = data.totalPage;
                    if(list.length){
                        list.forEach(function (ll) {
                            html +=
                                '<tr>' +
                                '<td>'+ll.code+'</td>' +
                                '<td>'+ll.modelName+'</td>' +
                                '<td>'+ll.productName+'</td>' +
                                '<td><a class="mended">我要报修</a></td>' +
                                '</tr>';
                        });
                        $("#pm-table").find("tbody").html(html);
                        $("#pagination_div").pagination({
                            items: totalCount,
                            itemsOnPage: pageConfig.limit,
                            pages: totalPage,
                            prevText: '<',
                            nextText: '>',
                            displayedPages: '2',
                            currentPage: pageConfig.start,
                            onPageClick: function(pageNumber){
                                pageConfig.start = pageNumber;
                                addLoading("#pm-table");
                                queryCommondity();
                            }
                        });
                    }else{
                        addNoneData("#pm-table");
                    }
                }else{
                    addNoneData("#pm-table");
                }
            });
    }
    function addLoading(id) {
        $(id).find("tbody").html('<tr><td colspan="4"><i class="loading-icon"></i></td></tr>');
    }
    function addNoneData(id) {
        $(id).find("tbody").html('<tr><td colspan="4"><span style="margin: 80px 0;display: inline-block;font-size: 24px;width: 100%;text-align: center;"><img style="margin-bottom: 20px;" src="'+Global.staticUrl+'/images/noData.png"/><br>暂无数据</span></td></tr>');
    }
    function commitOrder() {
        commitHandler.remove();
        $("#commitBtn").css("cursor", "default").text("提交中...");
        var url = Global.baseUrl + "/operators/submitRepairOrder",
            config = {
                "goodsCode": $("#goodsCode").text(),
                "applyUser": $("#applyUser").val(),
                "contact": $("#contact").val(),
                "applyReason": $("#applyReason").val()
            };
        Ajax.post(url, config)
            .then(function (response) {
                if(response.success){
                    new ShowMsg({
                        "msg": "提交成功！",
                        "btn": function () {
                            showWXD();
                            this.close();
                        }
                    }).show();
                }else{
                    new ShowMsg({
                        "msg": response.msg,
                        "btn": function () {
                            this.close();
                        }
                    }).show();
                }
                $("#commitBtn").css("cursor", "pointer").text("提交");
                commitHandler = on(dom.byId("commitBtn"), "click", function () {
                    if(/^[\d]+-?[\d]+$/.test(dom.byId("contact").value)){
                        commitOrder();
                    }else{
                        Tooltip.show("联系方式错误！", dom.byId("contact"), "warning");
                    }
                });
            });
    }

    function showWXD() {
        getPageWxd();
        dom.byId("as-fw").style.display = "none";
        dom.byId("as-wxd").style.display = "block";
        dom.byId("as-bx").style.display = "none";
    }

    function getPageWxd() {
        Ajax.get(wxdUrl, pageWxdConfig, true)
            .then(function (response) {
                if(response.success){
                    var data = response.data,
                        list = data.list, html = "";
                    wxdTotalCount = data.totalCount;
                    wxdTotalPage = data.totalPage;
                    if(list.length){
                        list.forEach(function (ll) {
                            html +=
                                '<tr>' +
                                '<td>'+ll.code+'</td>' +
                                '<td>'+ll.goodsCode+'</td>' +
                                '<td>'+getMyDate(ll.applyDatetime)+'</td>' +
                                '<td>'+getWxdStatus(ll.status)+'</td>' +
                                '</tr>';
                        });
                        $("#wxd-table").find("tbody").html(html);
                        $("#pagination_div").pagination({
                            items: wxdTotalCount,
                            itemsOnPage: pageWxdConfig.limit,
                            pages: wxdTotalPage,
                            prevText: '<',
                            nextText: '>',
                            displayedPages: '2',
                            currentPage: pageWxdConfig.start,
                            onPageClick: function(pageNumber){
                                pageWxdConfig.start = pageNumber;
                                addLoading("#wxd-table");
                                getPageWxd();
                            }
                        });
                    }else{
                        addNoneData("#wxd-table");
                    }
                }else{
                    addNoneData("#wxd-table");
                }
            });
    }

    function getWxdStatus(status) {
        var ss = wxdStatus[ status ] || "未知状态",
            cc;
        if(ss == "待处理"){
            cc = "c_FD3D3D";
        }else if(ss == "已受理"){
            cc = "c_47DF41";
        }else if(ss == "已关闭"){
            cc = "c_b3b3b3";
        }
        return '<span class="'+cc+'">'+ss+'</span>'
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

    function showBX(me){
        var $tr = $(me).parent().parent();
        $("#goodsCode").text($tr.children("td:first").text());
        $("#modelName").text($tr.children("td:eq(1)").text());
        $("#productName").text($tr.children("td:eq(2)").text());
        $("#applyUser").val("");
        $("#contact").val("");
        $("#applyReason").val("");
        dom.byId("as-fw").style.display = "none";
        dom.byId("as-wxd").style.display = "none";
        dom.byId("as-bx").style.display = "block";
        $("#pagination_div").hide();
    }

    function showFW(){
        dom.byId("as-fw").style.display = "block";
        dom.byId("as-bx").style.display = "none";
        dom.byId("as-wxd").style.display = "none";
        addLoading("#pm-table");
        queryCommondity();
    }

    function addListeners() {
        $("#as-search-btn").on("click", function () {
            pageConfig.code = dom.byId("as-search").value;
            pageConfig.start = 1;
            addLoading("#pm-table");
            queryCommondity();
        });
        on(dom.byId("backBtn"), "click", showFW);
        on(dom.byId("wxdBackBtn"), "click", showFW);
        commitHandler = on(dom.byId("commitBtn"), "click", function () {
            if(/^[\d]+-?[\d]+$/.test(dom.byId("contact").value)){
                commitOrder();
            }else{
                Tooltip.show("联系方式错误！", dom.byId("contact"), "warning");
            }
        });
        on(dom.byId("pm-table"), "a:click", function () {
            showBX(this);
        });
        on(dom.byId("asWxd"), "click", function () {
            showWXD();
        });
        $("#wxd-search-btn").on("click", function () {
            pageWxdConfig.goodsCode = dom.byId("wxd-search").value;
            pageWxdConfig.start = 1;
            addLoading("#wxd-table");
            getPageWxd();
        });
        on(dom.byId("as-search"), "keyup", function (e) {
            var keyCode = e.charCode || e.keyCode;
            if(keyCode == 13){
                $("#as-search-btn").click();
            }
        });
        on(dom.byId("wxd-search"), "keyup", function (e) {
            var keyCode = e.charCode || e.keyCode;
            if(keyCode == 13){
                $("#wxd-search-btn").click();
            }
        });
    }

    return {
        init: function() {
            initView();
            Helper.init();
        }
    }
});