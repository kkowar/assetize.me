/**
 * MapController
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
    
  index: function(req, res) {
    FeatureCollection.find().done(function(err,arrFC){
      if (err) return next(err);
      if (!arrFC) return next();
      Layer.find().done(function(err,layers){
        if (err) return console.log(err);
        if (!layers) return console.log("No Layers Exist");
        var layerFCIDs = _.pluck(layers,"fcID");
        var arrFilteredFC = _.filter(arrFC,function(fc) {
          return !_.contains(layerFCIDs,fc.id);
        });
        var sortedLayers = _.sortBy(layers,"zIndex").reverse();
        var totalFeatures = 0;
        totalFeatures = _.reduce(sortedLayers,function(memo,layer){
          increment = 0;
          if (layer.visible.toString() === "true") {
            increment = layer.totalFeatures;
          };
          return (increment + memo);
        },0);
        var visibleLayers = 0;
        visibleLayers = _.reduce(sortedLayers,function(memo,layer){
          increment = 0;
          if (layer.visible.toString() === "true") {
            increment = 1;
          };
          return (increment + memo);
        },0);
        var totalMapLayers = totalFeatures + visibleLayers + 8;
        res.view({feature_collections: arrFilteredFC, layers: sortedLayers, totalMapLayers: totalMapLayers});
      });
    });
  },
  
  layer: function(req,res) {
    var fcID = req.param("fcID");
    FeatureCollection.findOne({"id": fcID}).limit(1).done(function(err,fc){
      if (err) return console.log(err);
      if (!fc) return;
      // todo: better error handling.
      Layer.find().done(function(err,layers){
        if (err) return next(err);
        var maxLayer = undefined;
        var maxZIndex = undefined;
        if (!layers || (layers.length === 0)) {
          // Do Nothing
          maxZIndex = 0;
        } else {
          var maxLayer = _.max(layers,function(layer){return layer.zIndex;});
          var maxZIndex = (maxLayer) ? (maxLayer.zIndex + 1): 1;
        };
        var newStyle = {
          type: "simple",
          geometryType: fc.geometryType,
          field: undefined,
          categories: undefined
        };
        var layer = {
          'userID': "", 
          'fcID': fcID,
          'name': fc.name,
          'styles': {simple: generateLayerStyle(newStyle), type: "simple"},
          'visible': "true",
          'geometryType': fc.geometryType,
          'totalFeatures': fc.totalFeatures,
          'zIndex': maxZIndex,
        };
        Layer.create(layer).done(function(err,createdLayer){
          if (err) return console.log(err);
          if (!createdLayer) return;
          createdLayer.save(function(err,savedLayer){
            if (err) return console.log(err);
            if (!createdLayer) return;
            // todo: better error handling.
            // todo: figure out the EJS on the server side.
            // var html = new EJS({url: 'cleaning.ejs'}).render(data);
            res.view('map/_layer', {layer: savedLayer, layout: null});
          });
        });
        
      });
    });
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to MapController)
   */
  _config: {}
  
};


        // style = {
        //   layerID: createLayer.id,
        //   type: 'simple',
        //   attributes: true
        // }

        // {
        //   'default': {
        //     'field': "",
        //     'operator': "", 
        //     'value': "", 
        //     'color': "#0000ff",
        //     'count': fc.totalFeatures,
        //     'visible': true
        //   }

