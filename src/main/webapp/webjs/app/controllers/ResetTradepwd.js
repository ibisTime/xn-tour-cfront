define('app/controllers/ResetTradepwd', [
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/views/common/ResetTradePwd',
    'app/common/Global',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query, Ajax, ResetTradePwd, Global) {

    var resetTradePwd = new ResetTradePwd();

    function initView() {
        resetTradePwd.show();
    }

    return {
        init: function() {
            initView();
        }
    }
});