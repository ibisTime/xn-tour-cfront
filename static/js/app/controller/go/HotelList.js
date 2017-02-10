define([
    'app/controller/base',
    'app/util/ajax',
    'iScroll'
], function(base, Ajax, iScroll) {

    var myScroll;

    init();

    function init() {
        addListener();
        initIScroll();
    }

    function initIScroll(){
        var pullDownEl, pullDownOffset, $pullDownEl;

        function pullDownAction () {
            setTimeout(function () {
                console.log("下拉刷新");
                
                myScroll.refresh();
            }, 1000);
        }

        loaded();
        function loaded() {
            $pullDownEl = $("#pullDown");
            pullDownEl = $pullDownEl[0];
            pullDownOffset = pullDownEl.offsetHeight;
            
            myScroll = new iScroll('wrapper', {
                useTransition: false,
                topOffset: pullDownOffset,
                onRefresh: function () {
                    if ($pullDownEl.hasClass('scroll-loading')) {
                        $pullDownEl.removeClass('scroll-loading');
                    }
                },
                onScrollMove: function () {
                    if (this.y > 5 && !$pullDownEl.hasClass("flip")) {
                        $pullDownEl.addClass("flip");
                        this.minScrollY = 0;
                    } else if (this.y < 5 && $pullDownEl.hasClass("flip")) {
                        $pullDownEl.removeClass("flip");
                        this.minScrollY = -pullDownOffset;
                    } else if (this.y - 20 < this.maxScrollY) {
                        console.log("上拉加载更多");
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
    }

    function addListener() {
        $("#top-nav").on("click", ".go-top-li", function (e) {
            var _self = $(this), idx = _self.index();
            $("#content").find(".jcont").removeClass("active");
            $("#top-content").find(".top-nav").removeClass("active");
            $("#top-nav").find(".active").removeClass("active");
            $(".J_Content" + idx).addClass("active");
            myScroll.refresh();
        })
    }
});