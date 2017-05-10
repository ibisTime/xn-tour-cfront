define([
    'app/controller/base',
    'app/util/ajax',
    'iScroll',
    'app/module/loading/loading',
    'swiper',
    'app/module/showInMap/showInMap',
    'app/module/showImg/showImg',
    'app/module/comment/comment'
], function(base, Ajax, iScroll, loading, Swiper, showInMap, showImg, comment) {
    var myScroll,
        foodCode = base.getUrlParam("code");
    var pic_suffix = '?imageMogr2/auto-orient/thumbnail/!375x180r',
        start = 1, limit = 10, isEnd = false, isLoading = false;
    var returnUrl = base.getReturnParam();

    init();

    function init() {
        if(foodCode){
            comment.addComment();
            loading.createLoading("加载中...");
            initIScroll();
            getFood();
            getPageComment();
            addListener();
        }else{
            base.showMsg("为传入酒店编号");
        }
    }

    function initIScroll(){
        myScroll = new iScroll('wrapper', {
            useTransition: false,
            onScrollMove: function () {
                if (this.y - 120 < this.maxScrollY) {
                    getPageComment();
                }
            }
        });
    }

    function getFood(){
        Ajax.get("618072", {
            code: foodCode,
            userId: base.getUserId()
        }).then(function(res){
            if(res.success){
                var data = res.data;
                data.isCollect == "1" ? $("#scjdIcon").addClass("active") : "";
                data = data.food;
                var pic = data.pic.split(/\|\|/), html = "";
                $.each(pic, function(i, p){
                    html += '<div class="swiper-slide"><img class="wp100 center-img" src="' + base.getPic(p, pic_suffix) +'"></div>'
                });

                $("#swiper").find(".swiper-wrapper").html(html);

                initSwiper();

                $("#name").html(data.name);
                $("#price").html(data.price);
                $("#addrInfo").html(getAddr(data));
                showInMap.addMap({
                    lng: data.longitude,
                    lat: data.latitude
                });
                if(data.recommend){
                    $("#tjlyWrap").removeClass("hidden");
                    $("#tjlyCont").html(data.recommend);
                    // setTimeout(function(){myScroll.refresh()}, 0);
                    var recommend = $(data.recommend);
                    var imgs = recommend.find("img");
                    for (var i = 0; i < imgs.length; i++) {
                        var img = imgs.eq(i);
                        if (img[0].complete) {
                            myScroll.refresh()
                            continue;
                        }
                        (function(img) {
                            img[0].onload = (function() {
                                myScroll.refresh()
                            });
                        })(img);

                    }
                    $("#tjlyCont").html(recommend);

                }

                $("#telephone")
                    .html('<a class="show c_78" href="tel://'+data.telephone+'">'+data.telephone+'<div class="st-jt"></div></a>');
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

    function getPageComment(){
        if( !isEnd && !isLoading ){
            isLoading = true;
            Ajax.get("618315", {
                start: start,
                limit: limit,
                topCode: foodCode,
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
                        myScroll.refresh();
                        isEnd = true;
                    }
                    base.hidePullUp();
                }
                isLoading = false;
            }, function(){
                base.hidePullUp();
                if(start == 1){
                    $("#content").html( '<div class="item-error">暂无相关评论</div>' );
                    myScroll.refresh();
                    isEnd = true;
                }
            });
        }
    }

    function getAddr(data){
        return data.province + (data.city || "") + (data.area || "") + (data.detail || "");
    }

    function addListener() {
        $("#scjdIcon").on("click", function(){
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
            loading.createLoading();
            collectFood();
        });

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


        $("#addrDiv").on("click", function (e) {
            showInMap.showMap();
        });

        $("#writePlIcon").on("click", function (e) {
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
            comment.showComment({
                type: "3",
                parentCode: foodCode,
                commer: base.getUserId(),
                topCode: foodCode,
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
    }

    function collectFood(){
        Ajax.post("618320", {
            json: {
                toEntity: foodCode,
                toType: 4,
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
