import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import PropTypes from "prop-types";

class Map extends Component {
  render() {
    const { onClick } = this.props;

    return (
      <div style={styles.fill}>
        <GoogleMapReact
          onClick={onClick}
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

Map.propTypes = {
  onClick: PropTypes.func
};

const styles = {
  fill: {
    width: "100%",
    height: "100%"
  }
};

export default Map;
