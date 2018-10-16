var mapBox = "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1Ijoiam1zdHJhdHRvbiIsImEiOiJjamxlY2xieGcwa2Z5M2tzNWE5Y284MHIwIn0.M3qBsKXih5c3uLEvF7UUmA";

// Create a map object
var myMap = L.map("map", {
  center: [36.991489, -119.403297],
  zoom: 7
});

// Add a tile layer
L.tileLayer(mapBox).addTo(myMap);
var coordinates = []
var magnitude = []
var places = []
var time = []

// perform an API call to the USGS earthquake API to get location information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);

function createMarkers(response) {
  console.log(response);
  // pull the "features" property off of response
  var locations = response.features;

  // loop through the locations array
  for (var index = 0; index < locations.length; index++) {
    var location = locations[index];
    coordinates.push(location.geometry.coordinates) 
    magnitude.push(location.properties.mag)
    places.push(location.properties.place)
    time.push(location.properties.time)
  }
  // for each station, create a marker and bind a popup with the station's name
  for (var i = 0; i < coordinates.length; i++){
    var placeMarker = L.circle([coordinates[i][1],coordinates[i][0]],{
      fillOpacity: 0.70,
      weight: 0.5,
      color: "black",
      opacity: 1,
      fillColor: getColor(magnitude[i]),
      radius: magnitude[i]*10000
  }).bindPopup("<h3> Location: " + places[i] + "</h3>"
               +"<h3> Magnitude: " + magnitude[i] +"</h3>"
               +"<h3> Time: " +moment.unix(time[i]).format("h:mm:ss A") +"</h3>").addTo(myMap);
  }
  function getColor(d) {
    return d > 5 ? "#FF0000" :      
           d > 4 ? "#FF6350" :
           d > 3 ? "#FFA00A" :
           d > 2 ? "#F3DB4D" :
           d > 1 ? "#E2F355" :
                   "#FFEDA0" ;
}

var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create('div', 'info legend');
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    // Add legend to map
    legend.addTo(myMap);

}
