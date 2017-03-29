define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/util/dialog',
    'app/util/dict',
    'app/module/scroll/scroll'
], function(base, Ajax, loading, dialog, Dict, scroll) {

    var myScroll, navScroll,
        hotelOrderStatus = Dict.get("hotelOrderStatus"),
        lineOrderStatus = Dict.get("lineOrderStatus"),
        specialLineOrderStatus = Dict.get("specialLineOrderStatus"),
        busStatus = Dict.get("busStatus"),
        carpoolStatus = Dict.get("carpoolStatus"),
        commodityStatus = Dict.get("commodityStatus");
    var index1 = base.getUrlParam("index") || 0,
        index = 0;
    var hhType = {},
        specialModule = {},
        pageFirst = true;
    /*全部、待支付、已支付、退款*/
    var statusList = [
        [null, [0], [1], [2, 31, 94]],
        [null, [0], [1], [2, 31, 94]],
        [null, [0], [1], [2, 31, 94]],
        [null, [0], [1], [2, 31, 94]],
        [null, [0], [1], [2, 31, 94]],
        [null, [0, 2, 97], [3]]
    ];
    var config = {
            "0": {
                start: 1,
                limit: 10,
                // status: "",
                statusList: null,
                applyUser: base.getUserId()
            },
            "1": {
                start: 1,
                limit: 10,
                // status: "",
                statusList: null,
                userId: base.getUserId()
            },
            "2": {
                start: 1,
                limit: 10,
                // status: "",
                statusList: null,
                applyUser: base.getUserId()
            },
            "3": {
                start: 1,
                limit: 10,
                // status: "",
                statusList: null,
                applyUser: base.getUserId()
            },
            "4": {
                start: 1,
                limit: 10,
                // status: "",
                statusList: null,
                booker: base.getUserId()
            },
            "5": {
                start: 1,
                limit: 10,
                statusList: null,
                applyUser: base.getUserId()
            }
        },
        config1 = {
            first0: true,
            isEnd0: false,
            first1: true,
            isEnd1: false,
            first2: true,
            isEnd2: false,
            first3: true,
            isEnd3: false,
            first4: true,
            isEnd4: false,
            first5: true,
            isEnd5: false,
            isLoading: false
        };

    init();

    function init() {
        initIScroll();
        addListener();
        config[index].statusList = getStatusByIndex(index1);
        $(".order-list-top-nav1").find(".order-list-top-nav1-item:eq(" + index + ")").click();
        $("#content").find(".order-list-content" + index).removeClass("hidden");
    }

    function initIScroll() {

        navScroll = scroll.getInstance().getScrollByParam({
            id: 'navWrap',
            param: {
                scrollX: true,
                scrollY: false,
                eventPassthrough: true,
                snap: true,
                hideScrollbar: true,
                hScrollbar: false,
                vScrollbar: false
            }
        });


        myScroll = scroll.getInstance().getNormalScroll({
            loadMore: function() {
                if (!config1["isEnd" + index]) {
                    if (index == 1)
                        getPageLineOrderList();
                    else if (index == 2)
                        getPageHotelOrderList();
                    else if (index == 3)
                        getPageSpecialLineOrderList();
                    else if (index == 4)
                        getPageBusOrderList();
                    else if (index == 5)
                        getPageCarpoolOrderList();
                    else if (index == 0)
                        getPageMallOrderList();
                }
            },
            refresh: function() {
                config1["isEnd" + index].isEnd = false;
                if (index == 1)
                    getPageLineOrderList(true);
                else if (index == 2)
                    getPageHotelOrderList(true);
                else if (index == 3)
                    getPageSpecialLineOrderList(true);
                else if (index == 4)
                    getPageBusOrderList(true);
                else if (index == 5)
                    getPageCarpoolOrderList(true);
                else if (index == 0)
                    getPageMallOrderList(true);
            }
        });
    }

    function addListener() {
        $(".order-list-top-nav1").on("click", ".order-list-top-nav1-item", function() {
            var _self = $(this),
                idx = _self.index();
            _self.siblings(".active").removeClass("active");
            _self.addClass("active");
            $("#content").find(".order-list-content:not(.hidden)")
                .addClass("hidden")
                .end().find(".order-list-content" + idx).removeClass("hidden");
            index = idx;
            var idx1;
            idx1 = getIndexByStatusList(config[index].statusList);
            pageFirst = false;
            $(".order-list-top-nav2")
                .find(".order-list-top-nav2-item.active").removeClass("active")
                .end().find(".order-list-top-nav2-item:eq(" + idx1 + ")").addClass("active");
            index1 = idx1;
            $("#top-tk").show();
            if (idx == 1 && config1.first1)
                getPageLineOrderList();
            else if (idx == 2 && config1.first2)
                getPageHotelOrderList();
            else if (idx == 3 && config1.first3)
                getSDict().then(getPageSpecialLineOrderList);
            else if (idx == 4 && config1.first4)
                getPageBusOrderList();
            else if (idx == 5) {
                $("#top-tk").hide();
                if (config1.first5)
                    getPageCarpoolOrderList();
            } else if (idx == 0 && config1.first5)
                getPageMallOrderList();
            myScroll.refresh();
        });
        $(".order-list-top-nav2").on("click", ".order-list-top-nav2-item", function() {
            var _self = $(this),
                idx1 = _self.index();
            _self.siblings(".active").removeClass("active");
            _self.addClass("active");
            var idx = $(".order-list-top-nav1").find(".order-list-top-nav1-item.active").index();
            index = idx;
            config[idx].start = 1;
            config[idx].statusList = getStatusByIndex(idx1);

            config1["first" + idx] = true;
            config1["isEnd" + idx] = false;
            index1 = idx1;
            loading.showLoading();
            if (idx == 1)
                getPageLineOrderList();
            else if (idx == 2)
                getPageHotelOrderList();
            else if (idx == 3)
                getPageSpecialLineOrderList();
            else if (idx == 4)
                getPageBusOrderList();
            else if (idx == 5)
                getPageCarpoolOrderList();
            else if (idx == 0)
                getPageMallOrderList();
            myScroll.refresh();
        });
        //酒店支付订单
        $("#content").on("click", ".order-list-content2 .item-pay-btn", function() {
            var code = $(this).closest("[data-code]").attr("data-code");
            location.href = "../pay/pay.html?code=" + code + "&type=0";
        });
        //线路支付订单
        $("#content").on("click", ".order-list-content1 .item-pay-btn", function() {
            var code = $(this).closest("[data-code]").attr("data-code");
            location.href = "../pay/pay.html?code=" + code + "&type=1";
        });
        //专线支付订单
        $("#content").on("click", ".order-list-content3 .item-pay-btn", function() {
            var code = $(this).closest("[data-code]").attr("data-code");
            location.href = "../pay/pay.html?code=" + code + "&type=2";
        });
        //大巴支付订单
        $("#content").on("click", ".order-list-content4 .item-pay-btn", function() {
            var code = $(this).closest("[data-code]").attr("data-code");
            location.href = "../pay/pay.html?code=" + code + "&type=3";
        });
        //拼车支付订单
        $("#content").on("click", ".order-list-content5 .item-pay-btn", function() {
            var code = $(this).closest("[data-code]").attr("data-code");
            location.href = "../pay/pay.html?code=" + code + "&type=4";
        });
        //商品支付订单
        $("#content").on("click", ".order-list-content0 .item-pay-btn", function() {
            var code = $(this).closest("[data-code]").attr("data-code");
            location.href = "../pay/pay.html?code=" + code + "&type=5";
        });

        //酒店取消订单
        $("#content").on("click", ".order-list-content2 .od-cancel-order", function() {
            // showTKModal.call(this, cancelHotelOrder);
            cancelHotelOrder($(this).closest("[data-code]").attr("data-code"));
        });
        //大巴取消订单
        $("#content").on("click", ".order-list-content4 .od-cancel-order", function() {
            // showTKModal.call(this, cancelBusOrder);
            cancelBusOrder($(this).closest("[data-code]").attr("data-code"));
        });
        //拼车取消订单
        $("#content").on("click", ".order-list-content5 .od-cancel-order", function() {
            // showTKModal.call(this, cancelCarpoolOrder);
            cancelCarpoolOrder($(this).closest("[data-code]").attr("data-code"));
        });
        //专线取消订单
        $("#content").on("click", ".order-list-content3 .od-cancel-order", function() {
            // showTKModal.call(this, cancelSpecialLineOrder);
            cancelSpecialLineOrder($(this).closest("[data-code]").attr("data-code"));
        });
        //线路取消订单
        $("#content").on("click", ".order-list-content1 .od-cancel-order", function() {
            // showTKModal.call(this, cancelLineOrder);
            cancelLineOrder($(this).closest("[data-code]").attr("data-code"));
        });
        //商品取消订单
        $("#content").on("click", ".order-list-content0 .od-cancel-order", function() {
            // showTKModal.call(this, cancelMallOrder);
            cancelMallOrder($(this).closest("[data-code]").attr("data-code"));
        });
        //酒店退款
        $("#content").on("click", ".order-list-content2 .od-tuik-btn", function() {
            showTKModal.call(this, TKHotelOrder);
        });
        //大巴退款
        $("#content").on("click", ".order-list-content4 .od-tuik-btn", function() {
            showTKModal.call(this, TKBusOrder);
        });
        //专线退款
        $("#content").on("click", ".order-list-content3 .od-tuik-btn", function() {
            showTKModal.call(this, TKSpecialLineOrder);
        });
        //线路退款
        $("#content").on("click", ".order-list-content1 .od-tuik-btn", function() {
            showTKModal.call(this, TKLineOrder);
        });
        //拼车退款
        $("#content").on("click", ".order-list-content5 .od-tuik-btn", function() {
            showTKModal.call(this, cancelCarpoolOrder);
        });
        //商品退款
        $("#content").on("click", ".order-list-content0 .od-tuik-btn", function() {
            showTKModal.call(this, tuikMallOrder);
        });
    }
    //专线数据字典
    function getSDict() {
        return Ajax.get("806052", {
                type: 3,
                location: 'goout'
            })
            .then(function(res) {
                if (res.success) {
                    $.each(res.data, function(i, d) {
                        specialModule[d.code] = d.name;
                    });
                } else {
                    base.showMsg(res.msg);
                }
            }, function() {
                base.showMsg("数据加载失败");
            });
    }
    //取消酒店订单
    function cancelHotelOrder(code) {
        cancelOrder("618041", code, getPageHotelOrderList);
    }
    //酒店订单退款
    function TKHotelOrder(code, remark) {
        TKOrder("618045", code, remark, getPageHotelOrderList);
    }
    // 取消大巴订单
    function cancelBusOrder(code) {
        cancelOrder("618211", code, getPageBusOrderList);
    }
    //大巴订单退款
    function TKBusOrder(code, remark) {
        TKOrder("618215", code, remark, getPageBusOrderList);
    }
    // 取消拼车订单
    function cancelCarpoolOrder(code) {
        cancelOrder("618243", code, getPageCarpoolOrderList);
    }
    //取消专线订单
    function cancelSpecialLineOrder(code) {
        cancelOrder("618181", code, getPageSpecialLineOrderList);
    }
    //专线订单退款
    function TKSpecialLineOrder(code, remark) {
        TKOrder("618185", code, remark, getPageSpecialLineOrderList);
    }
    //取消线路订单
    function cancelLineOrder(code) {
        cancelOrder("618141", code, getPageLineOrderList);
    }
    // 线路订单退款
    function TKLineOrder(code, remark) {
        TKOrder("618145", code, remark, getPageLineOrderList);
    }
    // 取消商品订单
    function cancelMallOrder(code) {
        cancelOrder("618452", code, getPageMallOrderList);
    }
    // 商品退款
    function tuikMallOrder(code, remark) {
        TKOrder("618456", code, remark, getPageMallOrderList);
    }
    //分页查询酒店订单
    function getPageHotelOrderList(refresh) {
        if ((!config1["isEnd" + index].isEnd || refresh) && !config1.isLoading) {
            config1.isLoading = true;
            if (refresh) {
                config[index].start = 1;
                loading.showLoading();
            }
            return Ajax.get("618050", config[index], !refresh)
                .then(function(res) {
                    if (res.success && res.data.list.length) {
                        var data = res.data.list;
                        if (data.length < config[index].limit) {
                            config1["isEnd" + index] = true;
                            base.hidePullUp();
                        } else {
                            base.showPullUp();
                        }
                        var html = "";
                        $.each(data, function(i, d) {
                            html += '<div class="order-list-item" data-code="' + d.code + '">' +
                                '<div class="order-list-item-top">' +
                                '<span class="order-list-item-top-left fl">' + d.code + '</span>' +
                                '<span class="order-list-item-top-right fr">' + base.formatDate(d.applyDatetime, "yyyy-MM-dd") + '</span>' +
                                '</div>' +
                                '<div class="order-list-item-center item">' +
                                '<a href="./order-hotel-detail.html?code=' + d.code + '" class="wp100 show">' +
                                '<div class="item-c-div item-l">' +
                                '<img class="center-img" src="' + base.getImg(d.pic1 || "") + '"/>' +
                                '</div>' +
                                '<div class="item-c">' +
                                '<div class="item-c-top t_norwrap pr50">' + d.name + '</div>' +
                                '<div class="item-c-center t_bbb t_norwrap">' + d.roomType + '</div>' +
                                '<div class="item-c-center t_bbb item-c-ctr">' + base.formatDate(d.startDate, 'MM月dd号') +
                                ' - ' + base.formatDate(d.endDate, 'MM月dd号') + '<span class="pl4">' +
                                base.calculateDays(d.startDate, d.endDate) + '晚' + d.quantity + '间</span>' +
                                '</div>' +
                                '<div class="y-big1 mt4">¥' + base.formatMoney(d.amount) + '</div>' +
                                '<div class="order-status">' + hotelOrderStatus[d.status] + '</div>' +
                                '</div>' +
                                '</a></div>';
                            if (d.status == "0") {
                                html += '<div class="order-oper-btns">' +
                                    '<input type="button" class="fr mlr10 item-order-btn item-pay-btn" value="付款"/>' +
                                    '<input type="button" class="fr ml10 item-order-btn od-cancel-order" value="取消订单"/>' +
                                    '</div>';
                            } else if (d.status == "1") {
                                html += '<div class="order-oper-btns">' +
                                    '<input type="button" class="fr mlr10 item-order-btn od-tuik-btn" value="退款"/>' +
                                    '</div>';
                            }
                            html += '</div>';
                        });
                        $("#content").find(".order-list-content" + index)[(refresh || config1["first" + index]) ? "html" : "append"](html);
                        config[index].start++;
                    } else {
                        if (config1["first" + index] || refresh) {
                            $("#content").find(".order-list-content" + index).html('<div class="item-error">暂时没有订单</div>');
                            base.hidePullUp();
                            res.msg && base.showMsg(res.msg);
                            config1["isEnd" + index] = true;
                        }
                    }
                    config1["first" + index] = false;
                    config1.isLoading = false;
                    loading.hideLoading();
                    myScroll.refresh();
                }, function() {
                    config1["first" + index] = false;
                    config1.isLoading = false;
                    $("#content").find(".order-list-content" + index).html('<div class="item-error">暂时没有订单</div>');
                    myScroll.refresh();
                    loading.hideLoading();
                });
        }
    }
    //分页查询线路订单
    function getPageLineOrderList(refresh) {
        if ((!config1["isEnd" + index].isEnd || refresh) && !config1.isLoading) {
            config1.isLoading = true;
            if (refresh) {
                config[index].start = 1;
                loading.showLoading();
            }
            return Ajax.get("618150", config[index], !refresh)
                .then(function(res) {
                    if (res.success && res.data.list.length) {
                        var data = res.data.list;
                        if (data.length < config[index].limit) {
                            config1["isEnd" + index] = true;
                            base.hidePullUp();
                        } else {
                            base.showPullUp();
                        }
                        var html = "";
                        $.each(data, function(i, d) {
                            html += '<div class="order-list-item" data-code="' + d.code + '">' +
                                '<div class="order-list-item-top">' +
                                '<span class="order-list-item-top-left fl">' + d.code + '</span>' +
                                '<span class="order-list-item-top-right fr">' + base.formatDate(d.applyDatetime, "yyyy-MM-dd") + '</span>' +
                                '</div>' +
                                '<div class="order-list-item-center item">' +
                                '<a href="./order-line-detail.html?code=' + d.code + '" class="wp100 show">' +
                                '<div class="item-c-div item-l">' +
                                '<img class="center-img" src="' + base.getImg(d.line.pathPic) + '"/>' +
                                '</div>' +
                                '<div class="item-c">' +
                                '<div class="item-c-top1 t_norwrap pr50">' + d.line.name + '</div>' +
                                '<div class="y-big1 p-a-b-0">¥' + base.formatMoney(d.amount) + '</div>' +
                                '<div class="order-status order-step-pay">' + lineOrderStatus[d.status] + '</div>' +
                                '</div>' +
                                '</a></div>';
                            if (d.status == "0") {
                                html += '<div class="order-oper-btns">' +
                                    '<input type="button" class="fr mlr10 item-order-btn item-pay-btn" value="付款"/>' +
                                    '<input type="button" class="fr ml10 item-order-btn od-cancel-order" value="取消订单"/>' +
                                    '</div>';
                            } else if (d.status == "1") {
                                html += '<div class="order-oper-btns">' +
                                    '<input type="button" class="fr mlr10 item-order-btn od-tuik-btn" value="退款"/>' +
                                    '</div>';
                            }
                            html += '</div>';
                        });
                        $("#content").find(".order-list-content" + index)[(refresh || config1["first" + index]) ? "html" : "append"](html);
                        config[index].start++;
                    } else {
                        if (config1["first" + index] || refresh) {
                            $("#content").find(".order-list-content" + index).html('<div class="item-error">暂时没有订单</div>');
                            base.hidePullUp();
                            res.msg && base.showMsg(res.msg);
                            config1["isEnd" + index] = true;
                        }
                    }
                    config1["first" + index] = false;
                    config1.isLoading = false;
                    loading.hideLoading();
                    myScroll.refresh();
                }, function() {
                    config1["first" + index] = false;
                    config1.isLoading = false;
                    $("#content").find(".order-list-content" + index).html('<div class="item-error">暂时没有订单</div>');
                    myScroll.refresh();
                    loading.hideLoading();
                });
        }
    }
    //分页查询专线订单
    function getPageSpecialLineOrderList(refresh) {
        if ((!config1["isEnd" + index].isEnd || refresh) && !config1.isLoading) {
            config1.isLoading = true;
            if (refresh) {
                config[index].start = 1;
                loading.showLoading();
            }
            return Ajax.get("618190", config[index], !refresh)
                .then(function(res) {
                    if (res.success && res.data.list.length) {
                        var data = res.data.list;
                        if (data.length < config[index].limit) {
                            config1["isEnd" + index] = true;
                            base.hidePullUp();
                        } else {
                            base.showPullUp();
                        }
                        var html = "";
                        $.each(data, function(i, d) {
                            html += '<div class="order-list-item" data-code="' + d.code + '">' +
                                '<div class="order-list-item-top">' +
                                '<span class="order-list-item-top-left fl">' + d.code + '</span>' +
                                '<span class="order-list-item-top-right fr">' + base.formatDate(d.applyDatetime, "yyyy-MM-dd") + '</span>' +
                                '</div>' +
                                '<div class="order-list-item-center item">' +
                                '<a href="./order-special-line-detail.html?code=' + d.code + '" class="wp100 show">' +
                                '<div class="item-c-div item-l">' +
                                '<img class="center-img" src="' + base.getImg(d.specialLine.pic) + '"/>' +
                                '</div>' +
                                '<div class="item-c flex flex-dv flex-jb">' +
                                '<div class="item-c-top t_norwrap pr50">' + specialModule[d.specialLine.type] + '</div>' +
                                '<div class="item-c-center t_bbb t_norwrap">上车地点：' + d.specialLine.address + '</div>' +
                                '<div class="item-c-center t_bbb item-c-ctr c_f64444">发车时间：' + base.formatDate(d.specialLine.outDatetime, 'yyyy-MM-dd hh:mm') + '</span></div>' +
                                '<div class="item-c-center t_bbb t_norwrap">票数：' + d.quantity + '张</div>' +
                                '<div class="y-big1 p-a-r-b">¥' + base.formatMoney(d.amount) + '</div>' +
                                '<div class="order-status">' + specialLineOrderStatus[d.status] + '</div>' +
                                '</div>' +
                                '</a></div>';
                            if (d.status == "0") {
                                html += '<div class="order-oper-btns">' +
                                    '<input type="button" class="fr mlr10 item-order-btn item-pay-btn" value="付款"/>' +
                                    '<input type="button" class="fr ml10 item-order-btn od-cancel-order" value="取消订单"/>' +
                                    '</div>';
                            } else if (d.status == "1") {
                                html += '<div class="order-oper-btns">' +
                                    '<input type="button" class="fr mlr10 item-order-btn od-tuik-btn" value="退款"/>' +
                                    '</div>';
                            }
                            html += '</div>';
                        });
                        $("#content").find(".order-list-content" + index)[(refresh || config1["first" + index]) ? "html" : "append"](html);
                        config[index].start++;
                    } else {
                        if (config1["first" + index] || refresh) {
                            $("#content").find(".order-list-content" + index).html('<div class="item-error">暂时没有订单</div>');
                            base.hidePullUp();
                            res.msg && base.showMsg(res.msg);
                            config1["isEnd" + index] = true;
                        }
                    }
                    config1["first" + index] = false;
                    config1.isLoading = false;
                    loading.hideLoading();
                    myScroll.refresh();
                }, function() {
                    config1["first" + index] = false;
                    config1.isLoading = false;
                    $("#content").find(".order-list-content" + index).html('<div class="item-error">暂时没有订单</div>');
                    myScroll.refresh();
                    loading.hideLoading();
                });
        }
    }
    //分页查询拼车订单
    function getPageCarpoolOrderList(refresh) {
        if ((!config1["isEnd" + index].isEnd || refresh) && !config1.isLoading) {
            config1.isLoading = true;
            if (refresh) {
                config[index].start = 1;
                loading.showLoading();
            }
            return Ajax.get("618253", config[index], !refresh)
                .then(function(res) {
                    if (res.success && res.data.list.length) {
                        var data = res.data.list;
                        if (data.length < config[index].limit) {
                            config1["isEnd" + index] = true;
                            base.hidePullUp();
                        } else {
                            base.showPullUp();
                        }
                        var html = "";
                        $.each(data, function(i, d) {

                            html += '<div class="order-list-item" data-code="' + d.code + '">' +
                                '<div class="order-list-item-top">' +
                                '<span class="order-list-item-top-left fl">' + d.code + '</span>' +
                                '<span class="order-list-item-top-right fr">' + base.formatDate(d.applyDatetime, "yyyy-MM-dd") + '</span>' +
                                '</div>' +
                                '<div class="order-list-item-center item">' +
                                '<a href="./order-carpool-detail.html?code=' + d.code + '" class="wp100 show">' +
                                '<div class="item-c pl0_i flex flex-dv flex-jb">' +
                                '<div class="item-c-top t_norwrap pr110">上车地点：' + d.carpool.startSite + '</div>' +
                                '<div class="item-c-center t_norwrap pr110 c_59">下车地点：' + d.carpool.endSite + '</div>' +
                                '<div class="item-c-center c_59 item-c-ctr pr110">发车时间：' + base.formatDate(d.carpool.outDatetime, 'yyyy-MM-dd hh:mm') + '</span></div>' +
                                '<div class="item-c-center t_bbb t_norwrap pr110">拼车人数：' + d.carpool.totalNum + '人</div>' +
                                '<div class="y-big2 p-a-r-c"><span class="fs12">定金：</span>¥' + base.formatMoney(d.firstAmount) + '</div>' +
                                '<div class="y-big2 p-a-r-b"><span class="fs12">尾款：</span>¥' + base.formatMoney(d.secondAmount) + '</div>' +
                                '<div class="order-status">' + carpoolStatus[d.status] + '</div>' +
                                '</div>' +
                                '</a></div>';
                            if (d.status == "0" || d.status == "1" || d.status == "2" || d.status == "97") {
                                html += '<div class="order-oper-btns">' +
                                    '<input type="button" class="fr mlr10 item-order-btn item-pay-btn '+(d.status != "1" ? "" : "hidden")+'" value="付款"/>' +
                                    '<input type="button" class="fr ml10 item-order-btn od-cancel-order '+(d.status != "1" ? "" : "mr10")+'" value="取消订单"/>' +
                                    '</div>';
                            }
                            html += '</div>';
                        });
                        $("#content").find(".order-list-content" + index)[(refresh || config1["first" + index]) ? "html" : "append"](html);
                        config[index].start++;
                    } else {
                        if (config1["first" + index] || refresh) {
                            $("#content").find(".order-list-content" + index).html('<div class="item-error">暂时没有订单</div>');
                            base.hidePullUp();
                            res.msg && base.showMsg(res.msg);
                            config1["isEnd" + index] = true;
                        }
                    }
                    config1["first" + index] = false;
                    config1.isLoading = false;
                    loading.hideLoading();
                    myScroll.refresh();
                }, function() {
                    config1["first" + index] = false;
                    config1.isLoading = false;
                    $("#content").find(".order-list-content" + index).html('<div class="item-error">暂时没有订单</div>');
                    myScroll.refresh();
                    loading.hideLoading();
                });
        }
    }
    // 分页查询商品订单
    function getPageMallOrderList(refresh) {
        if ((!config1["isEnd" + index].isEnd || refresh) && !config1.isLoading) {
            config1.isLoading = true;
            if (refresh) {
                config[index].start = 1;
                loading.showLoading();
            }
            return Ajax.get("618470", config[index], !refresh)
                .then(function(res) {
                    if (res.success && res.data.list.length) {
                        var data = res.data.list;
                        if (data.length < config[index].limit) {
                            config1["isEnd" + index] = true;
                            base.hidePullUp();
                        } else {
                            base.showPullUp();
                        }
                        var html = "";
                        $.each(data, function(i, d) {
                            html += '<div class="order-list-item" data-code="' + d.code + '">' +
                                '<div class="order-list-item-top">' +
                                '<span class="order-list-item-top-left fl">' + d.code + '</span>' +
                                '<span class="order-list-item-top-right fr">' + base.formatDate(d.applyDatetime, "yyyy-MM-dd") + '</span>' +
                                '</div>' +
                                '<div class="order-list-item-center item">' +
                                '<a href="./order-mall-detail.html?code=' + d.code + '" class="wp100 show">' +
                                '<div class="item-c-div item-l">' +
                                '<img class="center-img" src="' + base.getImg(d.productOrderList[0].advPic) + '"/>' +
                                '</div>' +
                                '<div class="item-c flex flex-dv flex-jb">' +
                                '<div class="item-c-top1 pb0_i t_norwrap pr50">' + d.productOrderList[0].productName + '</div>' +
                                '<div class="item-c-center t_norwrap pr50">x' + d.productOrderList[0].quantity + '</div>' +
                                '<div class="y-big1 fs14">' + base.fZeroMoney(d.amount1) + '积分</div>' +
                                '<div class="order-status order-step-pay">' + commodityStatus[d.status] + '</div>' +
                                '</div>' +
                                '</a></div>';
                            if (d.status == "0") {
                                html += '<div class="order-oper-btns">' +
                                    '<input type="button" class="fr mlr10 item-order-btn item-pay-btn" value="付款"/>' +
                                    '<input type="button" class="fr ml10 item-order-btn od-cancel-order" value="取消订单"/>' +
                                    '</div>';
                            } else if (d.status == "1") {
                                html += '<div class="order-oper-btns">' +
                                    '<input type="button" class="fr mlr10 item-order-btn od-tuik-btn" value="退款"/>' +
                                    '</div>';
                            }
                            html += '</div>';
                        });
                        $("#content").find(".order-list-content" + index)[(refresh || config1["first" + index]) ? "html" : "append"](html);
                        config[index].start++;
                    } else {
                        if (config1["first" + index] || refresh) {
                            $("#content").find(".order-list-content" + index).html('<div class="item-error">暂时没有订单</div>');
                            base.hidePullUp();
                            res.msg && base.showMsg(res.msg);
                            config1["isEnd" + index] = true;
                        }
                    }
                    config1["first" + index] = false;
                    config1.isLoading = false;
                    loading.hideLoading();
                    myScroll.refresh();
                }, function() {
                    config1["first" + index] = false;
                    config1.isLoading = false;
                    $("#content").find(".order-list-content" + index).html('<div class="item-error">暂时没有订单</div>');
                    myScroll.refresh();
                    loading.hideLoading();
                });
        }
    }

    //分页查询大巴订单
    function getPageBusOrderList(refresh) {
        if ((!config1["isEnd" + index].isEnd || refresh) && !config1.isLoading) {
            config1.isLoading = true;
            if (refresh) {
                config[index].start = 1;
                loading.showLoading();
            }
            return Ajax.get("618220", config[index], !refresh)
                .then(function(res) {
                    if (res.success && res.data.list.length) {
                        var data = res.data.list;
                        if (data.length < config[index].limit) {
                            config1["isEnd" + index] = true;
                            base.hidePullUp();
                        } else {
                            base.showPullUp();
                        }
                        var html = "";
                        $.each(data, function(i, d) {
                            html += '<div class="order-list-item" data-code="' + d.code + '">' +
                                '<div class="order-list-item-top">' +
                                '<span class="order-list-item-top-left fl">' + d.code + '</span>' +
                                '<span class="order-list-item-top-right fr">' + base.formatDate(d.bookDatetime, "yyyy-MM-dd") + '</span>' +
                                '</div>' +
                                '<div class="order-list-item-center item">' +
                                '<a href="./order-bus-detail.html?code=' + d.code + '" class="wp100 show">' +
                                '<div class="item-c pl0_i flex flex-dv flex-jb">' +
                                '<div class="item-c-top t_norwrap pr50">上车地点：' + d.startSite + '</div>' +
                                '<div class="item-c-center t_norwrap pr50">下车地点：' + d.endSite + '</div>' +
                                '<div class="item-c-center t_bbb item-c-ctr c_f64444">发车时间：' + base.formatDate(d.outDatetime, 'yyyy-MM-dd hh:mm') + '</span></div>' +
                                '<div class="item-c-center t_bbb t_norwrap">人数：' + d.totalNum + '人</div>' +
                                '<div class="y-big1 p-a-r-b">¥' + base.formatMoney(d.distancePrice) + '</div>' +
                                '<div class="order-status">' + busStatus[d.status] + '</div>' +
                                '</div>' +
                                '</a></div>';
                            if (d.status == "0") {
                                html += '<div class="order-oper-btns">' +
                                    '<input type="button" class="fr mlr10 item-order-btn item-pay-btn" value="付款"/>' +
                                    '<input type="button" class="fr ml10 item-order-btn od-cancel-order" value="取消订单"/>' +
                                    '</div>';
                            } else if (d.status == "1") {
                                html += '<div class="order-oper-btns">' +
                                    '<input type="button" class="fr mlr10 item-order-btn od-tuik-btn" value="退款"/>' +
                                    '</div>';
                            }
                            html += '</div>';
                        });
                        $("#content").find(".order-list-content" + index)[(refresh || config1["first" + index]) ? "html" : "append"](html);
                        config[index].start++;
                    } else {
                        if (config1["first" + index] || refresh) {
                            $("#content").find(".order-list-content" + index).html('<div class="item-error">暂时没有订单</div>');
                            base.hidePullUp();
                            res.msg && base.showMsg(res.msg);
                            config1["isEnd" + index] = true;
                        }
                    }
                    config1["first" + index] = false;
                    config1.isLoading = false;
                    loading.hideLoading();
                    myScroll.refresh();
                }, function() {
                    config1["first" + index] = false;
                    config1.isLoading = false;
                    $("#content").find(".order-list-content" + index).html('<div class="item-error">暂时没有订单</div>');
                    myScroll.refresh();
                    loading.hideLoading();
                });
        }
    }

    function getStatusByIndex(idx) {
        return statusList[index][idx];
    }

    function getIndexByStatusList(sList) {
        /*var statusList = [
        [null, [0], [1], [2, 31, 94]],
        [null, [0], [1], [2, 31, 94]],
        [null, [0], [1], [2, 31, 94]],
        [null, [0], [1], [2, 31, 94]],
        [null, [0], [1], [2, 31, 94]],
        [null, [0, 2, 97], [3]]
    ];*/
        if(!sList)
            return 0;
        if(index != 5){
            if(sList.length == 3)
                return 3;
            if(sList[0] == 0)
                return 1;
            return 2;
        }
        if (sList.length == 3) {
            return 1;
        }
        if (sList[0] == 3) {
            return 2;
        }
        return 0;
    }

    function getIndexByStatus(status) {
        var list = statusList[index];
        var idx = 0;
        for (var i = 0; i < list.length; i++) {
            if (list[i] == status) {
                idx = i;
                break;
            }
        }
        return idx;
    }
    //显示退款弹框
    function showTKModal(success) {
        var str1 = "请填写退款理由",
            str2 = "退款理由中包含非法字符",
            title = "退款申请";

        var code = $(this).closest("[data-code]").attr("data-code");
        var d = dialog({
            title: title,
            content: '理由：<textarea id="cancelNote" class="dialog-textarea"></textarea>' +
                '<div class="tr t_fa5555 hidden dialog-error-tip dialog-error-tip0">' + str1 + '</div>' +
                '<div class="tr t_fa5555 hidden dialog-error-tip dialog-error-tip1">' + str2 + '</div>',
            ok: function(argument) {
                var remark = $(".dialog-textarea").val();
                if (!remark || remark.trim() == "") {
                    $(".dialog-error-tip0").removeClass("hidden");
                    $(".dialog-error-tip1").addClass("hidden");
                    return false;
                } else if (!base.isNotFace(remark)) {
                    $(".dialog-error-tip0").addClass("hidden");
                    $(".dialog-error-tip1").removeClass("hidden");
                    return false;
                }
                success(code, remark);
            },
            okValue: '确定',
            cancel: function() {
                d.close().remove();
            },
            cancelValue: '取消'
        });
        d.showModal();
    }
    //取消订单
    function cancelOrder(bizType, code, success) {
        base.confirm("确定取消订单吗？")
            .then(function() {
                loading.createLoading("取消中...");
                Ajax.post(bizType, {
                    json: {
                        orderCodeList: [code]
                    }
                }).then(function(res) {
                    if (res.success) {
                        base.showMsg("取消成功");
                        loading.createLoading();
                        success(true);
                    } else {
                        loading.hideLoading();
                        base.showMsg(res.msg || "取消失败");
                    }
                }, function() {
                    loading.hideLoading();
                    base.showMsg("取消失败");
                });
            }, base.emptyFun);
    }
    //退款
    function TKOrder(bizType, code, remark, success) {
        loading.createLoading("退款中...");
        Ajax.post(bizType, {
            json: {
                code: code,
                remark: remark,
                updater: base.getUserId(),
                userId: base.getUserId()
            }
        }).then(function(res) {
            if (res.success) {
                base.showMsg("退款成功");
                loading.createLoading();
                success(true);
            } else {
                loading.hideLoading();
                base.showMsg(res.msg || "退款失败");
            }
        }, function() {
            loading.hideLoading();
            base.showMsg("退款失败");
        });
    }
});
