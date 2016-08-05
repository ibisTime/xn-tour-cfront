define([
    'app/controller/base',
    'app/util/ajax',
    'Handlebars'
], function (base, Ajax, Handlebars) {
    $(function () {
        var template = __inline("../ui/mall-detail.handlebars");
        Ajax.get(APIURL + '/commodity/queryProduce', {
            "code": base.getUrlParam("code") || ""
        }, true)
            .then(function (res) {
                if(res.success){
                    var data = res.data;
                    $("#foot-cont").text(data.name);
                    $("#foot-buy").attr("href", "../operator/buy.html?code=" + data.code);
                    var html = template(data);
                    $("#cont").replaceWith(html);
                }else{
                    doError();
                }
            });
        function doError() {
            $("footer").remove();
            $("#cont").replaceWith('<div class="bg_fff" style="text-align: center;line-height: 150px;">暂无数据</div>');
        }
    });
});