generateLayerStyle = function (styleGuidelines) {
	var geometryType = styleGuidelines.geometryType;
	var style = undefined;
	if (geometryType === "Point") { style = stylePoint(styleGuidelines); };
	if (geometryType === "Polygon") { style = stylePolygon(styleGuidelines); };
	if (geometryType === "LineString") { style = styleLine(styleGuidelines); };
	if (geometryType === "MultiLineString") { style = styleLine(styleGuidelines); };
	return style;
};

var stylePoint = function (styleGuidelines) {
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
	if (type === "choropleth") {
		var stroke = _.isEmpty(styleGuidelines.stroke) ? { color: "#999999", opacity: 1.0, weight: 2.0} : styleGuidelines.stroke;
		var fill = _.isEmpty(styleGuidelines.fill) ? {opacity: 0.8} : styleGuidelines.fill;
		var radius = _.isEmpty(styleGuidelines.radius) ? 3.0 : styleGuidelines.radius;
		var breaks = undefined;
		if (styleGuidelines.classification = "Quantiles") {breaks = calcQuantiles(styleGuidelines.fieldValues,styleGuidelines.bucketCount)};
		attributes = {
			field: styleGuidelines.field,
			// fieldValues: styleGuidelines.fieldValues,
			// fieldValuesCount: styleGuidelines.fieldValuesCount,
			fieldHeaders: styleGuidelines.fieldHeaders,
			bucketCount: styleGuidelines.bucketCount,
			fieldBreaks: breaks,
			radius: radius,
			fill: fill,
			stroke: stroke,
			fieldFillColor: getCategoryFillColors(styleGuidelines.bucketCount),
			operation: undefined,
			label: undefined
		};
	};

	// Bubble
	return attributes
}

var stylePolygon = function (styleGuidelines) {
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

var styleLine = function (styleGuidelines) {
	var type = styleGuidelines.type;
	var attributes = undefined;
	if (type === "simple") {
		attributes = {
			stroke: { color: "#0000FF", opacity: 1.0, weight: 3.0},
			operation: undefined,
			label: undefined
		};
	};

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

	if (type === "choropleth") {
		var stroke = _.isEmpty(styleGuidelines.stroke) ? {opacity: 1.0, weight: 3.0} : styleGuidelines.stroke;
		var breaks = undefined;
		if (styleGuidelines.classification = "Quantiles") {breaks = calcStandardDeviation(styleGuidelines.fieldValues,styleGuidelines.bucketCount)};
		console.log("Field Values");
		console.log(_.uniq(styleGuidelines.fieldValues));
		console.log("Quantile Field Breaks");
		console.log(breaks);
		attributes = {
			field: styleGuidelines.field,
			// fieldValues: styleGuidelines.fieldValues,
			// fieldValuesCount: styleGuidelines.fieldValuesCount,
			fieldHeaders: styleGuidelines.fieldHeaders,
			bucketCount: styleGuidelines.bucketCount,
			fieldBreaks: breaks,
			stroke: stroke,
			fieldFillColor: getCategoryFillColors(styleGuidelines.bucketCount),
			operation: undefined,
			label: undefined
		};
	};


	// Bubble
	return attributes
}

var getCategoryFillColors = function(numCategories) { 
	var defaultColors = ['#A6CEE3','#1F78B4','#B2DF8A','#33A02C','#FB9A99','#E31A1C',
                       '#FDBF6F','#FF7F00','#CAB2D6','#6A3D9A','#ffffff','#000000'];
  // var defaultOthers = '#666666';
  return defaultColors.slice(0,numCategories);
};

var calcEqualIntervals = function(values,numBreaks) {
  var min = _.min(values);
  var max = _.max(values);
  var range = max - min;
  var n = numBreaks ? numBreaks : 5;
  if (range === 0) {n = 1};
  var breaks = [min];
  for (var i = 0; i < n - 1; i++) {
    breaks.push(breaks[i] + range/n);
  }
  breaks.push(max);
  //- breaks = _.map(breaks,function(brake){return Math.floor(brake)});
  return breaks;
};

var calcQuantiles = function(values,numBreaks) {
  values = values.sort(function(a,b){return a - b});
  var min = _.min(values);
  var max = _.max(values);
  var n = numBreaks ? numBreaks : 5;
  n = _.min([n,_.uniq(values).length]);
  var breaks = _.map(values,function(value,i){return values[Math.ceil(i * (values.length)/n)]});
  breaks = _.compact(breaks);
  breaks.unshift(min);
  breaks.push(max);
  breaks = _.uniq(breaks);
  return breaks;
};

var calcStandardDeviation = function(values,numBreaks) {
  var mean = ss.mean(values);
  // console.log(mean);
  var stdev = ss.standard_deviation(values);
  // console.log(stdev);
  var n = numBreaks ? numBreaks : 5;
  // console.log(n);
  var breaks = [_.min(values)];
  if (n % 2 != 0) {n = n - 1};
  for (var i = 0; i < n; i++){ 
    //- breaks.push(Math.round(mean - stdev * ((n / 2 - i) - 0.5)));
    breaks.push(mean - stdev * ((n / 2 - i) - 0.5));
  };
  breaks.push(_.max(values));
  breaks = _.filter(breaks,function(valBreak){return valBreak > 0})
  return breaks;
};

var calcMaximumBreaks = function(values,numBreaks) {
  //- values = values.sort(function(a,b){return a - b});
  var n = numBreaks ? numBreaks : 5;
  var valLength = _.uniq(values).length;
  n = _.min([n,valLength]);
  var diffArray = [];
  for (var i = 0; i < valLength - 1; i++) {
    var diff = values[i+1] - values[i];
    var midpoint = diff/2 + values[i];
    diffArray.push({index: i, midpoint: midpoint, diff: diff}); 
  };
  diffArray = _.sortBy(diffArray,"diff").reverse();
  var breaks = [];
  for (var i = 0; i < n - 1; i++) {
    //- breaks.push(Math.floor(diffArray[i]["midpoint"]));
    breaks.push(diffArray[i]["midpoint"]);
  };
  breaks = breaks.sort();
  var min = _.min(values);
  var max = _.max(values);
  breaks.unshift(min);
  breaks.push(max);
  return breaks;
};

var calcJenks = function(values,numBreaks) {
  var n = numBreaks ? numBreaks : 5;
  return ss.jenks(values,5);
};

var calcHeadsTails = function(values,numBreaks){
  var valLength = values.length;
  var min = _.min(values);
  var max = _.max(values);
  var i = 2;
  var n = numBreaks ? numBreaks : 5;
  if (valLength === 0) {return undefined};
  if (valLength < n) {return [min,max]};
  var breaks = [min];
  for (var i = 0; i < n - 1; i++) {
    var mean = ss.mean(values);
    breaks.push(mean);
    values = _.filter(values,function(value){return value > mean;});
  };
  breaks.push(max);
  breaks = _.uniq(breaks);
  return breaks;
};