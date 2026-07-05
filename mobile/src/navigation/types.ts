import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Tabs: undefined;
  ProjectDetail: { id: string };
  BlogDetail: { id: string };
  Contact: undefined;
  Login: { redirectTo?: keyof RootStackParamList } | undefined;
  ProjectRequest: { serviceTitle?: string } | undefined;
  BugReport: undefined;
  MyRequests: undefined;
  Favorites: undefined;
};

export type TabParamList = {
  Home: undefined;
  Projects: undefined;
  Services: undefined;
  Blog: undefined;
  Profile: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
