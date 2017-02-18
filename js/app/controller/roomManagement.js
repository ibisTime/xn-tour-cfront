define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {
	
	if(!base.getUserId()){
		location.href="user/login.html"
	}
	
	var userId = base.getUserId();
	var hotalCode = $(location).attr('href').split('?')[1].split('&')[0].split('=')[1]
	var start = 1;//第几页
	var startNum;//总页数
	var sum;////总条数
	var limitNum = 1;//每页个数
	var num=0;//已加载消息数
	
	var list = "";
	
	ajaxUpdata(start,limitNum);
	
	$("#manageWrap").on("click", ".manageList", function(e){
		var va = $(this);
		var code = va.attr("data-code");
		if(va.hasClass("manageListIn")){
			
			location.href = "checkOut.html?code="+code;
		}else if(va.hasClass("manageListOut")){
			
			location.href = "checkIn.html?code="+code;
		}
	});
	
	//加载
	$(".updateMore").on("click",function(){
		if(start<startNum){
			start++;
			ajaxUpdata(start,limitNum);
		}else{
			start=start;
			$(".updateMore p").html("没有更多  ···");
		}
	})
	
	function ajaxUpdata(sta,lim){
		$.when(
//			Ajax.get("618031",{"hotalCode":hotalCode}),
			
			Ajax.get("618030",{"hotalCode":hotalCode,"start":sta,"limit": lim}),
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
	        	
	        	startNum = res1.data.totalPage;//总页数
				sum = res1.data.totalCount;//总条数
				
				for (var i = 0; i < limitNum; i ++) {
        		
	        		var s = "";
	        		
	        		if(num>sum-1){//消息加载总条数多余消息总条数时跳出循环
						num=num;
//						console.log("已跳出循环,已加载消息条数"+num,"总消息条数"+sum)
						break;
					}else{
//						console.log("已加载消息条数"+num,"总消息条数"+sum)

		        		dtype = dictArray(res1.data.list[i].type,dict1),//类型
		        		dpicture = res1.data.list[i].picture;//图片
		        		dprice = res1.data.list[i].price/1000;
		        		dprice = "￥"+dprice.toFixed(2);//价格
		        		droomNum = res1.data.list[i].roomNum + "号";//房号
		        		
		        		ddescription = res1.data.list[i].description;
		        		ddescription = dictArray2(ddescription,dict3);//描述
		        		
		        		if(res1.data.list[i].status == 1){
		        			dstatus = 1;
		        			dstatus = dictArray(dstatus,dict2);//状态
		        			
		        			s += "<div data-code='"+res1.data.list[i].code+"' class='manage ba lh19 bb manageList manageListOut ' onClick='mgClick(this)'>";
							s += "<div class='image inline_block'><img src='"+PIC_PREFIX+dpicture+THUMBNAIL_SUFFIX+"'></div>";
							s += "<div class='inline_block pl10'><div class='room-style'>"+dtype+"</div>";
							s += "<div class='room-number'>"+droomNum+"</div>";
							s += "<div class='room-point'>"+ddescription+"</div>";
							s += "<div class='price'>"+dprice+"</div></div>";
							s += "<div class='check-in fs12'>"+dstatus+"</div></div>";
							
		        		}else if(res1.data.list[i].status == 2){
		        			dstatus = 2;
		        			dstatus = dictArray(dstatus,dict2);//状态
		        			
		        			s += "<div data-code='"+res1.data.list[i].code+"' class='manage ba lh19 bb manageList manageListIn' onClick='mgClick(this)'>";
							s += "<div class='image inline_block'><img src='"+PIC_PREFIX+dpicture+THUMBNAIL_SUFFIX+"'></div>";
							s += "<div class='inline_block pl10'><div class='room-style'>"+dtype+"</div>";
							s += "<div class='room-number'>"+droomNum+"</div>";
							s += "<div class='room-point'>"+ddescription+"</div>";
							s += "<div class='price'>"+dprice+"</div></div>";
							s += "<div class='back fs12'>"+dstatus+"</div></div>";
		        		}
		        		
		        		list += s;
		        		num ++;
		        	}
	        	}
	        	
	        	$(".manageWrap").html(list);
	        	
	        	if(num>sum-1){
					$(".updateMore p").html("没有更多  ···");
				}else{
		        	$(".updateMore p").html("加载更多  ···")
		        }
	        	
	        } else {
	            base.showMsg(res1.msg);
	        }
		});	
	}
	
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
