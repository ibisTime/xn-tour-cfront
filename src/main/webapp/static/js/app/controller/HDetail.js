define([
    'app/controller/base'
], function(base) {
    var code = base.getUrlParam("c");
    init();

    function init() {
        if (code) {
            getContent();
        } else {
            $("#loaddingIcon").hide();
            base.showMsg("未传入公告编号");
        }
    }

    function getContent() {
        base.getGgContent(code)
            .then(function(res) {
                $("#loaddingIcon").hide();
                if (res.success) {
                    $("#title").text(res.data.title);
                    $("#content").html(res.data.content);
                } else {
                    base.showMsg("非常抱歉，公告详情获取失败");
                }
            }, function() {
                base.showMsg("非常抱歉，公告详情获取失败");
            });
    }
});