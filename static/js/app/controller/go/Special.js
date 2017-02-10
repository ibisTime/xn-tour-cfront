define([
    'app/controller/base',
    'app/util/ajax',
    'iScroll'
], function(base, Ajax, iScroll) {

    var myScroll;

    init();

    function init() {
        addListener();
        initIScroll();
    }

    function initIScroll(){
        myScroll = new iScroll('wrapper', {
            useTransition: false,
            onScrollMove: function () {
                console.log(this.y, this.maxScrollY);
                if (this.y - 20 < this.maxScrollY) {
                    console.log("上拉加载更多");
                }
            }
        });
    }

    function addListener() {
        var curr = new Date().getFullYear();
        var opt = {
                'date': {
                    preset: 'date',
                    dateOrder: 'yymmd D',
                    dateFormat: 'yy-mm-dd',
                    invalid: {
                        daysOfWeek: [0, 6],
                        daysOfMonth: ['5/1', '12/24', '12/25']
                    }
                }
            };
        $("#choseDate").scroller($.extend(opt["date"], {
            mode: "scroller",
            lang: "zh",
            display: "bottom",  //modal
        }));
        // $("#top-nav").on("click", ".go-top-li", function (e) {
        //     var _self = $(this), idx = _self.index();
        //     $("#content").find(".jcont").removeClass("active");
        //     $("#top-content").find(".top-nav").removeClass("active");
        //     $("#top-nav").find(".active").removeClass("active");
        //     $(".J_Content" + idx).addClass("active");
        //     myScroll.refresh();
        // })
    }
});