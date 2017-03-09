define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading',
    'app/util/dict',
    'app/module/scroll/scroll'
], function(base, Ajax, Handlebars, loading, Dict, scroll) {

    var myScroll, isEnd = false, isLoading = false;
    var travelTmpl = __inline("../../ui/travel-note-list.handlebars");
    var travelNoteStatus = Dict.get("travelNoteStatus");
    //0 待审核 1 审核通过 2 审核不通过
    var config = {
        start: 1,
        limit: 10,
        userId: base.getUserId()
    };

    init();

    function init() {
        initIScroll();
        loading.createLoading();
        Handlebars.registerHelper('formatNoteStatus', function(text, options){
            return travelNoteStatus[text];
        });
        getPageTravelNote(true)
            .then(function(){
                loading.hideLoading();
            }, function(){
                loading.hideLoading();
            });
        addListeners();
    }

    function addListeners() {
        $("#content").on("click", ".travel-note-item-del", function (e) {
            e.stopPropagation();
            e.preventDefault();
            var _self = this;
            base.confirm("确认删除吗？")
                .then(deleteTravel.bind(_self), base.emptyFun);
        });
    }

    function deleteTravel() {
        loading.createLoading();
        Ajax.post("618121", {
            json: {
                code: $(this).attr("data-code"),
                userId: base.getUserId()
            }
        }).then(function (res) {
            loading.hideLoading();
            if(res.success){
                base.showMsg("删除成功", 100);
                setTimeout(function () {
                    loading.createLoading();
                    getPageTravelNote(true)
                        .then(function(){
                            loading.hideLoading();
                        }, function(){
                            loading.hideLoading();
                        });;
                }, 100);
            }else{
                base.showMsg(res.msg);
            }
        }, function () {
            loading.hideLoading();
            base.showMsg("删除失败");
        });
    }
    
    function getPageTravelNote(refresh){
        if(!isLoading && (!isEnd || refresh) ){
            base.showPullUp();
            return Ajax.get("618130", config, !refresh)
                .then(function(res){
                    if(res.success && res.data.list.length){
                        var list = res.data.list;
                        if(list.length < config.limit){
                            isEnd = true;
                        }
                        $("#content")[refresh ? "html" : "append"](travelTmpl({items: list}));
                        base.hidePullUp();
                        isLoading = false;
                    }else{
                        if(refresh){
                            $("#content").html('<div class="item-error">暂无相关游记</div>');
                        }
                        base.hidePullUp();
                        isLoading = false;
                        res.msg && base.showMsg(res.msg);
                    }
                    myScroll.refresh();
                }, function(){
                    if(refresh){
                        $("#content").html('<div class="item-error">暂无相关游记</div>');
                    }
                    base.hidePullUp();
                    isLoading = false;
                    base.showMsg("游记信息获取失败");
                });
        }
    }

    function initIScroll(){
        myScroll = scroll.getInstance().getNormalScroll({
            loadMore: function () {
                getPageTravelNote();
            },
            refresh: function () {
                isEnd = false;
                getPageTravelNote(true);
            }
        });
    }
});