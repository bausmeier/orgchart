/**
 * Basic Primitives orgDiagram v1.0.27
 *
 * (c) Adeltech Productions Inc
 *
 * License: http://www.basicprimitives.com/index.php?option=com_content&view=article&id=14&Itemid=18
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

	namespace("primitives.common");
	namespace("primitives.orgdiagram");
	namespace("primitives.text");
	namespace("primitives.callout");

}());
/*
    Function: primitives.common.isNullOrEmpty
    Indicates whether the specified string is null or an Empty string.
    
    Parameters:
	value - The string to test.
    Returns: 
	true if the value is null or an empty string(""); otherwise, false.
*/
primitives.common.isNullOrEmpty = function (value) {
	var isNullOrEmpty = true,
		string;
	if (value !== undefined && value !== null) {
		string = value.toString();
		if (string.length > 0) {
			isNullOrEmpty = false;
		}
	}
	return isNullOrEmpty;
};

/*
    Function: primitives.common.hashCode
    Returns hash code for specified string value.
    
    Parameters:
	value - The string to calculate hash code.
    Returns:
	int hash code.
*/
primitives.common.hashCode = function (value) {
	var hash = 0,
		character,
		i;
	/*ignore jslint start*/
	if (value.length > 0) {
		for (i = 0; i < value.length; i += 1) {
			character = value.charCodeAt(i);
			hash = ((hash << 5) - hash) + character;
			hash = hash & hash;
		}
	}
	/*ignore jslint end*/
	return hash;
};

/*
    Function: primitives.common.attr
    This method assigns HTML element attributes only if one of them does not match its current value.
    This function helps to reduce number of HTML page layout invalidations.
    
    Parameters:

	element - jQuery selector of element to be updated.
	attr - object containg attributes and new values.
*/
primitives.common.attr = function (element, attr) {
	var attribute,
		value;
	if (element.hasOwnProperty("attrHash")) {
		for (attribute in attr) {
			if (attr.hasOwnProperty(attribute)) {
				value = attr[attribute];
				if (element.attrHash[attribute] != value) {
					element.attrHash[attribute] = value;
					element.attr(attribute, value);
				}
			}
		}
	} else {
		element.attr(attr);
		element.attrHash = attr;
	}
};

/*
    Function: primitives.common.css
    This method assigns HTML element style attributes only if one of them does not match its current value.
    This function helps to reduce number of HTML page layout invalidations.
    
    Parameters:
	element - jQuery selector of element to be updated.
	attr - object containing style attributes.
*/
primitives.common.css = function (element, attr) {
	var attribute,
		value;
	if (element.hasOwnProperty("cssHash")) {
		for (attribute in attr) {
			if (attr.hasOwnProperty(attribute)) {
				value = attr[attribute];
				if (element.cssHash[attribute] != value) {
					element.cssHash[attribute] = value;
					element.css(attribute, value);
				}
			}
		}
	} else {
		element.css(attr);
		element.cssHash = attr;
	}
};

/*
    Function: primitives.common.stopPropogation
    This method uses various approaches used in different browsers to stop event propagation.
    Parameters:
	event - Event to be stopped.
*/
primitives.common.stopPropagation = function (event) {
	if (event.stopPropagation !== undefined) {
		event.stopPropagation();
	} else if (event.cancelBubble !== undefined) {
		event.cancelBubble = true;
	} else if (event.preventDefault !== undefined) {
		event.preventDefault();
	}
};

/*
    Function: primitives.common.indexOf
    This method searches array for specified item and returns index (or -1 if not found)
    Parameters:
	vector - An array through which to search.
	item - The value to search for.
    Returns:
	Index of search item or -1 if not found.
*/
primitives.common.indexOf = function (vector, item) {
	var index,
		treeItem;
	for (index = 0; index < vector.length; index += 1) {
		treeItem = vector[index];
		if (treeItem === item) {
			return index;
		}
	}
	return -1;
};

primitives.common._supportsSVG = null;

/*
    Function: primitives.common.supportsSVG
    Indicates whether the browser supports SVG graphics.
    
    Returns: 
	true if browser supports SVG graphics.
*/
primitives.common.supportsSVG = function () {
	if (primitives.common._supportsSVG === null) {
		primitives.common._supportsSVG = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")
			|| document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.0");
	}
	return primitives.common._supportsSVG;
};

primitives.common._supportsVML = null;

/*
    Function: primitives.common.supportsVML
    Indicates whether the browser supports VML graphics. It is applicable to Internet Explorer only. This graphics mode is depricated in favour of SVG.
    
    Returns: 
	true if browser supports VML graphics.
*/
primitives.common.supportsVML = function () {
	var div,
		shape;
	if (primitives.common._supportsVML === null) {
		primitives.common._supportsVML = false;
		if (!jQuery.support.opacity) {
			div = document.body.appendChild(document.createElement('div'));
			div.innerHTML = '<v:shape adj="1" />';
			shape = div.firstChild;
			shape.style.behavior = "url(#default#VML)";
			primitives.common._supportsVML = shape ? typeof shape.adj === "object" : false;
			div.parentNode.removeChild(div);
		}
	}
	return primitives.common._supportsVML;
};

primitives.common._supportsCanvas = null;

/*
    Function: primitives.common.supportsCanvas
    Indicates whether the browser supports HTML Canvas graphics.
    
    Returns: 
	true if browser supports HTML Canvas graphics.
*/
primitives.common.supportsCanvas = function () {
	if (primitives.common._supportsCanvas === null) {
		primitives.common._supportsCanvas = !!window.HTMLCanvasElement;
	}
	return primitives.common._supportsCanvas;
};

primitives.common.createGraphics = function (preferred, widget) {
	var result = null,
		modes,
		key,
		index;

	modes = [preferred];
	for (key in primitives.common.GraphicsType) {
		if (primitives.common.GraphicsType.hasOwnProperty(key)) {
			modes.push(primitives.common.GraphicsType[key]);
		}
	}
	for (index = 0; result === null && index < modes.length; index += 1) {
		switch (modes[index]) {
			case 2/*primitives.common.GraphicsType.VML*/:
				if (primitives.common.supportsVML()) {
					result = new primitives.common.VmlGraphics(widget);
				}
				break;
			case 0/*primitives.common.GraphicsType.SVG*/:
				if (primitives.common.supportsSVG()) {
					result = new primitives.common.SvgGraphics(widget);
				}
				break;
			case 1/*primitives.common.GraphicsType.Canvas*/:
				if (primitives.common.supportsCanvas()) {
					result = new primitives.common.CanvasGraphics(widget);
				}
				break;
		}
	}
	return result;
};

/*
    Function: primitives.common.getColorHexValue
     Converts color string into HEX color string.
    
    Parameters:
	color - regular HTML color string.

    Returns: 
	    Color value in form of HEX string.
*/
primitives.common.getColorHexValue = function (color) {
	var digits,
		red,
		green,
		blue,
		rgb,
		colorIndex,
		colorKey;
	if (color.substr(0, 1) === '#') {
		return color;
	}

	/*ignore jslint start*/
	digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
	/*ignore jslint end*/
	if (digits !== null && digits.length > 0) {
		red = parseInt(digits[2], 10);
		green = parseInt(digits[3], 10);
		blue = parseInt(digits[4], 10);

		/*ignore jslint start*/
		rgb = ((red << 16) | (green << 8) | blue).toString(16);
		/*ignore jslint end*/
		return digits[1] + "000000".substr(0, 6 - rgb.length) + rgb;
	}
	if (primitives.common.ColorHexs === undefined) {
		primitives.common.ColorHexs = {};
		colorIndex = 0;
		for (colorKey in primitives.common.Colors) {
			if (primitives.common.Colors.hasOwnProperty(colorKey)) {
				primitives.common.ColorHexs[colorKey.toUpperCase()] = primitives.common.Colors[colorKey];
				colorIndex += 1;
			}
		}
	}

	return primitives.common.ColorHexs[color.toUpperCase()];
};

/*
    Function: primitives.common.getColorName
     Converts color string into HTML color name string or return hex color string.
    
    Parameters:
	color - regular HTML color string.

    Returns: 
	    HTML Color name or HEX string.
*/
primitives.common.getColorName = function (color) {
	var colorIndex,
		colorKey;
	color = primitives.common.getColorHexValue(color);

	if (primitives.common.ColorNames === undefined) {
		primitives.common.ColorNames = {};
		colorIndex = 0;
		for (colorKey in primitives.common.Colors) {
			if (primitives.common.Colors.hasOwnProperty(colorKey)) {
				primitives.common.ColorNames[primitives.common.Colors[colorKey]] = colorKey;
				colorIndex += 1;
			}
		}
	}

	return primitives.common.ColorNames[color];
};

/*
    Function: primitives.common.getRed
        Gets red value of HEX color string.
    
    Parameters:
	color - HEX string color value.

    Returns: 
	    Int value.
*/
primitives.common.getRed = function (color) {
	if (color.substr(0, 1) === '#' && color.length === 7) {
		return parseInt(color.substr(1, 2), 16);
	}
	return null;
};

/*
    Function: primitives.common.getGreen
        Gets green value of HEX color string.

    Parameters:
	color - HEX string color value.
    
    Returns: 
	    Int value.
*/
primitives.common.getGreen = function (color) {
	if (color.substr(0, 1) === '#' && color.length === 7) {
		return parseInt(color.substr(3, 2), 16);
	}
	return null;
};

/*
    Function: primitives.common.getBlue
        Gets blue value of HEX color string.
    
    Parameters:
	color - HEX string color value.

    Returns: 
	    Int value.
*/
primitives.common.getBlue = function (color) {
	if (color.substr(0, 1) === '#' && color.length === 7) {
		return parseInt(color.substr(5, 2), 16);
	}
	return null;
};

/*
    Function: primitives.common.beforeOpacity
        Calculates before opacity color value producing color you need after applying opacity.
    
    Parameters:
	color - Color you need after applying opacity.
	opacity - Value of opacity.

    Returns: 
	    HEX color value.
*/
primitives.common.beforeOpacity = function (color, opacity) {
	var common = primitives.common,
		red,
		green,
		blue,
		rgb;
	color = common.getColorHexValue(color);

	red = Math.ceil((common.getRed(color) - (1.0 - opacity) * 255.0) / opacity);
	green = Math.ceil((common.getRed(color) - (1.0 - opacity) * 255.0) / opacity);
	blue = Math.ceil((common.getRed(color) - (1.0 - opacity) * 255.0) / opacity);

	/*ignore jslint start*/
	rgb = ((red << 16) | (green << 8) | blue).toString(16);
	/*ignore jslint end*/
	return '#' + "000000".substr(0, 6 - rgb.length) + rgb;
};

/*
    Function: primitives.common.highestContrast
        This function calculates contrast between base color and two optional first and second colors
        and returns optional color having highest contrast.
    
    Parameters:
	baseColor - Base color to compare with.
	firstColor - First color.
    secondColor - Second color.

    Returns: 
	    Color value.
*/
primitives.common.highestContrast = function (baseColor, firstColor, secondColor) {
	var result = firstColor,
		common = primitives.common,
		key = baseColor + "," + firstColor  + "," + secondColor;

	if (common.highestContrasts === undefined) {
		common.highestContrasts = {};
	}
	if (common.highestContrasts.hasOwnProperty(key)) {
		result = common.highestContrasts[key];
	} else {
		if (common.luminosity(firstColor, baseColor) < common.luminosity(secondColor, baseColor)) {
			result = secondColor;
		}
		common.highestContrasts[key] = result;
	}
	return result;
};

/*
    Function: primitives.common.luminosity
        This function calculates luminosity between two HEX string colors.
    
    Parameters:
	firstColor - First color.
    secondColor - Second color.

    Returns: 
	    Luminosity value
*/
primitives.common.luminosity = function (firstColor, secondColor) {
	var result,
		common = primitives.common,
		first = common.getColorHexValue(firstColor),
		second = common.getColorHexValue(secondColor),
		firstLuminosity =
          0.2126 * Math.pow(common.getRed(first) / 255.0, 2.2)
        + 0.7152 * Math.pow(common.getRed(first) / 255.0, 2.2)
        + 0.0722 * Math.pow(common.getRed(first) / 255.0, 2.2),
		secondLuminosity =
          0.2126 * Math.pow(common.getRed(second) / 255.0, 2.2)
        + 0.7152 * Math.pow(common.getRed(second) / 255.0, 2.2)
        + 0.0722 * Math.pow(common.getRed(second) / 255.0, 2.2);

	if (firstLuminosity > secondLuminosity) {
		result = (firstLuminosity + 0.05) / (secondLuminosity + 0.05);
	}
	else {
		result = (secondLuminosity + 0.05) / (firstLuminosity + 0.05);
	}

	return result;
};
/*
    Enum: primitives.orgdiagram.AdviserPlacementType
        Defines item placement in tree relative to parent.
    
    Auto - Layout manager defined.
    Left - Item placed on the left side of parent.
    Right - Item placed on the right side of parent.
*/
primitives.orgdiagram.AdviserPlacementType =
{
	Auto: 0,
	Left: 2,
	Right: 3
};
/*
    Enum: primitives.orgdiagram.UpdateMode
        Defines redraw mode of diagram.
    
    Recreate - Force widget to make a full redraw.
    Refresh - This update mode is optimized for widget fast redraw caused by resize or changes of 
	next options: <primitives.orgdiagram.Config.rootItem>, <primitives.orgdiagram.Config.cursorItem> 
	or <primitives.orgdiagram.Config.selectedItems>.
    PositonHighlight - This update mode redraws only <primitives.orgdiagram.Config.highlightItem>.

    See Also:

      <primitives.orgdiagram.Config.update>
*/
primitives.orgdiagram.UpdateMode =
{
	Recreate: 0,
	Refresh: 1,
	PositonHighlight: 2
};
/*
    Enum: primitives.text.TextOrientationType
        Defines label orientation type.
    
    Horizontal - Regular horizontal text.
    RotateLeft - Rotate all text 90 degree.
    RotateRight - Rotate all text 270 degree.
*/
primitives.text.TextOrientationType =
{
	Horizontal: 0,
	RotateLeft: 1,
	RotateRight: 2
};
/*
    Enum: primitives.orgdiagram.SelectionPathMode
        Defines the display mode for items between root item of diagram and selected items.
    
    None - Selection path items placed and sized as regular diagram items.
    FullStack - Selection path items are shown in normal template mode.
*/
primitives.orgdiagram.SelectionPathMode =
{
	None: 0,
	FullStack: 1
};
primitives.common.SegmentType =
{
	Line: 0,
	Move: 1,
	QuadraticArc: 2,
	CubicArc: 3,
	Dot: 4
};
/*
    Enum: primitives.common.RenderingMode
    This enumeration is used as option in arguments of rendering events.
    It helps to tell template initialization stage, 
    for example user can widgitize some parts of template on create
    and update and refresh them in template update stage.
    
    Create - Template is just created.
    Update - Template is reused and update needed.
*/
primitives.common.RenderingMode =
{
	Create: 0,
	Update: 1
};
/*
    Enum: primitives.common.PlacementType
        Defines element placement relative to rectangular area.
    
    Auto - Depends on implementation
    Left - Left side
    Top - Top side
    Right - Right side
    Bottom - Bottom side
    TopLeft - Top left side
    TopRight - Top right side
    BottomLeft - Bottom left side
    BottomRight - Bottom right side
*/
primitives.common.PlacementType =
{
	Auto: 0,
	Top: 1,
	TopRight: 2,
	Right: 3,
	BottomRight: 4,
	Bottom: 5,
	BottomLeft: 6,
	Left: 7,
	TopLeft: 8
};
/*
    Enum: primitives.orgdiagram.PageFitMode
        Defines diagram auto fit mode.
    
    None - All diagram items are shown in normal template mode.
    PageWidth - Diagram tries to layout and auto size items in order to fit diagram into available page width.
    PageHeight - Diagram tries to layout and auto size items in order to fit diagram into available page height.
    FitToPage - Diagram tries to layout and auto size items in order to fit diagram into available page size.
*/
primitives.orgdiagram.PageFitMode =
{
	None: 0,
	PageWidth: 1,
	PageHeight: 2,
	FitToPage: 3
};
/*
    Enum: primitives.common.VerticalAlignmentType
    Defines text label alignment inside text box boundaries.
    
    Center - Positooned in the middle of the text box
    Left - Aligned to the begging of the text box
    Right - Aligned to the end of text box
*/
primitives.common.VerticalAlignmentType =
{
	Top: 0,
	Middle: 1,
	Bottom: 2
};
/*
    Enum: primitives.common.OrientationType
        Defines diagram orientation type.
    
    Top - Vertical orientation having root item at the top.
	Bottom - Vertical orientation having root item at the bottom.
    Left - Horizontal orientation having root item on the left.
    Right - Horizontal orientation having root item on the right.
*/
primitives.orgdiagram.OrientationType =
{
	Top: 0,
	Bottom: 1,
	Left: 2,
	Right: 3
};
/*
    Enum: primitives.orgdiagram.ItemType
        Defines diagram item type.
    
    Regular - Regular item.
    Assistant - Child item which is placed at separate level above all other children, but below parent item.
    Adviser - Child item which is placed at the same level as parent item.
    Invisible - Invisible item. Item is always shown in line mode, it has no cursor and cursor annotations.
*/
primitives.orgdiagram.ItemType =
{
	Regular: 0,
	Assistant: 1,
	Adviser: 2,
	Invisible: 3
};
/*
    Enum: primitives.common.HorizontalAlignmentType
    Defines text label alignment inside text box boundaries.
    
    Center - Positooned in the middle of the text box
    Left - Aligned to the begging of the text box
    Right - Aligned to the end of text box
*/
primitives.common.HorizontalAlignmentType =
{
	Center: 0,
	Left: 1,
	Right: 2
};
/*
    Enum: primitives.ocommon.GraphicsType
        Graphics type. 
    
    VML - Vector Markup Language. It is only graphics mode available in IE6, IE7 and IE8.
    SVG - Scalable Vector Graphics. Proportionally scales on majority of device. It is not available on Android 2.3 devices and earlier.
    Canvas - HTML canvas graphics. It is available everywhere except IE6, IE7 and IE8. It requires widget redraw after zooming page.
*/
primitives.common.GraphicsType =
{
	SVG: 0,
	Canvas: 1,
	VML: 2
};
/*
    Enum: primitives.common.Enabled
        Defines option state.
    
    Auto - Option state is auto defined.
    True - Enabled.
    False - Disabled.
*/
primitives.common.Enabled =
{
	Auto: 0,
	True: 1,
	False: 2
};
/*
    Enum: primitives.orgdiagram.ConnectorType
        Defines diagram connectors style for dot and line elements.
    
    Squared - Connector lines use only right angles.
    Angular - Connector lines use angular lines comming from common vertex.
    Curved - Connector lines are splines comming from common vertex.
*/
primitives.orgdiagram.ConnectorType =
{
	Squared: 0,
	Angular: 1,
	Curved: 2
};
/*
    Enum: primitives.common.Colors
        Named colors.

*/
primitives.common.Colors =
{
	AliceBlue: "#f0f8ff",
	AntiqueWhite: "#faebd7",
	Aqua: "#00ffff",
	Aquamarine: "#7fffd4",
	Azure: "#f0ffff",

	Beige: "#f5f5dc",
	Bisque: "#ffe4c4",
	Black: "#000000",
	BlanchedAlmond: "#ffebcd",
	Blue: "#0000ff",
	BlueViolet: "#8a2be2",
	Brown: "#a52a2a",
	BurlyWood: "#deb887",
	Bronze: "#cd7f32",

	CadetBlue: "#5f9ea0",
	ChartReuse: "#7fff00",
	Chocolate: "#d2691e",
	Coral: "#ff7f50",
	CornflowerBlue: "#6495ed",
	Cornsilk: "#fff8dc",
	Crimson: "#dc143c",
	Cyan: "#00ffff",
	DarkBlue: "#00008b",
	DarkCyan: "#008b8b",
	DarkGoldenrod: "#b8860b",
	DarkGray: "#a9a9a9",
	DarkGreen: "#006400",
	DarkKhaki: "#bdb76b",
	DarkMagenta: "#8b008b",
	DarkOliveGreen: "#556b2f",
	Darkorange: "#ff8c00",
	DarkOrchid: "#9932cc",
	DarkRed: "#8b0000",
	DarkSalmon: "#e9967a",
	DarkSeaGreen: "#8fbc8f",
	DarkSlateBlue: "#483d8b",
	DarkSlateGray: "#2f4f4f",
	DarkTurquoise: "#00ced1",
	DarkViolet: "#9400d3",
	DeepPink: "#ff1493",
	DeepSkyBlue: "#00bfff",
	DimGray: "#696969",
	DodgerBlue: "#1e90ff",

	FireBrick: "#b22222",
	FloralWhite: "#fffaf0",
	ForestGreen: "#228b22",
	Fuchsia: "#ff00ff",

	Gainsboro: "#dcdcdc",
	GhostWhite: "#f8f8ff",
	Gold: "#ffd700",
	Goldenrod: "#daa520",
	Gray: "#808080",
	Green: "#008000",
	GreenYellow: "#adff2f",

	Honeydew: "#f0fff0",
	Hotpink: "#ff69b4",

	IndianRed: "#cd5c5c",
	Indigo: "#4b0082",
	Ivory: "#fffff0",
	Khaki: "#f0e68c",

	Lavender: "#e6e6fa",
	LavenderBlush: "#fff0f5",
	Lawngreen: "#7cfc00",
	Lemonchiffon: "#fffacd",
	LightBlue: "#add8e6",
	LightCoral: "#f08080",
	LightCyan: "#e0ffff",
	LightGoldenrodYellow: "#fafad2",

	LightGray: "#d3d3d3",
	LightGreen: "#90ee90",
	LightPink: "#ffb6c1",
	LightSalmon: "#ffa07a",
	LightSeaGreen: "#20b2aa",
	LightSkyBlue: "#87cefa",
	LightSlateGray: "#778899",
	LightSteelBlue: "#b0c4de",

	LightYellow: "#ffffe0",
	Lime: "#00ff00",
	Limegreen: "#32cd32",
	Linen: "#faf0e6",

	Magenta: "#ff00ff",
	Maroon: "#800000",
	MediumAquamarine: "#66cdaa",
	MediumBlue: "#0000cd",
	MediumOrchid: "#ba55d3",
	MediumPurple: "#9370d8",
	MediumSeaGreen: "#3cb371",
	MediumSlateBlue: "#7b68ee",

	MediumSpringGreen: "#00fa9a",
	MediumTurquoise: "#48d1cc",
	MediumVioletRed: "#c71585",
	MidnightBlue: "#191970",
	MintCream: "#f5fffa",
	MistyRose: "#ffe4e1",
	Moccasin: "#ffe4b5",

	NavajoWhite: "#ffdead",
	Navy: "#000080",

	Oldlace: "#fdf5e6",
	Olive: "#808000",
	Olivedrab: "#6b8e23",
	Orange: "#ffa500",
	OrangeRed: "#ff4500",
	Orchid: "#da70d6",

	PaleGoldenRod: "#eee8aa",
	PaleGreen: "#98fb98",
	PaleTurquoise: "#afeeee",
	PaleVioletRed: "#d87093",
	Papayawhip: "#ffefd5",
	Peachpuff: "#ffdab9",
	Peru: "#cd853f",
	Pink: "#ffc0cb",
	Plum: "#dda0dd",
	PowderBlue: "#b0e0e6",
	Purple: "#800080",

	Red: "#ff0000",
	RosyBrown: "#bc8f8f",
	RoyalBlue: "#4169e1",

	SaddleBrown: "#8b4513",
	Salmon: "#fa8072",
	SandyBrown: "#f4a460",
	SeaGreen: "#2e8b57",
	Seashell: "#fff5ee",
	Sienna: "#a0522d",
	Silver: "#c0c0c0",
	SkyBlue: "#87ceeb",
	SlateBlue: "#6a5acd",
	SlateGray: "#708090",
	Snow: "#fffafa",
	SpringGreen: "#00ff7f",
	SteelBlue: "#4682b4",

	Tan: "#d2b48c",
	Teal: "#008080",
	Thistle: "#d8bfd8",
	Tomato: "#ff6347",
	Turquoise: "#40e0d0",

	Violet: "#ee82ee",

	Wheat: "#f5deb3",
	White: "#ffffff",
	WhiteSmoke: "#f5f5f5",

	Yellow: "#ffff00",
	YellowGreen: "#9acd32"
};
/*
    Enum: primitives.orgdiagram.ChildrenPlacementType
        Defines children placement shape.
    
    Auto - Children placement auto defined.
    Vertical - Children form vertical column.
    Horizontal - Children placed horizontally.
    Matrix - Children placed in form of matrix.
*/
primitives.orgdiagram.ChildrenPlacementType =
{
	Auto: 0,
	Vertical: 1,
	Horizontal: 2,
	Matrix: 3
};
primitives.orgdiagram.Layers =
{
	Connector: 1,
	Highlight: 2,
	Marker: 3,
	Cursor: 4,
	Item: 5,
	Annotation: 6
};
/*
    Enum: primitives.orgdiagram.Visibility
        Defines nodes visibility mode.
    
    Auto - Auto select best visibility mode.
    Normal - Show node in normal template mode.
    Dot - Show node as dot.
    Line - Show node as line.
    Invisible - Make node invisible.

    See Also:

      <primitives.orgdiagram.Config.minimalVisibility>
*/
primitives.orgdiagram.Visibility =
{
	Auto: 0,
	Normal: 1,
	Dot: 2,
	Line: 3,
	Invisible: 4
};
/*
    Class: primitives.orgdiagram.EventArgs
	    Event details class.
*/
primitives.orgdiagram.EventArgs = function () {
	/*
	Property: oldContext
	    Reference to associated previous item in rootItem hierarchy.
    */
	this.oldContext = null;

	/*
	Property: context
	    Reference to associated new item in rootItem hierarchy.
    */
	this.context = null;

	/*
    Property: parentItem
        Reference parent item of item in context.
    */
	this.parentItem = null;

	/*
	Property: position
	    Absolute item position on diagram.

	See also:
	    <primitives.common.Rect>
    */
	this.position = null;

	/*
    Property: name
        Relative object name.

    */
	this.name = null;

	/*
	Property: cancel
	    Allows cancelation of coupled event processing. This option allows to cancel layout update 
        and subsequent <primitives.orgdiagram.Config.onCursorChanged> event 
        in handler of <primitives.orgdiagram.Config.onCursorChanging> event.
    */
	this.cancel = false;
};
/*
    Class: primitives.common.RenderEventArgs
	    Rendering event details class.
*/
primitives.common.RenderEventArgs = function () {
	/*
	Property: element
	    jQuery selector referencing template's root element.
    */
	this.element = null;

	/*
	Property: context
	    Reference to itemConfig.
    */
	this.context = null;

	/*
	Property: templateName
		This is template name used to render this item.

		See Also:
		<primitives.orgdiagram.TemplateConfig>
		<primitives.orgdiagram.Config.templates> collection property.
    */
	this.templateName = null;

	/*
	Property: renderingMode
	    This option indicates current template state.

    Default:
        <primitives.common.RenderingMode.Update>

	See also:
	    <primitives.common.RenderingMode>
    */
	this.renderingMode = null;

	/*
	Property: isCursor
	    Rendered item is cursor.
    */
	this.isCursor = false;

	/*
	Property: isSelected
	    Rendered item is selected.
    */
	this.isSelected = false;
};
primitives.common.Callout = function (graphics) {
	this.m_graphics = graphics;

	this.pointerPlacement = 0/*primitives.common.PlacementType.Auto*/;
	this.cornerRadius = "10%";
	this.offset = 0;
	this.opacity = 1;
	this.lineWidth = 1;
	this.pointerWidth = "10%";
	this.borderColor = "#000000"/*primitives.common.Colors.Black*/;
	this.fillColor = "#d3d3d3"/*primitives.common.Colors.LightGray*/;

	this.m_map = [[8/*primitives.common.PlacementType.TopLeft*/, 7/*primitives.common.PlacementType.Left*/, 6/*primitives.common.PlacementType.BottomLeft*/],
                [1/*primitives.common.PlacementType.Top*/, null, 5/*primitives.common.PlacementType.Bottom*/],
                [2/*primitives.common.PlacementType.TopRight*/, 3/*primitives.common.PlacementType.Right*/, 4/*primitives.common.PlacementType.BottomRight*/]
	];
};

primitives.common.Callout.prototype.draw = function (snapPoint, position) {
	position = new primitives.common.Rect(position).offset(this.offset);

	var pointA = new primitives.common.Point(position.x, position.y),
	pointB = new primitives.common.Point(position.right(), position.y),
	pointC = new primitives.common.Point(position.right(), position.bottom()),
	pointD = new primitives.common.Point(position.left(), position.bottom()),
	snapPoints = [null, null, null, null, null, null, null, null],
	points = [pointA, pointB, pointC, pointD],
	radius = this.m_graphics.getPxSize(this.cornerRadius, Math.min(pointA.distanceTo(pointB), pointB.distanceTo(pointC))),
	segments,
	placementType,
	point,
	element,
	index,
	attr;

	if (snapPoint !== null) {
		placementType = (this.pointerPlacement === 0/*primitives.common.PlacementType.Auto*/) ? this._getPlacement(snapPoint, pointA, pointC) : this.pointerPlacement;
		if (placementType !== null) {
			snapPoints[placementType] = snapPoint;
		}
	}

	segments = [];
	for (index = 0; index < points.length; index += 1) {
		this._drawSegment(segments, points[0], points[1], points[2], this.pointerWidth, radius, snapPoints[1], snapPoints[2]);
		point = points.shift();
		points.push(point);
		point = snapPoints.shift();
		snapPoints.push(point);
		point = snapPoints.shift();
		snapPoints.push(point);
	}

	attr = {};
	if (this.fillColor !== null) {
		attr.fillColor = this.fillColor;
		attr.opacity = this.opacity;
	}
	if (this.borderColor !== null) {
		attr.borderColor = this.borderColor;
	}
	attr.lineWidth = this.lineWidth;

	element = this.m_graphics.polyline(segments, attr);
};

primitives.common.Callout.prototype._getPlacement = function (point, point1, point2) {
	var row = null,
		column = null;
	if (point.x < point1.x) {
		row = 0;
	}
	else if (point.x > point2.x) {
		row = 2;
	}
	else {
		row = 1;
	}
	if (point.y < point1.y) {
		column = 0;
	}
	else if (point.y > point2.y) {
		column = 2;
	}
	else {
		column = 1;
	}
	return this.m_map[row][column];
};

primitives.common.Callout.prototype._drawSegment = function (segments, pointA, pointB, pointC, base, radius, sideSnapPoint, cornerSnapPoint) {
	var pointA1 = this._offsetPoint(pointA, pointB, radius),
		pointB1 = this._offsetPoint(pointB, pointA, radius),
		pointB2 = this._offsetPoint(pointB, pointC, radius),
		pointS,
		pointS1,
		pointS2;

	base = this.m_graphics.getPxSize(base, pointA.distanceTo(pointB) / 2.0);

	if (segments.length === 0) {
		segments.push(new primitives.common.MoveSegment(pointA1));
	}
	if (sideSnapPoint !== null) {
		pointS = this._betweenPoint(pointA, pointB);
		pointS1 = this._offsetPoint(pointS, pointA, base);
		pointS2 = this._offsetPoint(pointS, pointB, base);
		segments.push(new primitives.common.LineSegment(pointS1));
		segments.push(new primitives.common.LineSegment(sideSnapPoint));
		segments.push(new primitives.common.LineSegment(pointS2));
	}

	segments.push(new primitives.common.LineSegment(pointB1));
	if (cornerSnapPoint !== null) {
		segments.push(new primitives.common.LineSegment(cornerSnapPoint));
		segments.push(new primitives.common.LineSegment(pointB2));
	}
	else {
		segments.push(new primitives.common.QuadraticArcSegment(pointB, pointB2));
	}
};

primitives.common.Callout.prototype._betweenPoint = function (first, second) {
	return new primitives.common.Point((first.x + second.x) / 2, (first.y + second.y) / 2);
};

primitives.common.Callout.prototype._offsetPoint = function (first, second, offset) {
	var result = new primitives.common.Point(first);
	if (first.x < second.x) {
		result.x += offset;
	}
	else if (first.x > second.x) {
		result.x -= offset;
	}
	else if (first.y < second.y) {
		result.y += offset;
	}
	else {
		result.y -= offset;
	}
	return result;
};

/*
    Class: primitives.common.Point
    Class represents pair of x and y coordinates that defines a point in 2D plane.

	Parameters:
		point - <primitives.common.Point> object.

	Parameters:
		x - X coordinate of 2D point.
		y - Y coordinate of 2D point.	    
*/
primitives.common.Point = function (arg0, arg1) {
	/*
	Property: x
	    The x coordinate.
    */

	this.x = null;
	/*
	Property: y
	    The y coordinate.
    */

	this.y = null;

	switch (arguments.length) {
		case 1:
			this.x = arg0.x;
			this.y = arg0.y;
			break;
		case 2:
			this.x = arg0;
			this.y = arg1;
			break;
		default:
			break;
	}
};

/*
    Method: distanceTo
        Returns distance to point.

	Parameters:
		point - <primitives.common.Point> object.

	Parameters:
		x - X coordinate of 2D point.
		y - Y coordinate of 2D point.
*/
primitives.common.Point.prototype.distanceTo = function (arg0, arg1) {
	var x2 = 0,
		y2 = 0,
		a,
		b;
	switch (arguments.length) {
		case 1:
			x2 = arg0.x;
			y2 = arg0.y;
			break;
		case 2:
			x2 = arg0;
			y2 = arg1;
			break;
		default:
			break;
	}
	a = this.x - x2;
	b = this.y - y2;
	return Math.sqrt(a * a + b * b);
};

/*
    Method: toString
        Returns rectangle location in form of CSS style string.

    Parameters:
	    units - The string name of units. Uses "px" if not defined.

    Returns:
        CSS style string.
*/
primitives.common.Point.prototype.toString = function (units) {
	var result = "";

	units = (units !== undefined) ? units : "px";

	result += "left:" + this.x + units + ";";
	result += "top:" + this.y + units + ";";

	return result;
};
primitives.common.CubicArcSegment = function (arg0, arg1, arg2, arg3, arg4, arg5) {
	this.x = null;
	this.y = null;

	this.cpX1 = null;
	this.cpY1 = null;

	this.cpX2 = null;
	this.cpY2 = null;

	switch (arguments.length) {
		case 3:
			this.x = arg2.x;
			this.y = arg2.y;
			this.cpX1 = arg0.x;
			this.cpY1 = arg0.y;
			this.cpX2 = arg1.x;
			this.cpY2 = arg1.y;
			break;
		case 6:
			this.cpX1 = arg0;
			this.cpY1 = arg1;
			this.cpX2 = arg2;
			this.cpY2 = arg3;
			this.x = arg4;
			this.y = arg5;
			break;
		default:
			break;
	}

	this.segmentType = 3/*primitives.common.SegmentType.CubicArc*/;
};
primitives.common.DotSegment = function (x, y, radius) {
	this.segmentType = 4/*primitives.common.SegmentType.Dot*/;

	this.x = x;
	this.y = y;
	this.radius = radius;
};
primitives.common.LineSegment = function () {
	this.parent = primitives.common.Point.prototype;
	this.parent.constructor.apply(this, arguments);

	this.segmentType = 0/*primitives.common.SegmentType.Line*/;
};

primitives.common.LineSegment.prototype = new primitives.common.Point();
primitives.common.MoveSegment = function () {
	this.parent = primitives.common.Point.prototype;
	this.parent.constructor.apply(this, arguments);

	this.segmentType = 1/*primitives.common.SegmentType.Move*/;
};

primitives.common.LineSegment.prototype = new primitives.common.Point();
primitives.common.QuadraticArcSegment = function (arg0, arg1, arg2, arg3) {
	this.x = null;
	this.y = null;

	this.cpX = null;
	this.cpY = null;

	switch (arguments.length) {
		case 2:
			this.x = arg1.x;
			this.y = arg1.y;
			this.cpX = arg0.x;
			this.cpY = arg0.y;
			break;
		case 4:
			this.cpX = arg0;
			this.cpY = arg1;
			this.x = arg2;
			this.y = arg3;
			break;
		default:
			break;
	}

	this.segmentType = 2/*primitives.common.SegmentType.QuadraticArc*/;
};
/*
    Class: primitives.common.Rect
    Class describes the width, height and location of rectangle.

	Parameters:
		rect - Copy constructor. It takes as a parameter copy of <primitives.common.Rect> object.

	Parameters:
		pointTopLeft - Top left point <primitives.common.Point> object.
		pointBottomRight - Bottom right point <primitives.common.Point> object.

	Parameters:
		x - The x coordinate of top left corner.
		y - The y coordinate of top left corner.
		width - Rect width.
		height - Rect height.
*/
primitives.common.Rect = function (arg0, arg1, arg2, arg3) {
	/*
	Property: x
	    The location x coordinate.
    */
	this.x = null;
	/*
	Property: y
	    The location y coordinate.
    */
	this.y = null;
	/*
	Property: width
	    The width of rectangle.
    */
	this.width = null;
	/*
	Property: height
	    The height of rectangle.
    */
	this.height = null;

	switch (arguments.length) {
		case 1:
			this.x = arg0.x;
			this.y = arg0.y;
			this.width = arg0.width;
			this.height = arg0.height;
			break;
		case 2:
			this.x = Math.min(arg0.x, arg1.x);
			this.y = Math.min(arg0.y, arg1.y);
			this.width = Math.abs(arg1.x - arg0.x);
			this.height = Math.abs(arg1.y - arg0.y);
			break;
		case 4:
			this.x = arg0;
			this.y = arg1;
			this.width = arg2;
			this.height = arg3;
			break;
		default:
			break;
	}
};

/*
    Method: left
        Gets the x-axis value of the left side of the rectangle.
*/
primitives.common.Rect.prototype.left = function () {
	return this.x;
};

/*
    Method: top
        Gets the y-axis value of the top side of the rectangle.
*/
primitives.common.Rect.prototype.top = function () {
	return this.y;
};

/*
    Method: right
        Gets the x-axis value of the right side of the rectangle.
*/
primitives.common.Rect.prototype.right = function () {
	return this.x + this.width;
};

/*
    Method: bottom
        Gets the y-axis value of the bottom of the rectangle.
*/
primitives.common.Rect.prototype.bottom = function () {
	return this.y + this.height;
};

/*
    Method: verticalCenter
        Gets the y-axis value of the center point of the rectangle.
*/
primitives.common.Rect.prototype.verticalCenter = function () {
	return this.y + this.height / 2.0;
};

/*
    Method: horizontalCenter
        Gets the x-axis value of the center point of the rectangle.
*/
primitives.common.Rect.prototype.horizontalCenter = function () {
	return this.x + this.width / 2.0;
};

/*
    Method: isEmpty
        Gets the value that indicates whether  the rectangle is the Empty rectangle.
*/
primitives.common.Rect.prototype.isEmpty = function () {
	return this.x === null || this.y === null || this.width === null || this.height === null || this.width < 0 || this.height < 0;
};

/*
    Method: offset
        Expands the rectangle by using specified value in all directions.

    Parameters:
	    value - The amount by which to expand or shrink the sides of the rectangle.

    Parameters:
	    left - The amount by which to expand or shrink the left side of the rectangle.	
	    top - The amount by which to expand or shrink the top side of the rectangle.		
	    right - The amount by which to expand or shrink the right side of the rectangle.		
	    bottom - The amount by which to expand or shrink the bottom side of the rectangle.		
*/
primitives.common.Rect.prototype.offset = function (arg0, arg1, arg2, arg3) {
	switch (arguments.length) {
		case 1:
			this.x = this.x - arg0;
			this.y = this.y - arg0;

			this.width = this.width + arg0 * 2.0;
			this.height = this.height + arg0 * 2.0;
			break;
		case 4:
			this.x = this.x - arg0;
			this.y = this.y - arg1;

			this.width = this.width + arg0 + arg2;
			this.height = this.height + arg1 + arg3;
			break;
	}
	return this;
};

/*
    Method: translate
        Moves the rectangle to by the specified horizontal and vertical amounts.

    Parameters:
	    x - The amount to move the rectangle horizontally.
	    y - The amount to move the rectangle vertically.
*/
primitives.common.Rect.prototype.translate = function (x, y) {
	this.x = this.x + x;
	this.y = this.y + y;

	return this;
};

/*
    Method: invert
        Inverts rectangle.
*/
primitives.common.Rect.prototype.invert = function () {
	var width = this.width,
		x = this.x;
	this.width = this.height;
	this.height = width;
	this.x = this.y;
	this.y = x;
	return this;
};

/*
    Method: contains
        Indicates whether the rectangle contains the specified point.

    Parameters:
	    point - The point to check.

    Parameters:	
	    x - The x coordinate of the point to check.
	    y - The y coordinate of the point to check.
	
    Returns:
        true if the rectangle contains the specified point; otherwise, false.	
*/
primitives.common.Rect.prototype.contains = function (arg0, arg1) {
	switch (arguments.length) {
		case 1:
			return this.x <= arg0.x && arg0.x <= this.x + this.width && this.y <= arg0.y && arg0.y <= this.y + this.height;
		case 2:
			return this.x <= arg0 && arg0 <= this.x + this.width && this.y <= arg1 && arg1 <= this.y + this.height;
		default:
			return false;
	}
};

/*
    Method: cropByRect
        Crops the rectangle by the boundaries of specified rectangle.

    Parameters:
	    rect - The rectangle to use as the crop boundaries.
*/
primitives.common.Rect.prototype.cropByRect = function (rect) {
	if (this.x < rect.x) {
		this.width -= (rect.x - this.x);
		this.x = rect.x;
	}

	if (this.right() > rect.right()) {
		this.width -= (this.right() - rect.right());
	}

	if (this.y < rect.y) {
		this.height -= (rect.y - this.y);
		this.y = rect.y;
	}

	if (this.bottom() > rect.bottom()) {
		this.height -= this.bottom() - rect.bottom();
	}

	if (this.isEmpty()) {
		this.x = null;
		this.y = null;
		this.width = null;
		this.height = null;
	}

	return this;
};

/*
    Method: addRect
        Expands the current rectangle to contain specified rectangle.

    Parameters:
	    rect - The rectangle to contain.

    Parameters:	
	    x - The x coordinate of the point to contain.
	    y - The y coordinate of the point to contain.

	Parameters:
		x - The x coordinate of top left corner.
		y - The y coordinate of top left corner.
		width - Rect width.
		height - Rect height.
*/
primitives.common.Rect.prototype.addRect = function (arg0, arg1, arg2, arg3) {
	var right,
		bottom;
	switch (arguments.length) {
		case 1:
			if (!arg0.isEmpty()) {
				if (this.isEmpty()) {
					this.x = arg0.x;
					this.y = arg0.y;
					this.width = arg0.width;
					this.height = arg0.height;
				}
				else {
					right = Math.max(this.right(), arg0.right());
					bottom = Math.max(this.bottom(), arg0.bottom());

					this.x = Math.min(this.x, arg0.x);
					this.y = Math.min(this.y, arg0.y);
					this.width = right - this.x;
					this.height = bottom - this.y;
				}
			}
			break;
		case 2:
			if (this.isEmpty()) {
				this.x = arg0;
				this.y = arg1;
				this.width = 0;
				this.height = 0;
			}
			else {
				right = Math.max(this.right(), arg0);
				bottom = Math.max(this.bottom(), arg1);

				this.x = Math.min(this.x, arg0);
				this.y = Math.min(this.y, arg1);
				this.width = right - this.x;
				this.height = bottom - this.y;
			}
			break;
		case 4:
			if (this.isEmpty()) {
				this.x = arg0;
				this.y = arg1;
				this.width = arg2;
				this.height = arg3;
			}
			else {
				right = Math.max(this.right(), arg0 + arg2);
				bottom = Math.max(this.bottom(), arg1 + arg3);

				this.x = Math.min(this.x, arg0);
				this.y = Math.min(this.y, arg1);
				this.width = right - this.x;
				this.height = bottom - this.y;
			}
			break;
	}

	return this;
};

/*
    Method: getCSS
        Returns rectangle location and size in form of CSS style object.

    Parameters:
	    units - The string name of units. Uses "px" if not defined.

    Returns:
        CSS style object.
*/
primitives.common.Rect.prototype.getCSS = function (units) {
	units = (units !== undefined) ? units : "px";

	var result = {
		left: this.x + units,
		top: this.y + units,
		width: this.width + units,
		height: this.height + units
	};
	return result;
};

/*
    Method: toString
        Returns rectangle location and size in form of CSS style string.

    Parameters:
	    units - The string name of units. Uses "px" if not defined.

    Returns:
        CSS style string.
*/
primitives.common.Rect.prototype.toString = function (units) {
	var result = "";

	units = (units !== undefined) ? units : "px";

	result += "left:" + this.x + units + ";";
	result += "top:" + this.y + units + ";";
	result += "width:" + this.width + units + ";";
	result += "height:" + this.height + units + ";";

	return result;
};
/*
    Class: primitives.common.Size
    Class describes the size of an object.

	Parameters:
		size - Copy constructor. It takes as a parameter copy of <primitives.common.Size> object.

	Parameters:
		width - The initial width of the instance.
		height - The initial height of the instance.
*/
primitives.common.Size = function (arg0, arg1) {
	/*
	Property: width
	    The value that specifies the width of the size class.
    */

	this.width = 0;

	/*
    Property: height
        The value that specifies the height of the size class.
    */

	this.height = 0;

	switch (arguments.length) {
		case 1:
			this.width = arg0.width;
			this.height = arg0.height;
			break;
		case 2:
			this.width = arg0;
			this.height = arg1;
			break;
		default:
			break;
	}
};

/*
    Method: invert
        Swaps width and height.
*/
primitives.common.Size.prototype.invert = function () {
	var width = this.width;
	this.width = this.height;
	this.height = width;
	return this;
};
/*
    Class: primitives.common.Thickness
    Class describes the thickness of a frame around rectangle.

	Parameters:
		left - The thickness for the left side of the rectangle.
		height - The thickness for the upper side of the rectangle.
        right - The thickness for the right side of the rectangle.
        bottom - The thickness for the bottom side of the rectangle.
*/
primitives.common.Thickness = function (left, top, right, bottom) {
	/*
	Property: left
	    The thickness for the left side of the rectangle.
    */

	this.left = left;

	/*
    Property: top
        The thickness for the upper side of the rectangle.
    */

	this.top = top;

	/*
    Property: right
        The thickness for the right side of the rectangle.
    */
	this.right = right;

	/*
    Property: bottom
        The thickness for the bottom side of the rectangle.
    */
	this.bottom = bottom;
};

/*
    Method: isEmpty
        Gets the value that indicates whether the thickness is the Empty.
*/

primitives.common.Thickness.prototype.isEmpty = function () {
	return this.left === 0 && this.top === 0 && this.right === 0 && this.bottom === 0;
};

/*
    Method: toString
        Returns thickness in form of CSS style string. It is conversion to padding style string.

    Parameters:
	    units - The string name of units. Uses "px" if not defined.

    Returns:
        CSS style string.
*/

primitives.common.Thickness.prototype.toString = function (units) {
	units = (units !== undefined) ? units : "px";

	return this.left + units + ", " + this.top + units + ", " + this.right + units + ", " + this.bottom + units;
};
primitives.common.Graphics = function (widget) {
	var index;

	this.m_widget = widget;

	this.m_placeholders = {};
	this.m_activePlaceholder = null;

	this.m_cache = new primitives.common.Cache();

	this.boxModel = jQuery.support.boxModel;
	this.graphicsType = null;
	this.hasGraphics = false;
};

primitives.common.Graphics.prototype.clean = function () {
	var key,
		placeholder,
		layerKey,
		layer;
	this.m_cache.clear();

	this.m_cache = null;

	this.m_widget = null;
	for (key in this.m_placeholders) {
		if (this.m_placeholders.hasOwnProperty(key)) {
			placeholder = this.m_placeholders[key];

			for (layerKey in placeholder.layers) {
				if (placeholder.layers.hasOwnProperty(layerKey)) {
					layer = placeholder.layers[layerKey];
					layer.canvas.remove();
					layer.canvas = null;
				}
			}
			placeholder.layers.length = 0;
			placeholder.activeLayer = null;

			placeholder.size = null;
			placeholder.rect = null;
			placeholder.div = null;
		}
	}
	this.m_placeholders.length = 0;
	this.m_activePlaceholder = null;
};

primitives.common.Graphics.prototype.resize = function (arg0) {
	var key,
		placeholder;
	switch (arguments.length) {
		case 0:
			for (key in this.m_placeholders) {
				if (this.m_placeholders.hasOwnProperty(key)) {
					placeholder = this.m_placeholders[key];
					this.resizePlaceholder(placeholder);
				}
			}
			break;
		case 1:
			placeholder = this.m_placeholders[arg0];
			if (placeholder != null) {
				this.resizePlaceholder(placeholder);
			}
			break;
	}
};

primitives.common.Graphics.prototype.setTransform = function (name, invertArea, invertHorizontally, invertVertically) {
	var placeholder = this.m_placeholders[name];
	if (placeholder != null) {
		placeholder.invertArea = invertArea;
		placeholder.invertHorizontally = invertHorizontally;
		placeholder.invertVertically = invertVertically;
	}
};

primitives.common.Graphics.prototype.resizePlaceholder = function (placeholder) {
	var layerKey,
		layer;

	placeholder.size = new primitives.common.Size(placeholder.div.width(), placeholder.div.height());
	placeholder.rect = new primitives.common.Rect(0, 0, placeholder.size.width, placeholder.size.height);

	for (layerKey in placeholder.layers) {
		if (placeholder.layers.hasOwnProperty(layerKey)) {
			layer = placeholder.layers[layerKey];
			if (layer.name !== -1) {
				layer.canvas.css({
					"position": "absolute"
					, "width": "0px"
					, "height": "0px"
				});
			}
		}
	}
};

primitives.common.Graphics.prototype.begin = function () {
	this.m_cache.begin();
};

primitives.common.Graphics.prototype.end = function () {
	this.m_cache.end();
};

primitives.common.Graphics.prototype.reset = function (arg0, arg1) {
	var placeholderName = "none",
		layerName = -1;
	switch (arguments.length) {
		case 1:
			if (typeof arg0 === "string") {
				placeholderName = arg0;
			}
			else {
				layerName = arg0;
			}
			break;
		case 2:
			placeholderName = arg0;
			layerName = arg1;
			break;
	}
	this.m_cache.reset(placeholderName, layerName);
};

primitives.common.Graphics.prototype.activate = function (arg0, arg1) {
	switch (arguments.length) {
		case 1:
			if (typeof arg0 === "string") {
				this._activatePlaceholder(arg0);
				this._activateLayer(-1);
			}
			else {
				this._activatePlaceholder("none");
				this._activateLayer(arg0);
			}
			break;
		case 2:
			this._activatePlaceholder(arg0);
			this._activateLayer(arg1);
			break;
	}
	return this.m_activePlaceholder;
};

primitives.common.Graphics.prototype._activatePlaceholder = function (placeholderName) {
	var placeholder = this.m_placeholders[placeholderName],
		div;
	if (placeholder === undefined) {
		div = null;
		if (placeholderName === "none") {
			div = this.m_widget.element;
		}
		else {
			div = this.m_widget.element.find("." + placeholderName);
		}

		placeholder = new primitives.common.Placeholder(placeholderName);
		placeholder.div = div;
		placeholder.size = new primitives.common.Size(div.innerWidth(), div.innerHeight());
		placeholder.rect = new primitives.common.Rect(0, 0, placeholder.size.width, placeholder.size.height);

		this.m_placeholders[placeholderName] = placeholder;
	}
	this.m_activePlaceholder = placeholder;
};

primitives.common.Graphics.prototype._activateLayer = function (layerName) {
	var layer = this.m_activePlaceholder.layers[layerName],
		placeholder,
		canvas,
		position,
		maximumLayer,
		layerKey;
	if (layer === undefined) {
		placeholder = this.m_activePlaceholder;
		if (layerName === -1) {
			layer = new primitives.common.Layer(layerName);
			layer.canvas = placeholder.div;
		}
		else {
			canvas = jQuery('<div></div>');
			canvas.addClass("Layer" + layerName);
			position = new primitives.common.Rect(placeholder.rect);

			canvas.css({
				"position": "absolute"
				, "width": "0px"
				, "height": "0px"
			});

			maximumLayer = null;
			for (layerKey in placeholder.layers) {
				if (placeholder.layers.hasOwnProperty(layerKey)) {
					layer = placeholder.layers[layerKey];
					if (layer.name < layerName) {
						maximumLayer = (maximumLayer !== null) ? Math.max(maximumLayer, layer.name) : layer.name;
					}
				}
			}

			layer = new primitives.common.Layer(layerName);
			layer.canvas = canvas;

			if (maximumLayer === null) {
				placeholder.div.prepend(layer.canvas[0]);
			} else {
				layer.canvas.insertAfter(placeholder.layers[maximumLayer].canvas);
			}
		}
		placeholder.layers[layerName] = layer;
	}
	this.m_activePlaceholder.activeLayer = layer;
};

primitives.common.Graphics.prototype.text = function (x, y, width, height, label, orientation, horizontalAlignment, verticalAlignment, attr) {
	var placeholder = this.m_activePlaceholder,
		style = {
			"position": "absolute",
			"padding": 0,
			"margin": 0,
			"text-align": this._getTextAlign(horizontalAlignment),
			"font-size": attr["font-size"],
			"font-family": attr["font-family"],
			"font-weight": attr["font-weight"],
			"font-style": attr["font-style"],
			"color": attr["font-color"]
		},
		rotation = "",
		element,
		tdstyle;

	placeholder.transformRect(x, y, width, height, this, function (x, y, width, height) {
		switch (orientation) {
			case 0/*primitives.text.TextOrientationType.Horizontal*/:
				style.left = x;
				style.top = y;
				style.width = width;
				style.height = height;
				break;
			case 1/*primitives.text.TextOrientationType.RotateLeft*/:
				style.left = x + Math.round(width / 2.0 - height / 2.0);
				style.top = y + Math.round(height / 2.0 - width / 2.0);
				style.width = height;
				style.height = width;
				rotation = "rotate(-90deg)";
				break;
			case 2/*primitives.text.TextOrientationType.RotateRight*/:
				style.left = x + Math.round(width / 2.0 - height / 2.0);
				style.top = y + Math.round(height / 2.0 - width / 2.0);
				style.width = height;
				style.height = width;
				rotation = "rotate(90deg)";
				break;
		}

		style["-webkit-transform-origin"] = "center center";
		style["-moz-transform-origin"] = "center center";
		style["-o-transform-origin"] = "center center";
		style["-ms-transform-origin"] = "center center";


		style["-webkit-transform"] = rotation;
		style["-moz-transform"] = rotation;
		style["-o-transform"] = rotation;
		style["-ms-transform"] = rotation;
		style.transform = rotation;


		style["max-width"] = style.width;
		style["max-height"] = style.height;

		label = label.replace(new RegExp("\n", 'g'), "<br/>");
		switch (verticalAlignment) {
			case 0/*primitives.common.VerticalAlignmentType.Top*/:
				element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, "text");
				if (element === null) {
					element = jQuery("<div></div>");
					element.css(style);
					element.html(label);
					placeholder.activeLayer.canvas.append(element);
					this.m_cache.put(placeholder.name, placeholder.activeLayer.name, "text", element);
				}
				else {
					element.css(style);
					element.html(label);
				}
				break;
			default:
				style["border-collapse"] = "collapse";
				tdstyle = {
					"vertical-align": this._getVerticalAlignment(verticalAlignment),
					"padding": 0
				};
				element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, "textintable");
				if (element === null) {
					element = jQuery('<table><tbody><tr><td></td></tr></tbody></table>');
					primitives.common.css(element, style);
					element.find("td").css(tdstyle).html(label);
					placeholder.activeLayer.canvas.append(element);
					this.m_cache.put(placeholder.name, placeholder.activeLayer.name, "textintable", element);
				}
				else {
					primitives.common.css(element, style);
					element.find("td").css(tdstyle).html(label);
				}
				break;
		}
	});
};

primitives.common.Graphics.prototype._getTextAlign = function (alignment) {
	var result = null;
	switch (alignment) {
		case 0/*primitives.common.HorizontalAlignmentType.Center*/:
			result = "center";
			break;
		case 1/*primitives.common.HorizontalAlignmentType.Left*/:
			result = "left";
			break;
		case 2/*primitives.common.HorizontalAlignmentType.Right*/:
			result = "right";
			break;
	}
	return result;
};

primitives.common.Graphics.prototype._getVerticalAlignment = function (alignment) {
	var result = null;
	switch (alignment) {
		case 1/*primitives.common.VerticalAlignmentType.Middle*/:
			result = "middle";
			break;
		case 0/*primitives.common.VerticalAlignmentType.Top*/:
			result = "top";
			break;
		case 2/*primitives.common.VerticalAlignmentType.Bottom*/:
			result = "bottom";
			break;
	}
	return result;
};

primitives.common.Graphics.prototype.polyline = function (segments, attr) {
	var fromX = null,
		fromY = null,
		index,
		segment;
	for (index = 0; index < segments.length; index += 1) {
		segment = segments[index];
		switch (segment.segmentType) {
			case 1/*primitives.common.SegmentType.Move*/:
				fromX = Math.round(segment.x) + 0.5;
				fromY = Math.round(segment.y) + 0.5;
				break;
			case 0/*primitives.common.SegmentType.Line*/:
				this.rightAngleLine(fromX, fromY, Math.round(segment.x) + 0.5, Math.round(segment.y) + 0.5, attr);
				break;
			case 4/*primitives.common.SegmentType.Dot*/:
				this.dot(segment.x, segment.y, segment.radius, attr);
				break;
		}
	}
};

primitives.common.Graphics.prototype.dot = function (cx, cy, radius, attr) {
	var placeholder = this.m_activePlaceholder,
		element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, "dot");

	placeholder.transformPoint(cx, cy, this, function (cx, cy) {
		var style = {
			"position": "absolute",
			"width": radius * 2.0,
			"top": cy - radius + 0.5,
			"left": cx - radius + 0.5,
			"padding": 0,
			"margin": 0,
			"line-height": "0px",
			"overflow": "hidden",
			"height": radius * 2.0,
			"background": attr.fillColor,
			"-moz-border-radius": radius,
			"-webkit-border-radius": radius,
			"-khtml-border-radius": radius,
			"border-radius": radius,
			"font-size": "0px",
			"border-style": "None",
			"border-width": "0px"
		};

		if (element === null) {
			element = jQuery('<div></div>');
			primitives.common.css(element, style);
			placeholder.activeLayer.canvas.append(element);
			this.m_cache.put(placeholder.name, placeholder.activeLayer.name, "dot", element);
		} else {
			primitives.common.css(element, style);
		}
	});
};

primitives.common.Graphics.prototype.rightAngleLine = function (fromX, fromY, toX, toY, attr) {
	var placeholder = this.m_activePlaceholder;

	placeholder.transformPoints(fromX, fromY, toX, toY, this, function (fromX, fromY, toX, toY) {
		var pathString = "",
		isVertical = Math.abs(toY - fromY) > Math.abs(toX - fromX),
		lineWidth = attr.lineWidth,
		style = {
			"position": "absolute",
			"top": Math.round(Math.min(fromY, toY) - ((isVertical) ? 0 : lineWidth / 2.0)),
			"left": Math.round(Math.min(fromX, toX) - ((isVertical) ? lineWidth / 2.0 : 0)),
			"padding": 0,
			"margin": 0,
			"opacity": 0.5,
			"line-height": "0px",
			"overflow": "hidden",
			"background": attr.borderColor,
			"font-size": "0px"
		},
		element;

		if (isVertical) {
			style.width = lineWidth;
			style.height = Math.abs(Math.round(toY - fromY));
		} else {
			style.width = Math.abs(Math.round(toX - fromX));
			style.height = lineWidth;
		}

		element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, "rect");
		if (element === null) {
			element = jQuery("<div></div>");
			primitives.common.css(element, style);
			placeholder.activeLayer.canvas.append(element);
			this.m_cache.put(placeholder.name, placeholder.activeLayer.name, "rect", element);
		} else {
			primitives.common.css(element, style);
		}
	});
};

primitives.common.Graphics.prototype.template = function (x, y, width, height, contentx, contenty, contentWidth, contentHeight, template, hashCode, onRenderTemplate, uiHash, attr) {
	var placeholder = this.m_activePlaceholder,
		element;

	placeholder.transformRect(x, y, width, height, this, function (x, y, width, height) {
		var templateKey = "template" + (hashCode !== null) ? hashCode : primitives.common.hashCode(template),
		gap = 0,
		style;

		element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, templateKey);

		if (attr !== null) {
			if (attr["border-width"] !== undefined) {
				gap = this.boxModel ? this.getPxSize(attr["border-width"]) : 0;
			}
		}

		style = {
			"width": (contentWidth - gap) + "px",
			"height": (contentHeight - gap) + "px",
			"top": (y + contenty) + "px",
			"left": (x + contentx) + "px"
		};

		jQuery.extend(style, attr);

		if (uiHash === null) {
			uiHash = new primitives.common.RenderEventArgs();
		}
		if (element === null) {
			element = jQuery(template);
			jQuery.extend(style, {
				"position": "absolute",
				"overflow": "hidden",
				"padding": "0px",
				"margin": "0px"
			}, attr);
			primitives.common.css(element, style);

			uiHash.element = element;
			uiHash.renderingMode = 0/*primitives.common.RenderingMode.Create*/;

			if (onRenderTemplate !== null) {
				this.m_widget._trigger(onRenderTemplate, null, uiHash);
			}
			placeholder.activeLayer.canvas.append(element);
			this.m_cache.put(placeholder.name, placeholder.activeLayer.name, templateKey, element);
		} else {
			uiHash.element = element;
			uiHash.renderingMode = 1/*primitives.common.RenderingMode.Update*/;
			primitives.common.css(element, style);
			if (onRenderTemplate !== null) {
				this.m_widget._trigger(onRenderTemplate, null, uiHash);
			}
		}
	});
	return element;
};

primitives.common.Graphics.prototype.getPxSize = function (value, base) {
	var result = value;
	if (typeof value === "string") {
		if (value.indexOf("pt") > 0) {
			result = parseInt(value, 10) * 96 / 72;
		}
		else if (value.indexOf("%") > 0) {
			result = parseFloat(value) / 100.0 * base;
		}
		else {
			result = parseInt(value, 10);
		}
	}
	return result;
};
primitives.common.Cache = function () {
	this.threshold = 20;

	this.m_visible = {};
	this.m_invisible = {};
};

primitives.common.Cache.prototype.begin = function () {
	var placeholder,
		type,
		index,
		control;

	for (placeholder in this.m_visible) {
		if (this.m_visible.hasOwnProperty(placeholder)) {
			for (type in this.m_visible[placeholder]) {
				if (this.m_visible[placeholder].hasOwnProperty(type)) {
					for (index = this.m_visible[placeholder][type].length - 1; index >= 0; index -= 1) {
						control = this.m_visible[placeholder][type][index];
						control.css({ "visibility": "hidden" });
						this.m_invisible[placeholder][type].push(control);
					}
					this.m_visible[placeholder][type].length = 0;
				}
			}
		}
    }
};

primitives.common.Cache.prototype.end = function () {
	var placeholder,
		type,
		control;
	for (placeholder in this.m_visible) {
		if (this.m_visible.hasOwnProperty(placeholder)) {
			for (type in this.m_visible[placeholder]) {
				if (this.m_visible[placeholder].hasOwnProperty(type)) {
					control = null;
					if (this.m_invisible[placeholder][type].length > this.threshold) {
						while ((control = this.m_invisible[placeholder][type].pop()) !== undefined) {
							control.remove();
						}
					}
				}
			}
		}
	}
};

primitives.common.Cache.prototype.reset = function (placeholder, layer) {
	placeholder = placeholder + "-" + layer;
	var control = null,
		type,
		index;
	for (type in this.m_visible[placeholder]) {
		if (this.m_visible[placeholder].hasOwnProperty(type)) {
			for (index = this.m_visible[placeholder][type].length - 1; index >= 0; index -= 1) {
				control = this.m_visible[placeholder][type][index];
				this.m_invisible[placeholder][type].push(control);
				control.css({ "visibility": "hidden" });
			}
			this.m_visible[placeholder][type].length = 0;
		}
	}
};

primitives.common.Cache.prototype.clear = function () {
	var placeholder,
		type,
		control;
	for (placeholder in this.m_visible) {
		if (this.m_visible.hasOwnProperty(placeholder)) {
			for (type in this.m_visible[placeholder]) {
				if (this.m_visible[placeholder].hasOwnProperty(type)) {
					control = null;
					while ((control = this.m_visible[placeholder][type].pop()) !== undefined) {
						control.remove();
					}
					while ((control = this.m_invisible[placeholder][type].pop()) !== undefined) {
						control.remove();
					}
				}
			}
		}
	}
};

primitives.common.Cache.prototype.get = function (placeholder, layer, type) {
	placeholder = placeholder + "-" + layer;
	var result = null;
	if (this.m_visible[placeholder] === undefined) {
		this.m_visible[placeholder] = {};
		this.m_invisible[placeholder] = {};
	}
	if (this.m_visible[placeholder][type] === undefined) {
		this.m_visible[placeholder][type] = [];
		this.m_invisible[placeholder][type] = [];
	}
	result = this.m_invisible[placeholder][type].pop() || null;
	if (result !== null) {
		this.m_visible[placeholder][type].push(result);
		result.css({ "visibility": "inherit" });
	}
	return result;
};

primitives.common.Cache.prototype.put = function (placeholder, layer, type, control) {
	placeholder = placeholder + "-" + layer;
	this.m_visible[placeholder][type].push(control);
};
primitives.common.CanvasGraphics = function (widget) {
	this.parent = primitives.common.Graphics.prototype;

	this.parent.constructor.apply(this, arguments);

	this.graphicsType = 1/*primitives.common.GraphicsType.Canvas*/;
	this.m_maximum = 6000;
};

primitives.common.CanvasGraphics.prototype = new primitives.common.Graphics();

primitives.common.CanvasGraphics.prototype.clean = function () {
	var key,
		placeholder,
		layerKey,
		layer;
	for (key in this.m_placeholders) {
		if (this.m_placeholders.hasOwnProperty(key)) {
			placeholder = this.m_placeholders[key];
			for (layerKey in placeholder.layers) {
				if (placeholder.layers.hasOwnProperty(layerKey)) {
					layer = placeholder.layers[layerKey];
					if (layer.canvascanvas !== null) {
						layer.canvascanvas.remove();
						layer.canvascanvas = null;
					}
				}
			}
		}
	}
	this.parent.clean.apply(this, arguments);
};

primitives.common.CanvasGraphics.prototype._activatePlaceholder = function (placeholderName) {
	var placeholder,
		width,
		height;

	this.parent._activatePlaceholder.apply(this, arguments);

	placeholder = this.m_activePlaceholder;
	width = placeholder.size.width;
	height = placeholder.size.height;
	if (width > this.m_maximum || height > this.m_maximum) {
		placeholder.hasGraphics = false;
	}
	else {
		placeholder.hasGraphics = true;
	}
};

primitives.common.CanvasGraphics.prototype.resizePlaceholder = function (placeholder) {
	var layerKey,
		layer,
		width,
		height;

	this.parent.resizePlaceholder.apply(this, arguments);

	width = placeholder.size.width;
	height = placeholder.size.height;

	for (layerKey in placeholder.layers) {
		if (placeholder.layers.hasOwnProperty(layerKey)) {
			layer = placeholder.layers[layerKey];
			if (layer.canvascanvas !== null) {
				layer.canvascanvas.css({
					"position": "absolute",
					"width": width + "px",
					"height": height + "px"
				});
				layer.canvascanvas.attr({
					"width": width + "px",
					"height": height + "px"
				});
			}
		}
	}
};

primitives.common.CanvasGraphics.prototype.begin = function () {
	var key,
		placeholder,
		layerKey,
		layer,
		width,
		height;
	this.parent.begin.apply(this);

	for (key in this.m_placeholders) {
		if (this.m_placeholders.hasOwnProperty(key)) {
			placeholder = this.m_placeholders[key];
			width = placeholder.size.width;
			height = placeholder.size.height;
			for (layerKey in placeholder.layers) {
				if (placeholder.layers.hasOwnProperty(layerKey)) {
					layer = placeholder.layers[layerKey];

					if (layer.canvascanvas !== null) {
						layer.canvascontext.clearRect(0, 0, width, height);
					}
				}
			}
		}
	}
};

primitives.common.Graphics.prototype._getContext = function (placeholder, layer) {
	var width = placeholder.size.width,
		height = placeholder.size.height;

	if (layer.canvascanvas === null) {
		layer.canvascanvas = jQuery('<canvas></canvas>');

		layer.canvascanvas.attr({
			"width": width + "px",
			"height": height + "px"
		});
		placeholder.activeLayer.canvas.prepend(layer.canvascanvas);
		layer.canvascontext = layer.canvascanvas[0].getContext('2d');
	}
	return layer.canvascontext;
};

primitives.common.CanvasGraphics.prototype.reset = function (arg0, arg1) {
	var placeholderName = "none",
		layerName = -1,
		placeholder,
		layer,
		width,
		height;
	switch (arguments.length) {
		case 1:
			if (typeof arg0 === "string") {
				placeholderName = arg0;
			}
			else {
				layerName = arg0;
			}
			break;
		case 2:
			placeholderName = arg0;
			layerName = arg1;
			break;
	}

	this.parent.reset.apply(this, arguments);

	placeholder = this.m_placeholders[placeholderName];
	if (placeholder !== undefined) {
		width = placeholder.size.width;
		height = placeholder.size.height;
		layer = placeholder.layers[layerName];
		if (layer !== undefined && layer.canvascanvas !== null) {
			layer.canvascontext.clearRect(0, 0, width, height);
		}
	}
};

primitives.common.CanvasGraphics.prototype.polyline = function (segments, attr) {
	var placeholder = this.m_activePlaceholder,
		layer,
		context,
		index,
		segment;
	if (!placeholder.hasGraphics) {
		this.parent.polyline.apply(this, arguments);
	}
	else {
		layer = placeholder.activeLayer;
		context = this._getContext(placeholder, layer);
		context.save();

		if (attr.lineWidth !== undefined && attr.borderColor !== undefined) {
			context.strokeStyle = attr.borderColor;
			context.lineWidth = attr.lineWidth;
		}
		else {
			context.lineWidth = 0;
			context.strokeStyle = "Transparent";
		}

		context.beginPath();
		for (index = 0; index < segments.length; index += 1) {
			segment = segments[index];
			switch (segment.segmentType) {
				case 1/*primitives.common.SegmentType.Move*/:
					placeholder.transformPoint(Math.floor(segment.x) + 0.5, Math.floor(segment.y) + 0.5, this, function (x, y) {
						context.moveTo(x, y);
					});
					break;
				case 0/*primitives.common.SegmentType.Line*/:
					placeholder.transformPoint(Math.floor(segment.x) + 0.5, Math.floor(segment.y) + 0.5, this, function (x, y) {
						context.lineTo(x, y);
					});
					break;
				case 4/*primitives.common.SegmentType.Dot*/:
					placeholder.transformPoint(Math.floor(segment.x) + 0.5, Math.floor(segment.y) + 0.5, this, function (x, y) {
						context.moveTo(x, y);
						context.arc(x, y, Math.floor(segment.radius), 0, 2 * Math.PI, false);
					});
					break;
				case 2/*primitives.common.SegmentType.QuadraticArc*/:
					placeholder.transformPoints(Math.floor(segment.cpX) + 0.5, Math.floor(segment.cpY) + 0.5, Math.floor(segment.x) + 0.5, Math.floor(segment.y) + 0.5,
						this, function (cpX, cpY, x, y) {
							context.quadraticCurveTo(cpX, cpY, x, y);
					});
					break;
				case 3/*primitives.common.SegmentType.CubicArc*/:
					placeholder.transform3Points(Math.floor(segment.cpX1) + 0.5,
								Math.floor(segment.cpY1) + 0.5,
								Math.floor(segment.cpX2) + 0.5,
								Math.floor(segment.cpY2) + 0.5,
								Math.floor(segment.x) + 0.5,
								Math.floor(segment.y) + 0.5,
								this, function (cpX1, cpY1, cpX2, cpY2, x, y) {
									context.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, x, y);
								});
					break;
			}
		}
		if (attr.lineWidth !== undefined) {
			context.stroke();
		}
		if (attr.fillColor !== undefined) {
			context.fillStyle = attr.fillColor;
			context.globalAlpha = attr.opacity;
			context.fill();
		}
		context.restore();
	}
};
primitives.common.Element = function (arg0, arg1) {
	this.ns = null;
	this.name = null;
	this.attr = {};
	this.style = {};

	this.children = [];

	switch (arguments.length) {
		case 1:
			this.name = arg0;
			break;
		case 2:
			this.ns = arg0;
			this.name = arg1;
			break;
		default:
			break;
	}
};

primitives.common.Element.prototype.setAttribute = function (key, value) {
	this.attr[key] = value;
};

primitives.common.Element.prototype.appendChild = function (child) {
	this.children[this.children.length] = child;
};

primitives.common.Element.prototype.create = function (ie8mode) {
	var result = null,
		name,
		child,
		index;
	if (this.ns !== null) {
		result = document.createElementNS(this.ns, this.name);
	}
	else {
		result = document.createElement(this.name);
	}
	for (name in this.attr) {
		if (this.attr.hasOwnProperty(name)) {
			if (ie8mode !== undefined) {
				result[name] = this.attr[name];
			}
			else {
				result.setAttribute(name, this.attr[name]);
			}
		}
	}
	for (name in this.style) {
		if (this.style.hasOwnProperty(name)) {
			result.style[name] = this.style[name];
		}
	}
	for (index = 0; index < this.children.length; index += 1) {
		child = this.children[index];
		if (typeof child === "string") {
			result.appendChild(document.createTextNode(child));
		}
		else {
			result.appendChild(child.create(ie8mode));
		}
	}
	return result;
};

primitives.common.Element.prototype.update = function (target, ie8mode) {
	var name,
		length,
		index,
		child,
		value;
	for (name in this.style) {
		if (this.style.hasOwnProperty(name)) {
			value = this.style[name];
			if (target.style[name] !== value) {
				target.style[name] = value;
			}
		}
	}
	for (name in this.attr) {
		if (this.attr.hasOwnProperty(name)) {
			value = this.attr[name];
			if (ie8mode !== undefined) {
				if (target[name] !== value) {
					target[name] = value;
				}
			}
			else {
				if (target.getAttribute(name) !== value) {
					target.setAttribute(name, value);
				}
			}
		}
	}
	length = this.children.length;
	for (index = 0; index < length; index += 1) {
		child = this.children[index];
		if (typeof child === "string") {
			if (target.innerHtml !== child) {
				target.innerHtml = child;
			}
		}
		else {
			this.children[index].update(target.children[index], ie8mode);
		}
	}
};
primitives.common.Layer = function (name) {
	this.name = name;

	this.canvas = null;

	this.canvascanvas = null;
	this.svgcanvas = null;
};
primitives.common.Placeholder = function (name) {
	this.name = name;

	this.invertArea = null;
	this.invertHorizontally = null;
	this.invertVertically = null;

	this.layers = {};
	this.activeLayer = null;

	this.size = null;
	this.rect = null;

	this.div = null;

	this.hasGraphics = true;
};

primitives.common.Placeholder.prototype.transformPointBack = function (x, y, self, func) {
	var value;

	if (this.invertHorizontally) {
		x = this.size.width - x;
	}
	if (this.invertVertically) {
		y = this.size.height - y;
	}

	if (this.invertArea) {
		value = x;
		x = y;
		y = value;
	}

	func.call(self, x, y);
};

primitives.common.Placeholder.prototype.transformPoint = function (x, y, self, func) {
	var value;

	if (this.invertArea) {
		value = x;
		x = y;
		y = value;
	}

	if (this.invertHorizontally) {
		x = this.size.width - x;
	}
	if (this.invertVertically) {
		y = this.size.height - y;
	}
	
	func.call(self, x, y);
};

primitives.common.Placeholder.prototype.transformPoints = function (x, y, x2, y2, self, func) {
	var value;

	if (this.invertArea) {
		value = x;
		x = y;
		y = value;
		value = x2;
		x2 = y2;
		y2 = value;
	}

	if (this.invertHorizontally) {
		x = this.size.width - x;
		x2 = this.size.width - x2;
	}

	if (this.invertVertically) {
		y = this.size.height - y;
		y2 = this.size.height - y2;
	}

	func.call(self, x, y, x2, y2);
};

primitives.common.Placeholder.prototype.transform3Points = function (x, y, x2, y2, x3, y3, self, func) {
	var value;

	if (this.invertArea) {
		value = x;
		x = y;
		y = value;
		value = x2;
		x2 = y2;
		y2 = value;
		value = x3;
		x3 = y3;
		y3 = value;
	}

	if (this.invertHorizontally) {
		x = this.size.width - x;
		x2 = this.size.width - x2;
		x3 = this.size.width - x3;
	}
	if (this.invertVertically) {
		y = this.size.height - y;
		y2 = this.size.height - y2;
		y3 = this.size.height - y3;
	}
	func.call(self, x, y, x2, y2, x3, y3);
};

primitives.common.Placeholder.prototype.transformRect = function (x, y, width, height, self, func) {
	var value;

	if (this.invertArea) {
		value = x;
		x = y;
		y = value;
		value = width;
		width = height;
		height = value;
	}

	if (this.invertHorizontally) {
		x = this.size.width - x - width;
	}
	if (this.invertVertically) {
		y = this.size.height - y - height;
	}

	func.call(self, x, y, width, height);
};
primitives.common.SvgGraphics = function (widget) {
	this.parent = primitives.common.Graphics.prototype;

	this.parent.constructor.apply(this, arguments);

	this._svgxmlns = "http://www.w3.org/2000/svg";

	this.graphicsType = 0/*primitives.common.GraphicsType.SVG*/;

	this.hasGraphics = true;
};

primitives.common.SvgGraphics.prototype = new primitives.common.Graphics();

primitives.common.SvgGraphics.prototype.clean = function () {
	var key,
		placeholder,
		layerKey,
		layer;
	for (key in this.m_placeholders) {
		if (this.m_placeholders.hasOwnProperty(key)) {
			placeholder = this.m_placeholders[key];
			for (layerKey in placeholder.layers) {
				if (placeholder.layers.hasOwnProperty(layerKey)) {
					layer = placeholder.layers[layerKey];
					if (layer.svgcanvas !== null) {
						layer.svgcanvas.remove();
						layer.svgcanvas = null;
					}
				}
			}
		}
	}
	this.parent.clean.apply(this, arguments);
};

primitives.common.SvgGraphics.prototype.resizePlaceholder = function (placeholder) {
	var layerKey,
		layer,
		position;

	this.parent.resizePlaceholder.apply(this, arguments);

	for (layerKey in placeholder.layers) {
		if (placeholder.layers.hasOwnProperty(layerKey)) {
			layer = placeholder.layers[layerKey];
			if (layer.svgcanvas !== null) {
				position = {
					"position": "absolute"
					, "width": placeholder.size.width + "px"
					, "height": placeholder.size.height + "px"
				};
				layer.svgcanvas.css(position);
			}
		}
	}
};

primitives.common.SvgGraphics.prototype._getCanvas = function () {
	var placeholder = this.m_activePlaceholder,
		layer = placeholder.activeLayer,
		panelSize = placeholder.rect;
	if (layer.svgcanvas === null) {
		layer.svgcanvas = jQuery('<svg version = "1.1"></svg>');
		layer.svgcanvas.attr({
			"viewBox": panelSize.x + " " + panelSize.y + " " + panelSize.width + " " + panelSize.height
		});
		layer.svgcanvas.css({
			"width": panelSize.width + "px",
			"height": panelSize.height + "px"
		});
		placeholder.activeLayer.canvas.prepend(layer.svgcanvas);
	}

	return layer.svgcanvas;
};

primitives.common.SvgGraphics.prototype.polyline = function (segments, attr) {
	var placeholder = this.m_activePlaceholder,
		polyline,
		data,
		index,
		segment,
		element,
		svgcanvas;


	polyline = new primitives.common.Element(this._svgxmlns, "path");
	if (attr.fillColor !== undefined) {
		polyline.setAttribute("fill", attr.fillColor);
		polyline.setAttribute("fill-opacity", attr.opacity);
	}
	else {
		polyline.setAttribute("fill-opacity", 0);
	}

	if (attr.lineWidth !== undefined && attr.borderColor !== undefined) {
		polyline.setAttribute("stroke", attr.borderColor);
		polyline.setAttribute("stroke-width", attr.lineWidth);
	} else {
		polyline.setAttribute("stroke", "transparent");
		polyline.setAttribute("stroke-width", 0);
	}

	data = "";
	for (index = 0; index < segments.length; index += 1) {
		segment = segments[index];
		switch (segment.segmentType) {
			case 1/*primitives.common.SegmentType.Move*/:
				placeholder.transformPoint(Math.floor(segment.x) + 0.5, Math.floor(segment.y) + 0.5, this, function (x, y) {
					data += "M" + x + " " + y;
				});
				break;
			case 0/*primitives.common.SegmentType.Line*/:
				placeholder.transformPoint(Math.floor(segment.x) + 0.5, Math.floor(segment.y) + 0.5, this, function (x, y) {
					data += "L" + x + " " + y;
				});
				break;
			case 2/*primitives.common.SegmentType.QuadraticArc*/:
				placeholder.transformPoints(Math.floor(segment.cpX) + 0.5, Math.floor(segment.cpY) + 0.5, Math.floor(segment.x) + 0.5, Math.floor(segment.y) + 0.5,
						this, function (cpX, cpY, x, y) {
							data += "Q" + cpX + " " + cpY + " " + x + " " + y;
						});
				break;
			case 4/*primitives.common.SegmentType.Dot*/:
				placeholder.transformPoints(Math.floor(segment.x - segment.radius) + 0.5, Math.floor(segment.y) + 0.5, Math.floor(segment.x + segment.radius) + 0.5, Math.floor(segment.y) + 0.5,
						this, function (x, y, x2, y2) {
							data += "M" + x + " " + y;
							data += "A" + segment.radius + " " + segment.radius + " 0 1 0 " + x2 + " " + y2;
							data += "A" + segment.radius + " " + segment.radius + " 0 1 0 " + x + " " + y;
						});
				break;
			case 3/*primitives.common.SegmentType.CubicArc*/:
				placeholder.transform3Points(Math.floor(segment.cpX1) + 0.5,
							Math.floor(segment.cpY1) + 0.5,
							Math.floor(segment.cpX2) + 0.5,
							Math.floor(segment.cpY2) + 0.5,
							Math.floor(segment.x) + 0.5,
							Math.floor(segment.y) + 0.5,
							this, function (cpX1, cpY1, cpX2, cpY2, x, y) {
								data += "C" + cpX1 + " " + cpY1 + " " + cpX2 + " " + cpY2 + " " + x + " " + y;
							});
				break;
		}
	}
	polyline.setAttribute("d", data);
	element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, "path");
	if (element === null) {
		element = jQuery(polyline.create());
		svgcanvas = this._getCanvas();
		svgcanvas.append(element);
		this.m_cache.put(placeholder.name, placeholder.activeLayer.name, "path", element);
	}
	else {
		polyline.update(element[0]);
	}
};
primitives.common.VmlGraphics = function (widget) {
	var vmlStyle,
		names,
		index;
	this.parent = primitives.common.Graphics.prototype;
	this.parent.constructor.apply(this, arguments);


	this.prefix = "rvml";
	this.ie8mode = (document.documentMode && document.documentMode >= 8);

	try {
		/*ignore jslint start*/
		eval('document.namespaces');
		/*ignore jslint end*/
	}
	catch (ex) {

	}

	if (!document.namespaces[this.prefix]) {
		document.namespaces.add(this.prefix, 'urn:schemas-microsoft-com:vml');
	}

	if (!primitives.common.VmlGraphics.prototype.vmlStyle) {
		vmlStyle = primitives.common.VmlGraphics.prototype.vmlStyle = document.createStyleSheet();
		names = [" *", "fill", "shape", "path", "textpath"];
		for (index = 0; index < names.length; index += 1) {
			vmlStyle.addRule(this.prefix + "\\:" + names[index], "behavior:url(#default#VML); position:absolute;");
		}
	}

	this.graphicsType = 2/*primitives.common.GraphicsType.VML*/;
	this.hasGraphics = true;
};

primitives.common.VmlGraphics.prototype = new primitives.common.Graphics();

primitives.common.VmlGraphics.prototype.text = function (x, y, width, height, label, orientation, horizontalAlignment, verticalAlignment, attr) {
	var placeholder,
		rotateLeft,
		textRect,
		textRectCoordSize,
		line,
		path,
		lineHeight,
		textHeight,
		fromPoint,
		toPoint,
		textpath,
		element;

	if (orientation === 0/*primitives.text.TextOrientationType.Horizontal*/) {
		this.parent.text.call(this, x, y, width, height, label, orientation, horizontalAlignment, verticalAlignment, attr);
	}
	else {
		placeholder = this.m_activePlaceholder;

		placeholder.transformRect(x, y, width, height, this, function (x, y, width, height) {
			rotateLeft = (orientation === 1/*primitives.text.TextOrientationType.RotateLeft*/);
			textRect = new primitives.common.Rect(x, y, width, height);
			textRectCoordSize = new primitives.common.Rect(0, 0, width * 10, height * 10);

			line = new primitives.common.Element(this.prefix + ":shape");
			line.setAttribute("CoordSize", textRectCoordSize.width + "," + textRectCoordSize.height);
			line.setAttribute("filled", true);
			line.setAttribute("stroked", false);
			line.setAttribute("fillcolor", attr["font-color"]);
			line.style.top = textRect.y + "px";
			line.style.left = textRect.x + "px";
			line.style.width = textRect.width + "px";
			line.style.height = textRect.height + "px";
			line.style['font-family'] = attr['font-family'];


			path = new primitives.common.Element(this.prefix + ":path");
			path.setAttribute("TextPathOk", true);

			lineHeight = 10 * Math.floor(this.getPxSize(attr['font-size'])) * 1.6 /* ~ line height*/;
			textHeight = lineHeight * Math.max(label.split('\n').length - 1, 1);
			fromPoint = null;
			toPoint = null;

			if (rotateLeft) {
				switch (verticalAlignment) {
					case 0/*primitives.common.VerticalAlignmentType.Top*/:
						fromPoint = new primitives.common.Point(textRectCoordSize.x + textHeight / 2.0, textRectCoordSize.bottom());
						toPoint = new primitives.common.Point(textRectCoordSize.x + textHeight / 2.0, textRectCoordSize.y);
						break;
					case 1/*primitives.common.VerticalAlignmentType.Middle*/:
						fromPoint = new primitives.common.Point(textRectCoordSize.horizontalCenter(), textRectCoordSize.bottom());
						toPoint = new primitives.common.Point(textRectCoordSize.horizontalCenter(), textRectCoordSize.y);
						break;
					case 2/*primitives.common.VerticalAlignmentType.Bottom*/:
						fromPoint = new primitives.common.Point(textRectCoordSize.right() - textHeight / 2.0, textRectCoordSize.bottom());
						toPoint = new primitives.common.Point(textRectCoordSize.right() - textHeight / 2.0, textRectCoordSize.y);
						break;
				}
			}
			else {
				switch (verticalAlignment) {
					case 0/*primitives.common.VerticalAlignmentType.Top*/:
						fromPoint = new primitives.common.Point(textRectCoordSize.right() - textHeight / 2.0, textRectCoordSize.y);
						toPoint = new primitives.common.Point(textRectCoordSize.right() - textHeight / 2.0, textRectCoordSize.bottom());
						break;
					case 1/*primitives.common.VerticalAlignmentType.Middle*/:
						fromPoint = new primitives.common.Point(textRectCoordSize.horizontalCenter(), textRectCoordSize.y);
						toPoint = new primitives.common.Point(textRectCoordSize.horizontalCenter(), textRectCoordSize.bottom());
						break;
					case 2/*primitives.common.VerticalAlignmentType.Bottom*/:
						fromPoint = new primitives.common.Point(textRectCoordSize.x + textHeight / 2.0, textRectCoordSize.y);
						toPoint = new primitives.common.Point(textRectCoordSize.x + textHeight / 2.0, textRectCoordSize.bottom());
						break;
				}
			}
			path.setAttribute("v", " m" + fromPoint.x + "," + fromPoint.y + " l" + toPoint.x + "," + toPoint.y + " e");

			textpath = new primitives.common.Element(this.prefix + ":textpath");
			textpath.setAttribute("on", true);
			textpath.setAttribute("string", label);
			textpath.style.trim = false;
			textpath.style['v-text-align'] = this._getTextAlign(horizontalAlignment);
			textpath.style['font-family'] = attr['font-family'];
			textpath.style['font-size'] = attr['font-size'];
			textpath.style['font-style'] = attr['font-style'];
			textpath.style['font-weight'] = attr['font-weight'];

			line.appendChild(path);
			line.appendChild(textpath);

			element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, "vmltext");
			if (element === null) {
				element = jQuery(line.create(this.ie8mode));
				placeholder.activeLayer.canvas.append(element);
				this.m_cache.put(placeholder.name, placeholder.activeLayer.name, "vmltext", element);
			}
			else {
				line.update(element[0], this.ie8mode);
			}
		});
	}
};

primitives.common.VmlGraphics.prototype.polyline = function (segments, attr) {
	var placeholder = this.m_activePlaceholder,
		rect = new primitives.common.Rect(placeholder.rect),
		rectCoordSize = new primitives.common.Rect(0, 0, rect.width * 10, rect.height * 10),
		shape = new primitives.common.Element(this.prefix + ":shape"),
		data,
		segment,
		index,
		path,
		fill,
		element;

	if (attr.borderColor !== undefined && attr.lineWidth !== undefined) {
		shape.setAttribute("strokecolor", attr.borderColor);
		shape.setAttribute("strokeweight", attr.lineWidth);
		shape.setAttribute("stroked", true);
	}
	else {
		shape.setAttribute("stroked", false);
	}
	
	shape.setAttribute("CoordSize", rectCoordSize.width + "," + rectCoordSize.height);
	shape.style.top = rect.y + "px";
	shape.style.left = rect.x + "px";
	shape.style.width = rect.width + "px";
	shape.style.height = rect.height + "px";

	data = "";
	for (index = 0; index < segments.length; index += 1) {
		segment = segments[index];
		switch (segment.segmentType) {
			case 1/*primitives.common.SegmentType.Move*/:
				placeholder.transformPoint(Math.floor(segment.x), Math.floor(segment.y), this, function (x, y) {
					data += " m" + 10 * x + "," + 10 * y;
				});
				break;
			case 0/*primitives.common.SegmentType.Line*/:
				placeholder.transformPoint(Math.floor(segment.x), Math.floor(segment.y), this, function (x, y) {
					data += " l" + 10 * x + "," + 10 * y;
				});
				break;
			case 4/*primitives.common.SegmentType.Dot*/:
				placeholder.transformPoints(Math.floor(segment.x - segment.radius), Math.floor(segment.y - segment.radius),
						Math.floor(segment.x + segment.radius), Math.floor(segment.y + segment.radius),
					this, function (x, y, x2, y2) {
						var value;
						if (x > x2) {
							value = x;
							x = x2;
							x2 = value;
						}
						if (y > y2) {
							value = y;
							y = y2;
							y2 = value;
						}
						x = 10 * x + 5;
						y = 10 * y + 5;
						x2 = 10 * x2 - 5;
						y2 = 10 * y2 - 5;
						data += " m" + x + "," + y;
						data += " l" + x2 + "," + y;
						data += " l" + x2 + "," + y2;
						data += " l" + x + "," + y2;
						data += " l" + x + "," + y;
					});
				break;
			case 2/*primitives.common.SegmentType.QuadraticArc*/:
				placeholder.transformPoints(Math.floor(segment.cpX), Math.floor(segment.cpY), Math.floor(segment.x), Math.floor(segment.y),
					this, function (cpX, cpY, x, y) {
						data += " qb" + 10 * cpX + "," + 10 * cpY + " l" + 10 * x + "," + 10 * y;
					});
				break;
			case 3/*primitives.common.SegmentType.CubicArc*/:
				placeholder.transform3Points(Math.floor(segment.cpX1), Math.floor(segment.cpY1),
							Math.floor(segment.cpX2), Math.floor(segment.cpY2),
							Math.floor(segment.x), Math.floor(segment.y),
							this, function (cpX1, cpY1, cpX2, cpY2, x, y) {
								data += " c" + 10 * cpX1 + "," + 10 * cpY1 + "," + 10 * cpX2 + "," + 10 * cpY2 + "," + 10 * x + "," + 10 * y;
							});
				break;
		}
	}
	data += " e";

	path = new primitives.common.Element(this.prefix + ":path");
	path.setAttribute("v", data);
	shape.appendChild(path);

	if (attr.fillColor !== null) {
		shape.setAttribute("filled", true);
		fill = new primitives.common.Element(this.prefix + ":fill");
		fill.setAttribute("opacity", attr.opacity);
		fill.setAttribute("color", attr.fillColor);
		shape.appendChild(fill);
	}
	else {
		shape.setAttribute("filled", false);
	}

	element = this.m_cache.get(placeholder.name, placeholder.activeLayer.name, "shapepath");
	if (element === null) {
		element = jQuery(shape.create(this.ie8mode));
		placeholder.activeLayer.canvas.append(element);
		this.m_cache.put(placeholder.name, placeholder.activeLayer.name, "shapepath", element);
	}
	else {
		shape.update(element[0], this.ie8mode);
	}
};
/*
    Class: primitives.text.Config
	    Text options class.
	
*/
primitives.text.Config = function () {
	this.classPrefix = "bptext";

	/*
	    Property: graphicsType
			Preferable graphics type. If preferred graphics type is not supported widget switches to first available. 

		Default:
			<primitives.common.GraphicsType.SVG>
    */
	this.graphicsType = 0/*primitives.common.GraphicsType.SVG*/;

	/*
    Property: actualGraphicsType
        Actual graphics type.
    */
	this.actualGraphicsType = null;

	/*
	    Property: textDirection
			Direction style. 

		Default:
			<primitives.text.TextDirection.Auto>
    */
	this.orientation = 0/*primitives.text.TextOrientationType.Horizontal*/;

	/*
	    Property: text
			Text
    */
	this.text = "";


	/*
	    Property: verticalAlignment
			Vertical alignment. 

		Default:
			<primitives.common.VerticalAlignmentType.Center>
    */
	this.verticalAlignment = 1/*primitives.common.VerticalAlignmentType.Middle*/;

	/*
	    Property: horizontalAlignment
			Horizontal alignment. 

		Default:
			<primitives.common.HorizontalAlignmentType.Center>
    */
	this.horizontalAlignment = 0/*primitives.common.HorizontalAlignmentType.Center*/;

	/*
	    Property: fontSize
			Font size. 

		Default:
			15
    */
	this.fontSize = "16px";

	/*
	    Property: fontFamily
			Font family. 

		Default:
			"Arial"
    */
	this.fontFamily = "Arial";

	/*
	    Property: color
			Color. 

		Default:
			<primitives.common.Colors.Black>
    */
	this.color = "#000000"/*primitives.common.Colors.Black*/;

	/*
	    Property: Font weight.
			Font weight: normal | bold

		Default:
			"normal"
    */
	this.fontWeight = "normal";

	/*
    Property: Font style.
        Font style: normal | italic
        
    Default:
        "normal"
    */
	this.fontStyle = "normal";

	/*
	method: update
	    Makes full redraw of text widget contents reevaluating all options.
    */
};
primitives.text.Controller = function () {
	this.widgetEventPrefix = "bptext";

	this.options = new primitives.text.Config();

	this.m_placeholder = null;

	this.m_graphics = null;
};

primitives.text.Controller.prototype._create = function () {
	this.element
			.addClass("ui-widget");

	this._createLayout();

	this._redraw();
};

primitives.text.Controller.prototype.destroy = function () {
	this._cleanLayout();
};

primitives.text.Controller.prototype._createLayout = function () {
	var panelSize = new primitives.common.Rect(0, 0, this.element.outerWidth(), this.element.outerHeight()),
		self = this;

	this.m_placeholder = jQuery('<div></div>');
	this.m_placeholder.css({
		"position": "relative",
		"overflow": "hidden",
		"top": "0px",
		"left": "0px",
		"padding": "0px",
		"margin": "0px"
	});
	this.m_placeholder.css(panelSize.getCSS());
	this.m_placeholder.addClass("placeholder");
	this.m_placeholder.addClass(this.widgetEventPrefix);

	this.element.append(this.m_placeholder);

	this.m_graphics = primitives.common.createGraphics(this.options.graphicsType, this);

	this.options.actualGraphicsType = this.m_graphics.graphicsType;
};

primitives.text.Controller.prototype._cleanLayout = function () {
	if (this.m_graphics !== null) {
		this.m_graphics.clean();
	}
	this.m_graphics = null;

	this.element.find("." + this.widgetEventPrefix).remove();
};

primitives.text.Controller.prototype._updateLayout = function () {
	var panelSize = new primitives.common.Rect(0, 0, this.element.innerWidth(), this.element.innerHeight());
	this.m_placeholder.css(panelSize.getCSS());
};

primitives.text.Controller.prototype.update = function (recreate) {
	if (recreate) {
		this._cleanLayout();
		this._createLayout();
		this._redraw();
	}
	else {
		this._updateLayout();
		this.m_graphics.resize();
		this.m_graphics.begin();
		this._redraw();
		this.m_graphics.end();
	}
};

primitives.text.Controller.prototype._redraw = function () {
	var panel = this.m_graphics.activate("placeholder"),
		attr = {
			"font-size": this.options.fontSize,
			"font-family": this.options.fontFamily,
			"font-style": this.options.fontStyle,
			"font-weight": this.options.fontWeight,
			"font-color": this.options.color
		},
		element = this.m_graphics.text(
          panel.rect.x
        , panel.rect.y
        , panel.rect.width
        , panel.rect.height
        , this.options.text
        , this.options.orientation
        , this.options.horizontalAlignment
        , this.options.verticalAlignment
        , attr
        );
};

primitives.text.Controller.prototype._setOption = function (key, value) {
	jQuery.Widget.prototype._setOption.apply(this, arguments);

	switch (key) {
		case "disabled":
			var handles = jQuery([]);
			if (value) {
				handles.filter(".ui-state-focus").blur();
				handles.removeClass("ui-state-hover");
				handles.propAttr("disabled", true);
				this.element.addClass("ui-disabled");
			} else {
				handles.propAttr("disabled", false);
				this.element.removeClass("ui-disabled");
			}
			break;
		default:
			break;
	}
};

/*
 * jQuery UI Text
 *
 * Basic Primitives Text.
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function ($) {
    $.widget("ui.bpText", new primitives.text.Controller());
}(jQuery));
/*
    Class: primitives.callout.Config
	    Callout options class.
	
*/
primitives.callout.Config = function () {
	this.classPrefix = "bpcallout";

	/*
	    Property: graphicsType
            Preferable graphics type. If preferred graphics type is not supported widget switches to first available. 

		Default:
			<primitives.common.GraphicsType.SVG>
    */
	this.graphicsType = 1/*primitives.common.GraphicsType.Canvas*/;

	/*
    Property: actualGraphicsType
        Actual graphics type.
    */
	this.actualGraphicsType = null;

	/*
	    Property: pointerPlacement
			Defines pointer connection side or corner.

		Default:
			<primitives.common.PlacementType.Auto>
    */
	this.pointerPlacement = 0/*primitives.common.PlacementType.Auto*/;

	/*
	Property: position
	    Defines callout body position. 
        
    Type:
        <primitives.common.Rect>.
    */
	this.position = null;

	/*
	Property: snapPoint
	    Callout snap point. 
        
    Type:
        <primitives.common.Point>.
    */
	this.snapPoint = null;

	/*
	Property: cornerRadius
	    Body corner radius in percents or pixels. 
    */
	this.cornerRadius = "10%";

	/*
    Property: offset
        Body rectangle offset. 
    */
	this.offset = 0;

	/*
    Property: opacity
        Background color opacity. 
    */
	this.opacity = 1;

	/*
    Property: lineWidth
        Border line width. 
    */
	this.lineWidth = 1;

	/*
    Property: pointerWidth
        Pointer base width in percents or pixels. 
    */
	this.pointerWidth = "10%";

	/*
    Property: borderColor
        Border Color. 
    
    Default:
        <primitives.common.Colors.Black>
    */
	this.borderColor = "#000000"/*primitives.common.Colors.Black*/;

	/*
    Property: fillColor
        Fill Color. 
        
    Default:
        <primitives.common.Colors.Gray>
    */
	this.fillColor = "#d3d3d3"/*primitives.common.Colors.LightGray*/;

	/*
	method: update
	    Makes full redraw of callout widget contents reevaluating all options.
    */
};
primitives.callout.Controller = function () {
	this.widgetEventPrefix = "bpcallout";

	this.options = new primitives.callout.Config();

	this.m_placeholder = null;

	this.m_graphics = null;

	this.m_shape = null;
};

primitives.callout.Controller.prototype._create = function () {
	this.element
			.addClass("ui-widget");

	this._createLayout();

	this._redraw();
};

primitives.callout.Controller.prototype.destroy = function () {
	this._cleanLayout();
};

primitives.callout.Controller.prototype._createLayout = function () {
	var panelSize = new primitives.common.Rect(0, 0, this.element.outerWidth(), this.element.outerHeight()),
		self = this;

	this.m_placeholder = jQuery('<div></div>');
	this.m_placeholder.css({
		"position": "relative",
		"overflow": "hidden",
		"top": "0px",
		"left": "0px",
		"padding": "0px",
		"margin": "0px"
	});
	this.m_placeholder.css(panelSize.getCSS());
	this.m_placeholder.addClass("placeholder");
	this.m_placeholder.addClass(this.widgetEventPrefix);

	this.element.append(this.m_placeholder);

	this.m_graphics = primitives.common.createGraphics(this.options.graphicsType, this);

	this.options.actualGraphicsType = this.m_graphics.graphicsType;

	this.m_shape = new primitives.common.Callout(this.m_graphics);
};

primitives.callout.Controller.prototype._cleanLayout = function () {
	if (this.m_graphics !== null) {
		this.m_graphics.clean();
	}
	this.m_graphics = null;

	this.element.find("." + this.widgetEventPrefix).remove();
};

primitives.callout.Controller.prototype._updateLayout = function () {
	var panelSize = new primitives.common.Rect(0, 0, this.element.innerWidth(), this.element.innerHeight());
	this.m_placeholder.css(panelSize.getCSS());
};

primitives.callout.Controller.prototype.update = function (recreate) {
	if (recreate) {
		this._cleanLayout();
		this._createLayout();
		this._redraw();
	}
	else {
		this._updateLayout();
		this.m_graphics.resize();
		this.m_graphics.begin();
		this._redraw();
		this.m_graphics.end();
	}
};

primitives.callout.Controller.prototype._redraw = function () {
	var panel = this.m_graphics.activate("placeholder"),
		names = ["pointerPlacement", "cornerRadius", "offset", "opacity", "lineWidth", "pointerWidth", "borderColor", "fillColor"],
		index,
		name;

	for (index = 0; index < names.length; index += 1) {
		name = names[index];
		this.m_shape[name] = this.options[name];
	}
	this.m_shape.draw(this.options.snapPoint, this.options.position);
};

primitives.callout.Controller.prototype._setOption = function (key, value) {
	jQuery.Widget.prototype._setOption.apply(this, arguments);

	switch (key) {
		case "disabled":
			var handles = jQuery([]);
			if (value) {
				handles.filter(".ui-state-focus").blur();
				handles.removeClass("ui-state-hover");
				handles.propAttr("disabled", true);
				this.element.addClass("ui-disabled");
			} else {
				handles.propAttr("disabled", false);
				this.element.removeClass("ui-disabled");
			}
			break;
		default:
			break;
	}
};
/*
 * jQuery UI Callout
 *
 * Basic Primitives Callout.
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function ($) {
    $.widget("ui.bpCallout", new primitives.callout.Controller());
}(jQuery));
/*
    Class: primitives.orgdiagram.TemplateConfig
        User defines item template class. It may optionaly define template for item, 
		custom cursor and highlight. If template is null then default template is used.

    See Also:
		<primitives.orgdiagram.Config.templates>
*/
primitives.orgdiagram.TemplateConfig = function () {
	/*
	Property: name
		Every template should have unique name. It is used as reference when 
		custom template is defined in <primitives.orgdiagram.ItemConfig.templateName>.
    */
	this.name = null;

	/*
	Property: itemSize
	This is item size of type <primitives.common.Size>, templates should have 
	fixed size, so orgDiagram uses this value in order to layout items properly.
    */
	this.itemSize = new primitives.common.Size(120, 100);

	/*
    Property: itemBorderWidth
        Item template border width.
    */
	this.itemBorderWidth = 1;

	/*
	Property: itemTemplate
	Item template, if it is null then default item template is used. It supposed 
	to be div html element containing named elements inside for setting them 
	in <primitives.orgdiagram.Config.onItemRender> event.
    */
	this.itemTemplate = null;

	/*
	Property: minimizedItemSize
	This is size dot used to display item in minimized form, type of <primitives.common.Size>.
    */
	this.minimizedItemSize = new primitives.common.Size(4, 4);

	/*
	Property: highlightPadding
	This padding around item defines relative size of highlight object, 
	ts type is <primitives.common.Thickness>.
    */
	this.highlightPadding = new primitives.common.Thickness(2, 2, 2, 2);

	/*
    Property: highlightBorderWidth
        Highlight border width.
    */
	this.highlightBorderWidth = 1;

	/*
	Property: highlightTemplate
	Highlight template, if it is null then default highlight template is used. 
	It supposed to be div html element containing named elements inside for 
	setting them in <primitives.orgdiagram.Config.onHighlightRender> event.
    */
	this.highlightTemplate = null;

	/*
    Property: cursorPadding
    This padding around item defines relative size of cursor object, 
	its type is <primitives.common.Thickness>.
    */
	this.cursorPadding = new primitives.common.Thickness(3, 3, 3, 3);

	/*
    Property: cursorBorderWidth
        Cursor border width.
    */
	this.cursorBorderWidth = 2;

	/*
	Property: cursorTemplate
	Cursor template, if it is null then default cursor template is used. 
	It supposed to be div html element containing named elements inside 
	for setting them in <primitives.orgdiagram.Config.onCursorRender> event.
    */
	this.cursorTemplate = null;
};
/*
    Class: primitives.orgdiagram.ButtonConfig
	    Options class. Custom user button options class. 
        Buttons displayed on the right side of item. 
        See jQuery UI Button options description for details.
	    In order to receive button click event make binding 
        to <primitives.orgdiagram.Config.onButtonClick>.
    
    See Also:
	    <primitives.orgdiagram.Config.buttons>
*/
primitives.orgdiagram.ButtonConfig = function (name, icon) {
    /*
	Property: name 
	    It should be unique string name of the button. 
        It is needed to distinguish click events from different butons.
    */
    this.name = name;

    /*
	Property: icon
	Name of icon used in jQuery UI.
    */
    this.icon = icon;
    /*
	Property: text
	Whether to show any text -when set to false (display no text), 
    icon must be enabled, otherwise it'll be ignored.
    */
    this.text = false;
    /*
	Property: label
	Text to show on the button.
    */
    this.label = null;
    /*
	Property: size
	Size of the button of type <primitives.common.Size>.
    */
    this.size = new primitives.common.Size(16, 16);
};
/*
    Class: primitives.orgdiagram.Config
	    orgDiagram options class.
	
*/
primitives.orgdiagram.Config = function (name) {
	this.name = (name !== undefined) ? name : "OrgDiagram";
	this.classPrefix = "orgdiagram";

	/*
	    Property: graphicsType
			Preferable graphics type. If preferred graphics type 
            is not supported widget switches to first available. 

		Default:
			<primitives.common.GraphicsType.SVG>
    */
	this.graphicsType = 0/*primitives.common.GraphicsType.SVG*/;

	/*
	    Property: actualGraphicsType
			Actual graphics type.
    */
	this.actualGraphicsType = null;

	/*
		Property: pageFitMode
			Defines the way diagram is fit into page. 

		Default:
			<primitives.orgdiagram.PageFitMode.FitToPage>
    */
	this.pageFitMode = 3/*primitives.orgdiagram.PageFitMode.FitToPage*/;

	/*
		Property: orientationType
			Diagram orientation. 

		Default:
			<primitives.orgdiagram.OrientationType.Top>
    */
	this.orientationType = primitives.orgdiagram.OrientationType.Top;

	/*
		Property: verticalAlignment
            Defines items vertical alignment relative to each other within one level of hierarchy. 
			It does not affect levels having same size items.
        
        Default:
            <primitives.common.VerticalAlignmentType.Middle>
    */
	this.verticalAlignment = 1/*primitives.common.VerticalAlignmentType.Middle*/;

	/*
		Property: horizontalAlignment
            Defines items horizontal alignment relative to their parent. 
        
        Default:
            <primitives.common.HorizontalAlignmentType.Center>
    */
	this.horizontalAlignment = 0/*primitives.common.HorizontalAlignmentType.Center*/;

	/*
    Property: connectorType
           Defines connector lines style for dot and line elements.
        
        Default:
            <primitives.orgdiagram.ConnectorType.Angular>
    */
	this.connectorType = 1/*primitives.orgdiagram.ConnectorType.Angular*/;

	/*
	Property: emptyDiagramMessage
	    Empty message in order to avoid blank screen.
    */
	this.emptyDiagramMessage = "Diagram is empty.";

	/*
	Property: rootItem
	    This is the root of items hierarchy.
    */
	this.rootItem = null;

	/*
	Property: highlightItem
	    Defines item having highlight in diagram. Reference to item in rootItem hierarchy. 
		If it is null then no highlight shown on diagram.
    */
	this.highligtItem = null;
	/*
	Property: cursorItem
	    Defines item having cursor in diagram. Reference to item in rootItem hierarchy. 
		If it is null then no cursor shown on diagram.
    */
	this.cursorItem = null;

	/*
	Property: selectedItems
	    Defines array of selected items in form of references to items in rootItem hierarchy. 
		Selected items are always show in normal mode.
    */
	this.selectedItems = [];

	/*
    Property: hasSelectorCheckbox
        This option controls selection check boxes visibility. 

    Auto - Cursor item only.
    True - Every normal item has seelction check box.
    False - No selection check boxes.

    Default:
    <primitives.common.Enabled.Auto>
    */
	this.hasSelectorCheckbox = 0/*primitives.common.Enabled.Auto*/;

	/*
	Property: selectionPathMode
	    Defines the way items between rootItem and selectedItems displayed in diagram. 
	    
	Default:
	    <primitives.orgdiagram.SelectionPathMode.FullStack>
    */
	this.selectionPathMode = 1/*primitives.orgdiagram.SelectionPathMode.FullStack*/;

	/*
	Property: minimalVisibility
	    Defines the way diagram collapses items when it has not enough space to fit all items. 
	    
	Default:
	    <primitives.orgdiagram.Visibility.Dot>
    */
	this.minimalVisibility = 2/*primitives.orgdiagram.Visibility.Dot*/;

	/*
	Property: templates
	    Custom user templates collection. Every template config should have unique name property.
	    
	See also:
	    <primitives.orgdiagram.TemplateConfig>
		<primitives.orgdiagram.Config.defaultTemplateName>
		<primitives.orgdiagram.ItemConfig.templateName>
    */
	this.templates = [];

	/*
	Property: defaultTemplateName
		This is template name used to render items having no <primitives.orgdiagram.ItemConfig.templateName> defined.


		See Also:
		<primitives.orgdiagram.TemplateConfig>
		<primitives.orgdiagram.Config.templates> collection property.
	*/
	this.defaultTemplateName = null;

	/*
    Property: hasButtons
        This option controls user buttons visibility. 

    Auto - Cursor item only when buttons defined.
    True - Every normal item has seelction check box.
    False - No selection check boxes.

    Default:
    <primitives.common.Enabled.Auto>
    */
	this.hasButtons = 0/*primitives.common.Enabled.Auto*/;

	/*
	Property: buttons
	    Custom user buttons displayed on right side of item.
	    
	See also:
	    <primitives.orgdiagram.ButtonConfig>
    */
	this.buttons = [];

	/*
    Event: onHighlightChanging
        Notifies about changing highlight item <primitives.orgdiagram.Config.highlightItem> in diagram.
        This coupled event with <primitives.orgdiagram.Config.onHighlightChanged>, it is fired before highlight update.

    See also:
        <primitives.orgdiagram.EventArgs>
    */
	this.onHighlightChanging = null;

	/*
	Event: onHighlightChanged
	    Notifies about changed highlight item <primitives.orgdiagram.Config.highlightItem> in diagram.

    See also:
        <primitives.orgdiagram.EventArgs>
    */
	this.onHighlightChanged = null;

	/*
    Event: onCursorChanging
        Notifies about changing cursor item <primitives.orgdiagram.Config.cursorItem> in diagram.
        This coupled event with <primitives.orgdiagram.Config.onCursorChanged>, it is fired before layout update.

    See also:
        <primitives.orgdiagram.EventArgs>
    */
	this.onCursorChanging = null;

	/*
	Event: onCursorChanged
	    Notifies about changed cursor item <primitives.orgdiagram.Config.cursorItem> in diagram .

    See also:
        <primitives.orgdiagram.EventArgs>
    */
	this.onCursorChanged = null;

	/*
	Event: onSelectionChanging
	    Notifies about changing selected items collection of <primitives.orgdiagram.Config.selectedItems>.

    See also:
        <primitives.orgdiagram.EventArgs>
    */
	this.onSelectionChanging = null;

	/*
	Event: onSelectionChanged
	    Notifies about changes in collection of <primitives.orgdiagram.Config.selectedItems>.

    See also:
        <primitives.orgdiagram.EventArgs>
    */
	this.onSelectionChanged = null;

	/*
	Event: onButtonClick
	    Notifies about click of custom user button defined in colelction of <primitives.orgdiagram.Config.buttons>.

    See also:
        <primitives.orgdiagram.EventArgs>
    */
	this.onButtonClick = null;

	/*
	Event: onMouseClick
	    On mouse click event. 

    See also:
        <primitives.orgdiagram.EventArgs>
    */
	this.onMouseClick = null;

	/*
	Event: onItemRender
	    If user defined custom template for item 
		then this method is called to populate it with context data.

    See also:
        <primitives.common.RenderEventArgs>
    */
	this.onItemRender = null;
	/*
	Event: onHighlightRender
	    If user defined custom highlight template for item template 
		then this method is called to populate it with context data.

    See also:
        <primitives.common.RenderEventArgs>
    */
	this.onHighlightRender = null;
	/*
	Event: onCursorRender
	    If user defined custom cursor template for item template 
		then this method is called to populate it with context data.

    See also:
        <primitives.common.RenderEventArgs>
    */
	this.onCursorRender = null;
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
	this.dotLevelShift = 20;
	/*
	Property: lineLevelShift
	    Defines interval after level of items in  diagram having items in line state.
    */
	this.lineLevelShift = 10;

	/*
	Property: normalItemsInterval
	    Defines interval between items at the same level in  diagram having items in normal state.
    */
	this.normalItemsInterval = 10;
	/*
	Property: dotItemsInterval
	    Defines interval between items at the same level in  diagram having items in dot state.
    */
	this.dotItemsInterval = 1;
	/*
	Property: lineItemsInterval
	    Defines interval between items at the same level in  diagram having items in line state.
    */
	this.lineItemsInterval = 2;

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
	this.itemTitleFirstFontColor = "#ffffff"/*primitives.common.Colors.White*/;

	/*
	Property: itemTitleSecondFontColor
	Default template title second font color.
    */
	this.itemTitleSecondFontColor = "#000080"/*primitives.common.Colors.Navy*/;

	/*
    Property: selectCheckBoxLabel
    Select check box label.
    */
	this.selectCheckBoxLabel = "Selected";

	/*
    Property: linesColor
        Connectors lines color.
    */
	this.linesColor = "#c0c0c0"/*primitives.common.Colors.Silver*/;

	/*
    Property: linesWidth
        Connectors lines width.
    */
	this.linesWidth = 1;

	/*
    Property: calloutfillColor
        Annotation callout fill color.
    */
	this.calloutfillColor = "#000000";

	/*
    Property: calloutBorderColor
        Annotation callout border color.
    */
	this.calloutBorderColor = null;

	/*
    Property: calloutOffset
        Annotation callout offset.
    */
	this.calloutOffset = 4;

	/*
    Property: calloutCornerRadius
        Annotation callout corner radius.
    */
	this.calloutCornerRadius = 4;

	/*
    Property: calloutPointerWidth
        Annotation callout pointer base width.
    */
	this.calloutPointerWidth = "10%";

	/*
    Property: calloutLineWidth
        Annotation callout border line width.
    */
	this.calloutLineWidth = 1;

	/*
    Property: calloutOpacity
        Annotation callout opacity.
    */
	this.calloutOpacity = 0.2;

	/*
	Property: childrenPlacementType
		Defines children placement form.
	*/
	this.childrenPlacementType = 2/*primitives.orgdiagram.ChildrenPlacementType.Horizontal*/;

	/*
    Property: leavesPlacementType
        Defines leaves placement form. Leaves are children having no sub children.
    */
	this.leavesPlacementType = 2/*primitives.orgdiagram.ChildrenPlacementType.Horizontal*/;

	/*
    Property: maximumColumnsInMatrix
        Maximum number of columns for matrix leaves layout. Leaves are children having no sub children.
*/
	this.maximumColumnsInMatrix = 6;

	/*
    Property: buttonsPanelSize
        User buttons panel size.
    */
	this.buttonsPanelSize = 28;

	/*
    Property: groupTitlePanelSize
        Group title panel size.
    */
	this.groupTitlePanelSize = 24;

	/*
    Property: checkBoxPanelSize
        Selection check box panel size.
    */
	this.checkBoxPanelSize = 24;
};
/*
    Class: primitives.orgdiagram.ItemConfig
		Defines item in diagram hierarchy. 
		User is supposed to create hierarchy of this items and assign it to <primitives.orgdiagram.Config.rootItem>.
		Widget contains some generic properties used in default item template, 
		but user can add as many custom properties to this class as needed. 
		Just be careful and avoid widget malfunction.

    See Also:
		<primitives.orgdiagram.Config.rootItem>
*/
primitives.orgdiagram.ItemConfig = function (arg0, arg1, arg2) {
	/*
	Property: title
	Default template title property.
    */
	this.title = null;

	/*
	Property: description
	Default template description element.
    */
	this.description = null;

	/*
	Property: image
	Url to image. This property is used in default template.
    */
	this.image = null;

	/*
	Property: itemTitleColor
	Default template title background color.
    */
	this.itemTitleColor = "#4169e1"/*primitives.common.Colors.RoyalBlue*/;

	/*
    Property: groupTitle
    Auxiliary group title property. Displayed vertically on the side of item.
    */
	this.groupTitle = null;

	/*
    Property: groupTitleColor
    Group title background color.
    */
	this.groupTitleColor = "#4169e1"/*primitives.common.Colors.RoyalBlue*/;

	/*
    Property: hasSelectorCheckbox
        If it is true then selection check box is shown for the item. 
		Selected items are always shown in normal form, so if item is 
		selected then its selection check box is visible and checked.

    Auto - Depends on <primitives.orgdiagram.Config.hasSelectorCheckbox> setting.
    True - Selection check box is visible.
    False - No selection check box.

    Default:
    <primitives.common.Enabled.Auto>
    */
	this.hasSelectorCheckbox = 0/*primitives.common.Enabled.Auto*/;

	/*
    Property: hasButtons
        This option controls buttons panel visibility. 

    Auto - Depends on <primitives.orgdiagram.Config.hasButtons> setting.
    True - Has buttons panel.
    False - No buttons panel.

    Default:
    <primitives.common.Enabled.Auto>
    */
	this.hasButtons = 0/*primitives.common.Enabled.Auto*/;

	/*
		Property: itemType
			This property defines how item should be shown. 
			So far it is only possible to make it invisible.
	
		See Also:
			<primitives.orgdiagram.ItemType>
		
		Deafult:
			<primitives.orgdiagram.ItemType.Regular>
    */
	this.itemType = 0/*primitives.orgdiagram.ItemType.Regular*/;

	/*
		Property: adviserPlacementType
			In case of item types <primitives.orgdiagram.ItemType.Assistant> 
			and <primitives.orgdiagram.ItemType.Adviser> this option defines item 
			placement side relative to parent. By default items placed on 
			the right side of parent item.

		Deafult:
			<primitives.orgdiagram.AdviserPlacementType.Auto>
    */
	this.adviserPlacementType = 0/*primitives.orgdiagram.AdviserPlacementType.Auto*/;

	/*
	Property: childrenPlacementType
		Defines children placement form.
	*/
	this.childrenPlacementType = 0/*primitives.orgdiagram.ChildrenPlacementType.Auto*/;

	/*
	Property: items
		This is collection of children items.

	See Also:
		<primitives.orgdiagram.ItemConfig>
    */
	this.items = [];

	/*
	Property: templateName
		This is template name used to render this item.

		See Also:
		<primitives.orgdiagram.TemplateConfig>
		<primitives.orgdiagram.Config.templates> collection property.
    */
	this.templateName = null;

	switch (arguments.length) {
		case 3:
			this.title = arg0;
			this.description = arg1;
			this.image = arg2;
			break;
	}
};
primitives.orgdiagram.Controller = function () {
	this.widgetEventPrefix = "orgdiagram";

	this.options = new primitives.orgdiagram.Config();

	this.graphics = null;

	this._treeItems = {};
	this._treeItemCounter = 0;
	this._treeLevels = [];
	this._leftMargins = {};
	this._rightMargins = {};

	this._templates = {};
	this._defaultTemplate = null;

	this._checkBoxTemplate = null;
	this._checkBoxTemplateHashCode = null;

	this._buttonsTemplate = null;
	this._buttonsTemplateHashCode = null;

	this._groupTitleTemplate = null;
	this._groupTitleTemplateHashCode = null;

	this._selectedTreeItems = [];
	this._cursorTreeItem = null;
	this._highlightTreeItem = null;

	this.m_scrollPanel = null;
	this.m_placeholder = null;

	this.m_calloutPlaceholder = null;
	this.m_calloutShape = null;

	this.boxModel = jQuery.support.boxModel;
};

primitives.orgdiagram.Controller.prototype._create = function () {
	this.element
			.addClass("ui-widget");

	this._createLayout();

	this._bind();

	this.graphics = null;

	this._redraw();
};

primitives.orgdiagram.Controller.prototype.destroy = function () {
	this._unbind();

	this._clean();

	this._cleanLayout();
};

primitives.orgdiagram.Controller.prototype._clean = function () {
	if (this.graphics !== null) {
		this.graphics.clean();
	}
	this.graphics = null;
};

primitives.orgdiagram.Controller.prototype._cleanLayout = function () {
	this.element.find("." + this.widgetEventPrefix).remove();
};

primitives.orgdiagram.Controller.prototype._createLayout = function () {
	var panelSize = new primitives.common.Rect(0, 0, this.element.outerWidth(), this.element.outerHeight());

	this.m_scrollPanel = jQuery('<div></div>');
	this.m_scrollPanel.css({
		"position": "relative",
		"overflow": "auto",
		"top": "0px",
		"left": "0px",
		"padding": "0px",
		"margin": "0px"
	});
	this.m_scrollPanel.addClass(this.widgetEventPrefix);
	this.m_scrollPanel.css(panelSize.getCSS());

	this.m_placeholder = jQuery('<div></div>');
	this.m_placeholder.css({
		position: "absolute",
		overflow: "hidden"
	});
	this.m_placeholder.addClass("placeholder");
	this.m_placeholder.addClass(this.widgetEventPrefix);
	this.m_placeholder.css(panelSize.getCSS());
	this.m_scrollPanel.append(this.m_placeholder);

	this.m_calloutPlaceholder = jQuery('<div></div>');
	this.m_calloutPlaceholder.css({
		position: "absolute",
		overflow: "visible"
	});
	this.m_calloutPlaceholder.addClass("calloutplaceholder");
	this.m_calloutPlaceholder.addClass(this.widgetEventPrefix);
	this.m_calloutPlaceholder.css({
		top: "0px",
		left: "0px",
		width: "0px",
		height: "0px"
	});
	this.m_placeholder.append(this.m_calloutPlaceholder);

	this.element.append(this.m_scrollPanel);
};

primitives.orgdiagram.Controller.prototype._updateLayout = function () {
	var panelSize = new primitives.common.Rect(0, 0, this.element.outerWidth(), this.element.outerHeight());
	this.m_scrollPanel.css(panelSize.getCSS());
};

primitives.orgdiagram.Controller.prototype._bind = function () {
	var self = this;

	this.m_placeholder
        .mousemove(function (e) { self._onMouseMove(e); })
        .mouseleave(function (e) { self._onMouseMove(e); })
        .click(function (e) { self._onMouseClick(e); });

	this.options.onDefaultTemplateRender = function (event, data) { self._onDefaultTemplateRender(event, data); };
	this.options.onCheckBoxTemplateRender = function (event, data) { self._onCheckBoxTemplateRender(event, data); };
	this.options.onGroupTitleTemplateRender = function (event, data) { self._onGroupTitleTemplateRender(event, data); };
	this.options.onButtonsTemplateRender = function (event, data) { self._onButtonsTemplateRender(event, data); };
};

primitives.orgdiagram.Controller.prototype._unbind = function () {

	this.m_placeholder.unbind("mousemove");
	this.m_placeholder.unbind("mouseleave");
	this.m_placeholder.unbind("click");

	this.options.onDefaultTemplateRender = null;
	this.options.onCheckBoxTemplateRender = null;
};

primitives.orgdiagram.Controller.prototype.update = function (updateMode) {
	switch (updateMode) {
		case 2/*primitives.orgdiagram.UpdateMode.PositonHighlight*/:
			this._redrawHighlight();
			break;
		case 1/*primitives.orgdiagram.UpdateMode.Refresh*/:
			this._refresh();
			break;
		default:
			this._redraw();
			break;
	}
};

primitives.orgdiagram.Controller.prototype._onMouseMove = function (event) {
	var m_placeholderLeft = this.m_placeholder.offset().left,
		m_placeholderTop = this.m_placeholder.offset().top,
		x = event.pageX - m_placeholderLeft,
		y = event.pageY - m_placeholderTop,
		newCursorItem = this._getTreeItemForMousePosition(x, y),
		eventArgs;

	if (newCursorItem !== null) {
		if (newCursorItem.itemConfig !== this.options.highlightItem) {
			this._highlightTreeItem = newCursorItem;

			eventArgs = new primitives.orgdiagram.EventArgs();
			eventArgs.oldContext = this.options.highlightItem;

			this.options.highlightItem = newCursorItem.itemConfig;

			eventArgs.context = this.options.highlightItem;
			eventArgs.parentItem = this._highlightTreeItem.logicalParentId !== null ? this._treeItems[this._highlightTreeItem.logicalParentId].itemConfig : null;
			eventArgs.position = new primitives.common.Rect(newCursorItem.actualPosition)
                .translate(m_placeholderLeft, m_placeholderTop)
                .translate(-this.element.offset().left, -this.element.offset().top);

			this._trigger("onHighlightChanging", event, eventArgs);

			if (!eventArgs.cancel) {
				this._refreshHighlight();

				this._trigger("onHighlightChanged", event, eventArgs);
			}
		}
	}
	else {
		if (this.options.highlightItem !== null) {
			this._highlightTreeItem = null;

			eventArgs = new primitives.orgdiagram.EventArgs();
			eventArgs.oldContext = this.options.highlightItem;
			eventArgs.parentItem = null;
			this.options.highlightItem = null;

			eventArgs.context = this.options.highlightItem;

			this._trigger("onHighlightChanging", event, eventArgs);

			if (!eventArgs.cancel) {
				this._refreshHighlight();

				this._trigger("onHighlightChanged", event, eventArgs);
			}
		}
	}
};

primitives.orgdiagram.Controller.prototype._onMouseClick = function (event) {
	var newCursorItem = this._highlightTreeItem,
		target,
		button,
		buttonname,
		eventArgs,
		position;

	if (newCursorItem !== null) {
		target = jQuery(event.target);
		if (target.hasClass(this.widgetEventPrefix + "button") || target.parent("." + this.widgetEventPrefix + "button").length > 0) {
			button = target.hasClass(this.widgetEventPrefix + "button") ? target : target.parent("." + this.widgetEventPrefix + "button");
			buttonname = button.data("buttonname");
			eventArgs = new primitives.orgdiagram.EventArgs();
			eventArgs.context = newCursorItem.itemConfig;
			eventArgs.parentItem = newCursorItem.logicalParentId !== null ? this._treeItems[newCursorItem.logicalParentId].itemConfig : null;
			eventArgs.name = buttonname;

			this._trigger("onButtonClick", event, eventArgs);
		}
		else if (target.attr("name") === "checkbox") {
			eventArgs = new primitives.orgdiagram.EventArgs();
			eventArgs.context = newCursorItem.itemConfig;
			eventArgs.parentItem = newCursorItem.logicalParentId !== null ? this._treeItems[newCursorItem.logicalParentId].itemConfig : null;
			this._trigger("onSelectionChanging", event, eventArgs);
			position = primitives.common.indexOf(this.options.selectedItems, newCursorItem.itemConfig);
			if (position >= 0) {
				this.options.selectedItems.splice(position, 1);
			}
			else {
				this.options.selectedItems.push(newCursorItem.itemConfig);
			}
			this._trigger("onSelectionChanged", event, eventArgs);
		}
		else {
			eventArgs = new primitives.orgdiagram.EventArgs();
			eventArgs.context = newCursorItem.itemConfig;
			eventArgs.parentItem = newCursorItem.logicalParentId !== null ? this._treeItems[newCursorItem.logicalParentId].itemConfig : null;

			this._trigger("onMouseClick", event, eventArgs);
			if (!eventArgs.cancel) {
				if (newCursorItem.itemConfig !== this.options.cursorItem) {
					eventArgs = new primitives.orgdiagram.EventArgs();
					eventArgs.oldContext = this.options.cursorItem;

					this.options.cursorItem = newCursorItem.itemConfig;

					eventArgs.context = this.options.cursorItem;
					eventArgs.parentItem = newCursorItem.logicalParentId !== null ? this._treeItems[newCursorItem.logicalParentId].itemConfig : null;

					this._trigger("onCursorChanging", event, eventArgs);

					if (!eventArgs.cancel) {
						this._refresh();

						this._trigger("onCursorChanged", event, eventArgs);
					}
				}
			}
		}
	}
};

primitives.orgdiagram.Controller.prototype._redraw = function () {
	this._clean();

	this.graphics = primitives.common.createGraphics(this.options.graphicsType, this);

	this.options.actualGraphicsType = this.graphics.graphicsType;

	this.m_calloutShape = new primitives.common.Callout(this.graphics);

	this._readTemplates();

	this._createCheckBoxTemplate();
	this._createButtonsTemplate();
	this._createGroupTitleTemplate();

	this._refresh();
};

primitives.orgdiagram.Controller.prototype._refresh = function () {
	this._updateLayout();

	this._readTreeItems();
	this._positionTreeItems();

	this.graphics.resize();
	this.graphics.begin();

	this._redrawTreeItems();
	this._redrawConnectors();

	this._drawHighlight();
	this._drawHighlightAnnotation();
	this._drawCursor();

	this.graphics.end();

	this._centerOnCursor();
};

primitives.orgdiagram.Controller.prototype._setTransform = function () {
	switch (this.options.orientationType) {
		case primitives.orgdiagram.OrientationType.Top:
			this.graphics.setTransform("placeholder", false, false, false);
			break;
		case primitives.orgdiagram.OrientationType.Bottom:
			this.graphics.setTransform("placeholder", false, false, true);
			break;
		case primitives.orgdiagram.OrientationType.Left:
			this.graphics.setTransform("placeholder", true, false, false);
			break;
		case primitives.orgdiagram.OrientationType.Right:
			this.graphics.setTransform("placeholder", true, true, false);
			break;
	}
};

primitives.orgdiagram.Controller.prototype._redrawHighlight = function () {
	var index,
		treeItem;
	for (index in this._treeItems) {
		if (this._treeItems.hasOwnProperty(index)) {
			treeItem = this._treeItems[index];

			if (treeItem.itemConfig === this.options.highlightItem) {
				this._highlightTreeItem = treeItem;
			}
		}
	}

	this._refreshHighlight();
};

primitives.orgdiagram.Controller.prototype._refreshHighlight = function () {
	this.graphics.reset("placeholder", 2/*primitives.orgdiagram.Layers.Highlight*/);
	this.graphics.reset("calloutplaceholder", 6/*primitives.orgdiagram.Layers.Annotation*/);
	this._drawHighlight();
	this._drawHighlightAnnotation();
};

primitives.orgdiagram.Controller.prototype._drawHighlight = function () {
	var panel,
		actualPosition,
		position,
		highlightPadding,
		uiHash,
		element;
	if (this._highlightTreeItem !== null) {
		panel = this.graphics.activate("placeholder", 2/*primitives.orgdiagram.Layers.Highlight*/);

		actualPosition = this._highlightTreeItem.actualPosition;
		position = new primitives.common.Rect(0, 0, this._highlightTreeItem.actualSize.width, this._highlightTreeItem.actualSize.height);
		highlightPadding = this._highlightTreeItem.template.highlightPadding;
		position.offset(highlightPadding.left, highlightPadding.top, highlightPadding.right, highlightPadding.bottom);

		uiHash = new primitives.common.RenderEventArgs();
		uiHash.context = this._highlightTreeItem.itemConfig;
		uiHash.isCursor = this._highlightTreeItem.isCursor;
		uiHash.isSelected = this._highlightTreeItem.isSelected;
		uiHash.templateName = this._highlightTreeItem.template.name;

		element = this.graphics.template(
			  actualPosition.x
            , actualPosition.y
			, actualPosition.width
            , actualPosition.height
			, position.x
			, position.y
            , position.width
            , position.height
            , this._highlightTreeItem.template.highlightTemplate
            , this._highlightTreeItem.template.highlightTemplateHashCode
            , this._highlightTreeItem.template.highlightTemplateRenderName
            , uiHash
            , { "border-width": this._highlightTreeItem.template.highlightBorderWidth }
            );
	}
};

primitives.orgdiagram.Controller.prototype._drawCursor = function () {
	var panel,
		treeItem,
		actualPosition,
		position,
		cursorPadding,
		uiHash,
		element;
	if (this._cursorTreeItem !== null) {
		panel = this.graphics.activate("placeholder", 4/*primitives.orgdiagram.Layers.Cursor*/);

		treeItem = this._cursorTreeItem;
		actualPosition = treeItem.actualPosition;
		position = new primitives.common.Rect(treeItem.contentPosition);
		cursorPadding = treeItem.template.cursorPadding;
		position.offset(cursorPadding.left, cursorPadding.top, cursorPadding.right, cursorPadding.bottom);

		uiHash = new primitives.common.RenderEventArgs();
		uiHash.context = treeItem.itemConfig;
		uiHash.isCursor = treeItem.isCursor;
		uiHash.isSelected = treeItem.isSelected;
		uiHash.templateName = treeItem.template.name;

		element = this.graphics.template(
			  actualPosition.x
            , actualPosition.y
			, actualPosition.width
            , actualPosition.height
			, position.x
			, position.y
            , position.width
            , position.height
            , treeItem.template.cursorTemplate
            , treeItem.template.cursorTemplateHashCode
            , treeItem.template.cursorTemplateRenderName
            , uiHash
            , { "border-width": treeItem.template.cursorBorderWidth }
            );
	}
};

primitives.orgdiagram.Controller.prototype._redrawTreeItems = function () {
	var treeItem,
		treeLevel,
		uiHash,
		element,
		itemTitleColor,
		attr,
		treeItemId,
		markers = {},
		segments,
		index,
		len;

	this.graphics.activate("placeholder", 5/*primitives.orgdiagram.Layers.Item*/);
	this._setTransform();

	for (treeItemId in this._treeItems) {
		if (this._treeItems.hasOwnProperty(treeItemId)) {
			treeItem = this._treeItems[treeItemId];
			treeLevel = this._treeLevels[treeItem.level];

			treeItem.setActualPosition(treeLevel, this.options);

			switch (treeItem.actualVisibility) {
				case 1/*primitives.orgdiagram.Visibility.Normal*/:
					uiHash = new primitives.common.RenderEventArgs();
					uiHash.context = treeItem.itemConfig;
					uiHash.isCursor = treeItem.isCursor;
					uiHash.isSelected = treeItem.isSelected;
					uiHash.templateName = treeItem.template.name;

					element = this.graphics.template(
							  treeItem.actualPosition.x
							, treeItem.actualPosition.y
							, treeItem.actualPosition.width
							, treeItem.actualPosition.height
							, treeItem.contentPosition.x
							, treeItem.contentPosition.y
							, treeItem.contentPosition.width
							, treeItem.contentPosition.height
							, treeItem.template.itemTemplate
							, treeItem.template.itemTemplateHashCode
							, treeItem.template.itemTemplateRenderName
							, uiHash
							, { "border-width": treeItem.template.itemBorderWidth }
							);

					if (treeItem.hasGroupTitle) {
						element = this.graphics.template(
								  treeItem.actualPosition.x
								, treeItem.actualPosition.y
								, treeItem.actualPosition.width
								, treeItem.actualPosition.height
								, 2
								, treeItem.contentPosition.y
								, this.options.groupTitlePanelSize - 4
								, treeItem.contentPosition.height
								, this._groupTitleTemplate
								, this._groupTitleTemplateHashCode
								, "onGroupTitleTemplateRender"
								, treeItem
								, null
								);
					}
					if (treeItem.hasSelectorCheckbox) {
						element = this.graphics.template(
								  treeItem.actualPosition.x
								, treeItem.actualPosition.y
								, treeItem.actualPosition.width
								, treeItem.actualPosition.height
								, treeItem.contentPosition.x
								, treeItem.actualSize.height - (this.options.checkBoxPanelSize - 4)
								, treeItem.contentPosition.width
								, this.options.checkBoxPanelSize - 4
								, this._checkBoxTemplate
								, this._checkBoxTemplateHashCode
								, "onCheckBoxTemplateRender"
								, treeItem
								, null
								);
					}
					if (treeItem.hasButtons) {
						element = this.graphics.template(
								  treeItem.actualPosition.x
								, treeItem.actualPosition.y
								, treeItem.actualPosition.width
								, treeItem.actualPosition.height
								, treeItem.actualSize.width - (this.options.buttonsPanelSize - 4)
								, treeItem.contentPosition.y
								, this.options.buttonsPanelSize - 4
								, Math.max(treeItem.contentPosition.height, treeItem.actualSize.height - treeItem.contentPosition.y)
								, this._buttonsTemplate
								, this._buttonsTemplateHashCode
								, "onButtonsTemplateRender"
								, treeItem
								, null
								);
					}
					break;
				case 2/*primitives.orgdiagram.Visibility.Dot*/:
					itemTitleColor = treeItem.itemConfig.itemTitleColor;
					if (itemTitleColor == null) {
						itemTitleColor = "#000080"/*primitives.common.Colors.Navy*/;
					}
					if (!markers.hasOwnProperty(itemTitleColor)) {
						markers[itemTitleColor] = [];
					}
					segments = markers[itemTitleColor];
					segments.push(new primitives.common.DotSegment(treeItem.actualPosition.horizontalCenter(), treeItem.actualPosition.verticalCenter(), treeItem.actualPosition.width / 2.0));
					break;
			}
		}
	}

	this.graphics.activate("placeholder", 3/*primitives.orgdiagram.Layers.Marker*/);
	for (itemTitleColor in markers) {
		if (markers.hasOwnProperty(itemTitleColor)) {
			segments = markers[itemTitleColor];
			attr = {
				"fillColor": itemTitleColor,
				"opacity": 1
			};
			this.graphics.polyline(segments, attr);
		}
	}
};

primitives.orgdiagram.Controller.prototype._redrawConnectors = function () {
	var panel = this.graphics.activate("placeholder", 1/*primitives.orgdiagram.Layers.Connector*/),
		rootItemId = this._visualRootItem,
		treeItem,
		treeLevel,
		segments,
		attr,
		element;

	if (this._treeItems.hasOwnProperty(rootItemId)) {
		treeItem = this._treeItems[rootItemId];
		treeLevel = this._treeLevels[treeItem.level];

		segments = [];
		this._redrawConnector(panel.hasGraphics, segments, treeItem, treeLevel);

		attr = {
			"borderColor": this.options.linesColor,
			"lineWidth": this.options.linesWidth
		};
		element = this.graphics.polyline(segments, attr);
	}
};

primitives.orgdiagram.Controller.prototype._redrawConnector = function (hasGraphics, segments, parentTreeItem, parentTreeLevel) {
	var hideConnectors,
		fromPoint,
		toPoint,
		startPoint,
		endPoint,
		points,
		children,
		treeItem,
		treeLevel,
		index,
		itemToLeft,
		itemToRight,
		groupPoint,
		visibility,
		parentHorizontalCenter;

	if (parentTreeItem.visualChildren.length > 0) {
		hideConnectors = (parentTreeItem.actualVisibility === 4/*primitives.orgdiagram.Visibility.Invisible*/) && (parentTreeItem.id === this._visualRootItem);

		if (!hideConnectors) {
			fromPoint = new primitives.common.Point(parentTreeItem.actualPosition.horizontalCenter(), parentTreeItem.actualPosition.bottom());
			toPoint = new primitives.common.Point(parentTreeItem.actualPosition.horizontalCenter(), parentTreeLevel.connectorShift);

			segments.push(new primitives.common.MoveSegment(fromPoint));
			segments.push(new primitives.common.LineSegment(toPoint));
		}

		startPoint = null;
		endPoint = null;

		points = [];
		children = parentTreeItem.visualChildren;
		for (index = 0; index < children.length; index += 1) {
			treeItem = this._treeItems[children[index]];
			treeLevel = this._treeLevels[treeItem.level];


			switch (treeItem.connectorPlacement) {
				case 7/*primitives.common.PlacementType.Left*/:
					fromPoint = new primitives.common.Point(treeItem.actualPosition.x, treeItem.actualPosition.verticalCenter());
					itemToLeft = this._treeItems[treeLevel.treeItems[treeItem.levelPosition - 1]];
					toPoint = new primitives.common.Point(itemToLeft.actualPosition.right(), treeItem.actualPosition.verticalCenter());
					segments.push(new primitives.common.MoveSegment(fromPoint));
					segments.push(new primitives.common.LineSegment(toPoint));
					break;
				case 3/*primitives.common.PlacementType.Right*/:
					fromPoint = new primitives.common.Point(treeItem.actualPosition.right(), treeItem.actualPosition.verticalCenter());
					itemToRight = this._treeItems[treeLevel.treeItems[treeItem.levelPosition + 1]];
					toPoint = new primitives.common.Point(itemToRight.actualPosition.x, treeItem.actualPosition.verticalCenter());
					segments.push(new primitives.common.MoveSegment(fromPoint));
					segments.push(new primitives.common.LineSegment(toPoint));
					break;
				case 1/*primitives.common.PlacementType.Top*/:
					if (!hideConnectors) {
						fromPoint = new primitives.common.Point(treeItem.actualPosition.horizontalCenter(), parentTreeLevel.connectorShift);
						toPoint = new primitives.common.Point(treeItem.actualPosition.horizontalCenter(), treeItem.actualPosition.top());

						visibility = hasGraphics ? treeItem.actualVisibility : 1/*primitives.orgdiagram.Visibility.Normal*/;
						switch (visibility) {
							case 1/*primitives.orgdiagram.Visibility.Normal*/:
							case 4/*primitives.orgdiagram.Visibility.Invisible*/:
								if (points.length > 0) {
									groupPoint = this._drawAngularConnectors(segments, null, parentTreeLevel.connectorShift, points);
									if (startPoint === null) {
										startPoint = groupPoint;
									}
								}
								segments.push(new primitives.common.MoveSegment(fromPoint));
								segments.push(new primitives.common.LineSegment(toPoint));
								if (startPoint === null) {
									startPoint = fromPoint;
								}
								else {
									endPoint = fromPoint;
								}
								break;
							case 2/*primitives.orgdiagram.Visibility.Dot*/:
							case 3/*primitives.orgdiagram.Visibility.Line*/:
								switch (this.options.connectorType) {
									case 1/*primitives.orgdiagram.ConnectorType.Angular*/:
									case 2/*primitives.orgdiagram.ConnectorType.Curved*/:
										points.push(toPoint);
										break;
									case 0/*primitives.orgdiagram.ConnectorType.Squared*/:
										segments.push(new primitives.common.MoveSegment(fromPoint));
										segments.push(new primitives.common.LineSegment(toPoint));
										if (startPoint === null) {
											startPoint = fromPoint;
										}
										else {
											endPoint = fromPoint;
										}
										break;
								}
								break;
						}
					}
					break;
			}

			this._redrawConnector(hasGraphics, segments, treeItem, treeLevel);
		}
		if (!hideConnectors) {
			if (points.length > 0) {
				endPoint = this._drawAngularConnectors(segments, (children.length === points.length) ? parentTreeItem.actualPosition.horizontalCenter() : null, parentTreeLevel.connectorShift, points);
			}

			

			if (startPoint !== null && endPoint !== null) {
				parentHorizontalCenter = parentTreeItem.actualPosition.horizontalCenter();
				if (parentHorizontalCenter < startPoint.x) {
					startPoint.x = parentHorizontalCenter;
				} else if (parentHorizontalCenter > endPoint.x) {
					endPoint.x = parentHorizontalCenter;
				}

				if (startPoint !== endPoint) {
					segments.push(new primitives.common.MoveSegment(startPoint));
					segments.push(new primitives.common.LineSegment(endPoint));
				}
			}
		}
	}
};

primitives.orgdiagram.Controller.prototype._drawAngularConnectors = function (segments, offset, shift, points) {
	var result = null,
		index,
		rect;
	if (points.length > 0) {
		result = new primitives.common.Point((offset !== null) ? offset : (points[0].x + points[points.length - 1].x) / 2, shift);
		for (index = 0; index < points.length; index += 1) {
			segments.push(new primitives.common.MoveSegment(result));
			switch (this.options.connectorType) {
				case 1/*primitives.orgdiagram.ConnectorType.Angular*/:
					segments.push(new primitives.common.LineSegment(points[index]));
					break;
				case 2/*primitives.orgdiagram.ConnectorType.Curved*/:
					rect = new primitives.common.Rect(result, points[index]);
					if (result.x > rect.x) {
						segments.push(new primitives.common.CubicArcSegment(rect.right(), rect.verticalCenter(), rect.x, rect.verticalCenter(), rect.x, rect.bottom()));
					}
					else {
						segments.push(new primitives.common.CubicArcSegment(rect.x, rect.verticalCenter(), rect.right(), rect.verticalCenter(), rect.right(), rect.bottom()));
					}
					break;
			}
		}
	}
	points.length = 0;
	return result;
};


primitives.orgdiagram.Controller.prototype._centerOnCursor = function () {
	var panelSize,
		panel;
	if (this._cursorTreeItem !== null) {
		panelSize = new primitives.common.Rect(0, 0, this.element.innerWidth(), this.element.innerHeight());

		panel = this.graphics.activate("placeholder", 5/*primitives.orgdiagram.Layers.Item*/);
		panel.transformPoint(this._cursorTreeItem.actualPosition.horizontalCenter(), this._cursorTreeItem.actualPosition.verticalCenter(), this, function (x, y) {
			this.m_scrollPanel.scrollLeft(x - panelSize.horizontalCenter());
			this.m_scrollPanel.scrollTop(y - panelSize.verticalCenter());
		});
	}
};

primitives.orgdiagram.Controller.prototype._setOption = function (key, value) {
	jQuery.Widget.prototype._setOption.apply(this, arguments);

	switch (key) {
		case "disabled":
			var handles = jQuery([]);
			if (value) {
				handles.filter(".ui-state-focus").blur();
				handles.removeClass("ui-state-hover");
				handles.propAttr("disabled", true);
				this.element.addClass("ui-disabled");
			} else {
				handles.propAttr("disabled", false);
				this.element.removeClass("ui-disabled");
			}
			break;
		default:
			break;
	}
};

primitives.orgdiagram.Controller.prototype._getTreeItemForMousePosition = function (x, y) {
	var	result = null,
		index,
		len,
		len2,
		treeLevel,
		closestItem,
		bestDistance,
		treeItem,
		itemIndex,
		currentDistance,
		placeholder = this.graphics.activate("placeholder", 5/*primitives.orgdiagram.Layers.Item*/);

	placeholder.transformPointBack(x, y, this, function (x, y) {
		for (index = 0, len = this._treeLevels.length; index < len; index += 1) {
			treeLevel = this._treeLevels[index];

			if (y > treeLevel.topConnectorShift && y <= treeLevel.connectorShift) {
				closestItem = null;
				bestDistance = null;
				for (itemIndex = 0, len2 = treeLevel.treeItems.length; itemIndex < len2; itemIndex += 1) {
					treeItem = this._treeItems[treeLevel.treeItems[itemIndex]];

					switch (treeItem.actualVisibility) {
						case 1/*primitives.orgdiagram.Visibility.Normal*/:
							if (treeItem.actualPosition.contains(x, y)) {
								result = treeItem;
								return;
							}
						case 2/*primitives.orgdiagram.Visibility.Dot*/:
						case 3/*primitives.orgdiagram.Visibility.Line*/:
							currentDistance = Math.abs(treeItem.actualPosition.horizontalCenter() - x);
							if (bestDistance === null || currentDistance < bestDistance) {
								bestDistance = currentDistance;
								closestItem = treeItem;
							}
							break;
						case 4/*primitives.orgdiagram.Visibility.Invisible*/:
							break;
					}
				}
				result = closestItem;
				return;
			}
		}
		return;
	});
	return result;
};

primitives.orgdiagram.Controller.prototype._drawHighlightAnnotation = function () {
	var common = primitives.common,
		panel,
		treeItem,
		panelPosition,
		calloutPanelPosition,
		snapPoint,
		position,
		uiHash,
		element,
		style;
	if (this._highlightTreeItem !== null) {
		switch (this._highlightTreeItem.actualVisibility) {
			case 2/*primitives.orgdiagram.Visibility.Dot*/:
			case 3/*primitives.orgdiagram.Visibility.Line*/:
				treeItem = this._highlightTreeItem;
				panelPosition = new common.Rect(
					this.m_scrollPanel.scrollLeft(),
					this.m_scrollPanel.scrollTop(),
					Math.min(this.m_scrollPanel.innerWidth() - 25, this.m_placeholder.innerWidth()),
					Math.min(this.m_scrollPanel.innerHeight() - 25, this.m_placeholder.innerHeight())
					);

				panel = this.graphics.activate("placeholder", 5/*primitives.orgdiagram.Layers.Item*/);
				panel.transformPoint(treeItem.actualPosition.horizontalCenter(), treeItem.actualPosition.verticalCenter(), this, function (x, y) {
					snapPoint = new common.Point(x, y);
					position = this._getAnnotationPosition(snapPoint, panelPosition, treeItem.template.itemSize);

					/* position callout div placeholder */
					calloutPanelPosition = new common.Rect(position);
					calloutPanelPosition.addRect(snapPoint.x, snapPoint.y);
					calloutPanelPosition.offset(50);
					style = calloutPanelPosition.getCSS();
					style.display = "inherit";
					style.visibility = "inherit";
					this.m_calloutPlaceholder.css(style);

					/* recalculate geometries */
					snapPoint.x -= calloutPanelPosition.x;
					snapPoint.y -= calloutPanelPosition.y;
					position.x -= calloutPanelPosition.x;
					position.y -= calloutPanelPosition.y;

					uiHash = new common.RenderEventArgs();
					uiHash.context = treeItem.itemConfig;
					uiHash.isCursor = treeItem.isCursor;
					uiHash.isSelected = treeItem.isSelected;
					uiHash.templateName = treeItem.template.name;


					this.graphics.resize("calloutplaceholder");
					panel = this.graphics.activate("calloutplaceholder", 6/*primitives.orgdiagram.Layers.Annotation*/);
					element = this.graphics.template(
							  position.x
							, position.y
							, position.width
							, position.height
							, 0
							, 0
							, position.width
							, position.height
							, treeItem.template.itemTemplate
							, treeItem.template.itemTemplateHashCode
							, treeItem.template.itemTemplateRenderName
							, uiHash
							, null
							);

					this.pointerPlacement = 0/*primitives.common.PlacementType.Auto*/;
					this.m_calloutShape.cornerRadius = this.options.calloutCornerRadius;
					this.m_calloutShape.offset = this.options.calloutOffset;
					this.m_calloutShape.opacity = this.options.calloutOpacity;
					this.m_calloutShape.lineWidth = this.options.calloutLineWidth;
					this.m_calloutShape.pointerWidth = this.options.calloutPointerWidth;
					this.m_calloutShape.borderColor = this.options.calloutBorderColor;
					this.m_calloutShape.fillColor = this.options.calloutfillColor;
					this.m_calloutShape.draw(snapPoint, position);
				});
				break;
			case 1/*primitives.orgdiagram.Visibility.Normal*/:
			case 4/*primitives.orgdiagram.Visibility.Invisible*/:
				this.m_calloutPlaceholder.css({"display" : "none", "visibility": "hidden"});
				break;
		}
	}
};

primitives.orgdiagram.Controller.prototype._getAnnotationPosition = function (snapPoint, panelRect, itemSize) {
	var result = new primitives.common.Rect(snapPoint.x, snapPoint.y, itemSize.width, itemSize.height);

	if (snapPoint.y > panelRect.bottom() - panelRect.height / 4.0) {
		result.y -= (itemSize.height / 2.0);
		if (snapPoint.x < panelRect.horizontalCenter()) {
			result.x += itemSize.width / 4.0;
		}
		else {
			result.x -= (itemSize.width / 4.0 + itemSize.width);
		}
	}
	else {
		result.y += (itemSize.height / 4.0);
		result.x -= (itemSize.width / 2.0);
	}

	// If annotation clipped then move it back into view port
	if (result.x < panelRect.x) {
		result.x = panelRect.x + 5;
	}
	else if (result.right() > panelRect.right()) {
		result.x -= (result.right() - panelRect.right() + 5);
	}

	if (result.y < panelRect.y) {
		result.y = panelRect.y + 5;
	}
	else if (result.bottom() > panelRect.bottom()) {
		result.y -= (result.bottom() - panelRect.bottom() + 5);
	}

	return result;
};
primitives.orgdiagram.Controller.prototype._positionTreeItems = function () {
	var panelSize = new primitives.common.Rect(0, 0, this.element.outerWidth() - 25, this.element.outerHeight() - 25),
		placeholderSize = new primitives.common.Rect(0, 0, 0, 0),
		levelVisibilities,
		visibilities,
		level,
		index,
		minimalPlaceholderSize,
		leftMargin,
		rightMargin,
		cursorIndex;

	switch (this.options.orientationType) {
		case primitives.orgdiagram.OrientationType.Left:
		case primitives.orgdiagram.OrientationType.Right:
			panelSize.invert();
			break;
	}

	if (this._treeLevels.length > 0) {
		switch (this.options.pageFitMode) {
			case 0/*primitives.orgdiagram.PageFitMode.None*/:
				levelVisibilities = [new primitives.orgdiagram.LevelVisibility(0, 1/*primitives.orgdiagram.Visibility.Normal*/)];
				placeholderSize = this._setTreeLevelsVisibilityAndPositionTreeItems(levelVisibilities, 0);
				break;
			default:
				levelVisibilities = [new primitives.orgdiagram.LevelVisibility(0, 1/*primitives.orgdiagram.Visibility.Normal*/)];
				visibilities = [];
				switch (this.options.minimalVisibility) {
					case 1/*primitives.orgdiagram.Visibility.Normal*/:
						break;
					case 2/*primitives.orgdiagram.Visibility.Dot*/:
						visibilities.push(2/*primitives.orgdiagram.Visibility.Dot*/);
						break;
					case 0/*primitives.orgdiagram.Visibility.Auto*/:
					case 3/*primitives.orgdiagram.Visibility.Line*/:
					case 4/*primitives.orgdiagram.Visibility.Invisible*/:
						visibilities.push(2/*primitives.orgdiagram.Visibility.Dot*/);
						visibilities.push(3/*primitives.orgdiagram.Visibility.Line*/);
						break;
				}

				for (level = this._treeLevels.length - 1; level >= 0; level -= 1) {
					for (index = 0; index < visibilities.length; index += 1) {
						levelVisibilities.push(new primitives.orgdiagram.LevelVisibility(level, visibilities[index]));
					}
				}

				// Find minimal placeholder size to hold completly folded diagram
				minimalPlaceholderSize = this._setTreeLevelsVisibilityAndPositionTreeItems(levelVisibilities, levelVisibilities.length - 1);
				minimalPlaceholderSize.addRect(panelSize);
				minimalPlaceholderSize.offset(0, 0, 5, 5);

				leftMargin = null;
				rightMargin = null;
				cursorIndex = null;
				// Maximized
				placeholderSize = this._setTreeLevelsVisibilityAndPositionTreeItems(levelVisibilities, 0);
				if (!this._checkDiagramSize(placeholderSize, minimalPlaceholderSize)) {
					leftMargin = 0;

					// Minimized
					placeholderSize = this._setTreeLevelsVisibilityAndPositionTreeItems(levelVisibilities, levelVisibilities.length - 1);
					if (this._checkDiagramSize(placeholderSize, minimalPlaceholderSize)) {
						rightMargin = levelVisibilities.length - 1;

						cursorIndex = rightMargin;
						while (rightMargin - leftMargin > 1) {
							cursorIndex = Math.floor((rightMargin + leftMargin) / 2.0);

							placeholderSize = this._setTreeLevelsVisibilityAndPositionTreeItems(levelVisibilities, cursorIndex);
							if (this._checkDiagramSize(placeholderSize, minimalPlaceholderSize)) {
								rightMargin = cursorIndex;
							}
							else {
								leftMargin = cursorIndex;
							}
						}
						if (rightMargin !== cursorIndex) {
							placeholderSize = this._setTreeLevelsVisibilityAndPositionTreeItems(levelVisibilities, rightMargin);
						}
					}
				}
				break;
		}

		if (placeholderSize.width < panelSize.width) {
			this._stretchToWidth(placeholderSize.width, panelSize.width);
			placeholderSize.width = panelSize.width;
		}
		if (placeholderSize.height < panelSize.height) {
			placeholderSize.height = panelSize.height;
		}

		switch (this.options.orientationType) {
			case primitives.orgdiagram.OrientationType.Left:
			case primitives.orgdiagram.OrientationType.Right:
				placeholderSize.invert();
				break;
		}

		this.m_placeholder.css(placeholderSize.getCSS());
	}
};

primitives.orgdiagram.Controller.prototype._checkDiagramSize = function (diagramSize, panelSize) {
	var result = false;
	switch (this.options.pageFitMode) {
		case 1/*primitives.orgdiagram.PageFitMode.PageWidth*/:
			if (panelSize.width >= diagramSize.width) {
				result = true;
			}
			break;
		case 2/*primitives.orgdiagram.PageFitMode.PageHeight*/:
			if (panelSize.height >= diagramSize.height) {
				result = true;
			}
			break;
		case 3/*primitives.orgdiagram.PageFitMode.FitToPage*/:
			if (panelSize.height >= diagramSize.height && panelSize.width >= diagramSize.width) {
				result = true;
			}
			break;
	}
	return result;
};

primitives.orgdiagram.Controller.prototype._setTreeLevelsVisibilityAndPositionTreeItems = function (levelVisibilities, cursorIndex) {
	var index,
		levelVisibility;
	for (index = 0; index < this._treeLevels.length; index += 1) {
		this._treeLevels[index].currentvisibility = 1/*primitives.orgdiagram.Visibility.Normal*/;
	}
	for (index = 0; index <= cursorIndex; index += 1) {
		levelVisibility = levelVisibilities[index];

		this._treeLevels[levelVisibility.level].currentvisibility = levelVisibility.currentvisibility;
	}
	this._recalcLevelsDepth();
	this._shiftLevels();
	this._setOffsets();

	return new primitives.common.Rect(0, 0, this._getDiagramWidth(), this._getDiagramHeight());
};

primitives.orgdiagram.Controller.prototype._getDiagramHeight = function () {
	return this._treeLevels[this._treeLevels.length - 1].connectorShift;
};

primitives.orgdiagram.Controller.prototype._getDiagramWidth = function () {
	var result = 0.0,
		index,
		len;
	for (index = 0, len =  this._treeLevels.length; index < len; index += 1) {
		result = Math.max(result, this._treeLevels[index].currentOffset);
	}
	result += this.options.normalItemsInterval;
	return result;
};

primitives.orgdiagram.Controller.prototype._setOffsets = function () {
	var index,
		len;
	for (index = 0, len = this._treeLevels.length; index < len; index += 1) {
		this._treeLevels[index].currentOffset = 0.0;
	}
	if (this._treeItems[this._visualRootItem] !== undefined) {
		this._setOffset(this._treeItems[this._visualRootItem]);
	}
};

primitives.orgdiagram.Controller.prototype._setOffset = function (treeItem) {
	var treeLevel = this._treeLevels[treeItem.level],
		treeItemPadding = this._getItemsInterval(treeItem.visibility === 0/*primitives.orgdiagram.Visibility.Auto*/ ? treeLevel.currentvisibility : treeItem.visibility) / 2.0,
		index,
		len,
		offset,
		siblings,
		gaps,
		gap,
		leftMargin,
		parentItem,
		childItem,
		groups,
		items,
		item1,
		item2,
		groupIndex,
		groupOffset,
		group,
		sibling;
	treeItem.offset = treeLevel.currentOffset + treeItemPadding;
	treeItem.padding = treeItemPadding;
	treeLevel.currentOffset = treeItem.offset + treeItem.actualSize.width + treeItemPadding;

	if (treeItem.visualChildren.length > 0) {
		for (index = 0, len = treeItem.visualChildren.length; index < len; index += 1) {
			this._setOffset(this._treeItems[treeItem.visualChildren[index]]);
		}
		offset = this._getChildrenOffset(treeItem);
		if (offset > 0) {
			this._offsetItemChildren(treeItem, offset);
		}
		else if (offset < 0) {
			offset = -offset;
			this._offsetItem(treeItem, offset);

			siblings = null;
			gaps = {};
			leftMargin = null;
			parentItem = this._getParentItem(treeItem);
			if (parentItem !== null) {
				for (index = parentItem.visualChildren.length - 1; index >= 0; index -= 1) {
					childItem = parentItem.visualChildren[index];
					if (childItem === treeItem) {
						siblings = [];
					}
					else if (siblings !== null) {
						gap = this._getGapBetweenSiblings(childItem, treeItem);
						gaps[childItem.id] = gap;
						if (gap > 0) {
							siblings.splice(0, 0, childItem);
						}
						else {
							leftMargin = childItem;
							break;
						}
					}
				}
				if (siblings.length > 0) {
					groups = null;
					if (leftMargin !== null) {
						items = [leftMargin];
						items = items.concat(siblings);
						items.push(treeItem);

						groups = [[leftMargin]];
						for (index = 1, len = items.length; index < len; index += 1) {
							item1 = items[index - 1];
							item2 = items[index];
							if (item1.connectorPlacement === 3/*primitives.common.PlacementType.Right*/ || item2.connectorPlacement === 7/*primitives.common.PlacementType.Left*/) {
								groups[groups.length - 1].push(item2);
							}
							else {
								groups.push([item2]);
							}
						}
					}
					else {
						groups = [siblings.slice(0)];
						groups[groups.length - 1].push(treeItem);
					}

					// align items to the right
					if (groups.length > 0) {
						siblings = groups[groups.length - 1];
						for (index = siblings.length - 2; index >= 0; index -= 1) {
							sibling = siblings[index];
							gap = gaps[sibling.id];
							offset = Math.min(gap, offset);

							this._offsetItem(sibling, offset);
							this._offsetItemChildren(sibling, offset);
						}
					}

					// spread items proportionally
					groupOffset = offset / (groups.length - 1);
					for (groupIndex = groups.length - 2; groupIndex > 0; groupIndex -= 1) {
						group = groups[groupIndex];
						for (index = group.length - 1; index >= 0; index -= 1) {
							sibling = group[index];
							gap = gaps[sibling.id];
							offset = Math.min(groupIndex * groupOffset, Math.min(gap, offset));

							this._offsetItem(sibling, offset);
							this._offsetItemChildren(sibling, offset);
						}
					}
				}
			}
		}
	}
};

primitives.orgdiagram.Controller.prototype._getGapBetweenSiblings = function (leftItem, rightItem) {
	var result = null,
		rightMargins = this._getRightMargins(leftItem),
		leftMargins = this._getLeftMargins(rightItem),
		depth = Math.min(rightMargins.length, leftMargins.length),
		index,
		gap;

	for (index = 0; index < depth; index += 1) {
		gap = leftMargins[index] - rightMargins[index];
		result = (result !== null) ? Math.min(result, gap) : gap;

		if (gap <= 0) {
			break;
		}
	}

	return Math.floor(result);
};

primitives.orgdiagram.Controller.prototype._getRightMargins = function (treeItem) {
	var result = [],
		rightMargins,
		index,
		len,
		marginItem;

	rightMargins = this._rightMargins[treeItem];
	if (rightMargins === undefined) {
		rightMargins = [];
	}
	rightMargins = rightMargins.slice();
	rightMargins.splice(0, 0, treeItem.id);
	for (index = 0, len = rightMargins.length; index < len; index += 1) {
		marginItem = this._treeItems[rightMargins[index]];
		result[index] = marginItem.offset + marginItem.actualSize.width + marginItem.padding;
	}

	return result;
};

primitives.orgdiagram.Controller.prototype._getLeftMargins = function (treeItem) {
	var result = [],
		leftMargins,
		index,
		len,
		marginItem;

	leftMargins = this._leftMargins[treeItem];
	if (leftMargins === undefined) {
		leftMargins = [];
	}
	leftMargins = leftMargins.slice();
	leftMargins.splice(0, 0, treeItem.id);
	for (index = 0, len = leftMargins.length; index < len; index += 1) {
		marginItem = this._treeItems[leftMargins[index]];
		result[index] = marginItem.offset - marginItem.padding;
	}

	return result;
};

primitives.orgdiagram.Controller.prototype._getChildrenOffset = function (treeItem) {
	var treeItemCenterOffset = treeItem.offset + treeItem.actualSize.width / 2.0,
		childrenCenterOffset = null,
		children,
		firstItem,
		lastItem,
		index,
		len,
		visualAggregator;
	if (treeItem.visualAggregatorId === null) {
		children = treeItem.visualChildren;
		firstItem = null;
		for (index = 0, len = children.length; index < len; index += 1) {
			firstItem = this._treeItems[children[index]];
			if (firstItem.connectorPlacement === 1/*primitives.common.PlacementType.Top*/) {
				break;
			}
		}
		lastItem = null;
		for (index = children.length - 1; index >= 0; index -= 1) {
			lastItem = this._treeItems[children[index]];
			if (lastItem.connectorPlacement === 1/*primitives.common.PlacementType.Top*/) {
				break;
			}
		}
		switch (this.options.horizontalAlignment) {
			case 1/*primitives.common.HorizontalAlignmentType.Left*/:
				childrenCenterOffset = firstItem.offset + firstItem.actualSize.width / 2.0;
				break;
			case 2/*primitives.common.HorizontalAlignmentType.Right*/:
				childrenCenterOffset = lastItem.offset + lastItem.actualSize.width / 2.0;
				break;
			case 0/*primitives.common.HorizontalAlignmentType.Center*/:
				childrenCenterOffset = (firstItem.offset + lastItem.offset + lastItem.actualSize.width) / 2.0;
				break;
		}
	}
	else {
		visualAggregator = this._treeItems[treeItem.visualAggregatorId];
		childrenCenterOffset = visualAggregator.offset + visualAggregator.actualSize.width / 2.0;
	}
	return treeItemCenterOffset - childrenCenterOffset;
};

primitives.orgdiagram.Controller.prototype._getParentItem = function (treeItem) {
	var result = null;
	if (treeItem !== null && treeItem.visualParentId !== null) {
		result = this._treeItems[treeItem.visualParentId];
	}
	return result;
};

primitives.orgdiagram.Controller.prototype._offsetItem = function (treeItem, offset) {
	treeItem.offset += offset;

	var treeLevel = this._treeLevels[treeItem.level];
	treeLevel.currentOffset = Math.max(treeLevel.currentOffset, treeItem.offset + treeItem.actualSize.width);
};

primitives.orgdiagram.Controller.prototype._offsetItemChildren = function (treeItem, offset) {
	var children = treeItem.visualChildren,
		childTreeItem,
		treeLevel,
		index,
		len;
	if (children.length > 0) {
		childTreeItem = null;
		for (index = 0, len = children.length; index < len; index += 1) {
			childTreeItem = this._treeItems[children[index]];
			childTreeItem.offset += offset;

			this._offsetItemChildren(childTreeItem, offset);
		}
		treeLevel = this._treeLevels[childTreeItem.level];
		treeLevel.currentOffset = Math.max(treeLevel.currentOffset, childTreeItem.offset + childTreeItem.actualSize.width);
	}
};

primitives.orgdiagram.Controller.prototype._getItemsInterval = function (visibility) {
	var result = 0.0;

	switch (visibility) {
		case 1/*primitives.orgdiagram.Visibility.Normal*/:
			result = this.options.normalItemsInterval;
			break;
		case 2/*primitives.orgdiagram.Visibility.Dot*/:
			result = this.options.dotItemsInterval;
			break;
		case 3/*primitives.orgdiagram.Visibility.Line*/:
		case 4/*primitives.orgdiagram.Visibility.Invisible*/:
			result = this.options.lineItemsInterval;
			break;
	}
	return result;
};

primitives.orgdiagram.Controller.prototype._stretchToWidth = function (treeWidth, panelWidth) {
	var offset,
		treeItemId;
	switch (this.options.horizontalAlignment) {
		case 1/*primitives.common.HorizontalAlignmentType.Left*/:
			offset = 0;
			break;
		case 2/*primitives.common.HorizontalAlignmentType.Right*/:
			offset = panelWidth - treeWidth;
			break;
		case 0/*primitives.common.HorizontalAlignmentType.Center*/:
			offset = (panelWidth - treeWidth) / 2.0;
			break;
	}
	if (offset > 0) {
		for (treeItemId in this._treeItems) {
			if (this._treeItems.hasOwnProperty(treeItemId)) {
				this._treeItems[treeItemId].offset += offset;
			}
		}
	}
};

primitives.orgdiagram.Controller.prototype._recalcLevelsDepth = function () {
	var index,
		len,
		treeItem,
		treeLevel,
		treeItemId;
	for (index = 0, len = this._treeLevels.length; index < len; index += 1) {
		treeLevel = this._treeLevels[index];
		treeLevel.shift = 0.0;
		treeLevel.depth = 0.0;
		treeLevel.actualVisibility = 4/*primitives.orgdiagram.Visibility.Invisible*/;
	}
	for (treeItemId in this._treeItems) {
		if (this._treeItems.hasOwnProperty(treeItemId)) {
			treeItem = this._treeItems[treeItemId];
			treeLevel = this._treeLevels[treeItem.level];

			treeItem.setActualSize(treeLevel, this.options);

			treeLevel.depth = Math.max(treeLevel.depth, treeItem.actualSize.height);
			treeLevel.actualVisibility = Math.min(treeLevel.actualVisibility, treeItem.actualVisibility);
		}
	}
};

primitives.orgdiagram.Controller.prototype._shiftLevels = function () {
	var shift = this.options.lineLevelShift,
		index,
		len,
		treeLevel,
		levelShift;

	for (index = 0, len = this._treeLevels.length; index < len; index += 1) {
		treeLevel = this._treeLevels[index];
		treeLevel.shift = shift;

		levelShift = this._getLevelShift(treeLevel.actualVisibility);
		treeLevel.connectorShift = treeLevel.shift + treeLevel.depth + levelShift / 2.0;
		treeLevel.topConnectorShift = treeLevel.shift - levelShift / 2.0;

		shift += treeLevel.depth + levelShift;
	}
};

primitives.orgdiagram.Controller.prototype._getLevelShift = function (visibility) {
	var result = 0.0;

	switch (visibility) {
		case 1/*primitives.orgdiagram.Visibility.Normal*/:
			result = this.options.normalLevelShift;
			break;
		case 2/*primitives.orgdiagram.Visibility.Dot*/:
			result = this.options.dotLevelShift;
			break;
		case 3/*primitives.orgdiagram.Visibility.Line*/:
		case 4/*primitives.orgdiagram.Visibility.Invisible*/:
			result = this.options.lineLevelShift;
			break;
	}
	return result;
};
primitives.orgdiagram.Controller.prototype._readTemplates = function () {
	var index,
		templateConfig,
		template,
		defaultTemplate;
	this._templates = {};

	defaultTemplate = new primitives.orgdiagram.Template(new primitives.orgdiagram.TemplateConfig());
	defaultTemplate.name = this.widgetEventPrefix + "Template";
	defaultTemplate.createDefaultTemplates(this.options);

	this._templates[defaultTemplate.name] = defaultTemplate;

	for (index = 0; index < this.options.templates.length; index += 1) {
		templateConfig = this.options.templates[index];

		template = new primitives.orgdiagram.Template(templateConfig);
		template.createDefaultTemplates(this.options);

		this._templates[template.name] = template;
	}
};

primitives.orgdiagram.Controller.prototype._onDefaultTemplateRender = function (event, data) {
	var itemConfig = data.context,
		color = primitives.common.highestContrast(itemConfig.itemTitleColor, this.options.itemTitleSecondFontColor, this.options.itemTitleFirstFontColor);
	data.element.find("[name=titleBackground]").css({ "background": itemConfig.itemTitleColor });
	data.element.find("[name=photo]").attr({ "src": itemConfig.image, "alt": itemConfig.title });
	data.element.find("[name=title]").css({ "color": color }).text(itemConfig.title);
	data.element.find("[name=description]").text(itemConfig.description);
};

primitives.orgdiagram.Controller.prototype._createCheckBoxTemplate = function () {
	var template = jQuery('<div></div>');
	template.addClass("bp-item bp-selectioncheckbox-frame");

	template.append(jQuery('<nobr><input type="checkbox" name="checkbox" class="bp-selectioncheckbox" />&nbsp;<span class="bp-selectiontext">'
		+ this.options.selectCheckBoxLabel + '</span></nobr>'));

	this._checkBoxTemplate = template.wrap('<div>').parent().html();
	this._checkBoxTemplateHashCode = primitives.common.hashCode(this._checkBoxTemplate);
};

primitives.orgdiagram.Controller.prototype._onCheckBoxTemplateRender = function (event, data) {
	var checkBox = data.element.find("[name=checkbox]");
	if (data.isSelected) {
		checkBox.attr("checked", "checked");
	}
	else {
		checkBox.removeAttr("checked");
	}
};

primitives.orgdiagram.Controller.prototype._createGroupTitleTemplate = function () {
	var template = jQuery('<div></div>');
	template.addClass("bp-item bp-corner-all bp-grouptitle-frame");

	this._groupTitleTemplate = template.wrap('<div>').parent().html();
	this._groupTitleTemplateHashCode = primitives.common.hashCode(this._groupTitleTemplate);
};

primitives.orgdiagram.Controller.prototype._onGroupTitleTemplateRender = function (event, data) {
	var config = new primitives.text.Config();
	config.orientation = 2/*primitives.text.TextOrientationType.RotateRight*/;
	config.horizontalAlignment = 0/*primitives.common.HorizontalAlignmentType.Center*/;
	config.verticalAlignment = 1/*primitives.common.VerticalAlignmentType.Middle*/;
	config.text = data.itemConfig.groupTitle;
	config.fontSize = "12px";
	config.color = primitives.common.highestContrast(data.itemConfig.groupTitleColor, this.options.itemTitleSecondFontColor, this.options.itemTitleFirstFontColor);
	config.fontFamily = "Verdana";
	switch (data.renderingMode) {
		case 0/*primitives.common.RenderingMode.Create*/:
			data.element.bpText(config);
			break;
		case 1/*primitives.common.RenderingMode.Update*/:
			data.element.bpText("option", config);
			data.element.bpText("update");
			break;
	}
	primitives.common.css(data.element, { "background": data.itemConfig.groupTitleColor });
};

primitives.orgdiagram.Controller.prototype._createButtonsTemplate = function () {
	var template = jQuery("<ul></ul>");

	template.css({
		position: "absolute"
	}).addClass("ui-widget ui-helper-clearfix");

	this._buttonsTemplate = template.wrap('<div>').parent().html();
	this._buttonsTemplateHashCode = primitives.common.hashCode(this._buttonsTemplate);
};

primitives.orgdiagram.Controller.prototype._onButtonsTemplateRender = function (event, data) {
	var topOffset = 0,
		buttonsInterval = 10,
		buttonConfig,
		button,
		index;

	switch (data.renderingMode) {
		case 0/*primitives.common.RenderingMode.Create*/:
			for (index = 0; index < this.options.buttons.length; index += 1) {
				buttonConfig = this.options.buttons[index];
				button = jQuery('<li data-buttonname="' + buttonConfig.name + '"></li>')
					.css({
						position: "absolute",
						top: topOffset + "px",
						left: "0px",
						width: buttonConfig.size.width + "px",
						height: buttonConfig.size.height + "px",
						padding: "3px"
					})
					.addClass(this.widgetEventPrefix + "button");
				data.element.append(button);
				button.button({
					icons: { primary: buttonConfig.icon },
					text: buttonConfig.text,
					label: buttonConfig.label
				});
				topOffset += buttonsInterval + buttonConfig.size.height;
			}
			break;
		case 1/*primitives.common.RenderingMode.Update*/:
			break;
	}
};
primitives.orgdiagram.Controller.prototype._readTreeItems = function () {
	var rootItem;

	this._cursorTreeItem = null;
	this._highlightTreeItem = null;
	this._selectedTreeItems.length = 0;

	this._defaultTemplate = null;
	this._defaultTemplate = this._templates[this.options.defaultTemplateName];
	if (this._defaultTemplate === undefined) {
		this._defaultTemplate = this._templates[this.widgetEventPrefix + "Template"];
	}

	this._treeItemCounter = 0;
	this._treeItems = {};

	this._treeLevels = [];
	this._leftMargins = {};
	this._rightMargins = {};

	this._visualRootItem = 0;
	if (this.options.rootItem !== null) {

		rootItem = this._getNewTreeItem({
			itemConfig: this.options.rootItem
		});

		switch (rootItem.itemConfig.itemType) {
			case 2/*primitives.orgdiagram.ItemType.Adviser*/:
			case 1/*primitives.orgdiagram.ItemType.Assistant*/:
				rootItem.actualItemType = 0/*primitives.orgdiagram.ItemType.Regular*/;
				break;
			default:
				rootItem.actualItemType = rootItem.itemConfig.itemType;
				break;
		}
		rootItem.visibility = (rootItem.actualItemType === 3/*primitives.orgdiagram.ItemType.Invisible*/) ? 4/*primitives.orgdiagram.Visibility.Invisible*/ : 0/*primitives.orgdiagram.Visibility.Auto*/;
		this._createVisualTree(rootItem);
		this._readVisualTree(this._treeItems[this._visualRootItem], 0);

		this._showSelectedItems();
		this._showCursorNeigbours();
	}
};

primitives.orgdiagram.Controller.prototype._getNewTreeItem = function (options) {
	var result = new primitives.orgdiagram.TreeItem(this._treeItemCounter),
		optionKey;
	for (optionKey in options) {
		if (options.hasOwnProperty(optionKey)) {
			result[optionKey] = options[optionKey];
		}
	}
	this._treeItemCounter += 1;
	this._treeItems[result.id] = result;
	return result;
};

primitives.orgdiagram.Controller.prototype._createVisualTree = function (logicalParentItem) {
	var treeItem,
		itemConfig,
		visualParent,
		visualAggregator,
		itemLogicalChildren,
		leftSiblingIndex,
		rightSiblingIndex,
		index,
		len,
		childIndex,
		childrenLen,
		depth,
		rowDepths,
		rowDepth,
		rowAggregators,
		rowAggregator,
		rowChildren,
		children;

	itemLogicalChildren = logicalParentItem.itemConfig.items.slice(0);
	for (index = 0, len = itemLogicalChildren.length; index < len; index += 1) {
		itemConfig = itemLogicalChildren[index];

		if (this._hasVisibleChildren(itemConfig)) {
			treeItem = this._getNewTreeItem({
				itemConfig: itemConfig,
				logicalParentId: logicalParentItem.id,
				visualParentId: logicalParentItem.id,
				actualItemType: itemConfig.itemType
			});
			logicalParentItem.logicalChildren.push(treeItem);

			treeItem.visibility = (treeItem.actualItemType === 3/*primitives.orgdiagram.ItemType.Invisible*/) ? 4/*primitives.orgdiagram.Visibility.Invisible*/ : 0/*primitives.orgdiagram.Visibility.Auto*/;

			switch (treeItem.actualItemType) {
				case 2/*primitives.orgdiagram.ItemType.Adviser*/:
					if (logicalParentItem.visualParentId === null) {
						this._createNewVisualRoot(logicalParentItem);
					}
					visualParent = this._treeItems[logicalParentItem.visualParentId];
					switch (logicalParentItem.connectorPlacement) {
						case 1/*primitives.common.PlacementType.Top*/:
							switch (itemConfig.adviserPlacementType) {
								case 2/*primitives.orgdiagram.AdviserPlacementType.Left*/:
									leftSiblingIndex = this._findLeftSiblingIndex(visualParent.visualChildren, logicalParentItem);
									visualParent.visualChildren.splice(leftSiblingIndex + 1, 0, treeItem);
									treeItem.connectorPlacement = 3/*primitives.common.PlacementType.Right*/;
									break;
								default:
									rightSiblingIndex = this._findRightSiblingIndex(visualParent.visualChildren, logicalParentItem);
									visualParent.visualChildren.splice(rightSiblingIndex, 0, treeItem);
									treeItem.connectorPlacement = 7/*primitives.common.PlacementType.Left*/;
									break;
							}
							break;
						case 3/*primitives.common.PlacementType.Right*/:
							leftSiblingIndex = this._findLeftSiblingIndex(visualParent.visualChildren, logicalParentItem);
							visualParent.visualChildren.splice(leftSiblingIndex + 1, 0, treeItem);
							treeItem.connectorPlacement = 3/*primitives.common.PlacementType.Right*/;
							break;
						case 7/*primitives.common.PlacementType.Left*/:
							rightSiblingIndex = this._findRightSiblingIndex(visualParent.visualChildren, logicalParentItem);
							visualParent.visualChildren.splice(rightSiblingIndex, 0, treeItem);
							treeItem.connectorPlacement = 7/*primitives.common.PlacementType.Left*/;
							break;
					}
					treeItem.visualParentId = logicalParentItem.visualParentId;
					break;
				case 1/*primitives.orgdiagram.ItemType.Assistant*/:
					if (logicalParentItem.visualAggregatorId === null) {
						this._createNewVisualAggregator(logicalParentItem);
					}
					switch (itemConfig.adviserPlacementType) {
						case 2/*primitives.orgdiagram.AdviserPlacementType.Left*/:
							logicalParentItem.visualChildren.splice(0, 0, treeItem);
							treeItem.connectorPlacement = 3/*primitives.common.PlacementType.Right*/;
							break;
						default:
							logicalParentItem.visualChildren.push(treeItem);
							treeItem.connectorPlacement = 7/*primitives.common.PlacementType.Left*/;
							break;
					}
					treeItem.visualParentId = logicalParentItem.id;
					break;
				case 0/*primitives.orgdiagram.ItemType.Regular*/:
				case 3/*primitives.orgdiagram.ItemType.Invisible*/:
					visualParent = logicalParentItem;
					if (logicalParentItem.visualAggregatorId !== null) {
						visualParent = this._treeItems[logicalParentItem.visualAggregatorId];
					}
					visualParent.visualChildren.push(treeItem);
					treeItem.visualParentId = visualParent.id;
					break;
			}
		}
	}


	rowAggregators = [];
	rowChildren = [];
	this._layoutChildren(logicalParentItem, rowAggregators, rowChildren);

	for (index = 0, len = logicalParentItem.logicalChildren.length; index < len; index += 1) {
		this._createVisualTree(logicalParentItem.logicalChildren[index]);
	}

	/* Move assistants children inside */
	if (logicalParentItem.visualAggregatorId !== null) {
		visualAggregator = this._treeItems[logicalParentItem.visualAggregatorId];
		if (visualAggregator.visualChildren.length > 0) {
			depth = this._getAssitantsDepth(logicalParentItem);
			if (depth > 1) {

				for (index = 0; index < depth - 1; index += 1) {
					visualAggregator = this._createNewVisualAggregator(visualAggregator);
				}
			}
		}
	}

	/* Move advisers children inside */
	if (logicalParentItem.visualChildren.length > 0) {
		depth = this._getAdvisersDepth(logicalParentItem);
		if (depth > 1) {
			visualAggregator = logicalParentItem;
			for (index = 0; index < depth - 1; index += 1) {
				visualAggregator = this._createNewVisualAggregator(visualAggregator);
			}
		}
	}

	/* Move children of children inside */
	rowDepths = [];
	for (index = 0, len = rowChildren.length; index < len; index += 1) {
		children = rowChildren[index];
		rowDepths[index] = 0;
		for (childIndex = 0, childrenLen = children.length; childIndex < childrenLen; childIndex += 1) {
			rowDepths[index] = Math.max(rowDepths[index], this._getItemDepth(children[childIndex]));
		}
	}

	for (index = 0, len = rowDepths.length; index < len; index += 1) {
		rowDepth = rowDepths[index];
		if (rowDepth > 1) {
			for (childIndex = 0, childrenLen = rowAggregators[index].length; childIndex < childrenLen; childIndex += 1) {
				rowAggregator = rowAggregators[index][childIndex];
				if (rowAggregator.visualChildren.length > 0) {
					depth = rowDepth;
					while (depth > 1) {
						rowAggregator = this._createNewVisualAggregator(rowAggregator);
						depth -= 1;
					}
				}
			}
		}
	}
};

primitives.orgdiagram.Controller.prototype._hasVisibleChildren = function (itemConfig) {
	var result = true,
		index,
		len;
	if (itemConfig.itemType === 3/*primitives.orgdiagram.ItemType.Invisible*/) {
		result = false;
		for (index = 0, len = itemConfig.items.length; index < len; index += 1) {
			if (this._hasVisibleChildren(itemConfig.items[index])) {
				result = true;
				break;
			}
		}
	}
	return result;
};

primitives.orgdiagram.Controller.prototype._getAdvisersDepth = function (treeItem) {
	var result = 0,
		parentItem = this._getParentItem(treeItem),
		treeItemIndex,
		index,
		childItem;
	if (parentItem !== null) {
		treeItemIndex = primitives.common.indexOf(parentItem.visualChildren, treeItem);
		for (index = treeItemIndex + 1; index < parentItem.visualChildren.length; index += 1) {
			childItem = parentItem.visualChildren[index];
			if (childItem.connectorPlacement === 7/*primitives.common.PlacementType.Left*/) {
				result = Math.max(result, this._getItemDepth(childItem));
			}
			else {
				break;
			}
		}
		for (index = treeItemIndex - 1; index >= 0; index-=1) {
			childItem = parentItem.visualChildren[index];
			if (childItem.connectorPlacement === 3/*primitives.common.PlacementType.Right*/) {
				result = Math.max(result, this._getItemDepth(childItem));
			}
			else {
				break;
			}
		}
	}
	return result;
};

primitives.orgdiagram.Controller.prototype._getAssitantsDepth = function (treeItem) {
	var result = 0,
		index,
		childItem;
	for (index = 0; index < treeItem.visualChildren.length; index += 1) {
		childItem = treeItem.visualChildren[index];
		if (childItem.connectorPlacement !== 1/*primitives.common.PlacementType.Top*/) {
			result = Math.max(result, this._getItemDepth(childItem));
		}
	}
	return result;
};

primitives.orgdiagram.Controller.prototype._getItemDepth = function (treeItem) {
	var result = 0,
		index,
		len;

	for (index = 0, len = treeItem.visualChildren.length; index < len; index += 1) {
		result = Math.max(result, this._getItemDepth(treeItem.visualChildren[index]));
	}

	return result + 1;
};

primitives.orgdiagram.Controller.prototype._layoutChildren = function (treeItem, rowAggregators, rowChildren) {
	var visualParent,
		visualChildren,
		currentVisualParent,
		prevVisualParent,
		leftChildItem,
		rightChildItem,
		newAggregatorItem,
		childItem,
		width,
		height,
		twinColumns,
		column,
		row,
		index,
		len,
		childrenPlacementType = treeItem.itemConfig.childrenPlacementType,
		singleItemPlacement;

	switch (this.options.horizontalAlignment) {
		case 0/*primitives.common.HorizontalAlignmentType.Center*/:
		case 1/*primitives.common.HorizontalAlignmentType.Left*/:
			singleItemPlacement = 3/*primitives.orgdiagram.AdviserPlacementType.Right*/;
			break;
		case 2/*primitives.common.HorizontalAlignmentType.Right*/:
			singleItemPlacement = 2/*primitives.orgdiagram.AdviserPlacementType.Left*/;
			break;
	}

	if (childrenPlacementType === 0/*primitives.orgdiagram.ChildrenPlacementType.Auto*/) {
		if(this._hasLeavesOnly(treeItem)) {
			childrenPlacementType = (this.options.leavesPlacementType === 0/*primitives.orgdiagram.ChildrenPlacementType.Auto*/) ?
				3/*primitives.orgdiagram.ChildrenPlacementType.Matrix*/ : this.options.leavesPlacementType;
		}
		else {
			childrenPlacementType = (this.options.childrenPlacementType === 0/*primitives.orgdiagram.ChildrenPlacementType.Auto*/) ? 
				2/*primitives.orgdiagram.ChildrenPlacementType.Horizontal*/ : this.options.childrenPlacementType; 
		}
	}

	if (childrenPlacementType !== 2/*primitives.orgdiagram.ChildrenPlacementType.Horizontal*/) {
		visualParent = treeItem;
		if (treeItem.visualAggregatorId !== null) {
			visualParent = this._treeItems[treeItem.visualAggregatorId];
		}

		switch (childrenPlacementType) {
			case 3/*primitives.orgdiagram.ChildrenPlacementType.Matrix*/:
				if (visualParent.visualChildren.length > 3) {
					visualChildren = visualParent.visualChildren.slice(0);
					visualParent.visualChildren.length = 0;

					width = Math.min(this.options.maximumColumnsInMatrix, Math.ceil(Math.sqrt(visualChildren.length)));
					height = Math.ceil(visualChildren.length / width);
					twinColumns = Math.ceil(width / 2.0);
					for (column = 0; column < twinColumns; column += 1) {
						currentVisualParent = visualParent;
						for (row = 0; row < height; row += 1) {
							leftChildItem = this._getMatrixItem(visualChildren, column * 2, row, width, height);
							rightChildItem = this._getMatrixItem(visualChildren, column * 2 + 1, row, width, height);
							if (rowAggregators[row] === undefined) {
								rowAggregators[row] = [];
								rowChildren[row] = [];
							}
							if (leftChildItem !== null) {
								currentVisualParent.visualChildren.push(leftChildItem);
								leftChildItem.visualParentId = currentVisualParent.id;
								leftChildItem.connectorPlacement = 3/*primitives.common.PlacementType.Right*/;

								rowChildren[row].push(leftChildItem);
							}
							if (leftChildItem !== null || rightChildItem !== null) {
								newAggregatorItem = this._getNewTreeItem({
									visibility: 4/*primitives.orgdiagram.Visibility.Invisible*/,
									visualParentId: currentVisualParent.id
								});
								currentVisualParent.visualChildren.push(newAggregatorItem);
								currentVisualParent.visualAggregatorId = newAggregatorItem.id;

								rowAggregators[row].push(newAggregatorItem);
							}
							if (rightChildItem !== null) {
								currentVisualParent.visualChildren.push(rightChildItem);
								rightChildItem.visualParentId = currentVisualParent.id;
								rightChildItem.connectorPlacement = 7/*primitives.common.PlacementType.Left*/;

								rowChildren[row].push(rightChildItem);
							}

							currentVisualParent = newAggregatorItem;
						}
					}
					if (width > 2) {
						// No center alignment to aggregator required
						visualParent.visualAggregatorId = null;
					}
				}
				break;
			case 1/*primitives.orgdiagram.ChildrenPlacementType.Vertical*/:
				visualChildren = visualParent.visualChildren.slice(0);
				visualParent.visualChildren.length = 0;

				for (index = 0, len = visualChildren.length; index < len; index += 1) {
					childItem = visualChildren[index];

					newAggregatorItem = this._getNewTreeItem({
						visibility: 4/*primitives.orgdiagram.Visibility.Invisible*/,
						visualParentId: visualParent.id
					});
					
					visualParent.visualAggregatorId = newAggregatorItem.id;
					
					childItem.visualParentId = visualParent.id;

					switch (singleItemPlacement) {
						case 2/*primitives.orgdiagram.AdviserPlacementType.Left*/:
							visualParent.visualChildren.push(childItem);
							visualParent.visualChildren.push(newAggregatorItem);
							childItem.connectorPlacement = 3/*primitives.common.PlacementType.Right*/;
							break;
						case 3/*primitives.orgdiagram.AdviserPlacementType.Right*/:
							visualParent.visualChildren.push(newAggregatorItem);
							visualParent.visualChildren.push(childItem);
							childItem.connectorPlacement = 7/*primitives.common.PlacementType.Left*/;
							break;
					}

					rowAggregators[index] = [newAggregatorItem];
					rowChildren[index] = [childItem];

					visualParent = newAggregatorItem;
				}
				break;
		}
	}
};

primitives.orgdiagram.Controller.prototype._getMatrixItem = function (items, x, y, width, height) {
	var result,
		isOdd = (width % 2 > 0),
		index;

	if (isOdd) {
		if (x === width - 1) {
			x = items.length;
		}
		else if (x === width) {
			x = width - 1;
		}
	}
	index = y * width + x;

	result = (index > items.length - 1) ? null : items[index];

	return result;
};


primitives.orgdiagram.Controller.prototype._hasLeavesOnly = function (treeItem) {
	var result = false,
		index,
		len,
		childItem,
		logicalChildren;

	if (treeItem.itemConfig !== null) {
		logicalChildren = treeItem.itemConfig.items;
		len = logicalChildren.length;
		if (len > 0) {
			result = true;
			for (index = 0; index < len; index += 1) {
				childItem = logicalChildren[index];
				if (childItem.itemType === 0/*primitives.orgdiagram.ItemType.Regular*/ || childItem.itemType === 3/*primitives.orgdiagram.ItemType.Invisible*/) {
					if (childItem.items.length > 0) {
						result = false;
						break;
					}
				}
			}
		}
	}
	return result;
};

primitives.orgdiagram.Controller.prototype._findLeftSiblingIndex = function (visualChildren, treeItem) {
	var result = null,
		childItem,
		index;
	for (index = visualChildren.length - 1; index >= 0; index-=1) {
		childItem = visualChildren[index];
		if (result === null) {
			if (childItem === treeItem) {
				result = -1;
			}
		}
		else {
			if (childItem.actualItemType === 0/*primitives.orgdiagram.ItemType.Regular*/ || childItem.actualItemType === 3/*primitives.orgdiagram.ItemType.Invisible*/) {
				result = index;
				break;
			}
		}
	}
	return result;
};

primitives.orgdiagram.Controller.prototype._findRightSiblingIndex = function (visualChildren, treeItem) {
	var result = null,
		childItem,
		index,
		len;
	for (index = 0, len = visualChildren.length; index < len; index += 1) {
		childItem = visualChildren[index];
		if (result === null) {
			if (childItem === treeItem) {
				result = len;
			}
		}
		else {
			if (childItem.actualItemType === 0/*primitives.orgdiagram.ItemType.Regular*/ || childItem.actualItemType === 3/*primitives.orgdiagram.ItemType.Invisible*/) {
				result = index;
				break;
			}
		}
	}
	return result;
};

primitives.orgdiagram.Controller.prototype._createNewVisualRoot = function (currentRootItem) {
	var newRootItem = this._getNewTreeItem({
		visibility: 4/*primitives.orgdiagram.Visibility.Invisible*/,
		visualParentId: null
	});
	newRootItem.visualChildren.push(currentRootItem);
	currentRootItem.visualParentId = newRootItem.id;

	this._visualRootItem = newRootItem.id;
};

primitives.orgdiagram.Controller.prototype._createNewVisualAggregator = function (treeItem) {
	var newAggregatorItem,
		index,
		child;
	newAggregatorItem = this._getNewTreeItem({
		visibility: 4/*primitives.orgdiagram.Visibility.Invisible*/,
		visualParentId: treeItem.id,
		visualAggregatorId: treeItem.visualAggregatorId
	});
	newAggregatorItem.visualChildren = treeItem.visualChildren;
	for (index = 0; index < newAggregatorItem.visualChildren.length; index += 1) {
		newAggregatorItem.visualChildren[index].visualParentId = newAggregatorItem.id;
	}
	treeItem.visualChildren = [newAggregatorItem];
	treeItem.visualAggregatorId = newAggregatorItem.id;
	return newAggregatorItem;
};

primitives.orgdiagram.Controller.prototype._readVisualTree = function (treeItem, level) {
	var treeLevel = this._treeLevels[level],
		itemConfig,
		template,
		index,
		len,
		childItem;
	if (treeLevel === undefined) {
		treeLevel = this._treeLevels[level] = new primitives.orgdiagram.TreeLevel(level);
	}

	treeLevel.treeItems.push(treeItem.id);
	treeItem.level = level;
	treeItem.levelPosition = treeLevel.treeItems.length - 1;

	itemConfig = treeItem.itemConfig;
	if (itemConfig !== null) {

		template = this._templates[itemConfig.templateName];
		treeItem.template = (template !== undefined) ? template : this._defaultTemplate;

		if (itemConfig === this.options.cursorItem) {
			this._cursorTreeItem = treeItem;
			this._cursorTreeItem.isCursor = true;
		}

		if (itemConfig === this.options.highlightItem) {
			this._highlightTreeItem = treeItem;
		}

		if (primitives.common.indexOf(this.options.selectedItems, itemConfig) >= 0) {
			this._selectedTreeItems.push(treeItem);
		}

		treeItem.hasSelectorCheckbox = this._getSelectionVisibility(treeItem.isCursor, itemConfig.hasSelectorCheckbox, this.options.hasSelectorCheckbox);
		treeItem.hasButtons = (this.options.buttons.length > 0) && this._getSelectionVisibility(treeItem.isCursor, itemConfig.hasButtons, this.options.hasButtons);
	}

	for (index = 0, len = treeItem.visualChildren.length; index < len; index += 1) {
		childItem = treeItem.visualChildren[index];
		
		if (index === 0) {
			this._updateLeftMargins(childItem, 0);
		}
		if (index === len - 1) {
			this._updateRightMargins(childItem, 0);
		}

		this._readVisualTree(childItem, level + 1);
	}
};

primitives.orgdiagram.Controller.prototype._updateLeftMargins = function (treeItem, level) {
	var parentItem = treeItem,
		leftMargins;
	while ((parentItem = this._getParentItem(parentItem)) !== null) {
		leftMargins = this._leftMargins[parentItem.id];
		if (leftMargins === undefined) {
			leftMargins = this._leftMargins[parentItem.id] = [];
		}

		if (leftMargins[level] === undefined) {
			leftMargins[level] = treeItem.id;
		}
		level += 1;
	}
};

primitives.orgdiagram.Controller.prototype._updateRightMargins = function (treeItem, level) {
	var parentItem = treeItem,
		rightMargins;
	while ((parentItem = this._getParentItem(parentItem)) !== null) {
		rightMargins = this._rightMargins[parentItem.id];
		if (rightMargins === undefined) {
			rightMargins = this._rightMargins[parentItem.id] = [];
		}

		rightMargins[level] = treeItem.id;
		level += 1;
	}
};

primitives.orgdiagram.Controller.prototype._showSelectedItems = function () {
	var index,
		treeItem,
		selectionPathTreeItem;
	for (index = 0; index < this._selectedTreeItems.length; index += 1) {
		treeItem = this._selectedTreeItems[index];
		treeItem.isSelected = true;

		if (treeItem.visibility === 0/*primitives.orgdiagram.Visibility.Auto*/) {
			treeItem.visibility = 1/*primitives.orgdiagram.Visibility.Normal*/;
		}

		switch (this.options.selectionPathMode) {
			case 0/*primitives.orgdiagram.SelectionPathMode.None*/:
				break;
			case 1/*primitives.orgdiagram.SelectionPathMode.FullStack*/:
				selectionPathTreeItem = treeItem;
				while (selectionPathTreeItem !== undefined) {
					if (selectionPathTreeItem.visibility === 0/*primitives.orgdiagram.Visibility.Auto*/) {
						selectionPathTreeItem.visibility = 1/*primitives.orgdiagram.Visibility.Normal*/;
					}
					selectionPathTreeItem = this._treeItems[selectionPathTreeItem.logicalParentId];
				}
				break;
		}
	}
};

primitives.orgdiagram.Controller.prototype._showCursorNeigbours = function () {
	var index,
		treeItem;
	if (this._cursorTreeItem !== null) {
		for (index = 0; index < this._cursorTreeItem.logicalChildren.length; index += 1) {
			treeItem = this._cursorTreeItem.logicalChildren[index];
			if (treeItem.visibility === 0/*primitives.orgdiagram.Visibility.Auto*/) {
				treeItem.visibility = 1/*primitives.orgdiagram.Visibility.Normal*/;
			}
		}
		treeItem = this._cursorTreeItem;
		while (treeItem !== undefined) {
			if (treeItem.visibility === 0/*primitives.orgdiagram.Visibility.Auto*/) {
				treeItem.visibility = 1/*primitives.orgdiagram.Visibility.Normal*/;
			}
			treeItem = this._treeItems[treeItem.logicalParentId];
		}
	}
};

primitives.orgdiagram.Controller.prototype._getSelectionVisibility = function (isCursor, itemState, widgetState) {
	var result = false;
	switch (itemState) {
		case 0/*primitives.common.Enabled.Auto*/:
			switch (widgetState) {
				case 0/*primitives.common.Enabled.Auto*/:
					result = isCursor;
					break;
				case 1/*primitives.common.Enabled.True*/:
					result = true;
					break;
				case 2/*primitives.common.Enabled.False*/:
					result = false;
					break;
			}
			break;
		case 1/*primitives.common.Enabled.True*/:
			result = true;
			break;
		case 2/*primitives.common.Enabled.False*/:
			result = false;
			break;
	}
	return result;
};
primitives.orgdiagram.LevelVisibility = function (level, currentvisibility) {
	this.level = level;
	this.currentvisibility = currentvisibility;
};
primitives.orgdiagram.Template = function (templateConfig) {
	this.widgetEventPrefix = "orgdiagram";

	this.templateConfig = templateConfig;

	this.name = templateConfig.name;

	this.itemSize = templateConfig.itemSize;
	this.itemBorderWidth = templateConfig.itemBorderWidth;

	this.minimizedItemSize = templateConfig.minimizedItemSize;

	this.highlightPadding = templateConfig.highlightPadding;
	this.highlightBorderWidth = templateConfig.highlightBorderWidth;

	this.cursorPadding = templateConfig.cursorPadding;
	this.cursorBorderWidth = templateConfig.cursorBorderWidth;

	this.itemTemplate = templateConfig.itemTemplate;
	this.highlightTemplate = templateConfig.highlightTemplate;
	this.cursorTemplate = templateConfig.cursorTemplate;


	this.itemTemplateHashCode = null;
	this.itemTemplateRenderName = "onItemRender";

	this.highlightTemplateHashCode = null;
	this.highlightTemplateRenderName = "onHighlightRender";

	this.cursorTemplateHashCode = null;
	this.cursorTemplateRenderName = "onCursorRender";

	this.boxModel = jQuery.support.boxModel;
};


primitives.orgdiagram.Template.prototype.createDefaultTemplates = function (options) {

	if (primitives.common.isNullOrEmpty(this.itemTemplate)) {
		this.itemTemplate = this._getDefaultItemTemplate(options);
		this.itemTemplateRenderName = "onDefaultTemplateRender";
	}
	this.itemTemplateHashCode = primitives.common.hashCode(this.itemTemplate);

	if (primitives.common.isNullOrEmpty(this.cursorTemplate)) {
		this.cursorTemplate = this._getDefaultCursorTemplate(options);
		this.cursorTemplateRenderName = null;
	}
	this.cursorTemplateHashCode = primitives.common.hashCode(this.cursorTemplate);

	if (primitives.common.isNullOrEmpty(this.highlightTemplate)) {
		this.highlightTemplate = this._getDefaultHighlightTemplate();
		this.highlightTemplateRenderName = null;
	}
	this.highlightTemplateHashCode = primitives.common.hashCode(this.highlightTemplate);
};

primitives.orgdiagram.Template.prototype._getDefaultItemTemplate = function () {
	var contentSize = new primitives.common.Size(this.itemSize),
		itemTemplate,
		titleBackground,
		title,
		photoborder,
		photo,
		description;
	contentSize.width -= (this.boxModel ? this.itemBorderWidth * 2 : 0);
	contentSize.height -= (this.boxModel ? this.itemBorderWidth * 2 : 0);

	itemTemplate = jQuery('<div></div>')
        .css({
			"border-width": this.itemBorderWidth + "px"
        }).addClass("bp-item bp-corner-all bt-item-frame");

	titleBackground = jQuery('<div name="titleBackground"></div>')
		.css({
			top: "2px",
			left: "2px",
			width: (contentSize.width - 4) + "px",
			height: "18px"
        }).addClass("bp-item bp-corner-all bp-title-frame");

	itemTemplate.append(titleBackground);

	title = jQuery('<div name="title"></div>')
		.css({
			top: "1px",
			left: "4px",
			width: (contentSize.width - 4 - 4 * 2) + "px",
			height: "16px"
		}).addClass("bp-item bp-title");

	titleBackground.append(title);

	photoborder = jQuery("<div></div>")
		.css({
			top: "24px",
			left: "2px",
			width: "50px",
			height: "60px"
		}).addClass("bp-item bp-photo-frame");

	itemTemplate.append(photoborder);

	photo = jQuery('<img name="photo" alt=""></img>')
		.css({
			width: "50px",
			height: "60px"
		});
	photoborder.append(photo);

	description = jQuery('<div name="description"></div>')
	.css({
		top: "24px",
		left: "56px",
		width: (contentSize.width - 4 - 56) + "px",
		height: "74px"
	}).addClass("bp-item bp-description");

	itemTemplate.append(description);

	return itemTemplate.wrap('<div>').parent().html();
};

primitives.orgdiagram.Template.prototype._getDefaultCursorTemplate = function (options) {
	var cursorTemplate = jQuery("<div></div>")
	.css({
		width: (this.itemSize.width + this.cursorPadding.left + this.cursorPadding.right) + "px",
		height: (this.itemSize.height + this.cursorPadding.top + this.cursorPadding.bottom) + "px",
		"border-width": this.cursorBorderWidth + "px"
	}).addClass("bp-item bp-corner-all bp-cursor-frame");

	return cursorTemplate.wrap('<div>').parent().html();
};

primitives.orgdiagram.Template.prototype._getDefaultHighlightTemplate = function () {
	var highlightTemplate = jQuery("<div></div>")
	.css({
		"border-width": this.highlightBorderWidth + "px"
	}).addClass("bp-item bp-corner-all bp-highlight-frame");

	return highlightTemplate.wrap('<div>').parent().html();
};
primitives.orgdiagram.TreeItem = function (id) {
	this.id = id;
	this.itemConfig = null;

	this.logicalParentId = null;
	this.visualParentId = null;

	this.visualChildren = [];
	this.logicalChildren = [];

	this.visualAggregatorId = null;

	this.visibility = 1/*primitives.orgdiagram.Visibility.Normal*/;

	this.template = null;

	this.level = null;
	this.levelPosition = null;
	this.offset = 0;
	this.padding = 0;

	this.actualVisibility = 1/*primitives.orgdiagram.Visibility.Normal*/;
	this.actualSize = null;
	this.actualPosition = null;
	this.contentPosition = null;

	this.isCursor = false;
	this.isSelected = false;

	this.hasSelectorCheckbox = false;
	this.hasButtons = false;
	this.hasGroupTitle = false;

	this.actualItemType = null;
	this.connectorPlacement = 1/*primitives.common.PlacementType.Top*/;
};

primitives.orgdiagram.TreeItem.prototype.setActualSize = function (treeLevel, options) {
	var common = primitives.common;
	this.actualVisibility = (this.visibility === 0/*primitives.orgdiagram.Visibility.Auto*/) ? treeLevel.currentvisibility : this.visibility;

	switch (this.actualVisibility) {
		case 1/*primitives.orgdiagram.Visibility.Normal*/:
			this.actualSize = new common.Size(this.template.itemSize);
			this.contentPosition = new common.Rect(0, 0, this.actualSize.width, this.actualSize.height);
			if (this.isCursor) {
				this.actualSize.height += this.template.cursorPadding.top + this.template.cursorPadding.bottom;
				this.actualSize.width += this.template.cursorPadding.left + this.template.cursorPadding.right;
				this.contentPosition.x = this.template.cursorPadding.left;
				this.contentPosition.y = this.template.cursorPadding.top;
			}
			if (this.hasSelectorCheckbox) {
				this.actualSize.height += options.checkBoxPanelSize;
			}
			if (this.hasButtons) {
				this.actualSize.width += options.buttonsPanelSize;
			}
			this.hasGroupTitle = !common.isNullOrEmpty(this.itemConfig.groupTitle);
			if (this.hasGroupTitle) {
				this.actualSize.width += options.groupTitlePanelSize;
				this.contentPosition.x += options.groupTitlePanelSize;
			}
			break;
		case 2/*primitives.orgdiagram.Visibility.Dot*/:
			this.actualSize = new common.Size(this.template.minimizedItemSize);
			break;
		case 3/*primitives.orgdiagram.Visibility.Line*/:
		case 4/*primitives.orgdiagram.Visibility.Invisible*/:
			this.actualSize = new common.Size();
			break;
	}

	switch (options.orientationType) {
		case primitives.orgdiagram.OrientationType.Left:
		case primitives.orgdiagram.OrientationType.Right:
			this.actualSize.invert();
			break;
	}
};

primitives.orgdiagram.TreeItem.prototype.setActualPosition = function (treeLevel, options) {
	var itemShift = 0;
	switch (options.verticalAlignment) {
		case 0/*primitives.common.VerticalAlignmentType.Top*/:
			itemShift = 0;
			break;
		case 1/*primitives.common.VerticalAlignmentType.Middle*/:
			itemShift = (treeLevel.depth - this.actualSize.height) / 2.0;
			break;
		case 2/*primitives.common.VerticalAlignmentType.Bottom*/:
			itemShift = treeLevel.depth - this.actualSize.height;
			break;
	}

	this.actualPosition = new primitives.common.Rect(this.offset, treeLevel.shift + itemShift, this.actualSize.width, this.actualSize.height);

	switch (options.orientationType) {
		case primitives.orgdiagram.OrientationType.Left:
		case primitives.orgdiagram.OrientationType.Right:
			this.actualSize.invert();
			break;
	}
};

primitives.orgdiagram.TreeItem.prototype.toString = function () {
	return this.id;
};
primitives.orgdiagram.TreeLevel = function (level) {
	this.level = level;
	this.currentvisibility = 1/*primitives.orgdiagram.Visibility.Normal*/;
	this.actualVisibility = 1/*primitives.orgdiagram.Visibility.Normal*/;

	this.shift = 0.0;
	this.depth = 0.0;
	this.currentOffset = 0.0;

	this.topConnectorShift = 0.0;
	this.connectorShift = 0.0;

	this.treeItems = [];
};

primitives.orgdiagram.TreeLevel.prototype.toString = function () {
	return this.level + "." + this.currentvisibility;
};
/*
 * jQuery UI Diagram
 *
 * Basic Primitives organization diagram.
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function ($) {
    $.widget("ui.orgDiagram", new primitives.orgdiagram.Controller());
}(jQuery));

