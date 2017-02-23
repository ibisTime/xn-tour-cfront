define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading',
    'iScroll',
    'app/module/loadImg/loadImg'
], function(base, Ajax, Handlebars, loading, iScroll, loadImg) {

    var myScroll, isLoading = false, isEnd = false,
        config = {
            status: "1",
            start: 1,
            limit: 10
        };
    var mallTmpl = __inline("../../ui/mall-list.handlebars");

    init();

    function init() {
        addListener();
        initIScroll();
        getPageData(true);
    }

    function initIScroll() {
        var pullDownEl, pullDownOffset, $pullDownEl;

        function pullDownAction() {
            isEnd = false;
            getPageData(true);
        }
        $pullDownEl = $("#pullDown");
        pullDownEl = $pullDownEl[0];
        pullDownOffset = pullDownEl.offsetHeight;

        myScroll = new iScroll('wrapper', {
            useTransition: false,
            topOffset: pullDownOffset,
            onRefresh: function() {
                if ($pullDownEl.hasClass('scroll-loading')) {
                    $pullDownEl.removeClass('scroll-loading flip');
                }
            },
            onScrollMove: function() {
                if (this.y > 5 && !$pullDownEl.hasClass("flip")) {
                    $pullDownEl.addClass("flip");
                    this.minScrollY = 0;
                } else if (this.y < 5 && $pullDownEl.hasClass("flip")) {
                    $pullDownEl.removeClass("flip");
                    this.minScrollY = -pullDownOffset;
                } else if (this.y - 120 < this.maxScrollY) {
                    getPageData();
                }
            },
            onScrollEnd: function() {
                if ($pullDownEl.hasClass("flip")) {
                    $pullDownEl.addClass("scroll-loading");
                    pullDownAction();
                }
            }
        });
    }

    function getPageData(refresh) {
        if (!isLoading && (!isEnd || refresh)) {
            isLoading = true;
            config.start = refresh && 1 || config.start;
            Ajax.get("618420", config, !refresh)
                .then(function (res) {
                    if(res.success && res.data.list.length){
                        var data = res.data.list;
                        if(data.length < config.limit){
                            isEnd = true;
                            base.hidePullUp();
                        }else{
                            base.showPullUp();
                        }
                        $("#content")
                            [refresh ? "html" : "append"]( loadImg.loadImg(mallTmpl({items: data})) );
                    }else{
                        if(refresh){
                            $("#content").html('<div class="item-error">暂无商品信息</div>');
                            isEnd = true;
                        }
                        base.hidePullUp();
                        res.msg && base.showMsg(res.msg);
                    }
                    isLoading = false;
                    loading.hideLoading();
                    myScroll.refresh();
                }, function () {
                    if(refresh){
                        $("#content").html('<div class="item-error">暂无商品信息</div>');
                        // base.showMsg("商品信息获取失败");
                        isEnd = true;
                    }
                    isLoading = false;
                    base.hidePullUp();
                    myScroll.refresh();
                });
        }
    }

    function addListener() {

    }
});