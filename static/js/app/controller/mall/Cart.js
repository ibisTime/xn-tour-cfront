define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/moveDelete/moveDelete',
    'app/module/addSub/addSub',
    'app/module/loading/loading',
    'app/util/handlebarsHelpers'
], function(base, Ajax, moveDelete, addSub, loading, Handlebars) {
    var infos = [];
    var tmpl = __inline("../../ui/cart-items.handlebars");
    init();

    function init() {
        $("#goLogin").on("click", function () {
            base.goLogin();
        });
        if (!base.isLogin()) {
            base.goLogin();
            doLoginError();
            return;
        }
        getMyCart();
        addListeners();
        $("#totalAmount").data("amount", 0);
    }
    //获取购物车商品
    function getMyCart() {
        loading.createLoading();
        infos = [];
        Ajax.get("618441", {
            userId: base.getUserId()
        })
            .then(function(response) {
                loading.hideLoading();
                if (response.success && response.data.length) {
                    response.data.forEach(function(cl) {
                        infos.push((+cl.price1) * (+cl.quantity));
                    });
                    $("#od-ul").html(tmpl({items: response.data}));
                } else {
                    doError();
                }
            }, function() {
                loading.hideLoading();
                doError();
            });
    }

    function addListeners() {
        //购买
        $("#sbtn").on("click", function() {
            var checkItem = [];
            var allItems = $("#od-ul>ul>li div.c-img-l div.radio-tip1");
            for (var i = 0; i < allItems.length; i++) {
                var item = allItems[i];
                if ($(item).hasClass("active")) {
                    if (!$(item).closest("li[code]").find("div.cart-down").length) {
                        checkItem.push(i);
                    //如果包含下架商品
                    } else {
                        base.showMsg("您所选择的商品中包含已经下架的商品，<br/>请重新选择！", 2000);
                        return;
                    }
                }
            }
            if (checkItem.length) {
                location.href = './submit-order.html?code=' + checkItem.join("_") + '&type=2';
            } else {
                base.showMsg("未选择购买的商品");
            }
        });
        addSub.createInList({
            wrap: $("#od-ul"),
            add: ".addCount",
            sub: ".subCount",
            input: ".buyCount",
            changeFn: function () {
                var gp = $(this).parents("li[code]"),
                    cnyPrice = +gp.attr("cnyP");
                var config = {
                    "code": gp.attr("code"),
                    "quantity": this.value
                };
                //修改购物车商品信息
                loading.createLoading("修改中...");
                var me = this;
                Ajax.post("618433", { json: config })
                    .then(function(response) {
                        loading.hideLoading();
                        if (response.success) {
                            var flag = gp.find(".c-img-l .radio-tip1.active").length,
                                $prev = $(me).prev(),
                                count = me.value,
                                cnyUnit = cnyPrice,
                                //当前商品最新人民币总价
                                new_cnyAmount = cnyUnit * (+count),
                                info = infos[gp.index()],
                                //当前商品老的人民币总价
                                ori_cnyAmount = info,
                                //已经勾选的商品老的人民币总价
                                // ori_cnyTotal = +$("#totalAmount").text() * 1000,
                                ori_cnyTotal = $("#totalAmount").data("amount"),
                                //已经勾选的商品最新的人民币总价
                                new_cnyTotal = new_cnyAmount - ori_cnyAmount + ori_cnyTotal;
                            //更新当前商品的总价
                            infos[gp.index()] = new_cnyAmount;
                            //保存当前商品最新的数量
                            $prev.val(count);
                            //如果当前商品处于被勾选的状态，则更新页面底部的总价
                            if (flag) {
                                $("#totalAmount").data("amount", new_cnyTotal).text(base.fZeroMoney(new_cnyTotal));
                            }
                        } else {
                            me.value = $(me).prev().val();
                            base.showMsg("数量修改失败，请稍后重试！");
                        }
                    }, function() {
                        loading.hideLoading();
                        me.value = $(me).prev().val();
                        base.showMsg("数量修改失败，请稍后重试！");
                    });
            }
        });
        /********监测数量输入框的变化end*******/
        //全选按钮
        $("#allChecked").on("click", function() {
            var flag = false,
                me = $(this),
                doAction = "removeClass";
            if (me.hasClass("active")) {
                me.removeClass("active");
            } else {
                me.addClass("active");
                flag = true;
                doAction = "addClass";
            }
            //点击全选后，每种商品前面的勾选框也相应变化
            $("#od-ul>ul>li div.c-img-l div.radio-tip1")
                .each(function(i, item) {
                    $(item)[doAction]("active");
                });
            //如果目前处于全选状态，则更新页面底部的总价
            if (flag) {
                var t = 0;
                for (var i = 0; i < infos.length; i++) {
                    t += infos[i];
                }
                $("#totalAmount").data("amount", t).text(base.fZeroMoney(t));
                //否则把页面底部总价置为0
            } else {
                $("#totalAmount").data("amount", "0").text("0");
            }
        });
        $("#od-ul").on("click", "li", function () {
            location.href = "../mall/buy.html?code=" + $(this).attr("pcode");
        }).on("click", ".cart-li-bottom", function (e) {
            e.stopPropagation();
        })
        //勾选商品
        $("#od-ul").on("click", ".cart-cont-left", function(e) {
            e.stopPropagation();
            var $li = $(this).closest("li[code]"),
                isChecked = false,
                me = $(this).find(".radio-tip1");
            if (me.hasClass("active")) {
                me.removeClass("active");
            } else {
                me.addClass("active");
                isChecked = true;
            }

            if (isChecked) {
                if ($("#od-ul>ul>li").length == $("#od-ul>ul>li .c-img-l div.active").length) {
                    $("#allChecked").addClass("active");
                }
                var ori_cnyTotal = +$("#totalAmount").data("amount");
                var new_amount = ori_cnyTotal + infos[$li.index()];
                $("#totalAmount").data("amount", new_amount).text(base.fZeroMoney(new_amount));
            } else {
                $("#allChecked").removeClass("active");
                var ori_cnyTotal = +$("#totalAmount").data("amount");
                var new_amount = ori_cnyTotal - infos[$li.index()];
                $("#totalAmount").data("amount", new_amount).text(base.fZeroMoney(new_amount));
            }
        });
        //左滑显示删除按钮事件
        moveDelete.init("od-ul", "cart-content-left");
        //左滑后删除商品
        $("#od-ul").on("click", ".al_addr_del", function(e) {
            e.stopPropagation();
            var that = this;
            base.confirm("确定删除商品吗？")
                .then(function () {
                    deleteFromCart(that);
                })
        });
    }

    function isNumber(code) {
        if (code >= 48 && code <= 57 || code >= 96 && code <= 105) {
            return true;
        }
        return false;
    }

    function deleteFromCart(me) {
        var $li = $(me).closest("li[code]"),
            code = $li.attr('code');
        loading.createLoading("删除中...");
        Ajax.post("618432", {
                json: { "cartCodeList": [code] }
            })
            .then(function(response) {
                loading.hideLoading();
                if (response.success) {
                    var ccl = $(me).prev().find(".cart-cont-left"),
                        activeRadio = ccl.find(".radio-tip1.active");
                    if (activeRadio.length) {
                        activeRadio.click();
                    }
                    infos.splice($li.index(), 1);
                    $li.remove();
                    if (!$("#od-ul>ul>li").length) {
                        doError();
                    }
                } else {
                    base.showMsg("删除失败，请稍后重试！");
                }
            }, function() {
                loading.hideLoading();
                base.showMsg("删除失败，请稍后重试！");
            });
    }

    function isSpecialCode(code) {
        if (code == 37 || code == 39 || code == 8 || code == 46) {
            return true;
        }
        return false;
    }

    function doError() {
        $("#cart-bottom").hide();
        $("#cont").addClass("hidden");
        $("#noItem").removeClass("hidden");
    }
    function doLoginError() {
        $("#cart-bottom").hide();
        $("#cont").addClass("hidden");
        $("#noLogin").removeClass("hidden");
    }
});
