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
  initMapPopup(map);
  L.control.locate().addTo(map);
  // var info = L.control();
  // info.onAdd = function (map) {
  //     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
  //     this.update();
  //     return this._div;
  // };
  // // method that we will use to update the control based on feature properties passed
  // info.update = function (props) {
  //     this._div.innerHTML = '<div id="geoLocate" class="glyphicon glyphicon-screenshot" style="background-color: #ffffff; border-radius: 3px; font-size: 20px; padding: 2px 5px 5px 5px;"></div>';
  // };
  // info.addTo(map);
  // $("#geoLocate").on("click",function(e){
  //   map.locate({setView: true, maxZoom: 16});
  // });

  // function onLocationFound(e) {
  //   var radius = e.accuracy / 2;

  //   L.marker(e.latlng).addTo(map)
  //       .bindPopup("You are within " + radius + " meters from this point").openPopup();

  //   L.circle(e.latlng, radius).addTo(map);
  // }

  // map.on('locationfound', onLocationFound);

  return map;
};

initMapPopup = function (map) {
  map.on('click', function(e){
    var data = getUtfGridData(e);
    // console.log(data);
    var html = generateMultiplePopupHTML(data,e.latlng);
    if (data.length !== 0) {
      var popup = L.popup();
      popup
        .setLatLng(e.latlng)
        .setContent(html)
        .openOn(map);
    };
    $(".mapPopupModal").on("click",function(e){
      var properties = JSON.parse(e.currentTarget.children[0].children[1].value);
      var html = "<div><dl class='dl-horizontal'>";
      _.each(properties, function (value,key) {
        html = html + "<dt>" + key + "</dt><dd>" + value + "</dd>";
      });
      html = html + "</dl></div>";
      $('#mapPopupModal .modal-body .data').html(html);
      $('#mapPopupModal').modal({show: true});
      $('.rating-container .star').on("click",function () {
          // console.log("Clicked Star");
          $('.rating-container .star').removeClass('glyphicon-star');
          $('.rating-container .star').addClass('glyphicon-star-empty');
          $(this).prevAll('.star').addBack().removeClass('glyphicon-star-empty').addClass('glyphicon-star');
      });
    });
  });
}

getUtfGridData = function (e) {
  var map = gMap,
      point = map.project(e.latlng),
      tileSize = 256,
      resolution = 2,
      x = Math.floor(point.x / tileSize),
      y = Math.floor(point.y / tileSize),
      gridX = Math.floor((point.x - (x * tileSize)) / resolution),
      gridY = Math.floor((point.y - (y * tileSize)) / resolution),
    max = map.options.crs.scale(map.getZoom()) / tileSize;

  x = (x + max) % max;
  y = (y + max) % max;

  var data = [];
  _.each(map._layers,function(layer){
    if (layer._cache) {data.push(utfData(layer._cache[map.getZoom() + '_' + x + '_' + y],gridX,gridY,e));};
  });
  return _.compact(data);
};

utfData = function(data,gridX,gridY,e) {
  // var data = cache[map.getZoom() + '_' + x + '_' + y];
  if (!data) {
    // return { latlng: e.latlng, data: null };
    return null;
  }

  var idx = utfGridDecode(data.grid[gridY].charCodeAt(gridX)),
      key = data.keys[idx],
      result = data.data[key];

  if (!data.data.hasOwnProperty(key)) {
    result = null;
  }

  return result;
};

utfGridDecode = function (c) {
  if (c >= 93) {
    c--;
  }
  if (c >= 35) {
    c--;
  }
  return c - 32;
};

redrawMapBounds = function(){
  var latLngs = [];
  _.each(gMap._layers,function(layer){
    if (layer._latlngs) {latLngs.push(layer._latlngs)};
  });
  var bounds = L.latLngBounds(latLngs);
  console.log(bounds);
  gMap.fitBounds(bounds);
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
      // getFeatures(layer,layers,map,index);
      getTiles(layer,layers,map);
    })
  });
};

getTiles = function(layer,layers,map) {
  if (layers[layer.id] === undefined) layers[layer.id] = {};

  if (layers[layer.id].layer !== undefined) {
    if (map.hasLayer(layers[layer.id].layer)) map.removeLayer(layers[layer.id].layer);
  };

  var tileUrl = '/map/tiles/' + layer.id + '/{z}/{x}/{y}.png'
  var tileLayer = new L.TileLayer(tileUrl);
  gMap.addLayer(tileLayer);
  layers[layer.id].layer = tileLayer;

  var utfGridUrl = '/map/tiles/' + layer.id + '/{z}/{x}/{y}.grid.json?callback={cb}'
  var utfGridLayer = new L.UtfGrid(utfGridUrl, {resolution: 2});
  gMap.addLayer(utfGridLayer);
  layers[layer.id].layerGrid = utfGridLayer;

  layers[layer.id].redefine = false;
  if (layers[layer.id].zIndex === undefined) {layers[layer.id].zIndex = tileLayer.zIndex};
  // if (layer.visible === "true") {
  //   if (filteredLayer) {
  // //     filteredLayer.addTo(map);
  // //     drawZIndexOrder(gLayers,gMap);
  //   };
  // };
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

      if (styles.type === "choropleth") {
        var style = styles.choropleth;
        var styleAttributes = {
          radius: style.radius,
          fillOpacity: style.fill.opacity,
          color: style.stroke.color,
          opacity: style.stroke.opacity,
          weight: style.stroke.weight
        };
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
          if (styles.type === "choropleth") {
            var color = undefined;
            _.each(style.fieldBreaks,function(fieldBreak,index){
              if ((color === undefined) && (feature.properties[style.field] <= style.fieldBreaks[index + 1])) {color = style.fieldFillColor[index]};
            });
            styleAttributes.fillColor = color;
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

      if (styles.type === "choropleth") {
        console.log(styles);
        var style = styles.choropleth;
        var styleAttributes = {
          color: style.stroke.color,
          opacity: style.stroke.opacity,
          weight: style.stroke.weight
        };
      };

      result = L.geoJson(geoJSON, {
          style: function (feature) {
            if (styles.type === "category") {
              styleAttributes.color = _.isEmpty(fieldFills[feature.properties[style.field]]) ? style.fieldOthersFill : fieldFills[feature.properties[style.field]];
            };
            if (styles.type === "choropleth") {
              var color = undefined;
              _.each(style.fieldBreaks,function(fieldBreak,index){
                if ((color === undefined) && (feature.properties[style.field] <= style.fieldBreaks[index + 1])) {color = style.fieldFillColor[index]};
              });
              styleAttributes.color = color;
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

      if (styles.type === "choropleth") {
        var style = styles.choropleth;
        var styleAttributes = {
          fillOpacity: style.fill.opacity,
          color: style.stroke.color,
          opacity: style.stroke.opacity,
          weight: style.stroke.weight
        };
        console.log("choropleth");
      };

      result = L.geoJson(geoJSON, {
          style: function (feature) {
            if (styles.type === "category") {
              styleAttributes.fillColor = _.isEmpty(fieldFills[feature.properties[style.field]]) ? style.fieldOthersFill : fieldFills[feature.properties[style.field]];
            };
            if (styles.type === "choropleth") {
              var color = undefined;
              _.each(style.fieldBreaks,function(fieldBreak,index){
                if ((color === undefined) && (feature.properties[style.field] <= style.fieldBreaks[index + 1])) {color = style.fieldFillColor[index]};
              });
              console.log(color);
              styleAttributes.fillColor = color;
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

generateMultiplePopupHTML = function(utf_hits,latlng) {
  // return getBasicHTML(utf_hits);
  return getAdvancedHTML(utf_hits,latlng);
};

getBasicHTML = function(utf_hits) {
  var html = "<div class='popup-content-wrapper'><dl>";
  _.each(utf_hits,function(hit){
    html = html + "<div style='background-color: #CCC'>utf hit</div>";
    _.each(hit, function (value,key) {
      html = html + "<dt>" + key + "</dt><dd>" + value + "</dd>";
    });
    if (utf_hits.length > 1) {
      html = html + "<div>&nbsp;</div>"
    };
  });
  html = html + "</dl></div>";
  html = html + "<div class='popup-content-footer pull-right'><span class='glyphicon glyphicon-edit' title='Edit'></span>&nbsp;<span class='glyphicon glyphicon-remove' title='Delete'></span></div>";
  return html;
};

getAdvancedHTML = function(utf_hits,latlng) {

  var html = "<div class='popup-content-wrapper'>";
  // Bootstrap Well Style
  // var html = '';
  // _.each(utf_hits,function(hit,index){
  //   html += '<div class="well well-sm">Hit #' + index + '</div>';
  // });

  // Bootstrap List Group Style
  // var html = '<ul class="list-group">';
  // _.each(utf_hits,function(hit,index){
  //   // html += '<div class="well well-sm">Hit #' + index + '</div>';
  //   html += '<li class="list-group-item">Hit #' + index + '</li>';
  // });
  // html += '</ul>';

  // Bootstrap Nav Stacked
  html += '<ul class="nav nav-pills nav-stacked">';
  _.each(utf_hits,function(hit,index){
    // html += '<div class="well well-sm">Hit #' + index + '</div>';
    html += '<li class=""><a class="mapPopupModal" href="#"><div class="text-left">Hit #' + index + '<span class="glyphicon glyphicon-chevron-right pull-right"></span><input type="hidden" value="' + JSON.stringify(hit).replace(/"/g,'&#34;') + '"></div></a></li>';
  });
  html += '</ul>';
  html += "</div>";
  html += "<div class='popup-content-footer'>";
  html += "<span class='text-muted'><div>Longitude</div><div>" + latlng.lng.toFixed(8) + "</div><div>Latitude</div><div>" + latlng.lat.toFixed(8) + "</div></span>"
  html += "</div";
  // console.log(latlng);
  return html;
};

generatePropertiesArray = function(properties) {
  var arrProperties = [];
  _.each(properties, function (value,key) {
    arrProperties.push(key);
  });
  return arrProperties;
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
      replaceTileLayer(layers[data.id].layer);
    });
  });
};

// todo: Finish updating this function to work. 
updateGeojsonLayerColor = function() {
  if (styleType === "category") {

    fieldFills = {};
    _.each(data.styles.category.fieldValues,function(fieldValue,index){
      fieldFills[fieldValue] = data.styles.category.fieldFillColor[index];
    });

    if (action === "fill") {
      _.each(layers[data.id].layer._layers,function(layer){
        var fillColor = fieldFills[layer.feature.properties[data.styles.category.field]];
        fillColor = (fillColor === undefined) ? data.styles.category.fieldOthersFill : fillColor
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

  if (styleType === "choropleth") {

    fieldFills = {};
    _.each(data.styles.choropleth.fieldValues,function(fieldValue,index){
      fieldFills[fieldValue] = data.styles.choropleth.fieldFillColor[index];
    });

    if (action === "fill") {
      _.each(layers[data.id].layer._layers,function(layer){
        var fillColor = fieldFills[layer.feature.properties[data.styles.choropleth.field]];
        fillColor = (fillColor === undefined) ? data.styles.choropleth.fieldOthersFill : fillColor
        layer.setStyle({fillColor: fillColor});
      });
    };

    if (action === "stroke") {
      if ((geometryType === "Point") || (geometryType === "Polygon")) {
        var color = data.styles.choropleth.stroke.color;
        console.log(color);
        _.each(layers[data.id].layer._layers,function(layer){
          layer.setStyle({color: color});
        });
      };

      if ((geometryType === "LineString") || (geometryType === "MultiLineString")) {
        _.each(layers[data.id].layer._layers,function(layer){
          var color = fieldFills[layer.feature.properties[data.styles.choropleth.field]];
          color = (color === undefined) ? data.styles.choropleth.fieldOthersFill : color
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
};

updateGeojsonLayerStyle = function(layerID,value,action,attribute,layers) {
  $.ajax({url: "layer/find/" + layerID}).done(function(data){
    data = updateLayerStyleData(data);
    $.ajax({url: "layer/update/" + layerID, data: data}).done(function(data){
      layers[layerID].layer.setStyle(style);
    });
  });
};

updateTileLayerStyle = function(layerID,value,action,attribute,layers) {
  $.ajax({url: "layer/find/" + layerID}).done(function(data){
    data = updateLayerStyleData(data,value,action,attribute);
    $.ajax({url: "layer/update/" + layerID, data: data}).done(function(data){
      replaceTileLayer(layers[data.id].layer);
    });
  });
};

updateLayerStyleData = function(data,value,action,attribute) {
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
  if (data.styles.type === "choropleth") {
    if (attribute === 'opacity') {
      if (action === "fill") {data.styles.choropleth.fill.opacity = value};
      if (action === "stroke") {data.styles.choropleth.stroke.opacity = value};
    };
    if (attribute === 'weight') {
      data.styles.choropleth.stroke.weight = value;
    };
    if (attribute === 'radius') {
      data.styles.choropleth.radius = value;
    };
    data.styles.choropleth.fieldValues = [];
  };
  return data;
};

updateLayerVisibility = function(layerID,visibility) {
  $.ajax({url: "layer/find/" + layerID}).done(function(data){
    data.visible = visibility;
    $.ajax({url: "layer/update/" + layerID, data: data}).done(function(data){

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

replaceTileLayer = function (layer) {
  map = layer._map;
  map.removeLayer(layer);
  map.addLayer(layer);
};

drawFrequencyChart = function(values,valBreaks,element) {

  // A formatter for counts.
  var formatCount = d3.format(",.0f");

  var margin = {top: 10, right: 30, bottom: 30, left: 30},
      width = 300 - margin.left - margin.right,
      height = 100 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .domain([0, _.max(arr_total)])
      .range([0, width]);

  // Generate a histogram using twenty uniformly-spaced bins.
  var data = d3.layout.histogram()
      .bins(x.ticks(200))
      (values);

  var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return d.y; })])
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var svg = d3.select(element).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar = svg.selectAll(".bar")
      .data(data)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

  bar.append("rect")
      .attr("x", 1)
      .attr("width", x(data[0].dx) - 1)
      .attr("height", function(d) { return height - y(d.y); });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  _.each(valBreaks,function(valBreak,i){
    var line = svg.append("line")
      .attr("x1", x(valBreak))
      .attr("y1", y(0))
      .attr("x2", x(valBreak))
      .attr("y2", y(d3.max(data, function(d) { return d.y; })))
      .style("stroke", "rgb(0,0,0)")
      .style("stroke-width", "1")
      .style("stroke-dasharray","5,5");
    svg.append("text")
      .attr("transform","translate(" + x(valBreak + 3) + "," + y(d3.max(data, function(d) { return d.y; })) + ")rotate(90)")
      .attr("text-anchor", "left")
      .attr("font-size", "9px")
      .text(function(d) { return formatCount(valBreak); });
  });

};





