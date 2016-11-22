define([
    'app/controller/base',
    'app/util/ajax',
    'lib/swiper-3.3.1.jquery.min'
], function(base, Ajax, Swiper) {
    var mySwiper, rspData = [],
        code = base.getUrlParam("code") || "",
        user;
    init();

    function init() {
        getProduct();
    }

    function getProduct() {
        Ajax.get(APIURL + '/commodity/product/info', {
                code: code
            }, true)
            .then(function(res) {
                if (res.success) {
                    var data = res.data,
                        imgs_html = "";
                    var $swiper = $("#btlImgs");
                    imgs_html = '<div class="swiper-slide tc"><img src="' + data.pic1 + '"></div>' +
                        '<div class="swiper-slide tc"><img src="' + data.pic2 + '"></div>' +
                        '<div class="swiper-slide tc"><img src="' + data.pic3 + '"></div>' +
                        '<div class="swiper-slide tc"><img src="' + data.pic4 + '"></div>';
                    $swiper.html(imgs_html);
                    swiperImg();
                    $("#btr-name").text(data.name);
                    $("#btr-advTitle").text(data.advTitle);
                    $("#description").html(data.description);
                    $("#unit-price").val(data.discountPrice);
                    $("#btr-price").text("￥" + (+data.discountPrice / 1000).toFixed(2));
                    $("#buyBtn").click(function() {
                        if (!$(this).hasClass("no-buy-btn")) {
                            location.href = "./submit_order.html?code=" + code + "&q=" + $("#buyCount").val();
                        }
                    });
                    $("#addCartBtn").click(function() {
                        if (!$(this).hasClass("no-buy-btn")) {
                            add2Cart();
                        }
                    });
                    addListeners();
                    $("#cont").remove();
                } else {
                    doError();
                }
            });
    }

    function swiperImg() {
        var mySwiper = new Swiper('.swiper-container', {
            direction: 'horizontal',
            autoplay: 2000,
            autoplayDisableOnInteraction: false,
            // 如果需要分页器
            pagination: '.swiper-pagination'
        });
    }

    function addListeners() {
        $("#subCount").on("click", function() {
            var orig = $("#buyCount").val();
            if (orig == undefined || orig.trim() == "" || orig == "0" || orig == "1") {
                orig = 2;
            }
            orig = +orig - 1;
            $("#buyCount").val(orig);
            $("#buyCount").change();
        });
        $("#addCount").on("click", function() {
            var orig = $("#buyCount").val();
            if (orig == undefined || orig.trim() == "") {
                orig = 0;
            }
            orig = +orig + 1;
            $("#buyCount").val(orig);
            $("#buyCount").change();
        });
        $("#buyCount").on("keyup", function(e) {
            var keyCode = e.charCode || e.keyCode;
            if (!isSpecialCode(keyCode) && !isNumber(keyCode)) {
                this.value = this.value.replace(/[^\d]/g, "");
            }
        }).on("change", function(e) {
            var keyCode = e.charCode || e.keyCode;
            if (!isSpecialCode(keyCode) && !isNumber(keyCode)) {
                this.value = this.value.replace(/[^\d]/g, "");
            }
            if (!$(this).val()) {
                this.value = "1";
            }
            if ($(this).val() == "0") {
                this.value = "1";
            }
            var unitPrice = +$("#unit-price").val();
            $("#btr-price").text("￥" + (unitPrice * +$(this).val() / 1000).toFixed(2));
        });
    }

    function isNumber(code) {
        if (code >= 48 && code <= 57 || code >= 96 && code <= 105) {
            return true;
        }
        return false;
    }

    function isSpecialCode(code) {
        if (code == 37 || code == 39 || code == 8 || code == 46) {
            return true;
        }
        return false;
    }

    function add2Cart() {
        if (base.isLogin()) {
            a2cart();
        } else {
            location.href = "../user/login.html?return=" + base.makeReturnUrl();
        }
    }

    function a2cart() {
        var config = {
                productCode: code,
                quantity: $("#buyCount").val()
            },
            url = APIURL + '/operators/add2Cart';
        Ajax.post(url, config)
            .then(function(response) {
                var msg;
                if (response.success) {
                    msg = "添加购物车成功!";
                } else {
                    msg = "添加购物车失败!";
                }
                base.showMsg(msg);
            });
    }
});