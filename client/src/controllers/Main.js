import React, { useState, useEffect } from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";
import { usePosition } from "use-position";
import useSocket from "use-socket.io-client";
import Classification from "./Classification";
import Location from "./Location";
import Identification from "./Identification";

var socket;

function Main() {
  //You can treat "useSocket" as "io"
  const [socket] = useSocket("http://localhost:3002", {
    //options
    autoConnect: false,
  });

  //connect socket
  socket.connect();

  const { latitude, longitude, timestamp, accuracy, error } = usePosition(
    false
  );
  const [lnglat, setLngLat] = useState(["", ""]);
  const [city, setCity] = useState("");

  useEffect(() => {
    console.log("useEffect called with ", longitude, latitude);
    if (!isNaN(parseFloat(longitude)) && !isNaN(parseFloat(latitude))) {
      setLngLat([longitude, latitude]);
    }
  }, [longitude, latitude]);

  console.log("In main", lnglat);
  const updateLngLat = (event) => {
    setLngLat(event);
  };
  
  const updateCity = (event) => {
    setCity(event);
  }

  return (
    <HashRouter>
      <div>
        <div className="row">
          <div className="col-xs-offset-2 col-xs-8">
            <img
              className="mx-auto d-block"
              src="logo.svg"
              alt="misplaced wheels logo"
              id="logo"
            />
          </div>
          <div className="d-flex align-items-end col-xs-2">
            <div id="city_name">{city}</div>
          </div>
          <br />
          <br />
        </div>
        <ul className="header">
          <li>
            <NavLink exact to="/">
              Location
            </NavLink>
          </li>
          <li>
            <NavLink to="/classification">Classification</NavLink>
          </li>
          <li>
            <NavLink to="/identification">Identification</NavLink>
          </li>
        </ul>
        <div className="content">
          <Route
            exact
            path="/"
            render={(props) => (
              <Location
                {...props}
                lnglat={lnglat}
                updateLngLat={updateLngLat}
              />
            )}
          />
          <Route
            path="/classification"
            render={(props) => (
              <Classification {...props} lnglat={lnglat} socket={socket} updateCity={updateCity} />
            )}
          />
          <Route path="/identification" component={Identification} />
        </div>
      </div>
    </HashRouter>
  );
}

export default Main;