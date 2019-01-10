import React, { Component } from "react";
import LocationsList from "../LocationsList";
import Map from "../Map";

class Locations extends Component {
  render() {
    return (
      <div style={styles.content}>
        <div style={styles.map}>
          <Map />
        </div>
        <div style={styles.list}>
          <LocationsList />
        </div>
      </div>
    );
  }
}

const styles = {
  content: {
    width: "100%",
    height: "calc(100vh - 64px)"
  },
  map: {
    width: "75%",
    height: "100%"
  },
  list: {
    width: "25%"
  }
};

export default Locations;
