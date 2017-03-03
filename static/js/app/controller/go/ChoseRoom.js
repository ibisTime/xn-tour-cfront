define([
    'app/controller/base',
    'app/util/ajax',
    'iScroll',
    'app/module/loading/loading',
    'swiper',
    'app/module/showImg/showImg',
    'app/util/handlebarsHelpers'
], function(base, Ajax, iScroll, loading, Swiper, showImg, Handlebars) {

    var myScroll,
        start = 1,
        limit = 10,
        first = true,
        isEnd = false,
        isLoading = false,
        watchDateTimer = "",
        hotelCode = base.getUrlParam("code"),
        start_date = 0,
        end_date = 0,
        roomCode = "",
        pic_suffix = '?imageMogr2/auto-orient/thumbnail/!375x180r';
    var roomTmpl = __inline("../../ui/chose-room.handlebars");
    var returnUrl = base.getReturnParam();

    init();
    var hmType2 = {}, ssType = {};

    function init() {
        initIScroll();
        getHotelAndRoom();
    }
    function getHotelAndRoom(){
        loading.createLoading("加载中...");
        $.when(
            base.getDictList("hh_type"),
            base.getDictList("ss_type"),
            getHotel()
        ).then(function (res0, res) {
            if(res0.success && res.success){
                $.each(res0.data, function(i, d){
                    hmType2[d.dkey] = d.dvalue;
                });
                $.each(res.data, function(i, d){
                    ssType[d.dkey] = d.dvalue;
                });
                Handlebars.registerHelper('formatType', function(text, options){
                    return hmType2[text] || "--";
                });
                Handlebars.registerHelper('formatDesc', function(text, options){
                    var str = "";
                    var arr = text.split(/,/);
                    $.each(arr, function(i, a){
                        str += ssType[a] + " | ";
                    })
                    return str && str.substr(0, str.length - 2) || "--";
                });
                getPageRoom()
                    .then(function(){
                        loading.hideLoading();
                        addListener();
                    });
            }else{
                loading.hideLoading();
            }            
        });
    }

    function getHotel(){
        return Ajax.get("618012", {
            code: hotelCode
        }).then(function(res){
            if(res.success){
                var data = res.data.hotal;
                var pic = data.pic2.split(/\|\|/), html = "";
                $.each(pic, function(i, p){
                    html += '<div class="swiper-slide"><img class="wp100 center-img" src="' + base.getPic(p, pic_suffix) +'"></div>'
                });

                $("#swiper").find(".swiper-wrapper").html(html);

                initSwiper();

            }else{
                base.showMsg(res.msg || "酒店图片加载失败");
            }
            return res;
        });
    }

    function getPageRoom(){
        if(!isLoading && !isEnd){
            showPullUp();
            isLoading = true;
            return Ajax.get("618030", {
                hotalCode: hotelCode,
                start: start,
                limit: limit
            }).then(function(res){
                if(res.success && res.data.list.length){
                    var data = res.data.list;
                    if(data.length < limit){
                        isEnd = true;
                        hidePullUp();
                    }else{
                        showPullUp();
                    }
                    $("#content").append(roomTmpl({items: data}));
                    start++;
                }else{
                    if(first){
                        $("#content").html('<div class="item-error">该酒店暂无房间</div>');
                    }
                    hidePullUp();
                    base.showMsg(res.msg);
                }
                first = false;
                isLoading = false;
                myScroll.refresh();
                return res;
            });
        }
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

    function initIScroll(){
        myScroll = new iScroll('wrapper', {
            useTransition: false,
            onScrollMove: function () {
                console.log(this.y, this.maxScrollY);
                if (this.y - 20 < this.maxScrollY) {
                    console.log("上拉加载更多");
                }
            }
        });
    }

    function addListener() {
        $("#buyBtn").on("click", function(){
            if(start_date && end_date && roomCode){
                location.href = './submit-order.html?hotelcode=' + hotelCode + 
                    '&roomcode=' + roomCode + '&start=' + start_date + '&end=' + end_date + '&return=' + returnUrl;
            }else if(!start_date){
                base.showMsg("未选择入住时间");
            }else if(!end_date){
                base.showMsg("未选择离开时间");
            }else{
                base.showMsg("未选择房间");
            }
        });
        $("#swiper").on("click", ".swiper-slide .center-img", function(){
            showImg.createImg($(this).attr("src")).showImg();
        });
        var start = {
            elem: '#choseStartDate',
            format: 'YYYY-MM-DD',
            min: laydate.now(), //设定最小日期为当前日期
            isclear: false, //是否显示清空
            istoday: false,
            choose: function(datas){
                start_date = datas;
                $("#startDate").val(datas).trigger("change");
                $("#startSpan").text(datas);
                var d = new Date(datas);
                d.setDate(d.getDate() + 1);
                datas = d.format('yyyy-MM-dd');
                end.min = datas; //开始日选好后，重置结束日的最小日期
                end.start = datas //将结束日的初始值设定为开始日
            }
        };
        var end = {
            elem: '#choseEndDate',
            format: 'YYYY-MM-DD',
            min: laydate.now(),
            isclear: false, //是否显示清空
            istoday: false,
            choose: function(datas){
                end_date = datas;
                $("#endDate").val(datas).trigger("change");
                $("#endSpan").text(datas);
                var d = new Date(datas);
                d.setDate(d.getDate() - 1);
                datas = d.format('yyyy-MM-dd');
                start.max = datas; //结束日选好后，重置开始日的最大日期
            }
        };
        laydate(start);
        laydate(end);

        $("#kefuIcon").on("click", function (e) {
            location.href = "http://kefu.easemob.com/webim/im.html?tenantId=" + TENANTID;
        });
        $("#content").on("click", ".croom-item", function(){
            var _self = $(this);
            _self.siblings(".active").removeClass("active");
            if(_self.hasClass("active")){
                _self.removeClass("active");
                roomCode = "";
            }else{
                _self.addClass("active");
                roomCode = _self.attr("data-code");
            }
        });
        // $("#startDate").on("change", function(){
        //     var date = $(this).val();
        //     var startDate = date && new Date(date) || new Date(); 
        //     start_date = date;
        //     $("#choseEndDate").scroller('destroy').scroller($.extend(opt["date"], {
        //         mode: "scroller",
        //         lang: "zh",
        //         display: "bottom",  //modal
        //         minDate: startDate
        //     }));
        //     var endDate = $("#endDate").val() || "";
        //     $("#totalDays").html( base.calculateDays(date, endDate) );
        // });
        // $("#endDate").on("change", function(){
        //     var date = $(this).val();
        //     var endDate = date && new Date(date) || new Date();
        //     end_date = date;
        //     $("#choseStartDate").scroller('destroy').scroller($.extend(opt["date"], {
        //         mode: "scroller",
        //         lang: "zh",
        //         display: "bottom",  //modal
        //         maxDate: endDate
        //     }));
        //     var startDate = $("#startDate").val() || "";
        //     $("#totalDays").html( base.calculateDays(startDate, date) );
        // });
        $("#startDate, #endDate").on("change", function(){
            var startDate = $("#startDate").val();
            var endDate = $("#endDate").val();
            $("#totalDays").html( base.calculateDays(startDate, endDate) );
        });
    }

    function hidePullUp(){
        $("#pullUp").css("visibility", "hidden");
    }

    function showPullUp(){
        $("#pullUp").css("visibility", "visible");
    }
});