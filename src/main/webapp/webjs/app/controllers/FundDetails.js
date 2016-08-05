define('app/controllers/FundDetails', [
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/common/Global',
    'app/common/Dict',
    'app/controllers/Helper',
    "app/ux/GenericDateRange",
    "app/jquery/Pagination",
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query, Ajax,
            Global, Dict, Helper, DateRange, Pagination) {
    var now = new Date(),
        dateRange = new DateRange({
        "endDate": now,
        "startDate": new Date((new Date()).setDate(now.getDate() - 6))
    }), config = {
        "dateStart": "",
        "dateEnd": "",
        "start": 1,
        "limit": 8,
        "bizType": "",
        "accountNumber": ""
    }, totalPage = 0, totalCount = 0, fundType = Dict.get("fundType");

    function initView() {
        dateRange.placeAt("dateSelect");
        Ajax.get(Global.baseUrl + "/account/infos/page", {"start": 0, "limit": 8}, true)
            .then(function (response) {
                if(response.success){
                    config.accountNumber = response.data.list[0].accountNumber;
                    queryFundDetails();
                }else{
                    addNoneData("#fd-table");
                }
            });
        addListeners();
        (function () {
            var html = "<option value=''>全部</option>";
            for(var n in fundType){
                html += '<option value="'+n+'">'+fundType[n]+'</option>';
            }
            $("#fundSelect").html(html);
        })();
    }

    function queryFundDetails(){
        var url = Global.baseUrl + "/account/detail/page", dd = dateRange.getData();
            config.dateStart = dd.start_date;
            config.dateEnd = dd.end_date;
        Ajax.get(url, config, true)
            .then(function (response) {
                if(response.success){
                    var data = response.data,
                        list = data.list;
                    totalCount = data.totalCount;
                    totalPage = data.totalPage;
                    if(list.length){
                        var html = "";
                        list.forEach(function (ll) {
                            html +=
                                '<tr>' +
                                '<td>'+ll.ajNo+'</td>' +
                                '<td>'+Global.roundAmount(+ll.preAmount / 1000, 2)+'</td>' +
                                '<td>'+Global.roundAmount(+ll.transAmount / 1000, 2)+'</td>' +
                                '<td>'+Global.roundAmount(+ll.postAmount / 1000, 2)+'</td>' +
                                '<td>'+(fundType[ll.bizType] || "未知类型")+'</td>' +
                                '<td>'+getMyDate(ll.createDatetime)+'</td>' +
                                '<td>'+ll.refNo+'</td>' +
                                '<td>'+ll.remark+'</td>' +
                                '</tr>';
                        });
                        $("#fd-table").find("tbody").html(html);
                        $("#pagination_div").pagination({
                            items: totalCount,
                            itemsOnPage: config.limit,
                            pages: totalPage,
                            prevText: '<',
                            nextText: '>',
                            displayedPages: '3',
                            currentPage: config.start,
                            onPageClick: function(pageNumber){
                                config.start = pageNumber;
                                addLoading("#fd-table");
                                queryFundDetails();
                            }
                        });
                    }else{
                        addNoneData("#fd-table");
                    }
                }else{
                    addNoneData("#fd-table");
                }
            });
    }

    function addLoading(id) {
        $(id).find("tbody").html('<tr><td colspan="8"><i class="loading-icon"></i></td></tr>');
    }
    function addNoneData(id) {
        $(id).find("tbody").html('<tr><td colspan="8"><span style="margin:80px;display:inline-block;font-size:30px;">暂无数据</span></td></tr>');
    }

    function getMyDate(value) {
        var date = new Date(value);
        return get2(date.getFullYear()) + "-" + get2(date.getMonth() + 1) + "-" + get2(date.getDate()) + " " +
            get2(date.getHours()) + ":" + get2(date.getMinutes()) + ":" + get2(date.getSeconds());
    }

    function getMyDate1(value) {
        var date = new Date(value);
        return date.getFullYear() + "-" + get2((date.getMonth() + 1)) + "-" + get2(date.getDate());
    }

    function get2(val) {
        if(val < 10){
            return "0" + val;
        }else{
            return val;
        }
    }

    function addListeners() {
        on(dom.byId("fundSelect"), "change", function(){
            config.bizType = this.selectedOptions[0].value || "";
            addLoading("#fd-table");
            queryFundDetails();
        });
        $("#search").on("click", function () {
            addLoading("#fd-table");
            queryFundDetails();
        });
        $("#dateSelect").on("change", "input", function () {
            dateRange.setValues({
                "startDate": dateRange.get("startDate"),
                "endDate": dateRange.get("endDate")
            });
        });
    }

    return {
        init: function() {
            initView();
            Helper.init();
        }
    }
});