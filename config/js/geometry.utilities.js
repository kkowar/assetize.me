lon2tileX = function (lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); };
lat2tileY =  function (lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); };

tileX2lon = function (x,z) {return (x/Math.pow(2,z)*360-180);};
tileY2lat = function (y,z) {
	var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
	return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
};

tileLatLonBounds = function (tx, ty, zoom) {
  // console.log("Returns bounds of the given tile in latitude/longitude using WGS84 datum");

  var bounds = tileBounds(tx, ty, zoom);
  // console.log(bounds);
  // minLat, minLon
  var min = metersToLatLon(bounds[0], bounds[1]);
  // maxLat, maxLon
  var max = metersToLatLon(bounds[2], bounds[3]);
   
  return [min[0], min[1], max[0], max[1]];
};

metersToLatLon = function (mx, my ) {
  // console.log("Converts XY point from Spherical Mercator EPSG:900913 to lat/lon in WGS84 Datum");
  var originShift = 2 * Math.PI * 6378137 / 2.0;

  lon = (mx / originShift) * 180.0;
  lat = (my / originShift) * 180.0;

  lat = 180 / Math.PI * (2 * Math.atan( Math.exp( lat * Math.PI / 180.0)) - Math.PI / 2.0);
  return [lat, lon];
};

tileBounds = function (tx, ty, zoom) {
	// console.log("Returns bounds of the given tile in EPSG:900913 coordinates");
	var tileSize = 256;
	// minx, miny
	var min = pixelsToMeters(tx * tileSize, ty * tileSize, zoom);
	// maxx, maxy
	var max = pixelsToMeters((tx + 1 ) * tileSize,(ty + 1) * tileSize, zoom);
	return [min[0], min[1], max[0], max[1]];
};

pixelsToMeters = function(px, py, zoom) {
  // console.log("Converts pixel coordinates in given zoom level of pyramid to EPSG:900913");
  var originShift = 2 * Math.PI * 6378137 / 2.0;
  var res = calcResolution(zoom);
  var mx = px * res - originShift;
  var my = py * res - originShift;
  return [mx, my];
};

calcResolution = function (zoom) {
	// console.log("Resolution (meters/pixel) for given zoom level (measured at Equator)")
	var tileSize = 256;
	var initialResolution = 2 * Math.PI * 6378137 / tileSize;
	 // return (2 * math.pi * 6378137) / (self.tileSize * 2**zoom)
	return initialResolution / Math.pow(2,zoom);
};

// lonlat2bbox = function(lon,lat,z) {
// 	my ($lat, $lon, $zoom) = @_;
 
// 	my $width = 425; my $height = 350;	# note: must modify this to match your embed map width/height in pixels
// 	my $tile_size = 256;
 
// 	my ($xtile, $ytile) = getTileNumber ($lat, $lon, $zoom);
 
// 	my $xtile_s = ($xtile * $tile_size - $width/2) / $tile_size;
// 	my $ytile_s = ($ytile * $tile_size - $height/2) / $tile_size;
// 	my $xtile_e = ($xtile * $tile_size + $width/2) / $tile_size;
// 	my $ytile_e = ($ytile * $tile_size + $height/2) / $tile_size;
 
// 	my ($lon_s, $lat_s) = getLonLat($xtile_s, $ytile_s, $zoom);
// 	my ($lon_e, $lat_e) = getLonLat($xtile_e, $ytile_e, $zoom);
 
// 	my $bbox = "$lon_s,$lat_s,$lon_e,$lat_e";
// 	return $bbox;
// }



