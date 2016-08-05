define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'app/views/ViewMixin',
    'app/common/Global',
    'dojo/on',
    'dojo/query',
    'dojo/dom-class',
    'dojo/dom-style',
    'app/common/Date',
    'app/ux/GenericTextBox',
    'app/ux/GenericDisplayBox',
    'app/ux/GenericButton',
    'app/ux/GenericComboBox',
    'dojo/store/Memory',
    'app/common/Ajax',
    'app/stores/ComboStore',
    'dojo/text!./templates/KYCPanel1.html'
], function (declare, _WidgetBase, _TemplatedMixin, ViewMixin, Global, on, query,
             domClass, domStyle, DateUtil, TextBox, DisplayBox, Button, ComboBox, Memory, Ajax, ComboStore, template) {
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {

        templateString: template,

        _setCompanyAttr: function(value) {
            if (value) {
                this.formtitleNode2.style.display = 'none';
            }
        },

        setData: function(data) {
            var me = this;
            me.companyFld.set('value', data.name);
            me.licenceFld.set('value', data.gsyyzzNo);
            me.realNameFld.set('value', data.realName);
            me.IDNoFld.set('value', data.idNo);
            me.amountFld.set('value', Global.formatAmount(data.capital, 2));
            me.addressFld.set('value', data.province);
            me.cityFld.set('value', data.city);
            Ajax.get(Global.baseUrl + '/gene/dict', {
                'type': 'id_kind'
            }).then(function(res) {
                if (res.success) {
                    me.IDTypeFld.set('item', Global.findObj(res.data, 'dkey', data.idKind));
                }
            });
            Ajax.get(Global.baseUrl + '/gene/dict', {
                'type': 'currency'
            }).then(function(res) {
                if (res.success) {
                    me.currencyTypeFld.set('item', Global.findObj(res.data, 'dkey', data.currency));
                }
            });
        },

        render: function () {
            var me = this;
            me.companyFld = new TextBox({
                label: '企业名称',
                validates: [{
                    pattern: /.+/,
                    message: '请输入企业名称'
                },{
                    pattern: function() {
                        return this.get('value').replace(/\s/g, '').length <= 64;
                    },
                    message: '企业名称最长不能超过64个字符'
                }],
                onKeyUp: function(e) {
                    var value = this.get('value').replace(/\s/g,'');
                    me.bankNameFld && me.bankNameFld.set('value', value);
                }
            });
            me.licenceFld = new TextBox({
                label: '工商执照注册号',
                validates: [{
                    pattern: /.+/,
                    message: '请输入工商执照注册号'
                }, {
                    pattern: /^[\s\S]{0,30}$/,
                    message: '工商执照注册号最长不超过30位'
                }]
            });
            me.realNameFld = new TextBox({
                label: '法人',
                validates: [{
                    pattern: /.+/,
                    message: '请输入法人'
                }, {
                    pattern: /^[\s\S]{0,15}$/,
                    message: '法人最长不超过15位'
                }]
            });
            me.IDTypeFld = new ComboBox({
                placeholder: '证件类型',
                inputWidth: 100,
                label: '法人证件',
                store: new ComboStore({
                    url: Global.baseUrl + '/gene/dict',
                    requestMethod: 'get'
                }),
                validates: [{
                    pattern: /.+/,
                    message: '请选择证件类型'
                }],
                query: {
                    'type': 'id_kind'
                },
                searchAttr: 'dkey',
                labelAttr: 'dvalue',
                editable: false
            });
            me.IDNoFld = new TextBox({
                placeholder: '证件号码',
                validates: [{
                    pattern: /.+/,
                    message: '请输入证件号码'
                }, {
                    pattern: /^[\s\S]{0,30}$/,
                    message: '证件号码最长不超过30位'
                }]
            });
            me.currencyTypeFld = new ComboBox({
                placeholder: '货币类型',
                inputWidth: 100,
                label: '注册资金',
                validates: [{
                    pattern: /.+/,
                    message: '请选择货币类型'
                }],
                store: new ComboStore({
                    url: Global.baseUrl + '/gene/dict',
                    requestMethod: 'get'
                }),
                query: {
                    'type': 'currency'
                },
                searchAttr: 'dkey',
                labelAttr: 'dvalue',
                editable: false
            });
            me.amountFld = new TextBox({
                validates: [{
                    pattern: /.+/,
                    message: '请输入注册资金'
                }],
                limitRegex: /[\d\.]/,
                isAmount: true,
                isNumber: true
            });
            me.addressFld = new TextBox({
                label: '企业地址',
                inputWidth: 150,
                placeholder: '省份/国外/直辖市',
                validates: [{
                    pattern: /.+/,
                    message: '请输入省份/国外/直辖市'
                }, {
                    pattern: /^[\s\S]{0,15}$/,
                    message: '省份/国外/直辖市最长不超过15位'
                }]
            });
            me.cityFld = new TextBox({
                inputWidth: 150,
                placeholder: '城市',
                validates: [{
                    pattern: /.+/,
                    message: '请输入城市'
                }, {
                    pattern: /^[\s\S]{0,15}$/,
                    message: '城市最长不超过15位'
                }]
            });
            if (!me.company) {
                me.bankNameFld = new DisplayBox({
                    label: '银行户名'
                });
                me.bankFld = new ComboBox({
                    //placeholder: '开户银行',
                    //inputWidth: 100,
                    label: '开户银行',
                    store: new ComboStore({
                        url: Global.baseUrl + '/gene/banks',
                        requestMethod: 'get'
                    }),
                    validates: [{
                        pattern: /.+/,
                        message: '请选择开户银行'
                    }],
                    query: {
                        'status': 1,
                        'orderColumn': 'name'
                    },
                    searchAttr: 'code',
                    labelAttr: 'name',
                    editable: false
                });
                me.subbankFld = new TextBox({
                    label: '开户支行',
                    validates: [{
                        pattern: /.+/,
                        message: '请输入开户支行'
                    }, {
                        pattern: function() {
                            return this.get('value').replace(/\s/g, '').length <= 20;
                        },
                        message: '开户支行最长不超过20位'
                    }]
                });
                me.bankAccountFld = new TextBox({
                    label: '银行账号',
                    validates: [{
                        pattern: /.+/,
                        message: '请输入银行账号'
                    }, {
                        pattern: function() {
                            return this.get('value').replace(/\s/g, '').length <= 32;
                        },
                        message: '银行账号最长不超过32位'
                    }]
                });
            }

            me.confirmBtn = new Button({
                'label': '提交',
                enter: true,
                color: '#C94749',
                hoverColor: '#ca2e35',
                width: 270,
                height: 40,
                style: {
                    marginLeft: '250px'
                }
            });

            me.companyFld.placeAt(me.i1);
            me.licenceFld.placeAt(me.i2);
            me.realNameFld.placeAt(me.i3);
            me.IDNoFld.placeAt(me.i4);
            me.IDTypeFld.placeAt(me.i4s1);
            me.amountFld.placeAt(me.i5);
            me.currencyTypeFld.placeAt(me.i5s1);
            me.addressFld.placeAt(me.i6);
            me.bankNameFld && me.bankNameFld.placeAt(me.i7);
            me.bankFld && me.bankFld.placeAt(me.i7s1);
            me.subbankFld && me.subbankFld.placeAt(me.i8);
            me.bankAccountFld && me.bankAccountFld.placeAt(me.i11);
            me.confirmBtn.placeAt(me.i9);
            me.cityFld.placeAt(me.i10);
        },

        addListeners: function() {

        },

        isValid: function() {
            return this.companyFld.checkValidity() &&
                this.licenceFld.checkValidity() &&
                this.realNameFld.checkValidity() &&
                    this.IDTypeFld.checkValidity() &&
                this.IDNoFld.checkValidity() &&
                    this.currencyTypeFld.checkValidity() &&
                this.amountFld.checkValidity() &&
                this.addressFld.checkValidity() &&
                this.cityFld.checkValidity() &&
                (this.subbankFld ? this.subbankFld.checkValidity() : true) &&
                (this.bankAccountFld ? this.bankAccountFld.checkValidity() : true);
        },

        buildRendering: function () {
            var me = this;
            me.inherited(arguments);
            me.render();
            me.addListeners();
        }
    });
});
