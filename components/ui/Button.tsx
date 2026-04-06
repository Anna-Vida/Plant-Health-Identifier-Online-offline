import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: ButtonVariant;
  style?: ViewStyle;
};

export function Button({
  label,
  onPress,
  disabled,
  icon,
  variant = 'primary',
  style,
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const fg = isPrimary ? '#F7F0E0' : '#234732';
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      <View style={styles.row}>
        {icon ? <Ionicons name={icon} size={18} color={fg} /> : null}
        <Text style={[styles.label, { color: fg }]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
  },
  primary: {
    backgroundColor: '#214730',
  },
  secondary: {
    backgroundColor: '#E8EDDF',
    borderWidth: 1,
    borderColor: '#C7D2BE',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
});

