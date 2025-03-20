import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Surface,
  Text,
  TextInput,
  Button,
  Chip,
  Portal,
  Modal,
  useTheme,
  IconButton,
  Divider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePreferences } from '../../contexts/PreferencesContext';

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const { preferences, updateFilters } = usePreferences();
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    climate: [],
    activityTypes: [],
    maxDistance: null,
    safetyRating: 0,
  });

  const climateOptions = [
    { label: 'Tropical', icon: 'palm-tree' },
    { label: 'Temperate', icon: 'tree' },
    { label: 'Cold', icon: 'snowflake' },
  ];

  const activityOptions = [
    { label: 'Beach', icon: 'beach' },
    { label: 'Mountains', icon: 'mountain' },
    { label: 'City', icon: 'city' },
    { label: 'Cultural', icon: 'museum' },
    { label: 'Adventure', icon: 'hiking' },
  ];

  const handleSearch = () => {
    if (!budget) {
      // Show error
      return;
    }

    // Save filters
    updateFilters(selectedFilters);

    // Navigate to results
    navigation.navigate('DestinationList', {
      budget: parseFloat(budget),
      startDate,
      endDate,
      filters: selectedFilters,
    });
  };

  const toggleClimate = (climate) => {
    setSelectedFilters(prev => ({
      ...prev,
      climate: prev.climate.includes(climate)
        ? prev.climate.filter(c => c !== climate)
        : [...prev.climate, climate],
    }));
  };

  const toggleActivity = (activity) => {
    setSelectedFilters(prev => ({
      ...prev,
      activityTypes: prev.activityTypes.includes(activity)
        ? prev.activityTypes.filter(a => a !== activity)
        : [...prev.activityTypes, activity],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header}>
        <Text style={styles.title}>Where would you like to go?</Text>
        <Text style={styles.subtitle}>Enter your budget and preferences</Text>
      </Surface>

      <Surface style={styles.budgetSection}>
        <TextInput
          label="Your Budget"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
          mode="outlined"
          left={<TextInput.Icon icon="currency-usd" />}
          style={styles.input}
        />

        <View style={styles.dateContainer}>
          <TextInput
            label="Start Date"
            value={startDate}
            onChangeText={setStartDate}
            mode="outlined"
            left={<TextInput.Icon icon="calendar" />}
            style={[styles.input, styles.dateInput]}
          />
          <TextInput
            label="End Date"
            value={endDate}
            onChangeText={setEndDate}
            mode="outlined"
            left={<TextInput.Icon icon="calendar" />}
            style={[styles.input, styles.dateInput]}
          />
        </View>
      </Surface>

      <Surface style={styles.filtersSection}>
        <View style={styles.filterHeader}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <IconButton
            icon="tune"
            onPress={() => setShowFilters(true)}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
          {selectedFilters.climate.map((climate) => (
            <Chip
              key={climate}
              mode="outlined"
              onClose={() => toggleClimate(climate)}
              style={styles.chip}
            >
              {climate}
            </Chip>
          ))}
          {selectedFilters.activityTypes.map((activity) => (
            <Chip
              key={activity}
              mode="outlined"
              onClose={() => toggleActivity(activity)}
              style={styles.chip}
            >
              {activity}
            </Chip>
          ))}
        </ScrollView>
      </Surface>

      <Button
        mode="contained"
        onPress={handleSearch}
        style={styles.searchButton}
        labelStyle={styles.searchButtonLabel}
      >
        Find Destinations
      </Button>

      <Portal>
        <Modal
          visible={showFilters}
          onDismiss={() => setShowFilters(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Filter Preferences</Text>
          
          <Text style={styles.filterGroupTitle}>Climate</Text>
          <View style={styles.optionsGrid}>
            {climateOptions.map((option) => (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.optionButton,
                  selectedFilters.climate.includes(option.label) && styles.selectedOption,
                ]}
                onPress={() => toggleClimate(option.label)}
              >
                <MaterialCommunityIcons
                  name={option.icon}
                  size={24}
                  color={selectedFilters.climate.includes(option.label)
                    ? theme.colors.primary
                    : theme.colors.text}
                />
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Divider style={styles.divider} />

          <Text style={styles.filterGroupTitle}>Activities</Text>
          <View style={styles.optionsGrid}>
            {activityOptions.map((option) => (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.optionButton,
                  selectedFilters.activityTypes.includes(option.label) && styles.selectedOption,
                ]}
                onPress={() => toggleActivity(option.label)}
              >
                <MaterialCommunityIcons
                  name={option.icon}
                  size={24}
                  color={selectedFilters.activityTypes.includes(option.label)
                    ? theme.colors.primary
                    : theme.colors.text}
                />
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            mode="contained"
            onPress={() => setShowFilters(false)}
            style={styles.applyButton}
          >
            Apply Filters
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    marginBottom: 10,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  budgetSection: {
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  input: {
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 0.48,
  },
  filtersSection: {
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  chipsContainer: {
    marginTop: 10,
  },
  chip: {
    marginRight: 8,
  },
  searchButton: {
    margin: 10,
    paddingVertical: 8,
  },
  searchButtonLabel: {
    fontSize: 16,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  optionButton: {
    width: '30%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
  },
  selectedOption: {
    borderColor: 'primary',
    backgroundColor: '#f0f9ff',
  },
  optionLabel: {
    marginTop: 5,
    fontSize: 12,
  },
  divider: {
    marginVertical: 15,
  },
  applyButton: {
    marginTop: 10,
  },
});

export default HomeScreen;