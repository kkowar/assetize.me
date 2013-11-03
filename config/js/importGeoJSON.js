importGeoJSON = function (name,fileName) {
  var fs = require('fs');
  var geoJSON = fs.readFileSync(fileName,'utf8');
  // Parse JSON File
  var fc = JSON.parse(geoJSON);
  // var timeStamp = new Date().getTime();
  // console.log(fc.type);
  // console.log(fc.features.length);
  // console.log(fc.features[1]);
  // fc.features = fc.features.slice(0,200);
  createFeatureCollection(name,fc);
};

createFeatureCollection = function (name,fc) {
  var fcProperties = [];
  _.each(fc.features[0].properties,function(value,key){
    fcProperties.push({"name": key, "type": ""});
  });
  try{
    var geometryType = fc.features[0].geometry.type;
  } catch(err) {
    var geometryType = undefined;
  };
  var newFC = {name: name, 
               properties: fcProperties, 
               geometryType: geometryType, 
               totalFeatures: fc.features.length
              };
  FeatureCollection.create(newFC).done(function (err,feature_collection) {
    if (err) return console.log(err);
    feature_collection.save(function(err, feature_collection) {
      if (err) return console.log(err);
      var fcID = feature_collection.id;
      _.each(fc.features,function (feature,index) {
        createFeature(feature,fcID,index);
      });
    });
  });
};

createFeature = function (feature,fcID,index) {
  // var fID = (feature.id === undefined) ? "" : feature.id;
  var f = {
    fcID: fcID,
    fID: index,
    type: "Feature",
    properties: feature.properties,
    geometry: feature.geometry
  };
  Feature.create(f).done(function (err,createdFeature) {
    if (err) return console.log(err);
    createdFeature.save(function (err,savedFeature) {
      if (err) return console.log(err);
    });
  });
};