define([
    'app/controller/base',
    'app/util/ajax',
    'iScroll',
    'app/util/handlebarsHelpers',
    'app/module/loading/loading',
    'app/util/dict'
], function(base, Ajax, iScroll, Handlebars, loading, Dict) {

    var userId = base.getUserId();
    var kind = base.getUrlParam("k") || 0; //0金额，1积分

    var myScroll,
        isEnd = false,
        isLoading = false,
        innerScroll;

    var integralTmpl = __inline("../../ui/integral.handlebars");
    var config = {
        currency: (kind == "1"
            ? "XNB"
            : "CNY"),
        start: 1,
        limit: 15,
        status: "effect_all"
    };

    var accountFlowStatus = {};
    // var accountFlowStatus = Dict.get("accountFlowStatus");

    init();

    function init() {
        initIScroll();
        Handlebars.registerHelper('formatAmount', function(num, options) {
            if (!num && num !== 0)
                return "--";
            num = +num / 1000;
            num = (num+"").replace(/^(-?\d+\.\d\d)\d*/i, "$1");
            num = +num;
            return num > 0 ? "+" + (num.toFixed(2)) : num.toFixed(2);
        });
        getInitData();
    }

    function getInitData() {

        loading.createLoading();
        $.when(base.getDictList("biz_type"), Ajax.get("802503", {"userId": userId})).then(function(res0, res) {
            loading.hideLoading();
            if (res0.success && res.success) {
                $.each(res0.data, function(i, d) {
                    accountFlowStatus[d.dkey] = d.dvalue;
                });
                Handlebars.registerHelper('formatintegralStatus', function(text, places, options) {
                    return accountFlowStatus[text];
                });
                var amount = "--";
                $.each(res.data, function(i, d) {
                    if (d.currency == config.currency) {
                        amount = base.formatMoney(d.amount);
                        config.accountNumber = d.accountNumber;
                        if (kind == 1) {
                            $("#balance").html("积分余额：" + amount);
                        } else {
                            $("#balance").html("账户余额：¥" + amount);
                        }
                    }
                });
                getPageintegral(true);
            } else {
                base.showMsg(res0.msg || res.msg);
            }
        }, function() {
            base.showMsg("账户信息获取失败");
            loading.hideLoading();
        });
    }

    function initIScroll() {
        var pullDownEl,
            $pullDownEl;
        var pullDownOffset; //设置iScroll已经滚动的基准值

        function pullDownAction() {
            isEnd = false;
            getPageintegral(true);
        }

        $pullDownEl = $("#pullDown");
        pullDownEl = $pullDownEl[0];
        pullDownOffset = pullDownEl.offsetHeight;
        $pullUpEl = $("#pullUp");

        myScroll = new iScroll('wrapper', {
            useTransition: false,
            topOffset: pullDownOffset,
            onRefresh: function() {
                if ($pullDownEl.hasClass('scroll-loading')) {
                    $pullDownEl.removeClass('scroll-loading flip');
                } else if ($pullUpEl.hasClass('scroll-loading')) {
                    $pullUpEl.removeClass('scroll-loading flip');
                }
            },
            onScrollMove: function() {
                if (this.y > 5 && !$pullDownEl.hasClass("flip")) {
                    $pullDownEl.addClass("flip");
                    this.minScrollY = 0;
                } else if (this.y < 5 && $pullDownEl.hasClass("flip")) {
                    $pullDownEl.removeClass("flip");
                    this.minScrollY = -pullDownOffset;
                } else if (this.y < (this.maxScrollY - 5) && !$pullUpEl.hasClass('flip')) {
                    $pullUpEl.addClass('flip');
                    // pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
                    this.maxScrollY = this.maxScrollY;
                } else if (this.y > (this.maxScrollY + 5) && $pullUpEl.hasClass('flip')) {
                    $pullUpEl.removeClass("flip");
                    this.maxScrollY = pullDownOffset;
                }
            },
            onScrollEnd: function() {
                if ($pullDownEl.hasClass("flip")) {
                    $pullDownEl.addClass("scroll-loading");
                    pullDownAction();
                } else if ($pullUpEl.hasClass('flip')) {
                    $pullUpEl.addClass('scroll-loading');
                    getPageintegral();
                }
            }
        });

    }

    function getPageintegral(refresh) {
        if (!isLoading && (!isEnd || refresh)) {
            config.start = refresh && 1 || config.start;
            isLoading = true;
            base.showPullUp();

            return Ajax.get("802520", config, !refresh).then(function(res) {
                if (res.success && res.data.list.length) {
                    var list = res.data.list;
                    if (list.length < config.limit) {
                        isEnd = true;
                    }
                    $("#integralWrap")[refresh
                            ? "html"
                            : "append"](integralTmpl({items: list}));
                    config.start++;
                } else {
                    if (refresh) {
                        $("#integralWrap").html('<div class="item-error">暂无相关数据</div>');
                    }
                    isEnd = true;
                    res.msg && base.showMsg(res.msg);
                }
                base.hidePullUp();
                myScroll.refresh();
                isLoading = false;
            }, function() {
                isLoading = false;
                isEnd = true;
                base.hidePullUp();
            });
        }
    }

});
