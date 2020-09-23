import React, { Component } from 'react';
import {
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from '@material-ui/core';

export interface Props {
  text?: string;
}

export class Loader extends Component<Props> {
  render() {
    const { text = 'Loading' } = this.props;
    return (
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          justifyItems: 'center',
          height: '100%',
          width: '100%',
          position: 'absolute',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            justifyItems: 'center',
          }}
        >
          <Card>
            <CardContent>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  justifyItems: 'center',
                  marginBottom: 10,
                }}
              >
                <CircularProgress />
              </div>
              <Typography>{text}...</Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}
