define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'iScroll',
    'app/util/handlebarsHelpers'
], function(base, Ajax, loading, iScroll, Handlebars) {
    var category = base.getUrlParam("category");
    var myScroll, config = {
        distance: "",
        price: "",
        description: "",
        start: 1,
        limit: 10,
        type: category,
        province: "",
        city: "",
        area: "",
        longitude: "",
        latitude: "",
        supplyTime: "",  //用餐时间
        maxSeat: "",    //用餐人数
        status: "1",
        orderDir: "asc",
        orderColumn: "order_no"
    }, isLoading = false, isEnd = false, first = true, module,
    foodTmpl = __inline("../../ui/go-food.handlebars");

    init();
    function init() {
        base.initLocation(initData);
        addListener();
        initIScroll();
    }

    function initData(){
        loading.createLoading("加载中...");
        config.province = sessionStorage.getItem("province") || "";
        config.city = sessionStorage.getItem("city") || "";
        config.area = sessionStorage.getItem("area") || "";
        config.longitude = sessionStorage.getItem("longitude");
        config.latitude = sessionStorage.getItem("latitude");
        loading.createLoading();
        $.when(
            getModule(),
            base.getDictList("dining_time"),
            base.getDictList("dining_num")
        ).then(function(res1, res2, res3){
            if(res2.success && res3.success){
                var data2 = res2.data, html2 = "";
                var data3 = res3.data, html3 = "";
                $.each(data2, function(i, d){
                    html2 += '<div class="hotel-drop-item-right-item" data-type="'+d.dkey+'">'+d.dvalue+
                        '<div class="chose-icon"></div>'+
                        '</div>';
                });
                $("#dining-time").html(html2);
                $.each(data3, function(i, d){
                    html3 += '<div class="hotel-drop-item-right-item" data-type="'+d.dkey+'">'+d.dvalue+
                        '<div class="chose-icon"></div>'+
                        '</div>';
                });
                $("#dining-num").html(html3);
                getPageFood();
            }else{
                base.showMsg("美食信息获取失败");
            }
        }, function(){
            base.showMsg("美食信息获取失败");
        });

        
    }

    function getModule(){
        return Ajax.get("806052", {
            type: 3,
            location: 'depart_deli'
        }).then(function(res){
            if(res.success){
                var data = res.data, html = "";
                $.each(data, function(i, d){
                    if(d.code == category){
                        html += '<div class="hotel-drop-item-right-item active" data-type="'+d.code+'">'+d.name+
                                '<div class="chose-icon circle-icon"></div>'+
                            '</div>';
                    }else{
                        html += '<div class="hotel-drop-item-right-item" data-type="'+d.code+'">'+d.name+
                            '<div class="chose-icon circle-icon"></div>'+
                        '</div>';
                    }
                    
                });
                $("#foodDropType").html(html);
            }else{
                base.showMsg("美食信息获取失败");
            }
        });
    }

    function initIScroll(){
        var pullDownEl, pullDownOffset, $pullDownEl;

        function pullDownAction () {
            isEnd = false;
            getPageFood(true);
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
                    getPageFood();
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
        $(".food-drop0").on("click", ".hotel-drop-item-right-item", function(){
            var _self = $(this);
            _self.siblings(".active").removeClass("active");
            if(_self.hasClass("active")){
                _self.removeClass("active");
                config.type = "";
            }else{
                _self.addClass("active");
                config.type = _self.attr("data-type");
            }
        });
        $(".food-drop1").on("click", ".hotel-drop-item-right-item", function(){
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
        $(".food-drop2").on("click", ".hotel-drop-item-right-item", function(){
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
        $(".food-drop3").on("click", ".hotel-drop-item-right-item", function(){
            var _self = $(this);
            // _self.siblings(".active").removeClass("active");
            _self[ _self.hasClass("active") ? "removeClass" : "addClass" ]("active");

            if(_self.parent().hasClass('hotel-drop-right1')){
                var str = "";
                $(".food-drop3").find(".hotel-drop-right1 .hotel-drop-item-right-item.active")
                    .each(function(){
                        var me = $(this);
                        if( me.hasClass("active") ){
                            str += me.attr("data-type") + ",";
                        }
                    });
                config.maxSeat = str && str.substr(0, str.length - 1) || "";
            }else{
                var str = "";
                $(".food-drop3").find(".hotel-drop-right0 .hotel-drop-item-right-item.active")
                    .each(function(){
                        var me = $(this);
                        if( me.hasClass("active") ){
                            str += me.attr("data-type") + ",";
                        }
                    });
                config.supplyTime = str && str.substr(0, str.length - 1) || "";
            }
        });
        $(".food-drop3").on("click", ".hotel-drop-left .hotel-drop-item-left", function(){
            var _self = $(this), idx = _self.index();
            _self.siblings(".active").removeClass("active");
            _self.addClass("active");
            $(".food-drop3").find(".hotel-drop-right").addClass("hidden")
                .end().find(".hotel-drop-right" + idx).removeClass("hidden");
        });
        $("#clear0").on("click", function(){
            $(".food-drop0 .hotel-drop-item-right-item.active").removeClass("active");
            config.type = "";
        });
        $("#ok0, #ok1, #ok2, #ok3").on("click", function(){
            first = true;
            $("#top-nav").find(".active").removeClass("active");
            $("#hotelDropWrap").find(".hotel-drop.active").removeClass("active").hide();
            $("#mask").hide();
            loading.createLoading('加载中...');
            getPageFood(true);
        });
        $("#clear1").on("click", function(){
            $(".food-drop1 .hotel-drop-item-right-item.active").removeClass("active");
            config.distance = "";
        });
        $("#clear2").on("click", function(){
            $(".food-drop2").find(".hotel-drop-item-right-item.active").removeClass("active");
            config.price = "";
        });
        $("#clear3").on("click", function(){
            $(".food-drop3").find(".hotel-drop-item-right-item.active").removeClass("active");
            config.supplyTime = "";
            config.maxSeat = "";
        });
    }

    function getPageFood(refresh){
        if( !isLoading && (!isEnd || refresh) ){
            isLoading = true;
            config.start = refresh && 1 || config.start;
            return Ajax.get("618070", config, !refresh)
                .then(function (res) {
                    if(res.success && res.data.list.length){
                        var data = res.data.list;
                        if(data.length < config.limit){
                            isEnd = true;
                            base.hidePullUp();
                        }else{
                            base.showPullUp();
                        }
                        $("#content")[refresh ? "html" : "append"](foodTmpl({items: data}));
                        config.start++;
                    }else{
                        if(first){
                            $("#content").html('<div class="item-error">附近暂无美食</div>');
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
                    first && $("#content").html('<div class="item-error">附近暂无美食</div>');
                    first = false;
                    isEnd = true;
                    isLoading = false;
                    base.hidePullUp();
                    myScroll.refresh();
                    loading.hideLoading();
                });
        }else{
            loading.hideLoading();
        }
    }
});