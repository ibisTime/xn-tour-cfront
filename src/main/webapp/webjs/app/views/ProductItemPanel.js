define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'app/views/ViewMixin',
    'dojo/on',
    'dojo/query',
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/text!./templates/ProductItemPanel.html'
], function (declare, _WidgetBase, _TemplatedMixin, ViewMixin, on, query,
             domClass, domStyle, template) {
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {

        templateString: template,

        data: '',

        type: '',

        _setDataAttr: function(data) {
            this.titleNode.innerHTML = data.title;
            this.contentNode.innerHTML = data.content;
            this.linkNode.href = data.url;
        },

        render: function() {

        },

        addListeners: function() {

        },

        isValid: function() {
        },

        buildRendering: function () {
            var me = this;
            me.inherited(arguments);
            me.render();
            me.addListeners();
        }
    });
});