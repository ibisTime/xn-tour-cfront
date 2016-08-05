define("app/ux/Swiper", [
	'dojo/query',
	'dojo/on',
	'dojo/dom-style',
	'dojo/dom-class',
	'dojo/_base/fx'
],function(query,on,domStyle,domClass,fx){
	var swiperConfig = {};
	swiperConfig.s_id = 0;
	function swiper(item , i){
		if(swiperConfig.s_id == i){
			return;
		}
        if (swiperConfig.everyFinish) {
            swiperConfig.everyFinish(i);
        }
		clearTimeout(swiperConfig.timeOut);
		
		domClass.remove(query(".hd li",item)[swiperConfig.s_id],"on");
		domClass.add(query(".hd li",item)[i],"on");
	
		var showItem = query(".bd li",item)[i];
		domStyle.set(showItem,"display","list-item");
		fx.fadeIn({
			node:showItem,
			onEnd:function(){
			},
			duration: 1500
		}).play();
		
		var hideItem = query(".bd li",item)[swiperConfig.s_id];
		fx.fadeOut({
			node:hideItem,
			onEnd:function(){
				 //domStyle.set(hideItem,"display","none");
			},
			duration: 1500
		}).play();
		
		//当有轮播时间时根据时间自动轮播
		if(swiperConfig.roundTime != null){
			swiperConfig.timeOut = setTimeout(swiperConfig.nextSlide,swiperConfig.roundTime);
		}
		
		swiperConfig.s_id = i;
		
	};
    swiperConfig.slideTo = function(index) {
        swiper(this.slide, index);
    };
	//下一页轮播
	swiperConfig.nextSlide = function(){
		if((swiperConfig.s_id+1) < swiperConfig.max_id){
			swiper(swiperConfig.slide,swiperConfig.s_id+1);
		}else{
			swiper(swiperConfig.slide,0);
		}
	};
	//上一页轮播
	swiperConfig.preSlide = function(){

		if(swiperConfig.s_id > 0){
			swiper(swiperConfig.slide,swiperConfig.s_id-1);
		}else{
			swiper(swiperConfig.slide,swiperConfig.max_id-1);
		}
	};
	
	var _swiper = function(config){
		swiperConfig.roundTime = config.time;
        swiperConfig.everyFinish = config.everyFinish;
		//初始化轮播图
		query(config.node).forEach(function(item){
			swiperConfig.slide = item;
			var hg = domStyle.get(item,"height")+"px";
			var wt = domStyle.get(query(".bd ul")[0], "width");
			var ldw = domStyle.get(query(".bd li")[0], "width");
			
			var innerHtml = "";
			domStyle.set(query(".bd ul",item)[0],{
				"position":"relative",
				"height":hg
			});
			var itembds = query(".bd li",item);
			swiperConfig.max_id = itembds.length;
			itembds.forEach(function(itembd,i){
				domStyle.set(itembd,{
					"position":"absolute",
					//"left": (wt-ldw)/2+"px",
					"left":"0",
					"top":"0"
				});
				
				innerHtml += "<li ";
				if(i==0){
					innerHtml += "class='on'";
				}else{
					 domStyle.set(itembd,{
						 "display":"none",
						 "opacity":"0"
					});
				}
				innerHtml +="></li>";
			});
			query(".hd ul",item)[0].innerHTML = innerHtml;
			query(".hd li",item).forEach(function(itemhd,i){
				on(itemhd, "mouseover", function(){
					swiper(item, i);
				})
			});
			on(query(".btn-prev",item)[0],"click",function(){
				swiperConfig.preSlide();
			});
			on(query(".btn-next",item)[0],"click",function(){
				swiperConfig.nextSlide();
			});
		});
		//当有轮播时间时根据时间自动轮播
		if(swiperConfig.roundTime != null){
			swiperConfig.timeOut = setTimeout(swiperConfig.nextSlide,swiperConfig.roundTime);
		}
		return swiperConfig;
		
	};
	
	return _swiper;
});