import React, { Component } from 'react';
import { Divider, Typography, Snackbar } from '@material-ui/core';
import { ImportFromGoogleMaps, ProcessInvalidLocations } from './';

export interface Props {}

export interface State {
  expanded?: string;
  errorSnackbarOpened: boolean;
  errorSnackbarText: string;
}

export class LocationSettings extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      errorSnackbarOpened: false,
      errorSnackbarText: '',
    };
  }

  setExpanded = (expanded?: string) => {
    this.setState((previousState) => {
      if (
        previousState.expanded === 'importFromGoogleMaps' &&
        expanded !== 'importFromGoogleMaps'
      ) {
        return {
          errorSnackbarOpened: true,
          errorSnackbarText:
            'Please finish importing locations from Google Maps before changing other settings.',
        };
      }
      return {
        ...previousState,
        expanded: previousState.expanded !== expanded ? expanded : undefined,
      };
    });
  };

  render() {
    const { expanded } = this.state;
    const { errorSnackbarOpened, errorSnackbarText } = this.state;
    return (
      <>
        <Typography variant="h4">Location Settings</Typography>
        <Divider style={{ marginTop: 10, marginBottom: 10 }} />
        <ImportFromGoogleMaps
          expanded={expanded === 'importFromGoogleMaps'}
          onExpand={() => this.setExpanded('importFromGoogleMaps')}
        />
        <ProcessInvalidLocations
          expanded={expanded === 'processInvalidLocations'}
          onExpand={() => this.setExpanded('processInvalidLocations')}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={errorSnackbarOpened}
          autoHideDuration={5000}
          onClose={() => this.setState({ errorSnackbarOpened: false })}
          message={errorSnackbarText}
        />
      </>
    );
  }
}
