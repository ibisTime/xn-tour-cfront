define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading',
    'app/module/foot/foot',
    'app/module/scroll/scroll'
], function(base, Ajax, Handlebars, loading, Foot, scroll) {

    var myScroll, isEnd = false, isLoading = false, innerScroll;
    var travelTmpl = __inline("../../ui/travel.handlebars");
    var config = {
        category: "",
        name: "",
        type: "",
        style: "",
        travelTime: "",
        joinPlace: "",
        start: 1,
        limit: 10,
        status: "1"
    };
    var firstSX = true;
    init();

    function init() {
        Foot.addFoot(1);
        addListener();
        initIScroll();
        getInitData();
    }
    function getInitData(){
        loading.createLoading();
        $.when(
            getModuleNav(),
            getPageTravel(true)
        ).then(function(res){
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
                $("#topNav").html(html);
                myScroll.refresh();
            }else{
                base.showMsg(res.msg || "模块加载失败");
            }
            loading.hideLoading();
        }, function(){
            loading.hideLoading();
            base.showMsg("加载失败");
        });
    }
    function getModuleNav(){
        return Ajax.get("806052", {
            type: 3,
            location: 'travel'
        });
    }
    function getPageTravel(refresh){
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
                            $("#content").html('<div class="item-error">暂无相关数据</div>');
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
                    base.hidePullUp();
                });
        }
    }

    function initIScroll(){
        myScroll = scroll.getInstance().getNormalScroll({
            loadMore: function () {
                getPageTravel();
            },
            refresh: function () {
                isEnd = false;
                getPageTravel(true);
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
            $("#dropCont").find(".travel-drop-right.active").removeClass("active")
                .end().find(".travel-drop-right"+idx).addClass("active");
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