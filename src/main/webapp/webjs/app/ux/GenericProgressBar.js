define("app/ux/GenericProgressBar", [
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/_base/sniff',
    'dojo/text!./templates/GenericProgressBar.html'
], function(declare, _WidgetBase, _TemplatedMixin, domConstruct, domStyle, domClass, has, template){
    return declare([_WidgetBase, _TemplatedMixin], {

        value: 0,

        templateString: template,
        baseClass: 'genericProgressBar',
        label: '',
        labelStyle: '',
        type: '',

        _setTypeAttr: function(type) {
            this._set('type', type);
        },

        decorate: function(value) {
            var target = this.barNode,
                textEl = this.textNode,
                innerStr = 'innerHTML';
            if (has('ie')) {
                innerStr = 'innerText'; // ie trick, strange
            }
            value = value || 0;
            domClass.remove(target, 'genericProgressBarBad');
            domClass.remove(target, 'genericProgressBarNormal');
            domClass.remove(target, 'genericProgressBarGood');
            domClass.remove(target, 'genericProgressBarGreat');
            switch(parseInt(value * 2.9)) {
                case 0:
                    if (this.type == '2') {
                        domClass.add(target, 'genericProgressBarGreat');
                    } else {
                        domClass.add(target, 'genericProgressBarBad');
                    }
                    textEl[innerStr] = '低';
                    break;
                case 1:
                    domClass.add(target, 'genericProgressBarNormal');
                    textEl[innerStr] = '中';
                    break;
                case 2:
                    domClass.add(target, 'genericProgressBarGood');
                    textEl[innerStr] = '较高';
                    break;
                case 3:
                case 4:
                    if (this.type == '2') {
                        domClass.add(target, 'genericProgressBarRed');
                    } else {
                        domClass.add(target, 'genericProgressBarGreat');
                    }
                    textEl[innerStr] = '高';
                    break;
            }
            setTimeout(function() {
                domStyle.set(target, 'width', value * 100 + '%');
            }, 100);

        },

        _setTextAttr: function(value) {
            if (value) {
                this.textNode.innerHTML = value;
            }
        },

        _setValueAttr: function(value) {
            this._set('value', value);
            this.decorate(value);
        },

        _setLabelAttr: function() {
            this.labelNode = domConstruct.create('label', {innerHTML: this.params.label}, this.domNode, 'first');
            this.labelNode.style.cssFloat = 'left';
            this.labelNode.style.styleFloat = 'left';
        },

        _setLabelStyleAttr: function(value) {
            if (!this.labelNode && value) {
                this.labelNode = domConstruct.create('label', {innerHTML: this.params.label}, this.domNode, 'first');
            }
            domStyle.set(this.labelNode, value);
        },

        postCreate: function(){
            this.inherited(arguments);
        }
    });
});