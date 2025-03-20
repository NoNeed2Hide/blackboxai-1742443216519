import React, { useState } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  Dimensions,
  Linking,
} from 'react-native';
import {
  Surface,
  Text,
  Button,
  Chip,
  List,
  Portal,
  Modal,
  useTheme,
  ProgressBar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CostBreakdownCard = ({ costs, totalCost }) => {
  const theme = useTheme();

  const calculatePercentage = (cost) => (cost / totalCost) * 100;

  return (
    <Surface style={styles.costCard}>
      <Text style={styles.sectionTitle}>Cost Breakdown</Text>
      
      <List.Item
        title="Travel"
        description={`$${costs.travel}`}
        left={() => <MaterialCommunityIcons name="airplane" size={24} color={theme.colors.primary} />}
        right={() => <Text style={styles.percentage}>{calculatePercentage(costs.travel).toFixed(1)}%</Text>}
      />
      <ProgressBar progress={costs.travel / totalCost} color={theme.colors.primary} style={styles.progressBar} />

      <List.Item
        title="Accommodation"
        description={`$${costs.accommodation}`}
        left={() => <MaterialCommunityIcons name="bed" size={24} color={theme.colors.primary} />}
        right={() => <Text style={styles.percentage}>{calculatePercentage(costs.accommodation).toFixed(1)}%</Text>}
      />
      <ProgressBar progress={costs.accommodation / totalCost} color={theme.colors.primary} style={styles.progressBar} />

      <List.Item
        title="Food"
        description={`$${costs.food}`}
        left={() => <MaterialCommunityIcons name="food" size={24} color={theme.colors.primary} />}
        right={() => <Text style={styles.percentage}>{calculatePercentage(costs.food).toFixed(1)}%</Text>}
      />
      <ProgressBar progress={costs.food / totalCost} color={theme.colors.primary} style={styles.progressBar} />

      <List.Item
        title="Activities"
        description={`$${costs.activities}`}
        left={() => <MaterialCommunityIcons name="ticket" size={24} color={theme.colors.primary} />}
        right={() => <Text style={styles.percentage}>{calculatePercentage(costs.activities).toFixed(1)}%</Text>}
      />
      <ProgressBar progress={costs.activities / totalCost} color={theme.colors.primary} style={styles.progressBar} />

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Estimated Cost</Text>
        <Text style={styles.totalAmount}>${totalCost}</Text>
      </View>
    </Surface>
  );
};

// Mock activities data - In a real app, this would come from an API
const MOCK_ACTIVITIES = [
  {
    id: '1',
    name: 'Guided City Tour',
    description: 'Explore the city with a local expert guide',
    duration: '4 hours',
    cost: 50,
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Cultural Workshop',
    description: 'Learn about local traditions and crafts',
    duration: '2 hours',
    cost: 35,
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Food Tasting Tour',
    description: 'Sample local delicacies and traditional dishes',
    duration: '3 hours',
    cost: 65,
    rating: 4.7,
  },
];

const DestinationDetailScreen = ({ route }) => {
  const { destination } = route.params;
  const theme = useTheme();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleBooking = (type) => {
    // In a real app, this would integrate with booking APIs
    const bookingUrls = {
      flights: 'https://www.expedia.com/Flights',
      hotels: 'https://www.booking.com',
      activities: 'https://www.viator.com',
    };

    Linking.openURL(bookingUrls[type]);
    setShowBookingModal(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: destination.image }} style={styles.image} />
      
      <Surface style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{destination.name}</Text>
          <View style={styles.ratingContainer}>
            <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
            <Text style={styles.rating}>{destination.rating}</Text>
          </View>
        </View>

        <Text style={styles.description}>{destination.description}</Text>

        <View style={styles.tagsContainer}>
          <Chip icon="thermometer" style={styles.tag}>{destination.climate}</Chip>
          {destination.activities.map((activity) => (
            <Chip key={activity} icon="tag" style={styles.tag}>{activity}</Chip>
          ))}
        </View>

        <CostBreakdownCard costs={destination.costs} totalCost={destination.totalCost} />

        <Surface style={styles.activitiesCard}>
          <Text style={styles.sectionTitle}>Recommended Activities</Text>
          {MOCK_ACTIVITIES.map((activity) => (
            <List.Item
              key={activity.id}
              title={activity.name}
              description={activity.description}
              left={() => <MaterialCommunityIcons name="calendar" size={24} color={theme.colors.primary} />}
              right={() => (
                <View style={styles.activityRight}>
                  <Text style={styles.activityCost}>${activity.cost}</Text>
                  <Text style={styles.activityDuration}>{activity.duration}</Text>
                </View>
              )}
            />
          ))}
        </Surface>

        <Button
          mode="contained"
          onPress={() => setShowBookingModal(true)}
          style={styles.bookButton}
          labelStyle={styles.bookButtonLabel}
        >
          Book Now
        </Button>
      </Surface>

      <Portal>
        <Modal
          visible={showBookingModal}
          onDismiss={() => setShowBookingModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Book Your Trip</Text>
          
          <Button
            mode="contained"
            onPress={() => handleBooking('flights')}
            style={styles.modalButton}
            icon="airplane"
          >
            Book Flights
          </Button>
          
          <Button
            mode="contained"
            onPress={() => handleBooking('hotels')}
            style={styles.modalButton}
            icon="bed"
          >
            Book Hotels
          </Button>
          
          <Button
            mode="contained"
            onPress={() => handleBooking('activities')}
            style={styles.modalButton}
            icon="ticket"
          >
            Book Activities
          </Button>

          <Button
            mode="outlined"
            onPress={() => setShowBookingModal(false)}
            style={styles.modalButton}
          >
            Cancel
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
  image: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    margin: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  costCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  progressBar: {
    height: 4,
    marginBottom: 15,
  },
  percentage: {
    fontSize: 14,
    color: '#666',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  activitiesCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  activityCost: {
    fontSize: 16,
    fontWeight: '500',
  },
  activityDuration: {
    fontSize: 12,
    color: '#666',
  },
  bookButton: {
    marginTop: 10,
    paddingVertical: 8,
  },
  bookButtonLabel: {
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
    textAlign: 'center',
  },
  modalButton: {
    marginBottom: 10,
  },
});

export default DestinationDetailScreen;