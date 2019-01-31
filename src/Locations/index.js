import React, { Component } from "react";
import LocationsList from "../LocationsList";
import Map from "../Map";
import CreateLocationHereDialog from "../CreateLocationHereDialog";

class Locations extends Component {
  state = {
    createLocationHereDialogOpen: false,
    coords: null
  };

  _onMapClick = coords => {
    this.setState({ createLocationHereDialogOpen: true, coords });
  };

  _onCreateLocationHereDialogClosed = value => {
    this.setState({ createLocationHereDialogOpen: false });
  };

  render() {
    const { createLocationHereDialogOpen } = this.state;
    return (
      <div style={styles.content}>
        <CreateLocationHereDialog
          open={createLocationHereDialogOpen}
          onClose={this._onCreateLocationHereDialogClosed}
        />
        <div style={styles.map}>
          <Map onClick={this._onMapClick} />
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
