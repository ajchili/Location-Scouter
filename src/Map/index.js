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
  Tooltip,
  Typography
} from "@material-ui/core";
import AddLocationIcon from "@material-ui/icons/AddLocation";
import LocationIcon from "@material-ui/icons/LocationOn";
import GoogleMapReact from "google-map-react";
import PropTypes from "prop-types";

const iconSize = 50;

const NewLocation = ({
  name,
  onNameChange,
  onCancel,
  onCreate,
  categories,
  category,
  onCategoryChange,
  error
}) => {
  let categoryData = category && categories.find(a => a.id === category);
  let color = (categoryData && categoryData.color) || "#000000";
  return (
    <div style={{ position: "absolute" }}>
      <AddLocationIcon
        style={{
          color,
          width: iconSize,
          height: iconSize,
          transform: "translate(-50%, -100%)"
        }}
      />
      <Card
        style={{
          minWidth: 255,
          transform: `translate(${iconSize / 2}px, -50%)`
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
};

const Location = ({ name, color }) => (
  <Tooltip
    title={name}
    style={{ position: "absolute", transform: "translate(-50%, -50%)" }}
  >
    <LocationIcon
      style={{
        color: color,
        width: iconSize / 2,
        height: iconSize / 2
      }}
    />
  </Tooltip>
);

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
              zoom: 15
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
