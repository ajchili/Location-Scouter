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
import { Delete, Edit, FindInPage } from '@material-ui/icons';
import { MapElement } from '../lib/types';

export interface Props {
  mapElement: MapElement;
  onClick: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export class MapElementListItem extends Component<Props> {
  render() {
    const { mapElement, onClick, onDelete, onEdit } = this.props;
    return (
      <ListItem style={{ width: '100%' }}>
        <Card style={{ width: '100%' }} variant="outlined">
          <CardHeader title={mapElement.name} />
          <CardActions disableSpacing>
            <IconButton
              aria-label="show element on map"
              onClick={() => onClick(mapElement.id)}
            >
              <FindInPage />
            </IconButton>
            <IconButton
              aria-label="edit map element"
              onClick={() => {
                if (onEdit) {
                  onEdit(mapElement.id);
                }
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              aria-label="delete map element"
              onClick={() => {
                if (onDelete) {
                  onDelete(mapElement.id);
                }
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
