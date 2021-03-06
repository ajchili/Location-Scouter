import React, { Component } from 'react';
import { colors } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { BasicMapComponentProps } from '../lib/types';

export interface Props extends BasicMapComponentProps {
  color?: string;
  highlighted?: boolean;
  onClick?: () => void;
  size?: number;
}

export class MapIcon extends Component<Props> {
  render() {
    const {
      color = colors.lightBlue['500'],
      highlighted = false,
      onClick = () => {},
      size = 30,
    } = this.props;
    const shadowSizeIncrement = 4;
    const shadowSize = size + shadowSizeIncrement;
    return (
      <div
        style={{
          cursor: 'pointer',
          zIndex: highlighted ? Number.MAX_SAFE_INTEGER : 'inherit',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <LocationOnIcon
          style={{
            color: '#FFFFFF',
            fontSize: shadowSize,
            left: -(shadowSize / 2),
            top: -shadowSize + shadowSizeIncrement / 2,
            position: 'absolute',
          }}
        />
        <LocationOnIcon
          style={{
            color,
            fontSize: size,
            left: -(size / 2),
            top: -size,
            position: 'absolute',
          }}
        />
      </div>
    );
  }
}
