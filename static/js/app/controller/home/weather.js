define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {


    init();

    function init() {
        addListener();
    }

    function addListener() {
		var city ;//城市
		var nowUrl ;//实况链接
		
		var dKey = "bb8189b9b03c48de8a9f4eebfff110d6";//key;
		
		$.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js',function(){
			city = remote_ip_info.city;
			
		   $(".w-add").text(city);//城市
		   
			nowUrl = "https://free-api.heweather.com/v5/now?city="+city+"&key="+dKey;
			daily_forecast = "https://free-api.heweather.com/v5/forecast?city="+city+"&key="+dKey;
    		
    		//实况天气
			$.ajax({
				type:"get",
				url:nowUrl,
				async:true,
				success:function(res){
					var nowData = res.HeWeather5[0].now
					var nowCond ;//实况天气状况
					var nowTmp ;//温度
					var update ;//更新时间
					var condImg ;//天气图片
					
					nowCond = nowData.cond.txt;//实况天气状况
					nowTmp = nowData.tmp ;//温度
					update = base.formatDate(res.HeWeather5[0].basic.update.loc,"hh:mm");//更新时间
					condImg = "http://files.heweather.com/cond_icon/"+nowData.cond.code+".png";
					
					$(".w-nowCond").text(nowCond);//实况天气状况
					$(".w-nowTmp").text(nowTmp+"°");//温度
					$(".w-condImg").attr("src",condImg);
					$(".w-update").text(update);//更新时间
					$(".w-nowWeek").text(getWeek(0));//当前星期
					
				}
			});
			
			//7天天气
			$.ajax({
				type:"get",
				url:daily_forecast,
//				data:{
//					"date":getDayArr(6)[5]
//				},
				async:true,
				success:function(res){
					
					console.log(res.HeWeather5)
					console.log(getDayArr(6)[5])
					console.log(res.HeWeather5[0].daily_forecast.date)
//					var nowData = res.HeWeather5[0].now
//					var nowCond ;//实况天气状况
//					var nowTmp ;//温度
//					var update ;//更新时间
//					var condImg ;//天气图片
//					
//					nowCond = nowData.cond.txt;//实况天气状况
//					nowTmp = nowData.tmp ;//温度
//					update = base.formatDate(res.HeWeather5[0].basic.update.loc,"hh:mm");//更新时间
//					condImg = "http://files.heweather.com/cond_icon/"+nowData.cond.code+".png";
//					
//					$(".w-nowCond").text(nowCond);//实况天气状况
//					$(".w-nowTmp").text(nowTmp+"°");//温度
//					$(".w-condImg").attr("src",condImg);
//					$(".w-update").text(update);//更新时间
//					$(".w-nowWeek").text(getWeek(0));//当前星期
					
				}
			});
			
			
			
		});
    	
    	//获取星期
    	function getWeek(dayNum){//dayNum天数，第几天，0是当天
       		var date = getDayArr(6)[dayNum];//获取日期
			var day = new Date(Date.parse(date)); //
			var today = new Array('星期日','星期一','星期二','星期三','星期四','星期五','星期六');  
			var week = today[day.getDay()];
			
	        return week;   //返回星期。
	    }
    	
    	//返回一周的日期
		function getDayArr(dayNum){//dayNum天数，0开始，0是当天
	        var oDate = new Date();   //获取当前时间
	        var dayArr=[];     //定义一个数组存储时间
	        
	        for(var i=0;i<dayNum;i++){
	        	//把未来几天的时间放到数组里
	            dayArr.push(base.formatDate(new Date(oDate.getFullYear(),oDate.getMonth(),oDate.getDate() + i),"MM/dd/yyyy"));   
	        }
	        
	        return dayArr;   //返回一个数组。
	    }
    }
});