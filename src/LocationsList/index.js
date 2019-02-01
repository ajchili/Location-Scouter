import React, { Component } from "react";
import { AppBar, Fab, List, Toolbar, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CreateNewDialog from "../CreateNewDialog";
import LocationsListItem from "../LocationsListItem";
import PropTypes from "prop-types";

class LocationList extends Component {
  state = {
    createNewDialogOpen: false
  };

  _onCreateNewDialogClose = value => {
    const { shouldShowDialog } = this.props;
    if (shouldShowDialog) shouldShowDialog(value);
    this.setState({ createNewDialogOpen: false });
  };

  render() {
    const { createNewDialogOpen } = this.state;
    const { categories } = this.props;

    return (
      <div style={styles.content}>
        <CreateNewDialog
          open={createNewDialogOpen}
          onClose={this._onCreateNewDialogClose}
        />
        <List position="fixed" style={styles.list}>
          {categories
            .sort((a, b) => {
              let lessThan = a.name.toLowerCase() < b.name.toLowerCase();
              let greaterThan = a.name.toLowerCase() > b.name.toLowerCase();
              return lessThan ? -1 : greaterThan ? 1 : 0;
            })
            .map(category => (
              <LocationsListItem
                key={category.id}
                category={category}
                onCategoryClick={this.props.onCategoryClick}
                onLocationClick={this.props.onLocationClick}
              />
            ))}
        </List>
        <AppBar position="fixed" color="default" style={styles.AppBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className="grow">
              Locations
            </Typography>
            <Fab
              color="secondary"
              aria-label="add"
              style={styles.fabButton}
              onClick={() => this.setState({ createNewDialogOpen: true })}
            >
              <AddIcon />
            </Fab>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

LocationList.propTypes = {
  categories: PropTypes.array,
  onCategoryClick: PropTypes.func,
  onLocationClick: PropTypes.func,
  shouldShowDialog: PropTypes.func
};

const styles = {
  content: {
    width: "100%",
    height: "100%"
  },
  AppBar: {
    width: "25%",
    top: "auto",
    bottom: 0
  },
  fabButton: {
    position: "absolute",
    zIndex: 1,
    top: -30,
    right: 10,
    margin: "0 auto"
  },
  list: {
    width: "25%",
    height: "calc(100vh - 144px)",
    position: "absolute",
    overflowY: "scroll",
    top: 64,
    right: 0
  }
};

export default LocationList;
