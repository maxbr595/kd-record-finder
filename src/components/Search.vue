<script setup lang="ts">
import { ref } from 'vue';
import { useDiscogsStore } from '../stores/useDiscogsStore';

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import Card from 'primevue/card'

const query = ref('');
const hasSearched = ref(false);
const discogsStore = useDiscogsStore();

const search = () => {
	if (query.value.trim()) {
		hasSearched.value = true;
		discogsStore.searchRecords(query.value);
	}
};
</script>

<template>
	<div class="p-4 flex flex-column">
		<div class="flex flex-row">
			<InputText v-model="query" placeholder="Zoek records..." class="w-full" @keyup.enter="search" />
			<Button @click="search" label="Search"></Button>
		</div>

		<ProgressSpinner v-if="discogsStore.loading" class="text-center" />

		<Message v-if="discogsStore.error" severity="error">{{ discogsStore.error }}</Message>

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
						<p>{{ record.artist }}</p>
					</template>
				</Card>
			</div>
		</div>

		<Message v-if="hasSearched && !discogsStore.recordData.length && !discogsStore.loading && !discogsStore.error"
			severity="info">
			Niks gevonden.
		</Message>
	</div>
</template>