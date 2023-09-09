import React, { Component } from 'react';
import {
    PanResponder,
    Animated,
    Dimensions,
    StyleSheet,
    Keyboard,
    TextInput,
    UIManager,
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const { State: TextInputState } = TextInput;

export default class Animator extends Component {
    constructor(props) {
        super(props);

        this.position = new Animated.ValueXY(this.props.currentPosition);
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onStartShouldSetPanResponderCapture: () => false,
            onMoveShouldSetPanResponder: (evt, gesture) => {
                return Math.abs(gesture.dx) > 3 || Math.abs(gesture.dy) > 3;
            },
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease: this._handlePanResponderRelease,
        });
    }

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

    handleKeyboardDidShow = (event) => {
        const { height: windowHeight } = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        const currentlyFocusedField = TextInputState.currentlyFocusedField();

        if (!currentlyFocusedField)
            return

        UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
            const fieldHeight = height;
            const fieldTop = pageY;

            const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);

            if (Math.round(gap) >= 0) {
                return;
            }

            this._transitionTo(this.props.upPosition.y + gap - 30, () => {})

        });
    }

    handleKeyboardDidHide = () => {
        this._transitionTo(this.props.upPosition, () => {})
    }

    render() {
        return (
            <Animated.View
                style={[
                    { ...this.position.getLayout(), left: 0 },
                    StyleSheet.flatten([
                        styles.animationContainer(this.props.containerHeight, this.props.backgroundColor),
                        styles.roundedEdges(this.props.roundedEdges),
                        styles.shadow(this.props.shadow)
                    ])
                ]}
                {...this._panResponder.panHandlers}
            >
                {this.props.children}
            </Animated.View>
        )
    }

    _handlePanResponderMove = (e, gesture) => {
        if (this._swipeInBounds(gesture)) {
            this.position.setValue({ y: this.props.currentPosition.y + gesture.dy });
        } else {
            this.position.setValue({ y: this.props.upPosition.y - this._calculateEase(gesture) });
        }
    }

    _handlePanResponderRelease = (e, gesture) => {
        if (gesture.dy > this.props.toggleThreshold && this.props.currentPosition === this.props.upPosition) {
            this._transitionTo(this.props.downPosition, this.props.onCollapsed);
        } else if (gesture.dy < -this.props.toggleThreshold && this.props.currentPosition === this.props.downPosition) {
            this._transitionTo(this.props.upPosition, this.props.onExpanded);
        } else {
            this._resetPosition();
        }
    }

    // returns true if the swipe is within the height of the drawer.
    _swipeInBounds(gesture) {
        return this.props.currentPosition.y + gesture.dy > this.props.upPosition.y;
    }

    _calculateEase(gesture) {
        return Math.min(Math.sqrt(gesture.dy * -1), Math.sqrt(SCREEN_HEIGHT));
    }

    _transitionTo(position, callback) {
        Animated.spring(this.position, {
            toValue: position
        }).start(() => this.props.onExpanded());

        this.props.setCurrentPosition(position);
        callback();
    }

    _resetPosition() {
        Animated.spring(this.position, {
            toValue: this.props.currentPosition
        }).start();
    }
}

const styles = {
    animationContainer: (height, color) => ({
        width: SCREEN_WIDTH,
        position: 'absolute',
        height: height - 60, // Why do I need to offset by ~80 (60) so its larger than spring
        backgroundColor: color,
    }),
    roundedEdges: rounded => {
        return rounded == true && {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
        }
    },
    shadow: shadow => {
        return shadow == true && {
            shadowColor: '#CECDCD',
            shadowRadius: 3,
            shadowOpacity: 5,
        }
    },
}