define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading',
    'app/module/foot/foot',
    'app/module/scroll/scroll',
    'app/util/dict',
], function(base, Ajax, Handlebars, loading, Foot, scroll, Dict) {

    var firstSX = true;

    var hotelTmpl = __inline("../../ui/go-hotel.handlebars"),
        travelTmpl = __inline("../../ui/travel.handlebars");
        foodTmpl = __inline("../../ui/go-food.handlebars");

    var index = base.getUrlParam("idx") || 0;

    var myScroll, innerScroll;

    var config = {
        travel: {
            category: "",
            name: "",
            type: "",
            style: "",
            travelTime: "",
            joinPlace: "",
            start: 1,
            limit: 10,
            status: "1",
            location: "2",
            orderDir: "asc",
            orderColumn: "order_no"
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
            status: "1",
            location: "2",
            orderDir: "asc",
            orderColumn: "order_no"
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
            status: "1",
            location: "2",
            orderDir: "asc",
            orderColumn: "order_no"
        }
    };
    var config1 = {
        travel: {
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
    // var pcStatus = Dict.get("pcStatus");

    init();

    function init() {
        Foot.addFoot(1);
        addListener();
        initIScroll();
        base.initLocation(initConfig);
    }
    function initConfig(){

        config.hotel.province = config.food.province = sessionStorage.getItem("province") || "";
        config.hotel.city = config.food.city = sessionStorage.getItem("city") || "";
        config.hotel.area = config.food.area = sessionStorage.getItem("area") || "";
        config.hotel.longitude = config.food.longitude = sessionStorage.getItem("longitude") || "";
        config.hotel.latitude = config.food.latitude = sessionStorage.getItem("latitude") || "";

        loading.createLoading();
        getModuleNav();
        $("#top-nav").find(".go-top-li").eq(index).click();
    }
    function getModuleNav(){
        return Ajax.get("806052", {
            type: 3
        }).then(function(res){
            loading.hideLoading();
            if(res.success){
                var data = res.data;
                var html0 = "", html1 = "", html2 = "";
                $.each(data, function(i, d){
                    if(d.location == "depart_hotel" || d.location == "depart_deli" || d.location == "travel"){
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
                        }else if(d.location == "travel"){
                            config1.travel.module.push(d);
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
            }else{
                base.showMsg(res.msg || "加载失败");
            }
        }, function(){
            loading.hideLoading();
            base.showMsg("加载失败");
        });
    }
    function getPageTravel(refresh){
        if(!config1.travel.isLoading || refresh){
            config1.travel.isLoading = true;
            base.showPullUp();
            config.travel.start = refresh && 1 || config.travel.start;
            return Ajax.get("618100", config.travel, !refresh)
                .then(function(res){
                    if(res.success && res.data.list.length){
                        var list = res.data.list;
                        if(list.length < config.travel.limit){
                            isEnd = true;base.hidePullUp();
                        }else{
                            base.showPullUp();
                        }
                        $("#content").find(".J_Content0")
                            [refresh ? "html" : "append"](travelTmpl({items: list}));
                        config.travel.start++;
                    }else{
                        if(config1.travel.first){
                            $("#content").find(".J_Content0").html('<div class="item-error">附近暂无线路</div>');
                        }
                        base.hidePullUp();
                        res.msg && base.showMsg(res.msg);
                    }
                    config1.travel.first = false;
                    config1.travel.isLoading = false;
                    config1.travel.isEnd = true;
                    myScroll.refresh();
                    loading.hideLoading();
                }, function(){
                    config1.travel.first = false;
                    config1.travel.isEnd = true;
                    config1.travel.isLoading = false;
                    $("#content").find(".J_Content0").html('<div class="item-error">附近暂无线路</div>');
                    myScroll.refresh();
                    loading.hideLoading();
                });
        }
    }
    function getHotelData(refresh){
        if(!config1.hotel.isLoading || refresh){
            config1.hotel.isLoading = true;
            base.showPullUp();
            config.hotel.start = refresh && 1 || config.hotel.start;
            Ajax.get("618010", config.hotel, !refresh)
                .then(function (res) {
                    if(res.success && res.data.list.length){
                        var data = res.data.list;
                        if(data.length < config.hotel.limit){
                            config1.hotel.isEnd = true;
                            base.hidePullUp();
                        }else{
                            base.showPullUp();
                        }
                        $("#content").find(".J_Content1")
                            [refresh ? "html" : "append"](hotelTmpl({items: data}));
                        config.hotel.start++;
                    }else{
                        if(config1.hotel.first){
                            $("#content").find(".J_Content1").html('<div class="item-error">附近暂无酒店</div>');
                        }
                        base.hidePullUp();
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
            base.showPullUp();
            config.food.start = refresh && 1 || config.food.start;
            Ajax.get("618070", config.food, !refresh)
                .then(function (res) {
                    if(res.success && res.data.list.length){
                        var data = res.data.list;
                        if(data.length < config.food.limit){
                            config1.food.isEnd = true;
                            base.hidePullUp();
                        }else{
                            base.showPullUp();
                        }
                        $("#content").find(".J_Content2")
                            [refresh ? "html" : "append"](foodTmpl({items: data}));
                        config.food.start++;
                    }else{
                        if(config1.food.first){
                            $("#content").find(".J_Content2").html('<div class="item-error">附近暂无美食</div>');
                        }
                        base.hidePullUp();
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
    function getMoreData(){
        var idx = $("#top-nav").find(".go-top-li.active").index();
        if(idx == 0){
            !config1.travel.isEnd && getPageTravel();
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
            config1.travel.isEnd = false;
            getPageTravel(true);
        }else if(idx == 1){
            config1.hotel.isEnd = false;
            getHotelData(true);
        }else if(idx == 2){
            config1.food.isEnd = false;
            getFoodData(true);
        }
    }

    function initIScroll(){
        myScroll = scroll.getInstance().getNormalScroll({
            loadMore: function () {
                getMoreData();
            },
            refresh: function () {
                pullDownAction();
            }
        });
    }
    function initInnerScroll(){
        innerScroll = scroll.getInstance().getSimpleClickScroll({
            wrapper: 'innerWrap'
        });
    }
    function getDropData(){
        loading.createLoading();
        return $.when(
            base.getAddress(),
            base.getDictList("router_type"),
            base.getDictList("router_time"),
            base.getDictList("router_type2")
        ).then(function(res1, res2, res3, res4){
            if(res2.success && res3.success && res4.success){
                var citylist = res1.citylist, html1 = "";
                var routeType = res2.data, html2 = "";
                var routeTime = res3.data, html3 = "";
                var routeType2 = res4.data, html4 = "";
                html1 = '<div class="travel-drop-right travel-drop-right0 active">'+getAddrList(citylist)+'</div>';
                html2 = '<div class="travel-drop-right travel-drop-right1">'+getDropList(routeType)+'</div>';
                html3 = '<div class="travel-drop-right travel-drop-right2">'+getDropList(routeTime)+'</div>';
                html4 = '<div class="travel-drop-right travel-drop-right3">'+getDropList(routeType2)+'</div>';

                $("#dropRight").html(html1 + html2 + html3 + html4);

                initInnerScroll();
            }
            loading.hideLoading();
        }, function(){
            loading.hideLoading();
        });
    }
    function getDropList(data){
        var html = "";
        $.each(data, function(i, d){
            html += '<div class="travel-drop-item-right-item" data-router="'+d.dkey+'">'+
                     d.dvalue + '<div class="chose-icon circle-icon"></div>'+
                     '</div>';
        });
        return html;
    }
    function getAddrList(citylist){
        var html = "";
        $.each(citylist, function(i, prov) {
            if (prov.c[0].a) {
                $.each(prov.c, function(j, city) {
                    html += '<div class="travel-drop-item-right-item" data-router="'+city.n+'">'+ city.n +
                                '<div class="chose-icon circle-icon"></div>'+
                            '</div>';
                });
            } else {
                html += '<div class="travel-drop-item-right-item" data-router="'+prov.p+'">'+ prov.p +
                            '<div class="chose-icon circle-icon"></div>'+
                        '</div>';
            }
        });
        return html;
    }

    var travelWrap = $("#travelWrap");
    var travelCont = $("#travelCont");
    function showDrop(){
        travelWrap.fadeIn(200);
        travelCont.animate({bottom:0}, 200, function(){
            if(firstSX){
                firstSX = false;
                innerScroll.refresh();
            }
        });
    }
    function hideDrop(){
        travelWrap.fadeOut(200);
        travelCont.animate({bottom:"-424px"}, 200)
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
                $("#sxIcon").show();
                if(config1.travel.first){
                    getPageTravel();
                }
                if(config1.travel.isEnd){
                    base.hidePullUp();
                }else{
                    base.showPullUp();
                }
            }else if(idx == 1){
                $("#sxIcon").hide();
                if(config1.hotel.first){
                    getHotelData();
                }
                if(config1.hotel.isEnd){
                    base.hidePullUp();
                }else{
                    base.showPullUp();
                }
            }else if(idx == 2){
                $("#sxIcon").hide();
                if(config1.food.first){
                    getFoodData();
                }
                if(config1.food.isEnd){
                    base.hidePullUp();
                }else{
                    base.showPullUp();
                }
            }

        });
        $("#sxIcon").on("click", function(){
            if(firstSX){
                getDropData()
                    .then(showDrop);
            }else{
                showDrop();
            }
        });
        $("#cancel").on("click", function(){
            hideDrop();
        });
        $("#ok").on("click", function(){
            loading.createLoading();
            hideDrop();
            getPageTravel(true)
                .then(function(){
                    loading.hideLoading();
                }, function(){
                    loading.hideLoading();
                });
        });
        $("#dropLeft").on("click", ".travel-drop-item-left", function(){
            var _self = $(this), idx = _self.index();
            _self.siblings(".active").removeClass("active");
            _self.addClass("active");
            $("#dropCont")
                .find(".travel-drop-right"+idx)
                .siblings(".active").removeClass("active")
                .end().addClass("active");
            innerScroll.refresh();
        });
        $("#dropCont").on("click", ".travel-drop-item-right-item", function(e){
            var _self = $(this);
            _self.siblings(".active").removeClass("active");

            _self[ _self.hasClass("active") ? "removeClass" : "addClass" ]("active");
            var parent = _self.closest(".travel-drop-right");
            if(parent.hasClass("travel-drop-right0")){
                if(_self.hasClass("active")){
                    config.name = _self.attr("data-router");
                }else{
                    config.name = "";
                }
            }else if(parent.hasClass("travel-drop-right1")){
                if(_self.hasClass("active")){
                    config.type = _self.attr("data-router");
                }else{
                    config.type = "";
                }
            }else if(parent.hasClass("travel-drop-right2")){
                if(_self.hasClass("active")){
                    config.travelTime = _self.attr("data-router");
                }else{
                    config.travelTime = "";
                }
            }else if(parent.hasClass("travel-drop-right3")){
                if(_self.hasClass("active")){
                    config.style = _self.attr("data-router");
                }else{
                    config.style = "";
                }
            }
            e.stopPropagation();
        });
    }
});
