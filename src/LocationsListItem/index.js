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

  _onClick = () => {
    const { category, onClick } = this.props;
    if (toggling) return (toggling = false);
    if (onClick) onClick(category.id);
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
        <ListItem button onClick={this._onClick}>
          <CategoryIcon style={{ color }} />
          <ListItemText inset primary={category.name} />
          <div onClick={this._onToggleClick}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </div>
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List>
            {category.locations.map(location => (
              <ListItem key={location.id} button style={{ paddingLeft: 30 }}>
                <LocationIcon style={{ color }} />
                <ListItemText inset primary={location.name} />
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
  onClick: PropTypes.func
};

export default LocationsListItem;
