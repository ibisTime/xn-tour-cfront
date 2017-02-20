define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {
	
	if(!base.getUserId()){
		location.href="user/login.html"
	}
	
	var dhref = $(location).attr('href').split('?')[1].split('&')[0].split('=')[1]
	
	$.when(
		Ajax.get("618032",{"code":dhref}),
		base.getDictList("hh_type"),
        base.getDictList("hotalRoom_status"),
        base.getDictList("ss_type")
	).then(function(res1, res2, res3, res4){
		if (res1.success && res2.success && res3.success && res4.success) {
        	
        	var dict1 = res2.data;
        	var dict2 = res3.data;
        	var dict3 = res4.data;
        	var dstatus ,//状态
        		dtype ,//类型
        		dpicture ,//图片
        		dprice, //价格
        		droomNum, //房号
        		ddescription;//描述
        	
        		var s = "";
        		dtype = dictArray(res1.data.type,dict1),//类型
        		dpicture = res1.data.picture;//图片
        		dprice = res1.data.price/1000;
        		dprice = "￥"+dprice.toFixed(2);//价格
        		droomNum = res1.data.roomNum + "号";//房号
        		
        		ddescription = res1.data.description;
        		ddescription = dictArray2(ddescription,dict3);//描述
        		
        		dstatus = 1;
        		dstatus = dictArray(dstatus,dict2);//状态
        			
				s += "<div class='pl10 fs15 ba'><div class='ptb18 border-b mt10'>"+dtype+"</div>";
				s += "<div class='ptb18 border-b'>"+droomNum+"</div>";
				s += "<div class='ptb18 border-b'>"+ddescription+"</div>";
				s += "<div class='ptb18 border-b'>"+dprice+"</div>";
				s += "<div class='ptb18  mb10'>已退房,"+dstatus+"</div></div>";
        	
        	$(".manageWrap").html(s);
        } else {
            base.showMsg(res1.msg);
        }
	});
	
	$("#btn-checkIn").on("click",function(){
		var userTel = $(".checkIn-tel").val();
		var pwd = $(".checkIn-pwd").val();
		var hotalOrderCode = $(".checkIn-id").val();
		var userId = base.getUserId();
		var code=dhref;
		
		var parem = {
			"code": code,
			"hotalOrderCode":hotalOrderCode,
			"mobile": userTel,
			"userId": userId,
			"password": pwd
		}
		
		Ajax.post("618023",{json:parem})
			.then(function(res) {
				
	            if (res.success) {
                    base.goBackUrl("roomManagement.html");
	            } else {
	                base.showMsg(res.msg);
	            }
	        }, function() {
	            base.showMsg("入住失败");
	        })
		
		
		
	})
	
	
	function dictArray(dkey,arrayData){//类型
		for(var i = 0 ; i < arrayData.length; i++ ){
			if(dkey == arrayData[i].dkey){
				return arrayData[i].dvalue;
			}
		}
	}
	function dictArray2(dkeys,arrayData){//描述
	    var str = dkeys;
		var arr = str.split(',');
		var temp = "";
		for (var i=0;i<arr.length;i++)
		{
			temp = temp + " " +dictArray(arr[i]*1,arrayData)
		}
        return temp;
	}
});
