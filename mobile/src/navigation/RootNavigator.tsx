import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useTheme } from 'react-native-paper';
import { HomeScreen } from '../screens/HomeScreen';
import { ProjectsScreen } from '../screens/ProjectsScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import { BlogScreen } from '../screens/BlogScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ProjectDetailScreen } from '../screens/ProjectDetailScreen';
import { BlogDetailScreen } from '../screens/BlogDetailScreen';
import { ContactScreen } from '../screens/ContactScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ProjectRequestScreen } from '../screens/ProjectRequestScreen';
import { BugReportScreen } from '../screens/BugReportScreen';
import { MyRequestsScreen } from '../screens/MyRequestsScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import type { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<keyof TabParamList, { active: string; inactive: string }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Projects: { active: 'folder-multiple', inactive: 'folder-multiple-outline' },
  Services: { active: 'briefcase', inactive: 'briefcase-outline' },
  Blog: { active: 'post', inactive: 'post-outline' },
  Profile: { active: 'account-circle', inactive: 'account-circle-outline' },
};

function Tabs() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outline },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name as keyof TabParamList];
          return (
            <MaterialDesignIcons
              name={(focused ? icons.active : icons.inactive) as never}
              color={color}
              size={size}
            />
          );
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Projects" component={ProjectsScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Blog" component={BlogScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: theme.colors.background },
      }}>
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ title: 'Project' }} />
      <Stack.Screen name="BlogDetail" component={BlogDetailScreen} options={{ title: 'Article' }} />
      <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact Me' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Sign In', presentation: 'modal' }} />
      <Stack.Screen name="ProjectRequest" component={ProjectRequestScreen} options={{ title: 'Hire Me — Project Request' }} />
      <Stack.Screen name="BugReport" component={BugReportScreen} options={{ title: 'Report a Bug' }} />
      <Stack.Screen name="MyRequests" component={MyRequestsScreen} options={{ title: 'My Tickets' }} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Saved Items' }} />
    </Stack.Navigator>
  );
}
