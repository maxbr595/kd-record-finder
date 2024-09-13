<script setup lang="ts">
import { ref } from 'vue';
import { useDiscogsStore } from '../stores/useDiscogsStore';

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import Card from 'primevue/card'
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const query = ref('');
const hasSearched = ref(false);
const discogsStore = useDiscogsStore();

const search = async () => {
  if (query.value.trim()) {
    hasSearched.value = true;
    const result = await discogsStore.searchRecords(query.value);
    if (result.success) {
      toast.add({ severity: 'success', summary: 'Success', detail: result.message, life: 3000 });
    } else {
			toast.add({ severity: 'error', summary: 'Error', detail: result.message, life: 3000 });
		}
  }
};

</script>

<template>
	<div class="p-4 flex flex-column">
		<div class="flex flex-row mb-2">
			<InputText v-model="query" placeholder="Zoek records..." class="w-full" @keyup.enter="search" />
			<Button @click="search" label="Search"></Button>
		</div>

		<ProgressSpinner v-if="discogsStore.loading" class="text-center" />

		<div v-if="discogsStore.recordData.length" class="grid">
			<div v-for="record in discogsStore.recordData" :key="record.id" class="col-12 md:col-6 lg:col-4 p-2">
				<Card class="h-full">
					<template #header>
						<img :src="record.cover_image" :alt="record.title" class="w-full border-round" />
					</template>
					<template #title>
						{{ record.title }}
					</template>
					<template #content>
					</template>
				</Card>
			</div>
		</div>
	</div>
</template>