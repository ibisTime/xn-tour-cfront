define([
    'dojo/dom',
    'dojo/query',
    'dojo/_base/lang',
    'app/common/Ajax',
    'app/jquery/ScrollReveal',
    'dojo/on',
    'app/ux/GenericLoader',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/dom-geometry',
    'app/common/Data',
    'dojo/promise/all'
], function(dom, query, lang, Ajax, ScrollReveal, on, Loader, domConstruct, domClass, domGeometry, Data, all) {
	return {
		toTab: function(ctn) {
            var ctn = dom.byId(ctn);
            var tabs = query('.tp-tab', ctn);
            var tabWrp = ctn;
            var contents = query('.tp-content', ctn);
            tabs.on('click', function() {
                var index = tabs.indexOf(this);
                tabs.removeClass('active');
                query(this).addClass('active');
                contents.style('display', 'none');
                contents.at(index).style('display', 'block');
                on.emit(window, 'resize', {
                    bubbles: true,
                    cancelable: true
                });
            });
		},
        toInfiScroll: function(ctn, url, params, build) {
            var params = lang.mixin(params, {
                start: 0,
                limit: 10
            });
            window.sr = new scrollReveal();
            var loader1 = new Loader();
            var loadCtn = domConstruct.toDom('<div style="width: 100%; height: 20px;"></div>');
            var totalCount = 0;
            var isEnd = false;
            var ctn = dom.byId(ctn);
            var tip = domConstruct.toDom('<div class="tipctn"><div class="fa fa-hand-o-down"></div></div>');
            domClass.add(ctn, 'infi-scroll');
            domConstruct.place(tip, ctn);
            var request = function() {
                domConstruct.place(loadCtn, ctn);
                loadCtn.style.display = 'block';
                loader1.placeAt(loadCtn);
                loader1.show(loadCtn);
                Ajax.get(url, params).then(function(res) {
                    loadCtn.style.display = 'none';
                    if (res.success) {
                        build(res.data.items || []);
                        window.sr.init();
                        totalCount = res.data.totalCount;
                        if ((params.start + params.limit) >= totalCount) {
                            domConstruct.place(domConstruct.toDom('<div class="scroll-end">无更多记录</div>'), ctn);
                            tip.style.display = 'none';
                        } else {
                            tip.style.display = 'block';
                        }
                        loadData();
                    }
                });
            }
            var isVisible = function(ctn) {
                return ctn.style.display != 'none' && ctn.parentNode.style.display != 'none';
            }
            var needLoad = function() {
                var lastItem = query(ctn).children().last()[0];
                var bb = domGeometry.position(lastItem, true);
                isEnd = (params.start + params.limit) >= totalCount;
                if (!isEnd && isVisible(ctn) && bb.y < (document.documentElement.clientHeight + document.body.scrollTop + document.documentElement.scrollTop)) {
                    return true;
                } else {
                    return false;
                }
            }
            var loadData = function() {
                if (needLoad()) {
                    params.start = params.start + params.limit;
                    request();
                }
            }
            on(window, 'scroll', function() {
                loadData();
            });
            on(window, 'resize', function() {
                loadData();
            });
            request();
        }
	};
});