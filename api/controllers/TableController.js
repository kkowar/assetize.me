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
    FeatureCollection.findOne({"id": id}).limit(1).exec(function(err,foundFC){
      if (err) return next(err);
      if (!foundFC) {
        res.view({layerTableHeaders: [], layerTableRows: [], fcID: "", currentView: req.url});
        return;
      };
      var fcID = foundFC.id;
      // todo: filter
      // , "properties.TypeAbbr": "PVC"
      Feature.find({"fcID": fcID}).limit(50).exec(function(err,arrF){
        if (err) return next(err);
        if (!arrF) return next();
        var th = _.map(arrF[0].properties,function(value,key){return key;});
        var thTypes = _.map(foundFC.properties,function(prop){return prop.type;});
        // console.log(foundFC);
        // console.log(thTypes);
        th.unshift("fID");
        res.view({layerTableHeaders: th, thTypes: thTypes, layerTableRows: arrF, fcID: fcID, currentView: req.url});
      });
    });
  },

  destroy: function(req,res) {

  },

  destroy: function(req,res) {
    console.log("destroy")
    var action = req.query.action;
    var value = req.query.value;
    var fcID = req.query.fcID;
    // console.log([action,value,fcID]);

    if (action === "column") {

      // fID is added on the client and we need to
      // account for this when accessing the properties
      // array of the FeatureColleciton.
      var propIndex = value - 1;

      FeatureCollection.findOne({"id": fcID}).exec(function(err,foundFC){
        if (err) return console.log(err);
        if (!foundFC) return console.log(foundFC);
        var property = foundFC.properties[propIndex]
        foundFC.properties.splice(propIndex,1);
        foundFC.save(function(err) {
          if (err) return console.log(err);
          if (!foundFC) return console.log(foundFC);
          Feature.find({"fcID": fcID}).exec(function(err,foundFeatures) {
            if (err) return console.log(err);
            if (foundFeatures.length === 0) return console.log(foundFeatures);
            _.each(foundFeatures,function(feature) {
              feature.properties = _.omit(feature.properties,property.name);
              feature.xml = createFeatureXML(feature);
              feature.save(function(err) {
                if (err) return console.log(err);
                if (!feature) return console.log(feature);
              });
            });
            return res.json({message: "Column " + property.name + " deleted."});
          });
        });
      });
    };
  },

  update: function(req,res) {
    var action = req.body.action;
    var fieldIndex = req.body.fieldIndex;
    var newFieldName = req.body.newFieldName;
    var fcID = req.body.fcID;
    console.log([action,fieldIndex,newFieldName,fcID]);
    // fID is added on the client and we need to
    // account for this when accessing the properties
    // array of the FeatureColleciton.
    var propIndex = fieldIndex - 1;
    FeatureCollection.findOne({"id": fcID}).exec(function(err,foundFC){
      var property = foundFC.properties[propIndex];
      var fieldName = property.name;
      var fieldType = property.type;
      foundFC.properties[propIndex] = {name: newFieldName, type: fieldType};
      foundFC.save(function(err) {
        Feature.find({"fcID": fcID}).exec(function(err,foundFeatures) {
          _.each(foundFeatures,function(feature) {
            feature.properties = _.pairs(feature.properties);
            feature.properties[propIndex][0] = newFieldName;
            feature.properties = _.object(feature.properties);
            feature.save(function(err) {
              if (err) return console.log(err);
              if (!feature) return console.log(feature);
            });
          });
          return res.json({message: "Column " + fieldName + " renamed to " + newFieldName});
        });
      });
    });
  },

  // BROKEN!!
  // search: function(req,res) {
  //   console.log(req.params);
  //   console.log(req.body);
  //   console.log(req.query);
  //   var jade = require('jade');
  //   var fcID = req.query.fcID;
  //   var query = req.query.query;
  //   var fieldName = req.query.filterFieldName;
  //   var selector = JSON.parse('{"properties.' + fieldName + '": "'+ query + '"}');
  //   console.log(selector);
  //   Feature.find().where({"fcID": fcID}).where(selector).exec(function(err,foundFeatures){
  //     console.log(_.first(foundFeatures).properties);
  //     var filteredFeatures = _.filter(foundFeatures,function(feature) {return feature.properties[fieldName].indexOf(query) !== -1});
  //     jade.renderFile(__dirname + '/../../views/table/_table_rows.jade',{layerTableRows: filteredFeatures}, function (err, html) {
  //       if (err) throw err;
  //       res.json({html: html})
  //     });
  //   });
  // },

  filter: function(req,res) {
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);
    var jade = require('jade');
    var fcID = req.query.fcID;
    var fieldIndex = req.query.filterFieldIndex;
    var fieldName = req.query.filterFieldName;
    var fieldValue = req.query.filterFieldValue;
    var selector = JSON.parse('{"properties.' + fieldName + '": "'+ fieldValue + '"}');
    console.log(selector);
    Feature.find().where({"fcID": fcID}).where(selector).exec(function(err,foundFeatures){
      if (err) return next(err);
      // if (err) return res.json({message: "err", err: err, });
      if (foundFeatures.length === 0) return res.json({message: "success", html: "<tr><td class='success'>No Results Found</td></tr>"});
      // console.log(_.first(foundFeatures).properties);
      jade.renderFile(__dirname + '/../../views/table/_table_rows.jade',{layerTableRows: foundFeatures}, function (err, html) {
        if (err) throw err;
        res.json({html: html})
      });
    });
  },

  stats: function(req,res) {
    Feature.find().where({"fcID": "528452c49940909288001993"}).where({"properties.User_Type": "COMI"}).exec(function(err,features){
      res.view({features: JSON.stringify(features)});
    });
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to TableController)
   */
  _config: {}


};
