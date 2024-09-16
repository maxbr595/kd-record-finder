<script setup lang="ts">
import { ref } from 'vue';
import { useDiscogsStore } from '../stores/useDiscogsStore';
import RecordDetails from './RecordDetails.vue';

import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';
import { APIResult } from '../types/api-result';

const toast = useToast();
const query = ref('');
const hasSearched = ref(false);
const discogsStore = useDiscogsStore();
const showDialog = ref(false);
const selectedMasterId = ref<number | null>(null);

function search() {
  if (query.value) {
    hasSearched.value = true;
    discogsStore.searchRecords(query.value)
      .then((result: APIResult) => {
        if (result.success) {
          toast.add({ severity: 'success', summary: 'Success', detail: result.message, life: 3000 });
        } else {
          toast.add({ severity: 'error', summary: 'Error', detail: result.message, life: 3000 });
        }
      });
  }
}

function showRecordDetails(masterId: number) {
  selectedMasterId.value = masterId;
  showDialog.value = true;
}
</script>

<template>
  <div class="p-4 flex flex-column">
    <div class="flex flex-row mb-2">
      <InputText v-model="query" placeholder="Zoek records..." class="w-full" @keyup.enter="search" />
      <Button @click="search" label="Zoek"></Button>
    </div>

    <ProgressSpinner v-if="discogsStore.loading" class="text-center" />

    <div v-if="discogsStore.uniqueRecords.length" class="grid">
      <div v-for="record in discogsStore.uniqueRecords" :key="record.id" class="col-12 md:col-6 lg:col-4 p-2">
        <Card class="h-full cursor-pointer" @click="showRecordDetails(record.master_id || record.id)">
          <template #header>
            <img :src="record.cover_image" :alt="record.title" class="w-full border-round" />
          </template>
          <template #title>
            {{ record.title || 'N/A' }}
          </template>
          <template #content>
            <p>{{ record.year || 'N/A' }}</p>
            <p>{{ record.genre && record.genre.length ? record.genre.join(', ') : 'N/A' }}</p>
          </template>
        </Card>
      </div>
    </div>

    <Dialog v-model:visible="showDialog" :style="{ width: '90vw' }" :modal="true">
      <RecordDetails v-if="selectedMasterId" :masterId="selectedMasterId" />
    </Dialog>
  </div>
</template>