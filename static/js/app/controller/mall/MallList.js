define([
    'app/controller/base',
    'app/util/ajax',
    'iScroll'
], function(base, Ajax, iScroll) {

    var myScroll, bannerArr = [];

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
                        $pullDownEl.removeClass('scroll-loading flip');
                    }
                },
                onScrollMove: function () {
                    if($pullDownEl.hasClass("hidden")){
                        $pullDownEl.removeClass("hidden");
                    }
                    if (this.y > 5 && !$pullDownEl.hasClass("flip")) {
                        $pullDownEl.addClass("flip");
                        this.minScrollY = 0;
                    } else if (this.y < 5 && $pullDownEl.hasClass("flip")) {
                        $pullDownEl.removeClass("flip");
                        this.minScrollY = -pullDownOffset;
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

    }
});