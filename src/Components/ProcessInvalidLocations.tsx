import React, { Component } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';

export interface Props {
  expanded: boolean;
  onExpand: () => void;
}

export interface State {}

export class ProcessInvalidLocations extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  onAccordionClicked = () => {
    const { onExpand } = this.props;
    onExpand();
  };

  render() {
    const { expanded } = this.props;
    return (
      <Accordion expanded={expanded} onClick={this.onAccordionClicked}>
        <AccordionSummary>
          <Typography>Process Invalid Locations</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            We do not currently have this feature supported, please hold on to
            all generate invalid location files until this feature is added.
          </Typography>
        </AccordionDetails>
      </Accordion>
    );
  }
}
