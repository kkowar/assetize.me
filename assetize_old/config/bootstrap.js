/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.bootstrap = function (cb) {

  // It's very important to trigger this callack method when you are finished 
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  // FeatureCollection.find().limit(1).done(function (err,colFC) {
  //   if (err) return console.log(err);
  //   if (colFC.length === 0) {
  //     // todo: make this work again.
  //     var path = require('path');   
  //     var base = path.resolve('.');
  //     var dirFiles = base + "/config/private/geojson/";
  //     // console.log("Base Path: " + base);
  //     // fs.readdir(dirFiles,function(err,list){console.log(list)});
  //     var geoJSON = fs.readFileSync(path.join(dirFiles, fileName),'utf8');
  //     importGeoJSON("Sanitary Pipes","louisville_sanitary_sewer_pipes.geojson");
  //     importGeoJSON("Sanitary Manholes","louisville_sanitary_sewer_mh.geojson");
  //   };
  // });
  
  cb();
};