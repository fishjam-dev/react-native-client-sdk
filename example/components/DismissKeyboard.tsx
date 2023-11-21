import React from 'react';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';
import {AppParentNode} from '../types/AppParentNode';

const DismissKeyboard = (props: AppParentNode) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {props.children}
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboard;
