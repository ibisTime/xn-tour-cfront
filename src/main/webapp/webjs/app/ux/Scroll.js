define("app/ux/Scroll", [
        'dojo/query',
        'dojo/on',
    	'dojo/dom-style',
    	'dojo/dom-class',
    	'dojo/_base/fx'
],function(query,on,domStyle,domClass,fx){
	/**
	 * _config参数：
	 * innerType 内部类型（实际滚动的对象）,如ul
	 * scrollBarType 一条滚动项的类型，如li
	 * node 滚动外框的class或id等
	 * time 时间间隔
	 * scrollNum 滚动条数
	 * scrollDirection 滚动方向(up,down)，默认为down，向下滚动
	 */
	var _config = {};
	
	var scroll = function(){
		var startTop,endTop;
		var ulItem = query(_config.node+' ' + _config.innerType)[0];
		if(ulItem.top){
			if(Math.abs(ulItem.top + _config.scrollHeight) < _config.scrollDivHeight){
				startTop = ulItem.top;
				endTop = startTop + _config.scrollHeight;
			}else{
				startTop = ulItem.top;
				endTop = 0;
			}
		}else {
			startTop = 0;
			endTop = _config.scrollHeight;
		}
		
		fx.animateProperty({
			node: query(_config.node+' ' + _config.innerType)[0],
			properties: {
				'top':{start:startTop, end:endTop, unit:'px'}
			}
		}).play();
		ulItem.top = endTop;
		
		setTimeout(scroll,_config.time);
	};
	
	var _scrollLis = function(config){
		_config = config || {}; 
		if(!_config.scrollNum){
			_config.scrollNum = 1;
		}
		var scrollDivHeight = domStyle.get(query(_config.node+" " + _config.innerType)[0],'height');
		var scrollHeight = domStyle.get(query(_config.node+" "+  _config.innerType +" "+_config.scrollBarType)[0],'height')*_config.scrollNum;
		_config.scrollDivHeight = scrollDivHeight;
		if(_config.scrollDirection && _config.scrollDirection=='up'){
			_config.scrollHeight = scrollHeight;
		}else {
			_config.scrollHeight = -scrollHeight;
		}
		
		if(_config.time){
			scroll(scrollHeight,scrollDivHeight);
		}
	};
	return _scrollLis;
}); 