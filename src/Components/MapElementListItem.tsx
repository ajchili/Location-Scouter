import React, { Component } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  ListItem,
} from '@material-ui/core';
import { Delete, FindInPage } from '@material-ui/icons';
import { MapElement } from '../lib/types';
import { LocationManagerService, MappingService } from '../Services';

export interface Props {
  mapElement: MapElement;
}

export class MapElementListItem extends Component<Props> {
  render() {
    const { mapElement } = this.props;
    return (
      <ListItem style={{ width: '100%' }}>
        <Card style={{ width: '100%' }} variant="outlined">
          <CardHeader title={mapElement.name} />
          <CardActions disableSpacing>
            <IconButton
              aria-label="show element on map"
              onClick={() => {
                LocationManagerService.selectLocation(mapElement);
              }}
            >
              <FindInPage />
            </IconButton>
            <IconButton
              aria-label="delete map element"
              onClick={() => {
                LocationManagerService.selectLocation(mapElement);
                setTimeout(() => {
                  if (
                    window.confirm(
                      `Are you sure that you want to delete "${mapElement.name}"? This is a non-reversible process!`
                    ) === true
                  ) {
                    LocationManagerService.deleteLocation(mapElement.id);
                  }
                }, 0);
              }}
            >
              <Delete />
            </IconButton>
          </CardActions>
        </Card>
      </ListItem>
    );
  }
}
