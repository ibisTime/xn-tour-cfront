define('app/controllers/ChangeMobile', [
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/views/common/ChangeMobilePanel',
    'app/common/Global',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query, Ajax, ChangeMobilePanel, Global) {

    var changeMobilePanel = new ChangeMobilePanel();

    function initView() {
        changeMobilePanel.show();
    }

    return {
        init: function() {
            initView();
        }
    }
});