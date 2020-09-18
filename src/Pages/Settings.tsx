import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Container } from '@material-ui/core';
import { AppBar, LocationSettings } from '../Components';

export interface Props extends RouteComponentProps {}

export class Settings extends Component<Props> {
  render() {
    const { history } = this.props;
    return (
      <>
        <AppBar history={history} page="Settings"></AppBar>
        <Container maxWidth="sm" style={{ marginTop: 10 }}>
          <LocationSettings />
        </Container>
      </>
    );
  }
}
