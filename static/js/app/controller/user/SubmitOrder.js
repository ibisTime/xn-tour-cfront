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
	var hmType2 = {}, ssType = {}, price = 0;

	init();

	function init() {
        $("#startDate").html(startDate);
        $("#endDate").html(endDate);
        $("#totalDays").html(base.calculateDays(startDate, endDate));
        getRoomAndHotel();
	}

	function getRoomAndHotel(){
		loading.createLoading("加载中...");
		$.when(
            base.getDictList("hm-type2"),
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
                people: {
                    required: true,
                    maxlength: 16,
                    isNotFace: true
                },
                mobile: {
                	required: true,
                	mobile: true
                },
                applyNote: {
                	required: true,
                	isNotFace: true,
                	maxlength: 255
                }
            },
            onkeyup: false
        });
        $("#submitBtn").on("click", function(){
        	if($("#submitForm").valid()){
        		console.log("xxx");
        	}
        });
        $("#quantity").on("change", function(){
        	var val = +$(this).val();
        	$("#quaty").html(val + "间");
        	$("#price").html(base.fZeroMoney(price * val));
        });
        $("#addr-wrap").on("click", function(){
        	showInMap.showMap();
        });
	}

	function getHotel(){
        Ajax.get("618012", {
            code: hotelCode
        }).then(function(res){
            if(res.success){
                var data = res.data;

                $("#name").html(data.name);
                $("#addr").html(getAddr(data));

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
        })
    }

    function getRoom(){
    	return Ajax.get("618032", {
            code: roomCode
        }).then(function(res){
            if(res.success){
                var data = res.data;
                $("#hmType").html(hmType2[data.type] || "--");
                var arr = data.description.split(/,/), str = "";
                $.each(arr, function(i, a){
                    str += ssType[a] + "、";
                });
                $("#ssType").html(str && str.substr(0, str.length - 1) || "--");
                price = data.price;
                $("#price").html(base.fZeroMoney(price))
                remain = data.remain || 0;	//剩余房间数
                // if(remain){
                // 	createSelect(remain);
                // }else{
                // 	base.showMsg('非常抱歉，您要预定的房间已经被订完了。', 2000);
                // 	setTimeout(function(){
                // 		history.back();
                // 	}, 2000)
                // }
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