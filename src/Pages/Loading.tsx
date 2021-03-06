import React, { Component } from 'react';
import { CircularProgress, Grid, Paper, Typography } from '@material-ui/core';

export class Loading extends Component {
  render() {
    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          height: '100%',
        }}
      >
        <Grid item>
          <Paper elevation={3} variant="outlined" style={{ padding: 20 }}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Grid item>
                <CircularProgress></CircularProgress>
              </Grid>
              <Grid item>
                <Typography>Loading Location Scouter...</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}
