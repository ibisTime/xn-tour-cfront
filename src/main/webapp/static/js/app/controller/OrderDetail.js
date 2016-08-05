define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dict',
    'app/util/dialog',
    'Handlebars'
], function (base, Ajax, Dict, dialog, Handlebars) {
    $(function () {
    	var code = base.getUrlParam('code'),
	        receiptType = Dict.get("receiptType"),
	        orderStatus = Dict.get("orderStatus"),
	        fastMail = Dict.get("fastMail"),
	        companyCode = Dict.get("companyCode"),
	        addrTmpl = __inline("../ui/order-detail-addr.handlebars"),
	        contTmpl = __inline("../ui/pay-order-imgs.handlebars");

	    initView();

	    function initView() {
	    	$("#orderCode").text(code);
	        (function () {
	            var url = APIURL + '/operators/queryOrder',
	                config = {
	                    "invoiceCode": code
	                };
	            var modelCode = "" ,modelName, quantity, salePrice, receiveCode, productName;
	            Ajax.post(url, config)
	                .then(function(response) {
	                	$("#cont").remove();
	                    if (response.success) {
	                        var data = response.data, html = "",
	                            invoiceModelLists = data.invoiceModelList;

	                        $("#orderDate").text(getMyDate(data.applyDatetime));
	                        $("#orderStatus").text(getStatus(data.status));
	                        if(data.status == "1"){
	                        	$("footer").removeClass("hidden");
	                        }
	                        if(data.approveNote){
	                        	$("#approveNoteTitle, #approveNoteInfo").removeClass("hidden");
	                        	$("#approveNoteInfo").text(data.approveNote);
	                        }
	                        if(data.applyNote){
	                        	$("#applyNoteTitle, #applyNoteInfo").removeClass("hidden");
	                        	$("#applyNoteInfo").text(data.applyNote);
	                        }
	                        addListener();
	                        if (invoiceModelLists.length) {
	                            invoiceModelLists.forEach(function (invoiceModelList) {
	                                invoiceModelList.totalAmount = (+invoiceModelList.quantity * +invoiceModelList.salePrice / 1000).toFixed(2);
	                            });
	                            $("#od-ul").html(contTmpl({items: invoiceModelLists}));
	                            $("#totalAmount").html((+data.totalAmount / 1000).toFixed(2));
	                            $("#od-rtype").html(getReceiptType(data.receiptType));
	                            $("#od-rtitle").html(data.receiptTitle || "无");
	                            $("#od-id").html(data.code);

	                            var addData = data.address;
	                            $("#addressDiv").html(addrTmpl(addData));
	                            var logistic = data.logistics;
	                            if(logistic && logistic.code){
	                                $("#logisticsTitle, #logisticsInfo").removeClass("hidden");
	                                $("#logisticsComp").text(fastMail[logistic.company]);
	                                $("#logisticsNO").text(logistic.code);
	                            }
	                        }else{
	                        	showMsg("暂时无法获取商品信息！");
	                        }
	                    }else{
	                    	showMsg("暂时无法获取订单信息！");
	                    }
	                });
	        })();
	    }

	    function getMyDate(value) {
	        var date = new Date(value);
	        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
	            get2(date.getHours()) + ":" + get2(date.getMinutes()) + ":" + get2(date.getSeconds());
	    }

	    function get2(val) {
	        if(val < 10){
	            return "0" + val;
	        }else{
	            return val;
	        }
	    }

	    function getReceiptType(data) {
	        return data == "" ? "无": receiptType[data];
	    }

	    function addListener() {
	        $("#cbtn").length && $("#cbtn").on("click", function (e) {
	        	$("#od-mask, #od-tipbox").removeClass("hidden");
	        });
	        $("#sbtn").length && $("#sbtn").on("click", function(){
	        	location.href = '../operator/pay_order.html?code=' + code;
	        });
	        $("#odOk").on("click", function(){
				cancelOrder();
	        	$("#od-mask, #od-tipbox").addClass("hidden");
	        })
	        $("#odCel").on("click", function(){
	        	$("#od-mask, #od-tipbox").addClass("hidden");
	        })
	    }

	    function getStatus(status){
	        return orderStatus[status] || "未知状态";
	    }

	    function trimStr(val) {
	        if(val == undefined || val === ''){
	            return '';
	        }
	        return val.replace(/^\s*|\s*$/g, "");
	    }

	    function cancelOrder(){
	        var url = APIURL + '/operators/cancelOrder',
	            config = {
	                code: code,
	                applyNote: "用户主动取消"
	            };
	        $("#loaddingIcon").removeClass("hidden");
	        Ajax.post(url, config)
	            .then(function(response) {
	            	$("#loaddingIcon").addClass("hidden");
	                if (response.success) {
	                    showMsg("取消订单成功！");
	                    setTimeout(function(){
	                    	location.href = "./order_list.html";
	                    }, 1000);
	                }else{
	                    showMsg(response.msg);
	                }
	            });
	    }

	    function showMsg(cont){
	        var d = dialog({
	                    content: cont,
	                    quickClose: true
	                });
	        d.show();
	        setTimeout(function () {
	            d.close().remove();
	        }, 2000);
	    }
    });
});