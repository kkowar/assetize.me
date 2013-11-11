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

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to TableController)
   */
  _config: {}

  
};
