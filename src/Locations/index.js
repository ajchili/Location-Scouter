import React, { Component } from "react";
import LocationsList from "../LocationsList";
import Map from "../Map";
import CreateLocationHereDialog from "../CreateLocationHereDialog";
import CreateCategoryDialog from "../CreateCategoryDialog";
import firebase from "../firebase";

class Locations extends Component {
  state = {
    createLocationHereDialogOpen: false,
    createCategoryDialogOpen: false,
    coords: null,
    categories: []
  };

  componentDidMount() {
    let user = firebase.auth().currentUser;
    if (user) {
      firebase
        .firestore()
        .collection("categories")
        .where("owner", "==", user.uid)
        .get()
        .then(querySnapshot => {
          querySnapshot.docs.forEach(doc => {
            let { categories } = this.state;
            categories.push({ id: doc.id, ...doc.data() });
            this.setState({ categories });
          });
        });
    }
  }

  _onMapClick = coords => {
    this.setState({ createLocationHereDialogOpen: true, coords });
  };

  _onCreateLocationHereDialogClosed = value => {
    this.setState({ createLocationHereDialogOpen: false });
  };

  _onCreateCategoryDialogClosed = value => {
    this.setState({ createCategoryDialogOpen: false });
    let user = firebase.auth().currentUser;
    if (user) {
      let data = {
        owner: user.uid,
        name: value
      };
      firebase
        .firestore()
        .collection("categories")
        .add(data)
        .then(documentRef => {
          const { categories } = this.state;
          categories.push({ id: documentRef.id, ...data });
          this.setState({ categories });
        });
    }
  };

  _shouldShowDialog = dialogName => {
    if (dialogName === "category") {
      this.setState({ createCategoryDialogOpen: true });
    }
  };

  render() {
    const {
      createLocationHereDialogOpen,
      createCategoryDialogOpen,
      categories
    } = this.state;
    return (
      <div style={styles.content}>
        <CreateLocationHereDialog
          open={createLocationHereDialogOpen}
          onClose={this._onCreateLocationHereDialogClosed}
        />
        <CreateCategoryDialog
          open={createCategoryDialogOpen}
          onClose={this._onCreateCategoryDialogClosed}
        />
        <div style={styles.map}>
          <Map onClick={this._onMapClick} />
        </div>
        <div style={styles.list}>
          <LocationsList
            categories={categories}
            shouldShowDialog={this._shouldShowDialog}
          />
        </div>
      </div>
    );
  }
}

const styles = {
  content: {
    width: "100%",
    height: "calc(100vh - 64px)"
  },
  map: {
    width: "75%",
    height: "100%"
  },
  list: {
    width: "25%"
  }
};

export default Locations;
