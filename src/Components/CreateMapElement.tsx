import React, { Component } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from '@material-ui/core';

export interface Props {
  defaultName?: string;
  onCancel: () => void;
  onCreate: (name: string) => void;
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
    const { onCancel, onCreate } = this.props;
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
              e.stopPropagation();
              onCreate(elementName);
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
