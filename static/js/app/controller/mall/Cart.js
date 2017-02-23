define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/moveDelete/moveDelete',
    'app/module/addSub/addSub'
], function(base, Ajax, moveDelete, addSub) {
    var infos = [];
    init();

    function init() {
        if (!base.isLogin()) {
            base.goLogin();
            return;
        } else {
            getMyCart();
            addListeners();
        }
    }
    //获取购物车商品
    function getMyCart() {
        infos = [];
        Ajax.get("618441", {
            userId: base.getUserId()
        })
            .then(function(response) {
                if (response.success) {
                    var data = response.data,
                        html = "";
                    if (data.length) {
                        html = '<ul class="b_bd_b bg_fff">';
                        data.forEach(function(cl) {
                            var amount = (+cl.price1) * (+cl.quantity);
                            html += '<li class="clearfix b-b-e9 p_r cart-li" code="' + cl.code + '" cnyP="' + (cl.price1 || 0) + '">' +
                                '<div class="wp100 p_r z_index0">' +
                                '<div class="clearfix bg_fff cart-content-left">'+
                                '<div class="w130p tc  p_r c-img-l">' +
                                    '<div class="cart-li-left-chose-wrap cart-cont-left"><div class="inline_block cart-check-btn radio-tip1"></div></div>';
                                    // '<div class="cart-cont-left"><div class="radio-tip1 ab_l0"><i></i></div></div>' +
                                    // '<a href="./buy.html?code=' + cl.productCode + '">';
                            cl.advPic = cl.advPic.split(/\|\|/)[0];
                            html += '<div class="cart-li-left-img-wrap"><img class="center-img" src="' + base.getImg(cl.advPic) + '"/></div>'+
                                    // '</a>'+
                                    '</div>' +
                                '<div class="cart-li-right-wrap"><div class="hp100 flex flex-jb flex-dv">' +
                                '<p class="c-59 fs14">' + cl.productName + '</p>' +
                                '<p class="y-small"><span>￥' + (+cl.price1 / 1000).toFixed(2) + '</span></p>';
                            html += '<div class="t_666 cart-li-bottom">' +
                                '<span class="subCount a_s_span t_bold tc"><img src="/static/images/sub-btn-icon.png" class="cart-as-btn"/></span>' +
                                '<input type="hidden" value="' + (+cl.quantity) + '"/>' +
                                '<input class="buyCount tc" type="text" value="' + cl.quantity + '"/>' +
                                '<span class="addCount a_s_span t_bold tc"><img src="/static/images/add-btn-icon.png" class="cart-as-btn"/></span>' +
                                '</div></div></div></div>' +
                                '<div class="al_addr_del">删除</div></div></li>';
                            //保存每种商品当前的总价
                            infos.push(amount);
                        });
                        html += "</ul>";
                        $("#od-ul").html(html);
                        $("#totalAmount").html("0");
                    } else {
                        doError();
                    }
                } else {
                    doError();
                }
            }, function() {
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
                location.href = '../operator/submit_order.html?code=' + checkItem.join("_") + '&type=2';
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
                $("#loaddingIcon").removeClass("hidden");
                var me = this;
                Ajax.post("618433", { json: config })
                    .then(function(response) {
                        $("#loaddingIcon").addClass("hidden");
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
                                ori_cnyTotal = +$("#totalAmount").text() * 1000,
                                //已经勾选的商品最新的人民币总价
                                new_cnyTotal = new_cnyAmount - ori_cnyAmount + ori_cnyTotal;
                            //更新当前商品的总价
                            infos[gp.index()] = new_cnyAmount;
                            //保存当前商品最新的数量
                            $prev.val(count);
                            //如果当前商品处于被勾选的状态，则更新页面底部的总价
                            if (flag) {
                                $("#totalAmount").text((new_cnyTotal / 1000).toFixed(2));
                            }
                        } else {
                            me.value = $(me).prev().val();
                            base.showMsg("数量修改失败，请稍后重试！");
                        }
                    }, function() {
                        $("#loaddingIcon").addClass("hidden");
                        me.value = $(me).prev().val();
                        base.showMsg("数量修改失败，请稍后重试！");
                    });
            }
        });
        // moveDelete.init("od-ul", "cart-content-left");
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
                $("#totalAmount").text((t / 1000).toFixed(2));
                //否则把页面底部总价置为0
            } else {
                $("#totalAmount").text("0");
            }
        });
        $("#od-ul").on("click", "li", function () {
            location.href = "../index.html";
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
                var ori_cnyTotal = (+$("#totalAmount").text()) * 1000;
                $("#totalAmount").text(((ori_cnyTotal + infos[$li.index()]) / 1000).toFixed(2));
            } else {
                $("#allChecked").removeClass("active");
                var ori_cnyTotal = (+$("#totalAmount").text()) * 1000;
                $("#totalAmount").text(((ori_cnyTotal - infos[$li.index()]) / 1000).toFixed(0));
            }
        });
        // //确认删除框点击确认按钮
        // $("#odOk").on("click", function() {
        //     deleteFromCart($this);
        //     $("#od-mask, #od-tipbox").addClass("hidden");
        // });
        // //确认删除框点击取消按钮
        // $("#odCel").on("click", function() {
        //     $("#od-mask, #od-tipbox").addClass("hidden");
        // });
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
            // $("#od-mask, #od-tipbox").removeClass("hidden");
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
        $("#loaddingIcon").removeClass("hidden");
        Ajax.post("618431", {
                json: { "code": code }
            })
            .then(function(response) {
                $("#loaddingIcon").addClass("hidden");
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
                $("#loaddingIcon").addClass("hidden");
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
});