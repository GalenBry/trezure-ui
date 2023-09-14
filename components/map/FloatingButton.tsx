import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle,  } from 'react-native'

type FloatingButtonProps = {
  containerStyles?: StyleProp<ViewStyle>
}

const FloatingIconButton = ({ children, containerStyles }: React.PropsWithChildren<FloatingButtonProps>) => (
  <View style={[ containerStyles, styles.container ]}>
    {children}
  </View>
)

export default FloatingIconButton;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFF0',
    borderRadius: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 16.00,

    elevation: 12,
  },
})