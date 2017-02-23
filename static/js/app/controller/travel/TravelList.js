define([
    'app/controller/base',
    'app/util/ajax',
    'iScroll',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading'
], function(base, Ajax, iScroll, Handlebars, loading) {

    var myScroll, isEnd = false, isLoading = false;
    var travelTmpl = __inline("../../ui/travel.handlebars");
    var dName = base.getUrlParam("name");
    var config = {
        category: base.getUrlParam("category") || "",
        name: dName || "",
        type: "",
        style: "",
        travelTime: "",
        joinPlace: "",
        start: 1,
        limit: 10
    };

    init();

    function init() {
        addListener();
        initIScroll();
        loading.createLoading();
        getPageTravel(true)
            .then(function(){
                loading.hideLoading();
            }, function(){
                loading.hideLoading();
            });
    }
    
    function getPageTravel(refresh){
        if(!isLoading && (!isEnd || refresh) ){
            base.showPullUp();
            return Ajax.get("618100", config, !refresh)
                .then(function(res){
                    if(res.success && res.data.list.length){
                        var list = res.data.list;
                        if(list.length < config.limit){
                            isEnd = true;
                        }
                        $("#content")[refresh ? "html" : "append"](travelTmpl({items: list}));
                        base.hidePullUp();
                        isLoading = false;
                    }else{
                        if(refresh){
                            $("#content").html('<div class="item-error">暂无相关数据</div>');
                        }
                        base.hidePullUp();
                        isLoading = false;
                        res.msg && base.showMsg(res.msg);
                    }
                    myScroll.refresh();
                });
        }
    }

    function initIScroll(){
        var pullDownEl, pullDownOffset, $pullDownEl;

        function pullDownAction () {
            getPageTravel(true);
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
                    getPageTravel();
                }
            },
            onScrollEnd: function () {
                if ($pullDownEl.hasClass("flip")) {
                    $pullDownEl.addClass("scroll-loading");
                    isEnd = false;        
                    pullDownAction();
                }
            }
        });
    }
    function addListener() {
       
        $("#btn-search").click(function(){
        	dName = $("#searchInput").val();
        	config = {
		        category: base.getUrlParam("category") || "",
		        name: dName || "",
		        type: "",
		        style: "",
		        travelTime: "",
		        joinPlace: "",
		        start: 1,
		        limit: 10
		    }
        	getPageTravel(true)
            .then(function(){
                loading.hideLoading();
            }, function(){
                loading.hideLoading();
            });
        }) 
    }
});