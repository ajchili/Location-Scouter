import React, { Component } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Theme,
  Typography,
  Snackbar,
} from '@material-ui/core';
import {
  withTheme,
  withStyles,
  StyledComponentProps,
} from '@material-ui/core/styles';
import { AuthenticationService } from '../Services';

export interface Props extends StyledComponentProps {}

export interface State {
  expanded?: string;
  errorSnackbarOpened: boolean;
  errorSnackbarText: string;
}

const styles = (theme: Theme) => ({
  parent: {
    marginTop: theme.spacing(4),
  },
  divider: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  heading: {
    flex: 1,
  },
  subHeading: {
    color: theme.palette.text.secondary,
  },
});

class AccountSettings extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      errorSnackbarOpened: false,
      errorSnackbarText: '',
    };
  }

  setExpanded = (expanded?: string) => {
    this.setState((previousState) => {
      return {
        ...previousState,
        expanded: previousState.expanded !== expanded ? expanded : undefined,
      };
    });
  };

  render() {
    const { classes = {} } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classes.parent}>
        <Typography variant="h4">Account Settings</Typography>
        <Divider className={classes.divider} />
        <Accordion
          expanded={expanded === 'accountTier'}
          onClick={() => {
            if (AuthenticationService.accountTier === 'admin') {
              return;
            }
            this.setExpanded('accountTier');
          }}
        >
          <AccordionSummary>
            <Typography className={classes.heading}>Account Tier</Typography>
            <Typography className={classes.subHeading}>
              {AuthenticationService.accountTier.toUpperCase()}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {AuthenticationService.accountTier === 'none' && (
              <Typography>TODO</Typography>
            )}
            {AuthenticationService.accountTier === 'basic' && (
              <Typography>TODO</Typography>
            )}
            {AuthenticationService.accountTier === 'plus' && (
              <Typography>TODO</Typography>
            )}
            {AuthenticationService.accountTier === 'sponsored' && (
              <Typography>TODO</Typography>
            )}
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={false}>
          <AccordionSummary>
            <Typography className={classes.heading}>Account Type</Typography>
            <Typography className={classes.subHeading}>
              {AuthenticationService.accountType.toUpperCase()}
            </Typography>
          </AccordionSummary>
        </Accordion>
      </div>
    );
  }
}

export default withTheme(
  withStyles(styles, { withTheme: true })(AccountSettings)
);
