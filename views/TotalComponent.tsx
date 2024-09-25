import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TotalComponentProps {
  total: number;
  title: string;
}

const TotalComponent: React.FC<TotalComponentProps> = ({ total, title }) => {
  return (
    <View style={styles.total}>
      <Text>{title}: {total}€</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  total: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#000',
    marginTop: 'auto',
  },
});

export default TotalComponent;
