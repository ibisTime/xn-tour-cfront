define('app/controllers/Login', [
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/views/common/LoginWin',
    'app/common/Global',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query, Ajax, LoginWin, Global) {

    var loginWin = new LoginWin({"hideClose": "true"});

    function initView() {
        loginWin.show();
    }

    return {
        init: function() {
            initView();
        }
    }
});