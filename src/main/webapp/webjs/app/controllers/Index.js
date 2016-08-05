define("app/controllers/Index", [
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/common/Global',
    'app/controllers/Helper',
    'app/jquery/$',
    'app/ux/Swiper',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query, Ajax, Global, Helper, J, Swiper) {

    var swiperConfig = {
            node: "#index_imgs",
            time: "3000"
        };

    function initView() {
        Swiper(swiperConfig);
    }

    return {
        init: function() {
            initView();
            Helper.init();
        }
    }
});