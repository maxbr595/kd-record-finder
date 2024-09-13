<script setup lang="ts">
import RecordFinder from './pages/RecordFinder.vue'
import Toast from 'primevue/toast';
</script>

<template>
	<div class="flex justify-content-center align-items-center min-h-screen">
		<div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
			<h1 class="text-center mb-4">Record Finder</h1>
			<Toast />
			<RecordFinder />
		</div>
	</div>
</template>

<style scoped></style>
