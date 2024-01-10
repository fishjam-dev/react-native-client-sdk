import {AdditionalColors, BrandColors, TextColors} from '../utils/Colors';
import {Typo} from './Typo';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import type AccessibilityLabel from '../types/AccessibilityLabel';

const StandardButtonStyles = StyleSheet.create({
  common: {
    width: '100%',
    height: 56,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  primary: {
    backgroundColor: BrandColors.darkBlue100,
  },
  danger: {
    backgroundColor: AdditionalColors.red100,
  },
  secondary: {
    backgroundColor: AdditionalColors.white,
  },
  disabled: {
    backgroundColor: AdditionalColors.grey60,
  },
});

type StandardButtonTypeName = 'primary' | 'danger' | 'secondary';

type StandardButtonProps = {
  type?: StandardButtonTypeName;
  disabled?: boolean;
  onPress: () => void;
  title: string;
} & AccessibilityLabel;

const Button = ({
  type = 'primary',
  disabled = false,
  accessibilityLabel,
  onPress,
  title,
}: StandardButtonProps) => {
  const GetBackgroundColorStyle = (
    type: StandardButtonTypeName,
    disabled: boolean,
  ) => {
    if (disabled) {
      return StandardButtonStyles.disabled;
    }
    switch (type) {
      case 'primary':
        return StandardButtonStyles.primary;
      case 'danger':
        return StandardButtonStyles.danger;
      case 'secondary':
        return StandardButtonStyles.secondary;
    }
  };

  const GetStylesForButtonType = (type: StandardButtonTypeName) => {
    return [
      StandardButtonStyles.common,
      GetBackgroundColorStyle(type, disabled),
    ];
  };

  const GetTextColorForButtonType = (
    type: StandardButtonTypeName,
    disabled: boolean,
  ) => {
    if (disabled) {
      return TextColors.white;
    }
    switch (type) {
      case 'primary':
        return TextColors.white;
      case 'danger':
        return TextColors.white;
      case 'secondary':
        return TextColors.darkText;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}>
      <View style={GetStylesForButtonType(type)}>
        <Typo
          variant="button"
          color={GetTextColorForButtonType(type, disabled)}>
          {title}
        </Typo>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
