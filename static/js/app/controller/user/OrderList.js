define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'iScroll',
    'app/util/handlebarsHelpers',
    'app/util/dialog',
    'app/util/dict'
], function(base, Ajax, loading, iScroll, Handlebars, dialog, Dict) {

    var myScroll,
        hotelOrderStatus = Dict.get("hotelOrderStatus"),
        lineOrderStatus = Dict.get("lineOrderStatus");
    var index1 = base.getUrlParam("index") || 0, index = 2;
    var hhType = {}, specialModule = {};
    var config = {
        "0": {
            start: 1,
            limit: 10,
            status: "",
            userId: base.getUserId()
        },
        "1": {
            start: 1,
            limit: 10,
            status: "",
            userId: base.getUserId()
        },
        "2": {
            start: 1,
            limit: 10,
            status: "",
            userId: base.getUserId()
        },
        "3": {
            start: 1,
            limit: 10,
            status: "",
            userId: base.getUserId()
        }
    }, config1 = {
        first0: true,
        isEnd0: false,
        first1: true,
        isEnd1: false,
        first2: true,
        isEnd2: false,
        first3: true,
        isEnd3: false,
        isLoading: false
    };

    /*TO_PAY("1", "待支付"), PAY_YES("2", "已支付"), CHECK_IN("3", "已入住"), CHECK_OUT(
            "4", "已退房"), OVER("5", "已完成"), TO_REFUND("6", "待退款"), REFUND_YES(
            "7", "退款成功"), REFUND_NO("8", "退款失败"),（“9‘， ’已申请退款‘） YHYC("91", "用户异常"), SHYC(
            "92", "商户异常");*/
    /*全部、待支付、已支付、退款*/

    init();
    function init(){
        initIScroll();
        addListener();
        $(".order-list-top-nav2").find(".order-list-top-nav2-item:eq("+index1+")").addClass("active");
        $(".order-list-top-nav1").find(".order-list-top-nav1-item:eq("+index+")").click();
        $("#content").find(".order-list-content"+index).removeClass("hidden");
    }
    function initIScroll(){
        var pullDownEl, pullDownOffset, $pullDownEl;
        function pullDownAction () {
            if(index == 1)
                getPageLineOrderList(true);
            else if(index == 2)
                getPageHotelOrderList(true);
            else if(index == 3)
                getPageSpecialLineOrderList(true);
            else
                myScroll.refresh();
        }
        $pullDownEl = $("#pullDown");
        pullDownEl = $pullDownEl[0];
        pullDownOffset = pullDownEl.offsetHeight;
        
        myScroll = new iScroll('wrapper', {
            useTransition: false,
            topOffset: pullDownOffset,
            onRefresh: function () {
                if ($pullDownEl.hasClass('scroll-loading')) {
                    $pullDownEl.removeClass('scroll-loading flip');
                }
            },
            onScrollMove: function () {
                 if (this.y > 5 && !$pullDownEl.hasClass("flip")) {
                    $pullDownEl.addClass("flip");
                    this.minScrollY = 0;
                } else if (this.y < 5 && $pullDownEl.hasClass("flip")) {
                    $pullDownEl.removeClass("flip");
                    this.minScrollY = -pullDownOffset;
                } else if (this.y - 120 < this.maxScrollY && !config1["isEnd" + index]) {
                    if(index == 1)
                        getPageLineOrderList();
                    else if(index == 2)
                        getPageHotelOrderList();
                }
            },
            onScrollEnd: function () {
                if ($pullDownEl.hasClass("flip")) {
                    $pullDownEl.addClass("scroll-loading");           
                    pullDownAction();
                }
            }
        });
    }
    function addListener(){
        $(".order-list-top-nav1").on("click", ".order-list-top-nav1-item", function(){
            var _self = $(this), idx = _self.index();
            _self.siblings(".active").removeClass("active");
            _self.addClass("active");
            $("#content").find(".order-list-content:not(.hidden)")
                .addClass("hidden")
                .end().find(".order-list-content" + idx).removeClass("hidden");
            var idx1 = getIndexByStatus(config[idx].status);
            $(".order-list-top-nav2")
                .find(".order-list-top-nav2-item.active").removeClass("active")
                .end().find(".order-list-top-nav2-item:eq("+idx1+")").addClass("active");
            index = idx;
            index1 = idx1;
            if(idx == 1 && config1.first1)
                getPageLineOrderList();
            else if(idx == 2 && config1.first2)
                getHHType().then(getPageHotelOrderList);
            else if(idx == 3 && config1.first3)
                getSDict().then(getPageSpecialLineOrderList);
            myScroll.refresh();
        });
        $(".order-list-top-nav2").on("click", ".order-list-top-nav2-item", function(){
            var _self = $(this), idx1 = _self.index();
            _self.siblings(".active").removeClass("active");
            _self.addClass("active");
            var idx = $(".order-list-top-nav1").find(".order-list-top-nav1-item.active").index();
            config[idx].start = 1;
            config[idx].status = getStatusByIndex(idx1);
            config1["first" + idx] = true;
            config1["isEnd" + idx] = false;
            index = idx;
            index1 = idx1;
            loading.showLoading();
            if(idx == 1)
                getPageLineOrderList();
            else if(idx == 2)
                getPageHotelOrderList();
            myScroll.refresh();
        });
        //酒店支付订单
        $("#content").on("click", ".order-list-content2 .item-pay-btn", function(){
            var code = $(this).closest("[data-code]").attr("data-code");
            location.href = "../pay/pay.html?code=" + code + "&type=0";
        });
        //线路支付订单
        $("#content").on("click", ".order-list-content1 .item-pay-btn", function(){
            var code = $(this).closest("[data-code]").attr("data-code");
            location.href = "../pay/pay.html?code=" + code + "&type=1";
        });
        //专线支付订单
        $("#content").on("click", ".order-list-content3 .item-pay-btn", function(){
            var code = $(this).closest("[data-code]").attr("data-code");
            location.href = "../pay/pay.html?code=" + code + "&type=2";
        });
        //酒店取消订单
        $("#content").on("click", ".order-list-content2 .od-cancel-order", function(){
            showCancelOrTKModal.call(this, cancelHotelOrder);
        });
        //线路取消订单
        $("#content").on("click", ".order-list-content1 .od-cancel-order", function(){
            showCancelOrTKModal.call(this, cancelLineOrder);
        });
        //专线取消订单
        $("#content").on("click", ".order-list-content1 .od-cancel-order", function(){
            showCancelOrTKModal.call(this, cancelSpecialLineOrder);
        });
        //酒店退款
        $("#content").on("click", ".order-list-content2 .od-tuik-btn", function(){
            showCancelOrTKModal.call(this, cancelHotelOrder, 1);
        });
        //线路退款
        $("#content").on("click", ".order-list-content1 .od-tuik-btn", function(){
            showCancelOrTKModal.call(this, cancelLineOrder, 1);
        });
        //专线退款
        $("#content").on("click", ".order-list-content3 .od-tuik-btn", function(){
            showCancelOrTKModal.call(this, cancelSpecialLineOrder, 1);
        });
        //酒店撤销退款
        $("#content").on("click", ".order-list-content2 .od-cancel-tuik-btn", function(){
            var code = $(this).closest("[data-code]").attr("data-code");
            tuikcx_hotel(code);
        });
        //线路撤销退款
        $("#content").on("click", ".order-list-content1 .od-cancel-tuik-btn", function(){
            var code = $(this).closest("[data-code]").attr("data-code");
            tuikcx_line(code);
        });
        //线路撤销退款
        $("#content").on("click", ".order-list-content3 .od-cancel-tuik-btn", function(){
            var code = $(this).closest("[data-code]").attr("data-code");
            tuikcx_special_line(code);
        });
    }
    //酒店数据字典
    function getHHType(){
        return base.getDictList("hh_type")
            .then(function (res) {
                if(res.success){
                    $.each(res.data, function(i, d){
                        hhType[d.dkey] = d.dvalue;
                    });
                }else{
                    base.showMsg(res.msg);
                }
            }, function(){
                base.showMsg("数据加载失败");
            });
    }
    //专线数据字典
    function getSDict(){
        return Ajax.get("806052", {type: 3, location: 'goout'})
            .then(function(res){
                if(res.success){
                    $.each(res.data, function(i, d){
                        specialModule[d.code] = d.name;
                    });
                }else{
                    base.showMsg(res.msg);
                }
            }, function(){
                base.showMsg("数据加载失败");
            });
    }
    //酒店撤销退款
    function tuikcx_hotel(code){
        tuikcx("618047", code, getPageHotelOrderList);
    }
    //线路撤销退款
    function tuikcx_line(code){
        tuikcx("618146", code, getPageLineOrderList);
    }
    function tuikcx_special_line(code) {
        tuikcx("618185", code, getPageSpecialLineOrderList);
    }
    //取消酒店订单
    function cancelHotelOrder(code, remark){
        cancelOrder("618043", code, remark, getPageHotelOrderList);
    }
    //取消线路订单
    function cancelLineOrder(code, remark){
        cancelOrder("618142", code, remark, getPageLineOrderList);
    }
    //取消专线订单
    function cancelSpecialLineOrder(code, remark) {
        cancelOrder("618183", code, remark, getPageSpecialLineOrderList);
    }
    //分页查询酒店订单
    function getPageHotelOrderList(refresh){
        if( (!config1["isEnd"+index].isEnd || refresh) && !config1.isLoading ){
            config1.isLoading = true;
            if(refresh){
                config[index].start = 1;
                loading.showLoading();
            }
            return Ajax.get("618050", config[index], !refresh)
                .then(function (res) {
                    if(res.success && res.data.list.length){
                        var data = res.data.list;
                        if(data.length < config[index].limit){
                            config1["isEnd" + index] = true;
                            base.hidePullUp();
                        }else{
                            base.showPullUp();
                        }
                        var html = "";
                        $.each(data, function (i, d) {
                            html += '<div class="order-list-item" data-code="'+d.code+'">'+
                                '<div class="order-list-item-top">' +
                                    '<span class="order-list-item-top-left fl">'+d.code+'</span>'+
                                    '<span class="order-list-item-top-right fr">'+base.formatDate(d.applyDatetime, "yyyy-MM-dd")+'</span>'+
                                '</div>'+
                                '<div class="order-list-item-center item">'+
                                '<a href="./order-hotel-detail.html?code='+d.code+'" class="wp100 show">'+
                                    '<div class="item-c-div item-l">'+
                                        '<img class="center-img" src="'+base.getImg(d.hotal.pic1)+'"/>'+
                                    '</div>'+
                                    '<div class="item-c">'+
                                        '<div class="item-c-top t_norwrap pr50">'+d.hotal.name+'</div>'+
                                        '<div class="item-c-center t_bbb t_norwrap">'+hhType[d.roomType]+'</div>'+
                                        '<div class="item-c-center t_bbb item-c-ctr">'+base.formatDate(d.startDate, 'MM月dd号')+
                                            ' - '+base.formatDate(d.endDate, 'MM月dd号')+'<span class="pl4">'+
                                            base.calculateDays(d.startDate, d.endDate)+'晚'+d.quantity+'间</span>'+
                                        '</div>'+
                                        '<div class="y-big1 mt4">¥'+base.formatMoney(d.amount)+'</div>'+
                                        '<div class="order-status">'+hotelOrderStatus[d.status]+'</div>'+
                                    '</div>'+
                                '</a></div>';
                                if(d.status == "1"){
                                    html += '<div class="order-oper-btns">'+
                                                '<input type="button" class="fr mlr10 item-order-btn item-pay-btn" value="付款"/>'+
                                                '<input type="button" class="fr ml10 item-order-btn od-cancel-order" value="取消订单"/>'+
                                            '</div>';
                                }else if(d.status == "2"){
                                    html += '<div class="order-oper-btns">'+
                                                '<input type="button" class="fr mlr10 item-order-btn od-tuik-btn" value="退款"/>'+
                                            '</div>';
                                }else if(d.status == "6"){
                                    html += '<div class="order-oper-btns">'+
                                                '<input type="button" class="fr mlr10 item-order-btn od-cancel-tuik-btn" value="撤回退款"/>'+
                                            '</div>';
                                }
                                html += '</div>';
                        });
                        $("#content").find(".order-list-content"+index)[(refresh || config1["first"+index]) ? "html" : "append"](html);
                        config[index].start++;
                    }else{
                        if(config1["first"+index] || refresh){
                            $("#content").find(".order-list-content"+index).html('<div class="item-error">暂时没有订单</div>');
                            base.hidePullUp();
                            res.msg && base.showMsg(res.msg);
                            config1["isEnd"+index] = true;
                        }
                    }
                    config1["first" + index] = false;
                    config1.isLoading = false;
                    loading.hideLoading();
                    myScroll.refresh();
                }, function(){
                    config1["first" + index] = false;
                    config1.isLoading = false;
                    $("#content").find(".order-list-content"+index).html('<div class="item-error">暂时没有订单</div>');
                    myScroll.refresh();
                    loading.hideLoading();
                });
        }
    }
    //分页查询线路订单
    function getPageLineOrderList(refresh){
        if( (!config1["isEnd"+index].isEnd || refresh) && !config1.isLoading ){
            config1.isLoading = true;
            if(refresh){
                config[index].start = 1;
                loading.showLoading();
            }
            return Ajax.get("618150", config[index], !refresh)
                .then(function (res) {
                    if(res.success && res.data.list.length){
                        var data = res.data.list;
                        if(data.length < config[index].limit){
                            config1["isEnd" + index] = true;
                            base.hidePullUp();
                        }else{
                            base.showPullUp();
                        }
                        var html = "";
                        $.each(data, function (i, d) {
                            html += '<div class="order-list-item" data-code="'+d.code+'">'+
                                '<div class="order-list-item-top">'+
                                    '<span class="order-list-item-top-left fl">'+d.code+'</span>'+
                                    '<span class="order-list-item-top-right fr">'+base.formatDate(d.applyDatetime, "yyyy-MM-dd")+'</span>'+
                                '</div>'+
                                '<div class="order-list-item-center item">'+
                                '<a href="./order-line-detail.html?code='+d.code+'" class="wp100 show">'+
                                    '<div class="item-c-div item-l">'+
                                        '<img class="center-img" src="'+base.getImg(d.line.pathPic)+'"/>'+
                                    '</div>'+
                                    '<div class="item-c">'+
                                        '<div class="item-c-top1 t_norwrap pr50">'+d.line.name+'</div>'+
                                        '<div class="y-big1 p-a-b-0">¥'+base.formatMoney(d.amount)+'</div>'+
                                        '<div class="order-status order-step-pay">'+lineOrderStatus[d.status]+'</div>'+
                                    '</div>'+
                                '</a></div>';
                                if(d.status == "1"){
                                    html += '<div class="order-oper-btns">'+
                                                '<input type="button" class="fr mlr10 item-order-btn item-pay-btn" value="付款"/>'+
                                                '<input type="button" class="fr ml10 item-order-btn od-cancel-order" value="取消订单"/>'+
                                            '</div>';
                                }else if(d.status == "2"){
                                    html += '<div class="order-oper-btns">'+
                                                '<input type="button" class="fr mlr10 item-order-btn od-tuik-btn" value="退款"/>'+
                                            '</div>';
                                }else if(d.status == "6"){
                                    html += '<div class="order-oper-btns">'+
                                                '<input type="button" class="fr mlr10 item-order-btn od-cancel-tuik-btn" value="撤回退款"/>'+
                                            '</div>';
                                }
                                html += '</div>';
                        });
                        $("#content").find(".order-list-content"+index)[(refresh || config1["first"+index]) ? "html" : "append"](html);
                        config[index].start++;
                    }else{
                        if(config1["first"+index] || refresh){
                            $("#content").find(".order-list-content"+index).html('<div class="item-error">暂时没有订单</div>');
                            base.hidePullUp();
                            res.msg && base.showMsg(res.msg);
                            config1["isEnd"+index] = true;
                        }
                    }
                    config1["first" + index] = false;
                    config1.isLoading = false;
                    loading.hideLoading();
                    myScroll.refresh();
                }, function(){
                    config1["first" + index] = false;
                    config1.isLoading = false;
                    $("#content").find(".order-list-content"+index).html('<div class="item-error">暂时没有订单</div>');
                    myScroll.refresh();
                    loading.hideLoading();
                });
        }
    }
    //分页查询专线订单
    function getPageSpecialLineOrderList(refresh){
        if( (!config1["isEnd"+index].isEnd || refresh) && !config1.isLoading ){
            config1.isLoading = true;
            if(refresh){
                config[index].start = 1;
                loading.showLoading();
            }
            return Ajax.get("618190", config[index], !refresh)
                .then(function (res) {
                    if(res.success && res.data.list.length){
                        var data = res.data.list;
                        if(data.length < config[index].limit){
                            config1["isEnd" + index] = true;
                            base.hidePullUp();
                        }else{
                            base.showPullUp();
                        }
                        var html = "";
                        $.each(data, function (i, d) {
                            html += '<div class="order-list-item" data-code="'+d.code+'">'+
                                '<div class="order-list-item-top">' +
                                    '<span class="order-list-item-top-left fl">'+d.code+'</span>'+
                                    '<span class="order-list-item-top-right fr">'+base.formatDate(d.applyDatetime, "yyyy-MM-dd")+'</span>'+
                                '</div>'+
                                '<div class="order-list-item-center item">'+
                                '<a href="./order-special-line-detail.html?code='+d.code+'" class="wp100 show">'+
                                    '<div class="item-c-div item-l">'+
                                        '<img class="center-img" src="'+base.getImg(d.specialLine.pic)+'"/>'+
                                    '</div>'+
                                    '<div class="item-c flex flex-dv flex-jb">'+
                                        '<div class="item-c-top t_norwrap pr50">'+ specialModule[d.specialLine.type]+'</div>'+
                                        '<div class="item-c-center t_bbb t_norwrap">上车地点：'+d.specialLine.address+'</div>'+
                                        '<div class="item-c-center t_bbb item-c-ctr c_f64444">发车时间：'+base.formatDate(d.specialLine.outDatetime, 'yyyy-MM-dd hh:mm')+'</span></div>'+
                                        '<div class="item-c-center t_bbb t_norwrap">票数：'+d.quantity+'张</div>'+
                                        '<div class="y-big1 p-a-r-b">¥'+base.formatMoney(d.amount)+'</div>'+
                                        '<div class="order-status">'+lineOrderStatus[d.status]+'</div>'+
                                    '</div>'+
                                '</a></div>';
                                if(d.status == "1"){
                                    html += '<div class="order-oper-btns">'+
                                                '<input type="button" class="fr mlr10 item-order-btn item-pay-btn" value="付款"/>'+
                                                '<input type="button" class="fr ml10 item-order-btn od-cancel-order" value="取消订单"/>'+
                                            '</div>';
                                }else if(d.status == "2"){
                                    html += '<div class="order-oper-btns">'+
                                                '<input type="button" class="fr mlr10 item-order-btn od-tuik-btn" value="退款"/>'+
                                            '</div>';
                                }else if(d.status == "6"){
                                    html += '<div class="order-oper-btns">'+
                                                '<input type="button" class="fr mlr10 item-order-btn od-cancel-tuik-btn" value="撤回退款"/>'+
                                            '</div>';
                                }
                                html += '</div>';
                        });
                        $("#content").find(".order-list-content"+index)[(refresh || config1["first"+index]) ? "html" : "append"](html);
                        config[index].start++;
                    }else{
                        if(config1["first"+index] || refresh){
                            $("#content").find(".order-list-content"+index).html('<div class="item-error">暂时没有订单</div>');
                            base.hidePullUp();
                            res.msg && base.showMsg(res.msg);
                            config1["isEnd"+index] = true;
                        }
                    }
                    config1["first" + index] = false;
                    config1.isLoading = false;
                    loading.hideLoading();
                    myScroll.refresh();
                }, function(){
                    config1["first" + index] = false;
                    config1.isLoading = false;
                    $("#content").find(".order-list-content"+index).html('<div class="item-error">暂时没有订单</div>');
                    myScroll.refresh();
                    loading.hideLoading();
                });
        }
    }

    function getStatusByIndex(idx){
        return idx == "0" ? "" : 
                    idx == "1" ? "1" : 
                        idx == "2" ? "2" : 
                            idx == "3" ? "7" : "";
    }
    function getIndexByStatus(status){
        return status == "" ? "0" : 
                    status == "1" ? "1" : 
                        status == "2" ? "2" : 
                            status == "7" ? "3" : "0";   
    }
    //显示取消订单弹开
    function showCancelOrTKModal(success, type){
        var str1 = type ? "请填写退款理由" : "请填写取消理由",
            str2 = type ? "退款理由中包含非法字符" : "取消理由中包含非法字符",
            title = type ? "退款申请" : "取消订单";

        var code = $(this).closest("[data-code]").attr("data-code");
        var d = dialog({
            title: title,
            content: '取消理由：<textarea id="cancelNote" class="dialog-textarea"></textarea>'+
                '<div class="tr t_fa5555 hidden dialog-error-tip dialog-error-tip0">'+str1+'</div>'+
                '<div class="tr t_fa5555 hidden dialog-error-tip dialog-error-tip1">'+str2+'</div>',
            ok: function (argument) {
                var remark = $(".dialog-textarea").val();
                if(!remark || remark.trim() == ""){
                    $(".dialog-error-tip0").removeClass("hidden");
                    $(".dialog-error-tip1").addClass("hidden");
                    return false;
                } else if(!base.isNotFace(remark)){
                    $(".dialog-error-tip0").addClass("hidden");
                    $(".dialog-error-tip1").removeClass("hidden");
                    return false;
                }
                success(code, remark);
            },
            okValue: '确定',
            cancel: function(){
                d.close().remove();
            },
            cancelValue: '取消'
        });
        d.showModal();
    }
    //取消订单、退款
    function cancelOrder(bizType, code, remark, success) {
        loading.createLoading("提交申请中...");
        Ajax.post(bizType, {
            json: {
                code: code,
                remark: remark,
                userId: base.getUserId()
            }
        }).then(function(res){
                if(res.success){
                    base.showMsg("申请提交成功");
                    loading.createLoading();
                    success(true);
                }else{
                    loading.hideLoading();
                    base.showMsg(res.msg || "申请失败");
                }
            }, function(){
                loading.hideLoading();
                base.showMsg("申请失败");
            });
    }
    function tuikcx(bizType, code, success) {
        base.confirm("确定撤销退款吗?")
            .then(function(){
                loading.createLoading("提交申请中...");
                Ajax.post(bizType, {
                    json: {
                        code: code,
                        userId: base.getUserId()
                    }
                }).then(function(res){
                    if(res.success){
                        base.showMsg("申请提交成功");
                        loading.createLoading();
                        success(true);
                    }else{
                        loading.hideLoading();
                        base.showMsg(res.msg || "申请失败");
                    }
                }, function(){
                    loading.hideLoading();
                    base.showMsg("申请失败");
                });
            });
    }
});