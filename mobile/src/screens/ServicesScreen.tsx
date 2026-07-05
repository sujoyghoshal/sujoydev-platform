import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SERVICES } from '../data/portfolio';
import { ServiceCard } from '../components/ServiceCard';
import type { RootStackParamList } from '../navigation/types';

export function ServicesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={SERVICES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text variant="headlineSmall" style={styles.heading}>
              Services
            </Text>
            <Text variant="bodyMedium" style={styles.subheading}>
              Fixed-scope packages with transparent pricing. Every project includes source code,
              documentation and post-delivery support.
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <ServiceCard
            service={item}
            onHire={() => navigation.navigate('ProjectRequest', { serviceTitle: item.title })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { paddingBottom: 24 },
  heading: { fontWeight: '800', paddingHorizontal: 16, paddingTop: 16 },
  subheading: { opacity: 0.7, paddingHorizontal: 16, paddingTop: 6, paddingBottom: 18 },
});
