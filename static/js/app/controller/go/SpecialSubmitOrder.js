define([
    'app/controller/base',
    'app/module/validate/validate',
    'app/module/loading/loading',
    'app/module/showInMap/showInMap',
    'app/util/ajax'
], function(base, Validate, loading, showInMap, Ajax) {

	var code = base.getUrlParam("code") || "";
    var price, startSelectArr, endSelectArr;
	var quantity = base.getUrlParam("quantity") || 1;
   

	init();

	function init() {
        if(!base.isLogin()){
            base.goLogin();
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
                $("#datetime").text(base.formatDate(data.outDatetime, "yyyy-MM-dd hh:mm"));
                $("#startSite").text(base.findObj(startSelectArr, "dkey", data.startSite)["dvalue"]);
                $("#endSite").text(base.findObj(endSelectArr, "dkey", data.endSite)["dvalue"]);
                $("#name").text(data.name);
                $("#address").text(data.address);
                $("#ticket").text(quantity);
                $("#pic").attr("src", base.getImg(data.pic || ""));
                price = +data.price;
                $("#totalAmount").text(base.formatMoney(price * +quantity));
                $("#amount").text(base.formatMoney(price));
                $("#quantity").text(quantity);
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

	function addListener(){
        $("#submitBtn").on("click", function(){
        	if($("#submitForm").valid()){
                submitOrder();
        	}
        });
        $("#submitForm").validate({
            'rules': {
                applyNote: {
                	isNotFace: true,
                	maxlength: 255
                }
            },
            onkeyup: false
        });
	}

    function submitOrder(){
        loading.createLoading("提交中...");
        Ajax.get("618180", {
        	"specialLineCode": code,
        	"quantity": quantity,
        	"applyUser": base.getUserId(),
        	"applyNote": $("#applyNote").val()
        }).then(function(res){
            if(res.success){
                location.href = "../pay/pay.html?code=" + res.data.code + "&type=2";
            }else{
                loading.hideLoading();
                base.showMsg(res.msg || "订单提交失败");
            }
        }, function(){
            loading.hideLoading();
        	base.showMsg("订单提交失败");
        })
    }

});