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
    FeatureCollection.find().exec(function(err,arrFC){
      if (err) return next(err);
      if (!arrFC) return next();
      Layer.find().exec(function(err,layers){
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
    FeatureCollection.findOne({"id": fcID}).limit(1).exec(function(err,fc){
      if (err) return console.log(err);
      if (!fc) return;
      // todo: better error handling.
      Layer.find().exec(function(err,layers){
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
        Layer.create(layer).exec(function(err,createdLayer){
          if (err) return console.log(err);
          if (!createdLayer) return;
          createdLayer.save(function(err){
            if (err) return console.log(err);
            if (!createdLayer) return;
            // todo: better error handling.
            console.log(createdLayer)
            res.view('map/_layer', {layer: createdLayer, layout: null});
          });
        });
        
      });
    });
  },

  tiles: function(req,res) {
    // console.log(req.url);
    // console.log(req.params);
    var grid_requested = req.url.match(".grid.json") ? true : false;
    var raster_requested = req.url.match(".png") ? true : false;
    var req_callback = req.query.callback;
    var layerID = req.params.layerID;
    var mapnik = require('mapnik');
    mapnik.register_default_fonts();
    mapnik.register_default_input_plugins();
    var proj4 = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over';
    var mercator = new mapnik.Projection(proj4);

    var TMS_SCHEME = false;
    var const_size = 256;
    var Bc = [];
    var Cc = [];
    var zc = [];
    var Ac = [];
    var DEG_TO_RAD = Math.PI / 180;
    var RAD_TO_DEG = 180 / Math.PI;
    var size = 256;
    var levels = 18;
    for (var d = 0; d < levels; d++) {
      Bc.push(const_size / 360);
      Cc.push(const_size / (2 * Math.PI));
      zc.push(const_size / 2);
      Ac.push(const_size);
      const_size *= 2;
    };
    // console.log(Bc);
    // console.log(Cc);
    // console.log(zc);
    // console.log(Ac);
    // console.log(const_size);
    var x = parseInt(req.params.x);
    var y = parseInt(req.params.y)
    var zoom = parseInt(req.params.z)
    if (TMS_SCHEME) {
      y = (Math.pow(2, zoom) - 1) - y;
    }
    var ll = [x * size, (y + 1) * size];
    // console.log("ll: ");
    // console.log(ll);
    var ur = [(x + 1) * size, y * size];
    // console.log("ur: ");
    // console.log(ur);

    var zoom_denom = zc[zoom];
    // console.log(zoom_denom);
    var g = (ll[1] - zoom_denom) / (-Cc[zoom]);
    // console.log(g);
    var lat = (ll[0] - zoom_denom) / Bc[zoom];
    // console.log(lat);
    var lon = RAD_TO_DEG * (2 * Math.atan(Math.exp(g)) - 0.5 * Math.PI);
    // console.log(lon);
    var bbox1 = [lat, lon];
    // console.log(bbox1);

    var zoom_denom = zc[zoom];
    // console.log(zoom_denom);
    var g = (ur[1] - zoom_denom) / (-Cc[zoom]);
    // console.log(g);
    var lat = (ur[0] - zoom_denom) / Bc[zoom];
    // console.log(lat);
    var lon = RAD_TO_DEG * (2 * Math.atan(Math.exp(g)) - 0.5 * Math.PI);
    // console.log(lon);
    var bbox2 = [lat, lon];
    // console.log(bbox2);

    var bbox = bbox1.concat(bbox2);
    // console.log(bbox);
    bbox = mercator.forward(bbox);
    // console.log(bbox);

    Layer.findOne().where({"id": layerID}).exec(function(err,layer){
      console.log(layer);
      var style_type = layer.styles.type;
      var style = layer.styles[style_type];
      var geometry_type = layer.geometryType;
      var fc_layer_name = layer.name;

      // var tileLat = tileY2lat(req.params.y,req.params.z);
      // var tileLon = tileX2lon(req.params.x,req.params.z);
      // console.log(tileLon,tileLat,req.params.z);
      // todo: convert backwards from lon,lat,zoom to higher zoom tile numbers.
      // var zoom_level = (req.params.z > 17) ? 17 : req.params.z;
      // todo: feature find bbox and map bbox;

      // var bbox = mercator.xyz_to_envelope(parseInt(req.params.x),parseInt(req.params.y),parseInt(req.params.z), false);

      // console.log("bbox info ######################################################");
      // console.log("req.params: ")
      // console.log(req.params);
      // var bbox = merc_translator.xyz_to_envelope(parseInt(req.params.x),parseInt(req.params.y),parseInt(req.params.z), false);
      // var bbox = tileToBBOX(parseInt(req.params.x),parseInt(req.params.y),parseInt(req.params.z));
      // console.log("Returned bbox: ");
      // console.log(bbox);

      var min = metersToLatLon(bbox[0],bbox[1]);
      var max = metersToLatLon(bbox[2],bbox[3]);
      var poly_bbox = [min[0],min[1],max[0],max[1]];
      var poly_coords = [[poly_bbox[1],poly_bbox[0]],[poly_bbox[1],poly_bbox[2]],[poly_bbox[3],poly_bbox[2]],[poly_bbox[3],poly_bbox[0]],[poly_bbox[1],poly_bbox[0]]];
      
      var null_exists = false;
      var field = style.field;
      var arrVisibleCategories = _.map(style.fieldVisibility,function(visible,index){
        if (visible.toString() === 'true') {
          var value = isFinite(style.fieldValues[index]) ? parseFloat(style.fieldValues[index]) : style.fieldValues[index].toString();
          if ((value.toString() === 'null') || (value.toString() === 'Null')) null_exists = true;
          return value;
        } else {
          return false;
        };
      }).filter(Boolean);
      console.log("Visibile Categories:");
      console.log(arrVisibleCategories);
      var arrNotVisibleCategories = _.map(style.fieldVisibility,function(visible,index){
        if (visible.toString() === 'true') {
          return false;
        } else {
          var value = isFinite(style.fieldValues[index]) ? parseFloat(style.fieldValues[index]) : style.fieldValues[index].toString();
          return value;
        };
      }).filter(Boolean);
      console.log("Not Visibile Categories:");
      console.log(arrNotVisibleCategories);
      // arrNotVisibleCategories[0] = arrNotVisibleCategories[0].toString();
      var queryField = 'properties.' + field;
      var query = {};
      query["$and"] = [];
      query["$and"].push({"fcID":layer.fcID});
      console.log("Others: " + style.fieldVisibilityOthers)
      if (style_type === "category") {
        if (style.fieldVisibilityOthers.toString() === 'true') {
          console.log("$nin: arrNotVisibleCategories");
          query["$and"].push({[queryField]: {"$nin": arrNotVisibleCategories}});
          if ((arrNotVisibleCategories.indexOf("Null") >= 0) || (arrNotVisibleCategories.indexOf("null") >= 0)){
            query["$and"].push({[queryField]: {"$ne": null}});
          };
        } else {
          if (null_exists === true) {
            arrVisibleCategories.push(null);
          };
          query["$and"].push({[queryField]: {"$in": arrVisibleCategories}});
        };
      };
      // { field: { $type: <BSON type number> | <String alias> } }
      query["geometry"] = {$geoIntersects:{$geometry:{type:"Polygon",coordinates: [ poly_coords ]}}}
      Feature.native(function (err,collection) {
        collection.find(query).toArray(function(err, features) {
          if (err) {
            console.log(err);
            // return res.json({err: err});
          };
          if (features == undefined) {
            features = [];
          };
          // todo: consider maximum-extent property
          // '-20037508.34, -20037508.34, 20037508.34, 20037508.34' by setting it as a property of the mapnik.Map object.
          var xml_map_start = '<Map srs="+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over" background-color="#00000000">';
          var xml_style = "";

          if (features.length !== 0) {
            // todo: handle headers with spaces;
            var headers = _.map(features[0].properties,function(value,key){return key;});

            var inline = headers.join(",") + ",geojson\n"
            _.each(features,function(feature){
              inline = inline + feature.xml;
            });

            xml_style = '<Style name="' + layerID + '" filter-mode="first">\n';

            if (style_type === "simple") {

              xml_style = xml_style + '<Rule>';
              
              if (geometry_type === "Point") {
                xml_style = xml_style + '<MarkersSymbolizer fill="' + style.fill.color + '" opacity="' + style.fill.opacity + '" width="' + (style.radius * 2) + '" height="' + (style.radius * 2) + '" stroke="' + style.stroke.color + '" stroke-width="' + style.stroke.weight + '" stroke-opacity="' + style.stroke.opacity + '" placement="point" marker-type="ellipse" allow-overlap="true"/>'
              };

              if (geometry_type === "LineString" || geometry_type === "Polygon") {
                xml_style = xml_style + '<LineSymbolizer stroke-linecap="round" stroke-linejoin="round" stroke-width="' + style.stroke.weight + '" stroke="' + style.stroke.color + '" stroke-opacity="' + style.stroke.opacity + '" />'
              };

              if (geometry_type === "Polygon") {
                xml_style = xml_style + '<PolygonSymbolizer fill="' + style.fill.color + '" fill-opacity="' + style.fill.opacity + '" />'
              };

              xml_style = xml_style + "</Rule>\n";

            };

            if (style_type === "category") {
              // Category Style Rules
              _.each(style.fieldValues,function(fieldValue,index){
                xml_style = xml_style + '<Rule>\n';

                if (fieldValue.length == 0) {
                  xml_style = xml_style + '<Filter>[' + style.field + '] = ""</Filter>';
                } else {
                  // console.log(fieldValue + " : " + isNaN(fieldValue));
                  if (isFinite(fieldValue)) {
                    xml_style = xml_style + '<Filter>[' + style.field + '] = ' + fieldValue + '</Filter>';
                  } else {
                    xml_style = xml_style + '<Filter>[' + style.field + '] = "' + fieldValue.replace(/"/g,'\\"') + '"</Filter>';
                  };
                };

                if (geometry_type === "Point") {
                  xml_style = xml_style + '<MarkersSymbolizer fill="' + style.fieldFillColor[index] + '" opacity="' + style.fill.opacity + '" width="' + (style.radius * 2) + '" height="' + (style.radius * 2) + '" stroke="' + style.stroke.color + '" stroke-width="' + style.stroke.weight + '" stroke-opacity="' + style.stroke.opacity + '" placement="point" marker-type="ellipse" allow-overlap="true"/>\n'
                };

                if (geometry_type === "LineString") {
                  xml_style = xml_style + '<LineSymbolizer stroke-linecap="round" stroke-linejoin="round" stroke-width="' + style.stroke.weight + '" stroke="' + style.fieldFillColor[index] + '" stroke-opacity="' + style.stroke.opacity + '" />'
                };

                if (geometry_type === "Polygon") {
                  xml_style = xml_style + '<LineSymbolizer stroke-linecap="round" stroke-linejoin="round" stroke-width="' + style.stroke.weight + '" stroke="' + style.stroke.color + '" stroke-opacity="' + style.stroke.opacity + '" />'
                  xml_style = xml_style + '<PolygonSymbolizer fill="' + style.fieldFillColor[index] + '" fill-opacity="' + style.fill.opacity + '" />'
                };

                xml_style = xml_style + "</Rule>\n";
              });
              // All Other Values Style Rule
              xml_style = xml_style + '<Rule>\n';
              xml_style = xml_style + '<ElseFilter/>\n';
              if (geometry_type === "Point") {
                xml_style = xml_style + '<MarkersSymbolizer fill="' + style.fieldOthersFill + '" opacity="' + style.fill.opacity + '" width="' + (style.radius * 2) + '" height="' + (style.radius * 2) + '" stroke="' + style.stroke.color + '" stroke-width="' + style.stroke.weight + '" stroke-opacity="' + style.stroke.opacity + '" placement="point" marker-type="ellipse" allow-overlap="true"/>\n'
              };
              if (geometry_type === "LineString") {
                xml_style = xml_style + '<LineSymbolizer stroke-linecap="round" stroke-linejoin="round" stroke-width="' + style.stroke.weight + '" stroke="' + style.fieldOthersFill + '" stroke-opacity="' + style.stroke.opacity + '" />'
              };

              if (geometry_type === "Polygon") {
                xml_style = xml_style + '<LineSymbolizer stroke-linecap="round" stroke-linejoin="round" stroke-width="' + style.stroke.weight + '" stroke="' + style.stroke.color + '" stroke-opacity="' + style.stroke.opacity + '" />'
                xml_style = xml_style + '<PolygonSymbolizer fill="' + style.fieldOthersFill + '" fill-opacity="' + style.fill.opacity + '" />'
              };
              xml_style = xml_style + "</Rule>\n";
            };

            if (style_type === "choropleth") {
              // Choropleth Style Rules
              _.each(style.fieldBreaks,function(fieldBreak,index){
                if (style.fieldBreaks[index + 1] !== undefined) {
                  xml_style = xml_style + '<Rule>\n';

                  // if (fieldValue.length == 0) {
                  //   xml_style = xml_style + '<Filter>[' + style.field + '] = ""</Filter>';
                  // } else {
                    xml_style = xml_style + '<Filter>[' + style.field + '] &lt; ' + style.fieldBreaks[index + 1] + '</Filter>';
                  // };

                  if (geometry_type === "Point") {
                    xml_style = xml_style + '<MarkersSymbolizer fill="' + style.fieldFillColor[index] + '" opacity="' + style.fill.opacity + '" width="' + (style.radius * 2) + '" height="' + (style.radius * 2) + '" stroke="' + style.stroke.color + '" stroke-width="' + style.stroke.weight + '" stroke-opacity="' + style.stroke.opacity + '" placement="point" marker-type="ellipse" allow-overlap="true"/>\n'
                  };

                  if (geometry_type === "LineString") {
                    xml_style = xml_style + '<LineSymbolizer stroke-linecap="round" stroke-linejoin="round" stroke-width="' + style.stroke.weight + '" stroke="' + style.fieldFillColor[index] + '" stroke-opacity="' + style.stroke.opacity + '" />'
                  };

                  if (geometry_type === "Polygon") {
                    xml_style = xml_style + '<LineSymbolizer stroke-linecap="round" stroke-linejoin="round" stroke-width="' + style.stroke.weight + '" stroke="' + style.stroke.color + '" stroke-opacity="' + style.stroke.opacity + '" />'
                    xml_style = xml_style + '<PolygonSymbolizer fill="' + style.fieldFillColor[index] + '" fill-opacity="' + style.fill.opacity + '" />'
                  };

                  // xml_style = xml_style + '<TextSymbolizer face-name="DejaVu Sans Book" size="14" fill="black" halo-fill= "white" halo-radius="2" placement="line" allow-overlap="false">[' + style.field + ']</TextSymbolizer>'
                  xml_style = xml_style + "</Rule>\n";
                };
              });
            };

            xml_style = xml_style + '</Style>\n';

            // console.log(xml_style);

          } else {
            var headers = [];
          };

          var xml_map_end = '</Map>';
          var xml = xml_map_start + xml_style + xml_map_end;

          var map = new mapnik.Map(256, 256);
          try {
            map.fromStringSync(xml);
          } 
          catch(err) {
            console.log("We have an error!");
            console.log(xml);
            console.log(err);
          };
          map.bufferSize = 64;
          map.extent = bbox;

          if (features.length !== 0) {
            var ds = new mapnik.Datasource({type: 'csv', 'inline': inline});
            var layer = new mapnik.Layer(layerID);
            layer.datasource = ds;
            layer.styles=[layerID];
            layer.srs = srs="+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
            map.add_layer(layer);
          };

          if (grid_requested) {
            if (features.length !== 0) {
              var utfGrid = new mapnik.Grid(map.width, map.height);
              map.render(utfGrid,{layer: layerID, fields: headers},function(err, utfGrid) {
                if (err) {
                  throw err;
                } else {
                  res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                  // var encodedUtfGrid = utfGrid.encodeSync('utf', {resolution: 2});
                  var encodedUtfGrid = utfGrid.encodeSync({resolution: 2});
                  res.end(req_callback  + "(" + JSON.stringify(encodedUtfGrid) + ")");
                };
              });
            } else {
              res.json({});
            };
          } else {
            if (raster_requested) {
              // If image/png
              var im = new mapnik.Image(map.width, map.height);
              map.render(im, function(err, im) {
                if (err) {
                  throw err;
                } else {
                  res.writeHead(200, {'Content-Type': 'image/png'});
                  res.end(im.encodeSync('png'));
                };
              });
            } else {
              // If vector tile - TODO
              var vtile = new mapnik.VectorTile(zoom,x,y);
              var geojson = {
                "type": "FeatureCollection",
                "features": features
              };
              // vtile.addGeoJSON(JSON.stringify(geojson),fc_layer_name);
              // vtile.addGeoJSON(JSON.stringify(geojson),"layer-name");
              map.render(vtile, function(err, vtile) {
                if (err) {
                  throw err;
                } else {
                  res.writeHead(200,{'Content-Type': 'application/x-protobuf'});

                  vtile.getData(function(err, data) {
                    if (err) throw err;
                    // console.log(data); // buffer
                    res.end(data);
                  });
                };
              });
            };
          };
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


// {
//     "id": "foo",
//     "name": "foo",
//     "srs": "+init=epsg:4326",
//     "class": "",
//     "Datasource": {
//         "file": "http://example.com/file.geojson",
//         "type": "ogr",
//         "layer_by_index": 0 
//     },
//     "geometry": "polygon" 
// }

// From Cloudmade website
// Lat/Long to Tile Numbers
// n = 2 ^ zoom
// xtile = ((lon_deg + 180) / 360) * n
// ytile = (1 - (ln(tan(lat_rad) + sec(lat_rad)) / Pi)) / 2 * n

// Tile Numbers to Lat/Lon
// n = 2 ^ zoom
// lon_deg = xtile / n * 360.0 - 180.0
// lat_rad = arctan(sinh( Pi * (1 - 2 * ytile / n)))
// lat_deg = lat_rad * 180.0 / Pi

