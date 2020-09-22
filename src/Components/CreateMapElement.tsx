import React, { Component } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from '@material-ui/core';
import { LocationManagerService } from '../Services';

export interface Props {
  defaultName?: string;
  position: google.maps.LatLngLiteral;
  onCancel: () => void;
}

export interface State {
  elementName: string;
}

export class CreateMapElement extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { elementName: props.defaultName || '' };
  }

  render() {
    const { onCancel } = this.props;
    const { elementName } = this.state;

    return (
      <Card style={{ height: '100%', width: '100%' }}>
        <CardContent>
          <Typography gutterBottom>Create a new map Element</Typography>
          <TextField
            fullWidth
            label="Element Name"
            value={elementName}
            onChange={(e) => this.setState({ elementName: e.target.value })}
          />
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            disabled={elementName.length === 0}
            onClick={(e) => {
              const { position } = this.props;
              const { elementName: name } = this.state;
              e.stopPropagation();
              LocationManagerService.createItem({
                ...position,
                name,
              });
            }}
          >
            Create
          </Button>
          <Button
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
          >
            Cancel
          </Button>
        </CardActions>
      </Card>
    );
  }
}
