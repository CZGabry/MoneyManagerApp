import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';

interface AddRecordModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  addRecord: (name: string, value: number, nature: 'credit' | 'debt', category: 'asset' | 'liquidity') => void;
  existingRecord?: MoneyRecord | null;
}

const AddRecordModal: React.FC<AddRecordModalProps> = ({
  modalVisible,
  setModalVisible,
  addRecord,
  existingRecord,
}) => {
  const [newRecordName, setNewRecordName] = useState('');
  const [newRecordValue, setNewRecordValue] = useState('');
  const [recordType, setRecordType] = useState<'credit' | 'debt'>('credit');
  const [recordCategory, setRecordCategory] = useState<'asset' | 'liquidity'>('asset');

  // Check if we're in edit mode by checking if existingRecord is passed
  const isEditMode = !!existingRecord;

  // Reset form fields when modal is opened for adding a new record (when existingRecord is null)
  useEffect(() => {
    if (!existingRecord && modalVisible) {
      // Add mode: reset form fields
      setNewRecordName('');
      setNewRecordValue('');
      setRecordType('credit'); // Default to credit
      setRecordCategory('asset'); // Default to asset
    }
  }, [modalVisible, existingRecord]);

  // Use useEffect to prefill form fields if an existingRecord is passed (edit mode)
  useEffect(() => {
    if (existingRecord) {
      // Edit mode: prefill the form with existing record details
      setNewRecordName(existingRecord.name);
      setNewRecordValue(String(Math.abs(existingRecord.value))); // Always show the positive value
      setRecordType(existingRecord.nature);
      setRecordCategory(existingRecord.category);
    }
  }, [existingRecord]);

  const handleSave = () => {
    if (newRecordName && newRecordValue) {
      const recordValue = Number(newRecordValue);
      addRecord(newRecordName, recordValue, recordType, recordCategory);
      // Reset the form fields after saving
      setNewRecordName('');
      setNewRecordValue('');
      setRecordType('credit');
      setRecordCategory('asset');
      setModalVisible(false);
    }
  };

  const handleValueChange = (value: string) => {
    // Ensure the value is always positive
    const positiveValue = value.replace(/[^0-9.]/g, ''); // Allow only numbers and period
    setNewRecordValue(positiveValue);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalView}>
        <Text style={styles.modalText}>{isEditMode ? 'Edit Record' : 'Add New Record'}</Text>

        {/* Record Name */}
        <TextInput
          style={styles.input}
          placeholder="Record Name"
          value={newRecordName}
          onChangeText={setNewRecordName}
          editable={!isEditMode} // Name field is non-editable in edit mode
        />

        {/* Record Value */}
        <TextInput
          style={styles.input}
          placeholder="Record Value"
          keyboardType="numeric"
          value={newRecordValue}
          onChangeText={handleValueChange} // Handle input change to allow only positive numbers
        />

        {/* Only show Type and Category if NOT in edit mode */}
        {!isEditMode && (
          <>
            {/* Toggle between Credit and Debt */}
            <View style={styles.buttonContainer}>
              <Button
                title="Credit"
                onPress={() => {
                  setRecordType('credit');
                  setRecordCategory('asset'); // Automatically set to asset when credit is selected
                }}
                color={recordType === 'credit' ? 'green' : 'gray'}
              />
              <Button
                title="Debt"
                onPress={() => setRecordType('debt')}
                color={recordType === 'debt' ? 'red' : 'gray'}
              />
            </View>

            {/* Only show Category if recordType is credit */}
            {recordType === 'credit' && (
              <View style={styles.buttonContainer}>
                <Button
                  title="Asset"
                  onPress={() => setRecordCategory('asset')}
                  color={recordCategory === 'asset' ? 'blue' : 'gray'}
                />
                <Button
                  title="Liquidity"
                  onPress={() => setRecordCategory('liquidity')}
                  color={recordCategory === 'liquidity' ? 'blue' : 'gray'}
                />
              </View>
            )}
          </>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
    color: '#FFF',
  },
  input: {
    width: 250,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFF',
    color: '#000',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default AddRecordModal;
