define([
    'app/controller/base',
    'app/util/ajax',
    'iScroll',
    'app/module/loading/loading',
    'swiper',
    'app/module/showInMap/showInMap',
    'app/module/showImg/showImg'
], function(base, Ajax, iScroll, loading, Swiper, showInMap, showImg) {
    var myScroll,
        hotelCode = base.getUrlParam("code");
    var pic_suffix = '?imageMogr2/auto-orient/thumbnail/!375x180r';

    init();

    function init() {
        if(hotelCode){
            loading.createLoading("加载中...");
            initIScroll();
            getHotel();
            addListener();
        }else{
            base.showMsg("为传入酒店编号");
        }
    }

    function initIScroll(){
        myScroll = new iScroll('wrapper', {
            useTransition: false,
            onScrollMove: function () {
                if (this.y - 20 < this.maxScrollY) {
                    console.log("上拉加载更多");
                }
            }
        });
    }

    function getHotel(){
        Ajax.get("618012", {
            code: hotelCode
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
                $("#lowPrice").html('¥' + base.fZeroMoney(data.lowPrice) + '<span class="sm-f">起</span>');
                $("#addrInfo").html(getAddr(data))
                    .parent().data("addr", {
                        longitude: data.longitude,
                        latitude: data.latitude
                    });
                showInMap.addMap({
                    lng: data.longitude,
                    lat: data.latitude
                });
                $("#telephone")
                    .html('<a class="show c_78" href="tel://'+data.telephone+'">'+data.telephone+'<div class="st-jt"></div></a>');
                $("#content0").html(data.specialDesc);
                $("#content1").html(data.foodDesc);

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

    function getAddr(data){
        return data.province + (data.city || "") + (data.area || "") + (data.detail || "");
    }

    function addListener() {
        $("#swiper").on("click", ".swiper-slide .center-img", function(){
            showImg.createImg($(this).attr("src")).showImg();
        });
        $("#addrDiv").on("click", function (e) {
            // var addr = $(this).data("addr");
            // location.href = "./map.html?longitude=" + addr.longitude + "&latitude=" + addr.latitude;
            showInMap.showMap();
        }); 
        $("#writePlIcon").on("click", function (e) {
            $("#fbplunWrap").fadeIn(200);
        });
        $("#cancelPl").on("click", function (e) {
            $("#fbplunWrap").fadeOut(200);
        });
        $("#publishPl").on("click", function (e) {
            $("#fbplunWrap").fadeOut(200);
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
                location.href = './chose-room.html?code=' + hotelCode;
        });
    }

});