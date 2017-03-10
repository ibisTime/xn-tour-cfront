define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'iScroll',
    'app/util/handlebarsHelpers'
], function(base, Ajax, loading, iScroll, Handlebars) {

    var myScroll, config = {
        distance: "",
        price: "",
        description: "",
        start: 1,
        limit: 10,
        category: base.getUrlParam("category"),
        province: "",
        city: "",
        area: "",
        longitude: "",
        latitude: "",
        status: "1",
        orderDir: "asc",
        orderColumn: "order_no"
    }, isLoading = false, isEnd = false, first = true, module,
    hotelTmpl = __inline("../../ui/go-hotel.handlebars");

    init();
    function init() {
        initIScroll();
        base.initLocation(initData);
    }

    function initData(){
        loading.createLoading("加载中...");
        config.province = sessionStorage.getItem("province") || "";
        config.city = sessionStorage.getItem("city") || "";
        config.area = sessionStorage.getItem("area") || "";
        config.longitude = sessionStorage.getItem("longitude");
        config.latitude = sessionStorage.getItem("latitude");


        $.when(
            base.getDictList("hotel_ss"),
            Ajax.get("806052", {
                type: 3,
                location: 'depart_hotel'
            })
        ).then(function(res1, res2){
            if(res1.success && res2.success){
                var html1 = "";
                $.each(res1.data, function(i, d){
                    html1 += '<div class="hdc-item wp33" data-description="'+d.dkey+'">'+d.dvalue+'<div class="chose-icon"></div></div>';
                });
                module = res2.data;
                Handlebars.registerHelper('formatCategory', function(category, options){
                    return base.findObj(module, "code", category)["name"];
                });
                $("#hotelDropDescription").html(html1);
                getPageHotel();
                addListener();
            }else{
                base.showMsg("酒店信息获取失败");
            }
        });
    }

    function initIScroll(){
        var pullDownEl, pullDownOffset, $pullDownEl;

        function pullDownAction () {
            isEnd = false;
            getPageHotel(true);
        }
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
                    getPageHotel();
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
        $("#top-nav").on("click", ".go-top-li", function (e) {
            var _self = $(this), idx = _self.index(), mask = $("#mask");
            if(!_self.hasClass("active")){
                $("#hotelDropWrap")
                    .find(".hotel-drop.active").removeClass("active").hide()
                    .end().find(".hotel-drop:eq("+idx+")").addClass("active").show();
                _self.siblings(".active").removeClass("active")
                    .end().addClass("active");
                mask.show();
            }else{
                $("#hotelDropWrap")
                    .find(".hotel-drop.active").removeClass("active").hide();
                _self.removeClass("active");
                mask.hide();
            }
        });
        $(".hotel-drop0").on("click", ".hotel-drop-item-right-item", function(){
            var _self = $(this);
            _self.siblings(".active").removeClass("active");
            if(_self.hasClass("active")){
                _self.removeClass("active");
                config.distance = "";
            }else{
                _self.addClass("active");
                config.distance = _self.attr("data-distance");
            }
        });
        $(".hotel-drop1").on("click", ".hdc-item", function(){
            var _self = $(this);
            _self.siblings(".active").removeClass("active");
            if(_self.hasClass("active")){
                _self.removeClass("active");
                config.price = "";
            }else{
                _self.addClass("active");
                config.price = _self.attr("data-price");
            }
        });
        $("#clear0").on("click", function(){
            $(".hotel-drop0 .hotel-drop-item-right-item.active").removeClass("active");
            config.distance = "";
        });
        $("#ok0, #ok1, #ok2").on("click", function(){
            first = true;
            $("#top-nav").find(".active").removeClass("active");
            $("#hotelDropWrap").find(".hotel-drop.active").removeClass("active").hide();
            $("#mask").hide();
            loading.createLoading('加载中...');
            getPageHotel(true);
        });
        $("#clear1").on("click", function(){
            $(".hotel-drop1 .hdc-item.active").removeClass("active");
            config.price = "";
        });
        $("#clear2").on("click", function(){
            $("#hotelDropDescription").find(".hdc-item.active").removeClass("active");
            config.description = "";
        })
        $("#hotelDropDescription").on("click", ".hdc-item", function(){
            var _self = $(this);
            _self[ _self.hasClass("active") ? "removeClass" : "addClass" ]("active");
            var desc = "";
            var items = $("#hotelDropDescription").find(".hdc-item.active").each(function(){
                var _self = $(this);
                if( _self.hasClass("active") ){
                    desc += _self.attr("data-description") + ",";
                }
            });
            config.description = desc && desc.substr(0, desc.length - 1) || "";
        });
    }

    function getPageHotel(refresh){
        if( !isLoading && (!isEnd || refresh) ){
            isLoading = true;
            config.start = refresh && 1 || config.start;
            return Ajax.get("618010", config, !refresh)
                .then(function (res) {
                    if(res.success && res.data.list.length){
                        var data = res.data.list;
                        if(data.length < config.limit){
                            isEnd = true;
                            base.hidePullUp();
                        }else{
                            base.showPullUp();
                        }
                        $("#content")[refresh ? "html" : "append"](hotelTmpl({items: data}));
                        config.start++;
                    }else{
                        if(first){
                            $("#content").html('<div class="item-error">附近暂无酒店</div>');
                            isEnd = true;
                        }
                        base.hidePullUp();
                        res.msg && base.showMsg(res.msg);
                    }
                    first = false;
                    isLoading = false;
                    loading.hideLoading();
                    myScroll.refresh();
                }, function(){
                    first && $("#content").html('<div class="item-error">附近暂无酒店</div>');
                    first = false;
                    isEnd = true;
                    isLoading = false;
                    myScroll.refresh();
                    loading.hideLoading();
                });
        }else{
            loading.hideLoading();
        }
    }
});
