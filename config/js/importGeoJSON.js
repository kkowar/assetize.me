importGeoJSON = function (name,fileName) {
  var fs = require('fs');
  fs = require('fs')
  fs.readFile(fileName, 'utf8', function (err,data) {
    if (err) {return console.log(err);};
    var fc = JSON.parse(data);
    createFeatureCollection(name,fc);
  });  
};

createFeatureCollection = function (name,fc) {
  var jade = require('jade');
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
  FeatureCollection.create(newFC).done(function (err,createdFC) {
    if (err) return console.log(err);
    createdFC.save(function(err, savedFC) {
      if (err) return console.log(err);
      jade.renderFile(__dirname + '/../../views/featurecollection/_fc_row.jade',{fc: savedFC}, function (err, html) {
        if (err) throw err;
        console.log("renderFile");
        console.log(html);
        FeatureCollection.publishCreate({id: savedFC.id, featureCollection: savedFC, html: html});
      });
      var fcID = savedFC.id;
      _.each(fc.features,function (feature,index) {
        createFeature(feature,fcID,index);
      });
    });
  });
};

createFeature = function (feature,fcID,index) {
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