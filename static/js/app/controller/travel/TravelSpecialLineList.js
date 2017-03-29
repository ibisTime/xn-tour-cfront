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
    var sLineTmpl = __inline("../../ui/travel-special-line-list.handlebars");
    var lineInfo = sessionStorage.getItem("line-info");
    var myScroll, speLineCode, module;
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
                    speLineCode = lineInfo[lineCode].outCode;
            }
            loading.createLoading();
            //已选择推荐线路
            if(speLineCode){
                $("#chosedCont, #choseBtns").show();
                $.when(
                    getSpecialLine(),
                    getDictList()
                ).then(function(res, res1){
                    if(res.success && res1.success){
                        $("#chosedCont").html(sLineTmpl({items: [res.data]}));
                    }else{
                        base.showMsg(res.msg);
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
                getDictList()
                    .then(function(res){
                        if(res.success){
                            getPageSpeLine(true);
                            speLineCode = true;
                        }else{
                            base.showMsg("加载失败");
                        }
                        loading.hideLoading();
                    }, function(){
                        base.showMsg("加载失败");
                        loading.hideLoading();
                    })
            }
            addListener();
        }else{
            base.showMsg("未传入线路编号");
        }
    }
    function getDictList(){
        return $.when(
            base.getDictList("zero_type"),
            base.getDictList("destination_type")
        ).then(function(res1, res2){
            if(res1.success && res2.success){
                var startSelectArr = res1.data;
                var endSelectArr = res2.data;
                Handlebars.registerHelper('formatStartSite', function(site, options){
                    return site ? base.findObj(startSelectArr, "dkey", site)["dvalue"] : "--";
                });
                Handlebars.registerHelper('formatEndSite', function(site, options){
                    return site ? base.findObj(endSelectArr, "dkey", site)["dvalue"] : "--";
                });
                return res1;
            }else{
                loading.hideLoading();
                base.showMsg(res1.msg || res2.msg);
                return {
                    success: false,
                    msg: res1.msg || res2.msg
                }
            }
        }, function(){
            loading.hideLoading();
            base.showMsg("数据加载失败");
        });
    }
    function getSpecialLine(){
        return Ajax.get("618172", {
            code: speLineCode
        });
    }

    function initIScroll(){
        myScroll = scroll.getInstance().getNormalScroll({
            loadMore: function () {
                if(speLineCode){
                    getPageSpeLine();
                }else{
                    getNormalPageSpeLine();
                }
            },
            refresh: function () {
                isEnd = false;
                if(speLineCode){
                    getPageSpeLine(true);
                }else{
                    getNormalPageSpeLine(true);
                }
            }
        });
    }

    function getPageSpeLine(refresh){
        if( !isLoading && (!isEnd || refresh) ){
            isLoading = true;
            start = refresh && 1 || start;
            return Ajax.get("618103", {
                start: start,
                limit: limit,
                type: '1',
                lineCode: lineCode
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
                                arr.push(d.specialLine);
                        });
                        $("#content")[refresh ? "html" : "append"](sLineTmpl({items: arr}));
                        start++;
                    }else{
                        refresh && $("#content").html('<div class="item-error">暂无推荐出行</div>');
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
                    refresh && $("#content").html('<div class="item-error">暂无推荐出行</div>');
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
            getPageSpeLine(true);
        });
        $("#scBtn").on("click", function(){
            deleteSpeLine();
            history.back();
        });
        $("#xzqtBtn").on("click", function(){
            speLineCode = "";
            isLoading = false;
            isEnd = false;
            start = 1;
            getNormalPageSpeLine(true);
            $("#fix-b").hide();
        });
    }
    function getNormalPageSpeLine(refresh){
        if( !isLoading && (!isEnd || refresh) ){
            isLoading = true;
            start = refresh && 1 || start;
            $("#wrapper").css("bottom", "0");
            return Ajax.get("618170", {
                start: start,
                limit: limit,
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
                        $("#content")[refresh ? "html" : "append"](sLineTmpl({items: data}));
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
    function deleteSpeLine(){
        lineInfo[lineCode].outCode && (delete lineInfo[lineCode].outCode);
        lineInfo[lineCode].outName && (delete lineInfo[lineCode].outName);
        sessionStorage.setItem("line-info", JSON.stringify(lineInfo));
    }
});
