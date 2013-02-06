/**
 * Basic Primitives orgEditor Demo v1.0.27
 *
 * (c) Adeltech Productions Inc
 *
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 */


(function () {

	var namespace = function (name) {
		var namespaces = name.split('.'),
			namespace = window,
			index;
		for (index = 0; index < namespaces.length; index += 1) {
			namespace = namespace[namespaces[index]] = namespace[namespaces[index]] || {};
		}
		return namespace;
	};

	namespace("primitives.orgeditor");

}());
primitives.orgeditor.updateTips = function (tips, text) {
	tips.text(text)
		.addClass("ui-state-highlight");
};

primitives.orgeditor.checkLength = function (tips, element, text, min, max) {
	var result = true;
	if (element.val().length > max || element.val().length < min) {
		element.addClass("ui-state-error");
		primitives.orgeditor.updateTips(tips, "Length of " + text + " must be between " +
			min + " and " + max + ".");
		result = false;
	}
	return result;
};

primitives.orgeditor.checkColor = function (tips, element, text) {
	var result,
		value = primitives.common.getColorHexValue(element.val()),
		checkHexColor = /^#[0-9a-f]{3}([0-9a-f]{3})?$/i;
	if (value == null || !checkHexColor.test(value)) {
		element.addClass("ui-state-error");
		primitives.orgeditor.updateTips(tips, text + " has wrong color value: " + value);
		result = false;
	} else {
		element.val(value);
		result = true;
	}
	return result;
};
/*
	Enum: primitives.orgeditor.TemplateName
		Defines available templates.
	
	Default - Built in template.
	Contact - Extended version of default template having phone & email fields.
	PlainDescription - Template has only title & description fields.
*/
primitives.orgeditor.TemplateName =
{
	Default: "",
	Contact: "contactTemplate",
	PlainDescription: "plainDescriptionTemplate"
};
primitives.orgeditor.UserTemplate = function () {
	this.name = "";

};

primitives.orgeditor.UserTemplate.prototype.getTemplate = function () {
	var result = "";

	return result;
};

primitives.orgeditor.UserTemplate.prototype.onRender = function (event, data) {

};
primitives.orgeditor.UserTemplateContact = function () {
	this.name = "contactTemplate";

};

primitives.orgeditor.UserTemplateContact.prototype = new primitives.orgeditor.UserTemplate();

primitives.orgeditor.UserTemplateContact.prototype.getTemplate = function () {
	var result = new primitives.orgdiagram.TemplateConfig(),
		itemTemplate;
	result.name = this.name;
	result.itemSize = new primitives.common.Size(180, 120);
	result.minimizedItemSize = new primitives.common.Size(4, 4);
	result.highlightPadding = new primitives.common.Thickness(2, 2, 2, 2);


	itemTemplate = jQuery(
	  '<div class="bp-item bp-corner-all bt-item-frame">'
		+ '<div name="titleBackground" class="bp-item bp-corner-all bp-title-frame" style="top: 2px; left: 2px; width: 176px; height: 20px;">'
			+ '<div name="title" class="bp-item bp-title" style="top: 3px; left: 6px; width: 168px; height: 18px;">'
			+ '</div>'
		+ '</div>'
		+ '<div class="bp-item bp-photo-frame" style="top: 26px; left: 2px; width: 50px; height: 60px;">'
			+ '<img name="photo" style="height=60px; width=50px;" />'
		+ '</div>'
		+ '<div name="phone" class="bp-item" style="top: 26px; left: 56px; width: 122px; height: 18px; font-size: 12px;"></div>'
		+ '<div name="email" class="bp-item" style="top: 44px; left: 56px; width: 122px; height: 18px; font-size: 12px;"></div>'
		+ '<div name="description" class="bp-item" style="top: 62px; left: 56px; width: 122px; height: 36px; font-size: 10px;"></div>'
		+ '<a name="readmorelabel" class="bp-item bp-readmore" style="top: 102px; left: 4px; width: 172px; height: 16px; font-size: 10px;"></a>'
	+ '</div>'
	).css({
		width: result.itemSize.width + "px",
		height: result.itemSize.height + "px"
	});
	result.itemTemplate = itemTemplate.wrap('<div>').parent().html();

	return result;
};

primitives.orgeditor.UserTemplateContact.prototype.onRender = function (event, data, config) {
	var itemConfig = data.context,
		photoElement,
		titleElement,
		titleBackground,
		index,
		len,
		fields,
		field,
		newValue,
		element,
		readmorelabel;

	readmorelabel = data.element.find("[name=readmorelabel]");

	switch (data.renderingMode) {
		case primitives.common.RenderingMode.Create:
			/* Initialize widgets here */
			readmorelabel.click(function (e) {
				/* Block mouse click propogation in order to avoid layout updates before server postback*/
				primitives.common.stopPropagation(e);
			});
			break;
		case primitives.common.RenderingMode.Update:
			/* Update widgets here */
			break;
	}

	data.element.find("[name=photo]").attr({ "src": itemConfig.image });
	data.element.find("[name=titleBackground]").css({ "background": itemConfig.itemTitleColor });
	data.element.find("[name=title]").css({ "color": primitives.common.highestContrast(itemConfig.itemTitleColor, config.itemTitleSecondFontColor, config.itemTitleFirstFontColor) });

	fields = ["title", "description", "phone", "email", "readmorelabel"];
	for (index = 0, len = fields.length; index < len; index += 1) {
		field = fields[index];

		element = data.element.find("[name=" + field + "]");
		newValue = itemConfig[field] != null ? itemConfig[field] : "";
		if (element.text() !== newValue) {
			element.text(newValue);
		}
	}

	readmorelabel.css({"visibility": (!primitives.common.isNullOrEmpty(itemConfig.readmorelabel) ? "inherit" : "hidden")});
	readmorelabel.attr({"href": itemConfig.readmoreurl});

};
primitives.orgeditor.UserTemplateDescription = function () {
	this.name = "plainDescriptionTemplate";

};

primitives.orgeditor.UserTemplateDescription.prototype = new primitives.orgeditor.UserTemplate();

primitives.orgeditor.UserTemplateDescription.prototype.getTemplate = function () {
	var result = new primitives.orgdiagram.TemplateConfig(),
		itemTemplate;
	result.name = this.name;
	result.itemSize = new primitives.common.Size(120, 100);
	result.minimizedItemSize = new primitives.common.Size(4, 4);
	result.highlightPadding = new primitives.common.Thickness(2, 2, 2, 2);


	itemTemplate = jQuery(
	  '<div class="bp-item bp-corner-all bt-item-frame">'
		+ '<div name="titleBackground" class="bp-item bp-corner-all bp-title-frame" style="top: 2px; left: 2px; width: 116px; height: 20px;">'
			+ '<div name="title" class="bp-item bp-title" style="top: 3px; left: 6px; width: 108px; height: 18px;">'
			+ '</div>'
		+ '</div>'
		+ '<div name="description" class="bp-item" style="top: 26px; left: 4px; width: 112px; height: 56px; font-size: 10px;"></div>'
		+ '<a name="readmorelabel" class="bp-item bp-readmore" style="top: 82px; left: 4px; width: 112px; height: 16px; font-size: 10px;"></a>'
	+ '</div>'
	).css({
		width: result.itemSize.width + "px",
		height: result.itemSize.height + "px"
	});
	result.itemTemplate = itemTemplate.wrap('<div>').parent().html();

	return result;
};

primitives.orgeditor.UserTemplateDescription.prototype.onRender = function (event, data, config) {
	var itemConfig = data.context,
		titleElement,
		titleBackground,
		index,
		len,
		fields,
		field,
		newValue,
		element,
		readmorelabel;

	readmorelabel = data.element.find("[name=readmorelabel]");
	switch (data.renderingMode) {
		case primitives.common.RenderingMode.Create:
			/* Initialize widgets here */
			readmorelabel.click(function (e) {
				/* Block mouse click propogation in order to avoid layout updates before server postback*/
				primitives.common.stopPropagation(e);
			});
			break;
		case primitives.common.RenderingMode.Update:
			/* Update widgets here */
			break;
	}

	data.element.find("[name=titleBackground]").css({ "background": itemConfig.itemTitleColor });
	data.element.find("[name=title]").css({ "color": primitives.common.highestContrast(itemConfig.itemTitleColor, config.itemTitleSecondFontColor, config.itemTitleFirstFontColor) });

	fields = ["title", "description", "readmorelabel"];
	for (index = 0, len = fields.length; index < len; index += 1) {
		field = fields[index];

		element = data.element.find("[name=" + field + "]");
		newValue = itemConfig[field] != null ? itemConfig[field] : "";
		if (element.text() !== newValue) {
			element.text(newValue);
		}
	}
	readmorelabel.css(readmorelabel, {"visibility": (!primitives.common.isNullOrEmpty(itemConfig.readmorelabel) ? "inherit" : "hidden")});
	readmorelabel.attr(readmorelabel, {"href": itemConfig.readmoreurl});
};
/*
	Class: primitives.orgeditor.Config
		Organizational Diagram Editor
		options class.
*/
primitives.orgeditor.Config = function () {
	this.classPrefix = "bporgeditor";

	/*
	Event: onSave
		Notifies about any changes in diagram.

	*/
	this.onSave = null;

	/*
		Property: editMode
			Defines widget's edit mode. 

		Default:
			true
	*/
	this.editMode = true;

	/*
		Property: pageFitMode
			Defines the way diagram is fit into page. 

		Default:
			<primitives.orgdiagram.PageFitMode.FitToPage>
	*/
	this.pageFitMode = primitives.orgdiagram.PageFitMode.FitToPage;

	/*
		Property: verticalAlignment
			Defines items vertical alignment relative to each other within one level of hierarchy. 
			It does not affect levels having same size items.
		
		Default:
			<primitives.common.VerticalAlignmentType.Middle>
	*/
	this.verticalAlignment = primitives.common.VerticalAlignmentType.Middle;

	/*
		Property: horizontalAlignment
			Defines items horizontal alignment relative to their parent. 
		
		Default:
			<primitives.common.HorizontalAlignmentType.Center>
	*/
	this.horizontalAlignment = primitives.common.HorizontalAlignmentType.Center;

	/*
	Property: connectorType
		   Defines connector lines style for dot and line elements.
		
		Default:
			<primitives.orgdiagram.ConnectorType.Angular>
	*/
	this.connectorType = primitives.orgdiagram.ConnectorType.Angular;

	/*
	Property: rootItem
		This is the root of items hierarchy.
	*/
	this.rootItem = null;

	/*
	Property: selectionPathMode
		Defines the way items between rootItem and selectedItems displayed in diagram. 
		
	Default:
		<primitives.orgdiagram.SelectionPathMode.FullStack>
	*/
	this.selectionPathMode = primitives.orgdiagram.SelectionPathMode.FullStack;

	/*
	Property: minimalVisibility
		Defines the way diagram collapses items when it has not enough space to fit all items. 
		
	Default:
		<primitives.orgdiagram.Visibility.Dot>
	*/
	this.minimalVisibility = primitives.orgdiagram.Visibility.Dot;

	/*
	Property: defaultTemplateName
		This is template name used to render items having no <primitives.orgdiagram.ItemConfig.templateName> defined.


		See Also:
		<primitives.orgdiagram.TemplateConfig>
		<primitives.orgdiagram.Config.templates> collection property.
	*/
	this.defaultTemplateName = null;

	/*
	method: update
		Makes full redraw of diagram contents reevaluating all options.
	
	Parameters:
		updateMode: Parameter defines the way diagram 
		should be updated  <primitives.orgdiagram.UpdateMode>. 
		For example <primitives.orgdiagram.UpdateMode.Refresh> updates only 
		items and selection reusing existing elements where ever it is possible.
		
	*/

	/*
	Property: itemTitleFirstFontColor
	This property customizes default template title font color. 
	Item background color sometimes play a role of logical value and 
	can vary over a wide range, so as a result title having 
	default font color may become unreadable. Widgets selects the best font color 
	between this option and <primitives.orgdiagram.Config.itemTitleSecondFontColor>.

	See Also:
	<primitives.orgdiagram.ItemConfig.itemTitleColor>
	<primitives.orgdiagram.Config.itemTitleSecondFontColor>
	<primitives.common.highestContrast>

	*/
	this.itemTitleFirstFontColor = primitives.common.Colors.White;

	/*
	Property: itemTitleSecondFontColor
	Default template title second font color.
	*/
	this.itemTitleSecondFontColor = primitives.common.Colors.Navy;

	/*
	Property: childrenPlacementType
		Defines children placement form.
	*/
	this.childrenPlacementType = primitives.orgdiagram.ChildrenPlacementType.Horizontal;

	/*
	Property: leavesPlacementType
		Defines leaves placement form. Leaves are children having no sub children.
	*/
	this.leavesPlacementType = primitives.orgdiagram.ChildrenPlacementType.Matrix;

	/*
	Property: normalLevelShift
		Defines interval after level of items in  diagram having items in normal state.

	See also:
		<primitives.common.RenderEventArgs>
	*/
	this.normalLevelShift = 20;
	/*
	Property: dotLevelShift
		Defines interval after level of items in  diagram having items in dot state.
	*/
	this.dotLevelShift = 10;
	/*
	Property: lineLevelShift
		Defines interval after level of items in  diagram having items in line state.
	*/
	this.lineLevelShift = 10;

	/*
	Property: normalItemsInterval
		Defines interval between items at the same level in  diagram having items in normal state.
	*/
	this.normalItemsInterval = 20;
	/*
	Property: dotItemsInterval
		Defines interval between items at the same level in  diagram having items in dot state.
	*/
	this.dotItemsInterval = 10;
	/*
	Property: lineItemsInterval
		Defines interval between items at the same level in  diagram having items in line state.
	*/
	this.lineItemsInterval = 5;
};
/*
	Class: jQuery.bpOrgEditor
		jQuery UI Organizational Diagram Editor 
*/
primitives.orgeditor.Controller = function () {
	this.widgetEventPrefix = "bporgeditor";

	this.options = new primitives.orgeditor.Config();

	this.formsPlaceholder = null;
	this.orgDiagram = null;
	this.dlgOrgChart = null;
	this.dlgItemConfig = null;
	this.dlgConfig = null;
	this.dlgCodeMirror = null;

	this.dlgMessage = null;

	this.selectedItem = null;

	this.fieldsToClone = ["pageFitMode", "orientationType", "verticalAlignment", "horizontalAlignment", "connectorType", "minimalVisibility", "selectionPathMode",
					"leavesPlacementType", "childrenPlacementType",
					"normalLevelShift", "dotLevelShift", "lineLevelShift",
					"normalItemsInterval", "dotItemsInterval", "lineItemsInterval",
					"itemTitleFirstFontColor", "itemTitleSecondFontColor",
					"defaultTemplateName",
					"rootItem"];

	this.userTemplates = {
		contactTemplate: new primitives.orgeditor.UserTemplateContact(),
		plainDescriptionTemplate: new primitives.orgeditor.UserTemplateDescription()
	};
};

primitives.orgeditor.Controller.prototype._create = function () {
	this.element
			.addClass("bp-item");

	this._createLayout();
};

primitives.orgeditor.Controller.prototype.destroy = function () {
	this._cleanLayout();
};

primitives.orgeditor.Controller.prototype._createLayout = function () {
	var panelSize = new primitives.common.Rect(0, 0, this.element.outerWidth(), this.element.outerHeight()),
		self = this,
		content,
		contentString = "";

	if (this.options.editMode) {
		contentString += '	<div name="forms-placeholder" class="bp-item" style="overflow:hidden; display:none;">'
				+ '		<div name="dialog-confirm" class="dialog-form" title="Delete?">'
				+ '			<p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span>This item and all its sub-items will be deleted. Are you sure?</p>'
				+ '		</div>'
				+ '		<div name="dialog-message" title="Warning">'
				+ '			<p><span class="ui-icon ui-icon-circle-check" style="float: left; margin: 0 7px 50px 0;"></span>'
				+ '				You cannot remove or move root item in organizational chart.'
				+ '			</p>'
				+ '		</div>'
				+ '		<div name="config-form"></div>'
				+ '		<div name="codemirror-form" style="margin:0; padding:0;"></div>'
				+ '		<div name="itemconfig-form"></div>'
				+ '		<div name="orgchart-form"></div>'
				+ ' </div>';
	}

	contentString += '	<div name="orgchart-widget" class="bp-item" style="overflow:hidden; padding: 0px; margin: 0px; border: 0px;"></div>';

	if (this.options.editMode) {
		contentString += '<div  style="padding: 0px; margin:10px;"><div name="options-button">Options</div><div name="json-button">JSON</div></div>';
	}

	content = jQuery(contentString).addClass(this.widgetEventPrefix);
	this.element.append(content);

	this._createWidgets(this.element);
};

primitives.orgeditor.Controller.prototype._createWidgets = function () {
	var panelSize = new primitives.common.Rect(0, 0, this.element.innerWidth(), this.element.innerHeight()),
		position = panelSize.getCSS(),
		self = this,
		config;

	this.formsPlaceholder = this.element.find("[name=forms-placeholder]");
	this.formsPlaceholder.css(position);

	this.dlgOrgChart = this.element.find("[name=orgchart-form]").bpDlgOrgDiagram();
	this.dlgConfig = this.element.find("[name=config-form]").bpDlgConfig();

	if (window.CodeMirror != null) {
		this.dlgCodeMirror = this.element.find("[name=codemirror-form]").bpDlgCodeMirror();
	}
	this.dlgItemConfig = this.element.find("[name=itemconfig-form]").bpDlgItemConfig();

	this.dlgMessage = this.element.find("[name=dialog-message]");
	this.dlgConfirm = this.element.find("[name=dialog-confirm]");

	this.orgDiagram = this.element.find("[name=orgchart-widget]");
	this.orgDiagram.css(position);
	this.orgDiagram.orgDiagram();
	this.orgDiagram.orgDiagram("option", this._getOrgDiagramConfig());
	this.orgDiagram.orgDiagram("update");
	this.element.find("[name=options-button]").button().click(function () { self._onOptionsButtonClick(); });
	this.element.find("[name=json-button]").button().click(function () { self._onJsonButtonClick(); });
};

primitives.orgeditor.Controller.prototype._onOptionsButtonClick = function () {
	var self = this,
		index,
		len,
		fieldToClone,
		options;

	self.dlgConfig.bpDlgConfig("option", {
		"cancel": function () { },
		"update": function () {
			options = {};
			for (index = 0, len = self.fieldsToClone.length; index < len; index += 1) {
				fieldToClone = self.fieldsToClone[index];
				options[fieldToClone] = self.options[fieldToClone];
			}
			self.orgDiagram.orgDiagram("option", options);
			self.orgDiagram.orgDiagram("update");
			self._trigger("onSave");
		}
	});
	self.dlgConfig.bpDlgConfig("open", self.options);
};

primitives.orgeditor.Controller.prototype._onJsonButtonClick = function () {
	var self = this,
		index,
		len,
		fieldToClone,
		options;

	if (this.dlgCodeMirror != null) {
		self.dlgCodeMirror.bpDlgCodeMirror("option", {
			"cancel": function () { },
			"update": function (event, content) {
				options = {};
				for (index = 0, len = self.fieldsToClone.length; index < len; index += 1) {
					fieldToClone = self.fieldsToClone[index];
					self.options[fieldToClone] = content[fieldToClone];
					options[fieldToClone] = content[fieldToClone];
				}
				options.cursorItem = options.rootItem;
				self.orgDiagram.orgDiagram("option", options);
				self.orgDiagram.orgDiagram("update");
				self._trigger("onSave");
			}
		});

		options = {};
		for (index = 0, len = self.fieldsToClone.length; index < len; index += 1) {
			fieldToClone = self.fieldsToClone[index];
			options[fieldToClone] = self.options[fieldToClone];
		}
		self.dlgCodeMirror.bpDlgCodeMirror("open", JSON.stringify(options, undefined, 2));
	} else {
		alert("In order to enable this function you have to download latest version of Basic Primitives Joomla modules.");
	}
};

primitives.orgeditor.Controller.prototype._cleanLayout = function () {
	this.element.find("." + this.widgetEventPrefix).remove();
};

primitives.orgeditor.Controller.prototype._updateLayout = function () {
	var panelSize = new primitives.common.Rect(0, 0, this.element.innerWidth(), this.element.innerHeight());
	this.formsPlaceholder.css(panelSize.getCSS());
	this.orgDiagram.css(panelSize.getCSS());
};

 
primitives.orgeditor.Controller.prototype.update = function (updateMode) {
	this._updateLayout();
	this.orgDiagram.orgDiagram("update", updateMode);
};

primitives.orgeditor.Controller.prototype._getOrgDiagramConfig = function () {
	var self = this,
		templates = [],
		key,
		index,
		len,
		fieldToClone,
		result;

	for (key in this.userTemplates) {
		if (this.userTemplates.hasOwnProperty(key)) {
			templates.push(this.userTemplates[key].getTemplate());
		}
	}

	result = new primitives.orgdiagram.Config();

	for (index = 0, len = self.fieldsToClone.length; index < len; index += 1) {
		fieldToClone = self.fieldsToClone[index];
		result[fieldToClone] = self.options[fieldToClone];
	}
	result.cursorItem = self.options.rootItem;

	result.hasButtons = primitives.common.Enabled.False;
	result.hasSelectorCheckbox = primitives.common.Enabled.False;
	result.templates = templates;
	result.onItemRender = function (e, data) { self.userTemplates[data.templateName].onRender(e, data, self.options); };
	result.onMouseClick = function (e, data) { self._onMouseClick(e, data); };
	
	if (this.options.editMode) {
		result.hasButtons = primitives.common.Enabled.Auto;
		result.hasSelectorCheckbox = primitives.common.Enabled.True;
		result.buttons = [
				new primitives.orgdiagram.ButtonConfig("properties", "ui-icon-person", "Edit"),
				new primitives.orgdiagram.ButtonConfig("delete", "ui-icon-trash", "Delete"),
				new primitives.orgdiagram.ButtonConfig("add", "ui-icon-plus", "Add"),
				new primitives.orgdiagram.ButtonConfig("move", "ui-icon-arrow-4", "Move")
		];
		result.onButtonClick = function (e, data) { self._onButtonClick(e, data); };
	}

	return result;
};

primitives.orgeditor.Controller.prototype._onMouseClick = function (e, data) {
	if (!this.options.editMode) {
		var cursorItem = this.orgDiagram.orgDiagram("option", "cursorItem");
		if (cursorItem === data.context && !primitives.common.isNullOrEmpty(cursorItem.readmoreurl)) {
			window.location.href = cursorItem.readmoreurl;
		}
	}
};

primitives.orgeditor.Controller.prototype._onButtonClick = function (e, data) {
	var self = this,
		popupConfig,
		index,
		len,
		fieldToClone;

	switch (data.name) {
		case "delete":
			if (data.parentItem === null) {
				self.dlgMessage.dialog({
					modal: true,
					buttons: {
						Ok: function () {
							jQuery(this).dialog("close");
						}
					}
				});
			}
			else {
				self.dlgConfirm.dialog({
					resizable: false,
					height: 240,
					modal: true,
					buttons: {
						"Delete": function () {
							var position = primitives.common.indexOf(data.parentItem.items, data.context);
							data.parentItem.items.splice(position, 1);
							self.orgDiagram.orgDiagram("update", primitives.orgdiagram.UpdateMode.Refresh);
							jQuery(this).dialog("close");
							self._trigger("onSave");
						},
						Cancel: function () {
							jQuery(this).dialog("close");
						}
					}
				});
			}
			break;
		case "properties":
			self.dlgItemConfig.bpDlgItemConfig("option", {
				"cancel": function () { },
				"update": function () {
					self.orgDiagram.orgDiagram("update", primitives.orgdiagram.UpdateMode.Refresh);
					self.options.rootItem = self.orgDiagram.orgDiagram("option", "rootItem");
					self._trigger("onSave");
				}
			});
			self.dlgItemConfig.bpDlgItemConfig("open", data.context);
			break;
		case "add":
			self.selectedItem = data.context;
			self.dlgItemConfig.bpDlgItemConfig("option", {
				"cancel": function () { },
				"update": function (element, newItemConfig) {
					self.selectedItem.items.push(newItemConfig);
					self.orgDiagram.orgDiagram("update", primitives.orgdiagram.UpdateMode.Refresh);
					self._trigger("onSave");
				}
			});
			self.dlgItemConfig.bpDlgItemConfig("open");
			break;
		case "move":
			if (data.parentItem === null) {
				self.dlgMessage.dialog({
					modal: true,
					buttons: {
						Ok: function () {
							jQuery(this).dialog("close");
						}
					}
				});
			}
			else {
				self.selectedItem = data.context;
				self.dlgOrgChart.bpDlgOrgDiagram("option", {
					"cancel": function () { },
					"update": function (element, newParentConfig) {

						var position = primitives.common.indexOf(data.parentItem.items, data.context);
						if (position >= 0) {
							data.parentItem.items.splice(position, 1);
						}
						newParentConfig.items.push(data.context);
						self.orgDiagram.orgDiagram("update", primitives.orgdiagram.UpdateMode.Refresh);
						self._trigger("onSave");
					}
				});

				popupConfig = new primitives.orgdiagram.Config();
				for (index = 0, len = self.fieldsToClone.length; index < len; index += 1) {
					fieldToClone = self.fieldsToClone[index];
					popupConfig[fieldToClone] = self.options[fieldToClone];
				}
				popupConfig.hasButtons = primitives.common.Enabled.False;
				popupConfig.hasSelectorCheckbox = primitives.common.Enabled.False;
				popupConfig.rootItem = self.options.rootItem;
				popupConfig.cursorItem = self.orgDiagram.orgDiagram("option", "cursorItem");

				self.dlgOrgChart.bpDlgOrgDiagram("open", popupConfig, data.context);
			}
			break;
	}
};

primitives.orgeditor.Controller.prototype._setOption = function (key, value) {
	jQuery.Widget.prototype._setOption.apply(this, arguments);
};

/*
	jQuery UI Widget
	Organizational Diagram Editor

	Depends:
		jquery.ui.core.js
		jquery.ui.widget.js
		jquery.ui.button
		jquery.ui.buttonset
		jquery.ui.autocomplete
		jquery.ui.dialog
*/
(function ($) {
	$.widget("ui.bpOrgEditor", new primitives.orgeditor.Controller());
}(jQuery));
/*
    Class: primitives.orgeditor.DlgCodeMirrorOptions
	    Organizational Diagram CodeMirror dialog 
		options class.
*/
primitives.orgeditor.DlgCodeMirrorOptions = function () {
	this.cancel = null;
	this.update = null;
};
/*
    Class: primitives.orgeditor.DlgCodeMirror
	    Organizational Diagram Config dialog
		Controller
*/
primitives.orgeditor.DlgCodeMirror = function () {
	this.widgetEventPrefix = "bpdlgjson";

	this.options = new primitives.orgeditor.DlgCodeMirrorOptions();

	this.placeholder = null;
	this.content = null;

	this.editor = null;
};

primitives.orgeditor.DlgCodeMirror.prototype._create = function () {
	this._createLayout();
};

primitives.orgeditor.DlgCodeMirror.prototype.destroy = function () {
	this._cleanLayout();
};

primitives.orgeditor.DlgCodeMirror.prototype._createLayout = function () {
	var panelSize = new primitives.common.Rect(0, 0, this.element.outerWidth(), this.element.outerHeight()),
		self = this,
		content,
		contentString,
		enumKey,
		enumItem;

	contentString += '<div style="overflow: hidden; padding:0; margin:0; border: 0px;">' +
		'<form><textarea name="content"></textarea></form>' +
		'</div>';

	this.placeholder = jQuery(contentString).addClass(this.widgetEventPrefix);
	this.element.append(this.placeholder);
	this.element.addClass("dialog-form");

	this.content = this.element.find("[name=content]");
};

primitives.orgeditor.DlgCodeMirror.prototype._updateLayout = function () {
	var panelSize = new primitives.common.Rect(0, 0, this.element.outerWidth(), this.element.outerHeight()),
		codeMirror = this.element.find(".CodeMirror");
	this.placeholder.css(panelSize.getCSS());
	codeMirror.css(panelSize.getCSS());

	this.editor.setSize(panelSize.width + "px", panelSize.height + "px");
};

primitives.orgeditor.DlgCodeMirror.prototype._cleanLayout = function () {
	this.element.empty();
	this.element.removeClass("dialog-form");
};

primitives.orgeditor.DlgCodeMirror.prototype.open = function (content) {
	var bValid = true,
		self = this;

	this.content.val(content);
	this.editor = CodeMirror.fromTextArea(this.content[0], { lineNumbers: true, matchBrackets: true });

	this.element.dialog({
		autoOpen: false,
		minWidth: 640,
		minHeight: 480,
		modal: true,
		title: "Organizational Chart Data",
		buttons: {
			"Save": function () {
				var bValid = true;

				if (bValid) {

					content = JSON.parse(self.editor.getValue());
					jQuery(this).dialog("close");

					self._trigger("update", null, content);
				}
			},
			Cancel: function () {
				jQuery(this).dialog("close");
				self._trigger("cancel", null);
			}
		},
		resizeStop: function (event, ui) {
			self._updateLayout();
		},
		close: function () {
			self.editor.toTextArea();
			self._trigger("cancel", null);
		},
		open: function (event, ui) {
			self._updateLayout();
		}
	}).dialog("open");
};

primitives.orgeditor.DlgCodeMirror.prototype._setOption = function (key, value) {
	jQuery.Widget.prototype._setOption.apply(this, arguments);
};
/*
 * jQuery UI Widget
 * Organizational Diagram Editor
 * CodeMirror Dialog Widget
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.ui.button
 *  jquery.ui.buttonset
 *  jquery.ui.autocomplete
 *	jquery.ui.dialog
 */
(function ($) {
	$.widget("ui.bpDlgCodeMirror", new primitives.orgeditor.DlgCodeMirror());
}(jQuery));
/*
	Class: primitives.orgeditor.DlgConfigOptions
		Organizational Diagram Config dialog 
		options class.
*/
primitives.orgeditor.DlgConfigOptions = function () {
	this.cancel = null;
	this.update = null;
};
/*
	Class: primitives.orgeditor.DlgConfig
		Organizational Diagram Config dialog
		Controller
*/
primitives.orgeditor.DlgConfig = function () {
	this.widgetEventPrefix = "bpdlgconfig";

	this.options = new primitives.orgeditor.DlgConfigOptions();

	this.pageFitMode = null;
	this.orientationType = null;
	this.verticalAlignment = null;
	this.horizontalAlignment = null;
	this.connectorType = null;
	this.minimalVisibility = null;
	this.selectionPathMode = null;
	this.childrenPlacementType = null;
	this.leavesPlacementType = null;
	this.defaultTemplateName = null;

	this.itemTitleFirstFontColor = null;
	this.itemTitleSecondFontColor = null;

	this.tips = null;

	this.enums = {
		pageFitMode: { name: primitives.orgdiagram.PageFitMode, title: "Page Fit Mode", isString: false },
		orientationType: { name: primitives.orgdiagram.OrientationType, title: "Orientation", isString: false },
		verticalAlignment: { name: primitives.common.VerticalAlignmentType, title: "Items Vertical Alignment", isString: false },
		horizontalAlignment: { name: primitives.common.HorizontalAlignmentType, title: "Items Horizontal Alignment", isString: false },
		connectorType: { name: primitives.orgdiagram.ConnectorType, title: "Connectors", isString: false },
		minimalVisibility: { name: primitives.orgdiagram.Visibility, title: "Minimal nodes visibility", isString: false },
		selectionPathMode: { name: primitives.orgdiagram.SelectionPathMode, title: "Selection Path Mode", isString: false },
		childrenPlacementType: { name: primitives.orgdiagram.ChildrenPlacementType, title: "Children placement", isString: false },
		leavesPlacementType: { name: primitives.orgdiagram.ChildrenPlacementType, title: "Leaves placement", isString: false },
		defaultTemplateName: { name: primitives.orgeditor.TemplateName, title: "Default item template", isString: true }
	};
};

primitives.orgeditor.DlgConfig.prototype._create = function () {
	this._createLayout();
};

primitives.orgeditor.DlgConfig.prototype.destroy = function () {
	this._cleanLayout();
};

primitives.orgeditor.DlgConfig.prototype._createLayout = function () {
	var panelSize = new primitives.common.Rect(0, 0, this.element.outerWidth(), this.element.outerHeight()),
		self = this,
		content,
		contentString,
		key,
		item;

	contentString =	'<p class="validateTips">All form fields are required.</p>' +
		'<form>' + 
		'<fieldset>';

	for (key in this.enums) {
		if (this.enums.hasOwnProperty(key)) {
			item = this.enums[key];
			contentString += '<br/><label for="' + key + '">' + item.title +
				"</label><select class=\"text ui-widget-content ui-corner-all\" style=\"padding:2px; margin:5px;\" name=\"" + key + "\"></select>";
		}
	}

	contentString += '<br/><label for="itemTitleFirstFontColor">Title first font color</label>' +
		'<input type="text" name="itemTitleFirstFontColor" class="text ui-widget-content ui-corner-all" />' +
		'<br/><label for="itemTitleSecondFontColor">Title second font color</label>' +
		'<input type="text" name="itemTitleSecondFontColor" class="text ui-widget-content ui-corner-all" />' +
		'</fieldset>' +
		'</form>';

	content = jQuery(contentString).addClass(this.widgetEventPrefix);
	this.element.append(content);
	this.element.addClass("dialog-form");

	this._createWidgets(this.element);
};

primitives.orgeditor.DlgConfig.prototype._createWidgets = function () {
	var index,
	enumKey,
	enumItem,
	key,
	value,
	colorKey,
	availableColors = [];

	this.tips = this.element.find(".validateTips");

	this.itemTitleFirstFontColor = this.element.find("[name=itemTitleFirstFontColor]");
	this.itemTitleSecondFontColor = this.element.find("[name=itemTitleSecondFontColor]");

	for (colorKey in primitives.common.Colors) {
		if (primitives.common.Colors.hasOwnProperty(colorKey)) {
			availableColors.push(colorKey);
		}
	}
	this.itemTitleFirstFontColor.autocomplete({ source: availableColors });
	this.itemTitleSecondFontColor.autocomplete({ source: availableColors });

	for (enumKey in this.enums) {
		if (this.enums.hasOwnProperty(enumKey)) {
			enumItem = this.enums[enumKey];

			this[enumKey] = this.element.find("[name=" + enumKey + "]");
			for (key in enumItem.name) {
				if (enumItem.name.hasOwnProperty(key)) {
					value = enumItem.name[key];
					this[enumKey].append(jQuery("<option value='" + value + "'>" + key + "</option>"));
				}
			}
			this[enumKey].buttonset();
		}
	}
};

primitives.orgeditor.DlgConfig.prototype._cleanLayout = function () {
	this.element.empty();
	this.element.removeClass("dialog-form");
};

primitives.orgeditor.DlgConfig.prototype.open = function (config) {
	var allFields = jQuery([]).add(this.itemTitleFirstFontColor).add(this.itemTitleSecondFontColor),
		bValid = true,
		self = this;

	config = config !== undefined ? config : new primitives.orgdiagram.ItemConfig();

	this._updateWidgets(config);

	this.element.dialog({
		autoOpen: false,
		height: 400,
		width: 350,
		modal: true,
		title: "Chart options",
		buttons: {
			"Save": function () {
				var bValid = true;
				allFields.removeClass("ui-state-error");

				bValid = bValid && primitives.orgeditor.checkLength(self.tips, self.itemTitleFirstFontColor, "Title first font color", 0, 20);
				bValid = bValid && primitives.orgeditor.checkLength(self.tips, self.itemTitleSecondFontColor, "Title second font color", 0, 20);

				bValid = bValid && primitives.orgeditor.checkColor(self.tips, self.itemTitleFirstFontColor, "Title first font color");
				bValid = bValid && primitives.orgeditor.checkColor(self.tips, self.itemTitleSecondFontColor, "Title second font color");

				if (bValid) {
					self._updateConfig(config);

					jQuery(this).dialog("close");

					self._trigger("update", null, config);
				}
			},
			Cancel: function () {
				jQuery(this).dialog("close");

				self._trigger("cancel", null, config);
			}
		},
		close: function () {
			allFields.val("").removeClass("ui-state-error");

			self._trigger("cancel", null, config);
		}
	}).dialog("open");
};

primitives.orgeditor.DlgConfig.prototype._updateWidgets = function (config) {
	var enumKey,
		value;

	for (enumKey in this.enums) {
		if (this.enums.hasOwnProperty(enumKey)) {
			value = config[enumKey];
			if (value == null) {
				value = this._getFirstEnumItem(this.enums[enumKey].name);
			}
			this[enumKey].val(value);
		}
	}

	this.itemTitleFirstFontColor.val(config.itemTitleFirstFontColor);
	this.itemTitleSecondFontColor.val(config.itemTitleSecondFontColor);
};

primitives.orgeditor.DlgConfig.prototype._getFirstEnumItem = function (name) {
	var enumKey;
	for (enumKey in name) {
		if (name.hasOwnProperty(enumKey)) {
			return name[enumKey];
		}
	}
	return null;
};

primitives.orgeditor.DlgConfig.prototype._updateConfig = function (config) {
	var enumKey,
		value;

	for (enumKey in this.enums) {
		if (this.enums.hasOwnProperty(enumKey)) {
			value = this[enumKey].val();
			config[enumKey] = this.enums[enumKey].isString ? value : parseInt(value, 10);
		}
	}
	config.itemTitleFirstFontColor = this.itemTitleFirstFontColor.val();
	config.itemTitleSecondFontColor = this.itemTitleSecondFontColor.val();
};

primitives.orgeditor.DlgConfig.prototype._setOption = function (key, value) {
	jQuery.Widget.prototype._setOption.apply(this, arguments);
};
/*
	jQuery UI Widget
	Organizational Diagram Editor
	Config Dialog Widget

	Depends:
		jquery.ui.core.js
		jquery.ui.widget.js
		jquery.ui.button
		jquery.ui.buttonset
		jquery.ui.autocomplete
		jquery.ui.dialog
*/
(function ($) {
	$.widget("ui.bpDlgConfig", new primitives.orgeditor.DlgConfig());
}(jQuery));
/*
	Class: primitives.orgeditor.DlgItemConfigOptions
		Organizational Diagram Item Config dialog 
		options class.
*/
primitives.orgeditor.DlgItemConfigOptions = function () {
	this.cancel = null;
	this.update = null;
};
/*
	Class: primitives.orgeditor.DlgItemConfig
		Organizational Diagram Item Config dialog
		Controller
*/
primitives.orgeditor.DlgItemConfig = function () {
	this.widgetEventPrefix = "bpdlgitemconfig";

	this.options = new primitives.orgeditor.DlgItemConfigOptions();

	this.title = null;
	this.itemTitleColor = null;
	this.description = null;
	this.phone = null;
	this.email = null;
	this.image = null;
	this.readmorelabel = null;
	this.readmoreurl = null;
	this.groupTitle = null;
	this.groupTitleColor = null;

	this.sortableList = null;

	this.itemType = null;
	this.adviserPlacementType = null;
	this.childrenPlacementType = null;
	this.defaultTemplateName = null;

	this.textFields = {
		title: { title: "Title" },
		itemTitleColor: { title: "Title Color"},
		description: { title: "Description"},
		phone: { title: "Phone"},
		email: { title: "E-mail"}, 
		groupTitle: { title: "Group Title"},
		groupTitleColor: { title: "Group Title Color"},
		image: { title: "Photo"},
		readmorelabel: { title: "Read more label"},
		readmoreurl: { title: "Read more URL" }
	};

	this.tips = null;

	this.enums = {
		itemType: { name: { Regular: 0, Assistant: 1, Adviser: 2 }, title: "Item type", isString: false },
		adviserPlacementType: { name: primitives.orgdiagram.AdviserPlacementType, title: "Adviser placement", isString: false },
		childrenPlacementType: { name: primitives.orgdiagram.ChildrenPlacementType, title: "Children placement", isString: false },
		templateName: { name: primitives.orgeditor.TemplateName, title: "Item template", isString: true }
	};
};

primitives.orgeditor.DlgItemConfig.prototype._create = function () {
	this._createLayout();
};

primitives.orgeditor.DlgItemConfig.prototype.destroy = function () {
	this._cleanLayout();
};

primitives.orgeditor.DlgItemConfig.prototype._createLayout = function () {
	var panelSize = new primitives.common.Rect(0, 0, this.element.outerWidth(), this.element.outerHeight()),
		self = this,
		content,
		key,
		item,
		contentString = "";

	contentString += "<ul>";
	contentString += "	<li><a href=\"#" + this.widgetEventPrefix + "options\">Options</a></li>";
	contentString += "	<li><a href=\"#" + this.widgetEventPrefix + "order\">Children order</a></li>";
	contentString += "</ul>";
	contentString += "<div id=\"" + this.widgetEventPrefix + "options\">";
	contentString += '<p class="validateTips">All form fields are required.</p><form><fieldset>';

	for (key in this.textFields) {
		if (this.textFields.hasOwnProperty(key)) {
			item = this.textFields[key];
			contentString += '<br/><label for="' + key + '">' + item.title + '</label><input type="text" name="' + key + '" class="text ui-widget-content ui-corner-all" />';
		}
	}

	for (key in this.enums) {
		if (this.enums.hasOwnProperty(key)) {
			item = this.enums[key];
			contentString += '<br/><label for="' + key + '">' + item.title + "</label><select class=\"text ui-widget-content ui-corner-all\" style=\"padding:2px; margin:5px;\" name=\"" + key + "\"></select>";
		}
	}

	contentString += '</fieldset></form>';
	contentString += "</div>";
	contentString += "<div id=\"" + this.widgetEventPrefix + "order\">";
	contentString += "<ul name=\"sortable\" class=\"sortable\"></ul>";
	contentString += "</div>";
	content = jQuery(contentString).addClass(this.widgetEventPrefix);

	this.element.append(content);
	this.element.addClass("dialog-form");

	this._createWidgets();
};

primitives.orgeditor.DlgItemConfig.prototype._createWidgets = function () {
	var availableColors = [],
		colorKey,
		key,
		value,
		index,
		len,
		item,
		enumKey,
		enumItem;

	this.element.tabs();
	this.sortableList = this.element.find("[name=sortable]");
	this.sortableList.sortable();
	this.sortableList.disableSelection();

	/* Create text fields */
	for (key in this.textFields) {
		if (this.textFields.hasOwnProperty(key)) {
			item = this.textFields[key];

			this[key] = this.element.find("[name=" + key + "]");
		}
	}

	this.tips = this.element.find(".validateTips");

	/* Create enums */
	for (enumKey in this.enums) {
		if (this.enums.hasOwnProperty(enumKey)) {
			enumItem = this.enums[enumKey];

			this[enumKey] = this.element.find("[name=" + enumKey + "]");
			for (key in enumItem.name) {
				if (enumItem.name.hasOwnProperty(key)) {
					value = enumItem.name[key];
					this[enumKey].append(jQuery("<option value='" + value + "'>" + key + "</option>"));
				}
			}
			this[enumKey].buttonset();
		}
	}

	/* Create color fields */
	for (colorKey in primitives.common.Colors) {
		if (primitives.common.Colors.hasOwnProperty(colorKey)) {
			availableColors.push(colorKey);
		}
	}
	this.itemTitleColor.autocomplete({ source: availableColors });
	this.groupTitleColor.autocomplete({ source: availableColors });
};

primitives.orgeditor.DlgItemConfig.prototype._cleanLayout = function () {
	this.element.empty();
	this.element.removeClass("dialog-form");
};

primitives.orgeditor.DlgItemConfig.prototype.open = function (itemConfig) {
	var bValid = true,
		index,
		len,
		key,
		self = this;

	itemConfig = itemConfig !== undefined ? itemConfig : new primitives.orgdiagram.ItemConfig();

	this._updateWidgets(itemConfig);

	this.element.dialog({
		autoOpen: false,
		height: 400,
		width: 350,
		modal: true,
		title: "Item options",
		buttons: {
			"Save": function () {
				var bValid = true,
					key;
				for (key in self.textFields) {
					if (self.textFields.hasOwnProperty(key)) {
						self[key].removeClass("ui-state-error");
					}
				}

				bValid = bValid && primitives.orgeditor.checkLength(self.tips, self.title, "Title", 1, 80);
				bValid = bValid && primitives.orgeditor.checkLength(self.tips, self.description, "Description", 0, 400);

				bValid = bValid && primitives.orgeditor.checkLength(self.tips, self.itemTitleColor, "Title color", 0, 40);
				bValid = bValid && primitives.orgeditor.checkLength(self.tips, self.groupTitleColor, "Group title color", 0, 40);

				bValid = bValid && primitives.orgeditor.checkColor(self.tips, self.itemTitleColor, "Title color");
				bValid = bValid && primitives.orgeditor.checkColor(self.tips, self.groupTitleColor, "Group title color");


				if (bValid) {
					self._updateItemConfig(itemConfig);

					jQuery(this).dialog("close");

					self._trigger("update", null, itemConfig);
				}
			},
			Cancel: function () {
				jQuery(this).dialog("close");

				self._trigger("cancel", null, itemConfig);
			}
		},
		close: function () {
			var key;
			for (key in self.textFields) {
				if (self.textFields.hasOwnProperty(key)) {
					self[key].val("").removeClass("ui-state-error");
				}
			}

			self._trigger("cancel", null, itemConfig);
		}
	}).dialog("open");
};

primitives.orgeditor.DlgItemConfig.prototype._updateWidgets = function (itemConfig) {
	var index,
		len,
		textField,
		enumKey,
		value,
		key,
		item;

	/* Create text fields */
	for (key in this.textFields) {
		if (this.textFields.hasOwnProperty(key)) {
			item = this.textFields[key];

			this[key].val(itemConfig[key]);
		}
	}

	for (enumKey in this.enums) {
		if (this.enums.hasOwnProperty(enumKey)) {
			value = itemConfig[enumKey];
			if (value == null) {
				value = this._getFirstEnumItem(this.enums[enumKey].name);
			}
			this[enumKey].val(value);
		}
	}

	this.sortableList.empty();
	for (index = 0, len = itemConfig.items.length; index < len; index += 1) {
		item = itemConfig.items[index];

		this.sortableList.append(jQuery("<li id=\"" + index + "\" class=\"ui-state-default\"><span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span>" + item.title + "</li>"));
	}
};

primitives.orgeditor.DlgItemConfig.prototype._getFirstEnumItem = function (name) {
	var enumKey;
	for (enumKey in name) {
		if (name.hasOwnProperty(enumKey)) {
			return name[enumKey];
		}
	}
	return null;
};

primitives.orgeditor.DlgItemConfig.prototype._updateItemConfig = function (itemConfig) {
	var index,
		len,
		textField,
		value,
		key,
		item,
		enumKey,
		ids,
		newItems;

	for (key in this.textFields) {
		if (this.textFields.hasOwnProperty(key)) {
			item = this.textFields[key];
			itemConfig[key] = this[key].val();
		}
	}

	for (enumKey in this.enums) {
		if (this.enums.hasOwnProperty(enumKey)) {
			value = this[enumKey].val();
			itemConfig[enumKey] = this.enums[enumKey].isString ? value : parseInt(value, 10);
		}
	}

	ids = this.sortableList.sortable("toArray");
	if (ids.length > 0) {
		newItems = [];
		for (index = 0, len = ids.length; index < len; index += 1) {
			newItems.push(itemConfig.items[parseInt(ids[index], 10)]);
		}
		itemConfig.items.length = 0;
		itemConfig.items = newItems;
	}
};

primitives.orgeditor.DlgItemConfig.prototype._setOption = function (key, value) {
	jQuery.Widget.prototype._setOption.apply(this, arguments);
};
/*
	jQuery UI Widget
	Organizational Diagram Editor
	Item Config Dialog Widget

	Depends:
		jquery.ui.core.js
		jquery.ui.widget.js
		jquery.ui.button
		jquery.ui.buttonset
		jquery.ui.autocomplete
		jquery.ui.dialog
*/
(function ($) {
	$.widget("ui.bpDlgItemConfig", new primitives.orgeditor.DlgItemConfig());
}(jQuery));
/*
    _Class: primitives.orgeditor.DlgOrgDiagramOptions
	    Organizational Diagram Dialog 
		options class.
	
*/
primitives.orgeditor.DlgOrgDiagramOptions = function () {
	this.cancel = null;
	this.update = null;
};
/*
    _Class: primitives.orgeditor.DlgOrgDiagram
	    Organizational Diagram Dialog
		Controller
*/
primitives.orgeditor.DlgOrgDiagram = function () {
	this.widgetEventPrefix = "bpdlgorgdiagram";

	this.options = new primitives.orgeditor.DlgOrgDiagramOptions();

	this.orgdiagram = null;
};

primitives.orgeditor.DlgOrgDiagram.prototype._create = function () {
	this._createLayout();
};

primitives.orgeditor.DlgOrgDiagram.prototype.destroy = function () {
	this._cleanLayout();
};

primitives.orgeditor.DlgOrgDiagram.prototype._createLayout = function () {
	var self = this,
		content;

	content = jQuery(
		  '<div class="bp-item" name="dlgorgdiagram" style="overflow: hidden; padding: 0px; margin: 0px; border: 0px;"></div>'
		).addClass(this.widgetEventPrefix);
	this.element.append(content);
	this.element.css({
		overflow: "hidden"
	});
	this.element.addClass("dialog-form");

	this._createWidgets(this.element);
};

primitives.orgeditor.DlgOrgDiagram.prototype._createWidgets = function () {
	this.orgdiagram = this.element.find("[name=dlgorgdiagram]");
	this.orgdiagram.orgDiagram();
};

primitives.orgeditor.DlgOrgDiagram.prototype._updateWidgets = function (config) {
	this._updateLayout();
	this.orgdiagram.orgDiagram("option", config);
	this.orgdiagram.orgDiagram("update");
};


primitives.orgeditor.DlgOrgDiagram.prototype._updateLayout = function () {
	var panelSize = new primitives.common.Rect(0, 0, this.element.outerWidth(), this.element.outerHeight());
	this.orgdiagram.css(panelSize.getCSS());
};

primitives.orgeditor.DlgOrgDiagram.prototype._cleanLayout = function () {
	this.element.empty();
	this.element.removeClass("dialog-form");
};

primitives.orgeditor.DlgOrgDiagram.prototype.open = function (config, currentItemConfig) {
	var allFields = jQuery([]),
		bValid = true,
		itemConfig = null,
		self = this;

	config = config !== undefined ? config : new primitives.orgdiagram.Config();

	this.element.dialog({
		autoOpen: false,
		minWidth: 640,
		minHeight: 480,
		modal: true,
		title: "Select new parent",
		buttons: {
			"Select": function () {
				var bValid = true;
				allFields.removeClass("ui-state-error");

				itemConfig = self.orgdiagram.orgDiagram("option", "cursorItem");

				bValid = !self._isParentOf(currentItemConfig, itemConfig);

				if (bValid) {
					jQuery(this).dialog("close");

					self._trigger("update", null, itemConfig);
				}
			},
			Cancel: function () {
				jQuery(this).dialog("close");

				self._trigger("cancel");
			}
		},
		close: function () {
			allFields.val("").removeClass("ui-state-error");

			self._trigger("cancel");
		},
		resizeStop: function (event, ui) {
			self._updateLayout();
			self.orgdiagram.orgDiagram("update", primitives.orgdiagram.UpdateMode.Refresh);
		},
		open: function (event, ui) {
			self._updateWidgets(config);
		}
	}).dialog("open");
};

primitives.orgeditor.DlgOrgDiagram.prototype._isParentOf = function (parentItem, childItem) {
	var result = false,
		index,
		len,
		itemConfig;
	if (parentItem === childItem) {
		result = true;
	} else {
		for (index = 0, len = parentItem.items.length; index < len; index += 1) {
			itemConfig = parentItem.items[index];
			if (this._isParentOf(itemConfig, childItem)) {
				result = true;
				break;
			}
		}
	}
	return result;
};

primitives.orgeditor.DlgOrgDiagram.prototype._setOption = function (key, value) {
	jQuery.Widget.prototype._setOption.apply(this, arguments);
};
/*
	jQuery UI Widget
	Organizational Diagram Editor
	Organizational Diagram Dialog Widget

	Depends:
		jquery.ui.core.js
		jquery.ui.widget.js
		jquery.ui.button
		jquery.ui.buttonset
		jquery.ui.autocomplete
		jquery.ui.dialog
*/
(function ($) {
	$.widget("ui.bpDlgOrgDiagram", new primitives.orgeditor.DlgOrgDiagram());
}(jQuery));

