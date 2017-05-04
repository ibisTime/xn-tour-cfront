define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/foot/foot',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading',
    'app/util/dict',
    'app/module/scroll/scroll'
], function(base, Ajax, Foot, Handlebars, loading, Dict, scroll) {

    var outtingTmpl = __inline("../../ui/go-carpool.handlebars");

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
            status: "1"
        }
    };
    var config1 = {
        outting: {
            isEnd: false,
            isLoading: false,
            first: true,
            module: []
        }
    };
    var carpoolStatus = Dict.get("carpoolStatus");
    var pcStatus = Dict.get("pcStatus");

    init();

    function init() {
        Foot.addFoot(2);
        initIScroll();
        base.initLocation(initConfig);
    }

    function getModuleNav(){
        loading.createLoading();
        Ajax.get("806052", {type: 3, location: "goout"})
            .then(function(res){
                if(res.success){
                    var data = res.data;
                    var html0 = "";
                    $.each(data, function(i, d){
                        //出行
                        var url = d.url;
                        if(/^page:/.test(url)){
                            url = url.replace(/^page:/, "../")
                                     .replace(/\?/, ".html?");
                            if(!/\?/.test(url)){
                                url = url + ".html";
                            }
                        }
                        config1.outting.module.push(d);
                        html0 +='<li class="nav-li nav-li-4">'+
                                '<a class="wp100 show" href="'+url+'">'+
                                    '<div class="nav-li-img"><img src="'+base.getImg(d.pic)+'"/></div>'+
                                    '<div class="nav-li-text">'+d.name+'</div>'+
                                '</a>'+
                            '</li>';
                    });
                    $("#top-content").find(".J_Content0").html(html0);
                    Handlebars.registerHelper('formatCategory', function(category, options){
                        return base.findObj(config1.hotel.module, "code", category)["name"];
                    });
                    getOuttingData();
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

        config.outting.province = sessionStorage.getItem("province") || "";
        config.outting.city = sessionStorage.getItem("city") || "";
        config.outting.area = sessionStorage.getItem("area") || "";
        config.outting.longitude = sessionStorage.getItem("longitude") || "";
        config.outting.latitude = sessionStorage.getItem("latitude") || "";

        Handlebars.registerHelper('formatCarpoolStatus', function(text, options){
            return pcStatus[text];
        });
        getModuleNav();
    }

    function getMoreData(){
        !config1.outting.isEnd && getOuttingData();
    }
    //刷新
    function pullDownAction () {
        config1.outting.isEnd = false;
        getOuttingData(true);
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
    /*UNPUBLISHED("0", "未发布"), PUBLISHED("1", "已发布"), FULL("2", "已满员"), PLAT_TAKE(
            "3", "已接单待发车"), PLAT_CANCEL("91", "平台取消"), DONE("92", "已发车宣告结束");*/
    function getOuttingData(refresh){
        config1.outting.isEnd = true;
        loading.hideLoading();
        myScroll.refresh();

        if(!config1.outting.isLoading || refresh){
            config1.outting.isLoading = true;
            base.showPullUp();
            config.outting.start = refresh && 1 || config.outting.start;
            Ajax.get("618250", config.outting, !refresh)
                .then(function (res) {
                    if(res.success && res.data.list.length){
                        var data = res.data.list;
                        if(data.length < config.outting.limit){
                            config1.outting.isEnd = true;
                            base.hidePullUp();
                        }else{
                            base.showPullUp();
                        }
                        $("#content").find(".J_Content0")
                            [refresh ? "html" : "append"](outtingTmpl({items: data}));
                        config.outting.start++;
                    }else{
                        if(config1.outting.first){
                            $("#content").find(".J_Content0").html('<div class="item-error">附近暂无拼车信息</div>');
                        }
                        base.hidePullUp();
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

});
