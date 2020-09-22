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
  id: string;
  name: string;
}

export interface State {
  elementName: string;
}

export class EditMapElement extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { elementName: props.name };
  }

  get canUpdate(): boolean {
    return (
      this.state.elementName.length > 0 &&
      this.state.elementName !== this.props.name
    );
  }

  render() {
    const { id } = this.props;
    const { elementName } = this.state;

    return (
      <Card style={{ height: '100%', width: '100%' }}>
        <CardContent>
          <Typography gutterBottom>Map Element Properties</Typography>
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
            disabled={!this.canUpdate}
            onClick={(e) => {
              e.stopPropagation();
              LocationManagerService.updateItem(id, { name: elementName });
            }}
          >
            Save
          </Button>
          <Button
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              LocationManagerService.deselectLocation();
            }}
          >
            Cancel
          </Button>
        </CardActions>
      </Card>
    );
  }
}
