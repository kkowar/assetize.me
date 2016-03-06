/**
 * StyleController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  generate: function(req,res) {
    // console.log(req.query)
  	var type = req.query.type;
    var field = req.query.field ? req.query.field : undefined;
    var buckets = req.query.buckets ? req.query.buckets : undefined;
    var classification = req.query.classification ? req.query.classification : undefined;
    var fcID = req.query.fcID;
  	var layerID = req.query.layerID;
    console.log([type,field,buckets,classification,fcID,layerID]);
    FeatureCollection.findOne({"id": fcID}).done(function(err,foundFC) {
      if (err) return res.json({error: err});
      if (!foundFC) return res.json({foundFC: foundFC});
      Layer.findOne({"id": layerID}).done(function(err,foundLayer){
        if (err) return res.json({error: err});
        if (!foundLayer) return res.json({foundLayer: foundLayer});
        var geometryType = foundFC.geometryType;
        if (type === "Simple") {
          foundLayer.styles.type = "simple";
          foundLayer.save(function(err){
            if (err) return console.log(err);
            if (!foundLayer) return;
            console.log("Render Geometery Simple: " + geometryType);
            if (geometryType === "Point" ) {res.view('map/_point_simple_form', {layer: foundLayer, layout: null})};
            if (geometryType === "Polygon" ) {res.view('map/_polygon_simple_form', {layer: foundLayer, layout: null})};
            if (geometryType === "LineString" || geometryType === "MultiLineString") {res.view('map/_line_simple_form', {layer: foundLayer, layout: null})};
          });
        };
        if (type === "Category") {
          Feature.find({"fcID": fcID}).done(function(err,foundFeatures){
            if (err) return res.json({error: err});
            if (!foundFeatures) return res.json({foundFeatures: foundFeatures});
            foundLayer.styles.type = "category";
            var categoryExists = (foundLayer.styles.category === undefined) ? false : true;
            var fieldHeaders = _.map(foundFC.properties,function(property){return property.name});
            if (!categoryExists && !field) {field = fieldHeaders[0]};         
            if (categoryExists && !field) {field = foundLayer.styles.category.field};       
            var fieldValues = _.map(foundFeatures,function(feature){return feature.properties[field]});
            var fieldValuesCountBy = _.countBy(fieldValues, function(fV){return fV;});
            var sortable = [];
            for (var fV in fieldValuesCountBy) {
              sortable.push([fV, fieldValuesCountBy[fV]])
              sortable.sort(function(a, b) {return a[1] - b[1]})
            }
            var fieldValuesSortedCount = sortable.reverse();
            fieldValuesSortedCount = fieldValuesSortedCount.slice(0,11);
            fieldValuesOthersCount = foundFeatures.length - _.reduce(fieldValuesSortedCount,function(memo,fV){return memo + fV[1]},0);
            var uniqFieldValues = _.map(fieldValuesSortedCount,function(fV){return fV[0]});
            var stroke = !categoryExists ? undefined : foundLayer.styles.category.stroke;
            var fill = !categoryExists ? undefined : foundLayer.styles.category.fill;
            var radius = !categoryExists ? undefined : foundLayer.styles.category.radius;
            if (!categoryExists || (foundLayer.styles.category.field !== field)) {
              var newStyle = {
                type: "category",
                geometryType: foundFC.geometryType,
                field: field,
                fieldHeaders: fieldHeaders,
                fieldValues: uniqFieldValues,
                fieldValuesCount: fieldValuesSortedCount,
                fieldValuesOthersCount: fieldValuesOthersCount,
                fieldOthersFill: "#999999",
                stroke: stroke,
                fill: fill,
                radius: radius
              };
              foundLayer.styles.category = generateLayerStyle(newStyle);
            };
            foundLayer.save(function(err){
              if (err) return console.log(err);
              if (!foundLayer) return;
              console.log("Render Geometery Category: " + geometryType);
              if (geometryType === "Point") {res.view('map/_point_category_form', {layer: foundLayer, layout: null})};
              if (geometryType === "Polygon") {res.view('map/_polygon_category_form', {layer: foundLayer, layout: null})};
              if (geometryType === "LineString" || geometryType === "MultiLineString") {res.view('map/_line_category_form', {layer: foundLayer, layout: null})};
            });
          });
        };
        if (type === "Choropleth") {
          Feature.find({"fcID": fcID}).done(function(err,foundFeatures){
            if (err) return res.json({error: err});
            if (!foundFeatures) return res.json({foundFeatures: foundFeatures});
            foundLayer.styles.type = "choropleth";
            var categoryExists = (foundLayer.styles.choropleth === undefined) ? false : true;
            var fieldHeaders = _.map(_.filter(foundFC.properties,function(property){return property.type === "Number"}),function(property){return property.name});
            console.log(field);
            if (!categoryExists && !field) {field = fieldHeaders[0]};         
            if (categoryExists && !field) {field = foundLayer.styles.choropleth.field};       
            var fieldValues = _.map(foundFeatures,function(feature){return feature.properties[field]});
            var fieldValuesCountBy = _.countBy(fieldValues, function(fV){return fV;});
            var sortable = [];
            for (var fV in fieldValuesCountBy) {
              sortable.push([fV, fieldValuesCountBy[fV]])
              sortable.sort(function(a, b) {return a[1] - b[1]})
            }
            var fieldValuesSortedCount = sortable.reverse();
            var uniqFieldValues = _.map(fieldValuesSortedCount,function(fV){return fV[0]});

            var lStyle = foundLayer.styles.choropleth
            var stroke = !categoryExists ? undefined : foundLayer.styles.choropleth.stroke;
            var fill = !categoryExists ? undefined : foundLayer.styles.choropleth.fill;
            var radius = !categoryExists ? undefined : foundLayer.styles.choropleth.radius;
            if (lStyle === undefined) {
              if (buckets === undefined) {buckets = 5;};
              if (classification === undefined) {classification = "Quantiles"};
            } else {
              if (buckets === undefined) {buckets = lStyle.bucketCount;};
              if (classification === undefined) {classification = lStyle.classification;};
            };
            // var truthy = !categoryExists || (foundLayer.styles.choropleth.field !== field) || (foundLayer.styles.choropleth.bucketCount !== buckets) || (foundLayer.styles.choropleth.classification !== classification)
            // console.log("truthy: " + truthy);
            // if (truthy) {
              console.log("Creating New Style");
              console.log([classification,buckets])
              var newStyle = {
                type: "choropleth",
                geometryType: foundFC.geometryType,
                field: field,
                fieldHeaders: fieldHeaders,
                classification: classification,
                bucketCount: buckets,
                fieldValues: fieldValues,
                fieldValuesCount: fieldValuesSortedCount,
                stroke: stroke,
                fill: fill,
                radius: radius
              };
              foundLayer.styles.choropleth = generateLayerStyle(newStyle);
            // };
            foundLayer.save(function(err,savedLayer){
              if (err) return console.log(err);
              if (!savedLayer) return;
              console.log("Render Geometery Choropleth: " + geometryType);
              // console.log(savedLayer);
              if (geometryType === "Point") {res.view('map/_point_choropleth_form', {layer: savedLayer, layout: null})};
              if (geometryType === "Polygon") {res.view('map/_polygon_choropleth_form', {layer: savedLayer, layout: null})};
              if (geometryType === "LineString" || geometryType === "MultiLineString") {res.view('map/_line_choropleth_form', {layer: savedLayer, layout: null})};
            });
          });
        };
        // res.json({message: "You shouldn't see this."});
      });
    })
	},

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to StyleController)
   */
  _config: {}

  
};

// Old Meteor Filtering Code

// var fcID = $('#assetFeatureCollectionID').val();
// var field = $('#assetFilterFieldSelect').val();
// var e2 = $("#assetFilterValueSelect");
// var properties = _.uniq(colFeatures.find({"fcID": fcID}).map(function (feature) {return feature["properties"][field]}));
// properties = properties.sort();
// var html = _.reduce(properties,function (fragment,property) {return fragment + ("<option>" + property + "</option>")},"");
// e2.html(html);

