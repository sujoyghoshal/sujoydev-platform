import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, HelperText, Snackbar, Text, TextInput, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { requestAdded, submissionSynced } from '../app/slices/submissionsSlice';
import { generateId, generateTicket } from '../services/tickets';
import { apiClient } from '../api/client';
import type { RootScreenProps } from '../navigation/types';
import type { ProjectRequest, RequestPriority, RequestType } from '../types';

const PROJECT_TYPES: RequestType[] = ['Website', 'Android App', 'Backend / API', 'Full Stack', 'Bug Fixing', 'Other'];
const PRIORITIES: RequestPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

const schema = yup.object({
  name: yup.string().trim().required('Your name is required').min(2, 'Name is too short'),
  company: yup.string().trim().default(''),
  email: yup.string().trim().required('Email is required').email('Enter a valid email'),
  phone: yup
    .string()
    .trim()
    .required('Phone is required')
    .matches(/^[+]?[0-9]{10,14}$/, 'Enter a valid phone number'),
  budget: yup.string().trim().required('Budget is required'),
  timeline: yup.string().trim().required('Timeline is required'),
  description: yup.string().trim().required('Describe your project').min(30, 'Please give at least 30 characters of detail'),
});

type FormValues = yup.InferType<typeof schema>;

export function ProjectRequestScreen({ route, navigation }: RootScreenProps<'ProjectRequest'>) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const [projectType, setProjectType] = useState<RequestType>('Android App');
  const [priority, setPriority] = useState<RequestPriority>('Medium');
  const [ticket, setTicket] = useState('');
  const serviceTitle = route.params?.serviceTitle;

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.replace('Login', { redirectTo: 'ProjectRequest' });
    }
  }, [isAuthenticated, navigation]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name === 'Guest User' ? '' : user?.name ?? '',
      company: '',
      email: user?.provider === 'google' ? user.email : '',
      phone: '',
      budget: '',
      timeline: '',
      description: serviceTitle ? `Service: ${serviceTitle}\n\n` : '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    const request: ProjectRequest = {
      id: generateId(),
      ticket: generateTicket('PRQ'),
      name: values.name,
      company: values.company || undefined,
      email: values.email,
      phone: values.phone,
      budget: values.budget,
      timeline: values.timeline,
      projectType,
      priority,
      description: values.description,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      synced: false,
    };
    dispatch(requestAdded(request));
    try {
      await apiClient.post('/requests', request);
      dispatch(submissionSynced({ kind: 'request', id: request.id }));
    } catch {
      // Offline or API not deployed yet — request stays queued locally.
    }
    setTicket(request.ticket);
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text variant="bodyMedium" style={styles.intro}>
        Tell us about your project and we’ll get back with a plan, timeline and quote.
      </Text>

      {(
        [
          { key: 'name', label: 'Your Name *', keyboard: 'default' },
          { key: 'company', label: 'Company (optional)', keyboard: 'default' },
          { key: 'email', label: 'Email *', keyboard: 'email-address' },
          { key: 'phone', label: 'Phone *', keyboard: 'phone-pad' },
          { key: 'budget', label: 'Budget (e.g. ₹20,000 – ₹50,000) *', keyboard: 'default' },
          { key: 'timeline', label: 'Timeline (e.g. 4 weeks) *', keyboard: 'default' },
        ] as const
      ).map((field) => (
        <View key={field.key}>
          <Controller
            control={control}
            name={field.key}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                label={field.label}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType={field.keyboard}
                autoCapitalize={field.key === 'email' ? 'none' : 'sentences'}
                style={styles.input}
                error={!!errors[field.key]}
              />
            )}
          />
          <HelperText type="error" visible={!!errors[field.key]}>
            {errors[field.key]?.message ?? ''}
          </HelperText>
        </View>
      ))}

      <Text variant="titleSmall" style={styles.groupLabel}>
        Project Type
      </Text>
      <View style={styles.chipWrap}>
        {PROJECT_TYPES.map((t) => (
          <Chip key={t} compact selected={projectType === t} mode={projectType === t ? 'flat' : 'outlined'} onPress={() => setProjectType(t)}>
            {t}
          </Chip>
        ))}
      </View>

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

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            label="Project Description *"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
            numberOfLines={6}
            style={[styles.input, styles.multiline]}
            error={!!errors.description}
          />
        )}
      />
      <HelperText type="error" visible={!!errors.description}>
        {errors.description?.message ?? ''}
      </HelperText>

      <Button mode="contained" style={styles.submit} loading={isSubmitting} disabled={isSubmitting} onPress={handleSubmit(onSubmit)}>
        Submit Request
      </Button>
      <Text variant="bodySmall" style={styles.note}>
        You’ll receive a ticket number to track this request from your profile.
      </Text>

      <Snackbar
        visible={!!ticket}
        onDismiss={() => {
          setTicket('');
          navigation.goBack();
        }}
        duration={3500}
        style={{ backgroundColor: theme.colors.primary }}>
        {`Request submitted! Ticket ${ticket}`}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 48 },
  intro: { opacity: 0.75, marginBottom: 16 },
  input: {},
  multiline: { minHeight: 130 },
  groupLabel: { fontWeight: '700', marginBottom: 8, marginTop: 4 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  submit: { marginTop: 12, borderRadius: 10 },
  note: { opacity: 0.55, textAlign: 'center', marginTop: 12 },
});
