import React, { Component } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export interface Props {
  expanded: boolean;
  onExpand: () => void;
}

export interface State {
  activeStep: number;
  canGoBackwards: boolean;
  canGoForward: boolean;
  files: { name: string; text: string }[];
  invalidLocations: { headers: string; columns: string }[];
}

export class ImportFromGoogleMaps extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeStep: 0,
      canGoBackwards: false,
      canGoForward: true,
      files: [],
      invalidLocations: [],
    };
  }

  get steps(): string[] {
    return [
      'Go to Takeout',
      'Select your data',
      'Download your data',
      'Wait for the export to complete',
      'Download your exported data',
      'Extract your data',
      'Select your data',
      'Upload your data',
      'Handle location parsing errors',
      'View locations!',
    ];
  }

  get stepContent(): JSX.Element[] {
    return [
      <Typography>
        To export your locations from{' '}
        <a href="https://maps.google.com" target="_blank">
          Google Maps
        </a>{' '}
        to Location Scouter, you must first request them from Google. To get
        started, go to{' '}
        <a href="https://takeout.google.com/" target="_blank">
          takeout.google.com
        </a>
        .
      </Typography>,
      <Typography>
        Once at{' '}
        <a href="https://takeout.google.com/" target="_blank">
          takeout.google.com
        </a>
        , deselect all Products. After all the Products are deselected, scroll
        down and select <strong>Saved</strong>. Finally, click the{' '}
        <strong>Next step</strong> button.
      </Typography>,
      <Typography>
        Select your preferred delivery method, an export frequency of{' '}
        <strong>Export once</strong>, your preferred file type, and a block
        size. Then, click the <strong>Create export</strong> button.
      </Typography>,
      <Typography>
        Wait until the export completes. After your export completes you will be
        redirected to{' '}
        <a
          href="https://takeout.google.com/settings/takeout/downloads"
          target="_blank"
        >
          takeout.google.com/settings/takeout/downloads
        </a>
        .
      </Typography>,
      <Typography>
        Within the exports table, click the <strong>Download</strong> button for
        the most recent export (it should be at the top of the list). You may
        need to provide your password to verify your identity.
      </Typography>,
      <Typography>
        After you download your data, extract the downloaded file(s). You should
        now see an <strong>archive_browser.html</strong> file and a{' '}
        <strong>Saved</strong> folder.
      </Typography>,
      <div>
        <Typography>
          Select one or more <strong>csv</strong> files from your exported data
          to upload to Location Scouter.
        </Typography>
        <input
          type="file"
          accept="text/csv"
          multiple
          onChange={this.onFilesSelected}
        ></input>
      </div>,
      <CircularProgress />,
      <Typography>
        We were unable to process{' '}
        <strong>{this.state.invalidLocations.length}</strong> location(s).
        Please download them and follow the recovery steps.
      </Typography>,
    ];
  }

  downloadInvalidLocations = () => {
    const { invalidLocations } = this.state;
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(invalidLocations))
    );
    element.setAttribute(
      'download',
      `Location Scouter Invalid Locations ${new Date().toISOString()}.json`
    );

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  goBack = () => {
    const { activeStep } = this.state;
    if (activeStep <= 0) {
      return;
    }
    this.setState((previousState) => {
      const resetFiles: boolean = previousState.activeStep === 6;
      return {
        activeStep: activeStep - 1,
        canGoBackwards: activeStep - 1 !== 0,
        canGoForward: true,
        files: resetFiles ? [] : previousState.files,
        invalidLocations: resetFiles ? [] : previousState.invalidLocations,
      };
    });
  };

  goForward = () => {
    const { activeStep } = this.state;
    if (activeStep > this.steps.length) {
      return;
    } else if (activeStep === 6) {
      this.uploadLocations();
    } else if (activeStep === 8) {
      this.downloadInvalidLocations();
    }
    this.setState({
      activeStep: activeStep + 1,
      canGoBackwards: activeStep !== 5 && activeStep !== 7,
      canGoForward: activeStep !== this.steps.length && activeStep !== 5,
    });
  };

  onAccordionClicked = () => {
    const { expanded, onExpand } = this.props;
    const { activeStep } = this.state;

    if (!expanded) {
      onExpand();
      this.setState({
        activeStep: 0,
        files: [],
        invalidLocations: [],
      });
    } else if (expanded && activeStep === 0) {
      onExpand();
      this.setState({
        activeStep: 0,
        files: [],
        invalidLocations: [],
      });
    } else if (expanded && activeStep === this.steps.length) {
      onExpand();
      this.setState({
        activeStep: 0,
        files: [],
        invalidLocations: [],
      });
    } else if (
      expanded &&
      activeStep !== 0 &&
      activeStep !== this.steps.length &&
      window.confirm(
        'Are you sure you want to stop importing locations. All progress will be lost?'
      ) === true
    ) {
      onExpand();
      this.setState({
        activeStep: 0,
        files: [],
        invalidLocations: [],
      });
    }
  };

  onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null || e.target.files.length === 0) {
      return;
    }

    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const file: any | null = files.item(i);
      if (file !== null) {
        file
          .text()
          .then((text: string) => {
            this.setState((previousState) => {
              const fileRecord: { name: string; text: string } = {
                name: file.name,
                text,
              };
              return {
                files: previousState.files.concat([fileRecord]),
                canGoBackwards: true,
                canGoForward: previousState.files.length + 1 === files.length,
              };
            });
          })
          .catch(() => {
            // TODO: Handle it properly
            alert('There was an unexpected error. Please try again!');
          });
      }
    }
  };

  parseDMS = (input: string): number[] => {
    const lonOffset = 14;
    const lat = this.convertDMSToDD(
      input.substr(1, 2),
      input.substr(4, 2),
      input.substr(7, 4),
      input.substr(13, 1)
    );
    const lng = this.convertDMSToDD(
      input.substr(1 + lonOffset, 2),
      input.substr(4 + lonOffset, 2),
      input.substr(7 + lonOffset, 4),
      input.substr(13 + lonOffset, 1)
    );
    return [lat, lng];
  };

  convertDMSToDD = (
    degrees: string,
    minutes: string,
    seconds: string,
    direction: string
  ): number => {
    let dd: number =
      Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);

    if (direction == 'S' || direction == 'W') {
      dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
  };

  uploadLocations = async () => {
    const { files } = this.state;
    const { uid } = firebase.auth().currentUser!;

    this.setState({
      canGoBackwards: false,
      canGoForward: false,
    });

    try {
      const newLocations: any[] = [];
      const invalidLocations: { headers: string; columns: string }[] = [];
      files.map((file: { name: string; text: string }) => {
        const rows: string[] = file.text
          .split('\n')
          .filter((row) => row.length > 0);
        if (rows.length > 0) {
          const headers = rows.shift()!;
          for (let row of rows) {
            const columns: string[] = row.split(',');
            const coords = this.parseDMS(columns[0]);
            console.log(columns[0], coords);
            if (coords.some((coord) => Number.isNaN(coord))) {
              invalidLocations.push({
                columns: row,
                headers,
              });
            } else {
              newLocations.push({
                lat: coords[0],
                lng: coords[1],
                name: coords.join(' '),
                originalData: {
                  columns: row,
                  fileName: file.name,
                  headers,
                },
                owner: uid,
              });
            }
          }
        }
      });
      await Promise.all(
        newLocations.map((location: any) => {
          return firebase.firestore().collection('locations').add(location);
        })
      );
      this.setState({ invalidLocations }, () => this.goForward());
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred!');
    }
  };

  render() {
    const { expanded } = this.props;
    const { activeStep, canGoBackwards, canGoForward } = this.state;
    return (
      <Accordion expanded={expanded} onClick={this.onAccordionClicked}>
        <AccordionSummary>
          <Typography>Import from Google Maps</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {this.steps.map((step: string, i: number) => {
              return (
                <Step key={i}>
                  <StepLabel>{step}</StepLabel>
                  <StepContent>
                    {this.stepContent[i]}
                    {activeStep !== 7 && (
                      <div style={{ marginTop: 10 }}>
                        <Button
                          disabled={!canGoBackwards}
                          onClick={this.goBack}
                          style={{ marginRight: 10 }}
                        >
                          Back
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={!canGoForward}
                          onClick={this.goForward}
                        >
                          {activeStep === this.steps.length - 2
                            ? 'Download'
                            : activeStep === this.steps.length - 1
                            ? 'Finish'
                            : 'Next'}
                        </Button>
                      </div>
                    )}
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>
        </AccordionDetails>
      </Accordion>
    );
  }
}
