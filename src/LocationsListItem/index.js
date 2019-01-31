import React, { Component } from "react";
import {
  Collapse,
  ListItem,
  ListItemText
} from "@material-ui/core";
import CategoryIcon from "@material-ui/icons/Category";
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
    const { onClick } = this.props;
    if (toggling) return (toggling = false);
    if (onClick) onClick();
  };

  _onToggleClick = () => {
    toggling = true;
    const { open } = this.state;
    this.setState({ open: !open });
  };

  render() {
    const { open } = this.state;
    const { category } = this.props;

    return (
      <div>
        <ListItem button onClick={this._onClick}>
          <CategoryIcon />
          <ListItemText inset primary={category.name} />
          <div onClick={this._onToggleClick}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </div>
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit />
      </div>
    );
  }
}

LocationsListItem.propTypes = {
  category: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

export default LocationsListItem;
