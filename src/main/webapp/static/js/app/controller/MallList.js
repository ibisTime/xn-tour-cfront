define([
    'app/controller/base',
    'app/util/ajax',
    'IScroll'
], function(base, Ajax, IScroll) {
    var first = true,
        COMPANYCODE = "",
        bigCode = base.getUrlParam("b") || "",
        smallCode = "",
        start = 1,
        limit = 10,
        seqArr = [],
        D2XArr = [],
        canScrolling = false,
        width = ($(window).width() - 32) / 100 * 48 + "px",
        myScroll;
    init();

    function init() {
        if (COMPANYCODE = sessionStorage.getItem("compCode")) {
            addListeners();
            getCategory();
        } else {
            base.getCompanyByUrl()
                .then(function() {
                    if (COMPANYCODE = sessionStorage.getItem("compCode")) {
                        addListeners();
                        getCategory();
                    } else {
                        base.showMsg("非常抱歉，暂时无法获取公司信息!");
                    }
                });
        }
    }

    function getCategory() {
        Ajax.get(APIURL + "/commodity/category/list", {
            "companyCode": COMPANYCODE
        }).then(function(res) {
            if (res.success && res.data.length) {
                var data = res.data;

                for (var i = 0; i < data.length; i++) {
                    var d = data[i];
                    if (d.parentCode == "0") {
                        if (!D2XArr[d.code]) {
                            D2XArr[d.code] = [];
                        }
                        seqArr.push(d);
                    } else {
                        if (!D2XArr[d.parentCode] || !D2XArr[d.parentCode].length) {
                            D2XArr[d.parentCode] = [];
                        }
                        D2XArr[d.parentCode].push(d);
                    }
                }
                var html = "";
                for (var j = 0; j < seqArr.length; j++) {
                    html += '<li code="' + seqArr[j].code + '">' + seqArr[j].name + '</li>';
                }
                var nowSmallArr = [];
                if (bigCode == "") {
                    bigCode = seqArr[0].code;
                }
                var scroller = $("#scroller");
                scroller.find("ul").html(html);
                addCategory();
                //click
                scroller.find("ul>li[code='" + bigCode + "']").click();
            } else {
                doError();
                $("header").hide();
            }
        })
    }

    function addSmallCont(code) {
        var scroller = $("#scroller"),
            nowSmallArr = D2XArr[bigCode],
            smallCont = $("#smallCont"),
            sHtml = "";
        for (var j = 0; j < nowSmallArr.length; j++) {
            if (!j) {
                sHtml += '<a class="mb10 subclass" href="javascript:void(0)" code="' + nowSmallArr[j].code + '"><span class="s_11 ptb4 plr12">' + nowSmallArr[j].name + '</span></a>';
            } else {
                sHtml += '<a class="mb10" href="javascript:void(0)" code="' + nowSmallArr[j].code + '"><span class="s_11 ptb4 plr12">' + nowSmallArr[j].name + '</span></a>';
            }
        }
        smallCont.html(sHtml);
        smallCode = nowSmallArr[0] && nowSmallArr[0].code;
        var time = setInterval(function() {
            if (scroller.css("transform") != "none") {
                if ((sHtml && smallCont.find("a").length) || !sHtml) {
                    clearInterval(time);
                    $("#mtop").css("height", $("header").height());
                }
            }
        }, 100);
    }

    function addCategory() {
        var scroller = $("#scroller");
        var lis = scroller.find("ul li");
        for (var i = 0, width = 0; i < lis.length; i++) {
            width += $(lis[i]).width() + 20;
        }
        $("#scroller").css("width", width);
        myScroll = new IScroll('#mallWrapper', { scrollX: true, scrollY: false, mouseWheel: true, click: true });
    }

    function addListeners(params) {
        $("#scroller").on("click", "li", function() {
            var me = $(this);
            $("#mallWrapper").find(".current").removeClass("current");
            me.addClass("current");
            myScroll.scrollToElement(this);
            bigCode = me.attr("code");
            smallCode = "";
            addSmallCont(bigCode);
            first = true;
            start = 1;
            getProduces();
        });
        $("#smallCont").on("click", "a", function() {
            var me = $(this);
            $("#smallCont").find(".subclass").removeClass("subclass");
            me.addClass("subclass");
            smallCode = me.attr("code");
            first = true;
            start = 1;
            getProduces();
        });
        $("#cont").on("click", ".display", function() {
            location.href = "../operator/buy.html?code=" + $(this).attr("code");
        });
        $(window).on("scroll", function() {
            var me = $(this);
            if (canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop())) {
                canScrolling = false;
                getProduces();
            }
        });
    }


    function getProduces() {
        if (!first) {
            $("#cont").append('<i id="loadI" class="icon-loading2"></i>');
        } else {
            $("#cont").html('<i id="loadI" class="icon-loading3"></i>');
        }
        Ajax.get(APIURL + '/commodity/product/page', {
                "category": bigCode,
                "type": smallCode,
                "companyCode": COMPANYCODE,
                "start": start,
                "limit": limit
            }, true)
            .then(function(res) {
                if (res.success && res.data.list.length) {
                    var data = res.data.list,
                        html = "";
                    for (var i = 0; i < data.length; i++) {
                        html += '<div style="width:'+width+'" class="bg_fff display" code="' + data[i].code + '">' +
                            '<img style="width:'+width+';height:'+width+'" src="' + data[i].advPic + '">' +
                            '<div class="pl6 pt4">' + data[i].name + '</div>' +
                            '<div class="price pl6 s_13">￥' + (+data[i].discountPrice / 1000).toFixed(2) +
                            '<del class="ml5 s_12 t_999"><span class="price-icon">¥</span><span class="font-num">' + (+data[i].originalPrice / 1000).toFixed(2) + '</span></del></div>' +
                            '</div>';
                    }
                    $("#loadI").remove();
                    $("#cont").append(html);
                    start++;
                    canScrolling = true;
                    first = false;
                } else {
                    if (first) {
                        doError();
                    }
                    canScrolling = false;
                }
            });
    }


    function doError() {
        $("#cont").replaceWith('<div id="cont"><div class="bg_fff" style="text-align: center;line-height: 150px;">暂无相关商品</div></div>');
    }

});