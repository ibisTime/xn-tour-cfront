define([
    'app/controller/base'
], function(base) {
    init();

    function init() {
        getAboutus();
    }

    function getAboutus() {
        base.getAboutus()
            .then(function(res) {
                if (res.success) {
                    $("#description").html(res.data.description);
                } else {
                    $("#loaddingIcon").remove();
                    base.showMsg("非常抱歉，暂时无法获取关于我们的信息");
                }
            }, function() {
                $("#loaddingIcon").remove();
                base.showMsg("非常抱歉，暂时无法获取关于我们的信息");
            });
    }
});