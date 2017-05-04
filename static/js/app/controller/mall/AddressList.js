define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/handlebarsHelpers',
    'app/module/moveDelete/moveDelete',
    'app/module/loading/loading'
], function(base, Ajax, Handlebars, moveDelete, loading) {
    var config = {
            "isDefault": "",
            "userId": base.getUserId()
        },
        currentElem,
        code = base.getUrlParam("c"),
        type = base.getUrlParam("t") || 0,
        contentTmpl = __inline("../../ui/address-items.handlebars");

    init();

    function init() {
        if (!base.isLogin()) {
            base.goLogin();
            return;
        } else {
            getAddressList();
            addListeners();
        }
    }

    function getAddressList() {
        loading.createLoading();
        Ajax.get("805165", config)
            .then(function(response) {
                loading.hideLoading();
                if (response.success) {
                    var data = response.data;
                    if (data.length) {
                        $("#addressDiv").append(contentTmpl({ items: data }))
                            .find("a[code='" + code + "'] .radio-tip").addClass("active");
                    } else {
                        doError("#addressDiv", 1);
                    }
                } else {
                    doError("#addressDiv");
                }
            }, function() {
                loading.hideLoading();
                doError("#addressDiv");
            });
    }

    function addListeners() {
        $("#addressDiv").on("click", "a", function() {
            if (type == 0) {
                setDefaultAddress($(this));
            } else {
                location.href = "./add-address.html?return=" + base.makeReturnUrl() + "&c=" + $(this).attr("code") + "&t=" + type;
            }
        });
        moveDelete.init("addressDiv", "addr_div");
        $("#addressDiv").on("click", ".al_addr_del", function(e) {
            e.stopPropagation();
            e.preventDefault();
            currentElem = $(this);
            base.confirm('确定要删除该地址吗？')
                .then(deleteAddress);
        });

        $("#sbtn").on("click", function() {
            location.href = "./add-address.html?return=" + base.getReturnParam() + "&t=" + type;
        });
    }

    function setDefaultAddress(me) {
        loading.createLoading("设置中...");
        var config = {
            "addressee": me.find(".a-addressee").text(),
            "mobile": me.find(".a-mobile").text(),
            "province": me.find(".a-province").text(),
            "city": me.find(".a-city").text(),
            "district": me.find(".a-district").text(),
            "detailAddress": me.find(".a-detailAddress").text(),
            "isDefault": "1",
            "code": me.attr("code"),
            "userId": base.getUserId()
        };
        Ajax.post("805162", { json: config })
            .then(function(response) {
                loading.hideLoading();
                if (response.success) {
                    base.goBackUrl("../user/user.html");
                } else {
                    base.showMsg("非常抱歉，地址选择失败");
                    $("#loaddingIcon").addClass("hidden");
                }
            }, function() {
                base.showMsg("非常抱歉，地址选择失败");
                loading.hideLoading();
            });
    }

    function deleteAddress() {
        loading.createLoading("删除中...");
        Ajax.post('805161', {
                json: {
                    "code": currentElem.prev().find("a").attr("code"),
                    "userId": base.getUserId()
                }
            })
            .then(function(response) {
                loading.hideLoading();
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
                    base.showMsg(response.msg || '很遗憾，收货地址删除失败！');
                }
            }, function() {
                loading.hideLoading();
                base.showMsg('很遗憾，收货地址删除失败！');
            });
    }

    function doError(cc, flag) {
        var msg = flag ? "暂时没有收货地址" : "暂时无法获取数据";
        $(cc).replaceWith('<div class="item-error">'+msg+'</div>');
    }
});
