import React, { Component } from 'react';
import {
  IconButton,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';
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
      <ListItem
        button
        onClick={(e) => {
          e.stopPropagation();
          onClick(mapElement.id);
        }}
      >
        <ListItemText>{mapElement.name}</ListItemText>
        <ListItemSecondaryAction>
          <IconButton
            onClick={() => {
              if (onEdit) {
                onEdit(mapElement.id);
              }
            }}
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => {
              if (onDelete) {
                onDelete(mapElement.id);
              }
            }}
          >
            <Delete />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}
