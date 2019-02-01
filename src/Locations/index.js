import React, { Component } from "react";
import LocationsList from "../LocationsList";
import Map from "../Map";
import CreateCategoryDialog from "../CreateCategoryDialog";
import EditCategoryDialog from "../EditCategoryDialog";
import EditLocationDialog from "../EditLocationDialog";
import firebase from "../firebase";

class Locations extends Component {
  state = {
    createCategoryDialogOpen: false,
    editCategoryDialogOpen: false,
    editLocationDialogOpen: false,
    coords: null,
    categories: [],
    editCategory: false,
    editLocation: false
  };

  componentDidMount() {
    let user = firebase.auth().currentUser;
    if (user) {
      firebase
        .firestore()
        .collection("categories")
        .where("owner", "==", user.uid)
        .get()
        .then(async querySnapshot => {
          for (let i = 0; i < querySnapshot.docs.length; i++) {
            let { categories } = this.state;
            const doc = querySnapshot.docs[i];
            let isShared = !!doc.data().viewers;
            let category = {
              id: doc.id,
              ...doc.data(),
              locations: [],
              text: isShared ? "Shared" : "Private"
            };
            try {
              let locationsQuerySnapshot = await firebase
                .firestore()
                .collection("locations")
                .where("category", "==", doc.id)
                .get();
              category.locations = locationsQuerySnapshot.docs.map(doc => {
                return { id: doc.id, ...doc.data() };
              });
            } catch (err) {
              console.error(
                `Unable to load locations for category ${category.name}!`
              );
            } finally {
              categories.push(category);
              this.setState({ categories });
            }
          }
        });
    }
  }

  _onMapClick = coords => {
    const width = window.innerWidth * 0.75 - 50;
    const height = window.innerHeight - 128;
    if (coords.x <= width && coords.y <= height) this.setState({ coords });
  };

  _onCategoryClick = id => {
    this.setState({ editCategory: id, editCategoryDialogOpen: true });
  };

  _onLocationClick = (categoryId, id) => {
    const { categories } = this.state;
    let category = categories.find(category => category.id === categoryId);
    if (category) {
      let location = category.locations.find(location => location.id === id);
      if (location) {
        this.setState({ editLocationDialogOpen: true, editLocation: location });
      }
    }
  };

  _onCreateCategoryDialogClosed = value => {
    this.setState({ createCategoryDialogOpen: false });
    if (value) {
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
            let { categories } = this.state;
            categories.push({ id: documentRef.id, ...data, locations: [] });
            this.setState({ categories });
          });
      }
    }
  };

  _onEditCategoryDialogClosed = value => {
    const { editCategory } = this.state;
    this.setState({ editCategory: null, editCategoryDialogOpen: false });
    switch (typeof value) {
      case "string":
        firebase
          .firestore()
          .collection("categories")
          .doc(editCategory)
          .delete()
          .then(() => {
            let { categories } = this.state;
            this.setState({
              categories: categories.filter(
                category => category.id !== editCategory
              )
            });
          });
        break;
      case "object":
        firebase
          .firestore()
          .collection("categories")
          .doc(value.id)
          .update({ name: value.name, color: value.color })
          .then(() => {
            let { categories } = this.state;
            let category = categories.find(
              category => category.id === value.id
            );
            category.name = value.name;
            category.color = value.color;
            this.setState({ categories });
          });
        break;
      default:
        break;
    }
  };

  _onCreateNewLocationCanceled = () => {
    this.setState({ coords: null });
  };

  _onCreateNewLocation = (name, selectedCategory) => {
    const { coords, categories } = this.state;
    let category = categories.find(
      category => category.id === selectedCategory
    );
    let data = {
      name,
      category: category.id,
      lat: coords.lat,
      lng: coords.lng
    };
    firebase
      .firestore()
      .collection("locations")
      .add(data)
      .then(databaseRef => {
        const location = { id: databaseRef.id, ...data };
        if (category.locations) category.locations.push(location);
        else category.locations = [location];
        this.setState({ categories });
      });
    this.setState({ coords: null });
  };

  _onEditLocationDialogClosed = value => {
    const { categories, editLocation } = this.state;
    this.setState({ editLocation: false, editLocationDialogOpen: false });
    switch (typeof value) {
      case "string":
        firebase
          .firestore()
          .collection("locations")
          .doc(editLocation.id)
          .delete()
          .then(() => {
            let category = categories.find(
              category => category.id === editLocation.category
            );
            category.locations = category.locations.filter(
              location => location.id !== editLocation.id
            );
            this.setState({ categories });
          });
        break;
      case "object":
        let category = categories.find(
          category => category.id === editLocation.category
        );
        category.locations = category.locations.filter(
          location => location.id !== editLocation.id
        );
        let location = category.locations.find(
          location => location.id === editLocation.id
        );
        location = JSON.parse(JSON.stringify(value));
        delete value.id;
        categories
          .find(category => category.id === location.category)
          .locations.push(location);
        firebase
          .firestore()
          .collection("locations")
          .doc(editLocation.id)
          .set(value)
          .then(() => {
            this.setState({ categories });
          });
        break;
      default:
        break;
    }
  };

  _shouldShowDialog = dialogName => {
    if (dialogName === "category") {
      this.setState({ createCategoryDialogOpen: true });
    }
  };

  render() {
    const {
      createCategoryDialogOpen,
      editCategoryDialogOpen,
      editLocationDialogOpen,
      coords,
      categories,
      editCategory,
      editLocation
    } = this.state;

    return (
      <div style={styles.content}>
        <CreateCategoryDialog
          open={createCategoryDialogOpen}
          onClose={this._onCreateCategoryDialogClosed}
        />
        {editCategory && (
          <EditCategoryDialog
            open={editCategoryDialogOpen}
            onClose={this._onEditCategoryDialogClosed}
            category={categories.find(category => category.id === editCategory)}
          />
        )}
        {editLocation && (
          <EditLocationDialog
            open={editLocationDialogOpen}
            onClose={this._onEditLocationDialogClosed}
            location={editLocation}
            categories={categories}
          />
        )}
        <div style={styles.map}>
          <Map
            onClick={this._onMapClick}
            newLocation={coords}
            onCreateNewLocationCanceled={this._onCreateNewLocationCanceled}
            onCreateNewLocation={this._onCreateNewLocation}
            categories={categories}
          />
        </div>
        <div style={styles.list}>
          <LocationsList
            categories={categories}
            onCategoryClick={this._onCategoryClick}
            onLocationClick={this._onLocationClick}
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
