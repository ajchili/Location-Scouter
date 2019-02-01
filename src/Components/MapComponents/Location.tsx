import React, {Component} from "react";
import {
  Tooltip
} from "@material-ui/core";
import LocationIcon from "@material-ui/icons/LocationOn";
import {iconSize} from "./";

class Location extends Component<any, any> {
  constructor(props: { name: string, color: string }) {
    super(props);
  }

  render() {
    const {name, color} = this.props;

    return (
      <Tooltip title={name}>
        <LocationIcon
          style={{
            color,
            width: iconSize / 2,
            height: iconSize / 2,
            transform: "translate(-50%, -100%)"
          }}
        />
      </Tooltip>
    );
  }
}

export default Location;