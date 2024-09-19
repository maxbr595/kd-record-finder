import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import App from './App.vue';


import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import MultiSelect from 'primevue/multiselect'
import Checkbox from 'primevue/checkbox'
import Toast from 'primevue/toast'
import './style.css'
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import ToastService from 'primevue/toastservice';

import Aura from '@primevue/themes/aura';

const app = createApp(App);
const pinia = createPinia();
app.component('InputText', InputText)
app.component('Button', Button)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Card', Card)
app.component('Dialog', Dialog)
app.component('MultiSelect', MultiSelect)
app.component('Checkbox', Checkbox)
app.component('Toast', Toast)
app.use(ToastService);
app.use(pinia);
app.use(PrimeVue, {
	ripple: true,
	theme: {
			preset: Aura
	}
});
app.mount('#app');