define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/util/handlebarsHelpers',
    'app/module/scroll/scroll',
    'app/module/moveDelete/moveDelete'
], function(base, Ajax, loading, Handlebars, scroll, moveDelete) {
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
	};
	var index = base.getUrlParam("index") || 0,
		myScroll;
	var lineTmpl = __inline("../../ui/collection-line.handlebars");
	var strategyTmpl = __inline("../../ui/collection-strategy.handlebars");
	var hotelTmpl = __inline("../../ui/collection-hotel.handlebars");
	var foodTmpl = __inline("../../ui/collection-food.handlebars");

	init();
	function init(){
		initIScroll();
		addListeners();
		loading.createLoading();
		$("#collection-top-nav").find(".collection-list-top-item:eq("+index+")").click();
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
		 		base.hidePullUp();
		 		loading.hideLoading();
			}
		}, function(){
		 	base.showMsg("加载失败");
		 	base.hidePullUp();
		 	loading.hideLoading();
		});
	}
	//刷新
    function pullDownAction () {
    	config1[index].isEnd = false;
        getPageData(index, true);
    }
	function initIScroll(){
		myScroll = scroll.getInstance().getNormalScroll({
            loadMore: function() {
                getPageData(index);
            },
            refresh: function() {
                pullDownAction();
            }
        });
    }
    //线路
	function getPageData(idx, refresh){
		if( (!config1[idx].isEnd || refresh) && !config1[idx].isLoading ){
			config1[idx].isLoading = true;
			config1[idx].start = refresh && 1 || config1[idx].start;
			Ajax.get("618325", config[idx], !refresh)
				.then(function(res){
					if(res.success && res.data.list.length){
						var data = res.data.list;
						if(data.length < config[idx].limit){
							config1[idx].isEnd = true;
							base.hidePullUp();
						}
						var tmpl = idx == 0 ? lineTmpl :
										idx == 1 ? strategyTmpl :
											idx == 2 ? hotelTmpl :
												idx == 3 ? foodTmpl : lineTmpl;
						$("#content").find(".J_Content" + idx)
                            [refresh ? "html" : "append"](tmpl({items: data}));
						config1[idx].start++;
					}else{
						if(refresh){
                            $("#content").find(".J_Content"+idx).html('<div class="no-collection">什么都木有～！</div>');
						}
						config1[idx].isEnd = true;
                        base.hidePullUp();
                        res.msg && base.showMsg(res.msg);
					}
					config1[idx].first = false;
					myScroll.refresh();
					loading.hideLoading();
					config1[idx].isLoading = false;
				}, function(){
					config1[idx].first = false;
					config1[idx].isEnd = true;
					bas.showMsg("数据加载失败");
					base.hidePullUp();
					loading.hideLoading();
					config1[idx].isLoading = false;
					if(refresh){
                        $("#content").find(".J_Content"+idx).html('<div class="no-collection">什么都木有～！</div>');
                        myScroll.refresh();
					}
				});
		}
	}
	function addListeners(){
		$("#collection-top-nav").on("click", ".collection-list-top-item", function (e) {
            var _self = $(this);
            index = _self.index();
            $("#content").find(".jcont.active").removeClass("active")
            	.end().find(".J_Content" + index).addClass("active");
            $("#collection-top-nav").find(".active").removeClass("active")
            	.end().find(".collection-list-top-item:eq("+index+")").addClass("active");
            if(config1[index].isEnd){
            	base.hidePullUp();
            }else{
            	base.showPullUp();
            }
            if(config1[index].first){
            	loading.createLoading();
            	if(index == 2){
            		getModuleList()
            			.then(function(){
            				getPageData(index, true);
            			});
            	}else{
            		getPageData(index, true);
            	}
            }else{
            	myScroll.refresh();
            }
        });
        //左滑显示删除按钮事件
        moveDelete.init("content", "collection-item-a");
        //左滑后删除收藏
        $("#content").on("click", ".al_addr_del", function(e) {
            e.stopPropagation();
            var that = $(this);
            base.confirm("确定删除吗？")
                .then(function () {
                    deleteFromCollection(that);
                }, function(){});
        });
	}
    function deleteFromCollection(self){
        loading.showLoading("删除中...");
        Ajax.post("618320", {
            json: {
                toEntity: self.attr("code"),
                toType: self.attr("type"),
                type: 2,
                interacter: base.getUserId()
            }
        }).then(function(res){
            loading.hideLoading();
            if(res.success){
                self.closest(".item").remove();
            }else{
                base.showMsg(res.msg || "操作失败");
            }
        }, function(){
            loading.hideLoading();
            base.showMsg("操作失败");
        });
    }
});
