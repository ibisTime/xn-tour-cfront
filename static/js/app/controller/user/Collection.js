define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'iScroll',
    'app/util/handlebarsHelpers'
], function(base, Ajax, loading, iScroll, Handlebars) {
	var config = {
		"0": {
			start: 1,
			limit: 10,
			type: 2,
			toType: 1,
			interacter: base.getUserId()
		},
		"1": {
			start: 1,
			limit: 10,
			type: 2,
			toType: 2,
			interacter: base.getUserId()
		},
		"2": {
			start: 1,
			limit: 10,
			type: 2,
			toType: 3,
			interacter: base.getUserId()
		},
		"3": {
			start: 1,
			limit: 10,
			type: 2,
			toType: 4,
			interacter: base.getUserId()
		}
	};
	// 1 线路,2 攻略,3 酒店,4 美食
	var config1 = {
		"0": {
			isLoading: false,
			isEnd: false,
			first: true
		},
		"1": {
			isLoading: false,
			isEnd: false,
			first: true
		},
		"2": {
			isLoading: false,
			isEnd: false,
			first: true,
			module: []
		},
		"3": {
			isLoading: false,
			isEnd: false,
			first: true
		}
	},
	index = base.getUrlParam("index") || 0,
	myScroll;
	var hotelTmpl = __inline("../../ui/go-hotel.handlebars");

	init();
	function init(){
		initIScroll();
		addListeners();
		loading.createLoading();
		getModuleList()
			.then(function(){
				$("#collection-top-nav").find(".order-list-top-nav1-item:eq("+index+")").click();
			});
	}
	function getModuleList(){
		return Ajax.get("806052", {
			type: 3,
		 	location: 'depart_hotel'
		}).then(function(res){
		 	if(res.success){
			 	config1[2].module = res.data;
			 	Handlebars.registerHelper('formatCategory', function(category, options){
	                return base.findObj(config1[2].module, "code", category)["name"];
	            });
			}else{
				base.showMsg("加载失败");
		 		loading.hideLoading();
			}
		}, function(){
		 	base.showMsg("加载失败");
		 	loading.hideLoading();
		});
	}
	//刷新
    function pullDownAction () {
        getData(index, true);
    }
	function initIScroll(){
        var pullDownEl, pullDownOffset, $pullDownEl;

        $pullDownEl = $("#pullDown");
        pullDownEl = $pullDownEl[0];
        pullDownOffset = pullDownEl.offsetHeight;
        
        myScroll = new iScroll('wrapper', {
            useTransition: false,
            topOffset: pullDownOffset,
            onRefresh: function () {
                if ($pullDownEl.hasClass('scroll-loading')) {
                    $pullDownEl.removeClass('scroll-loading flip');
                }
            },
            onScrollMove: function () {
                if (this.y > 5 && !$pullDownEl.hasClass("flip")) {
                    $pullDownEl.addClass("flip");
                    this.minScrollY = 0;
                } else if (this.y < 5 && $pullDownEl.hasClass("flip")) {
                    $pullDownEl.removeClass("flip");
                    this.minScrollY = -pullDownOffset;
                } else if (this.y - 20 < this.maxScrollY) {
                    getData(index);
                }
            },
            onScrollEnd: function () {
                if ($pullDownEl.hasClass("flip")) {
                    $pullDownEl.addClass("scroll-loading");            
                    pullDownAction();
                }
            }
        });
    }
    function getData(idx, refresh){
    	switch(idx){
        	case 0:
        		getPageRoute(refresh);
        		break;
        	case 1:
        		getPageStrategy(refresh);
        		break;
        	case 2:
        		getPageHotel(refresh);
        		break;
        	case 3:
        		getPageFood(refresh);
        		break;
        	default:
        		getPageRoute(refresh);
        }
    }
    //线路
	function getPageRoute(){
		config1[0].isEnd = true;
		loading.hideLoading();
		myScroll.refresh();
	}
	//攻略
	function getPageStrategy(){
		config1[1].isEnd = true;
		loading.hideLoading();
		myScroll.refresh();
	}
	//酒店
	function getPageHotel(refresh){
		if( (!config1[2].isEnd || refresh) && !config1[2].isLoading ){
			Ajax.get("618325", config[2], !refresh)
				.then(function(res){
					if(res.success && res.data.list){
						var data = res.data.list;
						if(data.length < config[2].limit){
							config1[2].isEnd = true;
						}
						$("#content").find(".J_Content2")
                            [refresh ? "html" : "append"](hotelTmpl({items: data}));
						config1[2].start++;
					}else{
						if(config1[2].first){
                            $("#content").find(".J_Content2").html('<div class="no-collection">什么都木有～！</div>');
						}
                        base.hidePullUp();
                        res.msg && base.showMsg(res.msg);
					}
					myScroll.refresh();
					loading.hideLoading();
				}, function(){
					bas.showMsg("数据加载失败");
					base.hidePullUp();
					loading.hideLoading();
				});
		}else{
			myScroll.refresh();
		}
	}
	//美食
	function getPageFood(){
		config1[3].isEnd = true;
		loading.hideLoading();
		myScroll.refresh();
	}
	function addListeners(){
		$("#collection-top-nav").on("click", ".order-list-top-nav1-item", function (e) {
            var _self = $(this);
            index = _self.index();
            $("#content").find(".jcont.active").removeClass("active")
            	.end().find(".J_Content" + index).addClass("active");
            $("#collection-top-nav").find(".active").removeClass("active")
            	.end().find(".order-list-top-nav1-item:eq("+index+")").addClass("active");
            if(config1[index].isEnd){
            	base.hidePullUp();
            }else{
            	base.showPullUp();
            }
            if(config1[index].first){
            	loading.createLoading();
            	getData(index);
            }
        })
	}
});