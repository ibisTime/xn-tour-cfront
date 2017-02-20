define([
    'app/controller/base',
    'app/util/ajax',
    'iScroll',
    'app/module/foot/foot',
    'app/module/loading/loading',
    'app/module/showImg/showImg'
], function(base, Ajax, iScroll, Foot, loading, showImg) {

    var myScroll;

    init();

    function init() {
        loading.createLoading();
        if(!base.isLogin()){
            base.goLogin();
            return;
        }
        Foot.addFoot(3);
        getUser();
        initIScroll();
        addListener();
    }

    function initIScroll(){
        var pullDownEl, pullDownOffset, $pullDownEl;

        function pullDownAction () {
            getUser(true);
        }
        $pullDownEl = $("#pullDown");
        pullDownEl = $pullDownEl[0];
        pullDownOffset = pullDownEl.offsetHeight;
        
        myScroll = new iScroll('wrapper', {
            // scrollbarClass: 'myScrollbar', /* 重要样式 */
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

    function addListener() {
        $("#avatar").on("click", function(){
            showImg.createImg($(this).attr("src")).showImg();
        });
    }

    function getUser(refresh){
        base.getUser(refresh)
            .then(function(res){
                if(res.success){
                    $("#jfAmount").html(res.data.ljAmount);
                    $("#nickname").html(res.data.nickname);
                    $("#avatar").attr("src", base.getWXAvatar(res.data.userExt.photo));
                }
                myScroll.refresh();
                loading.hideLoading();
            }, function(){
                myScroll.refresh();
                loading.hideLoading();
            });
    }
});