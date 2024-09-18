<script setup lang="ts">
import { ref } from 'vue';
import { useDiscogsStore } from '../stores/useDiscogsStore';
import RecordDetails from './RecordDetails.vue';

import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import MultiSelect from 'primevue/multiselect';
import Checkbox from 'primevue/checkbox';
import { useToast } from 'primevue/usetoast';
import { APIResult } from '../types/api-result';

const toast = useToast();
const query = ref('');
const hasSearched = ref(false);
const discogsStore = useDiscogsStore();
const showDialog = ref(false);
const selectedMasterId = ref<number | null>(null);

function toggleSearchType(value: boolean) {
  discogsStore.isArtistSearch = value
  discogsStore.records = {};
  discogsStore.artists = [];
  query.value = '';
  hasSearched.value = false;
}

function search() {
  if (query.value) {
    hasSearched.value = true;
    const searchFunction = discogsStore.isArtistSearch ? discogsStore.searchArtists : discogsStore.searchRecords;
    searchFunction(query.value)
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

function clearFilters() {
  discogsStore.clearSelectedFilters();
}

function getDiscogsShoppingUrl(record: any) {
  if (record.master_id) {
    return `https://www.discogs.com/sell/list?master_id=${record.master_id}&ev=mb`;
  } else if (record.id) {
    return `https://www.discogs.com/sell/release/${record.id}&?ev=rb`;
  }
  return '';
}

function openDiscogsShoppingPage(record: any) {
  const url = getDiscogsShoppingUrl(record);
  window.open(url, '_blank');
}

function openDiscogsArtistPage(artist: any) {
  window.open(`https://www.discogs.com/artist/${artist.id}-${artist.title.replace(/\s+/g, '-')}`, '_blank');
}
</script>

<template>
  <div class="p-4 flex flex-column">
    <div class="flex flex-row mb-2 items-center">
      <Checkbox :modelValue="discogsStore.isArtistSearch" @update:modelValue="toggleSearchType" :binary="true" class="mr-2" />
      <label for="isArtistSearch">Zoek artiesten</label>
    </div>
    <div class="flex flex-row mb-2">
      <InputText v-model="query" :placeholder="discogsStore.isArtistSearch ? 'Search artists...' : 'Search records...'" class="w-full" @keyup.enter="search" />
      <Button @click="search" label="Search"></Button>
    </div>
    <div v-if="hasSearched && !discogsStore.isArtistSearch" class="flex flex-wrap mb-2 gap-2">
      <MultiSelect v-model="discogsStore.selectedYears" :options="discogsStore.years" placeholder="Filter jaar"
        class="w-full sm:w-auto" />
      <MultiSelect v-model="discogsStore.selectedGenres" :options="discogsStore.genres" placeholder="Filter genre"
        class="w-full sm:w-auto" />
      <MultiSelect v-model="discogsStore.selectedFormats" :options="discogsStore.formats" placeholder="Filter format"
        class="w-full sm:w-auto" />
      <MultiSelect v-model="discogsStore.selectedCountries" :options="discogsStore.countries" placeholder="Filter land"
        class="w-full sm:w-auto" />
      <Button @click="clearFilters" label="Clear Filters" class="p-button-secondary"></Button>
    </div>

    <ProgressSpinner v-if="discogsStore.loading" class="text-center" />

    <div v-if="!discogsStore.isArtistSearch && discogsStore.uniqueRecords.length" class="grid">
      <div v-for="record in discogsStore.uniqueRecords" :key="record.id" class="col-12 md:col-6 lg:col-4 p-2">
        <Card class="h-full flex flex-column">
          <template #header>
            <img :src="record.cover_image" :alt="record.title" class="w-full border-round cursor-pointer" @click="showRecordDetails(record.master_id || record.id)" />
          </template>
          <template #title>
            <div class="m-0 cursor-pointer" @click="showRecordDetails(record.master_id || record.id)">{{ record.title || 'N/A' }}</div>
          </template>
          <template #content>
            <p class="m-0">Jaar: {{ record.year || 'N/A' }}</p>
            <p class="m-0">Genre: {{ record.genre && record.genre.length ? record.genre.join(', ') : 'N/A' }}</p>
            <p class="m-0">Format: {{ record.format && record.format.length ? record.format.join(', ') : 'N/A' }}</p>
            <p class="m-0">Land: {{ record.country || 'N/A' }}</p>
          </template>
          <template #footer>
            <Button label="Discogs" link @click="openDiscogsShoppingPage(record)" />
          </template>
        </Card>
      </div>
    </div>

    <div v-if="discogsStore.isArtistSearch && discogsStore.artists.length" class="grid">
      <div v-for="artist in discogsStore.artists" :key="artist.id" class="col-12 md:col-6 lg:col-4 p-2">
        <Card class="h-full flex flex-column">
          <template #header>
            <img :src="artist.cover_image" :alt="artist.title" class="w-full border-round" />
          </template>
          <template #title>
            <div class="m-0">{{ artist.title || 'N/A' }}</div>
          </template>
          <template #footer>
            <Button label="Discogs" link @click="openDiscogsArtistPage(artist)" />
          </template>
        </Card>
      </div>
    </div>

    <Dialog v-model:visible="showDialog" :style="{ width: '90vw' }" :modal="true">
      <RecordDetails v-if="selectedMasterId" :masterId="selectedMasterId" />
    </Dialog>
  </div>
</template>