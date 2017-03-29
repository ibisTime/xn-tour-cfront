define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/util/handlebarsHelpers',
    'app/module/scroll/scroll'
], function(base, Ajax, loading, Handlebars, scroll) {
    var lineCode = base.getUrlParam("code");
    var myScroll, start = 1, limit = 10, isLoading = false,
        isEnd = false, foodTmpl = __inline("../../ui/go-food.handlebars");

    init();
    function init() {
        initIScroll();
        getPageFood(true);
    }

    function initIScroll(){
        myScroll = scroll.getInstance().getNormalScroll({
            loadMore: function () {
                getPageFood();
            },
            refresh: function () {
                isEnd = false;
                getPageFood(true);
            }
        });
    }

    function getPageFood(refresh){
        if( !isLoading && (!isEnd || refresh) ){
            isLoading = true;
            start = refresh && 1 || start;
            return Ajax.get("618103", {
                start: start,
                limit: limit,
                type: '3',
                lineCode: lineCode
            }, !refresh)
                .then(function (res) {
                    if(res.success && res.data.list.length){
                        var data = res.data.list;
                        if(data.length < limit){
                            isEnd = true;
                            base.hidePullUp();
                        }else{
                            base.showPullUp();
                        }
                        var arr = [];
                        $.each(data, function(i, d){
                            if(d.isOnline == "1")
                                arr.push(d.food);
                        });
                        $("#content")[refresh ? "html" : "append"](foodTmpl({items: arr}));
                        start++;
                    }else{
                        refresh && $("#content").html('<div class="item-error">暂无推荐美食</div>');
                        isEnd = true;
                        base.hidePullUp();
                        res.msg && base.showMsg(res.msg);
                    }
                    isLoading = false;
                    loading.hideLoading();
                    myScroll.refresh();
                }, function(){
                    isLoading = false;
                    isEnd = true;
                    refresh && $("#content").html('<div class="item-error">暂无推荐美食</div>');
                    myScroll.refresh();
                    loading.hideLoading();
                });
        }else{
            loading.hideLoading();
        }
    }
});
