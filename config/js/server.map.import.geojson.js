importGeoJSON = function (name,fileName) {
  var fs = require('fs');
  fs = require('fs')
  fs.readFile(fileName, 'utf8', function (err,data) {
    if (err) {return console.log(err);};
    var fc = JSON.parse(data);
    console.log(fc);
    createFeatureCollection(name,fc);
  });  
};

createFeatureCollection = function (name,fc) {
  var jade = require('jade');

  // Get the attribute/property headers.
  var fcProperties = [];
  _.each(fc.features[0].properties,function(value,key){
    fcProperties.push({"name": key, "type": ""});
  });

  // Get the geometry type of the import file.
  try{
    var geometryType = fc.features[0].geometry.type;
  } catch(err) {
    var geometryType = undefined;
  };

  // Consolidate values for each column and then attempt
  // to determine the column type of string, number, date,
  // boolean
  var fieldValues = [];
  _.each(fcProperties,function(fcProperty,i){
    // console.log(i);
    // console.log(fcProperty.name);
    var property = fcProperty.name;
    var mapped = _.map(fc.features,function(feature){return feature.properties[property]});
    var compacted = _.compact(mapped);
    var uniqued = _.uniq(compacted);
    fieldValues[i] = uniqued;
  });
  // console.log(fieldValues);
  _.each(fieldValues,function(values,i){
    var propType = undefined;
    var filtered = undefined;
    propType = _.isEmpty(values) ? "String" : undefined;
    if (propType === undefined) {
      propType = _.isEmpty(_.filter(values,function(value) {return _.isFinite(value);})) ? undefined : "Number"
      if (propType === undefined) {
        propType = _.isEmpty(_.filter(values,function(value) {return value.match(/^-?[0-9]+$/);})) ? undefined : "Number"
      };
    };
    if (propType === undefined) {
      filtered = _.filter(values,function(value) {return !isNaN(Date.parse(value));})
      propType = _.isEmpty(filtered) ? undefined : "Date"
    };
    if (propType === undefined) {
      propType = _.isEmpty(_.filter(values,function(value) {return _.isBoolean(value);})) ? undefined : "Boolean"
    };
    if (propType === undefined) {
      propType = _.isEmpty(_.filter(values,function(value) {return _.isString(value);})) ? undefined : "String"
    };
    // console.log(fcProperties[i].name + ": " + propType);
    fcProperties[i].type = propType;
  });
  // console.log(fieldValues);

  // Setup new FeatureCollecton object.
  var newFC = {name: name, 
               properties: fcProperties, 
               geometryType: geometryType, 
               // todo: update length after dealing with multi type geometries.
               totalFeatures: fc.features.length
              };
  FeatureCollection.create(newFC).exec(function (err,createdFC) {
    if (err) return console.log(err);
    createdFC.save(function(err) {
      if (err) return console.log(err);
      jade.renderFile(__dirname + '/../../views/featurecollection/_fc_row.jade',{fc: createdFC}, function (err, html) {
        if (err) throw err;
        FeatureCollection.publishCreate({id: createdFC.id, featureCollection: createdFC, html: html});
      });
      var fcID = createdFC.id;
      _.each(fc.features,function (feature,index) {
        if (feature.geometry.type !== "MultiPolygon") {
          createFeature(feature,fcID,index);
        } else {
          parseMultiPolygon(feature,fcID,index);
        };
      });
      // console.log("skippedFeatures: " + skippedFeatures);
    });
  });
};

parseMultiPolygon = function (feature,fcID,index) {
  console.log("Coordinate Length");
  console.log(feature.geometry.coordinates.length);
  // console.log(feature.geometry.coordinates);
  _.each(feature.geometry.coordinates,function(aCoordinates,aIndex){
    // console.log(aCoordinates[0]);
    var inPolygon = false;
    _.each(feature.geometry.coordinates,function(bCoordinates,bIndex){
      if ((inPolygon === false) && (aIndex !== bIndex)) {
        _.each(aCoordinates[0],function(coordinate){
          inPolygon = pointInPolygon(coordinate,bCoordinates[0]);
        });
      };
    });
    console.log(inPolygon);
  });
};

pointInPolygon = function (point, vs) {
  // ray-casting algorithm based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
  
  var x = point[0], y = point[1];
  
  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0], yi = vs[i][1];
      var xj = vs[j][0], yj = vs[j][1];
      
      var intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }
  
  return inside;
};

createFeature = function (feature,fcID,index) {
  var f = {
    fcID: fcID,
    fID: index,
    type: "Feature",
    properties: feature.properties,
    geometry: feature.geometry,
    xml: createFeatureXML(feature)
  };
  Feature.create(f).exec(function (err,createdFeature) {
    if (err) return console.log(err);
    createdFeature.save(function (err) {
      if (err) return console.log(err);
    });
  });
};

createFeatureXML = function (feature) {
  var mapped_properties = _.map(feature.properties,function(value,key){
    try {
      var addQuotes = false;
      if (value === null) {
        value = _.isNull(value) ? "null" : value;
      };
      if (_.isString(value)) {
        value = value.replace(/\\/g,"\\\\"); 
        value = value.replace(/"/g,'\\"');
        if (!addQuotes) {
          addQuotes = value.match(",") ? true : false;
        };
      };
      value = addQuotes ? '"' + value + '"' : value;
      // value = '"' + value + '"';
      return value;
    } 
    catch (err) {
      console.log(err);
      return value;
    };    
  })
  // console.log(mapped_properties.join(","));
  var xml = mapped_properties.join(",") + ',"' + JSON.stringify(feature.geometry).replace(/"/g,'\\"') + '"\n';
  return xml;
}

