define([
    'app/controller/base',
    'app/util/ajax',
    'iScroll',
    'app/module/loading/loading',
    'app/module/validate/validate',
    'app/util/handlebarsHelpers'
], function(base, Ajax, iScroll, loading, Validate, Handlebars) {

    var myScroll, type = base.getUrlParam("category");
    var startSelectArr = [], endSelectArr = [];
    var tmpl = __inline("../../ui/special-line.handlebars");
    var config = {
        start: 1,
        limit: 10,
        type: type,
        startSite: base.getDictList("startSite"),
        endSite: base.getDictList("endSite"),
        dateStart: '',
        status: "1"
    }, isLoading = false, isEnd = false;

    init();

    function init() {
        // if(!base.isLogin()){
        //     base.goLogin();
        // }
        loading.createLoading();
        $.when(
            base.getDictList("zero_type"),
            base.getDictList("destination_type")
        ).then(function(res1, res2){
            if(res1.success && res2.success){
                startSelectArr = res1.data;
                endSelectArr = res2.data;
                addListener();
                $("#startSite").html(getSelectData(res1.data)).trigger('change');
                $("#endSite").html(getSelectData(res2.data)).trigger('change');
                Handlebars.registerHelper('formatStartSite', function(site, options){
                    return site ? base.findObj(startSelectArr, "dkey", site)["dvalue"] : "--";
                });
                Handlebars.registerHelper('formatEndSite', function(site, options){
                    return site ? base.findObj(endSelectArr, "dkey", site)["dvalue"] : "--";
                });
            }else{
                base.showMsg(res1.msg || res2.msg);
            }
            loading.hideLoading();
        }, function(){
            loading.hideLoading();
            base.showMsg("数据加载失败");
        });
        // addListener();
        initIScroll();
    }

    function initIScroll(){
        myScroll = new iScroll('wrapper', {
            useTransition: false,
            onScrollMove: function () {
                if (this.y - 120 < this.maxScrollY) {
                    getMoreData();
                }
            }
        });
    }

    function getSelectData(arr){
        var html = "";
        $.each(arr, function(i, a){
            html += '<option value="'+a.dkey+'">'+a.dvalue+'</option>';
        });
        return html;
    }

    function getMoreData(refresh){
        if(!isEnd && !isLoading){
            config.start = refresh && 1 || config.start;
            isLoading = true;
            Ajax.get("618170", config, !refresh)
                .then(function(res){
                    if(res.success && res.data.list.length){
                        if(res.data.list.length < config.limit){
                            isEnd = true;
                            base.hidePullUp();
                        }else{
                            base.showPullUp();
                        }
                        $("#content")[refresh ? "html" : "append"](tmpl({items: res.data.list}));
                    }else{
                        if(refresh){
                            $("#content").html( '<div class="item-error">暂无专线信息</div>' );
                            myScroll.refresh();
                            isEnd = true;
                        }
                        base.hidePullUp();
                        res.msg && base.showMsg(res.msg);
                    }
                    config.start++;
                    refresh && loading.hideLoading();
                    myScroll.refresh();
                    isLoading = false;
                }, function(){
                    base.hidePullUp();
                    if(refresh){
                        $("#content").html( '<div class="item-error">暂无专线信息</div>' );
                        myScroll.refresh();
                        isEnd = true;
                        myScroll.refresh();
                    }
                    isLoading = false;
                    base.showMsg("专线信息获取失败");
                });
        }
    }

    function addListener() {
        laydate({
            elem: '#choseDate',
            choose: function(datas){ //选择日期完毕的回调
                $("#dateStart").val(datas).trigger("change");
                $("#relDate").text(datas);
            },
            isclear: false, //是否显示清空
            min: laydate.now()
        });
        var specialForm = $("#specialForm");
        specialForm.validate({
            'rules': {
                startSite: {
                    required: true
                },
                endSite: {
                    required: true
                },
                dateStart: {
                    required: true
                }
            }
        });
        $("#search").on("click", function(){
            if(specialForm.valid()){
                $("#startArea").parent().show();
                var data = specialForm.serializeObject();
                $.extend(config, data);
                isEnd = false;
                getMoreData(true);
            }
        });
        $("#startSite, #endSite").on("change", function(){
            var _self = $(this), val = _self.find('option:selected').text();
            if(this.id == "startSite")
                $("#startArea").text(val);
            else
                $("#endArea").text(val);
            _self.siblings(".st-r").html(val);
        });
        $("#dateStart").on("change", function(){
            $(this).valid();
        });
    }
});