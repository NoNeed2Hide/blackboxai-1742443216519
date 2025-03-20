import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import {
  Surface,
  Text,
  Button,
  List,
  Switch,
  Portal,
  Modal,
  TextInput,
  Divider,
  useTheme,
  IconButton,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';
import { usePreferences } from '../../contexts/PreferencesContext';

const ProfileScreen = () => {
  const theme = useTheme();
  const { user, logout, updateUser } = useUser();
  const { preferences, updatePreferences, updateNotificationSettings } = usePreferences();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateUser(editedProfile);
      setShowEditProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCurrencySelect = async (currency) => {
    try {
      await updatePreferences({ currency });
      setShowCurrencyModal(false);
    } catch (error) {
      console.error('Error updating currency:', error);
    }
  };

  const toggleNotificationSetting = async (setting) => {
    try {
      const updates = {
        [setting]: !preferences.notifications[setting],
      };
      await updateNotificationSettings(updates);
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.placeholderAvatar]}>
                <MaterialCommunityIcons name="account" size={40} color="#fff" />
              </View>
            )}
            <IconButton
              icon="camera"
              size={20}
              style={styles.editAvatarButton}
              onPress={() => {/* Handle avatar update */}}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
          <Button
            mode="contained"
            onPress={() => setShowEditProfile(true)}
            style={styles.editButton}
          >
            Edit Profile
          </Button>
        </View>
      </Surface>

      <Surface style={styles.section}>
        <List.Section>
          <List.Subheader>Preferences</List.Subheader>
          
          <List.Item
            title="Currency"
            description={preferences.currency}
            left={props => <List.Icon {...props} icon="currency-usd" />}
            onPress={() => setShowCurrencyModal(true)}
          />
          
          <List.Item
            title="Language"
            description={preferences.language.toUpperCase()}
            left={props => <List.Icon {...props} icon="translate" />}
          />

          <List.Item
            title="Dark Mode"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={preferences.displayPreferences.darkMode}
                onValueChange={() => {
                  updatePreferences({
                    displayPreferences: {
                      ...preferences.displayPreferences,
                      darkMode: !preferences.displayPreferences.darkMode,
                    },
                  });
                }}
              />
            )}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Notifications</List.Subheader>
          
          <List.Item
            title="Price Alerts"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={preferences.notifications.priceAlerts}
                onValueChange={() => toggleNotificationSetting('priceAlerts')}
              />
            )}
          />
          
          <List.Item
            title="Trip Reminders"
            left={props => <List.Icon {...props} icon="calendar-clock" />}
            right={() => (
              <Switch
                value={preferences.notifications.tripReminders}
                onValueChange={() => toggleNotificationSetting('tripReminders')}
              />
            )}
          />
          
          <List.Item
            title="Deals & Offers"
            left={props => <List.Icon {...props} icon="tag" />}
            right={() => (
              <Switch
                value={preferences.notifications.deals}
                onValueChange={() => toggleNotificationSetting('deals')}
              />
            )}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Account</List.Subheader>
          
          <List.Item
            title="Privacy Settings"
            left={props => <List.Icon {...props} icon="shield-account" />}
            onPress={() => {/* Navigate to Privacy Settings */}}
          />
          
          <List.Item
            title="Help & Support"
            left={props => <List.Icon {...props} icon="help-circle" />}
            onPress={() => {/* Navigate to Help & Support */}}
          />
          
          <List.Item
            title="About"
            left={props => <List.Icon {...props} icon="information" />}
            onPress={() => {/* Navigate to About */}}
          />
        </List.Section>
      </Surface>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        textColor={theme.colors.error}
      >
        Logout
      </Button>

      {/* Edit Profile Modal */}
      <Portal>
        <Modal
          visible={showEditProfile}
          onDismiss={() => setShowEditProfile(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Edit Profile</Text>
          
          <TextInput
            label="Name"
            value={editedProfile.name}
            onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
            mode="outlined"
            style={styles.input}
          />
          
          <TextInput
            label="Email"
            value={editedProfile.email}
            onChangeText={(text) => setEditedProfile({ ...editedProfile, email: text })}
            mode="outlined"
            style={styles.input}
          />

          <View style={styles.modalActions}>
            <Button onPress={() => setShowEditProfile(false)}>Cancel</Button>
            <Button mode="contained" onPress={handleUpdateProfile}>Save</Button>
          </View>
        </Modal>
      </Portal>

      {/* Currency Selection Modal */}
      <Portal>
        <Modal
          visible={showCurrencyModal}
          onDismiss={() => setShowCurrencyModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Select Currency</Text>
          
          {currencies.map((currency) => (
            <List.Item
              key={currency}
              title={currency}
              onPress={() => handleCurrencySelect(currency)}
              right={() => 
                preferences.currency === currency && 
                <MaterialCommunityIcons name="check" size={24} color={theme.colors.primary} />
              }
            />
          ))}
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
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderAvatar: {
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  editButton: {
    marginTop: 10,
  },
  section: {
    margin: 10,
    borderRadius: 10,
    elevation: 2,
  },
  logoutButton: {
    margin: 10,
    marginTop: 20,
    marginBottom: 30,
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

export default ProfileScreen;