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
        Ajax.get("806052")
            .then(function(res){
                if(res.success){
                    var data = res.data;
                    var html0 = "", html1 = "", html2 = "";
                    $.each(data, function(i, d){
                        //出行-酒店
                        if(d.location == "depart_hotel" || d.location == "depart_deli" || d.location == "goout"){
                            var url = d.url;
                            if(/^page:/.test(url)){
                                url = url.replace(/^page:/, "../")
                                         .replace(/\?/, ".html?");
                                if(!/\?/.test(url)){
                                    url = url + ".html";
                                }
                            }
                            //酒店
                            if(d.location == "depart_hotel"){
                                config1.hotel.module.push(d);
                                html1 +='<li class="nav-li nav-li-4">'+
                                        '<a class="wp100 show" href="'+url+'">'+
                                            '<div class="nav-li-img"><img src="'+base.getImg(d.pic)+'"/></div>'+
                                            '<div class="nav-li-text">'+d.name+'</div>'+
                                        '</a>'+
                                    '</li>';
                            //美食
                            }else if(d.location == "depart_deli"){
                                config1.food.module.push(d);
                                html2 +='<li class="nav-li nav-li-4">'+
                                        '<a class="wp100 show" href="'+url+'">'+
                                            '<div class="nav-li-img"><img src="'+base.getImg(d.pic)+'"/></div>'+
                                            '<div class="nav-li-text">'+d.name+'</div>'+
                                        '</a>'+
                                    '</li>';
                            //出行
                            }else if(d.location == "goout"){
                                config1.outting.module.push(d);
                                html0 +='<li class="nav-li nav-li-4">'+
                                        '<a class="wp100 show" href="'+url+'">'+
                                            '<div class="nav-li-img"><img src="'+base.getImg(d.pic)+'"/></div>'+
                                            '<div class="nav-li-text">'+d.name+'</div>'+
                                        '</a>'+
                                    '</li>';
                            }
                        }
                    });
                    // $("#top-content").find(".J_Content0").html(html0);
                    $("#top-content").find(".J_Content1").html(html1);
                    $("#top-content").find(".J_Content2").html(html2);
                    Handlebars.registerHelper('formatCategory', function(category, options){
                        return base.findObj(config1.hotel.module, "code", category)["name"];
                    });
                    $("#top-nav").find(".go-top-li").eq(index).click();
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