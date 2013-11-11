generateLayerStyle = function (styleGuidelines) {
	var geometryType = styleGuidelines.geometryType;
	var style = undefined;
	if (geometryType === "Point") { style = stylePoint(styleGuidelines); };
	if (geometryType === "Polygon") { style = stylePolygon(styleGuidelines); };
	if (geometryType === "LineString") { style = styleLine(styleGuidelines); };
	if (geometryType === "MultiLineString") { style = styleLine(styleGuidelines); };
	return style;
};

stylePoint = function (styleGuidelines) {
	var type = styleGuidelines.type;
	var attributes = undefined;
	if (type === "simple") {
		attributes = {
			radius: 3.0,
			fill: { color: "#0000FF", opacity: 0.2},
			stroke: { color: "#0000FF", opacity: 1.0, weight: 1.0},
			operation: undefined,
			label: undefined
		};
	};
	// Category
	if (type === "category") {
		var stroke = _.isEmpty(styleGuidelines.stroke) ? { color: "#999999", opacity: 1.0, weight: 2.0} : styleGuidelines.stroke;
		var fill = _.isEmpty(styleGuidelines.fill) ? {opacity: 0.8} : styleGuidelines.fill;
		var radius = _.isEmpty(styleGuidelines.radius) ? 3.0 : styleGuidelines.radius;
		attributes = {
			field: styleGuidelines.field,
			fieldValues: styleGuidelines.fieldValues,
			fieldValuesCount: styleGuidelines.fieldValuesCount,
			fieldHeaders: styleGuidelines.fieldHeaders,
			fieldValuesOthersCount: styleGuidelines.fieldValuesOthersCount,
			fieldOthersFill: styleGuidelines.fieldOthersFill,
			radius: radius,
			fill: fill,
			stroke: stroke,
			fieldFillColor: getCategoryFillColors(styleGuidelines.fieldValues.length),
			operation: undefined,
			label: undefined
		};
	};

	// Chloropleth

	// Bubble
	return attributes
}

stylePolygon = function (styleGuidelines) {
	var type = styleGuidelines.type;
	var attributes = undefined;
	if (type === "simple") {
		attributes = {
			fill: { color: "#0000FF", opacity: 0.5},
			stroke: { color: "#000000", opacity: 1.0, weight: 1.0},
			operation: undefined,
			label: undefined
		};
	};
	// Category
	if (type === "category") {
		var stroke = _.isEmpty(styleGuidelines.stroke) ? { color: "#000000", opacity: 1.0, weight: 1.0} : styleGuidelines.stroke;
		var fill = _.isEmpty(styleGuidelines.fill) ? {opacity: 0.5} : styleGuidelines.fill;
		attributes = {
			field: styleGuidelines.field,
			fieldValues: styleGuidelines.fieldValues,
			fieldValuesCount: styleGuidelines.fieldValuesCount,
			fieldHeaders: styleGuidelines.fieldHeaders,
			fieldValuesOthersCount: styleGuidelines.fieldValuesOthersCount,
			fieldOthersFill: styleGuidelines.fieldOthersFill,
			fill: fill,
			stroke: stroke,
			fieldFillColor: getCategoryFillColors(styleGuidelines.fieldValues.length),
			operation: undefined,
			label: undefined
		};
	};
	// Chloropleth

	// Bubble
	return attributes
}

styleLine = function (styleGuidelines) {
	var type = styleGuidelines.type;
	var attributes = undefined;
	if (type === "simple") {
		attributes = {
			stroke: { color: "#0000FF", opacity: 1.0, weight: 3.0},
			operation: undefined,
			label: undefined
		};
	};
	// Category
	if (type === "category") {
		var stroke = _.isEmpty(styleGuidelines.stroke) ? {opacity: 1.0, weight: 3.0} : styleGuidelines.stroke;
		attributes = {
			field: styleGuidelines.field,
			fieldValues: styleGuidelines.fieldValues,
			fieldValuesCount: styleGuidelines.fieldValuesCount,
			fieldHeaders: styleGuidelines.fieldHeaders,
			fieldValuesOthersCount: styleGuidelines.fieldValuesOthersCount,
			fieldOthersFill: styleGuidelines.fieldOthersFill,
			stroke: stroke,
			fieldFillColor: getCategoryFillColors(styleGuidelines.fieldValues.length),
			operation: undefined,
			label: undefined
		};
	};

	// Chloropleth

	// Bubble
	return attributes
}

getCategoryFillColors = function(numCategories) { 
	var defaultColors = ['#A6CEE3','#1F78B4','#B2DF8A','#33A02C','#FB9A99','#E31A1C',
                       '#FDBF6F','#FF7F00','#CAB2D6','#6A3D9A','#ffffff','#000000'];
  // var defaultOthers = '#666666';
  return defaultColors.slice(0,numCategories);
};