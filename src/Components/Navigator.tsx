import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import {
  Lander as LandingPage,
  Loading as LoadingPage,
  Login as LoginPage,
  Scouting as ScoutingPage,
  Settings as SettingsPage,
} from '../Pages';
import { AuthenticationService } from '../Services';
import { AccountTier, AccountType } from '../Services/AuthenticationService';

export interface Props {}

export interface State {
  initialAuthCheckCompleted: boolean;
  accountTier: AccountTier;
  accountType: AccountType;
}

export class Navigator extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      initialAuthCheckCompleted: false,
      accountTier: 'none',
      accountType: 'unauthenticated',
    };
  }

  componentDidMount() {
    AuthenticationService.addListener('accountUpdated', () => {
      const { initialAuthCheckCompleted } = this.state;
      const { accountTier, accountType } = AuthenticationService;
      const newState: State = {
        initialAuthCheckCompleted,
        accountTier,
        accountType,
      };
      if (initialAuthCheckCompleted === false) {
        newState.initialAuthCheckCompleted = true;
      }
      this.setState(newState);
    });
  }

  render() {
    const { initialAuthCheckCompleted, accountTier, accountType } = this.state;

    console.log(accountTier, accountType);

    return initialAuthCheckCompleted ? (
      <Router>
        <Switch>
          <>
            {accountType === 'unauthenticated' ? (
              <>
                <Route path="/" children={<Redirect to="/login" />} />
                <Route exact path="/login" component={LoginPage} />
              </>
            ) : (
              <>
                {accountTier !== 'none' && (
                  <Route exact path="/" component={ScoutingPage} />
                )}
                <Route exact path="/settings" component={SettingsPage} />
                <Route path="/" children={<Redirect to="/" />} />
              </>
            )}
          </>
        </Switch>
      </Router>
    ) : (
      <LoadingPage />
    );
  }
}
