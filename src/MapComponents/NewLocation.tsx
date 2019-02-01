import React, {Component} from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@material-ui/core";
import AddLocationIcon from "@material-ui/icons/AddLocation";
import {iconSize} from "./";

class NewLocation extends Component<any, any> {
  constructor(props: {
    name: string,
    error?: string,
    category: string,
    categories: Array<any>,
    onCancel: () => void
    onCategoryChange: (id: string) => void
    onNameChange: (name: string) => void,
    onCreate: () => void
  }) {
    super(props);
  }

  render() {
    const {
      name,
      error,
      category,
      categories,
      onCancel,
      onCategoryChange,
      onNameChange,
      onCreate
    } = this.props;
    let categoryData = category && categories.find((a: any) => a.id === category);
    let color: string = (categoryData && categoryData.color) || "#000000";

    return (
      <div style={{position: "absolute"}}>
        <AddLocationIcon
          style={{
            color,
            width: iconSize,
            height: iconSize,
            transform: "translate(-50%, -100%)"
          }}
        />
        <Card
          style={{
            minWidth: 255,
            transform: `translate(${iconSize / 2}px, -50%)`
          }}
        >
          <CardContent>
            <Typography variant="h5" component="h2">
              Create New Location
            </Typography>
            {error && (
              <Typography color="secondary" gutterBottom>
                {error}
              </Typography>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="Location Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e: any) => {
                onNameChange(e.target.value);
              }}
            />
            <FormControl style={{width: "100%"}}>
              <InputLabel>Category</InputLabel>
              <Select
                margin="dense"
                fullWidth
                value={category}
                onChange={(e: any) => {
                  onCategoryChange(e.target.value);
                }}
              >
                {categories.map((category: any) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
          <CardActions>
            <Button color="primary" size="small" onClick={onCancel}>
              Cancel
            </Button>
            <Button color="primary" size="small" onClick={onCreate}>
              Create
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default NewLocation;
