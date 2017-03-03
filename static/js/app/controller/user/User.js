define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/foot/foot',
    'app/module/loading/loading',
    'app/module/showImg/showImg',
    'app/module/scroll/scroll'
], function(base, Ajax, Foot, loading, showImg, scroll) {

    var myScroll;

    init();

    function init() {
        loading.createLoading();
        if(!base.isLogin()){
            base.goLogin();
            return;
        }
        Foot.addFoot(3);
        $.when(
            getAccountList(),
            getUser(),
            getTel()
        ).then(function () {
            loading.hideLoading();
        }, function () {
            loading.hideLoading();
        })
        initIScroll();
        addListener();
    }

    function getTel() {
        return base.getSysConfig("telephone")
            .then(function (res) {
                if(res.success){
                    var tel = res.data.note;
                    $("#telephone")
                        .html(  '<a class="show wp100" href="tel://'+tel+'">'+
                                '<div class="default-icon-wrap fwrx-icon"></div>'+
                                '服务热线：<span>400-832-0989</span>'+
                                '<div class="st-jt"></div></a>');
                }
            })
    }

    function getAccountList(refresh) {
        return Ajax.get("802503", {
            userId: base.getUserId()
        }, !refresh).then(function (res) {
            if(res.success && res.data.length){
                var data = res.data;
                $.each(data, function (i, d) {
                    if(d.currency == "XNB")
                        $("#jfAmount").html(base.fZeroMoney(d.amount));
                    else if(d.currency == "CNY")
                        $("#amount").html("¥" + base.formatMoney(d.amount));
                });
            }else{
                res.msg && base.showMsg(res.msg);
            }
        }, function () {
            base.showMsg("账号信息获取失败");
        });
    }

    function initIScroll(){
        myScroll = scroll.getInstance().getOnlyUpScroll({
            refresh: function () {
                getUser(true);
                getAccountList(true);
            }
        });
    }

    function addListener() {
        $("#avatar").on("click", function(){
            showImg.createImg($(this).attr("src")).showImg();
        });
    }

    function getUser(refresh){
        return base.getUser(refresh)
            .then(function(res){
                if(res.success){
                    // $("#jfAmount").html(res.data.ljAmount);
                    $("#nickname").html(res.data.nickname);
                    $("#avatar").attr("src", base.getWXAvatar(res.data.userExt.photo));
                }
                myScroll.refresh();
            }, function(){
                myScroll.refresh();
            });
    }
});