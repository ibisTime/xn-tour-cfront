define([
    'app/controller/base',
    'app/util/ajax',
    'iScroll',
    'app/module/foot/foot',
    'swiper'
], function(base, Ajax, iScroll, Foot, Swiper) {

    var myScroll, bannerArr = [];

    init();

    function init() {
        Foot.addFoot(0);
        addListener();
        initIScroll();
        initSwiper();
        getModule();
        // getPageLine();
    }
    function initSwiper(){
        new Swiper('#swiperInner', {
            'direction': 'horizontal',
            'loop': true,
            'autoplay': 4000,
            'autoplayDisableOnInteraction': false,
            'pagination': '.swiper-pagination'
        });
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

    function getModule(){
        Ajax.get("806052", {location: "home_page"})
            .then(function(res){
                if(res.success){
                    var data = res.data;
                    var html = "";
                    $.each(data, function(i, d){
                        var url = d.url;
                        if(/^page:/.test(url)){
                            url = url.replace(/^page:/, "../")
                                     .replace(/\?/, ".html?");
                            if(!/\?/.test(url)){
                                url = url + ".html";
                            }
                        }
                        html +='<li class="nav-li nav-li-4">'+
                                '<a class="wp100 show" href="'+url+'">'+
                                    '<div class="nav-li-img"><img src="'+base.getImg(d.pic)+'"/></div>'+
                                    '<div class="nav-li-text">'+d.name+'</div>'+
                                '</a>'+
                            '</li>';
                    });
                    $("#module").html(html);
                }else{
                    base.showMsg(res.msg || "加载失败");
                    loading.hideLoading();
                }
            }, function(){
                loading.hideLoading();
                base.showMsg("加载失败");
            });
    }

    function addListener() {

    }
});