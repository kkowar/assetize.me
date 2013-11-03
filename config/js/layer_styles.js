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
	attributes = undefined;
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

	// Chloropleth

	// Bubble
	return attributes
}

stylePolygon = function (styleGuidelines) {
	var type = styleGuidelines.type;
	attributes = undefined;
	if (type === "simple") {
		attributes = {
			fill: { color: "#0000FF", opacity: 0.2},
			stroke: { color: "#0000FF", opacity: 1.0, weight: 1.0},
			operation: undefined,
			label: undefined
		};
	};
	// Category
	if (type === "category") {
		attributes = {
			field: styleGuidelines.field,
			fieldValues: styleGuidelines.fieldValues,
			fieldHeaders: styleGuidelines.fieldHeaders,
			fill: {opacity: 0.2},
			stroke: { color: "#0000FF", opacity: 1.0, weight: 1.0},
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
	attributes = undefined;
	if (type === "simple") {
		attributes = {
			stroke: { color: "#0000FF", opacity: 1.0, weight: 1.0},
			operation: undefined,
			label: undefined
		};
	};
	// Category

	// Chloropleth

	// Bubble
	return attributes
}

getCategoryFillColors = function(numCategories) { 
	var defaultColors = ['#A6CEE3','#1F78B4','#B2DF8A','#33A02C','#FB9A99','#E31A1C',
                       '#FDBF6F','#FF7F00','#CAB2D6','#6A3D9A','#ffffff','#000000'];
  var defaultOthers = '#666666';
  return defaultColors.slice(0,numCategories);
};