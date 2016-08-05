define('app/controllers/ProductModel', [
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/common/Global',
    'app/controllers/Helper',
    'app/ux/GenericTooltip',
    'app/jquery/$',
    'app/jquery/Pagination',
    'app/views/operator/Confirm',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query, Ajax,
            Global, Helper, Tooltip, J, Pagination, Confirm) {

    var config = {
            "start": 1,
            "limit": 5,
            "name": "",
            "productName": ""
        }, pageUrl = Global.baseUrl + '/commodity/queryPageModel',
        totalCount = 0, totalPage = 1;

    function initView() {
        getPageModel();
        addListeners();
    }
    
    function getPageModel() {
        Ajax.post(pageUrl, config)
            .then(function (response) {
                if(response.success){
                    var data = response.data,
                        list = data.list, html = '';
                    if(list.length){
                        config.start = data.pageNO;
                        totalCount = data.totalCount;
                        totalPage = data.totalPage;
                        var i = 0;
                        list.forEach(function(ll){
                            if(ll.buyGuideList.length){
                                html += '<li code="'+ll.code+'"><div class="cb-nav">' +
                                        '<span class="pm-info">商品信息</span>' +
                                        '<span class="pm-modelN">型号名称</span>' +
                                        '<span class="pm-productN">产品名称</span>' +
                                        '<span class="pm-unit">单价</span>' +
                                        '<span class="pm-detail">操作</span>' +
                                    '</div>' +
                                    '<div class="cb-list-item ol-list-item">' +
                                        '<ul style="padding: 0 0 0 35px;">' +
                                            '<li class="order-img"><a target="_blank" href="'+Global.baseUrl+'/detail/mall_detail.htm?code='+ll.productCode+'"><img src="'+ll.pic1+'"></a></li>' +
                                            '<li class="order-name" style="width: 318px;"><span style="margin-left: 20px;display: block;word-wrap: break-word;line-height: 1.2em;vertical-align: middle;"><pre>'+ll.name+'</pre></span></li>' +
                                            '<li class="order-unit" style="width: 270px;"><pre style="line-height: 1.2em;word-wrap: break-word;">'+ll.productName+'</pre></li>' +
                                            '<li class="order-amount" style="width: 164px;">￥'+Global.roundAmount(+ll.buyGuideList[0].discountPrice / 1000, 2)+'</li>' +
                                            '<li class="order-detail no-pay"><span class="button">我要批发</span></li>' +
                                        '</ul>' +
                                    '</div></li>';
                                i++;
                            }
                        });
                        $("#pm-ul").html(html);
                        $("#pagination_div").pagination({
                            items: totalCount,
                            itemsOnPage: config.limit,
                            pages: totalPage,
                            prevText: '<',
                            nextText: '>',
                            displayedPages: '2',
                            currentPage: config.start,
                            onPageClick: function(pageNumber){
                                config.start = pageNumber;
                                addLoadingIcon();
                                getPageModel();
                            }
                        });
                    }else{
                        doError("暂无数据");
                    }
                }else{
                    doError("无法获取数据");
                }
            });
    }

    function addLoadingIcon() {
        $("#pm-ul").html('<li><i class="loading-icon" style="height: 442px;margin-bottom: 0;"></i></li>');
    }

    function addListeners() {
        $("#pmSearch").on("click", function () {
            config.start = 1;
            config.name = dom.byId("modelName").value || "";
            config.productName = dom.byId("productName").value || "";
            addLoadingIcon();
            getPageModel();
        });
        on(dom.byId("modelName"), "keyup", function (e) {
            var keyCode = e.charCode || e.keyCode;
            if(keyCode == 13){
                $("#pmSearch").click();
            }
        });
        on(dom.byId("productName"), "keyup", function (e) {
            var keyCode = e.charCode || e.keyCode;
            if(keyCode == 13){
                $("#pmSearch").click();
            }
        });
        on(dom.byId("pm-ul"), ".button:click", function () {
            var code = $(this).closest("li[code]").attr("code");
            location.href = Global.baseUrl + "/operator/submit_order.htm?code=" + code;

        });
    }

    function isNumber(code){
        if(code >= 48 && code <= 57 || code >= 96 && code <= 105){
            return true;
        }
        return false;
    }

    function isSpecialCode(code) {
        if(code == 37 || code == 39 || code == 8 || code == 46){
            return true;
        }
        return false;
    }

    function doError(msg) {
        var html = "<li><span style='margin: 80px 0;display: inline-block;font-size: 24px;width: 100%;text-align: center;'><img style='width: 120px;margin-bottom: 20px;' src='"+Global.staticUrl+"/images/noData.png'/><br>暂无数据</span></li>"
        $("#pm-ul").html(html);
    }

    return {
        init: function() {
            Helper.init();
            initView();
        }
    }
});