importCSV2JSON = function (name,fileName) {
  var fs = require('fs');
  var csv = require('csv');
  var fc = { "type": "FeatureCollection",
             "features": []
           };
  csv().from.path(fileName, { delimiter: ',', escape: '"' })
    .to.array( function(data){
      var header = data.shift();
      var records = data;
      _.each(records,function(record){
        var jsonProperties = _.object(header, record);
        fc.features.push({ "type": "Feature",
                           "geometry": {},
                           "properties": jsonProperties
                         });
      });
      console.log(fc.features.length);
      createFeatureCollection(name,fc);
    });
};