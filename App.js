import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { UserProvider } from './contexts/UserContext';
import { PreferencesProvider } from './contexts/PreferencesContext';
import AppNavigator from './navigators/AppNavigator';
import { theme } from './constants/theme';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <UserProvider>
        <PreferencesProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </PreferencesProvider>
      </UserProvider>
    </PaperProvider>
  );
}