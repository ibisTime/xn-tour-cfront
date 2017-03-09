define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/addSub/addSub',
    'app/module/identity/identity',
    'app/module/bindMobile/bindMobile'
], function(base, Ajax, loading, addSub, Identity, BindMobile) {

    var code = base.getUrlParam("code"), remainNum = 0;
    var price, startSelectArr, endSelectArr;
    var returnUrl = base.getUrlParam("return");
    var isBindMobile = false, isIdentity = false;
    var outName, outPic, startSite, outDatetime, outNum = 1;

    init();

    function init() {
        if(!code){
            base.showMsg("未传入专线编号");
            return;
        }
        loading.createLoading();
        $.when(
            base.getDictList("zero_type"),
            base.getDictList("destination_type")
        ).then(function(res1, res2){
            if(res1.success && res2.success){
                startSelectArr = res1.data;
                endSelectArr = res2.data;
                getDetail();
            }else{
                loading.hideLoading();
                base.showMsg(res1.msg || res2.msg);
            }
        }, function(){
            loading.hideLoading();
            base.showMsg("数据加载失败");
        });
        if(base.isLogin()){
            base.getUser()
                .then(function (res) {
                    // loading.hideLoading();
                    if(res.success){
                        isBindMobile = !!res.data.mobile;
                        isIdentity = !!res.data.realName;
                    }else{
                        base.showMsg(res.msg);
                    }
                });
        }
    }
    function getDetail(){
        Ajax.get("618172", {
            code: code
        }).then(function(res){
            loading.hideLoading();
            if(res.success){
                var data = res.data;
                startSite = base.findObj(startSelectArr, "dkey", data.startSite)["dvalue"];
                outDatetime = base.formatDate(data.outDatetime, "hh:mm");
                $("#date").text(base.formatDate(data.outDatetime, "yyyy-MM-dd"));
                $("#startSite").text(startSite);
                $("#endSite").text(base.findObj(endSelectArr, "dkey", data.endSite)["dvalue"]);
                $("#time").text(outDatetime);
                remainNum = +data.remainNum;
                $("#remainNum").text(data.remainNum);
                $("#address").text(data.address);
                outPic = data.pic;
                outName = data.name;
                price = +data.price;
                outModule = data.type;
                $("#totalAmount").text(base.formatMoney(price));
                addListener();
            }else{
                base.showMsg(res.msg);
            }
            return res;
        }, function(){
            loading.hideLoading();
            base.showMsg("数据加载失败");
        });
    }

    function addListener() {
        Identity.addIdentity({
            success: function(){
                isIdentity = true;
                if(!isBindMobile)
                    BindMobile.showMobileCont();
            },
            error: function(msg){
                base.showMsg(msg);
            }
        });
        BindMobile.addMobileCont({
            success: function(res){
                isBindMobile = true;
                if(!isIdentity)
                    Identity.showIdentity();
            },
            error: function(msg){
                base.showMsg(msg);
            }
        });
        $("#kefuIcon").on("click", function (e) {
            location.href = "http://kefu.easemob.com/webim/im.html?tenantId=" + TENANTID;
        });
        $("#sbtn").on("click", function(){
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
            if(!isBindMobile || !isIdentity){
                if(!isBindMobile && !isIdentity){
                    base.confirm("您还未实名认证，点击确认前往实名认证，并绑定手机号")
                        .then(function () {
                            Identity.showIdentity();
                        }, base.emptyFun);
                }else if(!isIdentity){
                    base.confirm("您还未实名认证，点击确认前往实名认证")
                        .then(function () {
                            Identity.showIdentity();
                        }, base.emptyFun);
                }else if(!isBindMobile){
                    base.confirm("您还未绑定手机号，点击确认前往绑定手机号")
                        .then(function () {
                            BindMobile.showMobileCont();
                        }, base.emptyFun);
                }
                return;
            }
            var ticket = +$("#totalTicket").val();
            if(ticket > remainNum){
                base.showMsg("购买票数超过余票");
                return;
            }
            if(returnUrl){
                setSpe();
                location.href = returnUrl;
                return;
            }
            location.href = "./special-submit-order.html?code=" + code + "&quantity=" + ticket;
        });

        addSub.createByEle({
            sub: $("#subBtn"),
            add: $("#addBtn"),
            input: $("#totalTicket"),
            changeFn: function () {
                $("#totalAmount").text(base.formatMoney(price * +$(this).val()));
            }
        });
    }
    function setSpe(){
        var lineInfo = sessionStorage.getItem("line-info");
        if(!lineInfo){
            lineInfo = {};
        }else{
            lineInfo = $.parseJSON(lineInfo);
        }
        var lCode = base.getUrlParam("lineCode", returnUrl.replace(/(.+)\?/i, "?"));
        var ticket = +$("#totalTicket").val();
        var obj = lineInfo[lCode] || {};
        obj.outCode = code;
        obj.outName = outName;
        obj.outPic = outPic;
        obj.outStartSite = startSite;
        obj.outDatetime = outDatetime;
        obj.totalOutAmount = price * ticket;
        obj.quantitySpecial = ticket;
        lineInfo[lCode] = obj;
        sessionStorage.setItem("line-info", JSON.stringify(lineInfo));
    }
});