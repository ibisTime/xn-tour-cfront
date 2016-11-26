define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'Handlebars'
], function(base, Ajax, dialog, Handlebars) {
    var url = APIURL + '/user/queryAddresses',
        config = {
            "isDefault": ""
        },
        currentElem,
        code = base.getUrlParam("c"),
        type = base.getUrlParam("t") || 0,
        contentTmpl = __inline("../ui/address-items.handlebars");

    init();

    function init() {
        if (!base.isLogin()) {
            location.href = "../user/login.html?return=" + base.makeReturnUrl();
        } else {
            getAddressList();
            addListeners();
        }
    }

    function getAddressList() {
        Ajax.get(url, config)
            .then(function(response) {
                $("#loaddingIcon").addClass("hidden");
                if (response.success) {
                    var data = response.data,
                        html = "";
                    if (data.length) {
                        var html = contentTmpl({ items: data });
                        $("#addressDiv").append(html)
                            .find("a[code='" + code + "'] .radio-tip").addClass("active");
                    } else {
                        doError("#addressDiv", 1);
                    }
                } else {
                    doError("#addressDiv");
                }
            }, function() {
                $("#loaddingIcon").addClass("hidden");
                doError("#addressDiv");
            });
    }

    function addListeners() {
        $("#addressDiv").on("click", "a", function() {
            if (!type) {
                setDefaultAddress($(this));
            } else {
                location.href = "./add_address.html?return=" + base.makeReturnUrl() + "&c=" + $(this).attr("code");
            }
        });

        $("#addressDiv").on("touchstart", ".addr_div", function(e) {
            e.stopPropagation();
            var touches = e.originalEvent.targetTouches[0],
                me = $(this);
            var left = me.offset().left;
            me.data("x", touches.clientX);
            me.data("offsetLeft", left);
        });
        $("#addressDiv").on("touchmove", ".addr_div", function(e) {
            e.stopPropagation();
            var touches = e.originalEvent.changedTouches[0],
                me = $(this),
                ex = touches.clientX,
                xx = parseInt(me.data("x")) - ex,
                left = me.data("offsetLeft");
            if (xx > 10) {
                me.css({
                    "transition": "none",
                    "transform": "translate3d(" + (-xx / 2) + "px, 0px, 0px)"
                });
            } else if (xx < -10) {
                var left = me.data("offsetLeft");
                me.css({
                    "transition": "none",
                    "transform": "translate3d(" + (left + (-xx / 2)) + "px, 0px, 0px)"
                });
            }
        });
        $("#addressDiv").on("touchend", ".addr_div", function(e) {
            e.stopPropagation();
            var me = $(this);
            var touches = e.originalEvent.changedTouches[0],
                ex = touches.clientX,
                xx = parseInt(me.data("x")) - ex;
            if (xx > 56) {
                me.css({
                    "transition": "-webkit-transform 0.2s ease-in",
                    "transform": "translate3d(-56px, 0px, 0px)"
                });
            } else {
                me.css({
                    "transition": "-webkit-transform 0.2s ease-in",
                    "transform": "translate3d(0px, 0px, 0px)"
                });
            }
        });
        $("#addressDiv").on("click", ".al_addr_del", function(e) {
            e.stopPropagation();
            e.preventDefault();
            currentElem = $(this);
            $("#od-mask, #od-tipbox").removeClass("hidden");
        });

        $("#sbtn").on("click", function() {
            location.href = "./add_address.html?return=" + base.getReturnParam();
        });

        $("#odOk").on("click", function() {
            deleteAddress();
            $("#od-mask, #od-tipbox").addClass("hidden");
        });
        $("#odCel").on("click", function() {
            $("#od-mask, #od-tipbox").addClass("hidden");
        });
    }

    function setDefaultAddress(me) {
        $("#loaddingIcon").removeClass("hidden");
        var config = {
            "addressee": me.find(".a-addressee").text(),
            "mobile": me.find(".a-mobile").text(),
            "province": me.find(".a-province").text(),
            "city": me.find(".a-city").text(),
            "district": me.find(".a-district").text(),
            "detailAddress": me.find(".a-detailAddress").text(),
            "isDefault": "1",
            "code": me.attr("code")
        };
        Ajax.post(APIURL + "/user/edit/address", config)
            .then(function(response) {
                if (response.success) {
                    base.goBackUrl("../user/user_info.html");
                } else {
                    base.showMsg("非常抱歉，地址选择失败");
                    $("#loaddingIcon").addClass("hidden");
                }
            }, function() {
                base.showMsg("非常抱歉，地址选择失败");
                $("#loaddingIcon").addClass("hidden");
            });
    }

    function deleteAddress() {
        $("#loaddingIcon").removeClass("hidden");
        Ajax.post(APIURL + '/user/delete/address', { "code": currentElem.prev().find("a").attr("code") })
            .then(function(response) {
                $("#loaddingIcon").addClass("hidden");
                if (response.success) {
                    var addrD = $("#addressDiv");
                    if (addrD.children("div").length == 1) {
                        doError("#addressDiv", 1);
                    } else {
                        var $parent = currentElem.parent();

                        if (currentElem.prev().find(".radio-tip.active").length) {
                            if (!$parent.index()) {
                                $parent.next().find(".radio-tip").addClass("active");
                            } else {
                                addrD.children("div:first").find(".radio-tip").addClass("active");
                            }
                        }
                        $parent.remove();
                    }
                    base.showMsg('恭喜您，收货地址删除成功！');
                } else {
                    base.showMsg('很遗憾，收货地址删除失败！');
                }
            }, function() {
                $("#loaddingIcon").addClass("hidden");
                base.showMsg('很遗憾，收货地址删除失败！');
            });
    }

    function doError(cc, flag) {
        var msg = "暂时无法获取数据"
        if (flag) {
            msg = "暂时没有收货地址";
        }
        $(cc).replaceWith('<div class="bg_fff" style="text-align: center;line-height: 150px;">' + msg + '</div>');
    }
});