import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  StyleSheet,
  TextInput,
  UIManager,
  TouchableWithoutFeedback
} from 'react-native';

const { State: TextInputState } = TextInput;

export default class KeyboardShift extends Component {
  state = {
    shift: new Animated.Value(0),
  };

  componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }

  render() {
    const { shift } = this.state;
    return (
      <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {this.props.children}
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }

  handleKeyboardDidShow = (event) => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();

    if (!currentlyFocusedField)
      return

    UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;

      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight) - 20;
      if (Math.round(gap) >= 0) {
        return;
      }

      Animated.timing(
        this.state.shift,
        {
          toValue: gap,
          duration: 100,
          useNativeDriver: true,
        }
      ).start();
    });
  }

  handleKeyboardDidHide = () => {
    Animated.timing(
      this.state.shift,
      {
        toValue: 0,
        duration: 10,
        useNativeDriver: true,
      }
    ).start();
  }
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "red",
    // height: '100%', // This freezes map
    // left: 0,
    // position: 'absolute',
    // top: 0,
    // height: "100%",
    // width: '100%'
  }
});