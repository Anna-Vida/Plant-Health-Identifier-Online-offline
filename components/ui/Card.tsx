import { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

type CardProps = PropsWithChildren<{
  style?: ViewStyle;
}>;

export function Card({ style, children }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAF5EA',
    borderRadius: 22,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5DED2',
  },
});

