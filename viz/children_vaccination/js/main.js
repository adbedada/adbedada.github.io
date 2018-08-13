mapboxgl.accessToken = 'pk.eyJ1IjoiZGVzdGFuZW9uMSIsImEiOiJjaW94andic2wwMXN0dWNtOGJnNndvajFlIn0._eDLrcUaWTpNHqrb5bQE-Q';
var map1 = new mapboxgl.Map({
  container: 'map1',

  container: 'map1',
  style: 'mapbox://styles/mapbox/dark-v9',
  center: [-1.472075, 12.354846],
  zoom: 8.3,
  pitch: 40,
  bearing: 20
});

map1.on('load', function() {
map1.addLayer({
    'id': 'vacc-layer',
    'type': 'fill-extrusion',
      'source': {
        'type': 'geojson',
        'data': "assets/past_data.geojson"},
});

map1.setPaintProperty('vacc-layer', 'fill-extrusion-height',{
  'type':'identity',
  'property':'pop'
});
map1.setPaintProperty('vacc-layer', 'fill-extrusion-color',{
  'type':'identity',
  'property':'color'
});
});

var map2 = new mapboxgl.Map({
  container: 'map2',
  style: 'mapbox://styles/mapbox/dark-v9',
  center: [-1.472075, 12.354846],
  zoom: 8.3,
  pitch: 40,
  bearing: 20
});

map2.on('load', function() {
  map2.addLayer({
      'id': 'vacc-layer',
      'type': 'fill-extrusion',
        'source': {
          'type': 'geojson',
          'data': "assets/present_data.geojson"},
        });
  map2.setPaintProperty('vacc-layer', 'fill-extrusion-height',{
    'type':'identity',
    'property':'pop'
  });
  map2.setPaintProperty('vacc-layer', 'fill-extrusion-color',{
    'type':'identity',
    'property':'color'
  });
});
document.getElementById('dakar').addEventListener('click', function() {
  map1.flyTo({
    center: [-17.458446, 14.724130]
  });
});
document.getElementById('ougadadougou').addEventListener('click', function() {
  map1.flyTo({
    center: [-1.522075, 12.354846]
  });
});
document.getElementById('bamako').addEventListener('click', function() {
  map1.flyTo({
    center: [-7.990717,12.624951]
  });
});
document.getElementById('bamako').addEventListener('click', function() {
  map2.flyTo({
center: [-7.990717,12.624951]
  });
});
document.getElementById('dakar').addEventListener('click', function() {
  map2.flyTo({
    center: [-17.458446, 14.724130]
  });
});
document.getElementById('ougadadougou').addEventListener('click', function() {
  map2.flyTo({
    center: [-1.522075, 12.354846]
  });
});

var disable = false;
 map1.on("move", function() {
   if (!disable) {
     var center = map1.getCenter();
     var zoom = map1.getZoom();
     var pitch = map1.getPitch();
     var bearing = map1.getBearing();

     disable = true;
     map2.setCenter(center);
     map2.setZoom(zoom);
     map2.setPitch(pitch);
     map2.setBearing(bearing);
     disable = false;
   }
 })

 map2.on("move", function() {
    if (!disable) {
      var center = map2.getCenter();
      var zoom = map2.getZoom();
      var pitch = map2.getPitch();
      var bearing = map2.getBearing();

      disable = true;
      map1.setCenter(center);
      map1.setZoom(zoom);
      map1.setPitch(pitch);
      map1.setBearing(bearing);
      disable = false;
    }
  })
