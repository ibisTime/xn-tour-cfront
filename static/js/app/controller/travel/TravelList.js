define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading',
    'app/module/scroll/scroll'
], function(base, Ajax, Handlebars, loading, scroll) {

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
        limit: 10,
        status: "1",
        orderDir: "asc",
        orderColumn: "order_no"
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