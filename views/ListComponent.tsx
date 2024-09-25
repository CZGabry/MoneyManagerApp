import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

interface ListComponentProps {
  records: MoneyRecord[];
  removeRecord: (index: number) => void;
  onEditRecord: (index: number) => void;
}

const ListComponent: React.FC<ListComponentProps> = ({ records, removeRecord, onEditRecord }) => {
  const renderItem = ({ item, index }: { item: MoneyRecord; index: number }) => {
    let textStyle = {};

    if (item.nature === 'credit' && item.category === 'asset') {
      textStyle = { borderBottomWidth: 2, borderBottomColor: 'blue' };
    } else if (item.nature === 'credit' && item.category === 'liquidity') {
      textStyle = { borderBottomWidth: 2, borderBottomColor: 'green' };
    } else if (item.nature === 'debt') {
      textStyle = { borderBottomWidth: 2, borderBottomColor: 'red' };
    }

    return (
      <TouchableOpacity onPress={() => onEditRecord(index)}>
        <View style={styles.item}>
          <Text style={[styles.itemText, textStyle]}>
            {item.name} - {Math.abs(item.value)}€ ({item.nature === 'credit' ? 'Credit' : 'Debt'}
            {item.nature === 'credit' ? `, ${item.category}` : ''}) {/* Hide category for debts */}
          </Text>
          <TouchableOpacity onPress={() => removeRecord(index)} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={records}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ListComponent;
