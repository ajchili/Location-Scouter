import React, { Component } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@material-ui/core";
import LocationIcon from "@material-ui/icons/PinDrop";
import GoogleMapReact from "google-map-react";
import PropTypes from "prop-types";

const iconSize = 40;

const NewLocation = ({
  name,
  onNameChange,
  onCancel,
  onCreate,
  categories,
  category,
  onCategoryChange,
  error
}) => (
  <div>
    <LocationIcon
      style={{
        width: iconSize,
        height: iconSize,
        marginLeft: -iconSize / 2,
        marginTop: -iconSize / 2
      }}
    />
    <Card
      style={{
        minWidth: 255,
        marginLeft: iconSize / 2,
        marginTop: -iconSize
      }}
    >
      <CardContent>
        <Typography variant="h5" component="h2">
          Create New Location
        </Typography>
        {error && (
          <Typography color="secondary" gutterBottom>
            {error}
          </Typography>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="Location Name"
          type="text"
          fullWidth
          value={name}
          onChange={onNameChange}
        />
        <FormControl style={{ width: "100%" }}>
          <InputLabel>Category</InputLabel>
          <Select
            margin="dense"
            fullWidth
            value={category}
            onChange={onCategoryChange}
          >
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </CardContent>
      <CardActions>
        <Button color="primary" size="small" onClick={onCancel}>
          Cancel
        </Button>
        <Button color="primary" size="small" onClick={onCreate}>
          Create
        </Button>
      </CardActions>
    </Card>
  </div>
);

const Location = ({ color }) => (
  <LocationIcon
    style={{
      color: color,
      width: iconSize / 2,
      height: iconSize / 2,
      marginLeft: -iconSize / 4,
      marginTop: -iconSize / 4
    }}
  />
);

class Map extends Component {
  state = {
    newLocationName: "",
    newLocationCategory: "",
    error: ""
  };

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
    const { newLocationName, newLocationCategory, error } = this.state;
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
          {categories.map(category => {
            return category.locations.map(location => {
              return (
                <Location
                  key={location.id}
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
