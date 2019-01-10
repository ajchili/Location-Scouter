import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import "./Map.css";

export default class extends Component {
  render() {
    return (
      <div className="map">
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_KEY }}
          defaultCenter={{
            lat: 39.8283,
            lng: -98.5795
          }}
          defaultZoom={5}
        />
      </div>
    );
  }
}
