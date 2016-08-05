define('app/controllers/SetTradepwd', [
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/views/common/SetTradePwd',
    'app/common/Global',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query, Ajax, SetTradePwd, Global) {

    var setTradePwd = new SetTradePwd();

    function initView() {
        var mobile = sessionStorage.getItem("m");
        if(mobile){
            setTradePwd.show();
        }else{
            Ajax.get(Global.baseUrl + '/user', {}).then(function (response) {
                if (response.success) {
                    var data = response.data;
                    mobile = data.mobile;
                    sessionStorage.setItem("m", mobile);
                    setTradePwd.show();
                } else {
                    query("body")[0].innerHTML = "<span style='margin:80px 0;display:inline-block;font-size:30px;width: 100%;text-align: center;'>暂无数据</span>";
                }
            });
        }
    }

    return {
        init: function() {
            initView();
        }
    }
});