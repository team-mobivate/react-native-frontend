import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { CheckBox, ListItem, TouchableScale } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import If from '../If/If';

const FETCH_USER_GOALS_URL = `https://mob-ivate.herokuapp.com/goals`;
// 'https://mobby-backend.herokuapp.com/goals';
const FETCH_DELETE_GOAL_URL = `https://mob-ivate.herokuapp.com/deleteGoal`;
// 'https://mobby-backend.herokuapp.com/deleteGoal';

/**
 * React Component for Homepage of app
 *
 * Displays user goals, add goal button.
 *
 * @export
 * @class Dashboard
 * @extends {React.Component}
 */
export default class Dashboard extends React.Component {
  static navigationOptions = {
    headerTitle: 'Today',
    headerLeft: null,
  };

  /**
   * Creates an instance of Dashboard.
   *
   * Sets user data from data passed by react navigation and default "goals"
   *
   * @param {*} props
   * @memberof Dashboard
   */
  constructor(props) {
    super(props);
    this.state = {};
    this.userId = props.navigation.getParam('user_id');
    this.userName = props.navigation.getParam('user');
    this.displayName = props.navigation.getParam('display_name');
    this.isRefreshing = false;

    this.state.userGoals = [
      {
        key: 'add',
        goal_name: 'Loading...',
        streak: 0,
      },
    ];
  }

  /**
   *  Gets run when the component is loaded in
   *
   * @memberof Dashboard
   */
  componentDidMount() {
    this.getUserGoals();
  }

  /**
   *  Gets user's goals from backend.
   *
   *  If backend has no goals for user, sets a 'add goal' goal
   *
   * @returns {Array} array of objects, each being a goal
   * @memberof Dashboard
   */
  async getUserGoals() {
    let goals = await fetch(FETCH_USER_GOALS_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goal_user_id: this.userId,
      }),
    });

    goals = await goals.json();

    goals.map((element, idx) => {
      element.key = `${element.goal_id}`;
      element.completed = false;
      this.state.userGoals[idx] = element;
      return element;
    });

    if (goals.length === 0) {
      this.state.userGoals = [
        {
          key: 'add',
          goal_name: 'Add a goal!',
          streak: 0,
        },
      ];
    }

    this.forceUpdate();
  }

  /**
   * Updates checked status of goal
   *
   * @param {Object} goal
   * @memberof Dashboard
   */
  handleChecked(checkedGoal) {
    if (checkedGoal.key !== 'add') {
      checkedGoal.completed = !checkedGoal.completed;
      this.forceUpdate();

      fetch(FETCH_DELETE_GOAL_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal_id: checkedGoal.goal_id,
          goal_user_id: this.props.navigation.getParam('user_id'),
        }),
      });

      setTimeout(
        function() {
          this.state.userGoals = this.state.userGoals.filter((goal) => !goal.completed) || [];
          this.forceUpdate();
        }.bind(this),
        800
      );
    }
  }

  refreshList = () => {
    this.isRefreshing = true;
    this.getUserGoals();
    this.isRefreshing = false;
  };

  addGoal() {
    this.props.navigation.navigate('CreateGoal', {
      user_id: this.props.navigation.getParam('user_id'),
    });
  }

  /**
   *  Renders screen for dashboard, list of user goals and add button
   *
   * @returns React Component
   * @memberof Dashboard
   */
  render() {
    return (
      <>
        <View style={{ width: '90%', height: '100%', marginLeft: '5%' }}>
          <View zIndex={-1}>
            <FlatList
              onRefresh={this.refreshList}
              refreshing={this.isRefreshing}
              style={{ width: '100%', height: '100%' }}
              data={this.state.userGoals}
              renderItem={({ item }) => (
                <ListItem
                  Component={TouchableScale}
                  title={item.goal_name}
                  titleStyle={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}
                  subtitleStyle={{ color: 'black' }}
                  // subtitle={item.streak ? `Streak: ${item.streak}` : 'waiting...'}
                  rightTitle={<CheckBox checked={item.completed} onPress={() => this.handleChecked(item)} />}
                />
              )}
            />
          </View>

          <View
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
            }}
          >
            <TouchableOpacity onPress={() => this.addGoal()}>
              <Icon
                name="plus-circle"
                size={75}
                color="orange"
                style={{
                  marginRight: 15,
                  marginBottom: 50,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}
