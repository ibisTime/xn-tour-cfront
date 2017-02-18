define([
    'app/controller/base',
    'app/util/ajax',
    'iScroll',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading',
    'app/util/dict'
], function(base, Ajax, iScroll, Handlebars, loading, Dict) {

    var myScroll, isEnd = false, isLoading = false;
    var travelTmpl = __inline("../../ui/travel-note-list.handlebars");
    var travelNoteStatus = Dict.get("travelNoteStatus");
    //0 待审核 1 审核通过 2 审核不通过
    var config = {
        start: 1,
        limit: 10
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
        var pullDownEl, pullDownOffset, $pullDownEl;

        function pullDownAction () {
            getPageTravelNote(true);
        }
        $pullDownEl = $("#pullDown");
        pullDownEl = $pullDownEl[0];
        pullDownOffset = pullDownEl.offsetHeight;
        
        myScroll = new iScroll('wrapper', {
            useTransition: false,
            topOffset: pullDownOffset,
            onRefresh: function () {
                if ($pullDownEl.hasClass('scroll-loading')) {
                    $pullDownEl.removeClass('scroll-loading flip');
                }
            },
            onScrollMove: function () {
                if (this.y > 5 && !$pullDownEl.hasClass("flip")) {
                    $pullDownEl.addClass("flip");
                    this.minScrollY = 0;
                } else if (this.y < 5 && $pullDownEl.hasClass("flip")) {
                    $pullDownEl.removeClass("flip");
                    this.minScrollY = -pullDownOffset;
                } else if (this.y - 120 < this.maxScrollY) {
                    getPageTravelNote();
                }
            },
            onScrollEnd: function () {
                if ($pullDownEl.hasClass("flip")) {
                    $pullDownEl.addClass("scroll-loading");
                    isEnd = false;        
                    pullDownAction();
                }
            }
        });
    }
});