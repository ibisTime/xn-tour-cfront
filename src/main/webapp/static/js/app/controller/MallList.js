define([
    'app/controller/base',
    'app/util/ajax',
    'Handlebars'
], function (base, Ajax, Handlebars) {
    $(function () {
        var template = __inline("../ui/mall-list.handlebars"),
            items = {}, count = 2, modelList = {}, first = true;
        $("#ml-head-ul").on("click", "li", function () {
            var $me = $(this);
            if(!$me.hasClass("active")){
                $("#ml-head-ul").find("li.active").removeClass("active");
                $me.addClass("active");
                getProduces($me.attr("l_type"));
            }
        });
        function getProduces(type) {
            if(!first){
                $("#cont").replaceWith('<i id="cont" class="icon-loading1"></i>');
            }
            items = {}; count = 2; modelList = {};
            Ajax.get(APIURL + '/commodity/queryProduces', {
                "type": type
            }, true)
                .then(function (res) {
                    if (res.success) {
                        var data = res.data;
                        if (data.length) {
                            for (var i = 0; i < data.length; i++) {
                                var d = data[i];
                                items[d.code] = {
                                    "name": d.name,
                                    "advTitle": d.advTitle,
                                    "advPic": d.advPic,
                                    "code": d.code
                                };
                            }
                            isReady(doSuccess);
                        } else {
                            doError();
                        }
                    } else {
                        doError();
                    }
                });
            Ajax.get(APIURL + '/commodity/queryListModel', true)
                .then(function (res) {
                    if (res.success) {
                        var data = res.data;
                        if (data.length) {
                            for (var i = 0; i < data.length; i++) {
                                var d = data[i];
                                if (d.buyGuideList.length) {
                                    if (modelList[d.productCode] == undefined) {
                                        modelList[d.productCode] = Infinity;
                                    }
                                    var s = +d.buyGuideList[0].discountPrice / 1000;
                                    if (s < modelList[d.productCode]) {
                                        modelList[d.productCode] = s;
                                    }
                                }
                            }
                            isReady(doSuccess);
                        }
                    }
                });
        }
        $("#ml-head-ul>li:first").click();
        function isReady(func) {
            if(!--count){
                func();
            }
        }
        function doError() {
            count = 0;
            if(first){
                $("header").remove();
                first = false;
            }
            $("#cont").replaceWith('<div id="cont" class="bg_fff" style="text-align: center;line-height: 150px;">暂无数据</div>');
        }
        function doSuccess() {
            first = false;
            var data = [];
            for( var name in items ){
                if(modelList[name]){
                    items[name].price = modelList[name].toFixed(2);
                    data.push(items[name]);
                }
            }
            var content = template({items: data});
            $("#cont").replaceWith(content);
        }
    });
});
