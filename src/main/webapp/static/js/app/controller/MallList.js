define([
    'app/controller/base',
    'app/util/ajax',
    'IScroll'
], function(base, Ajax, IScroll) {
    var first = true,
        COMPANYCODE = "",
        bigCode = base.getUrlParam("b") || "",
        smallCode = base.getUrlParam("s") || "",
        start = 1,
        limit = 10,
        seqArr = [],
        D2XArr = [],
        canScrolling = false;
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
                            D2XArr.push(d);
                        }
                    }
                }
                var html = "",
                    sHtml = "";
                for (var j = 0; j < seqArr.length; j++) {
                    html += '<li code="' + seqArr[j].code + '">' + seqArr[j].name + '</li>';
                }
                var nowSmallArr = [];
                if (bigCode == "") {
                    bigCode = seqArr[0].code;
                }
                nowSmallArr = D2XArr[bigCode];
                for (var j = 0; j < nowSmallArr.length; j++) {
                    sHtml += '<a class="mb10" href="javascript:void(0)" code="' + nowSmallArr[j].code + '"><span class="mr40 s_11 ptb4 plr12">' + nowSmallArr[j].name + '</span></a>';
                }
                var scroller = $("#scroller"),
                    smallCont = $("#smallCont");
                scroller.find("ul").html(html);
                addCategory();
                smallCont.html(sHtml);
                scroller.find("ul>li[code='" + bigCode + "']").click();
                var header = $("header");
                var time = setInterval(function() {
                    if (scroller.css("transform") != "none") {
                        if ((sHtml && smallCont.find("a").length) || !sHtml) {
                            clearInterval(time);
                            $("#mtop").css("height", $("header").height());
                        }
                    }
                }, 100);
            } else {
                doError();
                $("header").hide();
            }
        })
    }

    function addCategory() {
        var scroller = $("#scroller");
        var lis = scroller.find("ul li");
        for (var i = 0, width = 0; i < lis.length; i++) {
            width += $(lis[i]).width() + 20;
        }
        $("#scroller").css("width", width);
        var myScroll = new IScroll('#mallWrapper', { scrollX: true, scrollY: false, mouseWheel: true, click: true });
    }

    function addListeners(params) {
        $("#scroller").on("click", "li", function() {
            var me = $(this);
            $("#mallWrapper").find(".current").removeClass("current");
            me.addClass("current");
            myScroll.scrollToElement(this);
            bigCode = me.attr("code");
            smallCode = "";
            first = true;
            start = 1;
            getProduces();
        });
        $("#smallCont").on("click", "a", function() {
            var me = $(this);
            $("#mallWrapper").find(".subclass").removeClass("subclass");
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
            $("#cont").html('<i id="loadI" class="icon-loading"></i>');
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
                        html += '<div class="wp48  bg_fff display" code="' + data[i].code + '">' +
                            '<img src="' + data[i].advPic + '">' +
                            '<div class="tc pt4">' + data[i].name + '</div>' +
                            '<div class="tc price s_13">￥' + (+data[i].discountPrice / 1000).toFixed(2) + '</div>' +
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
        $("#cont").replaceWith('<div id="cont" class="bg_fff" style="text-align: center;line-height: 150px;">暂无商品</div>');
    }

});