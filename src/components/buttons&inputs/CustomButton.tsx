import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View, ImageSourcePropType, TextStyle, ViewStyle,
GestureResponderEvent } from 'react-native';
import colors from '../../config/colors';
import { Octicons } from '@expo/vector-icons';

interface CustomButtonProps {
  text: string;
  _id?: string;
  onPress?: (event: GestureResponderEvent) => void;
  borderStyle?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  disabled?: boolean;
  source?: ImageSourcePropType;
  hasIcon?: boolean;
  icon?: keyof typeof Octicons.glyphMap;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  _id,
  onPress,
  borderStyle,
  textStyle,
  disabled,
  source,
  hasIcon,
  icon,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, borderStyle]}
      onPress={onPress}
      disabled={disabled}
    >
      {source && (
        <Image
          source={source}
          style={{ width: 19, height: 19, zIndex: 100, marginRight: 15 }}
        />
      )}

      <Text style={[styles.text, textStyle]}>{text}</Text>
      {hasIcon && icon && (
        <View style={styles.icon}>
          <Octicons name={icon} size={20} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary_contrast,
    textAlign: "center",
    borderRadius: 4,
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  text: {
    color: colors.primary,
  },
  icon: { marginLeft: 10 },
});

export default CustomButton;
