define([
    'app/controller/base',
    'app/util/ajax',
    'iScroll',
    'app/module/loading/loading',
    'swiper',
    'app/module/showImg/showImg',
    'app/util/handlebarsHelpers',
    'app/module/scroll/scroll'
], function(base, Ajax, iScroll, loading, Swiper, showImg, Handlebars, scroll) {

    var myScroll,
        start = 1,
        limit = 10,
        first = true,
        isEnd = false,
        isLoading = false,
        watchDateTimer = "",
        hotelCode = base.getUrlParam("code"),
        start_date = "",
        end_date = "",
        roomCode = "",
        pic_suffix = '?imageMogr2/auto-orient/thumbnail/!375x180r';
    var roomTmpl = __inline("../../ui/chose-room.handlebars");
    var noReaminTmpl = __inline("../../ui/no-remain-chose-room.handlebars");
    var returnUrl = base.getReturnParam();

    init();
    var hmType2 = {},
        ssType = {};
    var remain = 0; //剩余房间数

    function init() {
        initIScroll();
        getHotelAndRoom();
    }

    function getHotelAndRoom() {
        loading.createLoading("加载中...");
        base.hidePullUp();
        $.when(
            base.getDictList("ss_type"),
            getHotel()
        ).then(function(res) {
            if (res.success) {
                $.each(res.data, function(i, d) {
                    ssType[d.dkey] = d.dvalue;
                });
                Handlebars.registerHelper('formatDesc', function(text, options) {
                    var str = "";
                    var arr = text.split(/,/);
                    $.each(arr, function(i, a) {
                        str += ssType[a] + " | ";
                    })
                    return str && str.substr(0, str.length - 2) || "--";
                });
                getPageRoom();
                addListener();
                loading.hideLoading();
            } else {
                loading.hideLoading();
            }
        });
    }

    function getHotel() {
        return Ajax.get("618012", {
            code: hotelCode
        }).then(function(res) {
            if (res.success) {
                var data = res.data.hotal;
                var pic = data.pic2.split(/\|\|/),
                    html = "";
                $.each(pic, function(i, p) {
                    html += '<div class="swiper-slide"><img class="wp100 center-img" src="' + base.getPic(p, pic_suffix) + '"></div>'
                });

                $("#swiper").find(".swiper-wrapper").html(html);

                initSwiper();

            } else {
                base.showMsg(res.msg || "酒店图片加载失败");
            }
            return res;
        });
    }

    function getPageRoom(refresh) {
        if (!isLoading && !isEnd) {
            base.showPullUp();
            isLoading = true;
            return Ajax.get("618033", {
                hotalCode: hotelCode,
                start: start,
                limit: limit,
                startDate: start_date,
                endDate: end_date
            }, !refresh).then(function(res) {
                if (res.success && res.data.list.length) {
                    var data = res.data.list;
                    if (data.length < limit) {
                        isEnd = true;
                        base.hidePullUp();
                    } else {
                        base.showPullUp();
                    }
                    var tmp = first ? noReaminTmpl : roomTmpl;
                    $("#content")[refresh ? "html" : "append"](tmp({
                        items: data
                    }));
                    !first && start++;
                } else {
                    if (first) {
                        $("#content").html('<div class="item-error">该酒店暂无房间</div>');
                    }
                    base.hidePullUp();
                    base.showMsg(res.msg);
                }
                first = false;
                isLoading = false;
                myScroll.refresh();
                return res;
            }, function() {
                if (first) {
                    $("#content").html('<div class="item-error">该酒店暂无房间</div>');
                }
                base.hidePullUp();
                base.showMsg("房间信息获取失败");
                first = false;
            });
        }
    }

    function initSwiper() {
        new Swiper('#swiper', {
            'direction': 'horizontal',
            'autoplay': 4000,
            'autoplayDisableOnInteraction': false,
            'pagination': '.swiper-pagination',
            'preventClicks': false
        });
    }

    function initIScroll() {
        myScroll = scroll.getInstance().getOnlyDownScroll({
            loadMore: function() {
                getPageRoom();
            }
        });
    }

    function addListener() {
        $("#buyBtn").on("click", function() {
            if (start_date && end_date && roomCode && remain) {
                location.href = './submit-order.html?hotelcode=' + hotelCode +
                    '&roomcode=' + roomCode + '&start=' + start_date + '&end=' + end_date + "&remain=" + remain + '&return=' + returnUrl;
            } else if (!start_date) {
                base.showMsg("未选择入住时间");
            } else if (!end_date) {
                base.showMsg("未选择离开时间");
            } else if (!roomCode) {
                base.showMsg("未选择房型");
            } else if (!remain) {
                base.showMsg("您选择的房型没有剩余房间");
            }
        });
        $("#swiper").on("click", ".swiper-slide .center-img", function() {
            showImg.createImg($(this).attr("src")).showImg();
        });
        var start = {
            elem: '#choseStartDate',
            format: 'YYYY-MM-DD',
            min: laydate.now(), //设定最小日期为当前日期
            isclear: false, //是否显示清空
            istoday: false,
            choose: function(datas) {
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
            choose: function(datas) {
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

        $("#kefuIcon").on("click", function(e) {
            location.href = "http://kefu.easemob.com/webim/im.html?tenantId=" + TENANTID;
        });
        $("#content").on("click", ".croom-item", function() {
            var _self = $(this);
            _self.siblings(".active").removeClass("active");
            if (_self.hasClass("active")) {
                _self.removeClass("active");
                roomCode = "";
                remain = 0;
            } else {
                _self.addClass("active");
                roomCode = _self.attr("data-code");
                remain = +_self.attr("data-remain");
            }
        });
        $("#startDate, #endDate").on("change", function() {
            var startDate = $("#startDate").val();
            var endDate = $("#endDate").val();
            $("#totalDays").html(base.calculateDays(startDate, endDate));
            updateRoom();
        });
    }

    function updateRoom() {
        if (start_date && end_date) {
            roomCode = "";
            remain = 0;
            isEnd = false;
            start = 1;
            loading.createLoading();
            getPageRoom(true)
                .then(function(){
                    loading.hideLoading();
                }, function(){
                    loading.hideLoading();
                });
        }
    }
});
