<script setup lang="ts">
import { useDiscogsStore } from '../stores/useDiscogsStore'
import Timeline from 'primevue/timeline'
import Card from 'primevue/card'
import ScrollPanel from 'primevue/scrollpanel'

const props = defineProps<{ masterId: number }>()
const discogsStore = useDiscogsStore()
</script>

<template>
	<ScrollPanel class="w-full h-full">
		<div class="relative">
			<div class="absolute top-0 left-0 w-full h-2 bg-primary"></div>
			<Timeline :value="discogsStore.groupedVariants(props.masterId)" layout="horizontal"
				class="w-max pt-3">
				<template #marker="{ item }">
					<span class="text-sm font-bold">{{ item[0] }}</span>
				</template>
				<template #content="{ item }">
					<div class="flex flex-column align-items-center gap-3">
						<Card v-for="variant in item[1]" :key="variant.id" class="w-16rem">
							<template #header>
								<img :src="variant.cover_image" :alt="variant.title" class="w-full h-16rem bg-black" />
							</template>
							<template #title>
								<div class="text-sm font-bold">{{ variant.title }}</div>
							</template>
							<template #content>
								<div class="text-xs">
									<p><span class="font-bold">Jaar:</span> {{ variant.year || 'N/A' }}</p>
									<p v-if="variant.format"><span class="font-bold">Format:</span> {{ variant.format.join(", ") }}</p>
									<p v-if="variant.country"><span class="font-bold">Label:</span> {{ variant.label.join(", ") }}</p>
									<p><span class="font-bold">Land:</span> {{ variant.country || 'N/A' }}</p>
								</div>
							</template>
						</Card>
					</div>
				</template>
			</Timeline>
		</div>
	</ScrollPanel>
</template>

<style scoped>
/* styling voor binnen de components zelf, voor het alignen van de timeline naast elkaar en voor de styling van de content per release */
:deep(.p-timeline-event-opposite) {
	display: none;
}

:deep(.p-card-body) {
	padding: 0rem;
}
</style>