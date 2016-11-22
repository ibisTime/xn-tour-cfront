define([
    'app/controller/base',
    'app/util/ajax',
    'Handlebars',
    'lib/swiper-3.3.1.jquery.min'
], function(base, Ajax, Handlebars) {
    var mySwiper = new Swiper('.swiper-container', {
        'direction': 'horizontal',
        'loop': true,
        'autoplay': 2000,
        'autoplayDisableOnInteraction': false,
        // 如果需要分页器
        'pagination': '.swiper-pagination'
    });
    var template = __inline("../ui/index-imgs.handlebars"),
        items = {},
        COMPANYCODE = "",
        count = 2,
        types = {},
        modelList = {};

    init();

    function init() {
        if (COMPANYCODE = sessionStorage.getItem("compCode")) {
            getCategory();
            getBanner();
        } else {
            base.getCompanyByUrl()
                .then(function() {
                    if (COMPANYCODE = sessionStorage.getItem("compCode")) {
                        getCategory();
                        getBanner();
                    } else {
                        $("#cont").remove();
                        base.showMsg("非常抱歉，暂时无法获取公司信息!");
                    }
                });
        }
    }

    function getCategory() {
        Ajax.get(APIURL + "/commodity/category/list", {
            "companyCode": COMPANYCODE,
            "parentCode": "0"
        }).then(function(res) {
            if (res.success && res.data.length) {
                var data = res.data,
                    html = "";
                for (var i = 0; i < data.length; i++) {
                    if (!(i % 5)) {
                        if (i !== 0) {
                            html += '</div>'
                        }
                        html += '<div class="pt6 clearfix">';
                    }
                    html += '<div class="wp20 plr12 fl">' +
                        '<img src="' + data[i].pic + '">' +
                        '<div class="tc">' + data[i].name + '</div>' +
                        '</div>';
                }
                html += '</div>';
                $("#category").html(html);
            }
        });
    }

    function getRqtj() {
        var config = {
            "companyCode": COMPANYCODE,
            "location": "2",
            "start": 1,
            "limit": 4
        };
        Ajax.get(APIURL + "/commodity/product/page", config)
            .then(function(res) {
                if (res.success && res.data.list.length) {
                    var list = res.data.list,
                        html = '';
                    for (var i = 0; i < list.length; i++) {
                        html += '<div class="wp48 bg_fff display"><a href="../operator/buy.html?code=' + list[i].code + '">' +
                            '<img src="' + list[i].advPic + '">' +
                            '<div class="tc pt4">' + list[i].name + '</div>' +
                            '<div class="tc price s_13">￥' + (+list[i].discountPrice / 1000).toFixed(2) + '</div>' +
                            '</a></div>';
                    }
                    $("#cont1").html(html);
                } else {
                    doError("cont1", "暂无人气商品");
                }
            });
    }

    function getXpss() {
        var config = {
            "companyCode": COMPANYCODE,
            "location": "3",
            "start": 1,
            "limit": 4
        };
        Ajax.get(APIURL + "/commodity/product/page", config)
            .then(function(res) {
                if (res.success && res.data.list.length) {
                    var list = res.data.list,
                        html = '';
                    for (var i = 0; i < list.length; i++) {
                        html += '<div class="wp48 bg_fff display"><a href="../operator/buy.html?code=' + list[i].code + '">' +
                            '<img src="' + list[i].advPic + '">' +
                            '<div class="tc pt4">' + list[i].name + '</div>' +
                            '<div class="tc price s_13">￥' + (+list[i].discountPrice / 1000).toFixed(2) + '</div>' +
                            '</a></div>';
                    }
                    $("#cont2").html(html);
                } else {
                    doError("cont2", "暂无新品");
                }
            });
    }

    function getBanner() {
        base.getBanner(COMPANYCODE, "B_Mobile_SY_CSH")
            .then(function(res) {
                getRqtj();
                getXpss();
                if (res.success) {
                    var data = res.data,
                        html = "";
                    for (var i = 0; i < data.length; i++) {
                        html += '<div class="swiper-slide"><img class="wp100" src="' + data[i].pic + '"></div>';
                    }
                    if (data.length == 1) {
                        $("#swiper-pagination").remove();
                    }
                    $("#swr").html(html);
                    swiperImg();
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

    function doError(id, msg) {
        $("#" + id).html('<div class="bg_fff" style="text-align: center;line-height: 150px;">' + msg + '</div>');
    }

    function doSuccess() {
        var data = [];
        for (var name in items) {
            if (modelList[name]) {
                items[name].price = modelList[name].toFixed(2);
                data.push(items[name]);
            }
        }
        var content = template({ items: data });
        $("#cont").replaceWith(content);
    }
});