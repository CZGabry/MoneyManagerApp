import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, useColorScheme, View, Button, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListComponent from './ListComponent';
import TotalComponent from './TotalComponent';
import AddRecordModal from './AddRecordModal';

const STORAGE_KEY = '@records_list';

const HomeComponent: React.FC = () => {
  const [records, setRecords] = useState<MoneyRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number | null>(null); // Track selected record index for editing

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#333' : '#FFF',
  };

  // Load records from AsyncStorage when the app starts
  useEffect(() => {
    const loadRecords = async () => {
      try {
        const storedRecords = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedRecords) {
          setRecords(JSON.parse(storedRecords));
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load records.');
      }
    };
    loadRecords();
  }, []);

  // Save records to AsyncStorage whenever records state changes
  useEffect(() => {
    const saveRecords = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      } catch (error) {
        Alert.alert('Error', 'Failed to save records.');
      }
    };
    saveRecords();
  }, [records]);

  // Calculate totals
  const total = records
    .filter((record) => record.nature !== 'debt') // Exclude debts
    .reduce((acc, record) => acc + record.value, 0);

  const netTotal = records.reduce((acc, record) => acc + record.value, 0); // Include debts and credits

  const totalAssets = records
    .filter((record) => record.category === 'asset' && record.nature !== 'debt') // Only assets and no debts
    .reduce((acc, record) => acc + record.value, 0);

  const totalLiquidity = records
    .filter((record) => record.category === 'liquidity' && record.nature !== 'debt') // Only liquidity and no debts
    .reduce((acc, record) => acc + record.value, 0);

  const totalDebt = records
    .filter((record) => record.nature === 'debt') // Only debts
    .reduce((acc, record) => acc + record.value, 0);

  const totalLiquidityMinusDebt = totalLiquidity - Math.abs(totalDebt);
  // Add or edit record
  const addOrEditRecord = (name: string, value: number, nature: 'credit' | 'debt', category: 'asset' | 'liquidity') => {
    const recordValue = nature === 'debt' ? -Math.abs(value) : Math.abs(value); // Negative for debt, positive for credit
    const newRecord = { name, value: recordValue, nature, category };

    if (selectedRecordIndex !== null) {
      // Edit mode
      const updatedRecords = [...records];
      updatedRecords[selectedRecordIndex] = newRecord;
      setRecords(updatedRecords);
    } else {
      // Add mode
      setRecords([...records, newRecord]);
    }

    setSelectedRecordIndex(null); // Reset after edit or add
  };

  // Remove record from the list
  const removeRecord = (index: number) => {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
  };

  // Handle edit button click
  const onEditRecord = (index: number) => {
    setSelectedRecordIndex(index); // Track selected record for editing
    setModalVisible(true); // Open modal for editing
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <View style={styles.content}>
        <Text style={styles.title}>MIODENARO</Text>
        <ListComponent records={records} removeRecord={removeRecord} onEditRecord={onEditRecord} />

        <TotalComponent total={total} title="Total (Without Debt)" />
        <TotalComponent total={netTotal} title="Net Total (With Debt)" />
        <TotalComponent total={totalAssets} title="Total Assets" />
        <TotalComponent total={totalLiquidity} title="Total Liquidity" />
        <TotalComponent total={totalDebt} title="Total Debt" />
        <TotalComponent total={totalLiquidityMinusDebt} title="Total Net Liquidity" />

        <Button
        title="Add New Record"
        onPress={() => {
          setSelectedRecordIndex(null); // Reset the index for a new record
          setModalVisible(true);        // Open the modal in add mode
        }}
      />

        {/* Render the AddRecordModal and pass necessary props */}
        <AddRecordModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          addRecord={addOrEditRecord}
          existingRecord={selectedRecordIndex !== null ? records[selectedRecordIndex] : null} // Pass the selected record to edit
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default HomeComponent;
