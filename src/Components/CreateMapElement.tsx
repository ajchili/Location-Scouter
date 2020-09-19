import React, { Component } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  colors,
  TextField,
  Typography,
} from '@material-ui/core';
import { MapIcon } from './';
import { BasicMapComponentProps } from '../lib/types';

export interface Props extends BasicMapComponentProps {
  defaultName?: string;
  minWidth?: number;
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
    const { lat, lng, minWidth = 250, onCancel, onCreate } = this.props;
    const { elementName } = this.state;

    return (
      <>
        <MapIcon color={colors.pink['500']} lat={lat} lng={lng} />
        <Card
          style={{
            minWidth: minWidth,
            position: 'absolute',
            left: -minWidth / 2,
            top: 10,
          }}
        >
          <CardContent>
            <Typography gutterBottom>Create a new map Element</Typography>
            <TextField
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
        <Card
          style={{
            minHeight: minWidth * 2,
            minWidth: minWidth * 2,
            position: 'absolute',
            left: minWidth / 2 + 10,
            top: -minWidth / 2 - 20,
          }}
        >
          <CardContent
            style={{
              height: 500 - 16 * 2,
              width: 500 - 16 * 2,
            }}
          ></CardContent>
        </Card>
      </>
    );
  }
}
