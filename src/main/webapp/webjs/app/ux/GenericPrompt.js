define("app/ux/GenericPrompt", [
    'dojo/_base/declare',
    'dijit/_WidgetBase', 
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'app/common/Global',
    'dojo/query',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/on',
    'app/ux/GenericTooltip',
    'app/common/Position',
    'dojo/text!./templates/GenericPrompt.html'
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Global, 
		query, dom, domConstruct, domClass, on, Tooltip, Position, template){
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    	
    	templateString: template,
    	baseUrl: Global.baseUrl,
    	
    	msg: '',
        subMsg: '',
    	
    	type: 'warning',
    	
    	link: '',

        link2: '',
    	
    	linkText: '',

        linkText2: '',

        linkClick: '',

        _setLinkClickAttr: function(fn) {
            on(this.linkNode, 'click', fn);
        },
    	
    	_setMsgAttr: function(value) {
    		this._set('msg', value);
    		this.msgNode.innerHTML = value;
    	},

        _setSubMsgAttr: function(value) {
            this._set('subMsg', value);
            this.subMsgNode.innerHTML = value;
        },
    	
    	_setLinkAttr: function(value) {
    		this._set('link', value);
    		this.linkNode.href = Global.baseUrl + '/' + value;
    	},

        _setLink2Attr: function(value) {
            if (value) {
                this._set('link2', value);
                this.linkNode2.href = Global.baseUrl + '/' + value;
            }else{
                domConstruct.destroy(this.linkNode2);
            }
        },
    	
    	_setLinkTextAttr: function(value) {
    		this._set('linkText', value);
    		this.linkNode.innerHTML = value;
    	},

        _setLinkText2Attr: function(value) {
            this._set('linkText2', value);
            this.linkNode2.innerHTML = value;
        },
    	
    	_setTypeAttr: function(value) {
    		domClass.add(this.typeNode, 'icon-prompt-'+value);
    		if (value == 'warning') {
    			this.typeNode.innerHTML = '&#xf06a;';
    		} else if (value == 'success') {
    			this.typeNode.innerHTML = '&#xf058;';
    		} else if (value == 'error') {
    			this.typeNode.innerHTML = '&#xf057;';
    		}
    		
    	},

        show: function() {
        	this.domNode.style.display = 'block';
        },

        hide: function(destroy) {
            this.inherited(arguments);
            if (destroy) {
                this.destroy();
            }
        },
    	
    	postCreate: function() {
    		var me = this;
    		me.inherited(arguments);
    		me.show();
    	}
    	
    });
});