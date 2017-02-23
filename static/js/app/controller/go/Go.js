define([
    'app/controller/base',
    'app/util/ajax',
    'iScroll',
    'app/module/foot/foot',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading',
    'app/util/dict'
], function(base, Ajax, iScroll, Foot, Handlebars, loading, Dict) {

    var hotelTmpl = __inline("../../ui/go-hotel.handlebars"),
        outtingTmpl = __inline("../../ui/go-carpool.handlebars"),
        foodTmpl = __inline("../../ui/go-food.handlebars");

    var index = base.getUrlParam("idx") || 0;

    var myScroll;

    var config = {
        outting: {
            start: 1,
            limit: 10,
            category: "",
            province: "",
            city: "",
            area: "",
            longitude: "",
            latitude: "",
            // status: "1"
        },
        hotel: {
            start: 1,
            limit: 10,
            category: "",
            province: "",
            city: "",
            area: "",
            longitude: "",
            latitude: "",
            status: "1"
        },
        food: {
            start: 1,
            limit: 10,
            category: "",
            province: "",
            city: "",
            area: "",
            longitude: "",
            latitude: "",
            status: "1"
        }
    };
    var config1 = {
        outting: {
            isEnd: false,
            isLoading: false,
            first: true,
            module: []
        },
        hotel: {
            isEnd: false,
            isLoading: false,
            first: true,
            module: []
        },
        food: {
            isEnd: false,
            isLoading: false,
            first: true,
            module: []
        }
    };
    var carpoolStatus = Dict.get("carpoolStatus");

    init();
    
    function init() {
        Foot.addFoot(2);
        initIScroll();
        addListener();
        base.initLocation(initConfig);
        // Handlebars.registerHelper('formatCarpoolStatus', function(text, places, options){
        //     return carpoolStatus[text];
        // });
    }

    function getModuleNav(){
        loading.createLoading();
        Ajax.get("806052", {type: 3})
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
                    $("#top-content").find(".J_Content0").html(html0);
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

    function initConfig(){

        config.outting.province = config.hotel.province = config.food.province = sessionStorage.getItem("province") || "";
        config.outting.city = config.hotel.city = config.food.city = sessionStorage.getItem("city") || "";
        config.outting.area = config.hotel.area = config.food.area = sessionStorage.getItem("area") || "";
        config.outting.longitude = config.hotel.longitude = config.food.longitude = sessionStorage.getItem("longitude") || "";
        config.outting.latitude = config.hotel.latitude = config.food.latitude = sessionStorage.getItem("latitude") || "";

        getModuleNav();
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
            config1.outting.isEnd = false;
            getOuttingData(true);
        }else if(idx == 1){
            config1.hotel.isEnd = false;
            getHotelData(true);
        }else if(idx == 2){
            config1.food.isEnd = false;
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
                } else if (this.y - 120 < this.maxScrollY) {
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
        loading.hideLoading();
        myScroll.refresh();

        if(!config1.outting.isLoading || refresh){
            config1.outting.isLoading = true;
            showPullUp();
            config.outting.start = refresh && 1 || config.outting.start;
            Ajax.get("618250", config.outting, !refresh)
                .then(function (res) {
                    if(res.success && res.data.list.length){
                        var data = res.data.list;
                        if(data.length < config.outting.limit){
                            config1.outting.isEnd = true;
                            hidePullUp();
                        }else{
                            showPullUp();
                        }
                        $("#content").find(".J_Content0")
                            [refresh ? "html" : "append"](outtingTmpl({items: data}));
                        config.outting.start++;
                    }else{
                        if(config1.outting.first){
                            $("#content").find(".J_Content0").html('<div class="item-error">附近暂无拼车信息</div>');
                        }
                        hidePullUp();
                        res.msg && base.showMsg(res.msg);
                    }
                    config1.outting.first = false;
                    config1.outting.isLoading = false;
                    config1.outting.isEnd = true;
                    myScroll.refresh();
                    loading.hideLoading();
                }, function(){
                    config1.outting.first = false;
                    config1.outting.isEnd = true;
                    config1.outting.isLoading = false;
                    $("#content").find(".J_Content0").html('<div class="item-error">附近暂无拼车信息</div>');
                    myScroll.refresh();
                    loading.hideLoading();
                });
        }
    }

    function getHotelData(refresh){
        if(!config1.hotel.isLoading || refresh){
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
                    config1.hotel.isEnd = true;
                    myScroll.refresh();
                    loading.hideLoading();
                }, function(){
                    config1.hotel.first = false;
                    config1.hotel.isEnd = true;
                    config1.hotel.isLoading = false;
                    $("#content").find(".J_Content1").html('<div class="item-error">附近暂无酒店</div>');
                    myScroll.refresh();
                    loading.hideLoading();
                });
        }
    }

    function getFoodData(refresh) {

        if(!config1.food.isLoading || refresh){
            config1.food.isLoading = true;
            showPullUp();
            config.food.start = refresh && 1 || config.food.start;
            Ajax.get("618070", config.food, !refresh)
                .then(function (res) {
                    if(res.success && res.data.list.length){
                        var data = res.data.list;
                        if(data.length < config.food.limit){
                            config1.food.isEnd = true;
                            hidePullUp();
                        }else{
                            showPullUp();
                        }
                        $("#content").find(".J_Content2")
                            [refresh ? "html" : "append"](foodTmpl({items: data}));
                        config.food.start++;
                    }else{
                        if(config1.food.first){
                            $("#content").find(".J_Content2").html('<div class="item-error">附近暂无美食</div>');
                        }
                        hidePullUp();
                        res.msg && base.showMsg(res.msg);
                    }
                    config1.food.first = false;
                    config1.food.isLoading = false;
                    config1.food.isEnd = true;
                    myScroll.refresh();
                    loading.hideLoading();
                }, function(){
                    config1.food.first = false;
                    config1.food.isEnd = true;
                    config1.food.isLoading = false;
                    $("#content").find(".J_Content2").html('<div class="item-error">附近暂无美食</div>');
                    myScroll.refresh();
                    loading.hideLoading();
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
        });
    }

    function hidePullUp(){
        $("#pullUp").css("visibility", "hidden");
    }

    function showPullUp(){
        $("#pullUp").css("visibility", "visible");
    }
});