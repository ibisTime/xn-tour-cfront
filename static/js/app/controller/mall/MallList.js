define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading',
    'app/module/loadImg/loadImg',
    'app/module/showContent/showContent',
    'app/module/scroll/scroll'
], function(base, Ajax, Handlebars, loading, loadImg, showContent, scroll) {

    var myScroll, isLoading = false, isEnd = false,
        config = {
            status: "3",
            start: 1,
            limit: 10
        };
    var mallTmpl = __inline("../../ui/mall-list.handlebars");

    init();

    function init() {
        addListener();
        initIScroll();
        getPageData(true);
        if(base.isLogin())
            getAccountList();
        else
            $("#amount").html("--");
    }

    function getAccountList() {
        Ajax.get("802503", {
            userId: base.getUserId()
        }).then(function (res) {
            if(res.success && res.data.length){
                var data = res.data;
                $.each(data, function (i, d) {
                    if(d.currency == "XNB")
                        $("#amount").html(base.fZeroMoney(d.amount));
                });
            }else{
                res.msg && base.showMsg(res.msg);
            }
        }, function () {
            base.showMsg("账号信息获取失败");
        });
    }

    function initIScroll() {
        myScroll = scroll.getInstance().getNormalScroll({
            loadMore: function () {
                getPageData();
            },
            refresh: function () {
                isEnd = false;
                getPageData(true);
            }
        });
    }

    function getPageData(refresh) {
        if (!isLoading && (!isEnd || refresh)) {
            isLoading = true;
            config.start = refresh && 1 || config.start;
            Ajax.get("618420", config, !refresh)
                .then(function (res) {
                    if(res.success && res.data.list.length){
                        var data = res.data.list;
                        if(data.length < config.limit){
                            isEnd = true;
                            base.hidePullUp();
                        }else{
                            base.showPullUp();
                        }
                        $("#content")
                            [refresh ? "html" : "append"]( loadImg.loadImg(mallTmpl({items: data})) );
                    }else{
                        if(refresh){
                            $("#content").html('<div class="item-error">暂无商品信息</div>');
                            isEnd = true;
                        }
                        base.hidePullUp();
                        res.msg && base.showMsg(res.msg);
                    }
                    isLoading = false;
                    loading.hideLoading();
                    myScroll.refresh();
                }, function () {
                    if(refresh){
                        $("#content").html('<div class="item-error">暂无商品信息</div>');
                        isEnd = true;
                    }
                    isLoading = false;
                    base.hidePullUp();
                    myScroll.refresh();
                });
        }
    }

    function addListener() {
        showContent.addCont({
            key: "note",
            title: "积分规则",
            param: {
                "ckey": "inte"
            },
            bizType: '807717',
            error: function (msg) {
                base.showMsg(msg);
            }
        });
        $("#integral").on("click", function () {
            showContent.showCont();
        });
    }
});