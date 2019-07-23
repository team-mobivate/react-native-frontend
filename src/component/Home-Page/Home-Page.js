import { Linking } from 'expo';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { KeyboardAvoidingView, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native-elements';

// ----------------------------------------------------------------------------

import AppStateContext from '../../context/app-state-context';
import If from '../If/If';
import NavigationContext from '../../context/navigation-context';
import styles from './styles';

const BACKEND_AUTH_URL = `https://mobby-backend.herokuapp.com/login/twitter`;

/**
 * Initial Page of app, displays login view
 * @export
 * @class HomePage
 * @extends {React.Component}
 */
export default class HomePage extends React.Component {
  static navigationOptions = { header: null };

  /**
   *Creates an instance of HomePage.
   * @param {*} props
   * @memberof HomePage
   */
  constructor(props) {
    super(props);
    this.state = {};
    this.state.user = false;

    this.state.logout = this.logout;
  }

  /**
   * Checks if user data is defined (user logged in) and redirects user out of login screen
   * Runs when component is first loaded (added to tree)
   *
   * @memberof HomePage
   */
  componentDidMount() {
    if (this.state.user) {
      this.props.navigation.navigate('Dashboard', {
        user: this.state.user,
        display_name: this.state.display_name,
        user_id: this.state.user_id,
        logout: this.state.logout,
      });
    }
  }

  /**
   *  Handles universal/deep links to the app. Currently only supported for iOS since expo
   *  does not support android deep links.
   * @param {Object} event redirect event
   * @memberof HomePage
   */
  _handleRedirect = (event) => {
    // WebBrowser.dismissBrowser() is iOS only
    WebBrowser.dismissBrowser();
    const data = Linking.parse(event.url);

    this.setState({
      user: data.queryParams.user_name,
      display_name: data.queryParams.display_name,
      user_id: data.queryParams.id,
    });

    this.componentDidMount();
  };

  /**
   *  Opens browser to sign in via twitter.
   *
   *  Creates an event listener for while the browser is open to listen
   *  for a redirect from the backend with user data as query parameters
   *
   * @memberof HomePage
   */
  login = async () => {
    try {
      // Deep Links not supported on android by Expo
      Linking.addEventListener('url', this._handleRedirect);
      await WebBrowser.openBrowserAsync(BACKEND_AUTH_URL);
      Linking.removeEventListener('url', this._handleRedirect);
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  /**
   *  Resets stored user data and navigates to sign-in screen
   *
   * @memberof HomePage
   */
  logout = () => {
    if (this.state.user) {
      this.setState({
        user: false,
        display_name: undefined,
        user_id: undefined,
      });
    }
    this.props.navigation.navigate('Homepage');
  };

  /**
   *  Renders app homepage screen
   *
   * @returns
   * @memberof HomePage
   */
  render() {
    return (
      <>
        {/* TODO: For now we are sharing state - this is too broad and should be unique to the user */}
        <AppStateContext.Provider value={this.state}>
          <NavigationContext.Provider value={this.props.navigation}>
            <KeyboardAvoidingView style={styles.keyboardContainer} behavior="padding" enabled>
              <If condition={!this.state.user}>
                <View style={styles.loginContainer}>
                  {/* Logo and App Name */}
                  <View style={styles.centerHorizontally}>
                    <Image source={require('../../../assets/icon.png')} style={{ width: 200, height: 200 }} />
                    <Text style={styles.appName}>Mobivate</Text>
                  </View>

                  {/* Sign in 'button', using image to meet twitter standards */}
                  <TouchableOpacity style={styles.centerHorizontally} onPress={() => this.login()}>
                    <Image source={require('../../../assets/sign-in-with-twitter.png')} />
                  </TouchableOpacity>
                </View>
              </If>
            </KeyboardAvoidingView>
          </NavigationContext.Provider>
        </AppStateContext.Provider>
      </>
    );
  }
}
