import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Surface,
  Text,
  Button,
  IconButton,
  Portal,
  Modal,
  TextInput,
  List,
  Chip,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Mock data - In a real app, this would come from an API
const MOCK_ITINERARY = {
  destination: 'Bali, Indonesia',
  startDate: '2024-01-15',
  endDate: '2024-01-20',
  days: [
    {
      date: '2024-01-15',
      activities: [
        {
          id: '1',
          time: '09:00',
          title: 'Temple Visit',
          location: 'Tanah Lot Temple',
          cost: 25,
          type: 'Cultural',
          notes: 'Bring camera and modest clothing',
        },
        {
          id: '2',
          time: '14:00',
          title: 'Beach Relaxation',
          location: 'Nusa Dua Beach',
          cost: 0,
          type: 'Leisure',
          notes: 'Don\'t forget sunscreen',
        },
      ],
    },
    {
      date: '2024-01-16',
      activities: [
        {
          id: '3',
          time: '10:00',
          title: 'Cooking Class',
          location: 'Ubud Cooking School',
          cost: 45,
          type: 'Cultural',
          notes: 'Vegetarian options available',
        },
      ],
    },
  ],
};

const ActivityCard = ({ activity, onEdit, onDelete }) => {
  const theme = useTheme();

  return (
    <Surface style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityTime}>{activity.time}</Text>
        <View style={styles.activityActions}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => onEdit(activity)}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={() => onDelete(activity)}
          />
        </View>
      </View>

      <Text style={styles.activityTitle}>{activity.title}</Text>
      
      <View style={styles.activityDetails}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="map-marker" size={16} color={theme.colors.primary} />
          <Text style={styles.detailText}>{activity.location}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="currency-usd" size={16} color={theme.colors.primary} />
          <Text style={styles.detailText}>${activity.cost}</Text>
        </View>
      </View>

      <Chip icon="tag" style={styles.typeChip}>{activity.type}</Chip>
      
      {activity.notes && (
        <View style={styles.notes}>
          <MaterialCommunityIcons name="note-text" size={16} color="#666" />
          <Text style={styles.notesText}>{activity.notes}</Text>
        </View>
      )}
    </Surface>
  );
};

const AddActivityModal = ({ visible, onDismiss, onSave, initialActivity = null }) => {
  const [activity, setActivity] = useState(initialActivity || {
    time: '',
    title: '',
    location: '',
    cost: '',
    type: '',
    notes: '',
  });

  useEffect(() => {
    if (initialActivity) {
      setActivity(initialActivity);
    }
  }, [initialActivity]);

  const handleSave = () => {
    onSave(activity);
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <Text style={styles.modalTitle}>
          {initialActivity ? 'Edit Activity' : 'Add New Activity'}
        </Text>

        <TextInput
          label="Time"
          value={activity.time}
          onChangeText={(text) => setActivity({ ...activity, time: text })}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Title"
          value={activity.title}
          onChangeText={(text) => setActivity({ ...activity, title: text })}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Location"
          value={activity.location}
          onChangeText={(text) => setActivity({ ...activity, location: text })}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Cost ($)"
          value={String(activity.cost)}
          onChangeText={(text) => setActivity({ ...activity, cost: text })}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Type"
          value={activity.type}
          onChangeText={(text) => setActivity({ ...activity, type: text })}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Notes"
          value={activity.notes}
          onChangeText={(text) => setActivity({ ...activity, notes: text })}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <View style={styles.modalActions}>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button mode="contained" onPress={handleSave}>Save</Button>
        </View>
      </Modal>
    </Portal>
  );
};

const ItineraryScreen = () => {
  const [loading, setLoading] = useState(true);
  const [itinerary, setItinerary] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    loadItinerary();
  }, []);

  const loadItinerary = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setItinerary(MOCK_ITINERARY);
    } catch (error) {
      console.error('Error loading itinerary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = (date) => {
    setSelectedDate(date);
    setSelectedActivity(null);
    setShowAddModal(true);
  };

  const handleEditActivity = (activity, date) => {
    setSelectedDate(date);
    setSelectedActivity(activity);
    setShowAddModal(true);
  };

  const handleDeleteActivity = (activityToDelete, date) => {
    const updatedItinerary = {
      ...itinerary,
      days: itinerary.days.map(day => {
        if (day.date === date) {
          return {
            ...day,
            activities: day.activities.filter(activity => activity.id !== activityToDelete.id),
          };
        }
        return day;
      }),
    };
    setItinerary(updatedItinerary);
  };

  const handleSaveActivity = (activityData) => {
    const updatedItinerary = {
      ...itinerary,
      days: itinerary.days.map(day => {
        if (day.date === selectedDate) {
          if (selectedActivity) {
            // Edit existing activity
            return {
              ...day,
              activities: day.activities.map(activity =>
                activity.id === selectedActivity.id ? { ...activity, ...activityData } : activity
              ),
            };
          } else {
            // Add new activity
            const newActivity = {
              ...activityData,
              id: Math.random().toString(),
            };
            return {
              ...day,
              activities: [...day.activities, newActivity],
            };
          }
        }
        return day;
      }),
    };
    setItinerary(updatedItinerary);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading your itinerary...</Text>
      </View>
    );
  }

  if (!itinerary) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="calendar-blank" size={64} color="#666" />
        <Text style={styles.emptyText}>No itinerary found</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Home')}
          style={styles.createButton}
        >
          Plan New Trip
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header}>
        <Text style={styles.destination}>{itinerary.destination}</Text>
        <Text style={styles.dates}>
          {itinerary.startDate} - {itinerary.endDate}
        </Text>
      </Surface>

      {itinerary.days.map(day => (
        <Surface key={day.date} style={styles.dayCard}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayDate}>{day.date}</Text>
            <Button
              mode="contained-tonal"
              onPress={() => handleAddActivity(day.date)}
              icon="plus"
            >
              Add Activity
            </Button>
          </View>

          {day.activities.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onEdit={() => handleEditActivity(activity, day.date)}
              onDelete={() => handleDeleteActivity(activity, day.date)}
            />
          ))}
        </Surface>
      ))}

      <AddActivityModal
        visible={showAddModal}
        onDismiss={() => setShowAddModal(false)}
        onSave={handleSaveActivity}
        initialActivity={selectedActivity}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  createButton: {
    marginTop: 10,
  },
  header: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
    elevation: 2,
  },
  destination: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dates: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  dayCard: {
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dayDate: {
    fontSize: 18,
    fontWeight: '600',
  },
  activityCard: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    elevation: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTime: {
    fontSize: 16,
    fontWeight: '500',
  },
  activityActions: {
    flexDirection: 'row',
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  activityDetails: {
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  typeChip: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  notes: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  notesText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
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
  input: {
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
});

export default ItineraryScreen;