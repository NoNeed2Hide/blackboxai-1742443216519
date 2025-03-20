import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PreferencesContext = createContext();

export const usePreferences = () => useContext(PreferencesContext);

const DEFAULT_PREFERENCES = {
  currency: 'USD',
  language: 'en',
  filters: {
    climate: [],
    activityTypes: [],
    maxDistance: null,
    safetyRating: 0,
    visaRequired: null
  },
  notifications: {
    priceAlerts: true,
    tripReminders: true,
    deals: true
  },
  displayPreferences: {
    darkMode: false,
    highContrast: false
  }
};

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const storedPreferences = await AsyncStorage.getItem('preferences');
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates) => {
    try {
      const updatedPreferences = { ...preferences, ...updates };
      await AsyncStorage.setItem('preferences', JSON.stringify(updatedPreferences));
      setPreferences(updatedPreferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  };

  const updateFilters = async (filterUpdates) => {
    try {
      const updatedFilters = { ...preferences.filters, ...filterUpdates };
      const updatedPreferences = { ...preferences, filters: updatedFilters };
      await AsyncStorage.setItem('preferences', JSON.stringify(updatedPreferences));
      setPreferences(updatedPreferences);
    } catch (error) {
      console.error('Error updating filters:', error);
      throw error;
    }
  };

  const updateNotificationSettings = async (notificationUpdates) => {
    try {
      const updatedNotifications = { ...preferences.notifications, ...notificationUpdates };
      const updatedPreferences = { ...preferences, notifications: updatedNotifications };
      await AsyncStorage.setItem('preferences', JSON.stringify(updatedPreferences));
      setPreferences(updatedPreferences);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  };

  const resetPreferences = async () => {
    try {
      await AsyncStorage.setItem('preferences', JSON.stringify(DEFAULT_PREFERENCES));
      setPreferences(DEFAULT_PREFERENCES);
    } catch (error) {
      console.error('Error resetting preferences:', error);
      throw error;
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        loading,
        updatePreferences,
        updateFilters,
        updateNotificationSettings,
        resetPreferences
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};