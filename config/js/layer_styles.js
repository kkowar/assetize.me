var ss = require('./simple_statistics');
console.log(ss);

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

	if (type === "choropleth") {
		var stroke = _.isEmpty(styleGuidelines.stroke) ? { color: "#999999", opacity: 1.0, weight: 2.0} : styleGuidelines.stroke;
		var fill = _.isEmpty(styleGuidelines.fill) ? {opacity: 0.8} : styleGuidelines.fill;
		var radius = _.isEmpty(styleGuidelines.radius) ? 3.0 : styleGuidelines.radius;
		var breaks = calcClassification(styleGuidelines.classification,styleGuidelines.fieldValues,styleGuidelines.bucketCount);
		console.log(styleGuidelines.classification);
		console.log("Breaks: " + breaks);
		attributes = {
			field: styleGuidelines.field,
			// fieldValues: styleGuidelines.fieldValues,
			// fieldValuesCount: styleGuidelines.fieldValuesCount,
			fieldHeaders: styleGuidelines.fieldHeaders,
			classification: styleGuidelines.classification,
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
	
  if (type === "choropleth") {
    var stroke = _.isEmpty(styleGuidelines.stroke) ? { color: "#000000", opacity: 1.0, weight: 1.0} : styleGuidelines.stroke;
    var fill = _.isEmpty(styleGuidelines.fill) ? {opacity: 0.5} : styleGuidelines.fill;
    var breaks = calcClassification(styleGuidelines.classification,styleGuidelines.fieldValues,styleGuidelines.bucketCount);
    console.log(styleGuidelines.classification);
    console.log("Breaks: " + breaks);
    attributes = {
      field: styleGuidelines.field,
      // fieldValues: styleGuidelines.fieldValues,
      // fieldValuesCount: styleGuidelines.fieldValuesCount,
      fieldHeaders: styleGuidelines.fieldHeaders,
      classification: styleGuidelines.classification,
      bucketCount: styleGuidelines.bucketCount,
      fieldBreaks: breaks,
      // fieldValuesOthersCount: styleGuidelines.fieldValuesOthersCount,
      // fieldOthersFill: styleGuidelines.fieldOthersFill,
      fill: fill,
      stroke: stroke,
      fieldFillColor: getCategoryFillColors(styleGuidelines.fieldValues.length),
      operation: undefined,
      label: undefined
    };
  };

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
		var breaks = calcClassification(styleGuidelines.classification,styleGuidelines.fieldValues,styleGuidelines.bucketCount);
		console.log(styleGuidelines.classification);
		console.log("Breaks: " + breaks);
		attributes = {
			field: styleGuidelines.field,
			// fieldValues: styleGuidelines.fieldValues,
			// fieldValuesCount: styleGuidelines.fieldValuesCount,
			fieldHeaders: styleGuidelines.fieldHeaders,
			classification: styleGuidelines.classification,
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
};

var getCategoryFillColors = function(numCategories) { 
	var defaultColors = ['#A6CEE3','#1F78B4','#B2DF8A','#33A02C','#FB9A99','#E31A1C',
                       '#FDBF6F','#FF7F00','#CAB2D6','#6A3D9A','#ffffff','#000000'];
  // var defaultOthers = '#666666';
  return defaultColors.slice(0,numCategories);
};

var calcClassification = function(classification,fieldValues,bucketCount) {
	breaks = undefined;
	if (classification === "Equal Intervals") breaks = calcEqualIntervals(fieldValues,bucketCount);
	if (classification === "Quantiles") breaks = calcQuantiles(fieldValues,bucketCount);
	if (classification === "Standard Deviation") breaks = calcStandardDeviation(fieldValues,bucketCount);
	if (classification === "Maximum Breaks") breaks = calcMaximumBreaks(fieldValues,bucketCount);
	if (classification === "Jenks") breaks = calcJenks(fieldValues,bucketCount);
	if (classification === "Heads/Tails") breaks = calcHeadsTails(fieldValues,bucketCount);
	console.log(classification);
	console.log(breaks);
	return breaks;
};

var calcEqualIntervals = function(values,numBreaks) {
	values = _.map(values,function(value){return parseFloat(value)});
	values = _.compact(values);
	values = values.sort(function(a,b){return a - b});
  var compactedValues = _.compact(values);
  var min = _.min(compactedValues);
  var max = _.max(compactedValues);
  var range = max - min;
  var n = numBreaks ? numBreaks : 5;
  if (range === 0) {n = 1};
  var breaks = [min];
  for (var i = 0; i < n - 1; i++) {
    breaks.push(parseFloat(breaks[i]) + parseFloat(range/n));
  }
  breaks.push(max);
  return breaks;
};

var calcQuantiles = function(values,numBreaks) {
	values = _.map(values,function(value){return parseFloat(value)});
	values = _.compact(values);
  values = values.sort(function(a,b){return a - b});
  var min = _.min(values);
  var max = _.max(values);
  var n = numBreaks ? numBreaks : 5;
  n = _.min([n,_.uniq(values).length]);
  var breaks = _.map(values,function(value,i){return values[Math.ceil(i * (values.length)/n)]});
  breaks.unshift(min);
  breaks.push(max);
  breaks = _.compact(breaks);
  breaks = _.uniq(breaks);
  return breaks;
};

var calcStandardDeviation = function(values,numBreaks) {
	values = _.map(values,function(value){return parseFloat(value)});
	values = _.compact(values);
  var mean = ss.mean(values);
  console.log(mean);
  var stdev = ss.standard_deviation(values);
  console.log(stdev);
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
	values = _.map(values,function(value){return parseFloat(value)});
	values = _.compact(values);
  values = values.sort(function(a,b){return a - b});
  var n = numBreaks ? numBreaks : 5;
  var valLength = values.length;
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
    breaks.push(diffArray[i]["midpoint"]);
  };
  breaks = breaks.sort(function(a,b){return a - b});
  var min = _.min(values);
  var max = _.max(values);
  breaks.unshift(min);
  breaks.push(max);
  return breaks;
};

var calcHeadsTails = function(values,numBreaks){
	values = _.map(values,function(value){return parseFloat(value)});
	values = _.compact(values);
  var uniq = _.uniq(values);
  if (uniq.length === 1) { return uniq[0]; };
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

var calcJenks = function(values,numBreaks) {
	values = _.map(values,function(value){return parseFloat(value)});
	values = _.compact(values);
  var uniq = _.uniq(values);
  if (uniq.length === 1) { return uniq[0]; };
  var n = numBreaks ? numBreaks : 5;
  var breaks = jenks_sample(values,n);
  breaks = _.compact(breaks);
  breaks = _.uniq(breaks);
  return breaks;
};

var jenks_sample = function(values, numBreaks, maxSize) {
	var n = (numBreaks === undefined) ? 5 : numBreaks;
	console.log("n: " + n);
	maxSize = (maxSize === undefined) ? 1000 : maxSize;
	console.log("maxSize: " + maxSize);
	var valLength = values.length;
  if (valLength > maxSize) {
  	// var max = _.max();
  	// var min = 
    var size = _.min([maxSize, _.max([maxSize,(valLength * 0.10)])]);
    console.log("size: " + size);
    var sample = [_.min(values), _.max(values)];
    console.log("sample: " + sample);
    for (var i = 0; i < (size - 2); i++) {
      // var value = random.randint(0, (values.length - 1));
      sample.push(values[getRandom(0,(valLength - 1))]);
      // console.log(sample);
    };
  } else {
    var sample = values;
  }
  // console.log(sample);
  // console.log("Sample Length: " + sample.length);
  return jenks(sample, n);
  // return [0,100];
};

var getRandom = function(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

// # [Jenks natural breaks optimization](http://en.wikipedia.org/wiki/Jenks_natural_breaks_optimization)
//
// Implementations: [1](http://danieljlewis.org/files/2010/06/Jenks.pdf) (python),
// [2](https://github.com/vvoovv/djeo-jenks/blob/master/main.js) (buggy),
// [3](https://github.com/simogeo/geostats/blob/master/lib/geostats.js#L407) (works)
function jenks(data, n_classes) {
 
    // Compute the matrices required for Jenks breaks. These matrices
    // can be used for any classing of data with `classes <= n_classes`
    function getMatrices(data, n_classes) {
 
        // in the original implementation, these matrices are referred to
        // as `LC` and `OP`
        //
        // * lower_class_limits (LC): optimal lower class limits
        // * variance_combinations (OP): optimal variance combinations for all classes
        var lower_class_limits = [],
            variance_combinations = [],
            // loop counters
            i, j,
            // the variance, as computed at each step in the calculation
            variance = 0;
 
        // Initialize and fill each matrix with zeroes
        for (i = 0; i < data.length + 1; i++) {
            var tmp1 = [], tmp2 = [];
            for (j = 0; j < n_classes + 1; j++) {
                tmp1.push(0);
                tmp2.push(0);
            }
            lower_class_limits.push(tmp1);
            variance_combinations.push(tmp2);
        }
 
        for (i = 1; i < n_classes + 1; i++) {
            lower_class_limits[1][i] = 1;
            variance_combinations[1][i] = 0;
            // in the original implementation, 9999999 is used but
            // since Javascript has `Infinity`, we use that.
            for (j = 2; j < data.length + 1; j++) {
                variance_combinations[j][i] = Infinity;
            }
        }
 
        for (var l = 2; l < data.length + 1; l++) {
 
            // `SZ` originally. this is the sum of the values seen thus
            // far when calculating variance.
            var sum = 0,
                // `ZSQ` originally. the sum of squares of values seen
                // thus far
                sum_squares = 0,
                // `WT` originally. This is the number of
                w = 0,
                // `IV` originally
                i4 = 0;
 
            // in several instances, you could say `Math.pow(x, 2)`
            // instead of `x * x`, but this is slower in some browsers
            // introduces an unnecessary concept.
            for (var m = 1; m < l + 1; m++) {
 
                // `III` originally
                var lower_class_limit = l - m + 1,
                    val = data[lower_class_limit - 1];
 
                // here we're estimating variance for each potential classing
                // of the data, for each potential number of classes. `w`
                // is the number of data points considered so far.
                w++;
 
                // increase the current sum and sum-of-squares
                sum += val;
                sum_squares += val * val;
 
                // the variance at this point in the sequence is the difference
                // between the sum of squares and the total x 2, over the number
                // of samples.
                variance = sum_squares - (sum * sum) / w;
 
                i4 = lower_class_limit - 1;
 
                if (i4 !== 0) {
                    for (j = 2; j < n_classes + 1; j++) {
                        // if adding this element to an existing class
                        // will increase its variance beyond the limit, break
                        // the class at this point, setting the lower_class_limit
                        // at this point.
                        if (variance_combinations[l][j] >=
                            (variance + variance_combinations[i4][j - 1])) {
                            lower_class_limits[l][j] = lower_class_limit;
                            variance_combinations[l][j] = variance +
                                variance_combinations[i4][j - 1];
                        }
                    }
                }
            }
 
            lower_class_limits[l][1] = 1;
            variance_combinations[l][1] = variance;
        }
 
        // return the two matrices. for just providing breaks, only
        // `lower_class_limits` is needed, but variances can be useful to
        // evaluage goodness of fit.
        return {
            lower_class_limits: lower_class_limits,
            variance_combinations: variance_combinations
        };
    }
 
 
 
    // the second part of the jenks recipe: take the calculated matrices
    // and derive an array of n breaks.
    function breaks(data, lower_class_limits, n_classes) {
 
        var k = data.length - 1,
            kclass = [],
            countNum = n_classes;
 
        // the calculation of classes will never include the upper and
        // lower bounds, so we need to explicitly set them
        kclass[n_classes] = data[data.length - 1];
        kclass[0] = data[0];
 
        // the lower_class_limits matrix is used as indexes into itself
        // here: the `k` variable is reused in each iteration.
        while (countNum > 1) {
            kclass[countNum - 1] = data[lower_class_limits[k][countNum] - 2];
            k = lower_class_limits[k][countNum] - 1;
            countNum--;
        }
 
        return kclass;
    }
 
    if (n_classes > data.length) return null;
 
    // sort data in numerical order, since this is expected
    // by the matrices function
    data = data.slice().sort(function (a, b) { return a - b; });
 
    // get our basic matrices
    var matrices = getMatrices(data, n_classes),
        // we only need lower class limits here
        lower_class_limits = matrices.lower_class_limits;
 
    // extract n_classes out of the computed matrices
    return breaks(data, lower_class_limits, n_classes);
 
};








