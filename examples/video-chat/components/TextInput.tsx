import isEmpty from 'lodash/isEmpty';
import React, { useState } from 'react';
import { StyleSheet, TextInput as RNTextInput, View } from 'react-native';

import { TextInputTextStyle, Typo } from './Typo';
import type AccessibilityLabel from '../types/AccessibilityLabel';
import { AdditionalColors, BrandColors, TextColors } from '../utils/Colors';

const TextInputStyles = StyleSheet.create({
  main: {
    width: '100%',
    height: 56,
    borderRadius: 40,
    borderStyle: 'solid',
    borderWidth: 2,
    backgroundColor: AdditionalColors.white,
    paddingLeft: 16,
  },
  active: {
    color: TextColors.darkText,
  },
  notActive: {
    color: AdditionalColors.grey80,
    borderColor: AdditionalColors.grey60,
  },
  offFocus: {
    borderColor: BrandColors.darkBlue100,
  },
  onFocus: {
    borderColor: BrandColors.seaBlue80,
  },
  roomInputSubLabel: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
  },
  roomInputSubLabelIcon: {
    paddingRight: 4,
  },
});

type OnChangeTextType = (text: string) => void;

type TextInputProps = {
  placeholder?: string;
  value?: string;
  editable?: boolean;
  onChangeText?: OnChangeTextType;
  sublabel?: string;
  sublabelIconSize?: number;
} & AccessibilityLabel;

export const TextInput = ({
  placeholder = '',
  sublabel,
  value,
  accessibilityLabel,
  editable = true,
  onChangeText = () => {},
}: TextInputProps) => {
  const [focusStyle, setFocusStyle] = useState(TextInputStyles.offFocus);
  const placeholderTextColor = AdditionalColors.grey80;
  const fontStyle = TextInputTextStyle.body;

  const onFocus = () => {
    setFocusStyle(TextInputStyles.onFocus);
  };

  const offFocus = () => {
    setFocusStyle(TextInputStyles.offFocus);
  };

  const GetStyleForTextInput = () => {
    if (editable) {
      return [
        TextInputStyles.main,
        TextInputStyles.active,
        focusStyle,
        fontStyle,
      ];
    }

    return [TextInputStyles.main, TextInputStyles.notActive, fontStyle];
  };

  return (
    <View>
      <RNTextInput
        style={GetStyleForTextInput()}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        accessibilityLabel={accessibilityLabel}
        onFocus={onFocus}
        onBlur={offFocus}
        editable={editable}
        onChangeText={onChangeText}
        autoCapitalize="none"
        selectionColor={TextColors.additionalLightText}
      />
      {!isEmpty(sublabel) ? (
        <View style={TextInputStyles.roomInputSubLabel}>
          <Typo
            variant="label"
            color={editable ? TextColors.darkText : AdditionalColors.grey80}>
            {sublabel}
          </Typo>
        </View>
      ) : null}
    </View>
  );
};

export default TextInput;
