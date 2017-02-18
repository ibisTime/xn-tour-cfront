define([
    'app/controller/base',
    'app/module/validate/validate',
    'app/module/loading/loading',
    'app/module/showInMap/showInMap',
    'app/util/ajax'
], function(base, Validate, loading, showInMap, Ajax) {

	var hotelCode = base.getUrlParam("hotelcode") || "";
	var roomCode = base.getUrlParam("roomcode") || "";
	var startDate = base.getUrlParam("start") || getNow();
	var endDate = base.getUrlParam("end") || getNow();
	var hmType2 = {}, ssType = {}, price = 0, roomType = 1,
        roomDescription = "", roomPic = "", hotelAddr = "",
        roomTypeName = "", roomPrice, totalDays;
    var returnUrl = base.getUrlParam("return");

	init();

	function init() {
        if(base.isLogin()){
            if(returnUrl){
                $("#areaWrap").hide();
                $("#submitBtn").val("确认");
            }
            $("#startDate").html(startDate);
            $("#endDate").html(endDate);
            totalDays = base.calculateDays(startDate, endDate);
            $("#totalDays").html(totalDays);
            getRoomAndHotel();
        }else{
            base.goLogin();
        }
	}

	function getRoomAndHotel(){
		loading.createLoading("加载中...");
		$.when(
            base.getDictList("hh_type"),
            base.getDictList("ss_type")
        ).then(function (res1, res2) {
            if(res1.success && res2.success){
                $.each(res1.data, function(i, d){
                    hmType2[d.dkey] = d.dvalue;
                });
                $.each(res2.data, function(i, d){
                    ssType[d.dkey] = d.dvalue;
                });

                $.when(getHotel(), getRoom())
                    .then(function(res1, res2){
                        loading.hideLoading();
                        addListener();
                    });
            }else{
                loading.hideLoading();
            }            
        })
	}

	function addListener(){
		$("#applyNote").on("keyup", function(){
			var val = $(this).val();
			if(!val)
				$("#applyPlaceholder").show();
			else
				$("#applyPlaceholder").hide();
		});
		$("#submitForm").validate({
            'rules': {
                quantity: {
                    required: true
                },
                checkInName: {
                    required: true,
                    maxlength: 16,
                    isNotFace: true
                },
                checkInMobile: {
                	required: true,
                	mobile: true
                },
                applyNote: {
                	isNotFace: true,
                	maxlength: 255
                }
            },
            onkeyup: false
        });
        $("#submitBtn").on("click", function(){
        	if($("#submitForm").valid()){
                if(returnUrl){
                    setHotel();
                    location.href = returnUrl;
                    return;
                }
                submitOrder();
        	}
        });
        $("#quantity").on("keyup", function(){
        	var val = $(this).val();
            if($("#quantity").valid()){
                val = +val;
                $("#price").html(base.formatMoney(+roomPrice * +totalDays * val));
            }else{
                $("#price").html("--");
            }
        });
        $("#addr-wrap").on("click", function(){
        	showInMap.showMap();
        });
	}

    function submitOrder(){
        loading.createLoading("提交中...");
        var data = $("#submitForm").serializeObject();
        data.startDate = startDate;
        data.endDate = endDate;
        data.applyUser = base.getUserId();
        data.hotalCode = hotelCode;
        data.roomType = roomType;
        Ajax.get("618040", data).then(function(res){
            if(res.success){
                location.href = "../pay/pay.html?code=" + res.data.code;
            }else{
                loading.hideLoading();
                base.showMsg(res.msg || "订单提交失败");
            }
        })
    }
    function setHotel(){
        var lineInfo = sessionStorage.getItem("line-info");
        if(!lineInfo){
            lineInfo = {};
        }else{
            lineInfo = $.parseJSON(lineInfo);
        }
        var lCode = base.getUrlParam("lineCode", returnUrl.replace(/(.+)\?/i, "?"));
        var obj = {};
        obj.hotalCode = hotelCode;
        obj.roomType = roomType;
        obj.startDate = startDate;
        obj.endDate = endDate;
        obj.quantity = $("#quantity").val();
        obj.hotelName = $("#name").html();
        obj.checkInMobile = $("#checkInMobile").val();
        obj.checkInName = $("#checkInName").val();
        obj.roomDescription = roomDescription;
        obj.roomPic = roomPic;
        obj.hotelAddr = hotelAddr;
        obj.roomTypeName = roomTypeName;
        obj.roomPrice = roomPrice;
        lineInfo[lCode] = obj;
        sessionStorage.setItem("line-info", JSON.stringify(lineInfo));
    }
	function getHotel(){
        Ajax.get("618012", {
            code: hotelCode
        }).then(function(res){
            if(res.success){
                var data = res.data;
                $("#name").html(data.name);
                hotelAddr = getAddr(data);
                $("#addr").html(hotelAddr);
                $("#addr").data("addr", {
                    longitude: data.longitude,
                    latitude: data.latitude
                });
                showInMap.addMap({
					lng: data.longitude,
					lat: data.latitude
				});
            }else{
                base.showMsg("酒店信息加载失败");
            }
        });
    }

    function getRoom(){
    	return Ajax.get("618032", {
            code: roomCode
        }).then(function(res){
            if(res.success){
                var data = res.data;
                roomTypeName = hmType2[data.type] || "--";
                $("#hmType").html(roomTypeName);
                var arr = data.description.split(/,/), str = "";
                $.each(arr, function(i, a){
                    str += ssType[a] + "、";
                });
                roomDescription = str = str && str.substr(0, str.length - 1);
                roomPic = base.getPic(data.picture);
                $("#ssType").html(str || "--");
                price = data.price;
                roomType = data.type;
                roomPrice = price;
                $("#price").html(base.formatMoney(+roomPrice * +totalDays));
                // $("#price").html(base.formatMoney(price));
            }else{
                base.showMsg("房间信息加载失败");
            }
        })
    }

    function createSelect(remain){
    	for(var i = 1, html = ""; i <= remain; i++){
    		if(i == 1)
    			html += '<option value="'+i+'" selected="selected">'+i+'间</option>';
    		else
    			html += '<option value="'+i+'">'+i+'间</option>';
    	}
    	$("#quaty").html( i > 1 ? "1间" : "0间" );
    	$("#quantity").html(html);
    }
    function getNow(){
    	return new Date().format("yyyy-MM-dd");
    }
    function getAddr(data){
        return data.province + (data.city || "") + (data.area || "") + (data.detail || "");
    }

});