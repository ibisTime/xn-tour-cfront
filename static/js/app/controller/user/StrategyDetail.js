define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {

    var code = base.getUrlParam("code");

    init();

    function init() {
        if(!code){
            base.showMsg("未传入攻略编号");
            return;
        }
        loading.createLoading();
        getDetail();
        addListener();
    }

    function getDetail(){
        Ajax.get("618116", {
            code: code,
            userId: base.getUserId()
        }).then(function(res){
            loading.hideLoading();
            if(res.success){
                var data = res.data;
                $("#title").html(data.title);
                $("#description").html(data.description);
                $("#date").html(base.formatDate(data.updateDatetime, "yyyy-MM-dd"));
                data.isCollect == "1" ? $("#scjdIcon").addClass("active") : "";
            }else{
                base.showMsg(res.msg);
            }
        }, function(){
            loading.hideLoading();
            base.showMsg("加载失败");
        });
    }

    function addListener() {
        $("#scjdIcon").on("click", function(){
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
            loading.createLoading();
            Ajax.post("618320", {
                json: {
                    toEntity: code,
                    toType: 2,
                    type: 2,
                    interacter: base.getUserId()
                }
            }).then(function(res){
                loading.hideLoading();
                if(res.success){
                    $("#scjdIcon").toggleClass("active");
                }else{
                    base.showMsg(res.msg || "操作失败");
                }
            }, function(){
                loading.hideLoading();
                base.showMsg("操作失败");
            });
        });
    }
});
