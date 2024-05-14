import './main.css'
import 'primevue/resources/themes/aura-light-blue/theme.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import router from './router'
import BadgeDirective from 'primevue/badgedirective'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'

const app = createApp(App)

app.use(router)
app.use(PrimeVue)
app.use(ToastService)
app.use(DialogService)

app.directive('badge', BadgeDirective)

app.mount('#app')
