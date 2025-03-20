import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Surface,
  Text,
  IconButton,
  Button,
  useTheme,
  ActivityIndicator,
  Portal,
  Dialog,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data - In a real app, this would be fetched from an API
const MOCK_WISHLIST_DATA = [
  {
    id: '1',
    name: 'Bali, Indonesia',
    image: 'https://images.pexels.com/photos/1802255/pexels-photo-1802255.jpeg',
    totalCost: 1200,
    climate: 'Tropical',
    activities: ['Beach', 'Cultural'],
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Paris, France',
    image: 'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg',
    totalCost: 2000,
    climate: 'Temperate',
    activities: ['City', 'Cultural'],
    rating: 4.8,
  },
];

const WishlistCard = ({ destination, onRemove, onPress, onShare }) => {
  const theme = useTheme();

  return (
    <Surface style={styles.card}>
      <TouchableOpacity onPress={onPress}>
        <Image source={{ uri: destination.image }} style={styles.image} />
        
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.destinationName}>{destination.name}</Text>
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{destination.rating}</Text>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <MaterialCommunityIcons name="thermometer" size={16} color={theme.colors.primary} />
              <Text style={styles.tagText}>{destination.climate}</Text>
            </View>
            {destination.activities.map((activity) => (
              <View key={activity} style={styles.tag}>
                <MaterialCommunityIcons name="tag" size={16} color={theme.colors.primary} />
                <Text style={styles.tagText}>{activity}</Text>
              </View>
            ))}
          </View>

          <View style={styles.costContainer}>
            <Text style={styles.costLabel}>Estimated Cost:</Text>
            <Text style={styles.cost}>${destination.totalCost}</Text>
          </View>

          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={onShare}
              icon="share-variant"
              style={styles.actionButton}
            >
              Share
            </Button>
            <Button
              mode="outlined"
              onPress={onRemove}
              icon="delete"
              style={[styles.actionButton, styles.removeButton]}
              textColor={theme.colors.error}
            >
              Remove
            </Button>
          </View>
        </View>
      </TouchableOpacity>
    </Surface>
  );
};

const WishlistScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWishlist(MOCK_WISHLIST_DATA);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (destination) => {
    setSelectedDestination(destination);
    setShowDeleteDialog(true);
  };

  const confirmRemove = async () => {
    if (selectedDestination) {
      const newWishlist = wishlist.filter(item => item.id !== selectedDestination.id);
      setWishlist(newWishlist);
      // In a real app, you would also update the backend
      setShowDeleteDialog(false);
      setSelectedDestination(null);
    }
  };

  const handleShare = async (destination) => {
    try {
      // In a real app, this would use the Share API
      console.log('Sharing destination:', destination.name);
    } catch (error) {
      console.error('Error sharing destination:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading your wishlist...</Text>
      </View>
    );
  }

  if (wishlist.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="heart-outline" size={64} color="#666" />
        <Text style={styles.emptyText}>Your wishlist is empty</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Home')}
          style={styles.exploreButton}
        >
          Explore Destinations
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wishlist</Text>
        <Text style={styles.subtitle}>{wishlist.length} saved destinations</Text>
      </View>

      <View style={styles.wishlistContainer}>
        {wishlist.map(destination => (
          <WishlistCard
            key={destination.id}
            destination={destination}
            onRemove={() => handleRemove(destination)}
            onPress={() => navigation.navigate('DestinationDetail', { destination })}
            onShare={() => handleShare(destination)}
          />
        ))}
      </View>

      <Portal>
        <Dialog
          visible={showDeleteDialog}
          onDismiss={() => setShowDeleteDialog(false)}
        >
          <Dialog.Title>Remove from Wishlist</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure you want to remove {selectedDestination?.name} from your wishlist?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onPress={confirmRemove} textColor="error">Remove</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  exploreButton: {
    marginTop: 10,
  },
  header: {
    padding: 20,
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
  wishlistContainer: {
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
  cardContent: {
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    marginLeft: 4,
    fontSize: 12,
  },
  costContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  costLabel: {
    fontSize: 16,
    color: '#666',
  },
  cost: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  removeButton: {
    borderColor: 'error',
  },
});

export default WishlistScreen;