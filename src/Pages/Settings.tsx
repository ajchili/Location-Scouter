import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { AppBar } from '../Components';

export interface Props extends RouteComponentProps {}

export class Settings extends Component<Props> {
  render() {
    const { history } = this.props;
    return (
      <div>
        <AppBar history={history} page="Settings"></AppBar>
      </div>
    );
  }
}
