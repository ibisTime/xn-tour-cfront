define("app/controllers/404", [
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/common/Global',
    'app/controllers/Helper',
    'app/jquery/Parallax',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query, Ajax, Global, Helper, Par) {

    function initView() {
        var scene = document.getElementById('scene');
        var parallax = new Par(scene);
    }

    return {
        init: function() {
            initView();
            Helper.init();
        }
    }
});