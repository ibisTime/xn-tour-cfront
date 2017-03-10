define([
    'app/controller/base',
    'app/util/ajax',
    'swiper',
    'app/module/showImg/showImg',
    'app/module/loading/loading',
    'app/util/handlebarsHelpers',
    'app/module/comment/comment',
    'app/module/scroll/scroll'
], function(base, Ajax, Swiper, showImg, loading, Handlebars, comment, scroll) {

    var travelCode = base.getUrlParam('code'),
        pic_suffix = '?imageMogr2/auto-orient/thumbnail/!375x180r',
        start = 1, limit = 10, isEnd = false, isLoading = false;
    var yjTmpl = __inline("../../ui/travel-yj.handlebars"),
        glTmpl = __inline("../../ui/travel-gl.handlebars");
    var lineInfo = sessionStorage.getItem("line-info");
    var myScroll, lineAmount;

    init();

    function init() {
        if(travelCode){
            loading.createLoading();
            if(lineInfo){
                lineInfo = $.parseJSON(lineInfo);
                if(lineInfo[travelCode]){
                    lineInfo[travelCode].outName && $("#tjcxCont").html(lineInfo[travelCode].outName);
                    lineInfo[travelCode].hotelName && $("#tjjdCont").html(lineInfo[travelCode].hotelName);
                }
            }
            initIScroll();
            getInitData();
            addListener();
        }else{
            base.showMsg("为传入线路编号");
        }
    }

    function getInitData(){
        $.when(
            getTravel(),
            getPageGL(),
            getPageYJ(),
            getPageComment()
        ).then(function(){
            setTimeout(function(){
                myScroll.refresh();
            }, 400);
            loading.hideLoading();
        }, function(){
            setTimeout(function(){
                myScroll.refresh();
            }, 400);
            loading.hideLoading();
        });
    }

    function initIScroll(){
        myScroll = scroll.getInstance().getOnlyDownScroll({
            loadMore: function () {
                getPageComment();
            },
            pullDownEl: "#pullUp"
        });
    }

    function getTravel(){
        return Ajax.get("618102", {
            code: travelCode,
            userId: base.getUserId()
        }).then(function(res){
            if(res.success){
                var data = res.data;
                var pic = data.pathPic.split(/\|\|/), html = "";
                $.each(pic, function(i, p){
                    html += '<div class="swiper-slide"><img class="wp100 center-img" src="' + base.getPic(p, pic_suffix) +'"></div>'
                });

                $("#swiper").find(".swiper-wrapper").html(html);

                initSwiper();
                lineAmount = data.price;
                $("#joinPlace").html(data.joinPlace);
                $("#outDate").html(data.outDate.substr(0, 10));
                $("#price").html(base.formatMoney(data.price));
                $("#name").html(data.name);
                var tabList = data.lineTabList;
                // 1 亮点 2行程 3费用 4 须知
                for(var i = 0; i < tabList.length; i++){
                    $("#content" + (+tabList[i].type - 1)).html(tabList[i].description);
                }
                data.isCollect == "1" ? $("#scjdIcon").addClass("active") : "";
                myScroll.refresh();
            }else{
                base.showMsg("加载失败");
            }
            loading.hideLoading();
        })
    }

    function initSwiper(){
        new Swiper('#swiper', {
            'direction': 'horizontal',
            'autoplay': 4000,
            'autoplayDisableOnInteraction': false,
            'pagination': '.swiper-pagination',
            'preventClicks': false,
            'paginationType' : 'custom',
            'paginationCustomRender': function (swiper, current, total) {
              return current + '/' + total;
            }
        });
    }
    function getPageGL(){
        return Ajax.get("618115", {
            start: 1,
            limit: 4,
            lineCode: travelCode,
            status: 1
        }).then(function(res){
            if(res.success && res.data.list.length){
                $("#glContent").html( glTmpl({items: res.data.list}) );
            }else{
                $("#glContent").html( '<div class="item-error">暂无相关攻略</div>' );
            }
            myScroll.refresh();
        }, function(){
            $("#glContent").html( '<div class="item-error">暂无相关攻略</div>' );
            myScroll.refresh();
        });
    }
    function getPageYJ(){
        return Ajax.get("618130", {
            start: 1,
            limit: 4,
            lineCode: travelCode,
            status: 1
        }).then(function(res){
            if(res.success && res.data.list.length){
                var list = base.bubbleSort(res.data.list, "location", true);
                $("#yjContent").html( yjTmpl({items: list}) );
            }else{
                $("#yjContent").html( '<div class="item-error">暂无相关游记</div>' );
            }
            myScroll.refresh();
        }, function(){
            myScroll.refresh();
            $("#yjContent").html( '<div class="item-error">暂无相关游记</div>' );
        });
    }

    function getPageComment(){
        if( !isEnd && !isLoading ){
            isLoading = true;
            return Ajax.get("618315", {
                start: start,
                limit: limit,
                topCode: travelCode,
                status: '1'
            }).then(function(res){
                if(res.success && res.data.list.length){
                    if(res.data.list.length < limit){
                        isEnd = true;
                        base.hidePullUp();
                    }else{
                        base.showPullUp();
                    }
                    var html = "";
                    $.each(res.data.list, function(i, l){
                        html += '<div class="plun-cont-item flex">'+
                            '<div class="plun-left">'+
                                '<div class="plun-left-wrap">'+
                                    '<img class="center-img wp100" src="'+base.getWXAvatar(l.res.userExt.photo)+'" />'+
                                '</div>'+
                            '</div>'+
                            '<div class="plun-right">'+
                                '<div class="plun-right-title">'+l.res.nickname+'</div>'+
                                '<div class="plun-right-cont">'+l.content+'</div>'+
                                '<div class="plun-right-datetime">'+base.formatDate(l.commDatetime, 'yyyy-MM-dd hh:mm')+'</div>'+
                            '</div>'+
                        '</div>';
                    });
                    $("#content").append(html);
                    myScroll.refresh();
                    start++;
                }else{
                    if(start == 1){
                        $("#content").html( '<div class="item-error">暂无相关评论</div>' );
                        // myScroll.refresh();
                        isEnd = true;
                    }
                    base.hidePullUp();
                }
                myScroll.refresh();
                isLoading = false;
            }, function(){
                if(start == 1){
                    $("#content").html( '<div class="item-error">暂无相关评论</div>' );
                    isEnd = true;
                }
                myScroll.refresh();
                base.hidePullUp();
            });
        }
    }

    function addListener() {
        $("#swiper").on("touchstart", ".swiper-slide .center-img", function (e) {
            var touches = e.originalEvent.targetTouches[0],
                me = $(this);
            me.data("x", touches.clientX);
        });
        $("#swiper").on("touchend", ".swiper-slide .center-img", function (e) {
            var me = $(this),
                touches = e.originalEvent.changedTouches[0],
                ex = touches.clientX,
                xx = parseInt(me.data("x")) - ex;
            if(Math.abs(xx) < 6){
                showImg.createImg($(this).attr("src")).showImg();
            }
        });
        $("#swiper").on("touchstart", ".swiper-slide .center-img", function (e) {
            e.preventDefault();
            e.stopPropagation();
        })
        $("#writePlIcon").on("click", function (e) {
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
            comment.showComment({
                type: "2",
                parentCode: travelCode,
                commer: base.getUserId(),
                topCode: travelCode,
                success: function(res){
                    var userInfo = base.getSessionUserInfo();
                    html = '<div class="plun-cont-item flex">'+
                        '<div class="plun-left">'+
                            '<div class="plun-left-wrap">'+
                                '<img class="center-img wp100" src="'+base.getWXAvatar(userInfo.userExt && userInfo.userExt.photo)+'" />'+
                            '</div>'+
                        '</div>'+
                        '<div class="plun-right">'+
                            '<div class="plun-right-title">'+userInfo.nickname+'</div>'+
                            '<div class="plun-right-cont">'+res.content+'</div>'+
                            '<div class="plun-right-datetime">'+(base.formatDate(new Date(), 'yyyy-MM-dd hh:mm'))+'</div>'+
                        '</div>'+
                    '</div>';
                    if( $("#content").find(".item-error").length ){
                        $("#content").html(html);
                    }else{
                        $("#content").prepend(html);
                    }
                    myScroll.refresh();
                },
                error: function(msg){
                    base.showMsg(msg || "评论发布失败");
                }
            });
        });
        $("#nav").on("click", ".tr-c-item", function(){
            var _self = $(this), idx = _self.index();
            _self.siblings(".active").removeClass("active")
                .end().addClass("active");
            $(".tr-center-cont.active").removeClass("active");
            $("#content" + idx).addClass("active");
            myScroll.refresh();
        });
        $("#kefuIcon").on("click", function (e) {
            location.href = "http://kefu.easemob.com/webim/im.html?tenantId=" + TENANTID;
        });
        $("#buyBtn").on("click", function(){
            if(base.isLogin()){
                if(!lineInfo)
                    lineInfo = {};
                if(!lineInfo[travelCode])
                    lineInfo[travelCode] = {};
                lineInfo[travelCode].lineAmount = lineAmount;
                sessionStorage.setItem("line-info", JSON.stringify(lineInfo));
                location.href = './submit-order.html?lineCode=' + travelCode;
            }
            else
                base.goLogin();
        });
        //推荐酒店
        $("#J_Tjjd").on("click", function(){
            location.href = "./travel-hotel-list.html?code=" + travelCode + "&return=" + base.makeReturnUrl({
                lineCode: travelCode
            });
        });
        //推荐美食
        $("#J_Tjms").on("click", function(){
            location.href = "./travel-food-list.html?code=" + travelCode;
        });
        $("#J_Tjcx").on("click", function () {
            location.href = "./travel-special-line-list.html?code=" + travelCode + "&return=" + base.makeReturnUrl({
                lineCode: travelCode
            });
        })
        //收藏
        $("#scjdIcon").on("click", function(){
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
            loading.createLoading();
            collectTravel();
        });
    }
    function collectTravel(){
        Ajax.post("618320", {
            json: {
                toEntity: travelCode,
                toType: 1,
                type: 2,
                interacter: base.getUserId()
            }
        }).then(function(res){
            loading.hideLoading();
            if(res.success){
                $("#scjdIcon").toggleClass("active");
            }else{
                base.showMsg(res.msg || "操作失败");
            }
        }, function(){
            loading.hideLoading();
            base.showMsg("操作失败");
        });
    }
});
