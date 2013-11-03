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
  	var type = req.param("type");
  	var layerID = req.param("layerID");
  	var fcID = req.param("fcID");
    var field = req.param("field") ? req.param("field") : "FLD_ZONE";
    FeatureCollection.findOne({"id": fcID}).done(function(err,foundFC) {
      if (err) return res.json({error: err});
      if (!foundFC) return res.json({foundFC: foundFC});
      Layer.findOne({"id": layerID}).done(function(err,foundLayer){
        if (err) return res.json({error: err});
        if (!foundLayer) return res.json({foundLayer: foundLayer});
        if (type === "Simple") {
          foundLayer.styles.type = "simple";
          foundLayer.save(function(err,savedLayer){
            if (err) return console.log(err);
            if (!savedLayer) return;
            res.view('map/_polygon_simple_form', {layer: foundLayer, layout: null});
          });
        };
        if (type === "Category") {
          Feature.find({"fcID": fcID}).done(function(err,foundFeatures){
            if (err) return res.json({error: err});
            if (!foundFeatures) return res.json({foundFeatures: foundFeatures});
            var fieldHeaders = _.map(foundFC.properties,function(property){return property.name});
            var fieldValues = _.uniq(_.map(foundFeatures,function(feature){return feature.properties[field]}));
            foundLayer.styles.type = "category";
            console.log(foundLayer.styles.category);
            if ((foundLayer.styles.category === undefined) || (foundLayer.styles.category.field !== field)) {
              var newStyle = {
                type: "category",
                geometryType: foundFC.geometryType,
                field: field,
                fieldHeaders: fieldHeaders,
                fieldValues: fieldValues
              };
              foundLayer.styles.category = generateLayerStyle(newStyle);
            };
            foundLayer.save(function(err,savedLayer){
              if (err) return console.log(err);
              if (!savedLayer) return;
              res.view('map/_polygon_category_form', {layer: savedLayer,layout: null});
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

// var fcID = $('#assetFeatureCollectionID').val();
// var field = $('#assetFilterFieldSelect').val();
// var e2 = $("#assetFilterValueSelect");
// var properties = _.uniq(colFeatures.find({"fcID": fcID}).map(function (feature) {return feature["properties"][field]}));
// properties = properties.sort();
// var html = _.reduce(properties,function (fragment,property) {return fragment + ("<option>" + property + "</option>")},"");
// e2.html(html);




