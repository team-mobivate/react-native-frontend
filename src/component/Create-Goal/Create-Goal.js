import React from 'react';
import { TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';

const FETCH_CREATE_GOAL_URL = 'https://mobby-backend.herokuapp.com/createGoal';

/**
 *  React Component for add goal screen
 *
 * @export
 * @class CreateGoal
 * @extends {React.Component}
 */
export default class CreateGoal extends React.Component {
  static navigationOptions = { headerTitle: 'Create New Goal', headerLeft: null };

  /**
   *  Creates an instance of CreateGoal.
   *
   * @param {*} props
   * @memberof CreateGoal
   */
  constructor(props) {
    super(props);
    this.userId = props.navigation.getParam('user_id');

    this.state = {
      goal_name: '',
      isStartDateTimePickerVisible: false,
      isEndDateTimePickerVisible: false,
      startDate: Date.now(),
      endDate: Date.now() * 2,
      frequency: 'daily',
    };
  }

  /**
   * Toggle display of start date picker
   *
   * @memberof CreateGoal
   */
  toggleStartDateTimePickerDisplay = () => {
    this.setState({ isStartDateTimePickerVisible: !this.state.isStartDateTimePickerVisible });
  };

  /**
   * Toggle display of end date picker
   *
   * @memberof CreateGoal
   */
  toggleEndDateTimePickerDisplay = () => {
    this.setState({ isEndDateTimePickerVisible: !this.state.isEndDateTimePickerVisible });
  };

  /**
   *  Sets date for start date of goal
   *
   * @memberof CreateGoal
   */
  handleStartDatePicked = (date) => {
    this.setState({ startDate: date.getTime() });
    this.toggleStartDateTimePickerDisplay();
  };

  /**
   *  Sets date for end date of goal
   *
   * @memberof CreateGoal
   */
  handleEndDatePicked = (date) => {
    this.setState({ endDate: date.getTime() });
    this.toggleEndDateTimePickerDisplay();
  };

  /**
   * Make post request to add goal to database and return to dashboard
   *
   * @memberof CreateGoal
   */
  makeGoal = async () => {
    if (!this.state.goal_name) {
      return;
    }

    await fetch(FETCH_CREATE_GOAL_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goal_user_id: this.userId,
        goal_name: this.state.goal_name,
        goal_start_date: this.state.startDate,
        goal_end_date: this.state.endDate,
        frequency: this.state.frequency,
      }),
    });

    this.props.navigation.navigate('Dashboard');
  };

  render() {
    return (
      <>
        <View
          style={{
            width: '90%',
            height: '80%',
            marginLeft: '5%',
            marginTop: '40%',
          }}
        >
          <TextInput
            style={{
              height: 40,
              paddingLeft: 6,
              fontSize: 25,
            }}
            onChangeText={(name) => this.setState({ goal_name: name })}
            placeholder="Give your goal a name"
          />

          <Button
            title="Start Date"
            onPress={this.toggleStartDateTimePickerDisplay}
            style={{ width: '90%', marginLeft: '5%', marginTop: '5%' }}
          />
          <DateTimePicker
            isVisible={this.state.isStartDateTimePickerVisible}
            onConfirm={this.handleStartDatePicked}
            onCancel={this.toggleStartDateTimePickerDisplay}
          />

          <Button
            title="End Date"
            color="orange"
            onPress={this.toggleEndDateTimePickerDisplay}
            style={{ width: '90%', marginLeft: '5%', marginTop: '5%' }}
          />
          <DateTimePicker
            isVisible={this.state.isEndDateTimePickerVisible}
            onConfirm={this.handleEndDatePicked}
            onCancel={this.toggleEndDateTimePickerDisplay}
          />

          <Button title="Submit" style={{ marginTop: '20%' }} onPress={this.makeGoal} />
        </View>
      </>
    );
  }
}
