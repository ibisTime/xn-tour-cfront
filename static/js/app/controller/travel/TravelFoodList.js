define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'iScroll',
    'app/util/handlebarsHelpers'
], function(base, Ajax, loading, iScroll, Handlebars) {
    var lineCode = base.getUrlParam("code");
    var myScroll, start = 1, limit = 10, isLoading = false,
        isEnd = false, foodTmpl = __inline("../../ui/go-food.handlebars");

    init();
    function init() {
        initIScroll();
        getPageFood(true);
    }

    function initIScroll(){
        var pullDownEl, pullDownOffset, $pullDownEl;

        function pullDownAction () {
            isEnd = false;
            getPageFood(true);
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
                    // console.log("上拉加载更多");
                    getPageFood();
                }
            },
            onScrollEnd: function () {
                if ($pullDownEl.hasClass("flip")) {
                    $pullDownEl.addClass("scroll-loading");           
                    pullDownAction();
                }
            }
        });
    }

    function getPageFood(refresh){
        if( !isLoading && (!isEnd || refresh) ){
            isLoading = true;
            start = refresh && 1 || start;
            return Ajax.get("618103", {
                start: start,
                limit: limit,
                type: '3',
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
                            arr.push(d.food);
                        });
                        $("#content")[refresh ? "html" : "append"](foodTmpl({items: arr}));
                        start++;
                    }else{
                        refresh && $("#content").html('<div class="item-error">暂无推荐美食</div>');
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
                    refresh && $("#content").html('<div class="item-error">暂无推荐美食</div>');
                    myScroll.refresh();
                    loading.hideLoading();
                });
        }else{
            loading.hideLoading();
        }
    }
});