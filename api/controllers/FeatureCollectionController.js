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
    FeatureCollection.find().done(function(err,arrFC){
      if (err) return next(err);
      if (!arrFC) return next();
      // var fc = arrFC[0];
      // var fcID = fc.id;
      res.view({featureCollections: arrFC, currentView: req.url});
    });
  },

  create: function(req,res) {
    var file = req.files.files[0];
    // console.log(req.files);
    // console.log(file);
    // console.log(file.name);
    // console.log(file.path);
    var fileExt = _.last(file.name.split("."));
    var fileName = _.first(file.name.split("."));
    // todo: create callbacks on the import function to return the featureclass object.
    if (fileExt === "geojson") {
      importGeoJSON(fileName,file.path);
    } else if (fileExt === "csv") {
      importCSV2JSON(fileName,file.path);
    };
    res.json({message: "success"});
    // todo: handle a way to update the page.
    // res.redirect("/layer");
  },

	destroy: function(req,res) {
		var fcID = req.params.id;
		console.log(fcID);
		FeatureCollection.destroy({"id": fcID}).done(function(err,arrFC){
			if (err) return next(err);
			if (!arrFC) return next();
			Feature.destroy({"fcID": fcID}).done(function(err,arrF){
				if (err) return next(err);
				if (!arrF) return next();
				Layer.destroy({"fcID": fcID}).done(function(err,arrL){
					if (err) return next(err);
					if (!arrL) return next();
					res.json({message: "success"});
				});
			});
		});
	},

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to Feature_classController)
   */
  _config: {}
  
};
