/**
 * LayerController
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

  join: function(req,res) {
    FeatureCollection.find().done(function(err,arrFC){
      if (err) return next(err);
      if (!arrFC) return next();
      res.view({arrFC: arrFC});
    });
  },

  merge: function(req,res) {
    var targetA = req.param("targetA");
    var targetB = req.param("targetB");
    var mergeTableName = req.param("mergeTableName");
    // , where: {"properties."}
    Feature.find({"fcID": targetA.fcID}).done(function(err,arrFa){
      if (err) return next(err);
      if (!arrFa) return next();
      var targetACount = arrFa.length;
      // var values = _.uniq(_.map(arrFa,function (fA) {return fA["properties"][targetA.propName]}));
      // var selector = '"properties.' + targetA.propName + '": $in: ' + JSON.stringify(values);
      // console.log(selector);
      Feature.find({"fcID": targetB.fcID}).done(function(err,arrFb){
        if (err) return next(err);
        if (!arrFb) return next();
        var targetBCount = arrFb.length;
        var newFC = { "type": "FeatureCollection",
                       "features": []
                     };
        _.each(arrFa,function(fA){
          var foundFbs = _.filter(arrFb,function(fB){return fA["properties"][targetA.propName] === fB["properties"][targetB.propName]});
          _.each(foundFbs,function(foundFb){
            var newGeometry = (_.isEmpty(fA.geometry)) ? foundFb.geometry : fA.geometry;
            var newProperties = {}
            var mergeNamesIntersect = _.intersection(targetA.mergeNames,targetB.mergeNames);
            _.each(targetA.mergeNames,function(mName){
              if (_.contains(mergeNamesIntersect,mName)) {
                newProperties[mName + "1"] = fA["properties"][mName];
              } else {
                newProperties[mName] = fA["properties"][mName];
              };
            });
            _.each(targetB.mergeNames,function(mName){
              if (_.contains(mergeNamesIntersect,mName)) {
                newProperties[mName + "2"] = foundFb["properties"][mName];
              } else {
                newProperties[mName] = foundFb["properties"][mName];
              };
            });
            newFC.features.push({ "type": "Feature",
                             "geometry": newGeometry,
                             "properties": newProperties
                           });
          })
        })
        if (newFC.features.length > 0){
          createFeatureCollection(mergeTableName,newFC);
        };
        // var joins = _.filter(arrFb, function(f){ return _.contains(values,f["properties"][targetB.propName]);});
        res.json({targetACount: targetACount, targetBCount: targetBCount, joins: newFC.features.length, newRecords: newFC.features[0]});
      });
    });
  },

  // todo
  // Model.find({
  //    where: {
  //     or: [
  //      {name: {contains: req.param('sometext')}},
  //      {description: {contains: req.param('sometext')}}
  //     ]
  //    }, limit: 15, skip: 0, sort: 'name ASC'
  //   }, callback)

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to LayerController)
   */
  _config: {}

  
};
