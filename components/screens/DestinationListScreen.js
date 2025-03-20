import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Surface,
  Text,
  ActivityIndicator,
  Chip,
  useTheme,
  Button,
  IconButton,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Mock data - In a real app, this would come from an API
const MOCK_DESTINATIONS = [
  {
    id: '1',
    name: 'Bali, Indonesia',
    image: 'https://images.pexels.com/photos/1802255/pexels-photo-1802255.jpeg',
    description: 'Tropical paradise with beautiful beaches and rich culture',
    totalCost: 1200,
    costs: {
      travel: 500,
      accommodation: 400,
      food: 200,
      activities: 100,
    },
    climate: 'Tropical',
    activities: ['Beach', 'Cultural'],
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Paris, France',
    image: 'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg',
    description: 'City of lights and romance',
    totalCost: 2000,
    costs: {
      travel: 800,
      accommodation: 600,
      food: 300,
      activities: 300,
    },
    climate: 'Temperate',
    activities: ['City', 'Cultural'],
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Swiss Alps',
    image: 'https://images.pexels.com/photos/355747/pexels-photo-355747.jpeg',
    description: 'Mountain paradise for adventure seekers',
    totalCost: 2500,
    costs: {
      travel: 1000,
      accommodation: 800,
      food: 400,
      activities: 300,
    },
    climate: 'Cold',
    activities: ['Mountains', 'Adventure'],
    rating: 4.7,
  },
];

const DestinationCard = ({ destination, onPress, onWishlist, toggleWishlist }) => {
  const theme = useTheme();

  return (
    <Surface style={styles.card}>
      <Image source={{ uri: destination.image }} style={styles.image} />
      <IconButton
        icon={onWishlist ? 'heart' : 'heart-outline'}
        size={24}
        onPress={() => toggleWishlist(destination.id)}
        style={styles.wishlistButton}
        iconColor={onWishlist ? theme.colors.error : theme.colors.text}
      />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.destinationName}>{destination.name}</Text>
          <View style={styles.ratingContainer}>
            <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{destination.rating}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {destination.description}
        </Text>

        <View style={styles.tagsContainer}>
          {destination.activities.map((activity) => (
            <Chip key={activity} style={styles.tag} textStyle={styles.tagText}>
              {activity}
            </Chip>
          ))}
        </View>

        <View style={styles.costBreakdown}>
          <View style={styles.costItem}>
            <MaterialCommunityIcons name="airplane" size={20} color={theme.colors.primary} />
            <Text style={styles.costText}>${destination.costs.travel}</Text>
          </View>
          <View style={styles.costItem}>
            <MaterialCommunityIcons name="bed" size={20} color={theme.colors.primary} />
            <Text style={styles.costText}>${destination.costs.accommodation}</Text>
          </View>
          <View style={styles.costItem}>
            <MaterialCommunityIcons name="food" size={20} color={theme.colors.primary} />
            <Text style={styles.costText}>${destination.costs.food}</Text>
          </View>
          <View style={styles.costItem}>
            <MaterialCommunityIcons name="ticket" size={20} color={theme.colors.primary} />
            <Text style={styles.costText}>${destination.costs.activities}</Text>
          </View>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Estimated Cost:</Text>
          <Text style={styles.totalCost}>${destination.totalCost}</Text>
        </View>

        <Button
          mode="contained"
          onPress={() => onPress(destination)}
          style={styles.viewButton}
        >
          View Details
        </Button>
      </View>
    </Surface>
  );
};

const DestinationListScreen = ({ route, navigation }) => {
  const { budget, filters } = route.params;
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());

  useEffect(() => {
    // Simulate API call
    const fetchDestinations = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Filter destinations based on budget and preferences
        const filteredDestinations = MOCK_DESTINATIONS.filter(
          dest => dest.totalCost <= budget
        );
        setDestinations(filteredDestinations);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [budget]);

  const toggleWishlist = (destinationId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(destinationId)) {
        newWishlist.delete(destinationId);
      } else {
        newWishlist.add(destinationId);
      }
      return newWishlist;
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Finding perfect destinations for you...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.resultsText}>
          {destinations.length} destinations within your budget
        </Text>
      </View>

      <View style={styles.destinationList}>
        {destinations.map(destination => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            onPress={(dest) => navigation.navigate('DestinationDetail', { destination: dest })}
            onWishlist={wishlist.has(destination.id)}
            toggleWishlist={toggleWishlist}
          />
        ))}
      </View>
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
  header: {
    padding: 15,
  },
  resultsText: {
    fontSize: 16,
    color: '#666',
  },
  destinationList: {
    padding: 10,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  wishlistButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  cardContent: {
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  destinationName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
  },
  costBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  costItem: {
    alignItems: 'center',
  },
  costText: {
    marginTop: 4,
    fontSize: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalCost: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewButton: {
    marginTop: 5,
  },
});

export default DestinationListScreen;