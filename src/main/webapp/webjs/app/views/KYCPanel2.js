define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'app/views/ViewMixin',
    'dojo/window',
    'dojo/on',
    'dojo/query',
    'dojo/dom-class',
    'dojo/dom-attr',
    'dojo/dom-style',
    'app/ux/GenericButton',
    'app/ux/GenericTooltip',
    'dojo/text!./templates/KYCPanel2.html'
], function (declare, _WidgetBase, _TemplatedMixin, ViewMixin, win, on, query,
             domClass, domAttr, domStyle, Button, Tooltip, template) {
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {

        templateString: template,

        isLetter: false,

        _setLetterAttr: function(value) {
            var me = this;
            if (value) {
                me.sc1.style.display = 'none';
                me.sc2.style.display = 'none';
                me.sc3.style.display = 'none';
                me.sc4.style.display = 'none';
                me.sc5.style.display = 'none';
                me.sc7.style.display = 'none';
                domAttr.set(me.s1, {
                    'data-valid': 1
                });
                domAttr.set(me.s2, {
                    'data-valid': 1
                });
                domAttr.set(me.s3, {
                    'data-valid': 1
                });
                domAttr.set(me.s4, {
                    'data-valid': 1
                });
                domAttr.set(me.s5, {
                    'data-valid': 1
                });
                domAttr.set(me.s7, {
                    'data-valid': 1
                });
            } else {
                me.sc1.style.display = 'block';
                me.sc2.style.display = 'block';
                me.sc3.style.display = 'block';
                me.sc4.style.display = 'block';
                me.sc5.style.display = 'block';
                me.sc7.style.display = 'block';
            }
        },

        render: function () {
            var me = this;
            if (me.isLetter) {
                me.sc1.style.display = 'none';
                me.sc2.style.display = 'none';
                me.sc3.style.display = 'none';
                me.sc4.style.display = 'none';
                me.sc5.style.display = 'none';
                me.sc7.style.display = 'none';
                domAttr.set(me.s1, {
                    'data-valid': 1
                });
                domAttr.set(me.s2, {
                    'data-valid': 1
                });
                domAttr.set(me.s3, {
                    'data-valid': 1
                });
                domAttr.set(me.s4, {
                    'data-valid': 1
                });
                domAttr.set(me.s5, {
                    'data-valid': 1
                });
                domAttr.set(me.s7, {
                    'data-valid': 1
                });

            }
            me.prevBtn = new Button({
                'label': '上一步',
                color: '#E2E2E2',
                hoverColor: '#EDEDED',
                width: 150,
                textStyle: {
                    color: '#666666'
                },
                innerStyle: {
                    borderColor: '#C9C9C9'
                },
                style: {
                    marginLeft: '250px'
                },
                height: 40
            });
            me.confirmBtn = new Button({
                'label': '确认提交',
                enter: true,
                color: '#C94749',
                hoverColor: '#ca2e35',
                width: 220,
                height: 40
            });
            me.prevBtn.placeAt(me.i0);
            me.confirmBtn.placeAt(me.i1);
        },

        addListeners: function() {
            var me = this;
            me.files = [];
            me.files.push(me.s1);
            me.files.push(me.s2);
            me.files.push(me.s3);
            me.files.push(me.s4);
            me.files.push(me.s5);
            me.files.push(me.s6);
            //me.files.push(me.s7);
            on(me.domNode, 'input[type=file]:change', function(e) {
                var file = this.files[0];
                var index = domAttr.get(this, 'data-dojo-attach-point').slice(1);
                if (!file) {
                    domAttr.set(me['s' + index], {
                        'data-valid': 0
                    });
                }
                if(!/image.*/.test(file.type)){
                    Tooltip.show("文件必须为图片", this, 'warning');
                    return false;
                }
                if(file.size / 1024 / 1024 > 3){
                    Tooltip.show("文件必须小于3M", this, 'warning');
                    return false;
                }
                var reader = new FileReader();
                reader.onload = function(e){
                    me['s' + index].src = this.result;
                    domAttr.set(me['s' + index], {
                        'data-valid': 1
                    });
                };
                reader.readAsDataURL(file);
            });
        },

        isValid: function() {
            var res = true;
            for (var i = 0, len = this.files.length; i < len; i++) {
                if (!domAttr.get(this.files[i], 'data-valid')) {
                    win.scrollIntoView(this.files[i]);
                    Tooltip.show('请选择文件上传', this.files[i], 'warning');
                    res = false;
                    break;
                }
            }
            return res;
        },

        setData: function(data) {
            var me = this;
            if (data.gsyyzzPicture) {
                me.s1.src = data.gsyyzzPicture;
                domAttr.set(me.s1, {
                    'data-valid': 1
                });
            }
            if (data.zzjgdmzPicture) {
                me.s2.src = data.zzjgdmzPicture;
                domAttr.set(me.s2, {
                    'data-valid': 1
                });
            }
            if (data.swdjzPicture) {
                me.s3.src = data.swdjzPicture;
                domAttr.set(me.s3, {
                    'data-valid': 1
                });
            }
            if (data.frPicture) {
                me.s4.src = data.frPicture;
                domAttr.set(me.s4, {
                    'data-valid': 1
                });
            }
            if (data.dzzPicture) {
                me.s5.src = data.dzzPicture;
                domAttr.set(me.s5, {
                    'data-valid': 1
                });
            }
            if (data.sqghPicture) {
                me.s6.src = data.sqghPicture;
                domAttr.set(me.s6, {
                    'data-valid': 1
                });
            }
            if (data.otherPicture) {
                me.s7.src = data.otherPicture;
            }
        },

        //convertImgToBase64: function(url, callback, outputFormat){
        //    var canvas = document.createElement('CANVAS'),
        //        ctx = canvas.getContext('2d'),
        //        img = new Image();
        //    img.crossOrigin = '*';
        //    img.onload = function(){
        //        canvas.height = img.height;
        //        canvas.width = img.width;
        //        ctx.drawImage(img,0,0);
        //        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        //        callback.call(this, dataURL);
        //        canvas = null;
        //    };
        //    img.src = url;
        //},

        buildRendering: function () {
            var me = this;
            me.inherited(arguments);
            me.render();
            me.addListeners();
        }
    });
});