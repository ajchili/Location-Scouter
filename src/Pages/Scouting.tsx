import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { AppBar, LocationScoutingMap, MapElementList } from '../Components';
import { LocationManagerService } from '../Services';

export interface Props extends RouteComponentProps {}

export interface State {
  locations: any[];
}

export class Scouting extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      locations: LocationManagerService.collectionAsArray,
    };
  }

  componentDidMount() {
    ['itemsUpdated', 'itemsLoaded'].forEach((event: string) => {
      LocationManagerService.addListener(event, () => {
        this.setState({
          locations: LocationManagerService.collectionAsArray,
        });
      });
    });
    LocationManagerService.loadItems();
    window.addEventListener('resize', () => {
      this.forceUpdate();
    });
  }

  render() {
    const { history } = this.props;
    const { locations } = this.state;

    const isSmallScreen: boolean = window.document.body.offsetWidth < 768;

    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          flexFlow: 'column',
          height: '100vh',
        }}
      >
        <AppBar history={history} page="Scouting" />
        <div
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            flexFlow: isSmallScreen ? 'column' : 'row',
            height: '100%',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: 3,
              height: '100%',
            }}
          >
            <LocationScoutingMap locations={locations} />
          </div>
          <div
            style={{
              display: 'flex',
              flex: 1,
              maxHeight: isSmallScreen ? '35%' : '100%',
            }}
          >
            <MapElementList locations={locations} />
          </div>
        </div>
      </div>
    );
  }
}
