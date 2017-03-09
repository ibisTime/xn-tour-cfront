define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {

	base.initLocation(init);
	
    function init() {
		var city ;//城市
		var nowUrl ;//实况链接
		
		var dKey = WEATHER_KEY;//key;

		city = sessionStorage.getItem("city");

	   $(".w-add").text(sessionStorage.getItem("city"));//城市

		nowUrl = "https://free-api.heweather.com/v5/now?city="+city+"&key="+dKey;
		daily_forecast = "https://free-api.heweather.com/v5/forecast?city="+city+"&key="+dKey;

		//实况天气
		$.ajax({
			type:"get",
			url:nowUrl,
			async:true,
			success:function(res){
				var nowData = res.HeWeather5[0].now;
				var nowCond ;//实况天气状况
				var nowTmp ;//温度
				var update ;//更新时间
				var condImg ;//天气图片

				nowCond = nowData.cond.txt;//实况天气状况
				nowTmp = nowData.tmp ;//温度
				update = res.HeWeather5[0].basic.update.loc.substring(10);//更新时间
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
			async:true,
			success:function(res){

				var fData = res.HeWeather5[0].daily_forecast;//未来天气
				var fTmp ;//温度
				var fcondImg ;//天气图片
				var list = "";

                nowDataTmp = fData[0].tmp.min+"°~"+fData[0].tmp.max+"°";//当天最低温度与最高温度

				for(var i = 1; i < fData.length; i ++){
                	var s = "";
                    fTmp = fData[i].tmp.min+"°~"+fData[i].tmp.max+"°";
                    fcondImg = "http://files.heweather.com/cond_icon/"+fData[i].cond.code_d+".png";//白天天气图标

                	s+="<div class='over-hide wp100 p10 fs16 wrap'>";
                    s+="<p class='fl wp45 inline_block w-date'>"+getWeek(i)+"</p>";
                    s+="<div class='fl wp10'><img class='wp100' src='"+fcondImg+"' /></div>";
                    s+=" <p class='fl wp45 inline_block tr w-Tmp'>"+fTmp+"</p></div>";

                    list+= s;
				}

                $(".w-Tmp").html(nowDataTmp);
				$(".weatherList").html(list);
			}
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
	            dayArr.push(new Date(oDate.getFullYear(),oDate.getMonth(),oDate.getDate() + i).format("MM/dd/yyyy"));   
	        }
	        
	        return dayArr;   //返回一个数组。
	    }
    }
});