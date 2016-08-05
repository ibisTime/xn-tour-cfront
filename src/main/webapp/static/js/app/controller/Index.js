define([
    'app/controller/base',
    'app/util/ajax',
    'Handlebars',
    'lib/swiper-3.3.1.jquery.min'
], function (base, Ajax, Handlebars) {
    $(function () {
        var mySwiper = new Swiper ('.swiper-container', {
            'direction': 'horizontal',
            'loop': true,
            'autoplay': 2000,
            'autoplayDisableOnInteraction': false,
            // 如果需要分页器
            'pagination': '.swiper-pagination'
        });
        var template = __inline("../ui/index-imgs.handlebars"),
            items = {}, count = 2, types = {}, modelList = {};
        Ajax.get(APIURL + '/commodity/queryProduces', true)
            .then(function (res) {
                if(res.success){
                    var data = res.data;
                    if(data.length){
                        for(var i = 0; i < data.length; i++){
                            var d = data[i];
                            if(!types[d.type]){
                                types[d.type] = 0;
                            }
                            if(types[d.type] < 3){
                                items[d.code] = {
                                    "name": d.name,
                                    "advTitle": d.advTitle,
                                    "advPic": d.advPic,
                                    "code": d.code
                                };
                                types[d.type]++;
                            }
                        }
                        isReady(doSuccess);
                    }else{
                        doError();
                    }
                }else{
                    doError();
                }
            });
        Ajax.get(APIURL + '/commodity/queryListModel', true)
            .then(function (res){
                if(res.success){
                    var data = res.data;
                    if(data.length){
                        for(var i = 0; i < data.length; i++){
                            var d = data[i];
                            if(d.buyGuideList.length){
                                if(modelList[d.productCode] == undefined){
                                    modelList[d.productCode] = Infinity;
                                }
                                var s = +d.buyGuideList[0].discountPrice / 1000;
                                if(s < modelList[d.productCode]){
                                    modelList[d.productCode] = s;
                                }
                            }
                        }
                        isReady(doSuccess);
                    }
                }
            });
        function isReady(func) {
            if(!--count){
                func();
            }
        }
        function doError() {
            count = 0;
            $("header").remove();
            $("#cont").replaceWith('<div class="bg_fff" style="text-align: center;line-height: 150px;">暂无数据</div>');
        }
        function doSuccess() {
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
