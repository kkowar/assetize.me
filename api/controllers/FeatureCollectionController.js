/**
 * FeatureCollectionController
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

	index: function(req,res) {
    FeatureCollection.find().exec(function(err,arrFC){
      if (err) return next(err);
      if (!arrFC) return next();
      console.log(req.options.controller);
      res.view({featureCollections: arrFC, currentView: req.url});
    });
  },

  upload: function(req,res) {
    var file = req.files.files[0];
    var fileExt = _.last(file.name.split("."));
    var fileName = _.first(file.name.split("."));
    if (fileExt === "geojson") {
      importGeoJSON(fileName,file.path);
    } else if (fileExt === "csv") {
      importCSV2JSON(fileName,file.path);
    };
  },

	destroy: function(req,res) {
		var fcID = req.params.id;
		FeatureCollection.destroy({"id": fcID}).exec(function(err,arrFC){
			if (err) return next(err);
			if (!arrFC) return next();

      FeatureCollection.publishDestroy(fcID);

			Feature.destroy({"fcID": fcID}).exec(function(err,arrF){
				if (err) return next(err);
				if (!arrF) return next();

				Layer.destroy({"fcID": fcID}).exec(function(err,arrL){
					if (err) return next(err);
					if (!arrL) return next();
				});

			});

		});
	},

  subscribe: function(req,res) {
    FeatureCollection.subscribe(req.socket);
    FeatureCollection.find().exec(function(err,foundUsers){
      if (err) {return next(err)};
      if (!foundUsers) return next();
      FeatureCollection.subscribe(req.socket,foundUsers);
      res.send({message: "Subscribed to FeatureCollection"});      
    });
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to Feature_classController)
   */
  _config: {}
  
};
