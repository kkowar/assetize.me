getTiles = function(layer,layers,map) {
  if (layers[layer.id] === undefined) layers[layer.id] = {};

  // Remove old tile Layer and associated utfGrid
  if (layers[layer.id].layer !== undefined) {
    if (map.hasLayer(layers[layer.id].layer)) {
      map.removeLayer(layers[layer.id].layer);
      map.removeLayer(layers[layer.id].layerGrid);
    }; 
  };

  
    // Timestamp to create browser refresh.
    var timestamp = Math.floor(Date.now() / 1000);

    // Get/add the png map tile.
    var tileUrl = '/map/tiles/' + layer.id + '/{z}/{x}/{y}.png?timestamp=' + timestamp;
    var tileLayer = new L.TileLayer(tileUrl);
    layers[layer.id].layer = tileLayer;

    // Get/add the utfGrid tile.
    var utfGridUrl = '/map/tiles/' + layer.id + '/{z}/{x}/{y}.grid.json?callback={cb}'
    var utfGridLayer = new L.UtfGrid(utfGridUrl, {resolution: 2});
    layers[layer.id].layerGrid = utfGridLayer;

    // TODO: Possibly add zIndex for utfGrid tile.
    layers[layer.id].redefine = false;
    if (layers[layer.id].zIndex === undefined) {layers[layer.id].zIndex = tileLayer.zIndex};

    
  if (layer.visible === true) {
    gMap.addLayer(tileLayer);
    gMap.addLayer(utfGridLayer);
    drawZIndexOrder(layers,map);
  };

  // if (layer.visible === "true") {
  //   if (filteredLayer) {
  // //     filteredLayer.addTo(map);
  // //     drawZIndexOrder(gLayers,gMap);
  //   };
  // };
};

updateTileLayerColor = function(layerID,newColor,action,subLayerID,layers) {
  $.ajax({url: "layer/find/" + layerID}).done(function(data){

    var styleType = data.styles.type;
    var geometryType = data.geometryType;

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

    if (styleType === "choropleth") {
      if ((geometryType === "Point") || (geometryType === "Polygon")) {
        if (action === "fill") {data.styles.choropleth.fieldFillColor[subLayerID] = newColor;};
        if (action === "stroke") {data.styles.choropleth.stroke.color = newColor;};
      };
      if ((geometryType === "LineString") || (geometryType === "MultiLineString")) {
        data.styles.choropleth.fieldFillColor[subLayerID] = newColor;
      };
      data.styles.choropleth.fieldValues = [];
    }; 

    if (styleType === "simple") {
      if (action === "fill") {data.styles.simple.fill.color = newColor;};
      if (action === "stroke") {data.styles.simple.stroke.color = newColor;};
    };

    $.ajax({url: "layer/update/" + layerID, data: data}).done(function(data){
      replaceTileLayer(data.id,layers);
    });
  });
};

updateTileLayerStyle = function(layerID,value,action,attribute,layers) {
  $.ajax({url: "layer/find/" + layerID}).done(function(data){
    data = updateLayerStyleData(data,value,action,attribute);
    $.ajax({url: "layer/update/" + layerID, data: data}).done(function(data){
      replaceTileLayer(data.id,layers);
    });
  });
};

replaceTileLayer = function (fcID,layers) {
  layer = layers[fcID].layer;
  map = layer._map;
  map.removeLayer(layer);
  var timestamp = Math.floor(Date.now() / 1000);
  var tileUrl = '/map/tiles/' + fcID + '/{z}/{x}/{y}.png?timestamp=' + timestamp;
  var tileLayer = new L.TileLayer(tileUrl);
  map.addLayer(tileLayer);
  layers[fcID].layer = tileLayer;
  drawZIndexOrder(layers,map);
};

getVectorTiles = function () {
  // Experimental Vector Tiles
  var timestamp = Math.floor(Date.now() / 1000);
  var tileUrl = '/map/tiles/' + layer.id + '/{z}/{x}/{y}.pbf?timestamp=' + timestamp;
  var vectorTileLayer = new L.TileLayer.MVTSource(tileUrl);
  var vectorTileLayer = new L.TileLayer.MVTSource({
    url: "http://spatialserver.spatialdev.com/services/vector-tiles/GAUL_FSP/{z}/{x}/{y}.pbf",
    debug: true,
    clickableLayers: ["GAUL0"],
    getIDForLayerFeature: function(feature) {
      return feature.properties.id;
    },

    /**
     * The filter function gets called when iterating though each vector tile feature (vtf). You have access
     * to every property associated with a given feature (the feature, and the layer). You can also filter
     * based of the context (each tile that the feature is drawn onto).
     *
     * Returning false skips over the feature and it is not drawn.
     *
     * @param feature
     * @returns {boolean}
     */
    filter: function(feature, context) {
      if (feature.layer.name === 'GAUL0') {
        return true;
      }
      return false;
    },

    style: function (feature) {
      var style = {};

      var type = feature.type;
      switch (type) {
        case 1: //'Point'
          style.color = 'rgba(49,79,79,1)';
          style.radius = 5;
          style.selected = {
            color: 'rgba(255,255,0,0.5)',
            radius: 6
          };
          break;
        case 2: //'LineString'
          style.color = 'rgba(161,217,155,0.8)';
          style.size = 3;
          style.selected = {
            color: 'rgba(255,25,0,0.5)',
            size: 4
          };
          break;
        case 3: //'Polygon'
          style.color = fillColor;
          style.outline = {
            color: strokeColor,
            size: 1
          };
          style.selected = {
            color: 'rgba(255,140,0,0.3)',
            outline: {
              color: 'rgba(255,140,0,1)',
              size: 2
            }
          };
          break;
      }
      return style;
    }

  });
  var fillColor = 'rgba(149,139,255,0.4)';
  var strokeColor = 'rgb(20,20,20)';
  gMap.addLayer(vectorTileLayer);
  layers[layer.id].layer = vectorTileLayer;
  console.log("vectorTileLayer");
  console.log(vectorTileLayer);
  console.log(vectorTileLayer.bbox);
};