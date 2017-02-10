define([
    'app/controller/base',
    'app/util/ajax',
    'iScroll',
    'app/module/foot/foot',
    'app/util/handlebarsHelpers'
], function(base, Ajax, iScroll, Foot, Handlebars) {

    var hotelTmpl = __inline("../../ui/go-hotel.handlebars");
        // outtingTmpl = __inline("../../ui/go-outting.handlebars"),
        // foodTmpl = __inline("../../ui/go-food.handlebars");

    var index = base.getUrlParam("idx") || 0;

    var myScroll, province, city, area, longitude, latitude;

    var config = {
        outting: {
            start: 1,
            limit: 10,
            category: "",
            province: "",
            city: "",
            area: "",
            longitude: "",
            latitude: ""
        },
        hotel: {
            start: 1,
            limit: 10,
            category: "",
            province: "",
            city: "",
            area: "",
            longitude: "",
            latitude: ""
        },
        food: {
            start: 1,
            limit: 10,
            category: "",
            province: "",
            city: "",
            area: "",
            longitude: "",
            latitude: ""
        }
    };
    var config1 = {
        outting: {
            isEnd: false,
            isLoading: false,
            first: true
        },
        hotel: {
            isEnd: false,
            isLoading: false,
            first: true
        },
        food: {
            isEnd: false,
            isLoading: false,
            first: true
        }
    }

    init();
    
    function init() {
        Foot.addFoot(2);
        initIScroll();
        addListener();
        base.initLocation(initConfig);
    }

    function initConfig(){

        config.outting.province = config.hotel.province = config.food.province = province = sessionStorage.getItem("province") || "";
        config.outting.city = config.hotel.city = config.food.city = city = sessionStorage.getItem("city") || "";
        config.outting.area = config.hotel.area = config.food.area = area = sessionStorage.getItem("area") || "";
        config.outting.longitude = config.hotel.longitude = config.food.longitude = longitude = sessionStorage.getItem("longitude", longitude);
        config.outting.latitude = config.hotel.latitude = config.food.latitude = latitude = sessionStorage.getItem("latitude", latitude);

        $("#top-nav").find(".go-top-li").eq(index).click();
    }


    function getMoreData(){
        var idx = $("#top-nav").find(".go-top-li.active").index();
        if(idx == 0){
            !config1.outting.isEnd && getOuttingData();
        }else if(idx == 1){
            !config1.hotel.isEnd && getHotelData();
        }else if(idx == 2){
            !config1.food.isEnd && getFoodData();
        }
    }
    //刷新
    function pullDownAction () {
        var idx = $("#top-nav").find(".go-top-li.active").index();
        if(idx == 0){
            getOuttingData(true);
        }else if(idx == 1){
            getHotelData(true);
        }else if(idx == 2){
            getFoodData(true);
        }
    }

    function initIScroll(){
        var pullDownEl, pullDownOffset, $pullDownEl;

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
                } else if (this.y - 20 < this.maxScrollY) {
                    getMoreData();
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

    function getOuttingData(refresh){
        config1.outting.isEnd = true;
        myScroll.refresh();
    }

    function getHotelData(refresh){
        if(!config1.hotel.isLoading){
            config1.hotel.isLoading = true;
            showPullUp();
            config.hotel.start = refresh && 1 || config.hotel.start;
            Ajax.get("618010", config.hotel, !refresh)
                .then(function (res) {
                    if(res.success && res.data.list.length){
                        var data = res.data.list;
                        if(data.length < config.hotel.limit){
                            config1.hotel.isEnd = true;
                            hidePullUp();
                        }else{
                            showPullUp();
                        }
                        $("#content").find(".J_Content1")
                            [refresh ? "html" : "append"](hotelTmpl({items: data}));
                        config.hotel.start++;
                    }else{
                        if(config1.hotel.first){
                            $("#content").find(".J_Content1").html('<div class="item-error">附近暂无酒店</div>');
                        }
                        hidePullUp();
                        res.msg && base.showMsg(res.msg);
                    }
                    config1.hotel.first = false;
                    config1.hotel.isLoading = false;
                    myScroll.refresh();
                }, function(){
                    config1.hotel.first = false;
                    config1.hotel.isLoading = false;
                    $("#content").find(".J_Content1").html('<div class="item-error">附近暂无酒店</div>');
                    myScroll.refresh();
                });
        }
    }

    function getFoodData(refresh) {
        config1.food.isEnd = true;
        myScroll.refresh();
    }

    function addListener() {
        $("#top-nav").on("click", ".go-top-li", function (e) {
            var _self = $(this), idx = _self.index();
            $("#content").find(".jcont").removeClass("active");
            $("#top-content").find(".top-nav").removeClass("active");
            $("#top-nav").find(".active").removeClass("active");
            $(".J_Content" + idx).addClass("active");
            myScroll.refresh();
            if(idx == 0){
                if(config1.outting.first){
                    getOuttingData();
                }
                if(config1.outting.isEnd){
                    hidePullUp();
                }else{
                    showPullUp();
                }
            }else if(idx == 1){
                if(config1.hotel.first){
                    getHotelData();
                }
                if(config1.hotel.isEnd){
                    hidePullUp();
                }else{
                    showPullUp();
                }
            }else if(idx == 2){
                if(config1.food.first){
                    getFoodData();
                }
                if(config1.hotel.isEnd){
                    hidePullUp();
                }else{
                    showPullUp();
                }
            }
        })
    }

    function hidePullUp(){
        $("#pullUp").css("visibility", "hidden");
    }

    function showPullUp(){
        $("#pullUp").css("visibility", "visible");
    }
});