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
        Foot.addFoot(3);
        initIScroll();
        getTel();
        addListener();
        loading.createLoading();
        if(!base.isLogin()){
            base.goLogin();
            return;
        }
        $.when(
            getAccountList(),
            getUser(),
            getTotalCartItem()
        ).then(function () {
            loading.hideLoading();
        }, function () {
            loading.hideLoading();
        });
        getSignInfo();
    }
    function getSignInfo(){
        Ajax.get("805102", {
            "userId": base.getUserId()
        }).then(function(res){
            if (res.success) {
                for (i = 0; i < res.data.length; i++) {
                    var tempDate = base.formatDate(res.data[i].signDatetime, "yyyy-MM-dd")
                    var nowDate = new Date().format("yyyy-MM-dd");
                    if (nowDate == tempDate) {
                        $("#signIn").val("已签到");
                    }
                }
            } else {
                base.showMsg(res.msg);
            }
        });
    }
    /*
     * 获取购物车商品总数
     * @param refresh 是否重新从服务器获取
     */
    function getTotalCartItem(refresh) {
        return Ajax.get("618441", {
            userId: base.getUserId()
        }, !refresh).then(function(res) {
            if (res.success) {
                var len = +res.data.length;
                if (len > 99) {
                    len = "99+";
                }
                $("#count").removeClass("hidden").html(len);
            }
        });
    }

    function getTel() {
        return base.getSysConfig("telephone")
            .then(function (res) {
                if(res.success){
                    var tel = res.data.note;
                    $("#telephone")
                        .html(  '<a class="show wp100" href="tel://'+tel+'">'+
                                '<div class="default-icon-wrap fwrx-icon"></div>'+
                                '服务热线：<span>' + tel + '</span>'+
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
        $("#signIn").on("click", function(){
            location.href = "../home/signIn.html";
        });
        $("#avatar").on("click", function(){
            showImg.createImg($(this).attr("src")).showImg();
        });
        $("#userOrder").on("click", ".user-top-btn", function () {
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
            location.href = "./order-list.html?index=" + $(this).index();
        });
        $("#accountFlow").on("click", function () {
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
            location.href = "./integral.html";
        });
        $("#cart").on("click", function () {
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
            location.href = "../mall/cart.html";
        });
        $("#integralFlow").on("click", function () {
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
            location.href = "./integral.html?k=1";
        });
        $("#travel").on("click", function () {
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
            location.href = "./travel-note-list.html";
        });
        $("#collection").on("click", function () {
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
            location.href = "./collection.html";
        });
        $("#setting").on("click", function () {
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
            location.href = "./setting.html";
        })
    }

    function getUser(refresh){
        return base.getUser(refresh)
            .then(function(res){
                if(res.success){
                    $("#nickname").html(res.data.nickname);
                    $("#avatar").attr("src", base.getWXAvatar(res.data.userExt.photo));
                }
                myScroll.refresh();
            }, function(){
                myScroll.refresh();
            });
    }
});
