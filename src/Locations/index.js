import React, { Component } from "react";
import LocationsList from "../LocationsList";
import Map from "../Map";
import CreateCategoryDialog from "../CreateCategoryDialog";
import EditCategoryDialog from "../EditCategoryDialog";
import firebase from "../firebase";

class Locations extends Component {
  state = {
    createCategoryDialogOpen: false,
    editCategoryDialogOpen: false,
    coords: null,
    categories: [],
    editCategory: false
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
            let category = { id: doc.id, ...doc.data() };
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
              console.error(`Unable to load locations for category ${category.name}!`);
            } finally {
              categories.push(category);
              this.setState({ categories });
            }
          }
        });
    }
  }

  _onMapClick = coords => {
    this.setState({ coords });
  };

  _onCategoryClick = id => {
    this.setState({ editCategory: id, editCategoryDialogOpen: true });
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
            const { categories } = this.state;
            categories.push({ id: documentRef.id, ...data });
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
      case "obejct":
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
    let data = { name, category: category.id };
    firebase
      .firestore()
      .collection("locations")
      .add(data)
      .then(databaseRef => {
        const location = { id: databaseRef.id, ...data };
        if (category.locations) category.locations.push(location);
        else category.locations = [location];
        console.log(categories);
      });
    this.setState({ coords: null });
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
      coords,
      categories,
      editCategory
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
