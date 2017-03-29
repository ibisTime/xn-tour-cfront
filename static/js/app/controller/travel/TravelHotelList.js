define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/util/handlebarsHelpers',
    'app/module/scroll/scroll'
], function(base, Ajax, loading, Handlebars, scroll) {

    var lineCode = base.getUrlParam('code'),
        start = 1, limit = 10, isEnd = false, isLoading = false;
    var returnUrl = base.getReturnParam();
    var hotelTmpl = __inline("../../ui/travel-hotel-list.handlebars");
    var lineInfo = sessionStorage.getItem("line-info");
    var myScroll, hotelCode, module;
    var first = true;

    init();

    function init() {
        if(lineCode){
            Handlebars.registerHelper('formatReturn', function(data, options){
                return data + "&return=" + returnUrl;
            });
            if(lineInfo){
                lineInfo = $.parseJSON(lineInfo);
                if(lineInfo[lineCode])
                    hotelCode = lineInfo[lineCode].hotalCode;
            }
            loading.createLoading();
            //已选择推荐酒店
            if(hotelCode){
                $("#chosedCont, #choseBtns").show();
                $.when(
                    getModuleNav(),
                    getHotel()
                ).then(function(res1, res2){
                    if(res1.success && res2.success){
                        module = res1.data;
                        Handlebars.registerHelper('formatCategory', function(category, options){
                            return base.findObj(module, "code", category)["name"];
                        });
                        $("#chosedCont").html(hotelTmpl({items: [res2.data.hotal]}));
                    }else{
                        base.showMsg("加载失败");
                    }
                    loading.hideLoading();
                }, function(){
                    base.showMsg("加载失败");
                    loading.hideLoading();
                })
            }else{
                first = false;
                $("#wrapper, #fix-b").show();
                initIScroll();
                getModuleNav()
                    .then(function(res){
                        if(res.success){
                            module = res.data;
                            Handlebars.registerHelper('formatCategory', function(category, options){
                                return base.findObj(module, "code", category)["name"];
                            });
                            getPageHotel(true);
                            hotelCode = true;
                        }else{
                            base.showMsg("加载失败");
                        }
                        loading.hideLoading();
                    }, function(){
                        base.showMsg("加载失败");
                        loading.hideLoading();
                    })
            }
            initIScroll();
            addListener();
        }else{
            base.showMsg("未传入线路编号");
        }
    }
    function getModuleNav(){
        return Ajax.get("806052", {
            type: 3,
            location: 'depart_hotel'
        });
    }
    function getHotel(){
        return Ajax.get("618012", {
            code: hotelCode
        });
    }

    function initIScroll(){
        myScroll = scroll.getInstance().getNormalScroll({
            loadMore: function () {
                if(hotelCode){
                    getPageHotel();
                }else{
                    getNormalPageHotel();
                }
            },
            refresh: function () {
                isEnd = false;
                if(hotelCode){
                    getPageHotel(true);
                }else{
                    getNormalPageHotel(true);
                }
            }
        });
    }

    function getPageHotel(refresh){
        if( !isLoading && (!isEnd || refresh) ){
            isLoading = true;
            start = refresh && 1 || start;
            return Ajax.get("618103", {
                start: start,
                limit: limit,
                type: '2',
                lineCode: lineCode,
                status: "1"
            }, !refresh)
                .then(function (res) {
                    if(res.success && res.data.list.length){
                        var data = res.data.list;
                        if(data.length < limit){
                            isEnd = true;
                            base.hidePullUp();
                        }else{
                            base.showPullUp();
                        }
                        var arr = [];
                        $.each(data, function(i, d){
                            if(d.isOnline == "1")
                                arr.push(d.hotal);
                        });
                        $("#content")[refresh ? "html" : "append"](hotelTmpl({items: arr}));
                        start++;
                    }else{
                        refresh && $("#content").html('<div class="item-error">暂无推荐酒店</div>');
                        isEnd = true;
                        base.hidePullUp();
                        res.msg && base.showMsg(res.msg);
                    }
                    isLoading = false;
                    loading.hideLoading();
                    myScroll.refresh();
                }, function(){
                    isLoading = false;
                    isEnd = true;
                    refresh && $("#content").html('<div class="item-error">暂无推荐酒店</div>');
                    myScroll.refresh();
                    loading.hideLoading();
                });
        }else{
            loading.hideLoading();
        }
    }

    function addListener() {
        $("#cxxzBtn").on("click", function(){
            $("#wrapper, #fix-b").show();
            $("#content").empty();
            $("#chosedCont, #choseBtns").hide();
            loading.createLoading();
            isLoading = false;
            isEnd = false;
            start = 1;
            if(first)
                initIScroll();
            first = false;
            getPageHotel(true);
        });
        $("#scBtn").on("click", function(){
            deleteHotel();
            history.back();
        });
        $("#xzqtBtn").on("click", function(){
            hotelCode = "";
            isLoading = false;
            isEnd = false;
            start = 1;
            getNormalPageHotel(true);
            $("#fix-b").hide();
        });
    }
    function getNormalPageHotel(refresh){
        if( !isLoading && (!isEnd || refresh) ){
            $("#wrapper").css("bottom", "0");
            isLoading = true;
            start = refresh && 1 || start;
            return Ajax.get("618010", {
                start: start,
                limit: limit,
                status: "1",
                orderDir: "asc",
                orderColumn: "order_no"
            }, !refresh)
                .then(function (res) {
                    if(res.success && res.data.list.length){
                        var data = res.data.list;
                        if(data.length < limit){
                            isEnd = true;
                            base.hidePullUp();
                        }else{
                            base.showPullUp();
                        }
                        $("#content")[refresh ? "html" : "append"](hotelTmpl({items: data}));
                        start++;
                    }else{
                        if(refresh){
                            $("#content").html('<div class="item-error">暂无相关酒店</div>');
                        }
                        isEnd = true;
                        base.hidePullUp();
                        res.msg && base.showMsg(res.msg);
                    }
                    isLoading = false;
                    loading.hideLoading();
                    myScroll.refresh();
                }, function(){
                    isLoading = false;
                    isEnd = true;
                    $("#content").html('<div class="item-error">暂无相关酒店</div>');
                    myScroll.refresh();
                    loading.hideLoading();
                });
        }else{
            loading.hideLoading();
        }
    }
    function deleteHotel(){
        lineInfo[lineCode].hotalCode && (delete lineInfo[lineCode].hotalCode);
        lineInfo[lineCode].roomType && (delete lineInfo[lineCode].roomType);
        lineInfo[lineCode].startDate && (delete lineInfo[lineCode].startDate);
        lineInfo[lineCode].endDate && (delete lineInfo[lineCode].endDate);
        lineInfo[lineCode].quantity && (delete lineInfo[lineCode].quantity);
        lineInfo[lineCode].hotelName && (delete lineInfo[lineCode].hotelName);
        lineInfo[lineCode].checkInMobile && (delete lineInfo[lineCode].checkInMobile);
        lineInfo[lineCode].checkInName && (delete lineInfo[lineCode].checkInName);
        sessionStorage.setItem("line-info", JSON.stringify(lineInfo));
    }
});
