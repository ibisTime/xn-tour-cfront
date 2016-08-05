define("app/controllers/MallDetail", [
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/common/Global',
    'dojo/when',
    'app/common/Data',
    'app/controllers/Helper',
    'app/jquery/$',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query,
            Ajax, Global, when, Data, Helper, J) {
    var code = Global.getUrlParam("code"),
        config = {
            code : code || ""
        },
        prop = {
            majorText: "majorPic",
            familyText: "familyPic",
            highlightText: "highlightPic"
        },
        buyUrl = Global.baseUrl + "/operator/buy.htm?code=" + config.code;

    function initView() {
        Ajax.get(Global.baseUrl + '/commodity/queryProduce', config)
            .then(function (response) {
                if (response.success) {
                    var data = response.data,
                        head_html = "",
                        body_html = "<ul class=\"img_ul\">";

                    head_html += "<span>"+data.name+"</span>"+
                        "<div>"+
                        "<a class=\"abtn\" href='"+buyUrl+"'>购买</a>"+
                        "</div>";
                    body_html += "<li class='mall_detail_advTitle'>"+data["advTitle"]+"</li>"
                    for(var p in prop){
                        body_html +=
                            "<li>"+
                            "<div class=\"img_div\"><img src=\""+data[prop[p]]+"\"/></div>"+
                            "<div class=\"img_intro\">"+data[p]+"</div>"+
                            "</li>";
                    }
                    dom.byId("head_detail").innerHTML = head_html;
                    dom.byId("mall_detail_body").innerHTML = body_html + "</ul>";
                }else{
                    dom.byId("mall_detail_body").innerHTML = "<span style='margin: 80px 0;display: inline-block;font-size: 24px;width: 100%;text-align: center;'><img style='width: 120px;margin-bottom: 20px;' src='"+Global.staticUrl+"/images/noData.png'/><br>暂无数据</span>";
                }
            });
    }
    
    return {
        init: function() {
            initView();
            Helper.init();
        }
    }
});
