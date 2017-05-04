define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/foot/foot',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading',
    'swiper',
    'app/module/citySelect/citySelect',
    'app/module/scroll/scroll'
], function(base, Ajax, Foot, Handlebars, loading, Swiper, citySelect, scroll) {

    var myScroll, isEnd = false, isLoading = false, bannerArr = []
        pic_suffix = '?imageMogr2/auto-orient/thumbnail/!375x180r';
    var travelTmpl = __inline("../ui/travel.handlebars");
    var config = {
        start: 1,
        limit: 10,
        status: "1",
        location: "2",
        orderDir: "asc",
        orderColumn: "order_no"
    }, citylist;

    init();

    function init() {
        Foot.addFoot(0);
        initIScroll();
        // base.initLocation(initConfig, getInitData);
        getInitData();
        addListener();
    }
    // function initConfig(result) {
    //     citylist = result;
    //     citySelect.addCont({
    //         cityList: citylist,
    //         success: function (city) {
    //             $("#headDW").text(city);
    //         }
    //     });
    //     getInitData();
    // }
    function getInitData() {
        loading.createLoading();
        $.when(
            getPageLine(true),
            getModuleAndBanner()
        ).then(function () {
            loading.hideLoading();
        }, function(){
            loading.hideLoading();
        });
    }
    function initSwiper(){
        new Swiper('#swiperInner', {
            'direction': 'horizontal',
            'autoplay': 4000,
            'autoplayDisableOnInteraction': false,
            'pagination': '.swiper-pagination',
            'preventClicksPropagation': true
        });
    }
    function initIScroll(){

        myScroll = scroll.getInstance().getNormalScroll({
            loadMore: function () {
                getPageLine();
            },
            refresh: function () {
                isEnd = false;
                getPageLine(true);
            }
        });
    }

    function getModuleAndBanner(){
        return Ajax.get("806052")
            .then(function(res){
                if(res.success){
                    var data = res.data;
                    var html = "", bannerHtml = "";
                    $.each(data, function(i, d){
                        if(d.type == 3 && d.location == "home_page"){
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
                        }else if(d.type == 2 && d.location == "index_banner"){
                            var pic = d.pic.split(/\|\|/)[0];
                            if(d.url){
                                bannerHtml += '<div class="swiper-slide"><img data-url="'+d.url+'" class="wp100 hp100" src="' + base.getPic(pic, "?") +'"></div>';
                            }else{
                                bannerHtml += '<div class="swiper-slide"><img class="wp100 hp100" src="' + base.getPic(pic, "?") +'"></div>';
                            }
                        }
                    });
                    $("#module").html(html);
                    $("#swiperInner").find(".swiper-wrapper").html(bannerHtml);
                    initSwiper();
                }else{
                    base.showMsg(res.msg || "加载失败");
                }
            }, function () {
                base.showMsg("加载失败");
            });
    }
    function getPageLine(refresh) {
        if(!isLoading && (!isEnd || refresh) ){
            isLoading = true;
            base.showPullUp();
            config.start = refresh && 1 || config.start;
            return Ajax.get("618100", config, !refresh)
                .then(function(res){
                    if(res.success && res.data.list.length){
                        var list = res.data.list;
                        if(list.length < config.limit){
                            isEnd = true;
                        }
                        $("#content")[refresh ? "html" : "append"](travelTmpl({items: list}));
                        config.start++;
                    }else{
                        if(refresh){
                            $("#content").html('<div class="item-error">暂无推荐线路</div>');
                        }
                        isEnd = true;
                        res.msg && base.showMsg(res.msg);
                    }
                    base.hidePullUp();
                    myScroll.refresh();
                    isLoading = false;
                }, function(){
                    isLoading = false;
                    isEnd = true;
                    if(refresh){
                        $("#content").html('<div class="item-error">暂无推荐线路</div>');
                    }
                    base.hidePullUp();
                    myScroll.refresh();
                });
        }
    }
    function addListener() {
        $("#headDW").on("click", function (e) {
            e.stopPropagation();
            citySelect.showCont();
        });
        $("#searchInput").on("keyup", function () {
            var _self = $(this);
            var val = _self.val();
            if(!val)
                _self.siblings(".index-search-placeholder").show();
            else
                _self.siblings(".index-search-placeholder").hide();
        });
        $("#searchIcon").on("click", function () {
            location.href = "../home/search.html?name=" + $("#searchInput").val();
        });
        $("#swiperInner").on("touchstart", ".swiper-slide img", function (e) {
            var touches = e.originalEvent.targetTouches[0],
                me = $(this);
            me.data("x", touches.clientX);
        });
        $("#swiperInner").on("touchend", ".swiper-slide img", function (e) {
            var me = $(this),
                touches = e.originalEvent.changedTouches[0],
                ex = touches.clientX,
                xx = parseInt(me.data("x")) - ex;
            if(Math.abs(xx) < 6){
                var url = me.attr('data-url');
                if(url)
                    location.href = url;
            }
        });
        $("#kefuIcon").on("click", function (e) {
            location.href = "http://kefu.easemob.com/webim/im.html?tenantId=" + TENANTID;
        });
    }
});
