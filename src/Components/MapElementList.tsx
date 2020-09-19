import React, { Component } from 'react';
import {
  Card,
  CardContent,
  List,
  TextField,
} from '@material-ui/core';
import 'firebase/auth';
import 'firebase/firestore';
import { MapElementListItem } from '.';

export interface Props {
  locations: any[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export interface State {
  filter: string;
}

export class MapElementList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      filter: '',
    };
  }

  render() {
    const { locations, onDelete, onEdit } = this.props;
    const { filter } = this.state;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          maxHeight: '100%',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 10,
            width: 'calc(100% - 20px)',
            zIndex: 1000,
          }}
        >
          <Card style={{ width: '100%' }}>
            <CardContent>
              <TextField
                label="Search..."
                fullWidth
                onChange={(e) => this.setState({ filter: e.target.value })}
                value={filter}
              />
            </CardContent>
          </Card>
        </div>
        <List style={{ width: '100%', height: '100%', overflowY: 'scroll' }}>
          {locations
            .filter((location) => {
              const { name = 'Unnamed Element' } = location;
              return name.toLowerCase().includes(filter.toLowerCase());
            })
            .sort((a, b) => {
              const name1 = a.name || 'Unnamed Element';
              const name2 = b.name || 'Unnamed Element';
              if (name1 > name2) {
                return 1;
              } else if (name2 > name1) {
                return -1;
              }
              return 0;
            })
            .map((location) => (
              <MapElementListItem
                key={location.id}
                mapElement={{
                  id: location.id,
                  name: location.name || 'Unnamed Element',
                  lat: location.lat,
                  lng: location.lng,
                }}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
        </List>
      </div>
    );
  }
}
