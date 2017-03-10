define([
    'app/controller/base',
    'app/util/ajax',
    'swiper',
    'app/module/showImg/showImg',
    'app/module/loading/loading',
    'app/module/addSub/addSub'
], function(base, Ajax, Swiper, showImg, loading, addSub) {
    var code = base.getUrlParam("code"),
        price, kucun = 0;
    var pic_suffix = '?imageMogr2/auto-orient/thumbnail/!375x180r';
    init();

    function init() {
        if (!code) {
            base.showMsg("未传入商品编号");
            return;
        }
        loading.createLoading();
        addListener();
        initSwiper();
        if (base.isLogin()) {
            $.when(
                getDetail(),
                getTotalCartItem()
            ).then(function() {
                loading.hideLoading();
            }, function() {
                loading.hideLoading();
            })
        } else {
            getDetail()
                .then(function() {
                    loading.hideLoading();
                }, function() {
                    loading.hideLoading();
                });
        }
    }
    /*
     * 获取购物车商品总数
     * @param refresh 是否重新从服务器获取
     */
    function getTotalCartItem(refresh) {
        return Ajax.get("618441", {
            userId: base.getUserId()
        }, !refresh).then(function(res) {
            if (res.success) {
                var len = +res.data.length;
                if (len > 99) {
                    len = "99+";
                }
                $("#count").removeClass("hidden").html(len);
            }
        });
    }

    function initSwiper() {
        new Swiper('#swiper', {
            'direction': 'horizontal',
            'autoplay': 4000,
            'autoplayDisableOnInteraction': false,
            'pagination': '.swiper-pagination',
            'paginationType': 'custom',
            'paginationCustomRender': function(swiper, current, total) {
                return current + '/' + total;
            }
        });
    }

    function addListener() {
        $("#swiper").on("click", ".swiper-slide .center-img", function() {
            showImg.createImg($(this).attr("src")).showImg();
        });
        $("#kefuIcon").on("click", function(e) {
            location.href = "http://kefu.easemob.com/webim/im.html?tenantId=" + TENANTID;
        });
        $("#cartIcon").on("click", function() {
            location.href = "./cart.html";
        });
        $("#buyBtn").on("click", function() {
            if (!base.isLogin()) {
                base.goLogin();
                return;
            }
            var quantity = +$("#quantity").val();
            if(quantity > kucun){
                base.showMsg("库存不足");
                return;
            }
            location.href = "./submit-order.html?code=" + code + "&q=" + quantity;
        });

        $("#addCartBtn").on("click", function() {
            if (!base.isLogin()) {
                base.goLogin();
                return;
            }
            addCart();
        })

        addSub.createByEle({
            sub: $("#subBtn"),
            add: $("#addBtn"),
            input: $("#quantity"),
            changeFn: function() {
                // $("#totalAmount").text(base.fZMoney(price * +$(this).val()));
            }
        });
    }

    function addCart() {
        loading.createLoading("加入中...");
        Ajax.post("618430", {
            json: {
                userId: base.getUserId(),
                productCode: code,
                quantity: $("#quantity").val() || 1
            }
        }).then(function(res) {
            if (res.success) {
                getTotalCartItem(true)
                    .then(function(){
                        loading.hideLoading();
                        base.showMsg("添加购物车成功", 1000);
                    }, function(){
                        loading.hideLoading();
                        base.showMsg("添加购物车成功", 1000);
                    });
            } else {
                base.showMsg(res.msg);
            }
        }, function() {
            base.showMsg("商品添加失败");
        })
    }

    function getDetail() {
        return Ajax.get("618422", {
            code: code
        }).then(function(res) {
            if (res.success) {
                var data = res.data.product;
                var pic = data.pic1.split(/\|\|/),
                    html = "";
                $.each(pic, function(i, p) {
                    html += '<div class="swiper-slide"><img class="wp100 center-img" src="' + base.getPic(p, pic_suffix) + '"></div>'
                });
                price = data.price1;
                $("#swiper").find(".swiper-wrapper").html(html);

                initSwiper();

                $("#description").html(data.description);
                $("#price").text(base.fZeroMoney(price));
                $("#name").text(data.name);
                kucun = +data.quantity;
                $("#kcSpan").text(kucun);
            } else {
                base.showMsg(res.msg);
            }
        }, function() {
            base.showMsg("加载失败");
        })
    }
});
