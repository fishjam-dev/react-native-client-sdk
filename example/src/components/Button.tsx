import {AdditionalColors, BrandColors, TextColors} from '../../utils/Colors';
import {Typo} from './Typo';
import React from 'react';
import {StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';

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
};

type ButtonStyle = {
  buttonStyle: ViewStyle;
  textColor: string;
};

const GetStylesForButton = (
  type: StandardButtonTypeName,
  disabled: boolean,
): ButtonStyle => {
  if (disabled) {
    return {
      buttonStyle: StandardButtonStyles.disabled,
      textColor: TextColors.white,
    };
  }
  switch (type) {
    case 'primary':
      return {
        buttonStyle: StandardButtonStyles.primary,
        textColor: TextColors.white,
      };

    case 'danger':
      return {
        buttonStyle: StandardButtonStyles.danger,
        textColor: TextColors.white,
      };

    case 'secondary':
      return {
        buttonStyle: StandardButtonStyles.secondary,
        textColor: TextColors.darkText,
      };
  }
};

const Button = ({
  type = 'primary',
  disabled = false,
  onPress,
  title,
}: StandardButtonProps) => {
  const {buttonStyle, textColor} = GetStylesForButton(type, disabled);

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View style={buttonStyle}>
        <Typo variant="button" color={textColor}>
          {title}
        </Typo>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
