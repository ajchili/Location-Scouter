import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import PropTypes from "prop-types";
import { Location, NewLocation } from "../MapComponents";

class Map extends Component {
  state = {
    newLocationName: "",
    newLocationCategory: "",
    error: "",
    center: null,
    zoom: 5
  };

  componentWillReceiveProps(props) {
    const { newLocation } = props;
    if (newLocation) {
      this.setState({ center: { lat: newLocation.lat, lng: newLocation.lng } });
    }
  }

  _onNewLocationNameChange = e => {
    this.setState({ newLocationName: e.target.value });
  };

  _onNewLocationCategoryChange = e => {
    this.setState({ newLocationCategory: e.target.value });
  };

  _reset = () => {
    this.setState({
      newLocationName: "",
      newLocationCategory: "",
      error: ""
    });
  };

  _cancel = () => {
    const { onCreateNewLocationCanceled } = this.props;
    if (onCreateNewLocationCanceled) {
      onCreateNewLocationCanceled();
      this._reset();
    }
  };

  _create = () => {
    const { newLocationName, newLocationCategory } = this.state;
    const { onCreateNewLocation } = this.props;
    if (onCreateNewLocation) {
      if (newLocationName.length && newLocationCategory.length) {
        onCreateNewLocation(newLocationName, newLocationCategory);
        this._reset();
      } else {
        this.setState({
          error: "A name and category are required to create a new location!"
        });
      }
    }
  };

  render() {
    const {
      newLocationName,
      newLocationCategory,
      error,
      center,
      zoom
    } = this.state;
    const { onClick, newLocation, categories } = this.props;

    return (
      <div style={styles.fill}>
        <GoogleMapReact
          onClick={newLocation ? null : onClick}
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_KEY }}
          defaultCenter={{
            lat: 39.8283,
            lng: -98.5795
          }}
          defaultZoom={5}
          center={center}
          zoom={zoom}
          onChange={change => {
            this.setState({ center: change.center, zoom: change.zoom });
          }}
          onChildClick={(key, childProps) => {
            if (newLocation) return;
            this.setState({
              center: { lat: childProps.lat, lng: childProps.lng },
              zoom: zoom >= 15 ? zoom : 15
            });
          }}
        >
          {newLocation && (
            <NewLocation
              lat={newLocation.lat}
              lng={newLocation.lng}
              name={newLocationName}
              onNameChange={this._onNewLocationNameChange}
              onCancel={this._cancel}
              onCreate={this._create}
              categories={categories || []}
              category={newLocationCategory}
              onCategoryChange={this._onNewLocationCategoryChange}
              error={error}
            />
          )}
          {!newLocation &&
            categories.map(category => {
              return category.locations.map(location => {
                return (
                  <Location
                    key={location.id}
                    name={location.name}
                    color={category.color || "#000000"}
                    lat={location.lat}
                    lng={location.lng}
                  />
                );
              });
            })}
        </GoogleMapReact>
      </div>
    );
  }
}

Map.propTypes = {
  onClick: PropTypes.func,
  newLocation: PropTypes.object,
  onCreateNewLocationCanceled: PropTypes.func,
  onCreateNewLocation: PropTypes.func,
  categories: PropTypes.array
};

const styles = {
  fill: {
    width: "100%",
    height: "100%"
  }
};

export default Map;
