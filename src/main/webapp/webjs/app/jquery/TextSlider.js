define("app/jquery/TextSlider", ['app/jquery/$'
],function($){
    ;(function($) {
    $.fn.textSlider = function(settings) {
        settings = jQuery.extend({
            speed: "normal",
            line: 2,
            timer: 1000
        }, settings);

        return this.each(function() {
            $.fn.textSlider.scllor($(this), settings);
        });
    };

    $.fn.textSlider.scllor = function($this, settings) {
        var ul = $this.find('ul, table');
        var timerID;
        var li = ul.find('li, tr');
        var liHight = $(ul.find('li, tr')[0]).height();
        var upHeight = 0 - settings.line * liHight;

        var scrollUp = function() {
            ul.animate({marginTop: upHeight}, settings.speed, function() {
                for (var i = 0; i < settings.line; i++) {
                    (ul.find("li:first, tr:first")).appendTo(ul);
                }
                ul.css({marginTop: 0});
            });
        };

        var scrollDown = function() {
            ul.css({marginTop: upHeight});
            for (var i = 0; i < settings.line; i++) {
                (ul.find("li:last, tr:last")).prependTo(ul);
            }
        };

        var autoPlay = function() {
            timerID = window.setInterval(scrollUp, settings.timer);
        };

        var autoStop = function() {
            window.clearInterval(timerID);
        };

        ul.hover(autoStop, autoPlay).mouseout();
        };
    })(jQuery);
});

