define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/addSub/addSub'
], function(base, Ajax, loading, addSub) {

    var code = base.getUrlParam("code"), remainNum = 0;
    var price, startSelectArr, endSelectArr;
    var returnUrl = base.getUrlParam("return");
    var outName = "";

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
    }

    function getDetail(){
        Ajax.get("618172", {
            code: code
        }).then(function(res){
            if(res.success){
                var data = res.data;
                $("#date").text(base.formatDate(data.outDatetime, "yyyy-MM-dd"));
                $("#startSite").text(base.findObj(startSelectArr, "dkey", data.startSite)["dvalue"]);
                $("#endSite").text(base.findObj(endSelectArr, "dkey", data.endSite)["dvalue"]);
                $("#time").text(base.formatDate(data.outDatetime, "hh:mm"));
                remainNum = +data.remainNum;
                $("#remainNum").text(data.remainNum);
                $("#address").text(data.address);
                outName = data.name;
                price = +data.price;
                $("#totalAmount").text(base.formatMoney(price));
                addListener();
            }else{
                base.showMsg(res.msg);
            }
            loading.hideLoading();
        }, function(){
            loading.hideLoading();
            base.showMsg("数据加载失败");
        });
    }

    function addListener() {
        $("#kefuIcon").on("click", function (e) {
            location.href = "http://kefu.easemob.com/webim/im.html?tenantId=" + TENANTID;
        });
        $("#sbtn").on("click", function(){
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
        var obj = lineInfo[lCode] || {};
        obj.outCode = code;
        obj.outName = outName;
        lineInfo[lCode] = obj;
        sessionStorage.setItem("line-info", JSON.stringify(lineInfo));
    }
});