import React, { Component } from "react";
import { Collapse, List, ListItem, ListItemText } from "@material-ui/core";
import CategoryIcon from "@material-ui/icons/Category";
import LocationIcon from "@material-ui/icons/LocationOn";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import PropTypes from "prop-types";

let toggling = false;

class LocationsListItem extends Component {
  state = {
    open: false,
    toggling: false
  };

  _onCategoryClick = () => {
    const { category, onCategoryClick } = this.props;
    if (toggling) return (toggling = false);
    if (onCategoryClick) onCategoryClick(category.id);
  };

  _onLocationClick = id => {
    const { category, onLocationClick } = this.props;
    if (onLocationClick) onLocationClick(category.id, id);
  };

  _onToggleClick = () => {
    toggling = true;
    const { open } = this.state;
    this.setState({ open: !open });
  };

  render() {
    const { open } = this.state;
    const { category } = this.props;

    const color = category.color || "#000000";

    return (
      <div>
        <ListItem button onClick={this._onCategoryClick}>
          <CategoryIcon style={{ color }} />
          <ListItemText
            inset
            primary={category.name}
            secondary={category.text}
            style={{ wordBreak: "break-all" }}
          />
          {!!category.locations.length && (
            <div onClick={this._onToggleClick}>
              {open ? <ExpandLess /> : <ExpandMore />}
            </div>
          )}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List>
            {category.locations
              .sort((a, b) => {
                let lessThan = a.name.toLowerCase() < b.name.toLowerCase();
                let greaterThan = a.name.toLowerCase() > b.name.toLowerCase();
                return lessThan ? -1 : greaterThan ? 1 : 0;
              })
              .map(location => (
                <ListItem
                  key={location.id}
                  button
                  style={{ paddingLeft: 30 }}
                  onClick={() => this._onLocationClick(location.id)}
                >
                  <LocationIcon style={{ color }} />
                  <ListItemText
                    inset
                    primary={location.name}
                    secondary={location.text}
                    style={{ wordBreak: "break-all" }}
                  />
                </ListItem>
              ))}
          </List>
        </Collapse>
      </div>
    );
  }
}

LocationsListItem.propTypes = {
  category: PropTypes.object.isRequired,
  onCategoryClick: PropTypes.func,
  onLocationClick: PropTypes.func
};

export default LocationsListItem;
