define("app/controllers/MallList", [
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/common/Global',
    'app/controllers/Helper',
    'app/jquery/$',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query, Ajax, Global, Helper, J) {
    var type = Global.getUrlParam('type'),
        config = {
            type: isNaN(type) ? "1" : type,
            status: "3"
        }, flag = true,
        detailUrl = Global.baseUrl + "/detail/mall_detail.htm?code=",
        buyUrl = Global.baseUrl + "/operator/buy.htm?code=";
    function initView() {
        var index = type == 1 ? 0 : type == 3 ? 1 : 2;

        $("#headProdUl > a:eq("+index+")").addClass("active")
            .siblings("a").removeClass("active");

        Ajax.get(Global.baseUrl + '/commodity/queryProduces', config)
            .then(function (response) {
                if (response.success) {
                    var data = response.data || [],
                        head_html = "",
                        body_html = "<ul>";
                    if(data.length) {
                        if(data.length > 6){
                            data.forEach(function (e, idx) {
                                head_html += "<a class='m-top-img' style='position: absolute;left:"+(idx * 150 + 36)+"px' href=\"" + detailUrl + e.code + "\">" +
                                    "<img src=\"" + e.majorPic + "\"/>" +
                                    "<div><span style='line-height: 1.6em;'>"+e.name+"</span></div></a>";

                                body_html += "<li>" +
                                    "<div class=\"img-detail\"><a href=\"" + detailUrl + e.code + "\"><img src=\"" + e.advPic + "\"/></a></div>" +
                                    "<div class=\"inblock\">" +
                                    "<div class=\"detail\">" + e.advTitle + "</div>" +
                                    "<div style=\"font-size: 14px;\"><a href=\"" + detailUrl + e.code + "\">进一步了解></a><a href='" + buyUrl + e.code + "'>购买></a></div></div>" +
                                    "</li>";
                            });
                            on(dom.byId("btr-l"), "click", function () {
                                if(!$(this).hasClass("btr-hide")){
                                    goLeftImg();
                                }
                            });
                            on(dom.byId("btr-r"), "click", function () {
                                if(!$(this).hasClass("btr-hide")){
                                    goRightImg();
                                }
                            });
                            $("#btr-l").show();
                            $("#btr-r").addClass('btr-hide').show();
                        }else{
                            data.forEach(function (e) {
                                head_html += "<a class='m-top-img' href=\"" + detailUrl + e.code + "\">" +
                                    "<img src=\"" + e.majorPic + "\"/>" +
                                    "<div><span style='line-height: 1.6em;'>"+e.name+"</span></div></a>";

                                body_html += "<li>" +
                                    "<div class=\"img-detail\"><a href=\"" + detailUrl + e.code + "\"><img src=\"" + e.advPic + "\"/></a></div>" +
                                    "<div class=\"inblock\">" +
                                    "<div class=\"detail\">" + e.advTitle + "</div>" +
                                    "<div style='font-size: 14px;'><a href=\"" + detailUrl + e.code + "\">进一步了解></a><a href='" + buyUrl + e.code + "'>购买></a></div>" +
                                    "</div>" +
                                    "</li>";
                            });
                        }
                        $("#headDetail").find("ul").replaceWith(head_html);
                        dom.byId("mall_list_body").innerHTML = body_html + "</ul>";
                    }else{
                        $(".mall_list_header").hide();
                        dom.byId("mall_list_body").innerHTML = "<span style='margin: 80px 0;display: inline-block;font-size: 24px;width: 100%;text-align: center;'><img style='width: 120px;margin-bottom: 20px;' src='"+Global.staticUrl+"/images/noData.png'/><br>暂无数据</span>";
                    }
                }else{
                    $(".mall_list_header").hide();
                    dom.byId("mall_list_body").innerHTML = "<span style='margin: 80px 0;display: inline-block;font-size: 24px;width: 100%;text-align: center;'><img style='width: 120px;margin-bottom: 20px;' src='"+Global.staticUrl+"/images/noData.png'/><br>暂无数据</span>";
                }
            });
    }
    function goLeftImg() {
        var $ul = $("#headDetail"),
            $lis = $ul.find("a.m-top-img"),
            lastLeft = parseInt($lis[$lis.length - 1].style.left);
        if(lastLeft <= 786 || !flag){
            return;
        }
        $("#btr-r").removeClass("btr-hide");
        flag = false;
        for(var i = 0; i < 5; i++){
            (function (i) {
                setTimeout(function () {
                    for(var j = 0, len = $lis.length; j < len; j++){
                        $lis[j].style.left = (parseInt($lis[j].style.left) - 30) + "px";
                    }
                    if( i == 4 ){
                        flag = true;
                        if( parseInt($lis[$lis.length - 1].style.left) <= 786 ) {
                            $("#btr-l").addClass("btr-hide");
                        }
                    }
                }, (i + 1) * 100)
            })(i);
        }
    }
    function goRightImg(){
        var $ul = $("#headDetail"),
            $lis = $ul.find("a.m-top-img"),
            firstLeft = parseInt($lis[0].style.left);
        if(firstLeft >= 36 || !flag){
            return;
        }
        $("#btr-l").removeClass("btr-hide");
        flag = false;
        for(var i = 0; i < 5; i++){
            (function (i) {
                setTimeout(function () {
                    for(var j = 0, len = $lis.length; j < len; j++){
                        $lis[j].style.left = (parseInt($lis[j].style.left) + 30) + "px";
                    }
                    if( i == 4 ){
                        flag = true;
                        if( parseInt($lis[0].style.left) >= 36 ) {
                            $("#btr-r").addClass("btr-hide");
                        }
                    }
                }, (i + 1) * 100)
            })(i);
        }
    }
    return {
        init: function() {
            initView();
            Helper.init();
        }
    }
});