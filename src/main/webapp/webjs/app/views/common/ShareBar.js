define("app/views/common/ShareBar", [
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'app/views/ViewMixin',
    'dojo/on',
    'dojo/query',
    'app/common/Fx',
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/dom-attr',
    'dojo/string',
    'app/jquery/QRCode',
    'dojo/text!./templates/ShareBar.html'
], function(declare, _WidgetBase, _TemplatedMixin, ViewMixin, on, query, Fx, domClass, domStyle, domAttr, string, QRCode, template){
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {
        templateString: template,

        info: '',

        snsShare: {
            weixin: function(info) {
                query('.share-weixin-pop', this.domNode).toggleClass('visible');
                if (!this.qrcode) {
                    this.qrcode = new QRCode("qrcode", {
                        text: location.href,
                        width: 100,
                        height: 100,
                        colorDark : "#000000",
                        colorLight : "#ffffff",
                        correctLevel : QRCode.CorrectLevel.H
                    });
                }
            },
            weibo: function(info) {
                return string.substitute("http://service.weibo.com/share/share.php?title=${title}&url=${url}&searchPic=true&pic=${image}", info);
            },
            qq: function(info) {
                return string.substitute("http://connect.qq.com/widget/shareqq/index.html?title=${title}&url=${url}&pics=${image}", info);
            },
            renren: function(info) {
                return string.substitute("http://widget.renren.com/dialog/share?resourceUrl=${url}&title=${title}&pic=${image}&description=", info);
            }
        },

        _setInfoAttr: function(val) {
            for (var i in val) {
                val[i] = encodeURIComponent(val[i]);
            }
            this._set('info', val);
        },

        render: function() {
            var me = this;
            on(me.domNode, 'a:click', function() {
                var name = domAttr.get(this, 'data-action');
                if (name == 'weixin') {
                    me.snsShare[name].call(me);
                } else {
                    window.open(me.snsShare[name](me.info), name);
                }
            });
        },

        buildRendering: function() {
            var me = this;
            me.inherited(arguments);
            me.render();
        }
    });
});