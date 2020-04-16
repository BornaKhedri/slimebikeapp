import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { PitchToggle, MapboxGLButtonControl } from "./MapboxHelpers";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

const styles = {
  position: "relative",
  top: 0,
  bottom: 0,
  width: "100%",
  height: "calc(100vh - 350px)",
};

var marker = "";
var geolongitude = "";
var geolatitude = "";

function reposition_marker() {
  // alert("clicked")
  marker.setLngLat([geolongitude, geolatitude]);
}

function Location(props) {

  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const latitude = props.lnglat[1];
  const longitude = props.lnglat[0];
 
  console.log(latitude, longitude);
  geolatitude = latitude;
  geolongitude = longitude;

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiY2hpbnRhbnAiLCJhIjoiY2ppYXU1anVuMThqazNwcDB2cGtneDdkYyJ9.TL6RTyRRFCbvJWyFa4P0Ow";
    const initializeMap = ({ setMap, mapContainer }) => {
      console.log("Map initilizing");
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
        center: [longitude, latitude],
        zoom: 12,
      });

      map.on("load", () => {
        setMap(map);
        map.resize();
      });

      /* Instantiate new controls with custom event handlers */
      const ctrlPoint = new MapboxGLButtonControl({
        className: "mapbox-gl-reposition_marker",
        title: "Reposition Marker",
        eventHandler: reposition_marker,
      });

      map.addControl(new PitchToggle({ minpitchzoom: 11 }), "top-left");
      map.addControl(ctrlPoint, "top-left");

      // Add zoom and rotation controls to the map.
      map.addControl(new mapboxgl.NavigationControl());
      // create the popup
      var popup = new mapboxgl.Popup({
        offset: 30,
        closeOnClick: false,
        closeButton: false,
      }).setText("Move the marker to wheel location.");

      // create a HTML element for each feature
      var el = document.createElement("div");
      el.className = "marker";

      marker = new mapboxgl.Marker(el, {
        draggable: true,
      })
        .setLngLat([longitude, latitude])
        .setPopup(popup)
        .addTo(map)
        .togglePopup();

      function onDragEnd() {
        var lngLat = marker.getLngLat();
        // Set the new lat, lng based on the post drag location
        longitude = lngLat.lng;
        latitude = lngLat.lat;
        console.log(`New coordinates are: (${latitude}, ${longitude})`);
      }

      marker.on("dragend", onDragEnd);
      // map.addControl(new PitchToggle({ minpitchzoom: 11 }), "top-left");
    };

    console.log("Inside useEffect ", latitude, longitude);
    if (!map && !isNaN(parseFloat(longitude)) && !isNaN(parseFloat(latitude)))
      initializeMap({ setMap, mapContainer });
  }, [longitude, latitude]);

  return (
    <div>
      <h5 className="text-center">Select the location of bike/scooter</h5>
      <div ref={(el) => (mapContainer.current = el)} style={styles} />
      <div className="d-flex">
        <Button component={Link} to="classification">
          Continue
        </Button>
      </div>
    </div>
  );
}

export default Location;
