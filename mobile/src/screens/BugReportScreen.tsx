import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, HelperText, Snackbar, Text, TextInput, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { bugAdded, submissionSynced } from '../app/slices/submissionsSlice';
import { generateId, generateTicket } from '../services/tickets';
import { apiClient } from '../api/client';
import { APP_VERSION } from '../config/constants';
import type { RootScreenProps } from '../navigation/types';
import type { BugReport, RequestPriority } from '../types';

const PRIORITIES: RequestPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

const schema = yup.object({
  title: yup.string().trim().required('A short title is required').min(5, 'Title is too short'),
  description: yup
    .string()
    .trim()
    .required('Describe what happened')
    .min(20, 'Please describe the steps to reproduce (min 20 characters)'),
});

type FormValues = yup.InferType<typeof schema>;

export function BugReportScreen({ navigation }: RootScreenProps<'BugReport'>) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [priority, setPriority] = useState<RequestPriority>('Medium');
  const [ticket, setTicket] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.replace('Login', { redirectTo: 'BugReport' });
    }
  }, [isAuthenticated, navigation]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { title: '', description: '' },
  });

  const deviceInfo = `${Platform.OS} ${Platform.Version}`;

  const onSubmit = async (values: FormValues) => {
    const bug: BugReport = {
      id: generateId(),
      ticket: generateTicket('BUG'),
      title: values.title,
      description: values.description,
      priority,
      deviceInfo,
      osVersion: String(Platform.Version),
      appVersion: APP_VERSION,
      status: 'Open',
      createdAt: new Date().toISOString(),
      synced: false,
    };
    dispatch(bugAdded(bug));
    try {
      await apiClient.post('/bugs', bug);
      dispatch(submissionSynced({ kind: 'bug', id: bug.id }));
    } catch {
      // Offline or API not deployed yet — report stays queued locally.
    }
    setTicket(bug.ticket);
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text variant="bodyMedium" style={styles.intro}>
        Found a problem? Describe it below — device and app details are attached automatically.
      </Text>

      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            label="Bug Title *"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.title}
          />
        )}
      />
      <HelperText type="error" visible={!!errors.title}>
        {errors.title?.message ?? ''}
      </HelperText>

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            label="What happened? Steps to reproduce *"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
            numberOfLines={6}
            style={styles.multiline}
            error={!!errors.description}
          />
        )}
      />
      <HelperText type="error" visible={!!errors.description}>
        {errors.description?.message ?? ''}
      </HelperText>

      <Text variant="titleSmall" style={styles.groupLabel}>
        Priority
      </Text>
      <View style={styles.chipWrap}>
        {PRIORITIES.map((p) => (
          <Chip key={p} compact selected={priority === p} mode={priority === p ? 'flat' : 'outlined'} onPress={() => setPriority(p)}>
            {p}
          </Chip>
        ))}
      </View>

      <View style={styles.deviceBox}>
        <Text variant="bodySmall" style={styles.deviceLine}>
          Device: {deviceInfo}
        </Text>
        <Text variant="bodySmall" style={styles.deviceLine}>
          App version: {APP_VERSION}
        </Text>
      </View>

      <Button mode="contained" style={styles.submit} loading={isSubmitting} disabled={isSubmitting} onPress={handleSubmit(onSubmit)}>
        Submit Bug Report
      </Button>

      <Snackbar
        visible={!!ticket}
        onDismiss={() => {
          setTicket('');
          navigation.goBack();
        }}
        duration={3500}
        style={{ backgroundColor: theme.colors.primary }}>
        {`Bug reported! Ticket ${ticket}`}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 48 },
  intro: { opacity: 0.75, marginBottom: 16 },
  multiline: { minHeight: 130 },
  groupLabel: { fontWeight: '700', marginBottom: 8 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  deviceBox: { opacity: 0.6, marginBottom: 8 },
  deviceLine: { marginBottom: 2 },
  submit: { marginTop: 8, borderRadius: 10 },
});
