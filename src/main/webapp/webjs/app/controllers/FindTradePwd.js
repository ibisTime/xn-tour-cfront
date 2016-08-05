define('app/controllers/FindTradePwd', [
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/common/Global',
    'app/views/common/FindTradePwdPanel',
    'dojo/when',
    'app/common/Data',
    'app/controllers/Helper',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query,
            Ajax, Global, FindTradePwdPanel, when, Data, Helper) {
    var findTradePwdPanel = new FindTradePwdPanel();
    function initView() {
        var mobile = sessionStorage.getItem("m");
        if(mobile){
            findTradePwdPanel.show();
        }else{
            when(Data.getUser(), function(user) {
                if (user){
                    mobile = user.mobile;
                    sessionStorage.setItem("m", mobile);
                    findTradePwdPanel.show();
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