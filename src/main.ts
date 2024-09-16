import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import App from './App.vue';

import './style.css'
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import ToastService from 'primevue/toastservice';

import Aura from '@primevue/themes/aura';

const app = createApp(App);
const pinia = createPinia();

app.use(ToastService);
app.use(pinia);
app.use(PrimeVue, {
	ripple: true,
	theme: {
			preset: Aura
	}
});
app.mount('#app');