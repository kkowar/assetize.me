generateLeafletBaseMap = function () {
  L.Icon.Default.imagePath = 'packages/leaflet/images';
  var map = new L.Map('map');
  // Mapquest Aerial
  // var osmUrl = "http://otile1.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg"
  // Cloudmade Grayscale
  var osmUrl = 'http://{s}.tile.cloudmade.com/16ec923ebe48421e9ae5573d3016d5c0/22677/256/{z}/{x}/{y}.png'
  var osmAttrib='Map data © OpenStreetMap contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 20, attribution: osmAttrib}); 
  map.setView(new L.LatLng(39.97407, -105.14901),14);
  map.addLayer(osm);
  return map;
};

drawLeafletLayers = function (layers,map) {
  getLayers(layers,map);
};

drawZIndexOrder = function(layers,map) {
  var sortedLayers = _.sortBy(layers,function(layer){return layer.zIndex});
  _.each(sortedLayers,function(layer){
    if (map.hasLayer(layer.layer)) {
      layer.layer.bringToFront();
    };
  });
};

getLayers = function(layers,map) {
  $.ajax({url: "/layer/find"}).done(function(data) {
    _.each(data,function(layer,index){
      console.log(layer);
      getFeatures(layer,layers,map,index);
    })
  });
};

getFeatures = function(layer,layers,map,index) {
  // var queryValue = (layer.styles.default.value === 'null') ? null : "'" + layer.styles.default.value + "'";     
  // var selector = "this.properties." + layer.styles.default.field + " == " + queryValue;
  // $.ajax({url: "/layer/find", data: {"fcID": layer.fcID, $where: selector}}).done(function(data) {
  $.ajax({url: "/feature/find", data: {"fcID": layer.fcID}}).done(function(data) {
    var layerFeatures = data;
    if (layerFeatures === undefined) return;
    var layerFeaturesCount = layerFeatures.length;
    if (layerFeaturesCount === 0) return;
    if ((layers[layer.id] === undefined) || (layers[layer.id].redefine === true) || (layers[layer.id].count !== layerFeaturesCount)) {
      // console.log(selector + ": " + layerFeaturesCount);
      if (layers[layer.id] === undefined) layers[layer.id] = {};
      var curLayer = layers[layer.id];
      curLayer.count = layerFeaturesCount;
      // !! colFilters.update({"_id": filter._id},{$set: {count: filteredFeaturesCount}});
      // todo: substyle counts
      var filteredGeoJSON = generateGeoJSON(layerFeatures);
      var filteredLayer = generateGeoJSONLayer(filteredGeoJSON,layer.styles);
      if (curLayer.layer !== undefined) {
        if (map.hasLayer(curLayer.layer)) map.removeLayer(curLayer.layer);
      };
      layers[layer.id].redefine = false;
      layers[layer.id].layer = filteredLayer;
      if (curLayer.zIndex === undefined) {layers[layer.id].zIndex = layer.zIndex};
      if (layer.visible === "true") {
        if (filteredLayer) {
          filteredLayer.addTo(map);
          drawZIndexOrder(gLayers,gMap);
        };
      };
    };
  });
};

generateGeoJSON = function (features) {
  var arrFeatures = [];
  features.forEach(function (feature) {
    arrFeatures.push({"type": "Feature", "id": feature.fID, "geometry": feature.geometry ,"properties": feature.properties});
  });
  result = {"type": "FeatureCollection","features": arrFeatures};
  return result;
};

generateGeoJSONLayer = function (geoJSON,styles) {

  if (geoJSON.features[1] !== undefined) {
    var featureType = geoJSON.features[1].geometry.type;
    var result;

    if (featureType === "Point") {

      if (styles.type === "simple") {
        var style = styles.simple;
        var styleAttributes = {
          radius: style.radius,
          fillColor: style.fill.color,
          fillOpacity: style.fill.opacity,
          color: style.stroke.color,
          opacity: style.stroke.opacity,
          weight: style.stroke.weight
        };
      };

      if (styles.type === "category") {
        var style = styles.category;
        var styleAttributes = {
          radius: style.radius,
          fillOpacity: style.fill.opacity,
          color: style.stroke.color,
          opacity: style.stroke.opacity,
          weight: style.stroke.weight
        };
        fieldFills = {};
        _.each(style.fieldValues,function(fieldValue,index){
          fieldFills[fieldValue] = style.fieldFillColor[index];
        });
      };

      result = L.geoJson(geoJSON, {
        style: function (feature) {
          // Figure out what to do here if anything.
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(generatePopupHTML(feature.properties));
        },
        pointToLayer: function (feature, latlng) {
          if (styles.type === "category") {
            styleAttributes.fillColor = _.isEmpty(fieldFills[feature.properties[style.field]]) ? style.fieldOthersFill : fieldFills[feature.properties[style.field]];
          };
          return L.circleMarker(latlng, styleAttributes);
        }
      });

    };

    if (featureType === "LineString" || featureType === "MultiLineString") {
      
      if (styles.type === "simple") {
        var style = styles.simple;
        var styleAttributes = {
          color: style.stroke.color, 
          opacity: style.stroke.opacity,
          weight: style.stroke.weight
        }
      };

      if (styles.type === "category") {
        var style = styles.category;
        var styleAttributes = {
          color: style.stroke.color,
          opacity: style.stroke.opacity,
          weight: style.stroke.weight
        };
        fieldFills = {};
        _.each(style.fieldValues,function(fieldValue,index){
          fieldFills[fieldValue] = style.fieldFillColor[index];
        });
      };

      result = L.geoJson(geoJSON, {
          style: function (feature) {
            if (styles.type === "category") {
              styleAttributes.color = _.isEmpty(fieldFills[feature.properties[style.field]]) ? style.fieldOthersFill : fieldFills[feature.properties[style.field]];
            };
            return styleAttributes;
          },
          onEachFeature: function (feature, layer) {
            layer.bindPopup(generatePopupHTML(feature.properties));
          }
        })
    };

    if (featureType === "Polygon") {
      if (styles.type === "simple") {
        var style = styles.simple;
        var styleAttributes = {
          fillColor: style.fill.color,
          fillOpacity: style.fill.opacity,
          color: style.stroke.color,
          opacity: style.stroke.opacity,
          weight: style.stroke.weight
        };
      };

      if (styles.type === "category") {
        var style = styles.category;
        var styleAttributes = {
          // fillColor: style.fill.color,
          fillOpacity: style.fill.opacity,
          color: style.stroke.color,
          opacity: style.stroke.opacity,
          weight: style.stroke.weight
        };
        fieldFills = {};
        _.each(style.fieldValues,function(fieldValue,index){
          fieldFills[fieldValue] = style.fieldFillColor[index];
        });
      };

      result = L.geoJson(geoJSON, {
          style: function (feature) {
            if (styles.type === "category") {
              styleAttributes.fillColor = _.isEmpty(fieldFills[feature.properties[style.field]]) ? style.fieldOthersFill : fieldFills[feature.properties[style.field]];
            };
            return styleAttributes;
          },
          onEachFeature: function (feature, layer) {
            layer.bindPopup(generatePopupHTML(feature.properties));
          }
        })
    };
    
  };

  return result;

}; 

generatePopupHTML = function(properties) {
  var html = "<div class='popup-content-wrapper'><dl>";
  _.each(properties, function (value,key) {
    html = html + "<dt>" + key + "</dt><dd>" + value + "</dd>";
  });
  html = html + "</dl></div>";
  html = html + "<div class='popup-content-footer pull-right'><span class='glyphicon glyphicon-edit' title='Edit'></span>&nbsp;<span class='glyphicon glyphicon-remove' title='Delete'></span></div>";
  return html;
};

generatePropertiesArray = function(properties) {
  var arrProperties = [];
  _.each(properties, function (value,key) {
    arrProperties.push(key);
  });
  return arrProperties;
};

updateLayerColor = function(layerID,newColor,action,subLayerID,layers) {

  $.ajax({url: "layer/find/" + layerID}).done(function(data){

    var styleType = data.styles.type;
    var geometryType = data.geometryType;
    console.log(geometryType);
    if (styleType === "category") {
      if (subLayerID !== "others") {
        if ((geometryType === "Point") || (geometryType === "Polygon")) {
          if (action === "fill") {data.styles.category.fieldFillColor[subLayerID] = newColor;};
          if (action === "stroke") {data.styles.category.stroke.color = newColor;};
        };
        if ((geometryType === "LineString") || (geometryType === "MultiLineString")) {
          data.styles.category.fieldFillColor[subLayerID] = newColor;
        };
      } else {
        data.styles.category.fieldOthersFill = newColor;
      };
    }; 

    if (styleType === "simple") {
      if (action === "fill") {data.styles.simple.fill.color = newColor;};
      if (action === "stroke") {data.styles.simple.stroke.color = newColor;};
    };

    $.ajax({url: "layer/update/" + layerID, data: data}).done(function(data){
      if (styleType === "category") {

        fieldFills = {};
        _.each(data.styles.category.fieldValues,function(fieldValue,index){
          fieldFills[fieldValue] = data.styles.category.fieldFillColor[index];
        });

        if (action === "fill") {
          _.each(layers[data.id].layer._layers,function(layer){
            var fillColor = fieldFills[layer.feature.properties[data.styles.category.field]];
            fillColor = (fillColor === undefined) ? data.styles.category.fieldOthersFill : fillColor
            // console.log(fillColor);
            // layer.setStyle({fillColor: fillColor});
            layer.setStyle({fillColor: fillColor});
          });
        };

        if (action === "stroke") {
          if ((geometryType === "Point") || (geometryType === "Polygon")) {
            var color = data.styles.category.stroke.color;
            console.log(color);
            _.each(layers[data.id].layer._layers,function(layer){
              layer.setStyle({color: color});
            });
          };

          if ((geometryType === "LineString") || (geometryType === "MultiLineString")) {
            _.each(layers[data.id].layer._layers,function(layer){
              var color = fieldFills[layer.feature.properties[data.styles.category.field]];
              color = (color === undefined) ? data.styles.category.fieldOthersFill : color
              layer.setStyle({color: color});
            });
          };
        };

      };

      if (styleType === "simple") {
        var style = undefined;
        if (action === "fill") {style = {fillColor: data.styles.simple.fill.color}};
        if (action === "stroke") {style = {color: data.styles.simple.stroke.color}};
        layers[layerID].layer.setStyle(style);
      };

    });
  });
};

updateLayerStyle = function(layerID,value,action,attribute) {
  $.ajax({url: "layer/find/" + layerID}).done(function(data){
    if (data.styles.type === "simple") {
      if (attribute === 'opacity') {
        if (action === "fill") {data.styles.simple.fill.opacity = value};
        if (action === "stroke") {data.styles.simple.stroke.opacity = value};
      };
      if (attribute === 'weight') {
        data.styles.simple.stroke.weight = value;
      };
      if (attribute === 'radius') {
        data.styles.simple.radius = value;
      };
    };
    if (data.styles.type === "category") {
      if (attribute === 'opacity') {
        if (action === "fill") {data.styles.category.fill.opacity = value};
        if (action === "stroke") {data.styles.category.stroke.opacity = value};
      };
      if (attribute === 'weight') {
        data.styles.category.stroke.weight = value;
      };
      if (attribute === 'radius') {
        data.styles.category.radius = value;
      };
    };
    $.ajax({url: "layer/update/" + layerID, data: data}).done(function(data){
      // console.log("Success");
      // console.log(data);
    });
  });
};

updateLayerVisibility = function(layerID,visibility) {
  console.log("updateLayerVisibility");
  $.ajax({url: "layer/find/" + layerID}).done(function(data){
    // console.log(data.visible);
    data.visible = visibility;
    $.ajax({url: "layer/update/" + layerID, data: data}).done(function(data){
      // console.log("Success");
      // console.log(data);
    });
  });
};

updateLayerDrawOrder = function(sorted_ids,layers,map) {
  var reversed_ids = sorted_ids.reverse();
  _.each(reversed_ids,function(id,index){
    if (layers[id] && map.hasLayer(layers[id].layer)) {
      layers[id].layer.bringToFront();
    };
  });
  _.each(sorted_ids,function(id,index){
    $.ajax({url: "layer/update/" + id, data: {zIndex: index}}).done(function(data){
      layers[id].zIndex = index;
    });
  });
};

