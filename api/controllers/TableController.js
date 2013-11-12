/**
 * TableController
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
    
  show: function(req,res) {
    var id = req.params.id;
    FeatureCollection.findOne({"id": id}).limit(1).done(function(err,foundFC){
      if (err) return next(err);
      if (!foundFC) {
        res.view({layerTableHeaders: [], layerTableRows: [], fcID: "", currentView: req.url});
        return;
      };
      var fcID = foundFC.id;
      // todo: filter
      // , "properties.TypeAbbr": "PVC"
      Feature.find({"fcID": fcID}).limit(50).done(function(err,arrF){
        if (err) return next(err);
        if (!arrF) return next();
        var th = _.map(arrF[0].properties,function(value,key){return key;});
        th.unshift("fID");
        res.view({layerTableHeaders: th, layerTableRows: arrF, fcID: fcID, currentView: req.url});
      });
    });
  },

  destroy: function(req,res) {
    // console.log(req);
    // console.log("TableController: delete");
    // console.log(req.param["action"]);
    var action = req.query.action;
    var value = req.query.value;
    var fcID = req.query.fcID;
    console.log([action,value,fcID]);

    if (action === "column") {

      // fID is added on the client and we need to
      // account for this when accessing the properties
      // array of the FeatureColleciton.
      var propIndex = value - 1;

      FeatureCollection.findOne({"id": fcID}).done(function(err,foundFC){
        if (err) return console.log(err);
        if (!foundFC) return console.log(foundFC);
        console.log("Found FC");
        var property = foundFC.properties[propIndex]
        console.log(property);
        console.log(foundFC.properties);
        foundFC.properties.splice(propIndex,1);
        console.log(foundFC.properties);
        foundFC.save(function(err,savedFC) {
          if (err) return console.log(err);
          if (!savedFC) return console.log(savedFC);
          console.log("Saved FC");
          console.log(savedFC);
          Feature.find({"fcID": fcID}).done(function(err,foundFeatures) {
            if (err) return console.log(err);
            if (foundFeatures.length === 0) return console.log(foundFeatures);
            console.log("Found Features");
            // foundFeatures = foundFeatures.slice(0,1);
            var counter = 0;
            _.each(foundFeatures,function(feature) {
              // console.log(feature.properties);
              feature.properties = _.omit(feature.properties,property.name);
              // console.log(feature.properties);
              feature.save(function(err,savedFeature) {
                if (err) return console.log(err);
                if (!savedFeature) return console.log(savedFeature);
                if (counter === 0) {
                  console.log(savedFeature);
                  counter = 1;
                };
              });
            });
            return res.json({message: "Column " + property.name + " deleted."});
          });
        });
      });
    };
    // res.json({message: "No action taken."});
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to TableController)
   */
  _config: {}

  
};
