import React, { Component } from 'react';
import {
  Card,
  CardContent,
  List,
  Fab,
  Theme,
  TextField,
} from '@material-ui/core';
import {
  withTheme,
  withStyles,
  StyledComponentProps,
} from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import { MapElementListItem } from '../Components';

export interface Props extends StyledComponentProps {
  locations: any[];
}

export interface State {
  filter: string;
}

const styles = (theme: Theme) => ({
  parent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxHeight: '100%',
    width: '100%',
    overflow: 'hidden',
  },
  listParent: {
    display: 'flex',
    flex: 1,
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
    zIndex: 1000,
  },
  searchCard: {
    width: '100%',
  },
  list: {
    height: '100%',
    overflowY: 'scroll',
    width: '100%',
  },
  fab: {
    bottom: theme.spacing(1),
    position: 'absolute',
    right: theme.spacing(1),
  },
});

export class MapElementList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      filter: '',
    };
  }

  render() {
    const { classes = {}, locations } = this.props;
    const { filter } = this.state;

    return (
      <div className={classes.parent}>
        <div className={classes.listParent}>
          <Card className={classes.searchCard}>
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
        <List className={classes.list}>
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
              />
            ))}
        </List>
        <Fab className={classes.fab}>
          <Add />
        </Fab>
      </div>
    );
  }
}

export default withTheme(
  // @ts-ignore
  withStyles(styles, { withTheme: true })(MapElementList)
);
