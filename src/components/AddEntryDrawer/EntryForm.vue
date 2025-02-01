<script setup lang="ts">
import { Form, FormField, type FormResolverOptions, type FormSubmitEvent } from '@primevue/forms';
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import Rating from 'primevue/rating';
import Textarea from 'primevue/textarea';
import type { EntryPayload, EntryFormProps } from './types';
import { computed } from 'vue';
import dayjs from 'dayjs';

// TODO add resolvers

type FormValues = {
  date?: Date
  rating?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  description?: string
}

const props = defineProps<EntryFormProps>()

type Formatter = (payload: Partial<EntryPayload>) => FormValues
type Normalizer = (payload: FormValues) => EntryPayload

const format: Formatter = (input) => {
  const result: FormValues = {}

  if (input.date) {
    result.date = new Date(input.date)
  }
  
  if (input.rating) {
    result.rating = parseInt(
      Math.max(1, Math.min(10, input.rating)).toFixed(0)
    ) as FormValues['rating']
  }
  
  if (input.description) {
    result.description = input.description
  }
  
  return result
}

const normalize: Normalizer = (input) => {
  return {...input,
  date: dayjs(input.date).toISOString(),}
}

const resolver = ({ values }: FormResolverOptions) => {
  const errors: Record<string, {message: string}[]> = {}

  if (!values.date) {
    errors.date = [{ message: 'Date is required.' }]
  }

  return { errors, values: normalize(values) }
}

const validInitialValues = computed(() => format(props.initialValues))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onSubmit = ({ values, errors, valid }: FormSubmitEvent) => {
  const normalized = normalize(values as FormValues)
  props.onSubmit(normalized)
}

</script>

<template>
  <Form :initialValues="validInitialValues" :resolver @submit="onSubmit" class="entry-form">
    
    <FormField name="date">
      <DatePicker placeholder="Date"/>
    </FormField>

    <FormField name="rating" class="rating-form-field">
      <label for="rating">Rating</label>
      <Rating :stars="10" />
    </FormField>

    <FormField name="description">
      <Textarea placeholder="Description" />
    </FormField>

    <Button type="submit" severity="secondary" label="Submit" />
  </Form>
</template>

<style scoped>
.entry-form {
  display: flex;
  flex-direction: column;
  gap: var(--p-gap-l);
}
</style>