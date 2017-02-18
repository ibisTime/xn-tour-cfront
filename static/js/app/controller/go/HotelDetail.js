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
        hotelCode = base.getUrlParam("code");
    var pic_suffix = '?imageMogr2/auto-orient/thumbnail/!375x180r',
        start = 1, limit = 10, isEnd = false, isLoading = false;
    var returnUrl = base.getReturnParam();

    init();

    function init() {
        if(hotelCode){
            comment.addComment();
            loading.createLoading("加载中...");
            initIScroll();
            getHotel();
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

    function getHotel(){
        Ajax.get("618012", {
            code: hotelCode,
            userId: base.getUserId()
        }).then(function(res){
            if(res.success){
                var data = res.data;
                var pic = data.pic2.split(/\|\|/), html = "";
                $.each(pic, function(i, p){
                    html += '<div class="swiper-slide"><img class="wp100 center-img" src="' + base.getPic(p, pic_suffix) +'"></div>'
                });

                $("#swiper").find(".swiper-wrapper").html(html);

                initSwiper();

                $("#name").html(data.name);
                $("#lowPrice").html('¥' + base.formatMoney(data.lowPrice) + '<span class="sm-f">起</span>');
                $("#addrInfo").html(getAddr(data));
                showInMap.addMap({
                    lng: data.longitude,
                    lat: data.latitude
                });
                $("#telephone")
                    .html('<a class="show c_78" href="tel://'+data.telephone+'">'+data.telephone+'<div class="st-jt"></div></a>');
                $("#content0").html(data.specialDesc);
                $("#content1").html(data.foodDesc);
                data.judge == "1" ? $("#scjdIcon").addClass("active") : "";
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
            'preventClicks': false
        });
    }

    function getPageComment(){
        if( !isEnd && !isLoading ){
            isLoading = true;
            Ajax.get("618315", {
                start: start,
                limit: limit,
                topCode: hotelCode,
                // status: '1'
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
                                '<div class="plun-right-cont twoline-ellipsis">'+l.content+'</div>'+
                                '<div class="plun-right-datetime">'+base.formatDate(l.commDatetime, 'yyyy-MM-dd hh:mm')+'</div>'+
                            '</div>'+
                        '</div>';
                    });
                    $("#content").append(html);
                    start++;
                    myScroll.refresh();
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
                if(start == 1){
                    $("#content").html( '<div class="item-error">暂无相关评论</div>' );
                    myScroll.refresh();
                    isEnd = true;
                }
                base.hidePullUp();
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
            collectHotel();
        });
        $("#swiper").on("click", ".swiper-slide .center-img", function(){
            showImg.createImg($(this).attr("src")).showImg();
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
                type: "1",
                parentCode: hotelCode,
                commer: base.getUserId(),
                topCode: hotelCode,
                success: function(res){
                    var userInfo = base.getSessionUserInfo();
                    html = '<div class="plun-cont-item flex">'+
                        '<div class="plun-left">'+
                            '<div class="plun-left-wrap">'+
                                '<img class="center-img wp100" src="'+base.getAvatar(userInfo.userExt && userInfo.userExt.photo)+'" />'+
                            '</div>'+
                        '</div>'+
                        '<div class="plun-right">'+
                            '<div class="plun-right-title">'+userInfo.nickname+'</div>'+
                            '<div class="plun-right-cont twoline-ellipsis">'+res.content+'</div>'+
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
        
        $("#nav").on("click", ".hd-c-item", function(){
            var _self = $(this), idx = _self.index();
            _self.siblings(".active").removeClass("active")
                .end().addClass("active");
            var o_idx = idx && 0 || 1;
            $("#content" + o_idx).removeClass("active");
            $("#content"+idx).addClass("active");
        });
        $("#wyrzBtn").on("click", function(){
            if(hotelCode)
                location.href = './chose-room.html?code=' + hotelCode + "&return=" + returnUrl;
        });
    }

    function collectHotel(){
        Ajax.post("618320", {
            json: {
                toEntity: hotelCode,
                toType: 3,
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